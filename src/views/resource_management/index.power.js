const getChildPowerJson = require('../../utils/getChildPowerJson')
const patternbase = "./**/base/**/power.js"
const patternoffer = "./**/offer/**/power.js"

module.exports = {
    id: 'RESOURCE_MANAGEMENT',
    name: '资源管理',
    type: 'category',
    sort: 3,
    children: [
        {
            id: 'RESOURCE_MANAGEMENT_BASE',
            name: '基础资源池',
            type: 'category',
            children: getChildPowerJson(patternbase, {cwd: __dirname})
        },
        ...getChildPowerJson(patternoffer, {cwd: __dirname})
    ]
}