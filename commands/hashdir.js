const R = require('ramda')
const Path = require('path')
const hashDirectory = require('../hashDirectory')
const emojiHash = require('../emojiHash')

exports.command = 'hashdir <dirPath>'

exports.describe = 'Display an index of a directory'

exports.builder = {
	dirPath: {}
}

exports.handler = (argv) => {
	hashDirectory(Path.resolve(argv.dirPath))
	.then(R.map(
		R.converge(R.merge, [
			R.identity,
			R.pipe(
				R.prop('sha256'),
				emojiHash,
				R.append(''),
				R.join('  '),
				R.objOf('emojid')
			)
		])
	))
	.then((object) => JSON.stringify(object, null, 2))
	.then((output) => process.stdout.write(output))
}
