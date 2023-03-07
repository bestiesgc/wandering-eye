<script>
	export let domainResult
	import Leaflet from './Leaflet.svelte'
</script>

<div class="result-item">
	<h2>{domainResult.domain}</h2>
	{#if domainResult.whois}
		<h3>Registrar</h3>
		<p>{domainResult.whois['Registrar']}</p>
		<a class="registrar-link" href={domainResult.whois['Registrar URL']}>
			<span class="material-icons"> link </span>
			{domainResult.whois['Registrar URL'].split('://').pop()}
		</a>
		{#if domainResult.whois['Registrar Abuse Contact Email']}
			<a
				class="registrar-link"
				href="mailto:{domainResult.whois['Registrar Abuse Contact Email']}"
			>
				<span class="material-icons"> mail </span>
				{domainResult.whois['Registrar Abuse Contact Email']}
			</a>
		{/if}
		{#if domainResult.whois['Registrar Abuse Contact Phone']}
			<a
				class="registrar-link"
				href="tel:{domainResult.whois['Registrar Abuse Contact Phone']}"
			>
				<span class="material-icons"> phone </span>
				{domainResult.whois['Registrar Abuse Contact Phone']}
			</a>
		{/if}
		<h3>Name Servers</h3>
		<ul class="name-server-list">
			{#each domainResult.whois['Name Server'] as nameServer}
				<li class="name-server">{nameServer}</li>
			{/each}
		</ul>
	{/if}
	{#if domainResult.cname}
		<h3>{'CNAME (alias)'}</h3>
		<ul>
			{#each domainResult.cname as cname}
				<li>{cname}</li>
			{/each}
		</ul>
	{/if}
	<h3>IP Addresses</h3>
	<div class="ip-container-list">
		{#each domainResult.ipAddresses as ip}
			<div class="ip-container" class:has-geo={ip.geo}>
				{#if ip.geo}
					<Leaflet ll={ip.geo.ll} />
				{/if}
				<div class="ip-meta">
					<h4 class="ip-meta_address">{ip.value}</h4>
					{#if ip.whois?.Organization}
						<hr />
						<p>Organization: {ip.whois.Organization}</p>
						{#if ip.whois.Updated}
							<p>Updated: {ip.whois.Updated}</p>
						{/if}
						{#if ip.whois.contactAbuse?.OrgAbuseEmail}
							<p>Abuse Contact: {ip.whois.contactAbuse.OrgAbuseEmail}</p>
						{/if}
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
