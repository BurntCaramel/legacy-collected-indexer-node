const R = require('ramda')
const fetch = require('node-fetch')
const getHomeConfig = require('./getHomeConfig')
const getURL = require('./getURL')

const { token } = getHomeConfig()

function publish({ host, account, body, sha256 }) {
	return new Promise((resolve, reject) => {
		fetch(getURL({ host, path: `/1/@${account}/${sha256}` }), {
			method: 'PUT',
			headers: {
				"Authorization": `Bearer ${token}`
			},
			body
		})
		.then(resolve, reject)
	})
	.then((response) => response.json())
}

module.exports = publish
