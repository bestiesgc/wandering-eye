<div class="accordion">
	<slot />
</div>

<style>
	.accordion {
		overflow: hidden;
		border-radius: 0.5rem;
	}
	.accordion > :global(:nth-child(odd)) {
		background-color: var(--lighten-10);
	}
	.accordion > :global(:nth-child(even)) {
		background-color: var(--lighten-15);
	}
</style>
