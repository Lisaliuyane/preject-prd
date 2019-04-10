import Api from '@src/http/api'
import { children, id } from './power'
const power = {
    ...children, 
    ...{[id.id]: id}
}

export default class CostItemApi extends Api {

    /**
     * 获取物料单位列表数据
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
    // [power[id.id].apiName](params) {
    //     let url = power[id.id].url + '/' + params.unitClassification
    //     return this.POST(url)
    // }
    

    // [children.ADD_DATA.apiName](params) {
    //     let url = children.ADD_DATA.url
    //     return this[children.ADD_DATA.method](url, params)
    // }
}