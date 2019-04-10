import React from 'react'
import Parent from './parent'
import CheckboxGroup from './checkbox_group'

export default class CustomCheckbox extends Parent {

     /**
     * 父组件传值接口onChangeCheckValue、cheackList[{id: 1, label: '', value: 1}]
     * 
     * @memberof    CheckBox
     */
    state = {}

    // constructor(props) {
    //     super(props)
       
    //     console.log('SourceDemo this', this.state, this)
    // }

    componentWillMount = () => {
        const { values } = this.props
        this.state.values = [...values]
    }
    
    
    // onChangeCheckValue = (checKVul) => {
    //     console.log('checKVul', checKVul)
    // }
    onChangeCheckValueCallBack = (values) => {
        if (this.props.onChangeValue) {
            return this.props.onChangeValue(values)
        }
        return true
    }
   
    render() {

        let { 
            values
        } = this.state

        const { list, bindValue, disabled, noFlexBlock } = this.props

        return (
            <CheckboxGroup 
                bindValue={bindValue}
                values={values}
                cheackList={list || []}
                onChangeCheckValue={this.onChangeCheckValue}
                disabled={disabled}
                noFlexBlock={noFlexBlock}
            >
                {this.props.children}
            </CheckboxGroup>
        )
    }
}
        