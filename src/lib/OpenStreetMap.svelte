<script>
	export let query = null
	export let state = null
	export let country = null
	export let city = null
	export let street = null
	export let ll = null

	export let visible = true

	async function getItem(query) {
		if (!query.q) delete query.q
		const hasItem = localStorage.getItem(JSON.stringify(query))
		if (hasItem && hasItem != 'undefined') {
			const item = JSON.parse(hasItem)
			visible = item ? true : false
			return item
		}
		const resp = await fetch(
			`https://nominatim.openstreetmap.org/search?${new URLSearchParams(query)}`
		)
		const item = (await resp.json())[0]
		localStorage.setItem(JSON.stringify(query), JSON.stringify(item))
		visible = item ? true : false
		return item
	}
	let promise
	if (!ll) {
		promise = getItem({
			q: query,
			state,
			country,
			city,
			street,
			format: 'json'
		})
	}
</script>

{#if promise}
	{#await promise}
		<div class="map-wrapper" />
	{:then item}
		{#if item}
			<div class="map-wrapper loaded">
				<iframe
					title={item.display_name ? item.display_name : 'OpenStreetMap'}
					frameborder="0"
					scrolling="no"
					marginheight="0"
					marginwidth="0"
					src="https://www.openstreetmap.org/export/embed.html?bbox={item
						.boundingbox[2]},{item.boundingbox[0]},{item.boundingbox[3]},{item
						.boundingbox[1]}&amp;layer=mapnik"
				/>
			</div>
		{/if}
	{/await}
{:else if ll}
	<div class="map-wrapper loaded">
		<iframe
			title="OpenStreetMap"
			frameborder="0"
			scrolling="no"
			marginheight="0"
			marginwidth="0"
			src="https://www.openstreetmap.org/export/embed.html?bbox={ll[1]},{ll[0]},{ll[1]},{ll[0]}&amp;layer=mapnik"
		/>
	</div>
{/if}

<style>
	.map-wrapper.loaded {
		background-color: var(--grey-300);
		position: relative;
		min-height: 10rem;
	}
	.map-wrapper iframe {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
	}
</style>
