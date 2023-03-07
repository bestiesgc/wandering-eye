<script>
	import CenterPage from '$lib/CenterPage.svelte'
	import DomainSearch from '$lib/DomainSearch.svelte'
</script>

<svelte:head>
	<title>wandering-eye</title>
</svelte:head>

<CenterPage>
	<h1>wandering-eye</h1>
	<p>Easily retrieve information on any domain.</p>
	<br />
	<DomainSearch />
	<br />
	<p class="smalltext">
		service by <a href="https://besties.house">besties</a> -
		<a href="https://git.gay/besties/wandering-eye">source</a>
	</p>
</CenterPage>
