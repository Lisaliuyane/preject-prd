/** 
 * 客户资料
*/
// import client from '@src/views/client'
// import basedata from '@src/views/basic_data'
import home from '@src/views/home'

const files = require.context('./', true, /\.modules.js$/)
let modules = {}
const keys  = files.keys()
for (let key of keys) {
    try {
        let content = files(key)
        if (content && content.default) {
            for (let k in content.default) {
                if (modules[k]) {
                    console.error(`模块名称 ${k} 出现重复名字`)
                }
            }
            modules = Object.assign({}, modules, content.default)
        }
    } catch(e) {
    }
}

export default {
    ...modules,
    ...home
}