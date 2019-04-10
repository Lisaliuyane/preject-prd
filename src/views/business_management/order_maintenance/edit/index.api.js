import Api from '@src/http/api'
import { children, id } from './power_hide'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}
const moduleName = 'account/'

export default class OrderMaintenanceApi extends Api {
    
    /**
     * 订单数据维护
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf UserApi
     */
    // [children.GET_LIST.apiName](params) {
    //     let url = children.GET_LIST.url
    //     return this.POST(url, params)
    // }

    [power[id.id].apiName](params) {
        let url = power[id.id].url + '/' + params.id + '/' +  params.orderType
        return this.POST(url, deleteNull(params))
    }
}