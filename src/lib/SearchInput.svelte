<script>
	import { fly } from 'svelte/transition'
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()
	export let onSubmit = null
	export let pattern = undefined
	export let placeholder = ''
	export let invalidMessage = 'Input is invalid'
	export let value = undefined
	let inputValue = value ?? undefined
	let iconName = 'search'

	let disabled = true
	let invalid = false

	$: {
		disabled = inputValue === undefined || inputValue === ''
	}

	function onInput(e) {
		invalid = !new RegExp(pattern).test(inputValue)
		dispatch('input', e)
	}
	async function onSubmitWrapper(e) {
		e.preventDefault()
		iconName = 'hourglass_empty'
		dispatch('submit', { value: inputValue, ...e })
		value = inputValue
		await onSubmit?.({ value: inputValue, ...e })
		iconName = 'search'
	}
</script>

<div class="search-input-container">
	<form
		{disabled}
		class="search-input"
		class:invalid
		on:submit={onSubmitWrapper}
	>
		<div class="input-wrapper">
			<input
				{placeholder}
				{pattern}
				type="text"
				bind:value={inputValue}
				on:input={onInput}
			/>
		</div>
		<button type="submit" disabled={disabled || invalid}>
			<span class="material-icons">
				{iconName}
			</span>
		</button>
	</form>

	{#if invalid && !disabled}
		<div class="warning-message" transition:fly={{ y: -10 }}>
			{invalidMessage}
		</div>
	{/if}
</div>

<style>
	.search-input-container {
		position: relative;
	}

	.search-input {
		position: relative;
		--background: var(--grey-400);
		background: var(--background);
		display: grid;
		grid-template-columns: 1fr 2rem;
		border-radius: 2rem;
		overflow: hidden;
	}

	input,
	button {
		padding: 0.25rem 0.5rem;
	}

	.input-wrapper {
		min-width: 0;
		position: relative;
	}
	.input-wrapper::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: 1rem;
		background-image: linear-gradient(to left, var(--background), transparent);
	}

	.search-input input {
		padding-right: 0;
		min-width: 0;
		width: 100%;
		transition: border-bottom-width 100ms;
	}

	.search-input input:focus {
		outline: none;
	}

	.search-input.invalid {
		--background: var(--red-100);
	}

	.search-input::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2px;
		background-color: currentColor;
		opacity: 0;
		transform: scaleX(0);
		transition: transform 200ms;
		transition-timing-function: var(--ease-in);
	}

	.search-input:focus-within::after {
		transform: scaleX(1);
		opacity: 1;
	}

	.search-input button {
		display: grid;
		place-items: center;
		cursor: pointer;
		transition: background-color 200ms;
		transition-timing-function: var(--ease-in);
		user-select: none;
		border-radius: 2rem;
		border: 1px solid transparent;
	}

	.search-input button:focus-visible {
		outline: none;
		background-color: var(--lighten-40);
	}

	.search-input button[disabled] {
		cursor: not-allowed;
	}

	.search-input button .material-icons {
		text-decoration: none;
		transition: transform 200ms;
		transition-timing-function: var(--ease-in);
	}

	.search-input button:not([disabled]):hover {
		background-color: var(--lighten-20);
	}

	.search-input button:not([disabled]):hover .material-icons {
		transform: scale(1.2) rotate(5deg);
	}

	.warning-message {
		position: absolute;
		left: 0;
		right: 0;
		padding: 0.25rem 0.5rem;
		background-color: var(--red-400);
		border-radius: 5rem;
		margin: 0.4rem 0;
	}
</style>
