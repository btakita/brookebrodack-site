import { instagram_url, linkedin_url, patreon_url, youtube_url } from '@btakita/domain--any--brookebrodack/social'
import { fa_instagram_, fa_linkedin_, fa_patreon_, fa_youtube_ } from '@btakita/ui--any--brookebrodack/icon'
import { type site_T } from '@rappstack/domain--server/site'
import { type social_T } from '@rappstack/domain--server/social'
import { sqlite_db__name__set } from '@rappstack/domain--server/sqlite'
import { import_meta_env_ } from 'ctx-core/env'
import { relement__use } from 'relementjs'
import { server__relement } from 'relementjs/server'
import { app_ctx, cwd__set, port__set, src_path__set } from 'relysjs/server'
import brooke_brodack_logo_jpg from '../../public/assets/images/brooke-brodack-logo.jpg'
export const site:site_T = {
	website: 'https://brookebrodack.net',
	author: 'Brooke Brodack',
	description: 'YouTubing since 2004',
	title: 'Brooke Brodack',
	og_image: brooke_brodack_logo_jpg,
}
export const social_a1:social_T[] = [
	{
		icon_: fa_youtube_,
		href: youtube_url,
		link_title: site.title + ' YouTube Channel',
		active: true
	},
	{
		icon_: fa_patreon_,
		href: patreon_url,
		link_title: site.title + `'s Patreon`,
		active: true
	},
	{
		icon_: fa_instagram_,
		href: instagram_url,
		link_title: site.title + `'s Instagram`,
		active: true
	},
	{
		icon_: fa_linkedin_,
		href: linkedin_url,
		link_title: site.title + `'s LinkedIn`,
		active: true
	},
]
export function config__init() {
	const port = parseInt(import_meta_env_().BROOKEBRODACK_PORT) || 4101
	cwd__set(app_ctx, process.cwd())
	src_path__set(app_ctx, process.cwd())
	port__set(app_ctx, port)
	relement__use(server__relement)
	sqlite_db__name__set(app_ctx, './db/app.db')
}
