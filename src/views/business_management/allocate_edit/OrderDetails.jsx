import React, { Component, Fragment } from 'react'
import { Table } from '@src/components/table_template'
import moment from 'moment'

/* 订单明细 */
class OrderDetails extends Component {
    state = {
        columns: [
            {
                className: 'text-overflow-ellipsis',
                title: '订单号',
                dataIndex: 'orderNumber',
                key: 'orderNumber',
                width: 120
            },
            {
                className: 'text-overflow-ellipsis',
                title: '客户名称',
                dataIndex: 'clientName',
                key: 'clientName',
                width: 120
            },
            {
                className: 'text-overflow-ellipsis',
                title: '配载段',
                dataIndex: 'departure',
                key: 'departure',
                width: 120,
                render: (val, r, index) => {
                    return <span title={r.departure + '-' + r.destination}>{r.departure + '-' + r.destination}</span>
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '提货时间',
                dataIndex: 'departureTime',
                key: 'departureTime',
                width: 120,
                render: (val, r, index) => {
                    return <span title={val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '-'}>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '要求到达',
                dataIndex: 'aging',
                key: 'aging',
                width: 120,
                render: (val, r, index) => {
                    return <span title={r.departureTime && val ? moment(r.departureTime + (3600000 * parseFloat(val))).format('YYYY-MM-DD HH:mm:ss') : '-'}>{r.departureTime && val ? moment(r.departureTime + (3600000 * parseFloat(val))).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>
                }
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
                title: '箱数',
                dataIndex: 'totalBoxCount',
                key: 'totalBoxCount',
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
                title: '毛重(kg)',
                dataIndex: 'totalGrossWeight',
                key: 'totalGrossWeight',
                width: 120
            },
            {
                className: 'text-overflow-ellipsis',
                title: '净重(kg)',
                dataIndex: 'totalNetWeight',
                key: 'totalNetWeight',
                width: 120
            },
            {
                className: 'text-overflow-ellipsis',
                title: '体积(m³)',
                dataIndex: 'totalVolume',
                key: 'totalVolume',
                width: 120
            }
        ]
    }

    /* 表格数据 */
    getData = () => {
        const { sendCarOrderList } = this.props
        return new Promise((resolve, reject) => {
            resolve({
                dataSource: sendCarOrderList || [],
                total: sendCarOrderList.length || 0
            })
        })
    }

    render() {
        const {columns} = this.state
        return (
            <Fragment>
                <Table
                    parent={this}
                    style={{marginBottom: 12}}
                    isNoneSelected={true}
                    isNoneNum={true}
                    isNoneAction={true}
                    THeader={<span></span>}
                    getData={this.getData}
                    isHideHeaderButton={true}
                    columns={columns}
                    isNonePagination={true}
                />
            </Fragment>
        )
    }
}

export default OrderDetails