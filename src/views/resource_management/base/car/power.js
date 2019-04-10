const moduleName = 'resource/'
module.exports.id =  {
    id: 'RESOURCE_MANAGEMENT_BASE_CAR',
    method: 'POST',
    name: '车辆资源',
    type: 'menu',
    apiName: 'getCars',
    url: `${moduleName}car/list`

}

module.exports.children = {
    ADD_DATA: {
        id: 'RESOURCE_MANAGEMENT_BASE_CAR_ADD_DATA',
        apiName: 'addCar',
        method: 'POST',
        name: '新建',
        type: 'view',
        url: `${moduleName}car/save`
    },
    DEL_DATA: {
        id: 'RESOURCE_MANAGEMENT_BASE_CAR_CODE',
        apiName: 'delCar',
        method: 'GET',
        name: '删除',
        type: 'view',
        url: `${moduleName}car/delete`
    },
    EDIT_DATA: {
        id: 'RESOURCE_MANAGEMENT_BASE_CAR_EDIT_DATA',
        apiName: 'editCar',
        method: 'POST',
        name: '编辑',
        type: 'view',
        url: `${moduleName}car/edit`
    },
    AUTH_DATA: {
        id: 'RESOURCE_MANAGEMENT_BASE_CAR_AUTH_DATA',
        apiName: 'authCar',
        method: 'POST',
        name: '认证',
        type: 'view',
        url: `${moduleName}car/auth`
    },
    CANCEL_AUTH: {
        id: 'RESOURCE_MANAGEMENT_BASE_CAR_CANCEL_AUTH',
        apiName: 'cancelAuthCar',
        method: 'POST',
        name: '取消认证',
        type: 'view',
        url: `${moduleName}car/cancelAuth`
    },
    EXPORT_LIST: {
        id: 'RESOURCE_MANAGEMENT_BASE_CAR_EXPORT_LIST',
        apiName: 'carExport',
        method: 'POSTFILE',
        name: '导出',
        type: 'view',
        url: `${moduleName}car/export`
    },
    EXPORT_TEMP: {
        id: 'RESOURCE_MANAGEMENT_BASE_CAR_EXPORT_TEMP',
        apiName: 'carExportTemplate',
        method: 'GETFILE',
        name: '导出车辆模板',
        type: 'view',
        url: `${moduleName}car/exportTemp`
    },
    IMPORT_CAR: {
        id: 'RESOURCE_MANAGEMENT_BASE_CAR_IMPORT_CAR',
        apiName: 'batchSaveCar',
        method: 'POST',
        name: '导入',
        type: 'view',
        url: `${moduleName}car/batchSave`
    },
    LOOK_MORE: {
        id: 'RESOURCE_MANAGEMENT_BASE_CAR_LOOK_MORE',
        name: '查看',
        type: 'view'
    }
}