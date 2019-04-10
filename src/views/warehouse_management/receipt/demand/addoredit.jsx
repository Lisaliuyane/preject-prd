import React, { Component } from 'react'
import { inject, observer } from "mobx-react"
import { Button, Form, Input, message, DatePicker, Popconfirm, InputNumber, Spin } from 'antd'
import Modal from '@src/components/modular_window'
import { Row, Col } from '@src/components/grid'
import FormItem from '@src/components/FormItem'
import TextAreaBox from '@src/components/textarea'
import FilterSelect from '@src/components/select_filter'
import RemoteSelect from '@src/components/select_databook'
import moment from 'moment'
import Details from './details.jsx'
import {isEmptyString} from '@src/utils'
import { ruleCalculate } from '@src/utils/logic'
import JsExportExcel from 'js-export-excel'
import FunctionPower from '@src/views/layout/power_view/function.jsx'

const EditableCell = ({ editable, value, vlaueKey, getFieldDecorator, rowData, rowIndex, changeCellData, clientId, _ }) => {
    let minWidthValue = 80
    let bindText = vlaueKey + rowIndex

    switch (vlaueKey) {
        case 'materialNumber':
            minWidthValue = 120
            if (editable) {
                return (
                    <FormItem className='text-overflow-ellipsis' style={{ minWidth: minWidthValue }}>
                        {
                            getFieldDecorator(bindText, {
                                initialValue: value,
                                rules: [
                                    {
                                        required: false,
                                        message: '请选择物料'
                                    }
                                ]
                            })(
                                <FilterSelect
                                    filterDataOne={{ placeholder: '代码', getDataMethod: 'getMaterials', params: { limit: 99999, offset: 0, clientId: clientId }, labelField: 'materialItemNumber' }}
                                    filterDataTwo={{ placeholder: '货物名称', getDataMethod: 'getMaterials', params: { limit: 99999, offset: 0, clientId: clientId }, labelField: 'itemName' }}
                                    getDataMethod="getMaterials"
                                    params={{ limit: 99999, offset: 0, clientId: clientId }}
                                    labelFieldCode='materialItemNumber'
                                    labelFieldName='itemName'
                                    titleName=''
                                    selectValue={rowData[vlaueKey] + `${rowData['materialName'] ? ('-' + rowData['materialName']) : ''}`}
                                    getLabelVul={val => {
                                        if (val) {
                                            changeCellData(`${val.materialItemNumber}`, vlaueKey, rowIndex)
                                            changeCellData(`${val.itemName}`, 'materialName', rowIndex)
                                            changeCellData(`${val.itemSpecifications ? val.itemSpecifications : ''}`, 'materialSpecifications', rowIndex)
                                            changeCellData(val, 'materiaInfo', rowIndex)
                                            changeCellData(val.unitId, 'unitId', rowIndex)
                                            changeCellData(val.unitName, 'unit', rowIndex)
                                            changeCellData(val.quantity, 'quantityScale', rowIndex)
                                            changeCellData(val.boxCount, 'boxScale', rowIndex)
                                            changeCellData(val.grossWeight, 'weightScale', rowIndex)
                                            changeCellData(val.singleVolume, 'volumeScale', rowIndex)
                                            changeCellData(val.perUnitWeightId, 'perUnitWeight', rowIndex)
                                            changeCellData(val.perUnitVolumeId, 'perUnitVolume', rowIndex)
                                            changeCellData(val.isScanningSerialNumber === 1 ? 1 : 0, 'isReceiptScan', rowIndex)
                                            changeCellData(val.shipmentIsScanningSerialNumber === 1 ? 1 : 0, 'isShipmentScan', rowIndex)
                                        }
                                    }}
                                    dealData={arr => {
                                        let { receiptCargoDetailsList } = _.state
                                        return arr.filter(item => (!receiptCargoDetailsList.some(m => (m.materialName === item.itemName && m.materialNumber === item.code))))
                                    }}
                                />
                            )
                        }
                    </FormItem>
                )
            } else {
                return <span title={value} className='text-overflow-ellipsis'>{`${value}-${rowData.materialName}`}</span>
            }

        case 'materialSpecifications':
            minWidthValue = 100
            if (editable) {
                return (
                    <FormItem style={{ minWidth: minWidthValue }}>
                        <Input
                            placeholder=""
                            onChange={e => changeCellData(e.target.value ? e.target.value : '', vlaueKey, rowIndex)}
                            title={value}
                            value={value}
                        />
                    </FormItem>
                )
            } else {
                return <span title={value} className='text-overflow-ellipsis'>{value}</span>
            }

        case 'batchNumber':
            minWidthValue = 100
            if (editable) {
                return (
                    <FormItem style={{ minWidth: minWidthValue }}>
                        {
                            getFieldDecorator(bindText, {
                                initialValue: value,
                                rules: [
                                    {
                                        required: false,
                                        message: '请填写批次号'
                                    }
                                ]
                            })(
                                <Input
                                    placeholder=""
                                    onChange={e => {
                                        changeCellData(e.target.value ? e.target.value : '', vlaueKey, rowIndex)
                                    }}
                                    title={value}
                                    value={value}
                                />
                            )
                        }
                    </FormItem>
                )
            } else {
                return <span title={value} className='text-overflow-ellipsis'>{value}</span>
            }

        case 'unit':
            minWidthValue = 90
            if (editable) {
                return (
                    <FormItem style={{ minWidth: minWidthValue }}>
                        {
                            getFieldDecorator(bindText, {
                                initialValue: value ? {
                                    title: value,
                                    id: rowData.unitId
                                } : null,
                                rules: [
                                    {
                                        required: false,
                                        message: '请选择单位'
                                    }
                                ]
                            })(
                                <RemoteSelect
                                    defaultValue={value ? {
                                        title: value,
                                        id: rowData.unitId
                                    } : null}
                                    onChangeValue={(val = {}) => {
                                        changeCellData(val.title ? val.title : null, vlaueKey, rowIndex)
                                        changeCellData(val.id ? val.id : null, `unitId`, rowIndex)
                                    }}
                                    placeholder=''
                                    text='物料单位'
                                    labelField='title'
                                    forceRender={rowData.forceRender}
                                />
                            )
                        }
                    </FormItem>
                )
            } else {
                return <span title={value} className='text-overflow-ellipsis'>{value}</span>
            }

        // case 'boardCount':
        // case 'boxCount':
        case 'quantityCount':
        case 'grossWeight':
        case 'volume':
            if (editable) {
                return (
                    <FormItem>
                        {
                            getFieldDecorator(bindText, {
                                initialValue: value,
                                rules: [
                                    {
                                        required: false,
                                        message: '请输入数量'
                                    }
                                ]
                            })(
                                <InputNumber
                                    min={0}
                                    style={{ width: 80 }}
                                    placeholder=""
                                    onChange={val => {
                                        changeCellData(val && val > 0 && !isNaN(val) ? val : 0, vlaueKey, rowIndex)
                                    }}
                                    value={rowData.forceRender ? null : value}
                                />
                            )
                        }
                    </FormItem>
                )
            } else {
                return <span title={value} className='text-overflow-ellipsis'>{value}</span>
            }

        default:
            break;
    }
}

const colFun = (props = {}) => {
    let cols = [
        {
            className: 'text-overflow-ellipsis',
            title: '物料名称(代码)',
            dataIndex: 'materialNumber',
            key: 'materialNumber',
            width: 150,
            render: (text, row, index) => props.renderColumns(text, 'materialNumber', row, index)
        },
        {
            className: 'text-overflow-ellipsis',
            title: '规格/品级',
            dataIndex: 'materialSpecifications',
            key: 'materialSpecifications',
            width: 100,
            render: (text, row, index) => props.renderColumns(text, 'materialSpecifications', row, index)
        },
        {
            className: 'text-overflow-ellipsis',
            title: '批次号',
            dataIndex: 'batchNumber',
            key: 'batchNumber',
            width: 120,
            render: (text, row, index) => props.renderColumns(text, 'batchNumber', row, index)
        },
        {
            className: 'text-overflow-ellipsis',
            title: '单位',
            dataIndex: 'unit',
            key: 'unit',
            width: 90,
            render: (text, row, index) => props.renderColumns(text, 'unit', row, index)
        },
        {
            className: 'text-overflow-ellipsis',
            title: '数量',
            dataIndex: 'quantityCount',
            key: 'quantityCount',
            width: 90,
            render: (text, row, index) => props.renderColumns(text, 'quantityCount', row, index)
        },
        // {
        //     className: 'text-overflow-ellipsis',
        //     title: '箱数',
        //     dataIndex: 'boxCount',
        //     key: 'boxCount',
        //     width: 90,
        //     render: (text, row, index) => props.renderColumns(text, 'boxCount', row, index)
        // },
        // {
        //     className: 'text-overflow-ellipsis',
        //     title: '板数',
        //     dataIndex: 'boardCount',
        //     key: 'boardCount',
        //     width: 90,
        //     render: (text, row, index) => props.renderColumns(text, 'boardCount', row, index)
        // },
        {
            className: 'text-overflow-ellipsis',
            title: `重量(${props.unitWeight})`,
            dataIndex: 'grossWeight',
            key: 'grossWeight',
            width: 120,
            render: (text, row, index) => props.renderColumns(text, 'grossWeight', row, index)
        },
        {
            className: 'text-overflow-ellipsis',
            title: '体积(m³)',
            dataIndex: 'volume',
            key: 'volume',
            width: 150,
            render: (text, row, index) => props.renderColumns(text, 'volume', row, index)
        }
    ]
    if (props.status === 2) {
        cols = cols
    } else {
        cols = [
            ...cols,
            {
                className: 'table-action table-action-action',
                title: '操作',
                dataIndex: 'action',
                width: 140,
                key: 'action',
                fixed: 'right',
                render: (text, row, index) => {
                    return (
                        <div style={{ width: 140 }}>
                            {
                                row.isEdit ?
                                    <span
                                        onClick={() => props.saveMateriaRow(row, index)}
                                        className={`action-button`}
                                    >
                                        保存
                                    </span>
                                    :
                                    <span
                                        onClick={() => props.editMateriaRow(row, index)}
                                        className={`action-button`}
                                    >
                                        编辑
                                    </span>
                            }
                            <Popconfirm
                                title="确定要删除此项?"
                                onConfirm={() => props.deleteMateriaRow(row, index)}
                                okText="确定"
                                cancelText="取消">
                                <span
                                    className={`action-button`}
                                >
                                    删除
                                </span>
                            </Popconfirm>
                        </div>
                    )
                }
            }
        ]
    }
    return cols
}

const ImportTableHeaderToKey = (title) => {
    switch (title) {
        case '物料代码':
            return 'materialNumber'
        case '物料品名':
            return 'materialName'
        case '物料规格':
            return 'materialSpecifications'
        case '批次号':
            return 'batchNumber'
        case '单位':
            return 'unit'
        case '个数':
            return 'quantityCount'
        // case '箱数':
        //     return 'boxCount'
        // case '板数':
        //     return 'boardCount'
        case '重量':
            return 'grossWeight'
        case '体积':
            return 'volume'

    }
}

@inject('rApi', 'mobxDataBook')
@observer
class AddOrEdit extends Component {
    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        this.state = {
            loading: false,
            confirmLoading: false,
            colLoading: false,
            importLoading: false,
            open: false,
            title: '', //弹框标题
            modalType: -1, //弹框弹出类型  1.编辑 2.查看 3.新建
            status: null, //收货需求状态-----------------------------------
            singleNumber: null, //收货单号
            id: null, //收货需求ID
            clientId: null, //客户ID
            clientName: '', //客户简称（显示简称）
            typeId: null, //收货类型ID
            typeName: '', //收货类型名称
            warehouseId: null, //收货仓库ID
            warehouseName: '', //收货仓库名
            expectedTime: '', //预计到仓时间
            operatingModeId: null, //操作模式ID
            operatingModeName: '', //操作模式
            modeId: null, //收货方式ID
            modeName: '', //收货方式名称
            orderNumber: '', //订单号
            waybillNumber: '', //来源单号
            projectId: null, //关联项目ID
            projectName: '', //关联项目名称
            remark: '', //备注
            receiptCargoDetailsList: [], //收货需求明细
            receiptCargoDetailsdelIdList: [], //删除收货需求明细ID数组
            reloadInit: false,
            materialColumns: []
        }
    }

    // 弹窗出现
    async show (d) {
        if (d.edit) {
            d.data = Object.assign({}, d.data, {
                modalType: 1,
                title: '编辑收货需求'
            })
        } else if (d.data) {
            d.data = Object.assign({}, d.data, {
                modalType: 2,
                title: '查看收货需求'
            })
        } else {
            d.data = Object.assign({}, d.data, {
                modalType: 3,
                title: '新建收货需求'
            })
            this.initSelect()
        }
        this.setWeightUnit(d.data.status)
        this.getStoreUnit()
        await this.setState({
            ...d.data,
            open: true,
            edit: d.edit
        })
    }

    getStoreUnit = () => {
        const { rApi } = this.props
        const req = rApi.getUnitConfig({
            unitClassification: 2
        })
        return req
    }

    // 清空数据
    clearValue() {
        this.setState({
            status: null, //收货需求状态
            singleNumber: null, //收货单号
            id: null, //收货需求ID
            clientId: null, //客户ID
            clientName: '', //客户简称（显示简称）
            typeId: null, //收货类型ID
            typeName: '', //收货类型名称
            warehouseId: null, //收货仓库ID
            warehouseName: '', //收货仓库名
            expectedTime: '', //预计到仓时间
            operatingModeId: null, //操作模式ID
            operatingModeName: '', //操作模式
            modeId: null, //收货方式ID
            modeName: '', //收货方式名称
            orderNumber: '', //订单号
            waybillNumber: '', //来源单号
            projectId: null, //关联项目ID
            projectName: '', //关联项目名称
            remark: '', //备注
            receiptCargoDetailsList: [], //收货需求明细
            receiptCargoDetailsdelIdList: [], //删除收货需求明细ID数组
            materialColumns: []
        })
    }

    // 关闭弹窗
    actionDone = () => {
        this.changeOpen(false)
        message.success('操作成功！')
    }

    // 打开/关闭弹窗
    changeOpen = (state) => {
        this.setState({
            open: state
        })
        if (!state) {
            this.clearValue()
        }
    }

    // 初始化选中
    initSelect () {
        this.setMethods()
        this.setWarehouse()
        this.setReceiptType()
        this.setOperation()
    }
    // 设置默认收货方式
    setMethods = async () => {
        let res = null
        try {
            res = await this.props.mobxDataBook.initData('收货方式')
            let target = res.find(item => item.title === '仓库下单')
            let modeId = target ? target.id : null
            this.setState({
                modeId,
                modeName: '仓库下单'
            })
        } catch (error) {
            this.setState({
                modeId: null,
                modeName: '仓库下单'
            })
            console.log('获取收货方式失败', error)
            return
        }
    }
    // 默认收货仓库
    setWarehouse = async () => {
        try {
            let res = await this.props.rApi.getWarehouseList({pageNo: 1, pageSize: 99999})
            if (res && res.records && res.records.length) {
                let target = res.records[0]
                await this.setState({
                    warehouseId: target.id,
                    warehouseName: target.name,
                    reloadInit: true
                })
                this.setState({ reloadInit: false })
            }
        } catch (error) {
            console.log('获取仓库列表失败', error)
            return
        }
    }
    // 默认收货类型
    setReceiptType = async () => {
        try {
            let res = await this.props.mobxDataBook.initData('收货类型')
            let target = res.find(item => item.title === '正常收货')
            let typeId = target ? target.id : null
            await this.setState({
                typeId,
                typeName: '正常收货',
                reloadInit: true
            })
            this.setState({ reloadInit: false })
        } catch (error) {
            console.log('获取收货类型失败', error)
            return
        }
    }
    // 默认操作模式
    setOperation = async () => {
        try {
            let res = await this.props.mobxDataBook.initData('操作模式')
            let target = res.find(item => item.title === '入仓入储')
            let operatingModeId = target ? target.id : null
            await this.setState({
                operatingModeId,
                operatingModeName: '入仓入储',
                reloadInit: true
            })
            this.setState({ reloadInit: false })
        } catch (error) {
            console.log('获取操作模式失败', error)
            return
        }
    }

    // 设置重量单位
    setWeightUnit = async (status) => {
        this.setState({ colLoading: true })
        try {
            let materialColumns, unitWeight = 'kg'
            let res = await this.props.rApi.getUnitConfig({unitClassification: 2})
            if (res && res.grossWeight && res.grossWeight.materialUnitList && res.grossWeight.materialUnitList.length) {
                unitWeight = res.grossWeight.materialUnitList[0].billingUnitName
            } else {
                console.log('获取重量单位失败')
            }
            materialColumns = this.setMaterialCol(status, unitWeight)
            this.setState({ materialColumns, colLoading: false })
        } catch (error) {
            console.log('获取重量单位失败')
            let materialColumns = this.setMaterialCol(status, 'kg')
            this.setState({ materialColumns, colLoading: false })
            return false
        }
    }

    // 设置物料表头
    setMaterialCol = (status = this.state.status, unitWeight = 'kg') => colFun({
        status,
        renderColumns: this.renderColumns,
        saveMateriaRow: this.saveMateriaRow,
        editMateriaRow: this.editMateriaRow,
        deleteMateriaRow: this.deleteMateriaRow,
        unitWeight
    })

    renderColumns = (text, key, row, rowIndex) => {
        const { clientId } = this.state
        const { getFieldDecorator } = this.props.form
        return (
            <EditableCell
                editable={row.isEdit}
                getFieldDecorator={getFieldDecorator}
                key={key}
                vlaueKey={key}
                value={text}
                rowData={row}
                rowIndex={rowIndex}
                changeCellData={this.changeMateriaCell}
                clientId={clientId}
                _={this}
            />
        )
    }

    // 过滤关联项目
    fieldProject = (res) => {
        if (this.state.clientId === null) {
            return []
        } else {
            return res || []
        }
    }

    // 预计到仓时间不可选区间
    disabledDate = (current) => {
        // console.log(moment(new Date().now).format('YYYY-MM-DD HH:mm'))
        return current < moment().startOf('day')
    }

    // 货物明细新增行
    addNewRow = () => {
        const { id, receiptCargoDetailsList } = this.state
        let newList = [...receiptCargoDetailsList],
            batchNumber
        if (newList.length > 0 && newList[0].batchNumber) {
            batchNumber = newList[0].batchNumber
        } else {
            batchNumber = ''
        }
        newList.push({
            materialNumber: '',
            materialName: '',
            materialSpecifications: '',
            batchNumber,
            unitId: null,
            unit: '',
            boardCount: null,
            boxCount: null,
            quantityCount: null,
            grossWeight: null,
            volume: null,
            receiptDemandId: id,
            id: null,
            materiaInfo: null,
            isEdit: true,
            forceRender: false,
            quantityScale: 0,
            boxScale: 0,
            weightScale: 0,
            volumeScale: 0,
            perUnitWeight: '',
            perUnitVolume: '',
            isReceiptScan: 0,
            isShipmentScan: 0
        })
        this.setState({ receiptCargoDetailsList: newList })
    }

    // 货物明细行修改
    changeMateriaCell = async (value, key, rowIndex) => {
        let newList = [...this.state.receiptCargoDetailsList]
        // console.log('row', newList[rowIndex], value)
        newList[rowIndex][key] = value
        if (key === 'boardCount' || key === 'boxCount' || key === 'quantityCount' || key === 'grossWeight' || key === 'volume') {
            this.props.form.resetFields([`boardCount${rowIndex}`, `boxCount${rowIndex}`, `quantityCount${rowIndex}`, `grossWeight${rowIndex}`, `volume${rowIndex}`])
            if (key !== 'grossWeight' && key !== 'volume') {
                let ruleObj = {
                    quantityScale: newList[rowIndex].quantityScale,
                    boxScale: newList[rowIndex].boxScale,
                    weightScale: newList[rowIndex].weightScale,
                    volumeScale: newList[rowIndex].volumeScale,
                    perUnitWeight: newList[rowIndex].perUnitWeight,
                    perUnitVolume: newList[rowIndex].perUnitVolume
                }
                let rt = ruleCalculate(key, value, ruleObj)
                for (let rKey in rt) {
                    if (rt.hasOwnProperty(rKey)) {
                        newList[rowIndex][rKey] = rt[rKey]
                    }
                }
            }
        }
        if (key === 'unit') {
            newList[rowIndex]['forceRender'] = true
            await this.setState({ receiptCargoDetailsList: newList })
            newList[rowIndex]['forceRender'] = false
        }
        this.setState({ receiptCargoDetailsList: newList })
    }

    // 货物明细行编辑状态
    editMateriaRow = (rowData, rowIndex) => {
        let newList = [...this.state.receiptCargoDetailsList]
        newList[rowIndex].isEdit = true
        this.setState({ receiptCargoDetailsList: newList })
    }

    // 货物明细行保存
    saveMateriaRow = (rowData, rowIndex) => {
        const {form} = this.detailsView.props
        // console.log('r', rowData)
        const { boardCount, boxCount, quantityCount} = rowData
        if (boardCount > boxCount || boardCount > quantityCount || boxCount > quantityCount) { //板数<=箱数<=数量验证
            message.warning('请检查板数箱数数量关系：板数≤箱数≤数量')
            return false
        }
        if (!rowData.materialName) {
            message.warning('请选择物料')
            return false
        }
        form.validateFields([`batchNumber${rowIndex}`], (err, values) => {
            if (!err) {
                // 验证单位
                const validataUnit = form.getFieldsValue([`unit${rowIndex}`])
                if (isEmptyString(validataUnit[`unit${rowIndex}`])) {
                    form.setFields({
                        [`unit${rowIndex}`]: {
                            value: '',
                            errors: [new Error('请选择单位')]
                        }
                    })
                    return false
                }
                const validateArr = [`quantityCount${rowIndex}`]
                const rtJson = form.getFieldsValue(validateArr)
                for (let key in rtJson) {
                   if (isEmptyString(rtJson[key]) || rtJson[key] === null) {
                        form.setFields({
                            [validateArr[0]]: {
                                value: '',
                                errors: [new Error('请输入数量')]
                            }
                        })
                        return
                   }
                }
                let newList = [...this.state.receiptCargoDetailsList]
                newList[rowIndex].isEdit = false
                console.log('newList', newList)
                this.setState({ receiptCargoDetailsList: newList })
            }
        })
    }

    // 删除货物明细行
    deleteMateriaRow = (rowData, rowIndex) => {
        // console.log('delete', rowData)
        let newList = [...this.state.receiptCargoDetailsList]
        let delList = [...this.state.receiptCargoDetailsdelIdList]
        if (rowData.id !== null) {
            delList.push(rowData.id)
        }
        newList.splice(rowIndex, 1)
        this.setState({
            receiptCargoDetailsList: newList,
            receiptCargoDetailsdelIdList: delList
        })
    }

    // 自定义modal标题显示
    customModalTitle = (status) => {
        const { singleNumber } = this.state
        let statusText = status === 1 ? '未确认' : status === 2 ? '已确认' : ''
        const color = status === 1 ? '#F5222D' : status === 2 ? '#1DA57A' : '#888'
        return (
            <div>{singleNumber}
                <span style={{ marginLeft: '16px', color }}>{statusText}</span>
            </div>
        )
    }

    // 新建保存成功改变弹窗状态
    changeStatus = async res => {
        const { singleNumber, id, receiptCargoDetailsList } = res
        await this.setState({
            title: '编辑收货需求',
            modalType: 1,
            id,
            singleNumber,
            status: 1,
            receiptCargoDetailsList
        })
    }

    // submit事件验证
    handleSubmit = (btnType) => {
        const { receiptCargoDetailsList } = this.state
        if (receiptCargoDetailsList.some(item => item.isEdit)) {
            message.warning('请保存货物明细列表')
            return false
        }
        const methodName = btnType === 'save' ? 'saveSubmit' : 'confirmDemand'
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this[methodName]()
            }
        })
    }

    // 新建/保存收货需求
    saveSubmit = async () => {
        const { rApi, parent } = this.props
        let {
            modalType,
            id, //收货需求ID
            clientId, //客户ID
            clientName, //客户简称（显示简称）
            typeId, //收货类型ID
            typeName, //收货类型名称
            warehouseId, //收货仓库ID
            warehouseName, //收货仓库名
            expectedTime, //预计到仓时间
            operatingModeId, //操作模式ID
            operatingModeName, //操作模式
            modeId, //收货方式ID
            modeName, //收货方式名称
            orderNumber, //订单号
            waybillNumber, //来源单号
            projectId, //关联项目ID
            projectName, //关联项目名称
            remark, //备注
            receiptCargoDetailsList, //收货需求明细
            receiptCargoDetailsdelIdList, //收货需求删除明细
        } = this.state
        let reqData = {
            id,
            clientId,
            clientName,
            typeId,
            typeName,
            warehouseId,
            warehouseName,
            expectedTime,
            operatingModeId,
            operatingModeName,
            modeId,
            modeName,
            orderNumber,
            waybillNumber,
            projectId,
            projectName,
            remark,
            receiptCargoDetailsList,
            receiptCargoDetailsdelIdList,
        }
        if (reqData.receiptCargoDetailsList.length) {
            reqData.receiptCargoDetailsList = reqData.receiptCargoDetailsList.map(item => {
                delete item.materiaRule
                return item
            })
        }
        if (modalType === 1) { //如果是编辑
            await this.setState({ loading: true })
            rApi.editReceipt(reqData)
                .then(async res => {
                    const { saveEdit } = this.props
                    await saveEdit(reqData)
                    receiptCargoDetailsList = res.receiptCargoDetailsList
                    await this.setState({ receiptCargoDetailsList })
                    message.success('操作成功')
                    this.setState({ loading: false })
                })
                .catch(e => {
                    message.error(e.msg || '操作失败！')
                    this.setState({ loading: false })
                })
        } else if (modalType === 2) { //如果是查看
            this.changeOpen(false)
        } else if (modalType === 3) { //如果是新建
            await this.setState({ loading: true })
            rApi.addReceipt(reqData)
                .then(async res => {
                    parent.searchCriteria()
                    await this.changeStatus(res)
                    message.success('操作成功')
                    this.setState({ loading: false })
                })
                .catch(e => {
                    message.error(e.msg || '操作失败！')
                    this.setState({ loading: false })
                })
        } else {}
    }

    // 确认收货需求
    confirmDemand = async () => {
        // console.log('props', this.props)
        const { rApi } = this.props
        const { id, receiptCargoDetailsList } = this.state
        if (!receiptCargoDetailsList || receiptCargoDetailsList.length < 1) {
            message.warning('无已保存的货物')
            return
        }
        if (receiptCargoDetailsList.some(item => !item.id)) {
            message.warning('有未提交保存的货物')
            return
        }
        await this.setState({ confirmLoading: true })
        rApi.confirmReceipt({
            id
        })
            .then(res => {
                const { saveEdit } = this.props
                saveEdit({
                    id,
                    status: 2
                })
                this.actionDone()
                this.setState({ confirmLoading: false })
            })
            .catch(err => {
                // console.log(err)
                message.error(err.msg || '操作失败！')
                this.setState({ confirmLoading: false })
            })
    }

    // 收货需求取消确认
    cancelDemand = () => {
        const { rApi } = this.props
        const { id } = this.state
        rApi.cancelReceipt({ id }).then(res => {
            const { saveEdit } = this.props
            saveEdit({
                id,
                status: 1
            })
            this.actionDone()
        }).catch(err => {
            message.error(err.msg || '操作失败！')
        })
    }

    // 导出表头
    exportDetails = async () => {
        this.saveExcel()
    }
    /* 导出数据到EXCEL */
    saveExcel(list = []) {
        const { materialColumns } = this.state
        let fileName = '货物明细',
            sheetHeader = [
                '物料代码', '物料品名', '物料规格', '批次号', '单位', '个数', '重量', '体积'
            ],
            sheetFilter = materialColumns.filter(item => item.title).map(item => {
                return item.dataIndex
            }),
            sheetName = 'sheet1'
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
        const { rApi, curRow, mobxDataBook } = this.props
        const { clientId } = this.state
        const header = d[0]
        let exData = d.slice(1)
        console.log('exData', exData)
        exData = exData.filter(item => item.length > 1)
        this.setState({ importLoading: true })
        // getDataMethod: 'getMaterials', params: { limit: 99999, offset: 0, clientId: clientId }
        rApi['getMaterials']({ limit: 99999, offset: 0, clientId: clientId }).then(materials => {
            console.log('materials', materials)
            exData = exData.map((item) => {
                item = Array.from(item)
                let obj = {}
                item.map((ele, index) => {
                    let key = ImportTableHeaderToKey(header[index])
                    obj[key] = ele
                })
                return obj
            })
            exData.forEach(element => {
                materials.records.map(item => {
                    if (item.itemName === element.materialName && item.materialItemNumber === element.materialNumber) {
                        element.materiaInfo = item
                        element.boxScale = item.boxCount
                        element.quantityScale = item.quantity
                        element.weightScale = item.grossWeight
                        element.volumeScale = item.singleVolume
                        element.perUnitWeight = item.perUnitWeightId
                        element.perUnitVolume = item.perUnitVolumeId
                    }
                })
            })

            for (let element of exData) {
                // console.log('element', element)
                if (!element.materiaInfo) {
                    // 物料不存在
                    message.error(`物料${element.materialName}不存在`)
                    return
                }
            }
            Promise.all([mobxDataBook.initData('计量单位'), mobxDataBook.initData('计重单位'), mobxDataBook.initData('计体单位')]).then(values => {
                // console.log('values', values)
                let units = []
                values.map(item => {
                    units.push(...(item || []))
                })
               
                this.getStoreUnit().then(storeUnits => {
                    exData = exData.map((element, index) => {
                        units.map(item => {
                            if (item.title === element.unit) {
                                // console.log('units', item, element, item.title === element.unit)
                                element.unitId = item.id
                                // console.log('storeUnits', storeUnits)
                                for (let unit in storeUnits) {
                                    let filter = storeUnits[unit].materialUnitList.filter(item => item.billingUnitName === element.unit)
                                    const keys = {
                                        volume: '体积',
                                        grossWeight: '重量',
                                        quantity: '数量'
                                    }
                                    // console.log('filter', filter, unit)
                                    if (filter && filter.length > 0) {
                                        // console.log('filter element', element, unit, element[unit])
                                        if (unit === 'quantity') {
                                            unit = 'quantityCount'
                                        }
                                        if (!element[unit]) {
                                            message.error(`第${index + 1} 条 ${keys[unit]} 不能为空`)
                                            element = {
                                                ...element,
                                                noCalc: true
                                            }
                                            break
                                        } else {
                                            element = {
                                                ...element,
                                                ...ruleCalculate(unit, parseInt(element[unit]), {
                                                    quantityScale: element.quantityScale,
                                                    boxScale: element.boxScale,
                                                    weightScale: element.weightScale,
                                                    volumeScale: element.volumeScale,
                                                    perUnitWeight: element.perUnitWeight,
                                                    perUnitVolume: element.perUnitVolume
                                                })
                                            }
                                        }
                                        break
                                    }
                                }
                            }
                        })
                        return element
                    })
                    for (let element of exData) {
                        if (!element.unitId) {
                            // 单位不存在
                            message.error(`单位${element.unit}不存在`)
                            return
                        }
                        if (element.noCalc) {
                            return
                        }
                    }
                    // console.log('exData', exData)
                    this.setState({
                        receiptCargoDetailsList: exData
                    })
                })
            })
        })
        // reqData = reqData.map(item => ({
        //     shipmentManageId: curRow.shipmentManageId,
        //     boardNumber: item[0],
        //     boxNum: item[1],
        //     boxSerialNum: item[2],
        //     materialNumber: item[3],
        //     remark: item[4]
        // }))
        // try {
        //     await rApi.importShipmentScanning(reqData)
        // } catch (error) {
        //     message.error(error.msg || '操作失败')
        //     this.setState({ importLoading: false })
        //     return
        // }
        // message.success('操作成功')
        // this.searchCriteria()
        this.setState({ importLoading: false })
    }

    render() {
        const { power } = this.props
        const { getFieldDecorator } = this.props.form
        let {
            loading,
            confirmLoading,
            clientId, //客户ID
            clientName, //客户简称（显示简称）
            typeId, //收货类型ID
            typeName, //收货类型名称
            warehouseId, //收货仓库ID
            warehouseName, //收货仓库名
            expectedTime, //预计到仓时间
            operatingModeId, //操作模式ID
            operatingModeName, //操作模式
            modeId, //收货方式ID
            modeName, //收货方式名称
            orderNumber, //订单号
            waybillNumber, //来源单号
            projectId, //关联项目ID
            projectName, //关联项目名称
            remark, //备注
            open,
            title,
            modalType,
            status,
            receiptCargoDetailsList,
            reloadInit,
            materialColumns,
            colLoading,
            importLoading
        } = this.state
        return (
            <Modal
                style={{ width: '95%', maxWidth: 1000, minHeight: 300 }}
                changeOpen={this.changeOpen}
                open={open}
                title={title}
            >
                <div style={{ minHeight: 272 }}>
                    <Form layout='inline'>
                        <Modal.Header title={this.customModalTitle(status)} isHide={modalType === 2 ? true : false}>
                            {
                                status !== 2 &&
                                <FormItem>
                                    <FunctionPower power={power.SAVE_DATA}>
                                        <Button
                                            // icon='save'
                                            onClick={e => this.handleSubmit('save')}
                                            loading={loading}
                                        >
                                            保存
                                        </Button>
                                    </FunctionPower>
                                </FormItem>
                            }
                            {
                                status === 1 ?
                                    <FormItem style={{ marginLeft: 10 }}>
                                        <FunctionPower power={power.CONFIRM_DATA}>
                                            <Popconfirm
                                                title={`是否确认收货需求?`}
                                                onConfirm={e => {this.handleSubmit('confirm')}}
                                                okText="确定"
                                                cancelText="取消"
                                            >
                                                <Button
                                                   // icon='check'
                                                    loading={confirmLoading}
                                                    style={{ color: '#fff', background: '#18B583', border: 0 }}
                                                >
                                                    确认
                                                </Button>
                                            </Popconfirm>
                                        </FunctionPower>
                                    </FormItem> :
                                status === 2 ?
                                    <FormItem>
                                        <FunctionPower power={power.CANCEL_DATA}>
                                            <Popconfirm
                                                title={`确定要取消确认?`}
                                                onConfirm={e => {
                                                    this.cancelDemand()
                                                }}
                                                okText="确定"
                                                cancelText="取消"
                                            >
                                                <Button style={{ color: '#fff', background: '#18B583', border: 0 }} >取消确认</Button>
                                            </Popconfirm>
                                        </FunctionPower>
                                    </FormItem> : null
                            }
                        </Modal.Header>
                        <div style={{ padding: '5px 20px', margin: 'auto' }}>
                            <Row type={modalType}>
                                <Col isRequired label="客户名称&emsp;&emsp;" colon span={7} text={clientName && clientName.title ? clientName.title : '无'}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('clientName', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择客户名称'
                                                    }
                                                ],
                                            })(
                                                <RemoteSelect
                                                    defaultValue={clientName ? {
                                                        shortname: clientName,
                                                        id: clientId
                                                    } : null}
                                                    onChangeValue={(value = {}) => {
                                                        this.setState({ clientId: value.id ? value.id : null, clientName: value.shortname })
                                                        }
                                                    }
                                                    getDataMethod={'getClients'}
                                                    params={{ offset: 0, limit: 99999 }}
                                                    labelField={'shortname'}
                                                    disabled={status && status === 2}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col isRequired label="收货仓库&emsp;&emsp;" colon span={7} text={warehouseName && warehouseName.title ? warehouseName.title : '无'}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('warehouseName', {
                                                initialValue: warehouseId ? {
                                                    id: warehouseId,
                                                    name: warehouseName
                                                } : null,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择收货仓库'
                                                    }
                                                ],
                                            })(
                                                <RemoteSelect
                                                    defaultValue={warehouseName ? {
                                                        name: warehouseName,
                                                        id: warehouseId
                                                    } : null}
                                                    onChangeValue={value => {
                                                        if (value) {
                                                            this.setState({ warehouseId: value.id ? value.id : null, warehouseName: value.name ? value.name : '' })
                                                        }
                                                    }}
                                                    placeholder=''
                                                    getDataMethod={'getWarehouseList'}
                                                    params={{ pageNo: 1, pageSize: 9999 }}
                                                    labelField={'name'}
                                                    disabled={status && status === 2}
                                                    forceRender={reloadInit}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col isRequired label="收货类型&emsp;&emsp;" colon span={7} text={typeName}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('typeName', {
                                                initialValue: typeId ? {
                                                    id: typeId,
                                                    title: typeName
                                                } : null,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择收货类型'
                                                    }
                                                ],
                                            })(
                                                <RemoteSelect
                                                    defaultValue={typeName ? {
                                                        title: typeName,
                                                        id: typeId
                                                    } : null}
                                                    onChangeValue={value => {
                                                        this.setState({ typeId: value.id, typeName: value.title })
                                                    }
                                                    }
                                                    placeholder=''
                                                    text='收货类型'
                                                    disabled={status && status === 2}
                                                    forceRender={reloadInit}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row type={modalType}>
                                <Col isRequired label="预计到仓&emsp;&emsp;" colon span={7} text={expectedTime ? moment(expectedTime).format('YYYY-MM-DD HH:mm') : ''}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('expectedTime', {
                                                initialValue: expectedTime ? moment(expectedTime) : null,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择预计到仓时间'
                                                    }
                                                ]
                                            })(
                                                <DatePicker
                                                    style={{ width: '100%' }}
                                                    format="YYYY-MM-DD HH:mm"
                                                    showTime={{ format: 'HH:mm' }}
                                                    disabledDate={this.disabledDate}
                                                    disabled={status && status === 2}
                                                    placeholder=''
                                                    //value={expectedTime}
                                                    onChange={
                                                        date => {
                                                            this.setState({ expectedTime: date})
                                                        }
                                                    }
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col isRequired label="收货方式&emsp;&emsp;" colon span={7} text={modeName}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('modeName', {
                                                initialValue: modeId ? {
                                                    id: modeId,
                                                    title: modeName
                                                } : null,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择收货方式'
                                                    }
                                                ],
                                            })(
                                                <RemoteSelect
                                                    defaultValue={modeName ? {
                                                        title: modeName,
                                                        id: modeId
                                                    } : null}
                                                    onChangeValue={(value = {}) => {
                                                        this.setState({ modeId: value.id, modeName: value.title })
                                                    }}
                                                    placeholder=''
                                                    text='收货方式'
                                                    disabled={(status && status === 2) || modalType === 3}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col label="订单编号&emsp;&emsp;" colon span={7} text={orderNumber}>
                                    <Input
                                        onChange={e => {
                                            this.setState({ orderNumber: e.target.value })
                                        }}
                                        placeholder=""
                                        value={orderNumber}
                                        disabled={status && status === 2}
                                    />
                                </Col>
                            </Row>
                            <Row type={modalType}>
                                <Col isRequired label="操作模式&emsp;&emsp;" colon span={7} text={operatingModeName}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('operatingModeName', {
                                                initialValue: operatingModeId ? {
                                                    id: operatingModeId,
                                                    title: operatingModeName
                                                } : null,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择操作模式'
                                                    }
                                                ],
                                            })(
                                                <RemoteSelect
                                                    defaultValue={operatingModeName ? {
                                                        title: operatingModeName,
                                                        id: operatingModeId
                                                    } : null}
                                                    onChangeValue={value => {
                                                        if (value) {
                                                            this.setState({ operatingModeId: value.id ? value.id : null, operatingModeName: value.title ? value.title : '' })
                                                        }
                                                    }}
                                                    placeholder=''
                                                    text='操作模式'
                                                    disabled={status && status === 2}
                                                    forceRender={reloadInit}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <TextAreaBox
                                labelText="备注&emsp;&emsp;&emsp;&emsp;"
                                colon
                                span={15}
                                type={modalType}
                                defaultValue={remark}
                                disabled={status && status === 2}
                                placeholderText=""
                                onChange={value => { this.setState({ remark: value }) }}
                            />
                        </div>
                        <div style={{ display: 'flex', padding: '0 20px 10px', borderTop: '2px solid #c9c9c9', justifyContent: "center" }}>
                            {
                                colLoading ? <Spin style={{marginTop: 20}} /> : <Details
                                    getThis={view => this.detailsView = view}
                                    status={status}
                                    materiaList={receiptCargoDetailsList}
                                    addNewRow={this.addNewRow}
                                    changeMateriaCell={this.changeMateriaCell}
                                    saveMateriaRow={this.saveMateriaRow}
                                    editMateriaRow={this.editMateriaRow}
                                    deleteMateriaRow={this.deleteMateriaRow}
                                    clientId={clientId}
                                    columns={materialColumns}
                                    importLoading={importLoading}
                                    getExcelData={this.getExcelData}
                                    exportDetails={this.exportDetails}
                                />
                            }
                        </div>
                    </Form>
                </div>
            </Modal>
        )
    }
}
 
export default Form.create()(AddOrEdit)