<script>
	import Leaflet from './Leaflet.svelte'
	export let ip
</script>

<div class="ip-container" class:has-geo={ip.geo}>
	{#if ip.geo}
		<Leaflet ll={ip.geo.ll} />
	{/if}
	<div class="ip-meta">
		<h4 class="ip-meta_address">{ip.value}</h4>
		{#if ip.whois?.Organization}
			<hr />
			{#if ip.type}
				<p><b>Type</b>: {ip.type}</p>
			{/if}
			{#if ip.hostname}
				<p><b>Hostname(s)</b>: {ip.hostname}</p>
			{/if}
			<p><b>Organization</b>: {ip.whois.Organization}</p>
			{#if ip.whois.Updated}
				<p><b>Updated</b>: {ip.whois.Updated}</p>
			{/if}
			{#if ip.whois.contactAbuse?.OrgAbuseEmail}
				<p><b>Abuse Contact</b>: {ip.whois.contactAbuse.OrgAbuseEmail}</p>
			{/if}
			{#if ip.abuse.abuseipdb}
				<p><b>AbuseIPDB Reports</b>: {ip.abuse.abuseipdb}</p>
			{/if}
			{#if ip.abuse.abuseipdb}
				<p><b>URLHaus Reports</b>: {ip.abuse.urlhaus}</p>
			{/if}
		{/if}
	</div>
</div>
