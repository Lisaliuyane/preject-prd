import React, { Fragment } from 'react'
import { Table, Parent } from '@src/components/table_template'
import Titlebar from '../public/Titlebar'
import UploadExcel from '@src/components/upload_excel'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { children, id } from './power_hide'
import { Button, message } from 'antd'
import { inject } from 'mobx-react'
import JsExportExcel from 'js-export-excel'
import ModalAddOrEdit from './ModalAddOrEdit'

const power = Object.assign({}, children, id)

@inject('rApi', 'mobxDataBook')
class Storage extends Parent {
    constructor (props) {
        super(props)
        this.state = {
            columns: [
                {
                    className: 'text-overflow-ellipsis',
                    title: '储位号',
                    dataIndex: 'number',
                    key: 'number1',
                    width: 140
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '储位类型',
                    dataIndex: 'typeName',
                    key: 'typeName',
                    width: 100
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '储位容量(m³)',
                    dataIndex: 'capacity',
                    key: 'capacity',
                    width: 100
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '长',
                    dataIndex: 'length',
                    key: 'length',
                    width: 100
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '宽',
                    dataIndex: 'width',
                    key: 'width',
                    width: 100
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '高',
                    dataIndex: 'height',
                    key: 'height',
                    width: 100
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    width: 100
                }
            ],
            storageList: []
        }
    }

    /* 获取储位列表 */
    getData = (params) => {
        const { warehouseId, rApi } = this.props
        params = {
            ...params,
            pageSize: params.limit,
            warehouseId
        }
        return new Promise((resolve, reject) => {
            rApi.getStorageList(params)
                .then(async res => {
                    // console.log('response', res)
                    let storageList = [...res.records]
                    await this.setState({ storageList })
                    resolve({
                        dataSource: this.state.storageList,
                        total: res.total
                    })
                })
                .catch(err => {
                    console.log(err)
                    resolve({
                        dataSource: [],
                        total: 0
                    })
                })
        })
    }

    // 删除储位
    onDeleteItem = async (r, index) => {
        try {
            await this.props.rApi.deleteStorage({ id: r.id || null })
        } catch (error) {
            message.error(error.msg || '操作失败')
            return
        }
        this.searchCriteria()
        this.props.parent.getSumData()
        message.success('操作成功')
    }

    /* 批量删除操作 */
    doDelete = async (d) => {
        if (!d || (d && d.length < 1)) {
            message.warning('未选择要删除项')
            return
        }
        try {
            await this.props.rApi.deleteStorageBatch(d)
        } catch (error) {
            message.error(error.msg || '操作失败')
            return
        }
        this.searchCriteria()
        this.props.parent.getSumData()
        message.success('操作成功')
    }

    /* 导出表头操作 */
    exportDetails = async () => {
        this.saveExcel([])
    }

    /* 导出数据到EXCEL */
    saveExcel(list) {
        this.setState({ exportLoading: true })
        const { columns } = this.state
        let fileName = '表头模板',
            sheetHeader = columns.filter(item => item.title).map(item => {
                return item.title
            }),
            sheetFilter = columns.filter(item => item.title).map(item => {
                return item.dataIndex
            }),
            sheetName = 'sheet1',
            sheetData = []
        let opt = {
            fileName,
            datas: [{
                sheetData,
                sheetName,
                sheetHeader,
                sheetFilter
            }]
        }
        let toExcel = new JsExportExcel(opt)
        toExcel.saveExcel()
        this.setState({ exportLoading: false })
    }

    /* 导入 */
    getExcelData = async (d) => {
        const { rApi, warehouseId, mobxDataBook, parent } = this.props
        let reqData = d.slice(1)
        if (this.state.importLoading) {
            return
        }
        await this.setState({ importLoading: true })
        mobxDataBook.initData('储位类型')
            .then(res => {
                return [...res]
            })
            .then(bookList => {
                reqData = reqData.map(item => {
                    let typeId = bookList.find(k => k.title === item[1]) ? bookList.find(k => k.title === item[1]).id : null
                    return {
                        number: item[0],
                        typeId,
                        typeName: item[1],
                        capacity: item[2],
                        length: item[3],
                        width: item[4],
                        height: item[5],
                        remark: item[6],
                        warehouseId
                    }
                })
                if (reqData.some(item => item.typeId === null)) {
                    message.warning('存在未知储位类型')
                    this.setState({ importLoading: false })
                    return
                }
                rApi.importWarehouseStorage(reqData)
                    .then(res => {
                        this.searchCriteria()
                        parent.getSumData()
                        this.setState({ importLoading: false })
                        message.success('操作成功')
                    })
                    .catch(err => {
                        this.setState({ importLoading: false })
                        message.error(err.msg || '操作失败')
                    })
            })
            .catch(err => {
                console.log('储位类型获取失败', err)
                this.setState({ importLoading: false })
            })
    }

    /* 自定义表格标题按钮 */
    tbHeadButton = () => {
        const { importLoading, exportLoading, deleteLoading } = this.state
        return (
            <Fragment>
                <FunctionPower power={power.IMPORT_STORAGE_DATA}>
                    <UploadExcel getExcelData={this.getExcelData} loading={importLoading} />
                </FunctionPower>
                <Button
                    onClick={this.exportDetails}
                    className='tb-head-btn'
                    icon="export"
                    loading={exportLoading}
                >
                    导出表头
                </Button>
            </Fragment>
        )
    }
    
    render() {
        const {
            warehouseId,
            parent
        } = this.props
        return (
            <div
                className={this.props.className}
            >
                <ModalAddOrEdit
                    parent={this}
                    getThis={v => this.modalAddoredit = v}
                    warehouseId={warehouseId}
                    getSumData={parent.getSumData}
                />
                <Titlebar title={'储位清单'} />
                <Table
                    className='storage-table'
                    modalName='modalAddoredit'
                    actionWidth={90}
                    title={null}
                    parent={this}
                    power={{
                        EDIT_DATA: power.EDIT_DATA,
                        DEL_DATA: power.DEL_DATA
                    }}
                    getData={this.getData}
                    cusTableHeaderButton={this.tbHeadButton()}
                    columns={this.state.columns}
                    batchDel={this.doDelete}
                    onDeleteItem={this.onDeleteItem}
                    tableWidth={140}
                >
                </Table>
            </div>
        )
    }
}

export default Storage