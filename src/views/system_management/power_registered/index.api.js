import Api from '@src/http/api'
import { children } from './power'
import { deleteNull } from '@src/utils'
export default class PowerRegister extends Api {
    
    /**
     * 获取车辆列表数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf CarApi
     */
    [children.REGISTER.apiName](params) {
        let url = children.REGISTER.url
        return this.POST(url, params)
    }
}