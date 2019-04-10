import Api from '@src/http/api'
import { children, id } from './power'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}

export default class TrackApi extends Api {
    
    /**
     * 追踪管理数据
     * @param {any} params 
     * @returns 
     * @memberOf UserApi
     */

    [power[id.id].apiName](params) {
        let url = power[id.id].url
        return this.POST(url, deleteNull(params))
    }

    getTrackDetail(params) { //获取追踪信息
        let url = `order/order/trackDetail/${params.id}/${params.orderType}`
        return this.GET(url, params)
    }

    // [children.CONFIRM_CAR.apiName](params) { //确认
    //     let url = children.CONFIRM_CAR.url
    //     return this.POST(url, params)
    // }

    // [children.SIGN_CAR.apiName](params) { //签收
    //     let url = children.SIGN_CAR.url + '/' + params.id
    //     return this.POST(url, params)
    // }
    
    // [children.CANCEL_CAR.apiName](params) { //取消
    //     let url = children.CANCEL_CAR.url + '/' + params.id
    //     return this.POST(url, params)
    // }

    // [children.TRACK_CAR.apiName](params) {
    //     let url = children.TRACK_CAR.url
    //     return this.POST(url, params)
    // }

    // [children.RETURN_FILE.apiName](params) {
    //     let url = children.RETURN_FILE.url
    //     return this.POST(url, params)
    // }

    // getOneSendCarList(params) { //获取单个派车单
    //     let url = `order/sendCar/getOne/${params.id}`
    //     return this.POST(url, params)
    // }

    // confirmCar(params) { //确认
    //     let url = `order/sendCar/confirm`
    //     return this.POST(url, params)
    // }

    // delSendCar(params) { //删除
    //     let url = `order/sendCar/delete`
    //     return this.POST(url + '/' + params.id, {ids: params})
    // }

    // [children.DEL_DATA.apiName](params) {
    //     let url = children.DEL_DATA.url + '/' + params.id //删除
    //     return this.POST(url, {ids: params})
    // }
}