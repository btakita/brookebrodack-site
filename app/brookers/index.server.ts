import '../index.css'
import { relement__use } from 'relementjs'
import { server__relement } from 'relementjs/server'
relement__use(server__relement)
import { brookers__doc_html_ } from '@btakita/ui--server--brookebrodack/brookers'
import { Hono } from 'hono'
import { html_response__new, middleware_ } from 'rhonojs/server'
import { site } from '../../config.js'
import { brookebrodack_request_ctx__ensure } from '../../ctx/index.js'
export default middleware_(middleware_ctx=>{
	const app = new Hono()
	app.get('/brookers', c=>
		html_response__new(
			brookers__doc_html_({
				ctx: brookebrodack_request_ctx__ensure(middleware_ctx, c, { site })
			})))
	return app
})
