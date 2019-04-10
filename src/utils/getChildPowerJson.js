//const sourcePower = require('./source/power')

const Glob = require("glob")
// const chalk = require('chalk')
// const error = chalk.bold.red;

/** 
 * 获取模块权限数据并组合
*/
function toJson(module) {
    if (module.id && module.children) {
        let obj =  module.id
        obj.children = []
        for (let key in module.children) {
            obj.children.push(module.children[key])
        }
        return obj
    } else {
        return {}
    }
}


module.exports = function(pattern, params) {
    console.log('search position', pattern, params)

    let modules = []

    let matches = new Glob.sync(pattern, Object.assign({}, {matchBase: true, mark: false, realpath: true, nodir: true}, params))

    if (matches && matches.length > 0) {
        for (let matche of matches) {
            const module = require(matche)
            if (module) {
                modules.push(toJson(module))
            } else {
                // console.log(error('path:'+matche+" error"))
            }
        }
    }
    
    return modules
}
module.exports.toJson = toJson