import { post_mod_a1__set } from '@rappstack/domain--any--blog/post'
import { blog_site__set, type blog_site_T, site__post_mod_a1_ } from '@rappstack/domain--server--blog/site'
import { WebPage_id_ref_ } from '@rappstack/domain--server/jsonld'
import { marked__set } from '@rappstack/ui--any/md'
import { app_marked_ } from '@rappstack/ui--server/md'
import type { Context } from 'hono'
import type { middleware_ctx_T } from 'rhonojs/server'
import { request_ctx__ensure } from 'rhonojs/server'
import {
	AboutPage_id_ref_,
	ContactPage_id_ref_,
	Organization_id_ref_,
	Person_id_ref_,
	WebSite_id_ref_
} from '../jsonld/index.js'
export function brookebrodack_blog_request_ctx__ensure(
	middleware_ctx:middleware_ctx_T,
	c:Context,
	config:{ blog_site:blog_site_T }
) {
	const request_ctx = request_ctx__ensure(middleware_ctx, c)
	blog_site__set(request_ctx, config.blog_site)
	post_mod_a1__set(request_ctx, site__post_mod_a1_(request_ctx))
	marked__set(request_ctx, app_marked_(request_ctx))
	Person_id_ref_(request_ctx)
	WebSite_id_ref_(request_ctx)
	WebPage_id_ref_(request_ctx)
	Organization_id_ref_(request_ctx)
	AboutPage_id_ref_(request_ctx)
	ContactPage_id_ref_(request_ctx)
	return request_ctx
}
