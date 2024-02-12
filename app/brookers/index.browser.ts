import { brookers__hyop } from '@btakita/ui--browser--brookebrodack/brookers'
import { single_hyop } from 'relementjs/browser/hy'
window.addEventListener('load', ()=>{
	queueMicrotask(()=>{
		single_hyop(document, {
			brookers__hyop,
		})
	})
})
