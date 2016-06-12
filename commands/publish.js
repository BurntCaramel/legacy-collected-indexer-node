const Fs = require('fs')
const Path = require('path')
const R = require('ramda')
const Progress = require('progress')
const formatBytes = require('bytes')
const publishFile = require('../publishFile')
const publishDirectory = require('../publishDirectory')
const publishIndex = require('../publishIndex')
const publish = require('./publish')
const { indexFileName } = require('../constants')
const nodePromise = require('../nodePromise')

class PublishState {
	constructor() {
		this.newCount = 0
		
		this.start()
	}
	
	start() {
		process.stdin.resume()
	}
	
	finish() {
		process.stdin.pause()
	}
	
	hashedItems(values) {
		this.totalCount = values.length
		
		const totalBytes = R.transduce(R.map(
			R.prop('bytes')
		), R.add, 0, values)
		
		this.bar = new Progress(`Publishing ${formatBytes(totalBytes)} [:bar] :percent :etas`, {
			width: 20,
			total: totalBytes,
			callback: () => {
				clearInterval(this.barInterval)
		
				console.log('\nPublished successfully')
				console.log(`${this.newCount} / ${this.totalCount} items were new.`)
			}
		})
		this.bar.tick(0)
		
		this.barInterval = setInterval(() => {
			if (this.bar) {
				this.bar.render()
			}
		}, 500)
	}
	
	publishedItem({ bytes, wasNew }) {
		if (wasNew) {
			this.newCount += 1
		}
		this.bar.tick(bytes)
	}
}

function publishFiles({ host, account, path, state }) {
	nodePromise(callback => {
		Fs.stat(path, callback)
	})
	.then(stats => {
		if (stats.isFile()) {
			console.log(`Publishing file to @${account} ${host}`)
			
			publishFile({
				host,
				account,
				filePath: Path.resolve(path)
			})
			.then((object) => JSON.stringify(object, null, 2))
			.then((output) => {
				process.stdout.write(output)
				
				state.finish()
			})
			.catch((error) => {
				console.error('error', R.pipe(
					(error) => R.pathOr(error, ['statusText'], error)
				)(error))
				
				state.finish()
			})
		}
		else if (stats.isDirectory()) {
			console.log(`Publishing directory to @${account} ${host}`)
			
			publishDirectory({
				host, account, path,
				observe: R.prop(R.__, {
					hashedItems(values) {
						state.hashedItems(values)
					},
					publishedItem(payload) {
						state.publishedItem(payload)
					}
				})
			})
			.then(() => {
				state.finish()
			})
		}
	})
}

exports.command = 'publish <path>'

exports.describe = 'Publish a collected index and its contents to the cloud'

exports.builder = {
	host: {},
	account: {
		demand: true
	},
	files: {
		boolean: true
	}
}

exports.handler = ({ host, account, path, files }) => {
	if (R.any(R.isNil, [host, account])) {
		console.error('Error: --host and --account must be passed.')
		process.exit(9)
	}
	
	path = Path.resolve(path)
	
	const state = new PublishState()
	
	if (files) {
		publishFiles({
			host,
			account,
			path,
			state
		})
	}
	else {
		console.log(`Publishing index and its contents to @${account} ${host}`)
		
		publishIndex({
			host,
			account,
			dirPath: path,
			/*observe: R.pipe(
				R.prop(R.__, state),
				R.bind(R.__, state)
			)*/
			observe: R.prop(R.__, {
				hashedItems(items) {
					state.hashedItems(items)
				},
				publishedItem(payload) {
					state.publishedItem(payload)
				}
			})
		})
		.then(({ sha256 }) => {
			console.log(`Published index ${sha256}`)
			
			state.finish()
		})
		.catch((error) => {
			console.error(error)
			
			state.finish()
		})
	}
}
