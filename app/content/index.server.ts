import '../index.css'
import { relement__use } from 'relementjs'
import { server__relement } from 'relementjs/server'
relement__use(server__relement)
import { youtube_video_a1_ } from '@btakita/domain--server--brookebrodack/youtube'
import { content__doc_html_ } from '@btakita/ui--server--brookebrodack/content'
import { post__doc_html_ } from '@btakita/ui--server--brookebrodack/post'
import { post_mod_a1__set } from '@rappstack/domain--any--blog/post'
import { blog_post_mod_, blog_post_slug_or_page_num__set } from '@rappstack/domain--server--blog/post'
import { blog_site__set } from '@rappstack/domain--server--blog/site'
import { blog_post__estimate_read_minutes__wait } from '@rappstack/ui--server--blog/post'
import { I } from 'ctx-core/combinators'
import { Hono } from 'hono'
import { html_response__new, middleware_, rmemo__wait } from 'rhonojs/server'
import { blog_site } from '../../config/blog_site.js'
import { site } from '../../config.js'
import { brookebrodack_request_ctx__ensure } from '../../ctx/index.js'
export default middleware_(middleware_ctx=>{
	const app = new Hono()
	app.get('/content', async c=>{
		const request_ctx = brookebrodack_request_ctx__ensure(middleware_ctx, c, { site })
		blog_site__set(request_ctx, blog_site)
		post_mod_a1__set(request_ctx, blog_site.post_mod_a1)
		try {
			await rmemo__wait(
				()=>youtube_video_a1_(request_ctx),
				I,
				10_000)
		} catch {
			// YouTube API may be unavailable — render with whatever data we have
		}
		return html_response__new(
			content__doc_html_({
				ctx: request_ctx
			})
		)
	})
	app.get('/content/:slug', async c=>{
		const slug = c.req.param('slug')
		const ctx = brookebrodack_request_ctx__ensure(middleware_ctx, c, { site })
		blog_site__set(ctx, blog_site)
		post_mod_a1__set(ctx, blog_site.post_mod_a1)
		blog_post_slug_or_page_num__set(ctx, slug)
		if (!blog_post_mod_(ctx)) {
			return c.notFound()
		}
		try {
			await blog_post__estimate_read_minutes__wait(ctx)
		} catch {
			// Read time estimation may fail — render without it
		}
		return html_response__new(
			post__doc_html_({ ctx })
		)
	})
	return app
})
