const moduleName = 'resource/'
module.exports.id =  {
    id: 'RESOURCE_MANAGEMENT_BASE_DRIVER',
    method: 'POST',
    name: '司机资源',
    apiName: 'getDrivers',
    type: 'menu',
    url: `${moduleName}driver/list`
}

// let moduleName = ''
module.exports.children = {
    // GET_LIST: {
    //     id: 'RESOURCE_MANAGEMENT_BASE_DRIVER_GET_LIST',
    //     apiName: 'getList',
    //     method: 'POST',
    //     name: '获取数据',
    //     type: 'view',
    //     url: `${moduleName}driver/list`
    // },
    ADD_DATA: {
        id: 'RESOURCE_MANAGEMENT_BASE_DRIVER_ADD_DATA',
        apiName: 'addDriver',
        method: 'POST',
        name: '新建',
        type: 'view',
        url: `${moduleName}driver/save`
    },
    // GET_DRIVER: {
    //     id: 'RESOURCE_MANAGEMENT_BASE_DRIVER_GET_DRIVER',
    //     apiName: 'getDriver',
    //     method: 'GET',
    //     name: '获取新增司机页面数据',
    //     type: 'view',
    //     url: `${moduleName}driver/page/data`
    // },
    DEL_DATA: {
        id: 'RESOURCE_MANAGEMENT_BASE_DRIVER_DEL_DATA',
        apiName: 'delDriver',
        method: 'POST',
        name: '删除',
        type: 'view',
        url: `${moduleName}driver/delete`
    },
    EDIT_DATA: {
        id: 'RESOURCE_MANAGEMENT_BASE_DRIVER_EDIT_DATA',
        apiName: 'editDriver',
        method: 'POST',
        name: '编辑',
        type: 'view',
        url: `${moduleName}driver/edit`
    },
    AUTH_DATA: {
        id: 'RESOURCE_MANAGEMENT_BASE_DRIVER_AUTH_DATA',
        apiName: 'authDriver',
        method: 'POST',
        name: '认证',
        type: 'view',
        url: `${moduleName}driver/auth`
    },
    CANCEL_AUTH: {
        id: 'RESOURCE_MANAGEMENT_BASE_DRIVER_ CANCEL_AUTH',
        apiName: 'cancelAuthDriver',
        method: 'POST',
        name: '取消认证',
        type: 'view',
        url: `${moduleName}driver/cancelAuth`
    },
    EXPORT_LIST: {
        id: 'RESOURCE_MANAGEMENT_BASE_DRIVER_EXPORT_LIST',
        apiName: 'driverExport',
        method: 'POSTFILE',
        name: '导出',
        type: 'view',
        url: `${moduleName}driver/export`
    },
    EXPORT_TEMP: {
        id: 'RESOURCE_MANAGEMENT_BASE_DRIVER_EXPORT_TEMP',
        apiName: 'driverExportTemplate',
        method: 'GETFILE',
        name: '导出司机模板',
        type: 'view',
        url: `${moduleName}driver/exportTemp`
    },
    IMPORT_DRIVER: {
        id: 'RESOURCE_MANAGEMENT_BASE_DRIVER_IMPORT_DRIVER',
        apiName: 'batchSaveDriver',
        method: 'POST',
        name: '导入',
        type: 'view',
        url: `${moduleName}driver/batchSave`
    },
    LOOK_MORE: {
        id: 'RESOURCE_MANAGEMENT_BASE_DRIVER_LOOK_MORE',
        name: '查看',
        type: 'view'
    }
}