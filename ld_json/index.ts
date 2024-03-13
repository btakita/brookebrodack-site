import { url__join } from 'ctx-core/uri'
import type { Graph } from 'schema-dts'
import { site, social_a1 } from '../config.js'
export async function site__ld_json__new() {
	const { author, website } = site
	const root_Person_id = website
	const root_AboutPage_id = url__join(root_Person_id, '#about')
	const root_ContactPage_id = url__join(root_Person_id, '#contact')
	const about_WebPage_id = url__join(website, 'about')
	return <Graph>{
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Person',
				'@id': root_Person_id,
				url: root_Person_id,
				name: author,
				image: 'https://gravatar.com/avatar/a0599814ceddc2e283792f4e47c57f5e',
				mainEntityOfPage: [
					about_WebPage_id,
					root_ContactPage_id,
				],
				subjectOf: { '@id': about_WebPage_id },
				sameAs: [
					...social_a1.filter(social=>social.active).map(social=>social.href),
					'https://en.wikipedia.org/wiki/Brooke_Brodack',
					'https://www.wikiwand.com/en/Brooke_Brodack',
					'https://kids.kiddle.co/Brooke_Brodack',
					'https://youtube.fandom.com/wiki/Brookers',
					'https://www.imdb.com/name/nm3985145/',
					'https://www.flickr.com/photos/brookealleyb',
					'https://www.famousbirthdays.com/people/brooke-brodack.html',
				],
			},
			{
				'@type': 'AboutPage',
				'@id': root_AboutPage_id,
				name: author + ' Summary',
				inLanguage: 'en-us',
				isPartOf: root_Person_id
			},
			{
				'@type': 'WebPage',
				'@id': about_WebPage_id,
				url: about_WebPage_id,
				name: 'About | ' + author,
				inLanguage: 'en-us',
				isPartOf: [
					root_Person_id,
					root_AboutPage_id,
				],
				about: root_Person_id,
				mainEntity: root_Person_id
			},
			{
				'@type': 'ContactPage',
				'@id': root_ContactPage_id,
				url: root_ContactPage_id,
				name: 'Contact ' + author,
				inLanguage: 'en-us',
				isPartOf: root_Person_id,
				about: root_Person_id,
				mainEntity: root_Person_id
			},
		]
	}
}
