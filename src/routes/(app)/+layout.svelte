<script>
	import DomainSearch from '../../lib/DomainSearch.svelte'
	import { page } from '$app/stores'
	import EyeIcon from '$lib/Icons/eye.svg'
</script>

<div class="layout">
	<nav>
		<a href="/" class="logo"><EyeIcon /></a>
		<DomainSearch value={$page.data.query} />
		<span class="end" />
	</nav>
	<div class="app">
		<slot />
	</div>
	<footer>
		<span class="left">
			made with ❤️ by <a href="https://besties.house">besties</a>
		</span>
		<span class="right">
			<a href="https://git.gay/besties/wandering-eye">source code</a> -
			<a href="/docs/attributions">attributions</a>
		</span>
	</footer>
</div>

<style>
	.layout {
		min-height: 100vh;
		min-height: 100svh;
		display: grid;
		grid-template-rows: min-content 1fr min-content;
	}
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem;
	}
	footer {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem;
		font-size: 0.8rem;
		color: var(--grey-300);
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
