const R = require('ramda')
const base16ToEmoji = require('./base16ToEmoji')

const emojiHash = R.pipe(
	R.take(7),
	R.map(R.pipe(
		R.toLower,
		R.prop(R.__, base16ToEmoji)
	))
)

module.exports = emojiHash
