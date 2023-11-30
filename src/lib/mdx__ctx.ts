import { blog__ctx__new } from '@btakita/domain--any--blog'
import { logo_image__set, site__set, socials__set } from '@btakita/domain--server--blog'
import { LOGO_IMAGE, SITE, SOCIALS } from '@config'
import { relement__use } from 'relementjs'
import { server__fragment__relement } from 'relementjs/server'
export function mdx__ctx__new() {
	const ctx = blog__ctx__new()
	relement__use(server__fragment__relement)
	logo_image__set(ctx, LOGO_IMAGE)
	site__set(ctx, SITE)
	socials__set(ctx, SOCIALS)
	return ctx
}
