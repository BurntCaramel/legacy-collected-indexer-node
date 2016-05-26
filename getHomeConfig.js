const OS = require('os')
const Path = require('path')
const FS = require('fs')

function getHomeConfig() {
	const homePath = OS.homedir()
	const configPath = Path.join(homePath, '.collected.json')
	const data = FS.readFileSync(configPath)
	return JSON.parse(data)
}

module.exports = getHomeConfig
