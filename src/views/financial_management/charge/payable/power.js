const prevUrl = "finance/payableEstimate"

module.exports.id = {
    id: 'FINANCIAL_MANAGEMENT_CHARGE_PAYABLE',
    method: 'POST',
    name: '应付预估',
    type: 'menu',
    apiName: 'getPayableEstimateList',
    url: `${prevUrl}/list`
}

module.exports.children = {
    ADD_DATA: {
        id: 'FINANCIAL_MANAGEMENT_CHARGE_PAYABLE_ADD_DATA',
        apiName: 'addPayableEstimate',
        method: 'POST',
        name: '生成预估单',
        type: 'view',
        url: `${prevUrl}/save`
    },
    DELETE_DATA: {
        id: 'FINANCIAL_MANAGEMENT_CHARGE_PAYABLE_DELETE_DATA',
        apiName: 'deletePayableEstimate',
        method: 'POST',
        name: '删除预估单',
        type: 'view',
        url: `${prevUrl}/delete`
    },
    EDIT_DATA: {
        id: 'FINANCIAL_MANAGEMENT_CHARGE_PAYABLE_EDIT_DATA',
        apiName: 'editPayableEstimate',
        method: 'POST',
        name: '编辑所属月份',
        type: 'view',
        url: `${prevUrl}/edit`
    },
    LOOK_DATA: {
        id: 'FINANCIAL_MANAGEMENT_CHARGE_PAYABLE_LOOK_DATA',
        name: '查看',
        type: 'view'
    },
    LOOK_DETAILS: {
        id: 'FINANCIAL_MANAGEMENT_CHARGE_PAYABLE_LOOK_DETAILS',
        name: '预估单明细',
        type: 'view'
    }
}