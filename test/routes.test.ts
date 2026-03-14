import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import type { Subprocess } from 'bun'

const PORT = 4101
const BASE_URL = `http://localhost:${PORT}`

/**
 * Route tests for brookebrodack-site.
 *
 * Starts the production server, then verifies every route returns 200
 * with the expected content type and key HTML/XML elements.
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
			NODE_ENV: 'production',
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
	await Promise.all(warm_up_routes.map(async path=>{
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

describe('HTML page routes', () => {
	const html_routes = [
		{ path: '/', title: 'Brooke Brodack' },
		{ path: '/brookers', title: 'Brookers' },
		{ path: '/content', title: 'Content' },
		{ path: '/site', title: 'Site' },
		{ path: '/store', title: 'Store' },
	]
	// Routes that depend on external API calls may take longer on first load.
	// Allow up to 15s for these routes.
	const slow_routes = new Set(['/content'])
	const timeout = (path: string) => slow_routes.has(path) ? 15_000 : 5_000
	for (const { path, title } of html_routes) {
		describe(path, () => {
			it('returns 200', async () => {
				const res = await fetch(`${BASE_URL}${path}`)
				expect(res.status).toBe(200)
			}, timeout(path))
			it('returns HTML content type', async () => {
				const res = await fetch(`${BASE_URL}${path}`)
				expect(res.headers.get('content-type')).toContain('text/html')
			}, timeout(path))
			it('contains DOCTYPE and expected elements', async () => {
				const res = await fetch(`${BASE_URL}${path}`)
				const html = await res.text()
				expect(html).toContain('<!DOCTYPE html>')
				expect(html).toContain('<html')
				expect(html).toContain('<head')
				expect(html).toContain('<body')
				expect(html).toContain('</html>')
			}, timeout(path))
			it(`contains "${title}" in the page`, async () => {
				const res = await fetch(`${BASE_URL}${path}`)
				const html = await res.text()
				expect(html).toContain(title)
			}, timeout(path))
		})
	}
})

describe('/robots.txt', () => {
	it('returns 200', async () => {
		const res = await fetch(`${BASE_URL}/robots.txt`)
		expect(res.status).toBe(200)
	})
	it('returns plain text', async () => {
		const res = await fetch(`${BASE_URL}/robots.txt`)
		expect(res.headers.get('content-type')).toContain('text/plain')
	})
	it('contains User-agent and Sitemap directives', async () => {
		const res = await fetch(`${BASE_URL}/robots.txt`)
		const text = await res.text()
		expect(text).toContain('User-agent: *')
		expect(text).toContain('Allow: /')
		expect(text).toContain('Sitemap:')
		expect(text).toContain('sitemap.xml')
	})
})

describe('/rss', () => {
	// RSS route fetches YouTube data on first load; allow up to 15s.
	it('returns 200', async () => {
		const res = await fetch(`${BASE_URL}/rss`)
		expect(res.status).toBe(200)
	}, 15_000)
	it('returns RSS XML content type', async () => {
		const res = await fetch(`${BASE_URL}/rss`)
		const ct = res.headers.get('content-type') ?? ''
		expect(ct).toContain('xml')
	}, 15_000)
	it('contains RSS feed elements', async () => {
		const res = await fetch(`${BASE_URL}/rss`)
		const xml = await res.text()
		expect(xml).toContain('<rss')
		expect(xml).toContain('<channel')
	}, 15_000)
})

describe('/sitemap.xml', () => {
	it('returns 200', async () => {
		const res = await fetch(`${BASE_URL}/sitemap.xml`)
		expect(res.status).toBe(200)
	})
	it('returns XML content type', async () => {
		const res = await fetch(`${BASE_URL}/sitemap.xml`)
		const ct = res.headers.get('content-type') ?? ''
		expect(ct).toContain('xml')
	})
	it('contains sitemap XML elements', async () => {
		const res = await fetch(`${BASE_URL}/sitemap.xml`)
		const xml = await res.text()
		expect(xml).toContain('<urlset')
		expect(xml).toContain('<url>')
		expect(xml).toContain('<loc>')
	})
	it('includes all main routes', async () => {
		const res = await fetch(`${BASE_URL}/sitemap.xml`)
		const xml = await res.text()
		expect(xml).toContain('/brookers')
		expect(xml).toContain('/content')
		expect(xml).toContain('/site')
	})
})
