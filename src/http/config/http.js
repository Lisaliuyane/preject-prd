import querystring from 'querystring'
import InitAxios from './instance'

const onError = function(reject, error) {
    if (error && error.response) {
        reject(error.response.data)
    } else if (error && error.request) {
        reject({errmsg: error.message})
    } else {
        reject(error.message)
    }
}

const ErrorHandling = (resolve, reject, res) => {
    // console.log('ErrorHandling', res, typeof res === 'object')
    if (typeof res === 'object') {
        if (('status' in res && res.status < 400 && !res.errorCode && res.errorCode !== '0' && res.errorCode !== 0) || ('success' in res && res.success)) {
            // console.log('ErrorHandling1')
            // resolve(res.data)
            // return
            if (res.access_token) {
                resolve(res)
            }
            if ('status' in res || 'success' in res) {
                resolve(res.data)
            } else {
                resolve(res)
            }
        } else if (!('success' in res) && !res.status && !res.errorCode && res.errorCode !== '0' && res.errorCode !== 0) {
            // console.log('ErrorHandling2')
            resolve(res)
        } else if (('success' in res) && res.success && ('data' in res)) {
            // console.log('ErrorHandling3')
            resolve(res.data)
        } else {
            // console.log('ErrorHandling4')
            reject(res)
        }
    } else {
        resolve(res)
    }
}

export default class RequestMethod extends InitAxios {
    GET(uri, d) {
        let http = this.getInstance()
        return new Promise((resolve, reject) => {
            http.get(uri).then(function(response) {
                ErrorHandling(resolve, reject, response.data)
            }).catch(function(error) {
                // console.log('GET catch error')
                onError(reject, error)
                reject(error)
            })
        })
    }

    GETFILE(uri, d) {
        let http = this.getInstance()
        return http({
            method: 'GET',
            url: uri,
            responseType: 'blob'
        })

        // return new Promise((resolve, reject) => {
        //     http({
        //         method: 'GET',
        //         url: uri,
        //         responseType: 'blob'
        //     }).then(function(res) {
        //        if(res.success) {
        //             resolve(res.data)
        //        }
        //     }).catch(function(error) {
        //         reject(error)
        //     })
        // })
    }

    POSTFILE(uri, params) {
        let http = this.getInstance()
        const promise = http.post(uri, params, {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        return promise
        // return new Promise((resolve, reject) => {
        //     promise.then(function(res) {
        //         console.log('res', 'success' in res, res)
        //        if('success' in res) {
        //             resolve(res.msg)
        //         }   resolve(res)
        //     }).catch(function(error) {
        //         reject(error)
        //     })
        // })
    }
    
    SPOST(uri, params) {
        let http = this.getInstance()
        return new Promise((resolve, reject) => {
            http.post(uri, querystring.stringify(params), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function (response) {
                ErrorHandling(resolve, reject, response.data)
            }).catch(function(error) {
                onError(reject, error)
            })
        })
    }
    
    POST(uri, body) {
        let http = this.getInstance()
        return new Promise((resolve, reject) => {
            http.post(uri, body, {headers: {'Content-Type': 'application/json'}}).then(function(response) {
                ErrorHandling(resolve, reject, response.data)
            }).catch(function(error) {
                onError(reject, error)
            })
        })
    }
}