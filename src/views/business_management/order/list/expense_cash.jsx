import React, { Component } from 'react';
import { Table, Icon, Popconfirm, message, InputNumber } from 'antd'
import { ColumnItemBox } from '@src/components/table_template'
import RemoteSelect from '@src/components/select_databook'

const EditableCell = ({ editable, value, record, onChange, type }) => {
   // console.log('EditableCell', value)
    if (type === 'expenseName') { //费用项
        if (editable) {
            return (
                <ColumnItemBox style={{marginTop: -2}}>
                    <RemoteSelect
                        defaultValue={record ? {id: record.expenseId, expenseName: record.expenseName} : null}
                        onChangeValue={
                            value => {
                                onChange(value)
                            }
                        } 
                        labelField='expenseName'
                        size="small"
                        //getData={getExpenseItemData}
                        getDataMethod="getCostItems"
                        params={{limit: 999999, offset: 0, billingMethodId: 154}}
                    />
                </ColumnItemBox>
            )
        } else {
            return(
                <ColumnItemBox name={value}/>
            )
        }
    }
    if (editable) {
        return (
            <ColumnItemBox style={{marginTop: -2}}>
                <InputNumber 
                    style={{ width: '100%', maxWidth: 220 }} 
                    min={0}
                    size="small"
                    value={value} 
                    title={value} 
                    onChange={value => onChange(value)} 
                /> 
            </ColumnItemBox>
        )
    } else {
        return(
            <ColumnItemBox name={value}/>
        )
    }
}

export default class Contacts extends Component {

    state ={
        dataSource: [],
        removeId: []
    }

    constructor(props) {
        super(props)
        this.state.dataSource = props.data || []
        if (props.getThis) {
            props.getThis(this)
        }
    }

    onAdd = () => {
        this.state.dataSource.push({
            expenseId: '',
            expenseName: '',
            expenseValue: '',
            sendCarId: '',
            isEdit: true
        })
        this.setState({dataSource: this.state.dataSource})
    }

    onDelete = (index) => {
        //this.state.dataSource.removeId.push(this.state.dataSource[index].id)
        let target = this.state.dataSource[index]
        if (target.id) {
            let { removeId } = this.state
            removeId.push(target.id)
            this.setState({removeId: removeId})
        }
        this.state.dataSource.splice(index, 1)
        this.setState({dataSource: this.state.dataSource})
    }

    handleChange = (value, key, column) => {
        let dataSource = this.state.dataSource
        //console.log('handleChange', dataSource)
        if (key === 'expenseName') {
            dataSource[column]['expenseName'] = value ? value.title || value.expenseName : ''
            dataSource[column]['expenseId'] = value ? value.id : ''
        }  else {
            dataSource[column][key] = value
        }
        this.setState({dataSource: dataSource})
    }

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

    logData = () => {
        // console.log('Contacts', this.state.dataSource)
        return {
            removeId: this.state.removeId,
            data: this.state.dataSource.filter(ele => !ele.isEdit)
        }
    }

    saveData = (record, index) => {
        //console.log('record', record, index)
        if(record.expenseName) {
            let { dataSource } = this.state
            dataSource[index].isEdit = false
            this.setState({dataSource: dataSource})
        } else{
            message.error('费用项不能为空！')
        }
        
    }

    editData = (record, index) => {
        let { dataSource } = this.state
        dataSource[index].isEdit = true
        this.setState({dataSource: dataSource})
    }

    render() {
        let { dataSource } = this.state
        let props = this.props
        const { openType } = this.props
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
                    dataIndex: 'expenseValue',
                    key: 'expenseValue',
                    render: (text, record, index) => {
                        return this.renderColumns(text, 'expenseValue', record, index)
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
                    width: 108,
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
                                <span
                                    onClick={() => this.editData(record, index)}
                                    className={`action-button`}
                                >
                                    编辑
                                </span>
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
            <div className='itb-expense-cash'>
                <div className="flex" style={{height: 32}}>
                    {
                        openType !== 2 &&
                        <div>
                            <span style={{ color: '#18b583', cursor: 'pointer' }} onClick={this.onAdd}>
                                <Icon type="plus" />添加费用项
                            </span>
                        </div>
                    }
                </div>
                <Table
                    key='itb-expense-cash'
                    bordered
                    pagination={false}
                    scroll={{ x: 810, y: 260 }}
                    title={null}
                    dataSource={dataSource}
                    columns={columns()}
                    rowKey={(record, index) => { return record.id || index }}
                />
            </div>
        )
    }

}