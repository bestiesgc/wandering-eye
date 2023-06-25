<script>
	import Accordion from '$lib/Accordion.svelte'
	import AccordionItem from '$lib/AccordionItem.svelte'
	import Timestamp from '$lib/Timestamp.svelte'
	import LinkWithIcon from '$lib/LinkWithIcon.svelte'
	import OpenStreetMap from '$lib/OpenStreetMap.svelte'
	import countrycodes from '$lib/countrycodes.js'
	export let whois
</script>

<Accordion>
	<AccordionItem id="info" name="Info" open>
		{#if whois.creationDate ?? whois.created}
			<p class="creation-date">
				Registered <Timestamp
					time={new Date(whois.creationDate ?? whois.created)}
				/>
			</p>
		{/if}
		{#if whois.registrarRegistrationExpirationDate ?? whois.expiryDate}
			<p class="expiration-date">
				Expires <Timestamp
					time={new Date(
						whois.registrarRegistrationExpirationDate ?? whois.expiryDate
					)}
				/>
			</p>
		{/if}
	</AccordionItem>
	{#if whois.registrar}
		<AccordionItem id="registrar" name="Registrar" open>
			<div class="contents">
				{#if whois.registrar}
					<p class="registrar-name">{whois.registrar}</p>
				{/if}
				{#if whois.registrarAbuseContactEmail}
					<LinkWithIcon
						icon="mail"
						href="mailto:{whois.registrarAbuseContactEmail}"
					>
						{whois.registrarAbuseContactEmail}
					</LinkWithIcon>
				{/if}
				{#if whois.registrarAbuseContactPhone}
					<LinkWithIcon
						icon="phone"
						href="tel:{whois.registrarAbuseContactPhone}"
					>
						{whois.registrarAbuseContactPhone}
					</LinkWithIcon>
				{/if}
			</div>
		</AccordionItem>
	{/if}
	{#if whois.registrantCountry || (whois.registrantOrganization ?? whois.registrantName ?? whois.organisation)}
		<AccordionItem id="owner" name="Owner" noPadding>
			<div class="owner-map">
				<div class="details">
					{#if whois.registrantOrganization ?? whois.registrantName ?? whois.organisation}
						<p class="registrant">
							{whois.registrantOrganization ??
								whois.registrantName ??
								whois.organisation}
						</p>
					{/if}
					{#if whois.registrantCountry}
						<p class="address">
							{whois.registrantStreet ?? ''}
							{whois.registrantCity ?? ''}
							{whois.registrantStateProvince ?? ''}
							{countrycodes[whois.registrantCountry]}
						</p>
					{/if}
				</div>
				{#if whois.registrantStreet}
					<div class="map">
						<OpenStreetMap
							street={whois.registrantStreet}
							city={whois.registrantCity}
							state={whois.registrantStateProvince}
							country={countrycodes[whois.registrantCountry]}
						/>
					</div>
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
	.owner-map .map {
		grid-row: 1;
	}
	.map {
		min-height: 15rem;
	}
	.map :global(.map-wrapper) {
		height: 100%;
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
