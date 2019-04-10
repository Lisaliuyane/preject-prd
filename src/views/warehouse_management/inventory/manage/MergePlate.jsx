import React from 'react'
import { inject } from "mobx-react"
import { Button, Form, Radio, message } from 'antd'
import Modal from '@src/components/modular_window'
import { Table, Parent } from '@src/components/table_template'
import Footbtnbar from '../../public/Footbtnbar'
import { Row, Col } from '@src/components/grid'
import FormItem from '@src/components/FormItem'
import RemoteSelect from '@src/components/select_databook'
import { colFun } from './index'

@inject('rApi')
class MergePlate extends Parent {
    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        this.state = {
            open: false,
            title: '合板操作',
            loading: false,
            getLoading: false,
            selectedRows: [],
            mode: 1, // 1 -> 选中的板 2 -> 使用新板
            targetRow: null,
            boardNumber: '',
            warehouseStorageNumber: '',
            cacheBoard: null
        }
        let columns = colFun(),
            hasKeys = ['warehouseStorageNumber', 'boardNumber', 'materialNumber', 'materialName', 'materialSpecifications', 'clientName', 'singleNumber', 'receiptTime']
        columns = columns.filter(item => hasKeys.some(k => item.key === k))
        columns = columns.map(item => ({
            ...item,
            title: item.key === 'boardNumber' ? '板号' : item.title
        }))
        this.state.columns = columns
    }

    show (d) {
        let selectedRows = d && d.payload ? [...d.payload] : []
        this.setState({
            selectedRows,
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
            loading: false,
            getLoading: false,
            selectedRows: [],
            mode: 1,
            targetRow: null,
            boardNumber: '',
            warehouseStorageNumber: '',
            cacheBoard: null
        })
    }

    // 获取列表数据
    getData = () => {
        const { selectedRows } = this.state
        return new Promise((resolve, reject) => {
            resolve({
                dataSource: selectedRows,
                total: selectedRows.length
            })
        })
    }

    // 更改合板方式
    changeMode = async e => {
        let val = e.target.value
        let { cacheBoard } = this.state
        let res = null
        if (val === 2) {
            if (!cacheBoard) {
                if (this.state.getLoading) return
                this.setState({ getLoading: true })
                try {
                    res = await this.props.rApi.inventoryGetBoardNumber()
                } catch (error) {
                    message.error(error.msg || '获取板号失败')
                    this.setState({ getLoading: false })
                    return
                }
                this.setState({ getLoading: false, cacheBoard: res, boardNumber: res })
            } else {
                this.setState({boardNumber: cacheBoard})
            }
        } else {
            this.setState({ boardNumber: null })
        }
        this.setState({ mode: val })
    }

    // 确定验证
    handleSubmit = (e) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.onConfirm()
            }
        })
    }

    // 确定操作
    onConfirm = async () => {
        if (this.state.loading) return
        this.setState({ loading: true })
        let { boardNumber, warehouseStorageNumber, selectedRows, mode, targetRow } = this.state
        let ids = selectedRows.map(item => item.id)
        let id = mode === 2 ? null : mode === 1 ? targetRow.id : null
        let reqData = {
            boardNumber,
            warehouseStorageNumber,
            id,
            ids
        }
        try {
            await this.props.rApi.inventoryMergePlate(reqData)
        } catch (error) {
            this.setState({ loading: false })
            message.error(error.msg || '操作失败')
            return
        }
        this.props.parent.searchCriteria()
        message.success('操作成功')
        this.setState({ loading: false })
        this.changeOpen(false)
    }

    render () {
        let { loading, mode, getLoading, boardNumber, selectedRows } = this.state
        const { warehouseId } = this.props
        const { getFieldDecorator } = this.props.form
        const rowStyle = { minHeight: 42 }
        return (
            <Modal
                style={{ width: '95%', maxWidth: 800 }}
                changeOpen={this.changeOpen}
                open={this.state.open}
                title={this.state.title}
                getContentDom={v => this.popupContainer = v}
            >
                <Form layout='inline' className='mergeplate-form'>
                    <Table
                        noPadding
                        parent={this}
                        isHideHeaderButton
                        isNoneSelected
                        isNoneNum
                        isNonePagination
                        title={null}
                        getData={this.getData}
                        columns={this.state.columns}
                        isNoneAction
                        tableWidth={140}
                        tableHeight={400}
                    />
                    <Row style={rowStyle}>
                        <Col label='选择合并后的板' span={10}>
                            <Radio.Group
                                value={mode}
                                onChange={this.changeMode}
                                disabled={getLoading}
                            >
                                <Radio value={1}>选中的板</Radio>
                                <Radio value={2}>使用新板</Radio>
                            </Radio.Group>
                        </Col>
                    </Row>
                    <Row style={rowStyle}>
                        <Col label='选择板号' span={10}>
                            {
                                mode === 1 ? <FormItem>
                                    {
                                        getFieldDecorator('boardNumber', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择板号'
                                                }
                                            ],
                                        })(
                                            <RemoteSelect
                                                onChangeValue={
                                                    e => {
                                                        console.log('e', e)
                                                        this.setState({ boardNumber: e ? e.boardNumber : null, targetRow: e ? e : null })
                                                    }
                                                }
                                                list={selectedRows}
                                                timelyFilter
                                                showOrigin
                                                placeholder=''
                                                labelField={'boardNumber'}
                                            />
                                        )
                                    }
                                </FormItem> : <span style={{ color: '#0C0035'}}>{boardNumber}</span>
                            }
                        </Col>
                    </Row>
                    <Row style={rowStyle}>
                        <Col label='选择储位' span={10}>
                            <FormItem>
                                {
                                    getFieldDecorator('warehouseStorageNumber', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择储位'
                                            }
                                        ],
                                    })(
                                        <RemoteSelect
                                            onChangeValue={
                                                e => {
                                                    this.setState({ warehouseStorageNumber: e ? e.number : null })
                                                }
                                            }
                                            params={{ pageSize: 99999, pageNo: 1, warehouseId: warehouseId }}
                                            getDataMethod={'getStorageList'}
                                            placeholder=''
                                            labelField={'number'}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={rowStyle}>
                        <Col label='注' span={10}>
                            <span>合板后系统将自动删除空板</span>
                        </Col>
                    </Row>
                    <Footbtnbar noLine style={{marginTop: 10}}>
                        <Button type='primary' onClick={this.handleSubmit} loading={loading}>确定</Button>
                        <Button onClick={() => this.changeOpen(false)}>取消</Button>
                    </Footbtnbar>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(MergePlate)