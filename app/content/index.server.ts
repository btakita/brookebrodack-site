import '../index.css'
import { youtube_video_a1_ } from '@btakita/domain--server--brookebrodack/youtube'
import { content__doc_html_ } from '@btakita/ui--server--brookebrodack/content'
import { I } from 'ctx-core/combinators'
import { type DecoratorBase, Elysia } from 'elysia'
import {
	type elysia_context_T,
	html_response__new,
	middleware_,
	request_ctx__ensure,
	rmemo__wait
} from 'relysjs/server'
export default middleware_(middleware_ctx=>
	new Elysia<'', DecoratorBase&elysia_context_T>({
		name: 'content_routes'
	}).get(
		'/content',
		async context=>{
			const request_ctx = request_ctx__ensure(middleware_ctx, context)
			await rmemo__wait(
				()=>youtube_video_a1_(request_ctx),
				I,
				20_000)
			return html_response__new(
				content__doc_html_({
					ctx: request_ctx
				})
			)
		}))
