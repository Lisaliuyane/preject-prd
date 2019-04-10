module.exports.id =  {
    id: 'ADDRESS_FILE',
    method: 'POST',
    name: '地址档案',
    type: 'menu'
}

const moduleName = 'account/'
// let moduleName = ''
module.exports.children = {
    REGISTER: {
        id: 'ADDRESS_FILE_GET_LIST',
        apiName: 'getAddFileList',
        method: 'POST',
        name: '获取列表',
        type: 'view',
        url: `${moduleName}views/register`
    },
    AREA_CONFIG: {
        id: 'ADDRESS_FILE_AREA_CONFIG',
        name: '片区配置',
        type: 'view'
    }
}