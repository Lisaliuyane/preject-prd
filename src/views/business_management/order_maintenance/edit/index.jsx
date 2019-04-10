import React, { Fragment } from 'react'
import { HeaderView, Table, Parent } from '@src/components/table_template'
import RemoteSelect from '@src/components/select_databook'
import { inject, observer } from "mobx-react"
import { Button, Form, message, Popconfirm, DatePicker, Spin, Switch, Icon} from 'antd'
import FormItem from '@src/components/FormItem'
import moment from 'moment'
import Quotation from '../../order/add/quotation'
import Materiel from '../../order/add/materiel'
import TransportRoute from '../../public/transport_route'
import ExpenseItem from '../../order/add/expense _config'
import businessModel from '@src/views/business_management/liftingModeId'
import { Row, Col } from '@src/components/grid'
import { costItemObjectToString } from '@src/components/dynamic_table1/utils'
import { children, id } from './power_hide'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { toOrderMaintenanceList } from '@src/views/layout/to_page'
import { cloneObject, stringObjectObject } from '@src/utils'
import './index.less'

const power = Object.assign({}, children, id)

export const expenseItemsToArray = (d) => {
    let {
        text,
        title,
        carType, // 车类型ID
        carTypeName, // 车类型名称
        costUnitId, // 费用单位ID
        costUnitName, // 费用单位名称
        expenseItemId, // 费用项目ID
        expenseItemName, // 费用项目名称
        lowestFee, // 最低收费
        intervalCostUnitName, // 限制区间单位名称
        intervalCostUnitId, // 限制区间单位ID
        endValue, // 限制区间 end
        startValue // 限制区间 start
    } = d
    let array = []
    if (costUnitName) {
        array.push({
            key: 'costUnit',
            costUnitId: costUnitId,
            costUnitName: costUnitName,
            costUnitValue: null
        })
    }
    // if (intervalCostUnitName) {
    //     array.push({
    //         key: 'intervalCostUnit',
    //         costUnitId: intervalCostUnitId,
    //         costUnitName: intervalCostUnitName,
    //         costUnitValue: null
    //     })
    // }
    return array
}

/* 订单数据维护 */
@inject('rApi', 'mobxTabsData', 'mobxBaseData')
@observer
class OrderMaintenanceEdit extends Parent {
    state = {
        loading: false,
        id: null,
        orderType: null, // 订单类型
        orderNumber: null, // 订单号
        businessModelId: null, //业务模式id
        businessModelName: null, //业务模式
        clientName: null, //客户名称
        clientId: null, //客户id
        liftingModeId: null, //提送模式id
        projectId: null, //项目id
        projectName: null, //项目名称
        customerNumber: null, //客户单号
        customerNumberBackup: null, //客户单号2
        receiverList: [], // 收货列表
        senderList: [], // 发货列表
        transitPlaceOneId: 0, //中转地1id
        transitPlaceOneName: null, //中转地1 名字
        transitPlaceTwoId: 0, //中转地2id
        transitPlaceTwoName: null, //中转地2 名字
        departure: null, //起运地
        destination: null, // 目的地
        expenseItemList: [], // 路线中的所有费用项值
        expenseCashPriceList: [], //实报实销费用项
        selectExpenseItemList: [], //选中的费用项
        materialSwitch: 1, //是否打开物料信息维护(1-开 2-关)
        quotationSwitch: 2, //是否打开报价维护(1-开 2-关)
        receiveData: {}, //当前选中的收发方
        buttonLoading: false,
        estimatedCost: 0, //含税金额
        afterTaxAmount: 0, //不含税金额
        selectQuotation: {}, // 选中的报价路线
        orderLegalId: null, //接单法人id
        orderLegalName: null, //接单法人name
        clientLegalId: null, //客户法人id
        clientLegalName: null,
        currencyId: null, //币别
        currencyName: null,
        taxes: 0, //发票税
        withholdingTax: 0, //补扣税
        isTextsIncluded: null, //是否含税
        quotationNumber: null //报价单号
    }

    constructor(props) {
        super(props)
        const { mobxTabsData, mykey } = props
        const pageData = cloneObject(mobxTabsData.getPageData(mykey)) || {openType: 3}
        //console.log('pageData', pageData)
        mobxTabsData.setTitle(mykey, (pageData && pageData.openType === 1) ? 
            `维护订单: ${pageData.orderNumber}` 
            :
            (pageData && pageData.openType === 2) ?
            `查看订单: ${pageData.orderNumber}` 
            :
            '维护订单数据')
        if(pageData) {
            this.state.openType = pageData.openType
            this.state.id = pageData.id
            this.state.orderType = pageData.orderType
            this.state.orderNumber = pageData.orderNumber
            this.state.aging = pageData.aging
            this.state.businessModelName = pageData.businessModelName
            this.state.businessModelId = pageData.businessModelId
            this.state.carTypeList = pageData.carTypeList
            this.state.clientName = pageData.clientName
            this.state.clientId = pageData.clientId
            this.state.clientShortName = pageData.clientShortName
            this.state.liftingModeId = pageData.liftingModeId
            this.state.liftingModeName = pageData.liftingModeName
            this.state.customerNumber = pageData.customerNumber
            this.state.customerNumberBackup = pageData.customerNumberBackup
            this.state.customsAreaId = pageData.customsAreaId
            this.state.customsAreaName = pageData.customsAreaName
            this.state.departure = pageData.departure
            this.state.departureTime = pageData.departureTime
            this.state.arrivalTime = pageData.arrivalTime
            this.state.destination = pageData.destination
            this.state.insuredValue = pageData.insuredValue
            this.state.isCustomsClearance = pageData.isCustomsClearance
            this.state.isHighway = pageData.isHighway
            this.state.isInsurance = pageData.isInsurance
            this.state.expenseItemList = pageData.expenseItemList
            this.state.selectExpenseItemList = [...pageData.selectExpenseItemList, ...pageData.expenseCashPriceList]
            this.state.projectId = pageData.projectId
            this.state.projectName = pageData.projectName
            this.state.receiverList = pageData.receiverList
            this.state.receiverDetailsList = pageData.receiverList
            this.state.receiveData = (pageData.receiverList && pageData.receiverList.length > 0) ? pageData.receiverList[0] : {}
            this.state.senderList = pageData.senderList
            this.state.sendDetailsList = pageData.senderList
            this.state.remark = pageData.remark
            this.state.specialInstruction = pageData.specialInstruction
            this.state.transitPlaceOneId = pageData.transitPlaceOneId
            this.state.transitPlaceOneName = pageData.transitPlaceOneName
            this.state.transitPlaceTwoId = pageData.transitPlaceTwoId
            this.state.transitPlaceTwoName = pageData.transitPlaceTwoName
            this.state.sendTime = pageData.sendTime
            this.state.deliveryTime = pageData.deliveryTime
            this.state.orderForm = pageData.orderForm
            this.state.estimatedCost = pageData.estimatedCost
            this.state.afterTaxAmount = pageData.afterTaxAmount
            this.state.materialSwitch = pageData.materialSwitch ? pageData.materialSwitch : 1
            this.state.quotationSwitch = pageData.quotationSwitch,
            this.state.selectQuotation = pageData.selectQuotation
            this.state.orderLegalId = pageData.orderLegalId
            this.state.orderLegalName = pageData.orderLegalName
            this.state.clientLegalId =  pageData.clientLegalId
            this.state.clientLegalName =  pageData.clientLegalName
            this.state.currencyId = pageData.currencyId, //币别
            this.state.currencyName = pageData.currencyName,
            this.state.taxes =  pageData.taxes ? pageData.taxes : 0, //税率
            this.state.withholdingTax =  pageData.withholdingTax ? pageData.withholdingTax : 0,
            this.state.isTextsIncluded = pageData.isTextsIncluded, //是否含税
            this.state.quotationNumber = pageData.quotationNumber
            this.getCostRule(pageData.expenseItemList.map(item => parseInt(item.costUnitId, 10)))
        }
    }

    componentDidMount(){
        let { estimatedCost } = this.state
        if(!estimatedCost) {
            this.calculateQuotation()
        }
    }
    

    reduceCount(list, key) {
        if (list.length < 1) {
            return 0
        }
        return list.reduce(function(pre, cur) {
            let preCount = typeof pre[key] === 'number' ?  pre[key] : typeof pre[key] === 'string' ? Number(pre[key]) : 0
            let curCount = typeof cur[key] === 'number' ? cur[key] : typeof cur[key] === 'string' ? Number(cur[key]) : 0
            return {
                [key]: preCount + curCount
            }
        })[key]
    }

    totalCal = (d) => {
        let liftingModeId = d.liftingModeId
        let receiverList = d.receiverList
        let senderList = d.senderList // 收货列表
        let list = []
        if (businessModel.isOneToOne(liftingModeId)) {
            // 一对一
            list = senderList && senderList.length > 0 && senderList[0].materialList ? senderList[0].materialList : []
        } else if (businessModel.isOneToMany(liftingModeId)) {
            // 一对多
            list = senderList && senderList.length > 0 && senderList[0].materialList ? senderList[0].materialList : []
        } else if (businessModel.isManyToOne(liftingModeId)) {
            // 多对一
            list = receiverList && receiverList.length > 0 && receiverList[0].materialList ? receiverList[0].materialList : []
        } else {
            return d
        }
        d.totalQuantity = this.reduceCount(list, 'quantity')
        d.totalBoardCount = this.reduceCount(list, 'boardCount')
        d.totalBoxCount = this.reduceCount(list, 'boxCount')
        d.totalGrossWeight = this.reduceCount(list, 'grossWeight')
        d.totalNetWeight = this.reduceCount(list, 'netWeight')
        d.totalVolume = this.reduceCount(list, 'volume')
        return d
    }

    toOrderMaintenanceList = () => { //跳到订单维护列表页面
        const { mobxTabsData, mykey } = this.props
        toOrderMaintenanceList(mobxTabsData, {
            pageData: {
                reLoad: true,
                refresh: true
            }
        })
        mobxTabsData.closeTab(mykey)
    }

    saveSubmit = () => {
        let {
            orderType,
            aging, //时效
            openType,
            id,
            businessModelId, //业务模式
            businessModelName,
            carTypeList, //需求车型列表
            clientId, //客户id
            clientName, //客户名称
            clientShortName, //客户简称
            customerNumber, //客户单号
            customerNumberBackup, //客户单号2
            customsAreaName, //关区
            customsAreaId,
            departure, //起运地
            departureTime, //发车时间
            arrivalTime, //到达时间
            destination, //目的地
            expenseItemList, //费用项
            expenseCashPriceList, //实报实销费用项
            selectExpenseItemList, //选中的费用项
            insuredValue, //投保货值
            isCustomsClearance, //委托报关（1-是 -1否）
            isHighway, //是否高速（1-是 0否）
            isInsurance, //是否保险（1-是 -1否）
            liftingModeId, //提送模式id
            liftingModeName, //提送模式名称
            //materialList, //物料列表
            projectId, //项目id
            projectName, //项目名称
            receiverList, // 收货列表
            senderList, //发货列表
            remark, //备注信息
            specialInstruction, //特殊说明
            transitPlaceOneId, //中转地1id
            transitPlaceOneName, //中转地1 名字
            transitPlaceTwoId, //中转地2id
            transitPlaceTwoName,
            sendTime, //发货时间
            deliveryTime, //收货时间
            receiverDetailsList,
            sendDetailsList,
            estimatedCost,
            afterTaxAmount,
            orderForm,
            receiveData, //当前选中的收发方
            quotationSwitch,
            materialSwitch,
            selectQuotation,
            orderLegalId, //接单法人id
            orderLegalName, //接单法人name
            clientLegalId, //客户法人id
            clientLegalName,
            currencyId, //币别
            currencyName,
            taxes, //税率
            withholdingTax,
            isTextsIncluded, //是否含税
            quotationNumber //报价单号
        } = this.state

        let rList = receiverList && receiverList.length > 0 ? receiverList.map(item => {
            return {
                ...item,
                materialList: receiveData.materialList
            }
        }) : []

        let sList = senderList && senderList.length > 0 ? senderList.map(item => {
            return {
                ...item,
                materialList: receiveData.materialList
            }
        }) : []
        /**实报实销**/
        let expensePriceData = selectExpenseItemList && selectExpenseItemList.length > 0 ? selectExpenseItemList.filter(d => d.billingMethodName === '实报实销').map(item => {
            return {
                ...item,
                billingMethodId: item.billingMethodId,
                billingMethodName: item.billingMethodName,
                code: item.code,
                costUnitValue: item.costUnitValue ? item.costUnitValue : '',
                id: item.id,
                quotationLineExpenseItemId: item.quotationLineExpenseItemId,
                name: item.name,
                status: item.status,
                typeId: item.typeId,
                typeName: item.typeName
            }
        }) : []

        /**费用项**/
        let expenseItemData = selectExpenseItemList && selectExpenseItemList.length > 0 ? selectExpenseItemList.filter(d => (d.costUnitName && d.orderExpenseItemUnitCoefficientList)) : []
       
        // /* 预估费用 */
        // estimatedCost = expenseItemData.reduce((rt, cur) => {
        //     return rt += cur.chargeFee * (cur.orderExpenseItemUnitCoefficientList[0].costUnitValue || 1)
        // }, 0) + expensePriceData.reduce((rt, cur) => {
        //     return rt += (cur.costUnitValue || 0)
        // }, 0)

        let data = {
            orderType,
            id,
            aging, //时效
            businessModelId, //业务模式
            businessModelName,
            carTypeList, //需求车型列表
            clientId, //客户id
            clientName, //客户名称
            clientShortName, //客户简称
            customerNumber, //客户单号
            customerNumberBackup, //客户单号2
            customsAreaId, //关区
            customsAreaName,
            departure, //起运地
            departureTime, //发车时间
            arrivalTime, //到达时间
            destination, //目的地
            expenseCashPriceList: expensePriceData,
            selectExpenseItemList: expenseItemData,
            expenseItemList: expenseItemList, //费用项
            insuredValue, //投保货值
            isCustomsClearance, //委托报关（1-是 -1否）
            isHighway, //是否高速（1-是 0否）
            isInsurance, //是否保险（1-是 -1否）
            liftingModeId, //提送模式id
            liftingModeName, //提送模式名称
            // materialList: materialList, //物料列表
            projectId, //项目id
            projectName, //项目名称
            receiverList: rList,
            senderList: sList, // 收货列表
            remark, //备注信息
            specialInstruction, //特殊说明
            transitPlaceOneId, //中转地1id
            transitPlaceOneName, //中转地1 名字
            transitPlaceTwoId, //中转地2id
            transitPlaceTwoName,
            sendTime, //发货时间
            deliveryTime, //收货时间
            orderForm, //是否预订单
            estimatedCost,
            afterTaxAmount,
            quotationSwitch,
            materialSwitch,
            selectQuotation, // 选中的报价路线
            orderLegalId, //接单法人id
            orderLegalName, //接单法人name
            clientLegalId, //客户法人id
            clientLegalName,
            currencyId, //币别
            currencyName,
            taxes, //税率
            withholdingTax,
            isTextsIncluded,
            quotationNumber //报价单号
        }
        data = this.totalCal(data)
        let {rApi} = this.props
        this.setState({
            buttonLoading: true
        })
        rApi.orderMaintenanceEdit(data).then(d => {
            message.success('操作成功！')
            this.setState({
                buttonLoading: false
            })
            this.toOrderMaintenanceList()
        }).catch(e => {
            message.error(e.msg || '操作失败！')
            this.setState({
                buttonLoading: false
            })
        })
    }

    getReceiverOrSenderName = (value) => { //获取收发货方名称
        let nameValue = (value && value.length > 0) ? value.map(item => {
            return item.name
        }).join(',') : '无'
        return nameValue
    }

     /**
     * 同步收发货方物料数据
     * 
     * 
     * @memberOf CustomerDemand
     */
    oneDeliverySync = (type) => {
        let { liftingModeId, senderList, receiverList } = this.state
        // console.log('liftingModeId', liftingModeId)
        if ((businessModel.isOneToOne(liftingModeId)) && type) {
            if (type === 'send') {
                let list = []
                senderList.map(item => {
                    list.push(...item.materialList)
                })
                if (receiverList && receiverList.length > 0) {
                    receiverList[0].materialList = list 
                }
            } else {
                let list = []
                receiverList.map(item => {
                    list.push(...item.materialList)
                })
                if (senderList && senderList.length > 0) {
                    senderList[0].materialList = list 
                }
            }
        } else if (businessModel.isManyToOne(liftingModeId)) {
            // todo 多提一送
            // console.log('多提一送')
            let list = []
            senderList.map(item => {
                list.push(...item.materialList)
            })
            if (receiverList && receiverList.length > 0) {
                receiverList[0].materialList = list 
            }

        } else if (businessModel.isOneToMany(liftingModeId)) {
            // todo 一提多送
            let list = []
            receiverList.map(item => {
                list.push(...item.materialList)
            })
            if (senderList && senderList.length > 0) {
                senderList[0].materialList = list 
            }
        }
    }

    onSaveOrEditDataMateriel= (receiveData, data, type) => { //保存编辑物料清单
        let { record, index } = data
        // toMaterieData[id].list.unshift(data)
        if (type === 'save') {
            receiveData.materialList[index].isEdit = false
        } else if (type === 'edit') {
            receiveData.materialList[index].isEdit = true
        }
        this.setState({
            receiveData: receiveData
        })
    }

    onAddMateriel = (receiveData, data) => { // 添加物料清单
        receiveData.materialList.unshift(data)
        this.setState({
            receiveData: receiveData
        })
    }

    // 删除物料清单行数据
    onDeleteMateriel = (receiveData, index) => { 
        receiveData.materialList.splice(index, 1)
        this.setState({
            receiveData
        })
    }

    onChangeMateriel = (receiveData, data) => {
        const { value, key, column } = data
        const { liftingModeId, senderList, receiverList } = this.state
        if (key === 'itemName') {
            // console.log('goodsName', value)
            // receiveData.materialList[column]['itemName'] = value
            for (let key1 in value) {
                receiveData.materialList[column][key1] = value[key1]
            }
            //dataSource[column]['goodsId'] = value ? value.id : ''
        } else if(key === 'heavyBubbleName') {
            receiveData.materialList[column]['heavyBubbleName'] = value ? value.title || value.label : ''
            receiveData.materialList[column]['heavyBubbleId'] = value ? value.id : ''
        } else if (typeof value === 'object') {
            for (let key1 in value) {
                receiveData.materialList[column][key1] = value[key1]
            }
        } else {
            // console.log('receiveData.materialList', receiveData.materialList)
            receiveData.materialList[column][key] = value
        }
        if (businessModel.isOneToOne(liftingModeId)) {
            this.oneDeliverySync(receiveData.type)
        }
        this.setState({
            receiveData: receiveData
        })
    }

    selectRoute = () => { //选择路线
        this.quotationView.show({
            keywords: this.state.clientName,
            quotationType: this.state.businessModelId
        })
    }

    getTransitPlaceData = (value) => { //中转地值
        this.setState({
            transitPlaceOneName: value.name,
            transitPlaceOneId: value.id
        })
    }

    /* 根据费用单位ID数组获取对应的物料单位规则 */
    getCostRule = async (reqArr) => {
        const { rApi } = this.props
        let rtArr = await rApi.getMethodByUnitId(reqArr)
            .catch(e => {
                console.log(e)
            })
        await this.setState({ expenseUnitRule: [...rtArr] })
    }

    /* 根据物料数据使用路线获取的单位规则计算出费用数据 */
    dealExpense = (rtArr, materialList, ruleArr) => {
        // console.log('rule', ruleArr, rtArr, materialList)
        return rtArr.map(item => {
            item.orderExpenseItemUnitCoefficientList = expenseItemsToArray(item)
            item.status = 1
            let index = item._expenseIndex || 0
            if (materialList && ruleArr) {
                item.orderExpenseItemUnitCoefficientList.forEach(unit => {
                    if (ruleArr[index] && ruleArr[index].isQuantityCount) {
                        unit.costUnitValue = materialList.reduce((total, item) => {
                            return total = total + parseFloat(item.quantity)
                        }, 0)
                    } else if (ruleArr[index] && ruleArr[index].isBoxCount) {
                        unit.costUnitValue = materialList.reduce((total, item) => {
                            return total = total + parseFloat(item.boxCount)
                        }, 0)
                    } else if (ruleArr[index] && ruleArr[index].isBoard) {
                        unit.costUnitValue = materialList.reduce((total, item) => {
                            return total = total + parseFloat(item.boardCount)
                        }, 0)
                    } else if ((ruleArr[index] && ruleArr[index].isGrossWeight) || (rtArr[index] && rtArr[index].isNetWeight)) {
                        unit.costUnitValue = materialList.reduce((total, item) => {
                            return total = total + parseFloat(item.grossWeight)
                        }, 0)
                    } else if (ruleArr[index] && ruleArr[index].isVolumeReceipt) {
                        unit.costUnitValue = materialList.reduce((total, item) => {
                            return total = total + parseFloat(item.volume)
                        }, 0)
                    } else {
                        unit.costUnitValue = 1
                    }
                })
            }
            return item
        })
    }

    /* 选择报价路线 */
    selectRow = async (item, isFee) => {
        let quotationLineExpenseItems = item.quotationLineExpenseItems || []
        quotationLineExpenseItems = cloneObject(quotationLineExpenseItems)
        let reqArr = []
        reqArr = quotationLineExpenseItems.map(item => parseInt(item.costUnitId, 10))
        await this.getCostRule(reqArr)
        // let sendPro = !isFee ? item.departure.split('/')[0] : ''
        // let receivePro = !isFee ? item.destination.split('/')[0] : ''
        // // console.log('比较', isFee, receivePro, this.state.sendPro, this.state.receivePro)
        // if ((sendPro !== this.state.sendPro || receivePro !== this.state.receivePro) && !isFee) {
        //     message.warning('收发货方和选择路线省份地址不匹配')
        // }
        await this.setState({
            expenseItemList: quotationLineExpenseItems.map(d => {
                return { ...d, quotationLineExpenseItemId: d.id }
            }),
            transitPlaceOneId: item.transitPlaceOneId, //中转地1id
            transitPlaceOneName: item.transitPlaceOneName, //中转地1 名字
            isHighway: item.isHighway,
            departure: item.departure,
            destination: item.destination,
            selectQuotation: item
        })
    }

    showMore = (record) => { //明细
        // console.log('showMore record', record)
        this.addoredit.show({
            edit: false,
            data: record
        })
    }

    
/**
 *
 *费用项
 * 
 */
calculateQuotation = () => { //计算预估报价
    let { estimatedCost, selectExpenseItemList, afterTaxAmount, taxes, withholdingTax} = this.state
    let expensePriceData = selectExpenseItemList && selectExpenseItemList.length > 0 ? selectExpenseItemList.filter(d => d.billingMethodName === '实报实销').map(item => {
        return {
            ...item,
            billingMethodId: item.billingMethodId,
            billingMethodName: item.billingMethodName,
            code: item.code,
            costUnitValue: item.costUnitValue ? item.costUnitValue : '',
            id: item.id,
            quotationLineExpenseItemId: item.quotationLineExpenseItemId,
            name: item.name,
            status: item.status,
            typeId: item.typeId,
            typeName: item.typeName,
        }
    }) : []

    /**费用项**/
    let expenseItemData = selectExpenseItemList && selectExpenseItemList.length > 0 ? selectExpenseItemList.filter(d => (d.costUnitName && d.orderExpenseItemUnitCoefficientList)) : []
   
    /*费用项总应收 */
    let quotationMoney = expenseItemData.reduce((rt, cur) => { //含税
        if(cur.accountingStrategy === 2) {
            return rt += cur.chargeFee * (1+(withholdingTax ? withholdingTax/100 : 0))
        }
        return rt += cur.chargeFee * (cur && cur.orderExpenseItemUnitCoefficientList[0] && cur.orderExpenseItemUnitCoefficientList[0].costUnitValue || 0) * (1+(withholdingTax ? withholdingTax/100 : 0))
    }, 0)

    /* 含税费用 */
    estimatedCost =  quotationMoney + expensePriceData.reduce((rt, cur) => { //含税金额
        return rt += (cur.costUnitValue || 0)
    }, 0)

    /* 不含税费用 */
    afterTaxAmount =  quotationMoney/(1+(taxes ? taxes/100 : 0))+ expensePriceData.reduce((rt, cur) => {
        return rt += (cur.costUnitValue || 0)
    }, 0)

    this.setState({
        estimatedCost: estimatedCost ? estimatedCost.toFixed(4) : 0,
        afterTaxAmount: afterTaxAmount ? afterTaxAmount.toFixed(4) : 0
    })
}

onChangeExpenseItemList = (d) => {
    let { selectExpenseItemList } = this.state
    //console.log('selectExpenseItemList', selectExpenseItemList, d)
   // return false
    const { itemIndex, unitIndex, value, status, isEdit } = d
    if ('status' in d) {
        this.setState(preState => {
            preState.selectExpenseItemList[itemIndex].status = status
            preState.selectExpenseItemList[itemIndex].isEdit = isEdit
            return {
                selectExpenseItemList: preState.selectExpenseItemList
            }
        }, () => {
            this.calculateQuotation()
        })
    } else {
        this.setState(preState => {
            let item = preState.selectExpenseItemList[itemIndex]
            if(item &&  item.billingMethodName === '实报实销') {
                    item.costUnitValue = value.costUnitValue
                    item.currencyId = value.currencyId
                    item.currencyName = value.currencyName
            } else {
                item.orderExpenseItemUnitCoefficientList[unitIndex].costUnitValue = value.costUnitValue
            }
            return {
                selectExpenseItemList: preState.selectExpenseItemList
            }
        }, () => {
            this.calculateQuotation()
        })
    }
}

    /* 费用项选中值 
        value: 选中的费用项
        isSync: 是否执行同步操作
    */
    onChangRouter = async (value, isSync) => {
        let { selectExpenseItemList, expenseUnitRule, receiveData } = this.state
        let materialList = receiveData.materialList || []

        // 根据规则计算费用项数据
        value = this.dealExpense(value, materialList, expenseUnitRule)
        value.forEach(item => {
            if (!selectExpenseItemList.some(cItem => cItem.id === item.id)) {
                selectExpenseItemList.push(item)
            } else {
                if (isSync === 1) {/* 同步费用项数据 */
                    let index = selectExpenseItemList.indexOf(selectExpenseItemList.find(cItem => cItem.id === item.id))
                    selectExpenseItemList[index] = item
                }
            }
        })
        for (let i = 0; i < selectExpenseItemList.length; i++) {
            if (!value.some(d => d.id === selectExpenseItemList[i].id) && (selectExpenseItemList[i].costUnitName && selectExpenseItemList[i].orderExpenseItemUnitCoefficientList)) {
                selectExpenseItemList.splice(i, 1)
                i--
            }
        }

        await this.setState({
            selectExpenseItemList
        }, () => {
            this.calculateQuotation()
        })
    }
    
onReimbursementChangeValue = (value) => { //实报实销选中值
    let { selectExpenseItemList } = this.state
    value.forEach(item => {
        if (!selectExpenseItemList.some(cItem => cItem.id === item.id)) {
            selectExpenseItemList.push(item)
        }
    })
    for (let i = 0; i < selectExpenseItemList.length; i++) {
        if (!value.some(key => key.id === selectExpenseItemList[i].id) && !(selectExpenseItemList[i].costUnitName && selectExpenseItemList[i].orderExpenseItemUnitCoefficientList)) {
            selectExpenseItemList.splice(i, 1)
            i--
        }
    }
    this.setState({
        selectExpenseItemList
    }, () => {
        this.calculateQuotation()
    })
}

deleteItem = (value) => { //删除费用项
    //console.log('删除费用项', value, value.itemIndex)
    let { selectExpenseItemList } = this.state
    let index = value.itemIndex
    selectExpenseItemList.splice(index, 1)
    this.setState({
        selectExpenseItemList: this.state.selectExpenseItemList
    }, () => {
        this.calculateQuotation()
    })
}

render() {
        let { mobxBaseData } = this.props
        let {
            loading,
            openType,
            businessModelId,
            businessModelName, //业务模式
            clientName, //客户名称
            clientId, //客户id
            liftingModeId, //提送模式
            projectName, //项目名称
            projectId,
            customerNumber, //客户单号
            customerNumberBackup, //客户单号2
            receiverList, // 收货列表
            senderList, // 发货列表
            transitPlaceOneId, //中转地1id
            transitPlaceOneName, //中转地1 名字
            transitPlaceTwoId, //中转地2id
            transitPlaceTwoName, //中转地2 名字
            departure, //起运地
            destination, // 目的地
            expenseItemList, // 路线中的所有费用项值
            expenseCashPriceList, //实报实销费用项
            selectExpenseItemList, //选中的费用项
            materialSwitch, //是否打开物料信息维护
            quotationSwitch, //是否打开报价维护
            receiveData,
            buttonLoading,
            estimatedCost,
            afterTaxAmount,
            selectQuotation,
            currencyName,
            orderNumber,
            sendDetailsList,
            receiverDetailsList,
            carTypeList,
            isTextsIncluded //是否含税
        } = this.state
       // console.log('this.state', this.state)
        let senderProvince = sendDetailsList && sendDetailsList.length > 0 && sendDetailsList[0].address && stringObjectObject(sendDetailsList[0].address).pro
        let receiveProvince = receiverDetailsList && receiverDetailsList.length > 0 && receiverDetailsList[0].address && stringObjectObject(receiverDetailsList[0].address).pro
        if(carTypeList && carTypeList.length > 0) {
            expenseItemList = expenseItemList && expenseItemList.length > 0 && expenseItemList.filter(item => {
                return carTypeList.some(d => d.carTypeName === item.carTypeName || !item.carTypeName)
            })
        }
       return(
            <div className='page-ordermaintenance-edit' style={{background: '#eee', minHeight: this.props.minHeight}}>
                <Quotation 
                    showMore={this.showMore} 
                    selectRow={this.selectRow} 
                    getThis={v => this.quotationView = v}
                    quotationType={businessModelId}
                    projectId={projectId}
                    senderProvince={senderProvince}
                    receiveProvince={receiveProvince}
                    getQuotationData={(value) => {
                        //console.log('getQuotationData', value[0])
                        if(value && value.length > 0) {
                            let obj = value[0]
                            this.setState({
                                currencyId: obj.currencyId,
                                currencyName: obj.currencyName,
                                taxes: obj.taxes ? obj.taxes : 0,
                                withholdingTax: obj.withholdingTax ? obj.withholdingTax : 0,
                                isTextsIncluded: obj.isTextsIncluded || 0,
                                quotationNumber: obj.quotationNumber
                            })
                        }
                    }}
                />
                <Spin spinning={loading} tip="Loading...">
                    <Form layout='inline' onSubmit={this.handleSubmit}>
                        <div className="flex flex-vertical-center" style={{padding: '0 10px 10px', maxWidth: 1200, margin: '0 auto'}}>
                            <div className="base-text">{orderNumber ? `订单维护(${orderNumber})` : '订单维护'}</div>
                            <div className="flex1"></div>
                            {
                                this.state.openType === 2 ?
                                ''
                                :
                                <FunctionPower power={power.EDIT_SAVE}>
                                    <Button 
                                        // icon='rocket' 
                                        className="btn-padding-30"
                                        loading={buttonLoading}
                                        style={{ borderRadius: 0, border: 'none',  background: ' #18B583', color: '#fff', letterSpacing: 0}}
                                        onClick={this.saveSubmit}
                                    >
                                        保存
                                    </Button>
                                </FunctionPower>
                            }
                        </div>
                        <div style={{maxWidth: 1200, margin: '0 auto', background: '#fff'}}>
                            <div className="base-info-wrapper">
                                <div className="base-info">
                                    <div className="base-title">基础信息</div>
                                    <div>
                                        <Row gutter={24}> 
                                            <Col label='客户名称' span={7}>
                                                <span title={clientName ? clientName : '-'}>
                                                    {clientName ? clientName : '-'}
                                                </span>
                                            </Col>
                                            <Col label='客户单号' span={7}>
                                                <span title={customerNumber ? `${customerNumber}${customerNumberBackup ? `,${customerNumberBackup}` : ''}` : '-'}>
                                                    {customerNumber ? `${customerNumber}${customerNumberBackup ? `,${customerNumberBackup}` : ''}` : '-'}   
                                                </span>
                                            </Col>
                                            <Col label='所属项目' span={7}>
                                                <span title={projectName ? projectName : '-'}>
                                                    {projectName ? projectName : '-'}
                                                </span>
                                            </Col>
                                        </Row>
                                        <Row gutter={24}>
                                            <Col label='业务模式' span={7}>
                                                <span title={businessModelName ? businessModelName : '-'}>
                                                    {businessModelName ? businessModelName : '-'}
                                                </span>
                                            </Col>
                                            <Col label='&emsp;发货方' span={7}>
                                                <span title={this.getReceiverOrSenderName(senderList)}>
                                                    {this.getReceiverOrSenderName(senderList)}   
                                                </span>
                                            </Col>
                                            <Col label='&emsp;收货方' span={7}>
                                                <span title={this.getReceiverOrSenderName(receiverList)}>
                                                    {this.getReceiverOrSenderName(receiverList)}
                                                </span>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className="base-border"></div>
                                <div className="materiel-info">
                                    <div className="base-title">
                                        <span>物料信息维护</span>
                                        <Switch 
                                            checkedChildren="开" 
                                            unCheckedChildren="关" 
                                            defaultChecked 
                                            checked={materialSwitch === 1 ? true : false}
                                            // size="small"
                                            onChange={(checked) => {
                                                this.setState({
                                                    materialSwitch: checked ? 1 : 2
                                                })
                                            }}
                                        />
                                    </div>
                                    {
                                        this.state.materialSwitch === 1 ?
                                        <div style={{marginTop: 5}}>
                                            <Materiel
                                                clientId={clientId}
                                                liftingModeId={liftingModeId}
                                                receiveData={receiveData}
                                                onAddMateriel={this.onAddMateriel}
                                                onSaveOrEditDataMateriel={this.onSaveOrEditDataMateriel}
                                                onDeleteMateriel={this.onDeleteMateriel}
                                                onChangeMateriel={this.onChangeMateriel}
                                                getThis={view => this.materiel = view}
                                                materielTitle={''}
                                                openType={openType}
                                                selectType={this.props.selectType}
                                                maxWidth={1140}
                                                parentStyle={{padding: 0, background: '#fff'}}
                                                //ref='materiel'
                                                //type={type}
                                            />
                                        </div>
                                        :
                                        null 
                                    }
                                </div>
                                <div className="base-border"></div>
                                <div className="router-quotation-info">
                                    <div className="base-title">
                                        <span>路线报价<span style={{color: '#18B583', fontSize: '14px', marginLeft: '6px', verticalAlign: 'baseline'}}>{`(合计: ${estimatedCost ? estimatedCost : 0}${currencyName ? currencyName : 'RMB'})`}</span></span>
                                        <Switch 
                                            checkedChildren="开" 
                                            unCheckedChildren="关" 
                                            checked={quotationSwitch === 1 ? true : false}
                                            // defaultChecked 
                                            // size="small"
                                            onChange={(checked) => {
                                                this.setState({
                                                    quotationSwitch: checked ? 1 : 2
                                                })
                                            }}
                                        />
                                    </div>
                                    {
                                        this.state.quotationSwitch === 1 ?
                                        <div>
                                            <div className="flex">
                                                <div className='flex' style={{padding: '10px 0'}}>
                                                    <div style={{width: 98, padding: '3px 0'}}>报价路线</div>
                                                    <div className="flex1">
                                                        {
                                                            openType === 2 ?
                                                            null
                                                            :
                                                            <div>
                                                                <Button 
                                                                    icon='environment' 
                                                                    loading={loading}
                                                                    onClick={this.selectRoute}
                                                                    style={{borderRadius: 0}}
                                                                    disabled={
                                                                        (projectId && businessModelId) || (projectId && businessModelId === 0) ? false
                                                                        :
                                                                        true
                                                                    }
                                                                >
                                                                    选择报价路线
                                                                </Button>
                                                            </div>
                                                        }
                                                        <TransportRoute 
                                                            getTransitPlaceData = {this.getTransitPlaceData}
                                                            departure={departure}
                                                            transitPlaceOneName={transitPlaceOneName}
                                                            destination={destination}
                                                            isTransitPlace={true}
                                                            selectQuotation={selectQuotation}
                                                            power={power}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <div style={{width: 98}}>费用项设置</div>
                                                <div className="flex1" style={{maxWidth: 800}}>
                                                    <ExpenseItem 
                                                        onChangeExpenseItemList={this.onChangeExpenseItemList}
                                                        route={expenseItemList} 
                                                        openType={openType}
                                                        onChangRouter={this.onChangRouter}
                                                        onReimbursementChangeValue={this.onReimbursementChangeValue}
                                                        selectRoute={selectExpenseItemList}
                                                        receivableOrPayable='应收'
                                                        deleteItem={this.deleteItem}
                                                        showSync
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        null 
                                    }
                                </div>
                                <div className="base-border"></div>
                            </div>
                        </div>
                    </Form>
                </Spin>
            </div>
        )
    }
}

export default Form.create()(OrderMaintenanceEdit)