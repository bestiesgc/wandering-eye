import { error } from '@sveltejs/kit'

export function load(event) {
	throw error(404, 'Not Found')
}
