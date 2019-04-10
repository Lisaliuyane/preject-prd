import React, { Component } from 'react';
import { inject, observer } from "mobx-react"
import Modal from '@src/components/modular_window';
import { Cascader, message } from 'antd';
import PropTypes from 'prop-types'
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
            PropTypes.array
        ]),
        selectGrade: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ])
    }
    
    static defaultProps = {
        selectGrade: 1 // 1 加载城市, 2加载区县,3加载街道
    }

    state = {
        defaultValue: [],
        options:[],
        data: [],
        show: true,
        isChange: false
    }

    constructor(props) {
        super(props)
        const { defaultValue } = props
        // console.log('constructor defaultValue', defaultValue)
        try {
            this.state.defaultValue = defaultValue && typeof(defaultValue) !== 'object' ? JSON.parse(defaultValue) : defaultValue
            this.state.defaultValue = this.state.defaultValue.map(item => {
                if (item.code && !item.id) {
                    return {
                        ...item,
                        id: item.code
                    }
                } else {
                    return item
                }
            })
        } catch (e) {

        }
    }

    componentDidMount() {
        this.initData()
    }

    onChange = (value, selectedOptions) => {
        selectedOptions = selectedOptions.map(item => {
            return {
                ...item,
                id: item.value,
                name: item.label
            }
        })
        value = selectedOptions.map(item => {
            return item.label
        })
        this.setState({data: selectedOptions, isChange: true})
        const { onChageProvince, handleChangeAddress } = this.props
        if (handleChangeAddress) {
            handleChangeAddress(value, selectedOptions)
        }
        if (onChageProvince) {
            onChageProvince(selectedOptions[0])
        }
    }

    initData = () => {
        // const { rApi } = this.props
        // let { defaultValue, options } = this.state
        // rApi.getProvinces().then((res) => {
        //     options = res.map((item, index) => {
        //         return {
        //             value:item.name,
        //             label:item.name,
        //             isLeaf:false,
        //             id:item.id
        //         }
        //     })
        //     if (defaultValue) {
        //         res.forEach((d,index) => {
        //             if(defaultValue[0] !== '' && defaultValue[0] === d.name) {
        //                 rApi.getCitys(d).then((res) => {
        //                     //console.log('resVul',res)
        //                     options[index].children = res.map((item) => {
        //                         return {
        //                             label: `${item.name}`,
        //                             value: `${item.name}`
        //                         }
        //                     })
        //                     this.setState({options: options})
        //                 })
        //             }
        //         })
        //     }
        //     this.setState({options: options})
        // })
        return getAddressData().then(data => {
            this.setState({ options: [{ label: '全国', value: '全国' }, ...data.data.map(item => ({
                ...item,
                value: item.label
            }))]})
        })
    }

    loadData = (selectedOptions) => {
        // const targetOption = selectedOptions[selectedOptions.length - 1]
        // const { rApi, selectGrade } = this.props
        // if (selectedOptions.length === 1) {
        //     targetOption.loading = true
        //     rApi.getCitys(targetOption).then((d) => {
        //         targetOption.loading = false
        //         targetOption.children = d.map((item, index) => {
        //             if (selectGrade === 1 || selectGrade === 'city') {
        //                 return {
        //                     id: item.id,
        //                     label: item.name,
        //                     value: item.name
        //                 }
        //             }
        //             return {
        //                 isLeaf: false,
        //                 id: item.id,
        //                 label: item.name,
        //                 value: item.name
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
        //                     id: item.id,
        //                     label: item.name,
        //                     value: item.name
        //                 }
        //             }
        //             return {
        //                 isLeaf: false,
        //                 id: item.id,
        //                 label: item.name,
        //                 value: item.name
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
        //                 id: item.id,
        //                 label: item.name,
        //                 value: item.name
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

    defaultValueToString = (s) => {
        s = s || []
        return s.join('/')
    }

    filter = (inputValue, path) => {
        return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1))
    }


    render() {
        let { defaultValue, options, isChange } = this.state
        const { getPopupContainer } = this.props
        if (!this.state.show) {
            return false
        }
        let getTContainer = {}
        let def = {
            defaultValue: typeof(defaultValue) === 'object' ? defaultValue : typeof(defaultValue) === 'string' ? JSON.parse(defaultValue) : null
        }
        if (!defaultValue || defaultValue.length < 1 || !def.defaultValue) {
            def = {}
        }
        if (getPopupContainer) {
            getTContainer.getPopupContainer = getPopupContainer
        } else {
            getTContainer.getPopupContainer = () => document.querySelector('#scroll-view')
        }
        // console.log('getPopupContainer', getPopupContainer)
        // def = {
        //     defaultValue: ['xxx', 'xxx']
        // }
       // console.log('this.props.defaultValue', this.props.defaultValue, this.defaultValueToString(this.props.defaultValue))
        return (
            <div>
               {
                    options && options.length > 10 &&
                    <Cascader 
                        //{...def}
                       // defaultValue={this.props.defaultValue}
                        {...getTContainer}
                        title={this.props.title}
                        changeOnSelect
                        showSearch={this.filter}
                        allowClear
                        style={this.props.style}
                        options={this.state.options} 
                        onChange={this.onChange} 
                        placeholder={this.props.placeholder ? this.props.placeholder : '选择省市'}
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
                                    this.defaultValueToString(this.props.defaultValue)
                                }
                            </span>
                            <input type="text" className="ant-input ant-cascader-input " />
                        </span> : null
                    }
                    </Cascader>
               }
            </div>
        )
    }
}
        
         
// export default SourceDemo;