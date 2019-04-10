const moduleName = 'order/'
const getChildPowerJson = require('../../../../utils/getChildPowerJson')
const newPage = require('../edit/power_hide')
module.exports.id =  {
    id: 'ORDER_MAINTENANCE_LIST',
    method: 'POST',
    name: '应收数据维护',
    type: 'menu',
    apiName: 'getOrderMaintainList',
    url: `${moduleName}orderMaintain/list`
}

// let moduleName = ''
const nPage = getChildPowerJson.toJson(newPage)
module.exports.children = {
    [nPage.id]: nPage,
    EDIT_DATA: {
        id: 'ORDER_MAINTENANCE_EDIT_PAGE_EDIT',
        apiName: 'orderMaintenanceEdit',
        method: 'POST',
        name: '维护',
        type: 'view',
        url: `${moduleName}orderMaintain/edit`
    },
    ON_LOOK: {
        id: 'ORDER_MAINTENANCE_LIST_ON_LOOK',
        name: '查看',
        type: 'view'
    },
    BATCH_EDIT: {
        id: 'ORDER_MAINTENANCE_LIST_BATCH_EDIT',
        name: '批量维护',
        type: 'view'
    }
}