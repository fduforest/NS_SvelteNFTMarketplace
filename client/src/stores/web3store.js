import { onMount } from 'svelte';
import { writable, get } from 'svelte/store';
import {
	defaultEvmStores,
	makeContractStore,
	connected,
	web3,
	selectedAccount,
	chainId,
	chainData
} from 'svelte-web3';
import NFTmarketplace from '../../../build/contracts/NFTmarketplace.json';
import NFTCollectionFactory from '../../../build/contracts/NFTCollectionFactory.json';
import NFTCollection from '../../../build/contracts/NFTCollectionFactory.json';

const networkId = null;
let NFTCollectionFactoryContract = null;
export let selectedAccountCollections = writable([]);
// export const selectedAccountCollections = writable([]);

//const contract = null;
//export const contract = writable(selectedAccountCollections);

//getContract(async () => {});
/**
 *
 */
export const getSelectedAccountCollections = async () => {
	console.log('getCollections');
	let web3 = null;
	let networkId = null;
	let deployedNetwork = null;
	let contract = null;
	let account = null;
	try {
		web3 = new Web3(window.ethereum);
		networkId = await web3.eth.net.getId();
		console.log('networkId', networkId);
		deployedNetwork = await NFTCollectionFactory.networks[networkId];
		console.log('deployedNetwork', deployedNetwork);
		const accounts = await web3.eth.getAccounts();
		account = accounts[0];

		if (deployedNetwork) {
			contract = await new web3.eth.Contract(
				NFTCollectionFactory.abi,
				deployedNetwork && deployedNetwork.address
			);
			console.log('contract?', contract);
			contract
				.getPastEvents('NFTCollectionCreated', {
					fromBlock: 0,
					toBlock: 'latest'
				})
				.then(function (events) {
					console.log('events?', events);
					events.forEach((event) => {
						console.log('fck ');
						console.log(`past event - collectionName: ${event.returnValues._collectionName}`);
						console.log(`past event - collectionAddress: ${event.returnValues._collectionSymbol}`);
						console.log(`past event - transaction hash: ${event.transactionHash}`);
						console.log(`past event - sender: - ${event.returnValues.sender}`);
						console.log('event.returnValues.sender ', event.returnValues.sender);
						console.log('account ', account);
						if (event.returnValues.sender === account) {
							let selectedAccountCollection = {};
							selectedAccountCollection.collectionName = event.returnValues._collectionName;
							console.log(
								'selectedAccountCollection.collectionName',
								selectedAccountCollection.collectionName
							);
							selectedAccountCollection.collectionSymbol = event.returnValues._collectionSymbol;
							selectedAccountCollection.collectionAddress = event.returnValues._collectionAddress;
							// const collections = get(selectedAccountCollections);
							selectedAccountCollections.update((collections) => [
								...collections,
								selectedAccountCollection
							]);

							console.log(selectedAccountCollections);

							/*selectedAccountCollection.update((col) => [
								...col,
								...[
									{
										collectionName: event.returnValues._collectionName
									}
								]
							]);*/

							//return selectedAccountCollections;
						}
					});
				})
				.catch();
		} else {
			window.alert('Smart contract not deployed to detected network.');
		}
	} catch (err) {
		console.error(err);
	}
};
getSelectedAccountCollections();
// getSelectedAccountCollections().then((response) => {
// 	selectedAccountCollections = response;
// });

export const mint = async (hash, metadata, title, description, price, NFTCollectionAddress) => {
	let web3 = null;
	let networkId = null;
	let deployedNetwork = null;
	let contract = null;
	let account = null;
	console.log('hash', hash);
	console.log('metadata', metadata);
	console.log('title', title);
	console.log('description', description);
	console.log('price', price);
	console.log('NFTCollectionAddress', NFTCollectionAddress);
	try {
		web3 = new Web3(window.ethereum);
		networkId = await web3.eth.net.getId();
		deployedNetwork = await NFTCollection.networks[networkId];
		console.log('MintDeployedNetwork', deployedNetwork);
		const factoryDeployedNetwork = await NFTCollectionFactory.networks[networkId];
		const factoryContract = await new web3.eth.Contract(
			NFTCollectionFactory.abi,
			factoryDeployedNetwork && factoryDeployedNetwork.address
		);
		console.log('factoryDeployedNetwork', factoryDeployedNetwork);
		if (deployedNetwork) {
			contract = await new web3.eth.Contract(NFTCollection.abi, NFTCollectionAddress);
			console.log('NFTCollectioncontract', contract);
			const accounts = await web3.eth.getAccounts();
			account = accounts[0];
			console.log('account', account);
			console.log('MintdeployedNetwork.address', deployedNetwork.address);
			let res = await contract.methods
				.mint(metadata, hash, title, description, price)
				.send({ from: account });
			console.log('mint res', res);
		} else {
			window.alert('Smart contract not deployed to detected network.');
		}
	} catch (err) {
		console.error(err);
	}
};

export const createCollection = async (collectionName, collectionSymbol) => {
	let web3 = null;
	let networkId = null;
	let deployedNetwork = null;
	let contract = null;
	let account = null;
	let NFTCollectionFactoryAddress = null;
	console.log('collectionName', collectionName);
	console.log('collectionSymbol', collectionSymbol);
	try {
		web3 = new Web3(window.ethereum);
		networkId = await web3.eth.net.getId();
		console.log('networkId', networkId);
		deployedNetwork = await NFTCollectionFactory.networks[networkId];
		console.log('deployedNetwork', deployedNetwork);
		if (deployedNetwork) {
			NFTCollectionFactoryAddress = deployedNetwork.address;
			contract = await new web3.eth.Contract(
				NFTCollectionFactory.abi,
				deployedNetwork && deployedNetwork.address
			);
			console.log('contract', contract);
			const accounts = await web3.eth.getAccounts();
			account = accounts[0];
			console.log(account);
			console.log('NFTCollectionFactoryAddress', deployedNetwork.address);
			//let res = await contract.methods.mint(account, hash, metadata).send({ from: account });
			await contract.methods
				.createNFTCollection(collectionName, collectionSymbol)
				.send({ from: account });
			// .then((receipt) => {
			// 	NFTCollectionAddress = receipt;
			// })
			// .catch((e) => {
			// 	if (e.includes('not mined within 50 blocks')) {
			// 		console.log('not mined within 50 blocks');
			// 	}
			// });

			console.log('contract', contract);
		} else {
			window.alert('Smart contract not deployed to detected network.');
		}
	} catch (err) {
		console.error(err);
	}
};
