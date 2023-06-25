<script>
	import { page } from '$app/stores'
</script>

<svelte:head>
	<title>{$page.status} - wandering-eye</title>
</svelte:head>

<div class="error">
	<p class="error-title">{$page.status}: {$page.error.message}</p>
	{#if page.status == 404}
		<p>
			The domain may be available. If you're sure this is an active domain, try
			again in a moment.
		</p>
	{:else}
		<p>Something went wrong.</p>
	{/if}
</div>

<style>
	.error {
		margin: 0 auto;
		width: 100%;
		max-width: 80rem;
	}
	.error-title {
		font-size: 1.5rem;
		font-weight: 600;
	}
</style>
