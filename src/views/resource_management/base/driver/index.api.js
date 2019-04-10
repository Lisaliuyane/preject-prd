import Api from '@src/http/api'
import { children, id } from './power'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}
const moduleName = 'resource/'

export default class DriverApi extends Api {
    
    /**
     * 获取司机列表数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf DriverApi
     */
    [power[id.id].apiName](params) {
        let url = power[id.id].url
        return this.POST(url, deleteNull(params))
    }

    // [children.GET_DRIVER.apiName](params) {
    //     let url = children.GET_DRIVER.url
    //     return this.GET(url, params)
    // }
    getDriver(params) {
        return this.GET(`${moduleName}driver/page/data`, params)
    }

    [children.DEL_DATA.apiName](params) {
        let url = children.DEL_DATA.url
        return this.POST(url, params)
    }

    [children.ADD_DATA.apiName](params) {
        let url = children.ADD_DATA.url
        return this.POST(url, params)
    }
    
    [children.EDIT_DATA.apiName](params) {
        let url = children.EDIT_DATA.url + '/' + params.id
        return this.POST(url, params)
    }

    [children.AUTH_DATA.apiName](params) {
        let url = children.AUTH_DATA.url + '/' + params.id
        return this.POST(url, params)
    }

    [children.CANCEL_AUTH.apiName](params) {
        let url = children.CANCEL_AUTH.url + '/' + params.id
        return this.POST(url, params)
    }

    [children.EXPORT_LIST.apiName](params) { // 导出表数据
        let url = children.EXPORT_LIST.url
        return this.POSTFILE(url, deleteNull(params))
    }

    [children.EXPORT_TEMP.apiName](params) { //导出司机模板
        let url = children.EXPORT_TEMP.url
        return this.GETFILE(url, deleteNull(params))
    }

    [children.IMPORT_DRIVER.apiName](params) { //导入
        let url = children.IMPORT_DRIVER.url
        return this.POST(url, deleteNull(params))
    }
}