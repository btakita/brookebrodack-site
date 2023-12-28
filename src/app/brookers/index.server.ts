import '../index.css'
import { brookers__page_ } from '@btakita/ui--server--brookebrodack'
import { type DecoratorBase, Elysia } from 'elysia'
import type { elysia_context_T } from 'relysjs'
import { elysia_context__set, middleware_, route_ctx_, type route_ctx_T } from 'relysjs'
export default middleware_(middleware_ctx=>{
	return new Elysia<'', DecoratorBase&elysia_context_T>({
		name: 'root_routes'
	})
		.get('/brookers', route_(brookers__page_))
	function route_(page_:($p:{ ctx:route_ctx_T })=>string) {
		return (context:elysia_context_T)=>{
			const ctx = route_ctx_(middleware_ctx)
			elysia_context__set(ctx, context)
			return new Response(
				new ReadableStream({
					start(controller) {
						controller.enqueue(page_({ ctx }))
						controller.close()
					}
				}),
				{
					headers: {
						'Content-Type': 'text/html;charset=UTF-8',
					}
				}
			)
		}
	}
})
