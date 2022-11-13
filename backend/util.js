const dns = require("node:dns/promises");
const psl = require("psl");
const whois = require("whoiser");
const geoip = require("geoip-lite");

module.exports = {
  lookup: lookup
};

async function lookup(host, ip) {
  let data = {};

  if (ip == true) {
    data["type"] = "ip";
    data["result"] = {};
  } else {
    data["type"] = "domain";
    data["domainResults"] = {};
    data["ipResults"] = {};
  }

  if (ip == false) { // if input isnt an ip lookup
    // dns check
    data.domainResults[host] = {};
    
    let dns = await dnsLookup(host);
    data.domainResults[host].cname = dns.cname;
    
    data.domainResults[host].ipAddresses = [];
    
    if (dns.v4addr) data.domainResults[host].ipAddresses.push(dns.v4addr);
    if (dns.v6addr) data.domainResults[host].ipAddresses.push(dns.v6addr);
    
    // add ip to ipResults
    for (let i in data.domainResults[host].ipAddresses) {
      let ip = data.domainResults[host].ipAddresses[i][0];
      data.ipResults[ip] = {value: ip};
    }

    data.domainResults[host].reason = {code: "query"};

    if (isApex(host)) {
      // includes www.
      let nh = `www.${host}`;
      dns = await dnsLookup(nh);
      data.domainResults[nh] = {};
      data.domainResults[nh].cname = dns.cname;
      
      if (!dns.v4addr && !dns.v6addr) delete data.domainResults[nh].cname;
      else {
        data.domainResults[nh].ipAddresses = [];
        if (dns.v4addr) data.domainResults[nh].ipAddresses.push(dns.v4addr);
        if (dns.v6addr) data.domainResults[nh].ipAddresses.push(dns.v6addr);
        
        for (let i in data.domainResults[nh].ipAddresses) {
          let ip = data.domainResults[nh].ipAddresses[i][0];
          data.ipResults[ip] = {value: ip};
        }

        data.domainResults[nh].reason = {code: "apex-check-www", from: host};
      }
    }

    // maybe include mx lookup too?
    // whois check

    let wi = await whois.domain(host, {follow: 1});
    wi = Object.values(wi)[0]
    data.domainResults[host].whois = wi;

    // add geoip & ip whois values
    let ipArray = Object.values(data.ipResults);
    for (let i in ipArray) {
      ipArray[i].geo = (await geoip.lookup(ipArray[i].value) || null);
      ipArray[i].whois = (await whois.ip(ipArray[i].value) || null);
    }
    
  } else { // if input is an ip lookup
    data.result.geo = (await geoip.lookup(host) || null);
    data.result.whois = (await whois.ip(host) || null);
  }

  return data;
}

async function dnsLookup(host) {
  try {
    dns.setServers([`8.8.8.8`, `1.1.1.1`]); // force servers to google and cloudflare

    let cname;
    try {
      cname = await dns.resolveCname(host);
    } catch(err) {
      cname = null;
    }
    
    let v4addr;
    try {
      v4addr = await dns.resolve4(host);
    } catch(err) {
      v4addr = null;
    }

    let v6addr;
    try {
      v6addr = await dns.resolve6(host);
    } catch(err) {
      v6addr = null;
    }

    return {
      cname, v4addr, v6addr
    }
  } catch(err) {
    throw err;
  }
}

function isApex(host) {
  let parsed = psl.parse(host);
  if (parsed.subdomain == null) return true;
  else return false;
}