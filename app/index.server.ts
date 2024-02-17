import './index.css'
import { home__doc_html_ } from '@btakita/ui--server--brookebrodack/home'
import { favicon__svg_ } from '@btakita/ui--server--brookebrodack/layout'
import { type DecoratorBase, Elysia } from 'elysia'
import { type elysia_context_T, html_route_, middleware_ } from 'relysjs/server'
export default middleware_(middleware_ctx=>
	new Elysia<'', DecoratorBase&elysia_context_T>({
		name: 'root_routes'
	})
		.get('/', html_route_(middleware_ctx, home__doc_html_))
		.get('/favicon.svg', async ()=>{
			return new Response(favicon__svg_(), {
				headers: { 'Content-Type': 'image/svg+xml' }
			})
		})
)
