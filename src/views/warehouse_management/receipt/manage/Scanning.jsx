import React from 'react'
import { Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { inject, observer } from "mobx-react"
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { Button, message, Input } from 'antd'
import JsExportExcel from 'js-export-excel'
import UploadExcel from '@src/components/upload_excel'

// 收货扫描
@inject('rApi')
@observer
class Scanning extends Parent {

    constructor(props) {
        super(props)
        this.state = {
            exportLoading: false,
            importLoading: false,
            saveLoading: false,
            scanningList: [], //收货清单列表数据
        }
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                title: '板号',
                dataIndex: 'boardNumber',
                key: 'boardNumber',
                width: 120,
                render: (t, r, rIndex) => {
                    return this.renderCol(t, r, rIndex, 'boardNumber')
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '箱号',
                dataIndex: 'boxNum',
                key: 'boxNum',
                width: 120,
                render: (t, r, rIndex) => {
                    return this.renderCol(t, r, rIndex, 'boxNum')
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '序列号',
                dataIndex: 'boxSerialNum',
                key: 'boxSerialNum',
                width: 140,
                render: (t, r, rIndex) => {
                    return this.renderCol(t, r, rIndex, 'boxSerialNum')
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '料号',
                dataIndex: 'materialNumber',
                key: 'materialNumber',
                width: 140,
                render: (t, r, rIndex) => {
                    return this.renderCol(t, r, rIndex, 'materialNumber')
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '操作人',
                dataIndex: 'operatorName',
                key: 'operatorName',
                width: 140,
                render: (t, r, rIndex) => {
                    return this.renderCol(t, r, rIndex, 'operatorName')
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                render: (t, r, rIndex) => {
                    return this.renderCol(t, r, rIndex, 'remark')
                }
            }
        ]
    }

    // col渲染
    renderCol = (t, r, rIndex, key) => {
        let { scanningList } = this.state
        switch (key) {
            case 'boardNumber':
            case 'boxNum':
            case 'boxSerialNum':
            case 'materialNumber':
            case 'remark':
                if (r.isEdit) {
                    return (
                        <ColumnItemBox isFormChild>
                            <Input
                                value={t}
                                style={{maxWidth: '400px'}}
                                onChange={e => {
                                    let val = e ? e.target.value : null
                                    scanningList[rIndex][key] = val
                                    this.setState({ scanningList })
                                }}
                            />
                        </ColumnItemBox>
                    )
                } else {
                    return (
                        <ColumnItemBox name={t} />
                    )
                }

            case 'operatorName':
                return (
                    <ColumnItemBox name={t} />
                )
        
            default:
                return (
                    <ColumnItemBox name={t} />
                )
        }
    }

    // 列表数据获取
    getData = async (params) => {
        const { rApi, curRow } = this.props
        params = Object.assign({}, params, {
            pageSize: params.limit,
            receiptManageId: curRow.receiptManageId
        })
        return new Promise((resolve, reject) => {
            rApi.getReceiptScanList(params)
                .then(async res => {
                    let { scanningList } = this.state
                    scanningList = [...res.records]
                    scanningList = this.dealList(scanningList)
                    await this.setState({ scanningList })
                    resolve({
                        dataSource: this.state.scanningList,
                        total: res.total
                    })
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    // 处理数据
    dealList = arr => arr.map(item => ({
        ...item,
        isEdit: false
    }))

    // 导出操作
    exportDetails = async () => {
        const { rApi, curRow } = this.props
        let res = null
        this.setState({ exportLoading: true })
        try {
            res = await rApi.exportReceiptScanData({ id: curRow.receiptManageId })
            let fileName = `出货扫描.xlsx`
            let header = res.headers
            let contentDsposition = header['content-disposition']
            contentDsposition = contentDsposition.split(';')[1]
            fileName = window.decodeURIComponent(contentDsposition.replace('filename=', ''))
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            this.setState({
                exportLoading: false
            })
            message.success('操作成功')
        } catch (error) {
            message.error(error.msg || '操作失败')
            this.setState({
                exportLoading: false
            })
            return false
        }
        // this.saveExcel()
    }

    /* 导出数据到EXCEL */
    saveExcel (list = []) {
        const { columns } = this.state
        let fileName = '收货扫描',
            sheetHeader = columns.filter(item => item.title && item.title !== '操作人').map(item => {
                return item.title
            }),
            sheetFilter = columns.filter(item => item.title).map(item => {
                return item.dataIndex
            }),
            sheetName = 'sheet1',
            sheetData = list.map(item => {
                item.materialName = `${item.materialName || ''}(${item.materialNumber || ''})`
                return item
            })
        let opt = {
            fileName,
            datas: [{
                sheetData: [],
                sheetName,
                sheetHeader,
                sheetFilter
            }]
        }
        let toExcel = new JsExportExcel(opt)
        toExcel.saveExcel()
    }

    /* 导入 */
    getExcelData = async (d) => {
        if (this.state.importLoading) return
        const { rApi, curRow } = this.props
        let reqData = d.slice(1)
        this.setState({ importLoading: true })
        reqData = reqData.map(item => ({
            receiptManageId: curRow.receiptManageId,
            boardNumber: item[0],
            boxNum: item[1],
            boxSerialNum: item[2],
            materialNumber: item[3],
            remark: item[4]
        }))
        try {
            await rApi.importReceiptScanList(reqData)
        } catch (error) {
            message.error(error.msg || '操作失败')
            this.setState({ importLoading: false })
            return
        }
        message.success('操作成功')
        this.searchCriteria()
        this.setState({ importLoading: false })
    }

    // 表格顶部按钮
    TableHeaderChildren = () => {
        const { curRow } = this.props
        return (
            <React.Fragment>
                {
                    curRow.receiptManageStatus !== 3 && <FunctionPower power={this.props.power.SCAN_IMPORT}>
                        <UploadExcel
                            getExcelData={this.getExcelData}
                            loading={this.state.importLoading}
                        />
                    </FunctionPower>
                }
                <FunctionPower power={this.props.power.SCAN_EXPORT}>
                    <Button
                        onClick={this.exportDetails}
                        style={{ verticalAlign: 'middle' }}
                        icon="export"
                        loading={this.state.exportLoading}
                    >
                        导出
                    </Button>
                </FunctionPower>
            </React.Fragment>
        )
    }

    // 表格行编辑
    onEditItem = async (r, index) => {
        let { scanningList } = this.state
        scanningList[index].isEdit = true
        await this.setState({ scanningList })
    }
    // 表格行保存
    onSaveAddNewData = async (r, index) => {
        const { curRow } = this.props
        let { scanningList, saveLoading } = this.state
        if (saveLoading) return
        this.setState({ saveLoading: true })
        let reqData = {
            id: r.id,
            boardNumber: r.boardNumber,
            boxNum: r.boxNum,
            boxSerialNum: r.boxSerialNum,
            remark: r.remark,
            receiptManageId: curRow.receiptManageId
        }
        try {
            await this.props.rApi.editReceiptScanData(reqData)
        } catch (error) {
            message.error(error.msg || '操作失败')
            this.setState({ saveLoading: false })
            return
        }
        message.success('操作成功')
        scanningList[index].isEdit = false
        this.setState({ scanningList, saveLoading: false })
    }

    // 表格行删除
    onDeleteItem = async (r, index) => {
        let { scanningList } = this.state
        try {
            await this.props.rApi.delReceiptScanData({id: r.id})
        } catch (error) {
            message.error(error.msg || '操作失败')
            return
        }
        message.success('操作成功')
        scanningList.splice(index, 1)
        this.setState({ scanningList })
    }

    render() {
        const { power } = this.props
        return (
            <Table
                isNoneSelected
                isHideHeaderButton
                parent={this}
                title={null}
                getData={this.getData}
                columns={this.state.columns}
                tableWidth={120}
                actionWidth={90}
                power={{
                    EDIT_DATA: power.SCAN_EDIT,
                    DEL_DATA: power.SCAN_DEL
                }}
                onEditItem={this.onEditItem}
                onSaveAddNewData={this.onSaveAddNewData}
                onDeleteItem={this.onDeleteItem}
                TableHeaderChildren={this.TableHeaderChildren()}
            />
        )
    }
}

export default Scanning