import React, { Component } from 'react';
import { Table, Button, Icon, Form, Input, message } from 'antd'
import { inject, observer } from "mobx-react"
import { Row, Col } from '@src/components/grid'
import ModifyPwd from './modifyPwd'

// @inject('mobxWordBook')
@inject('rApi')  
class RightView extends Component {

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
    }
    // actionDone = () => {
    //     const { parent } = this.props
    //     if (parent.searchCriteria) {
    //         parent.searchCriteria()
    //     }
    //     message.success('操作成功！')
    // }

    // saveSubmit = () => {
    // }

    render() {
        console.log('roleDate', this.props.selectedOrigeData)
        return (
            <div className="right_wrapper" style={{ padding: '10px', maxWidth: '650px', width: '100%', minHeight: this.props.minHeight, background: 'white' }}>
                {
                    this.props.checkOrigeData == 2 ?
                    <ModifyPwd />
                    :
                    null
                }
            </div>
        );
    }
}

export default RightView;