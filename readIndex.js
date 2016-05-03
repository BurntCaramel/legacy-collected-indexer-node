const fs = require('fs')
const Path = require('path')
const R = require('ramda')
const nodePromise = require('./nodePromise')
const { indexFileName } = require('./constants')

const readIndex = R.pipeP(
    (dirName) => nodePromise(callback => {
        fs.readFile(Path.join(dirName, indexFileName), callback)
    }),
    JSON.parse
)

module.exports = readIndex
