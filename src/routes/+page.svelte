<script>
	import { page } from '$app/stores'
	import CenterPage from '$lib/CenterPage.svelte'
	import DomainSearch from '$lib/DomainSearch.svelte'
</script>

<svelte:head>
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.origin} />
	<meta property="twitter:card" content="summary" />
	<meta property="twitter:url" content={$page.url.origin} />
	<title>wandering-eye</title>
	<meta name="title" content="wandering-eye" />
	<meta property="og:title" content="wandering-eye" />
	<meta property="twitter:title" content="wandering-eye" />
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

<CenterPage>
	<h1>wandering-eye</h1>
	<p>easily retrieve information on any domain.</p>
	<DomainSearch />
	<p class="smalltext">
		made with ❤️ by <a href="https://besties.house">besties</a> -
		<a href="https://git.gay/besties/wandering-eye">source</a> -
		<a href="/docs/attributions">attributions</a>
	</p>
</CenterPage>

<style>
	.smalltext {
		font-size: 0.8rem;
		color: var(--grey-300);
	}
</style>
