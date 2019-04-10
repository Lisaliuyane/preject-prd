/** 
 * 导入所有 api 接口
*/
const files = require.context('../../views', true, /\.api.js$/)

const files1 = require.context('../', true, /\.api.js$/)
let modules = {}
const keys = files.keys()
const keys1 = files1.keys()
// console.log('files keys', keys)
/** 
 * 使用i+命名解决打包 content.default.name 名字混淆问题
*/
let i = 0
for (let key of keys) {
    i++
    try {
        let content = files(key)
        // console.log('files content', content)
        if (content && content.default) {
            if (typeof content.default === 'function') {
                modules[content.default.name + i] = content.default
                // console.log('content.default', content.default,  Object.keys(modules[content.default.name]), Object.getOwnPropertyNames(modules[content.default.name]))
            } else {
                modules = Object.assign({}, modules, content.default)
            }
        }
    } catch(e) {
        console.error('批量导入所有文件夹出错: ', e);
    }
}

for (let key of keys1) {
    i++
    try {
        let content = files1(key)
        // console.log('files content', content)
        if (content && content.default) {
            if (typeof content.default === 'function') {
                modules[content.default.name + i] = content.default
                // console.log('content.default', content.default,  Object.keys(modules[content.default.name]), Object.getOwnPropertyNames(modules[content.default.name]))
            } else {
                modules = Object.assign({}, modules, content.default)
            }
        }
    } catch(e) {
        console.error('批量导入所有文件夹出错: ', e);
    }
}
// console.log('modules', modules)
export default modules