import { is_entry_file_ } from '@ctx-core/nodejs'
import esbuild_style_plugin from 'esbuild-style-plugin'
import { browser__build, cssjs_esbuild_plugin_, type relysjs__build_config_T, server__build } from 'relysjs'
import tailwind from 'tailwindcss'
import { config__init } from './app/index.js'
export async function build(config?:relysjs__build_config_T) {
	config__init()
	await browser__build(config)
	await server__build({
		...config ?? {},
		target: 'es2022',
		external:['/assets/*', 'relementjs', 'elysia-compression'],
		loader: {
			'.png': 'file',
			'.gif': 'file',
			'.jpeg': 'file',
			'.jpg': 'file',
			'.mp4': 'file',
			'.svg': 'file',
		},
		plugins: [cssjs_esbuild_plugin_(), esbuild_style_plugin({
			postcss: {
				plugins: [tailwind]
			}
		})],
	})
}
if (is_entry_file_(import.meta.url, process.argv[1])) {
	await build({ rebuildjs: { watch: false }, relysjs: { app__start: false } })
}
