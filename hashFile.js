const crypto = require('crypto')
const fs = require('fs')


function hashFile(fileName) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256')
        const input = fs.createReadStream(fileName)
        input.on('readable', () => {
            const data = input.read()
            if (data) {
                hash.update(data)
            }
            else {
                resolve(hash.digest('hex'))
            }
        })
        input.on('error', reject)
    })
}

module.exports = hashFile
