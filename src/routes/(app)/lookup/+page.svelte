<script>
	import DomainResult from '$lib/DomainResult.svelte'
	import Accordion from '$lib/Accordion.svelte'
	import AccordionItem from '$lib/AccordionItem.svelte'
	import IpResult from '$lib/IpResult.svelte'
	import { onMount } from 'svelte'
	export let data

	let nameservers = null

	onMount(async () => {
		if (data.whois['Name Server']?.length > 0) {
			nameservers = []
			for (let nameserver of data.whois['Name Server']) {
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
					nameservers.push({
						fromDomain: Answer[0].name,
						lookup: await ipLookup.json()
					})
				}
			}
			if (nameservers.length == 0) {
				nameservers = null
				return
			}
			nameservers = nameservers
		}
	})
</script>

<div class="results" class:results-has-nameservers={nameservers}>
	<div class="main-result">
		{#if data.isIp}
			<div class="item">
				<IpResult geo={data.geo} whois={data.whois} />
			</div>
		{:else if data.whois['Domain Name']}
			<div class="item">
				<p class="list-title">{data.whois['Domain Name']}</p>
				<DomainResult whois={data.whois} />
			</div>
		{:else}
			<div class="item">
				<p class="list-title">Couldn't find this domain.</p>
				<p>it may be available?</p>
			</div>
		{/if}
	</div>
	{#if nameservers}
		<div class="nameservers">
			<p class="list-title">nameservers</p>
			{#if nameservers.length > 0}
				<Accordion>
					{#each nameservers as nameserver}
						<AccordionItem name={nameserver.fromDomain} open>
							<IpResult
								geo={nameserver.lookup.geo}
								whois={nameserver.lookup.whois}
								close={true}
							/>
						</AccordionItem>
					{/each}
				</Accordion>
			{:else}
				<p>loading...</p>
			{/if}
		</div>
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
