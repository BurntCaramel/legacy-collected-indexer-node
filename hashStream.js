const crypto = require('crypto')


const hashStream = (stream) => new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256')
    stream.on('readable', () => {
        const data = stream.read()
        if (data) {
            hash.update(data)
        }
        else {
            resolve(hash.digest('hex'))
        }
    })
    stream.on('error', reject)
})

module.exports = hashStream
