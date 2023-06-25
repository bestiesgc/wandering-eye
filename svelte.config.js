import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-auto'
import { mdsvex } from 'mdsvex'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	},
	extensions: ['.svelte', '.md'],
	preprocess: [
		mdsvex({
			extension: '.md',
			layout: 'src/routes/(app)/docs/md-layout.svelte'
		}),
		preprocess({
			postcss: true
		})
	]
}

export default config
