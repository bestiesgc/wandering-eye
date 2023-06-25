<script>
	import DomainResult from '$lib/DomainResult.svelte'
	import IpResult from '$lib/IpResult.svelte'
	export let data
</script>

<div class="result">
	{#if data.isIp}
		<IpResult geo={data.geo} whois={data.whois} />
	{:else}
		<DomainResult whois={data.whois} />
	{/if}
</div>

<style>
	.result {
		max-width: 60rem;
		margin: 0 auto;
	}
</style>
