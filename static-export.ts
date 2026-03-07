/**
 * Static export script for Cloudflare Pages deployment.
 *
 * After the relysjs build completes, this script:
 * 1. Starts the Elysia server
 * 2. Fetches each route and writes HTML files to dist/browser/
 * 3. Rewrites localhost URLs to the production domain
 * 4. Also exports robots.txt, rss, and sitemap.xml
 * 5. Shuts down the server
 *
 * Usage: NODE_ENV=production bun static-export.ts
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { app__start, app_ctx, port_ } from 'relysjs/server'
import { site } from './config.js'
const dist_browser = join(import.meta.dir, 'dist', 'browser')
const production_origin = site.website.replace(/\/$/, '')
// HTML routes — will be written as <route>/index.html for clean URLs
const html_routes = [
	'/',
	'/brookers',
	'/content',
	'/site',
	'/store',
]
// Non-HTML routes — written as-is
const raw_routes = [
	'/robots.txt',
	'/rss',
	'/sitemap.xml',
]
async function static_export() {
	// Import the production server module
	const mod = await import('./dist/server/index.js')
	const app = await mod.default()
	await app__start(app)
	const port = port_(app_ctx)
	const base_url = `http://localhost:${port}`
	console.info(`Static export: server running on ${base_url}`)
	console.info(`Production origin: ${production_origin}`)
	let errors = 0
	try {
		// Export HTML routes
		for (const route of html_routes) {
			const url = base_url + route
			console.info(`Fetching ${url}`)
			const response = await fetch(url)
			if (!response.ok) {
				console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
				errors++
				continue
			}
			// Replace localhost origin with production origin in HTML output
			const html = (await response.text())
				.replaceAll(base_url, production_origin)
			const out_dir = route === '/'
				? dist_browser
				: join(dist_browser, route)
			await mkdir(out_dir, { recursive: true })
			const out_file = join(out_dir, 'index.html')
			await writeFile(out_file, html)
			console.info(`Wrote ${out_file} (${html.length} bytes)`)
		}
		// Export raw routes (robots.txt, rss, sitemap.xml)
		for (const route of raw_routes) {
			const url = base_url + route
			console.info(`Fetching ${url}`)
			const response = await fetch(url)
			if (!response.ok) {
				console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
				errors++
				continue
			}
			const body = (await response.text())
				.replaceAll(base_url, production_origin)
			const out_file = join(dist_browser, route)
			await mkdir(dirname(out_file), { recursive: true })
			await writeFile(out_file, body)
			console.info(`Wrote ${out_file} (${body.length} bytes)`)
		}
		if (errors > 0) {
			console.warn(`Static export completed with ${errors} error(s).`)
		} else {
			console.info('Static export complete.')
		}
	} finally {
		app.stop()
	}
	process.exit(errors > 0 ? 1 : 0)
}
static_export().catch(err=>{
	console.error('Static export failed:', err)
	process.exit(1)
})
