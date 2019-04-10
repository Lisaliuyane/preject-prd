import Api from '@src/http/api'
import { children, id } from './power'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}

const moduleName = 'project/'
export default class CooperativeApi extends Api {
    
    /**
     * 获取合作项目列表数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf DemandApi
     */
    // [children.GET_LIST.apiName](params) {
    //     let url = children.GET_LIST.url
    //     return this.POST(url, deleteNull(params))
    // }

    [power[id.id].apiName](params) {
        let url = power[id.id].url
        return this.POST(url, deleteNull(params))
    }

    [children.ADD_DATA.apiName](params) {
        let url = children.ADD_DATA.url
        return this.POST(url, params)
    }

    [children.DEL_DATA.apiName](params) {
        let url = children.DEL_DATA.url
        return this.POST(url, params)
    }

    // [children.GET_CUSTOMSAREA.apiName](params) { //获取关区数据
    //     let url = children.GET_CUSTOMSAREA.url + '/' + params.projectId
    //     return this.POST(url, params)
    // }

    // [children.FILTER_CARRIER.apiName](params) { //根据项目id获取承运商
    //     let url = children.FILTER_CARRIER.url
    //     return this.POST(url, Object.values(params)[0])
    // }

    // [children.GET_CARRIERS.apiName](params) { //根据项目id数组获取承运商
    //     let url = children.GET_CARRIERS.url
    //     return this.POST(url, params.ids)
    // }

    filterCarrier(params) {
        return this.POST(`${moduleName}cooperationProject/getCarrierByIds`, Object.values(params)[0]) //根据项目id获取承运商
    }

    filterCarriersByIds(params) {
        return this.POST(`${moduleName}cooperationProject/getCarrierByIds`, params.ids) //根据项目id数组获取承运商
    }
}