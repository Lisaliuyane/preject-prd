import axios from 'axios'
import headersConfig from '@src/config/http.header'

const BasicAuth = 'Basic YXBwOjEyMzQ1Ng=='
// export default function(store) {
//     instance.interceptors.request.use(function(config) {
//             if (store.isLogin) {
//                 var accessToken = store.accessToken
//                 config.headers.Authorization = `Bearer ${accessToken}`
//             } else {
//                 config.headers.Authorization = BasicAuth
//             }
//             return config
//         }, function(error) {
//             return Promise.reject(error)
//         })
//         instance.store = store
//     return instance
// }
export default class InitAxios {
    constructor(store) {
        this.instance = axios.create(Object.assign({}, {
            // baseURL: `http://localhost:3001`,
            // baseURL: `http://nbiot.smartcomma.com:8081`,
            // baseURL: process.env.NODE_ENV !== 'production' ? `https://api.smartcomma.com/api/` : '/api/',
            // baseURL: process.env.NODE_ENV !== 'production' ? `http://192.168.2.101` : '',
            // baseURL: 'http://192.168.2.83:8082',
            // baseURL: 'http://192.168.2.90:8088',
            // baseURL: 'http://192.168.2.241:8089',
            //baseURL: 'http://192.168.10.54:8088',
           //  baseURL: 'http://console.frdscm.com/api',
            timeout: 2 * 60 * 1000, // ten seconds
            headers: {
                // 'Content-Type': 'application/json'
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true
        }, headersConfig))
        this.store = store
        this._initRequestHeaders()
        this._interceptors()
    }
    
    _initRequestHeaders() {
        let store = this.store
        let instance = this.instance
        instance.interceptors.request.use(config => {
            if (config.url.startsWith('wms') && process.env.NODE_ENV !== 'production') {
                // config.baseURL = 'http://192.168.2.233:9001'
                // config.proxy = {
                //     host: '192.168.2.233',
                //     port: 9001
                // }
            }

            if (headersConfig.type === 1 || config.url === '/account/company/info') {
                return config
            }
            // console.log('config', config)
            if (store.isLogin && store.accessToken && config.url !== '/oauth/token') {
                let accessToken = store.accessToken
                config.headers.Authorization = `Bearer ${accessToken}`
            } else {
                config.headers.Authorization = BasicAuth
            }
            
            return config
        }, function(error) {
            return Promise.reject(error)
        })
        instance.store = store
    }

    getInstance() {
        return this.instance
    }

    _interceptors() {
        let store = this.store
        let instance = this.instance
        instance.interceptors.response.use(function (response) {
            // console.log('err res response', response)
            if (response.status === 202 && response.data && response.data.errcode) {
                if (response.data.errcode === 403 || response.data.errcode === 401) {
                    store.loginOut()
                }
            }
            return response
        }, function (error) {
            // Do something with response error
            // console.error('error', error, error.config, error.response, error.status, error.code)
            // let code = error.status || error.response.data.errcode || error.response.data.status || error.response.status
            let code  = error.response ? error.status || error.response.data.errcode || error.response.data.status || error.response.status : error.status
            if (code === 401 || code === 403) {
                store.loginOut()
            }
            if (code === 400) {
                // store.loginOut()
            }
            return Promise.reject(error)
        })
    }
}
