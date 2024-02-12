import { defineConfig } from 'drizzle-kit'
export default defineConfig({
	schema: './schema.ts',
	driver: 'libsql',
	out: './db',
	dbCredentials: {
		url: process.env.DB_URL || './db/app.db'
	},
	verbose: true,
	strict: true,
})
