const moduleName = 'account/'
module.exports.id =  {
    id: 'USER_RIGHTS_MANAGEMENT_BASE_DEPARTMENT',
    method: 'POST',
    name: '部门管理',
    type: 'menu',
    apiName: 'getOrganization',
    url: `${moduleName}organization/list`
}

// let moduleName = ''
module.exports.children = {
    // GET_LIST: {
    //     id: 'USER_RIGHTS_MANAGEMENT_BASE_DEPARTMENT_GET_LIST',
    //     apiName: 'getOrganization',
    //     method: 'GET',
    //     name: '获取列表',
    //     type: 'view',
    //     url: `${moduleName}organization/list`
    // },
    ADD_DATA: {
        id: 'USER_RIGHTS_MANAGEMENT_BASE_DEPARTMENT_ADD_DATA',
        apiName: 'addOrganization',
        method: 'POST',
        name: '新建',
        type: 'view',
        url: `${moduleName}organization/create`
    },
    DEL_DATA: {
        id: 'USER_RIGHTS_MANAGEMENT_BASE_DEPARTMENT_CODE',
        apiName: 'delOrganization',
        method: 'POST',
        name: '删除',
        type: 'view',
        url: `${moduleName}organization/delete`
    },
    EDIT_DATA: {
        id: 'USER_RIGHTS_MANAGEMENT_BASE_DEPARTMENT_EDIT_DATA',
        apiName: 'editOrganization',
        method: 'POST',
        name: '保存',
        type: 'view',
        url: `${moduleName}organization/edit`
    },
    // LOOK_MORE: {
    //     id: 'RESOURCE_MANAGEMENT_BASE_CAR_LOOK_MORE',
    //     name: '查看',
    //     type: 'view'
    // }
}