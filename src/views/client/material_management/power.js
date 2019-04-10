const moduleName = 'project/'
module.exports.id =  {
    id: 'PROJECT_MANAGEMENT_MATERIAL_MANAGEMENT',
    method: 'POST',
    name: '运输物料管理',
    type: 'menu',
    apiName: 'getMaterials',
    url: `${moduleName}materials/list`
}

// let moduleName = ''
module.exports.children = {
    // GET_LIST: {
    //     id: 'PROJECT_MANAGEMENT_MATERIAL_MANAGEMENT_GET_LIST',
    //     apiName: 'getConsignee',
    //     method: 'POST',
    //     name: '获取用户列表',
    //     type: 'view',
    //     url: `${moduleName}list`
    // },
    ADD_DATA: {
        id: 'PROJECT_MANAGEMENT_MATERIAL_MANAGEMENT_ADD_DATA',
        apiName: 'addMaterial',
        method: 'POST',
        name: '新建',
        type: 'view',
        url: `${moduleName}materials/save`
    },
    DEL_DATA: {
        id: 'PROJECT_MANAGEMENT_MATERIAL_MANAGEMENT_CODE',
        apiName: 'delMaterial',
        method: 'POST',
        name: '删除',
        type: 'view',
        url: `${moduleName}materials/delete`
    },
    EDIT_DATA: {
        id: 'PROJECT_MANAGEMENT_MATERIAL_MANAGEMENT_EDIT_DATA',
        apiName: 'editMaterial',
        method: 'POST',
        name: '编辑',
        type: 'view',
        url: `${moduleName}materials/save`
    },
    EXPORT_LIST: {
        id: 'PROJECT_MANAGEMENT_MATERIAL_MANAGEMENT_EXPORT_LIST',
        apiName: 'materialsExport',
        method: 'POSTFILE',
        name: '导出',
        type: 'view',
        url: `${moduleName}materials/export`
    },
    EXPORT_TEMP: {
        id: 'PROJECT_MANAGEMENT_MATERIAL_MANAGEMENT_EXPORT_TEMP',
        apiName: 'materialsExportTemplate',
        method: 'GETFILE',
        name: '导出物料模板',
        type: 'view',
        url: `${moduleName}materials/exportTemp`
    },
    IMPORT_MANAGEMENT: {
        id: 'PROJECT_MANAGEMENT_MATERIAL_MANAGEMENT_IMPORT_MANAGEMENT',
        apiName: 'batchSaveMaterials',
        method: 'POST',
        name: '导入',
        type: 'view',
        url: `${moduleName}materials/batchSave`
    },
    LOOK_MORE: {
        id: 'PROJECT_MANAGEMENT_MATERIAL_MANAGEMENT_LOOK_MORE',
        name: '查看',
        type: 'view'
    }
}