#!/usr/bin/env bun
/**
 * generate-posts.ts
 *
 * Detects new YouTube videos in the database that don't have corresponding
 * blog posts, then for each new video:
 *   1. Downloads audio via yt-dlp
 *   2. Transcribes via whisper CLI
 *   3. Generates an AI summary via Claude API
 *   4. Creates the .md post file and transcript .txt file
 *   5. Regenerates post/index.ts with the new imports
 *
 * Exit codes:
 *   0 — no new videos found
 *   N — number of new posts generated (1+)
 *   255 — fatal error
 */
import Anthropic from '@anthropic-ai/sdk'
import Database from 'bun:sqlite'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { $ } from 'bun'
// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const SITE_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..')
const POST_CONTENT_DIR = join(SITE_ROOT, 'post', 'content')
const POST_INDEX_PATH = join(SITE_ROOT, 'post', 'index.ts')
const TRANSCRIPTS_DIR = join(SITE_ROOT, 'public', 'transcripts')
const DB_PATH = join(SITE_ROOT, 'db', 'app.db')
// ---------------------------------------------------------------------------
// Slug algorithm — must match content__doc_html.ts
// ---------------------------------------------------------------------------
function title_to_slug(title: string): string {
	return title
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_]+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 80)
}
// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface YouTubeVideo {
	videoId: string
	title: string
	description: string | null
	publishedAt: number // timestamp_ms from SQLite
	channelId: string
	channelTitle: string
}
// ---------------------------------------------------------------------------
// Existing posts — collect slugs from filenames
// ---------------------------------------------------------------------------
function existing_post_slugs(): Set<string> {
	const slugs = new Set<string>()
	if (!existsSync(POST_CONTENT_DIR)) return slugs
	for (const f of readdirSync(POST_CONTENT_DIR)) {
		if (!f.endsWith('.md')) continue
		// filename: YYYY-MM-DD-slug.md → strip date prefix and .md suffix
		const without_ext = f.slice(0, -3) // remove .md
		const slug_part = without_ext.replace(/^\d{4}-\d{2}-\d{2}-/, '')
		slugs.add(slug_part)
	}
	return slugs
}
// Also collect videoIds from existing posts (via video_url frontmatter)
function existing_video_ids(): Set<string> {
	const ids = new Set<string>()
	if (!existsSync(POST_CONTENT_DIR)) return ids
	for (const f of readdirSync(POST_CONTENT_DIR)) {
		if (!f.endsWith('.md')) continue
		const content = readFileSync(join(POST_CONTENT_DIR, f), 'utf-8')
		const match = content.match(/video_url:\s*https:\/\/www\.youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/)
		if (match) ids.add(match[1])
	}
	return ids
}
// ---------------------------------------------------------------------------
// Database access
// ---------------------------------------------------------------------------
function fetch_all_videos(): YouTubeVideo[] {
	if (!existsSync(DB_PATH)) {
		console.error(`Database not found at ${DB_PATH}`)
		process.exit(255)
	}
	const db = new Database(DB_PATH, { readonly: true })
	const rows = db
		.query('SELECT videoId, title, description, publishedAt, channelId, channelTitle FROM youtube_video ORDER BY publishedAt DESC')
		.all() as YouTubeVideo[]
	db.close()
	return rows
}
// ---------------------------------------------------------------------------
// Audio download
// ---------------------------------------------------------------------------
async function download_audio(videoId: string, out_dir: string): Promise<string> {
	const out_path = join(out_dir, `${videoId}.wav`)
	const url = `https://www.youtube.com/watch?v=${videoId}`
	console.log(`  Downloading audio for ${videoId}...`)
	const result = await $`yt-dlp -x --audio-format wav -o ${out_path} ${url}`.quiet().nothrow()
	if (result.exitCode !== 0) {
		throw new Error(`yt-dlp failed for ${videoId}: ${result.stderr.toString()}`)
	}
	// yt-dlp may produce the file with a different extension then convert
	// Check for the actual output file
	if (existsSync(out_path)) return out_path
	// Sometimes yt-dlp appends .wav to an already-extensioned path
	const alt = out_path + '.wav'
	if (existsSync(alt)) return alt
	throw new Error(`Audio file not found after download: ${out_path}`)
}
// ---------------------------------------------------------------------------
// Transcription
// ---------------------------------------------------------------------------
async function transcribe(audio_path: string, videoId: string, out_dir: string): Promise<string> {
	console.log(`  Transcribing ${videoId}...`)
	const result = await $`whisper ${audio_path} --model base --language en --output_format txt --output_dir ${out_dir}`.quiet().nothrow()
	if (result.exitCode !== 0) {
		throw new Error(`whisper failed for ${videoId}: ${result.stderr.toString()}`)
	}
	// whisper outputs <basename_without_ext>.txt in out_dir
	const base = basename(audio_path).replace(/\.[^.]+$/, '')
	const txt_path = join(out_dir, `${base}.txt`)
	if (!existsSync(txt_path)) {
		throw new Error(`Transcript not found: ${txt_path}`)
	}
	return readFileSync(txt_path, 'utf-8')
}
// ---------------------------------------------------------------------------
// AI Summary
// ---------------------------------------------------------------------------
async function generate_summary(
	title: string,
	description: string | null,
	transcript: string,
): Promise<{ summary: string; key_topics: string[]; notable_moments: string[] }> {
	const api_key = process.env.ANTHROPIC_API_KEY
	if (!api_key) {
		throw new Error('ANTHROPIC_API_KEY not set')
	}
	const client = new Anthropic({ apiKey: api_key })
	const prompt = `You are writing a blog post summary for a YouTube video by Brooke Brodack on her website brookebrodack.net.

Video title: "${title}"
Video description: "${description || '(none)'}"

Transcript:
${transcript.slice(0, 12000)}

Write the following sections. Match the warm, engaging style of existing posts on the site — refer to Brooke by name, describe the content with genuine interest, and connect themes to her broader journey.

1. **Summary** (2-3 paragraphs): An engaging summary of what happens in the video. Write in third person about Brooke. Use double dashes (--) instead of em dashes.

2. **Key Topics** (3-5 bullet points): Short phrases describing the main topics covered.

3. **Notable Moments** (3-6 entries): Each is a timestamp and a brief description or direct quote. Format each as: **[M:SS]** "quote or description". Use actual timestamps from the transcript if available, otherwise estimate based on position in the transcript.

Return ONLY valid JSON with this exact structure:
{
  "summary": "paragraph1\\n\\nparagraph2",
  "key_topics": ["topic1", "topic2"],
  "notable_moments": ["**[0:00]** \\"Opening quote or description\\"", "**[1:30]** Description of moment"]
}`

	const response = await client.messages.create({
		model: 'claude-sonnet-4-20250514',
		max_tokens: 2000,
		messages: [{ role: 'user', content: prompt }],
	})
	const text = response.content[0].type === 'text' ? response.content[0].text : ''
	// Extract JSON from response (may be wrapped in markdown code block)
	const json_match = text.match(/\{[\s\S]*\}/)
	if (!json_match) {
		throw new Error('Failed to extract JSON from Claude response')
	}
	return JSON.parse(json_match[0])
}
// ---------------------------------------------------------------------------
// Post file creation
// ---------------------------------------------------------------------------
function create_post_file(
	video: YouTubeVideo,
	slug: string,
	summary: { summary: string; key_topics: string[]; notable_moments: string[] },
): string {
	const date = new Date(video.publishedAt)
	const date_str = date.toISOString().split('T')[0]
	const filename = `${date_str}-${slug}.md`
	const filepath = join(POST_CONTENT_DIR, filename)
	const video_url = `https://www.youtube.com/watch?v=${video.videoId}`
	const embed_url = `https://www.youtube.com/embed/${video.videoId}`
	// Derive tags from content
	const tags = derive_tags(video, summary.key_topics)
	const md = `---
title: "${video.title.replace(/"/g, '\\"')}"
description: "${summary.summary.split('\n')[0].slice(0, 200).replace(/"/g, '\\"')}"
date: ${date_str}
tags:
${tags.map(t => `  - ${t}`).join('\n')}
video_url: ${video_url}
---

# ${video.title}

<iframe width="560" height="315" src="${embed_url}" title="${video.title.replace(/"/g, '&quot;')}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

${summary.summary}

## Key Topics

${summary.key_topics.map(t => `- ${t}`).join('\n')}

## Notable Moments

${summary.notable_moments.map(m => `- ${m}`).join('\n')}

[Download full transcript](/transcripts/${video.videoId}.txt)
`
	writeFileSync(filepath, md)
	return filename
}
function derive_tags(
	video: YouTubeVideo,
	key_topics: string[],
): string[] {
	const tags = ['brooke-brodack', 'youtube']
	const combined = (video.title + ' ' + (video.description || '') + ' ' + key_topics.join(' ')).toLowerCase()
	const tag_keywords: Record<string, string[]> = {
		'meditation': ['meditation', 'meditate', 'vipassana', 'mindfulness'],
		'nature': ['nature', 'shinrin', 'forest', 'mountain', 'river', 'hiking'],
		'health': ['health', 'healing', 'fasting', 'dental', 'diet', 'wellness'],
		'fasting': ['fast', 'fasting', 'dry fast'],
		'travel': ['travel', 'india', 'trek', 'hike', 'backpack'],
		'music': ['singing', 'song', 'music', 'improv', 'vocal'],
		'comedy': ['funny', 'comedy', 'prank', 'lol', 'humor'],
		'self-improvement': ['self-improvement', 'confidence', 'authentic', 'courage', 'mindset'],
		'spirituality': ['spiritual', 'meditation', 'soul', 'dharma', 'dhamma', 'vedic', 'yoga'],
		'fashion': ['fashion', 'outfit', 'style', 'athleisure'],
		'food': ['cooking', 'recipe', 'baking', 'food', 'breakfast'],
		'animals': ['dog', 'goat', 'animal', 'butterfly', 'hamster', 'horse'],
		'family': ['family', 'birth', 'partum', 'baby', 'birthday'],
	}
	for (const [tag, keywords] of Object.entries(tag_keywords)) {
		if (keywords.some(kw => combined.includes(kw)) && !tags.includes(tag)) {
			tags.push(tag)
		}
	}
	// Cap at 6 tags total
	return tags.slice(0, 6)
}
// ---------------------------------------------------------------------------
// Regenerate post/index.ts
// ---------------------------------------------------------------------------
function regenerate_post_index(): void {
	if (!existsSync(POST_CONTENT_DIR)) return
	const files = readdirSync(POST_CONTENT_DIR)
		.filter(f => f.endsWith('.md'))
		.sort()
	const imports = files
		.map(f => `\timport('./content/${f}'),`)
		.join('\n')
	const content = `import { type post_mod_T } from '@rappstack/domain--any--blog/post'
export const post_mod_a1:post_mod_T[] = await Promise.all([
${imports}
])
`
	writeFileSync(POST_INDEX_PATH, content)
}
// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
	console.log('generate-posts: starting...')
	// Ensure directories exist
	mkdirSync(POST_CONTENT_DIR, { recursive: true })
	mkdirSync(TRANSCRIPTS_DIR, { recursive: true })
	const tmp_dir = join(SITE_ROOT, '..', '..', 'tmp', 'generate-posts')
	mkdirSync(tmp_dir, { recursive: true })
	// Fetch all videos from DB
	const all_videos = fetch_all_videos()
	console.log(`  Found ${all_videos.length} videos in database`)
	// Determine which are new
	const known_slugs = existing_post_slugs()
	const known_video_ids = existing_video_ids()
	const new_videos = all_videos.filter(v => {
		const slug = title_to_slug(v.title)
		return !known_slugs.has(slug) && !known_video_ids.has(v.videoId)
	})
	if (new_videos.length === 0) {
		console.log('  No new videos found. Exiting.')
		process.exit(0)
	}
	console.log(`  Found ${new_videos.length} new video(s) to process`)
	let generated = 0
	for (const video of new_videos) {
		const slug = title_to_slug(video.title)
		console.log(`\nProcessing: "${video.title}" (${video.videoId})`)
		try {
			// Step 1: Download audio
			const audio_path = await download_audio(video.videoId, tmp_dir)
			// Step 2: Transcribe
			const transcript = await transcribe(audio_path, video.videoId, tmp_dir)
			// Step 3: Save transcript to public/transcripts/
			const transcript_path = join(TRANSCRIPTS_DIR, `${video.videoId}.txt`)
			writeFileSync(transcript_path, transcript)
			console.log(`  Transcript saved: ${transcript_path}`)
			// Step 4: Generate AI summary
			const summary = await generate_summary(video.title, video.description, transcript)
			// Step 5: Create .md post file
			const filename = create_post_file(video, slug, summary)
			console.log(`  Post created: ${filename}`)
			generated++
		} catch (err) {
			console.error(`  FAILED to process ${video.videoId}: ${err}`)
			// Continue with other videos
		}
	}
	if (generated > 0) {
		// Step 6: Regenerate post/index.ts
		regenerate_post_index()
		console.log(`\nRegenerated post/index.ts with ${generated} new post(s)`)
	}
	console.log(`\nDone. Generated ${generated} new post(s).`)
	process.exit(generated)
}
main().catch(err => {
	console.error('Fatal error:', err)
	process.exit(255)
})
