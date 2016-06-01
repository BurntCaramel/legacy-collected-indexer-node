const R = require('ramda')
const fetch = require('node-fetch')
const FS = require('fs')
const OS = require('os')
const Path = require('path')
const getURL = require('./getURL')
const nodePromise = require('./nodePromise')

function requestLogInCode({ host, email }) {
	return fetch(getURL({ host, path: `/1/auth/start` }), {
		method: 'POST',
		body: { email }
	})
	.then((response) => response.json())
}

function verifyLogInCode({ host, email, code }) {
	return fetch(getURL({ host, path: `/1/auth/verify` }), {
		method: 'POST',
		body: { email, code }
	})
	.then((response) => response.json())
	.then(({ id_token }) => nodePromise((callback) => {
		FS.writeFile(
			Path.join(OS.homedir(), '.collected.json'),
			JSON.stringify({ token: id_token }),
			callback
		)
	}))
	.then(R.always({ success: true }))
}

module.exports = { 
	requestLogInCode,
	verifyLogInCode
}
