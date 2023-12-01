import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'
// https://astro.build/config
export default defineConfig({
	site: 'https://brookebrodack.me',
	integrations: [sitemap(), mdx(), tailwind()],
	...(import.meta.env.BROOKEBRODACK_PORT ? {
		server: {
			host: '0.0.0.0', // heroku requires 0.0.0.0
			port: parseInt(import.meta.env.BROOKEBRODACK_PORT)
		}
	} : {}),
})
