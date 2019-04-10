import React, { Component } from 'react'
import { Icon, Modal, Button } from 'antd'
import './index.less'
import Quotation from './quotation'
import quotation_icon from '@src/libs/img/quotation.svg'
import { inject } from "mobx-react"

/**
 * 报价查询
 * 
 * @class LikeQuotation
 * @extends {Component}
 */
@inject('rApi')
class LikeQuotation extends Component {
    
    state={
        visible: false
    }

    show = () => {
        this.setState({visible: true})
    }

    close = () => {
        // console.log('close')
        this.setState({visible: false})
    }

    render() { 
        const { visible } = this.state
        return (
            <div className="right-bottom">
                <span 
                    onClick={this.show}
                    style={{
                        color: 'white',
                        verticalAlign: 'middle',
                        fontSize: 16,
                        padding: 4
                    }}>
                    {/* <Icon type="schedule" /> */}
                    {/* <Icon type="profile" /> */}
                    <img src={quotation_icon} />
                </span>
                
                <Modal
                    ref={v => this.view = v}
                    style={{left: 128}}
                    width={1000}
                    visible={visible}
                    title="报价快速查询"
                    onCancel={this.close}
                    footer={null}
                >
                    {
                        visible && 
                        <Quotation
                            getPopupContainer={this.view}
                            isQuickSearchQuery={true}
                            onCancel={this.close}
                        />
                    }
                </Modal>
            </div>
        )
    }
}
 
export default LikeQuotation;