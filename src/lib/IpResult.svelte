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
				<div class="labelled-text-wrapper">
					<span class="text-label">Type</span>
					<span class="labelled-text">{ip.type}</span>
				</div>
			{/if}
			{#if ip.hostname}
				<div class="labelled-text-wrapper">
					<span class="text-label">Hostname(s)</span>
					<span class="labelled-text">{ip.hostname}</span>
				</div>
			{/if}
			<div class="labelled-text-wrapper">
				<span class="text-label">Organization</span>
				<span class="labelled-text">{ip.whois.Organization}</span>
			</div>
			{#if ip.whois.Updated}
				<div class="labelled-text-wrapper">
					<span class="text-label">Updated</span>
					<span class="labelled-text">{ip.whois.Updated}</span>
				</div>
			{/if}
			{#if ip.whois.contactAbuse?.OrgAbuseEmail}
				<div class="labelled-text-wrapper">
					<span class="text-label">Abuse Contact</span>
					<span class="labelled-text"
						>{ip.whois.contactAbuse.OrgAbuseEmail}</span
					>
				</div>
			{/if}
			{#if ip.abuse.abuseipdb}
				<div class="labelled-text-wrapper">
					<span class="text-label">AbuseIPDB Reports</span>
					<span class="labelled-text">{ip.abuse.abuseipdb}</span>
				</div>
			{/if}
			{#if ip.abuse.urlhaus}
				<div class="labelled-text-wrapper">
					<span class="text-label">URLHaus Reports</span>
					<span class="labelled-text">{ip.abuse.urlhaus}</span>
				</div>
			{/if}
		{/if}
	</div>
</div>
