<script>
    import lookup from './parseLookup.js'
    import DomainResult from '$lib/DomainResult.svelte'
    import { onMount } from 'svelte';
    let data
    let ready = false
    onMount(async () => {
        let urlObj = new URL(window.location.href)
        data = await lookup(urlObj.searchParams.get('domain'))
        ready = true
    })
</script>



<div class="result-item-list">
    <a class="home-link" href="/">
        <h1>wandering-eye</h1>
    </a>
    {#if ready}
        {#each data.domains as domainResult}
            <DomainResult {domainResult}></DomainResult>
        {/each}
    {:else}
        <p>Loading results</p>
    {/if}
</div>
