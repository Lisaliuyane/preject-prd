const moduleName = 'resource/'
module.exports.id =  {
    id: 'RESOURCE_MANAGEMENT_BASE_NODE',
    method: 'POST',
    name: '中转地资源',
    type: 'menu',
    apiName: 'getNodeList',
    url: `${moduleName}node/list`
}

module.exports.children = {
    // GET_LIST: {
    //     id: 'RESOURCE_MANAGEMENT_BASE_NODE_GET_LIST',
    //     apiName: 'getNodeList',
    //     method: 'POST',
    //     name: '获取节点资源数据',
    //     type: 'view',
    //     url: 'resource/node/list'
    // },
    ADD_DATA: {
        id: 'RESOURCE_MANAGEMENT_BASE_NODE_ADD_DATA',
        apiName: 'addNode',
        method: 'POST',
        name: '新建',
        type: 'view',
        url: `${moduleName}node/save`
    },
    // GET_NODE: {
    //     id: 'RESOURCE_MANAGEMENT_BASE_NODE_GET_NODE',
    //     apiName: 'getNode',
    //     method: 'GET',
    //     name: '获取新增节点页面数据',
    //     type: 'view',
    //     url: `${moduleName}node/page/data`
    // },
    DEL_DATA: {
        id: 'RESOURCE_MANAGEMENT_BASE_NODE_DEL_DATA',
        apiName: 'delNode',
        method: 'GET',
        name: '删除',
        type: 'view',
        url: `${moduleName}node/delete`
    },
    EDIT_DATA: {
        id: 'RESOURCE_MANAGEMENT_BASE_NODE_EDIT_DATA',
        apiName: 'editNode',
        method: 'POST',
        name: '编辑',
        type: 'view',
        url: `${moduleName}node/edit`
    },
    EXPORT_LIST: {
        id: 'RESOURCE_MANAGEMENT_BASE_NODE_EXPORT_LIST',
        apiName: 'nodeExport',
        method: 'POSTFILE',
        name: '导出',
        type: 'view',
        url: `${moduleName}node/export`
    },
    EXPORT_TEMP: {
        id: 'RESOURCE_MANAGEMENT_BASE_NODE_EXPORT_TEMP',
        apiName: 'nodeExportTemplate',
        method: 'GETFILE',
        name: '导出中转地模板',
        type: 'view',
        url: `${moduleName}node/exportTemp`
    },
    IMPORT_NODE: {
        id: 'RESOURCE_MANAGEMENT_BASE_NODE_IMPORT_NODE',
        apiName: 'batchSaveNode',
        method: 'POST',
        name: '导入',
        type: 'view',
        url: `${moduleName}node/batchSave`
    },
    LOOK_MORE: {
        id: 'RESOURCE_MANAGEMENT_BASE_NODE_LOOK_MORE',
        name: '查看',
        type: 'view'
    }
}