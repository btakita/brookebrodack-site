export {}
await import(
	process.env.NODE_ENV === 'production'
		? './dist/server/index.js'
		: './dist/dev-server/index.js'
).then(mod=>mod.default())
