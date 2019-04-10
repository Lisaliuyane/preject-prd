const prevUrl = "wms/receiptManage"
module.exports.id = {
    id: 'WAREHOUSE_MANAGEMENT_RECEIPT_BOARD',
    // powerOther: true,
    method: 'POST',
    name: '收货看板',
    type: 'menu_hide',
    apiName: 'getReceiptBoard',
    url: `${prevUrl}/receiptDataCount`
}

module.exports.children = {
    // SUMMARY_DATA: {
    //     id: 'WAREHOUSE_MANAGEMENT_RECEIPT_DEMAND_SUMMARY_DATA',
    //     apiName: 'getReceiptDateList',
    //     method: 'POST',
    //     name: '看板统计',
    //     type: 'view',
    //     url: `${prevUrl}/receiptDateCount`
    // },
    // SUMMARY_COUNT: {
    //     id: 'WAREHOUSE_MANAGEMENT_RECEIPT_DEMAND_SUMMARY_COUNT',
    //     apiName: 'getReceiptDataCount',
    //     method: 'POST',
    //     name: '看板数据量统计',
    //     type: 'view',
    //     url: `${prevUrl}/receiptBoardCount`
    // }
}