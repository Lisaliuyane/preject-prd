import React, { Component } from 'react'
import { Tabs, Form, Button, message } from 'antd'
import { inject, observer } from "mobx-react"
import { cloneObject } from '@src/utils'
import StowageDetails from './StowageDetails.jsx'
import ReceiverAndSender from './ReceiverAndSender.jsx'
import OrderDetails from './OrderDetails.jsx'
import { children, id } from './power_hide'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import './index.less'

const {TabPane} = Tabs
const power = Object.assign({}, children, id)

/* 
    配载管理编辑 
*/
@inject('rApi', 'mobxTabsData', 'mobxDataBook')
@observer
class AllocateEdit extends Component {
    state = {
        id: null,
        pageData: null, //配载管理传入行数据
        openType: 1,
        tabData: [
            {
                key: 'stowageDetails',
                title: '配载明细',
                data: {
                    sendcarData: {
                        carType: 1, //承运商车辆 1 现金车 2
                        carTypeId: null, //车辆类型ID
                        carTypeName: null, //车型名称
                        carrierId: null, //承运商id
                        carrierName: null, //承运商名
                        departureTime: null, //发车时间
                        fileterProjectId: [], //项目id数组
                        carCode: null, //车牌号
                        carId: null, //车辆id
                        isHighway: 0, //是否高速（0-否 1-是）
                        driverId: null, //司机id
                        driverName: null, //司机名字
                        phone: null, //手机号码
                        phoneBackup: null, //电话号码
                        sendcarForce: false, //forceRender
                        reloadExpense: false, //费用项reload
                        showMorephone: false,
                        morePhone: null,
                        curCar: null,
                        curDriver: null
                    },
                    activeTab: 'sendcar',
                    companyId: null, //企业ID
                    settlementForce: false, //forceRender
                    billingMethod: 1, //结算方式(1-合同价 2-现金价)
                    quotationNumber: null, //报价单号
                    quotationNumberId: null, //报价单号id
                    quotationType: null, //报价类型
                    currencyId: null, //币别id
                    currencyName: null, //币别名称 
                    departure: null, //起运地
                    destination: null, //目的地
                    transitPlaceOneId: null, //中转地1 id
                    transitPlaceOneName: null, //中转地1名
                    longitude: null, //经度
                    latitude: null, //纬度
                    transitPlaceTwoId: null,
                    transitPlaceTwoName: null,
                    transportationMethodId: null,
                    transportationMethodName: null,
                    sendCarCashPriceExpenseList: [], //现金价数据
                    expenseItemList: [], //费用项数据列表
                    selectExpenseItemList: [], //选中的费用项
                    createTime: null,
                    updateTime: null,
                    expenseCashPriceList: [], //
                    operatorId: null, //操作人ID
                    operatorName: null, //操作人名称
                    remark: '', //备注
                    status: null, //状态
                    stowageNumber: null, //配载单号
                    trailerCarCode: '',
                    totalBoardCount: 0,
                    totalBoxCount: 0,
                    totalGrossWeight: 0,
                    totalNetWeight: 0,
                    totalQuantity: 0,
                    totalVolume: 0,
                    specialBusiness: [],
                    selectQuotation: {}, // 选中的报价路线
                    taxes: 0, //发票税
                    withholdingTax: 0 //补扣税
                }
            },
            {
                key: 'receiverAndSender',
                title: '收发货方关联',
                data: {
                    senderList: [], //发货方列表数据
                    receiverList: [], //收货方列表数据
                    isShowTransfer: false, //是否中转
                    transitType: 1, //中转类型
                }
            },
            {
                key: 'orderDetails',
                title: '订单明细',
                data: {
                    sendCarOrderList: [], //配载订单列表数据
                }
            }
        ],
        buttonLoading: false, //提交按钮载入
        saveLoading: false, //保存按钮载入
    }

    constructor(props) {
        super(props)
        const { mobxTabsData, mykey } = props
        this.state.pageData = cloneObject(mobxTabsData.getPageData(mykey))
        const {pageData} = this.state
        mobxTabsData.setTitle(mykey, pageData && pageData.openType === 1 ? `配载编辑-${pageData.stowageNumber}` : pageData && pageData.openType === 2 ? `配载查看-${pageData.stowageNumber}` : `配载查看`)
        // console.log('页面数据：', pageData)
        this.initState(pageData)
    }

    /* 初始化页面数据 */
    initState (d) {
    //    console.log('页面数据-------------：', d)
        this.state.id = d.id
        this.state.openType = d.openType
        /* 派车数据 */
        this.state.tabData[0].data.sendcarData = {
            ...this.state.tabData[0].data.sendcarData,
            carType: d.carType,
            carTypeId: d.carTypeId,
            carTypeName: d.carTypeName,
            carrierId: d.carrierId, //承运商id
            carrierName: d.carrierName, //承运商名
            departureTime: d.departureTime, //发车时间
            fileterProjectId: d.sendCarOrderList ? d.sendCarOrderList.map(item => item.projectId || -1) : [], //项目id数组
            carCode: d.carCode, //车牌号
            carId: d.carId, //车辆id
            isHighway: d.isHighway, //是否高速（0-否 1-是）
            driverId: d.driverId, //司机id
            driverName: d.driverName, //司机名字
            phone: d.phone, //手机号码
            phoneBackup: d.phoneBackup, //电话号码
            showMorephone: d.phoneBackup ? true : false,
            curDriver: { id: 'init' }
        }
        // console.log('initState', this.state.tabData[0].data.sendcarData)
        /* 结算明细数据 */
        this.state.tabData[0].data = {
            ...this.state.tabData[0].data,
            companyId: d.companyId,
            billingMethod: d.billingMethod, //结算方式(1-合同价 2-现金价)
            quotationNumber: d.quotationNumber, //报价单号
            quotationNumberId: d.quotationNumberId, //报价单号id
            quotationType: d.quotationType, //报价类型
            currencyId: d.currencyId, //币别id
            currencyName: d.currencyName, //币别名称 
            departure: d.departure, //起运地
            destination: d.destination, //目的地
            transitPlaceOneId: d.transitPlaceOneId, //中转地1 id
            transitPlaceOneName: d.transitPlaceOneName, //中转地1名
            longitude: d.longitude, //经度
            latitude: d.longitude, //纬度
            transitPlaceTwoId: d.transitPlaceTwoId,
            transitPlaceTwoName: d.transitPlaceTwoName,
            transportationMethodId: d.transportationMethodId,
            transportationMethodName: d.transportationMethodName,
            sendCarCashPriceExpenseList: d.sendCarCashPriceExpenseList || [], //现金价数据
            expenseItemList: d.expenseItemList || [], //费用项数据列表
            selectExpenseItemList: [...d.selectExpenseItemList, ...d.expenseCashPriceList] || [], //选中的费用项
            createTime: d.createTime,
            updateTime: d.updateTime,
            expenseCashPriceList: d.expenseCashPriceList || [],
            operatorId: d.operatorId,
            operatorName: d.operatorName,
            remark: d.remark,
            status: d.status,
            stowageNumber: d.stowageNumber,
            trailerCarCode: d.trailerCarCode,
            totalBoardCount: d.totalBoardCount,
            totalBoxCount: d.totalBoxCount,
            totalGrossWeight: d.totalGrossWeight,
            totalNetWeight: d.totalNetWeight,
            totalQuantity: d.totalQuantity,
            totalVolume: d.totalVolume,
            selectQuotation: d.selectQuotation,
            taxes: d.taxes ? d.taxes : 0, //发票税
            withholdingTax: d.withholdingTax ? d.withholdingTax : 0 //补扣税
        }
        /* 特殊业务数据 */
        this.dealSpecialData(d.carrierList && d.carrierList.length ? d.carrierList : [])
        /* 收发货方关联数据 */
        this.state.tabData[1].data = {
            ...this.state.tabData[1].data,
            senderList: d.senderList.map(item => {
                let transitType = d.sendCarOrderList.find(order => order.orderId === item.orderId).transitType || 1
                item.transitType = transitType
                item.departure = d.departure
                return item
            }) || [], //发货方列表数据
            receiverList: d.receiverList.map(item => {
                let transitType = d.sendCarOrderList.find(order => order.orderId === item.orderId).transitType || 1
                item.transitType = transitType
                item.destination = d.destination
                return item
            }) || [], //收货方列表数据
            isShowTransfer: d.transitPlaceOneId ? true : false, //是否中转
        }
        /* 订单明细数据 */
        this.state.tabData[2].data = {
            ...this.state.tabData[2].data,
            sendCarOrderList: d.sendCarOrderList || [],
        }
    }

    /* 特殊业务数据处理 */
    async dealSpecialData(list) {
        const { mobxDataBook } = this.props
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
                this.changeSettlementData('specialBusiness', specialBusiness)
            })
    }

    /* 删除承运商数据 => 清除相关联动数据 */
    clearCarrierData = async (target) => {
        let { tabData } = this.state
        if (target === 'carrier') {
            tabData[0].data.sendcarData.carCode = null
            tabData[0].data.settlementForce = true
        }
        tabData[0].data.sendcarData.sendcarForce = true
        tabData[0].data.sendcarData.driverId = null
        tabData[0].data.sendcarData.phone = null
        tabData[0].data.sendcarData.phoneBackup = null
        tabData[0].data.quotationNumberId = null
        tabData[0].data.expenseItemList = []
        tabData[0].data.departure = null
        tabData[0].data.destination = null
        tabData[0].data.transitPlaceOneId = null
        tabData[0].data.transitPlaceOneName = null
        tabData[0].data.longitude = null //经度
        tabData[0].data.latitude = null //纬度
        await this.setState({tabData})
        tabData[0].data.sendcarData.sendcarForce = false
        tabData[0].data.settlementForce = false
        await this.setState({ tabData })
    }

    /* 删除报价路线数据 => 清除相关联动数据 */
    clearQuotationData = async () => {
        let {tabData} = this.state
        tabData[0].data.settlementForce = true
        tabData[0].data.departure = null
        tabData[0].data.destination = null
        tabData[0].data.expenseItemList = []
        tabData[0].data.transitPlaceOneId = null
        tabData[0].data.transitPlaceOneName = null
        tabData[0].data.longitude = null //经度
        tabData[0].data.latitude = null //
        await this.setState({ tabData })
        tabData[0].data.settlementForce = false
        this.setState({tabData})
    }

    /* 修改sendcardata派车数据 */
    changeSendcarData = async (key, val) => {
        let {tabData} = this.state
        tabData[0].data.sendcarData[key] = val
        await this.setState({tabData})
    }

    /* 修改结算明细数据 */
    changeSettlementData = async (key, val) => {
        let {tabData} = this.state
        tabData[0].data[key] = val
        await this.setState({tabData})
    }

    /* 修改特殊业务数据 */
    changeSpecialBusinessData = (index, target, callback) => {
        let {tabData} = this.state
        tabData[0].data.specialBusiness[index].data = { ...tabData[0].data.specialBusiness[index].data, ...target }
        this.setState({ tabData }, () => {
            if (callback) {
                callback()
            }
        })
    }

    /* 修改收发货方数据 */
    changeSendReceiveData = (key, val) => {
        let {tabData} = this.state
        tabData[1].data[key] = val
        this.setState({tabData})
    }

    /* 修改订单明细数据 */
    changeOrderDetailsData = (key, val) => {
        let { tabData } = this.state
        tabData[2].data[key] = val
        this.setState({ tabData })
    }

    // 验证
    handleValidate = async btnType => {
        const { form } = this.props
        const { carId, driverId, carCode, driverName } = this.state.tabData[0].data.sendcarData
        const methodField = btnType === 'save' ? 'handleSave' : 'handleConfirm'
        form.validateFieldsAndScroll(async (err, vli) => {
            if (!err) {
                if (carId === 'temporaryCar') {
                    let carRes = null,
                        driverRes = null
                    try {
                        carRes = await this.addTemporaryCar(carCode)
                        let carId = carRes.id || -1
                        await this.changeSendcarData('carId', carId)
                        if (driverId === 'temporaryDriver') {
                            driverRes = await this.addTemporaryDriver(driverName)
                            let driverId = driverRes.id || -1
                            await this.changeSendcarData('driverId', driverId)
                        }
                    } catch (err) {
                        message.error(err.msg || '新增临时车辆或司机失败')
                        return
                    }
                } 
                this[methodField]()
            } else {
                message.warning('请检查配载相关信息填写')
            }
        })
    }

    /* 新建临时车辆 */
    async addTemporaryCar(carCode) {
        return await this.props.rApi.addTemporaryCar({ carCode })
    }
    /* 新建临时司机 */
    async addTemporaryDriver(driverName) {
        return await this.props.rApi.addTemporaryDriver({ name: driverName })
    }

    /* 保存 */
    handleSave = async () => {
        const { rApi } = this.props
        let {
            carCode,
            carId,
            carType,
            carTypeId,
            carTypeName,
            carrierId,
            carrierName,
            departureTime,
            driverId,
            driverName,
            isHighway,
            phone,
            phoneBackup
        } = this.state.tabData[0].data.sendcarData
        let {
            billingMethod,
            companyId,
            currencyId,
            currencyName,
            createTime,
            departure,
            destination,
            expenseItemList,
            operatorId,
            operatorName,
            quotationNumber,
            quotationNumberId,
            remark,
            selectExpenseItemList,
            sendCarCashPriceExpenseList,
            status,
            stowageNumber,
            trailerCarCode,
            transitPlaceOneId,
            transitPlaceOneName,
            longitude,
            latitude,
            transitPlaceTwoId,
            transitPlaceTwoName,
            transportationMethodId,
            transportationMethodName,
            updateTime,
            quotationType,
            totalBoardCount,
            totalBoxCount,
            totalGrossWeight,
            totalNetWeight,
            totalQuantity,
            totalVolume,
            selectQuotation,
            specialBusiness,
            taxes, //发票税
            withholdingTax//补扣税
        } = this.state.tabData[0].data
        let {
            receiverList,
            senderList
        } = this.state.tabData[1].data
        let {
            sendCarOrderList,
        } = this.state.tabData[2].data

        let carRes = null,
            driverRes = null
        if (driverId === 'temporaryDriver' || carId === 'temporaryCar') {
            try {
                if (driverId === 'temporaryDriver') {
                    driverRes = await this.addTemporaryDriver(driverName)
                    driverId = driverRes.id || -1
                }
                if (carId === 'temporaryCar') {
                    carRes = await this.addTemporaryCar(carCode)
                    carId = carRes.id || -1
                }
            } catch (err) {
                message.error(err.msg || '新增临时车辆或司机失败')
                return
            }
        }

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
        if (billingMethod === 1) {
            sendCarCashPriceExpenseList = []
        } else if (billingMethod === 2) {
            quotationNumber = null
            quotationNumberId = null
            sendCarCashPriceExpenseList = this.stowageDetails.expensecash.logData().data
        } else {}
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
                item.data.quotationNumber = null
                item.data.quotationNumberId = null
                item.data.sendCarCashPriceExpenseList = this.stowageDetails[`expensecash${index}`] ? this.stowageDetails[`expensecash${index}`].logData().data : []
            }
            return item.data
        })
        /* 请求数据 */
        let reqData = {
            id: this.state.id,
            carCode,
            carId,
            carType,
            carTypeId,
            carTypeName,
            carrierId,
            carrierName,
            carrierList,
            departureTime,
            driverId,
            driverName,
            isHighway,
            phone,
            phoneBackup,
            billingMethod,
            companyId,
            currencyId,
            currencyName,
            createTime,
            departure,
            destination,
            expenseItemList,
            operatorId,
            operatorName,
            quotationNumber,
            quotationNumberId,
            quotationType,
            remark,
            expenseCashPriceList: expensePriceData,
            selectExpenseItemList: expenseItemData,
            sendCarCashPriceExpenseList,
            status,
            stowageNumber,
            trailerCarCode,
            transitPlaceOneId,
            transitPlaceOneName,
            longitude,
            latitude,
            transitPlaceTwoId,
            transitPlaceTwoName,
            transportationMethodId,
            transportationMethodName,
            updateTime,
            receiverList,
            senderList,
            sendCarOrderList,
            totalBoardCount,
            totalBoxCount,
            totalGrossWeight,
            totalNetWeight,
            totalQuantity,
            totalVolume,
            selectQuotation,
            taxes, //发票税
            withholdingTax //补扣税
        }
        //console.log('请求数据', reqData)
        /* 请求数据 */
        this.setState({ saveLoading: true })
        rApi.saveAllocateEdit(reqData)
            .then(res => {
                const {originView} = this.state.pageData
                if (originView && originView.onChangeValue) {
                    originView.onChangeValue()
                }
                message.success('操作成功')
                this.setState({ saveLoading: false })
            })
            .catch(err => {
                message.error(err.msg || '操作失败')
                this.setState({ saveLoading: false })
            })
    }

    /* 确认 */
    handleConfirm = async () => {
        const { rApi } = this.props
        /* 请求数据 */
        let reqData = {
            id: this.state.id
        }
        /* 请求数据 */
        await this.setState({buttonLoading: true})
        rApi.confirmAllocateEdit(reqData)
            .then(res => {
                const { originView } = this.state.pageData
                if (originView && originView.onChangeValue) {
                    originView.onChangeValue()
                }
                this.changeSettlementData('status', 2)
                message.success('操作成功')
                this.setState({ buttonLoading: false })
            })
            .catch(err => {
                message.error(err.msg || '操作失败')
                this.setState({ buttonLoading: false })
            })
    }

    render() {
        const {
            tabData,
            buttonLoading,
            saveLoading,
            openType
        } = this.state
        const {form, rApi} = this.props
        // console.log('renderData', tabData)
        return(
            <Form layout='inline' className='allocate-edit'>
                 <div className='headbar'>
                    <div className='title'>
                        <span style={{fontSize: '14px', color: '#444'}}>配载单状态:</span>
                        {
                            tabData[0].data.status === 1 ? 
                                <span style={{ color: '#49A9EE'}}>待确认</span> :
                            tabData[0].data.status === 2 ?
                                <span style={{ color: '#3DBD7D'}}>已确认</span> :
                                <span>-</span>
                        }
                    </div>
                    {
                        (openType === 1 && tabData[0].data.status !== 2) &&
                        <div>
                            <FunctionPower power={power.SAVE_DATA}>
                                <Button
                                    className="btn-padding-20"
                                    onClick={e => this.handleValidate('save')}
                                    loading={saveLoading}
                                >
                                    保存
                                </Button>
                            </FunctionPower>
                            <FunctionPower power={power.CONFIRM_DATA}>
                                <Button
                                    className="btn-padding-20"
                                    onClick={e => this.handleValidate('confirm')}
                                    style={{ marginLeft: 12 }}
                                    loading={buttonLoading}
                                    type='primary'
                                >
                                    确认
                                </Button>
                            </FunctionPower>
                        </div>
                    }
                </div>
                <div className='container-box'>
                    <Tabs
                        className='itabs-bottomline nopad'
                        defaultActiveKey="stowageDetails"
                    >
                        {
                            tabData.map(item => {
                                return (
                                    <TabPane
                                        tab={item.title}
                                        key={item.key}
                                    >
                                        {
                                            item.key === 'stowageDetails' ?
                                                <StowageDetails
                                                    getRef={v => this.stowageDetails = v}
                                                    form={form}
                                                    rApi={rApi}
                                                    {...item.data}
                                                    changeSendcarData={this.changeSendcarData}
                                                    changeSettlementData={this.changeSettlementData}
                                                    clearCarrierData={this.clearCarrierData}
                                                    clearQuotationData={this.clearQuotationData}
                                                    changeSpecialBusinessData={this.changeSpecialBusinessData}
                                                    openType={openType}
                                                    power={power}
                                                />
                                                :
                                                item.key === 'receiverAndSender' ?
                                                    <ReceiverAndSender
                                                        {...item.data}
                                                        transitPlaceOneName={tabData[0].data.transitPlaceOneName}
                                                        transitPlaceOneId={tabData[0].data.transitPlaceOneId}
                                                        longitude={tabData[0].data.longitude}
                                                        latitude={tabData[0].data.latitude}
                                                        sendCarOrderList={tabData[2].data.sendCarOrderList}
                                                        changeSendReceiveData={this.changeSendReceiveData}
                                                        changeOrderDetailsData={this.changeOrderDetailsData}
                                                        changeSettlementData={this.changeSettlementData}
                                                        openType={openType}
                                                    />
                                                    :
                                                    item.key === 'orderDetails' ?
                                                        <OrderDetails
                                                            {...item.data}
                                                        />
                                                        :
                                                        null
                                        }
                                    </TabPane>
                                )
                            })
                        }
                    </Tabs>
                </div>
            </Form>
        )
    }
}

export default Form.create()(AllocateEdit)