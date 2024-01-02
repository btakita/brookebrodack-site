import { is_entry_file_ } from 'ctx-core/fs'
import { Cancel, nullish__none_, run, tup } from 'ctx-core/function'
import { type PluginBuild } from 'esbuild'
import { esmcss_esbuild_plugin_ } from 'esmcss'
import { readFile, writeFile } from 'node:fs/promises'
import postcss from 'postcss'
import {
	app_ctx,
	be,
	browser__build,
	browser__output_,
	build_id_,
	type circular_memo_T,
	memo_,
	type rebuildjs_metafile_T,
	type relysjs__build_config_T,
	relysjs__build_id_,
	relysjs__ready_,
	server__build,
	server__output_,
	server__output__relative_path_M_middleware_ctx_
} from 'relysjs'
import tailwind from 'tailwindcss'
import { config__init } from './app/index.js'
export async function build(config?:relysjs__build_config_T) {
	config__init()
	const postcss_plugin = postcss_plugin_()
	await browser__build({
		...config ?? {},
		plugins: [postcss_plugin],
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
			postcss_plugin,
		],
	})
	function postcss_plugin_() {
		return { name: 'postcss', setup: setup_() }
		function setup_() {
			const setup = (build:PluginBuild)=>{
				build.onEnd(result=>{
					if (result.errors.length) {
						throw new Error(`Build errors: ${result.errors.length} errors`)
					}
				})
			}
			setup.postcss__build$ = postcss__build$_()
			return setup
			function postcss__build$_() {
				return be(app_ctx, ctx=>
					run<circular_memo_T>(memo_(postcss__build$=>{
						r()
						return postcss__build$
						function r() {
							if (!relysjs__ready_(ctx)) return
							nullish__none_(tup(
								build_id_(ctx),
								relysjs__build_id_(ctx),
								server__output__relative_path_M_middleware_ctx_(app_ctx),
							), async (
								build_id,
								relysjs__build_id,
								server__output__relative_path_M_middleware_ctx,
							)=>{
								try {
									for (const middleware_ctx of server__output__relative_path_M_middleware_ctx.values()) {
										await output__process(server__output_(middleware_ctx)!)
										await output__process(browser__output_(middleware_ctx)!)
									}
								} catch (err) {
									if (err instanceof Cancel) return
									throw err
								}
								async function output__process(
									output:rebuildjs_metafile_T['outputs'][string]
								) {
									const cssBundle = output?.cssBundle
									if (!cssBundle) return
									const result = await cmd(postcss([
										tailwind({
											content: output.cssBundle_content!
										}),
									]).process(
										await cmd(readFile(cssBundle)),
										{
											from: cssBundle,
											to: cssBundle,
										}))
									await cmd(writeFile(cssBundle, result.css))
									await cmd(writeFile(cssBundle + '.map', JSON.stringify(result.map)))
								}
								async function cmd<R>(promise:Promise<R>&{ cancel?:()=>Promise<R> }) {
								  if (cancel_()) throw new Cancel()
									const rv = await promise
								  if (cancel_()) {
										promise.cancel?.()
										throw new Cancel()
									}
									return rv
								}
								function cancel_() {
								  return (
										build_id_(ctx) !== build_id
										|| relysjs__build_id_(ctx) !== relysjs__build_id
										|| server__output__relative_path_M_middleware_ctx_(
											ctx) !== server__output__relative_path_M_middleware_ctx
									)
								}
							})
						}
					})), { id: 'postcss__build$', ns: 'app' })
			}
		}
	}
}
is_entry_file_(import.meta.url, process.argv[1])
	.then(async is_entry_file=>{
		if (is_entry_file) {
			await build({ rebuildjs: { watch: false }, relysjs: { app__start: false } })
		}
	})
