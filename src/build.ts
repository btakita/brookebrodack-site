import { is_entry_file_ } from '@ctx-core/nodejs'
import { esmcss_esbuild_plugin_ } from 'esmcss'
import { readFile, writeFile } from 'node:fs/promises'
import postcss from 'postcss'
import { browser__build, type relysjs__build_config_T, server__build } from 'relysjs'
import tailwind from 'tailwindcss'
import { config__init } from './app/index.js'
export async function build(config?:relysjs__build_config_T) {
	config__init()
	await browser__build(config)
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
			{
				name: 'postcss',
				setup(build) {
					const processed__cssBundle_S = new Set()
					build.onEnd(async result=>{
						const { metafile } = result
						const outputs = metafile?.outputs ?? {}
						for (const output__relative_path in outputs) {
							const { cssBundle } = outputs[output__relative_path]
							if (!cssBundle || processed__cssBundle_S.has(cssBundle)) continue
							processed__cssBundle_S.add(cssBundle)
							const result = await postcss([
								tailwind({
									content: [output__relative_path]
								}),
							]).process(
								await readFile(cssBundle),
								{
									from: cssBundle,
									to: cssBundle,
								})
							await writeFile(cssBundle, result.css)
							await writeFile(cssBundle + '.map', JSON.stringify(result.map))
						}
					})
				}
			}
		],
	})
}
if (is_entry_file_(import.meta.url, process.argv[1])) {
	await build({ rebuildjs: { watch: false }, relysjs: { app__start: false } })
}
