import * as guestbook_hyop from '@btakita/ui--browser--brookebrodack/guestbook/hyop'
import { hyop } from 'relementjs/browser/hy'
window.addEventListener('load', ()=>{
	hyop(document, {
		...guestbook_hyop,
	})
})
