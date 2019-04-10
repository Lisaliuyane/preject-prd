import Api from '@src/http/api'
import { children } from './power_hide'
import { deleteNull } from '@src/utils'
const moduleName = 'project/'

export default class DemandApi extends Api {
    
    /**
     * 获取需求明细数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf DemandApi
     */

    getPlanQuotation(params) {
        return this.POST(`${moduleName}development/getQuotation`, params)
    }

    getCostQuotation(params) {
        return this.POST(`${moduleName}cost/getQuotation`, params)
    }

    getEstimateQuotation(params) {
        return this.POST(`${moduleName}estimate/getQuotation`, params)
    }

    syncEstimateTrsQuotation(params) { //同步运输报价
        return this.GET(`${moduleName}estimate/quotationData/sync/${params.id}`, params)
    }

    syncEstimateWarehouseQuotation(params) {
        return this.GET(`${moduleName}estimate/warehouseData/sync/${params.id}`, params)
    }

    [children.EXAMINE_PASS.apiName](params) { //客户需求审核通过
        let url = children.EXAMINE_PASS.url + '/' + params.id
        return this.POST(url, params)
    }

    [children.EXAMINE_CANCEL.apiName](params) { //客户需求取消通过
        let url = children.EXAMINE_CANCEL.url + '/' + params.id
        return this.POST(url, params)
    }

    [children.EXAMINE_REJECT.apiName](params) { //客户需求审核驳回
        let url = children.EXAMINE_REJECT.url + '/' + params.id + '/' + params.rejectReason
        return this.POST(url, params)
    }

    [children.DEMAND_SUBMIT.apiName](params) { //客户需求审提交
        let url = children.DEMAND_SUBMIT.url + '/' + params.id
        return this.POST(url, params)
    }

    [children.DEMAND_SAVE.apiName](params) { //客户需求保存
        let url = children.DEMAND_SAVE.url
        return this.POST(url, params)
    }

    [children.PLAN_PASS.apiName](params) { //方案研发审核通过
        let url = children.PLAN_PASS.url + '/' + params.id
        return this.POST(url, params)
    }

    [children.PLAN_CANCEL.apiName](params) { //方案研发取消通过
        let url = children.PLAN_CANCEL.url + '/' + params.id
        return this.POST(url, params)
    }

    [children.PLAN_REJECT.apiName](params) { //方案研发审核驳回
        let url = children.PLAN_REJECT.url + '/' + params.id + '/' + params.rejectReason
        return this.POST(url, params)
    }

    [children.PLAN_SUBMIT.apiName](params) { //方案研发提交
        let url = children.PLAN_SUBMIT.url + '/' + params.id
        return this.POST(url, params)
    }

    [children.PLAN_SAVE.apiName](params) { //方案研发保存
        let url = children.PLAN_SAVE.url
        return this.POST(url, params)
    }

    [children.COST_PASS.apiName](params) { //成本规划审核通过
        let url = children.COST_PASS.url + '/' + params.id
        return this.POST(url, params)
    }

    [children.COST_CANCEL.apiName](params) { //成本规划取消通过
        let url = children.COST_CANCEL.url + '/' + params.id
        return this.POST(url, params)
    }

    [children.COST_REJECT.apiName](params) { //成本规划审核驳回
        let url = children.COST_REJECT.url + '/' + params.id + '/' + params.rejectReason
        return this.POST(url, params)
    }

    [children.COST_SUBMIT.apiName](params) { //成本规划提交
        let url = children.COST_SUBMIT.url + '/' + params.id
        return this.POST(url, params)
    }

    [children.COST_SAVE.apiName](params) { //成本规划保存
        let url = children.COST_SAVE.url
        return this.POST(url, params)
    }

    [children.ESTIMATE_PASS.apiName](params) { //应收报价预估审核通过
        let url = children.ESTIMATE_PASS.url + '/' + params.id
        return this.POST(url, params)
    }

    [children.ESTIMATE_CANCEL.apiName](params) { //应收报价预估取消通过
        let url = children.ESTIMATE_CANCEL.url + '/' + params.id
        return this.POST(url, params)
    }

    [children.ESTIMATE_REJECT.apiName](params) { //应收报价预估审核驳回
        let url = children.ESTIMATE_REJECT.url + '/' + params.id + '/' + params.rejectReason
        return this.POST(url, params)
    }

    [children.ESTIMATE_SUBMIT.apiName](params) { //应收报价预估提交
        let url = children.ESTIMATE_SUBMIT.url + '/' + params.id
        return this.POST(url, params)
    }

    [children.ESTIMATE_SAVE.apiName](params) { //应收报价预估保存
        let url = children.ESTIMATE_SAVE.url
        return this.POST(url, params)
    }

    [children.CREATE_QUOTATION.apiName](params) { //创建为运输报价
        let url = children.CREATE_QUOTATION.url + '/' + params.id
        return this.GET(url, params)
    }

    [children.GET_DEMAND.apiName](params) { //获取需求明细数据
        let url = children.GET_DEMAND.url + '/' + params.id
        return this.POST(url, params)
    }

    [children.GET_PLAN.apiName](params) { //获取需求方案数据
        let url = children.GET_PLAN.url + '/' + params.demandId
        return this.POST(url, params)
    }

    [children.GET_COST.apiName](params) { //获取成本规划数据
        let url = children.GET_COST.url + '/' + params.demandId
        return this.POST(url, params)
    }

    [children.GET_ESTIMATE.apiName](params) { //获取应收报价预估数据
        let url = children.GET_ESTIMATE.url + '/' + params.demandId
        return this.POST(url, params)
    }

    getClientById(params) { //获取成本规划数据
        // let url = children.GET_COST.url + '/' + params.demandId
        return this.SPOST('client/getClient', params)
    }

    [children.SUSPEND_DEMAND.apiName](params) { //终止
        let url = children.SUSPEND_DEMAND.url + '/' + params.id
        return this.GET(url, params)
    }

    [children.CANCEL_SUSPEND.apiName](params) { //取消
        let url = children.CANCEL_SUSPEND.url + '/' + params.id
        return this.GET(url, params)
    }

    // getDemandsInfo(params) { //获取需求明细数据
    //     return this.POST(`${moduleName}demand/${params.id}`)
    // }

    // getPlanData(params) { //获取方案研发数据
    //     return this.POST(`${moduleName}development/${ params.demandId}`)
    // }

    // getCostData(params) { //获取成本规划数据
    //     return this.POST(`${moduleName}cost/${params.demandId}`)
    // }

}