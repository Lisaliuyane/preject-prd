const moduleName = 'project/'
module.exports.id =  {
    id: 'BASIC_DATA_STORAGE_UNIT_CONFIG',
    name: '仓储单位配置',
    type: 'menu',
    //apiName: 'getUnitConfig',
    //url: `${moduleName}cooperationProject/getUnitMapping`
}


module.exports.children = {
    ADD_DATA: {
        id: 'BASIC_DATA_STORAGE_UNIT_CONFIG_ADD_DATA',
        //apiName: 'addUnitConfig',
       // method: 'POST',
        name: '提交',
        type: 'view',
        //url: `${moduleName}cooperationProject/saveUnitMapping`
    }
}