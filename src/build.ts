import { rebuild_tailwind_plugin_ } from '@rebuildjs/tailwindcss'
import { is_entry_file_ } from 'ctx-core/fs'
import { esmcss_esbuild_plugin_ } from 'esmcss'
import { browser__build, type relysjs__build_config_T, server__build } from 'relysjs'
import { config__init } from './app/index.js'
export async function build(config?:relysjs__build_config_T) {
	config__init()
	const rebuild_tailwind_plugin = rebuild_tailwind_plugin_()
	await browser__build({
		...config ?? {},
		plugins: [rebuild_tailwind_plugin],
	})
	await server__build({
		...config ?? {},
		target: 'es2022',
		external: ['/assets/*', 'relementjs', 'elysia-compression'],
		loader: {
			'.png': 'file',
			'.gif': 'file',
			'.jpeg': 'file',
			'.jpg': 'file',
			'.mp4': 'file',
			'.svg': 'file',
		},
		plugins: [
			esmcss_esbuild_plugin_(),
			rebuild_tailwind_plugin,
		],
	})
}
is_entry_file_(import.meta.url, process.argv[1])
	.then(async is_entry_file=>{
		if (is_entry_file) {
			await build({ rebuildjs: { watch: false }, relysjs: { app__start: false } })
		}
	})
