import Api from '@src/http/api'
import { children, id } from './power_hide'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}
const moduleName = 'account/'

export default class AddOrderApi extends Api {
    
    /**
     * 获取新建订单列表数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf UserApi
     */
    
    [children.CONFIRM_DATA.apiName](params) { //确认
        let url = children.CONFIRM_DATA.url + '/' + params.id + '/' +  params.orderType
        return this.POST(url, params)
    }

    // [children.ADD_PRA_ORDER.apiName](params) {
    //     let url = children.ADD_PRA_ORDER.url
    //     return this.POST(url, params)
    // }
    
    [children.ADD_PRA.apiName](params) { //提交
        let url = children.ADD_PRA.url
        return this.POST(url, params)
    }

    // [children.GET_RECEIVERS.apiName](params) {
    //     let url = children.GET_RECEIVERS.url
    //     return this.POST(url, params)
    // }

    addPraOrder(params) { //提交预订单
        let url = 'order/order/saveOrderForm'
        return this.POST(url, params)
    }

    getReciversAndWarehouse(params) { //获取收发货方列表和仓库列表
        let url = 'project/receiverOrSender/getList'
        return this.POST(url, params)
    }

    getProClientQuotation(params) { //获取客户报价
        let url = 'project/cooperationProject/getClientQuotation'
        return this.POST(url, params)
    }

    getOneOrderDetails(params) { //根据ID获取单个订单信息
        let url = `order/order/getOne/${params.id}/${params.orderType}`
        return this.POST(url, params)
    }
    
}