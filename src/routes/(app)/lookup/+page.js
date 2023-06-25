import { error } from '@sveltejs/kit'

export async function load({ url, fetch }) {
	const query = url.searchParams.get('q')
	if (!query) throw error(400, 'Missing query parameter for lookup')
	const resp = await fetch(`/api/lookup?q=${encodeURIComponent(query)}`)
	return await resp.json()
}
