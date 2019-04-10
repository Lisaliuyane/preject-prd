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

    [children.GET_PICK_DATA.apiName](params) {
        let url = children.GET_PICK_DATA.url
        return this.POST(url, params)
    }

    [children.CONFIRM_DATA.apiName](params) {
        let url = children.CONFIRM_DATA.url + `/${params.id}`
        return this.GET(url, params)
    }
    
    [children.SET_CONDITION_DATA.apiName](params) {
        let url = children.SET_CONDITION_DATA.url
        return this.POST(url, params)
    }

    [children.GET_SCAN_DATA.apiName](params) {
        let url = children.GET_SCAN_DATA.url
        return this.POST(url, params)
    }

    getShipmentSummary(params) { //出货清单列表
        let url = `wms/shipmentManage/shipmentSummary`
        return this.POST(url, params)
    }

    pickShipmentDetails(params) { //一键拣货
        let url = `wms/shipmentList/quicklyPick/${params.id}`
        return this.GET(url, params)
    }

    getShipmentBoardDetails(params) { //获取出货板货明细
        let url = `wms/shipmentList/boardDetail/${params.shipmentManageId}`
        return this.GET(url, params)
    }

    addShipmentPick(params) { //添加拣货明细
        let url = `wms/shipmentList/addPick`
        return this.POST(url, params)
    }

    delShipmentPick(params) { //删除拣货明细
        let url = `wms/shipmentList/delete/${params.id}`
        return this.GET(url, params)
    }

    importShipmentScanning (params) { //出货扫描导入
        let url = `wms/shipmentScanList/batchAdd`
        return this.POST(url, params)
    }

    editShipmentScanning (params) { //出货扫描编辑
        let url = `wms/shipmentScanList/edit`
        return this.POST(url, params)
    }

    delShipmentScanning (params) { //出货扫描删除
        let url = `wms/shipmentScanList/delete/${params.id}`
        return this.GET(url, params)
    }

    exportShipmentScanning(params) { //出货扫描导出
        let url = `wms/shipmentScanList/export/${params.id}`
        return this.GETFILE(url, params)
    }

}