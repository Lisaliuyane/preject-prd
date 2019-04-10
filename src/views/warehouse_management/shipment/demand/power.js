const prevUrl = "wms/shipmentDemand"
module.exports.id = {
    id: 'WAREHOUSE_MANAGEMENT_SHIPMENT_DEMAND',
    method: 'POST',
    name: '出货需求',
    type: 'menu',
    apiName: 'getShipmentDemand',
    url: `${prevUrl}/list`
}

module.exports.children = {
    ADD_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_SHIPMENT_DEMAND_ADD_DATA',
        apiName: 'addShipment',
        method: 'POST',
        name: '新建',
        type: 'view',
        url: `${prevUrl}/add`
    },
    EDIT_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_SHIPMENT_DEMAND_EDIT_DATA',
        apiName: 'editShipment',
        method: 'POST',
        name: '编辑',
        type: 'view',
        url: `${prevUrl}/edit`
    },
    DEL_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_SHIPMENT_DEMAND_DEL_DATA',
        apiName: 'delShipment',
        method: 'GET',
        name: '删除',
        type: 'view',
        url: `${prevUrl}/delete`
    },
    SAVE_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_SHIPMENT_DEMAND_SAVE_DATA',
        name: '保存',
        type: 'view'
    },
    CONFIRM_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_SHIPMENT_DEMAND_CONFIRM_DATA',
        apiName: 'confirmShipmentDemand',
        method: 'GET',
        name: '确认',
        type: 'view',
        url: `${prevUrl}/confirm`
    },
    CANCEL_DATA: {
        id: 'WAREHOUSE_MANAGEMENT_SHIPMENT_DEMAND_CANCEL_DATA',
        apiName: 'cancelShipment',
        method: 'GET',
        name: '取消确认',
        type: 'view',
        url: `${prevUrl}/cancel`
    },
    // GET_BATCHNUMBER_DATA: {
    //     id: 'WAREHOUSE_MANAGEMENT_SHIPMENT_DEMAND_GET_BATCHNUMBER_DATA',
    //     apiName: 'getBatchNumberList',
    //     method: 'POST',
    //     name: '查询批次号',
    //     type: 'view',
    //     url: `${prevUrl}/getBatchNumberList`
    // },
    // GET_MATERIAL_DATA: {
    //     id: 'WAREHOUSE_MANAGEMENT_SHIPMENT_DEMAND_GET_MATERIAL_DATA',
    //     apiName: 'getMaterialList',
    //     method: 'POST',
    //     name: '查询物料信息',
    //     type: 'view',
    //     url: `${prevUrl}/getMaterialList`
    // },
}