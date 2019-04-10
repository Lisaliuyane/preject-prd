import React, { Component } from 'react'
class Parent extends Component {

    constructor(props) {
        super(props)
    }

    componentWillMount() {
        this.state.values = []
    }

    onChangeCheckValue = (value) => {
        let isUpdate = true
        if (this.onChangeCheckValueCallBack) {
            isUpdate = this.onChangeCheckValueCallBack(value)
        }
        if (isUpdate) {
            //console.log('onChangeCheckValue', value)
            this.setState({values: value})
        }
    }
}
 
export default Parent