import { brookers__hyop } from '@btakita/ui--browser--brookebrodack/brookers'
import { YT_iframe__div__hyop } from '@btakita/ui--browser--brookebrodack/youtube'
import { single_hyop } from 'relementjs/browser/hy'
window.addEventListener('load', ()=>{
	queueMicrotask(()=>{
		single_hyop(document, {
			brookers__hyop,
			YT_iframe__div__hyop,
		})
	})
})
