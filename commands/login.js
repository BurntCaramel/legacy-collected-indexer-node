const { requestLogInCode, verifyLogInCode } = require('../logIn')

exports.command = 'login'

exports.describe = 'Log into an account'

exports.builder = {
	host: {},
	email: {
		demand: true
	},
	code: {}
}

exports.handler = ({ host, email, code }) => {
	if (code) {
		verifyLogInCode({ host, email, code })
		.then(() => {
			console.log('Logged in successfully.')
		})
	}
	else {
		requestLogInCode({ host, email })
		.then(() => {
			console.log('Check your email for the verification code.')
		})
	}
}
