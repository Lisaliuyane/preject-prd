const moduleName = 'account/'
module.exports.id =  {
    id: 'USER_RIGHTS_MANAGEMENT_BASE_ROLE',
    method: 'POST',
    name: '角色权限管理',
    type: 'menu',
    apiName: 'getRole',
    url: `${moduleName}role/list`
}

// let moduleName = ''
module.exports.children = {
    // GET_LIST: {
    //     id: 'USER_RIGHTS_MANAGEMENT_BASE_ROLE_GET_LIST',
    //     apiName: 'getRole',
    //     method: 'POST',
    //     name: '获取角色列表',
    //     type: 'view',
    //     url: `${moduleName}role/list`
    // },
    ADD_DATA: {
        id: 'USER_RIGHTS_MANAGEMENT_BASE_ROLE_ADD_DATA',
        apiName: 'addRole',
        method: 'POST',
        name: '新建',
        type: 'view',
        url: `${moduleName}role/create`
    },
    DEL_DATA: {
        id: 'USER_RIGHTS_MANAGEMENT_BASE_ROLE_CODE',
        apiName: 'delRole',
        method: 'POST',
        name: '删除',
        type: 'view',
        url: `${moduleName}role/delete`
    },
    EDIT_DATA: {
        id: 'USER_RIGHTS_MANAGEMENT_BASE_ROLE_EDIT_DATA',
        apiName: 'editRole',
        method: 'POST',
        name: '编辑',
        type: 'view',
        url: `${moduleName}role/edit`
    },
    ROLE_GRANT: {
        id: 'USER_RIGHTS_MANAGEMENT_BASE_ROLE_ROLE_GRANT',
        apiName: 'roleGrant',
        method: 'POST',
        name: '权限分配',
        type: 'view',
        url: `${moduleName}role/grant`
    },
    // GET_PERMISSION: {
    //     id: 'USER_RIGHTS_MANAGEMENT_BASE_ROLE_GET_PERMISSION',
    //     apiName: 'getRolePermission',
    //     method: 'GET',
    //     name: '获取角色权限列表',
    //     type: 'view',
    //     url: `${moduleName}role/permission/list`
    // },
    // LOOK_MORE: {
    //     id: 'USER_RIGHTS_MANAGEMENT_BASE_ROLE_LOOK_MORE',
    //     name: '查看',
    //     type: 'view'
    // }
}