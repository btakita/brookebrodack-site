import { brookers__div__bind } from '@btakita/ui--browser--brookebrodack/brookers'
import { hy_op } from 'relementjs/browser/hy'
window.addEventListener('load', ()=>{
	queueMicrotask(()=>{
		hy_op(document, {
			brookers: brookers__div__bind,
		})
	})
})
