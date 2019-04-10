import { Select, Spin, Input } from 'antd';
import React, { Component } from 'react'
import { inject, observer } from "mobx-react"
import { addressToPlaceholder } from '@src/utils'
import PropTypes from 'prop-types'
import './index.less'

const Option = Select.Option;

@inject('mobxWordBook')
@inject('rApi')
@observer
export default class SelectAddress extends Component {

    static propTypes = {
		address: PropTypes.object
    }

    static defaultProps = {
        isExtra: true,
        address: null
    }

    state = {
        loading1: false,
        loading2: false,
        loading3: false,
        loading4: false,
        isChange: false,
        provinceOptions: [],
        cityOptions: [],
        countyOptions: [],
        streetOptions: [],
        province: null,
        city: null,
        county: null,
        street: null,
        extra: null
    };

    constructor(props) {
        super(props)
        let { address } = props
        if (address) {
            if(address.pro){
                this.state.provinceOptions.push(address.pro)
            }
            if(address.city){
                this.state.cityOptions.push(address.city)
            }
            if(address.dist){
                this.state.countyOptions.push(address.dist)
            }
            if(address.street){
                this.state.streetOptions.push(address.street)
            }
        }

        if (address && address.extra) {
            this.state.extra = address.extra
        }
        // console.log('this.state.provinceOptions', this.state.provinceOptions)
    }

    componentDidMount() {
        let props = this.props
        let { address } = props
        if (props.getThis) {
            props.getThis(this)
        }
        if (address) {
            if (address.pro && address.pro.id) {
                let pro = address.pro
                pro.label = pro.name
                pro.key = pro.id
                this.loadcitys(pro)
            }
            if (address.city && address.city.id) {
                let city = address.city
                city.label = city.name
                city.key = city.id
                this.loadcountys(city)
            }
            if (address.dist && address.dist.id) {
                let dist = address.dist
                dist.label = dist.name
                dist.key = dist.id
                this.loadstreets(dist)
            }
            if (address.street && address.street.id) {
                let street = address.street
                street.label = street.name
                street.key = street.id
            }
            if (address.extra) {
                // this.state.extra = address.extra
                this.setState({extra: address.extra})
            }
        }
        this.setState({isChange: false})
    }

    getValue = () => {
        let {
            isChange,
            province,
            city,
            county,
            street,
            extra
        } = this.state
        // console.log('province', province)
        let { isExtra, address } = this.props
        if (province) {
            province.name = province.label
            province.id = province.key
        }
        if (city) {
            city.name = city.label
            city.id = city.key
        }
        if (county) {
            county.name = county.label
            county.id = county.key
        }
        if (street) {
            street.name = street.label
            street.id = street.key
        }
        if (isChange && isExtra) {
            return {
                pro: province,
                city: city,
                dist: county,
                street: street,
                extra: street && street.name ? extra : null
            }
        } else if (isChange) {
            return {
                pro: province,
                city: city,
                dist: county,
                street: street
            }
        } else if (isExtra) {
            return Object.assign({}, address, {extra: extra})
        } else {
            return address
        }
    }

    onChageProvince = () => {
        // console.log('onChageProvince', province)
        let {
            province
        } = this.state
        // console.log('province', province.name)
        if (province) {
            province.name = province.label
            province.id = province.key
        }
        if (this.props.onChageProvince) {
            this.props.onChageProvince(province)
        }
    }

    onChageCity = () => {
        let {
            city,
        } = this.state
        if (city) {
            city.name = city.label
            city.id = city.key
        }
        if (this.props.onChageCtity) {
            this.props.onChageCtity(city)
        }
    }

    clearSelection(ref) {
        if (ref) {
            ref.rcSelect.onClearSelection({stopPropagation: () => {}})
        }
    }

    handleProvinceChange = (value, selectedOptions) => {
        // console.log('handleProvinceChange', value)
        this.setState({
            province: value,
            isChange: true,
            city: null,
            county: null,
            street: null,
            cityOptions: [],
            countyOptions: [],
            streetOptions: []
        }, () => {
            this.onChageProvince()
        })
        this.clearSelection(this.refs.city)
        this.clearSelection(this.refs.county)
        this.clearSelection(this.refs.street)
        if (value)
        this.loadcitys(value)
    }

    handleCityChange = (value, selectedOptions) => {
        this.setState({
            city: value,
            countyOptions: [],
            streetOptions: [],
            county: null,
            street: null
        })
        this.clearSelection(this.refs.county)
        this.clearSelection(this.refs.street)
        if (value)
        this.loadcountys(value)
    }
    
    handleCountyChange = (value, selectedOptions) => {
        this.setState({county: value, street: null, streetOptions: []})
        this.clearSelection(this.refs.street)
        if (value)
        this.loadstreets(value)
    }

    handleStreetChange = (value, selectedOptions) => {
        this.setState({street: value})
    }

    loadProvinces = () => {
        if (this.state.provinceOptions.length < 2) {
            let { mobxWordBook } = this.props
            this.setState({loading1: true})
            mobxWordBook.getProvinces().then(provinces => {
                this.setState({loading1: false, provinceOptions: provinces || []})
            }).catch(e => {
                this.setState({loading1: false})
            })
        }
    }

    loadcitys = (value) => {
        let { rApi } = this.props
        value.id = value.key
        this.setState({loading2: true})
        rApi.getCitys(value).then(res => {
            this.setState({loading2: false, cityOptions: res || []})
        }).catch(e => {
            this.setState({loading2: false})
        })
    }

    loadcountys = (value) => {
        let { rApi } = this.props
        value.id = value.key
        this.setState({loading3: true})
        rApi.getCountys(value).then(res => {
            this.setState({loading3: false, countyOptions: res || []})
        }).catch(e => {
            this.setState({loading3: false})
        })
    }

    loadstreets = (value) => {
        let { rApi } = this.props
        value.id = value.key
        this.setState({loading4: true})
        rApi.getStreets(value).then(res => {
            this.setState({loading4: false, streetOptions: res || []})
        }).catch(e => {
            this.setState({loading4: false})
        })
    }

    render() {
        let {
            isChange,
            loading1,
            loading2,
            loading3,
            loading4,
            province,
            // city,
            // county,
            // street,
            provinceOptions, 
            cityOptions, 
            countyOptions, 
            streetOptions 
        } = this.state
        let { address, isExtra } = this.props
        address = address || {}
        let placeholder = addressToPlaceholder(address)
        let placeholder1 = !isChange && placeholder && placeholder[0] ?  placeholder[0] : '省'
        let placeholder2 = !isChange && placeholder && placeholder[1] ?  placeholder[1] : '市'
        let placeholder3 = !isChange && placeholder && placeholder[2] ?  placeholder[2] : '县'
        let placeholder4 = !isChange && placeholder && placeholder[3] ?  placeholder[3] : '街道'
        let defaultValue = address.pro ? {defaultValue: {key:address.pro.id}} : {}
        let defaultValue1 = address.city ? {defaultValue: {key:address.city.id}} : {}
        let defaultValue2 = address.dist ? {defaultValue: {key:address.dist.id}} : {}
        let defaultValue3 = address.street ? {defaultValue: {key:address.street.id}} : {}
        // console.log('this.state.provinceOptions', this.state.provinceOptions, provinceOptions)
        return (
        <div className="select-address-box">
            <Select
                {...defaultValue}
                labelInValue
                placeholder={placeholder1}
                notFoundContent={loading1 ? <Spin size="small" /> : null}
                onSearch={this.loadProvinces}
                onFocus={this.loadProvinces}
                style={{ width: 118 }}
                allowClear={true}
                onChange={this.handleProvinceChange}>
                {
                    provinceOptions.map((item, index) => 
                        <Option key={item.id} value={item.id}>
                        {item.name}
                        </Option>
                    )
                }
            </Select>

            <Select 
                {...defaultValue1}
                ref='city'
                labelInValue
                placeholder={placeholder2}
                allowClear={true}
                notFoundContent={loading2 ? <Spin size="small" /> : null}
                style={{ width: 118 }} 
                onChange={this.handleCityChange}>
                {
                    cityOptions.map((item, index) => 
                        <Option key={item.id} value={item.id}>
                            {item.name}
                        </Option>
                    )
                }
            </Select>

            <Select
                {...defaultValue2} 
                labelInValue
                allowClear={true}
                placeholder={placeholder3}
                ref='county'
                notFoundContent={loading3 ? <Spin size="small" /> : null}
                style={{ width: 118 }} 
                onChange={this.handleCountyChange}>
                {
                    countyOptions.map((item, index) => 
                        <Option key={item.id} value={item.id}>
                        {item.name}
                        </Option>
                    )
                }
            </Select>

            <Select
                {...defaultValue3} 
                labelInValue
                allowClear={true}
                placeholder={placeholder4}
                ref='street'
                notFoundContent={loading4 ? <Spin size="small" /> : null}
                style={{ width: 118 }} 
                onChange={this.handleStreetChange}>
                {
                    streetOptions.map((item, index) => 
                        <Option key={item.id} value={item.id}>
                        {item.name}
                        </Option>
                    )
                }
            </Select>

            {
                isExtra ? 
                <Input 
                    style={{ width: 130, marginTop: 1 }}
                    title={this.state.extra}
                    onChange={e => this.setState({extra: e.target.value})}
                    defaultValue={this.state.extra} 
                    placeholder="输入详细地址" />
                :
                null
            }
            </div>
        );
    }
}