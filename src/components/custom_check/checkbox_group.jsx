import React, { Component } from 'react'
import { inject, observer } from "mobx-react"
import PropTypes from 'prop-types'
import { Checkbox } from 'antd'
const CheckboxGroup = Checkbox.Group
export default class CheckBox extends Component {

     /**
     * 父组件传值接口onChangeCheckValue、cheackList[{id: 1, label: '', value: 1}]
     * 
     * @memberof    CheckBox
     */
    static propTypes = {
		onChangeCheckValue: PropTypes.func.isRequired,
        cheackList: PropTypes.array,
        values: PropTypes.array.isRequired, //默认值
        bindValue: PropTypes.oneOfType([ //其他值id
            PropTypes.number,
            PropTypes.string
        ])

    }

    constructor(props) {
        super(props)
    }
    
    onChange = (value) => {
        this.props.onChangeCheckValue(value)
    }
   
    render() {
        const { values, bindValue, cheackList, disabled, noFlexBlock } = this.props
        return (
            <div className={!noFlexBlock ? "flex flex-vertical-center" : ""} style={{ height: !noFlexBlock ? 32 : '100%'}}>
                <div className="custom-checkbox-wrapper">
                    <CheckboxGroup
                        value={values}
                        options={cheackList.map(item => {
                            return {
                                value: item.id,
                                ...item
                            }
                        })} 
                        onChange={this.onChange}
                        disabled={disabled}
                    />
                </div>
               {
                    values.filter(item => item === bindValue).length > 0 ?
                    this.props.children
                    :
                    null
               }
            </div>
        )
    }
}
        