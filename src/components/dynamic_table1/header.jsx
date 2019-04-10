import React, { Component } from 'react';
import { Input, Upload, Button, Icon, Popover, Radio, Tag, Popconfirm, InputNumber, message, Modal, Spin } from 'antd'
import SelectDataBook  from '@src/components/select_databook'
import { costItemObjectToString } from './utils'
import { inject } from "mobx-react"
import { isArray, trim } from '@src/utils'
import DragView from '@src/components/table_header_drag'
import { Scrollbars } from 'react-custom-scrollbars'
import './header.less'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const Search = Input.Search

const strNoLengthToNull = (obj) => {
    for (let key in obj) {
        if (typeof obj[key] === 'string' && obj[key].length < 1) {
            obj[key] = null
        }
    }
    return obj
}


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
        startValue: null, // 限制区间 start
        firstWeight: null, // 首重
        intervalCostUnitName: null, // 限制区间单位名称
        intervalCostUnitId: null, // 限制区间单位ID
        accountingStrategy: 1, //计费方式
        filterId: null //费用项id用于过滤费用单位
    }

    constructor(props) {
        super(props)
    }

    clearValue() {
        this.setState({
            carType: null, // 车类型ID
            carTypeName: null, // 车类型名称
            costUnitId: null, // 费用单位ID
            costUnitName: null, // 费用单位名称
            expenseItemId: null, // 费用项目ID
            expenseItemName: null, // 费用项目名称
            lowestFee: null, // 最低收费
            endValue: null, // 限制区间 end
            startValue: null, // 限制区间 start
            firstWeight: null, // 首重
            intervalCostUnitName: null, // 限制区间单位名称
            intervalCostUnitId: null, // 限制区间单位ID
            reloadDom: true,
            accountingStrategy: 1 //计费方式
        }, () => {
            this.setState({
                reloadDom: false
            })
        })
    }

    hide = () => {
        this.setState({
            visible: false,
        })
        this.clearValue()
    }

    addToHeader = () => {
        const props = this.props
        const { item, mode} = props
        const unitConfigureList = item.unitConfigureList && isArray(item.unitConfigureList) ? item.unitConfigureList.map(ele => {
            return {
                id: ele.dictionaryId,
                title: ele.dictionaryName
            }
        })
        :
        []
       // let defaultValue = unitConfigureList && unitConfigureList[0] ? unitConfigureList[0] : null
        let {
            carType, // 车类型ID
            carTypeName, // 车类型名称
            costUnitId, // 费用单位ID
            costUnitName, // 费用单位名称
            expenseItemId, // 费用项目ID
            expenseItemName, // 费用项目名称
            firstWeight, // 首重
            lowestFee, // 最低收费
            endValue, // 限制区间 end
            intervalCostUnitName, // 限制区间单位名称
            intervalCostUnitId, // 限制区间单位ID
            startValue, // 限制区间 start
            accountingStrategy //计费方式
        } = this.state
        //console.log('CostItemView', this.state)
        // if (defaultValue && (!costUnitName || !costUnitId)) {
        //     costUnitName = defaultValue.title
        //     costUnitId = defaultValue.id
        // }
        if (accountingStrategy !== 2  && (!costUnitId || !costUnitName)) {
            message.error('请选择单位!')
            return 
        }
        if (((startValue || startValue === 0) || (endValue || endValue === 0)) && !intervalCostUnitName && ((item.name && item.name !== '续重') || (item.expenseItemName  && item.expenseItemName !== '续重'))) {
            message.error('请选择限制区间单位!')
            return 
        }
        if (item.name === '首重' && (!firstWeight && !firstWeight !== 0)) {
            message.error('请输入首重重量!')
            return
        }
        if(!startValue && !endValue && intervalCostUnitId) {
            message.error('请填写限制区间!')
            return
        }
        // if((mode.businessModeName === '整车' || mode.businessModeName === '整柜') && (!carTypeName || carTypeName === null)) {
        //     message.error('请选择车型!')
        //     return
        // }
        this.hide()
        props.addToHeader({
            type: 'cost',
            title: item.name,
            carType, // 车类型ID
            carTypeName, // 车类型名称
            costUnitId, // 费用单位ID 
            costUnitName: accountingStrategy === 2 ? '月' : costUnitName, // 费用单位名称
            firstWeight, // 首重
            expenseItemId: item.id, // 费用项目ID
            expenseItemName: item.name, // 费用项目名称
            lowestFee, // 最低收费
            intervalCostUnitName, // 限制区间单位名称
            intervalCostUnitId, // 限制区间单位ID
            endValue, // 限制区间 end
            startValue, // 限制区间 start
            accountingStrategy
        })
    }

    handleVisibleChange = (visible) => {
        this.setState({ visible })
        this.clearValue()
    }

    clickItem = (id) => { //点击费用事件
        this.setState({
            filterId: id
        })
    }

    render() {
        const props = this.props
        let { type, item, offercarrierpop } = props
        const unitConfigureList = item.unitConfigureList && isArray(item.unitConfigureList) ? item.unitConfigureList.map(ele => {
                return {
                    id: ele.dictionaryId,
                    title: ele.dictionaryName
                }
            })
            :
            []
        let show = false
        let {
            visible,
            carType, // 车类型ID
            carTypeName, // 车类型名称
            costUnitId, // 费用单位ID
            costUnitName, // 费用单位名称
            expenseItemId, // 费用项目ID
            expenseItemName, // 费用项目名称
            lowestFee, // 最低收费
            intervalCostUnitName, // 限制区间单位名称
            intervalCostUnitId, // 限制区间单位ID
            firstWeight, // 首重
            endValue, // 限制区间 end
            startValue, // 限制区间 start
            reloadDom,
            accountingStrategy,
            filterId
        } = this.state
        let isFirstWeight = (item.name === '首重' && item.id === 3)
        let ContinuedWeight = (item.name === '续重' && item.id === 4)
        return (
            <Popover
                placement='topLeft'
                title='设置标签数据'
                visible={visible}
                overlayStyle={{minWidth: 310}}
                onVisibleChange={this.handleVisibleChange}
                getPopupContainer={() => offercarrierpop}
                content={
                    <div ref='offercarrierpop1'>
                        <div className="cost-item-view flex">
                            <div>计费方式：</div>
                            <div>
                                <RadioGroup 
                                    onChange={(e) => {
                                        //console.log('xxxxx', e.target.value)
                                        this.setState({
                                            accountingStrategy: e.target.value
                                        })
                                    }} 
                                    value={accountingStrategy}
                                >
                                    <Radio value={1}>计量</Radio>
                                    <Radio value={2}>月结</Radio>
                                </RadioGroup>
                            </div>
                        </div>
                        {
                            accountingStrategy === 2 ?
                            null
                            :
                            <div className='cost-item-view flex'>
                                <div>
                                    费用单位：
                                </div>
                                <div style={{width: 88}}>
                                    {
                                        reloadDom ?
                                        null
                                        :
                                        <SelectDataBook 
                                            onChangeValue={(value = {}) => this.setState({costUnitId: value.id, costUnitName: value.title})} 
                                            getPopupContainer = {() => this.refs.offercarrierpop1}
                                            //defaultValue={unitConfigureList && unitConfigureList[0] ? unitConfigureList[0] : null}
                                            // list={
                                            //     unitConfigureList
                                            // }
                                            getDataMethod={'getUnitConfigureByExpenseId'}
                                            params={{ id: filterId}}
                                            allowClear={false}
                                            size='small' />
                                    }
                                </div>
                            </div>
                        }
                        {
                            (ContinuedWeight || isFirstWeight || accountingStrategy === 2) ? null : <div className='cost-item-view'>最低收费：<InputNumber value={lowestFee} onChange={value => this.setState({lowestFee: value})} min={0} size="small" /></div>
                        }
                        {
                            (ContinuedWeight && accountingStrategy === 1) ?
                            <div className='cost-item-view'>
                                续重区间：
                                <InputNumber 
                                    value={startValue} 
                                    onChange={(value = '') => this.setState({startValue: value})} 
                                    min={0} 
                                    size="small" />
                                -
                                <InputNumber 
                                    value={endValue} 
                                    onChange={(value = '') => this.setState({endValue: value})} 
                                    min={0} 
                                    size="small" />
                            </div>
                            :
                            isFirstWeight ? null 
                            :
                            accountingStrategy === 2 ?
                            null
                            :
                            <div className='cost-item-view flex' style={{height: 24}}>
                                <div>
                                    限制区间：
                                    <InputNumber 
                                        value={startValue} 
                                        onChange={(value = '') => this.setState({startValue: value})} style={{width: 60}} 
                                        min={0}  
                                        size="small" 
                                    /> 
                                    &nbsp;-&nbsp;
                                    <InputNumber 
                                        value={endValue} 
                                        onChange={(value = '') => this.setState({endValue: value})} 
                                        style={{width: 60}} 
                                        min={0} 
                                        size="small" 
                                    />
                                    &nbsp;&nbsp;
                                </div>
                                <div style={{width: 70}}>
                                    {
                                        reloadDom ?
                                        null
                                        :
                                        <SelectDataBook 
                                            onChangeValue={(value = {}) => this.setState({intervalCostUnitId: value.id, intervalCostUnitName: value.title})} 
                                            getPopupContainer = {() => this.refs.offercarrierpop1} 
                                            //text='费用单位' 
                                            getDataMethod={'getConfigureTransportUnit'}
                                            params={{ unitClassification: 1, unitKind: 2}}
                                            size='small' />
                                    }
                                </div>
                            </div>
                        }
                        {
                            ContinuedWeight || isFirstWeight ? null : 
                            <div className='cost-item-view flex'>
                            <div>
                                设置车型：
                                </div>
                                <div style={{width: 180}}>
                                    {
                                        reloadDom ?
                                        null
                                        :
                                        <SelectDataBook 
                                            labelField={'name'}
                                            onChangeValue={(value = {}) => this.setState({carType: value.id || null, carTypeName: value.title || null})} 
                                            getPopupContainer = {() =>  this.refs.offercarrierpop1} 
                                            getDataMethod={'getCarTypes'} 
                                            params={{limit: 100, offset: 0}}  
                                            size='small' />
                                    }
                                </div>
                            </div>
                        }
                        {
                            isFirstWeight &&  accountingStrategy === 1 ?
                            <div className='cost-item-view'>首&emsp;&emsp;重：<InputNumber value={firstWeight} onChange={value => this.setState({firstWeight: value})} min={0} size="small" /></div>
                            :
                            null
                        }
                        <div style={{textAlign: 'end', 'borderTop': '1px solid #eee', paddingTop: '10px'}}>
                            <Button onClick={this.hide} style={{marginRight: 10}} size='small'>取消</Button>
                            <Button onClick={this.addToHeader} type="primary" size='small'>确定</Button>
                        </div>
                    </div>
                }
                trigger="click"
            >
                <Tag color="volcano" onClick={() => this.clickItem(item.id)}>
                    {
                        item.name
                    }
                </Tag>
            </Popover>
        )
    }
}

/**
 * 编辑费用项基本字段
 * 
 * @class CostItemView
 * @extends {OnEditCostItemView}
 */
class OnEditCostItemView extends Component {

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
        startValue: null, // 限制区间 start
        firstWeight: null, // 首重
        intervalCostUnitName: null, // 限制区间单位名称
        intervalCostUnitId: null, // 限制区间单位ID
        accountingStrategy: 1
    }

    constructor(props) {
        super(props)
        let { data } = props
        // console.log('constructor', data)
        this.state.carType = data.carType
        this.state.carTypeName = data.carTypeName
        this.state.costUnitId = data.costUnitId
        this.state.costUnitName = data.costUnitName
        this.state.expenseItemId = data.expenseItemId
        this.state.expenseItemName = data.expenseItemName
        this.state.lowestFee = data.lowestFee
        this.state.endValue = data.endValue
        this.state.startValue = data.startValue
        this.state.firstWeight = data.firstWeight
        this.state.intervalCostUnitName = data.intervalCostUnitName
        this.state.intervalCostUnitId = data.intervalCostUnitId
        this.state.accountingStrategy = data.accountingStrategy
    }
    

    editToHeader = () => {
        const props = this.props
        const { data, mode } = props
        const item = data
        let {
            carType, // 车类型ID
            carTypeName, // 车类型名称
            costUnitId, // 费用单位ID
            costUnitName, // 费用单位名称
            expenseItemId, // 费用项目ID
            expenseItemName, // 费用项目名称
            firstWeight, // 首重
            lowestFee, // 最低收费
            endValue, // 限制区间 end
            intervalCostUnitName, // 限制区间单位名称
            intervalCostUnitId, // 限制区间单位ID
            startValue,// 限制区间 start
            accountingStrategy //计费方式
        } = this.state

        if (accountingStrategy !== 2 && (!costUnitId || !costUnitName)) {
            message.error('请选择单位!')
            return 
        }
        if (((startValue || startValue === 0) || (endValue || endValue === 0)) && !intervalCostUnitName && ((item.name && item.name !== '续重') || (item.expenseItemName  && item.expenseItemName !== '续重'))) {
            message.error('请选择限制区间单位!')
            return 
        }
        if (item.expenseItemName === '首重' && (!firstWeight && !firstWeight !== 0)) {
            message.error('请输入首重重量!')
            return
        }

        if((!startValue && !endValue && intervalCostUnitId)) {
           // console.log('请填写限制区间xxxx', message)
            message.error('请填写限制区间!')
            return
        }

        // if((mode.businessModeName === '整车' || mode.businessModeName === '整柜') && (!carTypeName || carTypeName === null)) { //是否是整车
        //     message.error('请选择车型!')
        //     return
        // }
        this.hide()
        props.editToHeader(strNoLengthToNull({
            type: 'cost',
            title: item.expenseItemName,
            carType, // 车类型ID
            carTypeName, // 车类型名称
            costUnitId, // 费用单位ID 
            costUnitName, // 费用单位名称
            firstWeight, // 首重
            expenseItemId: item.expenseItemId, // 费用项目ID
            expenseItemName: item.expenseItemName, // 费用项目名称
            lowestFee, // 最低收费
            intervalCostUnitName, // 限制区间单位名称
            intervalCostUnitId, // 限制区间单位ID
            endValue, // 限制区间 end
            startValue, // 限制区间 start
            accountingStrategy
        }), props.index)
    }

    hide = () => {
        this.setState({
            visible: false,
        })
    }

    handleVisibleChange = (visible) => {
        this.setState({ visible })
    }

    render() {
        const props = this.props
        let { type, item, offercarrierpop, data } = props
        let {
            visible,
            carType, // 车类型ID
            carTypeName, // 车类型名称
            costUnitId, // 费用单位ID
            costUnitName, // 费用单位名称
            expenseItemId, // 费用项目ID
            expenseItemName, // 费用项目名称
            lowestFee, // 最低收费
            intervalCostUnitName, // 限制区间单位名称
            intervalCostUnitId, // 限制区间单位ID
            firstWeight, // 首重
            endValue, // 限制区间 end
            startValue, // 限制区间 start
            reloadDom,
            accountingStrategy,
            filterId
        } = this.state
        let isFirstWeight = firstWeight ? true : false
        let ContinuedWeight = expenseItemName === '续重' ? true : false
        return (
            <Popover
                placement='topLeft'
                title='设置标签数据'
                visible={visible}
                overlayStyle={{minWidth: 310}}
                onVisibleChange={this.handleVisibleChange}
                getPopupContainer={() => offercarrierpop}
                // content="XXXXXXXX"
                content={
                    <div ref='offercarrierpop1'>
                        <div className="cost-item-view flex">
                            <div>计费方式：</div>
                            <div>
                                <RadioGroup 
                                    onChange={(e) => {
                                        this.setState({
                                            accountingStrategy: e.target.value
                                        })
                                    }} 
                                    value={accountingStrategy}
                                >
                                    <Radio value={1}>计量</Radio>
                                    <Radio value={2}>月结</Radio>
                                </RadioGroup>
                            </div>
                        </div>
                        {
                            accountingStrategy === 2 ?
                            null
                            :
                            <div className='cost-item-view flex'>
                                <div>
                                    费用单位：
                                </div>
                                <div style={{width: 88}}>
                                    {
                                        reloadDom ?
                                        null
                                        :
                                        <SelectDataBook 
                                            onChangeValue={
                                                (value = {}) => 
                                                this.setState({costUnitId: value.id, costUnitName: value.title})
                                            } 
                                            getPopupContainer = {() => this.refs.offercarrierpop1}
                                            defaultValue={costUnitId ? {id: costUnitId, title: costUnitName} : null}
                                            //text='费用单位' 
                                            getDataMethod={'getUnitConfigureByExpenseId'}
                                            params={{ id: expenseItemId}}
                                            allowClear={false}
                                            size='small' />
                                    }
                                </div>
                            </div>
                        }
                        {
                           (ContinuedWeight || isFirstWeight || accountingStrategy === 2) ? null : <div className='cost-item-view'>最低收费：<InputNumber value={lowestFee} onChange={value => this.setState({lowestFee: value})} min={0} size="small" /></div>
                        }
                        {
                            (ContinuedWeight && accountingStrategy === 1) ?
                            <div className='cost-item-view'>
                                续重区间：
                                <InputNumber 
                                    value={startValue} 
                                    onChange={(value = '') => this.setState({startValue: value})} 
                                    min={0} 
                                    size="small" />
                                -
                                <InputNumber 
                                    value={endValue} 
                                    onChange={(value = '') => this.setState({endValue: value})} 
                                    min={0} 
                                    size="small" />
                            </div>
                            :
                            isFirstWeight ? null 
                            :
                            accountingStrategy === 2 ?
                            null
                            :
                            <div className='cost-item-view flex' style={{height: 24}}>
                                <div>
                                    限制区间：
                                    <InputNumber 
                                        value={startValue} 
                                        onChange={(value = '') => this.setState({startValue: value})} style={{width: 60}} 
                                        min={0}  
                                        size="small" 
                                    /> 
                                    &nbsp;-&nbsp;
                                    <InputNumber 
                                        value={endValue} 
                                        onChange={(value = '') => this.setState({endValue: value})} 
                                        style={{width: 60}} 
                                        min={0} 
                                        size="small" 
                                    />
                                    &nbsp;&nbsp;
                                </div>
                                <div style={{width: 70}}>
                                    {
                                        reloadDom ?
                                        null
                                        :
                                        <SelectDataBook 
                                            defaultValue={intervalCostUnitId ? {id: intervalCostUnitId, title: intervalCostUnitName} : null}
                                            onChangeValue={(value = {}) => this.setState({intervalCostUnitId: value.id || null, intervalCostUnitName: value.title || null})} 
                                            getPopupContainer = {() => this.refs.offercarrierpop1} 
                                            //text='费用单位' 
                                            getDataMethod={'getConfigureTransportUnit'}
                                            params={{ unitClassification: 1, unitKind: 2}}
                                            size='small' />
                                    }
                                </div>
                            </div>
                        }
                        {
                            ContinuedWeight || isFirstWeight ? null : 
                            <div className='cost-item-view flex'>
                            <div>
                                设置车型：
                                </div>
                                <div style={{width: 180}}>
                                    {
                                        reloadDom ?
                                        null
                                        :
                                        <SelectDataBook 
                                            defaultValue={carType ? {id: carType, name: carTypeName} : null}
                                            labelField={'name'}
                                            onChangeValue={(value = {}) => this.setState({carType: value.id, carTypeName: value.name})} 
                                            getPopupContainer = {() =>  this.refs.offercarrierpop1} 
                                            getDataMethod={'getCarTypes'} 
                                            params={{limit: 100, offset: 0}}  
                                            size='small' />
                                    }
                                </div>
                            </div>
                        }
                        {
                            (isFirstWeight && accountingStrategy === 1) ?
                            <div className='cost-item-view'>首&emsp;&emsp;重：<InputNumber value={firstWeight} onChange={value => this.setState({firstWeight: value})} min={0} size="small" /></div>
                            :
                            null
                        }
                        <div style={{textAlign: 'end', 'borderTop': '1px solid #eee', paddingTop: '10px'}}>
                            <Button onClick={this.hide} style={{marginRight: 10}} size='small'>取消</Button>
                            <Button onClick={this.editToHeader} type="primary" size='small'>确定</Button>
                        </div>
                    </div>
                }
                trigger="click"
            >
                <Button 
                    size="small" 
                    type="dashed" 
                    shape="circle" 
                    icon="edit"
                    title={`编辑${expenseItemName || ''}`}
                />
            </Popover>
        )
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
        costItem: [],
        keyWord: null, //费用名称
        loading: false,
        isEdit: false
    }

    componentDidMount() {
        this.getCostItemData()
    }

    componentWillReceiveProps(nextProps) {
        //console.log('componentWillReceiveProps', nextProps.mode)
        if(nextProps.mode !== this.props.mode) {
            this.getCostItemData(nextProps.mode)
        }
    }

    getCostItemData = (params) => {
        /**
         * cooperationOrCost 指合作承运商报价和成本规划
         * transportOrEstimate 指运输报价和成本预估
         * isCustoms 是否是关务运输
         * **/
        const { type, rApi, mode, quotationMethod, isCustoms } = this.props
        this.setState({
            loading: true
        })
        //console.log('mode', mode)
        rApi.getListByExpenseType({ // 获取费用项数据
            //...params,
            receivableOrPayable: quotationMethod === 'cooperationOrCost' ? '应付': quotationMethod === 'transportOrEstimate' ? '应收' : '',
            typeName: (isCustoms || mode.businessModeName === '报关（纯关务' || mode.businessModeId === 262) ? '关务费用' : '运输费用',
            businessModeId: (mode && mode.businessModeId) ? mode.businessModeId : null,
            ...params
        }).then(res => {
            //console.log('getListByExpenseType', res.list)
            this.setState({costItem: res, loading: false})
        }).catch(e => {
            this.setState({loading: false})
        })
    }

    onChange = (e) => {
        // console.log('onChange', e)
        this.setState({show: e.target.value})
    }
    
    render() {
        const props = this.props
        let { fixeds, deploys, type, isQuickSearchQuery, mode} = props
        const { costItem, loading, isEdit } = this.state
        deploys = deploys || []
        // console.log('TableHeader', deploys)
        return (
            // <Spin spinning={loading}>
                <div className='flex offer-carrier-header-pop'>
                    <div ref='offercarrierpop' className="flex1" style={{ borderRight: '1px solid #eee', paddingRight: 5, marginRight: 5 }}>
                        <RadioGroup size="small" onChange={this.onChange} defaultValue="a">
                            <RadioButton value="a">基本</RadioButton>
                            <RadioButton value="b">费用项</RadioButton>
                            {
                                // <RadioButton value="c">其他</RadioButton>
                            }
                        </RadioGroup>
                        {
                            this.state.show === 'b' ?
                            <Search
                                placeholder="费用名称"
                                onSearch={value => this.setState({keyWord: trim(value)}, this.getCostItemData({keyWord: trim(value)}))}
                                size="small"
                                style={{ width: 130, marginLeft: '35px',  }}
                            />
                            :
                            null
                        }
                        <div style={{marginTop: 10}}>
                        {
                            this.state.show === 'a' ?
                            // 基本 
                            <Scrollbars style={{height: 237, margin: '5px 0'}}>
                                <div>
                                    {
                                        //基本
                                        function () {
                                            let array = fixeds.filter((item => {
                                                return item.isHaveMove && !item.isShow
                                            }))
                                            // console.log('array', array, fixeds)
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
                            </Scrollbars>
                            :
                            this.state.show === 'b' ?
                            // 费用项
                            <Spin spinning={loading}>
                                <Scrollbars style={{ height: 237, margin: '5px 0'}}>
                                    <div>
                                        {
                                            // <CostItemFreightView offercarrierpop={this.refs.offercarrierpop} {...props} />
                                        }
                                        {
                                            costItem.map((item, index) => {
                                                return (
                                                    <CostItemView 
                                                        offercarrierpop={this.refs.offercarrierpop}
                                                        key={index}
                                                        {...props}
                                                        item={item}
                                                        mode={mode}
                                                    />
                                                )
                                            })
                                        }
                                    </div>
                                </Scrollbars>
                            </Spin>
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
                    <div style={{width: 360}}>
                        {
                            this.state.show === 'a' ?
                            <Scrollbars style={{ height: 267, margin: '5px 0'}}>
                                <div>
                                    <div>
                                        {
                                            fixeds.filter(item => item.isShow).map((item, index) => {
                                                return (
                                                    <div className='flex' style={{padding: '5px'}} key={index}>
                                                        <div className="flex1">
                                                        {
                                                            item.title
                                                        }
                                                        </div>
                                                        {
                                                            (item.isHaveMove && !isQuickSearchQuery) ? 
                                                            <Button onClick={() => props.onCloseFixed(index)} size="small" type="dashed" shape="circle" icon="close" title='删除'/>
                                                            :
                                                            null
                                                        }
                                                        
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    {/* <Divider style={{margin: '10px 0'}} /> */}
                                </div>
                            </Scrollbars> 
                            :
                            this.state.show === 'b' ?  
                            <Scrollbars style={{ height: 267, margin: '5px 0'}}>
                                <div>
                                    <DragView
                                        Item={(pro) => {
                                            // console.log('pro', pro)
                                            let text = costItemObjectToString({...pro.column, text: pro.column.expenseItemName})
                                            return (
                                                <div className='flex' key={pro.index}>
                                                    <div className="flex1 offer-carrier-setheader" title={text}>
                                                        {
                                                            text
                                                        }
                                                    </div>
                                                    <div style={{marginRight: '5px'}}>
                                                        <OnEditCostItemView 
                                                            editToHeader={props.editToHeader}
                                                            offercarrierpop={this.refs.offercarrierpop}
                                                            data={pro.column}
                                                            index={pro.index}
                                                            mode={mode}
                                                        />
                                                    </div>
                                                    <Button 
                                                        onClick={() => props.onCloseDeploys(pro.index)} 
                                                        size="small" 
                                                        type="dashed" 
                                                        shape="circle" 
                                                        icon="close" 
                                                        title='删除'
                                                    />
                                                </div>
                                            )
                                        }}
                                        moveCard={props.moveColumn} 
                                        cards={deploys}
                                        isNotFilter
                                    />
                                </div>
                            </Scrollbars> 
                            :
                            '其他' 
                        }
                    </div>  
                </div>
            // </Spin>
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
export default class TableHeader extends Component {

    static defaultProps={
        showButtons: {
            1: 1,
            2: 1,
            3: 1,
            4: 1,
            5: 1,
            6: 1,
            7: 1
        }
    }

    state = {
        showMore: false,
        visible: false,
        v: false
    }

    closeThis = () => {
        this.setState({visible: false})
    }

    handleVisibleChange = (visible) => {
        this.setState({ visible })
    }

    showModal = () => {
        this.setState({
          v: true,
        });
    }

    handleOk = (e) => {
        this.setState({
          v: false,
        });
      }
    
    handleCancel = (e) => {
    this.setState({
        v: false,
    });
    }

    onExportHeader = () => {
        const { getHeader, rApi, type } = this.props
        rApi.downQuotationTemp('?showFields=' + JSON.stringify(getHeader())).then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', '报价表头.xlsx')
            document.body.appendChild(link)
            link.click()
        })
    }

    render() {
        const props = this.props
        const { visible, v } = this.state
        const { showButtons, isQuickSearchQuery } = props
        const ExportData = (props) => {
            return(
                <div style={{minWidth: 65}} className="export-wrapper">
                    <div>
                        {
                            props.showButtons[3] ? 
                            <span onClick={props.onExportHeader} className="export-text">导出表头</span>
                            // <Button 
                            //     onClick={props.onExportHeader} 
                            //     style={{marginLeft: 10, verticalAlign: 'middle'}} 
                            //     icon="export"
                            // >
                            //     导出表头
                            // </Button>
                            :
                            null
                        }
                    </div>
                    {
                        props.isEdit && props.showButtons[4] ? (
                            <div>
                                <span onClick={props.onExportData} className="export-text">导出表数据</span>
                                {/* <Button 
                                    onClick={props.onExportData} 
                                    style={{marginLeft: 10, verticalAlign: 'middle'}} 
                                    icon="export"
                                >
                                    导出表数据
                                </Button> */}
                            </div>
                        )
                        :
                        null
                    }
                    {
                        props.isEdit && props.showButtons[7] ? (
                            <div>
                                <span onClick={props.onExportQuotationData} className="export-text">导出报价单</span>
                                {/* <Button 
                                    onClick={props.onExportData} 
                                    style={{marginLeft: 10, verticalAlign: 'middle'}} 
                                    icon="export"
                                >
                                    导出表数据
                                </Button> */}
                            </div>
                        ) : null
                    }
                </div>
            )
        }
        let getPopupContainer = props.getPopupContainer
        getPopupContainer = getPopupContainer || (() => document.body)
        // console.log('TableHeaderChildren', this.props.TableHeaderChildren)
        if (props.onlySetHeader) {
            return (
                <div className="flex flex-vertical-center table-header-wrapper">
                    <div style={{paddingLeft: 10}}>
                        {props.tableTitle}
                    </div>
                    <div className="flex1" style={{textAlign: 'right'}}>
                    </div>
                    <div style={{marginLeft: 10}}>
                        {/* <Popover
                            placement='topLeft'
                            visible={visible}
                            getPopupContainer={getPopupContainer}
                            onVisibleChange={this.handleVisibleChange}
                            title={<PopoverTitle closeThis={this.closeThis} showMore={this.state.showMore} title="设置表头" />}
                            content={<SetHeader showMore={this.state.showMore} { ...props } />} 
                            trigger="click">
                            <Button title={'列排序'} style={{marginRight: 10, verticalAlign: 'middle'}} icon="bars" >
                            </Button>
                        </Popover> */}
                        {
                            this.props.TableHeaderChildren ?
                            this.props.TableHeaderChildren
                            :
                            null
                        }
                        <Button title={'选择费用项'} onClick={this.showModal} style={{verticalAlign: 'middle'}} icon="bars" ></Button>
                        <Modal
                            title="设置表头"
                            bodyStyle={{height: 300, padding: '24px 10px 10px 24px'}}
                            width={700}
                            visible={v}
                            onCancel={this.handleCancel }
                            maskClosable={false}
                            footer={[
                                <Button key="submit" onClick={this.handleOk} style={{color: '#1DA57A', borderColor: '#1DA57A'}}>
                                  完成
                                </Button>
                            ]}
                        >
                            <SetHeader 
                                showMore={this.state.showMore} 
                                { ...props } 
                            />
                        </Modal>
                    </div>
                </div>
            )
        }
        
        return (
            <div className="flex flex-vertical-center" ref={v => this.export = v}>
                <div style={{paddingLeft: 10}}>
                    {props.tableTitle}
                </div>
                <div className="flex1" style={{textAlign: 'right'}}>
                </div>
                <div>
                    {
                        showButtons[1] ? 
                        <Button 
                            onClick={props.clearAllData} 
                            style={{marginLeft: 10, verticalAlign: 'middle'}} 
                            icon="close">
                            清空数据
                        </Button>
                        :
                        null
                    }
                </div>
                
                <div>
                    {
                        showButtons[2] ? 
                        <Button onClick={props.onAdd} style={{marginLeft: 10, verticalAlign: 'middle'}} icon="plus">
                            新建
                        </Button>
                        :
                        null
                    }
                </div>
                {
                    showButtons[3] ||  (props.isEdit && showButtons[4]) || (props.isEdit && showButtons[7])? 
                    <div>
                        <Popover 
                            content={
                                <ExportData 
                                    showButtons={showButtons} 
                                    onExportHeader={this.onExportHeader} 
                                    onExportData={props.onExportData}
                                    onExportQuotationData={props.onExportQuotationData}
                                    isEdit={props.isEdit}
                                />
                            } 
                            getPopupContainer={() => this.export}
                            //title="Title" 
                            trigger="click"
                        >
                            <Button style={{marginLeft: '10px'}} icon="export">导出</Button>
                        </Popover>
                    </div>
                    :
                    null
                }
                {/* <div>
                    {
                        showButtons[3] ? 
                        <Button 
                            onClick={this.onExportHeader} 
                            style={{marginLeft: 10, verticalAlign: 'middle'}} 
                            icon="export">
                            导出表头
                        </Button>
                        :
                        null
                    }
                </div>
                {
                    props.isEdit && showButtons[4] ? (
                        <div>
                            <Button 
                                onClick={props.onExportData} 
                                style={{marginLeft: 10, verticalAlign: 'middle'}} 
                                icon="export">
                                导出表数据
                            </Button>
                        </div>
                    )
                    :
                    null
                } */}
                <div>
                    {
                        showButtons[5] ? 
                        <Upload showUploadList={false} beforeUpload={props.beforeUpload}>
                            <Button style={{marginLeft: 10}}>
                                <Icon type="download" />
                                导入
                            </Button>
                        </Upload>
                        :
                        null
                    }
                </div>
                {
                    this.props.TableHeaderChildren ?
                    this.props.TableHeaderChildren
                    :
                    null
                }
                {
                    showButtons[6] ? 
                    <div style={{marginLeft: 10}}>
                        {/* <Popover
                            placement='topLeft'
                            visible={visible}
                            getPopupContainer={getPopupContainer}
                            onVisibleChange={this.handleVisibleChange}
                            title={<PopoverTitle closeThis={this.closeThis} showMore={this.state.showMore} title="设置表头" />}
                            content={<SetHeader showMore={this.state.showMore} { ...props } />} 
                            trigger="click">
                            <Button title={'列排序'} style={{marginRight: 10, verticalAlign: 'middle'}} icon="bars" >
                            </Button>
                        </Popover> */}
                        <Button title={'选择费用项'} onClick={this.showModal} style={{verticalAlign: 'middle'}} icon="bars" ></Button>
                        <Modal
                            title="设置表头"
                            bodyStyle={{height: 300, padding: '24px 10px 10px 24px'}}
                            width={700}
                            visible={v}
                            onCancel={this.handleCancel }
                            maskClosable={false}
                            footer={[
                                <Button key="submit" onClick={this.handleOk} style={{color: '#1DA57A', borderColor: '#1DA57A'}}>
                                  完成
                                </Button>
                            ]}
                        >
                            <SetHeader 
                                showMore={this.state.showMore} 
                                { ...props } 
                            />
                        </Modal>
                    </div>
                    :
                    null
                }
            </div>
        )
    }
}