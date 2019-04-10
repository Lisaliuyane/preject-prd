import React from 'react'
import { message, Input, Button } from 'antd'
import { Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { inject } from "mobx-react"
import UploadExcel from '@src/components/upload_excel'
import JsExportExcel from 'js-export-excel'

@inject('rApi')
class Scanning extends Parent {
    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        this.state = {
            importLoading: false,
            saveLoading: false,
            exportLoading: false,
            columns: [
                // {
                //     className: 'text-overflow-ellipsis',
                //     title: '板号',
                //     dataIndex: 'boardNumber',
                //     key: 'boardNumber',
                //     width: 120,
                //     render: (t, r, rIndex) => {
                //         return this.renderCol(t, r, rIndex, 'boardNumber')
                //     }
                // },
                // {
                //     className: 'text-overflow-ellipsis',
                //     title: '箱号',
                //     dataIndex: 'boxNum',
                //     key: 'boxNum',
                //     width: 120,
                //     render: (t, r, rIndex) => {
                //         return this.renderCol(t, r, rIndex, 'boxNum')
                //     }
                // },
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
    }

    // col渲染
    renderCol = (t, r, rIndex, key) => {
        let list = this.gd()
        switch (key) {
            // case 'boardNumber':
            // case 'boxNum':
            case 'boxSerialNum':
            case 'materialNumber':
            case 'remark':
                if (r.isEdit) {
                    return (
                        <ColumnItemBox isFormChild>
                            <Input
                                value={t}
                                style={{ maxWidth: '400px' }}
                                onChange={e => {
                                    let val = e ? e.target.value : null
                                    list[rIndex][key] = val
                                    this.upd(list)
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
        params = {
            ...params,
            pageSize: params.limit,
            shipmentManageId: curRow.shipmentManageId
        }
        return new Promise((resolve, reject) => {
            rApi.getShipmentScanList(params)
                .then(async res => {
                    let list = [...res.records]
                    list = this.dealList(list)
                    resolve({
                        dataSource: list,
                        total: res.total
                    })
                })
                .catch(err => {
                    resolve({
                        dataSource: [],
                        total: 0
                    })
                })
        })
    }

    // 处理数据
    dealList = arr => arr.map(item => ({
        ...item,
        isEdit: false
    }))
    
    // 表格顶部按钮
    cusTableHeaderButton = () => (
        <React.Fragment>
            <UploadExcel
                getExcelData={this.getExcelData}
                loading={this.state.importLoading}
            />
            <Button
                onClick={this.exportDetails}
                style={{ verticalAlign: 'middle' }}
                icon="export"
                loading={this.state.exportLoading}
            >
                导出
            </Button>
        </React.Fragment>
    )

    /* 导入 */
    getExcelData = async (d) => {
        if (this.state.importLoading) return
        const { rApi, curRow } = this.props
        let reqData = d.slice(1)
        this.setState({ importLoading: true })
        reqData = reqData.map(item => ({
            shipmentManageId: curRow.shipmentManageId,
            boardNumber: item[0],
            boxNum: item[1],
            boxSerialNum: item[2],
            materialNumber: item[3],
            remark: item[4]
        }))
        try {
            await rApi.importShipmentScanning(reqData)
        } catch (error) {
            message.error(error.msg || '操作失败')
            this.setState({ importLoading: false })
            return
        }
        message.success('操作成功')
        this.searchCriteria()
        this.setState({ importLoading: false })
    }

    // 导出操作
    exportDetails = async () => {
        const { rApi, curRow } = this.props
        let res = null
        this.setState({ exportLoading: true })
        try {
            res = await rApi.exportShipmentScanning({ id: curRow.shipmentManageId })
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
    saveExcel(list = []) {
        const { columns } = this.state
        let fileName = '出货扫描',
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


    // 表格行编辑
    onEditItem = async (r, index) => {
        let list = this.gd()
        list[index].isEdit = true
        this.upd(list)
    }
    // 表格行保存
    onSaveAddNewData = async (r, index) => {
        const { curRow } = this.props
        let { saveLoading } = this.state
        let list = this.gd()
        if (saveLoading) return
        this.setState({ saveLoading: true })
        let reqData = {
            id: r.id,
            boardNumber: r.boardNumber,
            boxNum: r.boxNum,
            boxSerialNum: r.boxSerialNum,
            remark: r.remark,
            shipmentManageId: curRow.shipmentManageId
        }
        try {
            await this.props.rApi.editShipmentScanning(reqData)
        } catch (error) {
            message.error(error.msg || '操作失败')
            this.setState({ saveLoading: false })
            return
        }
        message.success('操作成功')
        list[index].isEdit = false
        this.upd(list)
        this.setState({ saveLoading: false })
    }

    // 表格行删除
    onDeleteItem = async (r, index) => {
        let list = this.gd()
        try {
            await this.props.rApi.delShipmentScanning({ id: r.id })
        } catch (error) {
            message.error(error.msg || '操作失败')
            return
        }
        message.success('操作成功')
        list.splice(index, 1)
        this.upd(list)
    }

    render() {
        return (
            <Table
                isHideHeaderButton
                isPreventActionEvent
                power={{
                    EDIT_DATA: {},
                    DEL_DATA: {}
                }}
                parent={this}
                getData={this.getData}
                columns={this.state.columns}
                cusTableHeaderButton={this.cusTableHeaderButton()}
                onEditItem={this.onEditItem}
                onSaveAddNewData={this.onSaveAddNewData}
                onDeleteItem={this.onDeleteItem}
            />
        )
    }
}
 
export default Scanning