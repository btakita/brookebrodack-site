import { import_meta_env_ } from 'ctx-core/env'
import { Elysia } from 'elysia'
import { dirname, join, resolve } from 'path'
import { relement__use } from 'relementjs'
import { server__relement } from 'relementjs/server'
import {
	app__start as _app__start,
	app_ctx,
	compression_middleware_,
	cwd__set,
	is_prod_,
	port__set,
	static_middleware_
} from 'relysjs'
export default async ()=>{
	config__init()
	return _app__start(
		new Elysia()
			.use(await static_middleware_(
				is_prod_(app_ctx)
					? {
						headers_: ()=>({
							'Cache-Control': 'max-age=2592000, public'
						})
					}
					: {}
			))
			.use(compression_middleware_())
			.onError(({ error, request })=>{
				console.error(request.url, error)
			})
	)
}
export function config__init() {
	const port = parseInt(import_meta_env_().BROOKEBRODACK_PORT) || 4020
	port__set(app_ctx, port)
	cwd__set(app_ctx, resolve(join(dirname(new URL(import.meta.url).pathname), '../..')))
	relement__use(server__relement)
}
