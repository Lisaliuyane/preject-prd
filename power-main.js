const fs = require('fs')
const Glob = require("glob")
const jsonfile = require('jsonfile')
// const chalk = require('chalk')

// const error = chalk.bold.red;
const pattern = "./src/**/*.power.js" // 匹配 src下所有的 .power.js 文件

let modules = []

// function toJson(module) {
//     if (module.id && module.children) {
//         let obj =  module.id
//         obj.children = []
//         for (let key in module.children) {
//             obj.children.push(module.children[key])
//         }
//         return obj
//     } else {
//         // console.log(error("module is null"))
//         return {}
//     }
// }

// console.log(error('modules'))
new Glob(pattern, {mark: false, realpath: true, nomount: true}, function (er, matches) {
    for (let matche of matches) {
        const module = require(matche)
        // moduless[i] = import(matche)
        // console.log('module', module)
        if (module) {
            modules.push(module)
        } else {
            // console.log(error('path:'+matche+" error"))
        }
    }
    // console.log('get power modules', error(JSON.stringify(modules)))
    jsonfile.writeFileSync('./power.json', modules, function(err) {
        console.log(error('jsonfile writeFileSync error:'), error(err))
    })
    jsonfile.writeFileSync('./src/libs/power.json', modules, function(err) {
        console.log(error('jsonfile writeFileSync error:'), error(err))
    })
})
