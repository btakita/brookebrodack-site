import { defineConfig } from 'drizzle-kit'
export default defineConfig({
	schema: './schema.ts',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.DB_URL || 'app',
	},
	verbose: true,
	strict: true,
})
