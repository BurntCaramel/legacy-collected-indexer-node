const Mimos = require('mimos')

const mimos = new Mimos({
	override: {
		'application/x-collected': {
			source: 'burntcaramel.com',
			compressible: true,
			extensions: ['collected']
		},
		'application/x-icing': {
			source: 'burntcaramel.com',
			compressible: true,
			extensions: ['icing']
		}
	}
})

module.exports = mimos
