import React, { Component } from 'react'
import './base.less'

class HeaderTitle extends Component {
    state={
        pid: null
    }
    render() { 
        const { 
            title
        } = this.props
        return (
            <div className="flex flex-vertical-center" style={{borderBottom: '1px solid #DDDDDD', padding: '5px 0'}}>
                <div style={{color: '#484848', fontSize: '14px'}}>{title}</div>
                <div className="flex1"></div>
                {
                    this.props.children
                }
            </div>
        )
    }
}
 
export default HeaderTitle;