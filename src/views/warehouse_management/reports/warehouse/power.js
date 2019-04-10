const moduleName = 'wms/receiptManage'
module.exports.id =  {
    id: 'WAREHOUSE_MANAGEMENT_INVENTORY_REPORT',
    method: 'POST',
    name: '入库报表',
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
    },
    EXPORT_TEMP: {
        id: 'WAREHOUSE_MANAGEMENT_EXPORT_TEMP',
        // apiName: 'materialsExportTemplate',
        // method: 'GETFILE',
        name: '导出物料模板',
        type: 'view',
        //url: `${moduleName}materials/exportTemp`
    },
    IMPORT_MANAGEMENT: {
        id: 'WAREHOUSE_MANAGEMENT_IMPORT_MANAGEMENT',
        // apiName: 'batchSaveMaterials',
        // method: 'POST',
        name: '导入',
        type: 'view',
        //url: `${moduleName}materials/batchSave`
    },
    LOOK_MORE: {
        id: 'WAREHOUSE_MANAGEMENT_LOOK_MORE',
        name: '查看',
        type: 'view'
    }
}