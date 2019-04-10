import React, { Component } from 'react'
import { inject, observer } from "mobx-react"
import { Table, Button, Icon, Input, Popconfirm, message, InputNumber, Select } from 'antd'
import RemoteSelect from '@src/components/select_databook'
import PropTypes from 'prop-types'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
const Option = Select.Option

@inject('mobxTabsData', 'mobxDataBook')
@inject('rApi')
@observer
export class SelectComponent extends Component {
    state = {
        costList: [], //费用单位
        unitList: [], //物料单位
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

const EditableCell = ({ editable, value, record, onChange, type, column, arrayToValue,  costList, unitList, otherList}) => {
    if (type === 'quantity') { //数量
       // console.log('quantity', value)
        return (
            <div style={{minWidth: 200}}>
            {
                editable ?
                <SelectComponent
                    defaultValue={(value && value[0] && value[0].id) ? value : null} 
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
                    defaultValue={(value && value[0] && value[0].id) ? value : null} 
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
                    defaultValue={(value && value[0] && value[0].id) ? value : null} 
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
        //console.log('grossWeight', value)
        return (
            <div style={{minWidth: 100}}>
            {
                editable ?
                <RemoteSelect
                    defaultValue={(value && value[0]) ? {id: value[0].id, title: value[0].title} : null} 
                    allowClear={false}
                    onChangeValue={value => {
                        onChange(value, type)
                    }}
                    text='计重单位'
                />
                : 
                <span title={value && value[0] && value.title} className='text-overflow-ellipsis'>
                    {
                       value && value[0] && value[0].title
                    }
                </span>
            }
            </div>
        )
    } 
    // else if (type === 'netWeight') { //净重
    //     return (
    //         <div style={{minWidth: 100}}>
    //         {
    //             editable ?
    //             <RemoteSelect
    //                 defaultValue={value[0] ? {id: value[0].id, title: value[0].title} : null} 
    //                 onChangeValue={value => {
    //                     onChange(value, type)
    //                 }}
    //                 text='计重单位'
    //             />
    //             : 
    //             <span title={value && value[0] && value.title} className='text-overflow-ellipsis'>
    //             {
    //                 value && value[0] && value.title
    //             }
    //             </span>
    //         }
    //         </div>
    //     )
    // } 
    else if (type === 'volume') { //体积
        return (
            <div style={{minWidth: 100}}>
            {
                editable ?
                <RemoteSelect
                    defaultValue={(value && value[0]) ? {id: value[0].id, title: value[0].title} : null} 
                    allowClear={false}
                    onChangeValue={value => {
                        onChange(value, type)
                    }}
                    text='计体单位'
                />
                : 
                <span title={value && value[0] && value.title} className='text-overflow-ellipsis'>
                {
                    value && value[0] && value[0].title
                }
                </span>
            }
            </div>
        )
    } else if (type === 'other') { //其他
        return(
            <div style={{minWidth: 200}}>
                {
                    editable ?
                    <RemoteSelect
                        defaultValue={(value && value[0] && value[0].id) ? value : null} 
                        onChangeValue={
                            (value) => {
                                onChange(value, type)
                                // this.props.filterList(value, type)
                            }
                        } 
                        mode="multiple"
                        labelField='title'
                        list={otherList}
                        allowClear={false}
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
    }
}

export default class Contacts extends Component {

    static propTypes = {
        data: PropTypes.array, //初始化数据
        costList: PropTypes.array, //未被选中费用单位
        unitList: PropTypes.array, //未被选中物料单位
        buttonLoading: PropTypes.bool,
        filterData: PropTypes.func, //过滤点被选中的值
        saveSubmit: PropTypes.func //提交操作
    }
    
    state ={
        dataSource: [],
        removeId: [],
        costList: [],
        unitList: [],
        otherList: []
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
            other: '',
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
            dataSource[column]['grossWeight'] = [value]
        } else if(key === 'volume') {
            dataSource[column]['volume'] = [value]
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
                otherList={this.props.otherList}
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
        let { power } = props
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
                    title: '计量单位',
                    dataIndex: 'unit',
                    key: 'unit',
                    //width: 300,
                    children: [
                        {
                            className: 'text-overflow-ellipsis split-table-style',
                            title: '数量',
                            dataIndex: 'quantity',
                            key: 'quantity',
                            width: 250,
                            render: (text, record, index) => {
                                return this.renderColumns(text, 'quantity', record, index)
                            }
                        }, 
                        {
                            className: 'text-overflow-ellipsis split-table-style',
                            title: '箱数',
                            dataIndex: 'boxCount',
                            key: 'boxCount',
                            width: 250,
                            render: (text, record, index) => this.renderColumns(text, 'boxCount', record, index)
                        },
                        {
                            className: 'text-overflow-ellipsis split-table-style',
                            title: '板数',
                            dataIndex: 'boardCount',
                            key: 'boardCount',
                            width: 250,
                            render: (text, record, index) => this.renderColumns(text, 'boardCount', record, index)
                        }
                    ]
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '',
                    dataIndex: 'g',
                    key: 'g',
                    children: [
                        {
                            className: 'text-overflow-ellipsis split-table-style',
                            title: '重量',
                            dataIndex: 'grossWeight',
                            key: 'grossWeight',
                            width: 100,
                            render: (text, record, index) => this.renderColumns(text, 'grossWeight', record, index)
                        }, 
                        // {
                        //     className: 'text-overflow-ellipsis',
                        //     title: '净重',
                        //     dataIndex: 'netWeight',
                        //     key: 'netWeight',
                        //     width: 200,
                        //     render: (text, record, index) => this.renderColumns(text, 'netWeight', record, index)
                        // },
                        {
                            className: 'text-overflow-ellipsis split-table-style',
                            title: '体积',
                            width: 100,
                            dataIndex: 'volume',
                            key: 'volume',
                            render: (text, record, index) => this.renderColumns(text, 'volume', record, index)
                        },
                        {
                            className: 'text-overflow-ellipsis split-table-style',
                            title: '其他',
                            dataIndex: 'other',
                            key: 'other',
                            render: (text, record, index) => this.renderColumns(text, 'other', record, index)
                        }
                    ]
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
                    width: 80,
                    className: 'table-action table-action-action',
                    key: 'action',
                    render: (text, record, index) => {
                        return (
                        <div style={{width: 80}}>
                            {
                                record.isEdit ? 
                                <span
                                    onClick={() => this.saveData(record, index)}
                                    className={`action-button`}
                                >
                                    保存
                                </span>
                                :
                                <FunctionPower power={power.EDIT_DATA}>
                                    <span
                                        onClick={() => this.editData(record, index)}
                                        className={`action-button`}
                                    >
                                        编辑
                                    </span>
                                </FunctionPower>
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
                    <div>
                        { this.props.title || '运输单位配置'}
                    </div>
                    <div className="flex1" style={{ textAlign: 'right'}}>
                        <FunctionPower power={power.ADD_DATA}>
                            <Button 
                                // icon='rocket' 
                                onClick={props.saveSubmit}
                                loading={props.buttonLoading}
                                style={{border: 0, color: '#fff', background: '#18B583'}}
                            >
                                提交 
                            </Button>
                        </FunctionPower>
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
        // console.log('otherList', this.props.otherList)
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