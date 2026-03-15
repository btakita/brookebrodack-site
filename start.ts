import { app__start } from 'rhonojs/server'
const mod = await import(
	process.env.NODE_ENV === 'production'
		? './dist/server/index.js'
		: './dist/server--dev/index.js'
)
await app__start(await mod.default())
