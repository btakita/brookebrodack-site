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

let server: Subprocess

beforeAll(async () => {
	server = Bun.spawn(['bun', './start.ts'], {
		cwd: import.meta.dir + '/..',
		env: {
			...process.env,
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
			if (res.ok) return
		} catch {
			// Server not ready yet
		}
		await Bun.sleep(500)
	}
	throw new Error(`Server did not start within ${maxAttempts * 500}ms`)
})

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
	for (const { path, title } of html_routes) {
		describe(path, () => {
			it('returns 200', async () => {
				const res = await fetch(`${BASE_URL}${path}`)
				expect(res.status).toBe(200)
			})
			it('returns HTML content type', async () => {
				const res = await fetch(`${BASE_URL}${path}`)
				expect(res.headers.get('content-type')).toContain('text/html')
			})
			it('contains DOCTYPE and expected elements', async () => {
				const res = await fetch(`${BASE_URL}${path}`)
				const html = await res.text()
				expect(html).toContain('<!DOCTYPE html>')
				expect(html).toContain('<html')
				expect(html).toContain('<head')
				expect(html).toContain('<body')
				expect(html).toContain('</html>')
			})
			it(`contains "${title}" in the page`, async () => {
				const res = await fetch(`${BASE_URL}${path}`)
				const html = await res.text()
				expect(html).toContain(title)
			})
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
	it('returns 200', async () => {
		const res = await fetch(`${BASE_URL}/rss`)
		expect(res.status).toBe(200)
	})
	it('returns RSS XML content type', async () => {
		const res = await fetch(`${BASE_URL}/rss`)
		const ct = res.headers.get('content-type') ?? ''
		expect(ct).toContain('xml')
	})
	it('contains RSS feed elements', async () => {
		const res = await fetch(`${BASE_URL}/rss`)
		const xml = await res.text()
		expect(xml).toContain('<rss')
		expect(xml).toContain('<channel')
	})
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
		expect(xml).toContain('brookebrodack.net')
	})
})
