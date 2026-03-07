import { defineConfig } from 'drizzle-kit'
export default defineConfig({
	schema: './db/schema.ts',
	dialect: 'sqlite',
	out: './db',
	dbCredentials: {
		url: process.env.DB_URL || './db/app.db'
	},
	verbose: true,
	strict: true,
})
