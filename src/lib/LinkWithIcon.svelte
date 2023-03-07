<script>
	let classList = ''
	export let href
	export let icon
	export { classList as class }
</script>

<a class="link-with-icon {classList}" {href}>
	<span class="material-icons">{icon}</span>
	<span class="link-with-icon__text">
		<slot />
	</span>
</a>
