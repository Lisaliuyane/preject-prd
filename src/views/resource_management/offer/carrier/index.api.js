import Api from '@src/http/api'
import { children, id } from './power'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}

export default class OfferCarrierApi extends Api {
    
    /**
     * 获取合作报价列表数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf OfferCarrierApi
     */
    // [children.GET_LIST.apiName](params) {
    //     let url = children.GET_LIST.url
    //     return this[children.GET_LIST.method](url, deleteNull(params))
    // }

    [power[id.id].apiName](params) {
        let url = power[id.id].url
        return this.POST(url, deleteNull(params))
    }

    [children.ADD_DATA.apiName](params) {
        let url = children.ADD_DATA.url
        return this[children.ADD_DATA.method](url, params)
    }

    [children.DEL_DATA.apiName](params) {
        let url = children.DEL_DATA.url
        return this[children.DEL_DATA.method](url, params)
    }

    [children.EDIT_DATA.apiName](params) {
        let url = children.EDIT_DATA.url + '/' + params.id
        return this[children.EDIT_DATA.method](url, params)
    }

    [children.CARRIER_PASS.apiName](params) { //审核通过
        let url = children.CARRIER_PASS.url + '/' + params.id
        return this.POST(url, deleteNull(params))
    }

    [children.CARRIER_CANCEL.apiName](params) { //取消通过
        let url = children.CARRIER_CANCEL.url + '/' + params.id
        return this.POST(url, deleteNull(params))
    }

    [children.CARRIER_REJECT.apiName](params) { //审核驳回
        let url = children.CARRIER_REJECT.url + '/' + params.id + '/' + params.rejectReason
        return this.POST(url, params)
    }

    [children.CARRIER_SUBMIT.apiName](params) { //提交
        let url = children.CARRIER_SUBMIT.url + '/' + params.id
        return this.POST(url, params)
    }

    getOfferCarrierQuotations(params) {
        let url = 'resource/carrierQuotation/getQuotation'
        return this.POST(url, params)
    }
}