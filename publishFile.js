const Url = require('url')
const Fs = require('fs')
const Path = require('path')
const R = require('ramda')
const fetch = require('node-fetch')
const hashFile = require('./hashFile')
const publish = require('./publish')

function publishFile({ host, account, filePath, sha256 }) { 
	return (
		R.isNil(sha256) ? hashFile(filePath) : Promise.resolve(sha256)
	).then((sha256) => (
		publish({
			host,
			account,
			sha256,
			body: Fs.createReadStream(filePath)
		})
	))
}

module.exports = publishFile
