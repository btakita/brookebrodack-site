/**
 * Static export script for Cloudflare Pages deployment.
 * Expects the server to already be running.
 * Usage: bun start.ts & sleep 3 && bun static-export.ts
 */
import { static_export_ } from 'rhonojs/server/export'
import { site } from './config.js'
static_export_({
	base_url: process.env.PRERENDER_BASE || 'http://localhost:4101',
	site_url: site.website,
	routes: ['/', '/brookers', '/content', '/site', '/store'],
	extra_routes: ['/robots.txt', '/rss', '/sitemap.xml'],
}).then(({ exported, errors })=>{
	if (errors.length > 0) {
		process.exit(1)
	}
}).catch(err=>{
	console.error('Static export failed:', err)
	process.exit(1)
})
