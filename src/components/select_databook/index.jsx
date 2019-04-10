import React, { Component } from 'react'
import Select from './select'

export default class RemoteSelect extends Component {

    state = {
        value: {},
    }

    constructor(props) {
        super(props)
        if (props.defaultValue && Object.keys(props.defaultValue).length > 0) {
            this.state.value = props.defaultValue
            this.onChange(props.defaultValue)
        } else {
            // this.onChange(null)
        }
    }

    onChange = (value) => {
        // console.log('onChange', value)
        if (this.props.onChangeValue) {
            this.props.onChangeValue(value)
        }
        const onChange = this.props.onChange;
        if (onChange) {
            let obj = value ? value : null
            onChange(obj);
        }
    }
    
    render() {
        return (
            <Select 
                {...this.props}
                onChangeValue={this.onChange}
            />
        )
    }
}