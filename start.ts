import { Elysia } from 'elysia'
import { app__start } from 'relysjs/server'
const mod = await import(
	process.env.NODE_ENV === 'production'
		? './dist/server/index.js'
		: './dist/server--dev/index.js'
)
await app__start(
	(await mod.prebuild() ?? new Elysia())
		.use(await mod.default()))
