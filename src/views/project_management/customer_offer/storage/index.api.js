import Api from '@src/http/api'
import { children, id } from './power'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}

export default class OfferCarrierApi extends Api {
    
    /**
     * 获取客户运输报价列表数据
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

    [children.EXAMINE_PASS.apiName](params) { //审核通过
        let url = children.EXAMINE_PASS.url + '/' + params.id
        return this.GET(url, deleteNull(params))
    }

    [children.CANCEL_PASS.apiName](params) { //取消通过
        let url = children.CANCEL_PASS.url + '/' + params.id
        return this.GET(url, deleteNull(params))
    }

    [children.EXAMINE_REJECT.apiName](params) { //审核驳回
        let url = children.EXAMINE_REJECT.url + '/' + params.id + '/' + params.reason
        return this.POST(url, params)
    }

    [children.EXAMINE_SUBMIT.apiName](params) { //提交
        let url = children.EXAMINE_SUBMIT.url + '/' + params.id
        return this.GET(url, params)
    }
}