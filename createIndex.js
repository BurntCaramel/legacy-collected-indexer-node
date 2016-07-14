const Crypto = require('crypto')
const R = require('ramda')
const readIndex = require('./readIndex')
const hashDirectory = require('./hashDirectory')

//const groupByHash = R.reduceBy((acc, item) => acc.concat(item.name), [], R.prop('sha256'))

const createIndex = R.converge(
	(...promises) => (
		Promise.all(promises)
		.then(R.mergeAll)
		.then(index => {
			const jsonString = JSON.stringify(index, null, 2)
			const bytes = Buffer.byteLength(jsonString)
			
			const hash = Crypto.createHash('sha256')
			hash.update(jsonString)
			const sha256 = hash.digest('hex')
			
			return { index, jsonString, sha256, bytes }
		})
	), [
		R.pipe(
			readIndex,
			(promise) => promise.catch((error) => {
				if (error.code === 'ENOENT') {
					return {};
				}
				else {
					console.error(error)
					throw error;
				}
			})
		),
		R.pipeP(
			hashDirectory,
			(items) => ({
				items
			})
		)
	]
)

module.exports = createIndex
