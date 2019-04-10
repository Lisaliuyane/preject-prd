const moduleName = "wms/warehouse"
const getChildPowerJson = require('../../../utils/getChildPowerJson')
const newPage = require('../define_add/power_hide')
module.exports.id = {
    id: 'WAREHOUSE_MANAGEMENT_DEFINE',
    method: 'POST',
    name: '仓库定义',
    type: 'menu',
    apiName: 'getWarehouseList',
    url: `${moduleName}/list`
}

const nPage = getChildPowerJson.toJson(newPage)
module.exports.children = {
    [nPage.id]: nPage,
    ADD_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_DEFINE_ADD_DATA',
        //apiName: 'editWarehouse',
        //method: 'POST',
        name: '新建',
        type: 'view',
       // url: `${moduleName}/edit`
    },
    EDIT_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_DEFINE_EDIT_DATA',
        apiName: 'editWarehouse',
        method: 'POST',
        name: '编辑',
        type: 'view',
        url: `${moduleName}/edit`
    },
    DEL_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_DEFINE_DEL_DATA',
        apiName: 'delWarehouse',
        method: 'GET',
        name: '删除',
        type: 'view',
        url: `${moduleName}/delete`
    }
}