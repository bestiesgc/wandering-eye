<script>
    export let domainResult
    import Leaflet from './Leaflet.svelte';
    // import {onMount} from 'svelte'
    // let Leaflet = null
    // onMount(async () => {
    //     Leaflet = await import('$lib/Leaflet.svelte')
    // })
</script>

<div class="result-item">
    <h2>{domainResult.domain}</h2>
    {#if domainResult.whois}
        <h3>Registrar</h3>
        <a class="registrar-link" href={domainResult.whois['Registrar URL']}>
            <span class="material-icons">
                link
            </span>
            {domainResult.whois['Registrar']}
        </a>
        <h3>Name Servers</h3>
        <ul class="name-server-list">
            {#each domainResult.whois['Name Server'] as nameServer}
                <li class="name-server">{nameServer}</li>
            {/each}
        </ul>
    {/if}
    <h3>IP Addresses</h3>
    <div class="ip-container-list">
        {#each domainResult.ipAddresses as ip}
            <div class="ip-container">
                {#if ip.geo}
                    <Leaflet ll={ip.geo.ll}></Leaflet>
                {/if}
                <div class="ip-meta">
                    <h4 class="ip-meta_address">{ip.value}</h4>
                    <p>Organization: {ip.whois.Organization}</p>
                    <p>Updated: {ip.whois.Updated}</p>
                    <p>Abuse Contact: {ip.whois.contactAbuse.OrgAbuseEmail}</p>
                </div>
            </div>
        {/each}
    </div>
</div>