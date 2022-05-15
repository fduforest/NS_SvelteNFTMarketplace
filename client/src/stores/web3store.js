import { writable } from 'svelte/store';
import axios from 'axios';
import NFTCollectionFactory from '../../../build/contracts/NFTCollectionFactory.json';
import NFTCollection from '../../../build/contracts/NFTCollection.json';
export let selectedAccountCollections = writable([]);
// export let web3 = writable([]);
// export let NFTCollectionFactoryContract = writable([]);
// export let accounts = writable([]);
// export let account = writable([]);
const etherscanAPI = 'https://api-ropsten.etherscan.io/api';
const etherscanAPIKey = '6RFWHQUD1QJ2YP74ZCWBAW8HRH6G3EMK1Z';
export let web3 = null;
export let NFTCollectionFactoryContract = null;
export let accounts = null;
export let account = null;
const ipfsGateway = 'https://gateway.pinata.cloud/ipfs/' || 'https://ipfs.io/ipfs/';

try {
	web3 = new Web3(window.ethereum);
	accounts = await web3.eth.getAccounts();
	account = accounts[0];
	const networkId = await web3.eth.net.getId();
	console.log('networkId', networkId);
	const deployedNetwork = await NFTCollectionFactory.networks[networkId];
	if (deployedNetwork) {
		NFTCollectionFactoryContract = await new web3.eth.Contract(
			NFTCollectionFactory.abi,
			deployedNetwork && deployedNetwork.address
		);
	} else {
		window.alert('Smart contract not deployed to detected network.');
	}
} catch (err) {
	console.error(err);
}

export const getOwnedNFTs = async () => {
	try {
		const res = await axios.get(etherscanAPI, {
			params: { module: 'account', action: 'tokennfttx', address: account, apikey: etherscanAPIKey }
		});
		let collections = [];
		let contractAdresses = [];
		for (let i = 0; i < res.data.result.length; i++) {
			let NFTCollectionAddress = res.data.result[i].contractAddress;
			let NFTCollectionName = res.data.result[i].tokenName;
			let tokenID = res.data.result[i].tokenID;
			let contract = await new web3.eth.Contract(NFTCollection.abi, NFTCollectionAddress);
			let tokenURI = await contract.methods.tokenURI(tokenID).call({ from: account });
			let metadataURI = await fetch(ipfsGateway + tokenURI);
			let metadataJSON = await metadataURI.json();
			let nft = {
				image: metadataJSON.image,
				name: metadataJSON.name,
				description: metadataJSON.description
			};
			if (contractAdresses.indexOf(NFTCollectionAddress) == -1) {
				contractAdresses = [...contractAdresses, NFTCollectionAddress];
				let collection = {
					name: NFTCollectionName,
					address: NFTCollectionAddress,
					nfts: []
				};
				console.log('NFTCollectionName NF', NFTCollectionName);
				collection.nfts = [...collection.nfts, nft];
				collections = [...collections, collection];
			} else {
				const foundIndex = contractAdresses.indexOf(NFTCollectionAddress);
				console.log('NFTCollectionName FI', NFTCollectionName);
				collections[foundIndex].nfts = [...collections[foundIndex].nfts, nft];
			}
			console.log(collections);
		}
	} catch (err) {
		console.error(err);
	}
};

getOwnedNFTs();

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
	let web3;
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
		contract = await new web3.eth.Contract(NFTCollection.abi, NFTCollectionAddress);
		if (contract) {
			const accounts = await web3.eth.getAccounts();
			account = accounts[0];
			console.log('account', account);
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
