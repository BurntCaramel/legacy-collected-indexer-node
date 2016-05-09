const Fs = require('fs')
const Path = require('path')
const Crypto = require('crypto')
const R = require('ramda') 
const createIndex = require('./createIndex')
const { indexFileName } = require('./constants')

const writeOut = (dirPath, data) => {
	Fs.createWriteStream(Path.resolve(dirPath, indexFileName))
	.end(data)
}

function createIndexFile(dirPath) {
	return createIndex(dirPath)
	.then(({ index, jsonString, sha256, bytes }) => (
		new Promise((resolve, reject) => {
			const stream = Fs.createWriteStream(Path.resolve(dirPath, indexFileName))
			stream.on('error', reject)
			stream.end(jsonString, () => {
				resolve({ index, jsonString, sha256, bytes })
			})
		})
	))
}

module.exports = createIndexFile
