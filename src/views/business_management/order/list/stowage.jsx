import React, { Fragment } from 'react'
import Modal from '@src/components/modular_window'
import { Table, Parent } from '@src/components/table_template'
import { Button, Form, Input, message, DatePicker, Radio, Switch, Tabs, Popconfirm, Tag } from 'antd'
import RemoteSelect from '@src/components/select_databook'
import { cloneObject, validateToNextPhone, resetFormError, addressFormat } from '@src/utils'
import FormItem from '@src/components/FormItem'
import { Row, Col } from '@src/components/grid'
import { inject } from "mobx-react"
import Quotation from "./quotation"
import { expenseItemsToArray } from '../add/index'
import { children, id } from './stowage_power'
import AddOrEdit from '@src/views/project_management/customer_offer/transport/addoredit'
import ExpenseItem from '../add/expense _config'
import ExpenseCash from './expense_cash'
import TransportRoute from '../../public/transport_route'
import TabAddButton from '../../public/TabAddButton'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import ReceiversAndSenders from '../../public/ReceiversAndSenders'
import "./index.less"

const RadioGroup = Radio.Group
const TabPane = Tabs.TabPane

const power = Object.assign({}, children, id)
@inject('rApi', 'mobxTabsData', 'mobxBaseData')
class Stowage extends Parent {

    state = {
        open: false,
        edit: false,
        loading: false,
        type: null,
        title: null,
        confirmLoading: false,
        sourceList: [], //传入数据备份
        carrierData: [], //承运商数据
        cartypedata: [], //车型数据
        billingMethod: 1, //结算方式(1-合同价 2-现金价)
        carCode: null, //车牌号
        carId: null, //车辆id
        carTypeId: null, //车辆类型id
        carTypeName: null, //车辆类型名
        carrierId: null, //承运商id
        carrierName: null, //承运商名
        cashCostAmount: null, // 现金费用金额
        cashCostStatus: null, //现金费用状态（-1 禁用 1-启用）
        createTime: null, //创建时间
        currencyId: null, //币别id
        currencyName:  null, //币别名称 
        departure: null, //起运地
        destination: null, //目的地
        departureTime: null, //发车时间
        driverId: null, //司机id
        driverName: null, //司机名字
        id: 0,
        isHighway: 0, //是否高速（0-否 1-是）
        oilCardCostAmount: 0, //油卡费用金额
        oilCardCostStatus: 0, //油卡费用状态（-1 禁用 1-启用）
        operatorId: 0, //操作人id
        operatorName: null, //操作人名字
        expenseItemList: [], //费用项数据列表
        phone: null, //手机号码
        phoneBackup: null, //电话号码
        quotationNumber: null, //报价单号
        quotationNumberId: null, //报价单号id
        quotationType: null, //报价类型
        remark: null, //备注信息
        sendCarCashPriceExpenseList: [], //现金价数据
        sendCarNumber: null, //派车单号
        sendCarOrderList:[], //配载订单数据
        status: null, //状态
        trailerCarCode: null,
        transitPlaceOneId: null, //中转地1 id
        transitPlaceOneName: null, //中转地1名
        transitPlaceTwoId: null, ////中转地2 id
        transitPlaceTwoName: null, //中转地2名
        longitude: null, //经度
        latitude: null, //纬度
        transportationMethodId: null, //运输方式id
        transportationMethodName: null, //运输方式名
        totalBoardCount: 0, //总板数
        totalBoxCount: 0, //总箱数
        totalGrossWeight: 0,
        totalNetWeight: 0,
        totalQuantity: 0,
        totalVolume: 0,
        fileterProjectId: [], //项目id数组
        fileterOrderId: [], // 订单id数组
        isShowSendcar: false, //是否派车
        isShowTransfer: false, //是否中转
        countMode: 'standard', //显示模式  "standard"->标准 "dispersion"->散量
        parentSendCarId: 0,
        countColList: [], //配载量统计
        buttonLoading: false,
        specialBusiness: [],
        carType: 1, //承运商车辆 1 现金车 2
        selectExpenseItemList: [], //选中的费用项
        receiverList: [], //收货方
        senderList: [], //发货方
        selectQuotation: {}, // 选中的报价路线
        activeTab: 'sendcar',
        transitPlaceType: null, //中转地类型 -> 1.中转地 2.仓库
        curCar: null, //当前选中车辆
        curDriver: null, //当前选中司机
        morePhone: null, //备用联系方式
        curTab: 'suminfo', //当前显示tab
        taxes: 0, //发票税
        withholdingTax: 0, //补扣税
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        this.state.countCol = [
            {
                className: 'text-overflow-ellipsis',
                title: '数量',
                dataIndex: 'quantity',
                key: 'quantity',
                width: 100
            },
            {
                className: 'text-overflow-ellipsis',
                title: '箱数',
                dataIndex: 'boxCount',
                key: 'boxCount',
                width: 100
            },
            {
                className: 'text-overflow-ellipsis',
                title: '板数',
                dataIndex: 'boardCount',
                key: 'boardCount',
                width: 100
            },
            {
                className: 'text-overflow-ellipsis',
                title: '毛重(kg)',
                dataIndex: 'grossWeight',
                key: 'grossWeight',
                width: 130
            },
            {
                className: 'text-overflow-ellipsis',
                title: '净重(kg)',
                dataIndex: 'netWeight',
                key: 'netWeight',
                width: 130
            },
            {
                className: 'text-overflow-ellipsis',
                title: '体积(m³)',
                dataIndex: 'volume',
                key: 'volume',
                width: 130
            }
        ]
    }

    show(d) {
        const { data } = d
        let sourceList = data ? [].concat(data) : []
        // console.log('showStowage', sourceList)

        let fileterProjectId = data && data.length > 0 ? data.map(d => d.projectId) : [] /* 配载选择项目id */
        fileterProjectId = fileterProjectId.filter((id, index, arr) => {
            return arr.indexOf(id) >= index
        })
        let fileterOrderId = data && data.length > 0 ? data.map(d => d.id) : [] /* 配载选择订单id */
        let quotationType = data && data.length > 0 ? data[0].businessModelId : 0
        let senderList = data.reduce((rt, cur) => {/* 发货发 */
            cur.senderList = cur.senderList.map(item => ({
                ...item,
                receiverOrSenderId: item.bid
            }))
            return [...rt, ...cur.senderList]
        }, [])
        let receiverList = data.reduce((rt, cur) => {/* 收货方 */
            cur.receiverList = cur.receiverList.map(item => ({
                ...item,
                receiverOrSenderId: item.bid
            }))
            return [...rt, ...cur.receiverList]
        }, [])
        let sendCarOrderList = data && data.length > 0 ? data.map(dItem => {/* 配载列表 */
            dItem.editData.orderMaterialList = dItem.editData.orderMaterialList.map(item => {
                item.stowageCount = item.quantity
                item.stowageBoxCount = item.boxCount
                item.stowageBoardCount = item.boardCount
                item.stowageGrossWeight = item.grossWeight
                item.stowageNetWeight = item.netWeight
                item.stowageVolume = item.volume
                item.orderId = dItem.id
                item.orderType = dItem.orderType
                item.orderMaterialId = item.id
                return item
            })
            let obj = {
                aging: dItem.aging,
                createTime: dItem.createTime,
                departureTime: dItem.departureTime,
                clientId: dItem.clientId,
                clientName: dItem.clientName,
                projectId: dItem.projectId,
                projectName: dItem.projectName,
                orderNumber: dItem.orderNumber,
                orderId: dItem.id,
                orderType: dItem.orderType,
                departure: dItem.editData.departure,
                destination: dItem.editData.destination,
                parentSendCarId: dItem.editData.parentSendCarId,
                transitType: dItem.editData.transitType,
                originTransitType: dItem.editData.transitType,
                totalQuantity: dItem.editData.orderMaterialList.reduce((total, cur) => {
                    return total + cur.stowageCount
                }, 0),
                totalBoxCount: dItem.editData.orderMaterialList.reduce((total, cur) => {
                    return total + cur.stowageBoxCount
                }, 0),
                totalBoardCount: dItem.editData.orderMaterialList.reduce((total, cur) => {
                    return total + cur.stowageBoardCount
                }, 0),
                totalGrossWeight: dItem.editData.orderMaterialList.reduce((total, cur) => {
                    return total + cur.stowageGrossWeight
                }, 0),
                totalNetWeight: dItem.editData.orderMaterialList.reduce((total, cur) => {
                    return total + cur.stowageNetWeight
                }, 0),
                totalVolume: dItem.editData.orderMaterialList.reduce((total, cur) => {
                    return total + cur.stowageVolume
                }, 0),
                sendCarOrderMaterialVoList: dItem.editData.orderMaterialList
            }
            return obj
        }) : []
        this.setState({
            sourceList,
            receiverList,
            senderList,
            sendCarOrderList,
            fileterProjectId: fileterProjectId,
            fileterOrderId: fileterOrderId,
            quotationType: quotationType,
            open: true,
            edit: d.edit
        })
    }

    clearValue() {
        this.setState({
            open: false,
            edit: false,
            loading: false,
            type: null,
            title: null,
            sourceList: [], //传入数据
            carrierData: [], //承运商数据
            cartypedata: [], //车型数据
            billingMethod: 1, //结算方式(1-合同价 2-现金价)
            carCode: null, //车牌号
            carId: null, //车辆id
            carTypeId: null, //车辆类型id
            carTypeName: null, //车辆类型名
            carrierId: null, //承运商id
            carrierName: null, //承运商名
            cashCostAmount: null, // 现金费用金额
            cashCostStatus: null, //现金费用状态（-1 禁用 1-启用）
            createTime: null, //创建时间
            currencyId: null, //币别id
            currencyName: null, //币别名称 
            departure: null, //起运地
            departureTime: null, //发车时间
            destination: null, //目的地
            driverId: null, //司机id
            driverName: null, //司机名字
            id: 0,
            isHighway: 0, //是否高速（0-否 1-是）
            oilCardCostAmount: 0, //油卡费用金额
            oilCardCostStatus: 0, //油卡费用状态（-1 禁用 1-启用）
            operatorId: 0, //操作人id
            operatorName: null, //操作人名字
            expenseItemList: [], //费用项数据列表
            phone: null, //手机号码
            phoneBackup: null, //电话号码
            quotationNumber: null, //报价单号
            quotationNumberId: null, //报价单号id
            quotationType: null, //报价类型
            remark: null, //备注信息
            sendCarCashPriceExpenseList: [], //现金价数据
            sendCarNumber: null, //派车单号
            sendCarOrderList: [], //配载订单数据
            status: null, //状态
            trailerCarCode: null,
            transitPlaceOneId: null, //中转地1 id
            transitPlaceOneName: null, //中转地1名
            transitPlaceTwoId: null, ////中转地2 id
            transitPlaceTwoName: null, //中转地2名
            longitude: null, //经度
            latitude: null, //纬度
            transportationMethodId: null, //运输方式id
            transportationMethodName: null, //运输方式名
            totalBoardCount: 0, //总板数
            totalBoxCount: 0, //总箱数
            totalGrossWeight: 0,
            totalNetWeight: 0,
            totalQuantity: 0,
            totalVolume: 0,
            fileterProjectId: [], //项目id数组
            fileterOrderId: [], // 订单id数组
            isShowTransfer: false,
            isShowSendcar: false,
            buttonLoading: false,
            carType: 1,
            selectExpenseItemList: [],
            receiverList: [],
            senderList: [],
            selectQuotation: {},
            specialBusiness: [],
            activeTab: 'sendcar',
            transitPlaceType: null,
            curCar: null,
            curDriver: null,
            morePhone: null,
            curTab: 'suminfo',
            taxes: 0, //发票税
            withholdingTax: 0, //补扣税
        })
    }

    actionDone = () => {
        const { parent } = this.props
        if (parent.searchCriteria) {
            parent.searchCriteria()
        }
        this.changeOpen(false)
    }

    changeOpen = (open) => {
        this.setState({
            open
        })
        if (!open) {
            this.clearValue()
        }
    }

    onSubmit = () => {
        console.log('onSubmit')
    }

    // 初始化 计量模式 表
    getCountCol = () => {
        let data = []
        let rtArr = []
        // console.log('his',this.state)
        if (this.state.sourceList) {
            this.state.sourceList.forEach(item => {
                data = [...data, ...item.editData.orderMaterialList]
            })
            if (data.length) {
                let quantity = data.reduce((total, cur) => { return total + cur.stowageCount }, 0),
                    boxCount = data.reduce((total, cur) => { return total + cur.stowageBoxCount }, 0),
                    boardCount = data.reduce((total, cur) => { return total + cur.stowageBoardCount }, 0),
                    grossWeight = data.reduce((total, cur) => { return total + cur.stowageGrossWeight }, 0),
                    netWeight = data.reduce((total, cur) => { return total + cur.stowageNetWeight }, 0),
                    volume = data.reduce((total, cur) => { return total + cur.stowageVolume }, 0)
                    grossWeight = grossWeight.toFixed(4)
                    netWeight = netWeight.toFixed(4)
                    volume = volume.toFixed(4)
                rtArr.push({
                    quantity, boxCount, boardCount, grossWeight, netWeight, volume
                })
                this.setState({
                    totalQuantity: quantity,
                    totalBoxCount: boxCount,
                    totalBoardCount: boardCount,
                    totalGrossWeight: grossWeight,
                    totalNetWeight: netWeight,
                    totalVolume: volume,
                    countColList: rtArr
                })
            }
        }
        return new Promise((resolve, reject) => {
            // console.log('data', data)
            resolve({
                dataSource: rtArr,
                total: rtArr.length
            })
        })
    }

    selectRoute = ({ type, index }) => {
        let quotationNumber = type === 'sendcar' ? this.state.quotationNumber : this.state.specialBusiness[index].data.quotationNumber
        this.quotationView.show({
            quotationType: this.state.quotationType,
            quotationNumber,
            openData: {
                type,
                index
            }
        })
    }

    getMethodByUnitId = async (unitData, list) => { //根据费用单位ID获取对应的计算方式
        const { rApi } = this.props
        let rt = await rApi.getMethodByUnitId(unitData)
            .catch(e => {
                console.log(e)
            })
        return list.map((item, index) => {
            item.orderExpenseItemUnitCoefficientList = expenseItemsToArray(item)
            item.status = 1
            // if (this.state.countColList) {
                item.orderExpenseItemUnitCoefficientList.forEach(unit => { 
                    if (rt[index].isQuantityCount) {
                        unit.costUnitValue = parseFloat(this.state.totalQuantity)
                    } else if(rt[index].isBoxCount) {
                        unit.costUnitValue = parseFloat(this.state.totalBoxCount)
                    } else if(rt[index].isBoard) {
                        unit.costUnitValue = parseFloat(this.state.totalBoardCount)
                    } else if (rt[index].isGrossWeight || rt[index].isNetWeight) {
                        unit.costUnitValue = parseFloat(this.state.totalGrossWeight)
                    } else if (rt[index].isVolumeReceipt) {
                        unit.costUnitValue = parseFloat(this.state.totalVolume)
                    } else {
                        unit.costUnitValue = 1
                    }
                })
            // }
            return item
        })
    }

    /* 选择报价 */
    selectRow = async (item) => {
        let quotationLineExpenseItems = item.quotationLineExpenseItems || []
        let unitData = []
        quotationLineExpenseItems = cloneObject(quotationLineExpenseItems)
        unitData = quotationLineExpenseItems.map(item => item.costUnitId)
        quotationLineExpenseItems = await this.getMethodByUnitId(unitData, quotationLineExpenseItems)
       // console.log('quotationLineExpenseItems', quotationLineExpenseItems)
        if (item.openData.type === 'sendcar') {
            this.setState({
                expenseItemList: quotationLineExpenseItems.map(d => {
                    return { ...d, quotationLineExpenseItemId: d.id }
                }),
                isHighway: item.isHighway || 0,
                departure: item.departure,
                destination: item.destination,
                selectQuotation: item
            })
        } else {
            this.setSpecialBusinessData(item.openData.index, {
                expenseItemList: quotationLineExpenseItems.map(d => {
                    return { ...d, quotationLineExpenseItemId: d.id }
                }),
                departure: item.departure,
                destination: item.destination,
                selectQuotation: item
            })
        }
    }

    showMore = (record) => {
        //console.log('showMore record', record)
        this.addoredit.show({
            edit: false,
            data: record
        })
    }

    /* 切换 tab */
    changeTabShow = key => {  
        resetFormError(this.props.form)
        this.setState({ curTab: key })
    }

    /* 中转地值 */
    getTransitPlaceData = (val, { type, index }) => {
        if (type === 'sendcar') {
            this.setState({
                transitPlaceOneName: val.name || null,
                transitPlaceOneId: val.id || null
            })
        } else {
            this.setSpecialBusinessData(index, {
                transitPlaceOneId: val.id || null,
                transitPlaceOneName: val.name || null
            })
        }
    }
    
    onChangeExpenseItemList = (d, { type, index }) => {
        const { itemIndex, unitIndex, value, status, isEdit } = d
        // console.log('cg', d)
        if (type === 'sendcar') {
            if ('status' in d) {
                this.setState(preState => {
                    preState.selectExpenseItemList[itemIndex].status = status
                    preState.selectExpenseItemList[itemIndex].isEdit = isEdit
                    return {
                        selectExpenseItemList: preState.selectExpenseItemList
                    }
                })
            } else {
                this.setState(preState => {
                    let item = preState.selectExpenseItemList[itemIndex]
                    if (item && item.billingMethodName === '实报实销') {
                        item.costUnitValue = value.costUnitValue
                        item.currencyId = value.currencyId
                        item.currencyName = value.currencyName
                    } else {
                        item.orderExpenseItemUnitCoefficientList[unitIndex].costUnitValue = value.costUnitValue
                    }
                    return {
                        selectExpenseItemList: preState.selectExpenseItemList
                    }
                })
            }
        } else {
            if ('status' in d) {
                let { selectExpenseItemList } = this.state.specialBusiness[index].data
                selectExpenseItemList[itemIndex].status = status
                selectExpenseItemList[itemIndex].isEdit = isEdit
                this.setSpecialBusinessData(index, {
                    selectExpenseItemList
                })
            } else {
                let { selectExpenseItemList } = this.state.specialBusiness[index].data
                let item = selectExpenseItemList[itemIndex]
                if (item && item.billingMethodName === '实报实销') {
                    item.costUnitValue = value.costUnitValue
                    item.currencyId = value.currencyId
                    item.currencyName = value.currencyName
                } else {
                    item.orderExpenseItemUnitCoefficientList[unitIndex].costUnitValue = value.costUnitValue
                }
                this.setSpecialBusinessData(index, {
                    selectExpenseItemList
                })
            }
        }
    }

    clearData = (isClear) => { //删除承运商数据 => 清除相关联动数据
        if (isClear) {
            //console.log('clearData')
            this.setState({
                reLoadCarrier: true,
                carCode: null,
                driverId: null,
                driverName: null,
                phone: null,
                phoneBackup: null,
                quotationNumberId: null,
                expenseItemList: [],
                departure: null, //起运地
                destination: null, //目的地
                curCar: null,
                curDriver: null
            }, () => {
                this.setState({
                    reLoadCarrier: false
                })
            })
        }
    }

    clearCarData = (isClear) => { //删除车辆数据 => 清除相关联动数据
        if (isClear) {
            this.setState({
                reLoadCar: true,
                driverId: null,
                phone: null,
                phoneBackup: null
            }, () => {
                this.setState({
                    reLoadCar: false
                })
            })
        }
    }

    clearQuotationData = (isClear) => { //删除报价路线数据 => 清除相关联动数据
        if (isClear) {
            this.setState({
                reLoadQuotation: true,
                departure: null,
                destination: null,
                // transitPlaceOneId: null,
                expenseItemList: []
            }, () => {
                this.setState({
                    reLoadQuotation: false
                })
            })
        }
    }

    // disabledDate = (startValue) => { //禁用时间
    //     let curDate = new Date()
    //     let preDate = new Date(curDate.getTime() - 24*60*60*1000) //前一天
    //     if(startValue > preDate) {
    //         return false
    //     }
    //     return true
    // }

    /* 费用项选中值 */
    onChangRouter = (value, { type, index }) => {
        let selectExpenseItemList = type === 'sendcar' ? this.state.selectExpenseItemList : [...this.state.specialBusiness[index].data.selectExpenseItemList]
        value.forEach(item => {
            if (!selectExpenseItemList.some(cItem => cItem.id === item.id)) {
                selectExpenseItemList.push(item)
            }
        })
        for (let i = 0; i < selectExpenseItemList.length; i++) {
            if (!value.some(d => d.id === selectExpenseItemList[i].id) && (selectExpenseItemList[i].costUnitName && selectExpenseItemList[i].orderExpenseItemUnitCoefficientList)) {
                selectExpenseItemList.splice(i, 1)
                i--
            }
        }
        if (type === 'sendcar') {
            this.setState({
                selectExpenseItemList
            })
        } else {
            this.setSpecialBusinessData(index, {
                selectExpenseItemList
            })
        }
    }
        
    /* 实报实销选中值 */
    onReimbursementChangeValue = (value, { type, index }) => {
        let selectExpenseItemList = type === 'sendcar' ? this.state.selectExpenseItemList : [...this.state.specialBusiness[index].data.selectExpenseItemList]
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
        if (type === 'sendcar') {
            this.setState({
                selectExpenseItemList
            })
        } else {
            this.setSpecialBusinessData(index, {
                selectExpenseItemList
            })
        }
    }

    /* 删除费用项 */
    deleteItem = (value, { type, index }) => {
        let selectExpenseItemList = type === 'sendcar' ? this.state.selectExpenseItemList : this.state.specialBusiness[index].selectExpenseItemList
        let delIndex = value.itemIndex
        selectExpenseItemList.splice(delIndex, 1)
        if (type === 'sendcar') {
            this.setState({
                selectExpenseItemList
            })
        } else {
            this.setSpecialBusinessData(index, {
                selectExpenseItemList
            })
        }
    }

    /* 修改特殊业务数据 */
    setSpecialBusinessData = (index, target, callBack) => {
        let {specialBusiness} = this.state
        specialBusiness[index].data = {...specialBusiness[index].data, ...target}
        // console.log('sr', specialBusiness, target)
        this.setState({specialBusiness}, () => {
            if (callBack) {
                callBack()
            }
        })
    }

    /* 处理中转地下拉获取的数据 */
    dealTransfer = res => {
        let rt = []
        rt = [
            ...res.nodeList.map(item => {
                item.transferType = 'default'
                item.labelName = item.name
                return item
            }),
            ...res.warehouseVOList.map(item => {
                item.transferType = 'warehouse'
                item.labelName = `${item.name}(仓库)`
                return item
            })
        ].map((item, index) => ({
            ...item,
            keyName: `${item.id}-${index}`
        }))
        return rt
    }

    /* 设置中转地 */
    setTransfer = (val) => {
        let { transitPlaceOneId, transitPlaceOneName, sendCarOrderList, transitPlaceType, longitude, latitude} = this.state
        // longitude: null, //经度
        // latitude: null, //纬度
       // console.log('设置中转地', val, sendCarOrderList)
        if (val) {
            transitPlaceOneId = val.id
            transitPlaceOneName = val.name
            longitude = val.longitude
            latitude = val.latitude
            transitPlaceType = val.transferType === 'default' ? 1 : 2
            sendCarOrderList = sendCarOrderList.map(item => {
                item.transitType = 2
                return item
            })
        } else {
            transitPlaceOneId = null
            transitPlaceOneName = null
            longitude = null
            latitude = null
            transitPlaceType = null
            sendCarOrderList = sendCarOrderList.map(item => {
                item.transitType = item.originTransitType
                return item
            })
        }
        this.setState({
            transitPlaceType,
            transitPlaceOneId,
            longitude,
            latitude,
            transitPlaceOneName,
            sendCarOrderList
        })
    }

    /* 处理车辆列表 */
    filterCarList = arr => {
        return arr.map(item => ({
            ...item,
            labelName: `${item.carCode}(${item.carTypeName || '无'})`
        }))
    }
    /* 选择车辆 */
    setCar = (val, carId) => {
        // console.log('val', val)
        this.setState({
            carId: val ? val.id : null,
            carCode: val ? (val.id === 'temporaryCar' ? val.labelName : val.carCode) : null,
            curCar: val || null
        }, () => {
            let id = val ? val.id : null
            if (id !== carId) {
                this.clearCarData(true)
            }
        })
    }

    /* 处理司机列表 */
    filterDriverList = arr => {
        // console.log('arr', arr)
        return arr.map(item => ({
            ...item,
            labelName: item.driverName.split('(')[0] || item.driverName
        }))
    }
    /* 选择司机 */
    setDriver = async val => {
        let driverId = val && val.id === 'temporaryDriver' ? 'temporaryDriver' : val ? val.driverId : null
        await this.setState({
            driverId,
            driverName: val ? val.labelName : null,
            curDriver: val || null
        })
        this.setDriverPhone(this.state.curDriver)
    }
    /* 获取司机电话 */
    setDriverPhone = (driver) => {
        if (driver && driver.id !== 'temporaryDriver') {
            this.setState({
                phone: driver.phone || null,
                phoneBackup: driver.phoneBackup || null
            })
        } else {
            this.setState({
                phone: null,
                phoneBackup: null
            })
        }
    }
    /* 备用联系方式 */
    changeMorePhone = () => {
        if (this.state.morePhone) {
            this.setState({ morePhone: !this.state.morePhone, phoneBackup: null })
        } else {
            this.setState({ morePhone: !this.state.morePhone })
        }
    }

    /* 处理路线数据 */
    filterQuotationData = arr => {
        const { senderList, receiverList } = this.state
        return arr.filter(item => {
            // console.log('item', addressFormat(senderList[0].address).split('/')[0], item.departure.split('/')[0])
            let departureSame = item.departure === '全国' || senderList.some(c => addressFormat(c.address).split('/')[0] === item.departure.split('/')[0])
            let destinationSame = item.destination === '全国' || receiverList.some(c => addressFormat(c.address).split('/')[0] === item.destination.split('/')[0])
            return departureSame && destinationSame
        })
    }

    /* 新加tab */
    addTabpane = (newItem) => {
        let {
            quotationType
        } = this.state
        let specialBusiness = [...this.state.specialBusiness]
        if (!specialBusiness.some(item => item.title === newItem.title)) {
            specialBusiness.push({
                key: newItem.id,
                title: newItem.title,
                tabTitle: newItem.tabTitle,
                data: {
                    reLoadQuotation: false,
                    forceQuotationNumber: false,
                    carrierContactId: null,
                    carrierContactName: '',
                    carrierContactPhone: '',
                    carrierId: null,
                    carrierName: '',
                    carrierUseWay: 1,
                    id: null,
                    status: null,
                    stowageId: null,
                    carrierContactList: [],
                    specialBusinessId: newItem.id,
                    specialBusinessName: newItem.title,
                    billingMethod: 1,
                    quotationNumberId: null,
                    quotationNumber: null,
                    quotationType,
                    carrierId: null,
                    currencyId: null,
                    currencyName: null,
                    departure: null,
                    destination: null,
                    expenseItemList: [],
                    transitPlaceOneId: null,
                    transitPlaceOneName: '',
                    selectQuotation: {},
                    selectExpenseItemList: [],
                    sendCarCashPriceExpenseList: [],
                    taxes: 0, //发票税
                    withholdingTax: 0 //补扣税
                }
            })
        }
        this.setState({specialBusiness})
    }

    /* 删除tab */
    deleteTabpane = (target) => {
        let specialBusiness = [...this.state.specialBusiness]
        let index = specialBusiness.indexOf(specialBusiness.find(item => item.key === target.id))
        specialBusiness.splice(index, 1)
        this.setState({ specialBusiness })
    }

    /* 新建临时车辆 */
    async addTemporaryCar(carCode) {
        const { driverId, driverName, phone, carType, carrierId, carrierName } = this.state
        let reqData = {
            carCode,
            driverId,
            driverName,
            phone,
            attachCarrierId: carrierId,
            carrierName,
            configCarType: carType
        }
        return await this.props.rApi.addTemporaryCar(reqData)
    }
    /* 新建临时司机 */
    async addTemporaryDriver(driverName) {
        return await this.props.rApi.addTemporaryDriver({ name: driverName })
    }
    
    /* 验证 */
    handleSubmit = async (e, methodName = 'submit') => {
        const { carId, carCode, driverId, driverName, curTab } = this.state
        e.preventDefault()
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let carRes = null,
                    driverRes = null
                if (driverId === 'temporaryDriver' || carId === 'temporaryCar') {
                    try {
                        if (driverId === 'temporaryDriver') {
                            driverRes = await this.addTemporaryDriver(driverName)
                            let driverId = driverRes.id || -1
                            await this.setState({ driverId })
                        }
                        if (carId === 'temporaryCar') {
                            carRes = await this.addTemporaryCar(carCode)
                            let carId = carRes.id || -1
                            await this.setState({ carId })
                        }
                        this.saveSubmit(methodName)
                    } catch (err) {
                        message.error(err.msg || '新增临时车辆或司机失败')
                        return
                    }
                } else {
                    this.saveSubmit(methodName)
                }
            } else {
                if (curTab !== 'attemper') {
                    this.changeTabShow('attemper')
                    message.warning('请检查派车信息填写')
                } else {
                    message.warning('请检查调度信息填写')
                }
            }
        })
    }

    /* 提交请求 */
    saveSubmit = (methodName) => {
        let { rApi } = this.props
        let {
            billingMethod, //结算方式(1-合同价 2-现金价)
            carCode, //车牌号
            carId, //车辆id
            carTypeId, //车辆类型id
            carTypeName, //车辆类型名
            carrierId, //承运商id
            carrierName, //承运商名
            cashCostAmount, // 现金费用金额
            cashCostStatus, //现金费用状态（-1 禁用 1-启用）
            createTime, //创建时间
            currencyId, //币别id
            currencyName, //币别名称 
            departure, //起运地
            departureTime, //发车时间
            destination, //目的地
            driverId, //司机id
            driverName, //司机名字
            isHighway, //是否高速（0-否 1-是）
            oilCardCostAmount, //油卡费用金额
            oilCardCostStatus, //油卡费用状态（-1 禁用 1-启用）
            operatorId, //操作人id
            operatorName, //操作人名字
            phone, //手机号码
            phoneBackup, //电话号码
            quotationNumber, //报价单号
            quotationNumberId, //报价单号id
            remark, //备注信息
            sendCarCashPriceExpenseList, //现金价数据
            sendCarNumber, //派车单号
            sendCarOrderList, //配载订单数据
            status, //状态
            trailerCarCode,
            transitPlaceOneId, //中转地1 id
            transitPlaceOneName, //中转地1名
            transitPlaceTwoId, ////中转地2 id
            transitPlaceTwoName, //中转地2名
            transportationMethodId, //运输方式id
            transportationMethodName, //运输方式名
            totalBoardCount, //总板数
            totalBoxCount, //总箱数
            totalGrossWeight,
            totalNetWeight,
            totalQuantity,
            totalVolume,
            parentSendCarId,
            specialBusiness,
            selectExpenseItemList,
            carType,
            receiverList,
            senderList,
            quotationType,
            expenseItemList,
            selectQuotation,
            transitPlaceType,
            longitude,
            latitude,
            taxes, //发票税
            withholdingTax //补扣税
        } = this.state
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
        /**实报实销**/
        /**费用项**/
        let expenseItemData = selectExpenseItemList && selectExpenseItemList.length > 0 ? selectExpenseItemList.filter(d => (d.costUnitName && d.orderExpenseItemUnitCoefficientList)) : []
        if (billingMethod === 1) {
            sendCarCashPriceExpenseList = []
        } else {
            quotationNumber = null
            quotationNumberId = null
            sendCarCashPriceExpenseList = this.expensecash.logData().data
        }
        /**费用项**/
        /* 特殊业务 */
        let carrierList = specialBusiness.map((item, index) => {
            delete item.data.carrierContactList
            delete item.data.reLoadQuotation
            item.data.expenseCashPriceList = item.data.selectExpenseItemList.filter(d => d.billingMethodName === '实报实销').map(ex => {
                return {
                    ...ex,
                    billingMethodId: ex.billingMethodId,
                    billingMethodName: ex.billingMethodName,
                    code: ex.code,
                    costUnitValue: ex.costUnitValue ? ex.costUnitValue : '',
                    id: ex.id,
                    quotationLineExpenseItemId: ex.quotationLineExpenseItemId,
                    name: ex.name,
                    status: ex.status,
                    typeId: ex.typeId,
                    typeName: ex.typeName
                }
            })
            item.data.selectExpenseItemList = item.data.selectExpenseItemList.filter(d => d.billingMethodName !== '实报实销')
            if (item.data.billingMethod === 1) {
                item.data.sendCarCashPriceExpenseList = []
            } else {
                quotationNumber = null
                quotationNumberId = null
                item.data.sendCarCashPriceExpenseList = this[`expensecash${index}`].logData().data
            }
            return item.data
        })
        /* 特殊业务 */
        sendCarOrderList = sendCarOrderList.map(item => {
            item.sendCarOrderMaterialList = [...item.sendCarOrderMaterialVoList]
            item.transitPlaceOneId = transitPlaceOneId
            item.transitPlaceOneName = transitPlaceOneName
            return item
        })
        let loadingKey = methodName === 'confirm' ? 'confirmLoading' : 'buttonLoading'
        this.setState({
            [loadingKey]: true
        })
        let apiName = methodName === 'submit' ? 'stowageOrder' : 'stowageAndConfirmOrder'
        rApi[apiName]({
            billingMethod,
            carCode,
            carId,
            carTypeId,
            carTypeName,
            carrierId,
            carrierName,
            cashCostAmount,
            cashCostStatus,
            createTime,
            currencyId,
            currencyName,
            departure,
            departureTime,
            destination,
            driverId,
            driverName,
            isHighway,
            expenseCashPriceList: expensePriceData,
            expenseItemList,
            oilCardCostAmount,
            oilCardCostStatus,
            operatorId,
            operatorName,
            phone,
            phoneBackup,
            quotationNumber,
            quotationNumberId,
            remark,
            sendCarCashPriceExpenseList,
            sendCarNumber,
            sendCarOrderList,
            status,
            trailerCarCode,
            transitPlaceOneId,
            transitPlaceOneName,
            transitPlaceTwoId,
            transitPlaceTwoName,
            transportationMethodId,
            transportationMethodName,
            totalBoardCount,
            totalBoxCount,
            totalGrossWeight,
            totalNetWeight,
            totalQuantity,
            totalVolume,
            parentSendCarId,
            carrierList,
            carType,
            receiverList,
            senderList,
            selectExpenseItemList: expenseItemData,
            quotationType,
            selectQuotation,
            transitPlaceType,
            longitude,
            latitude,
            taxes, //发票税
            withholdingTax //补扣税
        })
            .then(d => {
                this.props.clearStowageList()
                message.success('操作成功!')
                this.actionDone()
                this.setState({ [loadingKey]: false })
            })
            .catch(e => {
                message.error(e.msg || '操作失败')
                this.setState({ [loadingKey]: false })
            })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        let {
            billingMethod, //结算方式(1-合同价 2-现金价)
            carCode, //车牌号
            carId, //车辆id
            carrierId, //承运商id
            carrierName,
            departure, //起运地
            departureTime, //发车时间
            destination, //目的地
            isHighway, //是否高速（0-否 1-是）
            expenseItemList, //费用项数据列表
            phone, //手机号码
            phoneBackup, //电话号码
            quotationNumber, //报价单号
            quotationNumberId, //报价单号id
            sendCarCashPriceExpenseList,
            fileterProjectId,
            reLoadCarrier,
            reLoadCar,
            reLoadQuotation,
            isShowTransfer,
            countCol,
            senderList,
            receiverList,
            buttonLoading,
            specialBusiness,
            carType,
            selectExpenseItemList,
            transitPlaceOneName,
            selectQuotation,
            confirmLoading,
            activeTab,
            curCar,
            driverId,
            morePhone,
            curTab
        } = this.state
        const titlebarStyle = { height: 36, lineHeight: '36px', fontSize: '14px' }
        const expenseStyle = { marginTop: 10, width: 800 }
        return (
            <Modal
                onSubmit={this.onSubmit}
                style={{width: '95%', maxWidth: 1000}}
                changeOpen={this.changeOpen} 
                open={this.state.open}
                title={'配载信息'} 
                getContentDom={v => this.popupContainer = v}
            >
                <Quotation 
                    showMore={this.showMore} 
                    selectRow={this.selectRow}
                    getThis={v => this.quotationView = v}
                    dealData={this.filterQuotationData}
                    isAntdModal
                />
                <AddOrEdit parent={this} getThis={v => this.addoredit = v} />
                <div className="stowage-wrapper" ref={v => this.rootDom = v}>
                    <Form layout='inline' onSubmit={this.handleSubmit}>
                        <Tabs
                            className='itabs-bottomline nopad'
                            activeKey={curTab}
                            onTabClick={this.changeTabShow}
                        >
                            <TabPane
                                tab={'配载统计'}
                                key={'suminfo'}
                                style={{padding: '0 20px 20px'}}
                            >
                                <div style={titlebarStyle}>
                                    <span>配载量统计</span>
                                </div>
                                <Table
                                    noPadding
                                    noTitlebar
                                    parent={this}
                                    isNoneSelected={true}
                                    isNoneNum={true}
                                    isNoneAction={true}
                                    style={{ width: 700 }}
                                    THeader={<span></span>}
                                    power={this.props.power}
                                    getData={this.getCountCol}
                                    columns={countCol}
                                    columnKey='countCol'
                                    isHideHeaderButton={true}
                                    isNonePagination={true}
                                    tableWidth={80}
                                    isNoneScroll
                                />
                                <div style={titlebarStyle}>
                                    <span>配载收/发货方汇总</span>
                                </div>
                                <ReceiversAndSenders
                                    style={{padding: '0', marginBottom: 10}}
                                    senderList={senderList}
                                    receiverList={receiverList}
                                />
                                <Row style={{minHeight: 42}}>
                                    <Col label="是否中转" span={3}>
                                        <Switch
                                            size='small'
                                            checked={isShowTransfer}
                                            onChange={(flag) => {
                                                this.setState({ isShowTransfer: flag })
                                            }
                                            }
                                            style={{ verticalAlign: 'sub' }}
                                        />
                                    </Col>
                                    {
                                        isShowTransfer &&
                                        <Col span={4}>
                                            <RemoteSelect
                                                placeholder='选择中转地'
                                                params={{ limit: 99999, offset: 0, projectIds: fileterProjectId }}
                                                getPopupContainer={() => this.popupContainer || document.body}
                                                onChangeValue={this.setTransfer}
                                                dealData={this.dealTransfer}
                                                getDataMethod={'getTransportData'}
                                                labelField='labelName'
                                                showOrigin
                                                keyName='keyName'
                                            />
                                        </Col>
                                    }
                                    <Col span={17}></Col>
                                </Row>
                                <Row style={{minHeight: 42}}>
                                    <Col label="备注信息" span={10}>
                                        <Input
                                            placeholder=""
                                            onChange={e => {
                                                this.setState({ remark: e.target.value })
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane
                                tab={'调度信息'}
                                key={'attemper'}
                            >
                                <Tabs
                                    type="card"
                                    activeKey={activeTab}
                                    className='itabs-customcard haspad'
                                    onTabClick={key => {
                                        if (key !== 'addTab') {
                                            resetFormError(this.props.form)
                                            this.setState({ activeTab: key })
                                        } else { }
                                    }}
                                >
                                    <TabPane tab="派车" key="sendcar">
                                        <div>
                                            <Row style={{minHeight: 42}}>
                                                <Col label="车辆类型" span={7}>
                                                    <RadioGroup
                                                        onChange={e => {
                                                            resetFormError(this.props.form)
                                                            this.setState({
                                                                carType: e.target.value
                                                            })
                                                            if (e && e.target.value === 2) {
                                                                this.setState({
                                                                    billingMethod: 2,
                                                                    carrierId: null,
                                                                    carrierName: ''
                                                                })
                                                            }
                                                        }}
                                                        defaultValue={carType}
                                                        value={carType}
                                                    >
                                                        <Radio value={1}>承运商车辆</Radio>
                                                        <Radio value={2}>现金车</Radio>
                                                    </RadioGroup>
                                                </Col>
                                                {
                                                    carType !== 2 &&
                                                    <Col label="&emsp;承运商" span={7} isRequired>
                                                        <FormItem style={{ width: 150 }}>
                                                            {
                                                                getFieldDecorator('carrierId', {
                                                                    initialValue: carrierId ? {
                                                                        carrierId: carrierId,
                                                                        carrierName: carrierName
                                                                    } : null,
                                                                    rules: [
                                                                        {
                                                                            required: true,
                                                                            message: '请选择承运商'
                                                                        }
                                                                    ],
                                                                })(
                                                                    <RemoteSelect
                                                                        onChangeValue={value => {
                                                                            this.setState({
                                                                                carrierId: value ? value.id : null,
                                                                                carrierName: value ? value.businessName : null
                                                                            }, () => {
                                                                                let id = value ? value.id : null
                                                                                if (id !== carrierId) {
                                                                                    this.clearData(true)
                                                                                }
                                                                            })
                                                                        }}
                                                                        getPopupContainer={() => this.popupContainer || document.body}
                                                                        disabled={carType === 2}
                                                                        getDataMethod={'filterCarriersByIds'}
                                                                        params={{ ids: fileterProjectId }}
                                                                        labelField='businessName'
                                                                    />
                                                                )
                                                            }
                                                        </FormItem>
                                                    </Col>
                                                }
                                                <Col span={7} />
                                            </Row>
                                            <Row style={{minHeight: 42}}>
                                                <Col label="选择车辆" span={7} isRequired={carType === 2}>
                                                    {
                                                        reLoadCarrier ?
                                                            null
                                                            :
                                                            <FormItem>
                                                                {
                                                                    getFieldDecorator('carCode', {
                                                                        rules: [
                                                                            {
                                                                                required: carType === 2 ? true : false,
                                                                                message: '请选择车辆'
                                                                            }
                                                                        ],
                                                                    })(
                                                                        <RemoteSelect
                                                                            getPopupContainer={() => this.popupContainer || document.body}
                                                                            placeholder=""
                                                                            onChangeValue={val => this.setCar(val, carId)}
                                                                            getDataMethod={'getCars'}
                                                                            params={{ limit: 99999, offset: 0, associateCarrier: carrierId, authenticationStatus: 1 }}
                                                                            labelField={'labelName'}
                                                                            dealData={this.filterCarList}
                                                                            showOrigin
                                                                            hasInput
                                                                            inputKey='temporaryCar'
                                                                        />
                                                                    )
                                                                }
                                                            </FormItem>
                                                    }
                                                </Col>
                                                {
                                                    carId &&
                                                    <Col label={carId === 'temporaryCar' ? '临时车辆' : (curCar ? (curCar.carTypeName || '无车型') : null)} colon span={7}>
                                                        {
                                                            carId === 'temporaryCar' && <Tag color="#f50" style={{ marginLeft: 10 }}>非平台车辆</Tag>
                                                        }
                                                    </Col>
                                                }
                                                <Col span={7} />
                                            </Row>
                                            <Row style={{minHeight: 42}}>
                                                <Col label="司机姓名" span={7} isRequired={carType === 2}>
                                                    {
                                                        reLoadCarrier || reLoadCar ?
                                                            null
                                                            :
                                                            <FormItem>
                                                                {
                                                                    getFieldDecorator('driverId', {
                                                                        rules: [
                                                                            {
                                                                                required: carType === 2 ? true : false,
                                                                                message: '请选择司机'
                                                                            }
                                                                        ],
                                                                    })(
                                                                        <RemoteSelect
                                                                            getPopupContainer={() => this.popupContainer || document.body}
                                                                            placeholder=""
                                                                            onChangeValue={this.setDriver}
                                                                            getDataMethod={'getCars'}
                                                                            params={{ limit: 99999, offset: 0, authenticationStatus: 1, keyword: carId === 'temporaryCar' ? '' : carCode }}
                                                                            dealData={this.filterDriverList}
                                                                            labelField={'labelName'}
                                                                            showOrigin
                                                                            hasInput
                                                                            inputKey='temporaryDriver'
                                                                        />
                                                                    )
                                                                }
                                                            </FormItem>
                                                    }
                                                </Col>
                                                <Col label="联系方式" span={13} style={{ alignItems: 'center' }}>
                                                    {
                                                        reLoadCar ?
                                                            null
                                                            :
                                                            <FormItem style={{width: 150}}>
                                                                {
                                                                    getFieldDecorator('phone', {
                                                                        initialValue: phone,
                                                                        rules: [
                                                                            {
                                                                                required: false
                                                                            }
                                                                        ],
                                                                    })(
                                                                        <Input
                                                                            placeholder=""
                                                                            onChange={e => {
                                                                                this.setState({ phone: e.target.value })
                                                                            }}
                                                                        />
                                                                    )
                                                                }
                                                            </FormItem>
                                                    }
                                                    {
                                                        reLoadCar ? null : ((phoneBackup || morePhone) ? <FormItem style={{ width: 150, marginLeft: 10 }}>
                                                            {
                                                                getFieldDecorator('phoneBackup', {
                                                                    initialValue: phoneBackup,
                                                                    rules: [
                                                                        {
                                                                            validator: validateToNextPhone
                                                                        }
                                                                    ],
                                                                })(
                                                                    <Input
                                                                        placeholder=""
                                                                        onChange={e => {
                                                                            this.setState({ phoneBackup: e.target.value })
                                                                        }}
                                                                    />
                                                                )
                                                            }
                                                        </FormItem> : null)
                                                    }
                                                    <div className='plusStyle' onClick={this.changeMorePhone}>
                                                        {
                                                            morePhone ? <span style={{ marginTop: '-2px' }}>-</span> : <span style={{ marginTop: '-2px' }}>+</span>
                                                        }
                                                    </div>
                                                    {
                                                        driverId === 'temporaryDriver' && <Tag color="#f50" style={{ marginLeft: 10 }}>非平台司机</Tag>
                                                    }
                                                </Col>
                                                <Col span={1} />
                                            </Row>
                                            <Row style={{minHeight: 42}}>
                                                <Col label="发车时间" span={7} isRequired>
                                                    <FormItem>
                                                        {
                                                            getFieldDecorator('departureTime', {
                                                                rules: [
                                                                    {
                                                                        required: true,
                                                                        message: '请选择发车时间'
                                                                    }
                                                                ],
                                                            })(
                                                                <DatePicker
                                                                    style={{ width: '100%' }}
                                                                    getCalendarContainer={() => this.popupContainer || document.body}
                                                                    placeholder="选择日期"
                                                                    title={departureTime}
                                                                    format="YYYY-MM-DD HH:mm"
                                                                    showTime={{ format: 'HH:mm' }}
                                                                    onChange={
                                                                        date => {
                                                                            this.setState({ departureTime: date })
                                                                        }}
                                                                />
                                                            )
                                                        }
                                                    </FormItem>
                                                </Col>
                                                <Col label="高速要求" span={7}>
                                                    <RadioGroup
                                                        onChange={e => {
                                                            this.setState({
                                                                isHighway: e.target.value
                                                            })
                                                        }}
                                                        value={isHighway}
                                                    >
                                                        <Radio value={1}>是</Radio>
                                                        <Radio value={0}>否</Radio>
                                                    </RadioGroup>
                                                </Col>
                                                <Col span={7} />
                                            </Row>
                                            <div style={titlebarStyle}>
                                                <span>结算明细</span>
                                            </div>
                                            <Row style={{minHeight: 42}}>
                                                <Col label="结算方式" span={6}>
                                                    <div className="flex flex-vertical-center">
                                                        <RadioGroup
                                                            onChange={e => {
                                                                this.setState({
                                                                    billingMethod: e.target.value
                                                                })
                                                            }}
                                                            value={billingMethod ? billingMethod : 1}
                                                        >
                                                            {
                                                                carType === 1 &&
                                                                <Radio value={1}>合同价</Radio>
                                                            }
                                                            <Radio value={2}>现金价</Radio>
                                                        </RadioGroup>
                                                    </div>
                                                </Col>
                                                {
                                                    billingMethod === 1 && carType === 1 ?
                                                        <Col label='报价单号' span={6}>
                                                            <div className="flex flex-vertical-center">
                                                                <div style={{ width: 150, marginRight: '20px' }}>
                                                                    {
                                                                        reLoadCarrier ?
                                                                            null
                                                                            :
                                                                            <RemoteSelect
                                                                                defaultValue={
                                                                                    quotationNumberId ?
                                                                                        {
                                                                                            id: quotationNumberId,
                                                                                            quotationNumber: quotationNumber
                                                                                        }
                                                                                        :
                                                                                        null
                                                                                }
                                                                                getPopupContainer={() => this.popupContainer || document.body}
                                                                                disabled={carrierId ? false : true}
                                                                                onChangeValue={(value = {}) => {
                                                                                    let currencyId = value && value.origin_data && value.origin_data.length ? value.origin_data[0].currencyId : null
                                                                                    let currencyName = value && value.origin_data && value.origin_data.length ? value.origin_data[0].currencyName : null
                                                                                    let taxes = value && value.origin_data && value.origin_data.length ? value.origin_data[0].taxes || 0 : 0
                                                                                    let withholdingTax = value && value.origin_data && value.origin_data.length ? value.origin_data[0].withholdingTax || 0 : 0
                                                                                    this.setState(
                                                                                        {
                                                                                            quotationNumberId: value.id || null,
                                                                                            quotationNumber: value.title || value.quotationNumber,
                                                                                            currencyId,
                                                                                            currencyName,
                                                                                            taxes,
                                                                                            withholdingTax
                                                                                        }, () => {
                                                                                            let id = value ? value.id : null
                                                                                            if (id !== quotationNumberId) {
                                                                                                this.clearQuotationData(true)
                                                                                            }
                                                                                        }
                                                                                    )
                                                                                }}
                                                                                labelField={'quotationNumber'}
                                                                                getDataMethod={'getOfferCarrier'}
                                                                                params={{ limit: 99999, offset: 0, carrierId: carrierId, reviewStatus: 2 }}

                                                                            />
                                                                    }
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        :
                                                        <Col label="币种" span={6}>
                                                            <div className="flex flex-vertical-center">
                                                                <RemoteSelect
                                                                    text='币别'
                                                                    onChangeValue={(value = {}) =>
                                                                        this.setState({ currencyId: value.id || null, currencyName: value.title || null })
                                                                    }
                                                                    getPopupContainer={() => this.popupContainer || document.body}
                                                                />
                                                            </div>
                                                        </Col>
                                                }
                                                <Col span={8} />
                                            </Row>
                                            {
                                                billingMethod === 1 &&
                                                <Fragment>
                                                    <Row style={{minHeight: 42}}>
                                                        <Col>
                                                            <Button
                                                                icon='environment'
                                                                disabled={quotationNumberId ? false : true}
                                                                onClick={e => this.selectRoute({
                                                                    type: 'sendcar',
                                                                    index: 0
                                                                })}
                                                            >
                                                                选择报价路线
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{minHeight: 42}}>
                                                        <Col>
                                                            <TransportRoute
                                                                getTransitPlaceData={val => this.getTransitPlaceData(val, {
                                                                    type: 'sendcar',
                                                                    index: null
                                                                })}
                                                                departure={departure}
                                                                transitPlaceOneName={transitPlaceOneName}
                                                                destination={destination}
                                                                isTransitPlace={true}
                                                                selectQuotation={selectQuotation}
                                                                power={power}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Fragment>
                                            }
                                            {
                                                billingMethod === 1 ?
                                                    <div style={expenseStyle}>
                                                        {
                                                            reLoadCarrier || reLoadQuotation ?
                                                                null
                                                                :
                                                                <ExpenseItem
                                                                    onChangeExpenseItemList={d => this.onChangeExpenseItemList(d, {
                                                                        type: 'sendcar',
                                                                        index: null
                                                                    })}
                                                                    route={expenseItemList}
                                                                    style={{ width: '100%' }}
                                                                    departure={departure}
                                                                    destination={destination}
                                                                    onChangRouter={value => this.onChangRouter(value, {
                                                                        type: 'sendcar',
                                                                        index: null
                                                                    })}
                                                                    onReimbursementChangeValue={value => this.onReimbursementChangeValue(value, {
                                                                        type: 'sendcar',
                                                                        index: null
                                                                    })}
                                                                    receivableOrPayable='应付'
                                                                    selectRoute={selectExpenseItemList}
                                                                    deleteItem={value => this.deleteItem(value, {
                                                                        type: 'sendcar',
                                                                        index: null
                                                                    })}
                                                                />
                                                        }
                                                    </div>
                                                    :
                                                    <div style={expenseStyle}>
                                                        <ExpenseCash
                                                            data={sendCarCashPriceExpenseList}
                                                            getThis={(v) => this.expensecash = v}
                                                        />
                                                    </div>
                                            }
                                        </div>
                                    </TabPane>
                                    {
                                        specialBusiness && specialBusiness.length && specialBusiness.map((item, index) => {
                                            return (
                                                <TabPane
                                                    tab={item.tabTitle}
                                                    key={item.key}
                                                >
                                                    <Row style={{minHeight: 42}}>
                                                        <Col label="&emsp;承运商" span={7} isRequired>
                                                            <FormItem>
                                                                {
                                                                    getFieldDecorator(`carrierId-${index}`, {
                                                                        rules: [
                                                                            {
                                                                                required: true,
                                                                                message: '请选择承运商'
                                                                            }
                                                                        ],
                                                                    })(
                                                                        <RemoteSelect
                                                                            onChangeValue={(value) => {
                                                                                let prevId = item.data.carrierId
                                                                                this.setSpecialBusinessData(index, {
                                                                                    'carrierId': value ? value.id : null,
                                                                                    'carrierName': value ? value.businessName : null,
                                                                                    'carrierContactList': value && value.origin_data && value.origin_data.length ? value.origin_data[0].carrierContactList : []
                                                                                }, () => {
                                                                                    let id = value ? value.id : null
                                                                                    if (prevId !== id) {
                                                                                        this.setSpecialBusinessData(index, {
                                                                                            forceQuotationNumber: true,
                                                                                            quotationNumber: null,
                                                                                            quotationNumberId: null
                                                                                        }, () => {
                                                                                            this.setSpecialBusinessData(index, {
                                                                                                forceQuotationNumber: false
                                                                                            })
                                                                                        })
                                                                                    }
                                                                                })
                                                                            }}
                                                                            getPopupContainer={() => this.popupContainer || document.body}
                                                                            getDataMethod={'filterCarriersByIds'}
                                                                            params={{ ids: fileterProjectId }}
                                                                            labelField='businessName'
                                                                        />
                                                                    )
                                                                }
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{minHeight: 42}}>
                                                        <Col label="&emsp;联系人" span={7}>
                                                            {
                                                                item.data.carrierContactList && item.data.carrierContactList.length ?
                                                                    <FormItem>
                                                                        {
                                                                            getFieldDecorator(`carrierContactId-${item.value}`, {
                                                                                rules: [
                                                                                    {
                                                                                        required: false,
                                                                                        message: '请选择联系人'
                                                                                    }
                                                                                ],
                                                                            })(
                                                                                <RemoteSelect
                                                                                    defaultValue={
                                                                                        item.data.carrierContactId ?
                                                                                            {
                                                                                                id: item.data.carrierContactId,
                                                                                                driverName: item.data.carrierContactName
                                                                                            }
                                                                                            : null
                                                                                    }
                                                                                    getPopupContainer={() => this.popupContainer || document.body}
                                                                                    onChangeValue={value => {
                                                                                        this.setSpecialBusinessData(index, {
                                                                                            carrierContactId: value ? value.id : null,
                                                                                            carrierContactName: value ? value.name : null,
                                                                                            carrierContactPhone: value && value.origin_data && value.origin_data.length ? value.origin_data[0].phone : null
                                                                                        })
                                                                                    }}
                                                                                    timelyFilter={true}
                                                                                    labelField={'name'}
                                                                                    list={item.data.carrierContactList}
                                                                                />
                                                                            )
                                                                        }
                                                                    </FormItem>
                                                                    :
                                                                    <Input
                                                                        value={item.data ? item.data.carrierContactName : null}
                                                                        placeholder=""
                                                                        onChange={e => this.setSpecialBusinessData(index, { carrierContactName: e ? e.target.value : null })}
                                                                    />
                                                            }
                                                        </Col>
                                                    </Row>
                                                    <Row style={{minHeight: 42}}>
                                                        <Col label="联系电话" span={7}>
                                                            <FormItem>
                                                                {
                                                                    getFieldDecorator(`phoneBackup-${item.value}`, {
                                                                        initialValue: item.data ? item.data.carrierContactPhone : null,
                                                                        rules: [
                                                                            {
                                                                                validator: validateToNextPhone
                                                                            }
                                                                        ],
                                                                    })(
                                                                        <Input
                                                                            placeholder=""
                                                                            value={item.data ? item.data.carrierContactPhone : null}
                                                                            onChange={e => this.setSpecialBusinessData(index, { carrierContactPhone: e ? e.target.value : null })}
                                                                        />
                                                                    )
                                                                }
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                    <div style={titlebarStyle}>
                                                        <span>结算明细</span>
                                                    </div>
                                                    <Row style={{minHeight: 42}}>
                                                        <Col label="结算方式" span={6}>
                                                            <div className="flex flex-vertical-center">
                                                                <RadioGroup
                                                                    onChange={e => {
                                                                        this.setSpecialBusinessData(index, {
                                                                            billingMethod: e ? e.target.value : null
                                                                        })
                                                                    }}
                                                                    value={item.data.billingMethod ? item.data.billingMethod : 2}
                                                                >
                                                                    <Radio value={1}>合同价</Radio>
                                                                    <Radio value={2}>现金价</Radio>
                                                                </RadioGroup>
                                                            </div>
                                                        </Col>
                                                        {
                                                            item.data.billingMethod === 1 ?
                                                                <Col label='报价单号' span={6}>
                                                                    <div className="flex flex-vertical-center">
                                                                        <div style={{ width: 150, marginRight: '20px' }}>
                                                                            <RemoteSelect
                                                                                forceRender={item.data.forceQuotationNumber}
                                                                                defaultValue={
                                                                                    item.data.quotationNumberId ?
                                                                                        {
                                                                                            id: item.data.quotationNumberId,
                                                                                            quotationNumber: item.data.quotationNumber
                                                                                        }
                                                                                        :
                                                                                        null
                                                                                }
                                                                                getPopupContainer={() => this.popupContainer || document.body}
                                                                                disabled={item.data.carrierId ? false : true}
                                                                                onChangeValue={(val = {}) => {
                                                                                    let prevId = item.data.quotationNumberId
                                                                                    let quotationNumberId = val ? val.id : null
                                                                                    let quotationNumber = val.title || val.quotationNumber
                                                                                    let currencyId = val && val.origin_data && val.origin_data.length ? val.origin_data[0].currencyId : null
                                                                                    let currencyName = val && val.origin_data && val.origin_data.length ? val.origin_data[0].currencyName : null
                                                                                    let taxes = val && val.origin_data && val.origin_data.length ? val.origin_data[0].taxes || 0 : 0
                                                                                    let withholdingTax = val && val.origin_data && val.origin_data.length ? val.origin_data[0].withholdingTax || 0 : 0
                                                                                    this.setSpecialBusinessData(index, {
                                                                                        quotationNumber,
                                                                                        quotationNumberId,
                                                                                        currencyId,
                                                                                        currencyName,
                                                                                        taxes,
                                                                                        withholdingTax
                                                                                    }, () => {
                                                                                        if (quotationNumberId !== prevId) {
                                                                                            this.setSpecialBusinessData(index, {
                                                                                                departure: null,
                                                                                                destination: null,
                                                                                                expenseItemList: [],
                                                                                                reLoadQuotation: true
                                                                                            }, () => {
                                                                                                this.setSpecialBusinessData(index, {
                                                                                                    reLoadQuotation: false
                                                                                                })
                                                                                            })
                                                                                        }
                                                                                    })
                                                                                }}
                                                                                labelField={'quotationNumber'}
                                                                                getDataMethod={'getOfferCarrier'}
                                                                                params={{ limit: 99999, offset: 0, carrierId: item.data.carrierId, reviewStatus: 2 }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                                :
                                                                <Col label="币种" span={4}>
                                                                    <div className="flex flex-vertical-center">
                                                                        <RemoteSelect
                                                                            text='币别'
                                                                            onChangeValue={(val = {}) =>
                                                                                this.setSpecialBusinessData(index, {
                                                                                    currencyId: val.id || null,
                                                                                    currencyName: val.title || null
                                                                                })
                                                                            }
                                                                            getPopupContainer={() => this.popupContainer || document.body}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                        }
                                                        <Col span={8} />
                                                    </Row>
                                                    {
                                                        item.data.billingMethod === 1 &&
                                                        <Fragment>
                                                            <Row style={{minHeight: 42}}>
                                                                <Col>
                                                                    <Button
                                                                        icon='environment'
                                                                        disabled={item.data.quotationNumberId ? false : true}
                                                                        onClick={e => this.selectRoute({
                                                                            type: 'spec',
                                                                            index
                                                                        })}
                                                                    >
                                                                        选择报价路线
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                            <Row style={{minHeight: 42}}>
                                                                <Col>
                                                                    <TransportRoute
                                                                        getTransitPlaceData={val => this.getTransitPlaceData(val, {
                                                                            type: 'spec',
                                                                            index
                                                                        })}
                                                                        departure={item.data.departure}
                                                                        transitPlaceOneName={item.data.transitPlaceOneName}
                                                                        destination={item.data.destination}
                                                                        isTransitPlace={true}
                                                                        selectQuotation={item.data.selectQuotation}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </Fragment>
                                                    }
                                                    {
                                                        item.data.billingMethod === 1 ?
                                                            <div style={expenseStyle}>
                                                                {
                                                                    (item.data.forceQuotationNumber || item.data.reLoadQuotation) ?
                                                                        null
                                                                        :
                                                                        <ExpenseItem
                                                                            onChangeExpenseItemList={d => this.onChangeExpenseItemList(d, {
                                                                                type: 'spec',
                                                                                index
                                                                            })}
                                                                            route={item.data.expenseItemList}
                                                                            style={{ width: '100%' }}
                                                                            departure={item.data.departure}
                                                                            destination={item.data.destination}
                                                                            onChangRouter={value => this.onChangRouter(value, {
                                                                                type: 'spec',
                                                                                index
                                                                            })}
                                                                            onReimbursementChangeValue={value => this.onReimbursementChangeValue(value, {
                                                                                type: 'spec',
                                                                                index
                                                                            })}
                                                                            receivableOrPayable='应付'
                                                                            selectRoute={item.data.selectExpenseItemList}
                                                                            deleteItem={value => this.deleteItem(value, {
                                                                                type: 'spec',
                                                                                index
                                                                            })}
                                                                        />
                                                                }
                                                            </div>
                                                            :
                                                            <div style={expenseStyle}>
                                                                <ExpenseCash
                                                                    data={item.data.sendCarCashPriceExpenseList}
                                                                    getThis={(v) => this[`expensecash${index}`] = v}
                                                                />
                                                            </div>
                                                    }
                                                </TabPane>
                                            )
                                        })
                                    }
                                    {
                                        this.rootDom &&
                                        <TabPane
                                            key='addTab'
                                            tab={
                                                <TabAddButton
                                                    parent={this.rootDom}
                                                    handleConfirm={this.addTabpane}
                                                    handleDelete={this.deleteTabpane}
                                                />
                                            }
                                        ></TabPane>
                                    }
                                </Tabs>
                            </TabPane>
                        </Tabs>
                        
                        
                        <div style={{ padding: '12px 22px', display: 'flex', boxShadow: '0 -1px 0 0 #ddd' }}>
                            <FormItem>
                                <FunctionPower power={power.STOWAGE_SUB}>
                                    <Button 
                                        htmlType="submit"
                                        loading={buttonLoading}
                                    >
                                        提交
                                    </Button>
                                </FunctionPower>
                                <FunctionPower power={power.STOWAGE_CONF}>
                                    <Popconfirm
                                        title='是否确认配载'
                                        onConfirm={e => this.handleSubmit(e, 'confirm')}
                                    >
                                        <Button
                                            style={{ marginLeft: 10 }}
                                            loading={confirmLoading}
                                        >
                                            确认
                                        </Button>
                                    </Popconfirm>
                                </FunctionPower>
                            </FormItem>
                        </div>
                    </Form>
                </div>
            </Modal>
        )
    }
}
 
export default Form.create()(Stowage);