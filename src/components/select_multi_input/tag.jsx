import React, { Component } from 'react'
require('./tag.less')
export default class CustomRemoteSelect extends Component {
    state = { 
    }
    render() {
            return ( 
                    <div className="tag-wrapper" style={{marginBottom: '2px'}}>
                        {this.props.itemTitle}
                        <i className="anticon" onClick={() => this.props.handleShow(this.props.itemId)}></i>
                    </div>
            )
        }

    }