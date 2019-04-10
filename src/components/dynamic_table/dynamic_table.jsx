import React, { Component } from 'react'
// import Modal from '@src/components/modular_window'
import DragView from '@src/components/table_header_drag'
import { Table, Parent } from '@src/components/table_template'
import { Select, Input, Upload, Button, Icon, Popover, Divider, Radio, Tag, Popconfirm, InputNumber, message } from 'antd'
import SelectDatabook  from '@src/components/select_databook'
// import SelectData from '@src/components/select_data'
// import PropTypes from 'prop-types'
import { inject, observer } from "mobx-react"
import update from 'immutability-helper'
import XLSX from 'xlsx'
import './dynamic_table.less'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const Option = Select.Option
// 导入分类数据
const types = {
    '零担': 1,
    '整车': 2,
    '快递': 3,
}

let globelCols = []

/** 
 * 表格每一项
*/
const EditableCell = ({ editable, value, onChange, record, col, itemHeader }) => {
    // console.log('EditableCell', record)
    if (editable) {
        const { itemHeader } = record.data[col]
        if (itemHeader.title === '是否高速') {
            return (
                <Select onChange={value => onChange(value)} value={value}>
                    <Option value="0">否</Option>
                    <Option value="1">是</Option>
                </Select>
            )
        } else if (itemHeader.title === '时效') {
            return (
                <InputNumber style={{width: '100%'}} value={value} onChange={value => onChange(value)} min={0} />
            )
        } else if (itemHeader.isCostItem) {
            return (
                <InputNumber style={{width: '100%'}} value={value} onChange={value => onChange(value)} min={0} />
            )
        } else {
            return (
                <div>
                    <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
                </div>
            )
        }
    }
    if ((!itemHeader.isCostItem && itemHeader.title === '是否高速')) {
        return (
            <span title={value === 1 || value === '1' || value === '是' ? '是' : '否'}>
                {value === 1 || value === '1' || value === '是' ? '是' : '否'}
            </span>
        )
    }
    return (
        <span title={value}>
            {value}
        </span>
    )
}

const costItemObjectToString = ({
    text,
    carType, // 车类型ID
    carTypeName, // 车类型名称
    costUnitId, // 费用单位ID
    costUnitName, // 费用单位名称
    expenseItemId, // 费用项目ID
    expenseItemName, // 费用项目名称
    lowestFee, // 最低收费
    endValue, // 限制区间 end
    startValue // 限制区间 start
}) => {
    let se = () => {
        if ((startValue ||startValue === 0) && endValue) {
            return startValue + '-' + endValue
        } else if (!startValue && endValue) {
            return 0 + '-' + endValue
        } else if ((startValue ||startValue === 0) && !endValue) {
            return startValue + '-' + '∞'
        } else {
            return ''
        }
    }
    let s = `${se()} ${costUnitName} ${lowestFee ? (' , ≥' + lowestFee) : ''} ${carTypeName ? (' ,'+carTypeName) : ''}`
    if (s && s !== 'null' && s !== 'undefined') {
        s = s.endsWith(',') ? s.substring(0, s.length - 1) : s
        s = `(${s})`
    } else {
        s = ''
    }
    return `${text}${s}`
}

/** 
 * 添加表头 header 栏
*/
const PopoverTitle = (props) => (
    <div className='flex flex-vertical-center'>
        <div>
            {props.title}
        </div>
        <div className='flex1'>
        </div>
        <div> 
            {
                // props.showMore ?
                // <Button size="small" type="dashed" shape="circle" icon="minus" />
                // :
                // <Button size="small" type="dashed" shape="circle" icon="plus" />
            }
            <Button onClick={props.closeThis} size="small" type="dashed" shape="circle" icon="close" />
        </div>
    </div>
)

/**
 * 表头基本字段项
 * 
 * @class BaseItemView
 * @extends {Component}
 */
class BaseItemView extends Component {

    render() {
        const props = this.props
        return (
            <Popconfirm
                title={`确定添加此项至表头?`}
                onConfirm={() => props.addToHeader({title: props.text, type: 'base'})}
                getPopupContainer = {() => props.offercarrierpop}
                okText="确定">
                <Tag color="volcano">
                    {
                        props.text
                    }
                </Tag>
            </Popconfirm>
        )
    }
}

/**
 * 费用项基本字段
 * 
 * @class CostItemView
 * @extends {Component}
 */
class CostItemView extends Component {

    state = {
        visible: false,
        carType: null, // 车类型ID
        carTypeName: null, // 车类型名称
        costUnitId: null, // 费用单位ID
        costUnitName: null, // 费用单位名称
        expenseItemId: null, // 费用项目ID
        expenseItemName: null, // 费用项目名称
        lowestFee: null, // 最低收费
        endValue: null, // 限制区间 end
        startValue: null // 限制区间 start
    }

    hide = () => {
        this.setState({
            visible: false,
        });
    }

    addToHeader = () => {
        const props = this.props
        const { item } = props
        // console.log('addToHeader', this.state)
        const {
            carType, // 车类型ID
            carTypeName, // 车类型名称
            costUnitId, // 费用单位ID
            costUnitName, // 费用单位名称
            expenseItemId, // 费用项目ID
            expenseItemName, // 费用项目名称
            lowestFee, // 最低收费
            endValue, // 限制区间 end
            startValue // 限制区间 start
        } = this.state
        if (!costUnitId || !costUnitName) {
            message.error('请选择单位!')
            return 
        }
        this.hide()
        let se = () => {
            if ((startValue ||startValue === 0) && endValue) {
                return startValue + '-' + endValue
            } else if (!startValue && endValue) {
                return 0 + '-' + endValue
            } else if ((startValue ||startValue === 0) && !endValue) {
                return startValue + '-' + '∞'
            }
        }
        props.addToHeader({
            isCostItem: true,
            title: costItemObjectToString({text: item.name, ...this.state}),
            carType, // 车类型ID
            carTypeName, // 车类型名称
            costUnitId, // 费用单位ID
            costUnitName, // 费用单位名称
            expenseItemId: item.id, // 费用项目ID
            expenseItemName: item.name, // 费用项目名称
            lowestFee, // 最低收费
            endValue, // 限制区间 end
            startValue // 限制区间 start
        })
    }

    handleVisibleChange = (visible) => {
        this.setState({ visible })
    }

    render() {
        const props = this.props
        const { type, item, offercarrierpop } = props
        const use = item.expenseUses.split(',')
        let show = false
        use.forEach(ele => {
            if (types[ele] === type) {
                show = true
            }
        })
        if (!show) {
            return null
        }
        let {
            visible,
            carType, // 车类型ID
            carTypeName, // 车类型名称
            costUnitId, // 费用单位ID
            costUnitName, // 费用单位名称
            expenseItemId, // 费用项目ID
            expenseItemName, // 费用项目名称
            lowestFee, // 最低收费
            endValue, // 限制区间 end
            startValue // 限制区间 start
        } = this.state
        // console.log('costItem', props.key)
        return (
            <Popover
                arrowPointAtCenter
                placement='top'
                title='设置标签数据'
                visible={visible}
                overlayStyle={{minWidth: 310}}
                onVisibleChange={this.handleVisibleChange}
                getPopupContainer={() => offercarrierpop}
                content={
                    <div ref='offercarrierpop1'>
                        <div className='cost-item-view flex'>
                            <div>
                                费用单位：
                            </div>
                            <div style={{width: 160}}>
                                <SelectDatabook 
                                    onChangeValue={value => this.setState({costUnitId: value.id, costUnitName: value.title})} 
                                    getPopupContainer = {() => this.refs.offercarrierpop1} 
                                    text='费用单位' 
                                    size='small' />
                            </div>
                        </div>
                        <div className='cost-item-view'>最低收费：<InputNumber value={lowestFee} onChange={value => this.setState({lowestFee: value})} min={1} size="small" /></div>
                        <div className='cost-item-view'>限制区间：<InputNumber value={startValue} onChange={value => this.setState({startValue: value})} style={{width: 80}} min={1} size="small" /> - <InputNumber value={endValue} onChange={value => this.setState({endValue: value})} style={{width: 80}} min={1} size="small" /></div>
                        <div className='cost-item-view flex'>
                            <div>
                            设置车型：
                            </div>
                            <div style={{width: 180}}>
                                <SelectDatabook 
                                    labelField={'name'}
                                    onChangeValue={value => this.setState({carType: value.id, carTypeName: value.title})} 
                                    getPopupContainer = {() =>  this.refs.offercarrierpop1} 
                                    getDataMethod={'getCarTypes'} 
                                    params={{limit: 100, offset: 0}}  
                                    size='small' />
                            </div>
                        </div>
                        <div style={{textAlign: 'end', 'borderTop': '1px solid #eee', paddingTop: '10px'}}>
                            <Button onClick={this.hide} style={{marginRight: 10}} size='small'>取消</Button>
                            <Button onClick={this.addToHeader} type="primary" size='small'>确定</Button>
                        </div>
                    </div>
                }
                trigger="click"
            >
                <Tag color="volcano">
                    {
                        item.name
                    }
                </Tag>
            </Popover>
        )
    }
}

/**
 * 首重
 * 
 * @class FirstWeight
 * @extends {Component}
 */
class FirstWeight extends Component {
    
    state = {
        visible: false,
        carType: null, // 车类型ID
        carTypeName: null, // 车类型名称
        costUnitId: null, // 费用单位ID
        costUnitName: null, // 费用单位名称
        expenseItemId: null, // 费用项目ID
        expenseItemName: null, // 费用项目名称
        firstWeight: null, // 最低收费
        endValue: null, // 限制区间 end
        startValue: null // 限制区间 start
    }

    hide = () => {
        this.setState({
            visible: false,
        });
    }

    addToHeader = () => {
        const props = this.props
        const { type } = props
        /** 
         * type: 1 零担
         * type: 2 整车
         * type: 3 快递
        */
        this.hide()
        // console.log('addToHeader', this.state)
        const {
            carType, // 车类型ID
            carTypeName, // 车类型名称
            costUnitId, // 费用单位ID
            costUnitName, // 费用单位名称
            expenseItemId, // 费用项目ID
            expenseItemName, // 费用项目名称
            firstWeight, // 最低收费
            endValue, // 限制区间 end
            startValue // 限制区间 start
        } = this.state
        let se = () => {
            if ((startValue ||startValue === 0) && endValue) {
                return startValue + '-' + endValue
            } else if (!startValue && endValue) {
                return 0 + '-' + endValue
            } else if ((startValue ||startValue === 0) && !endValue) {
                return startValue + '-' + '∞'
            }
        }
        props.addToHeader({
            isCostItem: true,
            title: `首重 (${firstWeight}kg)`,
            carType, // 车类型ID
            carTypeName, // 车类型名称
            costUnitId: 122, // 费用单位ID
            costUnitName: 'kg', // 费用单位名称
            expenseItemId: -2, // 费用项目ID
            expenseItemName: '首重', // 费用项目名称
            firstWeight, // 最低收费
            endValue, // 限制区间 end
            startValue // 限制区间 start
        })
    }

    handleVisibleChange = (visible) => {
        this.setState({ visible })
    }

    render() {
        const props = this.props
        const { type, offercarrierpop } = props
        let {
            visible,
            carType, // 车类型ID
            carTypeName, // 车类型名称
            costUnitId, // 费用单位ID
            costUnitName, // 费用单位名称
            expenseItemId, // 费用项目ID
            expenseItemName, // 费用项目名称
            firstWeight, // 最低收费
            endValue, // 限制区间 end
            startValue // 限制区间 start
        } = this.state
        return (
            <Popover
                arrowPointAtCenter
                placement='topLeft'
                title='设置标签数据'
                visible={visible}
                onVisibleChange={this.handleVisibleChange}
                getPopupContainer={() => offercarrierpop}
                content={
                    <div ref='offercarrierpop1'>
                        <div className='cost-item-view flex'>
                            <div>
                                费用单位：
                            </div>
                            <div style={{width: 100}}>
                                kg
                            </div>
                        </div> 
                        <div className='cost-item-view'>首重：<InputNumber value={firstWeight} onChange={value => this.setState({firstWeight: value})} min={1} size="small" /></div>
                        <div style={{textAlign: 'end', 'borderTop': '1px solid #eee', paddingTop: '10px'}}>
                            <Button onClick={this.hide} style={{marginRight: 10}} size='small'>取消</Button>
                            <Button onClick={this.addToHeader} type="primary" size='small'>确定</Button>
                        </div>
                    </div>
                }
                trigger="click"
            >
                <Tag color="volcano">
                    {
                        '首重' 
                    }
                </Tag>
            </Popover>
        )
    }
}

/**
 * 续重
 * 
 * @class ContinuedWeight
 * @extends {Component}
 */
class ContinuedWeight extends Component {
    
    state = {
        visible: false,
        carType: null, // 车类型ID
        carTypeName: null, // 车类型名称
        costUnitId: null, // 费用单位ID
        costUnitName: null, // 费用单位名称
        expenseItemId: null, // 费用项目ID
        expenseItemName: null, // 费用项目名称
        continuedWeight: null, // 最低收费
        endValue: null, // 限制区间 end
        startValue: null // 限制区间 start
    }

    hide = () => {
        this.setState({
            visible: false,
        });
    }

    addToHeader = () => {
        const props = this.props
        const { type } = props
        /** 
         * type: 1 零担
         * type: 2 整车
         * type: 3 快递
        */
        this.hide()
        // console.log('addToHeader', this.state)
        const {
            carType, // 车类型ID
            carTypeName, // 车类型名称
            costUnitId, // 费用单位ID
            costUnitName, // 费用单位名称
            expenseItemId, // 费用项目ID
            expenseItemName, // 费用项目名称
            endValue, // 限制区间 end
            startValue // 限制区间 start
        } = this.state

        props.addToHeader({
            isCostItem: true,
            title: `续重(${startValue} - ${endValue}kg)`,
            carType, // 车类型ID
            carTypeName, // 车类型名称
            costUnitId: 122, // 费用单位ID
            costUnitName: 'kg', // 费用单位名称
            expenseItemId: -3, // 费用项目ID
            expenseItemName: '续重', // 费用项目名称
            // continuedWeight, // 最低收费
            endValue, // 限制区间 end
            startValue // 限制区间 start
        })
    }

    handleVisibleChange = (visible) => {
        this.setState({ visible })
    }

    render() {
        const props = this.props
        const { type, offercarrierpop } = props
        let {
            visible,
            carType, // 车类型ID
            carTypeName, // 车类型名称
            costUnitId, // 费用单位ID
            costUnitName, // 费用单位名称
            expenseItemId, // 费用项目ID
            expenseItemName, // 费用项目名称
            continuedWeight, // 最低收费
            endValue, // 限制区间 end
            startValue // 限制区间 start
        } = this.state
        return (
            <Popover
                arrowPointAtCenter
                placement='top'
                title='设置标签数据'
                visible={visible}
                onVisibleChange={this.handleVisibleChange}
                getPopupContainer={() => offercarrierpop}
                content={
                    <div ref='offercarrierpop1'>
                        <div className='cost-item-view flex'>
                            <div>
                                费用单位：
                            </div>
                            <div style={{width: 100}}>
                                kg
                            </div>
                        </div>
                        <div className='cost-item-view'>
                            续重区间：
                            <InputNumber 
                                value={startValue} 
                                onChange={value => this.setState({startValue: value})} 
                                min={1} 
                                size="small" />
                            -
                            <InputNumber 
                                value={endValue} 
                                onChange={value => this.setState({endValue: value})} 
                                min={1} 
                                size="small" />
                        </div>
                        <div style={{textAlign: 'end', 'borderTop': '1px solid #eee', paddingTop: '10px'}}>
                            <Button onClick={this.hide} style={{marginRight: 10}} size='small'>取消</Button>
                            <Button onClick={this.addToHeader} type="primary" size='small'>确定</Button>
                        </div>
                    </div>
                }
                trigger="click"
            >
                <Tag color="volcano">
                    {
                        '续重' 
                    }
                </Tag>
            </Popover>
        )
    }
}

/**
 * 费用项
 * 
 * @class CostItemFreightView
 * @extends {Component}
 */
@inject('mobxDataBook')
class CostItemFreightView extends Component {

    state = {
        visible: false,
        carType: null, // 车类型ID
        carTypeName: null, // 车类型名称
        costUnitId: null, // 费用单位ID
        costUnitName: null, // 费用单位名称
        expenseItemId: null, // 费用项目ID
        expenseItemName: null, // 费用项目名称
        lowestFee: null, // 最低收费
        endValue: null, // 限制区间 end
        startValue: null // 限制区间 start
    }

    hide = () => {
        this.setState({
            visible: false,
        })
    }

    getData = () => {
        const { type } = this.props
        return new Promise((resolve, reject) => {
            const { mobxDataBook } = this.props
            const text = '费用单位'
            let typeId = mobxDataBook.getBookType(text)
            let data = []
            if (!typeId) {
                return
            }
            if(!mobxDataBook.databook[typeId.id] || mobxDataBook.databook[typeId.id].length < 1){
                mobxDataBook.initData(text).then(() => {
                    data = mobxDataBook.databook[typeId.id]
                    // console.log('data1', data)
                    if (data.length >= 7) {
                        data = type === 1 ? data.slice(0, 4) : data.slice(4, data.length)
                    }
                    resolve(data)
                }).catch(e => {
                    reject(e)
                })
            } else {
                // console.log('data2', mobxDataBook.databook[typeId.id])
                data = mobxDataBook.databook[typeId.id]
                if (data.length >= 7) {
                    data = type === 1 ? data.slice(0, 4) : data.slice(4, data.length)
                }
                resolve(data)
            }
        })
    }

    addToHeader = () => {
        const props = this.props
        const { type } = props
        /** 
         * type: 1 零担
         * type: 2 整车
         * type: 3 快递
        */
        // console.log('addToHeader', this.state)
        const {
            carType, // 车类型ID
            carTypeName, // 车类型名称
            costUnitId, // 费用单位ID
            costUnitName, // 费用单位名称
            expenseItemId, // 费用项目ID
            expenseItemName, // 费用项目名称
            lowestFee, // 最低收费
            endValue, // 限制区间 end
            startValue // 限制区间 start
        } = this.state
        if (!costUnitId) {
            message.error('请填写单位')
            return
        }
        this.hide()
        let se = () => {
            if ((startValue ||startValue === 0) && endValue) {
                return startValue + '-' + endValue
            } else if (!startValue && endValue) {
                return 0 + '-' + endValue
            } else if ((startValue ||startValue === 0) && !endValue) {
                return startValue + '-' + '∞'
            }
        }
        props.addToHeader({
            isCostItem: true,
            title: costItemObjectToString({text: '运费', ...this.state}),
            carType, // 车类型ID
            carTypeName, // 车类型名称
            costUnitId, // 费用单位ID
            costUnitName, // 费用单位名称
            expenseItemId: -1, // 费用项目ID
            expenseItemName: '运费', // 费用项目名称
            lowestFee, // 最低收费
            endValue, // 限制区间 end
            startValue // 限制区间 start
        })
    }

    handleVisibleChange = (visible) => {
        this.setState({ visible })
    }

    render() {
        const props = this.props
        const { type, offercarrierpop } = props
        let {
            visible,
            carType, // 车类型ID
            carTypeName, // 车类型名称
            costUnitId, // 费用单位ID
            costUnitName, // 费用单位名称
            expenseItemId, // 费用项目ID
            expenseItemName, // 费用项目名称
            lowestFee, // 最低收费
            endValue, // 限制区间 end
            startValue // 限制区间 start
        } = this.state
        if (type === 1) {
            /** 
             * type: 1 零担
            */
            return (
                <Popover
                    arrowPointAtCenter
                    placement='top'
                    title='设置标签数据'
                    visible={visible}
                    onVisibleChange={this.handleVisibleChange}
                    getPopupContainer={() => offercarrierpop}
                    content={
                        <div ref='offercarrierpop1'>
                            <div className='cost-item-view flex'>
                                <div>
                                    费用单位：
                                </div>
                                <div style={{width: 160}}>
                                    <SelectDatabook 
                                        onChangeValue={value => this.setState({costUnitId: value.id, costUnitName: value.title})} 
                                        getPopupContainer = {() =>this.refs.offercarrierpop1} 
                                        getData={this.getData} 
                                        size='small' />
                                </div>
                            </div>
                            <div className='cost-item-view'>最低收费：<InputNumber value={lowestFee} onChange={value => this.setState({lowestFee: value})} min={1} size="small" /></div>
                            <div className='cost-item-view'>限制区间：<InputNumber value={startValue} onChange={value => this.setState({startValue: value})} style={{width: 80}} min={1} size="small" /> - <InputNumber value={endValue} onChange={value => this.setState({endValue: value})} style={{width: 80}} min={1} size="small" /></div>
                            <div className='cost-item-view flex'>
                                <div>
                                    设置车型：
                                </div>
                                <div style={{width: 200}}>
                                    <SelectDatabook 
                                        labelField={'name'}
                                        onChangeValue={value => this.setState({carType: value.id, carTypeName: value.title})} 
                                        getPopupContainer = {() =>this.refs.offercarrierpop1} 
                                        getDataMethod={'getCarTypes'} 
                                        params={{limit: 100, offset: 0}} 
                                        size='small' />
                                </div>
                            </div>
                            <div style={{textAlign: 'end', 'borderTop': '1px solid #eee', paddingTop: '10px'}}>
                                <Button onClick={this.hide} style={{marginRight: 10}} size='small'>取消</Button>
                                <Button onClick={this.addToHeader} type="primary" size='small'>确定</Button>
                            </div>
                        </div>
                    }
                    trigger="click"
                >
                    <Tag color="volcano">
                        {
                            '运费'
                        }
                    </Tag>
                </Popover>
            )
        } else if (type === 2) {
            /** 
             * type: 2 整车
            */
            return (
                <Popover
                    arrowPointAtCenter
                    placement='top'
                    title='设置标签数据'
                    visible={visible}
                    onVisibleChange={this.handleVisibleChange}
                    getPopupContainer={() => offercarrierpop}
                    content={
                        <div ref='offercarrierpop1'>
                            <div className='cost-item-view flex'>
                                <div>
                                    费用单位：
                                </div>
                                <div style={{width: 160}}>
                                    <SelectDatabook 
                                        onChangeValue={value => this.setState({costUnitId: value.id, costUnitName: value.title})} 
                                        getPopupContainer = {() =>this.refs.offercarrierpop1} 
                                        getData={this.getData}
                                        size='small' />
                                </div>
                            </div>
                            {
                                // <div className='cost-item-view'>最低收费：<InputNumber value={lowestFee} onChange={value => this.setState({lowestFee: value})} min={1} size="small" /></div>
                                // <div className='cost-item-view'>
                                // 限制区间：
                                // <InputNumber value={startValue} onChange={value => this.setState({startValue: value})} style={{width: 80}} min={1} size="small" /> - <InputNumber value={endValue} onChange={value => this.setState({endValue: value})} style={{width: 80}} min={1} size="small" /></div>
                            }
                            <div className='cost-item-view flex'>
                                <div>
                                设置车型：
                                </div>
                                <div style={{width: 200}}>
                                    <SelectDatabook 
                                        labelField={'name'}
                                        onChangeValue={value => this.setState({carType: value.id, carTypeName: value.title})} 
                                        getPopupContainer = {() =>this.refs.offercarrierpop1} 
                                        getDataMethod={'getCarTypes'} 
                                        params={{limit: 100, offset: 0}} 
                                        size='small' />
                                </div>
                            </div>
                            <div style={{textAlign: 'end', 'borderTop': '1px solid #eee', paddingTop: '10px'}}>
                                <Button onClick={this.hide} style={{marginRight: 10}} size='small'>取消</Button>
                                <Button onClick={this.addToHeader} type="primary" size='small'>确定</Button>
                            </div>
                        </div>
                    }
                    trigger="click"
                >
                    <Tag color="volcano">
                        {
                            '运费'
                        }
                    </Tag>
                </Popover>
            )
        } else if (type == 3) {
            /** 
             * type: 3 快递
            */
            return (
                [
                    <FirstWeight offercarrierpop={offercarrierpop} key={'first'} {...props} />,
                    <ContinuedWeight offercarrierpop={offercarrierpop} key={'continued'} {...props} />
                ]
            )
        }
    }
}

/**
 * 设置表头view
 * 
 * @class SetHeader
 * @extends {Component}
 */
@inject('rApi')
class SetHeader extends Component {

    state = {
        show: 'a',
        costItem: []
    }

    componentDidMount() {
        const { type, rApi } = this.props
        rApi.getCostItems({limit: 2000, offset: 0}).then(res => {
            // console.log('getCostItems', res.list)
            this.setState({costItem: res.list})
        })
    }

    onChange = (e) => {
        // console.log('onChange', e)
        this.setState({show: e.target.value})
    }
    
    render() {
        const props = this.props
        let { fixeds, deploys, type} = props
        const { costItem } = this.state
        deploys = deploys || []
        return (
            <div className='flex offer-carrier-header-pop'>
                <div style={{width: 160, borderRight: '1px solid #eee', paddingRight: 5, marginRight: 5}}>
                    <div>
                        {
                            fixeds.map((item, index) => {
                                if (!item.isShow) {
                                    return null
                                }
                                return (
                                    <div className='flex' style={{padding: '5px'}} key={index}>
                                        <div className="flex1">
                                        {
                                            item.title
                                        }
                                        </div>
                                        {
                                            item.isHaveMove ? 
                                            <Button onClick={() => props.onCloseFixed(index)} size="small" type="dashed" shape="circle" icon="close" />
                                            :
                                            null
                                        }
                                        
                                    </div>
                                )
                            })
                        }
                    </div>
                    <Divider style={{margin: '10px 0'}} />
                    <div>
                        <DragView
                            Item={(pro) => {
                                return (
                                    <div className='flex' key={pro.index}>
                                        <div className="flex1 offer-carrier-setheader" title={typeof pro.column === 'object' ? pro.column.title : pro.column}>
                                            {
                                                typeof pro.column === 'object' ? pro.column.title : pro.column
                                            }
                                        </div>
                                        <Button 
                                            onClick={() => props.onCloseDeploys(pro.index)} 
                                            size="small" 
                                            type="dashed" 
                                            shape="circle" 
                                            icon="close" />
                                    </div>
                                )
                            }}
                            onChangeCheckbox={props.onChangeShowColumn} 
                            moveCard={props.moveColumn} 
                            cards={deploys}
                        />
                    </div>
                </div> 
                {
                    <div ref='offercarrierpop' style={{width: 260}}>
                        <RadioGroup size="small" onChange={this.onChange} defaultValue="a">
                            <RadioButton value="a">基本</RadioButton>
                            <RadioButton value="b">费用项</RadioButton>
                            {
                                // <RadioButton value="c">其他</RadioButton>
                            }
                        </RadioGroup>
                        <div style={{marginTop: 10}}>
                        {
                            this.state.show === 'a' ?
                            // 基本 
                            <div>
                                {
                                    //基本
                                    function () {
                                        let array = fixeds.filter((item => {
                                            return item.isHaveMove && !item.isShow
                                        }))
                                        // console.log('array', array)
                                        if (array.length > 0) {
                                            return array.map((item, index) => {
                                                return (
                                                    <BaseItemView offercarrierpop={this.refs.offercarrierpop} addToHeader={props.addToHeader} key={index} {...props} text={item.title} />
                                                )
                                            })
                                        }
                                        return <span>{'无'}</span>
                                    }.bind(this)()
                                }
                            </div>
                            :
                            this.state.show === 'b' ?
                            // 费用项
                            <div>
                                <CostItemFreightView offercarrierpop={this.refs.offercarrierpop} {...props} />
                                {
                                    costItem.map((item, index) => {
                                        return (
                                            <CostItemView 
                                                offercarrierpop={this.refs.offercarrierpop}
                                                key={index}
                                                {...props}
                                                item={item}
                                            />
                                        )
                                    })
                                }
                            </div>
                            :
                            this.state.show === 'c' ?
                            // 其他
                            <div>
                            {
                                '其他'
                            }
                            </div>
                            :
                            null
                        }
                        </div>
                    </div>
                }
            </div>
        )
    }
}

/**
 * 表格头部
 * 
 * @class TableHeader
 * @extends {Component}
 */
@inject('rApi')
class TableHeader extends Component {

    state = {
        showMore: false,
        visible: false
    }

    closeThis = () => {
        this.setState({visible: false})
    }

    handleVisibleChange = (visible) => {
        this.setState({ visible })
    }

    onExportHeader = () => {
        const { getHeader, rApi, type } = this.props
        // console.log('rApi.downQuotationTemp', 'onExportHeader')
        // fetch('http://somehost/check-permission', options).then(res => {
        //     if (res.code === 0) {
                
        //     } else {
        //         alert('You have no permission to download the file!');
        //     }
        // })
        rApi.downQuotationTemp('?showFields=' + JSON.stringify(getHeader())).then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', '报价表头.xlsx')
            document.body.appendChild(link)
            link.click()
        })
        // let a = document.createElement('a')
        // let url = 'http://192.168.2.90:8088/' + rApi.downQuotationTemp() + '?showFields=' + JSON.stringify(getHeader())
        // console.log('url', url)
        // let filename = 'myfile.excel'
        // a.href = url
        // a.download = filename
        // a.click()
    }
    // onExportData = () => {
    //     // exportQuotationTemp
    //     // let { type } = this
    //     const { getHeader, rApi, type, id } = this.props
    //     rApi.exportQuotationTemp('?showFields=' + JSON.stringify(getHeader()) + '&quotationType=' + (type -1) + '&id=' + id).then(res => {
            
    //         const url = window.URL.createObjectURL(new Blob([res]))
    //         const link = document.createElement('a')
    //         link.href = url
    //         link.setAttribute('download', 'data.xlsx')
    //         document.body.appendChild(link)
    //         link.click()
    //     })
    // }

    render() {
        const props = this.props
        const { visible } = this.state
        
        return (
            <div className="flex flex-vertical-center">
                <div style={{paddingLeft: 10}}>
                    {props.tableTitle}
                </div>
                <div className="flex1" style={{textAlign: 'right'}}>
                </div>
                <div>
                    <Button 
                    onClick={props.clearAllData} 
                    style={{marginRight: 10, verticalAlign: 'middle'}} 
                    icon="close">
                        清空数据
                    </Button>
                </div>
                
                <div>
                    <Button onClick={props.onAdd} style={{marginRight: 10, verticalAlign: 'middle'}} icon="plus">
                        新建
                    </Button>
                </div>
                <div>
                    <Button 
                        onClick={this.onExportHeader} 
                        style={{marginRight: 10, verticalAlign: 'middle'}} 
                        icon="export">
                        导出表头
                    </Button>
                </div>
                {
                    props.isEdit ? (
                        <div>
                            <Button 
                                onClick={props.onExportData} 
                                style={{marginRight: 10, verticalAlign: 'middle'}} 
                                icon="export">
                                导出表数据
                            </Button>
                        </div>
                    )
                    :
                    null
                }
                <div>
                    <Upload showUploadList={false} beforeUpload={props.beforeUpload}>
                        <Button>
                            <Icon type="download" />
                            导入
                        </Button>
                    </Upload>
                </div>

                <div style={{marginLeft: 10}}>
                    <Popover
                        arrowPointAtCenter 
                        placement='top'
                        visible={visible}
                        onVisibleChange={this.handleVisibleChange}
                        title={<PopoverTitle closeThis={this.closeThis} showMore={this.state.showMore} title="设置表头" />}
                        content={<SetHeader  showMore={this.state.showMore} { ...props } />} 
                        trigger="click">
                        <Button title={'列排序'} style={{marginRight: 10, verticalAlign: 'middle'}} icon="bars" >
                        </Button>
                    </Popover>
                </div>
            </div>
        )
    }
}

const array = ['起运地', '目的地', '时效', '是否高速']

const arrayToColumns = (item, text, col, handleChangeOnSaveData) => {
    // 表格基础cell宽度为 
    80
    let width = {
        width: 80
    }
    if ((item.title === '起运地' || item.title === '目的地') && !item.isCostItem) {
        width = {
            width: 200
        }
    } else if (text && text.length > 3) {
        width = {
            width: width.width + ((text.length - 3) * 12)
        }
        // console.log('text', text, width.width)
    }
    return {
        ...width,
        className: 'text-overflow-ellipsis',
        title: <span title={text}>{text}</span>,
        titleString: text,
        itemHeader: item,
        render: (text, record, index) => {
            let value = ('isEdit' in record) ? record.data[col].value : record[col]
            return (
                <EditableCell 
                    editable={record.isEdit}
                    record={record}
                    value={value}
                    col={col}
                    itemHeader={item}
                    onChange={value => handleChangeOnSaveData(value, record, index, col)}
                />
            )
        }
    }
}

/**
 * 表格主体
 * 
 * @class DynamicTable
 * @extends {Parent}
 */
class DynamicTable extends Parent {

    constructor(props) {
        super(props);
        if (props.getThis) {
            props.getThis(this)
        }
        const { defaultValue } = props
        let fixeds = [
            {
                title: '起运地',
                isHaveMove: false,
                isShow: true,
                name: "departure",
                id: 1
            },
            {
                title: '目的地',
                name: "destination",
                isHaveMove: false,
                isShow: true,
                id: 2
            },
            {
                title: '时效',
                name: "aging",
                isHaveMove: true,
                isShow: true,
                id: 3
            },
            {
                title: '是否高速',
                name: "isHighway",
                isHaveMove: true,
                isShow: true,
                id: 4
            },
            {
                title: '产品类型',
                name: 'protype',
                isHaveMove: true,
                isShow: false,
                id: 5
            }
        ]

        this.state = {
            open: true,
            offset: 0,
            list: [],
            isEdit: false,
            removeQuotationLineId: [],
            fixeds,
            deploys: [],
            // 表格头部其他项
            others: []
        }

        if (defaultValue) {
            fixeds.forEach(ele => {
                ele.isShow = false
            })
            for (let header of defaultValue.header) {
                fixeds = fixeds.map(ele => {
                    // console.log('header.name', header.name, ele.name)
                    if (ele.name === header.name) {
                        ele.isShow = true
                    }
                    return ele
                })
            }
            // 表格头部固定项
            this.state.fixeds = fixeds

            // 表格头部费用项
            this.state.deploys = defaultValue.header.slice(fixeds.filter(item => item.isShow).length, defaultValue.header.length).map(item => item)
            
            // 表格数据
            this.state.list = defaultValue.data.map(item => item)
            this.state.isEdit = true
        }
        
        this.rABS = typeof FileReader !== "undefined" && (FileReader.prototype || {}).readAsBinaryString
    }

    
    componentWillUnmount() {
        this.state.list = []
    }
    

    getValue = () => {
        return {
            header: this.groupColumns(),
            data: this.state.list.filter(item => !item.isEdit).map(item => {
                // if (item[item.length -1] && item[item.length -1].id) {
                //     item[item.length -1] = item[item.length -1].id
                // }
                // console.log('item', item)
                let it = item.map(ele => {
                    if (ele.id) {
                        // console.log('getValue item', ele.id)
                        return ele.id
                    } else {
                        return ele
                    }
                })
                // console.log('item', it)
                return it
            }),
            removeQuotationLineId: this.state.removeQuotationLineId
        }
    }

    getHeader = () => {
        const { type } = this.props
        return this.groupColumns().map(item => {
            return item.titleString
        })
    }
    
    changeOpen = (state) => {
        this.setState({
            open: state
        })
        if (!state) {
            this.clearValue()
        }
    }

    beforeUpload = (file) => {
        let f = file
        let reader = new FileReader()
		reader.onload = (e) => {
			let data = e.target.result
			if(!this.rABS) data = new Uint8Array(data)
			this.processWb(XLSX.read(data, {type: this.rABS ? 'binary' : 'array'}))
		}
		if(this.rABS) reader.readAsBinaryString(f)
		else reader.readAsArrayBuffer(f)
        return false
    }

    /**
     * excel file to json data
     * 
     * 
     * @memberOf DynamicTable
     */
    processWb = (wb) => {
		/* get data */
		let ws = wb.Sheets[wb.SheetNames[0]]
        let data = XLSX.utils.sheet_to_json(ws, {header:1})
        const columns = this.groupColumns()
        let isTrue = true
        if (data && Object.prototype.toString.call(data) === '[object Array]') {
            let headerText = data[0]
            columns.forEach((ele, index) => {
                if (headerText[index] !== 'id' && headerText[index] !== 'ID' &&  headerText[index] !== ele.title) {
                    // console.log('表头不符合', headerText)
                    isTrue = false
                } else if (headerText[index] === 'id' || headerText[index] === 'ID') {
                    data.forEach(item => {
                        let id = {id: item[index]}
                        if (index < (item.length - 1)) {
                            // 移动id项到数据数组末尾
                            item.splice(index, 1)
                            item.push(id)
                        } else {
                            item[index] = {id: item[index]}
                        }
                    })
                }
            })
            // isTrue = true
            if (isTrue) {
                data = data.slice(1, data.length)
                data = data.map(ele => {
                    let array = []
                    array = Array.from(array)
                    if (ele.length < columns.length) {
                        columns.forEach((item, i) => {
                            array[i] = ele[i]
                        })
                    } else {
                        array = Array.from(ele)
                    }
                    // if (array.length > columns.length) {
                    //     array = array.slice(0, columns.length) // 截取多出表格部分
                    // }
                    // console.log('array1', array.length, columns.length, array)
                    // if (array.length < columns.length) {
                    //     for (let i = 0; i < columns.length - array.length; i++) {
                    //         array.push('')
                    //     }
                    // }
                    // console.log('array2', array.length, columns.length, array)
                    return array
                })
                this.setState({list: data}, () => {
                    this.searchCriteria()
                })
            } else {
                message.error('传入表头与定义表头不符合！')
            }
        } else {
            message.error('传入文件错误！')
        }
    }
    
    getData = (params) => {
        return new Promise((resolve, reject) => {
            const { limit, offset } = params
            let { list } = this.state
            list = list.slice()
            list = [...list]
            let pager = {
                total: list.length
            }
            // let data = list.map((item, index) => {
            //     return item.reduce(function(acc, cur, i) {
            //         acc[i] = cur;
            //         return acc;
            //     }, {})
            // })
            // console.log('getData', data)
            this.setState({offset: offset})
            if (list.length < offset) {
                resolve({
                    dataSource: [],
                    total: pager.total
                })
                return
            }
            // console.log('dataSource', list, list.slice(offset, offset + limit))
            resolve({
                dataSource: list.slice(offset, offset + limit), 
                total: pager.total
            })
        })
    }

    clearAllData = () => {
        this.setState({list: []}, () => {
            this.searchCriteria()
        })
    }

    groupColumns = () => {
        const { fixeds, deploys, others } = this.state
        const { type } = this.props
        let columns1 = fixeds.filter((item, index) => {
            return item.isShow
        })
        // console.log('columns1', columns1)
        let i = 0
        columns1 = columns1.map((item, index) => {
            i = index
            return arrayToColumns(item, item.title, index, this.handleChangeOnSaveData, type)
        })
        i++
        let columns2 = deploys.map((item, index) => {
            let text = typeof item === 'object' ? item.title : item
            return arrayToColumns(item, text, (index + i), this.handleChangeOnSaveData, type)
        })
        i++
        let columns3 = others.map((item, index) => {
            let text = typeof item === 'object' ? item.title : item
            return arrayToColumns(item, text, (index + i), this.handleChangeOnSaveData, type)
        })
        globelCols = [...columns1, ...columns2, ...columns3]
        return [...columns1, ...columns2, ...columns3]
    }

    moveColumn = (dragIndex, hoverIndex) => {
        const { deploys, fixeds } = this.state
        const dragCard = deploys[dragIndex]
        let { list } = this.state
        let columns1 = fixeds.filter((item, index) => {
            return item.isShow
        })
        list = list.map(ele => {
            let dragCard0 = ele[dragIndex + columns1.length]
            // ele.splice(dragIndex + fixeds.length, 1, ele[hoverIndex + fixeds.length])
            // ele.splice(hoverIndex + fixeds.length, 1, dragCard0)
            // return ele
            return update(ele, {$splice: [[(dragIndex + columns1.length), 1], [(hoverIndex + columns1.length), 0, dragCard0]]})
        })
        // editData = editData.map(ele => {
        //     let dragCard1 = ele.data[dragIndex + columns1.length]
        //     return update(ele, {data: {$splice: [[(dragIndex + columns1.length), 1], [(hoverIndex + columns1.length), 0, dragCard1]]}})
        // })
        this.setState({
            // editData: editData,
            list: list
        })
		this.setState(
            update(this.state, {
                deploys: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
                }
            }),
            () => {
                this.searchCriteria()
            }
		)
    }

    onCloseFixed = (index) => {
        let { fixeds, list } = this.state
        // fixeds.splice(index, 1)
        //  
        fixeds[index].isShow = false
        list = list.map(item => {
            item.splice(index, 1)
            return item
        })
        // editData = editData.map(item => {
        //     return  item.data.splice(index, 1)
        // })
        // console.log('editData', editData)
        this.setState({
            fixeds: fixeds,
            list: list
            // editData: editData
        })
    }

    onCloseDeploys = (index) => {
        let { fixeds, deploys, list } = this.state
        // console.log('deploys.splice(index, 1)', index, deploys.splice(index, 1))
        let columns1 = fixeds.filter((item, index) => {
            return item.isShow
        })
        deploys.splice(index, 1)
        list = list.map(item => {
            if (item.isEdit) {
                item.data.splice(index + columns1.length, 1)
                return item
            } else {
                item.splice(index + columns1.length, 1)
                return item
            }
        })
        // editData = editData.map(item => {
        //     return item.data.splice(index + columns1.length, 1)
        // })
        this.setState({
            deploys: deploys,
            list: list
        })
        // this.setState({})
    }

    /**
     * 动态设置表格头部
     * 
     * 
     * @memberOf DynamicTable
     */
    addToHeader = (d) => {
        // console.log('addToHeader', d)
        let { fixeds, deploys, list, others } = this.state
        const { type } = this.props
        if (d.type === 'base') {

            let isHave = false
            let length
            fixeds.forEach((ele, index) => {
                if (ele.title === d.title) {
                    if (ele.isShow) {
                        isHave = true
                    } else {
                        ele.isShow = true
                        length = index
                    }
                }
            })
            if (isHave) {
                message.error('表头中已存在该项！')
                return
            }
            // console.log('length', length, fixeds, list)
            list = list.map(item => {
                // console.log('item1', item)
                if (item.isEdit) {
                    item.data.splice(length, 0,{
                        ...arrayToColumns(d, d.title, length, this.handleChangeOnSaveData, type),
                        value: 0
                    })
                } else {
                    item.splice(length, 0, 0)
                }
                // console.log('item', item)
                return item
            })
            // console.log('list', list)
            // console.log('length', length, fixeds, list)
            this.setState({fixeds: fixeds, list: list})
        } else if (d.isCostItem) {
            let frontLength = fixeds.filter(item => item.isShow).length
            // let gCols = [...fixeds.filter(item => item.isShow), ...deploys]
            list = list.map((item, index) => {
                if (item.isEdit) {
                    item.data.splice(frontLength + deploys.length, 0, {
                        ...arrayToColumns(d, d.title, frontLength + deploys.length, this.handleChangeOnSaveData),
                        value: 0
                    })
                } else {
                    item.splice(frontLength + deploys.length, 0, '0')
                }
                return item
            })
            deploys.push(d)
            this.setState({deploys: deploys, list: list})
        }
    }

    onAdd = () => {
        let { list } = this.state
        let cols = this.groupColumns()
        let data = []
        data = cols.map((item, index) => {
            return {
                ...item,
                value: ''
            }
        })
        list.unshift({
            isEdit: true,
            data: data
        })

        this.setState({list: list}, () => {
            this.searchCriteria()
        })
    }

    onSaveAddNewData = (record, index) => {
        // console.log('onSaveAddNewData', record, index)
        let { list, offset } = this.state
        index += offset
        let target = list[index]
        // console.log('onSaveAddNewData2', target)
        // list.unshift(target.data.map(item => item.value))
        // editData.splice(index, 1)
        // console.log('onSaveAddNewData', record, index, target)
        list[index] = target.data.map((item, index) => {
            if (item && typeof item === 'object' && 'value' in item) {
                return item.value || 0
            } else {
                return item
            }
        })
        // console.log('onSaveAddNewData2', target, list[index])
        this.setState({list: list}, () => {
            this.searchCriteria()
        })
    }

    onSaveDeleteNewData = (record, index) => {
        let { list, offset } = this.state
        // console.log('onSaveDeleteNewData', record, index, list, offset)
        // console.log('onDeleteItem', record, index)
        index += offset
        let target = list[index]
        // console.log('onSaveDeleteNewData', target, index)
        list.splice(index, 1)
        this.setState({list: list}, () => {
            this.searchCriteria()
        })
    }

    handleChangeOnSaveData = (value, key, column, col) => {
        const { offset } = this.state
        column += offset
        const newData = [...this.state.list]
        const target = newData[column]
        // console.log('handleChangeOnSaveData', column, col, target)
        if (target) {
            target.data[col].value = value;
            this.setState({ list: newData }, () => {
                // this.searchCriteria()
            })
        }
    }

    onDeleteItem = (record, index) => {
        let { list, offset, removeQuotationLineId } = this.state
        index += offset
        let target = list[index]
        list.splice(index, 1)
        if (target && target[target.length - 1] && target[target.length - 1].id ) {
            removeQuotationLineId.push(target[target.length - 1].id)
        }
        this.setState({list: list, removeQuotationLineId: removeQuotationLineId}, () => {
            this.searchCriteria()
        })
    }

    onExportData = () => {
        const { onExportData, type } = this.props
        if (onExportData) {
            onExportData({
                header: this.getHeader(),
                type: type
            })
        }
    }

    onEditItem = (record, index) => {
        let { list, offset } = this.state
        index += offset
        let cols = this.groupColumns()
        let target = list[index]
        let data = []
        if (target.length > cols.length) {
            data = target.map((item, i) => {
                // console.log('item', item)
                if (i < cols.length) {
                    return {
                        ...cols[i],
                        value: target[i] || ''
                    }
                } else {
                    return item
                }
            })
        } else {
            data = cols.map((item, i) => {
                // console.log('item', item)
                return {
                    ...cols[i],
                    value: target[i] || ''
                }
            })
        }
        // console.log('data', data)
        list[index] = {
            isEdit: true,
            data: data
        }

        this.setState({list: list}, () => {
            this.searchCriteria()
        })
    }

    render() {
        const { edit, type, tableTitle } = this.props
        const { fixeds, deploys, others, isEdit } = this.state
        // let globelCols = this.groupColumns()
        return (
            <Table
                power={{
                    DEL_DATA: {
                        id: 'DYNAMIC_TABLE_ITEM_DEL_DATA',
                        isShow: true
                    },
                    EDIT_DATA: {
                        id: 'DYNAMIC_TABLE_ITEM_EDIT_DATA',
                        isShow: true
                    },
                }}
                parent={this}
                onSaveAddNewData={this.onSaveAddNewData}
                onSaveDeleteNewData={this.onSaveDeleteNewData}
                onDeleteItem={this.onDeleteItem}
                onEditItem={this.onEditItem}
                columns={this.groupColumns()}
                fixed='right'
                THeader={
                    <TableHeader 
                        clearAllData={this.clearAllData}
                        globelCols={globelCols}
                        tableTitle={tableTitle} 
                        type={type} 
                        onAdd={this.onAdd} 
                        addToHeader={this.addToHeader} 
                        onCloseDeploys={this.onCloseDeploys} 
                        onCloseFixed={this.onCloseFixed} 
                        moveColumn={this.moveColumn}
                        fixeds={fixeds} 
                        deploys={deploys} 
                        others={others}
                        onExportData={this.onExportData}
                        getHeader={this.getHeader}
                        isEdit={isEdit}
                        beforeUpload={this.beforeUpload}  />
                }
                getData={this.getData}
            />
        )
    }
}
 
export default DynamicTable;