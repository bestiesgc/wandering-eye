<script>
	import Accordion from '$lib/Accordion.svelte'
	import AccordionItem from '$lib/AccordionItem.svelte'
	import LinkWithIcon from '$lib/LinkWithIcon.svelte'
	import OpenStreetMap from '$lib/OpenStreetMap.svelte'
	export let whois
	export let geo = null

	let duplicatedEntries1 = (whois.org ?? whois.country)?.split(' ').length ?? 1
	let duplicatedEntries2 = whois.mntRef?.split(' ').length ?? 1
	console.log(duplicatedEntries1)

	const email = (whois.abuseMailbox ?? whois.orgAbuseEmail)?.split(' ')[0]

	// TODO:
	// So, whois.address entries are duplicated in whois-json output
	// I tried fixing this with a .slice based on the calculated length of one individual part, but
	// it turns out the duplicates aren't quite the same sometimes.
	// fixing might require a PR to whois-json, ill be looking into this later
	// for now, borked addresses
	let address = whois.address
	if (whois.city) {
		address += ' ' + whois.city
	}
	if (whois.stateProv) {
		address += ' ' + whois.stateProv
	}
	if (whois.country) {
		address += ' ' + whois.country
	}
</script>

<Accordion>
	<AccordionItem id="info" name="Info" open>
		{#if whois.inetnum}
			<p class="range">{whois.inetnum}</p>
		{/if}
		<p class="block">{whois.route ?? whois.cidr}</p>
	</AccordionItem>
	<AccordionItem id="owner" name="Owner" noPadding>
		<div class="owner-map">
			<div class="details">
				<p class="org-name">
					{whois.orgName.slice(0, whois.orgName.length / duplicatedEntries2)}
				</p>
				<p class="address">{address}</p>
				<LinkWithIcon icon="mail" href="mailto:{email}">{email}</LinkWithIcon>
			</div>
			<div class="map">
				<OpenStreetMap query={address} />
			</div>
		</div>
	</AccordionItem>
	{#if geo}
		<AccordionItem id="geo" name="Geo location" noPadding>
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
		margin-bottom: 0.5rem;
	}
	.owner-map {
		display: grid;
	}
	.owner-map .details {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.5rem;
		padding: 1rem 0.5rem;
	}
	.owner-map .details p {
		margin: 0;
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
			grid-template-columns: 20rem 1fr;
		}
		.owner-map .map {
			grid-column: 2;
		}
	}
</style>
