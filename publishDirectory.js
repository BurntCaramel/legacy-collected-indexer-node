const fs = require('fs')
const Path = require('path')
const R = require('ramda')
const hashDirectory = require('./hashDirectory')
const publishFile = require('./publishFile')

const defaultObserve = R.curry((id, input) => {})

function publishDirectory({ host, account, path, observe = defaultObserve }) {
    return hashDirectory(path)
        .then(R.pipe(
            R.tap(observe('hashedItems')),
            R.map(({ name, sha256, bytes }) =>
                publishFile({
                    filePath: Path.join(path, name),
                    hash: sha256,
                    host,
                    account
                })
                .then(R.tap(R.pipe(
                    R.merge({ bytes }),
                    observe('publishedItem')
                )))
            ),
            Promise.all
        ))
}

module.exports = publishDirectory
