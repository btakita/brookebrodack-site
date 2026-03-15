import { Hono } from 'hono'
import { app_ctx, compression_middleware_, is_prod_, static_middleware_ } from 'rhonojs/server'
import { config__init } from '../config.js'
export default async ()=>{
	config__init()
	const app = new Hono()
	app.use(compression_middleware_())
	app.route('/', await static_middleware_(
		is_prod_(app_ctx)
			? {
				headers_: ()=>({
					'Cache-Control': 'max-age=31536000, public'
				})
			}
			: {}))
	app.onError((error, c)=>{
		console.error(
			c.req.url,
			error.message + '\n',
			error.stack + '\n',
			...(error.cause
				? [
					'Cause:\n',
					(error.cause as Error).message + '\n',
					(error.cause as Error).stack
				]
				: []))
	})
	return app
}
