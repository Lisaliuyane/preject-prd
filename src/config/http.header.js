let config = {}
if (process.env.NODE_ENV === 'development') {
    /**  
     * 本地服务器调试
    */
    // config.type = 1
    // config.login = true
    // config.baseURL = 'http://192.168.2.144:8082'
    // config.token = 'xxxxxxxxxxxx'

    config.proxy = 'http://192.168.10.54:8088'
    // config.baseURL = 'http://scm.smartcomma.com/api'
} else {
    config.baseURL = '/api'
}
// config.baseURL = 'http://scm.smartcomma.com/api'
// config.baseURL = 'http://192.168.2.90:8088'

export default config