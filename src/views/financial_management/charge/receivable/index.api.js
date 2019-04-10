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

export default class ChargeReceivableApi extends Api {

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

    [children.DO_ESTIMATE.apiName](params) {
        let url = children.DO_ESTIMATE.url
        return this.POST(url, params)
    }

    [children.DO_EDIT.apiName](params) {
        let url = children.DO_EDIT.url
        return this.POST(url, params)
    }

    [children.DO_DELETE.apiName](params) {
        let url = children.DO_DELETE.url + `/${params.id}`
        return this.POST(url, params)
    }

    getChargeOrderOperators(params) { //获取订单制单人信息
        return this.POST(`order/order/getCreateUser`, params)
    }

    getChargeOperatorList(params) { //获取配载制单人信息
        return this.POST(`order/stowage/getCreateUser`, params)
    }

    getChargeReceivableEstimateOrderinfo(params) { //获取一条订单信息
        return this.POST(`order/order/getOne/${params.id}/${params.orderType}`, params)
    }
    
}