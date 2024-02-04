import { brookers__div__bind } from '@btakita/ui--browser--brookebrodack/brookers'
import { hy__bind } from 'relementjs/browser'
window.addEventListener('load', ()=>{
	queueMicrotask(()=>{
		hy__bind(document, {
			brookers: brookers__div__bind,
		})
	})
})
