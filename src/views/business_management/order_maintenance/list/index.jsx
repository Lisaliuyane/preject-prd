import React, { Fragment } from 'react'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import RemoteSelect from '@src/components/select_databook'
import { inject, observer } from "mobx-react"
import { DatePicker, Button } from 'antd'
import { children, id } from './power'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import moment from 'moment'
import { trim } from '@src/utils'
import { toOrderMaintenanceEdit } from '@src/views/layout/to_page'
import './index.less'

const power = Object.assign({}, children, id)

/* 订单数据维护 */
@inject('rApi', 'mobxTabsData', 'mobxBaseData')
@observer
class OrderMaintenance extends Parent {
    state = {
        clientId: null, //筛选条件客户名称id
        projectId: null, //筛选条件项目id
        createTime: null, //筛选条件下单时间
        senderId: null, //筛选条件发货方id
        receiverId: null, //筛选条件收货方id
        orderNumber: null, //筛选条件订单号
        orderList: [],
        operating: null, //状态
        reconciliationStatus: null,
        statusArr: [
            {
                isActive: false,
                code: 5,
                title: '维护中'
            },
            {
                isActive: false,
                code: 2,
                title: '已对账'
            }
        ],
        columns: [
            {
                className: 'text-overflow-ellipsis cost-charge',
                title: '预估金额',
                dataIndex: 'estimatedCost',
                key: 'estimatedCost',
                width: 160,
                render: (val, r) => {
                    let name = val && !isNaN(val) ? `${val.toFixed(4)}${r.currencyName || 'RMB'}` : '-'
                    // let name = r.isTextsIncluded === 0 ? 
                    // `${r.afterTaxAmount ? `${r.afterTaxAmount.toFixed(2)}${r.currencyName ? r.currencyName : 'RMB'}` : '-'}` 
                    // : 
                    // `${r.estimatedCost ? `${r.estimatedCost.toFixed(2)}${r.currencyName ? r.currencyName : 'RMB'}` : '-'}`
                    return(
                        <ColumnItemBox name={name} style={{color: '#E76400'}} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '订单号',
                dataIndex: 'orderNumber',
                key: 'orderNumber',
                width: 160,
                render: (val, r) => {
                    let name = r.orderNumber ? r.orderNumber : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '客户名称',
                dataIndex: 'clientName',
                key: 'clientName',
                width: 160,
                render: (val, r) => {
                    let name = r.clientName ? r.clientName : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '项目名称',
                dataIndex: 'projectName',
                key: 'projectName',
                width: 180,
                render: (val, r) => {
                    let name = r.projectName ? r.projectName : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '报价路线',
                dataIndex: 'departure',
                key: 'departure',
                width: 300,
                render: (val, r) => {
                    let name = r.departure ? `${r.departure}${r.transitPlaceOneName ? `->${r.transitPlaceOneName}` : ''}->${r.destination}` : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '发货方',
                dataIndex: 'senderList',
                key: 'senderList',
                width: 160,
                render: (val, r) => {
                    let name = val && val.length && val[0].name ? val[0].name : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '收货方',
                dataIndex: 'receiverList',
                key: 'receiverList',
                width: 160,
                render: (val, r) => {
                    let name = val && val.length && val[0].name ? val[0].name : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '下单时间',
                dataIndex: 'createTime',
                key: 'createTime',
                render: (val) => {
                    return val ? moment(val).format('YYYY-MM-DD HH:mm') : '-'
                }
            }
        ]
    }

    /* 获取表格数据 */
    getData = (params) => {
        const { rApi } = this.props
        const {
            clientId,
            projectId,
            createTime,
            senderId,
            receiverId,
            orderNumber,
            operating,
            reconciliationStatus
        } = this.state
        let reqData = {
            ...params,
            clientId,
            projectId,
            createTime,
            senderId,
            receiverId,
            orderNumber,
            operating,
            reconciliationStatus
        }
        return new Promise((resolve, reject) => {
            rApi.getOrderMaintainList(reqData)
                .then(async res => {
                    let { orderList } = this.state
                    orderList = [...res.records]
                    await this.setState({ orderList })
                    resolve({
                        dataSource: this.state.orderList,
                        total: res.total || 0
                    })
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    componentWillReceiveProps(nextProps) {
        const { mobxTabsData, mykey } = this.props
        const pageData = mobxTabsData.getPageData(mykey)
        // console.log('componentWillReceiveProps', pageData, mykey)
        if (pageData && pageData.refresh) {
            mobxTabsData.setRefresh(mykey, false)
            this.searchCriteria()
        }
    }
    
    /* 刷新表格数据 */
    onChangeValue = () => {
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    /* 自定义表格标题 */
    cusTableHeader = () => {
        return (
            <Fragment>
                {/* <FunctionPower power={power.BATCH_EDIT}>
                    <Button style={{ marginRight: '10px', verticalAlign: 'middle' }}>批量维护</Button>
                </FunctionPower> */}
                {/* <Button style={{ marginRight: '10px', verticalAlign: 'middle' }}>开立预估</Button>
                <Button style={{ marginRight: '10px', verticalAlign: 'middle' }}>开立对账</Button> */}
            </Fragment>
        )
    }

    /*自定义表格title文字*/
    filterStatus = async (orderStatus) => {
        let { statusArr } = this.state
        if (statusArr.some(item => item.code === orderStatus)) {
            if (statusArr.find(item => item.code === orderStatus).isActive) {
                return
            }
            statusArr = statusArr.map(item => {
                item.isActive = (item.code === orderStatus)
                return item
            })
        } else {
            statusArr = statusArr.map(item => {
                item.isActive = false
                return item
            })
        }
        await this.setState({ 
            operating: orderStatus === 5 ? orderStatus : null, 
            reconciliationStatus: orderStatus === 2 ? orderStatus : null,
            statusArr
        })
        this.onChangeValue()
    }

    tableHeaderTitle = () => {
        let { statusArr } = this.state
        return(
            <ul className='cus-table-header'>
                {
                    statusArr.map((item, index) => {
                        return(
                            <li
                                key={index}
                                onClick={e => this.filterStatus(item.code)}
                                className={item.isActive ? 'active' : ''}
                            >
                                {item.title}
                            </li>
                        )
                    })
                }
            </ul>
        )
    }

    /* 自定义表格操作 */
    customAction = ({text, record, index, onDeleteItem, onEditItem, DeleteButton}) => {
        //console.log('record---1', record)
        return (
            <Fragment>
                {/* {
                    record.status >= 5 ?
                    ''
                    :
                    <span className='action-button' onClick={() => this.orderMaintain(record)}>维护</span>
                } */}
                <FunctionPower power={power.EDIT_DATA}>
                    <span className='action-button' onClick={() => this.orderMaintain(record)}>维护</span>
                </FunctionPower>
                <FunctionPower power={power.ON_LOOK}>
                    <span className='action-button' onClick={() => this.checkMaintain(record)}>查看</span>
                </FunctionPower>
            </Fragment>
        )
    }

    orderMaintain = (record) => { //维护
        //console.log('orderMaintain', record)
        let { mobxTabsData } = this.props
        toOrderMaintenanceEdit(mobxTabsData, {
            id: `${record.id}-edit`,
            pageData: {
                ...record,
                openType: 1,
                parentThis: this
            }
        })
    }

    checkMaintain = (record) => { //查看
        //console.log('checkMaintain', record)
        let { mobxTabsData } = this.props
        toOrderMaintenanceEdit(mobxTabsData, {
            id: `${record.id}-see`,
            pageData: {
                ...record,
                openType: 2
            }
        })
    }

    render() {
        let { mobxBaseData } = this.props
        let tableHeight = mobxBaseData.tableHeight
        return(
            <div className='page-ordermaintenance' style={{ background: '#eee', minHeight: this.props.minHeight }}>
                <HeaderView
                    parent={this}
                    title="订单编号"
                    onChangeSearchValue={
                        keyword => {
                            this.setState({ orderNumber: trim(keyword) }, this.onChangeValue())
                        }
                    }>
                    <RemoteSelect
                        placeholder='客户名称'
                        onChangeValue={
                            e => {
                                let clientId = e ? e.id : null
                                this.setState({ clientId }, this.onChangeValue())
                            }
                        }
                        getDataMethod={'getClients'}
                        params={{ limit: 99999, offset: 0, status: 56 }}
                        labelField={'shortname'}
                    />
                    <RemoteSelect
                        placeholder='项目名称'
                        onChangeValue={
                            e => {
                                let projectId = e ? e.id : null
                                this.setState({ projectId }, this.onChangeValue())
                            }
                        }
                        getDataMethod={'getCooperativeList'}
                        params={{ pageSize: 99999, pageNo: 1 }}
                        labelField={'projectName'}
                    />
                    <DatePicker
                        onChange={
                            date => {
                                this.setState({
                                    createTime: date ? moment(date).format("YYYY-MM-DD") : null
                                }, this.onChangeValue())
                            }}
                        allowClear
                        placeholder='下单时间'
                    />
                    <RemoteSelect
                        placeholder="发货方"
                        onChangeValue={(value = {}) => {
                            let senderId = value && value.id ? value.id : null
                            this.setState({ senderId }, this.onChangeValue())
                        }}
                        getDataMethod={'getConsignees'}
                        labelField={'cargoPartyName'}
                        dealData={arr => {
                            return arr.filter(item => {
                                return item.addressType === 1
                            })
                        }}
                        params={{ offset: 0, limit: 99999 }}
                    />
                    <RemoteSelect
                        placeholder="收货方"
                        onChangeValue={(value = {}) => {
                            let receiverId = value && value.id ? value.id : null
                            this.setState({ receiverId }, this.onChangeValue())
                        }}
                        getDataMethod={'getConsignees'}
                        labelField={'cargoPartyName'}
                        dealData={arr => {
                            return arr.filter(item => {
                                return item.addressType === 2
                            })
                        }}
                        params={{ offset: 0, limit: 99999 }}
                    />
                </HeaderView>
                <Table
                    style={{ backgroundColor: '#fff', boxShadow: '0 0 4px 0 rgba(0,0,0,0.2)', margin: '0 10px' }}
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
                    //scroll={{ x: 750, y: 450 }}
                    getData={this.getData}
                    columns={this.state.columns}
                    //tableWidth={400}
                    tableHeight={tableHeight}
                />
            </div>
        )
    }
}

export default OrderMaintenance