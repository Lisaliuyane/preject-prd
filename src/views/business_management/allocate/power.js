const moduleName = 'order/'
const getChildPowerJson = require('../../../utils/getChildPowerJson')
const newPage = require('../allocate_edit/power_hide')
module.exports.id =  {
    id: 'BUSINESS_MANAGEMENT_ALLOCATE_LIST',
    method: 'POST',
    name: '配载管理',
    type: 'menu',
    apiName: 'getAllocateList',
    url: `${moduleName}stowage/list`

}

const nPage = getChildPowerJson.toJson(newPage)

module.exports.children = {
    [nPage.id]: nPage,
    EDIT_DATA: {
        id: 'BUSINESS_MANAGEMENT_ALLOCATE_EDIT_DATA',
        name: '编辑',
        type: 'view'
    },
    DEL_DATA: {
        id: 'BUSINESS_MANAGEMENT_ALLOCATE_DELETE_LIST',
        apiName: 'deleteAllocateList',
        method: 'POST',
        name: '删除',
        type: 'view',
        url: `${moduleName}stowage/delete`
    },
    LOOK_MORE: {
        id: 'BUSINESS_MANAGEMENT_ALLOCATE_LOOK_MORE',
        name: '查看',
        type: 'view'
    }
}