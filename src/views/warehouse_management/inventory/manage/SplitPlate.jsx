import React from 'react'
import { inject } from "mobx-react"
import { Button, Form, message, InputNumber } from 'antd'
import Modal from '@src/components/modular_window'
import { Table, Parent, ColumnItemBox } from '@src/components/table_template'
import Footbtnbar from '../../public/Footbtnbar'
import { colFun } from './index'

const cFun = (props) => {
    let rt = colFun(props),
        hasKeys = ['warehouseStorageNumber', 'boardNumber', 'materialNumber', 'materialName', 'materialSpecifications', 'boxCount', 'quantityCount', 'grossWeight', 'volume', 'unit']
    rt = rt.filter(item => hasKeys.some(k => k === item.dataIndex))
    rt = rt.map(item => {
        if (item.key === 'quantityCount' || item.key === 'boxCount' || item.key === 'grossWeight' || item.key === 'volume') {
            item.render = (t, r, index) => {
                if (r.isSplit) {
                    return (
                        <ColumnItemBox isFormChild>
                            <InputNumber
                                style={{ width: '100%', maxWidth: 100 }}
                                onChange={val => props.editFun(val, r, index, item.key)}
                                min={1}
                                value={t}
                            />
                        </ColumnItemBox>
                    )
                } else {
                    return (
                        <ColumnItemBox name={t} />
                    )
                }
            }
        }
        return item
    })
    return rt
}

@inject('rApi')
class SplitPlate extends Parent {
    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        this.state = {
            open: false,
            title: '拆板操作',
            loading: false,
            selectedRows: [],
            columns: cFun({ editFun: this.editFun }),
            noConfirm: false,
        }
    }

    async show (d) {
        let selectedRows = d && d.payload ? [...d.payload] : []
        await this.setState({
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
            selectedRows: [],
            noConfirm: false
        })
    }

    // 获取列表数据
    getData = () => {
        const { selectedRows } = this.state
        return new Promise((resolve, reject) => {
            let list = [...selectedRows]
            list = this.dealList(list)
            resolve({
                dataSource: list,
                total: list.length
            })
        })
    }
    dealList = list => list.map(item => {
        let a
        return {
            ...item,
            isSplit: false,
            maxquantityCount: item.quantityCount,
            maxboxCount: item.boxCount,
            maxgrossWeight: item.grossWeight,
            maxvolume: item.volume
        }
    })

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
        let list = this.gd()
        if (list.length < 2) {
            message.warning('未拆分')
            return
        }
        let reqData = {
            id: list[0].id,
            quantityCount: list[1].quantityCount,
            boxCount: list[1].boxCount,
            grossWeight: list[1].grossWeight,
            netWeight: 0,
            volume: list[1].volume
        }
        let res = null
        try {
            res = await this.props.rApi.dismantPlate(reqData)
        } catch (error) {
            this.setState({ loading: false })
            message.error(error.msg || '操作失败')
            return
        }
        if (res && res.boardNumber) {
            list[1].boardNumber = res.boardNumber
            this.upd(list)
            this.props.parent.searchCriteria()
            message.success('操作成功')
            this.setState({ loading: false, noConfirm: true })
        } else {
            console.log('获取失败')
        }
        // this.changeOpen(false)
    }

    // 拆分
    doSplit = (r, index) => {
        let list = this.gd()
        let newRow = {
            ...r,
            boardNumber: null,
            isSplit: true,
            quantityCount: list[index].quantityCount >= 1 ? 1 : 0,
            boxCount: list[index].boxCount >= 1 ? 1 : 0,
            grossWeight: list[index].grossWeight >= 0 ? 1 : 0,
            volume: list[index].volume >= 1 ? 1 : 0
        }
        list[index].quantityCount -= list[index].quantityCount >= 1 ? 1 : 0
        list[index].boxCount -= list[index].boxCount >= 1 ? 1 : 0
        list[index].grossWeight -= list[index].grossWeight >= 0 ? 1 : 0
        list[index].volume -= list[index].volume >= 1 ? 1 : 0
        list.push(newRow)
        this.upd(list)
    }

    // 编辑数量
    editFun = (val, r, index, key) => {
        val = isNaN(val) ? 0 : val
        let list = this.gd()
        let maxKey = `max${key}`
        list[1][key] = val > r[maxKey] ? r[maxKey] : val
        list[0][key] = (r[maxKey] - val) < 0 ? 0 : r[maxKey] - val
        this.upd(list)
    }

    // 自定义操作
    actionView = ({ record, index }) => {
        let list = this.gd()
        if (!record.isSplit && !list.some(item => item.isSplit)) {
            return (
                <span
                    className='action-button'
                    onClick={() => this.doSplit(record, index)}
                >
                    拆分
                </span>
            )
        } else {
            return (
                <span className='action-button'></span>
            )
        }
    }

    render () {
        let { loading, noConfirm } = this.state
        return (
            <Modal
                style={{ width: '95%', maxWidth: 1000 }}
                changeOpen={this.changeOpen}
                open={this.state.open}
                title={this.state.title}
                getContentDom={v => this.popupContainer = v}
            >
                <Form layout='inline' className='splitplate-form'>
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
                        tableWidth={140}
                        tableHeight={400}
                        actionWidth={90}
                        actionView={this.actionView}
                    />
                    <Footbtnbar noLine style={{marginTop: 10}}>
                        {
                            !noConfirm && <Button
                                type='primary'
                                onClick={this.handleSubmit} loading={loading}
                            >确定</Button>
                        }
                        <Button onClick={() => this.changeOpen(false)}>取消</Button>
                    </Footbtnbar>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(SplitPlate)