import { json, error } from '@sveltejs/kit'
import net from 'node:net'
import geoip from 'geoip-lite'
import whois from 'whoiser'

function isIp(query) {
	let isIp = net.isIP(query)
	if (isIp == 4 || isIp == 6) return true
	return false
}

export async function GET({ url }) {
	const query = url.searchParams.get('q')
	if (!query) {
		throw error(400, 'noQuery')
	}
	const whoisData = await whois(query)
	const ip = isIp(query)
	let geo = null
	if (ip) {
		const geoLookup = geoip.lookup(query)
		console.log('geo', geoLookup)
		// Don't want to use geo location if it's just the center of America
		if (geoLookup && geoLookup.ll[0] != 37.751 && geoLookup.ll[1] != -97.822) {
			geo = geoLookup
		}
	}

	return json({
		query,
		whois: ip
			? whoisData
			: Object.values(whoisData)[Object.keys(whoisData).length - 1],
		geo,
		isIp: ip
	})
}
