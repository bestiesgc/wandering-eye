import dns from 'node:dns/promises'

export default async function dnsLookup(host) {
	dns.setServers([`8.8.8.8`, `1.1.1.1`]) // force servers to google and cloudflare
	let cname
	try {
		cname = await dns.resolveCname(host)
	} catch (err) {
		cname = null
	}

	let v4addr
	try {
		v4addr = await dns.resolve4(host)
	} catch (err) {
		v4addr = null
	}

	let v6addr
	try {
		v6addr = await dns.resolve6(host)
	} catch (err) {
		v6addr = null
	}

	return {
		cname,
		v4addr,
		v6addr
	}
}
