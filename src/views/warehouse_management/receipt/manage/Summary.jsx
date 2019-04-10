import React from 'react'
import { Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { inject, observer } from "mobx-react"

// 收货汇总
@inject('rApi', 'mobxDataBook')
@observer
class Summary extends Parent {

    constructor(props) {
        super(props)
        this.state = {
            exportLoading: false,
            summaryList: [], //收货清单列表数据
        }
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                title: '料号',
                dataIndex: 'materialNumber',
                key: 'materialNumber',
                width: 100,
                render: (t, r, rIndex) => {
                    let name = t.split('-')[0] ? t.split('-')[0] : '无'
                    return (
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '品名',
                dataIndex: 'materialName',
                key: 'materialName',
                width: 120,
                render: (t, r, rIndex) => {
                    return (
                        <ColumnItemBox name={t} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '批次号',
                dataIndex: 'batchNumber',
                key: 'batchNumber',
                width: 100,
                render: (t, r, rIndex) => {
                    return (
                        <ColumnItemBox name={t} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '单位',
                dataIndex: 'unit',
                key: 'unit',
                width: 90,
                render: (t, r, rIndex) => {
                    return (
                        <ColumnItemBox name={t} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '板数(实/预)',
                dataIndex: 'actualBoardCount',
                key: 'actualBoardCount',
                width: 120,
                render: (t, r, rIndex) => {
                    let name = `${r.actualBoardCount ? r.actualBoardCount : 0}/${r.boardCount}`
                    let style = r.actualBoardCount !== r.boardCount ? { color: '#f5222d' } : {}
                    return (
                        <ColumnItemBox style={style} name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '箱数(实/预)',
                dataIndex: 'actualBoxCount',
                key: 'actualBoxCount',
                width: 120,
                render: (t, r, rIndex) => {
                    let name = `${r.actualBoxCount ? r.actualBoxCount : 0}/${r.boxCount}`
                    let style = r.actualBoxCount !== r.boxCount ? { color: '#f5222d' } : {}
                    return (
                        <ColumnItemBox style={style} name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '数量(实/预)',
                dataIndex: 'actualQuantityCount',
                key: 'actualQuantityCount',
                width: 120,
                render: (t, r, rIndex) => {
                    let name = `${r.actualQuantityCount ? r.actualQuantityCount : 0}/${r.quantityCount}`
                    let style = r.actualQuantityCount !== r.quantityCount ? { color: '#f5222d' } : {}
                    return (
                        <ColumnItemBox style={style} name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: `重量(${props.weightUnit || 'kg'})`,
                dataIndex: 'actualGrossWeight',
                key: 'actualGrossWeight',
                width: 120,
                render: (t, r, rIndex) => {
                    let name = `${r.actualGrossWeight ? r.actualGrossWeight : 0}/${r.grossWeight}`
                    let style = r.actualGrossWeight !== r.grossWeight ? { color: '#f5222d' } : {}
                    return (
                        <ColumnItemBox style={style} name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '体积(m³)',
                dataIndex: 'actualVolume',
                key: 'actualVolume',
                width: 120,
                render: (t, r, rIndex) => {
                    let name = `${r.actualVolume ? r.actualVolume : 0}/${r.volume}`
                    let style = r.actualVolume !== r.volume ? { color: '#f5222d' } : {}
                    return (
                        <ColumnItemBox style={style} name={name} />
                    )
                }
            }
        ]
    }

    // 列表数据获取
    getData = async (params) => {
        const { rApi, curRow } = this.props
        params = Object.assign({}, params, {
            pageSize: params.limit,
            receiptManageId: curRow.receiptManageId
        })
        return new Promise((resolve, reject) => {
            rApi.getReceiptSummary(params)
                .then(async res => {
                    let { summaryList } = this.state
                    summaryList = [...res.records]
                    await this.setState({ summaryList })
                    resolve({
                        dataSource: this.state.summaryList,
                        total: res.total
                    })
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    render() {
        return (
            <Table
                isNoneAction
                isNoneSelected
                isHideHeaderButton
                parent={this}
                title={null}
                getData={this.getData}
                columns={this.state.columns}
            />
        )
    }
}

export default Summary