const getChildPowerJson = require('../../utils/getChildPowerJson')
// const patternuser = "./**/user_rights_management/**/power.js"
const pattern = "./**/order/list/**/power.js"
const pattern1 = "./**/order/add/**/power.js"
const pattern2 = "./**/send_car/**/power.js"
const pattern4 = "./**/allocate/**/power.js"
const pattern5 = "./**/allocate_edit/**/power.js"
const pattern6 = "./**/order_maintenance/edit/**/power.js"
const pattern7 = "./**/order_maintenance/list/**/power.js"
const pattern8 = "./**/stowage_maintenance/**/power.js"
const pattern9 = "./**/stowage_maintenance_edit/**/power.js"
const pattern10 = "./**/track/**/power.js"

module.exports = {
    id: 'BUSINESS_MANAGEMENT',
    name: '运作管理',
    type: 'category',
    sort: 5,
    children: [
        ...getChildPowerJson(pattern, {cwd: __dirname}),
        ...getChildPowerJson(pattern1, {cwd: __dirname}),
        ...getChildPowerJson(pattern4, {cwd: __dirname}),
        ...getChildPowerJson(pattern5, {cwd: __dirname}),
        ...getChildPowerJson(pattern2, {cwd: __dirname}),
        ...getChildPowerJson(pattern10, {cwd: __dirname}),
        ...getChildPowerJson(pattern6, {cwd: __dirname}),
        ...getChildPowerJson(pattern7, {cwd: __dirname}),
        ...getChildPowerJson(pattern8, {cwd: __dirname}),
        ...getChildPowerJson(pattern9, {cwd: __dirname}),
    ]
  
}