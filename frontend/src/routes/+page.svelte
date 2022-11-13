<script>
    import { goto } from '$app/navigation';
    import CenterPage from '$lib/CenterPage.svelte'
    import SearchInput from '$lib/SearchInput.svelte'
    async function lookupDomain(e) {
        await goto(`/lookup?domain=${encodeURIComponent(e.value)}`)
    }
</script>

<CenterPage>
    <h1>wandering-eye</h1>
    <p>Easily retrieve information on any domain.</p>
    <br>
    <SearchInput onSubmit={lookupDomain} pattern="(\S+\.)+\S\S+" placeholder="example.com" invalidMessage="Input is not a valid domain"></SearchInput>
    <br>
    <p class="smalltext">service by <a href="https://besties.house">besties</a> - <a href="https://git.gay/besties/wandering-eye">source</a></p>
</CenterPage>