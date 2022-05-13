<script>
	import { ethers, Signer } from 'ethers';

	export let address;
	export let abi;
	export let signer;
	export let method;
	export let args;
	export let buttonText = 'Send';

	let transaction;

	$: contract = new ethers.Contract(address, abi, signer);

	function call() {
		transaction = contract[method](...args);
	}

	function reset() {
		transaction = undefined;
	}
</script>

<main>
	{#if transaction}
		{#await transaction}
			Please confirm the transaction.
		{:then result}
			{#await result.wait()}
				Transaction pending...
			{:then receipt}
				<p>Transaction confirmed.</p>
				<p>
					<a
						href="https://ropsten.etherscan.io/tx/{receipt.transactionHash}"
						target="_blank"
						rel="noreferrer noopener">View on Etherscan</a
					>
				</p>
				<slot />
			{:catch error}
				<p>Something went wrong: {error.message}</p>
			{/await}
		{:catch error}
			{#if error.code === 4001}
				<p>Transaction rejected by user.</p>
			{:else}
				<p>Something went wrong: {error.message}</p>
				<p>Do you have WETH on this network?</p>
			{/if}
			<button on:click={reset}>Try again</button>
		{/await}
	{:else}
		<button on:click={call}>{buttonText}</button>
	{/if}
</main>

<style>
	button {
		background: #ff3e00;
		color: white;
		border: none;
		padding: 8px 12px;
		border-radius: 2px;
	}
</style>
