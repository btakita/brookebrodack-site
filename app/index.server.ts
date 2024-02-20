import './index.css'
import { home__doc_html_ } from '@btakita/ui--server--brookebrodack/home'
import { site_request_ctx__ensure } from '@rappstack/domain--server/ctx'
import { type DecoratorBase, Elysia } from 'elysia'
import { type elysia_context_T, html_response__new, middleware_ } from 'relysjs/server'
import { site, social_a1 } from './config.js'
export default middleware_(middleware_ctx=>
	new Elysia<'', DecoratorBase&elysia_context_T>({
		name: 'root_routes'
	})
		.get('/', context=>
			html_response__new(
				home__doc_html_({
					ctx: site_request_ctx__ensure(middleware_ctx, context, { site, social_a1
					})
				}))))
