import React, { Component } from 'react'
import { Select, Spin } from 'antd';
import { inject, observer } from "mobx-react"
import PropTypes from 'prop-types'
import { isArray } from '@src/utils'

const Option = Select.Option;

@inject('mobxDataBook')
@inject('rApi')
@observer
export default class RemoteSelect extends Component {

    /**
     * 父组件传值接口onChangeValue、text、getDataMethod、params
     * 
     * @memberof RemoteSelect
     */
    static propTypes = {
		onChangeValue: PropTypes.func.isRequired,
		dealData: PropTypes.func, // 处理数据方法，必须return一个数组
        text: PropTypes.string,
        list: PropTypes.array,
        getData: PropTypes.func,
        getDataMethod: PropTypes.string,
        dataKey: PropTypes.string,
        labelField: PropTypes.string,
        params: PropTypes.object,
        getThis: PropTypes.func,
        timelyFilter: PropTypes.bool,
        forceRender: PropTypes.bool, //是否重新渲染一次select
        keyName: PropTypes.string, // 下拉列表key键名
        style: PropTypes.object, //style样式
        showOrigin: PropTypes.bool, //下拉选项数据显示原始数据
        hasInput: PropTypes.bool, //是否有搜索自定义输入功能
        inputKey: PropTypes.string, //搜索自定义项 key 值
    }

    static defaultProps = {
        labelField: 'title',
        dataKey: 'records',
        forceRender: false,
        keyName: 'id',
        style: {},
        showOrigin: false,
        hasInput: false,
        inputKey: '-1'
    }

    state = {
        type:null,
        defaultValue: [],
        data: [],
        value: [],
        isGetedData: false,
        loading: true,
        inputOpt: null, //搜索输入内容
    }
    
    constructor(props) {
        super(props)
        let { defaultValue, mode, labelField, getThis, keyName } = props
        if (getThis) {
            getThis(this)
        }
        if(defaultValue && mode){
            if (defaultValue.length > 0) {
                this.state.data.push(...defaultValue)
            }
        } else if (defaultValue && (defaultValue[keyName] || defaultValue[labelField])) {
            this.state.data.push(defaultValue);
        }
        if('text' in props && props.text) {
            this.state.type = 1
        } else if ('list' in props) {
            this.state.type = 2
        } else if ('getDataMethod' in props && props.getDataMethod) {
            this.state.type = 3
        } else if ('getData' in props && props.getData) {
            this.state.type = 4
        }
    }

    onFocus = (e) => {
        let { 
            list, 
            text,
            mobxDataBook, 
            rApi, 
            getDataMethod,
            params,
            dataKey,
            getData,
            dealData
        } = this.props
        let { data, type, isGetedData } = this.state
        // console.log('onFocus',type)
        this.setState({loading: true})
        if (type === 1) {
            return new Promise((resolve, reject) => {
                let typeId = mobxDataBook.getBookType(text)
                // console.log('mobxDataBook', mobxDataBook, typeId)
                if (!typeId) {
                    this.setState({data: [], loading: false})
                    return
                }
                if (!isGetedData) {
                    mobxDataBook.initData(text).then(() => {
                        let d = mobxDataBook.databook[typeId.id]
                        if (dealData) {
                            d = dealData(d)
                        }
                        this.setState({
                            data: d || [],
                            loading: false,
                            isGetedData: true
                        })
                    }).catch(e => {
                        this.setState({loading: false})
                    })
                } else {
                    this.setState({loading: false})
                }
            })
        } else if (type === 2) {
            return new Promise((resolve, reject) => {
                if (dealData) {
                    list = dealData(list)
                }
                //console.log('list', list)
                this.setState({loading: false, data: list})
                resolve(list)
            })
        } else if (type === 3) {
            if (!rApi[getDataMethod]) {
                return new Promise((resolve, reject) => {
                    this.setState({loading: false})
                    reject('getDataMethod is null')
                })
            }
            return rApi[getDataMethod](params).then(d => {
                let list = []
                if (isArray(d)) {
                    list = d
                } else if (d && isArray(d[dataKey])) {
                    list = d[dataKey]
                } else if (isArray(d.list)) {
                    list = d.list
                } else if (isArray(d.clients)) {
                    list = d.clients
                } else if (isArray(d.records)) {
                    list = d.records
                } else if (d.page && isArray(d.page.records)) {
                    list = d.page.records
                } else {
                    list = d
                }
                if (dealData) {
                    list = dealData(list)
                }
                this.setState({data: list, loading: false})
            }).catch(e => {
                console.log(e)
                this.setState({loading: false})
            })
        } else if (type === 4) {
            return getData().then(d => {
                this.setState({data: d, loading: false})
            }).catch(e => {
                this.setState({loading: false})
            })
        }
    }

    handleChange = async (value) => {
        const { mode, labelField, showOrigin, keyName, inputKey, hasInput } = this.props
        if (mode) {
            //console.log('value', value)
            if (isArray(value)) {
                value = value.map(item => {
                    return {
                        ...item,
                        [labelField]: item.label,
                        id: item.key
                    }
                })
            }
        } else {
            if (value) {
                let key = value.key
                if (key !== inputKey) {/* 如果不是选中搜索自定义输入项 */
                    this.setState({ inputOpt: null })
                }
                if (showOrigin) {/* 原始获取的下拉数据 */
                    value = Object.assign(value, {
                        ...this.state.data.find(item => {
                            return item[keyName] === key
                        })
                    })
                    if (hasInput) {/* 如果开启搜索输入 */
                        value = Object.assign(value, {
                            [keyName]: key,
                            [labelField]: value.label
                        })
                    }
                } else {/* 自定义下拉数据 */
                    value[keyName] = key
                    value.title = value.label
                    value.name = value.label
                    value[labelField] = value.label
                    value.origin_data = this.state.data.filter(item => {
                        return item[keyName] === key
                    })
                }
            } else {
                this.setState({ inputOpt: null })
            }
        }
        // console.log('handleChange', value)
        if (this.props.onChangeValue) {
            this.props.onChangeValue(value)
        }
    }

    /* 文本框值变化 */
    onSearch = (val) => {
        const { keyName, labelField, hasInput, inputKey } = this.props
        if (hasInput) {/* 如果开启了自定义搜索输入 */
            let { data, inputOpt } = this.state
            let result = data.filter(item => {
                return item[labelField].indexOf(val) !== -1
            })
            if (val && result.length < 1) {/* 未搜索出相应项 */
                inputOpt = {
                    [keyName]: inputKey,
                    [labelField]: val
                }
                this.setState({ inputOpt })
                // console.log('onSearch', inputOpt)
            } else {/* 已存在相应项 */
                this.setState({ inputOpt: null })
            }
        } else {}
    }

    // /* 失去焦点 */
    handleBlur = () => {

    }

    getList = () => {
        return this.state.data
    }

    render() {
        let { loading, data, type, inputOpt } = this.state;
        const { labelField, placeholder, mode, defaultValue, size, getPopupContainer, disabled, timelyFilter, list, dealData, forceRender, keyName, style, dropdownStyle, hasInput } = this.props
        let getTContainer = {}
        let haveDisabled = {}
        if (timelyFilter && type === 2) {
            data = dealData ? dealData(list) : list
        }
        if ('disabled' in this.props) {
            haveDisabled.disabled = disabled
        }
        
        if (getPopupContainer) {
            getTContainer.getPopupContainer = getPopupContainer
        } else {
            getTContainer.getPopupContainer = () => document.querySelector('#scroll-view')
        }
        if (mode) {
            let defaultValue2
            if (defaultValue && mode) {
                defaultValue2 = defaultValue.map((ele) => {
                    return {key: ele.id}
                })
                defaultValue2 = {defaultValue: defaultValue2}
            }
            return (
                <Select
                    {...defaultValue2}
                    {...getTContainer}
                    {...haveDisabled}
                    labelInValue
                    size={size}
                    mode={mode}
                    onChange={this.handleChange}
                    onFocus={this.onFocus}
                    onClick={this.onFocus}
                    allowClear={'allowClear' in this.props ? this.props.allowClear : true}
                    notFoundContent={loading ? <span><Spin size="small" /></span> : <span>暂无数据</span>}
                    style={Object.assign({}, { width: '100%' }, style)}
                    dropdownStyle={dropdownStyle}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {
                        data.map((value, index) => {
                            return (
                                <Option key={value.id} value={value.id} title={value[labelField]}>
                                    {value[labelField]}
                                </Option>
                            )
                        }
                        )
                    }
                </Select>
            )
        }
        let defaultValue1 = defaultValue && (defaultValue[keyName] || defaultValue[labelField]) ? {defaultValue: {key: defaultValue[keyName], title: defaultValue[labelField] || defaultValue['title']}} : { key: null, title: null }
        if (forceRender) {
            return null
        } else {
            return (
                <Select
                    {...defaultValue1}
                    {...getTContainer}
                    {...haveDisabled}
                    size={size}
                    mode={mode}
                    labelInValue
                    showSearch
                    allowClear={'allowClear' in this.props ? this.props.allowClear : true}
                    notFoundContent={loading ? <span><Spin size="small" /></span> : <span>暂无数据</span>}
                    style={Object.assign({}, { width: '100%' }, style)}
                    placeholder={placeholder || (defaultValue ? (defaultValue[labelField] || defaultValue.title) : defaultValue)}
                    optionFilterProp="children"
                    onChange={this.handleChange}
                    onFocus={this.onFocus}
                    onClick={this.onFocus}
                    onSearch={this.onSearch}
                    onBlur={this.handleBlur}
                    dropdownStyle={ dropdownStyle}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {
                        hasInput && inputOpt &&
                        <Option key={inputOpt[keyName]} value={inputOpt[keyName]} title={inputOpt[labelField]}>{inputOpt[labelField]}</Option>
                    }
                    {
                        (defaultValue1.defaultValue && isArray(data) && data.length < 1 && !data.some(item => item[keyName] === defaultValue1.defaultValue['key'])) ? 
                            <Option key={defaultValue1.defaultValue.key} value={defaultValue1.defaultValue.key}>{defaultValue1.defaultValue.title}</Option>
                        :

                        data && data.length > 0 && data.slice().map((value) =>
                            <Option key={value[keyName]} value={value[keyName]} title={value[labelField]}>{value[labelField]}</Option>
                        )
                    }
                </Select>
            )
        }
    }
}