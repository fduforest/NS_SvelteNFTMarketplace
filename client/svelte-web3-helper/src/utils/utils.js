export * from './logger'

export const utils = {
	formatAddress: (a='') => {
		return a ? `${a.slice(0, 6)}...${a.slice(a.length - 4)}` : a
	},
	NToHex: n => {
		return '0x' + Number(n).toString(16)
	}
}