const prevUrl = "wms/inventoryManage"
module.exports.id = {
    id: 'WAREHOUSE_MANAGEMENT_INVENTORY_MANAGE',
    method: 'POST',
    name: '库存管理',
    type: 'menu',
    apiName: 'getInventoryManage',
    url: `${prevUrl}/list`
}

module.exports.children = {
    IMPORT_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_INVENTORY_MANAGE_IMPORT_DATA',
       // apiName: 'dismantPlate',
       // method: 'POST',
        name: '库存导出',
        type: 'view',
        //url: `${prevUrl}/dismantlingPlate`
    },
    DISMANT_PLATE: {
        id: 'WAREHOUSE_MANAGEMENT_INVENTORY_MANAGE_DISMANT_PLATE',
        apiName: 'dismantPlate',
        method: 'POST',
        name: '拆板',
        type: 'view',
        url: `${prevUrl}/dismantlingPlate`
    },
    CHANGE_STATUS: {
        id: 'WAREHOUSE_MANAGEMENT_INVENTORY_MANAGE_CHANGE_STATUS',
        apiName: 'changeInventoryStatus',
        method: 'POST',
        name: '修改货物状态',
        type: 'view',
        url: `${prevUrl}/updateStatus`
    }
}