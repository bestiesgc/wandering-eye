import { sveltekit } from '@sveltejs/kit/vite'

const config = {
	plugins: [sveltekit()],
	preview: {
		port: 8998
	}
}

export default config
