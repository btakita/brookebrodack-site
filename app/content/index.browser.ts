import * as content_hyop from '@btakita/ui--browser--brookebrodack/content/hyop'
import * as spinner_hyop from '@btakita/ui--browser--brookebrodack/spinner/hyop'
import * as youtube_hyop from '@btakita/ui--browser--brookebrodack/youtube/hyop'
import { hyop } from 'relementjs/browser/hy'
window.addEventListener('load', ()=>{
	hyop(document, {
		...content_hyop,
		...spinner_hyop,
		...youtube_hyop,
	})
})
