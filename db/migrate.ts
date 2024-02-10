import { drizzle_db_ } from '@rappstack/domain--server/drizzle'
import { sqlite_db__name__set } from '@rappstack/domain--server/sqlite'
import { is_entry_file_ } from 'ctx-core/fs'
import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { dirname, join } from 'node:path'
import { app_ctx } from 'relysjs/server'
if (is_entry_file_(import.meta.url), process.argv[1]) {
	const dir = dirname(new URL(import.meta.url).pathname)
	sqlite_db__name__set(app_ctx, join(dir, 'app.db'))
	await migrate(drizzle_db_(app_ctx), { migrationsFolder: dir })
}
