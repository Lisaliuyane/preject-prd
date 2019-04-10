const moduleName = 'order/'
module.exports.id =  {
    id: 'BUSINESS_MANAGEMENT_ALLOCATE_LIST_EDIT',
    method: 'POST',
    name: '配载明细',
    type: 'menu_hide',
    // apiName: 'getUsers',
    // url: `${moduleName}list`
}

module.exports.children = {
    SAVE_DATA: {
        id: 'BUSINESS_MANAGEMENT_ALLOCATE_SAVE_EDIT',
        apiName: 'saveAllocateEdit',
        method: 'POST',
        name: '保存',
        type: 'view',
        url: `${moduleName}stowage/edit`
    },
    CONFIRM_DATA: {
        id: 'BUSINESS_MANAGEMENT_ALLOCATE_CONFIRM_EDIT',
        apiName: 'confirmAllocateEdit',
        method: 'POST',
        name: '确认',
        type: 'view',
        url: `${moduleName}stowage/confirm`
    },
    QUOTATION_DETAILS: {
        id: 'BUSINESS_MANAGEMENT_ALLOCATE_QUOTATION_DETAILS',
        name: '查看报价明细',
        type: 'view',
    }
}