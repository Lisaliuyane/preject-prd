const moduleName = 'project/'
module.exports.id =  {
    id: 'PROJECT_MANAGEMENT_OFFER_CUSTOMER_STORAGE',
    method: 'POST',
    name: '客户仓储报价',
    type: 'menu',
    apiName: 'getClientQuotation',
    url: `${moduleName}clientQuotation/list`
}

module.exports.children = {
    // GET_LIST: {
    //     id: 'PROJECT_MANAGEMENT_OFFER_CUSTOMER_STORAGE_GET_LIST',
    //     apiName: 'getClientQuotation',
    //     method: 'POST',
    //     name: '获取数据',
    //     type: 'view',
    //     url: `${moduleName}clientQuotation/list`
    // },
    ADD_DATA: {
        id: 'PROJECT_MANAGEMENT_OFFER_CUSTOMER_STORAGE_ADD_DATA',
        apiName: 'addClientQuotation',
        method: 'POST',
        name: '新建',
        type: 'view',
        url: `${moduleName}clientQuotation/addClientQuotation`
    },
    DEL_DATA: {
        id: 'PROJECT_MANAGEMENT_OFFER_CUSTOMER_STORAGE_CODE',
        apiName: 'delClientQuotation',
        method: 'POST',
        name: '删除',
        type: 'view',
        url: `${moduleName}clientQuotation/delete`
    },
    EDIT_DATA: {
        id: 'PROJECT_MANAGEMENT_OFFER_CUSTOMER_STORAGE_EDIT_DATA',
        apiName: 'editClientQuotation',
        method: 'POST',
        name: '编辑',
        type: 'view',
        url: `${moduleName}clientQuotation/editClientQuotation`
    },
    EXAMINE_PASS: {
        id: 'PROJECT_MANAGEMENT_OFFER_CUSTOMER_STORAGE_EXAMINE_PASS',
        apiName: 'clientQuotationExaminePass',
        method: 'GET',
        name: '审核通过',
        type: 'view',
        url: `${moduleName}clientQuotation/pass`
    },
    CANCEL_PASS: {
        id: 'PROJECT_MANAGEMENT_OFFER_CUSTOMER_STORAGE_CANCEL_PASS',
        apiName: 'clientQuotationCancelExaminePass',
        method: 'GET',
        name: '取消通过',
        type: 'view',
        url: `${moduleName}clientQuotation/cancel`
    },
    EXAMINE_REJECT: {
        id: 'PROJECT_MANAGEMENT_OFFER_CUSTOMER_STORAGE_EXAMINE_REJECT',
        apiName: 'clientQuotationExamineReject',
        method: 'POST',
        name: '审核驳回',
        type: 'view',
        url: `${moduleName}clientQuotation/reject`
    },
    EXAMINE_SUBMIT: {
        id: 'PROJECT_MANAGEMENT_OFFER_CUSTOMER_STORAGE_EXAMINE_SUBMIT',
        apiName: 'clientQuotationSubmit',
        method: 'GET',
        name: '提交',
        type: 'view',
        url: `${moduleName}clientQuotation/submit`
    },
    LOOK_MORE: {
        id: 'PROJECT_MANAGEMENT_OFFER_CUSTOMER_STORAGE_LOOK_MORE',
        name: '查看',
        type: 'view'
    }
}