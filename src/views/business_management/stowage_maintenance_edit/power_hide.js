const moduleName = 'order/'
module.exports.id =  {
    id: 'STOWAGE_MAINTENANCE_EDIT',
    method: 'POST',
    name: '配载维护明细',
    type: 'menu_hide',
    // apiName: 'getStowageMaintenance',
    // url: `${moduleName}stowageMaintain/list`
}

// let moduleName = ''
module.exports.children = {
    SAVE_DATA: {
        id: 'STOWAGE_MAINTENANCE_EDIT_SAVE_DATA',
        apiName: 'stowageMaintainEdit',
        method: 'POST',
        name: '录入-保存',
        type: 'view',
        url: `${moduleName}stowageMaintain/edit`
    },
    QUOTATION_DETAILS: {
        id: 'STOWAGE_MAINTENANCE_EDIT_QUOTATION_DETAILS',
        name: '录入-查看报价明细',
        type: 'view',
    }
    // SIGN_CAR: {
    //     id: 'USER_RIGHTS_MANAGEMENT_BASE_USER_SIGN_CAR',
    //     apiName: 'singCar',
    //     method: 'POST',
    //     name: '签收',
    //     type: 'view',
    //     url: `${moduleName}sendCar/sign`
    // },
    // DEL_DATA: {
    //     id: 'SEND_CAR_MANAGEMENT_DEL_DATA',
    //     apiName: 'delSendCar',
    //     method: 'POST',
    //     name: '删除',
    //     type: 'view',
    //     url: `${moduleName}sendCar/delete`
    // },
    // TRACK_CAR: {
    //     id: 'SEND_CAR_MANAGEMENT_TRACK_CAR',
    //     apiName: 'sendcarTrackEdit',
    //     method: 'POST',
    //     name: '派车追踪',
    //     type: 'view',
    //     url: `${moduleName}sendCar/editTrack`
    // }
}