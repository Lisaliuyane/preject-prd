import React, { Component } from 'react'
import { Select, Spin } from 'antd';
import PropTypes from 'prop-types'

const Option = Select.Option;

export default class CustomRemoteSelect extends Component {

    static propTypes = {
		onChangeValue: PropTypes.func.isRequired,
        filterField: PropTypes.string.isRequired,
        labelField: PropTypes.string.isRequired,
        placeholder: PropTypes.string || PropTypes.number
	}

    state = {
        data: null,
        value: [],
        loading: false,
        datas:[]
    }
    constructor(props) {
        super(props)
        let { defaultValue } = props
        if(defaultValue){
            this.state.datas.push(defaultValue);
        }

    }

    handleChange = (value) => {
        if (value) {
            value.id = value.key
            value.title = value.label
            value.name = value.label
        }
        this.props.onChangeValue(value)
    }
    render() {
        const { loading } = this.state;
        const { data, placeholder, labelField, filterField, defaultValue } = this.props
        let datas = data || []
        datas = datas.slice()
        if (typeof defaultValue === 'number') {
            return (
                <Select
                    showSearch
                    defaultValue={defaultValue}
                    notFoundContent={loading ? <Spin size="small" /> : <span>暂无数据</span>}
                    style={{ width: '100%' }}
                    placeholder={placeholder}
                    onChange={this.handleChange}
                    allowClear
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {
                        datas.map((value) => 
                            <Option key={value[filterField]} value={value[filterField]}>{value[labelField]}</Option>
                        )
                    }
                </Select>
            )
        }
        let defaultValue1 = defaultValue && defaultValue[filterField] ? {defaultValue: {key: defaultValue[filterField]}} : {}
        return (
            <Select
                {...defaultValue1}
                labelInValue
                showSearch
                notFoundContent={loading ? <Spin size="small" /> : <span>暂无数据</span>}
                style={{ width: '100%' }}
                placeholder={placeholder}
                onChange={this.handleChange}
                allowClear
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
                {
                    datas.map((value) => 
                        <Option key={value[filterField]} value={value[filterField]}>{value[labelField]}</Option>
                    )
                }
            </Select>
        );
    }
}