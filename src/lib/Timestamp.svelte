<script>
	export let time = new Date()
	const options = {
		dateStyle: 'long'
	}
</script>

{time.toLocaleDateString(undefined, options)}
