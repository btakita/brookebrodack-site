import { object_store_asset_esbuild_plugin_ } from 'esbuild-plugin-object-store-asset'
import { preprocess } from '@ctx-core/preprocess'
import { rebuild_tailwind_plugin_ } from '@rebuildjs/tailwindcss'
import cssnano from 'cssnano'
import { import_meta_env_ } from 'ctx-core/env'
import { is_entry_file_ } from 'ctx-core/fs'
import { type Plugin } from 'esbuild'
import esmfile_ from 'esbuild-plugin-esmfile'
import { esmcss_esbuild_plugin_ } from 'esmcss'
import { readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import {
	type rhonojs__build_config_T,
	rhonojs__ready__wait,
	rhonojs_browser__build,
	rhonojs_server__build
} from 'rhonojs/server'
import { config__init } from './config.js'
export async function build(config?:rhonojs__build_config_T) {
	config__init()
	const rebuild_tailwind_plugin = rebuild_tailwind_plugin_({
		postcss_plugin_a1_: tailwindcss_plugin=>[
			tailwindcss_plugin as never,
			cssnano({ preset: 'default' })
		],
	})
	const preprocess_plugin = preprocess_plugin_()
	const esmfile = esmfile_()
	const object_store_asset = object_store_asset_esbuild_plugin_({
		asset_base_url: import_meta_env_().ASSET_BASE_URL,
		base_path: import_meta_env_().ASSET_BASE_PATH,
	})
	const build_promises = [
		rhonojs_browser__build({
			...config ?? {},
			publicPath: '/',
			plugins: [
				object_store_asset,
				rebuild_tailwind_plugin,
				preprocess_plugin,
				esmfile,
			],
		}),
		rhonojs_server__build({
			...config ?? {},
			target: 'es2022',
			external: await server_external_(),
			minify: false,
			publicPath: '/',
			plugins: [
				object_store_asset,
				esmcss_esbuild_plugin_(),
				rebuild_tailwind_plugin,
				preprocess_plugin,
				esmfile,
			],
		}),
	]
	build_promises.push(rhonojs__ready__wait(300_000))
	await Promise.all(build_promises)
}
function server_external_() {
	return readdir(
		join(
			dirname(new URL(import.meta.url).pathname),
			'..',
			'..',
			'node_modules'),
	).then(file_a1=>[
		...file_a1
			.filter(file=>file !== '@btakita' && file !== '@rappstack')
			.map(file=>file[0] === '@' ? file + '/*' : file),
		'hono',
		'hono/*',
		'bun',
		'bun:*'
	])
}
if (is_entry_file_(import.meta.url, process.argv[1])) {
	build({
		rebuildjs: { watch: false },
		rhonojs: { app__start: false }
	}).then(()=>process.exit(0))
		.catch(err=>{
			console.error(err)
			process.exit(1)
		})
}
function preprocess_plugin_():Plugin {
	return {
		name: 'preprocess',
		setup(build) {
			if (import_meta_env_().NODE_ENV !== 'production') {
				build.onLoad({ filter: /(\/ctx-core\/?.*|\/hyop\/?.*)$/ }, async ({ path })=>{
					const source = await Bun.file(path).text()
					return {
						contents: preprocess(
							source,
							{ DEBUG: '1' },
							{ type: 'js' }),
						loader: 'ts'
					}
				})
			}
		}
	}
}
