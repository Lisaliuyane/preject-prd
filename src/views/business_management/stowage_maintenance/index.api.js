import Api from '@src/http/api'
import { children, id } from './power'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}

export default class StowageMaintenanceApi extends Api {
    
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
        let url = power[id.id].url
        return this.POST(url, deleteNull(params))
    }

    // [children.GET_OPERATORLIST.apiName](params) { //获取筛选条件创建人列表
    //     let url = children.GET_OPERATORLIST.url
    //     return this.GET(url, params)
    // }

    getFilterOperatorList(params) { //获取筛选条件创建人列表
        let url = 'order/stowageMaintain/getOperatorList'
        return this.GET(url, params)
    }
    
}