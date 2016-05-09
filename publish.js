const R = require('ramda')
const Url = require('url')
const Fs = require('fs')
const Path = require('path')
const fetch = require('node-fetch')

function publish({ host, account, body, sha256 }) {
	return new Promise((resolve, reject) => {
		const url = Url.format({
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
			pathname: `/1/@${account}/${sha256}`
		})
		fetch(url, { method: 'POST', body }).then(resolve, reject)
	})
	.then((response) => response.json())
}

module.exports = publish
