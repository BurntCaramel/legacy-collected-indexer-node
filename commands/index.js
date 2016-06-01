const Path = require('path')
const createIndexFile = require('../createIndexFile')

exports.command = 'index <dirPath>'

exports.describe = 'Index a directory, creating an index.collected file'

exports.builder = {}

exports.handler = ({ dirPath }) => {
	createIndexFile(Path.resolve(dirPath))
}
