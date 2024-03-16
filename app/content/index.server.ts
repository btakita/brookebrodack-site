import '../index.css'
import { youtube_video_a1_ } from '@btakita/domain--server--brookebrodack/youtube'
import { content__doc_html_ } from '@btakita/ui--server--brookebrodack/content'
import { I } from 'ctx-core/combinators'
import { type DecoratorBase, Elysia } from 'elysia'
import { type elysia_context_T, html_response__new, middleware_, rmemo__wait } from 'relysjs/server'
import { site } from '../../config.js'
import { brookebrodack_request_ctx__ensure } from '../../ctx/index.js'
export default middleware_(middleware_ctx=>
	new Elysia<'', DecoratorBase&elysia_context_T>({
		name: 'content_routes'
	}).get(
		'/content',
		async context=>{
			const request_ctx = brookebrodack_request_ctx__ensure(middleware_ctx, context, { site })
			await rmemo__wait(
				()=>youtube_video_a1_(request_ctx),
				I,
				10_000)
			return html_response__new(
				content__doc_html_({
					ctx: request_ctx
				})
			)
		}))
