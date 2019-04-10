import crypto from 'crypto'

export const sha1hash = function(content) {
    var hash = crypto.createHash('sha1')
    hash.update(content)
    return hash.digest('hex')
}

export const md5hash = function(str) {
    var md5sum = crypto.createHash('md5')
    md5sum.update(str)
    str = md5sum.digest('hex')
    return str
}