import React from 'react'
import { inject } from "mobx-react"
import { Button, Form, Radio, message } from 'antd'
import Modal from '@src/components/modular_window'
import Footbtnbar from '../../public/Footbtnbar'
import { Row, Col } from '@src/components/grid'
import FormItem from '@src/components/FormItem'
import RemoteSelect from '@src/components/select_databook'

@inject('rApi')
class ActionMore extends React.Component {
    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        this.state = {
            open: false,
            title: '',
            loading: false,
            type: 'move',
            curRow: {},
            _deepIndex: -1
        }
    }

    show (d) {
        let title = d.type === 'move' ? '移位操作' : d.type === 'allot' ? '调拨操作' : '货物状态维护'
        this.setState({
            title,
            type: d.type,
            curRow: d.payload,
            _deepIndex: d.index,
            open: true
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

    clearValue = () => {
        this.setState({
            title: '',
            type: 'move',
            curRow: {},
            _deepIndex: -1
        })
    }

    // 确定验证
    handleSubmit = (e) => {
        const { type } = this.state
        const { form } = this.props
        if (type === 'move') { //移位
            form.validateFields(['warehouseStorageNumber'], (err, values) => {
                if (!err) {
                    this.onConfirm()
                }
            })
        } else if (type === 'allot') { //调拨
            form.validateFields(['warehouseId', 'warehouseStorageNumber'], (err, values) => {
                if (!err) {
                    this.onConfirm()
                }
            })
        } else if (type === 'changeStatus') {
            this.onConfirm()
        } else {}
    }

    // 确定操作
    onConfirm = async () => {
        if (this.state.loading) return
        const { type, curRow, _deepIndex } = this.state
        const APINAME = type === 'move' ? 'inventoryMoveLocation' : type === 'allot' ? 'inventoryAllot' : 'inventoryChangeStatus'
        const METHODNAME = type === 'move' ? 'moveAction' : type === 'allot' ? 'allotAction' : 'changeStatus'
        this.setState({ loading: true })
        let id = curRow.id ? curRow.id : null
        let reqData = type === 'move' ? {
            id,
            warehouseStorageNumber: curRow.warehouseStorageNumber
        } : type === 'allot' ? {
            id,
            warehouseId: curRow.warehouseId,
            warehouseStorageNumber: curRow.warehouseStorageNumber
        } : {
            id,
            status: curRow.status
        }
        try {
            await this.props.rApi[APINAME](reqData)
        } catch (error) {
            message.error(error.msg || '操作失败')
            this.setState({ loading: false })
            return
        }
        if (type === 'allot') {
            this.props[METHODNAME](curRow, _deepIndex).searchCriteria()
        } else {
            this.props[METHODNAME](curRow, _deepIndex)
        }
        message.success('操作成功')
        this.setState({ loading: false })
        this.changeOpen(false)
    }

    render () {
        let { curRow, type, loading } = this.state
        const { getFieldDecorator, setFieldsValue } = this.props.form
        const rowStyle = {minHeight: 40}
        return (
            <Modal
                style={{ width: '95%', maxWidth: 400 }}
                changeOpen={this.changeOpen}
                open={this.state.open}
                title={this.state.title}
                getContentDom={v => this.popupContainer = v}
            >
                <Form layout='inline' className='actionmore-form'>
                    {
                        type === 'allot' ? <div>
                            <Row style={rowStyle}>
                                <Col label='当前仓库' span={10}>{curRow.warehouseName}</Col>
                                <Col label='当前板号' span={10}>{curRow.boardNumber}</Col>
                                <Col span={2} />
                            </Row>
                            <Row style={rowStyle}>
                                <Col label='选择仓库' span={10}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('warehouseId', {
                                                initialValue: curRow && curRow.warehouseId ? {
                                                    id: curRow.warehouseId,
                                                    name: curRow.warehouseName
                                                } : null,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择仓库'
                                                    }
                                                ],
                                            })(
                                                <RemoteSelect
                                                    defaultValue={curRow && curRow.warehouseId ? {
                                                        id: curRow.warehouseId,
                                                        name: curRow.warehouseName
                                                    } : null}
                                                    onChangeValue={
                                                        async e => {
                                                            let newRow = {
                                                                ...curRow,
                                                                warehouseId: e ? e.id : null,
                                                                warehouseName: e ? e.name : null,
                                                                warehouseStorageNumber: null
                                                            }
                                                            await this.setState({
                                                                curRow: newRow
                                                            })
                                                            setFieldsValue({
                                                                warehouseStorageNumber: null
                                                            })
                                                        }
                                                    }
                                                    params={{ pageSize: 99999, pageNo: 1 }}
                                                    getDataMethod={'getWarehouseList'}
                                                    placeholder=''
                                                    labelField={'name'}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col label='选择储位' span={10}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('warehouseStorageNumber', {
                                                initialValue: curRow && curRow.warehouseStorageNumber ? {
                                                    id: curRow.warehouseStorageNumber,
                                                    number: curRow.warehouseStorageNumber
                                                } : null,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择储位'
                                                    }
                                                ],
                                            })(
                                                <RemoteSelect
                                                    defaultValue={curRow && curRow.warehouseStorageNumber ? {
                                                        id: curRow.warehouseStorageNumber || null,
                                                        number: curRow.warehouseStorageNumber || null
                                                    } : null}
                                                    onChangeValue={
                                                        e => {
                                                            let newRow = { ...curRow, warehouseStorageNumber: e ? e.number : null }
                                                            this.setState({ curRow: newRow })
                                                        }
                                                    }
                                                    params={{ pageSize: 99999, pageNo: 1, warehouseId: curRow.warehouseId }}
                                                    getDataMethod={'getStorageList'}
                                                    placeholder=''
                                                    labelField={'number'}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={2} />
                            </Row>
                        </div> : type === 'move' ? <div>
                            <Row style={rowStyle}>
                                <Col label='当前储位' span={10}>{curRow.warehouseStorageNumber}</Col>
                                <Col label='当前板号' span={10}>{curRow.boardNumber}</Col>
                                <Col span={2} />
                            </Row>
                            <Row style={rowStyle}>
                                <Col label='选择储位' span={10}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('warehouseStorageNumber', {
                                                initialValue: curRow && curRow.warehouseStorageNumber ? curRow.warehouseStorageNumber : null,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择储位'
                                                    }
                                                ],
                                            })(
                                                <RemoteSelect
                                                    defaultValue={curRow && curRow.warehouseStorageNumber ? {
                                                        id: curRow.warehouseStorageNumber,
                                                    number: curRow.warehouseStorageNumber
                                                    } : null}
                                                    onChangeValue={
                                                        e => {
                                                            let newRow = { ...curRow, warehouseStorageNumber: e ? e.number : null }
                                                            this.setState({ curRow: newRow })
                                                        }
                                                    }
                                                    params={{ pageSize: 99999, pageNo: 1, warehouseId: curRow.warehouseId }}
                                                    getDataMethod={'getStorageList'}
                                                    placeholder=''
                                                    labelField={'number'}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                        </div> : type === 'changeStatus' ? <Radio.Group
                            value={curRow.status}
                            onChange={e => {
                                let newRow = { ...curRow, status: e.target.value }
                                this.setState({ curRow: newRow })
                            }}
                        >
                            <Radio value={1}>良品</Radio>
                            <Radio value={0}>不良品</Radio>
                        </Radio.Group> : null
                    }
                    <Footbtnbar noLine style={{marginTop: 10}}>
                        <Button type='primary' onClick={this.handleSubmit} loading={loading}>确定</Button>
                        <Button onClick={() => this.changeOpen(false)}>取消</Button>
                    </Footbtnbar>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(ActionMore)