import React from 'react'
import { inject } from "mobx-react"
import { Button, Form, message, Input } from 'antd'
import Modal from '@src/components/modular_window'
import { Table, Parent, ColumnItemBox } from '@src/components/table_template'
import Footbtnbar from '../../public/Footbtnbar'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { children, id } from './power'

const power = Object.assign({}, children, id)

const colFun = (editCol) => [
    {
        className: 'text-overflow-ellipsis',
        title: '箱号',
        dataIndex: 'boxNum',
        key: 'boxNum',
        width: 140,
        render: (t, r, index) => {
            if (r.isEdit) {
                return (
                    <ColumnItemBox isFormChild style={{ maxWidth: 150 }}>
                        <Input value={t} onChange={e => editCol('boxNum', e.target.value, index)} />
                    </ColumnItemBox>
                )
            } else {
                return (
                    <ColumnItemBox name={t} />
                )
            }
        }
    },
    {
        className: 'text-overflow-ellipsis',
        title: '序列号',
        dataIndex: 'boxSerialNum',
        key: 'boxSerialNum',
        width: 140,
        render: (t, r, index) => {
            if (r.isEdit) {
                return (
                    <ColumnItemBox isFormChild style={{maxWidth: 150}}>
                        <Input value={t} onChange={e => editCol('boxSerialNum', e.target.value, index)} />
                    </ColumnItemBox>
                )
            } else {
                return (
                    <ColumnItemBox name={t} />
                )
            }
        }
    }
]

@inject('rApi')
class Details extends Parent {
    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        this.state = {
            open: false,
            title: '板货明细',
            loading: false,
            saveLoading: false,
            curRow: {},
            _deepIndex: -1,
            columns: colFun(this.editCol)
        }
    }

    show(d) {
        this.setState({
            _deepIndex: d.index,
            curRow: d.payload,
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
            curRow: {},
            _deepIndex: -1
        })
    }

    // 获取列表数据
    getData = () => {
        const { rApi } = this.props
        const { curRow } = this.state
        let id = curRow ? curRow.id : null
        return new Promise((resolve, reject) => {
            rApi.getInventoryDetails({ id })
                .then(async res => {
                    let list = [...res]
                    list = this.dealList(list)
                    resolve({
                        dataSource: list,
                        total: list.length
                    })
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    // 处理数据
    dealList = arr => arr.map(item => ({
        ...item,
        isEdit: false
    }))

    // 编辑数据
    editCol = (key, val, index) => {
        let list = this.gd()
        list[index][key] = val
        this.upd(list)
    }

    // 新建
    onAdd = () => {
        let list = this.gd()
        if (list.some(item => item.isEdit)) {
            message.warning('有未保存数据')
            return
        }
        const { curRow } = this.state
        let newRow = {
            isEdit: true,
            inventoryManageId: curRow.id,
            boardNumber: curRow.boardNumber,
            id: null,
            boxNum: '',
            boxSerialNum: ''
        }
        list.push(newRow)
        this.upd(list)
    }
    // 编辑/保存 删除
    onEditItem = (r, index) => {
        let list = this.gd()
        list[index].isEdit = true
        this.upd(list)
    }
    onSaveAddNewData = async (r, index) => {
        if (this.state.saveLoading) return
        let reqData = {
            id: r.id,
            inventoryManageId: r.inventoryManageId,
            boardNumber: r.boardNumber,
            boxNum: r.boxNum,
            boxSerialNum: r.boxSerialNum
        }
        try {
            await this.props.rApi.addInventoryDetails(reqData)
        } catch (error) {
            this.setState({ saveLoading: false })
            message.error(error.msg || '操作失败')
            return
        }
        if (!r.id) {
            this.searchCriteria()
        } else {
            let list = this.gd()
            this.setState({ saveLoading: true })
            list[index].isEdit = false
            this.upd(list)
        }
        this.setState({ saveLoading: false })
        message.success('操作成功')
    }
    onDeleteItem = async (r, index) => {
        try {
            await this.props.rApi.delInventoryDetails({id: r.id})
        } catch (error) {
            message.error(error.msg || '操作失败')
            return
        }
        let list = this.gd()
        list.splice(index, 1)
        this.upd(list)
        message.success('操作成功')
    }

    // 确定验证
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.onConfirm()
            }
        })
    }

    // 确定操作
    onConfirm = async () => {
        this.changeOpen(false)
    }

    // 表格顶部按钮
    cusTableHeaderButton = () => (
        <Button icon='export' style={{ verticalAlign: 'middle' }}>导出</Button>
    )

    render() {
        let { loading, curRow } = this.state
        return (
            <Modal
                style={{ width: '95%', maxWidth: 600 }}
                changeOpen={this.changeOpen}
                open={this.state.open}
                title={this.state.title}
                getContentDom={v => this.popupContainer = v}
            >
                <Form layout='inline' className='details-form'>
                    {
                        curRow && curRow.id &&
                        <Table
                            noPadding
                            parent={this}
                            isHideDeleteButton
                            isHideDragButton
                            isNoneSelected
                            isNonePagination
                            title={null}
                            getData={this.getData}
                            columns={this.state.columns}
                            power={{
                                ADD_DATA: {},
                                EDIT_DATA: {},
                                DEL_DATA: {}
                            }}
                            // isNoneAction
                            actionWidth={90}
                            tableWidth={100}
                            tableHeight={500}
                            onAdd={this.onAdd}
                            onEditItem={this.onEditItem}
                            onSaveAddNewData={this.onSaveAddNewData}
                            onDeleteItem={this.onDeleteItem}
                            cusTableHeaderButton={this.cusTableHeaderButton()}
                        />
                    }
                    <Footbtnbar noLine style={{ marginTop: 10 }}>
                        <Button type='primary' onClick={this.handleSubmit} loading={loading}>确定</Button>
                        <Button onClick={() => this.changeOpen(false)}>取消</Button>
                    </Footbtnbar>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(Details)