const getChildPowerJson = require('../../utils/getChildPowerJson')
const patternuser = "./**/user_rights_management/**/power.js"
const patternpower = "./**/power_registered/**/power.js"
const patternLog = "./**/operation_log/**/power.js"

module.exports = {
    id: 'SYSTEM_MANAGEMENT',
    name: '系统管理',
    type: 'category',
    sort: 9,
    children: [
        {
            id: 'USER_POWER_MANAGEMENT',
            name: '用户权限管理',
            type: 'category',
            children: getChildPowerJson(patternuser, {cwd: __dirname})
        },
        ...getChildPowerJson(patternpower, {cwd: __dirname}),
        ...getChildPowerJson(patternLog, {cwd: __dirname})
    ]
  
}