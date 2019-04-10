const moduleName = 'project/'
module.exports.id =  {
    id: 'PROJECT_MANAGEMENT_COOPERATIVE_PROJECT_DETAILS',
    method: 'POST',
    name: '项目明细',
    type: 'menu_hide',
    apiName: 'getCooperativeDetailOne',
    url: `${moduleName}cooperationProject/getOne`
}

// let moduleName = ''

module.exports.children = {
    // GET_LIST: {
    //     id: 'PROJECT_MANAGEMENT_DEMAND_IMPORT_GET_LIST',
    //     apiName: 'getDemandsList',
    //     method: 'POST',
    //     name: '获取需求列表',
    //     type: 'view',
    //     url: `${moduleName}demand/list`
    // },
    START_DATA: {
        id: 'PROJECT_MANAGEMENT_COOPERATIVE_PROJECT_DETAILS_START_DATA',
        apiName: 'poweroff',
        method: 'POST',
        name: '启动',
        type: 'view',
        url: `${moduleName}cooperationProject/start`
    },
    STOP_DATA: {
        id: 'PROJECT_MANAGEMENT_COOPERATIVE_PROJECT_DETAILS_STOP_DATA',
        apiName: 'pauseMethod',
        method: 'POST',
        name: '暂停',
        type: 'view',
        url: `${moduleName}cooperationProject/stop`
    },
    EDIT_DATA: {
        id: 'PROJECT_MANAGEMENT_COOPERATIVE_PROJECT_EDIT_DATA',
        apiName: 'editCooperativeProject',
        method: 'POST',
        name: '保存',
        type: 'view',
        url: `${moduleName}cooperationProject/edit`
    }
    // DEL_DATA: {
    //     id: 'PROJECT_MANAGEMENT_COOPERATIVE_PROJECT_DETAILS_DEL_DATA',
    //     apiName: 'deleteCooperativeDetail',
    //     method: 'POST',
    //     name: '删除',
    //     type: 'view',
    //     url: `${moduleName}demand/delete`
    // }
    // LOOK_MORE: {
    //     id: 'RESOURCE_MANAGEMENT_BASE_CAR_LOOK_MORE',
    //     name: '查看',
    //     type: 'view'
    // }
}