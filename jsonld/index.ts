import { jsonld_id__new, ns_id_be_id_ref_be_jsonld_pair_ } from '@rappstack/domain--server/jsonld'
import { site__author_, site__social_a1_, site__title_, site__website_ } from '@rappstack/domain--server/site'
import { import_meta_env_ } from 'ctx-core/env'
import { nullish__none_, tup, type wide_ctx_T } from 'ctx-core/rmemo'
import { url__join } from 'ctx-core/uri'
import { type request_ctx_T } from 'relysjs/server'
import type { AboutPage, ContactPage, ImageObject, Organization, Person, WebSite } from 'schema-dts'
import brooke_brodack_logo_jpg from '../public/assets/images/brooke-brodack-logo.jpg'
import brooke_brodack_profile_jpg from '../public/assets/images/brooke-brodack-profile.jpg'
const ns = import_meta_env_().NODE_ENV === 'production' ? 'app' : ''
export const [
	[WebSite_id_ref_],
	WebSite_id_,
] = [
	ns_id_be_id_ref_be_jsonld_pair_(ns, 'WebSite', ctx=>{
		return nullish__none_(tup(site__website_(ctx), site__title_(ctx)), (
			site__website, site_title
		)=><WebSite>{
			'@type': 'WebSite',
			'@id': jsonld_id__new(site__website, 'WebSite'),
			url: site__website,
			name: site_title,
			publisher: Person_id_ref_(ctx),
		})
	}),
	(ctx:request_ctx_T)=><string>WebSite_id_ref_(ctx)['@id'],
]
export const [
	Organization_id_ref_
] = ns_id_be_id_ref_be_jsonld_pair_(ns, 'Organization', ctx=>{
	return nullish__none_(tup(site__website_(ctx), site__title_(ctx)), (
		site__website, site__title
	)=><Organization>{
		'@type': 'Organization',
		'@id': jsonld_id__new(site__website, 'Organization'),
		url: site__website,
		name: site__title,
		logo: logo_ImageObject_id_ref_(ctx),
		founder: Person_id_ref_(ctx),
	})
})
export const [
	logo_ImageObject_id_ref_,
] = ns_id_be_id_ref_be_jsonld_pair_(ns, 'logo_ImageObject', ctx=>{
	return nullish__none_(tup(site__website_(ctx)), (
		site__website
	)=><ImageObject>{
		'@type': 'ImageObject',
		'@id': jsonld_id__new(site__website, 'logo'),
		url: url__join(site__website, brooke_brodack_logo_jpg),
		width: '256px',
		height: '256px',
	})
})
export const [
	Person_id_ref_
] = ns_id_be_id_ref_be_jsonld_pair_(ns, 'Person', ctx=>{
	return nullish__none_(tup(site__website_(ctx), site__author_(ctx), site__social_a1_(ctx)), (
		site__website, site__author, site__social_a1
	)=><Person>{
		'@type': 'Person',
		'@id': jsonld_id__new(site__website, 'Person'),
		url: site__website,
		name: site__author,
		image: url__join(site__website, brooke_brodack_profile_jpg),
		sameAs:
			[
				...site__social_a1.filter(social=>social.active).map(social=>social.href),
				'https://en.wikipedia.org/wiki/Brooke_Brodack',
				'https://www.wikiwand.com/en/Brooke_Brodack',
				'https://kids.kiddle.co/Brooke_Brodack',
				'https://youtube.fandom.com/wiki/Brookers',
				'https://www.imdb.com/name/nm3985145/',
				'https://www.flickr.com/photos/brookealleyb',
				'https://www.famousbirthdays.com/people/brooke-brodack.html',
			],
	})
})
export const [
	[AboutPage_id_ref_, AboutPage_],
	AboutPage_id_,
	AboutPage__description_,
] = [
	ns_id_be_id_ref_be_jsonld_pair_(ns, 'AboutPage', ctx=>{
		return nullish__none_(tup(site__website_(ctx), site__author_(ctx)), (
			site__website, site__author
		)=><AboutPage>{
			'@type': 'AboutPage',
			'@id': jsonld_id__new(url__join(site__website, 'about'), 'AboutPage'),
			url: url__join(site__website, 'about'),
			name: 'About | ' + site__author,
			about: Person_id_ref_(ctx),
			description: 'Creates efficient systems that grow with you',
			inLanguage: 'en-us',
			isPartOf: WebSite_id_ref_(ctx)
		})
	}),
	(ctx:wide_ctx_T<typeof ns>)=><string>AboutPage_id_ref_(ctx)['@id'],
	(ctx:wide_ctx_T<typeof ns>)=><string>AboutPage_(ctx).description,
]
export const [
	ContactPage_id_ref_
] = ns_id_be_id_ref_be_jsonld_pair_(ns, 'ContactPage', ctx=>{
	return nullish__none_(tup(site__website_(ctx), site__author_(ctx)), (
		site__website, site__author
	)=>{
		return <ContactPage>{
			'@type': 'ContactPage',
			'@id': jsonld_id__new(site__website, 'ContactPage'),
			url: site__website,
			name: 'Contact ' + site__author,
			inLanguage: 'en-us',
			isPartOf: WebSite_id_ref_(ctx),
			about: Person_id_ref_(ctx),
			mainEntity: Person_id_ref_(ctx)
		}
	})
})
