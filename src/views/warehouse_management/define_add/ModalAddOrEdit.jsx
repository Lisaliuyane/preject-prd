import React, { Component } from 'react'
import Modal from '@src/components/modular_window'
import { Button, Form, Input, message, InputNumber } from 'antd'
import FormItem from '@src/components/FormItem'
import RemoteSelect from '@src/components/select_databook'
import { Row, Col } from '@src/components/grid'
import { trim } from '@src/utils'
import { inject } from "mobx-react"
import Footbtnbar from '../public/Footbtnbar'

@inject('rApi')
class StorageAddOrEdit extends Component {

    state = {
        title: '新建储位',
        edit: false,
        loading: false,
        open: false,
        type: '', //弹窗打开类型
        id: null, //储位ID
        typeId: null, // 储位类型ID
        typeName: null, // 储位类型名
        number: '', //储位编号
        remark: null, // 备注
        capacity: null, //储位容量
        length: null, //储位长
        width: null, //储位宽
        height: null, //储位高
        warehouseId: null, //仓库ID
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
    }

    show(d) {
        console.log('show储位', d)
        if (d.edit) { //如果是编辑
            this.setState({
                edit: d.edit,
                id: d.data.id,
                typeId: d.data.typeId,
                typeName: d.data.typeName,
                number: d.data.number,
                remark: d.data.remark,
                capacity: d.data.capacity,
                length: d.data.length,
                width: d.data.width,
                height: d.data.height,
                warehouseId: d.data.warehouseId,
                open: true
            })
        } else { //如果是新建
            this.setState({
                edit: d.edit,
                open: true
            })
        }
    }

    clearValue = () => {
        this.setState({
            edit: false,
            typeId: null, // 储位类型ID
            typeName: null, // 储位类型名
            remark: '', // 备注
            number: '',
            capacity: null, //储位容量
            length: null, //储位长
            width: null, //储位宽
            height: null, //储位高
            type: null,
            warehouseId: null,
        })
    }

    changeOpen = (state) => {
        this.setState({
            open: state
        })
        if (!state) {
            this.clearValue()
        }
    }

    actionDone = () => {
        const { parent } = this.props
        if (parent.searchCriteria) {
            parent.searchCriteria()
        }
        this.changeOpen(false)
        message.success('操作成功！')
    }

    // 新建或保存储位验证
    handleSubmit = (e) => {
        // 保存按钮事件句柄
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (trim(values.number) === '' || values.number === null) {
                this.props.form.setFields({/* 验证储位编号 */
                    number: {
                        value: '',
                        errors: [new Error('请填写储位编号')]
                    }
                })
                return
            }
            if (!err) {
                this.addOrEdit()
            }
        })
    }

    // 新建或保存储位
    addOrEdit = async () => {
        const APINAME = this.state.edit ? 'editStorage' : 'addStorage'
        let {
            capacity,
            height,
            length,
            width,
            remark,
            number,
            typeId,
            typeName,
            id,
        } = this.state
        let reqData = {
            capacity,
            height,
            length,
            width,
            remark,
            number,
            typeId,
            typeName,
            warehouseId: this.props.warehouseId,
            id: id || null
        }
        await this.setState({ loading: true })
        try {
            await this.props.rApi[APINAME](reqData)
        } catch (error) {
            message.error(error.msg || '操作失败')
            this.setState({ loading: false })
            return
        }
        this.actionDone()
        this.props.getSumData()
        this.setState({ loading: false })
    }

    render() {
        let {
            edit,
            title,
            typeId, // 储位类型ID
            typeName, // 储位类型名
            number,
            capacity,
            length,
            width,
            height,
            remark,
            loading
        } = this.state
        const { getFieldDecorator } = this.props.form
        return (
            <Modal
                onSubmit={this.onSubmit}
                maxWidth={600}
                style={{ width: '95%', maxWidth: 700 }}
                changeOpen={this.changeOpen}
                open={this.state.open}
                title={title}
            >
                <Form layout='inline' className='storage-form'>
                    <Row>
                        <Col isRequired label="储位编号" span={8} text={number}>
                            <FormItem>
                                {
                                    getFieldDecorator('number', {
                                        initialValue: number,
                                        rules: [
                                            {
                                                isrequired: true,
                                                message: '请填写储位号'
                                            }
                                        ],
                                    })(
                                        <Input
                                            disabled={edit}
                                            defaultValue={number}
                                            value={number}
                                            placeholder=""
                                            onChange={e => {
                                                this.setState({ number: e && e.target.value ? `${e.target.value}` : null })
                                            }}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col isRequired label="储位类型" span={8} text={typeName}>
                            <FormItem>
                                {
                                    getFieldDecorator('typeId', {
                                        initialValue: typeId ?
                                            {
                                                id: typeId,
                                                title: typeName
                                            }
                                            :
                                            null,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择储位类型'
                                            }
                                        ],
                                    })(
                                        <RemoteSelect
                                            defaultValue={
                                                typeId ?
                                                    {
                                                        id: typeId,
                                                        title: typeName
                                                    }
                                                    :
                                                    null
                                            }
                                            onChangeValue={(value = {}) => this.setState({ typeId: value.id, typeName: value.title })}
                                            text="储位类型"
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col isRequired label="储位容量" span={9}>
                            <FormItem style={{ width: 88 }}>
                                {
                                    getFieldDecorator('capacity', {
                                        initialValue: capacity,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请填写体积'
                                            }
                                        ],
                                    })(
                                        <InputNumber
                                            min={1}
                                            style={{width: '100%'}}
                                            placeholder="m³"
                                            onChange={value => {
                                                this.setState({ capacity: value })
                                            }}
                                        />
                                    )
                                }
                            </FormItem>
                            <span style={{ padding: '0 4px', lineHeight: '35px', marginLeft: '6px' }}>m³</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col label="储位大小" span={14} text={`${length} x ${width} x ${height}`}>
                            <FormItem style={{ width: 88 }}>
                                {
                                    getFieldDecorator('length', {
                                        initialValue: length,
                                        rules: [
                                            {
                                                required: false,
                                                message: '请填写长'
                                            }
                                        ],
                                    })(
                                        <InputNumber
                                            min={1}
                                            placeholder='长(L)'
                                            onChange={value => this.setState({ length: value })}
                                        />
                                    )
                                }
                            </FormItem>
                            <span style={{ padding: '0 4px', lineHeight: '35px' }}>*</span>
                            <FormItem style={{ width: 88 }}>
                                {
                                    getFieldDecorator('width', {
                                        initialValue: width,
                                        rules: [
                                            {
                                                required: false,
                                                message: '请填写箱宽'
                                            }
                                        ],
                                    })(
                                        <InputNumber
                                            min={1}
                                            placeholder='宽(B)'
                                            onChange={value => this.setState({ width: value })}
                                        />
                                    )
                                }
                            </FormItem>
                            <span style={{ padding: '0 4px', lineHeight: '35px' }}>*</span>
                            <FormItem style={{ width: 88 }}>
                                {
                                    getFieldDecorator('height', {
                                        initialValue: height,
                                        rules: [
                                            {
                                                required: false,
                                                message: '请填写箱高'
                                            }
                                        ],
                                    })(
                                        <InputNumber
                                            min={1}
                                            placeholder='高(H)'
                                            onChange={value => this.setState({ height: value })}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col label="&emsp;&emsp;备注" span={10} text={remark}>
                            <Input
                                defaultValue={remark ? remark : null}
                                placeholder=""
                                title={remark}
                                onChange={e => { this.setState({ remark: e.target.value }) }}
                            />
                        </Col>
                    </Row>
                    <Footbtnbar noLine>
                        <Button type='primary' onClick={this.handleSubmit} loading={loading}>保存</Button>
                        <Button onClick={e => this.changeOpen(false)}>取消</Button>
                    </Footbtnbar>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(StorageAddOrEdit)