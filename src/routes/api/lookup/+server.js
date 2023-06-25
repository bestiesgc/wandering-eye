import { env } from '$env/dynamic/private'
import { json, error } from '@sveltejs/kit'
import net from 'node:net'
import geoip from 'geoip-lite'
import whois from 'whoiser'
import NodeCache from 'node-cache'

const WHOIS_CACHE_TTL = env.WHOIS_CACHE_TTL ?? 60 * 60 * 24

const whoisCache = new NodeCache({
	stdTTL: WHOIS_CACHE_TTL
})

function isIp(query) {
	let isIp = net.isIP(query)
	if (isIp == 4 || isIp == 6) return true
	return false
}

export async function GET({ url, setHeaders }) {
	const query = url.searchParams.get('q')
	if (!query) {
		throw error(400, 'noQuery')
	}
	if (whoisCache.has(query)) {
		setHeaders({
			'cache-control': `private, max-age=${(
				(whoisCache.getTtl(query) - Date.now()) /
				1000
			).toFixed(0)}`
		})
		return json(whoisCache.get(query))
	}
	let whoisData
	try {
		whoisData = await whois(query)
		if (whoisData.error) throw new Error(whoisData.error)
	} catch (err) {
		throw error(500, err.message)
	}
	const ip = isIp(query)
	let geo = null
	if (ip) {
		const geoLookup = geoip.lookup(query)
		// Don't want to use geo location if it's just the center of America
		if (geoLookup && geoLookup.ll[0] != 37.751 && geoLookup.ll[1] != -97.822) {
			geo = geoLookup
		}
	}

	const value = {
		query,
		whois: ip
			? whoisData
			: Object.values(whoisData)[Object.keys(whoisData).length - 1],
		geo,
		isIp: ip
	}

	whoisCache.set(query, value)

	setHeaders({ 'cache-control': `private, max-age=${WHOIS_CACHE_TTL}` })
	return json(value)
}
