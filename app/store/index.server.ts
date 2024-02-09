import '../index.css'
import { type DecoratorBase, Elysia } from 'elysia'
import { type elysia_context_T, middleware_ } from 'relysjs/server'
export default middleware_(middleware_ctx=>
	new Elysia<'', DecoratorBase&elysia_context_T>({
		name: 'store_routes'
	}).get(
		'/store',
		()=>'<div class="mt-0"></div>'))
