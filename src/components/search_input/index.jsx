import React, { Component } from 'react'
import {  Select, message, Spin } from 'antd'
import { inject, observer } from "mobx-react"
import { isArray } from '@src/utils'
import PropTypes from 'prop-types'

const Option = Select.Option

@inject('mobxTabsData', 'mobxDataBook')
@inject('rApi') 
@observer 
class SearchInput  extends Component {

    /**
     * 父组件传值接口
     */

    static propTypes = {
        dfValue: PropTypes.object, //默认值
		onChangeValue: PropTypes.func, //接收onChange值
        getDataMethod: PropTypes.string, //请求方法
        labelField: PropTypes.string, //需要格式化的值
        params: PropTypes.object, //参数
        text: PropTypes.string,
        list: PropTypes.array
    }

    state = {
        data: [],
        keyword: null, //搜索值
        type:null,
        isGetedData: false,
        loading: false
    }

    constructor (props) {
        super(props)
        let { text,  mobxDataBook, getDataMethod, labelField, getThis, dfValue } = props
        if (getThis) {
            getThis(this)
        }
        if('text' in props && props.text) {
            this.state.type = 1
        } else if ('list' in props) {
            this.state.type = 2
        } else if ('getDataMethod' in props && props.getDataMethod) {
            this.state.type = 3
        }
        this.state.keyword = dfValue.label ? dfValue.label : null
    }

    componentDidMount () {
        let { keyword } = this.state
        this.handleSearch(keyword)
    }

    fetch = (value, callback) => {
        if (this.timeout) {
            clearTimeout(this.timeout)
            this.timeout = null
        }
        this.currentValue = value
        this.fake(value, callback)
        this.timeout = setTimeout(this.fake(value, callback), 300);
    }

    fake = (v, callback) => {
        let { 
                rApi, 
                text,
                list,
                getDataMethod, 
                params,
                mobxDataBook,
                labelField
        } = this.props
        let { value, type, isGetedData } = this.state
        //if(v) {
            this.setState({
                loading: true
            })
            if (type === 1) {
                return new Promise((resolve, reject) => {
                    let typeId = mobxDataBook.getBookType(text)
                    if (!typeId) {
                        this.setState({data: [], loading: false})
                        return
                    }
                    if (!isGetedData) {
                        mobxDataBook.initData(text).then(() => {
                            let d = mobxDataBook.databook[typeId.id]
                            callback(d)
                            this.setState({
                                isGetedData: true,
                                loading: false
                            })
                            
                        }).catch(e => {
                            this.setState({loading: false})
                        })
                    } else {
                        this.setState({loading: false})
                    }
                })
            } else if (type === 3) {
                rApi[getDataMethod]({
                    ...params,
                    limit: 10, 
                    offset: 0,
                    keyword: v
                }).then(d => {
                    if (this.currentValue === v) {
                        let result = []
                        if(d && d.list) {
                            result = d.list
                        } else if(d && d.clients) {
                            result = d.clients
                        } else if(d && d.records) {
                            result = d.records
                        } else {
                            result = null
                        }
                        callback(this.changeValueToIdAndTitle(result))
                        this.setState({
                            loading: false
                        })
                    }
                }).catch(e => {
                    this.setState({
                        loading: false
                    })
                })
            }
        //}
    }

    changeValueToIdAndTitle = (data) => {
        let { labelField } = this.props
        if(data && data.length > 0) {
            return data.map(item => {
                return {
                    id: item.id,
                    title: item[labelField] || item.name
                }
            })
        }
        return []
    }

    handleSearch = (value) => {
        let { keyword } = this.state
        // console.log('handleSearch', value, keyword)
        // value = value ? value : keyword ? keyword : null
        this.fetch(value, data => this.setState({ data }));
    }
    
    handleChange = (value = {}) => {
        let { labelField } = this.props
        value.id = value.key
        value.title = value.label
        value.name = value.label
        value[labelField] = value.label
        this.props.onChangeValue(value)
        // this.setState({
        //     keyword: value.label
        // })
    }



    render() {
        const { allowClear, dfValue, placeholder } = this.props
        let { data, loading } = this.state
        const options = data.map(d => <Option key={d.id}>{d.title}</Option>)
        return (
            <Select
                allowClear={allowClear ? allowClear : false}
                showSearch
                defaultValue={dfValue}
                labelInValue
                loading={loading}
                placeholder={placeholder}
                style={{width: 200}}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={this.handleSearch}
                onChange={this.handleChange}
                notFoundContent={loading ? <span><Spin size="small" /></span> : <span>暂无数据</span>}
            >
                {options}
            </Select>
        )
    }
}

export default SearchInput 