const moduleName = 'order/'
module.exports.id =  {
    id: 'BUSINESS_MANAGEMENT_ORDER_ADD',
    method: 'POST',
    name: '订单编辑明细',
    type: 'menu_hide',
    // apiName: 'getUsers',
    // url: `${moduleName}list`
}

// let moduleName = ''
module.exports.children = {
    // ADD_PRA_ORDER: {
    //     id: 'BUSINESS_MANAGEMENT_ORDER_ADD_PRA_ORDER',
    //     apiName: 'addPraOrder',
    //     method: 'POST',
    //     name: '提交预订单',
    //     type: 'view',
    //     url: `${moduleName}order/saveOrderForm`
    // },
    ADD_PRA: {
        id: 'BUSINESS_MANAGEMENT_ORDER_ADD_PRA',
        apiName: 'addOrder',
        method: 'POST',
        name: '提交',
        type: 'view',
        url: `${moduleName}order/save`
    },
    CONFIRM_DATA: {
        id: 'BUSINESS_MANAGEMENT_ORDER_CONFIRM_DATA',
        apiName: 'confirmOrder',
        method: 'POST',
        name: '确认',
        type: 'view',
        url: `${moduleName}order/confirm`
    },
    ADD_SEND: {
        id: 'BUSINESS_MANAGEMENT_ORDER_ADD_SEND',
        name: '新建发货方',
        type: 'view'
    },
    EDIT_SEND: {
        id: 'BUSINESS_MANAGEMENT_ORDER_EDIT_SEND',
        name: '编辑发货方',
        type: 'view'
    },
    ADD_RECIVE: {
        id: 'BUSINESS_MANAGEMENT_ORDER_ADD_RECIVE',
        name: '新建收货方',
        type: 'view'
    },
    EDIT_RECIVE: {
        id: 'BUSINESS_MANAGEMENT_ORDER_EDIT_RECIVE',
        name: '编辑收货方',
        type: 'view'
    },
    QUOTATION_DETAILS: {
        id: 'BUSINESS_MANAGEMENT_ORDER_QUOTATION_DETAILS',
        name: '查看报价明细',
        type: 'view'
    }
    // GET_RECEIVERS: {
    //     id: 'BUSINESS_MANAGEMENT_ORDER_GET_RECEIVERS',
    //     apiName: 'getReciversAndWarehouse',
    //     method: 'POST',
    //     name: '获取收发货方列表和仓库列表',
    //     type: 'view',
    //     url: `project/receiverOrSender/getList`
    // }
}