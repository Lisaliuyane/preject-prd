const moduleName = 'common/'
module.exports.id =  {
    id: 'BASIC_DATA_CAR_TYPE',
    name: '车型管理',
    type: 'menu',
    apiName: 'getCarTypes',
    url: `${moduleName}carType/getCarTypes`
}


module.exports.children = {
    // GET_LIST: {
    //     id: 'BASIC_DATA_CAR_TYPE_GET_LIST',
    //     apiName: 'getCarTypes',
    //     method: 'POST',
    //     name: '获取列表',
    //     type: 'view',
    //     url: `${moduleName}carType/getCarTypes`
    // },
    ADD_DATA: {
        id: 'BASIC_DATA_CAR_TYPE_ADD_DATA',
        apiName: 'addCarType',
        method: 'POST',
        name: '新建',
        type: 'view',
        url: `${moduleName}/carType/save`
    },
    DEL_DATA: {
        id: 'BASIC_DATA_CAR_TYPE_CODE',
        apiName: 'delCarType',
        method: 'POST',
        name: '删除',
        type: 'view',
        url: `${moduleName}carType/delete`
    },
    EDIT_DATA: {
        id: 'BASIC_DATA_CAR_TYPE_EDIT_DATA',
        apiName: 'editCarType',
        method: 'POST',
        name: '编辑',
        type: 'view',
        url: `${moduleName}carType/edit`
    },
    LOOK_MORE: {
        id: 'BASIC_DATA_CAR_TYPE_LOOK_MORE',
        name: '查看',
        type: 'view'
    },
    BATCH_DEL: {
        id: 'BASIC_DATA_CAR_TYPE_BATCH_DEL',
        name: '批量删除',
        type: 'view'
    }
}