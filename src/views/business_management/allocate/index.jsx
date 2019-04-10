import React, {Fragment} from 'react'
import { HeaderView, Table, Parent, ColumnItemBox, CellBox } from '@src/components/table_template'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { DatePicker, Popconfirm, message, Popover, Icon } from 'antd'
import moment from 'moment'
import { trim } from '@src/utils'
import { toAllocateEdit, toClientSource } from '@src/views/layout/to_page'
import { children, id } from './power'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import OrderMore from '../public/OrderMore'
import CarrierMore from '../public/CarrierMore'
import './index.less'

const power = Object.assign({}, children, id)

@inject('rApi', 'mobxTabsData', 'mobxBaseData')
@observer
/* 配载管理 */
class Allocate extends Parent {
    state = {
        orderNumber: null, //筛选条件订单编号
        carrierId: null, //筛选条件承运商ID
        createTime: null, //筛选条件创建时间
        senderId: null, //筛选条件发货方id
        receiverId: null, //筛选条件收货方id
        status: null, //筛选条件状态 1 -> 待确认, 2 -> 已确认
        receiverOrSenderType: null, //筛选条件收发货方类型
        stowageList: [], //配载列表数据
    }

    constructor(props) {
        super(props)
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (val, r, index) => {
                    if (val === 1) {
                        return <div style={{display: 'flex', alignItems: 'center'}}><span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#FFBF00', marginRight: 6}}></span><span>待确认</span></div>
                    } else if (val === 2) {
                        return <div style={{ display: 'flex', alignItems: 'center' }}><span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#87D068', marginRight: 6 }}></span><span>已确认</span></div>
                    } else{
                        return <span>无</span>
                    }
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '配载单号',
                dataIndex: 'stowageNumber',
                key: 'stowageNumber',
                width: 120,
                render: (val, r, index) => {
                    let name = r.stowageNumber ? r.stowageNumber : '-'
                    return (
                        // <ColumnItemBox name={name} />
                        <CellBox>
                            {name}
                        </CellBox>
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
                        // <ColumnItemBox name={name} />
                        <CellBox>
                            {name}
                        </CellBox>
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
                        // <ColumnItemBox name={name} />
                        <CellBox>
                            {name}
                        </CellBox>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis itbcol-more',
                title: '关联订单',
                dataIndex: 'sendCarOrderList',
                key: 'sendCarOrderList',
                width: 180,
                render: (val, r, rIndex) => {
                    return (
                        <CellBox>
                            <span ref={v => this['popOrder' + rIndex] = v}>
                                {
                                    val && val.length && val[0].orderNumber ? val[0].orderNumber : '-'
                                }
                                {
                                    val && val.length > 1 &&
                                    <Popover
                                        placement="bottomLeft"
                                        title={null}
                                        getPopupContainer={() => this.rootDom || document.body}
                                        content={
                                            <OrderMore
                                                className='ipopover-order-more'
                                                {...r}
                                            />
                                        }
                                        onVisibleChange={flag => this.popVisibleChange(flag, 'showOrderMore', rIndex)}
                                    >
                                        <span className='more'>
                                            <Icon type={r.showOrderMore ? 'minus' : 'plus'} />
                                        </span>
                                    </Popover>
                                }
                            </span>
                        </CellBox>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis itbcol-more',
                title: '承运商',
                dataIndex: 'carrierName',
                key: 'carrierName',
                width: 180,
                render: (val, r, rIndex) => {
                    return (
                        <CellBox>
                            <div className="flex flex-vertical-center" ref={v => this['popCarrier' + rIndex] = v}>
                                {
                                    r.carType === 1 ?
                                        <div className="text-overflow-ellipsis" style={{ maxWidth: 130 }} title={val ? `${val}` : ''}>{val ? `${val}` : ''}</div>
                                        :

                                        <div className="text-overflow-ellipsis" style={{ maxWidth: 130 }} title='现金车'>现金车</div>
                                }
                                <Popover
                                    placement="bottomLeft"
                                    title={null}
                                    getPopupContainer={() => this.rootDom || document.body}
                                    content={
                                        <CarrierMore
                                            className='ipopover-carrier-more'
                                            {...r}
                                        />
                                    }
                                    onVisibleChange={flag => this.popVisibleChange(flag, 'showCarrierMore', rIndex)}
                                    // trigger="click"
                                >
                                    <span className='more'>
                                        <Icon type={r.showCarrierMore ? 'minus' : 'plus'} />
                                    </span>
                                </Popover>
                            </div>
                        </CellBox>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '创建人',
                dataIndex: 'operatorName',
                key: 'operatorName',
                width: 100,
                render: (val, r, index) => {
                    let name = val ? val : '-'
                    return (
                            <CellBox>{name}</CellBox>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                render: (val, r, index) => {
                    let name = r.createTime ? moment(r.createTime).format("YYYY-MM-DD") : '-'
                    return (
                        <CellBox>{name}</CellBox>
                    )
                }
            }
        ]
    }

    /* 获取配载列表 */
    getData = async (params) => {
        const { rApi } = this.props
        const {
            orderNumber,
            carrierId,
            createTime,
            senderId,
            receiverId,
            status
        } = this.state
        let reqData = {
            ...params,
            orderNumber,
            carrierId,
            createTime,
            senderId,
            receiverId,
            status
        }
        // console.log(reqData)
        return new Promise((resolve, reject) => {
            rApi.getAllocateList(reqData)
                .then(async res => {
                    let dataSource = [...res.records]
                    let total = res.total
                    // dataSource = this.dealList(dataSource)
                    await this.setState({ stowageList: dataSource })
                    // console.log('rt', dataSource)
                    resolve({
                        dataSource: this.state.stowageList,
                        total
                    })
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    /* 关联订单和承运商显示更多信息弹层显示隐藏触发事件 */
    popVisibleChange = (flag, key, index) => {
        let { stowageList } = this.state
        stowageList[index][key] = flag
        this.setState({ stowageList })
    }

    /* 自定义操作 */
    customAction = ({ text, record, index, onDeleteItem, onEditItem, DeleteButton }) => {
        // console.log('customTableAction', text, record, index, record.status)
        const { status } = record
        if (status === 1) {
            return (
                <Fragment>
                    <FunctionPower power={power.EDIT_DATA}>
                        <span
                            key='edit'
                            className='action-button'
                            onClick={e => this.toEditPage(record, 1)}
                        >
                            编辑
                        </span>
                    </FunctionPower>
                    <FunctionPower power={power.DEL_DATA}>
                        <Popconfirm
                            key='delete'
                            title="是否确定删除？"
                            onConfirm={() => this.deleteRow(record.id, index)}
                        >
                            <span className={`action-button`}>
                                删除
                            </span>
                        </Popconfirm>
                    </FunctionPower>
                    <FunctionPower power={power.LOOK_MORE}>
                        <span
                            key='see'
                            className='action-button'
                            onClick={e => this.toEditPage(record, 2)}
                        >
                            查看
                        </span>
                    </FunctionPower>
                </Fragment>
            )
        } else if (status === 2) {
            return(
                <FunctionPower power={power.LOOK_MORE}>
                    <span
                        className='action-button'
                        onClick={e => this.toEditPage(record, 2)}
                    >
                        查看
                    </span>
                </FunctionPower>
            )
        } else {
            return (
                <FunctionPower power={power.LOOK_MORE}>
                    <span
                        className='action-button'
                        onClick={e => this.toEditPage(record, 2)}
                    >
                        查看
                    </span>
                </FunctionPower>
            )
        }
    }

    /* 跳到配载编辑 */
    toEditPage = (rowData, openType) => {
        let { mobxTabsData } = this.props
        // console.log('toEdit', rowData)
        toAllocateEdit(mobxTabsData, {
            id: `${rowData.stowageNumber}-${openType === 1 ? 'edit' : openType === 2 ? 'see' : 'other'}`,
            pageData: {
                originView: this,
                ...rowData,
                openType
            }
        })
    }

    /* 删除配载 */
    deleteRow = (id, index) => {
        const {rApi} = this.props
        let reqData = [id]
        rApi.deleteAllocateList(reqData)
            .then(async res => {
                this.onChangeValue()
                message.success('操作成功')
            })
            .catch(err => {
                message.error(err.msg || '操作失败')
            })
    }

    /* 刷新表格数据 */
    onChangeValue = () => {
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    render() {
        let { mobxBaseData } = this.props
        let tableHeight = mobxBaseData.tableHeight
        return(
            <div className='page-allocate' ref={v => this.rootDom = v}>
                <HeaderView
                    parent={this}
                    title="订单编号"
                    onChangeSearchValue={
                        keyword => {
                            this.setState({ orderNumber: trim(keyword) }, this.onChangeValue())
                        }
                    }>
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
                    />
                    <DatePicker
                        // style={{ width: 200, marginRight: 10 }}
                        onChange={
                            date => {
                                this.setState({
                                    createTime: date ? moment(date).format("YYYY-MM-DD") : null
                                }, this.onChangeValue())
                            }}
                        allowClear
                        placeholder='创建时间'
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
                    <RemoteSelect
                        placeholder="状态"
                        onChangeValue={(val) => {
                            let status = val && val.code ? val.code : null
                            this.setState({ status }, this.onChangeValue())
                        }}
                        list={[
                            {
                                title: '待确认',
                                code: 1
                            },
                            {
                                title: '已确认',
                                code: 2
                            }
                        ]}
                        labelField={'title'}
                        keyName='code'
                    />
                </HeaderView>
                <Table
                    className='sd-block page-table'
                    tableWidth={140}
                    isHideAddButton
                    isHideDeleteButton
                    isNoneSelected
                    getThis={v => this.tableView = v}
                    parent={this}
                    actionWidth={140}
                    actionView={this.customAction}
                    title="配载列表"
                    getData={this.getData}
                    columns={this.state.columns}
                    tableHeight={tableHeight}
                >
                </Table>
            </div>
        )
    }
}

export default Allocate