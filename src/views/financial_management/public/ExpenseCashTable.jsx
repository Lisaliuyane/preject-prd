import React, { Component, Fragment } from 'react'
import { inject } from "mobx-react"
import { ColumnItemBox } from '@src/components/table_template'
import { Table, Button, Popconfirm, message, InputNumber, Input } from 'antd'
import RemoteSelect from '@src/components/select_databook'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { children, id } from '../account/payable/power'

const power = Object.assign({}, children, id)

const EditableCell = ({ editable, value, record, onChange, type }) => {
   // console.log('EditableCell', value)
    if (type === 'expenseName') { //费用项
        return (
            <Fragment>
                {
                    editable ?
                    <ColumnItemBox isFormChild>
                        <RemoteSelect
                            defaultValue={record ? {id: record.expenseId, expenseName: record.expenseName} : null}
                            onChangeValue={
                                value => {
                                    onChange(value)
                                }
                            } 
                            labelField='expenseName'
                            getDataMethod="getCostItems"
                            params={{ limit: 999999, offset: 0, billingMethodId: 154}}
                        />
                    </ColumnItemBox>
                    : 
                    <ColumnItemBox name={value} />
                }
            </Fragment>
        )
    } else if (type === 'remark') {/* 备注 */
        return (
            <Fragment>
                {
                    editable ?
                        <ColumnItemBox isFormChild>
                            <Input
                                defaultValue={record ? { id: record.remark } : null}
                                value={value}
                                onChange={
                                    e => {
                                        onChange(e ? e.target.value : '')
                                    }
                                }
                            />
                        </ColumnItemBox>
                        :
                        <ColumnItemBox name={value} />
                }
            </Fragment>
        )
    }
    return (
        <Fragment>
        {
            editable ?
            <ColumnItemBox isFormChild>
                <InputNumber 
                    style={{ width: '100%' }}
                    value={value} 
                    title={value} 
                    onChange={value => onChange(value)} 
                /> 
            </ColumnItemBox>
            : 
            <ColumnItemBox name={value} />
        }
        </Fragment>
    )
}

@inject('rApi')  
export default class ExpenseCashTable extends Component {

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        this.state = {
            removeIds: [],
            dataSource: props.dataList || [],
            rowSaveLoading: false
        }
    }

    /* 添加 */
    onAdd = () => {
        if (this.state.dataSource.some(item => item.isEdit)) {
            message.warning('存在未保存费用项')
            return
        }
        this.state.dataSource.push({
            expenseId: '',
            expenseName: '',
            amount: '',
            remark: '',
            isEdit: true
        })
        this.setState({dataSource: this.state.dataSource})
    }

    /* 编辑 */
    editData = (record, index) => {
        let { dataSource } = this.state
        dataSource[index].isEdit = true
        this.setState({ dataSource: dataSource })
    }

    /* 保存行数据 */
    saveData = async (record, index) => {
        if (record.expenseName) {
            let { dataSource } = this.state
            dataSource[index].isEdit = false
            if (this.state.rowSaveLoading) {
                return
            }
            await this.setState({ dataSource: dataSource })
            await this.onSave()
        } else {
            message.error('费用项不能为空！')
        }
    }

    /* 执行保存 */
    onSave = async () => {
        if (this.state.rowSaveLoading) {
            return
        }
        this.setState({ rowSaveLoading: true })
        if (this.props.onSave) {
            await this.props.onSave()
        }
        this.setState({ rowSaveLoading: false })
    }

    /* 删除 */
    onDelete = async (index) => {
        //this.state.dataSource.removeIds.push(this.state.dataSource[index].id)
        let target = this.state.dataSource[index]
        if (target.id) {
            let { removeIds } = this.state
            removeIds.push(target.id)
            this.setState({removeIds: removeIds})
        }
        this.state.dataSource.splice(index, 1)
        await this.setState({dataSource: this.state.dataSource})
        await this.onSave()
    }

    /* onchange */
    handleChange = (value, key, column) => {
        let dataSource = this.state.dataSource
        if (key === 'expenseName') {
            dataSource[column]['expenseName'] = value ? value.title || value.expenseName : ''
            dataSource[column]['expenseId'] = value ? value.id : ''
        } else {
            dataSource[column][key] = value
        }
        this.setState({dataSource: dataSource})
    }

    /* 表格列渲染 */
    renderColumns = (text, key, record, column) => {
        return (
            <EditableCell
                editable={record.isEdit}
                value={text}
                key={key}
                type={key}
                record={record}
                onChange={value => this.handleChange(value, key, column)}
            />
        );
    }

    /* 获取表格数据 */
    getResultList = () => {
        const {dataSource} = this.state
        // if (dataSource.some(item => item.isEdit)) {
        //     message.warning('有未保存费用项数据')
        // }
        let rt = dataSource.filter(item => !item.isEdit)
        // console.log('result', rt)
        return {
            removeIds: this.state.removeIds,
            data: rt
        }
    }

    /* 表格标题 */
    tableTitle = (curPageData) => {
        return (
            <div style={{padding: '5px 0px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontSize: '14px', fontWeight: 500}}>补扣款信息</span>
                <Button onClick={this.onAdd}>新增</Button>
                {/* <FunctionPower power={power.editAccountReceivable}>
                    <Button onClick={this.onSave} style={{ marginLeft: 10 }} loading={this.state.buttonLoading}>保存</Button>
                </FunctionPower> */}
            </div>
        )
    }

    render() {
        let { dataSource } = this.state
        let props = this.props
        //console.log('dataSource', dataSource)
        const columns = () => {
            let cols = [
                {
                    className: 'text-overflow-ellipsis',
                    title: '费用项',
                    dataIndex: 'expenseName',
                    key: 'expenseName',
                    width: 160,
                    render: (text, record, index) => {
                        return this.renderColumns(text, 'expenseName', record, index)
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '金额',
                    dataIndex: 'amount',
                    key: 'amount',
                    width: 160,
                    render: (text, record, index) => {
                        return this.renderColumns(text, 'amount', record, index)
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    render: (text, record, index) => {
                        return this.renderColumns(text, 'remark', record, index)
                    }
                }
            ]
            if (props.openType === 2) {
                return cols
            }
            return [
                ...cols,
                {
                    fixed: 'right',
                    title: '操作',
                    dataIndex: 'action',
                    width: 140,
                    className: 'table-action table-action-action',
                    key: 'action',
                    render: (text, record, index) => {
                        return (
                        <div>
                            {
                                record.isEdit ?
                                    <span
                                        onClick={() => this.saveData(record, index)}
                                        className={`action-button`}
                                    >
                                        保存
                                    </span>
                                    :
                                    <FunctionPower power={power.EDIT_ACCOUNT}>
                                        <span
                                            onClick={() => this.editData(record, index)}
                                            className={`action-button`}
                                        >
                                            编辑
                                        </span>
                                    </FunctionPower>
                            }
                            <Popconfirm
                                title="确定要删除此项?"
                                onConfirm={() => this.onDelete(index)}
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
        return (
            <Table
                className='expense-cash-table'
                style={{backgroundColor: '#fff'}}
                key='1'
                bordered
                pagination={false}
                scroll={{x: 700, y: 260}}
                title={this.tableTitle}
                dataSource={dataSource}
                columns={columns()}
                rowKey={(record, index) => {return record.id || index}}
            />
        )
    }

}