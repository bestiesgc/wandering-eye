<script>
    import { browser } from '$app/environment';
    import { page } from '$app/stores'
    import lookup from './parseLookup.js'
    import DomainSearch from '$lib/DomainSearch.svelte'
    import DomainResult from '$lib/DomainResult.svelte'
    let data
    let domain
    $: {
        domain = $page.url.searchParams.get('domain')
        loadDomain()
    }
    let ready = false
    async function loadDomain() {
        ready = false
        if (browser) {
            data = await lookup(domain)
            console.log('data', data)
            ready = true
        }
    }
</script>



<div class="result-item-list">
    <a class="home-link" href="/">
        <h1>wandering-eye</h1>
    </a>
    {#key domain}
        <DomainSearch value={domain}></DomainSearch>
    {/key}
    {#if ready}
        {#if data.success===true}
            {#each data.domains as domainResult}
                <DomainResult {domainResult}></DomainResult>
            {/each}
        {:else}
            <div class="warning-message">
                <h2>Error</h2>
                <p>{data.message}</p>
            </div>
        {/if}
    {:else}
        <p>Loading results</p>
    {/if}
</div>
