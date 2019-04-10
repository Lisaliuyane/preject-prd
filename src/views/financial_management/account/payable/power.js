const prevUrl = "finance/payableReconciliation"

module.exports.id = {
    id: 'FINANCIAL_MANAGEMENT_ACCOUNT_PAYABLE',
    method: 'POST',
    name: '应付对账',
    type: 'menu',
    apiName: 'accountPayableList',
    url: `order/sendCar/list`
}

module.exports.children = {
    ADD_DATA: {
        id: 'FINANCIAL_MANAGEMENT_ACCOUNT_PAYABLE_ADD_DATA',
        apiName: 'addPayableAccount',
        method: 'POST',
        name: '生成对账单',
        type: 'view',
        url: `${prevUrl}/save`
    },
    EDIT_ACCOUNT: {
        id: 'FINANCIAL_MANAGEMENT_ACCOUNT_PAYABLE_EDIT_ACCOUNT',
        apiName: 'editAccountPayable',
        method: 'POST',
        name: '编辑应付对账',
        type: 'view',
        url: `${prevUrl}/edit`
    },
    CONFIRM_ACCOUNT: {
        id: 'FINANCIAL_MANAGEMENT_ACCOUNT_PAYABLE_CONFIRM_ACCOUNT',
        apiName: 'confirmAccountPayable',
        method: 'POST',
        name: '确认应付对账',
        type: 'view',
        url: `${prevUrl}/confirm`
    },
    CANCEL_ACCOUNT: {
        id: 'FINANCIAL_MANAGEMENT_ACCOUNT_PAYABLE_CANCEL_ACCOUNT',
        apiName: 'cancelAccountPayable',
        method: 'POST',
        name: '取消应付对账',
        type: 'view',
        url: `${prevUrl}/cancel`
    },
    CONFIRM_FINANCE: {
        id: 'FINANCIAL_MANAGEMENT_ACCOUNT_PAYABLE_CONFIRM_FINANCE',
        apiName: 'confirmFinancePayable',
        method: 'POST',
        name: '财务确认应付对账',
        type: 'view',
        url: `${prevUrl}/confirmByFinance`
    },
    CANCEL_FINANCE: {
        id: 'FINANCIAL_MANAGEMENT_ACCOUNT_PAYABLE_CANCEL_FINANCE',
        apiName: 'cancelFinancePayable',
        method: 'POST',
        name: '财务取消应付对账',
        type: 'view',
        url: `${prevUrl}/cancelByFinance`
    },
    DEL_ACCOUNT: {
        id: 'FINANCIAL_MANAGEMENT_ACCOUNT_PAYABLE_DEL_ACCOUNT',
        apiName: 'deletePayableAccount',
        method: 'POST',
        name: '删除对账单',
        type: 'view',
        url: `${prevUrl}/delete`
    }
}