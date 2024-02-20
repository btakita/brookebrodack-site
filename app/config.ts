import { instagram_url, linkedin_url, patreon_url, youtube_url } from '@btakita/domain--any--brookebrodack/social'
import { fa_instagram_, fa_linkedin_in_, fa_patreon_, fa_youtube_ } from '@btakita/ui--any--brookebrodack/icon'
import { type site_T } from '@rappstack/domain--server/site'
import { type social_T } from '@rappstack/domain--server/social'
import brooke_brodack_logo_jpg from '../public/assets/images/brooke-brodack-logo.jpg'
export const site:site_T = {
	website: 'https://brookebrodack.net',
	author: 'Brooke Brodack',
	description: 'YouTubing since 2004',
	title: 'Brooke Brodack',
	og_image: brooke_brodack_logo_jpg,
}
export const social_a1:social_T[] = [
	{
		icon_html: fa_youtube_(),
		href: youtube_url,
		link_title: site.title + ' YouTube Channel',
		active: true
	},
	{
		icon_html: fa_patreon_(),
		href: patreon_url,
		link_title: site.title + `'s Patreon`,
		active: true
	},
	{
		icon_html: fa_instagram_(),
		href: instagram_url,
		link_title: site.title + `'s Instagram`,
		active: true
	},
	{
		icon_html: fa_linkedin_in_(),
		href: linkedin_url,
		link_title: site.title + `'s LinkedIn`,
		active: true
	},
]
