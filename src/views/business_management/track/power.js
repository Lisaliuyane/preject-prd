const moduleName = 'track'
module.exports.id =  {
    id: 'TRACK_MANAGEMENT',
    method: 'POST',
    name: '订单追踪',
    type: 'menu',
    apiName: 'getTrackList',
    url: `order/order/list`
}

module.exports.children = {
    LOOK: {
        id: 'TRACK_MANAGEMENT_LOOK',
        //apiName: 'sendcarTrackEdit',
        //method: 'POST',
        name: '追踪',
        type: 'view',
       // url: `${moduleName}sendCar/editTrack`
    },
    // TRACK_CAR: {
    //     id: 'SEND_CAR_MANAGEMENT_TRACK_CAR',
    //     apiName: 'sendcarTrackEdit',
    //     method: 'POST',
    //     name: '追踪',
    //     type: 'view',
    //     url: `${moduleName}sendCar/editTrack`
    // },
    // TRACK_EDIT: {
    //     id: 'SEND_CAR_MANAGEMENT_TRACK_EDIT',
    //     name: '追踪编辑',
    //     type: 'view'
    // },
    // SIGN_CAR: {
    //     id: 'USER_RIGHTS_MANAGEMENT_BASE_USER_SIGN_CAR',
    //     apiName: 'singCar',
    //     method: 'POST',
    //     name: '签收',
    //     type: 'view',
    //     url: `${moduleName}sendCar/sign`
    // },
    // RETURN_FILE: {
    //     id: 'SEND_CAR_MANAGEMENT_RETURN_FILE',
    //     apiName: 'uploadReturnFile',
    //     method: 'POST',
    //     name: '回单上传',
    //     type: 'view',
    //     url: `${moduleName}sendCar/upload`
    // },
    // CANCEL_CAR: {
    //     id: 'SEND_CAR_MANAGEMENT_CANCEL_CAR',
    //     apiName: 'cancelCar',
    //     method: 'POST',
    //     name: '取消签收',
    //     type: 'view',
    //     url: `${moduleName}sendCar/cancel`
    // },
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