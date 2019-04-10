import React, { Component } from 'react';
import { Table, Button, Icon, Input, Popconfirm, message, InputNumber, Select } from 'antd';
import RemoteSelect from '@src/components/select_databook'
import { objDeepCopy } from '@src/utils'
import './index.less'
const Option = Select.Option

const EditableCell = ({ editable, value, record, onChange, type }) => {
   // console.log('EditableCell', value)
    if (type === 'expenseName') { //费用项
        return (
            <div>
            {
                editable ?
                <div style={{minWidth: 110}}>
                    <RemoteSelect
                        defaultValue={record ? {id: record.expenseId, expenseName: record.expenseName} : null}
                        // getPopupContainer={() => {
                        //     if(this.popupDom) {
                        //         return this.popupDom.querySelector('.ant-table-body table')
                        //     }return document.querySelector('.ant-table-content')
                        // }}
                        allowClear={false}
                        onChangeValue={
                            value => {
                                onChange(value)
                            }
                        } 
                        labelField='expenseName'
                        //text="费用类型"
                        getDataMethod={'getCostItems'}
                        params={{limit: 999999, offset: 0, expenseType:'仓储费用'}}

                    />
                </div>
                : 
                <span title={value} className='text-overflow-ellipsis'>
                {
                    value
                }
                </span>
            }
            </div>
        )
    } else if (type === 'costUnitName') { //费用单位
        return (
            <div style={{minWidth: 80}}>
            {
                editable ?
                <RemoteSelect
                    defaultValue={record ? {id: record.costUnitId, title: record.costUnitName} : null}
                    //placeholder={''}
                    onChangeValue={
                        value => {
                            onChange(value)
                        }
                    } 
                    labelField='title'
                    text="费用单位"
                />
                : 
                <span title={value} className='text-overflow-ellipsis'>
                {
                    value
                }
                </span>
            }
            </div>
        )
    } else if (type === 'partName') { //料号
        return (
            <div style={{minWidth: 160}}>
            {
                editable ?
                <RemoteSelect
                    defaultValue={record ? {id: record.partId, materialItemNumber: record.partName} : null}
                    //placeholder={''}
                    onChangeValue={
                        value => {
                            onChange(value)
                            //console.log('onChangeValue', value)
                        }
                    } 
                    getDataMethod={'getMaterials'}
                    params={{limit: 999999, offset: 0}}
                    labelField={'materialItemNumber'}
                />
                : 
                <span title={value} className='text-overflow-ellipsis'>
                {
                    value
                }
                </span>
            }
            </div>
        )
    }else if(type === 'unitPrice' || type === 'multiple' || type === 'lowestFee') {
        return (
            <div>
            {
                editable ?
                <InputNumber 
                    min={1}
                    style={{ margin: '-5px 0', width: 80, borderRadius: 0 }} 
                    value={value} 
                    title={value} 
                    onChange={value => onChange(value)} />
                : 
                <span title={value} className='text-overflow-ellipsis'>
                {
                    value
                }
                </span>
            }
            </div>
        )
    } else if(type === 'isMonthlyCharges') {
        return (
            <div>
            {
                editable ?
                <Select 
                    defaultValue={value === 1 ? '是' : value === 0 ? '否' : value === -1 ? '' : null} 
                    style={{ width: 120 }} 
                    onChange={ value => onChange(value)}
                    allowClear
                    >
                    <Option value="0">否</Option>
                    <Option value="1">是</Option>
                </Select>
                : 
                <span title={value} className='text-overflow-ellipsis'>
                {
                    value === 1 ? '是' : value === 0 ? '否' : '无'
                }
                </span>
            }
            </div>
            
        )
    }
    return (
        <div>
        {
            editable ?
            <Input 
                style={{ margin: '-5px 0', minWidth: 200 }} 
                value={value} 
                title={value} 
                onChange={e => onChange(e.target.value)} />
            : 
            <span title={value} className='text-overflow-ellipsis'>
            {
                value
            }
            </span>
        }
        </div>
    )
}

export default class Contacts extends Component {

    state ={
        dataSource: [],
        backupData: [],
        removeId: []
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        this.state.dataSource = props.data || []
        this.state.backupData = objDeepCopy(props.data)
    }

    onAdd = () => {
        this.state.dataSource.push({
            expenseId: '',
            expenseName: '',
            unitPrice: '',
            costUnitId: '',
            costUnitName: '',
            multiple: '',
            lowestFee: '',
            partId: '',
            partName: '',
            isMonthlyCharges: '',
            remark: '',
            isEdit: true
        })
        this.state.backupData.push({
            expenseId: '',
            expenseName: '',
            unitPrice: '',
            costUnitId: '',
            costUnitName: '',
            multiple: '',
            lowestFee: '',
            partId: '',
            partName: '',
            isMonthlyCharges: '',
            remark: '',
            isEdit: true
        })
        this.setState({
            dataSource: this.state.dataSource,
            backupData: this.state.backupData
        })
    }

    onDelete = (index) => { //删除
        //this.state.dataSource.removeId.push(this.state.dataSource[index].id)
        let target = this.state.dataSource[index]
        if (target.id) {
            let { removeId } = this.state
            removeId.push(target.id)
            this.setState({removeId: removeId})
        }
        this.state.dataSource.splice(index, 1)
        this.setState({
            dataSource: this.state.dataSource,
            backupData: this.state.dataSource
        })
    }

    handleChange = (value, key, column) => {
        let dataSource = this.state.dataSource
        if (key === 'expenseName') {
            dataSource[column]['expenseName'] = value ? value.name || value.expenseName : ''
            dataSource[column]['expenseId'] = value ? value.id : ''
        } else if(key === 'costUnitName') {
            dataSource[column]['costUnitName'] = value ? value.title || value.label : ''
            dataSource[column]['costUnitId'] = value ? value.id : ''
        } else if(key === 'partName') {
            dataSource[column]['partName'] = value ? value.title || value.label || value.materialItemNumber : ''
            dataSource[column]['partId'] = value ? value.id : ''
        } else if(key === 'isMonthlyCharges') {
            //console.log('isMonthlyCharges', parseInt(value))
            dataSource[column]['isMonthlyCharges'] = value ? parseInt(value, 10) : -1
        } else {
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
        let obj = (this.state.dataSource && this.state.dataSource.length > 0) ? this.state.dataSource.map(item => {
            return {
                ...item,
                isEdit: false
            }
        }) : []
        return {
            removeId: this.state.removeId,
            data: obj
        }
    }

    saveData = (record, index) => {
        if(record.expenseName) {
            let { dataSource } = this.state
            dataSource[index].isEdit = false
            this.setState({
                dataSource: dataSource,
                backupData: objDeepCopy(dataSource)
            })
        } else{
            message.error('费用项不能为空！')
        }
        
    }

    editData = (record, index) => {
        let { dataSource } = this.state
        dataSource[index].isEdit = true
        this.setState({dataSource: dataSource})
    }

    cancelData = (record, index) => { //取消操作
        let { dataSource, backupData } = this.state
        dataSource = objDeepCopy(backupData)
        if(record.expenseName) {
            dataSource[index].isEdit = false
            //console.log('record.expenseName', record.expenseName)
        } else {
            dataSource.splice(index, 1)
            backupData.splice(index, 1)

        }
        this.setState({
            dataSource: dataSource,
            backupData: backupData
        })
    }

    render() {
        let { dataSource, backupData } = this.state
        let props = this.props
       // console.log('dataSource', dataSource, backupData)
        const columns = () => {
            let cols = [
                {
                    className: 'text-overflow-ellipsis',
                    title: '费用项',
                    dataIndex: 'expenseName',
                    key: 'expenseName',
                    width: 150,
                    render: (text, record, index) => {
                        return this.renderColumns(text, 'expenseName', record, index)
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '单价',
                    dataIndex: 'unitPrice',
                    key: 'unitPrice',
                    width: 150,
                    render: (text, record, index) => this.renderColumns(text, 'unitPrice', record, index)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '费用单位',
                    dataIndex: 'costUnitName',
                    key: 'costUnitName',
                    width: 150,
                    render: (text, record, index) => this.renderColumns(text, 'costUnitName', record, index)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '料号',
                    dataIndex: 'partName',
                    key: 'partName',
                    width: 200,
                    render: (text, record, index) => this.renderColumns(text, 'partName', record, index)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '倍数',
                    dataIndex: 'multiple',
                    key: 'multiple',
                    width: 150,
                    render: (text, record, index) => this.renderColumns(text, 'multiple', record, index)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '最低收费',
                    dataIndex: 'lowestFee',
                    key: 'lowestFee',
                    width: 150,
                    render: (text, record, index) => this.renderColumns(text, 'lowestFee', record, index)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '是否按月收费',
                    dataIndex: 'isMonthlyCharges',
                    key: 'isMonthlyCharges',
                    width: 150,
                    render: (text, record, index) => this.renderColumns(text, 'isMonthlyCharges', record, index)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    render: (text, record, index) => this.renderColumns(text, 'remark', record, index)
                }
            ]
            if (props.type === 2 || props.reviewStatus === 2 || props.reviewStatus === 4) {
                return cols
            }
            return [
                ...cols,
                {
                    fixed: 'right',
                    title: '操作',
                    dataIndex: 'action',
                    width: 120,
                    className: 'table-action table-action-action',
                    key: 'action',
                    render: (text, record, index) => {
                        return (
                        <div style={{width: 90}}>
                            {
                                record.isEdit ? 
                                [
                                    <span
                                        onClick={() => this.saveData(record, index)}
                                        className={`action-button`}
                                        key="save"
                                    >
                                        保存
                                    </span>,
                                    <Popconfirm
                                        title="确定要删除此项?"
                                        onConfirm={() => this.onDelete(index)}
                                        okText="确定"
                                        cancelText="取消"
                                        key="delete"
                                    >
                                        <span
                                            className={`action-button`}
                                        >
                                            删除
                                        </span>
                                    </Popconfirm>
                                    // <span
                                    //     onClick={() => this.cancelData(record, index)}
                                    //     className={`action-button`}
                                    //     key="cancel"
                                    // >
                                    //     取消
                                    // </span>
                                ]
                                :
                                [
                                    <span
                                        onClick={() => this.editData(record, index)}
                                        className={`action-button`}
                                        key="edit"
                                    >
                                        编辑
                                    </span>,
                                    <Popconfirm
                                        title="确定要删除此项?"
                                        onConfirm={() => this.onDelete(index)}
                                        okText="确定"
                                        cancelText="取消"
                                        key="delete"
                                    >
                                        <span
                                            className={`action-button`}
                                        >
                                            删除
                                        </span>
                                    </Popconfirm>
                                ]
                            }
                        </div>
                        )
                    }
                }
            ]
        }
        const title = () => {
            return (
                <div className="flex flex-vertical-center">
                    <div style={{color: '#484848', fontSize: '14px'}}>
                        { '仓储报价'}
                    </div>
                    {
                        props.type === 2 || props.reviewStatus === 2 || props.reviewStatus === 4 ? 
                        null 
                        :
                        <div className="flex1" style={{ textAlign: 'right'}}>
                            <Button onClick={this.onAdd}>
                                新建
                            </Button>
                        </div>
                    }
                </div>
            )
        }
        return (
            <Table
               // key='1'
                pagination={false}
                scroll={{x: 1500, y:270}}
                title={title}
                dataSource={dataSource}
                columns={columns()}
               // rowKey={(record, index) => {return record.id || index}}
            />
        )
    }

}