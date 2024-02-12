import '../index.css'
import { content__doc_html_ } from '@btakita/ui--server--brookebrodack/content'
import { type DecoratorBase, Elysia } from 'elysia'
import { type elysia_context_T, html_route_, middleware_ } from 'relysjs/server'
export default middleware_(middleware_ctx=>
	new Elysia<'', DecoratorBase&elysia_context_T>({
		name: 'content_routes'
	}).get(
		'/content',
		html_route_(middleware_ctx, content__doc_html_)))
