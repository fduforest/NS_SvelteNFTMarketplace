<script>
	import { ethers, Signer } from 'ethers';
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	//import WrongNetwork from './WrongNetwork.svelte';
	export let currentAccount;
	export let connectedNetwork;
	export let connect;
	export let slicedAccount;

	onMount(() => {
		const networks = {
			1: 'Main Ethereum Network',
			3: 'Ropsten Test Network',
			4: 'Rinkeby Test Network',
			5: 'Görli Test Network',
			42: 'Kovan Test Network'
		};

		console.log(ethers);
		const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();

		window.ethereum
			.on('accountsChanged', handleAccountsChanged)
			.on('chainChanged', () => window.location.reload())
			.on('disconnect', handleAccountsChanged)
			.request({ method: 'eth_accounts' })
			.then(handleAccountsChanged)
			.catch((err) => console.error(err));

		function handleAccountsChanged(accounts) {
			if (accounts.length === 0) {
				console.log('Please connect to MetaMask');
				currentAccount = undefined;
			} else if (accounts[0] !== currentAccount) {
				currentAccount = accounts[0];
				slicedAccount = accounts[0].slice(0, 6) + '...' + accounts[0].slice(38, 42);
				connectedNetwork = networks[Number(window.ethereum.chainId)];
			}
		}

		function connect() {
			window.ethereum
				.request({ method: 'eth_requestAccounts' })
				.then(handleAccountsChanged)
				.catch((err) => {
					if (err.code === 4001) {
						// EIP-1193 userRejectedRequest error
						// If this happens, the user rejected the connection request.
						console.log('Please connect to MetaMask.');
					} else {
						console.error(err);
					}
				});
		}
	});
</script>

{#if typeof window !== 'undefined'}
	{#if Number(window.ethereum.chainId) > 1}
		{#if window.ethereum && currentAccount}
			<button id="web3-status-connected" class="web3-button">
				<p class="Web3StatusText">{slicedAccount}</p>
				<div size="16" class="Web3Status__IconWrapper-sc-wwio5h-0 hqHdeW">
					<div class="Identicon__StyledIdenticon-sc-1ssoit4-0 kTWLky">
						<span>
							<div class="avatar">
								<svg x="0" y="0" width="16" height="16">
									<rect
										x="0"
										y="0"
										width="16"
										height="16"
										transform="translate(-1.1699893080448718 -1.5622487594391614) rotate(255.7 8 8)"
										fill="#2379E1"
									/>
									<rect
										x="0"
										y="0"
										width="16"
										height="16"
										transform="translate(4.4919645360147475 7.910549295855059) rotate(162.8 8 8)"
										fill="#03595E"
									/>
									<rect
										x="0"
										y="0"
										width="16"
										height="16"
										transform="translate(11.87141302372359 2.1728091065947037) rotate(44.1 8 8)"
										fill="#FB1877"
									/>
								</svg>
							</div>
						</span>
					</div>
				</div>
			</button>
		{:else}
			<button id="web3-status-not-connected" class="web3-button" on:click={connect}>
				<p class="Web3StatusText">Connect</p>
			</button>
		{/if}
	{:else}
		<p>Wrong network !</p>
	{/if}
{/if}

<style>
	.web3-button {
		background-color: rgb(33, 36, 41);
		border: 1px solid rgb(33, 36, 41);
		color: rgb(255, 255, 255);
		font-weight: 500;
		display: flex;
		flex-flow: row nowrap;
		width: 100%;
		-webkit-box-align: center;
		align-items: center;
		padding: 0.5rem;
		border-radius: 14px;
		cursor: pointer;
		user-select: none;
		height: 36px;
		margin-right: 1rem;
		margin-left: 1px;
	}

	.Web3StatusText {
		color: rgb(255, 255, 255);
		flex: 1 1 auto;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin: 0px 0.5rem 0px 0.25rem;
		font-size: 1rem;
		width: fit-content;
		font-weight: 500;
	}

	.avatar {
		border-radius: 50px;
		overflow: hidden;
		padding: 0px;
		margin: 0px;
		width: 16px;
		height: 16px;
		display: inline-block;
		background: rgb(24, 176, 242);
	}
</style>
