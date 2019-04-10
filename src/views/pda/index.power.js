// const getChildPowerJson = require('../../utils/getChildPowerJson')
// // const patternuser = "./**/user_rights_management/**/power.js"
// const pattern = "./**/power.js"

module.exports = {
    id: 'APP_PDA',
    name: 'PDA权限',
    type: 'category',
    sort: 10,
    children: [
        {
            id: 'PDA_RECEIPT',
            name: '收货扫描',
            type: 'menu'
        },
        {
            id: 'PDA_SHELF',
            name: '入库上架',
            type: 'menu'
        },
        {
            id: 'PDA_PICK',
            name: '拣货下架',
            type: 'menu'
        },
        {
            id: 'PDA_SHIPMENT',
            name: '出货扫描',
            type: 'menu'
        },
        {
            id: 'PDA_INVENTORY',
            name: '盘点操作',
            type: 'menu'
        },
        {
            id: 'PDA_TRANSFER',
            name: '库内移位',
            type: 'menu'
        },
        // {
        //     id: 'PDA_ALLOCATION',
        //     name: '库间调拨',
        //     type: 'menu'
        // },
        {
            id: 'PDA_QUERY',
            name: '货物查询',
            type: 'menu'
        },
        {
            id: 'PDA_OPERATION',
            name: '拆板操作',
            type: 'menu'
        },
        {
            id: 'PDA_BIND',
            name: '合板操作',
            type: 'menu'
        }
    ]
  
}