import type { blog_site_T } from '@rappstack/domain--server--blog/site'
import { site } from '../config.js'
import { post_mod_a1 } from '../post/index.js'
export const blog_site:blog_site_T = {
	...site,
	post_mod_a1,
	page__post_count: 20,
	home__post_count: 10,
}
