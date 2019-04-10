const moduleName = 'order/'
module.exports.id =  {
    id: 'BUSINESS_MANAGEMENT_ORDER_STOWAGE',
    method: 'POST',
    name: '配载操作',
    type: 'menu_hide',
    // apiName: 'getUsers',
    // url: `${moduleName}list`
}

// let moduleName = ''
module.exports.children = {
    STOWAGE_SUB: {
        id: 'BUSINESS_MANAGEMENT_ORDER_STOWAGE_STOWAGE_SUB',
        name: '提交',
        type: 'view'
    },
    STOWAGE_CONF: {
        id: 'BUSINESS_MANAGEMENT_ORDER_STOWAGE_STOWAGE_CONF',
        name: '确认',
        type: 'view'
    },
    QUOTATION_DETAILS: {
        id: 'BUSINESS_MANAGEMENT_ORDER_STOWAGE_STOWAGE_QUOTATION',
        name: '查看报价明细',
        type: 'view'
    }
}