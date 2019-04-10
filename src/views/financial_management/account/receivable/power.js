const prevUrl = "finance/receivableReconciliation"

module.exports.id = {
    id: 'FINANCIAL_MANAGEMENT_ACCOUNT_RECEIVABLE',
    method: 'POST',
    name: '应收对账',
    type: 'menu',
    apiName: 'accountReceivableList',
    url: `order/order/list`
}

module.exports.children = {
    ADD_ACCOUNT: {
        id: 'FINANCIAL_MANAGEMENT_ACCOUNT_RECEIVABLE_ADD_ACCOUNT',
        apiName: 'addAccountReceivable',
        method: 'POST',
        name: '生成对账单',
        type: 'view',
        url: `${prevUrl}/save`
    },
    EDIT_ACCOUNT: {
        id: 'FINANCIAL_MANAGEMENT_ACCOUNT_RECEIVABLE_EDIT_ACCOUNT',
        apiName: 'editAccountReceivable',
        method: 'POST',
        name: '编辑应收对账',
        type: 'view',
        url: `${prevUrl}/edit`
    },
    CONFIRM_ACCOUNT: {
        id: 'FINANCIAL_MANAGEMENT_ACCOUNT_RECEIVABLE_CONFIRM_ACCOUNT',
        apiName: 'confirmAccountReceivable',
        method: 'POST',
        name: '确认应收对账',
        type: 'view',
        url: `${prevUrl}/confirm`
    },
    CANCEL_ACCOUNT: {
        id: 'FINANCIAL_MANAGEMENT_ACCOUNT_RECEIVABLE_CANCEL_ACCOUNT',
        apiName: 'cancelAccountReceivable',
        method: 'POST',
        name: '取消应收对账',
        type: 'view',
        url: `${prevUrl}/cancel`
    },
    CONFIRM_FINANCE: {
        id: 'FINANCIAL_MANAGEMENT_ACCOUNT_RECEIVABLE_CONFIRM_FINANCE',
        apiName: 'confirmFinanceReceivable',
        method: 'POST',
        name: '财务确认应收对账',
        type: 'view',
        url: `${prevUrl}/confirmByFinance`
    },
    CANCEL_FINANCE: {
        id: 'FINANCIAL_MANAGEMENT_ACCOUNT_RECEIVABLE_CANCEL_FINANCE',
        apiName: 'cancelFinanceReceivable',
        method: 'POST',
        name: '财务取消应收对账',
        type: 'view',
        url: `${prevUrl}/cancelByFinance`
    },
    DEL_ACCOUNT: {
        id: 'FINANCIAL_MANAGEMENT_ACCOUNT_RECEIVABLE_DEL_ACCOUNT',
        apiName: 'delAccountReceivable',
        method: 'POST',
        name: '删除应收对账',
        type: 'view',
        url: `${prevUrl}/delete`
    }
}