<script>
	import { page } from '$app/stores'
	import MdLayout from './md-layout.svelte'
</script>

<MdLayout title="{$page.status} - wandering-eye docs">
	<h1>{$page.status}: {$page.error.message}</h1>
</MdLayout>
