import '../index.css'
import { brookers__page_ } from '@btakita/ui--server--brookebrodack'
import { type DecoratorBase, Elysia } from 'elysia'
import { type elysia_context_T, html_route_, middleware_ } from 'relysjs'
export default middleware_(middleware_ctx=>{
	return new Elysia<'', DecoratorBase&elysia_context_T>({
		name: 'root_routes'
	})
		.get('/brookers', html_route_(middleware_ctx, brookers__page_))
})
