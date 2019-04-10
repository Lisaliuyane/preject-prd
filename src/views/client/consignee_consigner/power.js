const moduleName = 'project/'
module.exports.id =  {
    id: 'PROJECT_MANAGEMENT_CONSIGNEE_CONSIGNER',
    method: 'POST',
    name: '收发货方管理',
    type: 'menu',
    apiName: 'getConsignees',
    url: `${moduleName}receiverOrSender/list`
}

// let moduleName = ''
module.exports.children = {
    // GET_LIST: {
    //     id: 'PROJECT_MANAGEMENT_CONSIGNEE_CONSIGNER_GET_LIST',
    //     apiName: 'getConsignee',
    //     method: 'POST',
    //     name: '获取用户列表',
    //     type: 'view',
    //     url: `${moduleName}list`
    // },
    ADD_DATA: {
        id: 'PROJECT_MANAGEMENT_CONSIGNEE_CONSIGNER_ADD_DATA',
        apiName: 'addConsignee',
        method: 'POST',
        name: '新建',
        type: 'view',
        url: `${moduleName}receiverOrSender/save`
    },
    DEL_DATA: {
        id: 'PROJECT_MANAGEMENT_CONSIGNEE_CONSIGNER_CODE',
        apiName: 'delConsignee',
        method: 'POST',
        name: '删除',
        type: 'view',
        url: `${moduleName}receiverOrSender/delete`
    },
    EDIT_DATA: {
        id: 'PROJECT_MANAGEMENT_CONSIGNEE_CONSIGNER_EDIT_DATA',
        apiName: 'editConsignee',
        method: 'POST',
        name: '编辑',
        type: 'view',
        url: `${moduleName}receiverOrSender/save`
    },
    LOOK_MORE: {
        id: 'PROJECT_MANAGEMENT_CONSIGNEE_CONSIGNER_LOOK_MORE',
        name: '查看',
        type: 'view'
    }
}