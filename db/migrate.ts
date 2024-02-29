import { drizzle_db_ } from '@rappstack/domain--server/drizzle'
import { sqlite_db__set } from '@rappstack/domain--server/sqlite'
import Database from 'bun:sqlite'
import { is_entry_file_ } from 'ctx-core/fs'
import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { dirname, join } from 'node:path'
import { app_ctx } from 'relysjs/server'
if (is_entry_file_(import.meta.url), process.argv[1]) {
	const dir = dirname(new URL(import.meta.url).pathname)
	const sqlite_db = new Database(join(dir, 'app.db'))
	sqlite_db.exec('PRAGMA journal_mode = WAL;')
	sqlite_db__set(app_ctx, sqlite_db)
	migrate(drizzle_db_(app_ctx), { migrationsFolder: dir })
}
