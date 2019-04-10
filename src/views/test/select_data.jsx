import React, { Component } from 'react'
import { Select, Spin } from 'antd';
import PropTypes from 'prop-types'

const Option = Select.Option;

export default class CustomRemoteSelect extends Component {

    static propTypes = {
		onChangeValue: PropTypes.func.isRequired,
        filterField: PropTypes.string.isRequired,
        labelField: PropTypes.string.isRequired,
        placeholder: PropTypes.string,
	}

    state = {
        data: [],
        value: [],
        loading: false,
    }
    constructor(props) {
        super(props)
        let { mobxWordBook, initFirst, text, defaultValue } = props
        if(defaultValue){
            this.state.data.push(defaultValue);
            //console.log('data的值',this.state.data);
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
        let defaultValue1 = defaultValue ? {defaultValue: {key:defaultValue.title}} : {}
        let datas = data || []
        if (typeof defaultValue === 'number') {
            // console.log('defaultValue', defaultValue)
            return (
                <Select
                    showSearch
                    {...defaultValue1}
                    notFoundContent={loading ? <Spin size="small" /> : <span>暂无数据</span>}
                    style={{ width: '100%' }}
                    placeholder={placeholder || (defaultValue ? (defaultValue.title || defaultValue.username || defaultValue.id) : defaultValue)}
                    onChange={this.handleChange}
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

        return (
            <Select
                {...defaultValue1}
                labelInValue
                showSearch
                notFoundContent={loading ? <Spin size="small" /> : <span>暂无数据</span>}
                style={{ width: '100%' }}
                placeholder={placeholder || (defaultValue ? (defaultValue.title || defaultValue.name || defaultValue.username || defaultValue.id) : defaultValue)}
                onChange={this.handleChange}
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