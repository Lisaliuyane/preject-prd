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

export default class ChargePayableApi extends Api {

    /**
     * @param {any} params 
     * @returns 
     * 
     * @memberOf WarehouseManegementInventoryManageApi
     */
    [power[id.id].apiName](params) {
        let url = power[id.id].url
        return this.POST(url, deleteNull(params))
    }

    [children.ADD_DATA.apiName](params) {
        let url = children.ADD_DATA.url
        return this.POST(url, params)
    }

    [children.DELETE_DATA.apiName](params) {
        let url = children.DELETE_DATA.url + `/${params.id}`
        return this.POST(url, params)
    }

    [children.EDIT_DATA.apiName](params) {
        let url = children.EDIT_DATA.url
        return this.POST(url, params)
    }

    getSpecialBusiness(params) { //获取单个特殊业务相关信息
        return this.POST(`order/stowage/getOneCarrier/${params.id}`)
    }

    getSpecNoEstimateList(params) { //预估单待开立列表
        return this.POST(`order/stowage/carrierList`, params)
    }

    getCarrierFilterList(params) {/* 获取承运商筛选列表 */
        return this.POST(`resource/carrier/getListAndCashCar`, params)
    }

    getCarrierById(params) { /* 获取单个承运商数据 */
        return this.POST(`resource/carrier/getOne/${params.id}`)
    }

}