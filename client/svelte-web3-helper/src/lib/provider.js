import { ethers } from "ethers"
import { get } from 'svelte/store'
import { config, user, defaultUser } from '../stores'
import { utils, logger } from '../utils/utils'

let eventsInitialized = false

export const Provider = {
	/**
	 * Main connect method
	 * - Request connection from web3 provider
	 * - Get the connected chain data
	 * - Get the native balance of the connected account
	 * - Initialize web3 provider Events
	 * - @TODO Force connection to the given chain ID
	 *
	 * @param {Object} options optionnal parameters
	 * @returns {Object} user
	 */
	connect: async (forceChain=false) => {
		let update = {}
		let chainConnected = false

		logger.info('Provider.connect: Connect to web3 provider...')

		// Request connected accounts
		const accounts = await Provider.requestAccounts()
		if(typeof accounts !== 'undefined' && accounts.length > 0) {
			update.address = accounts[0]
			update.addressFormatted = utils.formatAddress(accounts[0])
		}

		// Request current chain data
		const chain = await Provider.requestChain()
		update.chain = chain
		update.chainId = chain.chainId

		// Detect wallet provider
		update.walletProvider = Provider.detectWalletProvider()

		// Force network change if needed
		if(forceChain) {
			logger.info('Provider.connect: Ask user to switch network', parseInt(forceChain))
			chainConnected = await Provider.changeChain(parseInt(forceChain))
		}

		// Initialize web3 provider events
		Provider.initWeb3Events()


		// Set user connected
		if(parseInt(update.chainId) > 0 && update.address && (!forceChain || chainConnected)) {
			update.connected = true
		}
		logger.success(
			`Provider.connect: Connected to ${update.address}` +
			(update.chain && update.chain.name ? ` on ${update.chain.name}` :
				update.chainId ? ` on chain ${update.chainId}` : ''
			)
		)

		// Update `user` store
		const usr = get(user)
		const usrUpdate = {...usr, ...update}
		user.set(usrUpdate)
		return usrUpdate
	},
	
	logout: () => {
		user.set({...defaultUser, ...{loggedOut:true}})
	},

	/**
	 * Init web3 events once
	 */
	initWeb3Events: () => {
		if(!eventsInitialized) {
			// @TODO Check data before connect
			window.ethereum.on('accountsChanged', Provider.connect);
			window.ethereum.on('chainChanged', Provider.connect);
		}
		eventsInitialized = true
	},

	/**
	 * Detect the wallet provider extension/service and return it's name
	 * @returns {string} Provider's name (default: metamask)
	 */
	detectWalletProvider: () => {
		let walletProvider = null
		if(typeof window.ethereum !== 'undefined') {
			if(!walletProvider && window.ethereum.isTrust === true) walletProvider = 'trust-wallet'
			if(!walletProvider && window.BinanceChain === true) walletProvider = 'binance-wallet'
			if(window.ethereum.isMetaMask === true) walletProvider = 'metamask'
		}
		return walletProvider
	},

	/**
	 * Get a web3 provider object
	 * @param {string} providerType Type of provider to be used, can be an empty string, "rpc" or "ws",
	 * 	`source` is needed is this param is not empty
	 * @param {string} source (optional) Source url for rpc or websocket provider types
	 * @returns {Object} provider
	 */
	getProvider: async (providerType="", source=null) => {
		let provider = null
		switch (providerType) {
			case 'rpc':
				if(!source) return Provider.getProvider()
				try {
					provider = new ethers.providers.JsonRpcProvider(source)
				} catch (e) {
					logger.info(`Provider.getProvider: JSON RPC error, fallback to default provider`)
					return Provider.getProvider()
				}
				break

			case 'ws':
				if(!source) return Provider.getProvider()
				try {
					provider = new ethers.providers.WebSocketProvider(source)
				} catch (e) {
					logger.info(`Provider.getProvider: WebSocket error, fallback to default provider`)
					return Provider.getProvider()
				}
				break

			default:
				provider = new ethers.providers.Web3Provider(window.ethereum)
				break
		}

		if(provider) {
			logger.info(`Provider.getProvider: Connected to ${providerType === "" ? "default" : providerType} provider`)
			return provider
		} else {
			logger.error(`Provider.getProvider: Provider not connected`)
			return null
		}
	},

	/**
	 * Get connected accounts from web3 provider
	 * @returns {Promise<boolean|String[]>}
	 */
	requestAccounts: async () => {
		try {
			return await window.ethereum.request({method: 'eth_requestAccounts'})
		} catch (e) {
			return false
		}
	},

	/**
	 * Get current web3 provider chain ID
	 * @returns {Promise<boolean|Int>}
	 */
	requestChainId: async () => {
		try {
			const chainId = await window.ethereum.request({method: 'eth_chainId'})
			return parseInt(chainId)
		} catch (e) {
			return false
		}
	},

	/**
	 * Get current web3 provider chain and return corresponding chain config
	 * @returns {Promise<Object>} chain
	 */
	requestChain: async () => {
		const chainId = await Provider.requestChainId()

		const conf = get(config)
		const chains = conf.chains
		if(chains && chains[chainId]) {
			return chains[chainId]
		} else {
			logger.warn('Provider.requestChain: No config found for chain ID', chainId)
			return {
				chainId: chainId
			}
		}
	},

	/**
	 * Change network based on chainId
	 * @param chainId {Integer}
	 * @returns {Promise<boolean>}
	 */
	changeChain: async chainId => {
		try {
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params:[{
					chainId: utils.NToHex(chainId)
				}]
			})
			const chain = await Provider.requestChain()
			return parseInt(chain.chainId) === chainId
		} catch (e) {
			console.log(e)
			return false
		}
	}
}