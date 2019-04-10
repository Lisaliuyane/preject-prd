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

export default class WarehouseManegementShipmentBoardApi extends Api {

    /**
     * 获取出货看板数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf WarehouseManegementShipmentBoardApi
     */
    [power[id.id].apiName](params) {
        let url = power[id.id].url
        return this.POST(url, deleteNull(params))
    }

    // [children.SUMMARY_DATA.apiName](params) {
    //     let url = children.SUMMARY_DATA.url
    //     return this.POST(url, params)
    // }

    // [children.SUMMARY_COUNT.apiName](params) {
    //     let url = children.SUMMARY_COUNT.url
    //     return this.POST(url, params)
    // }

    getShipmentDateList(params) { //看板统计
        let url = 'wms/shipmentManage/shipmentDateCount'
        return this.POST(url, params)
    }

    getShipmentDataCount(params) { //看板数据量统计
        let url = 'wms/shipmentManage/shipmentBoardCount'
        return this.POST(url, params)
    }
}