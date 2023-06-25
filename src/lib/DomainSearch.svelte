<script>
	import { goto } from '$app/navigation'
	import SearchInput from '$lib/SearchInput.svelte'
	export let value = undefined
	async function lookupDomain(e) {
		await goto(`/lookup?q=${encodeURIComponent(e.value)}`)
	}
</script>

<SearchInput
	bind:value
	onSubmit={lookupDomain}
	pattern="(\S+\.)+\S\S+"
	placeholder="example.com"
	invalidMessage="Input is not a valid domain"
/>
