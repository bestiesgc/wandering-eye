<script>
	import { slide } from 'svelte/transition'
	export let id
	export let name
	export let open = false
	let loaded = open
	$: {
		if (open) loaded = true
	}
	export let noPadding = false
</script>

<div class="accordion-item">
	<button
		aria-expanded={open}
		aria-controls="{id}-contents"
		on:click={() => (open = !open)}
	>
		<span class="accordion-name">{name}</span>
		<span class="open-indicator material-icons" aria-hidden="true">
			{open ? 'remove' : 'add'}
		</span>
	</button>
	<div
		id="{id}-contents"
		class="accordion-contents-wrapper"
		class:closed={!open}
	>
		{#if loaded}
			<div
				class="accordion-contents"
				class:no-padding={noPadding}
				transition:slide|local={{ duration: 100 }}
			>
				<slot />
			</div>
		{/if}
	</div>
</div>

<style>
	.accordion-item {
		display: grid;
		grid-template-rows: 3rem 1fr;
	}
	button {
		display: flex;
		align-items: center;
		justify-content: space-between;
		user-select: none;
		cursor: pointer;
		font-size: 1.5rem;
		font-weight: 500;
		padding: 0.25rem 0.5rem;
	}
	button:focus-visible {
		outline: none;
		background-color: var(--lighten-10);
	}
	.open-indicator {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
	}
	.accordion-contents-wrapper {
		display: grid;
		grid-template-rows: 1fr;
		transition: grid-template-rows 100ms;
	}
	.accordion-contents {
		overflow: hidden;
		padding: 1rem 0.5rem;
		background-color: rgb(0 0 0 / 0.25);
		min-height: 0;
		transition: padding 100ms;
	}
	.closed {
		grid-template-rows: 0fr;
	}
	.closed .accordion-contents {
		visibility: hidden;
		padding-block: 0;
		transition: padding 100ms, visibility 0ms 100ms;
	}
	.no-padding {
		padding: 0;
	}
</style>
