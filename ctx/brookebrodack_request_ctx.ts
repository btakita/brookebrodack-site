import { site_request_ctx__ensure, type site_request_ctx__ensure_config_T } from '@rappstack/domain--server/ctx'
import { WebPage_id_ref_ } from '@rappstack/domain--server/jsonld'
import { marked__set } from '@rappstack/ui--any/md'
import { app_marked_ } from '@rappstack/ui--server/md'
import { type middleware_ctx_T } from 'relysjs/server'
import {
	AboutPage_id_ref_,
	ContactPage_id_ref_,
	Organization_id_ref_,
	Person_id_ref_,
	WebSite_id_ref_
} from '../jsonld/index.js'
export function brookebrodack_request_ctx__ensure(
	middleware_ctx:middleware_ctx_T,
	context:{
		request:Request
		store:{ [x:string]:unknown }
	},
	config:site_request_ctx__ensure_config_T
) {
	const request_ctx = site_request_ctx__ensure(middleware_ctx, context, config)
	marked__set(request_ctx, app_marked_(request_ctx))
	Person_id_ref_(request_ctx)
	WebSite_id_ref_(request_ctx)
	WebPage_id_ref_(request_ctx)
	Organization_id_ref_(request_ctx)
	AboutPage_id_ref_(request_ctx)
	ContactPage_id_ref_(request_ctx)
	return request_ctx
}
