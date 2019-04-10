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

export default class AccountReceivableApi extends Api {

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

    [children.ADD_ACCOUNT.apiName](params) {
        let url = children.ADD_ACCOUNT.url
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

    getAccountReceivableList(params) { //获取应收对账单列表
        return this.POST(`finance/receivableReconciliation/list`, params)
    }

    exportAccountReceivableList(params) { //导出对账单
        return this.POSTFILE(`order/order/exportData`, params)
    }
    
}