const moduleName = 'order/'
const getChildPowerJson = require('../../../utils/getChildPowerJson')
const newPage = require('../stowage_maintenance_edit/power_hide')
module.exports.id =  {
    id: 'STOWAGE_MAINTENANCE_LIST',
    method: 'POST',
    name: '配载数据维护',
    type: 'menu',
    apiName: 'getStowageMaintenance',
    url: `${moduleName}stowageMaintain/list`
}

// let moduleName = ''
const nPage = getChildPowerJson.toJson(newPage)
module.exports.children = {
    [nPage.id]: nPage,
    EDIT_DATA: {
        id: 'STOWAGE_MAINTENANCE_LIST_EDIT_DATA',
        name: '录入',
        type: 'view'
    },
    LOOK_MORE: {
        id: 'STOWAGE_MAINTENANCE_LIST_LOOK_MORE',
        name: '查看',
        type: 'view'
    },
    BATCH_EDIT: {
        id: 'STOWAGE_MAINTENANCE_LIST_BATCH_EDIT',
        //apiName: 'deleteAllocateList',
        //method: 'POST',
        name: '批量补录',
        type: 'view',
        //url: `${moduleName}stowage/delete`
    }

    // GET_OPERATORLIST: {
    //     id: 'STOWAGE_MAINTENANCE_LIST_GET_OPERATORLIST',
    //     apiName: 'getFilterOperatorList',
    //     method: 'GET',
    //     name: '获取筛选条件创建人列表',
    //     type: 'view',
    //     url: `${moduleName}stowageMaintain/getOperatorList`
    // }
}