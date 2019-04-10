const prevUrl = "wms/receiptDemand"
module.exports.id = {
    id: 'WAREHOUSE_MANAGEMENT_RECEIPT_DEMAND',
    method: 'POST',
    name: '收货需求',
    type: 'menu',
    apiName: 'getReceipt',
    url: `${prevUrl}/list`
}

module.exports.children = {
    ADD_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_RECEIPT_DEMAND_ADD_DATA',
        apiName: 'addReceipt',
        method: 'POST',
        name: '新建',
        type: 'view',
        url: `${prevUrl}/add`
    },
    EDIT_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_RECEIPT_DEMAND_EDIT_DATA',
        apiName: 'editReceipt',
        method: 'POST',
        name: '编辑',
        type: 'view',
        url: `${prevUrl}/edit`
    },
    DEL_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_RECEIPT_DEMAND_DEL_DATA',
        apiName: 'delReceipt',
        method: 'GET',
        name: '删除',
        type: 'view',
        url: `${prevUrl}/delete`
    },
    SAVE_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_RECEIPT_DEMAND_SAVE_DATA',
        name: '保存',
        type: 'view'
    },
    CONFIRM_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_RECEIPT_DEMAND_CONFIRM_DATA',
        apiName: 'confirmReceipt',
        method: 'GET',
        name: '确认',
        type: 'view',
        url: `${prevUrl}/confirm`
    },
    CANCEL_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_RECEIPT_DEMAND_CANCEL_DATA',
        apiName: 'cancelReceipt',
        method: 'GET',
        name: '取消确认',
        type: 'view',
        url: `${prevUrl}/cancel`
    }
    // LOOK_MORE: {
    //     id: 'WAREHOUSE_MANAGEMENT_RECEIPT_DEMAND_LOOK_MORE',
    //     name: '查看',
    //     type: 'view'
    // },
}