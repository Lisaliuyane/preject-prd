import Api from '@src/http/api'
import { children, id } from './power'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}

export default class OrderApi extends Api {
    
    /**
     * 获取订单列表数据
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
        return new Promise((resolve, reject) => {
            this.POST(url, deleteNull(params)).then(data => {
                data.records = data.records.map(item => {
                    if (item.orderSplitList && item.orderSplitList.length > 0) {
                        return {
                            ...item,
                            // children: item.orderSplitList
                        }
                    } else {
                        return item
                    }
                })
                resolve(data)
            }).catch(e => {
                reject(e)
            })
        })
    }
    
    [children.DEL_DATA.apiName](params) {
        let url = children.DEL_DATA.url
        return this.POST(url, params)
    }

    [children.SPLIT_DATA.apiName](params) {
        let url = children.SPLIT_DATA.url
        return this.POST(url, params)
    }

    [children.EDIT_DATA.apiName](params) {
        let url = children.EDIT_DATA.url + `/${params.orderType}`
        return this.POST(url, params)
    }

    [children.ORDER_TRACK.apiName](params) { //追踪
        // let url = children.ORDER_TRACK.url + '/' + params.id + '/' + params.orderType
        let url = children.ORDER_TRACK.url
        return this.POST(url, params)
    }

    [children.ORDER_STOWAGE.apiName](params) {
        let url = children.ORDER_STOWAGE.url
        return this.POST(url, params)
    }

    // [children.ORDER_STOWAGE_CONFIRM.apiName](params) {
    //     let url = children.ORDER_STOWAGE_CONFIRM.url
    //     return this.POST(url, params)
    // }

    // [children.DIRECT_CAR.apiName](params) {
    //     let url = children.DIRECT_CAR.url
    //     return this.POST(url, params)
    // }

    // [children.STOWAGE_ROUTE.apiName](params) { //查询指定订单的未配载路线
    //     let url = children.STOWAGE_ROUTE.url + '/' + params.orderId + '/' + params.orderType
    //     return this.POST(url, params)
    // }

    // [children.TRANSPORT_DATA.apiName](params) {
    //     let url = children.TRANSPORT_DATA.url
    //     return this.POST(url, params)
    // }

    [children.CANCEL_CONFIRM.apiName](params) {
        let url = children.CANCEL_CONFIRM.url + `/${params.id}/${params.orderType}`
        return this.POST(url, params)
    }

    [children.FINISH_STOWAGE.apiName](params) {
        let url = children.FINISH_STOWAGE.url + `/${params.id}/${params.orderType}`
        return this.POST(url, params)
    }

    [children.AGAIN_STOWAGE.apiName](params) {
        let url = children.AGAIN_STOWAGE.url + `/${params.id}/${params.orderType}`
        return this.POST(url, params)
    }

    [children.SIGN_ORDER.apiName](params) {
        let url = children.SIGN_ORDER.url + `/${params.id}/${params.orderType}`
        return this.POST(url, params)
    }

    [children.CANCEL_SIGN_ORDER.apiName](params) {
        let url = children.CANCEL_SIGN_ORDER.url + `/${params.id}/${params.orderType}`
        return this.POST(url, params)
    }

    getCarrierQuotationQuery(params) {
        let url = 'resource/carrierQuotation/getCarrierQuotationQuery'
        return this.POST(url, params)
    }

    filterOrderIdGetCarType(params) { //根据订单id[]获取车型列表
        let url = 'order/order/getCarType'
        return this.POST(url, Object.values(params)[0])
    }

    directSendCarOrder(params) { //直接派车
        let url = 'order/sendCar/directSendCar'
        return this.POST(url, params)
    }

    getNoStowageRoute(params) { //查询指定订单的未配载路线
        let url = 'order/order/getNoStowageRoute'
        return this.POST(url + '/' + params.orderId + '/' + params.orderType, params)
    }

    getOrderStageNum(params) { //获取订单各阶段数量
        let url = 'order/order/statistics'
        return this.GET(url, params)
    }

    getTransportData(params) { //获取中转地和仓库
        let url = 'resource/node/getNodeAndWarehouse'
        return this.POST(url, params)
    }

    stowageAndConfirmOrder(params) { //配载并确认
        let url = 'order/stowage/saveAndConfirm'
        return this.POST(url, params)
    }

    addTemporaryCar(params) { //新建临时车辆
        let url = 'resource/car/temporary/create'
        return this.SPOST(url, params)
    }

    addTemporaryDriver(params) { //新建临时司机
        let url = 'resource/driver/temporary/create'
        return this.SPOST(url, params)
    }

    getOrderReply(params) { //获取订单回单上传附件
        let url = `order/order/getAttachment/${params.id}/${params.orderType}`
        return this.GET(url, params)
    }

    orderReplyUpload(params) { //回单上传
        let url = 'order/order/upload'
        return this.POST(url, params)
    }
}