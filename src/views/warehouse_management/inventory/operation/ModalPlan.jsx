import React from 'react'
import { inject, observer } from "mobx-react"
import { Button, Form, message, DatePicker } from 'antd'
import moment from 'moment'
import Modal from '@src/components/modular_window'
import FormItem from '@src/components/FormItem'
import { Row, Col } from '@src/components/grid'
import RemoteSelect from '@src/components/select_databook'
import { Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { deleteNull } from '@src/utils'

const colRendFun = (t, r, i, key) => {
    let name = t
    if (key === 'receiptTime') {
        name = t ? moment(t).format('YYYY-MM-DD') : ''
    }
    return (
        <ColumnItemBox name={name} />
    )
}

const colFun = (weightUnit = 'kg') => [
    {
        className: 'text-overflow-ellipsis',
        title: '板号',
        dataIndex: 'boardNumber',
        key: 'boardNumber',
        width: 120,
        render: (t, r, i) => colRendFun(t, r, i, 'boardNumber')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '储位',
        dataIndex: 'warehouseStorageNumber',
        key: 'warehouseStorageNumber',
        width: 100,
        render: (t, r, i) => colRendFun(t, r, i, 'warehouseStorageNumber')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '料号',
        dataIndex: 'materialNumber',
        key: 'materialNumber',
        width: 100,
        render: (t, r, i) => colRendFun(t, r, i, 'materialNumber')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '物料名称',
        dataIndex: 'materialName',
        key: 'materialName',
        width: 100,
        render: (t, r, i) => colRendFun(t, r, i, 'materialName')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        width: 80,
        render: (t, r, i) => colRendFun(t, r, i, 'unit')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '数量',
        dataIndex: 'quantityCount',
        key: 'quantityCount',
        width: 90,
        render: (t, r, i) => colRendFun(t, r, i, 'quantityCount')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '箱数',
        dataIndex: 'boxCount',
        key: 'boxCount',
        width: 90,
        render: (t, r, i) => colRendFun(t, r, i, 'boxCount')
    },
    {
        className: 'text-overflow-ellipsis',
        title: `重量(${weightUnit})`,
        dataIndex: 'grossWeight',
        key: 'grossWeight',
        width: 90,
        render: (t, r, i) => colRendFun(t, r, i, 'grossWeight')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '体积(m³)',
        dataIndex: 'volume',
        key: 'volume',
        width: 90,
        render: (t, r, i) => colRendFun(t, r, i, 'volume')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '收货日期',
        dataIndex: 'receiptTime',
        key: 'receiptTime',
        width: 120,
        render: (t, r, i) => colRendFun(t, r, i, 'receiptTime')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '收货单号',
        dataIndex: 'singleNumber',
        key: 'singleNumber',
        width: 120,
        render: (t, r, i) => colRendFun(t, r, i, 'singleNumber')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '客户',
        dataIndex: 'clientName',
        key: 'clientName',
        width: 120,
        render: (t, r, i) => colRendFun(t, r, i, 'clientName')
    }
]

@inject('rApi')
@observer
class ModalPlan extends Parent {
    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        this.state = {
            title: '新建盘点计划',
            columns: colFun(),
            abnormal: false,
            clientId: null,
            materialNumber: null,
            receiptTimeStart: null,
            receiptTimeEnd: null,
            warehouseId: null,
            checkTypeId: null,
            checkTypeName: null,
            clientName: null,
            materialName: null,
            inventoryManagesList: []
        }
    }

    // 弹窗出现
    show(d) {
        const { weightUnit } = this.props
        let columns = colFun(weightUnit || 'kg')
        this.setState({
            open: true,
            columns
        })
    }

    // 清空数据
    clearValue() {
        this.setState({
            abnormal: false,
            clientId: null,
            materialNumber: null,
            receiptTimeStart: null,
            receiptTimeEnd: null,
            warehouseId: null,
            checkTypeId: null,
            checkTypeName: null,
            clientName: null,
            materialName: null,
            inventoryManagesList: []
        })
    }

    // 打开/关闭弹窗
    changeOpen = (open) => {
        this.setState({
            open
        })
        if (!open) {
            this.clearValue()
        }
    }

    onChangeValue = () => {
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    // 查询盘点单列表
    getCheckList = async (params) => {
        const { rApi } = this.props
        let { abnormal, clientId, materialNumber, receiptTimeStart, receiptTimeEnd, warehouseId } = this.state
        let reqData = {
            abnormal,
            clientId,
            materialNumber,
            receiptTimeStart,
            receiptTimeEnd,
            warehouseId
        }
        reqData = deleteNull(reqData)
        return new Promise((resolve, reject) => {
            if (!warehouseId) {
                this.setState({ inventoryManagesList: [] })
                resolve({
                    dataSource: [],
                    total: 0
                })
                return false
            }
            rApi.selectCheckList(reqData)
                .then(async res => {
                    let list = [...res]
                    await this.setState({ inventoryManagesList: list })
                    resolve({
                        dataSource: list,
                        total: list.length
                    })
                })
                .catch(async err => {
                    console.log(err)
                    await this.setState({ inventoryManagesList: [] })
                    resolve({
                        dataSource: [],
                        total: 0
                    })
                })
        })
    }

    // 验证
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
          if (!err) {
            //console.log('Received values of form: ', values)
            this.saveSubmit()
          }
        })
    }
    // 新建/保存盘点计划
    saveSubmit = async () => {
        const { rApi, parent } = this.props
        let {
            checkTypeId,
            checkTypeName,
            clientId,
            clientName,
            materialName,
            materialNumber,
            receiptTimeStart,
            receiptTimeEnd,
            warehouseId,
            inventoryManagesList
        } = this.state
        if (!inventoryManagesList || inventoryManagesList && inventoryManagesList.length < 1) {
            message.warning('无盘点数据')
            return false
        }
        inventoryManagesList = inventoryManagesList.map(item => {
            item.goodStatus = item.status
            delete item.status
            return item
        })
        let reqData = {
            checkTypeId,
            checkTypeName,
            clientId,
            clientName,
            materialName,
            materialNumber,
            receiptTimeStart,
            receiptTimeEnd,
            warehouseId,
            inventoryManagesList
        }
        await this.setState({ submitLoading: true })
        try {
            await rApi.addCheckPlan(reqData)
            this.changeOpen(false)
            parent.onChangeValue()
            message.success('操作成功')
            this.setState({ submitLoading: false })
        } catch (error) {
            this.setState({ submitLoading: false })
            message.error(error.msg || '操作失败')
            return false
        }
    }

    render() { 
        const { getFieldDecorator } = this.props.form
        let {
            columns,
            open,
            title,
            submitLoading,
            receiptTimeStart, //收货日期开始
            receiptTimeEnd, //收货日期结束
        } = this.state
        const titlebarStyle = { height: '40px', lineHeight: '40px', fontSize: '14px', color: '#484848' }
        return (
            <Modal
                style={{ width: '95%', maxWidth: 850, minHeight: 300 }}
                changeOpen={this.changeOpen}
                open={open}
                title={title}
                getContentDom={v => this.popupContainer = v}
            >
                <Form layout='inline' style={{ padding: '0 20px 10px' }}>
                    <div style={titlebarStyle}>基本信息</div>
                    <div style={{ border: '1px solid #e0e0e0', borderLeft: 'none', borderRight: 'none', padding: '5px 0' }}>
                        <Row>
                            <Col isRequired label="盘点仓库" span={7}>
                                <FormItem>
                                    {
                                        getFieldDecorator('warehouseId', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择仓库'
                                                }
                                            ]
                                        })(
                                            <RemoteSelect
                                                onChangeValue={async val => {
                                                    await this.setState({ warehouseId: val ? val.id : null })
                                                    this.onChangeValue()
                                                }}
                                                placeholder=''
                                                getDataMethod={'getWarehouseList'}
                                                params={{ pageNo: 1, pageSize: 99999 }}
                                                labelField={'name'}
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col label="客户简称" span={7}>
                                <RemoteSelect
                                    onChangeValue={async val => {
                                        await this.setState({
                                            clientId: val ? val.id : null,
                                            clientName: val ? val.shortname : null
                                        })
                                        this.onChangeValue()
                                    }}
                                    getDataMethod={'getClients'}
                                    params={{ offset: 0, limit: 99999 }}
                                    labelField={'shortname'}
                                />
                            </Col>
                            <Col label="客户料号" span={7}>
                                <RemoteSelect
                                    onChangeValue={(val = {}) => {
                                        this.setState({
                                            materialNumber: val.materialItemNumber,
                                            materialName: val.itemName
                                        }, () => this.onChangeValue())
                                    }}
                                    getDataMethod={'getMaterials'}
                                    params={{ offset: 0, limit: 99999, materialType: 2 }}
                                    labelField={'materialItemNumber'}
                                    showOrigin
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col isRequired label="盘点方式" span={7}>
                                <FormItem>
                                    {
                                        getFieldDecorator('checkTypeId', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择盘点类型'
                                                }
                                            ]
                                        })(
                                            <RemoteSelect
                                                onChangeValue={async (val = {}) => {
                                                    let abnormal = (val && val.title === '异动盘点') ? true : false
                                                    await this.setState({
                                                        abnormal,
                                                        checkTypeId: val.id,
                                                        checkTypeName: val.title
                                                    })
                                                    this.onChangeValue()
                                                }}
                                                placeholder=''
                                                text='盘点方式'
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col label="收货日期" span={13} text={receiptTimeStart}>
                                <DatePicker
                                    format={'YYYY-MM-DD'}
                                    placeholder='日期开始时间'
                                    value={receiptTimeStart ? moment(receiptTimeStart) : null}
                                    onChange={async (date, dateStr) => {
                                        await this.setState({receiptTimeStart: dateStr})
                                        this.onChangeValue()
                                    }}
                                    style={{ marginRight: '12px' }}
                                />
                                <DatePicker
                                    format={'YYYY-MM-DD'}
                                    placeholder='日期结束时间'
                                    value={receiptTimeEnd ? moment(receiptTimeEnd) : null}
                                    onChange={async (date, dateStr) => {
                                        await this.setState({ receiptTimeEnd: dateStr })
                                        this.onChangeValue()
                                    }}
                                />
                            </Col>
                            <Col span={1} />
                        </Row>
                    </div>
                    <div style={titlebarStyle}>盘点明细</div>
                    <Table
                        noPadding
                        noTitlebar
                        isNoneAction
                        isNoneSelected
                        isHideHeaderButton
                        isNonePagination
                        parent={this}
                        tableWidth={100}
                        tableHeight={400}
                        columns={columns}
                        getData={this.getCheckList}
                    />
                    <div style={{ padding: '20px 0 10px' }}>
                        <Button type='primary' style={{ marginRight: '10px' }} loading={submitLoading} onClick={this.handleSubmit}>确定</Button>
                        <Button onClick={() => this.changeOpen(false)}>取消</Button>
                    </div>
                </Form>
            </Modal>
        )
    }
}
 
export default Form.create()(ModalPlan);