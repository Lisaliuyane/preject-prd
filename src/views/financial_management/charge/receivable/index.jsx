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
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { children, id } from './power'
import './index.less'

const power = Object.assign({}, children, id)
const { MonthPicker } = DatePicker
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

/**
 * 应收预估
 * @class ChargeReceivable
 * @extends {Parent}
*/
@inject('rApi', 'mobxTabsData', 'mobxBaseData')
@observer
class ChargeReceivable extends Parent {

    state = {
        estimateLoading: false,
        selectedKeys: [], //待开立选中行
        estimateSelectedKeys: [], //应收预估选中行
        curCode: 1, //当前选择 1：待开立 2：应收预估
        clientId: null,
        projectId: null,
        operatorId: null,
        startOrderDate: null,
        endOrderDate: null,
        clientLegalName: '',
        orderLegalId: null,
        expenseOwnMonth: null,
        orderNumber: null,
        estimateNumber: null,
        noEstimateList: [],
        estimateList: [],
        estimateSaveLoading: false,
        columns: [
            {
                className: 'text-overflow-ellipsis',
                title: '订单号',
                dataIndex: 'orderNumber',
                key: 'orderNumber',
                width: 140,
                fixed: 'left',
                render: (val, r) => {
                    return (
                        <FunctionPower power={power.LOOK_ORDER}>
                            <span onClick={e => this.seeOrder(r)} style={{ cursor: 'pointer', color: '#18B583', textDecoration: 'underline' }}>{val}</span>
                        </FunctionPower>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis col-customstatus',
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
                title: '预估金额',
                dataIndex: 'estimatedCost',
                key: 'estimatedCost',
                width: 180,
                render: (val, r) => {
                    // return val && !isNaN(val) ? `${val.toFixed(2)}(${r.currencyName || 'RMB'})` : '-'
                    let data = `${r.estimatedCost ? `${r.estimatedCost}${r.currencyName ? r.currencyName : 'RMB'}` : '-'}`
                    return (
                        <div style={{ width: 159 }} className="text-overflow-ellipsis" title={val && !isNaN(val) ? `${val}(${r.currencyName || 'RMB'})` : '-'}>
                            <span style={{ color: '#E76400' }}>
                            {
                                data
                            }
                            </span>
                        </div>
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
                title: '路线',
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
                title: '预估单号',
                dataIndex: 'estimateNumber',
                key: 'estimateNumber',
                width: 140
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
                width: 140,
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
                    return <span style={{ color: '#E76400' }}>{`${r.totalCost ? `${r.totalCost}` : '-'}`}</span>
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '税后金额',
                dataIndex: 'afterTaxAmount',
                key: 'afterTaxAmount',
                width: 140,
                render: (val, r) => {
                    return <span style={{ color: '#E76400' }}>{`${r.afterTaxAmount ? `${r.afterTaxAmount}` : '-'}`}</span>
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '币别',
                dataIndex: 'currencyName',
                key: 'currencyName',
                width: 140
            },
            {
                className: 'text-overflow-ellipsis',
                title: '订单数',
                dataIndex: 'orderQuantity',
                key: 'orderQuantity',
                width: 140
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

    // 列表数据获取
    getData = (params) => {
        const { rApi } = this.props
        let {
            orderNumber,
            estimateNumber, 
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
                openStatus: 4,
                clientLegalName,
                orderLegalId,
                operatorId
            })
            params = deleteNull(params)
            return new Promise((resolve, reject) => {
                rApi.getOrderList(params)
                    .then(async res => {
                        // console.log('list', res.records)
                        let noEstimateList = [...res.records]
                        await this.setState({ noEstimateList })
                        resolve({
                            dataSource: this.state.noEstimateList,
                            total: res.total
                        })
                    })
                    .catch(err => reject(err))
            })
        } else if (curCode === 2) {
            params = Object.assign({}, params, {
                estimateNumber,
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
                rApi.chargeReceivableList(params)
                    .then(async res => {
                        // console.log('list', res.records)
                        let estimateList = [...res.records]
                        await this.setState({ estimateList })
                        resolve({
                            dataSource: this.state.estimateList,
                            total: res.total
                        })
                    })
                    .catch(err => reject(err))
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
        const { selectedKeys, curCode } = this.state
        if (curCode === 2) {
            return {
                disabled: false
            }
        }
        // console.log('a', r.clientId, (selectedKeys.length > 0 && !selectedKeys.some(item => item.clientId === r.clientId)))
        if ((r && r.openStatus === 2) || (selectedKeys.length > 0 && !selectedKeys.some(item => item.clientId === r.clientId)) || (selectedKeys.length > 0 && !selectedKeys.some(item => item.projectId === r.projectId))) {
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
        const { curCode } = this.state
        let rt = [...this.state[keyName]]
        if (rt.length < 1 && addKeys.length > 0 && curCode === 1) {
            let target = addKeys[0]
            addKeys = addKeys.filter(item => {
                if ((item.clientId === target.clientId) && (item.projectId === target.projectId)) {
                    return true
                } else {
                    return false
                }
            })
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

    /* 查看预估单明细 */
    showDetails = (r) => {
        this.receivableDetails.show({
            ...r
        })
    }

    /* 修改列表对应行数据 */
    setRowData = (listKey, index, newData) => {
        let newList = this.state[listKey]
        newList[index] = { ...newData }
        this.setState({ [listKey]: newList })
    }

    /* 删除预估单 */
    deleteEstimate = (r) => {
        const {rApi} = this.props
        rApi.deleteChargeReceivableEstimate({
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

    /* 生成预估弹窗 */
    openEstimate = () => {
        let {
            selectedKeys
        } = this.state
        if (!selectedKeys || selectedKeys.length < 1) {
            message.warning('请选择要开立条目')
            return
        }
        this.setAccount.show({
            openType: 'receivable',
            data: selectedKeys
        })
    }

    /* 生成预估操作 */
    doEstimate = async (data) => {
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
            let {
                afterTaxAmount,
                currencyId,
                currencyName,
                departure,
                destination,
                estimatedCost,
                orderNumber,
                orderType,
                projectId,
                projectName,
                taxes,
                clientId,
                clientName
            } = item
            let rt = {
                afterTaxAmount,
                currencyId,
                currencyName,
                departure,
                destination,
                estimatedCost,
                orderId: item.id,
                orderLegalId,
                orderLegalName,
                orderNumber,
                orderType,
                projectId,
                projectName,
                taxes,
                clientId,
                clientName
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
        // console.log('do', selectedKeys, receivableEstimateOrderList)
        const { rApi } = this.props
        return new Promise((resolve, reject) => {
            rApi.chargeReceivableEstimate(reqData)
                .then(res => {
                    let { noEstimateList, selectedKeys } = this.state
                    noEstimateList = noEstimateList.map(item => {
                        if (selectedKeys.some(k => k.id === item.id)) {
                            item.openStatus = 2
                        }
                        return item
                    })
                    this.setState({ noEstimateList, selectedKeys: [] })
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
        this.costDetails.show({
            ...r
        })
    }

    /* 开立状态切换 待开立或应收预估 */
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
                estimateNumber: null,
                operatorId: null,
                projectId: null
            })
        })
    }

    /* 自定义表格标题按钮 */
    cusTableHeader = () => {
        const { estimateLoading, curCode } = this.state
        return (
            <Fragment>
                {
                    curCode === 1 &&
                    <FunctionPower power={power.DO_ESTIMATE}>
                        <Button
                            style={{ marginRight: '10px', verticalAlign: 'middle', verticalAlign: 'middle' }}
                            onClick={this.openEstimate}
                            loading={estimateLoading}
                        >
                            生成预估单
                        </Button>
                    </FunctionPower>
                }
            </Fragment>
        )
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
                    <RadioButton value={2}>应收预估</RadioButton>
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
                        onClick={e => this.lookDetails(record)}
                    >查看</span>
                </FunctionPower>
            )
        } else if (curCode === 2) {
            return(
                <Fragment>
                    <FunctionPower power={power.LOOK_DETAILS}>
                        <span
                            className='action-button'
                            onClick={e => this.showDetails({ ...record, _deepIndex: index })}
                        >明细</span>
                    </FunctionPower>
                    <FunctionPower power={power.DO_DELETE}>
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
            <div className='page-charge-receivable' ref={v => this.rootDom = v}>
                <ReceivableDetails
                    parent={this}
                    getThis={v => this.receivableDetails = v}
                    setRowData={this.setRowData}
                    title='预估'
                />
                <CostDetails
                    parent={this}
                    getThis={v => this.costDetails = v}
                />
                <SetAccount
                    parent={this}
                    getThis={v => this.setAccount = v}
                    doAccount={this.doEstimate}
                    title='预估'
                />
                <HeaderView
                    parent={this}
                    title={curCode === 1 ? '订单号' : '预估单号'} 
                    onChangeSearchValue={
                            val => {
                                let key = curCode === 1 ? 'orderNumber' : 'estimateNumber'
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
                    <div style={{width: 290}}>
                        <TimePicker
                            startTime={startOrderDate}
                            endTime={endOrderDate}
                            startTitle='起始日期'
                            endTitle='结束日期'
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
                                let name = e ? e.name : ''
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
                    filterSortItems={curCode === 1 ? ['orderNumber'] : []}
                />
          </div>
        )
    }
}

export default Form.create()(ChargeReceivable)