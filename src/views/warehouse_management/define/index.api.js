import Api from '@src/http/api'
import {
    children,
    id
} from './power'
import {
    deleteNull
} from '@src/utils'
const power = {
    ...children,
    ...{
        [id.id]: id
    }
}

export default class {

    /**
     * 获取仓库定义数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf WarehouseMnagementApi
     */
    [power[id.id].apiName](params) {
        let url = power[id.id].url
        return this.POST(url, deleteNull(params))
    }
    
    
    [children.DEL_DATA.apiName](params) {
        let url = children.DEL_DATA.url + '/' + params.id
        return this[children.DEL_DATA.method](url, params)
    }
    
    [children.EDIT_DATA.apiName](params) {
        let url = children.EDIT_DATA.url
        return this.POST(url, params)
    }

    getOneWarehouse(params) { //获取当条仓库数据
        return this.GET(`wms/warehouse/${params.id}`, params)
    }

}