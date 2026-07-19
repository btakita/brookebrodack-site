// Markdown posts are compiled to modules by `md_esbuild_plugin_` in build.ts,
// which emits exactly the `post_mod_T` shape: a `meta_` validator and a default
// renderer. Declared here because `rebuildjs/types` covers assets (*.png, *.css,
// ...) but not *.md, and post/index.ts imports 190 of them.
declare module '*.md' {
	import { type post_mod_T } from '@rappstack/domain--any--blog/post'
	export const meta_:post_mod_T['meta_']
	const default_:post_mod_T['default']
	export default default_
}
