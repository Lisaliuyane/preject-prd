const getChildPowerJson = require('../../utils/getChildPowerJson')
const patterndefine = "./**/define/**/power.js"
const patterndefineAdd = "./**/define_add/**/power.js"
const patternreceipt = "./**/receipt/**/power.js"
const patterninventory = "./**/inventory/**/power.js"
const patternshipment = "./**/shipment/**/power.js"
const patternmaterial = "./**/material/**/power.js"

module.exports = {
    id: 'WAREHOUSE_MANAGEMENT',
    name: '仓库管理',
    type: 'category',
    sort: 7,
    children: [
        {
            id: 'WAREHOUSE_MANAGEMENT_RECEIPT',
            name: '收货作业',
            type: 'category',
            children: getChildPowerJson(patternreceipt, {
                cwd: __dirname
            })
        },
        {
            id: 'WAREHOUSE_MANAGEMENT_INVENTORY',
            name: '库存管理',
            type: 'category',
            children: getChildPowerJson(patterninventory, {
                cwd: __dirname
            })
        },
        {
            id: 'WAREHOUSE_MANAGEMENT_SHIPMENT',
            name: '出货作业',
            type: 'category',
            children: getChildPowerJson(patternshipment, {
                cwd: __dirname
            })
        },
        ...getChildPowerJson(patterndefine, {
            cwd: __dirname
        }),
        ...getChildPowerJson(patterndefineAdd, {
            cwd: __dirname
        }),
        ...getChildPowerJson(patternmaterial, {
            cwd: __dirname
        })
    ]
}