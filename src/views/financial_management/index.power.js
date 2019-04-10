const getChildPowerJson = require('../../utils/getChildPowerJson')
const patterncharge = "./**/charge/**/power.js"
const patternAccount = "./**/account/**/power.js"

module.exports = {
    id: 'FINANCIAL_MANAGEMENT',
    name: '财务管理',
    type: 'category',
    sort: 6,
    children: [
        {
            id: 'FINANCIAL_MANAGEMENT_CHARGE',
            name: '费用管理',
            type: 'category',
            children: getChildPowerJson(patterncharge, {
                cwd: __dirname
            })
        },
        {
            id: 'FINANCIAL_MANAGEMENT_ACCOUNT',
            name: '对账管理',
            type: 'category',
            children: getChildPowerJson(patternAccount, {
                cwd: __dirname
            })
        },
    ]
}