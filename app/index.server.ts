import './index.css'
import { relement__use } from 'relementjs'
import { server__relement } from 'relementjs/server'
relement__use(server__relement)
import { youtube_video_a1_ } from '@btakita/domain--server--brookebrodack/youtube'
import { content__rss_xml_ } from '@btakita/ui--server--brookebrodack/content'
import { home__doc_html_ } from '@btakita/ui--server--brookebrodack/home'
import { sitemap__xml_ } from '@btakita/ui--server--brookebrodack/sitemap'
import { post_mod_a1__set } from '@rappstack/domain--any--blog/post'
import { blog_site__set } from '@rappstack/domain--server--blog/site'
import { I } from 'ctx-core/combinators'
import { Hono } from 'hono'
import { html_response__new, middleware_, rmemo__wait } from 'rhonojs/server'
import { blog_site } from '../config/blog_site.js'
import { site } from '../config.js'
import { brookebrodack_request_ctx__ensure } from '../ctx/index.js'
const robots_txt = `
User-agent: *
Allow: /
Sitemap: ${new URL('sitemap.xml', site.website).href}
`.trim()
export default middleware_(middleware_ctx=>{
	const app = new Hono()
	app.get('/', c=>
		html_response__new(
			home__doc_html_({
				ctx: brookebrodack_request_ctx__ensure(middleware_ctx, c, { site })
			})))
	app.get('/robots.txt', ()=>
		new Response(robots_txt, {
			headers: { 'Content-Type': 'text/plain' },
		}))
	app.get('/rss', async c=>{
		const ctx = brookebrodack_request_ctx__ensure(middleware_ctx, c, { site })
		await rmemo__wait(
			()=>youtube_video_a1_(ctx),
			I,
			10_000)
		return new Response(
			content__rss_xml_({
				ctx
			}), {
				headers: {
					'Content-Type': 'application/rss+xml '
				}
			}
		)
	})
	app.get('/sitemap.xml', async c=>{
		const ctx = brookebrodack_request_ctx__ensure(
			middleware_ctx,
			c,
			{ site })
		blog_site__set(ctx, blog_site)
		post_mod_a1__set(ctx, blog_site.post_mod_a1)
		return new Response(sitemap__xml_({
			ctx
		}), {
			status: 200,
			headers: {
				'Content-Type': 'application/xml'
			}
		})
	})
	return app
})
