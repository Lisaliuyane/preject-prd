import Api from '@src/http/api'
import { children, id } from './power'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}

export default class MaterialApi extends Api {
    
    /**
     * 获取收发货方数据
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

    [power.ADD_DATA.apiName](params) {
        let url = power.ADD_DATA.url
        return this.POST(url, params)
    }

    [power.EDIT_DATA.apiName](params) {
        let url = power.EDIT_DATA.url
        return this.POST(url, params)
    }

    [children.EXPORT_LIST.apiName](params) { // 导出表数据
        let url = children.EXPORT_LIST.url
        return this.POSTFILE(url, deleteNull(params))
    }

    [children.EXPORT_TEMP.apiName](params) { //导出物料模板
        let url = children.EXPORT_TEMP.url
        return this.GETFILE(url, deleteNull(params))
    }

    [children.IMPORT_MANAGEMENT.apiName](params) { //导入
        let url = children.IMPORT_MANAGEMENT.url
        return this.POST(url, deleteNull(params))
    }
}