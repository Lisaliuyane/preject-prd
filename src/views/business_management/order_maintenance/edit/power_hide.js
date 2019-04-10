const moduleName = 'order/'
module.exports.id =  {
    id: 'ORDER_MAINTENANCE_EDIT_PAGE',
    method: 'POST',
    name: '应收数据明细',
    type: 'menu_hide',
    apiName: 'getOneOrderMaintain',
    url: `${moduleName}orderMaintain/getOne`
}

// let moduleName = ''
module.exports.children = {
    EDIT_SAVE: {
        id: 'ORDER_MAINTENANCE_LIST_EDIT_SAVE',
        name: '维护-保存',
        type: 'view'
    },
    QUOTATION_DETAILS: {
        id: 'ORDER_MAINTENANCE_LIST_QUOTATION_DETAILS',
        name: '维护-查看报价明细',
        type: 'view'
    }
}