const checkUrl = "wms/checkManage"
module.exports.id = {
    id: 'WAREHOUSE_MANAGEMENT_INVENTORY_OPERATION',
    method: 'POST',
    name: '盘点作业',
    type: 'menu',
    apiName: 'getOperationList',
    url: `${checkUrl}/list`
}

module.exports.children = {
    ADD_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_INVENTORY_OPERATION_ADD_DATA',
        apiName: 'addCheckPlan',
        method: 'POST',
        name: '添加盘点计划',
        type: 'view',
        url: `${checkUrl}/add`
    },
    DEL_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_INVENTORY_OPERATION_DEL_DATA',
        apiName: 'deleteCheckPlan',
        method: 'GET',
        name: '删除盘点计划',
        type: 'view',
        url: `${checkUrl}/delete`
    },
    CONFIRM_CHECK_PLAN: {
        id: 'WAREHOUSE_MANAGEMENT_INVENTORY_OPERATION_CONFIRM_CHECK_PLAN',
        apiName: 'confirmCheckPlan',
        method: 'GET',
        name: '完成盘点计划',
        type: 'view',
        url: `${checkUrl}/confirm`
    },
    CHECK_PLAN_IMPORT: {
        id: 'WAREHOUSE_MANAGEMENT_INVENTORY_OPERATION_CHECK_PLAN_IMPORT',
        //apiName: 'confirmCheckPlan',
        //method: 'POST',
        name: '导出',
        type: 'view',
        //url: `${checkUrl}/confirm`
    },
}