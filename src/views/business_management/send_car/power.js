const moduleName = 'order/'
module.exports.id =  {
    id: 'SEND_CAR_MANAGEMENT',
    method: 'POST',
    name: '派车管理',
    type: 'menu',
    apiName: 'getSendCarList',
    url: `${moduleName}sendCar/list`
}

// let moduleName = ''
module.exports.children = {
    LOOK_STOWAGE_LIST: {
        id: 'SEND_CAR_MANAGEMENT_LOOK_STOWAGE_LIST',
        //apiName: 'sendcarTrackEdit',
        //method: 'POST',
        name: '查看配载单',
        type: 'view',
       // url: `${moduleName}sendCar/editTrack`
    },
    TRACK_CAR: {
        id: 'SEND_CAR_MANAGEMENT_TRACK_CAR',
        apiName: 'sendcarTrackEdit',
        method: 'POST',
        name: '追踪',
        type: 'view',
        url: `${moduleName}sendCar/editTrack`
    },
    TRACK_EDIT: {
        id: 'SEND_CAR_MANAGEMENT_TRACK_EDIT',
        name: '追踪编辑',
        type: 'view'
    },
    SIGN_CAR: {
        id: 'USER_RIGHTS_MANAGEMENT_BASE_USER_SIGN_CAR',
        apiName: 'singCar',
        method: 'POST',
        name: '签收',
        type: 'view',
        url: `${moduleName}sendCar/sign`
    },
    RETURN_FILE: {
        id: 'SEND_CAR_MANAGEMENT_RETURN_FILE',
        apiName: 'uploadReturnFile',
        method: 'POST',
        name: '回单上传',
        type: 'view',
        url: `${moduleName}sendCar/upload`
    },
    CANCEL_CAR: {
        id: 'SEND_CAR_MANAGEMENT_CANCEL_CAR',
        apiName: 'cancelCar',
        method: 'POST',
        name: '取消签收',
        type: 'view',
        url: `${moduleName}sendCar/cancel`
    },
    // CONFIRM_CAR: {
    //     id: 'SEND_CAR_MANAGEMENT_CONFIRM_CAR',
    //     apiName: 'confirmCar',
    //     method: 'POST',
    //     name: '确认',
    //     type: 'view',
    //     url: `${moduleName}sendCar/confirm`
    // },
    // DEL_DATA: {
    //     id: 'SEND_CAR_MANAGEMENT_DEL_DATA',
    //     apiName: 'delSendCar',
    //     method: 'POST',
    //     name: '删除',
    //     type: 'view',
    //     url: `${moduleName}sendCar/delete`
    // },
}