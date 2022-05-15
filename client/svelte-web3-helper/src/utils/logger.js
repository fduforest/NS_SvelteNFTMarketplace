import { get } from 'svelte/store'
import { config } from '../stores'

/**
 * Use console methods if config `enableLogs` is set to true
 */
export const logger = {
	logEnabled: () => {
		const conf = get(config)
		return !!conf.enableLogs
	},
	log: (...s) => {
		if(logger.logEnabled()) console.log(...s)
	},
	info: (...s) => {
		if(logger.logEnabled()) console.info(...s)
	},
	warn: (...s) => {
		if(logger.logEnabled()) console.warn(...s)
	},
	error: (...s) => {
		if(logger.logEnabled()) console.error(...s)
	},

	/**
	 * Custom themed success message
	 * @param s {String} message
	 * @param type {String} type of console "log", "info", "warn", "error"
	 */
	success: (s, type) => {
		if(logger.logEnabled()) {
			const str = `%c${s}`
			const css = "font-weight:bold;color:green"
			switch (type) {
				case 'log': console.log(str, css); break;
				case 'info': console.info(str, css); break;
				case 'warn': console.warn(str, css); break;
				case 'error': console.error(str, css); break;
				default: console.log(str, css); break;
			}
		}
	}
}