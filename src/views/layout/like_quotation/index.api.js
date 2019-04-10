import Api from '@src/http/api'
// import { children } from './power'
export default class ClientApi extends Api {
    
    /**
     * 获取客户资料数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf CarApi
     */
    quickSearchQuotation(params) {
        let url = '/resource/carrierQuotation/quickSearchQuery'
        return this.POST(url, params)
    }

    quickSearchQuotationExport(params) {
        let url = '/resource/carrierQuotation/quickSearchQuery/export'
        return this.POSTFILE(url, params)
    }

    getOnceQuotation(params) {
        let url = '/resource/carrierQuotation/quickSearch/detail'
        return this.POST(url, params)
    }
}