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
        getValueForChilder: PropTypes.func, //将onchange值返回给父组件
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
        selectGrade: 4, // 1 加载城市, 2加载区县, 3加载街道, 4详细地址
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
        if (props.getThis) {
            props.getThis(this)
        }
        if (address) {
            this.initData()
            if (address.pro) {
                this.state.defaultValue.push(address.pro)
            }
            if (address.city) {
                this.state.defaultValue.push(address.city)
            }
            if (address.dist) {
                this.state.defaultValue.push(address.dist)
            }
            if (address.street) {
                this.state.defaultValue.push(address.street)
            }
            
            if (address.extra) {
                this.state.extra = address.extra
            }
            this.state.data = this.state.defaultValue
        }
    }
    componentDidMount() {
        this.initData()
    }

    onChange = (value, selectedOptions) => {
        const { onChageProvince, handleChangeAddress, getValueForChilder } = this.props
        selectedOptions = selectedOptions.map(item => {
            return {
                ...item,
                id: item.value,
                name: item.label
            }
        })
        this.setState({
            data: selectedOptions, 
            isChange: true
        }, () => {
            if(getValueForChilder) {
                let data = this.getValue()
                getValueForChilder(data)
            }
        })
        if (handleChangeAddress) {
            handleChangeAddress(value, selectedOptions)
        }
        if (onChageProvince && selectedOptions && selectedOptions[0]) {
            onChageProvince(selectedOptions[0])
        }
    }

    initData = () => {
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
        let proVul = null
        let cityVul= null
        let countyVul = null
        let streetVul = null
        if (isChange) {
            if (province) {
                proVul = province.name
            }
            if (city) {
                cityVul = city.name
            }
            if (county) {
                countyVul = county.name
            }
            if (street) {
                streetVul = street.name
            }
            let s = ''
            if(proVul) {
                s += proVul
            }
            if(cityVul) {
                s += '/'
                s += cityVul
            }
            if(countyVul) {
                s += '/'
                s += countyVul
            }
            if(streetVul) {
                s += '/'
                s += streetVul
            }
            if(extra) {
                s += ' '
                s += extra
            }
            if (isChange && extra) {
                let d = {
                    pro: proVul,
                    city: cityVul,
                    dist: countyVul,
                    street: streetVul,
                    extra: (province && province.name) && (city && city.name) ? extra : null,
                    formatAddress: s
                }
                for (let key in d) {
                    if (!d[key]) {
                        delete d[key]
                    }
                }
                return d
            }
            let d = {
                pro: proVul,
                city: cityVul,
                dist: countyVul,
                street: streetVul,
                extra: extra ? extra : null,
                formatAddress: s
            }
            for (let key in d) {
                if (!d[key]) {
                    delete d[key]
                }
            }
            return d
        } else {
            if (province) {
                proVul = address.pro
            }
            if (city) {
                cityVul = address.city
            }
            if (county) {
                countyVul = address.dist
            }
            if (street) {
                streetVul = address.street
            }
            let s = ''
            if(proVul) {
                s += proVul
            }
            if(cityVul) {
                s += '/'
                s += cityVul
            }
            if(countyVul) {
                s += '/'
                s += countyVul
            }
            if(streetVul) {
                s += '/'
                s += streetVul
            }
            if(extra) {
                s += ' '
                s += extra
            }
            return Object.assign({}, address, {extra: extra, formatAddress: s})
        }
    }

    defaultValueToString = (s) => {
        s = s || []
        return s.join('/')
    }

    filter = (inputValue, path) => {
        return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1))
    }

    render() {
        const { selectGrade, getPopupContainer, getValueForChilder } = this.props
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

        return (
            <div className="flex">
                <div className='flex1'>
                    <Cascader 
                        //{...def}
                        // ref="cascader"
                        {...getTContainer}
                        title={this.props.title}
                        style={{width: '100%'}}
                        changeOnSelect
                        showSearch={this.filter}
                        options={options} 
                        onChange={this.onChange} 
                        placeholder={this.props.placeholder ? this.props.placeholder : '选择地址'}
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
                        onChange={e => this.setState({
                            extra: e.target.value
                        }, () => {
                            if(getValueForChilder) {
                                let data = this.getValue()
                                getValueForChilder(data)
                            }
                        })}
                        defaultValue={this.state.extra} 
                        placeholder="输入详细地址" />
                    :
                    null
                }
                </div>
            </div>
        )
    }
}
        
         
// export default SourceDemo;