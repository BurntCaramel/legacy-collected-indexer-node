const Path = require('path')
const R = require('ramda')
const hashDirectory = require('./hashDirectory')
const publishFile = require('./publishFile')

const publishItems = ({ host, account, items, basePath, observe }) => (
	Promise.all(
		R.map(({ path, sha256, bytes }) => (
			publishFile({
				filePath: Path.join(basePath, path),
				sha256,
				host,
				account
			})
			.then(R.tap(R.pipe(
				R.merge({ bytes }),
				observe('publishedItem')
			)))
		), items)
	)
)

module.exports = publishItems
