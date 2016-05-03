const R = require('ramda')
const Url = require('url')
const Fs = require('fs')
const Path = require('path')
const fetch = require('node-fetch')
const hashFile = require('./hashFile')

function publishFile({ host, account, filePath, hash }) { 
    return (
        R.isNil(hash) ? hashFile(filePath) : Promise.resolve(hash)
    ).then((hash) => {
            const url = Url.format({
                protocol: R.ifElse(
                    R.pipe(
                        R.split(':'),
                        R.head,
                        R.equals('localhost')
                    ),
                    R.always('http'),
                    R.always('https')
                )(host),
                host,
                pathname: `@${account}/${hash}`
            })
            const stream = Fs.createReadStream(filePath)
            return fetch(url, { method: 'POST', body: stream })
        })
        .then((response) => response.json())
}

module.exports = publishFile
