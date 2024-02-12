#!/usr/bin/env bun
import { sourcemap_writable_stream_ } from '@ctx-core/source-map'
import { param_r_ } from 'ctx-core/cli-args'
import { red } from 'picocolors'
const param_r = param_r_(Bun.argv.slice(2), {
	help: '-h, --help',
	file_a1: '-f, --file'
})
main()
	.then(()=>process.exit(0))
	.catch(err=>{
		console.error(err)
		process.exit(1)
	})
async function main() {
	if (param_r.help) {
		console.info(help_msg_())
		return
	}
	const sourcemap__resolve__bun = Bun.spawn(
		['bun', param_r.file_a1?.[0] ?? 'index.ts'], {
			stdin: 'inherit',
			stdout: 'pipe',
			stderr: 'pipe',
		})
	await Promise.all([
		sourcemap__resolve__bun.stdout
			.pipeTo(sourcemap_writable_stream_(str=>
				process.stdout.write(str))),
		sourcemap__resolve__bun.stderr!
			.pipeTo(sourcemap_writable_stream_(str=>
				process.stderr.write(red(str))))
	])
}
function help_msg_() {
	return `
Usage: verify-version-node.js [-p <bun-run-file>]

Options:

-h, --help This help message
-p, --path Path to the file that bun will run with source map resolution
		`.trim()
}
