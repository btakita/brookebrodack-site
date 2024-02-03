export {}
await import(
	process.env.NODE_ENV === 'production'
		? './dist/server/index.js'
		: './dist/server--dev/index.js'
).then(mod=>mod.default())
