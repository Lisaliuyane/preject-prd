import React, { Component } from 'react'
import { Table, Parent, CellBox } from '@src/components/table_template'
import { Button, Icon, Input, Popconfirm, message } from 'antd'
import { children, id } from './power'
const power = Object.assign({}, children, id)
// import { columnsAddNumber } from "@src/components/table_plugin"

const EditableCell = ({ editable, value, onChange, type }) => {
    if (type === 'name') {
        return (
            <div>
                {editable
                    ? <Input value={value} title={value} onChange={e => onChange(e.target.value)} />
                    : <div title={value} className='text-overflow-ellipsis'>{value}</div>
                }
            </div>
        )
    } else if(type === 'addr') {
        return(
            <div>
                {editable
                    ? <Input value={value} title={value} onChange={e => onChange(e.target.value)} />
                    : <div title={value} className='text-overflow-ellipsis'>{value}</div>
                }
            </div>
        )
    } else if(type === 'dutyParagraph') {
        return(
            <div>
                {editable
                    ? <Input value={value} title={value} onChange={e => onChange(e.target.value)} />
                    : <div title={value} className='text-overflow-ellipsis'>{value}</div>
                }
            </div>
        )
    }
    return(
        <div>
            {editable
                ? <Input value={value} title={value} onChange={e => onChange(e.target.value)} />
                : <div title={value} className='text-overflow-ellipsis'>{value}</div>
            }
        </div>
    )
}

export default class Contacts extends Component {

    state ={
        dataSource: []
    }

    constructor(props) {
        super(props)
        this.state.dataSource = props.data || []
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                width: 200,
                title: '法人名称',
                dataIndex: 'name',
                key: 'name',
                render: (text, record, index) => this.renderColumns(text, 'name', record, index)
            },
            {
                className: 'text-overflow-ellipsis',
                width: 300,
                title: '法人地址',
                dataIndex: 'addr',
                key: 'addr',
                render: (text, record, index) => this.renderColumns(text, 'addr', record, index)
            },
            {
                className: 'text-overflow-ellipsis',
                width: 140,
                title: '税号',
                dataIndex: 'dutyParagraph',
                key: 'dutyParagraph',
                render: (text, record, index) => this.renderColumns(text, 'dutyParagraph', record, index)
            },
            {
                className: 'text-overflow-ellipsis',
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                render: (text, record, index) => this.renderColumns(text, 'remark', record, index)
            }
        ]
    }

    onAdd = () => {
        this.state.dataSource.push({
            name: '',
            addr: '',
            dutyParagraph: '',
            remark: '',
            isEdit: true
        })
        this.setState({dataSource: this.state.dataSource})
    }

    onDelete = (index) => {
        this.state.dataSource.splice(index, 1)
        this.setState({dataSource: this.state.dataSource})
    }

    handleChange = (value, key, column) => {
        let dataSource = this.state.dataSource
        dataSource[column][key] = value
        this.setState({dataSource: dataSource})
    }

    renderColumns = (text, key, record, column) => {
        return (
            <CellBox isFormChild>
                <EditableCell
                    editable={record.isEdit}
                    value={text}
                    key={key}
                    type={key}
                    onChange={value => this.handleChange(value, key, column)}
                />
            </CellBox>
        );
    }

    logData = () => {
        // console.log('Contacts', this.state.dataSource)
        //return this.state.dataSource.filter(ele => !ele.isEdit)
        let obj = (this.state.dataSource && this.state.dataSource.length > 0) ? this.state.dataSource.map(item => {
            return {
                ...item,
                isEdit: false
            }
        }) : []
        return obj
    }

    saveData = (record, index) => {
        if(record.name) {
            let { dataSource } = this.state
            dataSource[index].isEdit = false
            this.setState({dataSource: dataSource})
        } else{
            message.error('法人名字不能为空！')
        }
        
    }

    editData = (record, index) => {
        let { dataSource } = this.state
        dataSource[index].isEdit = true
        this.setState({dataSource: dataSource})
    }

    getData = () => {
        let { dataSource } = this.state
        return new Promise((resolve, reject) => {
            resolve({
                dataSource: dataSource
            })
        })
    }

    tableActionView = ({text, record, index, onDeleteItem, onEditItem, DeleteButton}) => {
        return(
            <div style={{width: 100}}>
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

    render() {
        return (
            <Table
                key='1'
                bordered
                style={{position: 'relative'}}
                parent={this}
                pagination={false}
                power={power}
                isNoneSelected
                isNoneNum
                noPadding
                tableHeight={200}
                isHideHeaderButton
                TableHeaderTitle='客户法人'
                isRequired
                TableHeaderStyle={{color: '#484848', fontSize: '14px' }}
                getData={this.getData}
                actionWidth={100}
                columns={this.state.columns}
                rowKey={(record, index) => {return record.id || index}}
                actionView={this.tableActionView}
                TableHeaderChildren={
                    <Button onClick={this.onAdd}>
                        <Icon type="plus" />新建
                    </Button>
                }
            />
        )
    }

}