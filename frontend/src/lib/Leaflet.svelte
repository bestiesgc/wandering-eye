<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    export let ll
    export let zoom = 4

    let mapElement;
    let map;

    onMount(async () => {
        if(browser) {
            const leaflet = await import('leaflet');

            map = leaflet.map(mapElement).setView(ll, zoom);

            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            leaflet.marker(ll).addTo(map)
                .openPopup();
        }
    });

    onDestroy(async () => {
        if(map) {
            console.log('Unloading Leaflet map.');
            map.remove();
        }
    });
</script>


<div class="leaflet-wrapper">
    <div bind:this={mapElement}></div>
</div>

<style>
    @import 'leaflet/dist/leaflet.css';
</style>
