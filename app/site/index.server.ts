import '../index.css'
import { site__doc_html_ } from '@btakita/ui--server--brookebrodack/site'
import { type DecoratorBase, Elysia } from 'elysia'
import { type elysia_context_T, html_route_, middleware_ } from 'relysjs/server'
export default middleware_(middleware_ctx=>
	new Elysia<'', DecoratorBase&elysia_context_T>({
		name: 'site_routes'
	})
		.get('/site', html_route_(middleware_ctx, site__doc_html_)))
