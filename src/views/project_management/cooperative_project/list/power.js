const moduleName = 'project/'
const getChildPowerJson = require('../../../../utils/getChildPowerJson')
const newPage = require('../add/power_hide')
module.exports.id =  {
    id: 'PROJECT_MANAGEMENT_COOPERATIVE_PROJECT',
    method: 'POST',
    name: '项目管理',
    type: 'menu',
    apiName: 'getCooperativeList',
    url: `${moduleName}cooperationProject/list`
}

// let moduleName = ''
const nPage = getChildPowerJson.toJson(newPage)

module.exports.children = {
    // GET_LIST: {
    //     id: 'PROJECT_MANAGEMENT_DEMAND_IMPORT_GET_LIST',
    //     apiName: 'getDemandsList',
    //     method: 'POST',
    //     name: '获取需求列表',
    //     type: 'view',
    //     url: `${moduleName}demand/list`
    // },
    [nPage.id]: nPage,
    ADD_DATA: {
        id: 'PROJECT_MANAGEMENT_COOPERATIVE_PROJECT_ADD_DATA',
        apiName: 'addCooperativeProject',
        method: 'POST',
        name: '新建',
        type: 'view',
        url: `${moduleName}cooperationProject/save`
    },
    DEL_DATA: {
        id: 'PROJECT_MANAGEMENT_COOPERATIVE_PROJECT_DEL_DATA',
        apiName: 'deleteCooperativeProject',
        method: 'POST',
        name: '删除',
        type: 'view',
        url: `${moduleName}cooperationProject/delete`
    },
    // GET_CUSTOMSAREA: {
    //     id: 'BUSINESS_MANAGEMENT_ORDER_GET_CUSTOMSAREA',
    //     apiName: 'getCustoms',
    //     method: 'POST',
    //     name: '确认',
    //     type: 'view',
    //     url: `${moduleName}cooperationProject/getCustomsAreaByProjectId`
    // }
    // FILTER_CARRIER: {
    //     id: 'BUSINESS_MANAGEMENT_ORDER_FILTER_CARRIER',
    //     apiName: 'filterCarrier',
    //     method: 'POST',
    //     name: '根据项目ID获取运作承运商',
    //     type: 'view',
    //     url: `${moduleName}cooperationProject/getCarrierByIds`
    // },
    // GET_CARRIERS: {
    //     id: 'BUSINESS_MANAGEMENT_ORDER_GET_CARRIERS',
    //     apiName: 'filterCarriersByIds',
    //     method: 'POST',
    //     name: '确认',
    //     type: 'view',
    //     url: `${moduleName}cooperationProject/getCarrierByIds`
    // }
}