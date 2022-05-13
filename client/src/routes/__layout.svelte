<script>
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
	// import { onMount } from 'svelte';
	// import {
	// 	defaultEvmStores,
	// 	makeContractStore,
	// 	connected,
	// 	web3,
	// 	selectedAccount,
	// 	chainId,
	// 	chainData
	// } from 'svelte-web3';

	// import NFTmarketplace from '../../../build/contracts/NFTmarketplace.json';
	// //import SimpleStorage from '../../../build/contracts/SimpleStorage.json';
	// // onMount(async () => {
	// // 	try {
	// // 		defaultEvmStores.setProvider();
	// // 		const networkId = await $web3.eth.net.getId();
	// // 		const deployedNetwork = SimpleStorage.networks[networkId];
	// // 		const contract = new $web3.eth.Contract(
	// // 			SimpleStorage.abi,
	// // 			deployedNetwork && deployedNetwork.address
	// // 		);
	// // 		const response = await contract.methods.get().call();
	// // 		console.log(response);
	// // 	} catch (err) {
	// // 		console.error(err);
	// // 	}
	// // });
	// onMount(async () => {
	// 	try {
	// 		const networkId = await $web3.eth.net.getId();
	// 		const deployedNetwork = NFTmarketplace.networks[networkId];
	// 		const contract = new $web3.eth.Contract(
	// 			NFTmarketplace.abi,
	// 			deployedNetwork && deployedNetwork.address
	// 		);
	// 		const response = await contract.methods.get().call();
	// 		console.log(response);
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// });
</script>

<Header />

<main>
	<slot />
</main>

<footer>
	<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
</footer>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
