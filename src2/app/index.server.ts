import { type DecoratorBase, Elysia } from 'elysia'
import { middleware_ } from 'relysjs'
import type { elysia_context_T } from 'relysjs'
export default middleware_(middleware_ctx=>{
	return new Elysia<'', DecoratorBase&elysia_context_T>({
		name: 'root_routes'
	})
})
