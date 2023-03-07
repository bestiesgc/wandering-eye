<script>
	import { slide } from 'svelte/transition'
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
	<form {disabled} class="search-input" on:submit={onSubmitWrapper}>
		<input
			{placeholder}
			{pattern}
			type="text"
			bind:value={inputValue}
			on:input={onInput}
		/>
		<button type="submit" disabled={disabled || invalid}>
			<span class="material-icons">
				{iconName}
			</span>
		</button>
	</form>

	{#if invalid && !disabled}
		<div class="warning-message" transition:slide>
			{invalidMessage}
		</div>
	{/if}
</div>
