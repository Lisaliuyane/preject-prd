import Api from '@src/http/api'
import { children, id } from './power'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}

const moduleName = 'common/'

export default class CostItemApi extends Api {

    /**
     * 获取车辆类型列表数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf CarApi
     */
    // [children.GET_LIST.apiName](params) {
    //     let url = children.GET_LIST.url
    //     return this.POST(url, deleteNull(params))
    // }

    getListByExpenseType(params) { //根据费用类型和应收应付过滤费用项数据
        return this.POST(`${moduleName}expense/getListByExpenseType`, params)
    }

    getRealSalesExpenseByReceivableOrPayable(params) { //根据应收应付获取计费方式为实报实销的费用项
        return this.POST(`${moduleName}expense/getRealSalesExpenseByReceivableOrPayable`, params)
    }

    getUnitConfigureByExpenseId(params) { //根据费用项ID返回其配置的费用单位
        return this.GET(`${moduleName}expense/getUnitConfigureByExpenseId/${params.id}`)
    }
    
    [power[id.id].apiName](params) {
        let url = power[id.id].url
        return this.POST(url, deleteNull(params))
    }
    
    [children.DEL_DATA.apiName](params) {
        let url = children.DEL_DATA.url
        return this[children.DEL_DATA.method](url, params)
    }

    [children.ADD_DATA.apiName](params) {
        let url = children.ADD_DATA.url
        return this[children.ADD_DATA.method](url, params)
    }

    [children.EDIT_DATA.apiName](params) {
        let url = children.EDIT_DATA.url + '/' + params.id
        return this[children.EDIT_DATA.method](url, params)
    }
}