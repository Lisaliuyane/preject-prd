import React, { Component } from 'react'
import './index.less'
import PropTypes from 'prop-types'

export default class Footbtnbar extends Component {
    static propTypes = {
        style: PropTypes.object, //div样式
        cStyle: PropTypes.object, //子div样式
        noLine: PropTypes.bool, //无顶部border
    }
    
    static defaultProps = {
        noLine: false
    }

    render () {
        const { children, h, pd, style, cStyle, noLine } = this.props
        return (
            <div className='wh-footbtnbar' style={{padding: `0 ${pd}px`, ...style}}>
                <div className='bd-box' style={{ height: h, borderTopWidth: noLine ? 0 : 2, ...cStyle }}>
                    {
                        children ? children : null
                    }
                </div>
            </div>
        )
    }
}