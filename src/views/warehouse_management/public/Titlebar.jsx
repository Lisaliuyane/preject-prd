import React, { Component } from 'react'
import './index.less'
import PropTypes from 'prop-types'

export default class Titlebar extends Component {
    static propTypes = {
        title: PropTypes.string, //标题文字
        style: PropTypes.object, //div样式
        cStyle: PropTypes.object, //子div样式
        tStyle: PropTypes.object, //span样式
        noMargin: PropTypes.bool, //取消marginBottom
    }
    
    static defaultProps = {
        title: '标题',
        noMargin: false
    }

    render () {
        const { title, h, pd, style, cStyle, tStyle, noMargin } = this.props
        return (
            <div className='wh-titlebar' style={{padding: `0 ${pd}px`, marginBottom: noMargin ? 0 : 5, ...style}}>
                <div className='bd-box' style={{height: h, lineHeight: h, ...cStyle}}>
                    <span className='title-text' style={{...tStyle}}>{title}</span>
                </div>
            </div>
        )
    }
}