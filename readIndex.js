const fs = require('fs')
const Path = require('path')
const R = require('ramda')
const nodePromise = require('./nodePromise')
const { indexFileName } = require('./constants')

const readIndex = R.pipeP(
	(dirPath) => nodePromise(callback => {
		fs.readFile(Path.join(dirPath, indexFileName), callback)
	}),
	JSON.parse
)

module.exports = readIndex
