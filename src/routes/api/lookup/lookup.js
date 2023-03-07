import dns from 'node:dns/promises'
import psl from 'psl'
import whois from 'whoiser'
import geoip from 'geoip-lite'
import axios from 'axios'
import * as cheerio from 'cheerio'

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

		if (wwwDomain.cname || wwwDomain.ipAddresses.length != 0) {
			data.domainResults.push(wwwDomain)
		}
	}

	for (let domainI in data.domainResults) {
		for (let ipI in data.domainResults[domainI].ipAddresses) {
			let ip = data.domainResults[domainI].ipAddresses[ipI]
			let abIpDb = await aipdb(ip)
			let urlHausIpReport = await urlhaus(ip)
			let ipInfo = {
				value: ip,
				whois: (await whois.ip(ip)) || null,
				type: abIpDb.data?.usageType,
				hostname: abIpDb.data?.hostnames,
				abuse: {
					abuseipdb: abIpDb.reportCount,
					urlhaus: urlHausIpReport
				}
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

async function aipdb(ip) {
	try {
		let resp = await axios({
			url: `https://www.abuseipdb.com/check/${encodeURIComponent(ip)}`,
			headers: {
				'User-Agent':
					'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0'
			}
		})
		let $ = cheerio.load(resp.data)

		let titles = []
		let data = {}

		for (let i in $('#report-wrapper table > tbody > tr > th')) {
			if (
				$('#report-wrapper table > tbody > tr > th')?.[i]?.children?.[0]?.data
			) {
				let title = $('#report-wrapper table > tbody > tr > th')
					?.[i]?.children?.[0]?.data.toLowerCase()
					.replace(`(s)`, `s`)
				if (title.includes(` `)) {
					title = title.split(` `)
					for (let a in title) {
						if (a > 0)
							title[a] =
								title[a].substring(0, 1).toUpperCase() + title[a].substring(1)
					}
					title = title.join(``)
				}
				titles.push(title)
			}
		}

		for (let i in titles) {
			let title = titles[i]
			if (
				$('#report-wrapper table > tbody > tr > td')?.[i]?.children?.[0]?.data
			) {
				let content = $('#report-wrapper table > tbody > tr > td')?.[i]
					?.children?.[0]?.data
				data[title] = content.split(`\n`).join(``)
			}
		}

		let reportCount
		if ($('#report-wrapper > p')?.text()?.includes('a total of'))
			reportCount = parseInt(
				$('#report-wrapper > p')
					.text()
					.split(` a total of `)[1]
					.split(` `)[0]
					.replace(`,`, ``)
			)
		else reportCount = 0

		return { reportCount, data }
	} catch (err) {
		return { reportCount: 0, data: null }
	}
}

async function urlhaus(ip) {
	try {
		let resp = await axios({
			method: `POST`,
			url: `https://urlhaus-api.abuse.ch/v1/host/`,
			data: `host=${encodeURIComponent(ip)}`
		})
		let count = 0
		for (let i in resp.data?.urls) {
			if (resp?.data?.urls[i]?.url_status == 'online') count = count + 1
		}
		return count
	} catch (err) {
		return 0
	}
}
