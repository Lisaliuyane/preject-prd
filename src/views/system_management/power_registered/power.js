module.exports.id =  {
    id: 'POWER_REGISTERED',
    method: 'POST',
    name: '视图注册',
    type: 'menu'
}

const moduleName = 'account/'
// let moduleName = ''
module.exports.children = {
    REGISTER: {
        id: 'POWER_REGISTERED_GET_LIST',
        apiName: 'powerRegistered',
        method: 'POST',
        name: '获取列表',
        type: 'view',
        url: `${moduleName}views/register`
    }
}
