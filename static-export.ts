/**
 * Static export script for Cloudflare Pages deployment.
 * Expects the server to already be running.
 * Usage: bun start.ts & sleep 3 && bun static-export.ts
 */
import { readdir } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { static_export_ } from 'rhonojs/server/export'
import { site } from './config.js'
const content_dir = join(import.meta.dir, 'post/content')
const post_files = await readdir(content_dir)
const post_slugs = post_files
	.filter(f=>f.endsWith('.md') && /^\d/.test(f))
	.map(f=>basename(f, '.md').replace(/^\d{4}-\d{2}-\d{2}-/, ''))
const post_routes = post_slugs.map(slug=>`/content/${slug}`)
static_export_({
	base_url: process.env.PRERENDER_BASE || 'http://localhost:4101',
	site_url: site.website,
	routes: ['/', '/brookers', '/content', '/site', '/store', ...post_routes],
	extra_routes: ['/robots.txt', '/rss', '/sitemap.xml'],
}).then(({ exported, errors })=>{
	if (errors.length > 0) {
		process.exit(1)
	}
}).catch(err=>{
	console.error('Static export failed:', err)
	process.exit(1)
})
