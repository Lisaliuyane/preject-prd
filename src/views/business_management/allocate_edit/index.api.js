import Api from '@src/http/api'
import { children, id } from './power_hide'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}
const moduleName = 'account/'

export default class EditAllocate extends Api {
    
    /**
     * 获取配载编辑数据
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
    
    [children.SAVE_DATA.apiName](params) {
        let url = children.SAVE_DATA.url
        return this.POST(url, params)
    }

    [children.CONFIRM_DATA.apiName](params) {
        let url = children.CONFIRM_DATA.url + '/' + (params.id ? params.id : '')
        return this.POST(url, params)
    }
    
}