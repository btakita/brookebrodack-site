import { config__init } from './app/index.js'
import { build } from './build.js'
config__init()
await build()
