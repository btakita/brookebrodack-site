import '../index.css'
import { Elysia } from 'elysia'
import { middleware_ } from 'relysjs/server'
export default middleware_(middleware_ctx=>
	new Elysia({
		name: 'store_routes'
	}).get(
		'/store',
		()=>'<div class="mt-0"></div>'))
