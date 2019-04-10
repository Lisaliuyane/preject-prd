import React from 'react'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import RemoteSelect from '@src/components/select_databook'
import { inject, observer } from "mobx-react"
import { DatePicker, Popconfirm, message } from 'antd'
import moment from 'moment'
import { trim } from '@src/utils'
import { children, id } from './power'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import TrackDetails from './ModalTrackDetails'
import './index.less'

const power = Object.assign({}, children, id)

/**
 * 追踪管理
 * @class AuthOrize
 * @extends {Parent}
*/
@inject('rApi', 'mobxTabsData', 'mobxBaseData')
@observer
class Track extends Parent {

    state = {
        /* 筛选条件 start */
        clientId: null, //
        projectId: null, //
        orderNumber: '',
        /* 筛选条件 end */
        orderList: [], //列表数据
    }

    constructor(props) {
        super(props)
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 120,
                render: (t, r, index) => {
                    let name = (t === 2 || t === 3) ? '运输中' : t === 4 ? '待签收' : t === 5 ? '已签收' : '-'
                    return (
                        <ColumnItemBox hasPoint pointBgc={(t === 2 || t === 3) ? '#49A9EE' : t === 4 ? '#FFBF00' : '#87D068'} name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '订单号',
                dataIndex: 'orderNumber',
                key: 'orderNumber',
                width: 140,
                render: (text, r, index) => {
                    let name = r.orderNumber ? r.orderNumber : '-'
                    return (
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '客户简称',
                dataIndex: 'clientName',
                key: 'clientName',
                width: 180,
                render: (t, r, index) => {
                    return (
                        <ColumnItemBox name={t} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '项目名称',
                dataIndex: 'projectName',
                key: 'projectName',
                width: 180,
                render: (t, r, index) => {
                    return (
                        <ColumnItemBox name={t} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '路线',
                dataIndex: 'quotationLineDetail',
                key: 'quotationLineDetail',
                width: 250,
                render: (t, r, index) => {
                    let name =  r.departure ? 
                    `${r.departure}${r.transitPlaceOneName ? `->${r.transitPlaceOneName}` : ''}->${r.destination}` : '-'
                    return (
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
                render: (val, r, index) => {
                    let name = val && val.length ? val[0].name : '-'
                    return (
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
                render: (val, r, index) => {
                    let name = val && val.length ? val[0].name : '-'
                    return (
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '客户单号',
                dataIndex: 'customerNumber',
                key: 'customerNumber',
                width: 120,
                render: (t, r, index) => {
                    let name = r.customerNumber ? `${r.customerNumber}${r.customerNumberBackup ? `, ${r.customerNumberBackup}` : ''}` : '-'
                    return (
                        <ColumnItemBox name={name} />
                    )
                }
            }
        ]
    }

    /* 获取列表 */
    getData = async (params) => {
        const { rApi } = this.props
        params = {
            ...params,
            trackStatus: 1,
            clientId: this.state.clientId,
            projectId: this.state.projectId,
            orderNumber: this.state.orderNumber
        }
        return new Promise((resolve, reject) => {
            rApi.getTrackList(params)
                .then(async res => {
                    let orderList = [...res.records]
                    let total = res.total
                    await this.setState({ orderList })
                    resolve({
                        dataSource: this.state.orderList,
                        total
                    })
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    /* 刷新表格数据 */
    onChangeValue = () => {
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    /* 显示modal */
    showModal = (type, payload) => {
        switch (type) {
            case 'track': //追踪详情
                this.trackDetails.show({
                    payload
                })
                break;
        
            default:
                console.log('无弹窗类型')
                break;
        }
    }

    /* 自定义操作 */
    actionView = ({ text, record, index, onDeleteItem, onEditItem, DeleteButton }) => {
        return (
            <FunctionPower power={power.LOOK}>
                <span className={`action-button`} onClick={e => this.showModal('track', { ...record })}>
                    追踪
                </span>
            </FunctionPower>
        )
    }

    render() {
        let { mobxBaseData } = this.props
        let tableHeight = mobxBaseData.tableHeight
        return (
            <div className='track-page' ref={v => this.trackPage = v}>
                <TrackDetails
                    parent={this}
                    getThis={v => this.trackDetails = v}
                />
                <HeaderView
                    parent={this}
                    title="订单号"
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
                        params={{ limit: 1000000, offset: 0 }}
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
                        params={{ pageNo: 1, pageSize: 999999 }}
                        labelField={'projectName'}
                    />
                    <div className="flex flex-vertical-center" style={{ width: 261 }}>
                        <DatePicker
                            style={{ width: 120 }}
                            onChange={
                                date => {
                                    this.setState({
                                        startOrderDate: date ? moment(date).format("YYYY-MM-DD") : null
                                    }, this.onChangeValue({
                                        startOrderDate: date ? moment(date).format("YYYY-MM-DD") : null
                                    }))
                                }}
                            allowClear
                            placeholder='起运时间'
                        />
                        <span style={{ margin: '0 3px' }}>-</span>
                        <DatePicker
                            style={{ width: 120 }}
                            onChange={
                                date => {
                                    this.setState({
                                        endOrderDate: date ? moment(date).add(1, 'days').format('YYYY-MM-DD') : null
                                    }, this.onChangeValue({
                                        endOrderDate: date ? moment(date).add(1, 'days').format('YYYY-MM-DD') : null
                                    }))
                                }}
                            allowClear
                            placeholder='签收时间'
                        />
                    </div>
                </HeaderView>
                <Table
                    className='sd-block page-table'
                    isHideAddButton
                    isHideDeleteButton
                    isNoneSelected
                    parent={this}
                    getThis={v => this.tableView = v}
                    actionWidth={90}
                    actionView={this.actionView}
                    title={null}
                    getData={this.getData}
                    columns={this.state.columns}
                    tableHeight={tableHeight}
                    tableWidth={120}
                >
                </Table>
            </div>
        )
    }
}

export default Track