import React, { Fragment } from 'react'
import { Row, Col } from '@src/components/grid'
import { Table, Parent } from '@src/components/table_template'
import RemoteSelect from '@src/components/select_databook'
import { inject, observer } from "mobx-react"
import { Switch, Tabs, Radio, Button, message, Spin } from 'antd'
import Quotation from "../order/list/quotation"
import AddOrEdit from '@src/views/project_management/customer_offer/transport/addoredit'
import TransportRoute from '../public/transport_route'
import ExpenseCash from '../order/list/expense_cash'
import ExpenseItem from '../order/add/expense _config'
import { cloneObject } from '@src/utils'
import { toStowageMaintenanceList } from '@src/views/layout/to_page'
import { expenseItemsToArray } from '../order/add/index'
import GoodsDetails from './details.jsx'
import moment from 'moment'
import { children, id } from './power_hide'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import './index.less'

const {TabPane} = Tabs
const RadioGroup = Radio.Group

const power = Object.assign({}, children, id)

/* 配载数据维护编辑 */
@inject('rApi', 'mobxTabsData', 'mobxBaseData', 'mobxDataBook')
@observer
class StowageMaintenanceEdit extends Parent {
    state = {
        loading: true,
        pageData: null, //页面接收数据
        openType: 'entry', //类型  entry -> 录入 see ->查看
        columns: [
            {
                className: 'text-overflow-ellipsis',
                title: '订单号',
                dataIndex: 'orderNumber',
                key: 'orderNumber',
                width: 150,
                render: (val, r) => {
                    return (
                        <div style={{ width: 129 }}>
                            <span title={r.orderNumber}>{r.orderNumber ? r.orderNumber : ''}</span>
                        </div>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '客户名称',
                dataIndex: 'clientShortName',
                key: 'clientShortName',
                width: 150,
                render: (text, r, index) => {
                    return (
                        <div style={{ width: 129 }} className="text-overflow-ellipsis">
                            <span title={r.clientName}>
                                {
                                    r.clientName ? r.clientName : ''
                                }
                            </span>
                        </div>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '配载段',
                dataIndex: 'transitType',
                key: 'transitType',
                width: 150,
                render: (val, r) => {
                    if (r.id === 'isStatistics') {
                        return ''
                    }
                    switch (val) {
                        case 1:
                            return `${r.departure || '无'} - ${r.destination || '无'}`
                        case 2: 
                            return `${r.departure || '无'} - ${r.destination || '无'}`
                        case 3:
                            return `${r.departure || '无'} - ${r.destination || '无'}`
                        case 4:
                            return `${r.departure || '无'} - ${r.destination || '无'}`
                        default :
                            return `${r.departure || '无'} - ${r.destination || '无'}`
                    }
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '数量',
                dataIndex: 'totalQuantity',
                key: 'totalQuantity',
                width: 100,
                render: (text, r, index) => {
                    if (r.isStatistics) {
                        return (
                            <div style={{ width: 79 }}>
                                <span className="order-statistics" title={r.totalQuantity ? r.totalQuantity : ''}>
                                    {r.totalQuantity ? r.totalQuantity : ''}
                                </span>
                            </div>
                        )
                    }
                    let count = null
                    if (r.editData) {
                        count = this.reduceCount(r.editData.sendCarOrderMaterialList, 'quantity').toFixed(2)
                    }
                    return (
                        <div style={{ width: 79 }}>
                            <span title={count}>
                                {count}
                            </span>
                        </div>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '箱数',
                dataIndex: 'totalBoxCount',
                key: 'totalBoxCount',
                width: 100,
                render: (text, r, index) => {
                    if (r.isStatistics) {
                        return (
                            <div style={{ width: 79 }}>
                                <span className="order-statistics" title={r.totalBoxCount ? r.totalBoxCount : ''}>
                                    {r.totalBoxCount ? r.totalBoxCount : ''}
                                </span>
                            </div>
                        )
                    }
                    let count = null
                    if (r.editData) {
                        count = this.reduceCount(r.editData.sendCarOrderMaterialList, 'boxCount').toFixed(2)
                    }
                    return (
                        <div style={{ width: 79 }}>
                            <span title={count}>
                                {count}
                            </span>
                        </div>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '板数',
                dataIndex: 'totalBoardCount',
                key: 'totalBoardCount',
                width: 100,
                render: (text, r, index) => {
                    if (r.isStatistics) {
                        return (
                            <div style={{ width: 79 }}>
                                <span className="order-statistics" title={r.totalBoardCount ? r.totalBoardCount : ''}>
                                    {r.totalBoardCount ? r.totalBoardCount : ''}
                                </span>
                            </div>
                        )
                    }
                    let count = null
                    if (r.editData) {
                        count = this.reduceCount(r.editData.sendCarOrderMaterialList, 'boardCount').toFixed(2)
                    }
                    return (
                        <div style={{ width: 79 }}>
                            <span title={count}>
                                {count}
                            </span>
                        </div>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '毛重(kg)',
                dataIndex: 'totalGrossWeight',
                key: 'totalGrossWeight',
                width: 100,
                render: (text, r, index) => {
                    if (r.isStatistics) {
                        return (
                            <div style={{ width: 79 }}>
                                <span className="order-statistics" title={r.totalGrossWeight ? r.totalGrossWeight : ''}>
                                    {r.totalGrossWeight ? r.totalGrossWeight : ''}
                                </span>
                            </div>
                        )
                    }
                    let count = null
                    if (r.editData) {
                        count = this.reduceCount(r.editData.sendCarOrderMaterialList, 'grossWeight').toFixed(2)
                    }
                    return (
                        <div style={{ width: 79 }}>
                            <span title={count}>
                                {count}
                            </span>
                        </div>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '净重(kg)',
                dataIndex: 'totalNetWeight',
                key: 'totalNetWeight',
                width: 100,
                render: (text, r, index) => {
                    if (r.isStatistics) {
                        return (
                            <div style={{ width: 79 }}>
                                <span className="order-statistics" title={r.totalNetWeight ? r.totalNetWeight : ''}>
                                    {r.totalNetWeight ? r.totalNetWeight : ''}
                                </span>
                            </div>
                        )
                    }
                    let count = null
                    if (r.editData) {
                        count = this.reduceCount(r.editData.sendCarOrderMaterialList, 'netWeight').toFixed(2)
                    }
                    return (
                        <div style={{ width: 79 }}>
                            <span title={count}>
                                {count}
                            </span>
                        </div>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '体积(m³)',
                dataIndex: 'totalVolume',
                key: 'totalVolume',
                width: 100,
                render: (text, r, index) => {
                    if (r.isStatistics) {
                        return (
                            <div style={{ width: 79 }}>
                                <span className="order-statistics" title={r.totalVolume ? r.totalVolume : ''}>
                                    {r.totalVolume ? r.totalVolume : ''}
                                </span>
                            </div>
                        )
                    }
                    let count = null
                    if (r.editData) {
                        count = this.reduceCount(r.editData.sendCarOrderMaterialList, 'volume').toFixed(2)
                    }
                    return (
                        <div style={{ width: 79 }}>
                            <span title={count}>
                                {count}
                            </span>
                        </div>
                    )
                }
            }
        ],
        specialBusiness: [],
        saveLoading: false,
        showFee: true, //是否显示配载费用维护块
        showAmount: true, //是否显示配载量维护块
        reloadExpense: false, //费用项reload
        stowageList: [],
        settlementForce: false, //forceRender
        id: null, //ID
        estimatedCost: 0, //********含税费用********
        afterTaxAmount: 0, //********不含税费用********
        companyId: null,
        createTime: null,
        operatorId: null,
        operatorName: null,
        remark: '',
        status: null,
        stowageNumber: null,
        trailerCarCode: null,
        carType: 1, //承运商车辆 1 现金车 2
        carTypeId: null, //车辆类型ID
        carTypeName: null, //车型名称
        carrierId: null, //承运商id
        carrierName: null, //承运商名
        departureTime: null, //发车时间
        carCode: null, //车牌号
        carId: null, //车辆id
        isHighway: 1, //是否高速（0-否 1-是）
        driverId: null, //司机id
        driverName: null, //司机名字
        phone: null, //手机号码
        phoneBackup: null, //电话号码
        billingMethod: 1, //结算方式(1-合同价 2-现金价)
        quotationNumber: null, //报价单号
        quotationNumberId: null, //报价单号id
        quotationType: null, //报价类型
        currencyId: null, //币别id
        currencyName: null, //币别名称
        taxes: 0, //发票税
        withholdingTax: 0, //补扣税
        isTextsIncluded: null, //是否含税
        departure: null, //起运地
        destination: null, //目的地
        transitPlaceOneId: null, //中转地1 id
        transitPlaceOneName: null, //中转地1名
        transitPlaceTwoId: null,
        transitPlaceTwoName: null,
        transportationMethodId: null,
        transportationMethodName: null,
        sendCarCashPriceExpenseList: [], //现金价数据
        expenseItemList: [], //费用项数据列表
        selectExpenseItemList: [], //选中的费用项
        expenseCashPriceList: [], //
        totalBoardCount: 0,
        totalBoxCount: 0,
        totalGrossWeight: 0,
        totalNetWeight: 0,
        totalQuantity: 0,
        totalVolume: 0,
        sendCarOrderList: [],
        senderList: [],
        receiverList: [],
        selectQuotation: {}, // 选中的报价路线
    }

    constructor(props) {
        super(props)
        const { mobxTabsData, mykey } = props
        this.state.pageData = cloneObject(mobxTabsData.getPageData(mykey))
        const { pageData } = this.state
        mobxTabsData.setTitle(mykey, pageData && pageData.openType === 'entry' ? `配载数据录入-${pageData.stowageNumber}` : pageData && pageData.openType === 'see' ? `配载数据查看-${pageData.stowageNumber}` : `配载数据录入`)
        this.state.openType = pageData.openType
    }

    componentDidMount() {
        const { pageData } = this.state
        this.initData(pageData)
    }

    /* 页面数据初始化 */
    initData (d) {
        // console.log('pageData', d)
        let {
            carType,
            carTypeId,
            carTypeName,
            carrierId,
            carrierName,
            departureTime,
            carCode,
            carId,
            driverId,
            driverName,
            phone,
            phoneBackup,
            isHighway,
            billingMethod,
            quotationNumber,
            quotationNumberId,
            quotationType,
            currencyId,
            currencyName,
            taxes, //发票税
            withholdingTax, //补扣税
            isTextsIncluded, //是否含税
            departure,
            destination,
            transitPlaceOneId,
            transitPlaceOneName,
            transitPlaceTwoId,
            transitPlaceTwoName,
            transportationMethodId,
            transportationMethodName,
            sendCarCashPriceExpenseList,
            expenseItemList,
            expenseCashPriceList,
            totalBoardCount,
            totalBoxCount,
            totalGrossWeight,
            totalNetWeight,
            totalQuantity,
            totalVolume,
            sendCarOrderList,
            senderList,
            receiverList,
            companyId,
            createTime,
            estimatedCost,
            afterTaxAmount,
            id,
            operatorId,
            operatorName,
            remark,
            status,
            stowageNumber,
            trailerCarCode,
            selectQuotation
        } = d
        let selectExpenseItemList = [...d.selectExpenseItemList, ...d.expenseCashPriceList]
        this.dealSpecialData(d.carrierList && d.carrierList.length ? d.carrierList : [])
        let stowageList = [...sendCarOrderList]
        stowageList = stowageList.map(item => {
            item.editData = cloneObject(item)
            return item
        })
        // console.log(stowageList)
        this.setState({
            carType,
            carTypeId,
            carTypeName,
            carrierId,
            carrierName,
            departureTime,
            carCode,
            carId,
            driverId,
            driverName,
            phone,
            phoneBackup,
            isHighway,
            billingMethod,
            quotationNumber,
            quotationNumberId,
            quotationType,
            currencyId,
            currencyName,
            taxes: taxes ? taxes : 0, //税率
            withholdingTax: withholdingTax ? withholdingTax : 0, //补扣税
            isTextsIncluded, //是否含税
            departure,
            destination,
            transitPlaceOneId,
            transitPlaceOneName,
            transitPlaceTwoId,
            transitPlaceTwoName,
            transportationMethodId,
            transportationMethodName,
            sendCarCashPriceExpenseList,
            expenseItemList,
            selectExpenseItemList,
            expenseCashPriceList,
            totalBoardCount,
            totalBoxCount,
            totalGrossWeight,
            totalNetWeight,
            totalQuantity,
            totalVolume,
            sendCarOrderList,
            stowageList,
            senderList,
            receiverList,
            companyId,
            createTime,
            estimatedCost,
            afterTaxAmount,
            id,
            operatorId,
            operatorName,
            remark,
            status,
            stowageNumber,
            trailerCarCode,
            selectQuotation
        }, () => {
            //console.log('xxxx---', this.state.taxes, this.state.withholdingTax)
            this.setState({loading: false})
            this.searchCriteria()
        })
    }

    /* 特殊业务数据处理 */
    async dealSpecialData (list) {
        const {mobxDataBook} = this.props
        mobxDataBook.initData('特殊业务')
            .then(res => {
                return [...res]
            })
            .catch(err => {
                return []
            })
            .then(arr => {
                let specialBusiness = list.filter(item => arr.some(k => k.id === item.specialBusinessId)).map((item, index) => {
                    item.key = item.specialBusinessId || index
                    item.title = item.specialBusinessName || '-'
                    item.tabTitle = item.specialBusinessName || '-'
                    item.selectExpenseItemList = [...item.selectExpenseItemList, ...item.expenseCashPriceList]
                    item.data = {
                        ...item
                    }
                    return item
                })
                this.setState({ specialBusiness })
            })
    }

    /* 修改特殊业务数据 */
    changeSpecialBusinessData = (index, target, callback) => {
        let { specialBusiness } = this.state
        specialBusiness[index].data = { ...specialBusiness[index].data, ...target }
        this.setState({ specialBusiness }, () => {
            if (callback) {
                callback()
            }
        })
    }

    /* 获取表格数据 */
    getData = () => {
        let {stowageList} = this.state
        // console.log('sss', stowageList)
        return new Promise((resolve, reject) => {
            resolve({
                dataSource: this.addStatistics(stowageList),
                total: stowageList.length || 0
            })
        })
    }

    reduceCount(list, key) {
        if (list && list.length < 1) {
            return 0
        }
        return list.reduce(function (pre, cur) {
            let preCount = typeof pre[key] === 'number' ? pre[key] : 0
            let curCount = typeof cur[key] === 'number' ? cur[key] : 0
            return {
                [key]: preCount + curCount
            }
        })[key]
    }

    reduceStowageList = (list, key) => {
        let array = list.filter(item => {
            if (item.editData) {
                return true
            } else {
                return false
            }
        })
        array = array.map(item => item.editData)
        if (array.length > 0) {
            let count = 0
            array.forEach(item => {
                count += this.reduceCount(item.sendCarOrderMaterialList, key)
            })
            return count
        } else {
            return 0
        }
    }

    addStatistics = (list) => {
        if (list.length > 0) {
            this.setState({
                totalBoardCount: this.reduceStowageList(list, 'boardCount'),
                totalBoxCount: this.reduceStowageList(list, 'boxCount'),
                totalGrossWeight: this.reduceStowageList(list, 'grossWeight'),
                totalNetWeight: this.reduceStowageList(list, 'netWeight'),
                totalVolume: this.reduceStowageList(list, 'volume'),
                totalQuantity: this.reduceStowageList(list, 'quantity')
            })
            return [...list, {
                id: 'isStatistics',
                isStatistics: true,
                orderNumber: '总计',
                itemSpecifications: '',
                totalQuantity: this.reduceStowageList(list, 'quantity'), // 数量 
                totalBoxCount: this.reduceStowageList(list, 'boxCount'), // 箱数
                totalBoardCount: this.reduceStowageList(list, 'boardCount'), // 板数
                totalGrossWeight: this.reduceStowageList(list, 'grossWeight'), // 毛重
                totalNetWeight: this.reduceStowageList(list, 'netWeight'), // 净重
                totalVolume: this.reduceStowageList(list, 'volume') // 体积
            }]
        } else {
            return []
        }
    }

    /* 根据费用单位ID获取对应的计算方式 */
    getMethodByUnitId = async (unitData, list) => {
        const { rApi } = this.props
        const {
            totalQuantity,
            totalBoxCount,
            totalBoardCount,
            totalGrossWeight,
            totalVolume
        } = this.state
        let rt = await rApi.getMethodByUnitId(unitData)
            .catch(e => {
                console.log(e)
            })
        return list.map((item, index) => {
            item.orderExpenseItemUnitCoefficientList = expenseItemsToArray(item)
            item.status = 1
            item.orderExpenseItemUnitCoefficientList.forEach(unit => {
                if (rt[index].isQuantityCount) {
                    unit.costUnitValue = parseFloat(totalQuantity)
                } else if (rt[index].isBoxCount) {
                    unit.costUnitValue = parseFloat(totalBoxCount)
                } else if (rt[index].isBoard) {
                    unit.costUnitValue = parseFloat(totalBoardCount)
                } else if (rt[index].isGrossWeight || rt[index].isNetWeight) {
                    unit.costUnitValue = parseFloat(totalGrossWeight)
                } else if (rt[index].isVolumeReceipt) {
                    unit.costUnitValue = parseFloat(totalVolume)
                }
            })
            return item
        })
    }

    /* 中转地值 */
    getTransitPlaceData = (val, { type, index }) => {
        if (type === 'sendcar') {
            this.setState({
                transitPlaceOneId: val.id,
                transitPlaceOneName: val.name
            })
        } else {
            this.changeSpecialBusinessData(index, {
                transitPlaceOneId: val.id || null,
                transitPlaceOneName: val.name || null
            })
        }
    }

    clearQuotationData = async () => {
        this.setState({
            settlementForce: true,
            departure: null,
            destination: null,
            expenseItemList: [],
            transitPlaceOneId: null,
            transitPlaceOneName: null
        })
        this.setState({settlementForce: false})
    }

    /* 选择路线 */
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

    /* 路线行选择 */
    selectRow = async (item) => {
        let quotationLineExpenseItems = item.quotationLineExpenseItems || []
        let unitData = []
        quotationLineExpenseItems = cloneObject(quotationLineExpenseItems)
        unitData = quotationLineExpenseItems.map(item => item.costUnitId)
        quotationLineExpenseItems = await this.getMethodByUnitId(unitData, quotationLineExpenseItems)
        if (item.openData.type === 'sendcar') {
            this.setState({
                isHighway: item.isHighway || 1,
                expenseItemList: quotationLineExpenseItems.map(d => {
                    return { ...d, quotationLineExpenseItemId: d.id }
                }),
                departure: item.departure,
                destination: item.destination,
                selectQuotation: item
            })
        } else {
            this.changeSpecialBusinessData(item.openData.index, {
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

    /* 费用项数据更改 */
    onChangeExpenseItemList = (d, { type, index }) => {
        const { itemIndex, unitIndex, value, status, isEdit } = d
        let newResult = type === 'sendcar' ? [...this.state.selectExpenseItemList] : [...this.state.specialBusiness[index].data.selectExpenseItemList]
        if ('status' in d) {
            newResult[itemIndex].status = status
            newResult[itemIndex].isEdit = isEdit
        } else {
            if (newResult[itemIndex].billingMethodName === '实报实销') {
                newResult[itemIndex].costUnitValue = value.costUnitValue
                newResult[itemIndex].currencyId = value.currencyId
                newResult[itemIndex].currencyName = value.currencyName
            } else {
                newResult[itemIndex].orderExpenseItemUnitCoefficientList[unitIndex].costUnitValue = value.costUnitValue
            }
        }
        if (type === 'sendcar') {
            this.setState({
                selectExpenseItemList: newResult
            })
        } else {
            this.changeSpecialBusinessData(index, {
                selectExpenseItemList: newResult
            })
        }
    }

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
            this.changeSpecialBusinessData(index, {
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
            this.changeSpecialBusinessData(index, {
                selectExpenseItemList
            })
        }
    }


    /* 删除费用项 */
    deleteItem = async (value, { type, index }) => {
        let selectExpenseItemList = type === 'sendcar' ? this.state.selectExpenseItemList : this.state.specialBusiness[index].selectExpenseItemList
        let delIndex = value.itemIndex
        let newResult = [...selectExpenseItemList]
        newResult.splice(delIndex, 1)
        if (type === 'sendcar') {
            await this.setState({ reloadExpense: true })
            this.setState({
                selectExpenseItemList: newResult,
                reloadExpense: false
            })
        } else {
            this.changeSpecialBusinessData(index, {
                selectExpenseItemList: newResult,
                forceQuotationNumber: true
            }, () => {
                this.changeSpecialBusinessData(index, {
                    forceQuotationNumber: false
                })
            })
        }
    }

    /* 打开编辑配载量 */
    toGoodsDetailsPage = (record, index, openType) => {
        // console.log('toGoodsDetailsPage货物明细', record, index)
        this.details.show({
            data: record,
            index,
            openType: openType === 'entry' ? 1 : openType === 'see' ? 2 : 1
        })
    }

    /* 更新配载量数据 */
    onChangeMateriel = async (index, target) => {
        let { stowageList } = this.state
        stowageList[index] = target
        await this.setState({ stowageList })
        this.searchCriteria()
    }

    /* 跳到配载维护列表页面 */
    returnList = () => {
        const { mobxTabsData, mykey } = this.props
        toStowageMaintenanceList(mobxTabsData, {
            pageData: {}
        })
        mobxTabsData.closeTab(mykey)
    }

    /* 自定义表格操作 */
    actionView = ({ text, record, index }) => {
        const { openType } = this.state
        //console.log('stowageTableAction')
        if (record.isStatistics) {
            return <span>总计</span>
        }
        return (
            <span
                className={`action-button`}
                onClick={() => this.toGoodsDetailsPage(record, index, openType)}
            >
                {
                    openType === 'entry' ?
                    '编辑' :
                    openType === 'see' ?
                    '货物明细' : '-'
                }
            </span>
        )
    }

    /* 保存 */
    handleSave = async () => {
        const {rApi} = this.props
        let {
            specialBusiness,
            billingMethod,
            carCode,
            carId,
            carType,
            carTypeId,
            carTypeName,
            carrierId,
            carrierName,
            companyId,
            createTime,
            currencyId,
            currencyName,
            taxes, //税率
            withholdingTax,
            isTextsIncluded, //是否含税
            departure,
            departureTime,
            destination,
            driverId,
            driverName,
            estimatedCost,
            afterTaxAmount,
            selectExpenseItemList,
            expenseItemList,
            id,
            isHighway,
            operatorId,
            operatorName,
            phone,
            phoneBackup,
            quotationNumber,
            quotationNumberId,
            quotationType,
            receiverList,
            remark,
            sendCarCashPriceExpenseList,
            senderList,
            status,
            stowageNumber,
            totalBoardCount,
            totalBoxCount,
            totalGrossWeight,
            totalNetWeight,
            totalQuantity,
            totalVolume,
            trailerCarCode,
            transitPlaceOneId,
            transitPlaceOneName,
            transitPlaceTwoId,
            transitPlaceTwoName,
            transportationMethodId,
            transportationMethodName,
            stowageList,
            selectQuotation
        } = this.state
        /**费用项**/
        let expenseItemData = selectExpenseItemList && selectExpenseItemList.length > 0 ? selectExpenseItemList.filter(d => (d.costUnitName && d.orderExpenseItemUnitCoefficientList)) : []
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
        let sendCarOrderList = stowageList.map(item => {
            return item.editData
        })
        let carrierList = specialBusiness.map((item, index) => {
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
            item.data.selectExpenseItemList = item.data.selectExpenseItemList.filter(d => (d.costUnitName && d.orderExpenseItemUnitCoefficientList))
                // console.log(item.data)
            if (item.data.billingMethod === 1) {
                item.data.sendCarCashPriceExpenseList = []

                let quotationMoney = item.data.selectExpenseItemList.reduce((rt, cur) => {
                    if(cur.accountingStrategy === 2) {
                        return rt += cur.chargeFee * (1+(item.withholdingTax ? item.withholdingTax/100 : 0))
                    }
                    return rt += cur.chargeFee * (cur.orderExpenseItemUnitCoefficientList[0].costUnitValue || 0) *  (1+(item.withholdingTax ? item.withholdingTax/100 : 0))
                }, 0)
                /* 特殊业务含税预估费用计算 */
                item.data.estimatedCost =  (quotationMoney + item.data.expenseCashPriceList.reduce((rt, cur) => {
                        return rt += (cur.costUnitValue || 0)
                    }, 0)).toFixed(4)

                /* 特殊业务预估不含税费用计算 */
                item.data.afterTaxAmount = (quotationMoney / (1+(item.taxes ? item.taxes/100 : 0)) + item.data.expenseCashPriceList.reduce((rt, cur) => {
                    return rt += (cur.costUnitValue || 0)
                }, 0)).toFixed(4)
            } else {
                quotationNumber = null
                quotationNumberId = null
                item.data.sendCarCashPriceExpenseList = this[`expensecash${index}`] ? this[`expensecash${index}`].logData().data : []
                /* 特殊业务预估费用计算 */
                item.data.estimatedCost = item.data.sendCarCashPriceExpenseList.reduce((rt, cur) => {
                    return rt += cur.expenseValue
                }, 0)

                item.data.afterTaxAmount = item.data.sendCarCashPriceExpenseList.reduce((rt, cur) => {
                    return rt += cur.expenseValue
                }, 0)
                /* 特殊业务预估费用计算 */
            }
            return item.data
        })
        
        /* 派车预估费用计算 */
        if (billingMethod === 1) {/* 合同价 */ withholdingTax
            sendCarCashPriceExpenseList = []

            //费用项总应付
            let quotationMoney = expenseItemData.reduce((rt, cur) => {
                if(cur.accountingStrategy === 2) {
                    return rt += cur.chargeFee * (1+(withholdingTax ? withholdingTax/100 : 0))
                }
                return rt += cur.chargeFee * (cur.orderExpenseItemUnitCoefficientList[0].costUnitValue || 0) * (1+(withholdingTax ? withholdingTax/100 : 0))
            }, 0)

            //合同价含税金额
            estimatedCost =  quotationMoney + expensePriceData.reduce((rt, cur) => {
                return rt += (cur.costUnitValue || 0)
            }, 0)

            //合同价未税金额
            afterTaxAmount = quotationMoney / (1+(taxes ? taxes/100 : 0)) + expensePriceData.reduce((rt, cur) => {
                return rt += (cur.costUnitValue || 0)
            }, 0)
        } else if (billingMethod === 2) {/* 现金价 */
            quotationNumber = null
            quotationNumberId = null
            sendCarCashPriceExpenseList = this.expensecash.logData().data
            estimatedCost = sendCarCashPriceExpenseList.reduce((rt, cur) => {
                return rt += cur.expenseValue
            }, 0)
            afterTaxAmount= sendCarCashPriceExpenseList.reduce((rt, cur) => {
                return rt += cur.expenseValue
            }, 0)

        } else {}
        /* 派车预估费用计算 */
        /* 请求参数 */
        let reqData = {
            billingMethod,
            carCode,
            carId,
            carType,
            carTypeId,
            carTypeName,
            carrierId,
            carrierName,
            companyId,
            createTime,
            currencyId,
            currencyName,
            taxes: taxes || 0, //税率
            withholdingTax: withholdingTax || 0,
            isTextsIncluded, //是否含税
            departure,
            departureTime,
            destination,
            driverId,
            driverName,
            estimatedCost: estimatedCost ? estimatedCost.toFixed(4) : 0,
            afterTaxAmount: afterTaxAmount ? afterTaxAmount.toFixed(4) : 0,
            selectExpenseItemList: expenseItemData,
            expenseCashPriceList: expensePriceData,
            expenseItemList,
            id,
            isHighway,
            operatorId,
            operatorName,
            phone,
            phoneBackup,
            quotationNumber,
            quotationNumberId,
            quotationType,
            receiverList,
            remark,
            sendCarCashPriceExpenseList,
            sendCarOrderList,
            senderList,
            status,
            stowageNumber,
            totalBoardCount,
            totalBoxCount,
            totalGrossWeight,
            totalNetWeight,
            totalQuantity,
            totalVolume,
            trailerCarCode,
            transitPlaceOneId,
            transitPlaceOneName,
            transitPlaceTwoId,
            transitPlaceTwoName,
            transportationMethodId,
            transportationMethodName,
            carrierList,
            selectQuotation
        }
        /* 请求参数 */
        await this.setState({ saveLoading: true })
        rApi.stowageMaintainEdit(reqData)
            .then(res => {
                const { originView } = this.state.pageData
                if (originView.onChangeValue) {
                    originView.onChangeValue()
                }
                message.success('操作成功！')
                this.setState({ saveLoading: false })
                this.returnList()
            })
            .catch(err => {
                message.error(err.msg || '操作失败')
                this.setState({ saveLoading: false })
            })
    }

    render() {
        let { minHeight } = this.props
        const {
            openType,
            loading,
            saveLoading,
            specialBusiness,
            showFee,
            showAmount,
            settlementForce,
            billingMethod,
            carType,
            quotationNumber,
            quotationNumberId,
            carrierId,
            carrierName,
            departureTime,
            carCode,
            driverName,
            phone,
            isHighway,
            currencyId,
            currencyName,
            taxes, //税率
            withholdingTax,
            isTextsIncluded, //是否含税
            departure,
            destination,
            transitPlaceOneName,
            sendCarCashPriceExpenseList,
            expenseItemList,
            selectExpenseItemList,
            reloadExpense,
            columns,
            stowageList,
            selectQuotation,
            stowageNumber
        } = this.state
        if (loading) {
            return (
                <Spin tip='数据初始化中,请稍后...' className='loading-page'></Spin>
            )
        }
        return(
            <div className='page-stowagemaintenanceedit' style={{minHeight}}>
                <Quotation
                    showMore={this.showMore}
                    selectRow={this.selectRow}
                    getThis={v => this.quotationView = v}
                />
                <AddOrEdit
                    parent={this}
                    getThis={v => this.addoredit = v}
                />
                <GoodsDetails
                    onChangeMateriel={this.onChangeMateriel}
                    parent={this}
                    getThis={(v) => this.details = v}
                />
                <div className="headbar">
                    <span style={{fontSize: '14px'}}>{stowageNumber ? `配载维护(${stowageNumber})` : '配载维护'}</span>
                    {
                        openType === 'entry' &&
                        <FunctionPower power={power.SAVE_DATA}>
                            <Button
                                className="btn-padding-30"
                                onClick={this.handleSave}
                                loading={saveLoading}
                                style={{ color: '#fff', background: 'rgb(24, 181, 131)', border: 0 }}
                            >
                                保存
                            </Button>
                        </FunctionPower>
                    }
                </div>
                <div className="container-box">
                    <div className="base-wrapper">
                        <div className="titlebar">
                            <span>业务费用维护</span>
                            <Switch
                                checkedChildren="开"
                                unCheckedChildren="关"
                                checked={showFee}
                                onChange={showFee => this.setState({showFee})}
                            />
                        </div>
                        {
                            showFee &&
                            <Tabs
                                type="card"
                                style={{ marginTop: 10 }}
                            >
                                <TabPane
                                    tab="派车"
                                    key="sendcar"
                                >
                                    {/* <div style={{ display: 'flex', margin: '0px 22px 0', height: '36px', alignItems: 'center', fontSize: '14px', fontWeight: 600 }}>
                                        <span>派车相关</span>
                                    </div> */}
                                    <Row gutter={24} style={{ margin: '0 22px' }}>
                                        <Col label='车辆类型&emsp;&emsp;' colon span={7}>
                                            {carType === 1 ? '承运商车辆' : carType === 2 ? '现金车' : '-'}
                                        </Col>
                                        {
                                            carType === 1 &&
                                            <Col label='&emsp;承运商&emsp;&emsp;' colon span={7}>
                                                {carrierName}
                                            </Col> 
                                        }
                                        <Col label='发车时间&emsp;&emsp;' colon span={7}>
                                            {departureTime ? moment(departureTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
                                        </Col>
                                    </Row>
                                    <Row gutter={24} style={{ margin: '0 22px' }}>
                                        <Col label='选择车辆&emsp;&emsp;' colon span={7}>
                                            {carCode}
                                        </Col>
                                        <Col label='司机姓名&emsp;&emsp;' colon span={7}>
                                            {driverName}
                                        </Col>
                                        <Col label='司机手机&emsp;&emsp;' colon span={7}>
                                            {phone}
                                        </Col>
                                    </Row>
                                    <Row gutter={24} style={{ margin: '0 22px' }}>
                                        <Col label='高速要求&emsp;&emsp;' colon span={20}>
                                            {isHighway ? '是' : '否'}
                                        </Col>
                                    </Row>
                                    <div style={{ display: 'flex', margin: '0px 22px 0', alignItems: 'center', fontSize: '14px', fontWeight: 600, borderBottom: '1px solid #ddd' }}>
                                        {/* <span>结算费用维护</span> */}
                                    </div>
                                    <Row gutter={24} style={{ margin: '10px 22px' }}>
                                        <Col label="结算方式&emsp;&emsp;" colon span={7}>
                                            <div className="flex flex-vertical-center">
                                                {
                                                    openType === 'entry' ?
                                                    <RadioGroup
                                                        value={billingMethod ? billingMethod : 1}
                                                        defaultValue={billingMethod ? billingMethod : 1}
                                                        onChange={e => {
                                                            this.setState({
                                                                billingMethod: e ? e.target.value : null
                                                            })
                                                        }}
                                                    >
                                                        {
                                                            carType === 1 &&
                                                            <Radio value={1}>合同价</Radio>
                                                        }
                                                        <Radio value={2}>现金价</Radio>
                                                    </RadioGroup>
                                                    :
                                                    openType === 'see' ?
                                                    <span>{billingMethod === 1 ? '合同价' : '现金价'}</span>
                                                    : null
                                                }
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row gutter={24} style={{ margin: '10px 22px' }}>
                                        {
                                            billingMethod === 1 && carType === 1 ?
                                                <Col label='报价单号&emsp;&emsp;' colon span={7}>
                                                    <div className="flex flex-vertical-center">
                                                        <div style={{ width: 150, marginRight: '20px' }}>
                                                            {
                                                                openType === 'entry' ?
                                                                <RemoteSelect
                                                                    forceRender={settlementForce}
                                                                    defaultValue={
                                                                        quotationNumberId ?
                                                                            {
                                                                                id: quotationNumberId,
                                                                                quotationNumber: quotationNumber
                                                                            }
                                                                            :
                                                                            null
                                                                    }
                                                                    disabled={carrierId ? false : true}
                                                                    onChangeValue={(value = {}) => {
                                                                        let taxesVul = value && value.origin_data && value.origin_data.length ? value.origin_data[0].taxes || 0 : 0
                                                                        let withholdingTaxVul = value && value.origin_data && value.origin_data.length ? value.origin_data[0].withholdingTax || 0 : 0
                                                                        //console.log('value.origin_data', value.origin_data)
                                                                        this.setState({
                                                                            quotationNumberId: value.id ? value.id : null,
                                                                            quotationNumber: value.title || value.quotationNumber || null,
                                                                            taxes: taxesVul ? taxesVul : taxes,
                                                                            withholdingTax: withholdingTaxVul ? withholdingTaxVul : withholdingTax
                                                                        }, () => {
                                                                            let id = value ? value.id : null
                                                                            if (id !== quotationNumberId) {
                                                                                this.clearQuotationData()
                                                                            }
                                                                        })
                                                                    }}
                                                                    labelField={'quotationNumber'}
                                                                    getDataMethod={'getOfferCarrier'}
                                                                    params={{ limit: 99999, offset: 0, carrierId: carrierId, reviewStatus: 2 }}

                                                                />
                                                                : 
                                                                openType === 'see' ?
                                                                <span>{quotationNumber || '-'}</span>
                                                                : null
                                                            }
                                                        </div>
                                                    </div>
                                                </Col>
                                                :
                                                <Col label="币&emsp;&emsp;种&emsp;&emsp;" colon span={4}>
                                                    <div className="flex flex-vertical-center">
                                                        {
                                                            openType === 'entry' ?
                                                            <RemoteSelect
                                                                text='币别'
                                                                defaultValue={
                                                                    currencyId ? {
                                                                        id: currencyId,
                                                                        title: currencyName
                                                                    } : null
                                                                }
                                                                onChangeValue={(value = {}) => {
                                                                    this.setState({
                                                                        currencyId: value.id ? value.id : null,
                                                                        currencyName: value.title ? value.title : null
                                                                    })
                                                                }}
                                                            />
                                                            : 
                                                            openType === 'see' ?
                                                            <span>{currencyName || '-'}</span>
                                                            : null
                                                        }
                                                    </div>
                                                </Col>
                                        }
                                    </Row>
                                    {
                                        billingMethod === 1 &&
                                        <Fragment>
                                            <Row gutter={24} style={{ margin: '10px 22px' }}>
                                                <Col label='选择路线&emsp;&emsp;' colon labelInTop>
                                                    <Button
                                                        icon='environment'
                                                        disabled={openType === 'entry' ? false : openType === 'see' ? true : quotationNumberId ? false : true}
                                                        onClick={e => this.selectRoute({
                                                            type: 'sendcar',
                                                            index: 0
                                                        })}
                                                    >
                                                        选择报价路线
                                                    </Button>
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
                                            {/* <Row gutter={24} style={{ margin: '0px 22px' }}>
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
                                            </Row> */}
                                        </Fragment>
                                    }
                                    {
                                        billingMethod === 1 ?
                                            <div style={{ margin: '10px 22px' }}>
                                                {
                                                    reloadExpense ?
                                                        null
                                                        :
                                                        <div style={{ display: 'flex' }}>
                                                            <span style={{ marginRight: 10 }}>费用项列表  </span>
                                                            <ExpenseItem
                                                                onChangeExpenseItemList={d => this.onChangeExpenseItemList(d, {
                                                                    type: 'sendcar',
                                                                    index: null
                                                                })}
                                                                onChangRouter={value => this.onChangRouter(value, {
                                                                    type: 'sendcar',
                                                                    index: null
                                                                })}
                                                                onReimbursementChangeValue={value => this.onReimbursementChangeValue(value, {
                                                                    type: 'sendcar',
                                                                    index: null
                                                                })}
                                                                deleteItem={value => this.deleteItem(value, {
                                                                    type: 'sendcar',
                                                                    index: null
                                                                })}
                                                                route={expenseItemList}
                                                                style={{ width: '80%' }}
                                                                departure={departure}
                                                                destination={destination}
                                                                receivableOrPayable='应付'
                                                                selectRoute={selectExpenseItemList}
                                                                openType={openType === 'entry' ? 1 : openType === 'see' ? 2 : 1}
                                                            />
                                                        </div>
                                                }
                                            </div>
                                            :
                                            <div style={{ margin: '10px 22px', display: 'flex' }}>
                                                <span style={{ marginRight: 10 }}>现金价&emsp;&emsp;</span>
                                                <div style={{ padding: '10px', backgroundColor: '#f7f7f7' }}>
                                                    <ExpenseCash
                                                        data={sendCarCashPriceExpenseList}
                                                        getThis={(v) => this.expensecash = v}
                                                        openType={openType === 'entry' ? 1 : openType === 'see' ? 2 : 1}
                                                    />
                                                </div>
                                            </div>
                                    }
                                </TabPane>
                                {
                                    specialBusiness && specialBusiness.length && specialBusiness.map((item, index) => {
                                        return (
                                            <TabPane
                                                tab={item.tabTitle}
                                                key={item.key}
                                            >
                                                <div style={{ display: 'flex', margin: '10px 22px 0', height: '36px', alignItems: 'center', fontSize: '14px', fontWeight: 600 }}>
                                                    <span>{item.title}</span>
                                                </div>
                                                <Row gutter={24} style={{ height: 32, margin: '0 22px' }}>
                                                    <Col label='&emsp;承运商' span={20}>
                                                        {item.data.carrierName || '-'}
                                                    </Col>
                                                </Row>
                                                <Row gutter={24} style={{ height: 32, margin: '0 22px' }}>
                                                    <Col label='&emsp;联系人' span={20}>
                                                        {item.data.carrierContactName || '-'}
                                                    </Col>
                                                </Row>
                                                <Row gutter={24} style={{ height: 32, margin: '0 22px' }}>
                                                    <Col label='联系电话' span={20}>
                                                        {item.data.carrierContactPhone || '-'}
                                                    </Col>
                                                </Row>
                                                <div style={{ display: 'flex', margin: '0px 22px 0', height: '36px', alignItems: 'center', fontSize: '14px', fontWeight: 600, borderBottom: '1px solid #ddd' }}>
                                                    <span>结算费用维护</span>
                                                </div>
                                                <Row gutter={24} style={{ margin: '10px 22px' }}>
                                                    <Col label="结算方式&emsp;&emsp;" colon span={7}>
                                                        <div className="flex flex-vertical-center">
                                                            {
                                                                openType === 'entry' ?
                                                                    <RadioGroup
                                                                        value={item.data.billingMethod ? item.data.billingMethod : 1}
                                                                        onChange={e => {
                                                                            this.changeSpecialBusinessData(index, {
                                                                                billingMethod: e ? e.target.value : null
                                                                            })
                                                                        }}
                                                                    >
                                                                        <Radio value={1}>合同价</Radio>
                                                                        <Radio value={2}>现金价</Radio>
                                                                    </RadioGroup>
                                                                    :
                                                                openType === 'see' ?
                                                                    <span>{billingMethod === 1 ? '合同价' : '现金价'}</span>
                                                                    :
                                                                    null
                                                            }
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row gutter={24} style={{ margin: '10px 22px' }}>
                                                    {
                                                        item.data.billingMethod === 1 ?
                                                            <Col label='报价单号&emsp;&emsp;' colon span={7}>
                                                                <div className="flex flex-vertical-center">
                                                                    <div style={{ width: 150, marginRight: '20px' }}>
                                                                        {
                                                                            openType === 'entry' ?
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
                                                                                    disabled={item.data.carrierId ? false : true}
                                                                                    onChangeValue={(val = {}) => {
                                                                                        let prevId = item.data.quotationNumberId
                                                                                        let quotationNumberId = val ? val.id : null
                                                                                        let quotationNumber = val.title || val.quotationNumber
                                                                                        let currencyId = val && val.origin_data && val.origin_data.length ? val.origin_data[0].currencyId : item.data.currencyId ? item.data.currencyId : null
                                                                                        let currencyName = val && val.origin_data && val.origin_data.length ? val.origin_data[0].currencyName : item.data.currencyName ? item.data.currencyName : null
                                                                                        let taxes = val && val.origin_data && val.origin_data.length ? val.origin_data[0].taxes || 0 : 0
                                                                                        let withholdingTax = val && val.origin_data && val.origin_data.length ? val.origin_data[0].withholdingTax || 0 : 0
                                                                                        this.changeSpecialBusinessData(index, {
                                                                                            quotationNumber,
                                                                                            quotationNumberId,
                                                                                            currencyId,
                                                                                            currencyName,
                                                                                            taxes,
                                                                                            withholdingTax
                                                                                        }, () => {
                                                                                            if (quotationNumberId !== prevId) {
                                                                                                this.changeSpecialBusinessData(index, {
                                                                                                    departure: null,
                                                                                                    destination: null,
                                                                                                    expenseItemList: [],
                                                                                                    reLoadQuotation: true
                                                                                                }, () => {
                                                                                                    this.changeSpecialBusinessData(index, {
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
                                                                                :
                                                                            openType === 'see' ?
                                                                                <span>{quotationNumber || '-'}</span>
                                                                                :
                                                                                null
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                            :
                                                            <Col label="币&emsp;&emsp;种&emsp;&emsp;" colon span={4}>
                                                                <div className="flex flex-vertical-center">
                                                                    {
                                                                        openType === 'entry' ?
                                                                            <RemoteSelect
                                                                                text='币别'
                                                                                defaultValue={
                                                                                    item.data.currencyId ? {
                                                                                        id: item.data.currencyId,
                                                                                        title: item.data.currencyName
                                                                                    } : null
                                                                                }
                                                                                onChangeValue={(value = {}) => {
                                                                                    this.changeSpecialBusinessData(index, {
                                                                                        currencyId: value.id ? value.id : null,
                                                                                        currencyName: value.title ? value.title : null
                                                                                    })
                                                                                }}
                                                                            />
                                                                            :
                                                                        openType === 'see' ?
                                                                            <span>{currencyName || '-'}</span>
                                                                            :
                                                                            null
                                                                    }
                                                                </div>
                                                            </Col>
                                                    }
                                                </Row>
                                                {
                                                    item.data.billingMethod === 1 &&
                                                    <Fragment>
                                                        <Row gutter={24} style={{ margin: '10px 22px' }}>
                                                            <Col label='选择路线&emsp;&emsp;' colon labelInTop>
                                                                <Button
                                                                    icon='environment'
                                                                    disabled={openType === 'entry' ? false : openType === 'see' ? true : item.data.quotationNumberId ? false : true}
                                                                    onClick={e => this.selectRoute({
                                                                        type: 'spec',
                                                                        index
                                                                    })}
                                                                >
                                                                    选择报价路线
                                                                </Button>
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
                                                        <div style={{ margin: '10px 22px' }}>
                                                            {
                                                                (item.data.forceQuotationNumber || item.data.reLoadQuotation) ?
                                                                    null
                                                                    :
                                                                    <div style={{ display: 'flex' }}>
                                                                        <span style={{ marginRight: 10 }}>费用项列表  </span>
                                                                        <ExpenseItem
                                                                            onChangeExpenseItemList={d => this.onChangeExpenseItemList(d, {
                                                                                type: 'spec',
                                                                                index
                                                                            })}
                                                                            onChangRouter={value => this.onChangRouter(value, {
                                                                                type: 'spec',
                                                                                index
                                                                            })}
                                                                            onReimbursementChangeValue={value => this.onReimbursementChangeValue(value, {
                                                                                type: 'spec',
                                                                                index
                                                                            })}
                                                                            deleteItem={value => this.deleteItem(value, {
                                                                                type: 'spec',
                                                                                index
                                                                            })}
                                                                            route={item.data.expenseItemList}
                                                                            style={{ width: '80%' }}
                                                                            departure={item.data.departure}
                                                                            destination={item.data.destination}
                                                                            receivableOrPayable='应付'
                                                                            selectRoute={item.data.selectExpenseItemList}
                                                                            openType={openType === 'entry' ? 1 : openType === 'see' ? 2 : 1}
                                                                        />
                                                                    </div>
                                                            }
                                                        </div>
                                                        :
                                                        <div style={{ margin: '10px 22px', padding: '10px', backgroundColor: '#f7f7f7' }}>
                                                            <ExpenseCash
                                                                data={item.data.sendCarCashPriceExpenseList}
                                                                getThis={(v) => this[`expensecash${index}`] = v}
                                                                openType={openType === 'entry' ? 1 : openType === 'see' ? 2 : 1}
                                                            />
                                                        </div>
                                                }
                                            </TabPane>
                                        )
                                    })
                                }
                            </Tabs>
                        }
                    </div>
                    <div style={{background: '#eee', marginTop: '3px', height: 10}}></div>
                    <div className="base-wrapper">
                        <div className="titlebar">
                            <span>配载量维护</span>
                            <Switch
                                checkedChildren="开"
                                unCheckedChildren="关"
                                checked={showAmount}
                                onChange={showAmount => this.setState({ showAmount })}
                            />
                        </div>
                        {
                            showAmount &&
                            <Table
                                style={{padding: '0 22px'}}
                                isHideHeaderButton
                                isNoneSelected
                                isNoneNum
                                actionView={this.actionView}
                                selectedPropsRowKeys={stowageList}
                                title={null}
                                actionWidth={100}
                                parent={this}
                                getData={this.getData}
                                columns={columns}
                                //scroll={{ x: 2000, y: minH}}
                                // tableHeight={minH}
                            >
                            </Table>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default StowageMaintenanceEdit