import './index.css'
import { home__page_ } from '@btakita/ui--server--brookebrodack/home'
import { type DecoratorBase, Elysia } from 'elysia'
import { type elysia_context_T, html_route_, middleware_ } from 'relysjs/server'
export default middleware_(middleware_ctx=>
	new Elysia<'', DecoratorBase&elysia_context_T>({ name: 'root_routes' })
		.get('/', html_route_(middleware_ctx, home__page_)))
