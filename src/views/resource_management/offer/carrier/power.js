const moduleName = 'resource/'
module.exports.id =  {
    id: 'RESOURCE_MANAGEMENT_OFFER_CARRIER',
    method: 'POST',
    name: '承运商报价',
    type: 'menu',
    apiName: 'getOfferCarrier',
    url: `${moduleName}carrierQuotation/list`
}

module.exports.children = {
    // GET_LIST: {
    //     id: 'RESOURCE_MANAGEMENT_OFFER_CARRIER_GET_LIST',
    //     apiName: 'getOfferCarrier',
    //     method: 'POST',
    //     name: '获取数据',
    //     type: 'view',
    //     url: `${moduleName}carrierQuotation/list`
    // },
    ADD_DATA: {
        id: 'RESOURCE_MANAGEMENT_OFFER_CARRIER_ADD_DATA',
        apiName: 'addOfferCarrier',
        method: 'POST',
        name: '新建',
        type: 'view',
        url: `${moduleName}carrierQuotation/addTwo`
    },
    DEL_DATA: {
        id: 'RESOURCE_MANAGEMENT_OFFER_CARRIER_CODE',
        apiName: 'delOfferCarrier',
        method: 'POST',
        name: '删除',
        type: 'view',
        url: `${moduleName}carrierQuotation/delete`
    },
    EDIT_DATA: {
        id: 'RESOURCE_MANAGEMENT_OFFER_CARRIER_EDIT_DATA',
        apiName: 'editOfferCarrier',
        method: 'POST',
        name: '编辑',
        type: 'view',
        url: `${moduleName}carrierQuotation/editTwo`
    },
    CARRIER_PASS: {
        id: 'RESOURCE_MANAGEMENT_OFFER_CARRIER_CARRIER_PASS',
        apiName: 'offerExaminePass',
        method: 'POST',
        name: '审核通过',
        type: 'view',
        url: `${moduleName}carrierQuotation/pass`
    },
    CARRIER_CANCEL: {
        id: 'RESOURCE_MANAGEMENT_OFFER_CARRIER_CARRIER_CANCEL',
        apiName: 'offerCancelExaminePass',
        method: 'POST',
        name: '取消通过',
        type: 'view',
        url: `${moduleName}carrierQuotation/cancel`
    },
    CARRIER_REJECT: {
        id: 'RESOURCE_MANAGEMENT_OFFER_CARRIER_CARRIER_REJECT',
        apiName: 'offerExamineReject',
        method: 'POST',
        name: '审核驳回',
        type: 'view',
        url: `${moduleName}carrierQuotation/reject`
    },
    CARRIER_SUBMIT: {
        id: 'RESOURCE_MANAGEMENT_OFFER_CARRIER_CARRIER_SUBMIT',
        apiName: 'offerSubmit',
        method: 'POST',
        name: '提交',
        type: 'view',
        url: `${moduleName}carrierQuotation/submit`
    },
    LOOK_MORE: {
        id: 'RESOURCE_MANAGEMENT_OFFER_CARRIER_LOOK_MORE',
        name: '查看',
        type: 'view'
    }
}