import '../index.css'
import { relement__use } from 'relementjs'
import { server__relement } from 'relementjs/server'
relement__use(server__relement)
import { site__doc_html_ } from '@btakita/ui--server--brookebrodack/site'
import { Elysia } from 'elysia'
import { html_response__new, middleware_ } from 'relysjs/server'
import { site } from '../../config.js'
import { brookebrodack_request_ctx__ensure } from '../../ctx/index.js'
export default middleware_(middleware_ctx=>
	new Elysia({
		name: 'site_routes'
	})
		.get('/site', context=>
			html_response__new(
				site__doc_html_({
					ctx: brookebrodack_request_ctx__ensure(middleware_ctx, context, { site })
				}))))
