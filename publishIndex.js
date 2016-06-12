const Fs = require('fs')
const Path = require('path')
const R = require('ramda')
const nodePromise = require('./nodePromise')
const { indexFileName } = require('./constants')
const createIndexFile = require('./createIndexFile')
const publish = require('./publish')
const publishItems = require('./publishItems')

const publishIndex = ({ host, account, dirPath, observe }) => (
	createIndexFile(dirPath)
	.then(R.tap(R.pipe(
		R.path(['index', 'items']),
		observe('hashedItems')
	)))
	.then(({ index, jsonString, sha256, bytes }) => (
		Promise.all([
			publishItems({
				host,
				account,
				items: index.items,
				basePath: dirPath,
				observe
			}),
			publish({
				host,
				account,
				sha256,
				body: jsonString
			})
		]).then(
			R.always({ sha256 })
		))
	)
)

module.exports = publishIndex
