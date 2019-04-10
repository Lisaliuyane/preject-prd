import React from 'react'
import { Table, Parent, ColumnItemBox } from '@src/components/table_template'
import moment from 'moment'
import { Popconfirm, message } from 'antd'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { children, id } from '../account/receivable/power'
import { inject } from 'mobx-react'

const power = Object.assign({}, children, id)

/* 预估单明细表 */
@inject('rApi')
export default class OrderinfoTable extends Parent {
    state = {
        dataList: [], //表格数据
    }
    constructor(props) {
        super(props)
        if (props.getRef) {
            props.getRef(this)
        }
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                title: '订单号',
                dataIndex: 'orderNumber',
                key: 'orderNumber',
                width: 140,
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
                title: '客户名称',
                dataIndex: 'clientName',
                key: 'clientName',
                width: 120,
                render: (t, r) => {
                    return (
                        <ColumnItemBox active={r.active} name={t} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '接单法人',
                dataIndex: 'orderLegalName',
                key: 'orderLegalName',
                width: 120,
                render: (t ,r) => {
                    return (
                        <ColumnItemBox active={r.active} name={t} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '项目名称',
                dataIndex: 'projectName',
                key: 'projectName',
                width: 150,
                render: (t, r) => {
                    return (
                        <ColumnItemBox active={r.active} name={t} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '报价路线',
                dataIndex: 'departure',
                key: 'departure',
                width: 200,
                render: (t, r) => {
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
                render: (t, r) => {
                    return (
                        <ColumnItemBox active={r.active} style={{ color: '#E76400' }} name={t} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '币别',
                dataIndex: 'currencyName',
                key: 'currencyName',
                width: 120,
                render: (t, r) => {
                    return (
                        <ColumnItemBox active={r.active} name={t} />
                    )
                }
            }
        ]
    }

    getData = (params) => {
        const {
            source
        } = this.props
        return new Promise((resolve, reject) => {
            let dataList = [...source.receivableEstimateOrderList]
            dataList = dataList.map((item, index) => {
                item.active = index === 0
                item.createTime = source.createTime
                return item
            })
            this.setState({dataList}, () => {
                if (this.state.dataList && this.state.dataList.length) {
                    this.rowClick(dataList[0], 0)
                }
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

    /* 删除行 */
    delRow = (r, index) => {
        const { id } = this.props.source
        this.props.rApi.editAccountReceivable({
            id,
            ids: [r.id]
        })
            .then(resp => {
                this.props.delRow(index)
                message.success('操作成功')
            })
            .catch(err => {
                message.error(err.msg || '操作失败')
            })
    }

    /* 自定义操作 */
    actionView = ({ text, record, index }) => {
        return (
            <FunctionPower power={power.EDIT_ACCOUNT}>
                <Popconfirm
                    title={`确定要刪除此项?`}
                    onConfirm={e => {
                        e.stopPropagation()
                        e.preventDefault()
                        this.delRow(record, index)
                    }}
                    okText="确定"
                    cancelText="取消">
                    <span
                        className={`action-button`}
                    >
                        刪除
                    </span>
                </Popconfirm>
            </FunctionPower>
        )
    }

    render() {
        const {
            columns
        } = this.state
        const { title } = this.props
        return (
            <Table
                noPadding
                isHideHeaderButton
                isNoneSelected
                isNoneNum
                isNonePagination
                parent={this}
                isNoneAction={title === '预估'}
                getThis={v => this.tableView = v}
                actionView={this.actionView}
                actionWidth={90}
                THeader={<span></span>}
                getData={this.getData}
                columns={columns}
                onRowClick={this.rowClick}
                tableWidth={80}
            />
        )
    }
}
