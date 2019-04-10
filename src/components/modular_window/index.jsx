import React, { Component } from 'react'
import { Button, Icon } from 'antd'
import Header from "./header"
import ModularParent from "./modular_parent"
import Dragger from '../dragger-r'
import ReactDOM from 'react-dom'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { headerHeight, tabBarHeight } from '@src/views/layout/config'
import './index.less'

/** 
 * 默认弹框组件
*/
const Footer = props => (
    <div className='custom-modal-footer'>
        {props.customButton}
        <Button onClick={props.onSubmit}  key='ok' loading={props.loading} style={{color: '#fff', background: '#18B583', border: 0}}>{props.footerText ? props.footerText : '确定'}</Button>
        <Button onClick={props.onCancal} key='close'>取消</Button>
    </div>
)

/**
 * 弹框组件
 * 
 * @class Modal
 * @extends {Component}
 */
@inject('mobxBaseData')
@observer
class Modal extends Component {

    static propTypes = {
        getContentDom: PropTypes.func,
        className: PropTypes.string
    }

    static defaultProps = {
        open: false,
        haveFooter: false,
        isHaveRenderBody: false,
        stopDragEvent: true,
        className: ''
    }

    state = {
        show: false,
        height: 800
    }

    upDateView=true
    draggerCount=0

    constructor(props) {
        super(props)
        this.state.show = this.props.open
        // console.log('React', React)
        // this.view = React.createRef()
        // console.log('Dragger', Dragger)
    }
    /**
     * 设置box最高高度
     * 
     * 
     * @memberOf Modal
     */
    componentDidMount() {
        let view = document.querySelector('.home-left-sider')
        if (view) {
            this.setState({
                show: this.props.open
            }, () => {
                this.onWindowResize()
            })
        }
        window.addEventListener('resize', this.onWindowResize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize)
    }

    onWindowResize = () => {
        let width =document.body.offsetWidth - document.querySelector('.home-left-sider').offsetWidth
        this.setState({ height: window.innerHeight - headerHeight - tabBarHeight, width: width })
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.open !== this.props.open) {
            // console.log('componentWillReceiveProps', nextProps.open)
            this.setState({show: nextProps.open}, () => {
                if (nextProps.open) {
                    this.setState({})
                }
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log('shouldComponentUpdate',  nextProps.open || nextState.show || (nextState.show !== this.state.show) || nextProps.open !== this.props.open)
        // console.log('this.upDateView', this.upDateView)
        if (this.upDateView) {
            return true
        }
        return nextProps.open || nextState.show || (nextState.show !== this.state.show) || nextProps.open !== this.props.open || (nextState.width !== this.state.width)
        // return true
    }

    close = () => {
        if (this.props.changeOpen) {
            this.props.changeOpen(false)
        } else {
            this.setState({show: false})
        }
    }

    stopEvent(e) {
        if (e.stopPropagation) {
            e.stopPropagation()
        }
    }

    onSubmit = () => {
        if (this.props.onSubmit) {
            this.props.onSubmit()
        }
    }

    onCancal = () => {
        if (this.props.onCancal) {
            this.props.onCancal()
        } else {
            this.close()
        }
    }

    stopPropagationDragEvent = (e, dragType) => {
        const { stopDragEvent } = this.props
        if (e && e.stopPropagation && stopDragEvent) {
            e.stopPropagation()
        }
        if (dragType === 'start') {
            let formErrorPop = document.body.querySelectorAll('.form-error-pop')
            formErrorPop.forEach(item => {
                if (item && item.style) {
                    item.style.display = 'none'
                }
            })
        }
        if (dragType === 'end') {
            let formErrorPop = document.body.querySelectorAll('.form-error-pop')
            formErrorPop.forEach(item => {
                if (item && item.style) {
                    item.style.display = ''
                }
            })
            if (this.draggerCount < 2) {
                this.onDrag()
            }
            this.draggerCount++
        }
    }

    onDrag = () => {
        const { parent } = this.props
        if (!parent) {
            return
        }
        const { form } = parent.props
        if (!form) return
        let errors = form.getFieldsError()
        if (errors) {
            errors = Object.values(errors).some(item => item)
        }
        if (errors) {
            form.validateFields((err, values) => {})
        }
    }

    cal = () => {
        const { mobxBaseData } = this.props
        const { height } = this.state
        let width = mobxBaseData.pageWidth
        let  view = this.refs.view
        // console.log('this.view', width, height)
        if (view) {
            let offsetHeight = view.offsetHeight
            let w = (width - 60) / 2 
            let h = (height - offsetHeight) / 2
            //  console.log('height', height)
            this.upDateView = false
            return { left: w, top: h, right: w, bottom: h + offsetHeight - headerHeight - tabBarHeight + 50 }
        }
        let w = width / 2
        let h = height / 2
        this.upDateView = true
        return { left: w, top: h, right: w, bottom: h + 220}
    }

    render() {
        let { height, show } = this.state
        let { style, title, footer, haveFooter, loading, mobxBaseData, isHaveRenderBody, footerText, getContentDom, children, className } = this.props
        if (!show) return null
        let view = (
            <div>
                <div
                    className={`custom-modal flex flex-level-center flex-vertical-center ${className}`}
                    style={{ 
                        left: mobxBaseData.siderWidth,
                        width: mobxBaseData.pageWidth,
                        height: height,
                        zIndex: 100,
                        top: headerHeight + tabBarHeight
                    }}>
                    <Dragger
                        style={style}
                        bounds={this.cal}
                        dragEvent={this.stopPropagationDragEvent}
                        hasDraggerHandle={true}
                    >
                        <div 
                            // onClick={this.stopEvent} 
                            // style={style}
                            ref='view'
                            className='custom-modal-box paper-3'>
                            {
                                title ? (
                                    <div>
                                        <div className='custom-modal-title flex flex-vertical-center'>
                                            <div className='handle' style={{flex: 1, padding: '0 20px', cursor: 'move', fontSize: '14px'}}>
                                                {
                                                    title
                                                }
                                            </div>
                                            <div onClick={this.close.bind(this)} className='custom-modal-close'>
                                                <Icon type='close' />
                                            </div>
                                        </div>
                                    </div>
                                ) :
                                null
                            }
                            <div ref={v => {
                                this.content = v
                                if (getContentDom) {
                                    getContentDom(v)
                                }
                            }} className='custom-modal-content' style={{ maxHeight: haveFooter ? height - 41 - 60 : height - 60}}>
                                {
                                    children
                                }
                            </div>
                            {
                                footer && 
                                <div className='custom-modal-footer'>
                                {footer}
                                </div>
                            }
                            {
                                haveFooter &&
                                <Footer 
                                    onSubmit={this.onSubmit} 
                                    onCancal={this.onCancal} 
                                    loading={loading} 
                                    footerText={footerText} 
                                    customButton={this.props.customButton}
                                />
                            }
                        </div>
                    </Dragger>
                </div>
            </div>
        )
        if (isHaveRenderBody) {
            return ReactDOM.createPortal(view, document.body)
        }
        return view
    }
}

Modal.Header = Header
Modal.ModularParent = ModularParent
 
export default Modal;