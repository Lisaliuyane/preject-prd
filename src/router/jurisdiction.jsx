import React, { Component } from 'react';
import { inject, observer } from "mobx-react";

@inject('mobxBaseData')
@observer
export default class Jurisdiction extends Component {
    
    constructor(props) {
        super(props)
        this.state = this.initialState()
    }

    initialState() {
        return {
            isGetJurisdictionData: true 
        }
    }

    render() {
        return this.state.isGetJurisdictionData ? this.props.children : 
        <div>
            等待获取权限数据
        </div>
    }
}