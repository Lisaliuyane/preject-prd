const moduleName = 'wms/receiptManage'
module.exports.id =  {
    id: 'WAREHOUSE_MANAGEMENT_ORDER',
    method: 'POST',
    name: '仓库订单',
    type: 'menu',
    apiName: 'getWareMaterials',
    url: `${moduleName}/list`
}

module.exports.children = {
    ADD_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_ADD_DATA',
       // apiName: 'addMaterial',
        //method: 'POST',
        name: '新建',
        type: 'view',
        // url: `${moduleName}materials/save`
    },
    DEL_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_CODE',
        apiName: 'delWareMaterial',
        method: 'POST',
        name: '删除',
        type: 'view',
        url: `${moduleName}materials/delete`
    },
    EDIT_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_EDIT_DATA',
        // apiName: 'editMaterial',
        // method: 'POST',
        name: '编辑',
        type: 'view',
        //url: `${moduleName}materials/save`
    },
    EXPORT_LIST: {
        id: 'WAREHOUSE_MANAGEMENT_EXPORT_LIST',
        // apiName: 'materialsExport',
        // method: 'POSTFILE',
        name: '导出',
        type: 'view',
        //url: `${moduleName}materials/export`
    }
}