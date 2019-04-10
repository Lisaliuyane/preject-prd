const prevUrl = "wms/shipmentManage"
module.exports.id = {
    id: 'WAREHOUSE_MANAGEMENT_SHIPMENT_BOARD',
    method: 'POST',
    name: '出货看板',
    type: 'menu_hide',
    apiName: 'getShipmentBoard',
    url: `${prevUrl}/shipmentDataCount`
}

module.exports.children = {
    // SUMMARY_DATA: {
    //     id: 'WAREHOUSE_MANAGEMENT_RECEIPT_DEMAND_SUMMARY_DATA',
    //     apiName: 'getShipmentDateList',
    //     method: 'POST',
    //     name: '看板统计',
    //     type: 'view',
    //     url: `${prevUrl}/shipmentDateCount`
    // },
    // SUMMARY_COUNT: {
    //     id: 'WAREHOUSE_MANAGEMENT_RECEIPT_DEMAND_SUMMARY_COUNT',
    //     apiName: 'getShipmentDataCount',
    //     method: 'POST',
    //     name: '看板数据量统计',
    //     type: 'view',
    //     url: `${prevUrl}/shipmentBoardCount`
    // }
}