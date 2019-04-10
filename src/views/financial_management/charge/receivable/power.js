const prevUrl = "finance/receivableEstimate"

module.exports.id = {
    id: 'FINANCIAL_MANAGEMENT_CHARGE_RECEIVABLE',
    method: 'POST',
    name: '应收预估',
    type: 'menu',
    apiName: 'chargeReceivableList',
    url: `${prevUrl}/list`
}

module.exports.children = {
    DO_ESTIMATE: {
        id: 'FINANCIAL_MANAGEMENT_CHARGE_RECEIVABLE_DO_ESTIMATE',
        apiName: 'chargeReceivableEstimate',
        method: 'POST',
        name: '生成预估单',
        type: 'view',
        url: `${prevUrl}/save`
    },
    DO_EDIT: {
        id: 'FINANCIAL_MANAGEMENT_CHARGE_RECEIVABLE_DO_EDIT',
        apiName: 'editChargeReceivableEstimate',
        method: 'POST',
        name: '编辑所属月份',
        type: 'view',
        url: `${prevUrl}/edit`
    },
    DO_DELETE: {
        id: 'FINANCIAL_MANAGEMENT_CHARGE_RECEIVABLE_DO_DELETE',
        apiName: 'deleteChargeReceivableEstimate',
        method: 'POST',
        name: '删除预估单',
        type: 'view',
        url: `${prevUrl}/delete`
    },
    LOOK_ORDER: {
        id: 'FINANCIAL_MANAGEMENT_CHARGE_LOOK_ORDER',
        name: '查看订单',
        type: 'view'
    },
    LOOK_DATA: {
        id: 'FINANCIAL_MANAGEMENT_CHARGE_LOOK_DATA',
        name: '查看费用明细',
        type: 'view'
    },
    LOOK_DETAILS: {
        id: 'FINANCIAL_MANAGEMENT_CHARGE_LOOK_DETAILS',
        name: '预估单明细',
        type: 'view'
    }
}