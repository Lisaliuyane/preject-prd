import React from 'react'
import Modal from '@src/components/modular_window'
import { Button, Form, Input, message, DatePicker, Table, InputNumber, Select, Popconfirm } from 'antd'
import { ColumnItemBox } from '@src/components/table_template'
import FormItem from '@src/components/FormItem'
import { Row, Col } from '@src/components/grid'
import { inject, observer } from "mobx-react"
import { addressFormat } from '@src/utils'
import TextAreaBox from '@src/components/textarea'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import RemoteSelect from '@src/components/select_databook'
import SendReceiveModal from '@src/views/client/consignee_consigner/addoredit'
import moment from 'moment'
import UploadExcel from '@src/components/upload_excel'
import JsExportExcel from 'js-export-excel'
import { materialKeys } from '@src/utils/logic'

const Option = Select.Option

const ImportTableHeaderToKey = (title) => {
    switch (title) {
        case '物料名称':
            return 'materialName'
        case '料号':
            return 'materialNumber'
        case '拣货数量':
            return 'pickCount'
        case '备注':
            return 'remark'
    }
    return null
}

// 货物明细表格列
const colFun = (renderColumn, editRow, saveRow, deleteRow, status) => {
    let rtArr = [
        {
            className: 'text-overflow-ellipsis',
            title: '料号',
            dataIndex: 'materialNumber',
            key: 'materialNumber',
            width: 160,
            render: (val, r, rIndex) => renderColumn(val, r, rIndex, 'materialNumber')
        },
        {
            className: 'text-overflow-ellipsis',
            title: '物料名称',
            dataIndex: 'materialName',
            key: 'materialName',
            width: 100,
            render: (val, r, rIndex) => renderColumn(val, r, rIndex, 'materialName')
        },
        {
            className: 'text-overflow-ellipsis',
            title: '规格/品级',
            dataIndex: 'materialSpecifications',
            key: 'materialSpecifications',
            width: 100,
            render: (val, r, rIndex) => renderColumn(val, r, rIndex, 'materialSpecifications')
        },
        {
            className: 'text-overflow-ellipsis',
            title: '批次号',
            dataIndex: 'batchNumber',
            key: 'batchNumber',
            width: 100,
            render: (val, r, rIndex) => renderColumn(val, r, rIndex, 'batchNumber')
        },
        {
            className: 'text-overflow-ellipsis',
            title: '拣货数量',
            dataIndex: 'pickCount',
            key: 'pickCount',
            width: 100,
            render: (val, r, rIndex) => renderColumn(val, r, rIndex, 'pickCount')
        },
        {
            className: 'text-overflow-ellipsis',
            title: '仓库总量',
            dataIndex: 'shouldPickCount',
            key: 'shouldPickCount',
            width: 100,
            render: (val, r, rIndex) => renderColumn(val, r, rIndex, 'shouldPickCount')
        },
        {
            className: 'text-overflow-ellipsis',
            title: '单位',
            dataIndex: 'unit',
            key: 'unit',
            width: 80,
            render: (val, r, rIndex) => renderColumn(val, r, rIndex, 'unit')
        },
        {
            className: 'text-overflow-ellipsis',
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            width: 150,
            render: (val, r, rIndex) => renderColumn(val, r, rIndex, 'remark')
        }
    ]
    if (status !== 2) {
        rtArr = [
            ...rtArr,
            {
                className: 'text-overflow-ellipsis',
                fixed: 'right',
                title: '操作',
                dataIndex: 'action',
                width: 90,
                key: 'action',
                render: (val, r, rIndex) => {
                    return (
                        <div style={{ width: 90 }}>
                            {
                                r.isEdit ?
                                    <span
                                        onClick={() => saveRow(r, rIndex)}
                                        className={`action-button`}
                                    >
                                        保存
                                    </span>
                                    :
                                    <span
                                        onClick={() => editRow(r, rIndex)}
                                        className={`action-button`}
                                    >
                                        编辑
                                    </span>
                            }

                            <Popconfirm
                                title="确定要删除此项?"
                                onConfirm={() => deleteRow(r, rIndex)}
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
    return rtArr
}

@inject('rApi', 'mobxWordBook', 'mobxDataBook')
@observer
class AddOrEdit extends React.Component {
    state = {
        open: false,
        title: '新建出货需求', //弹框标题
        modalType: -1, //弹框弹出类型  1.编辑 2.查看 3.新建
        status: null, //出货需求状态
        saveLoading: false, //loading
        importLoading: false,
        pickList: [], //拣货要求列表
        clientId: null, //客户id
        clientName: '', //客户简称
        warehouseId: null, //出货仓库id
        warehouseName: '', //出货仓库名称
        shipmentCargoDetailsList: [], //出货明细列表
        shipmentDemandIdDeleteList: [], //要删除的出货明细id
        typeId: null, //出货类型id
        typeName: null, //出货类型名称
        sourceId: null, //需求来源id
        sourceName: null, //需求来源名
        sourceNumber: null, //来源单号
        deliveryTime: null, //交货日期
        pickTypeId: null, //拣货要求id
        pickTypeName: null, //拣货要求名称
        pickRender: false,
        batchNumber: null, //批次号
        shipmentMethodId: null, //出货方式id
        shipmentMethodName: null, //出货方式名称
        carId: 0, //车牌id
        carName: null, //车牌名字
        driverId: null, //司机id
        driverName: '', //司机姓名
        phone: null, //联系方式
        consigneeId: null, //收货人id
        consigneeName: null, //收货人名称
        receiptAddress: null, //收货地址
        remark: null, //备注
        id: null, //出货需求ID
        singleNumber: null, //出货单号
        reloadPhoneAndAddress: false,
        curCargoDetailsList: [], //当前条件下货物明细数据
        projectName: null, //项目名称
        projectId: null,
        cargoPartyName : null, //收货方(代码)
        contacts : null, //联系人
        phone : null, //联系方式
        receiptAddress : null, //地址
        areaName : null, //片区
        reloadConsignee: false
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
    }

    // 弹窗显示
    show(d) {
        if (d.edit) {
            let shipmentCargoDetailsList = [...d.data.shipmentCargoDetailsList].map(item => {
                let sumKey = item.unitType ? materialKeys[item.unitType - 1] : materialKeys[0]
                return {
                    ...item,
                    sumKey,
                    pickCount: item[sumKey]
                }
            })
            d.data = Object.assign({}, d.data, {
                modalType: 1,
                title: '编辑出货需求',
                shipmentCargoDetailsList
            })
            // 获取当前条件下有的物料
            this.props.rApi.getMaterialList({
                clientId: d.data.clientId,
                warehouseId: d.data.warehouseId,
                batchNumber: d.data.batchNumber
            })
                .then(res => {
                    let curCargoDetailsList = [...res]
                    curCargoDetailsList = curCargoDetailsList.map((item, index) => {
                        let sumKey = item.unitType ? materialKeys[item.unitType - 1] : materialKeys[0]
                        item.quantityCount = item.quantityCountSum
                        item.boxCount = item.boxCountSum
                        item.boardCount = item.boardCountSum
                        item.grossWeight = item.grossWeightSum
                        item.volume = item.volumeSum
                        item.sumKey = sumKey
                        item.pickCount = item[sumKey]
                        item.shouldPickCount = item[sumKey]
                        item.valStr = `${item.materialNumber}|${index}`
                        return item
                    })
                    this.setState({curCargoDetailsList})
                })
                .catch(err => {
                    console.log(err)
                })
        } else if (d.data) {
            console.log('查看')
        } else {
            this.getPickList()
            d.data = {
                modalType: 3,
                title: '新建出货需求'
            }
        }
        this.setState({
            ...d.data,
            open: true,
            edit: d.edit
        })
    }

    changeOpen = (open) => {
        this.setState({
            open
        })
        if (!open) {
            this.clearValue()
        }
    }

    clearValue() {
        this.setState({
            open: false,
            title: '', //弹框标题
            id: null, //收货需求ID
            status: null, //状态
            modalType: -1, //弹框弹出类型  1.编辑 2.查看 3.新建
            carId: 0, //车牌id
            carName: null, //车牌名字
            clientId: 0, //客户id
            clientName: '', //客户简称
            consigneeId: null, //收货人id
            consigneeName: null, //收货人名称
            deliveryTime: null, //交货日期
            driverId: null, //司机id
            driverName: null, //司机姓名
            phone: null, //联系方式
            pickTypeId: null, //拣货要求id
            pickTypeName: null, //拣货要求名称
            receiptAddress: null, //收货地址
            remark: '', //备注
            shipmentCargoDetailsList: [], //出货明细列表
            shipmentDemandIdDeleteList: [], //要删除的出货明细id
            shipmentMethodId: null, //出货方式id
            shipmentMethodName: '', //出货方式名称
            singleNumber: '', //出货单号
            sourceId: null, //需求来源id
            sourceName: '', //需求来源名
            sourceNumber: '', //来源单号
            typeId: null, //出货类型id
            typeName: null, //出货类型名称
            warehouseId: null, //出货仓库id
            warehouseName: null, //出货仓库名称
            reloadPhoneAndAddress: false,
            batchNumber: null,
            curCargoDetailsList: [],
            projectName : null,
            projectId : null,
            cargoPartyName : null,
            contacts : null,
            phone : null,
            receiptAddress : null,
            areaName : null
        })
    }

    // 表格 column renderFun
    renderColumn = (val, r, rIndex, colName) => {
        const { getFieldDecorator } = this.props.form
        let { curCargoDetailsList, shipmentCargoDetailsList } = this.state
        switch (colName) {
            case 'materialNumber':
                if (r.isEdit) {
                    return (
                        <ColumnItemBox isFormChild>
                            <FormItem>
                                {
                                    getFieldDecorator(`${colName}-${rIndex}`, {
                                        initialValue: val,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择料号'
                                            }
                                        ]
                                    })(
                                        <Select
                                            // style={{ minWidth: 120 }}
                                            onChange={(value, opt) => this.changeSelect(value, opt, rIndex)}
                                            value={val}
                                        >
                                            {
                                                curCargoDetailsList.map((item, index) => {
                                                    let flag = shipmentCargoDetailsList.some(m => m.valStr === item.valStr)
                                                    return (
                                                        <Option
                                                            disabled={flag}
                                                            key={index}
                                                            title={item.materialName}
                                                            value={item.valStr}
                                                        >
                                                            {item.materialNumber}
                                                        </Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </ColumnItemBox>
                    )
                } else {
                    return (
                        <span title={val} className='text-overflow-ellipsis'>{val || '-'}</span>
                    )
                }

            case 'remark':
                return (
                    r.isEdit ?
                        <ColumnItemBox isFormChild>
                            <Input
                                style={{ minWidth: '100%' }}
                                value={val}
                                title={val}
                                onChange={e => this.updateDetailList(colName, rIndex, e ? e.target.value : null)}
                            />
                        </ColumnItemBox>
                        :
                        <span title={val} className='text-overflow-ellipsis'>{val || '-'}</span>
                )

            case 'pickCount':
                let maxVal = r.shouldPickCount || 0
                return (
                    r.isEdit ?
                        <ColumnItemBox isFormChild>
                            <FormItem>
                                {
                                    getFieldDecorator(`${colName}-${rIndex}`, {
                                        initialValue: val ? val : null,
                                        rules: [
                                            {
                                                required: false,
                                                message: '请填写',
                                                type: 'number',
                                                transform(val) {
                                                    if (val <= maxVal) {
                                                        return val
                                                    } else {
                                                        message.warning('超出仓库总量')
                                                    }
                                                }
                                            }
                                        ]
                                    })(
                                        <InputNumber
                                            min={0}
                                            max={maxVal}
                                            style={{ width: '100%' }}
                                            value={r.reload ? 0 : val}
                                            title={val}
                                            onChange={value => this.updateDetailList(colName, rIndex, value ? value : 0)}
                                        />
                                    )
                                }
                            </FormItem>
                        </ColumnItemBox>
                        :
                        <span title={val} className='text-overflow-ellipsis'>{val || 0}</span>
                )

            default:
                if (colName === 'shouldPickCount' && !val) {
                    val = 0
                }
                return (
                    <div style={{ minWidth: 80 }}>
                        <span title={val} className='text-overflow-ellipsis'>{(val || !isNaN(val)) ? val : '-'}</span>
                    </div>
                )
        }
    }

    /* 获取拣货要求列表 */
    getPickList = async () => {
        const { mobxDataBook, form } = this.props
        let { pickList } = this.state
        mobxDataBook.initData('拣货要求')
            .then(res => {
                pickList = [...res]
                let target = pickList.find(item => item.title === '先进先出')
                let pickTypeId = target.id
                let pickTypeName = target.title
                this.setState({ pickList, pickTypeId, pickTypeName, pickRender: true}, () => {
                    form.setFieldsValue({
                        pickTypeId
                    })
                    this.setState({ pickRender: false })
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    // 验证
    handleSubmit = (type) => {
        let { shipmentCargoDetailsList } = this.state
        if (shipmentCargoDetailsList.some(item => item.isEdit)) {
            message.warning('请先保存物料信息')
            return false
        }
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const methodName = type === 'save' ? 'saveSubmit' : 'confirmDemand'
                this[methodName]()
            }
        })
    }

    // 保存
    saveSubmit = async () => {
        const { rApi, parent, saveEdit } = this.props
        let { 
            id, //出货需求ID
            modalType, //弹框弹出类型  1.编辑 2.查看 3.新建
            carId, //车牌id
            carName, //车牌名字
            clientId, //客户id
            clientName, //客户简称
            consigneeId, //收货人id
            consigneeName, //收货人名称
            deliveryTime, //交货日期
            driverId, //司机id
            driverName, //司机姓名
            phone, //联系方式
            pickTypeId, //拣货要求id
            pickTypeName, //拣货要求名称
            receiptAddress, //收货地址
            remark, //备注
            shipmentCargoDetailsList, //出货明细列表
            shipmentDemandIdDeleteList, //要删除的出货明细id
            shipmentMethodId, //出货方式id
            shipmentMethodName, //出货方式名称
            singleNumber, //出货单号
            sourceId, //需求来源id
            sourceName, //需求来源名
            sourceNumber, //来源单号
            typeId, //出货类型id
            typeName, //出货类型名称
            warehouseId, //出货仓库id
            warehouseName, //出货仓库名称
            batchNumber,
            projectName,
            projectId,
            cargoPartyName,
            contacts,
            areaName
        } = this.state
        shipmentCargoDetailsList = shipmentCargoDetailsList.map(item => {
            delete item.isEdit
            item.id = item.id || null
            return item
        })
        let reqData = {
            id, //出货需求ID
            carId, //车牌id
            carName, //车牌名字
            clientId, //客户id
            clientName, //客户简称
            consigneeId, //收货人id
            consigneeName, //收货人名称
            deliveryTime, //交货日期
            driverId, //司机id
            driverName, //司机姓名
            phone, //联系方式
            pickTypeId, //拣货要求id
            pickTypeName, //拣货要求名称
            receiptAddress, //收货地址
            remark, //备注
            shipmentCargoDetailsList, //出货明细列表
            shipmentDemandIdDeleteList, //要删除的出货明细id
            shipmentMethodId, //出货方式id
            shipmentMethodName, //出货方式名称
            singleNumber, //出货单号
            sourceId, //需求来源id
            sourceName, //需求来源名
            sourceNumber, //来源单号
            typeId, //出货类型id
            typeName, //出货类型名称
            warehouseId,
            warehouseName,
            batchNumber,
            projectName,
            projectId,
            cargoPartyName,
            contacts,
            areaName
        }
        await this.setState({ saveLoading: true })
        let res = null
        if (modalType === 1) { //编辑
            try {
                res = await rApi.editShipment(reqData)
                if (res) {
                    saveEdit(reqData)
                    let shipmentCargoDetailsList = [...res.shipmentCargoDetailsList].map(item => {
                        let sumKey = item.unitType ? materialKeys[item.unitType - 1] : materialKeys[0]
                        return {
                            ...item,
                            sumKey,
                            pickCount: item[sumKey]
                        }
                    })
                    this.setState({ shipmentCargoDetailsList })
                } else {
                    throw Error('返回数据有误')
                }
            } catch (error) {
                message.error(error.msg || '操作失败！')
                this.setState({ saveLoading: false })
                return false
            }
        } else if (modalType === 2) {
            console.log('查看')
        } else if(modalType === 3) { //新建
            try {
                res = await rApi.addShipment(reqData)
                parent.searchCriteria()
                if (res) {
                    let shipmentCargoDetailsList = [...res.shipmentCargoDetailsList].map(item => {
                        let sumKey = item.unitType ? materialKeys[item.unitType - 1] : materialKeys[0]
                        return {
                            ...item,
                            sumKey,
                            pickCount: item[sumKey]
                        }
                    })
                    await this.setState({
                        modalType: 1,
                        id: res.id,
                        shipmentCargoDetailsList,
                        status: 1,
                        singleNumber: res.singleNumber
                    })
                } else {
                    throw Error('返回数据有误')
                }
            } catch (error) {
                message.error(error.msg || '操作失败！')
                this.setState({ saveLoading: false })
                return false
            }
        }
        message.success('操作成功！')
        this.setState({ saveLoading: false })
    }

    // 确认出货需求
    confirmDemand = async () => {
        const { rApi, saveEdit } = this.props
        const { id, shipmentCargoDetailsList } = this.state
        if (!shipmentCargoDetailsList || shipmentCargoDetailsList.length < 1) {
            message.warning('无已保存的货物')
            return
        }
        if (shipmentCargoDetailsList.some(item => !item.id)) {
            message.warning('有未提交保存的货物')
            return
        }
        try {
            await rApi.confirmShipmentDemand({ id })
            saveEdit({ id, status: 2 })
            this.changeOpen(false)
            message.success('操作成功')
        } catch (error) {
            message.error(error.msg || '操作失败！')
            return false
        }
    }

    // 取消确认出货需求
    cancelDemand = async () => {
        const { rApi, saveEdit } = this.props
        const { id } = this.state
        try {
            await rApi.cancelShipment({ id })
            saveEdit({
                id,
                status: 1
            })
            this.changeOpen(false)
            message.success('操作成功')
        } catch (error) {
            message.error(error.msg || '操作失败！')
            return false
        }
    }

    // 获取物料信息
    getMaterialList = async (clientId, warehouseId, batchNumber) => {
        let reqData = {}
        if (batchNumber) {
            reqData = {
                warehouseId,
                clientId,
                batchNumber
            }
        } else {
            reqData = {
                warehouseId,
                clientId
            }
        }
        let res = null
        try {
            res = await this.props.rApi.getMaterialList(reqData)
            if (batchNumber || batchNumber === null) {
                this.dealMateriaList([...res], batchNumber)
            } else {
                this.dealMateriaList([...res], false)
            }
        } catch (error) {
            console.log(error)
            return
        }
    }

    // 处理获取的物料list
    dealMateriaList = async (list, batchNumber) => {
        let curCargoDetailsList = [], 
            shipmentCargoDetailsList = [...this.state.shipmentCargoDetailsList]
            curCargoDetailsList = list.map((item, index) => {
                let sumKey = item.unitType ? materialKeys[item.unitType - 1] : materialKeys[0]
                item.quantityCount = item.quantityCountSum
                item.boxCount = item.boxCountSum
                item.boardCount = item.boardCountSum
                item.grossWeight = item.grossWeightSum
                item.volume = item.volumeSum
                item.sumKey = sumKey
                item.pickCount = item[sumKey]
                item.shouldPickCount = item[sumKey]
                item.valStr = `${item.materialNumber}|${index}`
                return item
            })
        if (batchNumber !== null) {
            shipmentCargoDetailsList = shipmentCargoDetailsList.filter(item => item.batchNumber === batchNumber)
        } else if (batchNumber === null) {
        } else {
            shipmentCargoDetailsList = []
        }
        await this.setState({shipmentCargoDetailsList, curCargoDetailsList})
    }

    // 修改列表数据
    updateDetailList = (colName, rIndex, value) => {
        let shipmentCargoDetailsList = [...this.state.shipmentCargoDetailsList]
        shipmentCargoDetailsList[rIndex][colName] = value 
        if (colName === 'pickCount') {
            let targetKey = shipmentCargoDetailsList[rIndex].sumKey || 'quantityCount'
            shipmentCargoDetailsList[rIndex][targetKey] = value
        }
        this.setState({shipmentCargoDetailsList})
    }

    // 修改选中物料
    changeSelect = async (value, opt, rIndex) => {
        let { curCargoDetailsList, shipmentCargoDetailsList } = this.state
        let selectItem = curCargoDetailsList.find(item => value === item.valStr)
        let sumKey = selectItem.unitType ? materialKeys[selectItem.unitType - 1] : materialKeys[0]
        selectItem.quantityCount = selectItem.quantityCountSum
        selectItem.boxCount = selectItem.boxCountSum
        selectItem.boardCount = selectItem.boardCountSum
        selectItem.grossWeight = selectItem.grossWeightSum
        selectItem.volume = selectItem.volumeSum
        selectItem.sumKey = sumKey
        selectItem.pickCount = selectItem[sumKey] || 0
        selectItem.shouldPickCount = selectItem[sumKey] || 0
        selectItem.isEdit = true
        selectItem.reload = true
        selectItem.id = shipmentCargoDetailsList[rIndex].id ? shipmentCargoDetailsList[rIndex].id : null
        shipmentCargoDetailsList.splice(rIndex, 1, selectItem)
        await this.setState({ curCargoDetailsList, shipmentCargoDetailsList })
        shipmentCargoDetailsList[rIndex].reload = false
        this.setState({ shipmentCargoDetailsList })
    }

    // 出货方式改变
    changeShipmentMode = async (val) => {
        //await this.setState({ shipmentMethodId: val.id, shipmentMethodName: val.title })
        if(val.id && val.id !== this.state.shipmentMethodId) {
            this.setState({
                shipmentMethodId: val.id, 
                shipmentMethodName: val.title,
                phone: null,
                contacts: null,
                consigneeId: null,
                consigneeName: null,
                receiptAddress: null,
                carName: null,
                driverName: null,
            })
        }
    }

    // 新增行
    addRow = () => {
        let {shipmentCargoDetailsList, curCargoDetailsList} = this.state
        if (shipmentCargoDetailsList.length < curCargoDetailsList.length) {
            shipmentCargoDetailsList.push({
                isEdit: true,
                materialNumber: '',
                materialName: '',
                materialSpecifications: '',
                pickCount: 0,
                shouldPickCount: 0,
                batchNumber: null,
                unit: '',
                unitId: null,
                remark: '',
                id: null,
                unitType: 0,
                quantityScale: 0,
                boxScale: 0,
                weightScale: 0,
                volumeScale: 0,
                perUnitWeight: 0,
                perUnitVolume: 0
            })
            this.setState({ shipmentCargoDetailsList })
        } else {
            message.warning('当前已无多余货物')
        }
    }

    // 编辑行
    editRow = (r, rIndex) => {
        let {shipmentCargoDetailsList} = this.state
        shipmentCargoDetailsList[rIndex].isEdit = true
        this.setState({shipmentCargoDetailsList})
    }

    // 保存行
    saveRow = (r, rIndex) => {
        const { validateFields } = this.props.form
        validateFields([`materialNumber-${rIndex}`], (err, values) => {
            if (!err) {
                let { shipmentCargoDetailsList } = this.state
                shipmentCargoDetailsList[rIndex].isEdit = false
                console.log('shipmentCargoDetailsList', shipmentCargoDetailsList)
                this.setState({ shipmentCargoDetailsList })
            }
        })
    }

    // 删除行
    deleteRow = (r, rIndex) => {
        let { shipmentCargoDetailsList, shipmentDemandIdDeleteList, modalType } = this.state
        if (modalType === 3) {
            shipmentDemandIdDeleteList = []
        } else if (modalType === 1) {
            if (r.id) {
                shipmentDemandIdDeleteList.push(r.id)
            }
        } else {}
        shipmentCargoDetailsList.splice(rIndex, 1)
        this.setState({ shipmentCargoDetailsList, shipmentDemandIdDeleteList })
    }

    /* 新建收发货方 */
    showSendReceive = e => {
        this.addoredit.show({
            edit: false,
            data: {
                addressType: 2,
                shipmentType: 'shipment'
            }
        })
    }

    // 导出表头
    exportDetails = async () => {
        this.saveExcel()
    }
    /* 导出数据到EXCEL */
    saveExcel(list = []) {
        const columns = colFun(this.renderColumn, this.editRow, this.saveRow, this.deleteRow, this.state.status)
        let fileName = '货物明细',
            sheetHeader = columns.filter(item => item.title && item.title !== '操作').map(item => {
                return item.title
            }),
            sheetFilter = columns.filter(item => item.title).map(item => {
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

    // /* 导入 */
    // getExcelData = async (d) => {
    //     if (this.state.importLoading) return
    //     const { rApi, curRow } = this.props
    //     let reqData = d.slice(1)
    //     this.setState({ importLoading: true })
    //     reqData = reqData.map(item => ({
    //         shipmentManageId: curRow.shipmentManageId,
    //         boardNumber: item[0],
    //         boxNum: item[1],
    //         boxSerialNum: item[2],
    //         materialNumber: item[3],
    //         remark: item[4]
    //     }))
    //     // try {
    //     //     await rApi.importShipmentScanning(reqData)
    //     // } catch (error) {
    //     //     message.error(error.msg || '操作失败')
    //     //     this.setState({ importLoading: false })
    //     //     return
    //     // }
    //     message.success('操作成功')
    //     this.searchCriteria()
    //     this.setState({ importLoading: false })
    // }

    /* 导入 */
    getExcelData = async (d) => {
        if (this.state.importLoading) return
        const { rApi, curRow, mobxDataBook } = this.props
        const { curCargoDetailsList, shipmentCargoDetailsList } = this.state
        const header = d[0]
        let exData = d.slice(1)
        this.setState({ importLoading: true })
        // getDataMethod: 'getMaterials', params: { limit: 99999, offset: 0, clientId: clientId }
        // rApi['getMaterials']({ limit: 99999, offset: 0, clientId: clientId }).then(materials => {
            let materials = curCargoDetailsList
            console.log('materials', materials)
            exData = exData.map((item) => {
                item = Array.from(item)
                let obj = {}
                item.map((ele, index) => {
                    let key = ImportTableHeaderToKey(header[index])
                    if (key) {
                        obj[key] = ele
                    }
                })
                return obj
            })
            // exData.forEach(element => {
            //     materials.map(item => {
            //         console.log('element', element, item)
            //         if (item.materialNumber === element.materialNumber) {
            //             let sumKey = materialKeys[0]
            //             item.quantityCount = item.quantityCountSum
            //             item.boxCount = item.boxCountSum
            //             item.boardCount = item.boardCountSum
            //             item.grossWeight = item.grossWeightSum
            //             item.volume = item.volumeSum
            //             item.sumKey = sumKey
            //             item.pickCount = item[sumKey] || 0
            //             item.shouldPickCount = item[sumKey] || 0
            //             // item.isEdit = true
            //             element = {
            //                 ...element,
            //                 ...item
            //             }
            //             console.log('element', element)
            //         }
            //     })
            // })
        for (let element of exData) {
            if (parseInt(element['pickCount']) === 0 || (element['pickCount'].length > 0 && parseInt(element['pickCount']).isNaN())) {
                message.error('非法的拣货数量')
                return
            }
        }
            exData = exData.map(element => {
                let obj = element
                materials.map(item => {
                    console.log('element', element, item)
                    if (item.materialNumber === element.materialNumber) {
                        let sumKey = item.unitType ? materialKeys[item.unitType - 1] : materialKeys[0]
                        item.quantityCount = item.quantityCountSum
                        item.boxCount = item.boxCountSum
                        item.boardCount = item.boardCountSum
                        item.grossWeight = item.grossWeightSum
                        item.volume = item.volumeSum
                        item.sumKey = sumKey
                        item.pickCount = parseInt(element['pickCount']) || item[sumKey]
                        item.shouldPickCount = item[sumKey] || element.shouldPickCount
                        // item.isEdit = true
                        if (item.pickCount > item[sumKey]) {
                            message.warning(`物料：${item.materialNumber}，拣货数量超出仓库总量，已重置为仓库总量`)
                            item.pickCount = item[sumKey]
                        }
                        obj = {
                            ...element,
                            ...item
                        }
                        console.log('element', element)
                    }
                })
                return obj
            })
            this.setState({
                shipmentCargoDetailsList: exData,
                importLoading: false
            })

            // for (let element of exData) {
            //     if (!element.materiaInfo) {
            //         // 物料不存在
            //         message.error(`物料${element.materialName}不存在`)
            //         return
            //     }
            // }
            // Promise.all([mobxDataBook.initData('计量单位'), mobxDataBook.initData('计重单位'), mobxDataBook.initData('计体单位')]).then(values => {
            //     // console.log('values', values)
            //     let units = []
            //     values.map(item => {
            //         units.push(...(item || []))
            //     })
            //     exData.forEach(element => {
            //         units.map(item => {
            //             if (item.title === element.unit) {
            //                 element.unitId = item.id
            //             }
            //         })
            //     })
            //     for (let element of exData) {
            //         if (!element.unitId) {
            //             // 单位不存在
            //             message.error(`单位${element.unit}不存在`)
            //             return
            //         }
            //     }
            //     // console.log('exData', exData)
            //     this.setState({
            //         receiptCargoDetailsList: exData
            //     })
            // })
        // })
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
        // this.setState({ importLoading: false })
    }

    render() { 
        const { getFieldDecorator } = this.props.form
        let { power } = this.props
        let {
            open,
            title,
            status, //状态
            modalType, //弹框弹出类型  1.编辑 2.查看 3.新建
            clientId, //客户id
            clientName, //客户简称
            consigneeId, //收货人id
            consigneeName, //收货人名称
            deliveryTime, //交货日期
            phone, //联系方式
            pickTypeId, //拣货要求id
            pickTypeName, //拣货要求名称
            receiptAddress, //收货地址
            remark, //备注
            shipmentCargoDetailsList, //出货明细列表
            shipmentMethodId, //出货方式id
            shipmentMethodName, //出货方式名称
            singleNumber, //出货单号
            sourceId, //需求来源id
            sourceName, //需求来源名
            sourceNumber, //来源单号
            typeId, //出货类型id
            typeName, //出货类型名称
            warehouseId, //出货仓库id
            warehouseName,
            saveLoading,
            pickList,
            pickRender,
            projectName,
            projectId,
            cargoPartyName,
            contacts,
            areaName,
            reloadConsignee
        } = this.state
        title = modalType === 1 ? '编辑出货需求' : title

        const Title = (status) => {
            if (status === 1) {
                return (
                    <div>
                        <span style={{color: '#484848', fontSize: '14px'}}>{singleNumber}</span>
                        <span style={{ fontSize: '14px', color: '#F5222D', marginLeft: '16px'}}>未确认</span>
                    </div>
                )
            } else if (status === 2) {
                return (
                    <div>
                        <span style={{color: '#484848', fontSize: '14px'}}>{singleNumber}</span>
                        <span style={{ fontSize: '14px', color: 'rgb(29, 165, 122)',  marginLeft: '16px'}}>已确认</span>
                    </div>
                )
            }
        }

        return (
            <Modal
                style={{ width: '98%', maxWidth: 1000, minHeight: 300 }}
                changeOpen={this.changeOpen}
                open={open}
                title={title} 
            >
                <div style={{ minHeight: 272 }}>
                    <SendReceiveModal
                        parent={this}
                        getThis={(v) => this.addoredit = v}
                        getConsigneeData={(value) => {
                            let cargoPartyName =  value && `${value.cargoPartyName}${value.cargoPartyCode ? `(${value.cargoPartyCode})` : '无'}`
                            let contacts = value && value.contactName
                            let phone = value && value.cellphoneNumber
                            let receiptAddress = value && value.address
                            let areaName = value && value.areaName
                            this.setState({
                                consigneeId: value.id, 
                                consigneeName: value.cargoPartyName,
                                cargoPartyName: cargoPartyName,
                                contacts: contacts,
                                phone: phone,
                                receiptAddress: receiptAddress,
                                areaName: areaName,
                                reloadConsignee: true
                            }, () => {
                                this.setState({
                                    reloadConsignee: false
                                })
                            })
                        }}
                    />
                    <Form layout='inline'>
                        <Modal.Header title={Title(status)} isHide={modalType === 2 ? true : false}>
                            {
                                status === 2 ? null :
                                    <FormItem>
                                        <FunctionPower power={power.SAVE_DATA}>
                                            <Button
                                                onClick={e => this.handleSubmit('save')}
                                                style={{ marginRight: 0 }}
                                                loading={saveLoading}
                                            >
                                                保存
                                            </Button>
                                        </FunctionPower>
                                    </FormItem>
                            }
                            {
                                <FormItem>
                                    {
                                        status === 1 ?
                                        <FunctionPower power={power.CONFIRM_DATA}>
                                            <Popconfirm
                                                title='是否确认？'
                                                onConfirm={() => this.handleSubmit('confirm')}
                                            >
                                                <Button type='primary' style={{ marginLeft: 10 }}>确认</Button>
                                            </Popconfirm>
                                        </FunctionPower>
                                        :
                                        status === 2 ?
                                        <FunctionPower power={power.CANCEL_DATA}>
                                            <Button type='primary' onClick={this.cancelDemand}>取消确认</Button>
                                        </FunctionPower>
                                        :
                                        null
                                    }
                                </FormItem>
                            }
                        </Modal.Header>
                        <div style={{ padding: '5px 20px'}} className="shipment-demand-wrapper">
                            <Row gutter={24} type={modalType}>
                                <Col isRequired label="客户简称&emsp;&emsp;" colon span={7} text={clientName && clientName.title ? clientName.title : '无'}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('clientName', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择客户简称'
                                                    }
                                                ],
                                            })(
                                                <RemoteSelect
                                                    defaultValue={clientName ? {
                                                        shortname: clientName,
                                                        id: clientId
                                                    } : null}
                                                    onChangeValue={(value = {}) => {
                                                        if (value && clientId === value.id) return
                                                        this.setState({ clientId: value.id ? value.id : null, clientName: value.shortname ? value.shortname : null }, () => {
                                                            if (this.state.clientId !== null && this.state.warehouseId !== null) {
                                                                this.getMaterialList(this.state.clientId, this.state.warehouseId)
                                                            } else {
                                                                this.setState({
                                                                    shipmentCargoDetailsList: [],
                                                                    shipmentDemandIdDeleteList: [],
                                                                    curCargoDetailsList: [],
                                                                    batchNumber: null
                                                                })
                                                            }
                                                        })
                                                    }}
                                                    getDataMethod={'getClients'}
                                                    params={{ offset: 0, limit: 99999 }}
                                                    labelField={'shortname'}
                                                    disabled={status && status === 2}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                {/* <Col label="项目名称&emsp;&emsp;" colon span={7} text={projectName}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('projectId', {
                                                rules: [
                                                    { 
                                                        required: false, 
                                                        message: '请选择项目'
                                                    }
                                                ],
                                            })(
                                                <RemoteSelect
                                                    defaultValue={projectId ? {id: projectId, projectName: projectName} : null}
                                                    onChangeValue={
                                                        value => {
                                                            this.setState({
                                                                projectId: value ? value.id : null,
                                                                projectName: value ? value.name || value.projectName : '',
                                                            })
                                                        }
                                                    } 
                                                    disabled={(!clientId || status === 2) ? true : false}
                                                    getDataMethod={'getCooperativeList'}
                                                    params={{pageSize: 999999, pageNo: 0, clientId: clientId, status: 2}}
                                                    labelField={'projectName'}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col> */}
                                <Col isRequired label="出货仓库&emsp;&emsp;" colon span={7} text={warehouseName && warehouseName.title ? warehouseName.title : '无'}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('warehouseName', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择出货仓库'
                                                    }
                                                ],
                                            })(
                                                <RemoteSelect
                                                    defaultValue={warehouseName ? {
                                                        name: warehouseName,
                                                        id: warehouseId
                                                    } : null}
                                                    onChangeValue={(value = {}) => {
                                                        if (value && warehouseId === value.id) return
                                                        this.setState({ warehouseId: value.id ? value.id : null, warehouseName: value.name ? value.name : null }, () => {
                                                            if (this.state.clientId !== null && this.state.warehouseId !== null) {
                                                                this.getMaterialList(this.state.clientId, this.state.warehouseId)
                                                            } else {
                                                                this.setState({
                                                                    shipmentCargoDetailsList: [],
                                                                    shipmentDemandIdDeleteList: [],
                                                                    curCargoDetailsList: [],
                                                                    batchNumber: null
                                                                })
                                                            }
                                                        })
                                                    }}
                                                    placeholder=''
                                                    getDataMethod={'getWarehouseList'}
                                                    params={{ pageNo: 1, pageSize: 99999 }}
                                                    labelField={'name'}
                                                    disabled={status && status === 2}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col isRequired label="出货类型&emsp;&emsp;" colon span={7} text={typeName}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('typeName', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择出货类型'
                                                    }
                                                ],
                                            })(
                                                <RemoteSelect
                                                    defaultValue={typeName ? {
                                                        title: typeName,
                                                        id: typeId
                                                    } : null}
                                                    onChangeValue={(value = {}) => {
                                                        this.setState({ typeId: value.id, typeName: value.title })
                                                    }
                                                    }
                                                    placeholder=''
                                                    text='出货类型'
                                                    disabled={status && status === 2}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24} type={modalType}>
                                
                                <Col isRequired label="交货日期&emsp;&emsp;" colon span={7} text={deliveryTime ? moment(deliveryTime).format('YYYY-MM-DD HH:mm') : ''}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('deliveryTime', {
                                                initialValue: deliveryTime ? moment(deliveryTime) : null,
                                                rules: [
                                                    { 
                                                        required: true, 
                                                        message: '请选择交货日期'
                                                    }
                                                ],
                                            })(
                                                <DatePicker
                                                    //defaultValue={deliveryTime ? moment(deliveryTime) : null}
                                                    format="YYYY-MM-DD HH:mm"
                                                    showTime={{format: 'HH:mm'}}
                                                    style={{width: '100%'}}
                                                    placeholder=''
                                                    onChange={
                                                        date => {
                                                            this.setState({ deliveryTime: moment(date).format('YYYY-MM-DD HH:mm') })
                                                        }
                                                    }
                                                    disabled={status && status === 2}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col isRequired label="拣货要求&emsp;&emsp;" colon span={7} text={pickTypeName}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('pickTypeId', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择拣货要求'
                                                    }
                                                ],
                                            })(
                                                <RemoteSelect
                                                    defaultValue={pickTypeId ? {
                                                        title: pickTypeName,
                                                        id: pickTypeId
                                                    } : null}
                                                    onChangeValue={(value = {}) => {
                                                        this.setState({ pickTypeId: value.id, pickTypeName: value.title })
                                                    }}
                                                    placeholder=''
                                                    labelField='title'
                                                    disabled={status && status === 2}
                                                    forceRender={pickRender}
                                                    list={pickList}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col isRequired label="订单编号&emsp;&emsp;" colon span={7} text={sourceName}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('sourceName', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择订单编号'
                                                    }
                                                ],
                                            })(
                                                <RemoteSelect
                                                    defaultValue={sourceName ? {
                                                        title: sourceName,
                                                        id: sourceId
                                                    } : null}
                                                    onChangeValue={(value = {}) => {
                                                        this.setState({ sourceId: value.id, sourceName: value.title })
                                                    }}
                                                    placeholder=''
                                                    text='订单编号'
                                                    disabled={status && status === 2}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24} type={modalType}>
                                
                                <Col label="订单类型&emsp;&emsp;" colon span={7} text={sourceNumber}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('sourceNumber', {
                                                initialValue: sourceNumber ? sourceNumber : null,
                                                rules: [{
                                                    required: false,
                                                    message: '请填写订单类型'
                                                }],
                                            })(
                                                <Input
                                                    onChange={e => {
                                                        this.setState({ sourceNumber: e.target.value })
                                                    }}
                                                    placeholder=""
                                                    disabled={status && status === 2}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={7} />
                                <Col isRequired label="出货方式&emsp;&emsp;" colon span={7} text={shipmentMethodName}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('shipmentMethodId', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择出货方式'
                                                    }
                                                ],
                                            })(
                                                <RemoteSelect
                                                    defaultValue={shipmentMethodId ? {
                                                        title: shipmentMethodName,
                                                        id: shipmentMethodId
                                                    } : null}
                                                    onChangeValue={(value = {}) => {
                                                        this.changeShipmentMode(value)
                                                    }}
                                                    placeholder=''
                                                    text='出货方式'
                                                    disabled={status && status === 2}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={7} />
                                <Col span={7} />
                            </Row>
                            {
                                shipmentMethodName === '到仓提货' ?
                                <Row gutter={24} type={modalType}>
                                    <Col label="提货人&emsp;&emsp;&emsp;" colon span={7} text={contacts}>
                                        <Input 
                                            value={contacts ? contacts : ''}
                                            // placeholder="车牌" 
                                            onChange={e => {
                                                this.setState({contacts: e.target.value})
                                                //setFieldsValue({carcode: e.target.value})
                                            }}
                                            disabled={status && status === 2}
                                        />
                                    </Col>
                                    <Col label="联系方式&emsp;&emsp;" colon span={7} text={phone}>
                                        <Input
                                            //defaultValue={phone ? phone : null}
                                            value={phone ? phone : null}
                                            placeholder=""
                                            title={phone}
                                            onChange={e => { this.setState({ phone: e.target.value }) }}
                                            disabled={status && status === 2}
                                        />
                                    </Col>
                                    <Col span={7} />
                                </Row>
                                :
                                null
                            }
                            {
                                shipmentMethodName === '送货上门'?
                                    <Row>
                                        <Col label='选择收货方&emsp;' colon>
                                            <div className="recive-wrapper">
                                                <div className="flex flex-vertical-center">
                                                    {
                                                        reloadConsignee ?
                                                            null
                                                            :
                                                            <RemoteSelect
                                                                style={{ width: '203px' }}
                                                                defaultValue={consigneeId ? {
                                                                    cargoPartyName: consigneeName,
                                                                    id: consigneeId
                                                                } : null}
                                                                onChangeValue={(value = {}) => {
                                                                    let name = value && value.origin_data && value.origin_data[0] && value.origin_data[0].cargoPartyName
                                                                    let code = value && value.origin_data && value.origin_data[0] && value.origin_data[0].cargoPartyCode
                                                                    let contactsName = value && value.origin_data && value.origin_data[0] && value.origin_data[0].contactName
                                                                    let phoneVul = value && value.origin_data && value.origin_data[0] && value.origin_data[0].cellphoneNumber
                                                                    let address = value && value.origin_data && value.origin_data[0] && value.origin_data[0].address
                                                                    let area = value && value.origin_data && value.origin_data[0] && value.origin_data[0].areaName
                                                                    this.setState(
                                                                        {
                                                                            consigneeId: value.id || null,
                                                                            consigneeName: value.cargoPartyName || null,
                                                                            cargoPartyName: name ? `${name}${code ? `(${code})` : ''}` : cargoPartyName,
                                                                            contacts: contactsName ? contactsName : contacts,
                                                                            phone: phoneVul ? phoneVul : phone,
                                                                            receiptAddress: address ? address : receiptAddress,
                                                                            areaName: area ? area : areaName
                                                                        })
                                                                }
                                                                }
                                                                disabled={clientId && status !== 2 ? false : true}
                                                                placeholder=''
                                                                labelField='cargoPartyName'
                                                                getDataMethod={'getConsignees'}
                                                                params={{
                                                                    limit: 999999,
                                                                    offset: 0,
                                                                    clientId,
                                                                    addressType: 2
                                                                }}
                                                            />
                                                    }
                                                    <span onClick={this.showSendReceive} style={{ color: '#18B583', cursor: 'pointer', marginLeft: 30 }}>新建收货方</span>
                                                </div>
                                                <div className="flex flex-vertical-center">
                                                    <div className="re-main" style={{ width: 300 }}>
                                                        <div className="flex flex-vertical-center">
                                                            <div className="title">收货方(代码)：</div>
                                                            <div
                                                                className="text text-overflow-ellipsis"
                                                                style={{ width: 220 }}
                                                            >
                                                                {cargoPartyName ? cargoPartyName : '-'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="re-main" style={{ width: 200 }}>
                                                        <div className="flex flex-vertical-center">
                                                            <div className="title">联系人：</div>
                                                            <div
                                                                className="text text-overflow-ellipsis"
                                                                style={{ width: 140 }}
                                                            >
                                                                {contacts ? contacts : '-'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="re-main">
                                                        <span className="title">联系方式：</span>
                                                        <span className="text text-overflow-ellipsis">{
                                                            phone ? phone : '-'
                                                        }</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-vertical-center">
                                                    <div className="re-main2" style={{ width: 500 }}>
                                                        <div className="flex flex-vertical-center">
                                                            <div className="title">详细地址：</div>
                                                            <div
                                                                className="text text-overflow-ellipsis"
                                                                style={{ marginLeft: 20, width: 400 }}
                                                            >
                                                                {receiptAddress ? addressFormat(receiptAddress) : '-'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex1">
                                                        <div className="flex flex-vertical-center">
                                                            <div className="title">所属片区：</div>
                                                            <div className="text text-overflow-ellipsis">{areaName ? areaName : '-'}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row> : null
                            }
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
                        <div type="flex" justify="space-around" style={{ padding: '0 10px 10px', borderTop: '2px solid #c9c9c9' }}>
                            <div className='tableheadbar'>
                                <span style={{color: '#484848', fontSize: '14px'}}>货物明细</span>
                                {
                                    status !== 2 &&
                                    <div>
                                        <UploadExcel
                                            getExcelData={this.getExcelData}
                                            loading={this.state.importLoading}
                                        />
                                        <Button
                                            onClick={this.exportDetails}
                                            style={{ verticalAlign: 'middle', marginRight: 10 }}
                                            icon="export"
                                        >
                                            导出表头
                                        </Button>
                                        <Button
                                            icon='plus'
                                            style={{ verticalAlign: 'middle' }}
                                            onClick={this.addRow}
                                        >
                                            添加
                                        </Button>
                                    </div>
                                }
                            </div>
                            <div style={{padding: '0 10px'}}>
                                <Table
                                    bordered
                                    pagination={false}
                                    scroll={{ x: true }}
                                    dataSource={shipmentCargoDetailsList}
                                    columns={colFun(this.renderColumn, this.editRow, this.saveRow, this.deleteRow, status)}
                                />
                            </div>
                        </div>
                    </Form>
                </div>
            </Modal>
        )
    }
}
 
export default Form.create()(AddOrEdit);