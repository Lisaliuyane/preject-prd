const moduleName = 'project/'
const getChildPowerJson = require('../../../../utils/getChildPowerJson')
const newPage = require('../add/power_hide')
//console.log('getChildPowerJson', getChildPowerJson.toJson(newPage))
module.exports.id =  {
    id: 'PROJECT_MANAGEMENT_DEMAND_IMPORT',
    method: 'POST',
    name: '需求导入规划',
    type: 'menu',
    apiName: 'getDemandsList',
    url: `${moduleName}demand/list`
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
        id: 'PROJECT_MANAGEMENT_DEMAND_IMPORT_ADD_DATA',
        apiName: 'addDemand',
        method: 'POST',
        name: '新建',
        type: 'view',
        url: `${moduleName}demand/add`
    },
    DEL_DATA: {
        id: 'PROJECT_MANAGEMENT_DEMAND_IMPORT_DEL_DATA',
        apiName: 'deleteDemand',
        method: 'POST',
        name: '删除',
        type: 'view',
        url: `${moduleName}demand/delete`
    }
    // LOOK_MORE: {
    //     id: 'RESOURCE_MANAGEMENT_BASE_CAR_LOOK_MORE',
    //     name: '查看',
    //     type: 'view'
    // }
}