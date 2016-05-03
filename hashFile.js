const R = require('ramda')
const fs = require('fs')
const hashStream = require('./hashStream')


const hashFile = R.pipe(
    fs.createReadStream,
    hashStream
)

module.exports = hashFile
