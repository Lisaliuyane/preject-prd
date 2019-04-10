import React from 'react'
import { Table, Parent } from '@src/components/table_template'
import { inject } from "mobx-react"
import moment from 'moment'

/* OrderTable */
@inject('rApi')
export default class OrderTable extends Parent {
    state = {}
    constructor(props) {
        super(props)
        if (props.getRef) {
            props.getRef(this)
        }
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                title: '订单号码',
                dataIndex: 'orderNumber',
                key: 'orderNumber',
                width: 120
            },
            {
                className: 'text-overflow-ellipsis',
                title: '下单日期',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 140,
                render: val => {
                    return val && moment(val).format('YYYY-MM-DD')
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '发车日期',
                dataIndex: 'departureTime',
                key: 'departureTime',
                width: 140,
                render: val => {
                    return val && moment(val).format('YYYY-MM-DD')
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '客户',
                dataIndex: 'clientName',
                key: 'clientName',
                width: 140
            },
            {
                className: 'text-overflow-ellipsis',
                title: '报价路线',
                dataIndex: 'departure',
                key: 'departure',
                width: 140,
                render: (val, r) => {
                    return `${r.departure || ''} - ${r.destination || ''}`
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '重量',
                dataIndex: 'totalGrossWeight',
                key: 'totalGrossWeight',
                width: 120
            },
            {
                className: 'text-overflow-ellipsis',
                title: '体积',
                dataIndex: 'totalVolume',
                key: 'totalVolume',
                width: 120
            },
            {
                className: 'text-overflow-ellipsis',
                title: '板数',
                dataIndex: 'totalBoardCount',
                key: 'totalBoardCount',
                width: 120
            },
            {
                className: 'text-overflow-ellipsis',
                title: '箱数',
                dataIndex: 'totalBoxCount',
                key: 'totalBoxCount',
                width: 120
            },
            {
                className: 'text-overflow-ellipsis',
                title: '数量',
                dataIndex: 'totalQuantity',
                key: 'totalQuantity',
                width: 120
            },
            {
                className: 'text-overflow-ellipsis',
                title: '重货重量',
                dataIndex: 'orderNumber8',
                key: 'orderNumber8',
                width: 120
            },
            {
                className: 'text-overflow-ellipsis',
                title: '泡货体积',
                dataIndex: 'orderNumber9',
                key: 'orderNumber9',
                width: 120
            }
        ]
    }

    getData = (params) => {
        const { source } = this.props
        return new Promise((resolve, reject) => {
            let dataList = [...source.sendCarOrderList]
            dataList = dataList.map(item => {
                // item.sendcarDate = source.createTime
                item.createTime = source.createTime
                return item
            })
            resolve({
                dataSource: dataList,
                total: dataList.length
            })
        })
    }

    render() {
        const {
            columns
        } = this.state
        return (
            <Table
                noPadding
                isHideHeaderButton
                isNoneSelected
                isNoneNum
                isNonePagination
                parent={this}
                getThis={v => this.tableView = v}
                isNoneAction
                title={null}
                getData={this.getData}
                columns={columns}
                tableWidth={80}
            />
        )
    }
}