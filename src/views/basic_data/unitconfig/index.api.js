import Api from '@src/http/api'
import { children, id } from './power'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}

export default class CostItemApi extends Api {

    /**
     * 获取单位列表数据
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
    [power[id.id].apiName](params) {
        let url = power[id.id].url + '/' + params.unitClassification
        return this.POST(url)
    }
    

    [children.ADD_DATA.apiName](params) {
        let url = children.ADD_DATA.url
        return this[children.ADD_DATA.method](url, params)
    }

    getConfigureTransportUnit(params) { //获取配置的单位 unitClassification: 1-运输 2-仓储 unitKind：1-物料 2-费用
        let url = `project/cooperationProject/getUnitMappingForExpense/${params.unitClassification}/${params.unitKind}`
        return this.GET(url)
    }

    getUnitMappingFilters(params) { //获取配置的单位 unitClassification: 1-运输 2-仓储 unitKind：1-物料 2-费用 billingUnitType 1-计量 2-计重 3-计体 4-其他
        let url = `project/cooperationProject/getUnitMappingFilters`
        return this.POST(url, params)
    }
}