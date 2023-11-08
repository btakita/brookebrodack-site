import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'
import tailwind from '@astrojs/tailwind'
// https://astro.build/config
export default defineConfig({
	site: 'https://brookebrodack.me',
	integrations: [sitemap(), mdx(), tailwind()]
})
