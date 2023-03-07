import axios from 'axios'

export default async function urlhaus(ip) {
	try {
		const resp = await axios({
			method: `POST`,
			url: `https://urlhaus-api.abuse.ch/v1/host/`,
			data: `host=${encodeURIComponent(ip)}`
		})
		let count = 0
		for (const i in resp.data?.urls) {
			if (resp?.data?.urls[i]?.url_status == 'online') count = count + 1
		}
		return count
	} catch (err) {
		return 0
	}
}
