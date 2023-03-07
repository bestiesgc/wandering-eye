import axios from 'axios'
import * as cheerio from 'cheerio'

export default async function aipdb(ip) {
	try {
		const resp = await axios({
			url: `https://www.abuseipdb.com/check/${encodeURIComponent(ip)}`,
			headers: {
				'User-Agent':
					'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0'
			}
		})
		const $ = cheerio.load(resp.data)

		const titles = []
		const data = {}

		for (const i in $('#report-wrapper table > tbody > tr > th')) {
			if (
				$('#report-wrapper table > tbody > tr > th')?.[i]?.children?.[0]?.data
			) {
				let title = $('#report-wrapper table > tbody > tr > th')
					?.[i]?.children?.[0]?.data.toLowerCase()
					.replace(`(s)`, `s`)
				if (title.includes(` `)) {
					title = title.split(` `)
					for (const a in title) {
						if (a > 0)
							title[a] =
								title[a].substring(0, 1).toUpperCase() + title[a].substring(1)
					}
					title = title.join(``)
				}
				titles.push(title)
			}
		}

		for (const i in titles) {
			const title = titles[i]
			if (
				$('#report-wrapper table > tbody > tr > td')?.[i]?.children?.[0]?.data
			) {
				const content = $('#report-wrapper table > tbody > tr > td')?.[i]
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
