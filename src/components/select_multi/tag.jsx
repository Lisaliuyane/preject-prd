import React, { Component } from 'react'
import { Icon } from 'antd'
import './tag.less'
export default class CustomRemoteSelect extends Component {
    state = { 
    }
    // constructor(props) {
    //     super(props)
    // }
    render() {
            return ( 
                    <div className="tag-wrapper">
                        {this.props.itemTitle}
                        {/* <i className="anticon" onClick={() => this.props.handleShow(this.props.itemId)}></i> */}
                        <Icon type="close" theme="outlined" onClick={() => this.props.handleShow(this.props.itemId)} />
                        {/* <Icon type="close-circle" theme="outlined" /> */}
                    </div>
            )
        }

    }