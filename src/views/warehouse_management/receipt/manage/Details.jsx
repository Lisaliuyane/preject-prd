import React from 'react'
import { message, Button, Input, InputNumber, Form, Checkbox, Radio, Popconfirm } from 'antd'
import { Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { inject, observer } from "mobx-react"
import { deleteNull } from '@src/utils'
import RemoteSelect from '@src/components/select_databook'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import FilterSelect from '@src/components/select_filter'
import PdfView from './PdfView'
import PrintView from './PrintView'
import { ruleCalculate } from '@src/utils/logic'

const countKeys = ['quantityCount', 'boxCount', 'boardCount', 'grossWeight', 'volume']

// 收货明细
@inject('rApi')
@observer
class Details extends Parent {

    constructor(props) {
        super(props)
        this.state = {
            produceLoading: false,
            delmanyLoading: false,
            tostorageLoading: false,
            importLoading: false,
            exportLoading: false,
            doreceiptLoading: false,
            saveLoading: false,
            batchAddLoading: false,
            modes: [
                {
                    key: 1,
                    title: '板进',
                    isCheck: true
                },
                // {
                //     key: 2,
                //     title: '箱进',
                //     isCheck: false
                // }
            ],
            modeReady: true, //是否配置好了收货模式
            curMode: 1, //当前选择mode,
            selectedKeys: [], //当前选中行
            columns: this.renCol()
        }
    }

    renCol = () => {
        const { weightUnit } = this.props
        return [
            {
                className: 'text-overflow-ellipsis',
                title: '储位',
                dataIndex: 'warehouseStorageNumber',
                key: 'warehouseStorageNumber',
                width: 120,
                render: (t, r, index) => {
                    return this.renderCell(t, r, index, 'warehouseStorageNumber')
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '板号',
                dataIndex: 'boardNumber',
                key: 'boardNumber',
                width: 130,
                render: (t, r, index) => {
                    return this.renderCell(t, r, index, 'boardNumber')
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '物料名称(料号)',
                dataIndex: 'materialName',
                key: 'materialName',
                width: 200,
                render: (t, r, index) => {
                    return this.renderCell(t, r, index, 'materialName')
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '批次号',
                dataIndex: 'batchNumber',
                key: 'batchNumber',
                width: 100,
                render: (t, r, index) => {
                    return this.renderCell(t, r, index, 'batchNumber')
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '箱数',
                dataIndex: 'boxCount',
                key: 'boxCount',
                width: 100,
                render: (t, r, index) => {
                    return this.renderCell(t, r, index, 'boxCount')
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '数量',
                dataIndex: 'quantityCount',
                key: 'quantityCount',
                width: 100,
                render: (t, r, index) => {
                    return this.renderCell(t, r, index, 'quantityCount')
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: `重量(${weightUnit})`,
                dataIndex: 'grossWeight',
                key: 'grossWeight',
                width: 100,
                render: (t, r, index) => {
                    return this.renderCell(t, r, index, 'grossWeight')
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '体积(m³)',
                dataIndex: 'volume',
                key: 'volume',
                width: 100,
                render: (t, r, index) => {
                    return this.renderCell(t, r, index, 'volume')
                }
            }
        ]
    }

    // 入库明细表格cell
    renderCell = (t, row, rowIndex, colName) => {
        // console.log('this.renderCell', row)
        const { curRow } = this.props
        let list = this.gd()
        switch (colName) {
            case 'warehouseStorageNumber': //储位号列
                let str = row.status === 2 ? t : '待入储'
                let color = row.status === 2 ? '#888': '#F56C6C'
                if (row.storageEdit) {
                    return (
                        <ColumnItemBox isFormChild style={{ color }} pStyle={{ alignItems: 'center', display: 'flex' }}>
                            <RemoteSelect
                                defaultValue={row && row.newWarehouseStorageNumber ? {
                                    id: row.newWarehouseStorageNumber,
                                    number: row.newWarehouseStorageNumber
                                } : null}
                                onChangeValue={
                                    e => {
                                        list[rowIndex].newWarehouseStorageNumber = e ? e.number : null
                                        this.upd(list)
                                    }
                                }
                                params={{ pageSize: 99999, pageNo: 0, warehouseId: curRow.warehouseId }}
                                getDataMethod={'getStorageList'}
                                placeholder='选择储位'
                                labelField={'number'}
                            />
                        </ColumnItemBox>
                    )
                } else {
                    return (
                        <ColumnItemBox boxClass='col-warehouseStorageNumber' style={{ color }} name={str} />
                    )
                }

            case 'materialName': // 物料名称列
                if (row.isEdit) {
                    const selectValue = `${row['materialName'] || ''}(${row['materialNumber'] || '无'})`
                    return (
                        <ColumnItemBox isFormChild>
                            <FilterSelect
                                filterDataOne={{ placeholder: '料号', getDataMethod: 'getReceiptMaterial', params: { id: curRow.receiptManageId }, labelField: 'materialNumber' }}
                                filterDataTwo={{ placeholder: '物料名称', getDataMethod: 'getReceiptMaterial', params: { id: curRow.receiptManageId }, labelField: 'materialName' }}
                                getDataMethod="getReceiptMaterial"
                                params={{ id: curRow.receiptManageId }}
                                labelFieldCode='materialNumber'
                                labelFieldName='materialName'
                                titleName=''
                                selectValue={selectValue}
                                getLabelVul={val => this.setMaterial(colName, val, row, rowIndex)}
                            />
                        </ColumnItemBox>
                    )
                } else {
                    let name = `${row.materialName ? row.materialName : ''}${row.materialNumber ? ('(' + row.materialNumber + ')') : ''}`
                    return (
                        <ColumnItemBox name={name} />
                    )
                }

            case 'batchNumber': //批次号列
                if (row.isEdit) {
                    return (
                        <ColumnItemBox isFormChild>
                            <Input
                                type='text'
                                value={t}
                                onChange={e => {
                                    list[rowIndex][colName] = e.target.value ? e.target.value : null
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

            case 'boxCount': //箱数
            case 'quantityCount': //数量
            case 'grossWeight': //重量
            case 'volume': //体积
                if (row.isEdit) {
                    return (
                        <ColumnItemBox isFormChild>
                            <InputNumber
                                min={0}
                                value={t}
                                style={{ width: '100%', maxWidth: 100 }}
                                onChange={val => this.countChange(colName, val, row, rowIndex)}
                            />
                        </ColumnItemBox>
                    )
                } else {
                    return (
                        <ColumnItemBox name={t} />
                    )
                }

            default: //其他
                return (
                    <ColumnItemBox name={t} />
                )
        }
    }

    // 收货明细列表数据获取
    getData = async (params) => {
        const { rApi, curRow } = this.props
        params = {
            ...params,
            pageSize: 99999,
            receiptManageId: curRow.receiptManageId
        }
        return new Promise((resolve, reject) => {
            params = deleteNull(params)
            rApi.getReceiptDetails(params)
                .then(async res => {
                    let list = [...res.records]
                    list = this.dealList(list)
                    resolve({
                        dataSource: list,
                        total: res.total
                    })
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    // 处理收货明细列表数据
    dealList = (arr) => {
        return arr.map(item => ({
            ...item,
            isEdit: false,
            storageEdit: false
        }))
    }

    // 选择物料
    setMaterial = (key, val, r, i) => {
        if (val) {
            let list = this.gd()
            list[i][key] = val.materialName || ''
            list[i]['materialNumber'] = val.materialNumber || ''
            list[i]['materialSpecifications'] = val.materialSpecifications || ''
            list[i]['unit'] = val.unit || ''
            list[i]['unitId'] = val.unitId || ''
            list[i]['batchNumber'] = val.batchNumber || ''
            list[i]['boardCount'] = 1
            list[i]['boxCount'] = val.boxCount || 0
            list[i]['quantityCount'] = val.quantityCount || 0
            list[i]['grossWeight'] = val.grossWeight || 0
            list[i]['volume'] = val.volume || 0
            list[i]['quantityScale'] = val.quantityScale || ''
            list[i]['boxScale'] = val.boxScale || ''
            list[i]['weightScale'] = val.weightScale || 0
            list[i]['volumeScale'] = val.volumeScale || 0
            list[i]['perUnitWeight'] = val.perUnitWeight || 0
            list[i]['perUnitVolume'] = val.perUnitVolume || 0
            list[i]['unitType'] = val.unitType || 0
            list[i]['shouldPickCount'] = val[countKeys[val.unitType - 1]]
            list[i]['isReceiptScan'] = val.isReceiptScan || 0
            list[i]['isShipmentScan'] = val.isShipmentScan || 0
            // let maxKey = val.unitType ? countKeys[val.unitType - 1] : null
            // let maxVal = val[maxKey]
            // let hasVal = list.filter((item, index) => (item.materialName === val.materialName && index !== i)).reduce((rt, cur) => rt += cur[maxKey], 0)
            // list[i][maxKey] = hasVal + val[maxKey] > maxVal ? maxVal - hasVal : val[maxKey]
            this.upd(list)
        }
    }
    // 编辑数量
    countChange = (key, val, r, i) => {
        val = !isNaN(val) ? val : 0
        let list = this.gd()
        let maxKey = r.unitType ? countKeys[r.unitType - 1] : null
        let maxVal = r.shouldPickCount
        let hasVal = list.filter((item, index) => (item.materialName === r.materialName && index !== i)).reduce((rt, cur) => rt += cur[maxKey], 0)
        if (r.unitType && key === countKeys[r.unitType - 1] && hasVal + val > maxVal) {//限制最大值
            val = maxVal - hasVal
        }
        list[i][key] = val
        if (key === 'boxCount' || key === 'quantityCount') {
            let ruleObj = {
                quantityScale: list[i].quantityScale,
                boxScale: list[i].boxScale,
                weightScale: list[i].weightScale,
                volumeScale: list[i].volumeScale,
                perUnitWeight: list[i].perUnitWeight,
                perUnitVolume: list[i].perUnitVolume
            }
            let rt = ruleCalculate(key, val, ruleObj)
            for (let rtKey in rt) {
                if (rtKey !== 'boardCount' && rt.hasOwnProperty(rtKey)) {
                    list[i][rtKey] = (rtKey === maxKey && hasVal + rt[rtKey] > maxVal) ? maxVal - hasVal : rt[rtKey]
                }
            }
        }
        this.upd(list)
    }
    // 物料编辑保存操作
    changeEdit = async (r, rIndex, type) => {
        const { rApi } = this.props
        let list = this.gd()
        if (type === 'edit') {//编辑
            if (list.some(item => item.isEdit)) {
                message.warning('有未保存项')
                return false
            }
            list[rIndex].isEdit = true
            this.upd(list)
        } else if (type === 'save') {//保存
            if (this.state.saveLoading) return
            if (!r.materialName && !r.materialNumber) {
                message.warning("请选择物料")
                return false
            }
            let reqData = {
                id: r.id,
                receiptManageId: r.receiptManageId,
                batchNumber: r.batchNumber,
                boardCount: r.boardCount,
                boardNumber: r.boardNumber,
                boxCount: r.boxCount,
                grossWeight: r.grossWeight,
                materialName: r.materialName,
                materialNumber: r.materialNumber,
                materialSpecifications: r.materialSpecifications,
                netWeight: r.netWeight,
                quantityCount: r.quantityCount,
                volume: r.volume,
                unit: r.unit,
                unitId: r.unitId,
                warehouseStorageNumber: r.warehouseStorageNumber,
                quantityScale: r.quantityScale,
                boxScale: r.boxScale,
                weightScale: r.weightScale,
                volumeScale: r.volumeScale,
                perUnitWeight: r.perUnitWeight,
                perUnitVolume: r.perUnitVolume,
                unitType: r.unitType,
                shouldPickCount: r.shouldPickCount,
                isReceiptScan: r.isReceiptScan,
                isShipmentScan: r.isShipmentScan
            }
            let res = null
            this.setState({ saveLoading: true })
            try {
                res = await rApi['editReceiptDetailsMaterial'](reqData)
                this.searchCriteria()
                message.success('操作成功')
                this.setState({ saveLoading: false })
            } catch (error) {
                this.setState({ saveLoading: false })
                message.error(error.msg || '操作失败')
                return
            }
        } else { }
    }
    // 删除物料
    delDetails = async (r, rIndex) => {
        const { rApi } = this.props
        let list = this.gd()
        try {
            await rApi.delReceiptMaterialMany([r.id])
            list.splice(rIndex, 1)
            this.upd(list)
            // this.searchCriteria()
            message.success('操作成功')
        } catch (error) {
            message.error(error.msg || '操作失败')
            return
        }
    }

    // 入库明细自定义表格操作
    actionView = ({ text, record, index, onDeleteItem, onEditItem, DeleteButton }) => {
        const { power, curRow } = this.props
        let list = this.gd()
        if (record.storageEdit) {
            return (
                <React.Fragment>
                    <span className={`action-button`} onClick={e => this.toStorage('single', record, index)}>保存</span>
                    <span className={`action-button`} onClick={e => {
                        list[index].warehouseStorageNumber = list[index].warehouseStorageNumber || ''
                        list[index].newWarehouseStorageNumber = ''
                        list[index].storageEdit = false
                        this.upd(list)
                    }}>取消</span>
                </React.Fragment>
            )
        } else {
            if (curRow.receiptManageStatus === 2 || record.status === 2) { //待入储或者已上架
                return <span className={`action-button`} onClick={() => this.editStorage(record, index)}>入储</span>
            }
            return (
                <React.Fragment>
                    {
                        record.isEdit ? <span
                            className={`action-button`}
                            onClick={() => this.changeEdit(record, index, 'save')}
                        >
                            保存
                        </span> : <span
                                className={`action-button`}
                                onClick={() => this.changeEdit(record, index, 'edit')}
                            >
                                编辑
                        </span>
                    }
                    <FunctionPower power={power.DEL_RECEIPT_DETAILS_DATA}>
                        <Popconfirm
                            title='确定删除该项？'
                            onConfirm={() => this.delDetails(record, index)}

                        >
                            <span
                                className={`action-button`}
                            >
                                删除
                            </span>
                        </Popconfirm>
                    </FunctionPower>
                </React.Fragment>
            )
        }
    }

    // 收货模式渲染
    renderModes = (modes) => {
        const { modeReady } = this.state
        return modes.map((item, index) => (
            <Checkbox
                disabled={modeReady}
                key={item.key}
                checked={item.isCheck}
                onChange={e => this.selectMode(item, index)}
            >{item.title}</Checkbox>
        ))
    }
    // 选择收货模式
    selectMode = (target, tIndex) => {
        let { modes } = this.state
        modes = modes.map((item, index) => ({
            ...item,
            isCheck: index === tIndex ? !target.isCheck : item.isCheck
        }))
        this.setState({ modes })
    }
    // 确定收货模式
    setMode = (type) => {
        let modeReady = type === 'confirm' ? true : false
        this.setState({modeReady})
    }

    // 表格顶部左侧
    TableHeaderTitle = () => {
        const { modes, curMode } = this.state
        return (
            <Radio.Group
                value={curMode}
                onChange={this.changeMode}
            >
                {
                    modes && modes.length > 0 ? modes.filter(item => item.isCheck).map(item => (
                        <Radio.Button
                            disabled
                            key={item.key}
                            value={item.key}
                        >{item.title}</Radio.Button>
                    )) : null
                }
                
            </Radio.Group>
        )
    }
    // 修改选中mode
    changeMode = e => {
        let curMode = e ? e.target.value : 1
        this.setState({ curMode })
    }
    // 表格顶部右侧
    TableHeaderChildren = (list) => {
        const { batchAddLoading, produceLoading, delmanyLoading, completeLoading } = this.state
        const { power, curRow, completeReceipt } = this.props
        return (
            <React.Fragment>
                <Button
                    disabled={curRow.receiptManageStatus !== 1 || list.length > 0}
                    onClick={this.produceBoardBatch}
                    style={{ marginRight: 10, verticalAlign: 'middle' }}
                    icon="plus"
                    loading={batchAddLoading}
                >
                    系统收货
                </Button>
                <FunctionPower power={power.DETAILS_BOARD}>
                    <Button
                        disabled={curRow.receiptManageStatus !== 1 || list.some(item => item.isEdit)}
                        onClick={this.produceBoard}
                        style={{ marginRight: 10, verticalAlign: 'middle' }}
                        icon="plus"
                        loading={produceLoading}
                    >
                        添加板
                    </Button>
                </FunctionPower>
                <Popconfirm
                    title='确定删除所选项？'
                    onConfirm={() => this.delMany()}
                >
                    <Button
                        disabled={curRow.receiptManageStatus !== 1}
                        style={{ marginRight: 10, verticalAlign: 'middle' }}
                        icon="delete"
                        loading={delmanyLoading}
                    >
                        删除板
                    </Button>
                </Popconfirm>
                <Popconfirm
                    title='确定完成收货？'
                    onConfirm={completeReceipt}
                >
                    <Button
                        disabled={curRow.receiptManageStatus !== 1}
                        style={{ verticalAlign: 'middle' }}
                        loading={completeLoading}
                        type='primary'
                    >
                        收货完成
                    </Button>
                </Popconfirm>
            </React.Fragment>
        )
    }

    // 导出
    exportPdf = async () => {
        this.pdfView.exportPDF()
    }

    // 生成板号
    produceBoard = async () => {
        let list = this.gd()
        let res = null
        this.setState({ produceLoading: true })
        const { curRow } = this.props
        try {
            res = await this.props.rApi.getReceiptBoardNumber({id: curRow.receiptManageId})
            if (res) {
                let newRow = {
                    ...res,
                    shouldPickCount: 0,
                    isEdit: true,
                    storageEdit: false
                }
                list.push(newRow)
                this.upd(list)
            } else {
                throw Error('返回数据有误')
            }
            this.setState({ produceLoading: false })
        } catch (error) {
            this.setState({ produceLoading: false })
            message.error('生成板号失败')
            return
        }
    }
    // 系统收货
    produceBoardBatch = async () => {
        const { curRow } = this.props
        this.setState({ batchAddLoading: true })
        try {
            await this.props.rApi.getReceiptBoardBatch({ id: curRow.receiptManageId })
            message.success('操作成功')
            this.searchCriteria()
            this.setState({ batchAddLoading: false })
        } catch (error) {
            this.setState({ batchAddLoading: false })
            message.error(error.msg || '生成板失败')
            return
        }
    }

    // 批量删除
    delMany = async () => {
        let { selectedKeys } = this.state
        if (!selectedKeys || selectedKeys.length < 1) {
            message.warning('未选择板')
            return
        }
        let ids = selectedKeys.map(item => item.id)
        try {
            await this.props.rApi.delReceiptMaterialMany(ids)
            message.success('操作成功')
            this.searchCriteria()
        } catch (error) {
            message.error(error.msg || '操作失败')
            return
        }
    }

    // 入储完成
    toStorageComplete = async () => {
        const { rApi, curRow, toStorage } = this.props
        let list = this.gd()
        if (list.some(item => !item.warehouseStorageNumber)) {
            message.warning('有板未入储')
            return false
        }
        try {
            await rApi.completeUppershelf({ id: curRow.receiptManageId })
            toStorage()
            message.success('操作成功')
        } catch (error) {
            message.error(error.msg || '操作失败')
            return false
        }
    }

    // 入储
    toStorage = async (type = 'single', r, rIndex) => {
        let { rApi, curRow } = this.props
        let reqData = []
        let list = this.gd()
        if (this.state.tostorageLoading) return
        if (type === 'single') { //单个入储
            if (!r.newWarehouseStorageNumber) {
                message.warning('请选择储位')
                return
            }
            reqData.push({
                id: r.id,
                receiptManageId: r.receiptManageId,
                warehouseId: curRow.warehouseId,
                warehouseStorageNumber: r.newWarehouseStorageNumber
            })
            this.setState({ tostorageLoading: true })
            try {
                await rApi.doReceiptToStorage(reqData)
                list[rIndex].status = 2
                list[rIndex].warehouseStorageNumber = r.newWarehouseStorageNumber
                list[rIndex].storageEdit = false
                this.upd(list)
                message.success('操作成功')
            } catch (error) {
                message.error(error.msg || '操作失败')
                this.setState({ tostorageLoading: false })
                return
            }
        } else { //批量入储
            let { selectedKeys } = this.state
            let targetList = this.gd().filter(item => selectedKeys.some(s => s.id === item.id))
            if (!targetList || targetList.length < 1) {
                message.warning('请选择需要入储项')
                return
            }
            if (targetList.some(item => !item.warehouseStorageNumber)) {
                message.warning('有未选择储位')
                return
            }
            reqData = targetList.map(item => ({
                id: item.id,
                receiptManageId: item.receiptManageId,
                warehouseId: curRow.warehouseId,
                warehouseStorageNumber: item.warehouseStorageNumber
            }))
            this.setState({ tostorageLoading: true })
            try {
                await rApi.doReceiptToStorage(reqData)
                message.success('操作成功')
                this.searchCriteria()
            } catch (error) {
                this.setState({ tostorageLoading: false })
                message.error(error.msg || '操作失败')
                return
            }
        }
        this.setState({ tostorageLoading: false })
    }

    // 编辑储位
    editStorage = async (r, rIndex) => {
        let list = this.gd()
        if (r === 'batch' && rIndex === -1) { //启动入储
            if (list.some(item => item.isEdit)) {
                message.warning('存在未保存编辑')
                return false
            }
            list = list.map(item => ({
                ...item,
                newWarehouseStorageNumber: item.warehouseStorageNumber,
                storageEdit: true
            }))
        } else {
            list[rIndex].newWarehouseStorageNumber = list[rIndex].warehouseStorageNumber
            list[rIndex].storageEdit = true
        }
        this.upd(list)
    }

    // 打印标签
    printTag = () => {
        let list = this.gd()
        let { selectedKeys } = this.state
        let targetList = list.filter(item => selectedKeys.some(i => i.id === item.id))
        if (!targetList || targetList.length < 1) {
            message.warning('未选择项')
            return false
        }
        this.printView.print(targetList)
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

    render() {
        const { curRow, doreceiptLoading, completeReceipt } = this.props
        const { modes, modeReady, columns, selectedKeys, tostorageLoading, exportLoading } = this.state
        let list = this.gd()

        return (
            <div className={this.props.className}>
                <PdfView
                    parent={this}
                    getThis={v => this.pdfView = v}
                    curRow={curRow}
                />
                <PrintView
                    parent={this}
                    getThis={v => this.printView = v}
                    curRow={curRow}
                />
                <div className='head-bar'>
                    <div>
                        <span style={{marginRight: 20}}>收货模式</span>
                        {
                            modes && modes.length > 0 ? this.renderModes(modes) : null
                        }
                        {/* {
                            modeReady && <span className='action-button' style={{ marginLeft: 30 }} onClick={e => this.setMode('change')}>更改</span>
                        } */}
                    </div>
                    {
                        !modeReady &&
                        <Button type='primary' onClick={e => this.setMode('confirm')}>确定</Button>
                    }
                    <div>
                        <Button
                            // disabled={curRow.receiptManageStatus !== 3}
                            onClick={this.exportPdf}
                            style={{ marginRight: 10, verticalAlign: 'middle' }}
                            icon="export"
                            loading={exportLoading}
                        >
                            导出
                        </Button>
                        <Button
                            onClick={this.printTag}
                            style={{ marginRight: 10, verticalAlign: 'middle' }}
                            icon="printer"
                        >
                            打印标签
                        </Button>
                        <Button
                            disabled={curRow.receiptManageStatus !== 2 || list.some(item => item.isEdit)}
                            onClick={e => this.editStorage('batch', -1)}
                            style={{ marginRight: 10, verticalAlign: 'middle' }}
                            icon="plus"
                        >
                            启动入储
                        </Button>
                        <Button
                            disabled={curRow.receiptManageStatus !== 2}
                            onClick={e => this.toStorage('batch', null, null)}
                            style={{ marginRight: 10, verticalAlign: 'middle' }}
                            icon="edit"
                            loading={tostorageLoading}
                        >
                            保存储位
                        </Button>
                        <Popconfirm
                            title='确定完成入储？'
                            onConfirm={this.toStorageComplete}
                        >
                            <Button
                                type='primary'
                                loading={doreceiptLoading}
                                disabled={curRow.receiptManageStatus !== 2}
                            >入储完成</Button>
                        </Popconfirm>
                    </div>
                </div>
                {
                    modeReady && <Table
                        parent={this}
                        title={null}
                        isHideHeaderButton
                        isNonePagination
                        actionWidth={120}
                        actionView={this.actionView}
                        isNoneAction={curRow.receiptManageStatus === 3}
                        parent={this}
                        getData={this.getData}
                        columns={columns}
                        tableWidth={140}
                        tableHeight={500}
                        TableHeaderTitle={this.TableHeaderTitle()}
                        TableHeaderChildren={this.TableHeaderChildren(list)}
                        selectedPropsRowKeys={selectedKeys}
                        onChangeSelect={this.changeSelect}
                    />
                }
            </div>
        )
    }
}

export default Form.create()(Details)