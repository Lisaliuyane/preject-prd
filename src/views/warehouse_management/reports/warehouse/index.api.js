import Api from '@src/http/api'
import { children, id } from './power'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}

export default class WareMaterialApi extends Api {
    
    /**
     * 获取仓储物料数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf CarApi
     */
    [power[id.id].apiName](params) {
        let url = power[id.id].url
        return this.POST(url, params)
    }

    [power.DEL_DATA.apiName](params) {
        let url = power.DEL_DATA.url
        return this.POST(url, params)
    }
}