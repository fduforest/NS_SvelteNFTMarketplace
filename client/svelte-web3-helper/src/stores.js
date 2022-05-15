import { writable } from 'svelte/store'
import { config as Config } from './config/config'

export const config = writable(Config)

export const defaultUser = {
	address: null,
	addressFormatted: null,
	connected: false,
	chainId: -1,
	chain: {},
	provider: null,
	walletProvider: null,
	loggedOut: false
}
export const user = writable(defaultUser)