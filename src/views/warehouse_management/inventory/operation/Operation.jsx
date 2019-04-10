import React from 'react'
import { Button, InputNumber, Select, message } from 'antd'
import { Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { inject } from "mobx-react"
import PdfView from './PdfView'
import moment from 'moment'

const { Option } = Select

const colRendFun = (t, r, index, props, key) => {
    let name = t
    const { _ } = props
    let list = _.gd()
    switch (key) {
        case 'checkResult': //盘点结果
            if (r.isEdit) {
                return (
                    <ColumnItemBox isFormChild>
                        <Select
                            style={{ width: '100%' }}
                            value={t ? t : 1}
                            onSelect={(val, opt) => {
                                list[index][key] = val
                                _.upd(list)
                            }}
                        >
                            <Option value={1} title='正常'>正常</Option>
                            <Option value={2} title='数据异常'>数据异常</Option>
                            <Option value={3} title='货损异常'>货损异常</Option>
                        </Select>
                    </ColumnItemBox>
                )
            } else {
                name = (r.status === 1 || r.status === 3) ? '未盘' : t === 1 ? '正常' : t === 2 ? '数据异常' : t === 3 ? '货损异常' : '-'
                return <ColumnItemBox name={name} />
            }

        case 'checkSum': //盘点数量
            if (r.isEdit) {
                return (
                    <ColumnItemBox isFormChild>
                        <InputNumber
                            style={{ width: '100%' }}
                            value={t}
                            min={0}
                            max={r.quantityCount}
                            onChange={val => {
                                list[index][key] = val
                                _.upd(list)
                            }}
                        />
                    </ColumnItemBox>
                )
            } else {
                return <ColumnItemBox name={name} />
            }
    
        default:
            if (key === 'receiptTime') {
                name = moment(t).format('YYYY-MM-DD')
            } else if (key === 'status') {
                name = t === 1 ? '良品' : '不良品'
            }
            return (
                <ColumnItemBox name={name} />
            )
    }
}

const colFun = (props = {}) => [
    {
        className: 'text-overflow-ellipsis',
        title: '盘点结果',
        dataIndex: 'checkResult',
        key: 'checkResult',
        width: 120,
        render: (t, r, i) => colRendFun(t, r, i, props, 'checkResult')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '盘点数量',
        dataIndex: 'checkSum',
        key: 'checkSum',
        width: 100,
        render: (t, r, i) => colRendFun(t, r, i, props, 'checkSum')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '待盘数量',
        dataIndex: 'quantityCount',
        key: 'quantityCount2',
        width: 100,
        render: (t, r, i) => colRendFun(t, r, i, props, 'quantityCount')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        width: 100,
        render: (t, r, i) => colRendFun(t, r, i, props, 'unit')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '板号',
        dataIndex: 'boardNumber',
        key: 'boardNumber',
        width: 120,
        render: (t, r, i) => colRendFun(t, r, i, props, 'boardNumber')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '储位',
        dataIndex: 'warehouseStorageNumber',
        key: 'warehouseStorageNumber',
        width: 100,
        render: (t, r, i) => colRendFun(t, r, i, props, 'warehouseStorageNumber')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '料号',
        dataIndex: 'materialNumber',
        key: 'materialNumber',
        width: 100,
        render: (t, r, i) => colRendFun(t, r, i, props, 'materialNumber')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '品名',
        dataIndex: 'materialName',
        key: 'materialName',
        width: 100,
        render: (t, r, i) => colRendFun(t, r, i, props, 'materialName')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '箱数',
        dataIndex: 'boxCount',
        key: 'boxCount',
        width: 100,
        render: (t, r, i) => colRendFun(t, r, i, props, 'boxCount')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '数量',
        dataIndex: 'quantityCount',
        key: 'quantityCount',
        width: 100,
        render: (t, r, i) => colRendFun(t, r, i, props, 'quantityCount')
    },
    {
        className: 'text-overflow-ellipsis',
        title: `重量(${props.weightUnit})`,
        dataIndex: 'grossWeight',
        key: 'grossWeight',
        width: 100,
        render: (t, r, i) => colRendFun(t, r, i, props, 'grossWeight')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '体积(m³)',
        dataIndex: 'volume',
        key: 'volume',
        width: 100,
        render: (t, r, i) => colRendFun(t, r, i, props, 'volume')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '收货单号',
        dataIndex: 'singleNumber',
        key: 'singleNumber',
        width: 120,
        render: (t, r, i) => colRendFun(t, r, i, props, 'singleNumber')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '收货日期',
        dataIndex: 'receiptTime',
        key: 'receiptTime',
        width: 120,
        render: (t, r, i) => colRendFun(t, r, i, props, 'receiptTime')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '客户',
        dataIndex: 'clientName',
        key: 'clientName',
        width: 120,
        render: (t, r, i) => colRendFun(t, r, i, props, 'clientName')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '货物状态',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        render: (t, r, i) => colRendFun(t, r, i, props, 'status')
    }
]

@inject('rApi')
class Summary extends Parent {
    constructor(props) {
        super(props);
        if (props.getThis) {
            props.getThis(this)
        }
        this.state = {
            saveLoading: false,
            columns: colFun({ _: this, weightUnit: 'kg' }),
            operationList: []
        }
    }

    componentWillReceiveProps (nextProps) {
        // console.log('rr', this.props.curRow, nextProps.curRow)
        const { curRow } = this.props
        const nextCurRow = nextProps.curRow
        if (curRow && nextCurRow) {
            if (curRow.id !== nextCurRow.id || curRow.status !== nextCurRow.status) {
                this.searchCriteria()
            }
        }
    }

    // 列表数据获取
    getData = async (params) => {
        const { rApi, curRow } = this.props
        let { id } = curRow
        return new Promise((resolve, reject) => {
            if (!id) {
                resolve({
                    dataSource: [],
                    total: 0
                })
                this.setState({ operationList: [] }, () => {
                    this.pdfView.searchCriteria()
                })
                return false
            }
            rApi.getCheckDetailList({id})
                .then(async res => {
                    let list = [...res]
                    list = this.dealList(list)
                    this.setState({ operationList: list }, () => {
                        this.pdfView.searchCriteria()
                    })
                    resolve({
                        dataSource: list,
                        total: list.length
                    })
                })
                .catch(err => {
                    resolve({
                        dataSource: [],
                        total: 0
                    })
                    this.setState({ operationList: [] }, () => {
                        this.pdfView.searchCriteria()
                    })
                })
        })
    }
    dealList = arr => arr.map(item => ({
        ...item,
        isEdit: false
    }))

    // 表格顶部按钮
    cusTableHeaderButton = () => (
        <Button
            icon={'export'}
            style={{verticalAlign: 'middle', marginRight: 10}}
            onClick={this.exportPdf}
        >
            导出
        </Button>
    )

    exportPdf = async () => {
        this.pdfView.exportPDF()
    }

    // 表格action编辑|保存
    onEditItem = (r, i) => {
        let list = this.gd()
        list[i].isEdit = true
        this.upd(list)
    }
    onSaveAddNewData = async (r, i) => {
        if (this.state.saveLoading) return
        const { rApi } = this.props
        let reqData = {
            id: r.id,
            checkResult: r.checkResult,
            checkSum: r.checkSum
        }
        this.setState({ saveLoading: true })
        try {
            await rApi.changeCheckDetailList(reqData)
            message.success('操作成功')
            let list = this.gd()
            list[i].isEdit = false
            this.upd(list)
            this.setState({ saveLoading: false })
        } catch (error) {
            message.error(error.msg || '操作失败')
            this.setState({ saveLoading: false })
            return false
        }
    }

    render() {
        const { curRow, weightUnit } = this.props
        let { columns, operationList } = this.state
        columns = colFun({ _: this, weightUnit: weightUnit || 'kg' })
        return (
            <div>
                {
                    curRow &&
                    <PdfView
                        parent={this}
                        getThis={v => this.pdfView = v}
                        curRow={curRow}
                        operationList={operationList}
                        weightUnit={weightUnit}
                    />
                }
                <Table
                    isNoneAction={!curRow || (curRow && curRow.status !== 1)}
                    isHideAddButton
                    isHideDeleteButton
                    isNoneSelected
                    isPreventActionEvent
                    isNonePagination
                    parent={this}
                    getData={this.getData}
                    columns={columns}
                    tableWidth={120}
                    tableHeight={500}
                    cusTableHeaderButton={this.cusTableHeaderButton()}
                    power={{
                        EDIT_DATA: {},
                        DEL_DATA: null
                    }}
                    actionWidth={90}
                    onEditItem={this.onEditItem}
                    onSaveAddNewData={this.onSaveAddNewData}
                    isShowActionDel={false}
                />
            </div>
        )
    }
}

export default Summary