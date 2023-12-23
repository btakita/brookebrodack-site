import { brookers__page__hy__bind__id } from '@btakita/ui--any--brookebrodack'
import { brookers__page__hy__bind } from '@btakita/ui--browser--brookebrodack'
import { relement__use } from 'relementjs'
import { browser__relement, hy__bind } from 'relementjs/browser'
relement__use(browser__relement)
window.addEventListener('load', ()=>{
	queueMicrotask(()=>{
		hy__bind(document, {
			[brookers__page__hy__bind__id]: brookers__page__hy__bind,
		})
	})
})
