const moduleName = "wms/warehouse"
const storageModule = "wms/warehouseStorage"
// const childrenModuleName = "wms/warehouseStorage"
module.exports.id = {
    id: 'WAREHOUSE_MANAGEMENT_ADD_WAREHOUSE',
    method: 'POST',
    name: '仓库明细',
    type: 'menu_hide'
    // apiName: 'createWarehouse',
    // url: `${moduleName}/add`
}

module.exports.children = {
    ADD_BUTTON: {
        id: 'WAREHOUSE_MANAGEMENT_ADD_WAREHOUSE_ADD_BUTTON',
        apiName: 'addWarehouse',
        method: 'POST',
        name: '新建',
        type: 'view',
        url: `${moduleName}/add`
    },
    SAVE_BUTTON: {
        id: 'WAREHOUSE_MANAGEMENT_ADD_WAREHOUSE_SAVE_BUTTON',
        apiName: 'editWarehouse',
        method: 'POST',
        name: '保存',
        type: 'view',
        url: `${moduleName}/edit`
    },
    ADD_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_DEFINE_ADD_STORAGE_DATA',
        apiName: 'addStorage',
        method: 'POST',
        name: '新建储位',
        type: 'view',
        url: `${storageModule}/add`
    },
    EDIT_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_DEFINE_EDIT_STORAGE_DATA',
        apiName: 'editStorage',
        method: 'POST',
        name: '编辑储位',
        type: 'view',
        url: `${storageModule}/edit`
    },
    DEL_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_DEFINE_DELETE_STORAGE_DATA',
        apiName: 'deleteStorage',
        method: 'GET',
        name: '删除储位',
        type: 'view',
        url: `${storageModule}/delete`
    },
    BATCH_DEL: {
        id: 'WAREHOUSE_MANAGEMENT_DEFINE_DELETE_STORAGE_BATCH',
        apiName: 'deleteStorageBatch',
        method: 'POST',
        name: '批量删除储位',
        type: 'view',
        url: `${storageModule}/batch/delete`
    },
    IMPORT_STORAGE_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_DEFINE_IMPORT_STORAGE_DATA',
        apiName: 'importWarehouseStorage',
        method: 'POST',
        name: '导入储位数据',
        type: 'view',
        url: `${storageModule}/batch/add`
    }
}