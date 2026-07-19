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
		// Hono requires an error handler to return a Response. Returning
		// nothing leaves the framework without one for the request.
		return 'getResponse' in error
			? error.getResponse()
			: c.text('Internal Server Error', 500)
	})
	return app
}
