import React, { Fragment } from 'react'
import { DatePicker, Button, message, Popconfirm, Form, Radio } from 'antd'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { deleteNull, trim } from '@src/utils'
import { toOrderAdd } from '@src/views/layout/to_page'
import TimePicker from '@src/components/time_picker'
import moment from 'moment'
import ReceivableDetails from '../../public/ReceivableDetails'
import CostDetails from '../../public/CostDetails'
import SetAccount from '../../public/SetAccount'
import Logs from '../../public/Logs'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { children, id } from './power'
import JsExportExcel from 'js-export-excel'
import './index.less'

const power = Object.assign({}, children, id)
const { MonthPicker } = DatePicker
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

/**
 * 应收对账
 * @class AccountReceivable
 * @extends {Parent}
*/
@inject('rApi', 'mobxTabsData', 'mobxBaseData')
@observer
class AccountReceivable extends Parent {

    state = {
        curCode: 1, //当前选择 1：待开立 2：应收对账
        estimateLoading: false,
        exportLoading: false,
        statusLoading1: false,
        statusLoading2: false,
        statusLoading3: false,
        statusLoading4: false,
        selectedKeys: [], //待开立选中行
        estimateSelectedKeys: [], //应收对账选中行
        clientId: null,
        projectId: null,
        operatorId: null,
        startOrderDate: null,
        endOrderDate: null,
        clientLegalName: null,
        orderLegalId: null,
        expenseOwnMonth: null,
        orderNumber: null,
        reconciliationNumber: null,
        noAccountList: [],
        accountList: [],
        estimateSaveLoading: false,
        columns: [
            {
                className: 'text-overflow-ellipsis col-customstatus',
                title: '状态',
                dataIndex: 'reconciliationStatus',
                key: 'reconciliationStatus',
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
                    if (val && val === 2) {
                        return(
                            <span className='do'>已开立</span>
                        )
                    } else {
                        return(
                            <span className='undo'>未开立</span>
                        )
                    }
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '总费用',
                dataIndex: 'estimatedCost',
                key: 'estimatedCost',
                width: 160,
                render: (val, r) => {
                    return (
                        <div style={{ width: 139 }} className="text-overflow-ellipsis" title={val && !isNaN(val) ? `${val}(${r.currencyName || 'RMB'})` : '-'}>
                            <span style={{ color: '#E76400' }}>{val && !isNaN(val) ? `${val}${r.currencyName || 'RMB'}` : '-'}</span>
                        </div>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '订单号',
                dataIndex: 'orderNumber',
                key: 'orderNumber',
                width: 140,
                render: (val, r) => {
                    return(
                        <FunctionPower power={power.LOOK_ORDER}>
                            <span onClick={e => this.seeOrder(r)} style={{ cursor: 'pointer', color: '#18B583', textDecoration: 'underline' }}>{val}</span>
                        </FunctionPower>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '下单日期',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 120,
                render: (val, r) => {
                    return val && moment(val).format('YYYY-MM-DD')
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '客户简称',
                dataIndex: 'clientName',
                key: 'clientName',
                width: 120,
                render: val => {
                    return (
                        <ColumnItemBox name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '项目名称',
                dataIndex: 'projectName',
                key: 'projectName',
                width: 170,
                render: val => {
                    return(
                        <ColumnItemBox name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '客户法人',
                dataIndex: 'clientLegalName',
                key: 'clientLegalName',
                width: 120,
                render: val => {
                    return(
                        <ColumnItemBox name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '接单法人',
                dataIndex: 'orderLegalName',
                key: 'orderLegalName',
                width: 200,
                render: val => {
                    return(
                        <ColumnItemBox name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '报价路线',
                dataIndex: 'departure',
                key: 'departure',
                width: 400,
                render: (text, r, index) => {
                    return (
                        <ColumnItemBox name={r.departure ? `${r.departure}${r.transitPlaceOneName ? `-${r.transitPlaceOneName}` : ''}-${r.destination}` : '-'} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '发货方',
                dataIndex: 'senderList',
                key: 'senderList',
                width: 150,
                render: (val, r) => {
                    return(
                        <ColumnItemBox name={val && val.length && val[0].name || ''} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '收货方',
                dataIndex: 'receiverList',
                key: 'receiverList',
                width: 150,
                render: (val, r) => {
                   return(
                       <ColumnItemBox name={val && val.length && val[0].name || ''} />
                   )
                }
            }
        ],
        estimateColumns: [
            {
                className: 'text-overflow-ellipsis',
                title: '对账单号',
                dataIndex: 'reconciliationNumber',
                key: 'reconciliationNumber',
                fixed: 'left',
                width: 140,
                render: (val, r, index) => {
                    return (
                        <FunctionPower power={power.LOOK_ORDER}>
                            <span onClick={e => this.showModal({type: 'details', payload: {...r, _deepIndex: index}})} style={{ cursor: 'pointer', color: '#18B583', textDecoration: 'underline' }}>{val}</span>
                        </FunctionPower>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '客户名称',
                dataIndex: 'clientName',
                key: 'clientName',
                width: 140,
                render: val => {
                    return (
                        <ColumnItemBox name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '客户法人',
                dataIndex: 'clientLegalName',
                key: 'clientLegalName',
                width: 140,
                render: val => {
                    return(
                        <ColumnItemBox name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '接单法人',
                dataIndex: 'orderLegalName',
                key: 'orderLegalName',
                width: 140,
                render: val => {
                    return (
                        <ColumnItemBox name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '项目名称',
                dataIndex: 'projectName',
                key: 'projectName',
                width: 160,
                render: val => {
                    return(
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
                    return val ? moment(val).format('YYYY-MM') : null
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '总费用',
                dataIndex: 'totalCost',
                key: 'totalCost',
                width: 140,
                render: (val, r) => {
                    let rt = val + (r.replenishment || 0)
                    return (
                        // <span style={{ color: '#E76400' }}>{`${rt ? rt : 0}${r.currencyName || 'RMB'}`}</span>
                        <span style={{ color: '#E76400' }}>{`${rt ? rt : 0}`}</span>
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
                title: '订单数',
                dataIndex: 'orderQuantity',
                key: 'orderQuantity',
                width: 120
            },
            {
                className: 'text-overflow-ellipsis col-status',
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 140,
                render: val => {
                    if (val && val === 3) {
                        return (
                            <span className='point three'>财务确认</span>
                        )
                    } else if (val && val === 2) {
                        return (
                            <span className='point two'>已确认</span>
                        )
                    } else {
                        return (
                            <span className='point one'>待确认</span>
                        )
                    }
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '开立人',
                dataIndex: 'operatorName',
                key: 'operatorName',
                width: 140,
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
                width: 140,
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

    /* 列表数据获取 */
    getData = (params) => {
        const { rApi } = this.props
        let {
            orderNumber,
            reconciliationNumber, 
            clientId,
            projectId,
            startOrderDate,
            endOrderDate,
            expenseOwnMonth,
            curCode,
            clientLegalName,
            orderLegalId,
            operatorId
        } = this.state
        if (curCode === 1) {/* 待开立 */
            params = Object.assign({}, params, {
                orderNumber,
                clientId,
                projectId,
                startOrderDate,
                endOrderDate,
                reconciliationStatus: 1,
                clientLegalName,
                orderLegalId,
                operatorId
            })
            params = deleteNull(params)
            return new Promise((resolve, reject) => {
                rApi.accountReceivableList(params)
                    .then(async res => {
                        // console.log('list', res.records)
                        let noAccountList = [...res.records]
                        await this.setState({ noAccountList })
                        resolve({
                            dataSource: this.state.noAccountList,
                            total: res.total
                        })
                    })
                    .catch(err => {
                        resolve({
                            dataSource: [],
                            total: 0
                        })
                        console.log(err)
                    })
            })
        } else if (curCode === 2) {
            params = Object.assign({}, params, {
                reconciliationNumber,
                clientId,
                projectId,
                startOrderDate,
                endOrderDate,
                expenseOwnMonth,
                clientLegalName,
                orderLegalId,
                operatorId
            })
            params = deleteNull(params)
            return new Promise((resolve, reject) => {
                rApi.getAccountReceivableList(params)
                    .then(async res => {
                        let accountList = [...res.records]
                        await this.setState({ accountList })
                        resolve({
                            dataSource: this.state.accountList,
                            total: res.total
                        })
                    })
                    .catch(err => {
                        resolve({
                            dataSource: [],
                            total: 0
                        })
                        console.log(err)
                    })
            })
        } else {
            return new Promise((resolve, reject) => {
                resolve({
                    dataSource: [],
                    total: 0
                })
            })
        }
    }

    /* 是否可选择 */
    getCheckboxProps = (r) => {
        const { selectedKeys, estimateSelectedKeys, curCode } = this.state
        if (curCode === 1) {
            if ((r && (r.reconciliationStatus === 2 || (!r.estimatedCost && r.estimatedCost !== 0))) || (selectedKeys.length > 0 && !selectedKeys.some(item => item.clientId === r.clientId)) || (selectedKeys.length > 0 && !selectedKeys.some(item => item.projectId === r.projectId)) || (selectedKeys.length > 0 && !selectedKeys.some(item => item.currencyId === r.currencyId))) {
                return {
                    disabled: true
                }
            }
        } else if (curCode === 2) {
            if ( r && (estimateSelectedKeys.length > 0 && !estimateSelectedKeys.some(item => item.status === r.status)) ) {
                return {
                    disabled: true
                }
            }
        }
        return {
            disabled: false
        }
    }

    /* 待开立列表勾选操作 */
    changeSelect = (selectedRowKeys, { deleteKeys, addKeys }, keyName) => {
        const { curCode } = this.state
        let rt = [...this.state[keyName]]
        if (rt.length < 1 && addKeys.length > 0) {
            let target = addKeys[0]
            if (curCode === 1) {
                addKeys = addKeys.filter(item => (item.clientId === target.clientId && item.projectId === target.projectId && item.currencyId === target.currencyId))
            } else if (curCode === 2) {
                addKeys = addKeys.filter(item => (item.status === target.status))
            } else {}
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

    /* 修改列表对应行数据 */
    setRowData = (listKey, index, newData) => {
        let newList = this.state[listKey]
        newList[index] = { ...newData }
        this.setState({[listKey]: newList})
    }

    /* 查看 => 跳转到查看页面 */
    seeOrder = (record) => {
        //console.log('onLook', record)
        let { mobxTabsData } = this.props
        toOrderAdd(mobxTabsData, {
            id: record.id,
            pageData: {
                ...record,
                openType: 2
            }
        })
    }

    /* 对账单明细弹窗 */
    showModal = ({type, payload}) => {
        switch (type) {
            case 'doAccount':/* 生成对账 */
                let {
                    selectedKeys
                } = this.state
                if (!selectedKeys || selectedKeys.length < 1) {
                    message.warning('请选择要开立条目')
                    return
                }
                this.estimateSet.show({
                    openType: 'receivable',
                    data: selectedKeys
                })
                break
            case 'costDetails':/* 费用明细 */
                this.costDetails.show({
                    ...payload
                })
                break
            case 'details':/* 对账明细 */
                this.receivableDetails.show({
                    ...payload
                })
                break
            case 'logs':/* 操作日志 */
                this.logs.show({
                    ...payload
                })
                break
            default:
                console.log('no found type')
        }
    }

    /* 确认取消状态改变 */
    changeStatus = async type => {
        let { estimateSelectedKeys } = this.state
        if (estimateSelectedKeys.length < 1) {
            message.warning('请选择条目')
            return
        }
        const {rApi} = this.props
        let APINAME = '',
            loadingKey = ''
        let ids = estimateSelectedKeys.map(item => item.id)
        switch (type) {
            case 1:
                APINAME = 'confirmAccountReceivable'
                loadingKey = `statusLoading${type}`
                break;

            case 2:
                APINAME = 'cancelAccountReceivable'
                loadingKey = `statusLoading${type}`
                break;

            case 3:
                APINAME = 'confirmFinanceReceivable'
                loadingKey = `statusLoading${type}`
                break;

            case 4:
                APINAME = 'cancelFinanceReceivable'
                loadingKey = `statusLoading${type}`
                break;
        
            default:
                break;
        }
        await this.setState({ [loadingKey]: true })
        rApi[APINAME](ids)
            .then(resp => {
                message.success('操作成功')
                this.searchCriteria()
                this.setState({ [loadingKey]: false, estimateSelectedKeys: [] })
            })
            .catch(err => {
                message.error(err.msg || '操作失败')
                this.setState({ [loadingKey]: false })
            })
    }

    // /* 编辑对账单 */
    // editMounth = (r, rIndex) => {
    //     let {accountList} = this.state
    //     accountList[rIndex].edit = true
    //     this.setState({accountList})
    // }
    // /* 保存编辑对账单 */
    // saveMounth = async (r, rIndex) => {
    //     const {rApi} = this.props
    //     let { accountList, estimateSaveLoading } = this.state
    //     if (estimateSaveLoading) {
    //         return
    //     }
    //     await this.setState({ estimateSaveLoading: true })
    //     let expenseOwnMonth = accountList[rIndex].newMonth
    //     let reqData = {
    //         id: r.id,
    //         expenseOwnMonth
    //     }
    //     rApi.editAccountReceivable(reqData)
    //         .then(res => {
    //             accountList[rIndex].edit = false
    //             accountList[rIndex].expenseOwnMonth = expenseOwnMonth
    //             this.setState({ accountList, estimateSaveLoading: false })
    //             message.success('保存成功')
    //         })
    //         .catch(err => {
    //             this.setState({ estimateSaveLoading: false })
    //             message.error(err.msg || '操作失败')
    //         })
    // }

    /* 删除对账单 */
    delAccount = (r) => {
        const {rApi} = this.props
        rApi.delAccountReceivable({
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

    /* 生成对账操作 */
    doAccount = async (data) => {
        let {
            selectedKeys
        } = this.state
        let {
            orderLegalId,
            orderLegalName,
            clientLegalId,
            clientLegalName,
            expenseOwnMonth
        } = data
        let receivableEstimateOrderList = selectedKeys.map(item => {
            let rt = {
                afterTaxAmount: item.afterTaxAmount,
                clientId: item.clientId,
                clientName: item.clientName,
                currencyId: item.currencyId,
                currencyName: item.currencyName,
                departure: item.departure,
                destination: item.destination,
                estimatedCost: item.estimatedCost,
                orderId: item.id,
                orderLegalId: item.orderLegalId,
                orderLegalName: item.orderLegalName,
                orderNumber: item.orderNumber,
                orderType: item.orderType,
                projectId: item.projectId,
                projectName: item.projectName,
                taxes: item.taxes
            }
            return rt
        })
        let clientId = selectedKeys[0].clientId,
            clientName = selectedKeys[0].clientName,
            currencyId = selectedKeys[0].currencyId,
            currencyName = selectedKeys[0].currencyName,
            projectId = selectedKeys[0].projectId,
            projectName = selectedKeys[0].projectName,
            orderQuantity = receivableEstimateOrderList.length,
            afterTaxAmount = receivableEstimateOrderList.reduce((rt, cur) => {
                return rt + (cur.afterTaxAmount || 0)
            }, 0),
            totalCost = receivableEstimateOrderList.reduce((rt, cur) => {
                return rt + (cur.estimatedCost || 0)
            }, 0)
        /* 请求数据 */
        let reqData = {
            clientId,
            clientName,
            currencyId,
            currencyName,
            orderQuantity,
            totalCost,
            afterTaxAmount,
            receivableEstimateOrderList,
            orderLegalId,
            orderLegalName,
            clientLegalId,
            clientLegalName,
            expenseOwnMonth,
            projectId,
            projectName
        }
        /* 请求数据 */
        const { rApi } = this.props
        return new Promise((resolve, reject) => {
            rApi.addAccountReceivable(reqData)
                .then(res => {
                    let { noAccountList, selectedKeys } = this.state
                    noAccountList = noAccountList.map(item => {
                        if (selectedKeys.some(k => k.id === item.id)) {
                            item.reconciliationStatus = 2
                        }
                        return item
                    })
                    this.setState({ noAccountList, selectedKeys: [] })
                    message.success('操作成功')
                    resolve()
                })
                .catch(err => {
                    message.error(err.msg || '操作失败')
                    reject(err)
                })
        })
    }

    /* 开立状态切换 待开立或应收对账 */
    changeCode = e => {
        let curCode = e ? e.target.value : 1
        this.setState({
            curCode,
            selectedKeys: [],
            estimateSelectedKeys: []
        }, () => {
            this.onChangeValue()
            this.setState({
                orderNumber: null,
                reconciliationNumber: null,
                operatorId: null
            })
        })
    }

    /* 自定义表格标题按钮 */
    cusTableHeader = () => {
        const { estimateLoading, exportLoading, curCode, statusLoading1, statusLoading2, statusLoading3, statusLoading4 } = this.state
        return (
            <Fragment>
                {
                    curCode === 1 ?
                    <FunctionPower power={power.ADD_ACCOUNT}>
                        <Button
                            style={{ marginRight: '10px', verticalAlign: 'middle', verticalAlign: 'middle' }}
                            onClick={e => this.showModal({type: 'doAccount', payload: null})}
                            loading={estimateLoading}
                        >
                            生成对账单
                        </Button>
                    </FunctionPower>
                    :
                    <Fragment>
                        <FunctionPower power={power.CONFIRM_FINANCE}>
                            <Button
                                style={{ marginRight: '10px', verticalAlign: 'middle', verticalAlign: 'middle' }}
                                onClick={e => this.changeStatus(3)}
                                loading={statusLoading3}
                            >
                                财务确认
                            </Button>
                        </FunctionPower>
                        <FunctionPower power={power.CANCEL_FINANCE}>
                            <Button
                                style={{ marginRight: '10px', verticalAlign: 'middle', verticalAlign: 'middle' }}
                                onClick={e => this.changeStatus(4)}
                                loading={statusLoading4}
                            >
                                取消财务确认
                            </Button>
                        </FunctionPower>
                        <FunctionPower power={power.CONFIRM_ACCOUNT}>
                            <Button
                                style={{ marginRight: '10px', verticalAlign: 'middle', verticalAlign: 'middle' }}
                                onClick={e => this.changeStatus(1)}
                                loading={statusLoading1}
                            >
                                对账单确认
                            </Button>
                        </FunctionPower>
                        <FunctionPower power={power.CANCEL_ACCOUNT}>
                            <Button
                                style={{ marginRight: '10px', verticalAlign: 'middle', verticalAlign: 'middle' }}
                                onClick={e => this.changeStatus(2)}
                                loading={statusLoading2}
                            >
                                取消对账单确认
                            </Button>
                        </FunctionPower>
                        <Button
                            style={{ marginRight: '10px', verticalAlign: 'middle', verticalAlign: 'middle' }}
                            onClick={this.doExport}
                            loading={exportLoading}
                        >
                            导出
                        </Button>
                    </Fragment>
                }
            </Fragment>
        )
    }

    // 导出
    doExport = async () => {
        this.setState({ exportLoading: true })
        let {
            reconciliationNumber,
            clientId,
            projectId,
            startOrderDate,
            endOrderDate,
            expenseOwnMonth,
            clientLegalName,
            orderLegalId,
            operatorId
        } = this.state
        let res = null
        let reqData = {
            reconciliationNumber,
            clientId,
            projectId,
            startOrderDate,
            endOrderDate,
            expenseOwnMonth,
            clientLegalName,
            orderLegalId,
            operatorId
        }
        try {
            res = await this.props.rApi.exportAccountReceivableList(reqData)
            let fileName = `应收对账.xlsx`
            let header = res.headers
            let contentDsposition = header['content-disposition']
            contentDsposition = contentDsposition.split(';')[1]
            fileName = window.decodeURIComponent(contentDsposition.replace('filename=', ''))
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            this.setState({
                exportLoading: false
            })
        } catch (error) {
            // console.error(error)
            this.setState({ exportLoading: false })
            message.error(error.msg || '操作失败')
            return
        }
    }

    /* 导出数据到EXCEL */
    saveExcel(list = []) {
        const { estimateColumns } = this.state
        let fileName = '对账单',
            sheetHeader = estimateColumns.filter(item => item.title && item.title !== '操作人').map(item => {
                return item.title
            }),
            sheetFilter = estimateColumns.filter(item => item.title).map(item => {
                return item.dataIndex
            }),
            sheetName = 'sheet1',
            sheetData = list.map(item => ({
                ...item,
                createTime: moment(item.createTime).format('YYYY-MM-DD')
            }))
            console.log('data', sheetData)
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


    /* 自定义表格标题 */
    tableHeaderTitle = () => {
        let { curCode } = this.state
        return (
            <div style={{ width: 160, marginRight: 10 }}>
                <RadioGroup
                    onChange={this.changeCode}
                    value={curCode}
                    buttonStyle="solid"
                >
                    <RadioButton value={1}>&ensp;待开立&ensp;</RadioButton>
                    <RadioButton value={2}>应收对账</RadioButton>
                </RadioGroup>
            </div>
        )
    }

    /* 自定义表格操作 */
    customAction = ({ text, record, index }) => {
        const { curCode } = this.state
        if (curCode === 1) {
            return(
                <FunctionPower power={power.LOOK_DATA}>
                    <span
                        className='action-button'
                        onClick={e => this.showModal({type: 'costDetails', payload: record})}
                    >查看</span>
                </FunctionPower>
            )
        } else if (curCode === 2) {
            return(
                <Fragment>
                    <FunctionPower power={power.LOOK_DETAILS}>
                        <span
                            className='action-button'
                            onClick={e => this.showModal({type: 'logs', payload: record})}
                        >日志</span>
                    </FunctionPower>
                    {/* {
                        record.edit ?
                            <span
                                className='action-button'
                                style={{color: '#333'}}
                                onClick={e => this.saveMounth(record, index)}
                            >保存</span>
                            :
                            <FunctionPower power={power.DO_EDIT}>
                                <span
                                    className='action-button'
                                    onClick={e => this.editMounth(record, index)}
                                >备注</span>
                            </FunctionPower>
                    } */}
                    {
                        record.status !== 3 &&
                        <FunctionPower power={power.DO_DELETE}>
                            <Popconfirm
                                title="确定要删除此项?"
                                onConfirm={() => this.delAccount(record)}
                                okText="确定"
                                cancelText="取消"
                            >
                                <span
                                    className='action-button'
                                >删除</span>
                            </Popconfirm>
                        </FunctionPower>
                    }
                </Fragment>
            )
        } else {
            return null
        }
    }

    render() {
        let {
            columns,
            estimateColumns,
            curCode,
            selectedKeys,
            startOrderDate,
            endOrderDate,
            estimateSelectedKeys
        } = this.state
        let { mobxBaseData } = this.props
        let tableHeight = mobxBaseData.tableHeight

        return (
            <div className='page-account-receivable' ref={v => this.rootDom = v}>
                <ReceivableDetails
                    parent={this}
                    getThis={v => this.receivableDetails = v}
                    setRowData={this.setRowData}
                    title='对账'
                />
                <Logs
                    parent={this}
                    getThis={v => this.logs = v}
                />
                <CostDetails
                    parent={this}
                    getThis={v => this.costDetails = v}
                />
                <SetAccount
                    parent={this}
                    getThis={v => this.estimateSet = v}
                    doAccount={this.doAccount}
                    title='对账'
                />
                <HeaderView
                    parent={this}
                    title={curCode === 1 ? '订单号' : '对账单号'} 
                    onChangeSearchValue={
                            val => {
                                let key = curCode === 1 ? 'orderNumber' : 'reconciliationNumber'
                                this.setState({ [key]: trim(val)}, this.onChangeValue())
                        }
                    }
                >
                {
                        this.tableHeaderTitle()
                }
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({ clientId: e ? id : null }, this.onChangeValue())
                            }
                        }
                        params={{limit: 99999, offset: 0}}
                        getDataMethod={'getClients'}
                        placeholder='客户简称'
                        labelField={'shortname'}
                    />
                    {
                        curCode === 2 &&
                        <MonthPicker
                            placeholder='所属月份'
                            format={'YYYY-MM'}
                            onChange={(d, ds) => {
                                this.setState({expenseOwnMonth: d ? moment(d).format('YYYY-MM') : null}, this.onChangeValue())
                            }}
                        />
                    }
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({ projectId: e ? id : null }, this.onChangeValue())
                            }
                        }
                        params={{ pageSize: 99999, pageNo: 1 }}
                        getDataMethod={'getCooperativeList'}
                        placeholder='项目名称'
                        labelField={'projectName'}
                    />
                    <div style={{width: 290}}>
                        <TimePicker
                            startTime={startOrderDate}
                            endTime={endOrderDate}
                            changeStartTime={(date, dateStr) => {
                                this.setState({
                                    startOrderDate: dateStr
                                }, this.onChangeValue())
                            }}
                            changeEndTime={(date, dateStr) => {
                                this.setState({
                                    endOrderDate: date ? moment(date).add(1, 'days').format('YYYY-MM-DD') : null
                                }, this.onChangeValue())
                            }}
                            getFieldDecorator={null}
                            pickerWidth={{ width: 130 }}
                        />
                    </div>
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({ operatorId: e ? id : null }, this.onChangeValue())
                            }
                        }
                        params={{ limit: 99999, offset: 0 }}
                        getDataMethod={'getChargeOrderOperators'}
                        placeholder='创建人'
                        labelField={'name'}
                        dealData={arr => {
                            return arr.map(item => ({
                                id: item.operator_id,
                                name: item.operator_name
                            }))
                        }}
                    />
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                // let id = e ? e.id : 0
                                let name = e ? e.name : null
                                this.setState({ clientLegalName: e ? name : null }, this.onChangeValue())
                            }
                        }
                        params={{ limit: 99999, offset: 0 }}
                        getDataMethod={'getClients'}
                        placeholder='客户法人'
                        dealData={arr => {
                            let rt = []
                            try {
                                arr.forEach(item => {
                                    rt = item.legals && item.legals.length ? [...rt, ...item.legals] : [...rt]
                                })
                                rt = rt.map((item, index) => {
                                    item.id = index
                                    return item
                                })
                            } catch (err) {
                                rt = []
                            }
                            return rt
                        }}
                        labelField={'name'}
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
                    />
                </HeaderView>
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
                    TableHeaderTitle={null}
                    getData={this.getData}
                    columns={curCode === 1 ? columns : estimateColumns}
                    columnKey={curCode === 1 ? 'columns' : 'estimateColumns'}
                    tableHeight={tableHeight}
                    selectedPropsRowKeys={curCode === 1 ? selectedKeys : estimateSelectedKeys}
                    onChangeSelect={(selectedRowKeys, { deleteKeys, addKeys }) => this.changeSelect(selectedRowKeys, { deleteKeys, addKeys }, curCode === 1 ? 'selectedKeys' : 'estimateSelectedKeys')}
                    getCheckboxProps={this.getCheckboxProps}
                    tableWidth={100}
                />
          </div>
        )
    }
}

export default Form.create()(AccountReceivable)