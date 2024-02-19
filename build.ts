import { preprocess } from '@ctx-core/preprocess'
import { rebuild_tailwind_plugin_ } from '@rebuildjs/tailwindcss'
import cssnano from 'cssnano'
import { import_meta_env_ } from 'ctx-core/env'
import { is_entry_file_ } from 'ctx-core/fs'
import { type Plugin } from 'esbuild'
import { esmcss_esbuild_plugin_ } from 'esmcss'
import { readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import {
	type relysjs__build_config_T,
	relysjs__ready__wait,
	relysjs_browser__build,
	relysjs_server__build
} from 'relysjs/server'
import { config__init } from './app/index.js'
export async function build(config?:relysjs__build_config_T) {
	config__init()
	const rebuild_tailwind_plugin = rebuild_tailwind_plugin_({
		postcss_plugin_a1_: tailwindcss_plugin=>[
			tailwindcss_plugin as never,
			cssnano({ preset: 'default' })
		],
	})
	const preprocess_plugin = preprocess_plugin_()
	const fileesm = fileesm_()
	await Promise.all([
		relysjs_browser__build({
			...config ?? {},
			publicPath: '/',
			plugins: [
				rebuild_tailwind_plugin,
				preprocess_plugin,
				fileesm,
			],
		}),
		relysjs_server__build({
			...config ?? {},
			target: 'es2022',
			external: await server_external_(),
			minify: false,
			publicPath: '/',
			plugins: [
				esmcss_esbuild_plugin_(),
				rebuild_tailwind_plugin,
				preprocess_plugin,
				fileesm,
			],
		}),
		relysjs__ready__wait(10_000),
	])
}
function server_external_() {
	return readdir(
		join(
			dirname(new URL(import.meta.url).pathname),
			'..',
			'..',
			'node_modules'),
	).then(file_a1=>
		[
			...file_a1
				.filter(file=>file !== '@btakita' && file !== '@rappstack')
				.map(file=>file[0] === '@' ? file + '/*' : file),
			'bun',
			'bun:*'
		])
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
							{ type: 'js' })
					}
				})
			}
		}
	}
}
/** @see {https://github.com/evanw/esbuild/issues/3653#issuecomment-1951577552} */
function fileesm_() {
	return <Plugin>{
		name: 'fileesm',
		setup(build) {
			build.onResolve(
				{ filter: /\.file\.(js|ts)$/ },
				async ({ path, ...args })=>{
					// Avoid recursion in resolve() below
					if (args.pluginData === 'fileesm') return
					// Tell esbuild to resolve the path
					const result = await build.resolve(path, { ...args, pluginData: 'fileesm' })
					if (result.errors.length > 0) return { errors: result.errors }
					return {
						path: result.path.slice(0, -8), // "svg.file.js" => ".svg"
						pluginData: 'fileesm:' + result.path, // Save the original path
					}
				}
			)
			build.onLoad(
				{ filter: /.*$/ },
				async ({ pluginData })=>{
					// Load the original path
					if (!pluginData?.startsWith('fileesm:')) return
					const path = pluginData.slice('fileesm:'.length)
					const contents = await import(path).then(mod=>mod.default())
					return { contents, loader: 'file' }
				}
			)
		},
	}
}
