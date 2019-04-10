import Api from '@src/http/api'
import {
    children,
    id
} from './power'
import {
    deleteNull
} from '@src/utils'
const power = {
    ...children,
    ...{
        [id.id]: id
    }
}

export default class WarehouseManegementReceiptManageApi extends Api {

    /**
     * 获取收货管理数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf WarehouseManegementReceiptDemandApi
     */
    [power[id.id].apiName](params) {
        let url = power[id.id].url
        return this.POST(url, deleteNull(params))
    }

    [children.GET_SUMMARY_DATA.apiName](params) {
        let url = children.GET_SUMMARY_DATA.url
        return this.POST(url, params)
    }
    
    [children.GET_DETAILS_DATA.apiName](params) {
        let url = children.GET_DETAILS_DATA.url
        return this.POST(url, params)
    }

    [children.DETAILS_BOARD.apiName](params) {
        let url = children.DETAILS_BOARD.url + `/${params.id}`
        return this.GET(url, params)
    }

    [children.DETAILS_BOARD_BATCH.apiName](params) {
        let url = children.DETAILS_BOARD_BATCH.url + `/${params.id}`
        return this.GET(url, params)
    }

    completeReceiptManage(params) { //完成收货
        let url = `wms/receiptManage/completeReceipt/${params.id}`
        return this.GET(url, params)
    }

    completeUppershelf(params) { //完成入储
        let url = `wms/receiptManage/completeUpperShelf/${params.id}`
        return this.GET(url, params)
    }

    delReceiptMaterialMany(params) { //批量删除板
        let url = `wms/receiptList/delete`
        return this.POST(url, params)
    }

    doReceiptToStorage(params) { //批量入储
        let url = `wms/receiptList/upperShelf`
        return this.POST(url, params)
    }

    getReceiptMaterial(params) { //获取收货明细物料
        let url = `wms/receiptList/material/${params.id}`
        return this.GET(url, params)
    }

    addReceiptDetailsMaterial(params) { //收货明细新建保存物料
        let url = `wms/receiptList/add`
        return this.POST(url, params)
    }

    editReceiptDetailsMaterial(params) { //收货明细编辑保存物料
        let url = `wms/receiptList/edit`
        return this.POST(url, params)
    }

    getReceiptScanList(params) { //收货扫描列表
        let url = `wms/receiptScanList/list`
        return this.POST(url, params)
    }

    importReceiptScanList(params) { //收货扫描导入
        let url = `wms/receiptScanList/batchAdd`
        return this.POST(url, params)
    }

    editReceiptScanData(params) { //收货扫描编辑保存
        let url = `wms/receiptScanList/edit`
        return this.POST(url, params)
    }

    delReceiptScanData(params) { //收货扫描删除
        let url = `wms/receiptScanList/delete/${params.id}`
        return this.GET(url, params)
    }

    exportReceiptScanData(params) { //收货扫描导出
        let url = `wms/receiptScanList/export/${params.id}`
        return this.GETFILE(url, params)
    }

}