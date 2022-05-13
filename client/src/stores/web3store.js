import { onMount } from 'svelte';
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

const networkId = null;
const deployedNetwork = null;
//const contract = null;
//export const contract = writable([]);

//getContract(async () => {});

export const mint = async (hash, metadata) => {
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
		if (deployedNetwork) {
			contract = await new web3.eth.Contract(
				NFTCollectionFactory.abi,
				deployedNetwork && deployedNetwork.address
			);
			console.log('contract', contract);
			const accounts = await web3.eth.getAccounts();
			account = accounts[0];
			console.log(account);
			console.log(deployedNetwork.address);
			//let res = await contract.methods.mint(account, hash, metadata).send({ from: account });
			let res = await contract.methods.createNFTCollection('moonR', 'MOON').send({ from: account });
			console.log('mint res', res);
		} else {
			window.alert('Smart contract not deployed to detected network.');
		}
	} catch (err) {
		console.error(err);
	}
};
