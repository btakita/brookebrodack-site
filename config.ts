import {
	instagram_url,
	linkedin_url,
	email_url,
	patreon_url,
	youtube_url
} from '@btakita/domain--any--brookebrodack/social'
import { fa_email_, fa_instagram_, fa_linkedin_, fa_patreon_, fa_youtube_ } from '@btakita/ui--any--brookebrodack/icon'
import { type site_T } from '@rappstack/domain--server/site'
import { sqlite_db__set } from '@rappstack/domain--server/sqlite'
import Database from 'bun:sqlite'
import { import_meta_env_ } from 'ctx-core/env'
import { class_ } from 'ctx-core/html'
import { relement__use } from 'relementjs'
import { img_ } from 'relementjs/html'
import { server__relement } from 'relementjs/server'
import { app_ctx, cwd__set, port__set, src_path__set } from 'relysjs/server'
import brooke_brodack_logo_jpg from '../../public/assets/images/brooke-brodack-logo.jpg'
import brooke_brodack_profile_webp from '../../public/assets/images/brooke-brodack-profile.webp'
import favicon_svg from './icon/favicon.svg.file.js'
const author = 'Brooke Brodack'
const title = 'Brooke Brodack'
export const site:site_T = {
	website: 'https://brookebrodack.net',
	author,
	description: 'YouTubing since 2004',
	title,
	favicon: {
		type: 'image/svg+xml',
		href: favicon_svg
	},
	social_image_url: brooke_brodack_logo_jpg,
	font__meta_props_a1: [
		{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
		{ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 1 },
		{
			href: 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=JetBrains+Mono:wght@400;700&display=swap',
			rel: 'stylesheet'
		}
	],
	light_and_dark_mode: true,
	google_site_verification: import_meta_env_().PUBLIC_GOOGLE_SITE_VERIFICATION,
	gtag_id: 'G-E2YTV44HXX',
	logo_image__new: ($p?:{ class?:string })=>{
		return img_({
			src: brooke_brodack_profile_webp,
			alt: 'Brooke Brodack',
			class: class_(
				'inline-block',
				'aspect-square',
				'rounded-full',
				$p?.class)
		})
	},
	social_a1: [
		{
			icon_: fa_youtube_,
			href: youtube_url,
			link_title: title + ' YouTube Channel',
			active: true
		},
		{
			icon_: fa_patreon_,
			href: patreon_url,
			link_title: title + `'s Patreon`,
			active: true
		},
		{
			icon_: fa_instagram_,
			href: instagram_url,
			link_title: title + `'s Instagram`,
			active: true
		},
		{
			icon_: fa_linkedin_,
			href: linkedin_url,
			link_title: title + `'s LinkedIn`,
			active: true
		},
		{
			icon_: fa_email_,
			href: email_url,
			link_title: 'Email ' + author,
			active: true
		},
	]
}
export function config__init() {
	const port = parseInt(import_meta_env_().BROOKEBRODACK_PORT) || 4101
	cwd__set(app_ctx, process.cwd())
	src_path__set(app_ctx, process.cwd())
	port__set(app_ctx, port)
	relement__use(server__relement)
	const sqlite_db = new Database('./db/app.db')
	sqlite_db.exec('PRAGMA journal_mode = WAL;')
	sqlite_db__set(app_ctx, sqlite_db)
}
