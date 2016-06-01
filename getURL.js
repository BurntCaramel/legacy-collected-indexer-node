const R = require('ramda')
const URL = require('url')

function getURL({ host, path }) {
	return URL.format({
		protocol: R.ifElse(
			R.pipe(
				R.split(':'),
				R.head,
				R.equals('localhost')
			),
			R.always('http'),
			R.always('https')
		)(host),
		host,
		pathname: path
	})
}

module.exports = getURL
