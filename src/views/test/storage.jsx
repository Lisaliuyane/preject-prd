import React, { Component } from 'react'
import { inject, observer } from "mobx-react"
import { Table, Button, Icon, Input, Popconfirm, message, InputNumber, Select } from 'antd'
import RemoteSelect from '@src/components/select_databook'
const Option = Select.Option

@inject('mobxTabsData', 'mobxDataBook')
@inject('rApi')
@observer
export class SelectComponent extends Component {
    state = {
        costList: [], //费用单位
        unitList: [] //物料单位
    }

    constructor(props) {
        super(props)
        this.state.costList = props.costList
        this.state.unitList = props.unitList
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.costList !== this.props.costList) {
            this.setState({
                costList: nextProps.costList
            })
        }

        if(nextProps.unitList !== this.props.unitList) {
            this.setState({
                unitList: nextProps.unitList
            })
        }
    }


    render() {
        let { costList, unitList } = this.state
        let {getDataMethod, labelField, params, getChangeValue, defaultValue, type} = this.props
        return(
            <div style={{minWidth: 200}}>
                <RemoteSelect
                    defaultValue={defaultValue}
                    onChangeValue={
                        (value) => {
                            getChangeValue(value, type)
                            // this.props.filterList(value, type)
                        }
                    } 
                    mode="multiple"
                    labelField='title'
                    list={type === 1 ? costList : unitList}
                    allowClear={false}
                    // timelyFilter={true}
                />
            </div>
        )
    }
}

const EditableCell = ({ editable, value, record, onChange, type, column, arrayToValue,  costList, unitList}) => {
    if (type === 'quantity') { //数量
        //console.log('quantity', value)
        return (
            <div style={{minWidth: 200}}>
            {
                editable ?
                <SelectComponent
                    defaultValue={value} 
                    //text={column === 1 ? '费用单位' : '物料单位'}
                    getChangeValue={(value, type) => {
                        onChange(value, type)
                    }}
                    type={column === 1 ? 1 : 2}
                    costList={costList}
                    unitList={unitList}
                />
                : 
                <span title={arrayToValue(value)} className='text-overflow-ellipsis'>
                {
                    arrayToValue(value)
                }
                </span>
            }
            </div>
        )
    } else if (type === 'boardCount') { //箱数
        return (
            <div style={{minWidth: 200}}>
            {
                editable ?
                <SelectComponent 
                    defaultValue={value} 
                    getChangeValue={(value, type) => {
                        onChange(value, type)
                    }}
                    type={column === 1 ? 1 : 2}
                    costList={costList}
                    unitList={unitList}
                />
                : 
                <span title={arrayToValue(value)} className='text-overflow-ellipsis'>
                {
                    arrayToValue(value)
                }
                </span>
            }
            </div>
        )
    } else if (type === 'boxCount') { //板数
        return (
            <div style={{minWidth: 200}}>
            {
                editable ?
                <SelectComponent 
                    defaultValue={value} 
                    getChangeValue={(value, type) => {
                        onChange(value, type)
                    }}
                    type={column === 1 ? 1 : 2}
                    costList={costList}
                    unitList={unitList}
                />
                : 
                <span title={arrayToValue(value)} className='text-overflow-ellipsis'>
                {
                    arrayToValue(value)
                }
                </span>
            }
            </div>
        )
    } else if (type === 'grossWeight') { //毛重
        return (
            <div style={{minWidth: 100}}>
            {
                editable ?
                <Input 
                    disabled
                    value="kg"
                />
                : 
                <span title={'kg'} className='text-overflow-ellipsis'>
                kg
                </span>
            }
            </div>
        )
    } else if (type === 'netWeight') { //净重
        return (
            <div style={{minWidth: 100}}>
            {
                editable ?
                <Input 
                    disabled
                    value="kg"
                />
                : 
                <span title={'kg'} className='text-overflow-ellipsis'>
                {
                    'kg'
                }
                </span>
            }
            </div>
        )
    } else if (type === 'volume') { //体积
        return (
            <div style={{minWidth: 100}}>
            {
                editable ?
                <Input 
                    disabled
                    value="m³"
                />
                : 
                <span title={'m³'} className='text-overflow-ellipsis'>
                {
                    'm³'
                }
                </span>
            }
            </div>
        )
    }
}

export default class Contacts extends Component {

    state ={
        dataSource: [],
        removeId: [],
        costList: [],
        unitList: []
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        this.state.dataSource = props.data || []
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.data !== this.props.data) {
            this.setState({
                dataSource: nextProps.data
            })
        }
    }

    onAdd = () => {
        this.state.dataSource.push({
            quantity: '',
            boxCount: '',
            boardCount: '',
            grossWeight: '',
            netWeight: '',
            volume: '',
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

    handleChange = (value, type, key, column) => {
        let dataSource = this.state.dataSource
        if (key === 'quantity') {
            dataSource[column]['quantity'] = value
        } else if(key === 'boardCount') {
            dataSource[column]['boardCount'] = value 
        } else if(key === 'grossWeight') {
            dataSource[column]['grossWeight'] = value
        } else {
            dataSource[column][key] = value
        }
        this.setState({dataSource: dataSource}, () => {
            this.props.filterData(dataSource, column)
        })
    }

    arrayToValue = (value) => { //转value格式
        let str = value && value.length > 0 ? value.map(item => {
            return item.title
        }).join(',') : ''
        return str
    }

    renderColumns = (text, key, record, column) => {
        return (
            <EditableCell
                editable={record.isEdit}
                value={text}
                key={key}
                type={key}
                record={record}
                column={column}
                onChange={(value, type) => this.handleChange(value, type, key, column)}
                arrayToValue={value => this.arrayToValue(value)}
                costList={this.props.costList}
                unitList={this.props.unitList}
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
        let { dataSource } = this.state
        dataSource[index].isEdit = false
        this.setState({dataSource: dataSource})
        
    }

    editData = (record, index) => {
        let { dataSource } = this.state
        dataSource[index].isEdit = true
        this.setState({dataSource: dataSource})
    }

    render() {
        let { dataSource } = this.state
        let props = this.props
        //console.log('dataSource', dataSource)
        const columns = () => {
            let cols = [
                {
                    className: 'text-overflow-ellipsis',
                    dataIndex: 'desc',
                    key: 'desc',
                    width: 200,
                    render: (text, record, index) => {
                        return (
                            <span>{record.desc}</span>
                        )
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '数量',
                    dataIndex: 'quantity',
                    key: 'quantity',
                    width: 200,
                    render: (text, record, index) => {
                        return this.renderColumns(text, 'quantity', record, index)
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '箱数',
                    dataIndex: 'boxCount',
                    key: 'boxCount',
                    width: 200,
                    render: (text, record, index) => this.renderColumns(text, 'boxCount', record, index)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '板数',
                    dataIndex: 'boardCount',
                    key: 'boardCount',
                    width: 200,
                    render: (text, record, index) => this.renderColumns(text, 'boardCount', record, index)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '毛重',
                    dataIndex: 'grossWeight',
                    key: 'grossWeight',
                    width: 200,
                    render: (text, record, index) => this.renderColumns(text, 'grossWeight', record, index)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '净重',
                    dataIndex: 'netWeight',
                    key: 'netWeight',
                    width: 200,
                    render: (text, record, index) => this.renderColumns(text, 'netWeight', record, index)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '体积',
                    dataIndex: 'volume',
                    key: 'volume',
                    render: (text, record, index) => this.renderColumns(text, 'volume', record, index)
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
                    width: 140,
                    className: 'table-action table-action-action',
                    key: 'action',
                    render: (text, record, index) => {
                        return (
                        <div style={{width: 140}}>
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
                            {/* <Popconfirm
                                title="确定要删除此项?"
                                onConfirm={() => this.onDelete(index)}
                                okText="确定"
                                cancelText="取消">
                                <span
                                    className={`action-button`}
                                >
                                    删除
                                </span>
                            </Popconfirm> */}
                        </div>
                        )
                    }
                }
            ]
        }
        const title = () => {
            return (
                <div className="flex flex-vertical-center">
                    <div style={{ marginLeft: '5px', color: '#1DA57A' }}>
                        { '单位配置'}
                    </div>
                    <div className="flex1" style={{ textAlign: 'right', marginRight: 10 }}>
                        <Button 
                            icon='rocket' 
                            onClick={props.saveSubmit}
                            loading={props.buttonLoading}
                        >
                            提交 
                        </Button>
                    </div>
                    {/* {
                        props.type === 2 || props.reviewStatus === 2 || props.reviewStatus === 4 ? 
                        null 
                        :
                        <div className="flex1" style={{ textAlign: 'right', marginRight: 10 }}>
                            <Button onClick={this.onAdd}>
                                <Icon type="plus" />新建
                            </Button>
                        </div>
                    } */}
                </div>
            )
        }
        return (
            <Table
                key='1'
                bordered
                pagination={false}
                scroll={{x: true}}
                title={title}
                dataSource={dataSource}
                columns={columns()}
                rowKey={(record, index) => {return record.id || index}}
            />
        )
    }

}