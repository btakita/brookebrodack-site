import { rebuild_tailwind_plugin_ } from '@rebuildjs/tailwindcss'
import { is_entry_file_ } from 'ctx-core/fs'
import { esmcss_esbuild_plugin_ } from 'esmcss'
import { type relysjs__build_config_T, relysjs_browser__build, relysjs_server__build } from 'relysjs/server'
import { config__init } from './app/index.js'
export async function build(config?:relysjs__build_config_T) {
	config__init()
	const rebuild_tailwind_plugin = rebuild_tailwind_plugin_()
	await relysjs_browser__build({
		...config ?? {},
		plugins: [rebuild_tailwind_plugin],
	})
	await relysjs_server__build({
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
if (is_entry_file_(import.meta.url, process.argv[1])) {
	build({
		rebuildjs: { watch: false },
		relysjs: { app__start: false }
	}).then(()=>process.exit(0))
		.catch(err=>{
			console.error(err)
			process.exit(1)
		})
}
