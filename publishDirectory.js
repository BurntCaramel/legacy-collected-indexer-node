const fs = require('fs')
const Path = require('path')
const R = require('ramda')
const hashDirectory = require('./hashDirectory')
const publishItems = require('./publishItems')

const defaultObserve = R.curry((id, input) => {})

function publishDirectory({ host, account, path, observe = defaultObserve }) {
	return hashDirectory(path)
		.then((items) =>
			publishItems({ host, account, items, basePath: path, observe })
		)
}

module.exports = publishDirectory
