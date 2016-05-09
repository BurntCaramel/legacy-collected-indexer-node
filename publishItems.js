const Path = require('path')
const R = require('ramda')
const hashDirectory = require('./hashDirectory')
const publishFile = require('./publishFile')

function publishItems({ host, account, items, basePath, observe }) {
	return Promise.all(
		R.map(({ name, sha256, bytes }) =>
			publishFile({
				filePath: Path.join(basePath, name),
				sha256,
				host,
				account
			})
			.then(R.tap(R.pipe(
				R.merge({ bytes }),
				observe('publishedItem')
			)))
		)(items)
	)
}

module.exports = publishItems
