function parseDomainList(domainResults, ipResults) {
    console.log(ipResults)
    return domainResults.map(e => {
        if (!e) return e
        if (Object.keys(e).length===1) return false // if no keys beyond the domain prop, return false
        e.ipAddresses = e.ipAddresses.flat().map(e => ipResults[e]).filter(e => e) // filtering out undefined
        return e
    })
    .filter(e => e) // filtering out false values
}

function parseLookup(resp, domain) {
    let respObj = {
        domainQueried: domain,
        domains: parseDomainList(Object.entries(resp.domainResults).map(e => {
            return {
                domain: e[0],
                ...e[1]
            }
        }), resp.ipResults)
    }
    return respObj
}

export default async function lookup(domain) {
    let apiUrl = '/api'
    if (import.meta.env.DEV) {
        apiUrl = 'http://127.0.0.1:8998/api'
    }
    let apiReq = await fetch(`${apiUrl}/lookup?domain=${encodeURIComponent(domain)}`)
    const json = await apiReq.json()
    if (json.success) {
        return {
            domain,
            success: true,
            ...parseLookup(json)
        }
    }
    return {
        domain,
        ...json
    }
}