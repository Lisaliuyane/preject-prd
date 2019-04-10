import React, { Component } from 'react';
import { Button, Form, Icon, Input, Popconfirm, message } from 'antd';
import { Table, Parent, CellBox } from '@src/components/table_template'
import FormItem from '@src/components/FormItem'
import { validateToNextPhone, validateToNextQQ } from '@src/utils'
import { Promise } from 'es6-promise';
import { children, id } from './power'
const power = Object.assign({}, children, id)
// import { columnsAddNumber } from "@src/components/table_plugin"

// const EditableCell = ({ editable, value, onChange, vlaueKey, getFieldDecorator, record, column }) => (
//     <div>
//       {editable
//         ? <Input style={{ margin: '-5px 0' }} value={value} title={value} onChange={e => onChange(e.target.value)} />
//         : <span title={value}  className='text-overflow-ellipsis'>{value}</span>
//       }
//     </div>
//   );
const EditableCell = ({ editable, value, onChange, vlaueKey, getFieldDecorator, record, column }) => {
    let minWidthValue = 80

    if(vlaueKey === 'phone' || vlaueKey === 'qq'){
        minWidthValue = 120
    }else if(vlaueKey === 'email') {
        minWidthValue = 140
    }else if(vlaueKey === 'remark') {
        minWidthValue = 200
    }
    let bindText = vlaueKey + column
    //console.log('bindText', bindText)
    if(vlaueKey === 'name') {
        return (
            <div>
                {
                    editable ? 
                    <FormItem isNonePopWindow>
                        {
                            getFieldDecorator(bindText, {
                                initialValue: value,
                                rules: [
                                    {
                                        required: true, 
                                        message: '姓名不能为空!'
                                    }
                                ],
                            })(
                                <Input 
                                    style={{ minWidth: minWidthValue }} 
                                    //value={value} 
                                    title={value} 
                                    onChange={e => onChange(e.target.value)} 
                                />
                            )
                        }
                    </FormItem>
                    : 
                    <span title={value}  className='text-overflow-ellipsis'>{value}</span>
                }
            </div>
        )
    } else if(vlaueKey === 'phone') {
        return (
            <div>
                {
                    editable ? 
                    <FormItem isNonePopWindow>
                        {
                            getFieldDecorator(bindText, {
                                initialValue: value,
                                rules: [
                                    {
                                        validator: validateToNextPhone
                                    }
                                ],
                            })(
                                <Input 
                                    style={{ minWidth: minWidthValue }} 
                                    //value={value} 
                                    title={value} 
                                    onChange={e => onChange(e.target.value)} 
                                />
                            )
                        }
                    </FormItem>
                    : 
                    <span title={value}  className='text-overflow-ellipsis'>{value}</span>
                }
            </div>
        )
    } else if(vlaueKey === 'email') {
        return(
            <div>
                {
                    editable ? 
                    <FormItem isNonePopWindow>
                        {
                            getFieldDecorator(bindText, {
                                initialValue: value,
                                rules: [
                                    {
                                        type: 'email',
                                        message: '邮箱格式错误'
                                    }
                                ],
                            })(
                                <Input 
                                    style={{ minWidth: minWidthValue }} 
                                    //value={value} 
                                    title={value} 
                                    onChange={e => onChange(e.target.value)} 
                                />
                            )
                        }
                    </FormItem>
                    : 
                    <div title={value}>{value}</div>
                }
            </div>  
        )
    } else if(vlaueKey === 'qq') {
        return(
            <div>
                {
                    editable ? 
                    <FormItem isNonePopWindow>
                        {
                            getFieldDecorator(bindText, {
                                initialValue: value,
                                rules: [
                                    {
                                        validator: validateToNextQQ
                                    }
                                ],
                            })(
                                <Input 
                                    style={{ minWidth: minWidthValue }} 
                                    //value={value} 
                                    title={value} 
                                    onChange={e => onChange(e.target.value)} 
                                />
                            )
                        }
                    </FormItem>
                    : 
                    <span title={value}>{value}</span>
                }
            </div>  
        )
    }
    return (
        <div>
            {editable
                ? <Input style={{ minWidth: minWidthValue }} value={value} title={value} onChange={e => onChange(e.target.value)} />
                : <div title={value} >{value}</div>
            }
        </div>
    )
}


class Contacts extends Parent {

    state ={
        dataSource: []
    }

    constructor(props) {
        super(props)
        this.state.dataSource = props.data || []
        if (props.getThis) {
            props.getThis(this)
        }
        const { getFieldDecorator } = props.form
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                width: 140,
                render: (text, record, index) => this.renderColumns(text, 'name', record, index, getFieldDecorator)
            },
            {
                className: 'text-overflow-ellipsis',
                title: '职位',
                dataIndex: 'position',
                key: 'position',
                width: 140,
                render: (text, record, index) => this.renderColumns(text, 'position', record, index, getFieldDecorator)
            },
            {
                className: 'text-overflow-ellipsis',
                title: '电话',
                dataIndex: 'phone',
                key: 'phone',
                width: 150,
                render: (text, record, index) => this.renderColumns(text, 'phone', record, index, getFieldDecorator)
            },
            {
                className: 'text-overflow-ellipsis',
                title: '邮箱',
                dataIndex: 'email',
                key: 'email',
                width: 165,
                render: (text, record, index) => this.renderColumns(text, 'email', record, index, getFieldDecorator)
            },
            {
                className: 'text-overflow-ellipsis',
                title: 'QQ',
                dataIndex: 'qq',
                key: 'qq',
                width: 150,
                render: (text, record, index) => this.renderColumns(text, 'qq', record, index, getFieldDecorator)
            },
            {
                className: 'text-overflow-ellipsis',
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                render: (text, record, index) => this.renderColumns(text, 'remark', record, index, getFieldDecorator)
            }
        ]
    }

    onAdd = () => {
        this.state.dataSource.push({
            name: '',
            position: '',
            email: '',
            phone: '',
            qq: '',
            isEdit: true,
            remark: ''
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

    renderColumns = (text, key, record, column, getFieldDecorator) => {
        return (
            <CellBox isFormChild>
                <EditableCell
                    editable={record.isEdit}
                    getFieldDecorator={getFieldDecorator}
                    key={key}
                    vlaueKey={key}
                    value={text}
                    record={record}
                    column={column}
                    onChange={value => this.handleChange(value, key, column)}
                />
            </CellBox>
        );
    }

    /**校验**/
    

    logData = () => {
        let obj = (this.state.dataSource && this.state.dataSource.length > 0) ? this.state.dataSource.map(item => {
            return {
                ...item,
                isEdit: false
            }
        }) : []
        return obj
    }

    saveData = (record, index) => {
        this.props.form.validateFields([`name${index}`, `phone${index}`, `email${index}`, `qq${index}`], (err, values) => {
            if (!err) {
                //console.log('Received values of form: ', values);
                let { dataSource } = this.state
                dataSource[index].isEdit = false
                this.setState({dataSource: dataSource})
            } else {
                if(err[`name${index}`]) {
                    message.error(err[`name${index}`].errors[0].message)
                    return
                } else if(err[`phone${index}`]) {
                    message.error(err[`phone${index}`].errors[0].message)
                    return
                } else if(err[`email${index}`]) {
                    message.error(err[`email${index}`].errors[0].message)
                    return
                } else if(err[`qq${index}`]) {
                    message.error(err[`qq${index}`].errors[0].message)
                    return
                }
            }
        })
       
        
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
        let { dataSource } = this.state
        let props = this.props
        // const title = () => {
        //     return (
        //         <div className="flex flex-vertical-center">
        //             <div style={{ color: '#484848', fontSize: '14px' }}>
        //                 { '客户联系人'}
        //             </div>
        //             {
        //                 props.type === 2 ? 
        //                 null 
        //                 :
        //                 <div className="flex1" style={{ textAlign: 'right' }}>
        //                     <Button onClick={this.onAdd}>
        //                         <Icon type="plus" />新建
        //                     </Button>
        //                 </div>
        //             }
        //         </div>
        //     )
        // }
        return (
            <Table
                key='1'
                bordered
                style={{position: 'relative'}}
                parent={this}
                pagination={false}
                power={power}
                //scroll={{x: 1200, y: 190}}
                isNoneSelected
                isNoneNum
                noPadding
                tableHeight={200}
                isHideHeaderButton
                TableHeaderTitle='客户联系人'
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
export default Form.create()(Contacts) 