<script>
	import Accordion from '$lib/Accordion.svelte'
	import AccordionItem from '$lib/AccordionItem.svelte'
	import Timestamp from '$lib/Timestamp.svelte'
	import LinkWithIcon from '$lib/LinkWithIcon.svelte'
	import OpenStreetMap from '$lib/OpenStreetMap.svelte'
	import countrycodes from '$lib/countrycodes.js'
	export let whois
	export let id = ''

	let ownerSectionHasMap = true
</script>

<Accordion>
	<AccordionItem id="{id}info" name="info" open>
		{#if whois['Created Date']}
			<p class="creation-date">
				Registered <Timestamp time={new Date(whois['Created Date'])} />
			</p>
		{/if}
		{#if whois['Expiry Date']}
			<p class="expiration-date">
				Expires <Timestamp time={new Date(whois['Expiry Date'])} />
			</p>
		{/if}
	</AccordionItem>
	{#if whois.Registrar}
		<AccordionItem id="{id}registrar" name="registrar" open>
			<div class="contents">
				{#if whois.Registrar}
					<p class="registrar-name">{whois.Registrar}</p>
				{/if}
				{#if whois['Registrar Abuse Contact Email']}
					<LinkWithIcon
						icon="mail"
						href="mailto:{whois['Registrar Abuse Contact Email']}"
					>
						{whois['Registrar Abuse Contact Email']}
					</LinkWithIcon>
				{/if}
				{#if whois['Registrar Abuse Contact Phone']}
					<LinkWithIcon
						icon="phone"
						href="tel:{whois['Registrar Abuse Contact Phone']}"
					>
						{whois['Registrar Abuse Contact Phone']}
					</LinkWithIcon>
				{/if}
			</div>
		</AccordionItem>
	{/if}
	{#if whois['Registrant Country'] || (whois['Registrant Organization'] ?? whois['Registrant Name'])}
		<AccordionItem id="{id}owner" name="owner" open noPadding>
			<div class="owner-map" class:owner-section-has-map={ownerSectionHasMap}>
				<div class="details">
					{#if whois['Registrant Organization'] ?? whois['Registrant Name']}
						<p class="registrant">
							{whois['Registrant Organization'] ?? whois['Registrant Name']}
						</p>
					{/if}
					{#if whois['Registrant Country']}
						<p class="address">
							{whois['Registrant Street'] ?? ''}
							{whois['Registrant City'] ?? ''}
							{whois['Registrant State/Province'] ?? ''}
							{countrycodes[whois['Registrant Country']]}
						</p>
					{/if}
				</div>
				{#if whois['Registrant Street']}
					<OpenStreetMap
						bind:visible={ownerSectionHasMap}
						street={whois['Registrant Street']}
						city={whois['Registrant City']}
						state={whois['Registrant State/Province']}
						country={countrycodes[whois['Registrant Country']]}
					/>
				{/if}
			</div>
		</AccordionItem>
	{/if}
</Accordion>

<style>
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
	.registrant {
		font-size: 1.5rem;
		font-weight: 500;
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
