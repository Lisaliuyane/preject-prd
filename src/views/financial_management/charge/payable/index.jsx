import React, { Fragment } from 'react'
import { Button, Radio, message, Popconfirm, DatePicker, Popover, Icon } from 'antd'
import { inject, observer } from "mobx-react"
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import RemoteSelect from '@src/components/select_databook'
import TimePicker from '@src/components/time_picker'
import { deleteNull, trim } from '@src/utils'
import SendcarDetails from '../../public/SendcarDetails'
import PayableDetails from '../../public/PayableDetails'
import SetAccount from '../../public/SetAccount'
import FeeMore from '../../public/FeeMore'
import moment from 'moment'
import JsExportExcel from 'js-export-excel'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { children, id } from './power'
import './index.less'

const power = Object.assign({}, children, id)
const { MonthPicker } = DatePicker
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

/**
 * 应付预估
 * @class ChargePayable
 * @extends {Parent}
*/
@inject('rApi', 'mobxTabsData', 'mobxBaseData')
@observer
class ChargePayable extends Parent {

    state = {
        /* 待开立列表筛选--start */
        sendCarNumber: null,
        specialBusinessId: null,
        /* 待开立列表筛选--end */
        /* 应付列表筛选--start */
        operatorId: null,
        carrierId: null,
        driverId: null,
        startOrderDate: null,
        endOrderDate: null,
        orderLegalId: null,
        associatePaymentCarrierId: null,
        expenseOwnMonth: null,
        estimateNumber: null,
        /* 应付列表筛选--end */
        curType: 'sendcar',
        forceRender: false,
        curCode: 1, //当前选择 1：待开立 2：应收预估
        selectedKeys: [], //待开立选中行
        estimateSelectedKeys: [], //应付预估选中行
        specSelectedKeys: [],
        specEstimateSelectedKeys: [],
        estimateList: [], //应付预估列表数据
        estimateSaveLoading: false,
        exportLoading: false,
        doEstimateLoading: false
    }
    
    constructor (props) {
        super(props)
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis col-status',
                title: '状态',
                dataIndex: 'openStatus',
                key: 'openStatus',
                width: 120,
                filters: [
                    {
                        text: '未开立',
                        value: 1,
                    },
                    {
                        text: '已开立',
                        value: 2,
                    }
                ],
                render: val => {
                    return <span className={`pointer ${val === 1 ? 'no' : 'yes'}`}>{`${val === 1 ? '未' : '已'}开立`}</span>
                }
            },
            {
                className: 'text-overflow-ellipsis col-fee',
                title: '费用',
                dataIndex: 'estimatedCost',
                key: 'estimatedCost',
                width: 120,
                render: (val, r, rIndex) => {
                    return(
                        <div className="flex flex-vertical-center" ref={v => this['popFee' + rIndex] = v}>
                            <span style={{color: '#E76400'}}>{`${r.estimatedCost ? `${r.estimatedCost}${r.currencyName ? r.currencyName : 'RMB'}` : '-'}`}</span>
                            {
                                r.sendCarProjectEstimateList && r.sendCarProjectEstimateList.length > 0 ?
                                    <Popover
                                        placement="bottomLeft"
                                        title={null}
                                        getPopupContainer={() => this.rootDom || document.body}
                                        content={
                                            <FeeMore
                                                className='fee-more'
                                                title='预估'
                                                {...r}
                                            />
                                        }
                                        onVisibleChange={flag => this.popVisibleChange(flag, 'showFeePop', rIndex)}
                                        // trigger="click"
                                    >
                                        <span className='more'>
                                            <Icon type={r.showFeePop ? 'minus' : 'plus'} />
                                        </span>
                                    </Popover>
                                    :
                                    null
                            }
                        </div>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '派车单号',
                dataIndex: 'sendCarNumber',
                key: 'sendCarNumber',
                width: 120
            },
            {
                className: 'text-overflow-ellipsis',
                title: '承运商',
                dataIndex: 'carrierName',
                key: 'carrierName',
                width: 120,
                render: (val, r) => {
                    let str = r.billingMethod === 1 ? val : `现金车(${r.driverName ? r.driverName.split('(')[0] : '-'})`
                    return (
                        <ColumnItemBox name={str} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '司机',
                dataIndex: 'driverName',
                key: 'driverName',
                width: 120,
                render: val => {
                    return val && val.split('(')[0]
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '电话',
                dataIndex: 'phone',
                key: 'phone',
                width: 120
            },
            {
                className: 'text-overflow-ellipsis',
                title: '币别',
                dataIndex: 'currencyName',
                key: 'currencyName',
                width: 120
            },
            {
                className: 'text-overflow-ellipsis',
                title: '所属配载单',
                dataIndex: 'stowageNumber',
                key: 'stowageNumber',
                width: 120,
                render: val => {
                    return (
                        <ColumnItemBox name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '派车人',
                dataIndex: 'operatorName',
                key: 'operatorName',
                width: 120,
                render: val => {
                    return (
                        <ColumnItemBox name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '下单时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 120,
                render: val => {
                    return moment(val).format('YYYY-MM-DD HH:mm')
                }
            }
        ]
        this.state.estimateColumns = [
            {
                className: 'text-overflow-ellipsis',
                title: '预估单号',
                dataIndex: 'estimateNumber',
                key: 'estimateNumber',
                width: 120
            },
            {
                className: 'text-overflow-ellipsis',
                title: '承运商',
                dataIndex: 'carrierName',
                key: 'carrierName',
                width: 120,
                render: (val, r) => {
                    let str = val ? val : r.billingMethod === 2 ? '现金车' : val
                    return (
                        <ColumnItemBox name={str} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '付款承运商',
                dataIndex: 'associatePaymentCarrierName',
                key: 'associatePaymentCarrierName',
                width: 120,
                render: val => {
                    return (
                        <ColumnItemBox name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '费用所属月份',
                dataIndex: 'expenseOwnMonth',
                key: 'expenseOwnMonth',
                width: 160,
                render: (val, r, rIndex) => {
                    return val ? moment(val).format('YYYY-MM') : ''
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '总费用',
                dataIndex: 'totalCost',
                key: 'totalCost',
                width: 120,
                render: (val, r) => {
                    return (
                        // <span style={{ color: '#E76400' }}>{`${r.totalCost ? `${r.totalCost}${r.currencyName ? r.currencyName : 'RMB'}` : '-'}`}</span>
                        <span style={{ color: '#E76400' }}>{`${r.totalCost ? `${r.totalCost}` : '-'}`}</span>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '税后金额',
                dataIndex: 'afterTaxAmount',
                key: 'afterTaxAmount',
                width: 120,
                render: (val, r) => {
                    return (
                        // <span style={{color: '#E76400'}}>{`${r.afterTaxAmount ? `${r.afterTaxAmount}${r.currencyName ? r.currencyName : 'RMB'}` : '-'}`}</span>
                        <span style={{color: '#E76400'}}>{`${r.afterTaxAmount ? `${r.afterTaxAmount}` : '-'}`}</span>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '币别',
                dataIndex: 'currencyName',
                key: 'currencyName',
                width: 120
            },
            {
                className: 'text-overflow-ellipsis',
                title: '派车单数',
                dataIndex: 'orderQuantity',
                key: 'orderQuantity',
                width: 120
            },
            {
                className: 'text-overflow-ellipsis',
                title: '接单法人',
                dataIndex: 'orderLegalName',
                key: 'orderLegalName',
                width: 120,
                render: val => {
                    return (
                        <ColumnItemBox name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '开立人',
                dataIndex: 'operatorName',
                key: 'operatorName',
                width: 120,
                render: val => {
                    return (
                        <ColumnItemBox name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '开立日期',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 120,
                render: val => {
                    return val && moment(val).format('YYYY-MM-DD')
                }
            }
        ]
        this.state.specColumns = [
            {
                className: 'text-overflow-ellipsis col-status',
                title: '状态',
                dataIndex: 'openStatus',
                key: 'openStatus',
                width: 120,
                filters: [
                    {
                        text: '未开立',
                        value: 1,
                    },
                    {
                        text: '已开立',
                        value: 2,
                    }
                ],
                render: val => {
                    return <span className={`pointer ${val === 1 ? 'no' : 'yes'}`}>{`${val === 1 ? '未' : '已'}开立`}</span>
                }
            },
            {
                className: 'text-overflow-ellipsis col-fee',
                title: '费用',
                dataIndex: 'estimatedCost',
                key: 'estimatedCost',
                width: 120,
                render: (val, r, rIndex) => {
                    return (
                        <div className="flex flex-vertical-center" ref={v => this['popFee' + rIndex] = v}>
                            <span style={{color: '#E76400'}}>{`${r.estimatedCost ? `${r.estimatedCost}${r.currencyName ? r.currencyName : 'RMB'}` : '-'}`}</span>
                            {
                                r.sendCarProjectEstimateList && r.sendCarProjectEstimateList.length > 0 ?
                                    <Popover
                                        placement="bottomLeft"
                                        title={null}
                                        getPopupContainer={() => this.rootDom || document.body}
                                        content={
                                            <FeeMore
                                                className='fee-more'
                                                {...r}
                                            />
                                        }
                                        onVisibleChange={flag => this.popVisibleChange(flag, 'showFeePop', rIndex)}
                                    // trigger="click"
                                    >
                                        <span className='more'>
                                            <Icon type={r.showFeePop ? 'minus' : 'plus'} />
                                        </span>
                                    </Popover>
                                    :
                                    null
                            }
                        </div>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '业务类型',
                dataIndex: 'specialBusinessName',
                key: 'specialBusinessName',
                width: 120,
                render: val => {
                    return (
                        <ColumnItemBox name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '承运商',
                dataIndex: 'carrierName',
                key: 'carrierName',
                width: 120,
                render: (val, r) => {
                    return (
                        <ColumnItemBox name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '联系人',
                dataIndex: 'carrierContactName',
                key: 'carrierContactName',
                width: 120,
                render: val => {
                    return (
                        <ColumnItemBox name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '电话',
                dataIndex: 'carrierContactPhone',
                key: 'carrierContactPhone',
                width: 120,
                render: val => {
                    return (
                        <ColumnItemBox name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '币别',
                dataIndex: 'currencyName',
                key: 'currencyName',
                width: 120
            },
            {
                className: 'text-overflow-ellipsis',
                title: '所属配载单',
                dataIndex: 'stowageNumber',
                key: 'stowageNumber',
                width: 120,
                render: val => {
                    return (
                        <ColumnItemBox name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '创建人',
                dataIndex: 'operatorName',
                key: 'operatorName',
                width: 120,
                render: val => {
                    return (
                        <ColumnItemBox name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '下单时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 120,
                render: val => {
                    return moment(val).format('YYYY-MM-DD HH:mm')
                }
            }
        ]
        this.state.specEstimateColumns = [
            {
                className: 'text-overflow-ellipsis',
                title: '预估单号',
                dataIndex: 'estimateNumber',
                key: 'estimateNumber',
                width: 120
            },
            {
                className: 'text-overflow-ellipsis',
                title: '承运商',
                dataIndex: 'carrierName',
                key: 'carrierName',
                width: 120,
                render: val => {
                    return (
                        <ColumnItemBox name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '业务类型',
                dataIndex: 'specialBusinessName',
                key: 'specialBusinessName',
                width: 120,
                render: val => {
                    return (
                        <ColumnItemBox name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '费用所属月份',
                dataIndex: 'expenseOwnMonth',
                key: 'expenseOwnMonth',
                width: 160,
                render: (val, r, rIndex) => {
                    return val ? moment(val).format('YYYY-MM') : ''
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '总费用',
                dataIndex: 'totalCost',
                key: 'totalCost',
                width: 120,
                render: (val, r) => {
                    return (
                        // <span style={{ color: '#E76400' }}>{`${r.totalCost ? `${r.totalCost}${r.currencyName ? r.currencyName : 'RMB'}` : '-'}`}</span>
                        <span style={{ color: '#E76400' }}>{`${r.totalCost ? `${r.totalCost}` : '-'}`}</span>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '税后金额',
                dataIndex: 'afterTaxAmount',
                key: 'afterTaxAmount',
                width: 120,
                render: (val, r) => {
                    return (
                        // <span style={{color: '#E76400'}}>{`${r.afterTaxAmount ? `${r.afterTaxAmount}${r.currencyName ? r.currencyName : 'RMB'}` : '-'}`}</span>
                        <span style={{color: '#E76400'}}>{`${r.afterTaxAmount ? `${r.afterTaxAmount}` : '-'}`}</span>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '币别',
                dataIndex: 'currencyName',
                key: 'currencyName',
                width: 120
            },
            {
                className: 'text-overflow-ellipsis',
                title: '派车单数',
                dataIndex: 'orderQuantity',
                key: 'orderQuantity',
                width: 120
            },
            {
                className: 'text-overflow-ellipsis',
                title: '开立人',
                dataIndex: 'operatorName',
                key: 'operatorName',
                width: 120,
                render: val => {
                    return (
                        <ColumnItemBox name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '开立时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 120,
                render: val => {
                    return val && moment(val).format('YYYY-MM-DD')
                }
            }
        ]
    }

    onChangeValue = () => {
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    // 派车列表数据获取
    getData = (params) => {
        const { rApi } = this.props
        let {
            curCode,
            sendCarNumber,
            operatorId,
            carrierId,
            driverId,
            startOrderDate,
            endOrderDate,
            orderLegalId,
            associatePaymentCarrierId,
            expenseOwnMonth,
            estimateNumber
        } = this.state
        params = Object.assign({}, params, curCode === 1 ? {
            sendCarNumber,
            operatorId,
            startOrderDate,
            endOrderDate,
            orderLegalId,
            carrierId,
            driverId
        } : {
            operatorId,
            carrierId,
            driverId,
            startOrderDate,
            endOrderDate,
            orderLegalId,
            associatePaymentCarrierId,
            expenseOwnMonth,
            estimateNumber,
            estimateType: 1
        })
        params = deleteNull(params)
        return new Promise((resolve, reject) => {
            if (curCode === 1) {/* 待开立 */
                rApi.getSendCarList(params)
                    .then(async resp => {
                        let noEstimateList = [...resp.page.records]
                        noEstimateList = noEstimateList.map(item => {
                            item.showFeePop = false
                            return item
                        })
                        await this.setState({ noEstimateList })
                        resolve({
                            dataSource: this.state.noEstimateList,
                            total: resp.page.total
                        })
                    })
                    .catch(err => {
                        resolve({
                            dataSource: [],
                            total: 0
                        })
                        console.log(err)
                    })
            } else {/* 应付预估 */
                rApi.getPayableEstimateList(params)
                    .then(async resp => {
                        let estimateList = [...resp.records]
                        await this.setState({ estimateList })
                        resolve({
                            dataSource: this.state.estimateList,
                            total: resp.total
                        })
                    })
                    .catch(err => {
                        resolve({
                            dataSource: [],
                            total: 0
                        })
                        console.log(err)
                    })
            }
        })
    }

    // 特殊业务列表数据获取
    getSpecData = (params) => {
        const { rApi } = this.props
        let {
            curCode,
            sendCarNumber,
            operatorId,
            carrierId,
            startOrderDate,
            endOrderDate,
            orderLegalId,
            associatePaymentCarrierId,
            expenseOwnMonth,
            estimateNumber,
            specialBusinessId
        } = this.state
        params = Object.assign({}, params, curCode === 1 ? {
            specialBusinessId,
            sendCarNumber,
            operatorId,
            carrierId,
            startOrderDate,
            endOrderDate,
            orderLegalId
        } : {
            operatorId,
            carrierId,
            startOrderDate,
            endOrderDate,
            orderLegalId,
            associatePaymentCarrierId,
            expenseOwnMonth,
            estimateNumber,
            specialBusinessId,
            estimateType: 2
        })
        params = deleteNull(params)
        return new Promise((resolve, reject) => {
            if (curCode === 1) {/* 待开立 */
                rApi.getSpecNoEstimateList(params)
                    .then(async resp => {
                        let specNoEstimateList = [...resp.records]
                        specNoEstimateList = specNoEstimateList.map(item => {
                            item.showFeePop = false
                            return item
                        })
                        await this.setState({ specNoEstimateList })
                        resolve({
                            dataSource: this.state.specNoEstimateList,
                            total: resp.total
                        })
                    })
                    .catch(err => {
                        resolve({
                            dataSource: [],
                            total: 0
                        })
                        console.log(err)
                    })
            } else {/* 应付预估 */
                rApi.getPayableEstimateList(params)
                    .then(async resp => {
                        let specEstimateList = [...resp.records]
                        await this.setState({ specEstimateList })
                        resolve({
                            dataSource: this.state.specEstimateList,
                            total: resp.total
                        })
                    })
                    .catch(err => {
                        resolve({
                            dataSource: [],
                            total: 0
                        })
                        console.log(err)
                    })
            }
        })
    }

    /* 是否可选择 */
    getCheckboxProps = (r) => {
        const { curCode, curType } = this.state
        let selectedKey = curType === 'sendcar' ? 'selectedKeys' : 'specSelectedKeys'
        let selectedKeys = [...this.state[selectedKey]]
        if (curCode === 2) {
            return {
                disabled: false
            }
        }
        if ((r && r.openStatus === 2) || (selectedKeys.length > 0 && (curType === 'sendcar' ? (!selectedKeys.some(item => item.carrierId === r.carrierId) || !selectedKeys.some(item => item.currencyId === r.currencyId) || !selectedKeys.some(item => item.driverId === r.driverId)) : (!selectedKeys.some(item => item.carrierId === r.carrierId) || !selectedKeys.some(item => item.specialBusinessId === r.specialBusinessId))))) {
            return {
                disabled: curCode === 1
            }
        }
        return {
            disabled: false
        }
    }

    /* 待开立列表勾选操作 */
    changeSelect = (selectedRowKeys, { deleteKeys, addKeys }, keyName) => {
        const { curCode, curType } = this.state
        let rt = [...this.state[keyName]]
        if (rt.length < 1 && addKeys.length > 0 && curCode === 1) {
            let target = addKeys[0]
            addKeys = addKeys.filter(item => (curType === 'sendcar' ? ((item.carrierId === target.carrierId) && (item.currencyId === target.currencyId) && (item.driverId === target.driverId)) : ((item.carrierId === target.carrierId) && (item.specialBusinessId === target.specialBusinessId))))
        }
        if (deleteKeys && deleteKeys.length) {
            rt = rt.filter(item => !deleteKeys.some(key => key.id === item.id))
        }
        if (addKeys && addKeys.length) {
            addKeys.forEach(item => {
                if (!rt.some(key => key.id === item.id)) {
                    rt.push(item)
                }
            })
        }
        this.setState({ [keyName]: rt })
    }

    popVisibleChange = (flag, key, index) => {
        let { noEstimateList } = this.state
        noEstimateList[index][key] = flag
        this.setState({ noEstimateList })
    }

    /* 修改列表对应行数据 */
    setRowData = (listKey, index, newData) => {
        let newList = this.state[listKey]
        newList[index] = { ...newData }
        this.setState({ [listKey]: newList })
    }

    /* 生成预估弹窗 */
    openEstimate = async () => {
        const {curType} = this.state
        let keyName = curType === 'sendcar' ? 'selectedKeys' : 'specSelectedKeys'
        let selectedKeys = [...this.state[keyName]]
        let carrierObj = {}
        if (!selectedKeys || selectedKeys.length < 1) {
            message.warning('请选择要开立条目')
            return
        }
        if (selectedKeys[0].billingMethod === 1) {
            this.setState({ doEstimateLoading: true })
            try {
                carrierObj = await this.props.rApi.getCarrierById({id: selectedKeys[0].carrierId})
            } catch (err) {
                carrierObj = null
            }
            this.setState({ doEstimateLoading: false })
        }
        this.setAccount.show({
            openType: 'payable',
            data: selectedKeys,
            carrierObj
        })
    }

    /* 生成预估操作 */
    doEstimate = async (data) => {
        const { curType } = this.state
        let keyName = curType === 'sendcar' ? 'selectedKeys' : 'specSelectedKeys'
        let selectedKeys = [...this.state[keyName]]
        let {
            orderLegalId,
            orderLegalName,
            expenseOwnMonth,
            associatePaymentCarrierId,
            associatePaymentCarrierName,
        } = data
        // console.log('req', selectedKeys, payableEstimateOrderList)
        let carrierId = selectedKeys[0].carrierId,
            carrierName = selectedKeys[0].carrierName,
            carType = selectedKeys[0].carType,
            currencyId = selectedKeys[0].currencyId,
            currencyName = selectedKeys[0].currencyName,
            sendCarIds = selectedKeys.map(item => item.id),
            specialBusinessId = selectedKeys[0].specialBusinessId,
            specialBusinessName = selectedKeys[0].specialBusinessName,
            estimateType = curType === 'sendcar' ? 1 : 2,
            billingMethod = selectedKeys[0].billingMethod
        let payableEstimateOrderList = curType === 'sendcar' ? selectedKeys.map(item => {/* 派车 */
            return {
                sendCarNumber: item.sendCarNumber,
                createTime: item.createTime,
                carrierId: item.carrierId,
                carrierName: item.carrierName,
                driverId: item.driverId,
                driverName: item.driverName,
                phone: item.phone,
                phoneBackup: item.phoneBackup,
                carCode: item.carCode,
                carId: item.carId,
                carType: item.carType,
                carTypeId: item.carTypeId,
                carTypeName: item.carTypeName,
                departure: item.departure,
                destination: item.destination,
                transitPlaceOneId: item.transitPlaceOneId,
                transitPlaceOneName: item.transitPlaceOneName,
                billingMethod: item.billingMethod,
                currencyId: item.currencyId,
                currencyName: item.currencyName,
                estimatedCost: item.estimatedCost,
                afterTaxAmount: item.afterTaxAmount,
                taxes: item.taxes,
                quotationNumberId: item.quotationNumberId,
                quotationNumber: item.quotationNumber,
                stowageNumber: item.stowageNumber,
                businessId: item.id
            }
        }) : selectedKeys.map(item => {/* 特殊业务 */
            return {
                createTime: item.createTime,
                carrierId: item.carrierId,
                carrierName: item.carrierName,
                carrierContactId: item.carrierContactId,
                carrierContactName: item.carrierContactName,
                carrierContactPhone: item.carrierContactPhone,
                departure: item.departure,
                destination: item.destination,
                transitPlaceOneId: item.transitPlaceOneId,
                transitPlaceOneName: item.transitPlaceOneName,
                billingMethod: item.billingMethod,
                currencyId: item.currencyId,
                currencyName: item.currencyName,
                estimatedCost: item.estimatedCost,
                afterTaxAmount: item.afterTaxAmount,
                taxes: item.taxes,
                quotationNumberId: item.quotationNumberId,
                quotationNumber: item.quotationNumber,
                stowageNumber: item.stowageNumber,
                businessId: item.id
            }
        })
        // console.log('req', selectedKeys)
        let orderQuantity = selectedKeys.length,
            afterTaxAmount = payableEstimateOrderList.reduce((rt, cur) => {
                return rt + (cur.afterTaxAmount || 0)
            }, 0),
            totalCost = payableEstimateOrderList.reduce((rt, cur) => {
                return rt + (cur.estimatedCost || 0)
            }, 0)
        /* 请求数据 */
        let reqData = curType === 'sendcar' ? {
            estimateType,
            orderLegalId,
            orderLegalName,
            expenseOwnMonth,
            associatePaymentCarrierId,
            associatePaymentCarrierName,
            payableEstimateOrderList,
            orderQuantity,
            totalCost,
            afterTaxAmount,
            currencyId,
            currencyName,
            carrierId,
            carrierName,
            sendCarIds,
            billingMethod,
            carType
        } : {
            estimateType,
            orderQuantity,
            totalCost,
            afterTaxAmount,
            currencyId,
            currencyName,
            payableEstimateOrderList,
            orderLegalId,
            orderLegalName,
            expenseOwnMonth,
            associatePaymentCarrierId,
            associatePaymentCarrierName,
            carrierId,
            carrierName,
            specialBusinessId,
            specialBusinessName,
            sendCarIds,
        }
        /* 请求数据 */
        const { rApi } = this.props
        return new Promise((resolve, reject) => {
            const APINAME = curType === 'sendcar' ? 'addPayableEstimate' : 'addPayableEstimate'
            rApi[APINAME](reqData)
                .then(res => {
                    let listKey = curType === 'sendcar' ? 'noEstimateList' : 'specNoEstimateList'
                    let selectedKey = curType === 'sendcar' ? 'selectedKeys' : 'specSelectedKeys'
                    let list = [...this.state[listKey]]
                    let selectedKeys = [...this.state[selectedKey]]
                    list = list.map(item => {
                        if (selectedKeys.some(k => k.id === item.id)) {
                            item.openStatus = 2
                        }
                        return item
                    })
                    this.setState({ [listKey]: list, [selectedKey]: [] })
                    // this.searchCriteria()
                    message.success('操作成功')
                    resolve()
                })
                .catch(err => {
                    message.error(err.msg || '操作失败')
                    reject(err)
                })
        })
    }

    /* 待开立查看 */
    lookDetails = (r) => {
        this.sendcarDetails.show({
            ...r
        })
    }

    /* 查看预估单明细 */
    showDetails = (r) => {
        const {curType} = this.state
        this.payableDetails.show({
            ...r,
            openData: {
                type: curType
            }
        })
    }

    /* 删除预估单 */
    deleteEstimate = (r) => {
        const {rApi} = this.props
        const {curType} = this.state
        const APINAME = curType === 'sendcar' ? 'deletePayableEstimate' : 'deletePayableEstimate'
        rApi[APINAME]({
            id: r.id
        })
            .then(res => {
                this.onChangeValue()
                message.success('操作成功')
            })
            .catch(err => {
                message.error(err.msg || '操作失败')
            })
    }

    // 导出操作
    exportDetails = async () => {
        const {curType} = this.state
        const { rApi } = this.props
        const APINAME = curType === 'sendcar' ? 'getPayableEstimateList' : 'getPayableEstimateList'
        let estimateType = curType === 'sendcar' ? 1 : 2
        if (this.state.exportLoading) {
            return
        }
        await this.setState({ exportLoading: true })
        rApi[APINAME]({
            limit: 99999,
            offset: 0,
            estimateType
        })
            .then(res => {
                this.saveExcel(res.records)
                this.setState({ exportLoading: false })
            })
            .catch(err => {
                this.setState({ exportLoading: false })
            })
    }

    /* 导出数据到EXCEL */
    saveExcel(list) {
        const { estimateColumns } = this.state
        let fileName = '应付预估数据',
            sheetHeader = estimateColumns.filter(item => item.title).map(item => {
                return item.title
            }),
            sheetFilter = estimateColumns.filter(item => item.title).map(item => {
                return item.dataIndex
            }),
            sheetName = 'sheet1',
            sheetData = list.map(item => {
                item.expenseOwnMonth = moment(item.expenseOwnMonth).format('YYYY-MM-DD')
                item.createTime = moment(item.createTime).format('YYYY-MM-DD')
                return item
            })
        let opt = {
            fileName,
            datas: [{
                sheetData,
                sheetName,
                sheetHeader,
                sheetFilter
            }]
        }
        let toExcel = new JsExportExcel(opt)
        toExcel.saveExcel()
    }

    /* 切换类型 派车或特殊业务 */
    changeType = e => {
        let curType = e ? e.target.value : null
        this.setState({
            curType,
            selectedKeys: [],
            estimateSelectedKeys: [],
            specSelectedKeys: [],
            specEstimateSelectedKeys: [],
            sendCarNumber: null,
            operatorId: null,
            carrierId: null,
            startOrderDate: null,
            endOrderDate: null,
            orderLegalId: null,
            associatePaymentCarrierId: null,
            expenseOwnMonth: null,
            estimateNumber: null,
            specialBusinessId: null,
            forceRender: true
        }, () => {
            this.setState({forceRender: false})
            this.onChangeValue()
        })
    }

    /* 开立状态切换 待开立或应付预估 */
    changeCode = e => {
        let curCode = e ? e.target.value : 1
        this.setState({
            curCode,
            selectedKeys: [],
            estimateSelectedKeys: [],
            specSelectedKeys: [],
            specEstimateSelectedKeys: [],
            sendCarNumber: null,
            operatorId: null,
            carrierId: null,
            startOrderDate: null,
            endOrderDate: null,
            orderLegalId: null,
            associatePaymentCarrierId: null,
            expenseOwnMonth: null,
            estimateNumber: null,
            specialBusinessId: null,
            forceRender: true
        }, () => {
            this.setState({ forceRender: false })
            this.onChangeValue()
        })
    }

    /* 自定义表格标题按钮 */
    cusTableHeader = () => {
        const { curCode, exportLoading, doEstimateLoading } = this.state
        if (curCode === 1) {
            return (
                <FunctionPower power={power.ADD_DATA}>
                    <Button style={{ marginRight: '10px', verticalAlign: 'middle' }} onClick={this.openEstimate} loading={doEstimateLoading}>生成预估单</Button>
                </FunctionPower>
            )
        } else {
            return(
                <Button style={{ marginRight: '10px', verticalAlign: 'middle' }} loading={exportLoading} onClick={this.exportDetails} icon='export'>导出</Button>
            )
        }
    }

    /* 自定义表格标题 */
    tableHeaderTitle = () => {
        let { curCode } = this.state
        return (
            <RadioGroup
                onChange={this.changeCode}
                value={curCode}
            >
                <RadioButton value={1}>&ensp;待开立&ensp;</RadioButton>
                <RadioButton value={2}>应付预估</RadioButton>
            </RadioGroup>
        )
    }

    /* 自定义表格操作 */
    customAction = ({ val, record, index }) => {
        const { curCode } = this.state
        if (curCode === 1) {
            return (
                <FunctionPower power={power.LOOK_DATA}>
                    <span className='action-button' onClick={e => this.lookDetails(record)}>查看</span>
                </FunctionPower>
            )
        } else {
            return(
                <Fragment>
                    <FunctionPower power={power.LOOK_DETAILS}>
                        <span
                            className='action-button'
                            onClick={e => this.showDetails({ ...record, _deepIndex: index })}
                        >明细</span>
                    </FunctionPower>
                    <FunctionPower power={power.DELETE_DATA}>
                        <Popconfirm
                            title="确定要删除此项?"
                            onConfirm={() => this.deleteEstimate(record)}
                            okText="确定"
                            cancelText="取消"
                        >
                            <span
                                className='action-button'
                            >删除</span>
                        </Popconfirm>
                    </FunctionPower>
                </Fragment>
            )
        }
    }

    /* 
        render渲染 
    */
    render() {
        let { mobxBaseData } = this.props
        let tableHeight = mobxBaseData.tableHeight
        const {
            curType,
            curCode,
            selectedKeys,
            estimateSelectedKeys,
            columns,
            estimateColumns,
            startOrderDate,
            endOrderDate,
            forceRender,
            specColumns,
            specEstimateColumns,
            specSelectedKeys,
            specEstimateSelectedKeys
        } = this.state

        return (
            <div className='page-charge-payable' ref={v => this.rootDom = v}>
                <SetAccount
                    parent={this}
                    getThis={v => this.setAccount = v}
                    doAccount={this.doEstimate}
                    title='预估'
                />
                <SendcarDetails
                    parent={this}
                    getThis={v => this.sendcarDetails = v}
                />
                <PayableDetails
                    parent={this}
                    getThis={v => this.payableDetails = v}
                    setRowData={this.setRowData}
                    title='预估'
                />
                {
                    !forceRender &&
                    <HeaderView
                        parent={this}
                        title={(curCode === 1 && (curType === 'sendcar' || curType === 'special')) ? '派车单号' : (curCode === 2 && curType === 'sendcar') ? '预估单号' : '预估单号'}
                        onChangeSearchValue={
                            keyword => {
                                let key = (curCode === 1 && (curType === 'sendcar' || curType === 'special')) ? 'sendCarNumber' : (curCode === 2 && curType === 'sendcar') ? 'estimateNumber' : 'estimateNumber'
                                this.setState({ [key]: trim(keyword) }, this.onChangeValue())
                            }
                        }
                    >
                        <div style={{width: 160, marginRight: 10}}>
                            <RadioGroup
                                onChange={this.changeType}
                                defaultValue="sendcar"
                                value={curType}
                                buttonStyle="solid"
                            >
                                <RadioButton value="sendcar">&emsp;派车&emsp;</RadioButton>
                                <RadioButton value="special">特殊业务</RadioButton>
                            </RadioGroup>
                        </div>
                        <RemoteSelect
                            onChangeValue={
                                e => {
                                    let id = e ? e.id : 0
                                    this.setState({ operatorId: e ? id : null }, this.onChangeValue())
                                }
                            }
                            params={{ limit: 99999, offset: 0 }}
                            getDataMethod={'getChargeOperatorList'}
                            placeholder='创建人'
                            labelField={'name'}
                            dealData={arr => {
                                return arr.map(item => ({
                                    id: item.operator_id,
                                    name: item.operator_name
                                }))
                            }}
                            forceRender={forceRender}
                        />
                        <RemoteSelect
                            onChangeValue={
                                e => {
                                    let id = e ? e.id : 0
                                    this.setState({ orderLegalId: e ? id : null }, this.onChangeValue())
                                }
                            }
                            params={{ limit: 99999, offset: 0 }}
                            getDataMethod={'getLegalPersons'}
                            placeholder='接单法人'
                            labelField={'name'}
                            forceRender={forceRender}
                        />
                        {
                            !forceRender &&
                            <div style={{ width: 290 }}>
                                <TimePicker
                                    startTime={startOrderDate}
                                    endTime={endOrderDate}
                                    changeStartTime={(date, dateStr) => {
                                        this.setState({
                                            startOrderDate: dateStr
                                        }, this.onChangeValue())
                                    }}
                                    startTitle={curCode === 1 ? '下单时间' : '开立日期'}
                                    endTitle={curCode === 1 ? '下单时间' : '开立日期'}
                                    changeEndTime={(date, dateStr) => {
                                        this.setState({
                                            endOrderDate: date ? moment(date).add(1, 'days').format('YYYY-MM-DD') : null
                                        }, this.onChangeValue())
                                    }}
                                    getFieldDecorator={null}
                                    pickerWidth={{ width: 130 }}
                                />
                            </div>
                        }
                        {
                            curType === 'special' &&
                            <RemoteSelect
                                text='特殊业务'
                                onChangeValue={
                                    e => {
                                        let id = e ? e.id : 0
                                        this.setState({ specialBusinessId: e ? id : null }, this.onChangeValue())
                                    }
                                }
                                placeholder='业务类型'
                                forceRender={forceRender}
                            />
                        }
                        {
                            curCode === 2 &&
                            <RemoteSelect
                                onChangeValue={
                                    e => {
                                        let id = e ? e.id : 0
                                        this.setState({ associatePaymentCarrierId: e ? id : null }, this.onChangeValue())
                                    }
                                }
                                params={{ limit: 99999, offset: 0 }}
                                getDataMethod={'getCarrierList'}
                                placeholder='付款承运商'
                                labelField={'abbreviation'}
                                forceRender={forceRender}
                            />
                        }
                        {
                            (curCode === 2 && !forceRender) &&
                            <MonthPicker
                                placeholder='所属月份'
                                format={'YYYY-MM'}
                                onChange={(d, ds) => {
                                    this.setState({ expenseOwnMonth: d ? moment(d).format('YYYY-MM') : null }, this.onChangeValue())
                                }}
                            />
                        }
                        <RemoteSelect
                            onChangeValue={
                                e => {
                                    let id = e ? e.id : 0
                                    this.setState({ carrierId: e ? id : null }, this.onChangeValue())
                                }
                            }
                            params={{ limit: 99999, offset: 0 }}
                            getDataMethod={'getCarrierFilterList'}
                            placeholder='承运商名称'
                            labelField={'abbreviation'}
                            forceRender={forceRender}
                        />
                        {
                            this.state.carrierId === -1 &&
                            <RemoteSelect
                                onChangeValue={
                                    e => {
                                        let id = e ? e.id : 0
                                        this.setState({ driverId: e ? id : null }, this.onChangeValue())
                                    }
                                }
                                params={{ limit: 99999, offset: 0 }}
                                getDataMethod={'getDrivers'}
                                placeholder='司机名称'
                                labelField={'name'}
                                forceRender={forceRender}
                            />
                        }
                    </HeaderView>
                }
                {
                    curType === 'sendcar' ?
                        <Table
                            className='sd-block page-table'
                            isHideAddButton
                            isHideDeleteButton
                            isNoneNum
                            parent={this}
                            getThis={v => this.tableView = v}
                            actionWidth={90}
                            actionView={this.customAction}
                            title={null}
                            cusTableHeaderButton={this.cusTableHeader()}
                            TableHeaderTitle={this.tableHeaderTitle()}
                            getData={this.getData}
                            columns={curCode === 1 ? columns : estimateColumns}
                            columnKey={curCode === 1 ? 'columns' : 'estimateColumns'}
                            tableHeight={tableHeight}
                            selectedPropsRowKeys={curCode === 1 ? selectedKeys : estimateSelectedKeys}
                            onChangeSelect={(selectedRowKeys, { deleteKeys, addKeys }) => this.changeSelect(selectedRowKeys, { deleteKeys, addKeys }, curCode === 1 ? 'selectedKeys' : 'estimateSelectedKeys')}
                            getCheckboxProps={this.getCheckboxProps}
                        />
                        :
                        <Table
                            className='sd-block page-table'
                            isHideAddButton
                            isHideDeleteButton
                            isNoneNum
                            parent={this}
                            getThis={v => this.tableView = v}
                            actionWidth={90}
                            actionView={this.customAction}
                            title={null}
                            cusTableHeaderButton={this.cusTableHeader()}
                            TableHeaderTitle={this.tableHeaderTitle()}
                            getData={this.getSpecData}
                            columns={curCode === 1 ? specColumns : specEstimateColumns}
                            columnKey={curCode === 1 ? 'specColumns' : 'specEstimateColumns'}
                            tableHeight={tableHeight}
                            selectedPropsRowKeys={curCode === 1 ? specSelectedKeys : specEstimateSelectedKeys}
                            onChangeSelect={(selectedRowKeys, { deleteKeys, addKeys }) => this.changeSelect(selectedRowKeys, { deleteKeys, addKeys }, curCode === 1 ? 'specSelectedKeys' : 'specEstimateSelectedKeys')}
                            getCheckboxProps={this.getCheckboxProps}
                        />
                }
          </div>
        )
    }
}

export default ChargePayable