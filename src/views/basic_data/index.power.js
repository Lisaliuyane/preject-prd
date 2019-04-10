const getChildPowerJson = require('../../utils/getChildPowerJson')
// const patternuser = "./**/user_rights_management/**/power.js"
const pattern = "./**/power.js"

module.exports = {
    id: 'BASE_DATA',
    name: '基础数据管理',
    type: 'category',
    sort: 8,
    children: [
        ...getChildPowerJson(pattern, {cwd: __dirname})
    ]
  
}