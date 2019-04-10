const moduleName = 'project/'
module.exports.id =  {
    id: 'BASIC_DATA_UNIT_CONFIG',
    name: '运输单位配置',
    type: 'menu',
    apiName: 'getUnitConfig',
    url: `${moduleName}cooperationProject/getUnitMapping`
}


module.exports.children = {
    ADD_DATA: {
        id: 'BASIC_DATA_UNIT_CONFIG_ADD_DATA',
        apiName: 'addUnitConfig',
        method: 'POST',
        name: '提交',
        type: 'view',
        url: `${moduleName}cooperationProject/saveUnitMapping`
    },
    EDIT_DATA: {
        id: 'BASIC_DATA_UNIT_CONFIG_EDIT_DATA',
        apiName: 'editUnitConfig',
        method: 'POST',
        name: '编辑',
        type: 'view',
        url: `${moduleName}cooperationProject/editUnitMapping`
    },
    // LOOK_MORE: {
    //     id: 'BASIC_DATA_CAR_TYPE_LOOK_MORE',
    //     name: '查看更多',
    //     type: 'view'
    // }
}