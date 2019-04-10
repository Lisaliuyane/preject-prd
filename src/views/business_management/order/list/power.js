const moduleName = 'order/'
const getChildPowerJson = require('../../../../utils/getChildPowerJson')
const newPage = require('../add/power_hide')
const stowagePage = require('./stowage_power')
module.exports.id =  {
    id: 'BUSINESS_MANAGEMENT_ORDER_LIST',
    method: 'POST',
    name: '订单管理',
    type: 'menu',
    apiName: 'getOrderList',
    url: `${moduleName}order/list`
}

// let moduleName = ''
const nPage = getChildPowerJson.toJson(newPage)
const sPage = getChildPowerJson.toJson(stowagePage) 
module.exports.children = {
    [nPage.id]: nPage,
    ADD_DATA: {
        id: 'BUSINESS_MANAGEMENT_ORDER_LIST_ADD_DATA',
        name: '新建',
        type: 'view'
    },
    EDIT_DATA: {
        id: 'BUSINESS_MANAGEMENT_ORDER_LIST_EDIT_DATA',
        apiName: 'editOrder',
        method: 'POST',
        name: '待确认-编辑',
        type: 'view',
        url: `${moduleName}order/edit`
    },
    DEL_DATA: {
        id: 'BUSINESS_MANAGEMENT_ORDER_LIST_DEL_DATA',
        apiName: 'delOrder',
        method: 'POST',
        name: '待确认-删除',
        type: 'view',
        url: `${moduleName}order/delete`
    },
    SPLIT_DATA: {
        id: 'BUSINESS_MANAGEMENT_ORDER_LIST_SPLIT_DATA',
        apiName: 'splitOrder',
        method: 'POST',
        name: '可配载-拆单',
        type: 'view',
        url: `${moduleName}order/dismantling`
    },
    BATCH_COMPLET: {
        id: 'BUSINESS_MANAGEMENT_ORDER_LIST_BATCH_COMPLET',
        //apiName: 'splitOrder',
        //method: 'POST',
        name: '可配载-批量完成',
        type: 'view',
        //url: `${moduleName}order/dismantling`
    },
    ORDER_STOWAGE: {
        id: 'BUSINESS_MANAGEMENT_ORDER_LIST_ORDER_STOWAGE',
        apiName: 'stowageOrder',
        method: 'POST',
        name: '可配载-配载',
        type: 'view',
        url: `${moduleName}stowage/save`
    },
    CANCEL_STOWAGE: {
        id: 'BUSINESS_MANAGEMENT_ORDER_LIST_CANCEL_STOWAGE',
        name: '可配载-取消配载',
        type: 'view'
    },
    CANCEL_CONFIRM: {
        id: 'BUSINESS_MANAGEMENT_ORDER_LIST_ORDER_CANCEL_CONFIRM',
        apiName: 'cancelOrderConfirm',
        method: 'POST',
        name: '可配载-取消确认',
        type: 'view',
        url: `${moduleName}order/cancel`
    },
    FINISH_STOWAGE: {
        id: 'BUSINESS_MANAGEMENT_ORDER_LIST_ORDER_FINISH_STOWAGE',
        apiName: 'finishOrderStowage',
        method: 'POST',
        name: '可配载-完成',
        type: 'view',
        url: `${moduleName}order/finish`
    },
    STOWAGE_START: {
        id: 'BUSINESS_MANAGEMENT_ORDER_LIST_STOWAGE_START',
        name: '可配载-开始配载',
        type: 'view',
    },
    STOWAGE_GOODS: {
        id: 'BUSINESS_MANAGEMENT_ORDER_LIST_STOWAGE_GOODS',
        name: '可配载-货物明细',
        type: 'view',
    },
    AGAIN_STOWAGE: {
        id: 'BUSINESS_MANAGEMENT_ORDER_LIST_ORDER_AGAIN_STOWAGE',
        apiName: 'againOrderStowage',
        method: 'POST',
        name: '待签收-再配载',
        type: 'view',
        url: `${moduleName}order/stowageAgain`
    },
    SIGN_ORDER: {
        id: 'BUSINESS_MANAGEMENT_ORDER_LIST_ORDER_SIGN_ORDER',
        apiName: 'signOrder',
        method: 'POST',
        name: '待签收-签收',
        type: 'view',
        url: `${moduleName}order/sign`
    },
    CANCEL_SIGN_ORDER: {
        id: 'BUSINESS_MANAGEMENT_ORDER_LIST_ORDER_CANCEL_SIGN_ORDER',
        apiName: 'cancelSignOrder',
        method: 'POST',
        name: '已签收-取消签收',
        type: 'view',
        url: `${moduleName}order/cancelSign`
    },
    SIGN_ORDER_UPLOAD: {
        id: 'BUSINESS_MANAGEMENT_ORDER_LIST_ORDER_SIGN_ORDER_UPLOAD',
       // apiName: 'cancelSignOrder',
       // method: 'POST',
        name: '已签收-上传',
        type: 'view',
        //url: `${moduleName}order/cancelSign`
    },
    // ON_LOOK: {
    //     id: 'BUSINESS_MANAGEMENT_ORDER_LIST_ORDER_SIGN_ON_LOOK',
    //     name: '查看',
    //     type: 'view'
    // },
    ORDER_TRACK: {
        id: 'BUSINESS_MANAGEMENT_ORDER_LIST_ORDER_ORDER_TRACK',
        apiName: 'orderTrack',
        method: 'POST',
        name: '追踪',
        type: 'view',
        url: `${moduleName}order/track`
    },
    [sPage.id]: sPage
    // ORDER_STOWAGE_CONFIRM: {
    //     id: 'BUSINESS_MANAGEMENT_ORDER_LIST_ORDER_STOWAGE_CONFIRM',
    //     apiName: 'stowageAndConfirmOrder',
    //     method: 'POST',
    //     name: '配载并确认',
    //     type: 'view',
    //     url: `${moduleName}stowage/saveAndConfirm`
    // },
    
    // DIRECT_CAR: {
    //     id: 'BUSINESS_MANAGEMENT_ORDER_LIST_ORDER_DIRECT_CAR',
    //     apiName: 'directSendCarOrder',
    //     method: 'POST',
    //     name: '直接派车',
    //     type: 'view',
    //     url: `${moduleName}sendCar/directSendCar`
    // },
    // STOWAGE_ROUTE: {
    //     id: 'BUSINESS_MANAGEMENT_ORDER_LIST_ORDER_STOWAGE_ROUTE',
    //     apiName: 'getNoStowageRoute',
    //     method: 'POST',
    //     name: '查询指定订单的未配载路线',
    //     type: 'view',
    //     url: `${moduleName}order/getNoStowageRoute`
    // },
    // TRANSPORT_DATA: {
    //     id: 'BUSINESS_MANAGEMENT_ORDER_LIST_TRANSPORT_DATA',
    //     apiName: 'getTransportData',
    //     method: 'POST',
    //     name: '获取中转地和仓库',
    //     type: 'view',
    //     url: `resource/node/getNodeAndWarehouse`
    // }
}