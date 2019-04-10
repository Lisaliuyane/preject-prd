import Api from '@src/http/api'
import { children, id } from './power_hide'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}
const moduleName = 'account/'

export default class StowageMaintenanceEditApi extends Api {
    
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

    // [power[id.id].apiName](params) {
    //     let url = power[id.id].url
    //     return this.POST(url, deleteNull(params))
    // }

    [children.SAVE_DATA.apiName](params) { //保存
        let url = children.SAVE_DATA.url
        return this.POST(url, params)
    }

    // [children.SIGN_CAR.apiName](params) { //签收
    //     let url = children.SIGN_CAR.url + '/' + params.id
    //     return this.POST(url, params)
    // }
    
    // [children.CANCEL_CAR.apiName](params) { //取消
    //     let url = children.CANCEL_CAR.url + '/' + params.id
    //     return this.POST(url, params)
    // }

    // getOneSendCarList(params) { //获取单个派车单
    //     let url = `order/sendCar/getOne/${params.id}`
    //     return this.POST(url, params)
    // }

    // [children.DEL_DATA.apiName](params) {
    //     let url = children.DEL_DATA.url + '/' + params.id //删除
    //     return this.POST(url, {ids: params})
    // }

    // [children.TRACK_CAR.apiName](params) {
    //     let url = children.TRACK_CAR.url
    //     return this.POST(url, params)
    // }
}