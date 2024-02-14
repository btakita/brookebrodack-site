import { content__hyop } from '@btakita/ui--browser--brookebrodack/content'
import { spinner__template__hyop } from '@btakita/ui--browser--brookebrodack/spinner'
import { YT_player__div__hyop } from '@btakita/ui--browser--brookebrodack/youtube'
import { single_hyop } from 'relementjs/browser/hy'
window.addEventListener('load', ()=>{
	single_hyop(document, {
		content__hyop,
		spinner__template__hyop,
		YT_player__div__hyop,
	})
})
