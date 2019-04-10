const getChildPowerJson = require('../../utils/getChildPowerJson')
// const patternuser = "./**/user_rights_management/**/power.js"
const pattern = "./**/demand_import/**/power.js"
const pattern1 = "./**/customer_offer/**/power.js"
// const pattern2 = "./**/material_management/**/power.js"
// const pattern3 = "./**/consignee_consigner/**/power.js"
const pattern4 = "./**/cooperative_project/**/power.js"

module.exports = {
    id: 'PROJECT_MANAGEMENT',
    name: '项目管理',
    type: 'category',
    sort: 4,
    children: [
        // {
        //     id: 'PROJECT_MANAGEMENT_IMPORT',
        //     name: '项目导入管理',
        //     type: 'category',
        //     children: getChildPowerJson(pattern, {cwd: __dirname})
        // },
        ...getChildPowerJson(pattern, {cwd: __dirname}),
        {
            id: 'PROJECT_MANAGEMENT_OFFER_CUSTOMER',
            name: '客户报价管理',
            type: 'category',
            children: getChildPowerJson(pattern1, {cwd: __dirname})
        },
        // ...getChildPowerJson(pattern3, {cwd: __dirname}),
        // ...getChildPowerJson(pattern2, {cwd: __dirname}),
        ...getChildPowerJson(pattern4, {cwd: __dirname})
    ]
  
}