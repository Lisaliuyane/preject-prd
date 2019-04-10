import Api from '@src/http/api'
import {
    children,
    id
} from './power_hide'
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
     * 获取新建仓库数据
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

    [children.ADD_BUTTON.apiName](params) {
        let url = children.ADD_BUTTON.url
        return this.POST(url, params)
    }

    [children.SAVE_BUTTON.apiName](params) {
        let url = children.SAVE_BUTTON.url
        return this.POST(url, params)
    }

    [children.ADD_DATA.apiName](params) {
        let url = children.ADD_DATA.url
        return this.POST(url, params)
    }

    [children.EDIT_DATA.apiName](params) {
        let url = children.EDIT_DATA.url
        return this.POST(url, params)
    }

    [children.DEL_DATA.apiName](params) {
        let url = children.DEL_DATA.url + `/${params.id}`
        return this.GET(url, params)
    }

    [children.BATCH_DEL.apiName](params) {
        let url = children.BATCH_DEL.url
        return this.POST(url, params)
    }

    [children.IMPORT_STORAGE_DATA.apiName](params) {
        let url = children.IMPORT_STORAGE_DATA.url
        return this.POST(url, params)
    }

    getWarehouseSum(params) { //获取仓库规模汇总
        let url = `wms/warehouse/scale/summary/${params.id}`
        return this.GET(url, params)
    }

    getStorageList(params) { //储位信息列表
        let url = 'wms/warehouseStorage/list'
        return this.POST(url, params)
    }
        
}