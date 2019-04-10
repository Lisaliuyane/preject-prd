import Api from '@src/http/api'
import { children, id } from './power'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}

export default class ClientApi extends Api {
    
    /**
     * 获取客户资料数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf CarApi
     */
    [power[id.id].apiName](params) {
        let url = power[id.id].url
        return this.POST(url, deleteNull(params))
    }

    [children.DEL_DATA.apiName](params) {
        let url = children.DEL_DATA.url + '/' + params[0]
        return this[children.DEL_DATA.method](url, params)
    }

    [children.ADD_DATA.apiName](params) {
        let url = children.ADD_DATA.url
        return this.POST(url, params)
    }

    [children.EDIT_DATA.apiName](params) {
        let url = children.EDIT_DATA.url + '/' + params.id
        return this.POST(url, params)
    }

    [children.BLUK_CREATE.apiName](params) {
        let url = children.BLUK_CREATE.url
        return this.POST(url, params)
    }

    [children.EXPORT_TEMPLATE.apiName](params) {
        let url = children.EXPORT_TEMPLATE.url
        return this.GETFILE(url, params)
    }
    // [children.GEN_CODE.apiName](params) {
    //     let url = children.GEN_CODE.url
    //     return this.POST(url, params)
    // }
    gencode(params) { //获取客户代码
        return this.POST('/client/gencode', params)
    }
}