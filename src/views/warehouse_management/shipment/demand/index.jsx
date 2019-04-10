import React from 'react'
import {message} from 'antd'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import AddOrEdit from './addoredit'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { children, id } from './power'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { deleteNull, trim } from '@src/utils'
import moment from 'moment'
import './index.less'

const power = Object.assign({}, children, id)

/**
 * 出货需求
 * @class ShipmentDemand
 * @extends {Component}
 */
@inject('rApi', 'mobxTabsData')
@observer
class ShipmentDemand extends Parent {

    state = {
        keywords: '', //收货需求单号搜索关键词
        clientId: null, //筛选客户简称ID
        shipmentMethodId: null, //筛选出货方式id
        sourceId: null, //筛选需求来源ID
        typeId: null, //筛选出货类型ID
        warehouseId: null, //筛选仓库ID
        demandList: [], //需求列表
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
                render: (t, r) => {
                    let name = t === 1 ? '未确认' : '已确认'
                    return (
                        <ColumnItemBox name={name} hasPoint pointBgc={t === 1 ? '#FFBF00' : '#87D068'}/>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '出货需求单号',
                dataIndex: 'singleNumber',
                key: 'singleNumber',
                width: 140,
                render: (t, r) => {
                    return (
                        <ColumnItemBox name={t} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '客户简称',
                dataIndex: 'clientName',
                key: 'clientName',
                width: 140,
                render: (t, r) => {
                    return (
                        <ColumnItemBox name={t} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '出货仓库',
                dataIndex: 'warehouseName',
                key: 'warehouseName',
                width: 140,
                render: (t, r) => {
                    return (
                        <ColumnItemBox name={t} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '出货类型',
                dataIndex: 'typeName',
                key: 'typeName',
                width: 140,
                render: (t, r) => {
                    return (
                        <ColumnItemBox name={t} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '需求来源',
                dataIndex: 'sourceName',
                key: 'sourceName',
                width: 140,
                render: (t, r) => {
                    return (
                        <ColumnItemBox name={t} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '要求交货时间',
                dataIndex: 'deliveryTime',
                key: 'deliveryTime',
                width: 140,
                render: (t, r) => {
                    let name = r.deliveryTime ? moment(r.deliveryTime).format('YYYY-MM-DD HH:mm') : null
                    return (
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '出货方式',
                dataIndex: 'shipmentMethodName',
                key: 'shipmentMethodName',
                width: 140,
                render: (t, r) => {
                    return (
                        <ColumnItemBox name={t} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                // width: 160,
                render: (t, r) => {
                    return (
                        <ColumnItemBox name={t} />
                    )
                }
            }
        ]
    }

    onChangeValue = () => {
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    // 收货需求列表数据获取
    getData = (params) => {
        const { rApi } = this.props
        const { 
            clientId, //客户简称ID
            keywords, //收货需求单号搜索关键词
            shipmentMethodId, //出货方式id
            sourceId, //需求来源ID
            typeId, //出货类型ID
            warehouseId //仓库ID
        } = this.state
        params = Object.assign({}, params, {
            keywords,
            clientId,
            shipmentMethodId,
            sourceId,
            warehouseId,
            typeId,
            pageSize: params.limit
        })
        return new Promise((resolve, reject) => {
            params = deleteNull(params)
            rApi[power.apiName](params)
                .then(async d => {
                    let demandList = [...d.records]
                    await this.setState({ demandList})
                    resolve({
                        dataSource: demandList,
                        total: d.total
                    })
                }).catch(err => {
                    reject(err)
                })
        })
    }

    // 删除收货需求
    deleteShipment = async (r, rIndex) => {
        this.props.rApi.delShipment({id: r.id})
            .then(res => {
                message.success('操作成功')
                this.searchCriteria()
            })
            .catch(err => {
                message.error(err.msg || '操作失败')
            })
    }

    /* 保存编辑 */
    saveEdit = async (data) => {
        let { demandList} = this.state
        demandList = demandList.map(item => {
            if (item.id === data.id) {
                item = {...item, ...data}
            }
            return item
        })
        await this.setState({ demandList})
        this.updateDataTableSource(this.state.demandList)
    }

    render() {
        return (
            <div className='receipt-demand' style={{ background: '#eee', minHeight: this.props.minHeight }}>
                <AddOrEdit
                    parent={this}
                    power={power}
                    getThis={(v) => this.addoredit = v}
                    saveEdit={this.saveEdit}
                />
                <HeaderView 
                    parent={this} 
                    title="出货需求单号" 
                    onChangeSearchValue={
                        keyword => {
                            this.setState({ keywords: trim(keyword)}, this.onChangeValue({ keywords: trim(keyword) }))
                        }
                    }
                >
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({ clientId: e ? id : null }, this.onChangeValue({ clientId: e ? id : null }))
                            }
                        }
                        params={{limit: 99999, offset: 0}}
                        getDataMethod={'getClients'}
                        placeholder='客户简称'
                        labelField={'shortname'}
                    >
                    </RemoteSelect>
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({ warehouseId: e ? id : null }, this.onChangeValue({ warehouseId: e ? id : null }))
                            }
                        }
                        placeholder='仓库名称'
                        params={{pageNo: 1, pageSize: 10000}}
                        getDataMethod={'getWarehouseList'}
                        labelField={'name'}
                    >
                    </RemoteSelect>
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({ typeId: e ? id : null }, this.onChangeValue({ typeId: e ? id : null }))
                            }
                        }
                        placeholder='出货类型'
                        text='出货类型'
                    >
                    </RemoteSelect>
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({ sourceId: e ? id : null }, this.onChangeValue({ sourceId: e ? id : null }))
                            }
                        }
                        placeholder='需求来源'
                        text='需求来源'
                    >
                    </RemoteSelect>
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({ shipmentMethodId: e ? id : null }, this.onChangeValue({ shipmentMethodId: e ? id : null }))
                            }
                        }
                        placeholder='出货方式'
                        text='出货方式'
                    >
                    </RemoteSelect>
                </HeaderView>
                <Table
                    style={{ backgroundColor: '#fff', boxShadow: '0 0 4px 0 rgba(0,0,0,0.2)', margin: '0 10px' }}
                    parent={this}
                    actionWidth={90}
                    TableHeaderTitle="出货需求列表"
                    power={power}
                    getData={this.getData}
                    columns={this.state.columns}
                    isHideDeleteButton={true}
                    onDeleteItem={this.deleteShipment}
                >
                </Table>
          </div>
        )
    }
}

export default ShipmentDemand;