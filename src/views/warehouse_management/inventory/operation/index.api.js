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

export default class OperationApi extends Api {

    /**
     * 获取盘点作业数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf WarehouseManegementInventoryManageApi
     */
    [power[id.id].apiName](params) {
        let url = power[id.id].url
        return this.POST(url, deleteNull(params))
    }

    [children.ADD_DATA.apiName](params) {
        let url = children.ADD_DATA.url
        return this.POST(url, params)
    }

    [children.DEL_DATA.apiName](params) {
        let url = children.DEL_DATA.url + `/${params.id}`
        return this.GET(url, params)
    }

    [children.CONFIRM_CHECK_PLAN.apiName](params) {
        let url = children.CONFIRM_CHECK_PLAN.url + `/${params.id}`
        return this.GET(url, params)
    }

    selectCheckList(params) { //盘点单查询
        let url = 'wms/checkManage/select'
        return this.POST(url, params)
    }

    getCheckDetailList(params) { //盘点单明细
        let url = `wms/checkList/${params.id}`
        return this.GET(url, params)
    }

    changeCheckDetailList(params) { //盘点单明细操作
        let url = `wms/checkList/check`
        return this.POST(url, params)
    }

    uploadCheckFile(params) { //盘点上传附件
        let url = `wms/checkManage/uploadAttachment`
        return this.POST(url, params)
    }

}