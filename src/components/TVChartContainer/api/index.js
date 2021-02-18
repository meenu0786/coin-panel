import historyProvider from './historyProvider'
import stream from './stream'

const supportedResolutions = ["1", "3", "5", "15", "30", "60", "120", "240", "D"]

const config = {
    supported_resolutions: supportedResolutions
}; 

export default {
	onReady: cb => {
		setTimeout(() => cb(config), 0)
		
	},
	resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
		var split_data = symbolName.split(/[:/]/)
		var symbol_stub = {
			name: symbolName,
			description: '',
			type: 'crypto',
			session: '24x7',
			timezone: 'Etc/UTC',
			ticker: symbolName,
			exchange: split_data[0],
			minmov: 1,
			pricescale: 100000000,
			has_intraday: true,
			intraday_multipliers: ['1', '60'],
			supported_resolution:  supportedResolutions,
			volume_precision: 8,
			data_status: 'streaming',
		}

		if (split_data[2].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
			symbol_stub.pricescale = 100
		}
		setTimeout(function() {
			onSymbolResolvedCallback(symbol_stub)
		}, 0)
		

	},
	getBars: function(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
		historyProvider.getBars(symbolInfo, resolution, from, to, firstDataRequest)
		.then(bars => {
			if (bars.length) {
				onHistoryCallback(bars, {noData: false})
			} else {
				onHistoryCallback(bars, {noData: true})
			}
		}).catch(err => {
			console.log({err})
			onErrorCallback(err)
		})

	},
	subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
		stream.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback)
	},
	unsubscribeBars: subscriberUID => {
		stream.unsubscribeBars(subscriberUID)
	},
	calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
		return resolution < 60 ? {resolutionBack: 'D', intervalBack: '1'} : undefined
	},
}
