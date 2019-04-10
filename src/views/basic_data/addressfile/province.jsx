import React, { Component } from 'react'
import TableView from './table'
import { Checkbox, Button } from 'antd';
import { inject, observer } from "mobx-react"
const CheckboxGroup = Checkbox.Group;

class ItemView extends Component {

    state = {
        
    }

    onChange = (e) => {
        let { onChangeChecked, index } = this.props
        onChangeChecked(e.target.checked, index)
    }

    render() {
        let { isEdit, isChecked, data } = this.props
        return (
            <div className='flex'>
                {
                    isEdit ?
                    <div style={{marginRight: 10}}>
                        <Checkbox onChange={this.onChange} checked={isChecked} />
                    </div>
                    : null
                }
                <div>
                    {data.name}
                </div>
            </div>
        )
    }
}

@inject('mobxWordBook')
@inject('rApi')
@observer
export default class Province extends Component {
    state = {
        isEdit: false,
        data: []
    }

    onChangeChecked = (status, index) => {
        let { data } = this.state
        if (data[index]) {
            data[index].isChecked = status
            this.setState({data: data})
        }

    }

    componentDidUpdate(nextProps) {
        // console.log('componentWillUpdate',  nextProps.mobxWordBook.selectArea.id, this.selectAreaid)
        // if (nextProps.mobxWordBook.selectArea.id !== this.selectAreaid && this.selectAreaid) {
        //     this.setState({isEdit: false})
        //     this.selectAreaid = nextProps.mobxWordBook.selectArea.id
        // }
    }

    onSetEdit = () => {
        // console.log('onSetEdit', this.state.isEdit)
        this.setState({isEdit: true})
    }
    onSubmit = () => {
        let { mobxWordBook } = this.props
        mobxWordBook.changeAreaProvinces(this.state.data).then(() => {
            this.setState({isEdit: false})
        })
    }

    render() { 
        let { isEdit } = this.state
        let { mobxWordBook } = this.props
        let selectArea = mobxWordBook.selectArea
        let loading = selectArea.loading
        // console.log('selectArea', selectArea, isEdit)
        if (!selectArea || (!selectArea.provinces && !loading)) {
            return (
                <div style={{minWidth: 320}}>
                    <div className='flex' style={{padding: 10, borderBottom: '1px solid #eee'}}>
                        <div className='flex1'>请选择片区</div>
                    </div>
                </div>
            )
        }
        if (selectArea && !selectArea.provinces) {
            return (
                <div style={{minWidth: 320}}>{loading}</div>
            )
        }
        this.selectAreaid = selectArea.id
        let provinces = selectArea.provinces
        this.state.data = isEdit ?  [...provinces.ownDistrict, ...provinces.noSelectedDistric] : selectArea.iAreaProvinces
        // console.log('children', data)
        return (
            <div style={{minWidth: 320}}>
                <div>
                    <div className='flex' style={{padding: 10, borderBottom: '1px solid #eee'}}>
                        <div className='flex1'>片区：{selectArea.name}，省份列表</div>
                        <div>
                            {
                                isEdit ? 
                                <div>
                                <Button onClick={this.onSubmit}>保存</Button>
                                <Button onClick={() => this.setState({isEdit: false})}>取消</Button>
                                </div>
                                : 
                                <div><Button onClick={this.onSetEdit}>编辑</Button></div>
                            }
                        </div>
                    </div>
                    <div style={{padding: 10}}>
                        {
                            !this.state.data || this.state.data.length < 1 ? '无' : null
                        }
                        {
                            this.state.data.map((item, index) => {
                                return (
                                    <ItemView 
                                    key={index}
                                    index={index}
                                    isEdit={isEdit} 
                                    data={item} 
                                    isChecked={item.isChecked} 
                                    onChangeChecked={this.onChangeChecked}  />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}
