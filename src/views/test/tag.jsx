import React, { Component } from 'react'
require('./tag.less')
export default class CustomRemoteSelect extends Component {
    state = { 
    }
    constructor(props) {
        super(props)
    }
    render() {
            return ( 
                    <div className="tag-wrapper">
                        {this.props.itemTitle}
                        <i className="anticon" onClick={() => this.props.handleShow(this.props.itemId)}></i>
                    </div>
            )
        }

    }