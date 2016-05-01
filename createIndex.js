const R = require('ramda')
const hashDirectory = require('./hashDirectory')

const groupByHash = R.reduceBy((acc, item) => acc.concat(item.name), [], R.prop('hash'))

const createIndex = R.pipeP(
    hashDirectory,
    groupByHash
)

module.exports = createIndex
