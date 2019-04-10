const moduleName = 'log/'
module.exports.id =  {
    id: 'SYSTEM_MANGEMENT_OPERATORLOG',
    method: 'POST',
    name: '操作日志',
    type: 'menu',
    apiName: 'getOperatorLog',
    url: `${moduleName}operatorLog/list`

}

module.exports.children = {
    // ADD_DATA: {
    //     id: 'RESOURCE_MANAGEMENT_BASE_CAR_ADD_DATA',
    //     apiName: 'addCar',
    //     method: 'POST',
    //     name: '新建',
    //     type: 'view',
    //     url: `${moduleName}car/save`
    // }
}