<script>
    import { browser } from '$app/environment'
    import { page } from '$app/stores'
    import CenterPage from '$lib/CenterPage.svelte'
    import DomainSearch from '$lib/DomainSearch.svelte'
    import DomainResult from '$lib/DomainResult.svelte'
    let data
    let domain
    $: {
        domain = $page.url.searchParams.get('domain')
        loadDomain()
    }
    let ready = false
    let success = false
    async function loadDomain() {
        ready = false
        if (browser) {
            let apiReq = await fetch(`/api/lookup?domain=${encodeURIComponent(domain)}`)
            const json = await apiReq.json()
            if (apiReq.ok) success = true
            data = json
            ready = true
        }
    }
</script>

<CenterPage class="results-page">
    <a class="home-link" href="/">
        <h1>wandering-eye</h1>
    </a>
    {#key domain}
        <DomainSearch value={domain}></DomainSearch>
    {/key}
    {#if ready}
        {#if success===true}
            <div class="result-item-list">
                {#each data.domainResults as domainResult}
                    <DomainResult {domainResult}></DomainResult>
                {/each}
            </div>
        {:else}
            <div class="warning-message">
                <p>{data.message}</p>
                {#if data.errorCode==='internal'}
                    <button on:click={loadDomain}>Try again</button>
                {/if}
            </div>
        {/if}
    {:else}
        <p>Loading results</p>
    {/if}
    
</CenterPage>