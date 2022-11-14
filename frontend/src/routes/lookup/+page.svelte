<script>
    import { browser } from '$app/environment';
    import { page } from '$app/stores'
    import lookup from './parseLookup.js'
    import DomainSearch from '$lib/DomainSearch.svelte'
    import DomainResult from '$lib/DomainResult.svelte'
    import { onMount } from 'svelte'
    let data
    let domain
    $: {
        domain = $page.url.searchParams.get('domain')
        loadDomain()
    }
    let ready = false
    async function loadDomain() {
        if (browser) {
            ready = false
            data = await lookup(domain)
            ready = true
        }
    }
    onMount(async () => {
        await loadDomain()
    })
</script>



<div class="result-item-list">
    <a class="home-link" href="/">
        <h1>wandering-eye</h1>
    </a>
    {#key domain}
        <DomainSearch value={domain}></DomainSearch>
    {/key}
    {#if ready}
        {#each data.domains as domainResult}
            <DomainResult {domainResult}></DomainResult>
        {/each}
    {:else}
        <p>Loading results</p>
    {/if}
</div>
