import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import type { Subprocess } from 'bun'

const PORT = 14101 // Use a high port to avoid conflict with dev server
const BASE_URL = `http://localhost:${PORT}`

// A slug known to exist in post/content/ with a simple title
const TEST_SLUG = 'hello'
const TEST_SLUG_TITLE = 'hello!'

/**
 * Route tests for brookebrodack-site.
 *
 * Starts the production server, then verifies every route returns expected
 * status codes, content types, and key HTML/XML elements.
 *
 * Prerequisites:
 *   NODE_ENV=production bun run build
 *   bun ./db/migrate.ts
 */

function parse_dotenv(text: string): Record<string, string> {
	const env: Record<string, string> = {}
	for (const line of text.split('\n')) {
		const trimmed = line.trim()
		if (!trimmed || trimmed.startsWith('#')) continue
		const eq = trimmed.indexOf('=')
		if (eq === -1) continue
		const key = trimmed.slice(0, eq).trim()
		let val = trimmed.slice(eq + 1).trim()
		// Strip surrounding quotes
		if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
			val = val.slice(1, -1)
		}
		// Skip shell substitution expressions — require runtime evaluation
		if (val.includes('$(')) continue
		env[key] = val
	}
	return env
}

async function load_app_env(): Promise<Record<string, string>> {
	const app_dir = import.meta.dir + '/..'
	try {
		const text = await Bun.file(app_dir + '/.env').text()
		return parse_dotenv(text)
	} catch {
		return {}
	}
}

let server: Subprocess

beforeAll(async () => {
	const app_env = await load_app_env()
	server = Bun.spawn(['bun', './start.ts'], {
		cwd: import.meta.dir + '/..',
		env: {
			...process.env,
			...app_env,
			BROOKEBRODACK_PORT: String(PORT),
		},
		stdout: 'pipe',
		stderr: 'pipe',
	})
	// Wait for the server to be ready
	const maxAttempts = 30
	for (let i = 0; i < maxAttempts; i++) {
		try {
			const res = await fetch(`${BASE_URL}/robots.txt`)
			if (res.ok) break
		} catch {
			// Server not ready yet
		}
		await Bun.sleep(500)
	}
	// Warm up slow routes that require external API calls (YouTube data fetch).
	// These can take up to 15s on first load; warm them up before individual tests run.
	const warm_up_routes = ['/content', '/rss']
	await Promise.all(warm_up_routes.map(async path => {
		const deadline = Date.now() + 20_000
		while (Date.now() < deadline) {
			try {
				const res = await fetch(`${BASE_URL}${path}`)
				if (res.status !== 500) break
			} catch {
				// Server not ready yet
			}
			await Bun.sleep(500)
		}
	}))
}, 60_000)

afterAll(() => {
	if (server) {
		server.kill()
	}
})

// ---------------------------------------------------------------------------
// 1. Smoke tests — verify HTTP status codes
// ---------------------------------------------------------------------------

describe('smoke tests — status codes', () => {
	it('GET / → 200', async () => {
		const res = await fetch(`${BASE_URL}/`)
		expect(res.status).toBe(200)
	}, 15_000)

	it('GET /content → 200', async () => {
		const res = await fetch(`${BASE_URL}/content`)
		expect(res.status).toBe(200)
	}, 15_000)

	it(`GET /content/${TEST_SLUG} → 200`, async () => {
		const res = await fetch(`${BASE_URL}/content/${TEST_SLUG}`)
		expect(res.status).toBe(200)
	}, 15_000)

	it('GET /sitemap.xml → 200', async () => {
		const res = await fetch(`${BASE_URL}/sitemap.xml`)
		expect(res.status).toBe(200)
	}, 15_000)

	it('GET /robots.txt → 200', async () => {
		const res = await fetch(`${BASE_URL}/robots.txt`)
		expect(res.status).toBe(200)
	}, 15_000)

	it('GET /nonexistent → 404', async () => {
		const res = await fetch(`${BASE_URL}/nonexistent`)
		expect(res.status).toBe(404)
	}, 15_000)
})

// ---------------------------------------------------------------------------
// 2. Unit tests — post index and config
// ---------------------------------------------------------------------------

describe('unit tests', () => {
	it('post_mod_a1 is a non-empty array', async () => {
		const { post_mod_a1 } = await import('../post/index.js')
		expect(Array.isArray(post_mod_a1)).toBe(true)
		expect(post_mod_a1.length).toBeGreaterThan(0)
	})

	it('site config has expected fields', async () => {
		const { site } = await import('../config.js')
		expect(site.website).toBe('https://brookebrodack.net')
		expect(site.title).toBe('Brooke Brodack')
		expect(site.description).toBeTypeOf('string')
		expect(site.description.length).toBeGreaterThan(0)
		expect(site.author_a1).toBeInstanceOf(Array)
		expect(site.author_a1.length).toBeGreaterThan(0)
		expect(site.favicon).toBeDefined()
		expect(site.social_a1).toBeInstanceOf(Array)
	})

	it('blog_site has page and post count settings', async () => {
		const { blog_site } = await import('../config/blog_site.js')
		expect(blog_site.page__post_count).toBeTypeOf('number')
		expect(blog_site.home__post_count).toBeTypeOf('number')
		expect(blog_site.post_mod_a1).toBeInstanceOf(Array)
		expect(blog_site.post_mod_a1.length).toBeGreaterThan(0)
	})
})

// ---------------------------------------------------------------------------
// 3. Functional tests — verify response content
// ---------------------------------------------------------------------------

describe('functional tests — response content', () => {
	it('GET / contains the site title', async () => {
		const res = await fetch(`${BASE_URL}/`)
		const html = await res.text()
		expect(html).toContain('Brooke Brodack')
	}, 15_000)

	it('GET / contains valid HTML structure', async () => {
		const res = await fetch(`${BASE_URL}/`)
		const html = await res.text()
		expect(html).toContain('<!DOCTYPE html>')
		expect(html).toContain('<html')
		expect(html).toContain('<head')
		expect(html).toContain('<body')
		expect(html).toContain('</html>')
	}, 15_000)

	it('GET /robots.txt contains "User-agent"', async () => {
		const res = await fetch(`${BASE_URL}/robots.txt`)
		const text = await res.text()
		expect(text).toContain('User-agent')
	})

	it('GET /robots.txt contains Sitemap directive', async () => {
		const res = await fetch(`${BASE_URL}/robots.txt`)
		const text = await res.text()
		expect(text).toContain('Sitemap:')
		expect(text).toContain('sitemap.xml')
	})

	it('GET /sitemap.xml contains valid XML with urlset and url elements', async () => {
		const res = await fetch(`${BASE_URL}/sitemap.xml`)
		const xml = await res.text()
		expect(xml).toContain('<urlset')
		expect(xml).toContain('</urlset>')
		expect(xml).toContain('<url>')
		expect(xml).toContain('<loc>')
	})

	it('GET /sitemap.xml URLs start with https://brookebrodack.net', async () => {
		const res = await fetch(`${BASE_URL}/sitemap.xml`)
		const xml = await res.text()
		const loc_matches = xml.match(/<loc>([^<]*)<\/loc>/g) ?? []
		expect(loc_matches.length).toBeGreaterThan(0)
		for (const loc of loc_matches) {
			const url = loc.replace(/<\/?loc>/g, '')
			expect(url).toStartWith('https://brookebrodack.net')
		}
	})

	it('GET /sitemap.xml contains no "undefined" in any URL', async () => {
		const res = await fetch(`${BASE_URL}/sitemap.xml`)
		const xml = await res.text()
		expect(xml).not.toContain('undefined')
	})

	it('GET /sitemap.xml includes post URLs under /content/', async () => {
		const res = await fetch(`${BASE_URL}/sitemap.xml`)
		const xml = await res.text()
		const loc_matches = xml.match(/<loc>([^<]*)<\/loc>/g) ?? []
		const content_urls = loc_matches.filter(loc => {
			const url = loc.replace(/<\/?loc>/g, '')
			// Match /content/<slug> but not just /content
			return /\/content\/[^<]+/.test(url)
		})
		expect(content_urls.length).toBeGreaterThan(0)
	})

	it('GET /sitemap.xml contains video sitemap entries with video:video and video:thumbnail_loc', async () => {
		const res = await fetch(`${BASE_URL}/sitemap.xml`)
		const xml = await res.text()
		expect(xml).toContain('xmlns:video=')
		expect(xml).toContain('video:video')
		expect(xml).toContain('video:thumbnail_loc')
		expect(xml).toContain('video:title')
		expect(xml).toContain('video:description')
		expect(xml).toContain('video:content_loc')
		expect(xml).toContain('video:publication_date')
		expect(xml).toContain('i.ytimg.com/vi/')
	})

	it('GET /sitemap.xml includes static page URLs', async () => {
		const res = await fetch(`${BASE_URL}/sitemap.xml`)
		const xml = await res.text()
		expect(xml).toContain('https://brookebrodack.net')
		expect(xml).toContain('/brookers')
		expect(xml).toContain('/content')
		expect(xml).toContain('/site')
	})

	it(`GET /content/${TEST_SLUG} contains the post title`, async () => {
		const res = await fetch(`${BASE_URL}/content/${TEST_SLUG}`)
		const html = await res.text()
		expect(html).toContain(TEST_SLUG_TITLE)
	}, 15_000)

	it(`GET /content/${TEST_SLUG} contains valid HTML structure`, async () => {
		const res = await fetch(`${BASE_URL}/content/${TEST_SLUG}`)
		const html = await res.text()
		expect(html).toContain('<!DOCTYPE html>')
		expect(html).toContain('<html')
		expect(html).toContain('</html>')
	}, 15_000)

	it('GET /content returns HTML with content listing', async () => {
		const res = await fetch(`${BASE_URL}/content`)
		const html = await res.text()
		expect(res.headers.get('content-type')).toContain('text/html')
		expect(html).toContain('<!DOCTYPE html>')
	}, 15_000)

	it('GET /rss returns valid RSS XML', async () => {
		const res = await fetch(`${BASE_URL}/rss`)
		const xml = await res.text()
		const ct = res.headers.get('content-type') ?? ''
		expect(ct).toContain('xml')
		expect(xml).toContain('<rss')
		expect(xml).toContain('<channel')
	}, 15_000)
})
