import './index.css'
import { youtube_video_a1_ } from '@btakita/domain--server--brookebrodack/youtube'
import { content__rss_xml_ } from '@btakita/ui--server--brookebrodack/content'
import { home__doc_html_ } from '@btakita/ui--server--brookebrodack/home'
import { sitemap__xml_ } from '@btakita/ui--server--brookebrodack/sitemap'
import { I } from 'ctx-core/combinators'
import { type DecoratorBase, Elysia } from 'elysia'
import { type elysia_context_T, html_response__new, middleware_, rmemo__wait } from 'relysjs/server'
import { site } from '../config.js'
import { brookebrodack_request_ctx__ensure } from '../ctx/index.js'
const robots_txt = `
User-agent: *
Allow: /
Sitemap: ${new URL('sitemap.xml', site.website).href}
`.trim()
export default middleware_(middleware_ctx=>
	new Elysia<'', DecoratorBase&elysia_context_T>({
		name: 'root_routes'
	})
		.get('/', context=>
			html_response__new(
				home__doc_html_({
					ctx: brookebrodack_request_ctx__ensure(middleware_ctx, context, { site })
				})))
		.get('/robots.txt', ()=>
			new Response(robots_txt, {
				headers: { 'Content-Type': 'text/plain' },
			}))
		.get('/rss', async context=>{
			const ctx = brookebrodack_request_ctx__ensure(middleware_ctx, context, { site })
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
		.get('/sitemap.xml', async context=>
			new Response(sitemap__xml_({
				ctx: brookebrodack_request_ctx__ensure(
					middleware_ctx,
					context,
					{ site })
			}), {
				status: 200,
				headers: {
					'Content-Type': 'application/xml'
				}
			})))
