export const chains = {
	1: {
		chainId: 1,
		name: "Ethereum",
		symbol: "ETH",
		testnet: false,
		explorers: [
			'https://etherscan.io/'
		],
		api: {
			explorer: {
				endpoint: 'https://api.etherscan.io/'
			},
			coingecko: {
				slug: "ethereum"
			}
		}
	}
}