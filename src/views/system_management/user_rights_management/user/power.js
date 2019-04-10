const moduleName = 'account/'
module.exports.id =  {
    id: 'USER_RIGHTS_MANAGEMENT_BASE_USER',
    method: 'POST',
    name: '用户管理',
    type: 'menu',
    apiName: 'getUsers',
    url: `${moduleName}list`
}

// let moduleName = ''
module.exports.children = {
    // GET_LIST: {
    //     id: 'USER_RIGHTS_MANAGEMENT_BASE_USER_GET_LIST',
    //     apiName: 'getUsers',
    //     method: 'POST',
    //     name: '获取用户列表',
    //     type: 'view',
    //     url: `${moduleName}list`
    // },
    ADD_DATA: {
        id: 'USER_RIGHTS_MANAGEMENT_BASE_USER_ADD_DATA',
        apiName: 'addUser',
        method: 'POST',
        name: '新建',
        type: 'view',
        url: `${moduleName}create`
    },
    DEL_DATA: {
        id: 'USER_RIGHTS_MANAGEMENT_BASE_USER_CODE',
        apiName: 'delUser',
        method: 'POST',
        name: '删除',
        type: 'view',
        url: `${moduleName}delete`
    },
    EDIT_DATA: {
        id: 'USER_RIGHTS_MANAGEMENT_BASE_USER_EDIT_DATA',
        apiName: 'editUser',
        method: 'POST',
        name: '编辑',
        type: 'view',
        url: `${moduleName}edit`
    },
    // PERMISSION_LIST: {
    //     id: 'USER_RIGHTS_MANAGEMENT_BASE_USER_PERMISSION_LIST',
    //     apiName: 'getPermission',
    //     method: 'GET',
    //     name: '获取权限列表',
    //     type: 'view',
    //     url: `${moduleName}permission/list`
    // },
    PASSWORD_RESET: {
        id: 'USER_RIGHTS_MANAGEMENT_BASE_USER_PASSWORD_RESET',
        apiName: 'passwordReset',
        method: 'POST',
        name: '密码重置',
        type: 'view',
        url: `${moduleName}password/reset`
    },
    ACCOUNT_AUTHORIZE: {
        id: 'USER_RIGHTS_MANAGEMENT_BASE_USER_ACCOUNT_AUTHORIZE',
        apiName: 'accountAuthorize',
        method: 'POST',
        name: '角色授权',
        type: 'view',
        url: `${moduleName}grant`
    },
    // USER_PERMISSION_LIST: {
    //     id: 'USER_RIGHTS_MANAGEMENT_BASE_USER_USER_PERMISSION_LIST',
    //     apiName: 'getUserPermission',
    //     method: 'GET',
    //     name: '获取用户权限列表(角色和权限)',
    //     type: 'view',
    //     url: `${moduleName}/permission/account/list`
    // },
    // LOOK_MORE: {
    //     id: 'USER_RIGHTS_MANAGEMENT_BASE_ROLE_LOOK_MORE',
    //     name: '查看',
    //     type: 'view'
    // }
}