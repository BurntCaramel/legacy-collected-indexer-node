const R = require('ramda')
const axios = require('axios')
const FS = require('fs')
const OS = require('os')
const Path = require('path')
const getURL = require('./getURL')
const nodePromise = require('./nodePromise')

const requestLogInCode = ({ host, email }) => (
	axios.post(getURL({ host, path: `/1/auth/start` }), {
		email
	})
	.then(R.prop('data'))
)

const writeLocalToken = (token) => nodePromise((callback) => {
	FS.writeFile(
		Path.join(OS.homedir(), '.collected.json'),
		JSON.stringify({ token }),
		callback
	)
})

const verifyLogInCode = ({ host, email, code }) => (
	axios.post(getURL({ host, path: `/1/auth/verify` }), {
		email, code
	})
	.then(R.pipe(
		R.path(['data', 'id_token']),
		writeLocalToken
	))
	.then(R.always({ success: true }))
)

module.exports = { 
	requestLogInCode,
	verifyLogInCode
}
