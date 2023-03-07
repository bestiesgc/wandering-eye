<script>
	export let domainResult
	import IpResult from '$lib/IpResult.svelte'
	import LinkWithIcon from '$lib/LinkWithIcon.svelte'
</script>

<div class="result-item">
	<h2>{domainResult.domain}</h2>
	{#if domainResult.whois}
		<h3>Registrar</h3>
		<p>{domainResult.whois['Registrar']}</p>
		<LinkWithIcon
			icon="link"
			class="registrar-link"
			href={domainResult.whois['Registrar URL']}
		>
			{domainResult.whois['Registrar URL'].split('://').pop()}
		</LinkWithIcon>
		{#if domainResult.whois['Registrar Abuse Contact Email']}
			<LinkWithIcon
				icon="mail"
				class="registrar-link"
				href="mailto:{domainResult.whois['Registrar Abuse Contact Email']}"
			>
				{domainResult.whois['Registrar Abuse Contact Email']}
			</LinkWithIcon>
		{/if}
		{#if domainResult.whois['Registrar Abuse Contact Phone']}
			<LinkWithIcon
				icon="phone"
				class="registrar-link"
				href="tel:{domainResult.whois['Registrar Abuse Contact Phone']}"
			>
				{domainResult.whois['Registrar Abuse Contact Phone']}
			</LinkWithIcon>
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
			<IpResult {ip} />
		{/each}
	</div>
</div>
