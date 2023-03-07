import dns from 'node:dns/promises'
import psl from 'psl'
import whois from 'whoiser'
import geoip from 'geoip-lite'

async function domainToResult(host) {
	let newDomain = {
		domain: host
	}

	let dns = await dnsLookup(host)
	newDomain.cname = dns.cname

	newDomain.ipAddresses = []

	if (dns.v4addr) newDomain.ipAddresses.push(...dns.v4addr)
	if (dns.v6addr) newDomain.ipAddresses.push(...dns.v6addr)

	// maybe include mx lookup too?
	// whois check
	if (isApex(host)) {
		let wi = await whois.domain(host, { follow: 1 })
		wi = Object.values(wi)[0]
		newDomain.whois = wi
	}

	return newDomain
}

export default async function lookup(host, ip) {
	let data = {}

	if (ip == true) {
		data['type'] = 'ip'
		data['result'] = {}
	} else {
		data['type'] = 'domain'
		data['domainResults'] = []
	}

	if (ip) {
		// if input is an ip lookup
		data.result.geo = (await geoip.lookup(host)) || null
		data.result.whois = (await whois.ip(host)) || null
		return data
	}

	// if input isnt an ip lookup
	// dns check
	let newDomain = await domainToResult(host)
	newDomain.reason = { code: 'query' }

	// maybe include mx lookup too?
	// whois check

	data.domainResults.push(newDomain)

	if (isApex(host)) {
		// includes www.
		let nh = `www.${host}`
		let wwwDomain = await domainToResult(nh)
		wwwDomain.reason = {
			code: 'apex-check-www',
			from: host
		}

		data.domainResults.push(wwwDomain)
	}

	for (let domainI in data.domainResults) {
		for (let ipI in data.domainResults[domainI].ipAddresses) {
			let ip = data.domainResults[domainI].ipAddresses[ipI]
			let ipInfo = {
				value: ip,
				whois: (await whois.ip(ip)) || null
			}
			let geolocation = await geoip.lookup(ip)
			if (
				geolocation &&
				geolocation.ll[0] != 37.751 &&
				geolocation.ll[1] != -97.822
			)
				ipInfo.geo = geolocation
			data.domainResults[domainI].ipAddresses[ipI] = ipInfo
		}
	}

	return data
}

async function dnsLookup(host) {
	try {
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
	} catch (err) {
		throw err
	}
}

function isApex(host) {
	let parsed = psl.parse(host)
	if (parsed.subdomain == null) return true
	else return false
}
