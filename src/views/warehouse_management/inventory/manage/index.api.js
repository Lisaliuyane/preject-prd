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

export default class InventoryApi extends Api {

    /**
     * 获取库存管理数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf InventoryApi
     */
    [power[id.id].apiName](params) {
        let url = power[id.id].url
        return this.POST(url, deleteNull(params))
    }

    [children.CHANGE_STATUS.apiName](params) {
        let url = children.CHANGE_STATUS.url
        return this.POST(url, params)
    }

    [children.DISMANT_PLATE.apiName](params) {
        let url = children.DISMANT_PLATE.url
        return this.POST(url, params)
    }

    getBatchNumberList (params) { //查询批次号
        let url = "wms/inventoryManage/getBatchNumberList"
        return this.POST(url, params)
    }

    inventoryChangeStatus (params) { //修改货物状态
        let url = "wms/inventoryManage/updateStatus"
        return this.POST(url, params)
    }

    inventoryMoveLocation (params) { //移位
        let url = "wms/inventoryManage/moveWereHouseStorage"
        return this.POST(url, params)
    }

    inventoryAllot(params) { //调拨
        let url = "wms/inventoryManage/transferWereHouseStorage"
        return this.POST(url, params)
    }

    getInventoryDetails(params) { //获取板货明细数据
        let url = `wms/inventoryManage/detail/${params.id}`
        return this.GET(url, params)
    }

    addInventoryDetails(params) { //添加编辑板货明细数据
        let url = "wms/inventoryManage/detail/add"
        return this.POST(url, params)
    }

    delInventoryDetails(params) { //删除板货明细数据
        let url = `wms/inventoryManage/detail/delete/${params.id}`
        return this.GET(url, params)
    }

    inventoryMergePlate(params) { //合板操作
        let url = "wms/inventoryManage/mergePlate"
        return this.POST(url, params)
    }

    inventoryGetBoardNumber(params) { //获取板号
        let url = "wms/receiptList/boardNumber"
        return this.GET(url, params)
    }

    getWarehouseReceiptNumber(params) { //获取仓库收货单号列表
        let url = `wms/inventoryManage/singleNumberList/${params.id}`
        return this.GET(url, params)
    }

    getInventorySummary(params) { //获取数量汇总
        let url = `wms/inventoryManage/count`
        return this.SPOST(url, params)
    }

}