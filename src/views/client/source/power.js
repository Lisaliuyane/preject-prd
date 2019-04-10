module.exports.id =  {
    id: 'CLIENT_SOURCE',
    method: 'POST',
    name: '客户资料',
    type: 'menu',
    apiName: 'getClients',
    url: '/client/list'
}

module.exports.children = {
    // GET_LIST: {
    //     id: 'CLIENT_SOURCE_GET_LIST',
    //     apiName: 'getClients',
    //     method: 'POST',
    //     name: '获取客户资料数据',
    //     type: 'view',
    //     url: '/client/list'
    // },
    ADD_DATA: {
        id: 'CLIENT_SOURCE_ADD_DATA',
        apiName: 'createClient',
        method: 'POST',
        name: '新建',
        type: 'view',
        url: '/client/create'
    },
    // GEN_CODE: {
    //     id: 'CLIENT_SOURCE_GEN_CODE',
    //     apiName: 'gencode',
    //     method: 'POST',
    //     name: '获取客户代码',
    //     type: 'view',
    //     url: '/client/gencode'
    // },
    DEL_DATA: {
        id: 'CLIENT_SOURCE_DEL_DATA',
        apiName: 'delClient',
        method: 'GET',
        name: '删除',
        type: 'view',
        url: '/client/delete'
    },
    EDIT_DATA: {
        id: 'CLIENT_SOURCE_EDIT_DATA',
        apiName: 'editClient',
        method: 'POST',
        name: '编辑',
        type: 'view',
        url: '/client/edit'
    },
    BLUK_CREATE: {
        id: 'CLIENT_SOURCE_BLUK_CREATE',
        apiName: 'blukCreate',
        method: 'POST',
        name: '批量导入',
        type: 'view',
        url: '/client/blukcreate'
    },
    EXPORT_TEMPLATE: {
        id: 'CLIENT_SOURCE_EXPORT_TEMPLATE',
        apiName: 'clientExportTemplate',
        method: 'GETFILE',
        name: '导出模板',
        type: 'view',
        url: '/client/export'
    },
    LOOK_MORE: {
        id: 'CLIENT_SOURCE_LOOK_MORE',
        name: '查看',
        type: 'view'
    }
}