import Api from '@src/http/api'
import { children, id } from './power_hide'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}

export default class CooperativeApi extends Api {
    
    /**
     * 获取合作项目明细配置数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf DemandApi
     */
    // [children.GET_LIST.apiName](params) {
    //     let url = children.GET_LIST.url
    //     return this.POST(url, deleteNull(params))
    // }

    getMethodByUnitId(params) { //根据费用单位ID获取对应的计算方式
        return this.POST(`project/cooperationProject/getStatisticsMethodByUnitId`, params)
    }

    getCooperationProjectById(params) { //根据id获取单条合作项目
        return this.POST(`project/cooperationProject/getOne/${params.id}`)
    }

    getCustoms(params) { //获取关区数据
        return this.POST(`cooperationProject/getCustomsAreaByProjectId/${params.projectId}` )
    }

    [power[id.id].apiName](params) {
        let url = power[id.id].url + '/' + params.id
        return this.POST(url, deleteNull(params))
    }

    [children.EDIT_DATA.apiName](params) {
        let url = children.EDIT_DATA.url
        return this.POST(url, params)
    }

    [children.START_DATA.apiName](params) {
        let url = children.START_DATA.url + '/' + params.id
        return this.POST(url, params)
    }

    [children.STOP_DATA.apiName](params) {
        let url = children.STOP_DATA.url + '/' + params.id
        return this.POST(url, params)
    }

    // [children.COSTUNIT_COMPUTE.apiName](params) {
    //     let url = children.COSTUNIT_COMPUTE.url + '/' + params.unitId
    //     return this.POST(url, params)
    // }

    // [children.DEL_DATA.apiName](params) {
    //     let url = children.DEL_DATA.url + '/' + params.id
    //     return this.POST(url, params)
    // }
}