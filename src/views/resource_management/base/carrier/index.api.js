import Api from '@src/http/api'
import { children, id } from './power'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}
const moduleName = 'resource/'

export default class CarrierApi extends Api {
    
    /**
     * 获取承运商列表数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf CarrierApi
     */
    [power[id.id].apiName](params) {
        let url = power[id.id].url
        return this.POST(url, params)
    }


    // [children.GENERATE_CODE.apiName](params) {
    //     let url = children.GENERATE_CODE.url
    //     return this.POST(url, params)
    // }

    // [children.GET_SEARCH_FIELD.apiName](params) {
    //     let url = children.GET_SEARCH_FIELD.url
    //     return this.GET(url, params) + '/' + params.type
    // }
    
    getSearchField(params) { //获取下拉列表数据字典数据数据
        return this.GET(`${moduleName}carrier/getSearchFieldFromDictionary/${params.type}`, params)
    }

    /**
     * 获取正在合作的承运商列表
     * 
     * @returns 
     * @memberof CarrierApi
     */
    getCooperationCarriet() { //获取正在合作的承运商列表
        return this.POST(`${moduleName}carrier/query`, { offset: 0, limit: 999999, cooperateStatus: 56})
    }

    /**
     * 
     * 获取承运商简称
     * @returns 
     * @memberof CarrierApi
     */
    getCarrierAbbreviation() {
        return this.POST(`${moduleName}carrier/query`, { offset: 0, limit: 999999})
    }

    getDeparture(params) { //获取起运地和目的地
        return this.GET(`${moduleName}carrier/getDepartureOrDestination`, params)
    }

    getCanDrawABill(params) { //获取类型为无车承运人和信息部（黄牛）的承运商
        return this.GET(`${moduleName}carrier/getCarriersByOnlyCanDrawABill`, params)
    }

    generateCode(params) { //生成承运商代码
        return this.POST(`${moduleName}carrier/generateCarrierCode`, params)
    }

    getCarrierQuotations(params) {
        let url = 'resource/carrier/getQuotation'
        return this.POST(url, params)
    }

    // [children.GET_DEPARTURE.apiName](params) {
    //     let url = children.GET_DEPARTURE.url
    //     return this.GET(url, params)
    // }

    // [children.GET_CANDRAW.apiName](params) {
    //     let url = children.GET_CANDRAW.url
    //     return this.GET(url, params)
    // }

    [children.DEL_DATA.apiName](params) {
        let url = children.DEL_DATA.url
        return this.POST(url, params)
    }

    [children.ADD_DATA.apiName](params) {
        let url = children.ADD_DATA.url
        return this.POST(url,deleteNull(params))
    }

    [children.EDIT_DATA.apiName](params) {
        let url = children.EDIT_DATA.url + '/' + params.id
        return this.POST(url, deleteNull(params))
    }

    // [children.QUERY_CARRIER.apiName](params) {
    //     let url = children.QUERY_CARRIER.url
    //     return this.POST(url, deleteNull(params))
    // }

    [children.ON_ENABLE.apiName](params) {
        let url = children.ON_ENABLE.url + '/' + params.id
        return this.GET(url, deleteNull(params))
    }

    [children.ON_DISABLE.apiName](params) {
        let url = children.ON_DISABLE.url + '/' + params.id
        return this.GET(url, deleteNull(params))
    }

    [children.EXPORT_LIST.apiName](params) { // 导出表数据
        let url = children.EXPORT_LIST.url
        return this.POSTFILE(url, deleteNull(params))
    }

    [children.EXPORT_TEMP.apiName](params) { //导出承运商模板
        let url = children.EXPORT_TEMP.url
        return this.GETFILE(url, deleteNull(params))
    }

    [children.IMPORT_CARRIER.apiName](params) { //导入
        let url = children.IMPORT_CARRIER.url
        return this.POST(url, deleteNull(params))
    }

    // [children.UPDATE_OLD.apiName](params) {
    //     let url = children.UPDATE_OLD.url
    //     return this.POST(url, deleteNull(params))
    // }

    [children.IMPORT_CONTACTS.apiName](params) { //导入联系人
        let url = children.IMPORT_CONTACTS.url
        return this.POST(url, deleteNull(params))
    }

    [children.EXPORT_CONTACTS.apiName](params) { //导出联系人
        let url = children.EXPORT_CONTACTS.url + '/' + params.carrierId
        return this.POSTFILE(url, deleteNull(params))
    }

    [children.EXPORT_HEADER.apiName](params) { //导出联系人模板
        let url = children.EXPORT_HEADER.url
        return this.GETFILE(url, deleteNull(params))
    }
}