<script>
	let classList = ''
	export { classList as class }
</script>

<div class="center-page-container {classList}">
	<div class="center-page-contents">
		<slot />
	</div>
</div>

<style>
	.center-page-container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem;
		min-height: 100vh;
		min-height: 100svh;
	}
</style>
