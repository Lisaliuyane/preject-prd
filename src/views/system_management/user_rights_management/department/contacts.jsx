import React, { Component } from 'react';
import { Table, Button, Icon, Input, Popconfirm, message } from 'antd';
// import { columnsAddNumber } from "@src/components/table_plugin"

const EditableCell = ({ editable, value, onChange }) => (
    <div>
      {editable
        ? <Input style={{ margin: '-5px 0' }} value={value} title={value} onChange={e => onChange(e.target.value)} />
        : <span title={value}  className='text-overflow-ellipsis'>{value}</span>
      }
    </div>
  );

export default class Contacts extends Component {

    state ={
        dataSource: []
    }

    constructor(props) {
        super(props)
    }

    componentWillReceiveProps(nextProps) { //根据LeftView选中值去渲染table值
        //console.log('componentWillReceiveProps111', nextProps, nextProps.data)
        this.state.dataSource = nextProps.data || []
    }
    onAdd = () => {
        this.state.dataSource.push({
            uid: '',
            username: '',
            email: '',
            phonenum: '',
            isEdit: true,
        })
        this.setState({dataSource: this.state.dataSource})
    }

    onDelete = (index) => {
        let target = this.state.dataSource[index]
        if (target.id) {  //移除的id
            // let { removeId } = this.state
            // removeId = target.id
            // this.setState({removeId: removeId})
        }
        this.state.dataSource.splice(index, 1)
        this.setState({dataSource: this.state.dataSource})
        //console.log('onDelete', index, target.id)
    }

    handleChange = (value, key, column) => {
        let dataSource = this.state.dataSource
        dataSource[column][key] = value
        this.setState({dataSource: dataSource})
    }

    renderColumns = (text, key, record, column) => {
        return (
          <EditableCell
            editable={record.isEdit}
            value={text}
            key={key}
            onChange={value => this.handleChange(value, key, column)}
          />
        );
    }

    logData = () => {
        // console.log('Contacts', this.state.dataSource)
        return this.state.dataSource.filter(ele => !ele.isEdit)
    }

    saveData = (record, index) => {
        //console.log('record', record)
        if(record.uid) {
            let { dataSource } = this.state
            dataSource[index].isEdit = false
            this.setState({dataSource: dataSource})
        } else{
            message.error('用户账号不能为空！')
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
        const columns = () => {
            let cols = [
                {
                    className: 'text-overflow-ellipsis',
                    title: '用户账号',
                    dataIndex: 'uid',
                    key: 'uid',
                    render: (text, record, index) => this.renderColumns(text, 'uid', record, index)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '姓名',
                    dataIndex: 'username',
                    key: 'username',
                    render: (text, record, index) => this.renderColumns(text, 'username', record, index)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '联系方式',
                    dataIndex: 'phonenum',
                    key: 'phonenum',
                    render: (text, record, index) => this.renderColumns(text, 'phonenum', record, index)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '邮箱',
                    dataIndex: 'email',
                    key: 'email',
                    render: (text, record, index) => this.renderColumns(text, 'email', record, index)
                }
            ]
            // if (props.type === 2) {
            //     return cols
            // }
            return [
                ...cols,
                {
                    title: '操作',
                    dataIndex: 'action',
                    width: 100,
                    key: 'action',
                    render: (text, record, index) => {
                        return (
                        <div>
                            {/* {
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
                            } */}
                            
                            <Popconfirm
                                title="确定要移除此项?"
                                onConfirm={() => this.onDelete(index)}
                                okText="确定"
                                cancelText="取消">
                                <span
                                    className={`action-button`}
                                >
                                    移除
                                </span>
                            </Popconfirm>
                        </div>
                        )
                    }
                }
            ]
        }
        const title = () => {
            return (
                ''
                // <div className="flex flex-vertical-center">
                //     <div className="flex1" style={{ textAlign: 'right' }}>
                //         <Button onClick={this.onAdd}>
                //             <Icon type="plus" />新建
                //         </Button>
                //     </div>
                // </div>
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