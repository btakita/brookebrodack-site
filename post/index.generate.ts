import { is_entry_file_ } from 'ctx-core/fs'
import { isNumber } from 'ctx-core/number'
import { readdir, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
export async function index__generate() {
	const dir = dirname(new URL(import.meta.url).pathname)
	const content_dir = join(dir, 'content')
	const file_a = await readdir(content_dir)
	await writeFile(join(dir, 'index.ts'),
		`
import { type post_mod_T } from '@rappstack/domain--any--blog/post'
export const post_mod_a1:post_mod_T[] = await Promise.all([
${import_line_a_(file_a)}
])
`.trim() + '\n')
}
function import_line_a_(file_a:string[]) {
	return file_a
		.filter(file=>isNumber(file[0]))
		.map(file=>{
			if (file.endsWith('.md.ts') || file.endsWith('.md.js'))
				return `\timport('./content/${basename(file, '.ts')}'),`
			if (file.endsWith('.md'))
				return `\timport('./content/${file}'),`
			return null
		})
		.filter(Boolean)
		.join('\n')
}
if (is_entry_file_(import.meta.url, process.argv[1])) {
	index__generate()
		.then(()=>process.exit(0))
		.catch(err=>{
			console.error(err)
			process.exit(1)
		})
}
