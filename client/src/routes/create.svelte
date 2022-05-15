<script context="module">
	import { browser, dev } from '$app/env';
	import Premint from '../lib/components/forms/CreateForm.svelte';
</script>

<svelte:head>
	<title>Premint</title>
</svelte:head>

<div class="content">
	<h1>Create</h1>
	<CreateForm />
</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
</style>
