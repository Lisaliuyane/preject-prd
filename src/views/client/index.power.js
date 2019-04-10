// const sourcePower = require('./source/power')
// const Glob = require("glob")
// const chalk = require('chalk')
const path = require('path')
const getChildPowerJson = require('../../utils/getChildPowerJson')
const pattern = "./**/source/**/power.js" // 匹配 src下所有的 .power.js 文件
const pattern2 = "./**/consignee_consigner/**/power.js"
const pattern3 = "./**/material_management/**/power.js"
// let modules = []

module.exports = {
    id: 'CLIENT',
    name: '客户管理',
    type: 'category',
    sort: 2,
    children: [
        ...getChildPowerJson(pattern, {cwd: __dirname}),
        ...getChildPowerJson(pattern2, {cwd: __dirname}),
        ...getChildPowerJson(pattern3, {cwd: __dirname})
    ]
}