import psl from 'psl'
import whois from 'whoiser'
import geoip from 'geoip-lite'
import urlhaus from '$lib/server/urlhaus.js'
import aipdb from '$lib/server/aipdb.js'
import dnsLookup from '$lib/server/dns'

async function domainToResult(host) {
	const newDomain = {
		domain: host
	}

	const dns = await dnsLookup(host)
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
	const data = {}

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
	const newDomain = await domainToResult(host)
	newDomain.reason = { code: 'query' }

	// maybe include mx lookup too?
	// whois check

	data.domainResults.push(newDomain)

	if (isApex(host)) {
		// includes www.
		const nh = `www.${host}`
		const wwwDomain = await domainToResult(nh)
		wwwDomain.reason = {
			code: 'apex-check-www',
			from: host
		}

		if (wwwDomain.cname || wwwDomain.ipAddresses.length != 0) {
			data.domainResults.push(wwwDomain)
		}
	}

	for (const domainI in data.domainResults) {
		for (const ipI in data.domainResults[domainI].ipAddresses) {
			const ip = data.domainResults[domainI].ipAddresses[ipI]
			const abIpDb = await aipdb(ip)
			const urlHausIpReport = await urlhaus(ip)
			const ipInfo = {
				value: ip,
				whois: (await whois.ip(ip)) || null,
				type: abIpDb.data?.usageType,
				hostname: abIpDb.data?.hostnames,
				abuse: {
					abuseipdb: abIpDb.reportCount,
					urlhaus: urlHausIpReport
				}
			}
			const geolocation = await geoip.lookup(ip)
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

function isApex(host) {
	const parsed = psl.parse(host)
	if (parsed.subdomain == null) return true
	else return false
}
