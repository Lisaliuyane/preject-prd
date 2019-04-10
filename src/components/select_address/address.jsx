import React, { Component } from 'react';
import { inject, observer } from "mobx-react"
import Modal from '@src/components/modular_window';
import { Cascader, message, Input, Icon } from 'antd';
import PropTypes from 'prop-types'
import { isArray, cloneObject } from '@src/utils'
import './cascader.less'

const getAddressData = () => {
    return import('../../libs/address.json')
}

@inject('rApi')
export default class CascaderAddress extends Component {

    /**
     * 父组件传值接口defaultValue
     * 
     * @memberof CascaderAddress
     */
    static propTypes = {
        defaultValue: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object,
            PropTypes.array
        ]),
        selectGrade: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])
    }
    
    static defaultProps = {
        selectGrade: 4 // 1 加载城市, 2加载区县, 3加载街道, 4详细地址
    }

    state = {
        defaultValue: [],
        options: [],
        data: [],
        extra: '',
        show: true,
        isChange: false
    }

    constructor(props) {
        super(props)
        const { defaultValue, address } = props
        // console.log('constructor defaultValue', address)
        if (props.getThis) {
            props.getThis(this)
        }
        if (address) {
            // this.state.defaultValue = cloneObject(address)
            this.initData()
            if (address.pro) {
                let pro = address.pro
                if (!pro.id && pro.code) {
                    pro.id = pro.code
                    pro.value = pro.code
                }
                pro.label = pro.name
                this.state.defaultValue.push({...pro})
                // this.loadData(this.state.defaultValue)
            }
            if (address.city) {
                let city = address.city
                if (!city.id && city.code) {
                    city.id = city.code
                    city.value = city.code
                }
                city.label = city.name
                this.state.defaultValue.push({...city})
                // this.loadData(this.state.defaultValue)
            }
            if (address.dist) {
                let dist = address.dist
                if (!dist.id && dist.code) {
                    dist.id = dist.code
                    dist.value = dist.code
                }
                dist.label = dist.name
                this.state.defaultValue.push({...dist})
                // this.loadData(this.state.defaultValue)
            }
            if (address.street) {
                let street = address.street
                if (!street.id && street.code) {
                    street.id = street.code
                    street.value = street.code
                }
                street.label = street.name
                this.state.defaultValue.push({...street})
            }
            
            if (address.extra) {
                // this.state.extra = address.extra
                // this.setState({extra: address.extra})
                this.state.extra = address.extra
            }
            this.state.data = this.state.defaultValue
            // console.log('this.state.defaultValue', this.state.defaultValue)
        }
    }
    componentDidMount() {
        this.initData()
        // const cascader = this.refs.cascader
        // if (cascader && cascader.input && cascader.input.input) {
        //     cascader.input.input.value = 'xxxxxxxxxxx'
        // }
        // console.log('cascader', this.refs.cascader)
    }

    onChange = (value, selectedOptions) => {
        // console.log('onChange',  selectedOptions)
        selectedOptions = selectedOptions.map(item => {
            return {
                ...item,
                id: item.value,
                name: item.label
            }
        })
        this.setState({data: selectedOptions, isChange: true})
        const { onChageProvince, handleChangeAddress } = this.props
        if (handleChangeAddress) {
            handleChangeAddress(value, selectedOptions)
        }
        if (onChageProvince && selectedOptions && selectedOptions[0]) {
            // console.log('onChange', selectedOptions, onChageProvince)
            onChageProvince(selectedOptions[0])
        }
    }

    initData = () => {
        // const { rApi } = this.props
        // let { options } = this.state
        // return rApi.getProvinces().then((res) => {
        //     options = res.map((item, index) => {
        //         return {
        //             ...item,
        //             value: item.id,
        //             label: item.name,
        //             isLeaf: false
        //         }
        //     })
        //     this.setState({options: options})
        // })
        return getAddressData().then(data => {
            this.setState({options: data.data})
        })
    }

    loadData = (selectedOptions) => {
        // const targetOption = selectedOptions[selectedOptions.length - 1]
        // const { rApi, selectGrade } = this.props
        // // console.log('targetOption', targetOption)
        // if (selectedOptions.length === 1) {
        //     targetOption.loading = true
        //     return rApi.getCitys(targetOption).then((d) => {
        //         targetOption.loading = false
        //         targetOption.children = d.map((item, index) => {
        //             if (selectGrade === 1 || selectGrade === 'city') {
        //                 return {
        //                     ...item,
        //                     label: item.name,
        //                     value: item.id
        //                 }
        //             }
        //             return {
        //                 ...item,
        //                 isLeaf: false,
        //                 label: item.name,
        //                 value: item.id
        //             }
        //         })
        //         this.setState({
        //             options: [...this.state.options],
        //         })
        //     }).catch(e => {
        //         message.error('加载城市失败！')
        //     })
        // } else if (selectedOptions.length === 2) {
        //     targetOption.loading = true
        //     rApi.getCountys(targetOption).then(d => {
        //         targetOption.loading = false
        //         targetOption.children = d.map((item, index) => {
        //             if (selectGrade === 2 || selectGrade === 'county') {
        //                 return {
        //                     ...item,
        //                     label: item.name,
        //                     value: item.id
        //                 }
        //             }
        //             return {
        //                 ...item,
        //                 isLeaf: false,
        //                 label: item.name,
        //                 value: item.id
        //             }
        //         })
        //         this.setState({
        //             options: [...this.state.options],
        //         })
        //     }).catch(e => {
        //         message.error('加载区县失败！')
        //     })
        // } else if (selectedOptions.length === 3) {
        //     targetOption.loading = true
        //     rApi.getStreets(targetOption).then(d => {
        //         targetOption.loading = false;
        //         targetOption.children = d.map((item, index) => {
        //             return {
        //                 ...item,
        //                 label: item.name,
        //                 value: item.id
        //             }
        //         })
        //         this.setState({
        //             options: [...this.state.options],
        //         })
        //     }).catch(e => {
        //         message.error('加载街道失败！')
        //     })
        // }
    }

    
    getValue = () => {
        let {
            isChange,
            extra,
            data,
        } = this.state
        const { address } = this.props
        let province = cloneObject(data[0])
        let city = cloneObject(data[1])
        let county = cloneObject(data[2])
        let street = cloneObject(data[3])
        // console.log('province', province, data)
        if (isChange) {
            if (province) {
                province.code = province.id
                delete province.children
            }
            if (city) {
                city.code = city.id
                delete city.children
            }
            if (county) {
                county.code = county.id
                delete county.children
            }
            if (street) {
                street.code = street.id
                delete street.children
            }
            if (isChange && extra) {
                let d = {
                    pro: province,
                    city: city,
                    dist: county,
                    street: street,
                    extra: (province && province.name) || (city && city.name) || (county && county.name) || (street && street.name) ? extra : null
                }
                for (let key in d) {
                    if (!d[key]) {
                        delete d[key]
                    }
                }
                return d
            }
            let d = {
                pro: province,
                city: city,
                dist: county,
                street: street
               //  extra: (province && province.name) || (city && city.name) || (county && county.name) || (street && street.name) ? extra : null
            }
            for (let key in d) {
                if (!d[key]) {
                    delete d[key]
                }
            }
            return d
        } else {
            return Object.assign({}, address, {extra: extra})
        }
    }

    defaultValueToString = (s) => {
        s = s || []
        return s.map(item => item.name).join('/')
    }

    filter = (inputValue, path) => {
        return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1))
    }

    render() {
        const { selectGrade, getPopupContainer, mapIcon } = this.props
        let { defaultValue, options, isChange } = this.state
        if (!this.state.show) {
            return false
        }
        let def = {
            defaultValue: typeof(defaultValue) === 'object' ? defaultValue : typeof(defaultValue) === 'string' ? JSON.parse(defaultValue) : null
        }
        if (!defaultValue || defaultValue.length < 1 || !def.defaultValue) {
            def = {}
        }

        let getTContainer = {}
        if (getPopupContainer) {
            getTContainer.getPopupContainer = getPopupContainer
        } else {
            getTContainer.getPopupContainer = () => document.querySelector('#scroll-view')
        }
        // console.log('selectGrade', options, selectGrade)
        // def = {
        //     defaultValue: ['xxx', 'xxx']
        // }
        return (
            <div className="flex">
                <div className='flex1'>
                    <Cascader 
                        {...def}
                        // ref="cascader"
                        title={this.props.title}
                        style={{width: '100%'}}
                        changeOnSelect
                        showSearch={this.filter}
                        options={options} 
                        onChange={this.onChange} 
                        placeholder={this.props.placeholder ? this.props.placeholder : '选择地址'}
                        notFoundContent="暂无数据"
                        allowClear
                        // loadData={this.loadData}
                        popupClassName="cas-addr-wrapper"
                    >
                    {
                        !isChange && defaultValue && defaultValue.length > 0 ?  
                        <span
                            style={{width: '100%'}}
                            className={'ant-cascader-picker'}
                        >
                            <span className={`${'ant-cascader'}-picker-label`}>
                                {
                                    this.defaultValueToString(defaultValue)
                                }
                            </span>
                            <input type="text" className="ant-input ant-cascader-input " />
                            <Icon type="down" className="anticon anticon-down ant-cascader-picker-arrow" />
                        </span> : null
                    }
                    </Cascader>
                </div>
                <div style={{width: 140}}>
                {
                    selectGrade === 4 ?
                    <Input 
                        style={{ width: 130, marginLeft: 5 }}
                        title={this.state.extra}
                        onChange={e => this.setState({extra: e.target.value})}
                        defaultValue={this.state.extra} 
                        placeholder="输入详细地址" />
                    :
                    null
                }
                </div>
                {
                    mapIcon
                }
            </div>
        )
    }
}
        
         
// export default SourceDemo;