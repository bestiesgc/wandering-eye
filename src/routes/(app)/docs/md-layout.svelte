<script>
	export let title = null
	export let description = null
	export let image = null
	import { page } from '$app/stores'
</script>

<svelte:head>
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.origin} />
	<meta property="twitter:card" content="summary" />
	<meta property="twitter:url" content={$page.url.origin} />

	{#if title}
		<title>{title} - wandering-eye docs</title>
		<meta name="title" content="{title} - wandering-eye docs" />
		<meta
			property="og:title"
			content="Meta Tags — Preview, Edit and Generate"
		/>
		<meta
			property="twitter:title"
			content="Meta Tags — Preview, Edit and Generate"
		/>
	{:else}
		<title>wandering-eye docs</title>
		<meta name="title" content="wandering-eye docs" />
		<meta property="og:title" content="wandering-eye docs" />
		<meta property="twitter:title" content="wandering-eye docs" />
	{/if}
	<meta
		name="description"
		content={description ?? 'Easily find information on any domain.'}
	/>
	<meta
		property="og:description"
		content={description ?? 'Easily find information on any domain.'}
	/>
	<meta
		property="twitter:description"
		content={description ?? 'Easily find information on any domain.'}
	/>
	{#if image}
		<meta property="og:image" content={image} />
		<meta property="twitter:image" content={image} />
	{/if}
</svelte:head>

<div class="article-wrapper">
	<nav aria-label="secondary">
		<p class="list-title">docs</p>
		{#each $page.data.articles as article}
			<a href={article.path} class:current={$page.url.pathname == article.path}
				>{article.title}</a
			>
		{/each}
	</nav>
	<article>
		<slot />
	</article>
</div>

<style>
	.article-wrapper {
		display: grid;
		gap: 1rem;
		max-width: 60rem;
		margin: 1rem auto;
	}
	@media screen and (min-width: 600px) {
		.article-wrapper {
			grid-template-columns: max-content 1fr;
			gap: 2rem;
		}
	}
	nav {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	nav .list-title {
		font-size: 1.5rem;
		font-weight: 500;
		margin: 0;
	}
	nav a,
	:global(.link-list a) {
		user-select: none;
		background-color: var(--grey-400);
		text-decoration: none;
		border-radius: 1rem;
		padding: 0.25rem 0.5rem;
		transition: 200ms var(--ease-in);
	}
	nav a:hover,
	:global(.link-list a:hover) {
		background-color: var(--grey-300);
	}
	nav a.current {
		background-color: var(--grey-200);
		color: var(--grey-500);
	}
	article {
		width: 100%;
	}
</style>
