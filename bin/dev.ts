#!/usr/bin/env bun
import { sourcemap_writable_stream_ } from '@ctx-core/source-map'
import { red } from 'picocolors'
const dev = Bun.spawn(
	['bun', '--watch', 'src/index.ts'], {
		stdin: 'inherit',
		stdout: 'pipe',
		stderr: 'pipe',
	})
Promise.all([
	dev.stdout
		.pipeTo(sourcemap_writable_stream_(str=>
			process.stdout.write(str))),
	dev.stderr!
		.pipeTo(sourcemap_writable_stream_(str=>
			process.stderr.write(red(str))))
])
	.then(()=>process.exit(0))
	.catch(err=>{
		console.error(err)
		process.exit(1)
	})
