const fs = require('fs')
const Path = require('path')
const R = require('ramda')
const hashDirectory = require('./hashDirectory')
const publishFile = require('./publishFile')

function publishDirectory({ host, account, path }) {
    return hashDirectory(path)
        .then(R.pipe(
            R.map(({ name, sha256 }) =>
                publishFile({
                    filePath: Path.join(path, name),
                    hash: sha256,
                    host,
                    account
                })
            ),
            Promise.all
        ))
}

module.exports = publishDirectory
