import * as brookers_hyop from '@btakita/ui--browser--brookebrodack/brookers/hyop'
import * as spinner_hyop from '@btakita/ui--browser--brookebrodack/spinner/hyop'
import * as youtube_hyop from '@btakita/ui--browser--brookebrodack/youtube/hyop'
import { hyop } from 'relementjs/browser/hy'
window.addEventListener('load', ()=>{
	hyop(document, {
		...brookers_hyop,
		...spinner_hyop,
		...youtube_hyop,
	})
})
