import Api from '@src/http/api'
import { children, id } from './power'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}

export default class CarTypeApi extends Api {
    
    /**
     * 获取车辆类型列表数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf CarApi
     */
    // [children.GET_LIST.apiName](params) {
    //     let url = children.GET_LIST.url
    //     return this.POST(url, deleteNull(params))
    // }
    [power[id.id].apiName](params) {
        let url = power[id.id].url
        return this.POST(url, deleteNull(params))
    }

    [children.DEL_DATA.apiName](params) {
        let url = children.DEL_DATA.url
        return this[children.DEL_DATA.method](url, params)
    }

    [children.ADD_DATA.apiName](params) {
        let url = children.ADD_DATA.url
        return this[children.ADD_DATA.method](url, params)
    }
    [children.EDIT_DATA.apiName](params) {
        let url = children.EDIT_DATA.url
        return this[children.EDIT_DATA.method](url, params)
    }
}