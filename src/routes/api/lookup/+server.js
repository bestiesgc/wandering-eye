import { json, error } from '@sveltejs/kit'
import net from 'node:net'
import lookup from './lookup.js'

export async function GET({ url }) {
	const queryDomain = url.searchParams.get('domain')
	if (!queryDomain) {
		throw error(400, 'noQueryDomain')
	}

	let isIp = net.isIP(queryDomain)
	if (isIp == 4 || isIp == 6) isIp = true
	else isIp = false

	try {
		return json(await lookup(queryDomain, isIp))
	} catch (err) {
		throw error(500, err.message || err.code)
	}
}
