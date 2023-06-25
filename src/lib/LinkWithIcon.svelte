<script>
	let classList = ''
	export let href
	export let icon
	export { classList as class }
</script>

<a class="link-with-icon {classList}" {href}>
	<span class="material-icons" aria-hidden="true">{icon}</span>
	<span class="text">
		<slot />
	</span>
</a>

<style>
	.link-with-icon {
		width: fit-content;
		display: grid;
		grid-template-columns: min-content 1fr;
		align-items: center;
		text-decoration: none;
		gap: 0.5rem;
	}
	.link-with-icon:hover .text {
		text-decoration: underline;
	}
	.text {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
