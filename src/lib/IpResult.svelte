<script>
	import Accordion from '$lib/Accordion.svelte'
	import AccordionItem from '$lib/AccordionItem.svelte'
	import LinkWithIcon from '$lib/LinkWithIcon.svelte'
	import OpenStreetMap from '$lib/OpenStreetMap.svelte'
	export let whois
	export let geo = null
	export let close = false
	export let id = ''

	let ownerSectionHasMap = true

	const email =
		whois.contactAbuse?.OrgAbuseEmail ??
		whois.contactAbuse?.RAbuseEmail ??
		whois.contactAbuse?.['abuse-mailbox'] ??
		whois['Contact Admin']?.['abuse-mailbox']

	let address =
		whois.organisation?.address ??
		whois.organisation?.Address ??
		whois.contactAbuse?.address

	if (whois.organisation?.City) address += ` ${whois.organisation.City}`
	if (whois.organisation?.StateProv)
		address += ` ${whois.organisation.StateProv}`
	if (whois.organisation?.Country) address += ` ${whois.organisation.Country}`
</script>

<Accordion>
	<AccordionItem id="{id}info" name="info" open={!close}>
		{#if whois.range}
			<p class="range">{whois.range}</p>
		{/if}
		{#if whois.route ?? whois.cidr}
			<p class="block">{whois.route ?? whois.cidr}</p>
		{/if}
	</AccordionItem>
	<AccordionItem id="{id}owner" name="owner" open={!close} noPadding>
		<div class="owner-map" class:owner-section-has-map={ownerSectionHasMap}>
			<div class="details">
				{#if whois.organisation?.['org-name'] ?? whois.organisation?.OrgName}
					<p class="org-name">
						{whois.organisation?.['org-name'] ?? whois.organisation?.OrgName}
					</p>
				{/if}
				{#if whois.asn}
					<p class="org-asn">{whois.asn}</p>
				{/if}
				{#if address}
					<p class="address">{address}</p>
				{/if}
				<LinkWithIcon icon="mail" href="mailto:{email}">{email}</LinkWithIcon>
			</div>
			<OpenStreetMap bind:visible={ownerSectionHasMap} query={address} />
		</div>
	</AccordionItem>
	{#if geo}
		<AccordionItem id="{id}geo" name="geolocation" noPadding>
			<div class="map">
				<OpenStreetMap ll={geo.ll} />
			</div>
		</AccordionItem>
	{/if}
</Accordion>

<style>
	.org-name {
		font-size: 1.5rem;
		font-weight: 500;
		margin-bottom: 0em;
	}
	.org-asn {
		margin: 0.5em 0;
		font-size: 0.75rem;
	}
	.owner-map {
		display: grid;
	}
	.owner-map .details {
		align-self: center;
		margin: 1rem 0.5rem;
	}
	.owner-map :global(.map-wrapper) {
		grid-row: 1;
	}
	.owner-map :global(.map-wrapper.loaded) {
		min-height: 15rem;
	}
	@media screen and (min-width: 600px) {
		.owner-map.owner-section-has-map {
			grid-template-columns: 1fr 1fr;
		}
		.owner-map :global(.map-wrapper) {
			grid-column: 2;
		}
	}
</style>
