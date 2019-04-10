import React, { Component } from 'react'
import { Table, Button, Icon, Form, Input, Popconfirm, message } from 'antd'
import { inject } from "mobx-react"
import FormItem from '@src/components/FormItem'
import { validateToNextPhone, validateToNextQQ } from '@src/utils'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import UploadExcel from '@src/components/upload_excel'
import './contacts.less'
// import { columnsAddNumber } from "@src/components/table_plugin"

const EditableCell = ({ editable, value, onChange, vlaueKey, getFieldDecorator, record, column }) => {
    let minWidthValue = 99

    if(vlaueKey === 'phone' || vlaueKey === 'qq'){
        minWidthValue = 119
    }else if(vlaueKey === 'mail') {
        minWidthValue = 119
    }else if(vlaueKey === 'remark') {
        minWidthValue = 200
    }
    let bindText = vlaueKey + column
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
                                    style={{ margin: '-5px 0', minWidth: minWidthValue }} 
                                    //value={value} 
                                    title={value} 
                                    onChange={e => onChange(e.target.value)} 
                                />
                            )
                        }
                    </FormItem>
                    : 
                    <div title={value}  className='text-overflow-ellipsis' style={{width: 99}}>{value}</div>
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
                                    style={{ margin: '-5px 0', minWidth: minWidthValue }} 
                                    //value={value} 
                                    title={value} 
                                    onChange={e => onChange(e.target.value)} 
                                />
                            )
                        }
                    </FormItem>
                    : 
                    <div title={value}  className='text-overflow-ellipsis' style={{width: 119}}>{value}</div>
                }
            </div>
        )
    } else if(vlaueKey === 'mail') {
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
                                    style={{ margin: '-5px 0', minWidth: minWidthValue }} 
                                    //value={value} 
                                    title={value} 
                                    onChange={e => onChange(e.target.value)} 
                                />
                            )
                        }
                    </FormItem>
                    : 
                    <div title={value}  className='text-overflow-ellipsis' style={{width: 119}}>{value}</div>
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
                                    style={{ margin: '-5px 0', minWidth: minWidthValue }} 
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
    }
    return (
        <div>
            {
                editable ? 
                <Input style={{ margin: '-5px 0' }} value={value} title={value} onChange={e => onChange(e.target.value)} />
                : 
                <div title={value}  className='text-overflow-ellipsis' style={{maxWidth: 119}}>{value}</div>
            }
        </div>
    )
}

@inject('rApi')
class Contacts extends Component {

    state ={
        dataSource: []
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
            name: '',
            job: '',
            mail: '',
            phone: '',
            qq: '',
            isEdit: true,
            frontOrBack: '',
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
          <EditableCell
            editable={record.isEdit}
            value={text}
            getFieldDecorator={getFieldDecorator}
            key={key}
            vlaueKey={key}
            record={record}
            column={column}
            onChange={value => this.handleChange(value, key, column)}
          />
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
        this.props.form.validateFields([`name${index}`, `phone${index}`, `mail${index}`, `qq${index}`], (err, values) => {
            if (!err) {
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
                } else if(err[`mail${index}`]) {
                    message.error(err[`mail${index}`].errors[0].message)
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

    exportTemplate = () => { //导出模板
        const { rApi } = this.props
        this.setState({
            exportLoading: true
        })
        rApi.exportContactsHeader().then(res => {
            // console.log('ress', res)
            let fileName = `承运商联系人列表.xlsx`
            try {
                let header = res.headers
                let contentDsposition = header['content-disposition']
                contentDsposition = contentDsposition.split(';')[1]
                fileName = window.decodeURIComponent(contentDsposition.replace('filename=', ''))
            } catch (e) {
                console.error(e)
            }
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            this.setState({
                exportLoading: false
            })
        }).catch()
    }

    exportData = () => { //导出表数据
        const { rApi } = this.props
        // this.setState({
        //     exportLoading: true
        // })
        rApi.exportContacts({
            carrierId: this.props.carrierId
        }).then(res => {
            // console.log('ress', res)
            let fileName = `承运商联系人模板.xlsx`
            try {
                let header = res.headers
                let contentDsposition = header['content-disposition']
                contentDsposition = contentDsposition.split(';')[1]
                fileName = window.decodeURIComponent(contentDsposition.replace('filename=', ''))
            } catch (e) {
                console.error(e)
            }
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            // this.setState({
            //     exportLoading: false
            // })
        }).catch()
    }

    getExcelData = (data) => {
        let header = data[0].map(item => {
            return null
        })
        if (data && data.length >1) {
            let d = data.slice(1).map(item => {
                let array = []
                array = Array.from(array)
                if (item.length < header.length) {
                    header.forEach((d, i) => {
                        array[i] = item[i]
                    })
                } else {
                    array = Array.from(item)
                }
                return array
            })
            let importData = d.map(item => { //序列化导入的数据
                if(item && item.length > 0) {
                    let obj = {
                        name: item[0],
                        job: item[1],
                        phone: item[2],
                        mail: item[3],
                        qq: item[4],
                        isEdit: false,
                        frontOrBack: item[5],
                        remark: item[6]
                    }
                    return obj
                }
            })
            this.importHandle(importData)
        }
    }

    importHandle = (value) => {
        let { dataSource } = this.state
        dataSource = [...dataSource, ...value]
        // console.log('importHandle', value, this.state.dataSource)
        this.setState({
            dataSource
        })
    }

    render() {
        let { dataSource } = this.state
        let props = this.props
        const { getFieldDecorator } = this.props.form
        const columns = () => {
            let cols = [
                {
                    className: 'text-overflow-ellipsis',
                    title: '姓名',
                    dataIndex: 'name',
                    key: 'name',
                    width: 120,
                    render: (text, record, index) => this.renderColumns(text, 'name', record, index, getFieldDecorator)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '职位',
                    dataIndex: 'job',
                    key: 'job',
                    width: 140,
                    render: (text, record, index) => this.renderColumns(text, 'job', record, index, getFieldDecorator)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '电话',
                    dataIndex: 'phone',
                    key: 'phone',
                    width: 140,
                    render: (text, record, index) => this.renderColumns(text, 'phone', record, index, getFieldDecorator)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '邮箱',
                    dataIndex: 'mail',
                    key: 'mail',
                    width: 140,
                    render: (text, record, index) => this.renderColumns(text, 'mail', record, index, getFieldDecorator)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: 'QQ',
                    dataIndex: 'qq',
                    key: 'qq',
                    width: 140,
                    render: (text, record, index) => this.renderColumns(text, 'qq', record, index, getFieldDecorator)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '前后端',
                    dataIndex: 'frontOrBack',
                    key: 'frontOrBack',
                    width: 100,
                    render: (text, record, index) => this.renderColumns(text, 'frontOrBack', record, index, getFieldDecorator)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    render: (text, record, index) => this.renderColumns(text, 'remark', record, index, getFieldDecorator)
                }
            ]
            if (props.type === 2) {
                return cols
            }
            return [
                ...cols,
                {
                    className: 'text-overflow-ellipsis',
                    title: '操作',
                    dataIndex: 'action',
                    width: 140,
                    key: 'action',
                    fixed: 'right',
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
        const Title = () => {
            return (
                <div className="flex flex-vertical-center" style={{padding: '5px 0'}}>
                    <div className="block-title">
                        { '承运商联系人'}
                    </div>
                    <div className="flex1" style={{ textAlign: 'right' }}>
                        {
                            props.type === 2 ? 
                            null 
                            :
                            <Button onClick={this.onAdd} style={{borderRadius: 0, marginRight: 10}} icon="plus">
                                新建
                            </Button>
                        }
                        {
                            props.type === 2 ? 
                            null 
                            :
                            <UploadExcel getExcelData={this.getExcelData} power={props.power.IMPORT_CONTACTS}/>
                        }
                        <FunctionPower power={props.power.EXPORT_HEADER}>
                            <Button onClick={this.exportTemplate} style={{borderRadius: 0, marginRight: 10}} icon="export">
                                导出模板
                            </Button>
                        </FunctionPower>
                        {
                            (props.type === 3) ?
                            null
                            :
                            <FunctionPower power={props.power.EXPORT_CONTACTS}>
                                <Button onClick={this.exportData} style={{borderRadius: 0}} icon="export">
                                    导出表数据
                                </Button>
                            </FunctionPower>
                        }
                    </div>
                </div>
            )
        }
        return (
            <div className='err-valid-table'>
                <Title />
                <div>
                    <Table
                        key='1'
                        bordered={true}
                        pagination={false}
                        scroll={{x: 1300, y: 250}}
                        title={null}
                        dataSource={dataSource}
                        columns={columns()}
                        rowKey={(record, index) => {return record.id || index}}
                    />
                </div>
            </div>
        )
    }

}
export default Form.create()(Contacts) 