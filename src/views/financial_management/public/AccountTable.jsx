import React from 'react'
import { Table, Parent, ColumnItemBox } from '@src/components/table_template'
import moment from 'moment'

/* AccountTable */
export default class AccountTable extends Parent {
    state = {
        dataList: [], //表格数据
    }
    constructor(props) {
        super(props)
        if (props.getRef) {
            props.getRef(this)
        }
        const { type } = props.source.openData
        this.state.columns = type === 'sendcar' ? [
            {
                className: 'text-overflow-ellipsis',
                title: '派车单号',
                dataIndex: 'sendCarNumber',
                key: 'sendCarNumber',
                width: 130,
                render: (val, r) => {
                    return (
                        <ColumnItemBox active={r.active} name={val} />
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
                    let name = val && moment(val).format('YYYY-MM-DD')
                    return (
                        <ColumnItemBox active={r.active} name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '承运商',
                dataIndex: 'carrierName',
                key: 'carrierName',
                width: 140,
                render: (val, r) => {
                    let name = val ? val : r.carType === 1 ? val : r.carType === 2 ? '现金车' : '-'
                    return (
                        <ColumnItemBox active={r.active} name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '车牌',
                dataIndex: 'carCode',
                key: 'carCode',
                width: 120,
                render: (val, r) => {
                    return (
                        <ColumnItemBox active={r.active} name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '司机',
                dataIndex: 'driverName',
                key: 'driverName',
                width: 120,
                render: (val, r) => {
                    return (
                        <ColumnItemBox active={r.active} name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '联系电话',
                dataIndex: 'phone',
                key: 'phone',
                width: 140,
                render: (val, r) => {
                    return (
                        <ColumnItemBox active={r.active} name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '车型',
                dataIndex: 'carType',
                key: 'carType',
                width: 120,
                render: (val, r) => {
                    let name = val === 1 ? '承运商车辆' : val === 2 ? '现金车' : '-'
                    return (
                        <ColumnItemBox active={r.active} name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '起运地目的地',
                dataIndex: 'departure',
                key: 'departure',
                width: 200,
                render: (text, r, index) => {
                    let name = r.departure ? `${r.departure}${r.transitPlaceOneName ? `-${r.transitPlaceOneName}` : ''}-${r.destination}` : '-'
                    return (
                        <ColumnItemBox active={r.active} name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '费用',
                dataIndex: 'estimatedCost',
                key: 'estimatedCost',
                width: 140,
                render: (val, r) => {
                    return (
                        <ColumnItemBox active={r.active} style={{ color: '#E76400' }} name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '税后金额',
                dataIndex: 'afterTaxAmount',
                key: 'afterTaxAmount',
                width: 100,
                render: (val, r) => {
                    return (
                        <ColumnItemBox active={r.active} style={{ color: '#E76400' }} name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '币别',
                dataIndex: 'currencyName',
                key: 'currencyName',
                width: 120,
                render: (val, r) => {
                    return (
                        <ColumnItemBox active={r.active} name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '结算方式',
                dataIndex: 'billingMethod',
                key: 'billingMethod',
                width: 120,
                render: (val, r) => {
                    let name = val === 1 ? '合同价' : '现金价'
                    return (
                        <ColumnItemBox active={r.active} name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '所属配载单',
                dataIndex: 'stowageNumber',
                key: 'stowageNumber',
                width: 120,
                render: (val, r) => {
                    return (
                        <ColumnItemBox active={r.active} name={val} />
                    )
                }
            }
        ]
        :
        [
            {
                className: 'text-overflow-ellipsis',
                title: '下单日期',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 120,
                render: (val, r) => {
                    let name = val && moment(val).format('YYYY-MM-DD')
                    return (
                        <ColumnItemBox active={r.active} name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '承运商',
                dataIndex: 'carrierName',
                key: 'carrierName',
                width: 140,
                render: (val, r) => {
                    return (
                        <ColumnItemBox active={r.active} name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '联系人',
                dataIndex: 'carrierContactName',
                key: 'carrierContactName',
                width: 120,
                render: (val, r) => {
                    return (
                        <ColumnItemBox active={r.active} name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '联系电话',
                dataIndex: 'carrierContactPhone',
                key: 'carrierContactPhone',
                width: 140,
                render: (val, r) => {
                    return (
                        <ColumnItemBox active={r.active} name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '报价路线',
                dataIndex: 'departure',
                key: 'departure',
                width: 200,
                render: (text, r, index) => {
                    let name = r.departure ? `${r.departure}${r.transitPlaceOneName ? `-${r.transitPlaceOneName}` : ''}-${r.destination}` : '-'
                    return (
                        <ColumnItemBox active={r.active} name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '费用',
                dataIndex: 'estimatedCost',
                key: 'estimatedCost',
                width: 140,
                render: (val, r) => {
                    return (
                        <ColumnItemBox active={r.active} style={{ color: '#E76400' }} name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '税后金额',
                dataIndex: 'afterTaxAmount',
                key: 'afterTaxAmount',
                width: 100,
                render: (val, r) => {
                    return (
                        <ColumnItemBox active={r.active} style={{ color: '#E76400' }} name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '币别',
                dataIndex: 'currencyName',
                key: 'currencyName',
                width: 120,
                render: (val, r) => {
                    return (
                        <ColumnItemBox active={r.active} name={val} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '结算方式',
                dataIndex: 'billingMethod',
                key: 'billingMethod',
                width: 120,
                render: (val, r) => {
                    let name = val === 1 ? '合同价' : '现金价'
                    return (
                        <ColumnItemBox active={r.active} name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '所属配载单',
                dataIndex: 'stowageNumber',
                key: 'stowageNumber',
                width: 120,
                render: (val, r) => {
                    return (
                        <ColumnItemBox active={r.active} name={val} />
                    )
                }
            }
        ]
    }

    getData = (params) => {
        const {
            iList,
            source
        } = this.props
        return new Promise((resolve, reject) => {
            let dataList = [...iList]
            dataList = dataList.map(item => {
                item.createTime = source.createTime
                return item
            })
            if (dataList.length > 0) {
                dataList = dataList.map((item, index) => {
                    item.active = index === 0
                    return item
                })
                this.rowClick(dataList[0], 0)
            }
            this.setState({dataList}, () => {
                resolve({
                    dataSource: this.state.dataList,
                    total: this.state.dataList.length
                })
            })
        })
    }

    /* 行点击操作 */
    rowClick = (r, rIndex) => {
        // console.log('r', rIndex, r)
        const { changeRow } = this.props
        let {dataList} = this.state
        dataList = dataList.map((item, index) => {
            item.active = index === rIndex
            return item
        })
        this.setState({dataList})
        changeRow(r)
    }

    render() {
        const {
            columns
        } = this.state
        return (
            <Table
                className='itable-nopad'
                style={{marginTop: 5}}
                noPadding
                isHideHeaderButton
                isNoneSelected
                isNonePagination
                isNoneNum
                THeader={<i></i>}
                parent={this}
                getThis={v => this.tableView = v}
                isNoneAction
                getData={this.getData}
                columns={columns}
                onRowClick={this.rowClick}
                tableWidth={80}
            />
        )
    }
}
