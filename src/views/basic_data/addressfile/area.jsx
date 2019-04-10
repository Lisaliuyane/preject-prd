import React, { Component } from 'react'
import TableView from './table'
import { Input, Button, Icon, message, Popconfirm } from 'antd'
import './area.less'
import { inject, observer } from "mobx-react"
// selectArea

@inject('mobxWordBook')
@inject('rApi')
@observer
class ItemView extends Component {

    state = {
        value: '',
        isEdit: false
    }

    constructor(props) {
        super(props)
        this.state.value = props.value
    }

    onChange = (e) => {
        // console.log('onChange', e)
        this.setState({value: e.target.value})
    }

    onEdit = (e) => {
        this.setState({
            isEdit: true
        })
    }

    onCancal = (e) => {
        this.setState({
            isEdit: false
        })
    }

    

    onSave = (e) => {
        let { mobxWordBook, index,  } = this.props
        mobxWordBook.editArea({name: this.state.value, index: index, id: this.props.data.id}).then(() => {
            message.success(`片区: ${this.state.value} 编辑成功`)
        }).catch(e => {
            message.error('操作失败')
        })
    }

    onDelete = (e) => {
        // e.stoppropagation()
        let { mobxWordBook } = this.props
        mobxWordBook.deleteArea({index: this.props.index, id: this.props.data.id}).then(() => {
            message.success(`片区: ${this.state.value} 删除成功`)
        }).catch(e => {
            message.error('操作失败')
        })
    }
    setSelectArea = () => {
        let { mobxWordBook, data } = this.props
        mobxWordBook.setActiveArea(data)
    }

    render() {
        let { value, isEdit } = this.state
        let { data, mobxWordBook } = this.props
        let selectArea = mobxWordBook.selectArea
        if (isEdit) {
            return (
                <div className='area-item flex flex-vertical-center'>
                    <div className='flex1'>
                        <Input onChange={this.onChange} value={value} />
                    </div>
                    <div>
                        <span className='area-item-action'>
                            <span className={`action-button`} onClick={this.onSave}>保存</span>
                            <span className={`action-button`} onClick={this.onCancal}>取消</span>
                        </span>
                    </div>
                </div>
            )
        }
        return (
            <div 
                onClick={this.setSelectArea} 
                className={`area-item flex flex-vertical-center ${(selectArea && selectArea.id && (selectArea.id === data.id)) ? 'area-item-active' : ''}`}>
                <div style={{padding: '6px 0', textAlign: 'center'}} className='flex1'>
                    {value}
                </div>
                <div className='area-item-action'>
                    <span className={`action-button`} onClick={this.onEdit}>编辑</span>
                    <Popconfirm
                    title="确定要删除此项?"
                    onConfirm={this.onDelete}
                    okText="确定"
                    cancelText="取消">
                        <span style={{color: '#999'}} className={`action-button`}>删除</span>
                    </Popconfirm>
                </div>
            </div>
        )
    }
}

@inject('mobxWordBook')
@inject('rApi')
@observer
class AddItemView extends Component {

    state = {
        isAdding: false,
        value: '',
        loading: false
    }

    onChange = (e) => {
        this.setState({value: e.target.value})
    }

    onSave = () => {
        let { mobxWordBook } = this.props
        this.setState({loading: true})
        mobxWordBook.addArea({name: this.state.value}).then(() => {
            this.setState({loading: false, isAdding: false, value: ''})
            message.success(`片区: ${this.state.value} 添加成功`)
        }).catch(e => {
            this.setState({loading: false})
        })
    }

    render() {
        let { isAdding, value, loading } = this.state
        return (
            <div className={isAdding?'paper-1':''} style={{padding: isAdding?10:0}}>
                {
                    isAdding ?
                    <div className='flex flex-vertical-center'>
                        <div className='flex1'>
                            <Input placeholder='请输入片区名' onChange={this.onChange} value={value} />
                        </div>
                    </div>
                    :
                    null
                }
                <div>
                    {
                        isAdding ? 
                        <div style={{marginTop: 10}} className='area-item-action'>
                            <Button onClick={() => this.setState({isAdding: false})}>取消</Button>
                            <Button loading={loading} onClick={this.onSave} className={`action-button`} onClick={this.onSave}>保存</Button>
                        </div>
                        :
                        <div style={{textAlign: 'center', marginBottom: 5}}>
                            <Button type="dashed" onClick={() => this.setState({isAdding: true})} icon='plus'>
                                添加
                            </Button>
                        </div>
                    }
                </div>
                
            </div>
        )
    }
}

@inject('mobxWordBook')
@inject('rApi')
@observer
class Area extends Component {
    state = {
        data: []
    }

    constructor(props) {
        super(props)
        let { mobxWordBook } = props
        mobxWordBook.getAreas()
    }

    onEdit = (value, index) => {
    }

    render() {
        // <TableView name='片区列表'  dataSource={this.state.data}  />
        let { mobxWordBook } = this.props
        let data = mobxWordBook.areas.slice()
        //  console.log('data', data)
        return (
            <div style={{minWidth: 320, maxHeight: this.props.maxHeight, overflow: 'hidden'}}>
                <div style={{padding: '10px 0'}}>片区列表</div>
                <AddItemView />
                <div>
                    {
                        data.map((item, index) => {
                            return (
                                <ItemView data={item} key={item.id + item.name} index={index} value={item.name} onEdit={this.onEdit} />
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}
 
export default Area;