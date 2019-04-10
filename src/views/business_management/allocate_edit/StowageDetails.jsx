import React, { Component, Fragment } from 'react'
import { Input, DatePicker, Radio, Tabs, Button, Tag } from 'antd'
import { Row, Col } from '@src/components/grid'
import FormItem from '@src/components/FormItem'
import RemoteSelect from '@src/components/select_databook'
import { cloneObject, validateToNextPhone, resetFormError } from '@src/utils'
import { expenseItemsToArray } from '../order/add/index'
import Quotation from "../order/list/quotation"
import AddOrEdit from '@src/views/project_management/customer_offer/transport/addoredit'
import TransportRoute from '../public/transport_route'
import ExpenseCash from '../order/list/expense_cash'
import ExpenseItem from '../order/add/expense _config'
import TabAddButton from '../public/TabAddButton'
import moment from 'moment'

const { TabPane } = Tabs
const RadioGroup = Radio.Group

/* 配载明细 */
class StowageDetails extends Component {

    constructor (props) {
        super(props)
        if (props.getRef) {
            props.getRef(this)
        }
    }
    
    /* 获取司机数据 */
    getDriverList = () => {
        let { carCode } = this.props.sendcarData
        const { rApi } = this.props
        return new Promise((resolve, reject) => {
            rApi.getCars({
                limit: 99999,
                offset: 0,
                keyword: carCode,
                authenticationStatus: 1
            }).then(d => {
                //console.log('filterOrderIdGetCarType', d)
                let data = d.records
                if (data && data.length > 0) {
                    resolve(data.filter(d => d.driverId && d.driverName).map((item, index) => {
                        return {
                            key: item.driverId ? item.driverId : index,
                            id: item.driverId ? item.driverId : null,
                            driverName: item.driverName ? item.driverName : null
                        }
                    }))
                } else {
                    resolve([])
                }
            }).catch(e => {
                reject(e)
            })
        })
    }

    /* 获取司机电话 */
    getDriverPhone = () => {
        let { driverId } = this.props.sendcarData
        const { rApi, changeSendcarData } = this.props
        rApi.getDrivers({
            limit: 99999,
            offset: 0,
            id: driverId || -1
        })
            .then(d => {
                let data = d.records[0]
                changeSendcarData('phone', data ? data.phone : null)
                changeSendcarData('phoneBackup', data ? data.phoneBackup : null)
            })
            .catch()
    }

    /* 选择路线 */
    selectRoute = ({ type, index }) => {
        let quotationNumber = type === 'sendcar' ? this.props.quotationNumber : this.props.specialBusiness[index].data.quotationNumber
        this.quotationView.show({
            quotationType: this.props.quotationType,
            quotationNumber,
            openData: {
                type,
                index
            }
        })
    }

    /* 中转地值 */
    getTransitPlaceData = (val, { type, index }) => {
        const { changeSettlementData, changeSpecialBusinessData } = this.props
        if (type === 'sendcar') {
            changeSettlementData('transitPlaceOneName', val.name)
            changeSettlementData('transitPlaceOneId', val.id)
        } else {
            changeSpecialBusinessData(index, {
                transitPlaceOneId: val.id || null,
                transitPlaceOneName: val.name || null
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

    /* 根据费用单位ID获取对应的计算方式 */
    getMethodByUnitId = async (unitData, list) => {
        const { 
            rApi,
            totalQuantity,
            totalBoxCount,
            totalBoardCount,
            totalGrossWeight,
            totalVolume
        } = this.props
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

    /* 新加tab */
    addTabpane = (newItem) => {
        const { changeSettlementData, quotationType } = this.props
        let specialBusiness = [...this.props.specialBusiness]
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
                    withholdingTax: 0, //补扣税
                }
            })
        }
        changeSettlementData('specialBusiness', specialBusiness)
    }

    /* 删除tab */
    deleteTabpane = (target) => {
        const { changeSettlementData } = this.props
        let specialBusiness = [...this.props.specialBusiness]
        let index = specialBusiness.indexOf(specialBusiness.find(item => item.key === target.id))
        specialBusiness.splice(index, 1)
        changeSettlementData('specialBusiness', specialBusiness)
    }

    /* 路线行选择 */
    selectRow = async (item) => {
        const { changeSettlementData, changeSendcarData, changeSpecialBusinessData } = this.props
        let quotationLineExpenseItems = item.quotationLineExpenseItems || []
        let unitData = []
        quotationLineExpenseItems = cloneObject(quotationLineExpenseItems)
        unitData = quotationLineExpenseItems.map(item => item.costUnitId)
        quotationLineExpenseItems = await this.getMethodByUnitId(unitData, quotationLineExpenseItems)
        if (item.openData.type === 'sendcar') {
            changeSendcarData('isHighway', item.isHighway || 1)
            changeSettlementData('expenseItemList', quotationLineExpenseItems.map(d => {
                return { ...d, quotationLineExpenseItemId: d.id }
            }))
            changeSettlementData('selectQuotation', item)
            changeSettlementData('departure', item.departure)
            changeSettlementData('destination', item.destination)
        } else {
            changeSpecialBusinessData(item.openData.index, {
                expenseItemList: quotationLineExpenseItems.map(d => {
                    return { ...d, quotationLineExpenseItemId: d.id }
                }),
                departure: item.departure,
                destination: item.destination,
                selectQuotation: item
            })
        }
    }

    /* 费用项数据更改 */
    onChangeExpenseItemList = (d, { type, index }) => {
        const { itemIndex, unitIndex, value, status, isEdit } = d
        const { changeSettlementData, changeSpecialBusinessData } = this.props
        let newResult = type === 'sendcar' ? [...this.props.selectExpenseItemList] : [...this.props.specialBusiness[index].data.selectExpenseItemList]
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
            changeSettlementData('selectExpenseItemList', newResult)
        } else {
            changeSpecialBusinessData(index, {
                selectExpenseItemList: newResult
            })
        }
    }

    /* 费用项选中值 */
    onChangRouter = (value, { type, index }) => {
        let selectExpenseItemList = type === 'sendcar' ? this.props.selectExpenseItemList : [...this.props.specialBusiness[index].data.selectExpenseItemList]
        let { changeSettlementData, changeSpecialBusinessData } = this.props
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
            changeSettlementData('selectExpenseItemList', selectExpenseItemList)
        } else {
            changeSpecialBusinessData(index, {
                selectExpenseItemList
            })
        }
    }
        
    /* 实报实销选中值 */
    onReimbursementChangeValue = (value, { type, index }) => {
        let selectExpenseItemList = type === 'sendcar' ? this.props.selectExpenseItemList : [...this.props.specialBusiness[index].data.selectExpenseItemList]
        let { changeSettlementData } = this.props
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
            changeSettlementData('selectExpenseItemList', selectExpenseItemList)
        } else {
            this.props.changeSpecialBusinessData(index, {
                selectExpenseItemList
            })
        }
    }

    morePhone = (type) => {
        const { changeSendcarData } = this.props
        let showMorephone = type === 'add'
        let phoneBackup = this.props.phoneBackup
        if (type === 'reduce') {
            phoneBackup = ''
            changeSendcarData('phoneBackup', phoneBackup)
        }
        changeSendcarData('showMorephone', showMorephone)
    }

    /* 删除费用项 */
    deleteItem = async (value, { type, index }) => {
        let selectExpenseItemList = type === 'sendcar' ? this.props.selectExpenseItemList : this.props.specialBusiness[index].selectExpenseItemList
        let { changeSettlementData } = this.props
        let delIndex = value.itemIndex
        let newResult = [...selectExpenseItemList]
        newResult.splice(delIndex, 1)
        if (type === 'sendcar') {
            await changeSettlementData('reloadExpense', true)
            changeSettlementData('selectExpenseItemList', newResult).then(changeSettlementData('reloadExpense', false))
        } else {
            this.props.changeSpecialBusinessData(index, {
                selectExpenseItemList: newResult,
                forceQuotationNumber: true
            }, () => {
                this.props.changeSpecialBusinessData(index, {
                    forceQuotationNumber: false
                })
            })
        }
    }

    /* 处理车辆列表 */
    filterCarList = arr => {
        return arr.map(item => ({
            ...item,
            labelName: `${item.carCode}(${item.carTypeName || '无'})`
        }))
    }
    /* 选择车辆 */
    setCar = async (val, carId) => {
        const { changeSendcarData, clearCarrierData } = this.props
        await changeSendcarData('carId', val ? val.id : null)
        await changeSendcarData('carCode', val ? (val.id === 'temporaryCar' ? val.labelName : val.carCode) : null)
        await changeSendcarData('curCar', val || null)
        let id = val ? val.id : null
        if (id !== carId) {
            clearCarrierData('car')
        }
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
        const { changeSendcarData } = this.props
        let driverId = val && val.id === 'temporaryDriver' ? 'temporaryDriver' : val ? val.driverId : null
        await changeSendcarData('driverId', driverId)
        await changeSendcarData('driverName', val ? val.labelName : null)
        if (this.props.sendcarData.curDriver && this.props.sendcarData.curDriver.id === 'init') {
            await changeSendcarData('curDriver', val || null)
        } else {
            await changeSendcarData('curDriver', val || null)
            this.setDriverPhone(this.props.sendcarData.curDriver)
        }
    }
    /* 获取司机电话 */
    setDriverPhone = (driver) => {
        const { changeSendcarData } = this.props
        if (driver && driver.id !== 'temporaryDriver') {
            changeSendcarData('phone', driver.phone || null)
            changeSendcarData('phoneBackup', driver.phoneBackup || null)
        }
    }

    /* 备用联系方式 */
    changeMorePhone = () => {
        const { changeSendcarData } = this.props
        if (this.props.sendcarData.morePhone) {
            changeSendcarData('morePhone', false)
            changeSendcarData('phoneBackup', null)
        } else {
            changeSendcarData('morePhone', true)
        }
    }

    // tab change事件
    changeTab = key => {
        const { form, changeSettlementData } = this.props
        if (key !== 'addTab') {
            resetFormError(form)
            changeSettlementData('activeTab', key)
        } else { }
    }

    render() {
        const {
            changeSendcarData,
            changeSettlementData,
            clearCarrierData,
            clearQuotationData,
            changeSpecialBusinessData,
            specialBusiness,
            billingMethod,
            quotationNumber,
            quotationNumberId,
            departure,
            destination,
            transitPlaceOneName,
            sendCarCashPriceExpenseList,
            expenseItemList,
            selectExpenseItemList,
            settlementForce,
            reloadExpense,
            currencyId,
            currencyName,
            remark,
            openType,
            selectQuotation,
            activeTab,
        } = this.props
        const { getFieldDecorator } = this.props.form
        const {
            carType,
            carrierId,
            carrierName,
            fileterProjectId,
            departureTime,
            carCode,
            carId,
            curCar,
            isHighway,
            driverId,
            driverName,
            phone,
            phoneBackup,
            sendcarForce,
            showMorephone,
            morePhone
        } = this.props.sendcarData
        const expenseStyle = { margin: '10px 0' }
        const titlebarStyle = { display: 'flex', margin: '10px 0 0', height: '36px', lineHeight: '36px', alignItems: 'center', fontSize: '14px', color: '#444', boxShadow: '0 -1px 0 0 #e0e0e0' }

        return (
            <div ref={v => this.rootDom = v}>
                <Quotation
                    showMore={this.showMore}
                    selectRow={this.selectRow}
                    getThis={v => this.quotationView = v}
                />
                <AddOrEdit
                    parent={this}
                    getThis={v => this.addoredit = v}
                />
                <Tabs
                    type="card"
                    size='small'
                    className='itabs-customcard haspad'
                    activeKey={activeTab}
                    onTabClick={this.changeTab}
                >
                    <TabPane
                        tab="派车"
                        key="sendcar"
                    >
                        <Row style={{minHeight: 42}}>
                            <Col label="车辆类型&emsp;&emsp;" colon span={7}>
                                <RadioGroup
                                    disabled={openType !== 1}
                                    defaultValue={carType}
                                    value={carType}
                                    onChange={e => {
                                        resetFormError(this.props.form)
                                        changeSendcarData('carType', e ? e.target.value : null)
                                        if (e && e.target.value === 2) {
                                            changeSettlementData('billingMethod', 2)
                                            changeSendcarData('carrierId', null)
                                            changeSendcarData('carrierName', '')
                                        }
                                    }}
                                >
                                    <Radio value={1}>承运商车辆</Radio>
                                    <Radio value={2}>现金车</Radio>
                                </RadioGroup>
                            </Col>
                            {
                                carType !== 2 &&
                                <Col label="&emsp;承运商" span={7} isRequired>
                                    <FormItem>
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
                                                    defaultValue={
                                                        carrierId ?
                                                            {
                                                                id: carrierId,
                                                                businessName: carrierName
                                                            } : null
                                                    }
                                                    onChangeValue={async value => {
                                                        await changeSendcarData('carrierId', value ? value.id : null)
                                                        let id = value ? value.id : null
                                                        if (id !== carrierId) {
                                                            clearCarrierData('carrier')
                                                        }
                                                        changeSendcarData('carrierName', value ? value.businessName : null)
                                                    }}
                                                    disabled={carType === 2 || openType !== 1}
                                                    getDataMethod={'filterCarrier'}
                                                    params={{ fileterProjectId }}
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
                            <Col label="选择车辆&emsp;&emsp;" colon span={7} isRequired={carType === 2}>
                                <FormItem>
                                    {
                                        getFieldDecorator('carId', {
                                            initialValue: carId ? {
                                                id: carId,
                                                labelName: carCode
                                            } : null,
                                            rules: [
                                                {
                                                    required: carType === 2 ? true : false,
                                                    message: '请选择车辆'
                                                }
                                            ],
                                        })(
                                            <RemoteSelect
                                                defaultValue={
                                                    carId ? {
                                                        id: carId,
                                                        carCode: carCode,
                                                        labelName: carCode
                                                    } : null
                                                }
                                                disabled={openType !== 1}
                                                forceRender={sendcarForce}
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
                            <Col label="司机姓名&emsp;&emsp;" colon span={7} isRequired={carType === 2}>
                                <FormItem>
                                    {
                                        getFieldDecorator('driverId', {
                                            initialValue: driverId ? {
                                                driverId: driverId,
                                                labelName: driverName
                                            } : null,
                                            rules: [
                                                {
                                                    required: carType === 2 ? true : false,
                                                    message: '请选择司机'
                                                }
                                            ],
                                        })(
                                            <RemoteSelect
                                                defaultValue={
                                                    driverId ? {
                                                        driverId: driverId,
                                                        labelName: driverName
                                                    } : null
                                                }
                                                disabled={openType !== 1}
                                                forceRender={sendcarForce}
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
                                                keyName='driverId'
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col label="联系方式" span={13} style={{ alignItems: 'center' }}>
                                {
                                    sendcarForce ?
                                        null
                                        :
                                        <FormItem style={{ width: 150 }}>
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
                                                        disabled={openType !== 1}
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
                                    sendcarForce ? null : ((phoneBackup || morePhone) ? <FormItem style={{ width: 150, marginLeft: 10 }}>
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
                                                    disabled={openType !== 1}
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
                                        (phoneBackup || morePhone) ? <span style={{ marginTop: '-2px' }}>-</span> : <span style={{ marginTop: '-2px' }}>+</span>
                                    }
                                </div>
                                {
                                    driverId === 'temporaryDriver' && <Tag color="#f50" style={{ marginLeft: 10 }}>非平台司机</Tag>
                                }
                            </Col>
                            <Col span={1} />
                        </Row>
                        <Row style={{minHeight: 42}}>
                            <Col label="发车时间&emsp;&emsp;" colon span={7} isRequired>
                                <FormItem>
                                    {
                                        getFieldDecorator('departureTime', {
                                            initialValue: departureTime ? moment(departureTime) : null,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择发车时间'
                                                }
                                            ],
                                        })(
                                            <DatePicker
                                                style={{ width: '100%' }}
                                                disabled={openType !== 1}
                                                disabledDate={this.disabledDate}
                                                getCalendarContainer={() => this.popupContainer || document.body}
                                                placeholder="选择日期"
                                                title={departureTime}
                                                format="YYYY-MM-DD HH:mm"
                                                showTime={{ format: 'HH:mm' }}
                                                onChange={
                                                    date => {
                                                        this.props.changeSendcarData('departureTime', date || null)
                                                    }}
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col label="高速要求" span={7}>
                                <RadioGroup
                                    disabled={openType !== 1}
                                    onChange={e => {
                                        this.props.changeSendcarData('isHighway', e.target.value)
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
                            <Col label="结算方式&emsp;&emsp;" span={6} colon>
                                <div className="flex flex-vertical-center">
                                    <RadioGroup
                                        disabled={openType !== 1}
                                        value={billingMethod ? billingMethod : 1}
                                        defaultValue={billingMethod ? billingMethod : 1}
                                        onChange={e => {
                                            changeSettlementData('billingMethod', e ? e.target.value : null)
                                        }}
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
                                    <Col label='报价单号&emsp;&emsp;' span={7} colon>
                                        <div className="flex flex-vertical-center">
                                            <div style={{ width: 150, marginRight: '20px' }}>
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
                                                    disabled={(carrierId && openType === 1) ? false : true}
                                                    onChangeValue={(value = {}) => {
                                                        let taxesVul = value && value.origin_data && value.origin_data.length ? value.origin_data[0].taxes || 0 : 0
                                                        let withholdingTaxVul = value && value.origin_data && value.origin_data.length ? value.origin_data[0].withholdingTax || 0 : 0
                                                        changeSettlementData('quotationNumberId', value.id ? value.id : null).then(() => {
                                                            let id = value ? value.id : null
                                                            if (id !== quotationNumberId) {
                                                                clearQuotationData()
                                                            }
                                                        })
                                                        changeSettlementData('quotationNumber', value.title || value.quotationNumber || null)
                                                        changeSettlementData('taxes', taxesVul ? taxesVul : this.props.taxes)
                                                        changeSettlementData('withholdingTax', withholdingTaxVul ? withholdingTaxVul : this.props.withholdingTax)
                                                    }}
                                                    labelField={'quotationNumber'}
                                                    getDataMethod={'getOfferCarrier'}
                                                    params={{ limit: 99999, offset: 0, carrierId: carrierId, reviewStatus: 2 }}

                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    :
                                    <Col label="币种&emsp;&emsp;&emsp;&emsp;" span={4} colon>
                                        <div className="flex flex-vertical-center">
                                            <RemoteSelect
                                                disabled={openType !== 1}
                                                text='币别'
                                                defaultValue={
                                                    currencyId ? {
                                                        id: currencyId,
                                                        title: currencyName
                                                    } : null
                                                }
                                                onChangeValue={(value = {}) => {
                                                    changeSettlementData('currencyId', value.id ? value.id : null)
                                                    changeSettlementData('currencyName', value.title ? value.title : null)
                                                }
                                                }
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
                                    <Col label="报价路线&emsp;&emsp;" colon>
                                        <Button
                                            icon='environment'
                                            disabled={(quotationNumberId && openType === 1) ? false : true}
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
                                    <Col label="&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;" colon>
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
                                            power={this.props.power}
                                        />
                                    </Col>
                                </Row>
                            </Fragment>
                        }
                        {
                            billingMethod === 1 ?
                                <div style={expenseStyle}>
                                    {
                                        reloadExpense ?
                                            null
                                            :
                                            <div style={{ display: 'flex' }}>
                                                <span style={{ color: '#888' }}>费用项列表&emsp;</span>
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
                                                    openType={openType}
                                                    isEdit={true}
                                                />
                                            </div>
                                    }
                                </div>
                                :
                                <div style={{ margin: '10px 0', display: 'flex' }}>
                                    <span style={{ color: '#888' }}>费用项列表&emsp;</span>
                                    <ExpenseCash
                                        data={sendCarCashPriceExpenseList}
                                        getThis={(v) => this.expensecash = v}
                                        openType={openType}
                                    />
                                </div>
                        }
                    </TabPane>
                    {
                        specialBusiness.length && specialBusiness.map((item, index) => {
                            return (
                                <TabPane
                                    tab={item.tabTitle}
                                    key={item.key}
                                >
                                    <Row style={{minHeight: 42}}>
                                        <Col label="&emsp;承运商" span={7} isRequired>
                                            <FormItem>
                                                {
                                                    getFieldDecorator(`carrierId-${item.value}`, {
                                                        initialValue: item.data.carrierId ? {
                                                            id: item.data.carrierId,
                                                            businessName: item.data.carrierName
                                                        } : null,
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message: '请选择承运商'
                                                            }
                                                        ],
                                                    })(
                                                        <RemoteSelect
                                                            defaultValue={
                                                                item.data.carrierId ? {
                                                                    id: item.data.carrierId,
                                                                    businessName: item.data.carrierName
                                                                } : null
                                                            }
                                                            onChangeValue={value => {
                                                                let prevId = item.data.carrierId
                                                                const { changeSpecialBusinessData } = this.props
                                                                changeSpecialBusinessData(index, {
                                                                    'carrierId': value ? value.id : null,
                                                                    'carrierName': value ? value.businessName : null,
                                                                    'carrierContactList': value && value.origin_data && value.origin_data.length ? value.origin_data[0].carrierContactList : []
                                                                }, () => {
                                                                    let id = value ? value.id : null
                                                                    if (prevId !== id) {
                                                                        changeSpecialBusinessData(index, {
                                                                            forceQuotationNumber: true,
                                                                            quotationNumber: null,
                                                                            quotationNumberId: null
                                                                        }, () => {
                                                                            changeSpecialBusinessData(index, {
                                                                                forceQuotationNumber: false
                                                                            })
                                                                        })
                                                                    }
                                                                })
                                                            }}
                                                            disabled={openType !== 1}
                                                            getDataMethod={'filterCarrier'}
                                                            params={{ fileterProjectId }}
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
                                                                    disabled={openType !== 1}
                                                                    defaultValue={
                                                                        item.data.carrierContactId ?
                                                                            {
                                                                                id: item.data.carrierContactId,
                                                                                name: item.data.carrierContactName
                                                                            }
                                                                            : null
                                                                    }
                                                                    onChangeValue={value => {
                                                                        changeSpecialBusinessData(index, {
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
                                                        disabled={openType !== 1}
                                                        value={item.data ? item.data.carrierContactName : null}
                                                        placeholder=""
                                                        onChange={e => changeSpecialBusinessData(index, { carrierContactName: e ? e.target.value : null })}
                                                    />
                                            }
                                        </Col>
                                    </Row>
                                    <Row style={{minHeight: 42}}>
                                        <Col label="联系电话" span={7}>
                                            <FormItem>
                                                {
                                                    getFieldDecorator(`phoneBackup-${item.value}`, {
                                                        initialValue: item.data.carrierContactPhone,
                                                        rules: [
                                                            {
                                                                validator: validateToNextPhone
                                                            }
                                                        ],
                                                    })(
                                                        <Input
                                                            disabled={openType !== 1}
                                                            value={item.data.carrierContactPhone}
                                                            placeholder=""
                                                            onChange={e => changeSpecialBusinessData(index, { carrierContactPhone: e ? e.target.value : null })}
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
                                        <Col label="结算方式&emsp;&emsp;" span={7} colon>
                                            <div className="flex flex-vertical-center">
                                                <RadioGroup
                                                    disabled={openType !== 1}
                                                    value={item.data.billingMethod ? item.data.billingMethod : 1}
                                                    onChange={e => {
                                                        changeSpecialBusinessData(index, {
                                                            billingMethod: e ? e.target.value : null
                                                        })
                                                    }}
                                                >
                                                    <Radio value={1}>合同价</Radio>
                                                    <Radio value={2}>现金价</Radio>
                                                </RadioGroup>
                                            </div>
                                        </Col>
                                        {
                                            item.data.billingMethod === 1 ?
                                                <Col label='报价单号&emsp;&emsp;' span={7} colon>
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
                                                                disabled={(carrierId && openType === 1) ? false : true}
                                                                onChangeValue={(val = {}) => {
                                                                    const { changeSpecialBusinessData } = this.props
                                                                    let prevId = item.data.quotationNumberId
                                                                    let quotationNumberId = val ? val.id : null
                                                                    let quotationNumber = val.title || val.quotationNumber
                                                                    let currencyId = val && val.origin_data && val.origin_data.length ? val.origin_data[0].currencyId : item.data.currencyId ? item.data.currencyId : null
                                                                    let currencyName = val && val.origin_data && val.origin_data.length ? val.origin_data[0].currencyName : item.data.currencyName ? item.data.currencyName : null
                                                                    let taxes = val && val.origin_data && val.origin_data.length ? val.origin_data[0].taxes || 0 : 0
                                                                    let withholdingTax = val && val.origin_data && val.origin_data.length ? val.origin_data[0].withholdingTax || 0 : 0
                                                                    changeSpecialBusinessData(index, {
                                                                        quotationNumber,
                                                                        quotationNumberId,
                                                                        currencyId,
                                                                        currencyName,
                                                                        taxes,
                                                                        withholdingTax
                                                                    }, () => {
                                                                        if (quotationNumberId !== prevId) {
                                                                            changeSpecialBusinessData(index, {
                                                                                departure: null,
                                                                                destination: null,
                                                                                expenseItemList: [],
                                                                                reLoadQuotation: true
                                                                            }, () => {
                                                                                changeSpecialBusinessData(index, {
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
                                                <Col label="币种&emsp;&emsp;&emsp;&emsp;" span={4} colon>
                                                    <div className="flex flex-vertical-center">
                                                        <RemoteSelect
                                                            disabled={openType !== 1}
                                                            text='币别'
                                                            defaultValue={
                                                                item.data.currencyId ? {
                                                                    id: item.data.currencyId,
                                                                    title: item.data.currencyName
                                                                } : null
                                                            }
                                                            onChangeValue={(val = {}) => {
                                                                this.props.changeSpecialBusinessData(index, {
                                                                    currencyId: val.id || null,
                                                                    currencyName: val.title || null
                                                                })
                                                            }}
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
                                                <Col label="报价路线&emsp;&emsp;" colon>
                                                    <Button
                                                        icon='environment'
                                                        disabled={(item.data.quotationNumberId && openType === 1) ? false : true}
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
                                                <Col label="&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;" colon>
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
                                            <div style={{ margin: '10px 0' }}>
                                                {
                                                    (item.data.forceQuotationNumber || item.data.reLoadQuotation) ?
                                                        null
                                                        :
                                                        <div style={{ display: 'flex' }}>
                                                            <span style={{ color: '#888' }}>费用项列表&emsp;</span>
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
                                                                openType={openType}
                                                                isEdit={true}
                                                            />
                                                        </div>
                                                }
                                            </div>
                                            :
                                            <div style={{ margin: '10px 0', display: 'flex' }}>
                                                <span style={{ color: '#888' }}>费用项列表&emsp;</span>
                                                <div style={{ padding: '10px', backgroundColor: '#f7f7f7' }}>
                                                    <ExpenseCash
                                                        data={item.data.sendCarCashPriceExpenseList}
                                                        getThis={(v) => this[`expensecash${index}`] = v}
                                                        openType={openType}
                                                    />
                                                </div>
                                            </div>
                                    }
                                </TabPane>
                            )
                        })
                    }
                    {
                        this.rootDom && openType === 1 &&
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
                <Row style={{minHeight: 42, padding: '0 20px'}}>
                    <Col label="备注信息&emsp;&emsp;" span={10} colon>
                        <Input
                            disabled={openType !== 1}
                            value={remark || ''}
                            placeholder=""
                            onChange={e => {
                                changeSettlementData('remark', e ? e.target.value : null)
                            }}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default StowageDetails