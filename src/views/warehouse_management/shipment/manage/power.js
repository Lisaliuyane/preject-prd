const prevUrl = "wms/shipmentManage"
const pick = "wms/shipmentList"
const scanList = "wms/shipmentScanList"
const scanManage = "wms/outgoingScanManage"
module.exports.id = {
    id: 'WAREHOUSE_MANAGEMENT_SHIPMENT_MANAGE',
    method: 'POST',
    name: '出货管理',
    type: 'menu',
    apiName: 'getShipmentManage',
    url: `${prevUrl}/list`
}

module.exports.children = {
    GET_PICK_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_SHIPMENT_MANAGE_GET_PICK_DATA',
        apiName: 'getPickList',
        method: 'POST',
        name: '获取拣货明细列表',
        type: 'view',
        url: `${pick}/list`
    },
    CONFIRM_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_SHIPMENT_MANAGE_CONFIRM_DATA',
        apiName: 'confirmShipment',
        method: 'GET',
        name: '确认出货',
        type: 'view',
        url: `${prevUrl}/completeShipment`
    },
    SET_CONDITION_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_SHIPMENT_MANAGE_SET_CONDITION_DATA',
        apiName: 'setShipmentCondition',
        method: 'POST',
        name: '出货条件配置',
        type: 'view',
        url: `${scanManage}/update`
    },
    GET_SCAN_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_SHIPMENT_MANAGE_GET_SCAN_DATA',
        apiName: 'getShipmentScanList',
        method: 'POST',
        name: '获取出库扫描列表',
        type: 'view',
        url: `${scanList}/list`
    },
    IMPORT_PICK: {
        id: 'WAREHOUSE_MANAGEMENT_SHIPMENT_MANAGE_IMPORT_PICK',
        name: '拣货明细导出',
        type: 'view'
    },
    IMPORT_SCAN: {
        id: 'WAREHOUSE_MANAGEMENT_SHIPMENT_MANAGE_IMPORT_SCAN',
        name: '出库扫描导出',
        type: 'view'
    },
    SWITCH_SCAN: {
        id: 'WAREHOUSE_MANAGEMENT_SHIPMENT_MANAGE_SWITCH_SCAN',
        name: '出货扫描切换',
        type: 'view'
    }
}