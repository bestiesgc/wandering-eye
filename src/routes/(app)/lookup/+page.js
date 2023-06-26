import { error } from '@sveltejs/kit'

export async function load({ url, fetch, setHeaders }) {
	const query = url.searchParams.get('q')
	if (!query) throw error(400, 'Missing query parameter for lookup')
	const resp = await fetch(`/api/lookup?q=${encodeURIComponent(query)}`)
	const data = await resp.json()
	if (resp.ok) {
		if (!data.isIp && !data.whois['Domain Name']) {
			throw error(404, "Couldn't find this domain.")
		}
		setHeaders({
			age: resp.headers.get('age'),
			'cache-control': resp.headers.get('cache-control')
		})
		return data
	}
	throw error(resp.status, data.message)
}
