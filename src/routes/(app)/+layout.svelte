<script>
	import DomainSearch from '../../lib/DomainSearch.svelte'
	import { page } from '$app/stores'
	import EyeIcon from '$lib/Icons/eye.svg'
</script>

<nav>
	<a href="/" class="logo"><EyeIcon /></a>
	<DomainSearch value={$page.data.query} />
	<span class="end" />
</nav>

<div class="app">
	<slot />
</div>

<style>
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem;
	}
	.logo,
	.end {
		display: grid;
		width: 2rem;
		height: 2rem;
		place-items: center;
	}
	.app {
		padding: 0.5rem;
	}
	nav :global(.search-input-container) {
		width: 50%;
		max-width: 30rem;
	}
</style>
