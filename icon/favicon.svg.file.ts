import { heroicons_film_ } from '@btakita/ui--any--brookebrodack/icon'
import { relement__use } from 'relementjs'
import { server__relement } from 'relementjs/server'
relement__use(server__relement)
const icon = '' + heroicons_film_<'server'>({
	width: '24px',
	height: '24px',
	// language=css
	css: `
svg { stroke: black; }
@media (prefers-color-scheme: dark) {
	svg { stroke: white; }
}
	`.trim()
})
export default icon
