<script>
	import Accordion from '$lib/Accordion.svelte'
	import AccordionItem from '$lib/AccordionItem.svelte'
	import LinkWithIcon from '$lib/LinkWithIcon.svelte'
	import OpenStreetMap from '$lib/OpenStreetMap.svelte'
	export let whois
	export let geo = null
	export let close = false

	const email =
		whois.contactAbuse?.OrgAbuseEmail ??
		whois.contactAbuse?.RAbuseEmail ??
		whois['Contact Admin']['abuse-mailbox']

	let address = whois.organisation.address ?? whois.organisation.Address

	if (whois.organisation.City) address += ` ${whois.organisation.City}`
	if (whois.organisation.StateProv)
		address += ` ${whois.organisation.StateProv}`
	if (whois.organisation.Country) address += ` ${whois.organisation.Country}`
</script>

<Accordion>
	<AccordionItem id="info" name="info" open={!close}>
		{#if whois.range}
			<p class="range">{whois.range}</p>
		{/if}
		<p class="block">{whois.route ?? whois.cidr}</p>
	</AccordionItem>
	<AccordionItem id="owner" name="owner" open={!close} noPadding>
		<div class="owner-map">
			<div class="details">
				<p class="org-name">
					{whois.organisation['org-name'] ?? whois.organisation.OrgName}
				</p>
				{#if whois.asn != ''}
					<p class="org-asn">{whois.asn}</p>
				{/if}
				<p class="address">{address}</p>
				<LinkWithIcon icon="mail" href="mailto:{email}">{email}</LinkWithIcon>
			</div>
			<div class="map">
				<OpenStreetMap query={address} />
			</div>
		</div>
	</AccordionItem>
	{#if geo}
		<AccordionItem id="geo" name="geolocation" noPadding>
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
		/* gap: 0.5rem; */
		margin: 1rem 0.5rem;
	}
	.map {
		height: 100%;
		min-height: 15rem;
	}
	.map :global(.map-wrapper) {
		height: 100%;
	}
	.owner-map .map {
		grid-row: 1;
	}
	@media screen and (min-width: 600px) {
		.owner-map:has(.map) {
			grid-template-columns: 1fr 1fr;
		}
		.owner-map .map {
			grid-column: 2;
		}
	}
</style>
