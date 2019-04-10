import Api from '@src/http/api'
import { children, id } from './power'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}

export default class LegalPersonApi extends Api {
    
    /**
     * 获取法人列表数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf LegalPersonsApi
     */
    [power[id.id].apiName](params) {
        let url = power[id.id].url
        return this.POST(url, deleteNull(params))
    }

    [children.DEL_DATA.apiName](params) {
        console.log('params', params)
        let url = children.DEL_DATA.url + '/' + params[0]
        return this.GET(url, params)
    }

    [children.ADD_DATA.apiName](params) {
        let url = children.ADD_DATA.url
        return this.POST(url, params)
    }

    [children.EDIT_DATA.apiName](params) {
        let url = children.EDIT_DATA.url
        return this.POST(url, params)
    }
}