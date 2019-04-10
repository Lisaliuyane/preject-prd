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

export default class AccountPayableApi extends Api {

    /**
     * @param {any} params 
     * @returns 
     * 
     * @memberOf AccountPayableApi
     */
    [power[id.id].apiName](params) {
        let url = power[id.id].url
        return this.POST(url, deleteNull(params))
    }

    [children.ADD_DATA.apiName](params) {
        let url = children.ADD_DATA.url
        return this.POST(url, params)
    }

    [children.EDIT_ACCOUNT.apiName](params) {
        let url = children.EDIT_ACCOUNT.url
        return this.POST(url, params)
    }

    [children.CONFIRM_ACCOUNT.apiName](params) {
        let url = children.CONFIRM_ACCOUNT.url
        return this.POST(url, params)
    }

    [children.CANCEL_ACCOUNT.apiName](params) {
        let url = children.CANCEL_ACCOUNT.url
        return this.POST(url, params)
    }

    [children.CONFIRM_FINANCE.apiName](params) {
        let url = children.CONFIRM_FINANCE.url
        return this.POST(url, params)
    }

    [children.CANCEL_FINANCE.apiName](params) {
        let url = children.CANCEL_FINANCE.url
        return this.POST(url, params)
    }

    [children.DEL_ACCOUNT.apiName](params) {
        let url = children.DEL_ACCOUNT.url + `/${params.id}`
        return this.POST(url, params)
    }

    getAccountPayableList(params) { //获取应付对账单列表
        return this.POST(`finance/payableReconciliation/list`, params)
    }

    exportAccountPayableList(params) { //导出对账单
        return this.GETFILE(`order/sendCar/exportData`, params)
    }

}