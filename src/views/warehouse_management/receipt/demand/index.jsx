import React from 'react'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import AddOrEdit from './addoredit'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { children, id } from './power'
import { deleteNull, trim } from '@src/utils'
import moment from 'moment'

const power = Object.assign({}, children, id)

/**
 * 收货需求
 * @class ReceiptDemand
 * @extends {Parent}
 */
@inject('rApi', 'mobxTabsData')
@observer
class ReceiptDemand extends Parent {
    
    state = {
        keywords: '', //收货需求单号搜索关键词
        clientName: '', //客户简称筛选
        clientId: null, //客户简称ID筛选
        operatingModeId: null, //操作模式ID筛选
        operatingModeName: '', //操作模式名称筛选
        typeId: null, //收货类型ID筛选
        typeName: '', //收货类型名称筛选
        warehouseId: null, //仓库ID筛选
        warehouseName: '', //仓库名称筛选
        receiptList: [], //收货需求列表
        // 表格列定义
        columns: [
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
                title: '订单编号',
                dataIndex: 'orderNumber',
                key: 'orderNumber',
                width: 140,
                render: (t, r) => {
                    return (
                        <ColumnItemBox name={t} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '收货单号',
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
                title: '收货仓库',
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
                title: '收货方式',
                dataIndex: 'modeName',
                key: 'modeName',
                width: 140,
                render: (t, r) => {
                    return (
                        <ColumnItemBox name={t} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '预计到达时间',
                dataIndex: 'expectedTime',
                key: 'expectedTime',
                width: 140,
                render: (t, r) => {
                    let name = t ? moment(t).format('YYYY-MM-DD HH:mm') : '-'
                    return (
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '收货类型',
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
                title: '操作模式',
                dataIndex: 'operatingModeName',
                key: 'operatingModeName',
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
                render: (t, r) => {
                    return (
                        <ColumnItemBox name={t} />
                    )
                }
            }
        ]
    }

    constructor(props) {
        super(props)
    }

    onChangeValue = () => {
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    // 收货需求列表数据获取
    getData = (params) => {
        const { keywords, clientId, operatingModeId, typeId, warehouseId } = this.state
        params = Object.assign({}, params, {
            pageSize: params.limit,
            keywords,
            clientId,
            warehouseId,
            typeId,
            operatingModeId
        })
        const { rApi } = this.props
        return new Promise((resolve, reject) => {
            params = deleteNull(params)
            rApi[power.apiName](params)
                .then(async d => {
                    let receiptList = [...d.records]
                    receiptList.sort((a, b) => {
                        return a.status > b.status
                    })
                    await this.setState({ receiptList })
                    resolve({
                        dataSource: receiptList,
                        total: d.total
                    })
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    /* 编辑更新数据 */
    saveEdit = async (data) => {
        let {receiptList} = this.state
        receiptList = receiptList.map(item => {
            if (item.id === data.id) {
                item = {...item, ...data}
            }
            return item
        })
        await this.setState({ receiptList })
        this.updateDataTableSource(receiptList)
    }

    render() {
        // console.log('render', this.state)
        return (
            <div className='receipt-demand'>
                <AddOrEdit
                    parent={this}
                    getThis={(v) => this.addoredit = v}
                    saveEdit={this.saveEdit}
                    power={power}
                />
                <HeaderView 
                    parent={this} 
                    title="收货需求单号" 
                    onChangeSearchValue={
                            keyword => {
                            this.setState({ keywords: trim(keyword)}, this.onChangeValue())
                        }
                    }
                >
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
                    >
                    </RemoteSelect>
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({ warehouseId: e ? id : null }, this.onChangeValue())
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
                                this.setState({ operatingModeId: e ? id : null }, this.onChangeValue())
                            }
                        }
                        placeholder='操作模式'
                        text='操作模式'
                    >
                    </RemoteSelect>
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({ operatingModeId: e ? id : null }, this.onChangeValue())
                            }
                        }
                        placeholder='订单编号'
                        text='订单编号'
                    >
                    </RemoteSelect>
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({ typeId: e ? id : null }, this.onChangeValue())
                            }
                        }
                        placeholder='收货单号'
                        text='收货单号'
                    >
                    </RemoteSelect>
                </HeaderView>
                <Table
                    className='sd-block page-table'
                    actionWidth={90}
                    TableHeaderTitle="收货需求列表"
                    parent={this}
                    power={power}
                    params={this.state.params}
                    getData={this.getData}
                    columns={this.state.columns}
                    isHideDeleteButton={true}
                >
                </Table>
          </div>
        )
    }
}

export default ReceiptDemand;