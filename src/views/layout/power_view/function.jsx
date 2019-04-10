import React, { Component } from 'react'
import { inject, observer } from "mobx-react"

@inject('mobxBaseData')
@observer    
class FunctionPower extends Component {

    state = {
        power: true
    }

    constructor(props) {
        super(props)
        const { power } = props
        if (power && power.id) {
            
        }
    }

    render() {
        const { power, children, mobxBaseData } = this.props
        // console.log('FunctionPower', power)
        try {
            // console.log('FunctionPower', power, !power, !power.id, mobxBaseData.permissions[power.id])
        } catch (e) {
            // debugger
        }
        // console.log('power', !power || !power.id || power.isShow || mobxBaseData.permissions[power.id])
        if (!power || !power.id || power.isShow || mobxBaseData.permissions[power.id]) {
            // console.log('FunctionPower', power)
            // console.log('FunctionPower', power, power.id, mobxBaseData.permissions[power.id])
            return children
            
        }
        return null
    }
}

export const MethodPower = ({power, children, mobxBaseData}) => {
    if (!power || !power.id || power.isShow || mobxBaseData.permissions[power.id]) {
        // console.log('FunctionPower', power)
        // console.log('FunctionPower', power, power.id, mobxBaseData.permissions[power.id])
        console.log('MethodPower', power, mobxBaseData.permissions, children)
        return children
        
    }
    return null
}
 
export default FunctionPower;