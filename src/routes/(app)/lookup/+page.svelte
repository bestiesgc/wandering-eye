<script>
	import { page } from '$app/stores'
	import { browser } from '$app/environment'
	import DomainResult from '$lib/DomainResult.svelte'
	import Accordion from '$lib/Accordion.svelte'
	import AccordionItem from '$lib/AccordionItem.svelte'
	import IpResult from '$lib/IpResult.svelte'
	export let data

	let nameservers = null
	let mainIps = null

	async function updateNameservers(list) {
		let ips = []
		if (!browser) return
		if (list?.length > 0) {
			for (const nameserver of list) {
				const resp = await fetch(
					`https://dns.google/resolve?${new URLSearchParams({
						name: nameserver,
						type: 'A'
					})}`
				)
				const { Answer } = await resp.json()
				if (Answer.length > 0) {
					const ipLookup = await fetch(
						`/api/lookup?q=${encodeURIComponent(Answer[0].data)}`
					)
					ips.push({
						fromDomain: Answer[0].name,
						lookup: await ipLookup.json()
					})
				}
			}
			if (ips.length == 0) {
				return
			}
			return ips
		}
	}

	$: {
		if (!data.isIp) {
			nameservers = updateNameservers(data.whois['Name Server'])
			mainIps = updateNameservers([data.query])
		}
	}
</script>

<svelte:head>
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.origin} />
	<meta property="twitter:card" content="summary" />
	<meta property="twitter:url" content={$page.url.origin} />
	<title>{data.query} - wandering-eye</title>
	<meta name="title" content="{data.query} - wandering-eye" />
	<meta property="og:title" content="{data.query} - wandering-eye" />
	<meta property="twitter:title" content="{data.query} - wandering-eye" />
	<meta name="description" content="Easily find information on any domain." />
	<meta
		property="og:description"
		content="Easily find information on any domain."
	/>
	<meta
		property="twitter:description"
		content="Easily find information on any domain."
	/>
</svelte:head>

<div class="results" class:results-has-nameservers={nameservers}>
	<div class="main-result">
		<div class="item">
			{#if data.isIp}
				<IpResult id="mainresult" geo={data.geo} whois={data.whois} />
			{:else}
				<p class="list-title">{data.whois['Domain Name']}</p>
				<DomainResult id="mainresult" whois={data.whois} />
			{/if}
		</div>
		{#if mainIps}
			{#await mainIps}
				<div class="main-result-ips">
					<p class="list-title">{data.query}'s A records</p>
					<p>loading...</p>
				</div>
			{:then mainIps}
				<div class="main-result-ips">
					<p class="list-title">{data.query}'s A records</p>
					<Accordion>
						{#each mainIps as ip, i}
							<AccordionItem
								id="accordion-main-result-ips-{i}"
								name="Server {i + 1}"
								open={i == 0}
							>
								<IpResult
									id="main-result-ips-{i}"
									geo={ip.lookup.geo}
									whois={ip.lookup.whois}
									close={i != 0}
								/>
							</AccordionItem>
						{/each}
					</Accordion>
				</div>
			{/await}
		{/if}
	</div>
	{#if nameservers}
		{#await nameservers}
			<div class="nameservers">
				<p class="list-title">nameservers</p>
				<p>loading...</p>
			</div>
		{:then nameservers}
			<div class="nameservers">
				<p class="list-title">nameservers</p>
				{#if nameservers.length > 0}
					<Accordion>
						{#each nameservers as nameserver, i}
							<AccordionItem
								id="accordion-nameserver-ip-{i}"
								name={nameserver.fromDomain}
								open={i == 0}
							>
								<IpResult
									id="nameserver-ip-{i}"
									geo={nameserver.lookup.geo}
									whois={nameserver.lookup.whois}
									close={i != 0}
								/>
							</AccordionItem>
						{/each}
					</Accordion>
				{/if}
			</div>
		{/await}
	{/if}
</div>

<style>
	.results {
		display: grid;
		justify-items: center;
		gap: 2rem;
		margin: 0 auto;
		max-width: 80rem;
	}
	@media screen and (min-width: 1200px) {
		.results-has-nameservers {
			grid-template-columns: 1fr 30rem;
		}
	}
	.item {
		width: 100%;
	}
	.main-result {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
	}
	.nameservers {
		width: 100%;
	}
	.list-title {
		font-size: 1.5rem;
		font-weight: 600;
	}
</style>
