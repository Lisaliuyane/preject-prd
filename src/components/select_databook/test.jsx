// import { Input, Select } from 'antd';
// import React, { Component } from 'react'
// const Option = Select.Option;

// export default class PriceInput extends React.Component {

//   constructor(props) {
//     super(props);
//     const value = props.value || {};
//     console.log('value', value)
//     this.state = {
//         number: null,
//     };
//   }

//   componentWillReceiveProps(nextProps) {
//     // Should be a controlled component.
//     if ('value' in nextProps) {

//       const value = nextProps.value;
//       console.log('componentWillReceiveProps', value)
//       this.setState({number: value? value.value : null});
//     }
//   }
//   handleNumberChange = (e) => {
//     const number = e.target.value
//     // if (!('value' in this.props)) {
//     //   this.setState({number: number});
//     // }
//     this.triggerChange(number);
//   }
//   triggerChange = (changedValue) => {
//     // Should provide an event to pass value to Form.
//     console.log('changedValue', changedValue)
//     const onChange = this.props.onChange;
//     if (onChange) {
//         let obj = {value: changedValue}
//         if (changedValue && changedValue.length > 0) {
            
//         } else {
//             obj = null
//         }
//       onChange(obj);
//     }
//   }
//   render() {
//     const { size } = this.props;
//     const state = this.state;
//     return (
//       <span>
//         <Input
//           type="text"
//           size={size}
//           value={state.number}
//           onChange={this.handleNumberChange}
//           style={{ width: '65%', marginRight: '3%' }}
//         />
//       </span>
//     );
//   }
// }
import React, { Component } from 'react'
import Select from './select'

export default class RemoteSelect extends Component {

    state = {
        value: {},
    }

    constructor(props) {
        super(props)
        if (props.defaultValue) {
            this.state.value = props.defaultValue
        }
    }

    onChange = (value) => {
        this.setState({value: value})
        if (this.props.onChangeValue) {
            this.props.onChangeValue(value)
        }
    }

    componentWillReceiveProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState(value);
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