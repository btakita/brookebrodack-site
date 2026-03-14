/**
 * Static export script for Cloudflare Pages deployment.
 * Usage: NODE_ENV=production bun static-export.ts
 */
import { resolve } from 'node:path'
import { static_export_ } from 'relysjs/server/export'
import { site } from './config.js'
static_export_({
	server_import: resolve('dist/server/index.js'),
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
