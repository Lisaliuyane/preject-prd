const prevUrl = "wms/receiptManage"
const detailPrevUrl = "wms/receiptList"
module.exports.id = {
    id: 'WAREHOUSE_MANAGEMENT_RECEIPT_MANAGE',
    method: 'POST',
    name: '收货管理',
    type: 'menu',
    apiName: 'getReceiptManage',
    url: `${prevUrl}/list`
}

module.exports.children = {
}