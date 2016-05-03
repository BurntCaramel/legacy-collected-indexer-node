const R = require('ramda')
const readIndex = require('./readIndex')
const hashDirectory = require('./hashDirectory')

const groupByHash = R.reduceBy((acc, item) => acc.concat(item.name), [], R.prop('hash'))

const createIndex = R.converge(
    (...promises) => (
        Promise.all(promises)
            .then(R.mergeAll)
    )
    /*R.pipeP(
        R.unapply(Promise.all),
        R.mergeAll
    )*/, [
        R.pipeP(
            readIndex
        ),
        R.pipeP(
            hashDirectory,
            groupByHash,
            R.objOf('hashes')
        )
    ]
)

module.exports = createIndex
