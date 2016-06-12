const R = require('ramda')
const axios = require('axios')
const getHomeConfig = require('./getHomeConfig')
const getURL = require('./getURL')

const { token } = getHomeConfig()

const publish = ({ host, account, body, sha256 }) => (
	axios.put(
		getURL({ host, path: `/1/@${account}/${sha256}` }),
		body, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		}
	)
	.then(R.prop('data'))
)

module.exports = publish
