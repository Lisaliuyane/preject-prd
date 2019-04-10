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

export default class WarehouseManegementShipmentDemandApi extends Api {

    /**
     * 获取出货需求数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf WarehouseManegementShipmentDemandApi
     */
    [power[id.id].apiName](params) {
        let url = power[id.id].url
        return this.POST(url, deleteNull(params))
    }

    [children.ADD_DATA.apiName](params) {
        let url = children.ADD_DATA.url
        return this.POST(url, params)
    }
    
    [children.EDIT_DATA.apiName](params) {
        let url = children.EDIT_DATA.url
        return this.POST(url, params)
    }

    [children.DEL_DATA.apiName](params) {
        let url = children.DEL_DATA.url + `/${params.id}`
        return this.GET(url, params)
    }

    [children.CONFIRM_DATA.apiName](params) {
        let url = children.CONFIRM_DATA.url + '/' + params.id
        return this.GET(url, params)
    }

    [children.CANCEL_DATA.apiName](params) {
        let url = children.CANCEL_DATA.url + '/' + params.id
        return this.GET(url, params)
    }

    // [children.GET_BATCHNUMBER_DATA.apiName](params) {
    //     let url = children.GET_BATCHNUMBER_DATA.url
    //     return this.POST(url, params)
    // }

    // [children.GET_MATERIAL_DATA.apiName](params) {
    //     let url = children.GET_MATERIAL_DATA.url
    //     return this.POST(url, params)
    // }

    getBatchNumberList(params) { //查询批次号
        let url = 'wms/shipmentDemand/getBatchNumberList'
        return this.POST(url, params)
    }

    getMaterialList(params) { //查询物料信息
        let url = 'wms/shipmentDemand/getMaterialList'
        return this.POST(url, params)
    }
}