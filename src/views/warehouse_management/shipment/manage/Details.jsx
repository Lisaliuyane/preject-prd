import React from 'react'
import { Button, Popconfirm, message } from 'antd'
import { Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { inject } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { colFun } from '../../inventory/manage/index.jsx'
import PdfView from './PdfView'

const cFun = (props) => {
   
    const { _ } = props
    console.log('hahhah',_)
    // console.log('cFun', _.props.curRow.shipmentManageId)
    const shipmentManageId = (_.props.curRow && _.props.curRow.shipmentManageId) ? _.props.curRow.shipmentManageId : null
    let rt = colFun(props).filter(item => {
        let noCols = ['仓库名称', '货物状态', '收货单号', '收货日期', '客户简称']
        return (!noCols.some(title => title === item.title))
    })
    // let storageCol = rt.find(item => item.title === '板号')
    // let index = rt.indexOf(storageCol)
    // storageCol.width = 170
    // storageCol.render = (t, r, index) => {
    //     if (r.isEdit) {
    //         let list = _.gd()
    //         return (
    //             <ColumnItemBox isFormChild>
    //                 <RemoteSelect
    //                     defaultValue={r && r.boardNumber ? {
    //                         id: r.inventoryManageId,
    //                         boardNumber: r.boardNumber
    //                     } : null}
    //                     onChangeValue={val => _.selectBoard(val, r, index)}
    //                     placeholder='选择板号'
    //                     getDataMethod={'getShipmentBoardDetails'}
    //                     params={{ pageNo: 1, pageSize: 99999, shipmentManageId }}
    //                     labelField={'boardNumber'}
    //                     showOrigin
    //                     dealData={arr => {
    //                         return arr.filter(item => !list.some(l => l.boardNumber === item.boardNumber))
    //                     }}
    //                 />
    //             </ColumnItemBox>
    //         )
    //     } else {
    //         return (
    //             <ColumnItemBox boxClass='td-rowspan' name={t} isModeTag={r.isBaffle === 1} tagName='拆' tagBgc={'#F56C6C'} />
    //         )
    //     }
    // }
    // rt.splice(index, 1, storageCol)
    return rt
}

@inject('rApi')
class Details extends Parent {
    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        this.state = {
            columns: cFun({ _: this }),
            selectedKeys: [],
            saveLoading: false,
            delLoading: false
        }
    }

    // 列表数据获取
    getData = (params) => {
        const { rApi, curRow } = this.props
        params = {
            pageNo: params.pageNo,
            pageSize: 99999,
            shipmentManageId: curRow.shipmentManageId
        }
        return new Promise((resolve, reject) => {
            rApi.getPickList(params)
                .then(async res => {
                    let list = [...res.records]
                    list = this.dealList(list)
                    resolve({
                        dataSource: list,
                        total: res.total
                    })
                })
                .catch(err => {
                    console.error(err)
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

    // 导出
    exportPdf = async () => {
        this.pdfView.exportPDF()
    }

    // 表格顶部按钮
    cusTableHeaderButton = () => {
        const { confirmShipment, curRow } = this.props
        const list = this.gd()
        return (
            <React.Fragment>
                <Button
                    disabled={curRow.shipmentManageStatus !== 3}
                    onClick={this.exportPdf}
                    style={{ marginRight: 10, verticalAlign: 'middle' }}
                    icon="export"
                    // loading={exportLoading}
                >
                    导出
                </Button>
                <Popconfirm
                    title='是否确定执行系统拣货？'
                    onConfirm={this.pickQuick}
                >
                    <Button
                        style={{ verticalAlign: 'middle', marginRight: 10 }}
                        disabled={this.props.curRow.shipmentManageStatus !== 1 || list.length > 0}
                    >
                        系统拣货
                    </Button>
                </Popconfirm>
                <Button
                    onClick={this.addRow}
                    icon='plus'
                    style={{ verticalAlign: 'middle', marginRight: 10 }}
                    disabled={this.props.curRow.shipmentManageStatus !== 1 || this.props.curRow.pickTypeName === '先进先出'}
                >
                    添加明细
                </Button>
                <Popconfirm
                    title='确定完成出货？'
                    onConfirm={confirmShipment}
                >
                    <Button
                        type='primary'
                        style={{ verticalAlign: 'middle', marginRight: 10 }}
                        disabled={curRow.shipmentManageStatus === 3 || !list || list.some(item => item.isBaffle)}
                    >
                        确认出货
                    </Button>
                </Popconfirm>
                {/* <Button icon={'export'} style={{ verticalAlign: 'middle', marginRight: 10 }}>导出</Button> */}
            </React.Fragment>
        )
    }

    // 系统拣货
    pickQuick = async () => {
        const { curRow } = this.props
        let res = null
        try {
            res = await this.props.rApi.pickShipmentDetails({ id: curRow.shipmentManageId })
            if (res && res.records && res.records.length) {
                if (!res.records.some(item => item.isBaffle)) {
                    const { parent } = this.props
                    if (parent) {
                        let newCurRow = {
                            ...curRow,
                            shipmentManageStatus: 2,
                            color: '#108EE9'
                        }
                        let pList = parent.gd()
                        pList = pList.map(item => ({
                            ...item,
                            shipmentManageStatus: item.shipmentManageId === curRow.shipmentManageId ? 2 : item.shipmentManageStatus,
                            color: item.shipmentManageId === curRow.shipmentManageId ? '#108EE9' : item.color
                        }))
                        parent.setState({ curRow: newCurRow })
                        parent.upd(pList)
                    }
                }
            } else { }
        } catch (error) {
            message.error(error.msg || '操作失败')
            return
        }
        message.success('操作成功')
        this.searchCriteria()
    }

    // 添加明细
    addRow = () => {
        let list = this.gd()
        if (list.some(item => item.isEdit)) {
            message.warning('有未保存项')
            return false
        }
        let newRow = {
            isEdit: true,
            id: 0,
            inventoryManageId: null,
            boardNumber: '',
            warehouseStorageNumber: '',
            materialNumber: '',
            materialName: '',
            materialSpecifications: '',
            batchNumber: '',
            unit: '',
            unitId: null,
            boxCount: null,
            quantityCount: null,
            grossWeight: null,
            volume: null
        }
        list.push(newRow)
        this.upd(list)
    }
    // 编辑/保存
    changeRow = async (r, i) => {
        if (this.state.saveLoading) return
        const { rApi, curRow } = this.props
        let list = this.gd()
        if (r.isEdit) { //保存
            if (!r.boardNumber) {
                message.warning('请选择板号')
                return false
            }
            let reqData = {
                id: r.id || null,
                inventoryManageId: r.inventoryManageId,
                shipmentManageId: curRow.shipmentManageId
            }
            this.setState({ saveLoading: true })
            try {
                await rApi.addShipmentPick(reqData)
                message.success('操作成功')
                this.searchCriteria()
                this.setState({ saveLoading: false })
            } catch (error) {
                message.error(error.msg || '操作失败')
                this.setState({ saveLoading: false })
                return false
            }
        }
        list[i].isEdit = !list[i].isEdit
        console.log('list', list[i])
        this.upd(list)
    }
    // 删除
    delRow = async (r, i) => {
        if (this.state.delLoading) return
        const { rApi } = this.props
        let list = this.gd()
        if (r.id) {
            this.setState({ delLoading: true })
            try {
                await rApi.delShipmentPick({ id: r.id })
                this.setState({ delLoading: false })
            } catch (error) {
                message.error(error.msg || '操作失败')
                this.setState({ delLoading: false })
                return false
            }
        }
        list.splice(i, 1)
        this.upd(list)
        message.success('操作成功')
    }

    // 选择板
    selectBoard = (val, r, i) => {
        let list = this.gd()
        let setData = {}
        if (val) {
            setData = {
                inventoryManageId: val.id,
                warehouseStorageNumber: val.warehouseStorageNumber,
                boardNumber: val.boardNumber,
                materialNumber: val.materialNumber,
                materialName: val.materialName,
                materialSpecifications: val.materialSpecifications,
                batchNumber: val.batchNumber,
                unit: val.unit,
                unitId: val.unitId,
                boxCount: val.boxCount,
                quantityCount: val.quantityCount,
                grossWeight: val.grossWeight,
                volume: val.volume
            }
        } else {
            setData = {
                inventoryManageId: null,
                boardNumber: '',
                warehouseStorageNumber: '',
                materialNumber: '',
                materialName: '',
                materialSpecifications: '',
                batchNumber: '',
                unit: '',
                unitId: null,
                boxCount: null,
                quantityCount: null,
                grossWeight: null,
                volume: null
            }
        }
        // console.log('set', val, setData)
        list[i] = {
            ...list[i],
            ...setData
        }
        this.upd(list)
    }

    // 行选择
    changeSelect = (selectedRowKeys, { deleteKeys, addKeys }) => {
        let rt = [...this.state.selectedKeys]
        if (deleteKeys && deleteKeys.length) {
            rt = rt.filter(item => !deleteKeys.some(key => key.id === item.id))
        }
        if (addKeys && addKeys.length) {
            addKeys.forEach(item => {
                if (!rt.some(key => key.id === item.id)) {
                    rt.push(item)
                }
            })
        }
        this.setState({ selectedKeys: rt })
    }

    // 自定义操作
    actionView = ({ record, index }) => {
        return (
            <React.Fragment>
                <span className='action-button' onClick={() => this.changeRow(record, index)}>{record.isEdit ? '保存' : '编辑'}</span>
                <Popconfirm
                    title='是否确定删除？'
                    onConfirm={() => this.delRow(record, index)}
                >
                    <span className='action-button'>删除</span>
                </Popconfirm>
            </React.Fragment>
        )
    }

    render() {
        const { curRow, weightUnit } = this.props
        let { selectedKeys, columns } = this.state
        columns = cFun({ _: this, weightUnit })
        console.log('(this.state.columns',this.state.columns)
        return (
            <div>
                <PdfView
                    parent={this}
                    getThis={v => this.pdfView = v}
                    curRow={curRow}
                />
                <Table
                    parent={this}
                    isHideAddButton
                    isHideDeleteButton
                    isPreventActionEvent
                    getData={this.getData}
                    columns={columns}
                    cusTableHeaderButton={this.cusTableHeaderButton()}
                    isCustomPagination
                    tableWidth={100}
                    tableHeight={500}
                    selectedPropsRowKeys={selectedKeys}
                    onChangeSelect={this.changeSelect}
                    actionWidth={90}
                    actionView={this.actionView}
                    isNoneAction={curRow.shipmentManageStatus === 3}
                />
            </div>
        )
    }
}
 
export default Details