import Api from '@src/http/api'
import { children, id } from './power'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}

export default class DemandApi extends Api {
    
    /**
     * 获取需求列表数据
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
        return this.POST(url, params)
    }

    [children.ADD_DATA.apiName](params) {
        let url = children.ADD_DATA.url
        return this.POST(url, params)
    }

    [children.DEL_DATA.apiName](params) {
        let url = children.DEL_DATA.url + '/' + params.id
        return this.POST(url, params)
    }
}