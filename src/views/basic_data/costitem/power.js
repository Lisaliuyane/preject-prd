const moduleName = 'common/'
module.exports.id =  {
    id: 'BASIC_DATA_COST_ITEM',
    name: '费用项',
    type: 'menu',
    apiName: 'getCostItems',
    url: `${moduleName}expense/getExpenses`
}


module.exports.children = {
    // GET_LIST: {
    //     id: 'BASIC_DATA_COST_ITEM_GET_LIST',
    //     apiName: 'getCostItems',
    //     method: 'POST',
    //     name: '获取列表',
    //     type: 'view',
    //     url: `${moduleName}expense/getExpenses`
    // },
    ADD_DATA: {
        id: 'BASIC_DATA_COST_ITEM_ADD_DATA',
        apiName: 'addCostItem',
        method: 'POST',
        name: '新建',
        type: 'view',
        url: `${moduleName}expense/save`
    },
    EDIT_DATA: {
        id: 'BASIC_DATA_COST_ITEM_EDIT_DATA',
        apiName: 'editCostItem',
        method: 'POST',
        name: '编辑',
        type: 'view',
        url: `${moduleName}expense/edit`
    },
    DEL_DATA: {
        id: 'BASIC_DATA_COST_ITEM_DEL_DATA',
        apiName: 'delCostItem',
        method: 'POST',
        name: '删除',
        type: 'view',
        url: `${moduleName}expense/delete`
    },
    LOOK_MORE: {
        id: 'BASIC_DATA_COST_ITEM_LOOK_MORE',
        name: '查看',
        type: 'view'
    },
    BATCH_DEL: {
        id: 'BASIC_DATA_COST_ITEM_BATCH_DEL',
        name: '批量删除',
        type: 'view'
    }
}