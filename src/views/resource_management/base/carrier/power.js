const moduleName = 'resource/'
module.exports.id =  {
    id: 'RESOURCE_MANAGEMENT_BASE_CARRIER',
    method: 'POST',
    name: '承运商资源',
    type: 'menu',
    apiName: 'getCarrierList',
    url: `${moduleName}carrier/list`
}

// let moduleName = ''
module.exports.children = {
    // GET_LIST: {
    //     id: 'RESOURCE_MANAGEMENT_BASE_CARRIER_GET_LIST',
    //     apiName: 'getCarrierList',
    //     method: 'POST',
    //     name: '获取列表',
    //     type: 'view',
    //     url: `${moduleName}carrier/list`
    // },
    ADD_DATA: {
        id: 'RESOURCE_MANAGEMENT_BASE_CARRIER_ADD_DATA',
        apiName: 'addCarrier',
        method: 'POST',
        name: '新建',
        type: 'view',
        url: `${moduleName}carrier/save`
    },
    // GET_SEARCH_FIELD: {
    //     id: 'RESOURCE_MANAGEMENT_BASE_CARRIER_GET_SEARCH_FIELD',
    //     apiName: 'getSearchField',
    //     method: 'GET',
    //     name: '获取下拉列表数据字典数据数据',
    //     type: 'view',
    //     url: `${moduleName}carrier/getSearchFieldFromDictionary/`
    // },
    // GET_CANDRAW: {
    //     id: 'RESOURCE_MANAGEMENT_BASE_CARRIER_GET_CANDRAW',
    //     apiName: 'getCanDrawABill',
    //     method: 'GET',
    //     name: '获取类型为无车承运人和信息部（黄牛）的承运商',
    //     type: 'view',
    //     url: `${moduleName}carrier/getCarriersByOnlyCanDrawABill`
    // },
    // GET_DEPARTURE: {
    //     id: 'RESOURCE_MANAGEMENT_BASE_CARRIER_GET_DEPARTURE',
    //     apiName: 'getDeparture',
    //     method: 'GET',
    //     name: '获取起运地和目的地',
    //     type: 'view',
    //     url: `${moduleName}carrier/getDepartureOrDestination`
    // },
    DEL_DATA: {
        id: 'RESOURCE_MANAGEMENT_BASE_CARRIER_DEL_DATA',
        apiName: 'delCarrier',
        method: 'POST',
        name: '删除',
        type: 'view',
        url: `${moduleName}carrier/delete`
    },
    EDIT_DATA: {
        id: 'RESOURCE_MANAGEMENT_BASE_CARRIER_EDIT_DATA',
        apiName: 'editCarrier',
        method: 'POST',
        name: '编辑',
        type: 'view',
        url: `${moduleName}carrier/edit`
    },
    // QUERY_CARRIER: {
    //     id: 'RESOURCE_MANAGEMENT_BASE_CARRIER_QUERY_CARRIER',
    //     apiName: 'queryCarrier',
    //     method: 'POST',
    //     name: '查找承运商',
    //     type: 'view',
    //     url: `${moduleName}carrier/query`
    // },
    ON_DISABLE: {
        id: 'RESOURCE_MANAGEMENT_BASE_CARRIER_ON_DISABLE',
        apiName: 'onDisable',
        method: 'GET',
        name: '拉黑',
        type: 'view',
        url: `${moduleName}carrier/disable`
    },
    ON_ENABLE: {
        id: 'RESOURCE_MANAGEMENT_BASE_CARRIER_ON_ENABLE',
        apiName: 'oneEnable',
        method: 'GET',
        name: '取消拉黑',
        type: 'view',
        url: `${moduleName}carrier/enable`
    },
    EXPORT_LIST: {
        id: 'RESOURCE_MANAGEMENT_BASE_CARRIER_EXPORT_LIST',
        apiName: 'carrierExport',
        method: 'POSTFILE',
        name: '导出',
        type: 'view',
        url: `${moduleName}carrier/export`
    },
    EXPORT_TEMP: {
        id: 'RESOURCE_MANAGEMENT_BASE_CARRIER_EXPORT_TEMP',
        apiName: 'carrierExportTemplate',
        method: 'GETFILE',
        name: '导出承运商模板',
        type: 'view',
        url: `${moduleName}carrier/exportTemp`
    },
    IMPORT_CARRIER: {
        id: 'RESOURCE_MANAGEMENT_BASE_CARRIER_IMPORT_CARRIER',
        apiName: 'batchSaveCarrier',
        method: 'POST',
        name: '导入',
        type: 'view',
        url: `${moduleName}carrier/batchSave`
    },
    // UPDATE_OLD: {
    //     id: 'RESOURCE_MANAGEMENT_BASE_CARRIER_UPDATE_OLD',
    //     apiName: 'updateOldData',
    //     method: 'POST',
    //     name: '更新历史数据',
    //     type: 'view',
    //     url: `${moduleName}carrier/updateOldData`
    // },
    IMPORT_CONTACTS: {
        id: 'RESOURCE_MANAGEMENT_BASE_CARRIER_IMPORT_CONTACTS',
        apiName: 'importContacts',
        method: 'POST',
        name: '导入联系人',
        type: 'view',
        url: `${moduleName}carrier/contact/batchSave`
    },
    EXPORT_CONTACTS: {
        id: 'RESOURCE_MANAGEMENT_BASE_CARRIER_EXPORT_CONTACTS',
        apiName: 'exportContacts',
        method: 'POSTFILE',
        name: '导出联系人数据',
        type: 'view',
        url: `${moduleName}carrier/contact/export`
    },
    EXPORT_HEADER: {
        id: 'RESOURCE_MANAGEMENT_BASE_CARRIER_EXPORT_HEADER',
        apiName: 'exportContactsHeader',
        method: 'GETFILE',
        name: '导出联系人模板',
        type: 'view',
        url: `${moduleName}carrier/contact/exportTemp`
    },
    LOOK_MORE: {
        id: 'RESOURCE_MANAGEMENT_BASE_CARRIER_LOOK_MORE',
        name: '查看',
        type: 'view'
    }
}