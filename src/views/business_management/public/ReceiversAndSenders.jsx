import React, { Component } from 'react'
import { Row, Col } from '@src/components/grid'
import { addressFormat } from '@src/utils'
import PropTypes from 'prop-types'
import './index.less'

export default class ReceiversAndSenders extends Component {
    constructor (props) {
        super(props)
    }

    static propTypes = {
        senderList: PropTypes.array, //发货方列表
        receiverList: PropTypes.array, //收货方列表
        sdNameField: PropTypes.string, //发货方名称字段
        sdCodeField: PropTypes.string, //发货方代码字段
        sdAddressField: PropTypes.string, //发货方详细地址字段
        rcNameField: PropTypes.string, //收货方名称字段
        rcCodeField: PropTypes.string, //收货方代码字段
        rcAddressField: PropTypes.string, //收货方详细地址字段
        className: PropTypes.string
    }

    static defaultProps = {
        senderList: [],
        receiverList: [],
        sdNameField: 'name',
        sdCodeField: 'code',
        sdAddressField: 'address',
        rcNameField: 'name',
        rcCodeField: 'code',
        rcAddressField: 'address',
        className: ''
    }

    render () {
        const { senderList, receiverList, sdNameField, sdCodeField, sdAddressField, rcNameField, rcCodeField, rcAddressField, className, style } = this.props
        // console.log('收发货方', receiverList[0], addressFormat(senderList[0].address))
        return (
            <div className={`recive-and-send-main ${className}`} style={{ ...style  }}>
                <div className="flex">
                    <div className="send-icon">
                        <div className="send-text">发</div>
                        <div className="send-line"></div>
                    </div>
                    <div className="flex1 send-main">
                        {
                            (senderList && senderList.length) ? senderList.map((item, index) => {
                                let lf = `${item[sdNameField] || '-'}(${item[sdCodeField] || '无'})`
                                let rt = addressFormat(item[sdAddressField]) || '-'
                                return (
                                    <Row key={index} gutter={24} style={{ margin: '0px 12px' }}>
                                        <Col label="发货方名称(代码):&emsp;&emsp;" colon span={10}>
                                            <span title={lf}>{lf}</span>
                                        </Col>
                                        <Col label="详细地址:&emsp;&emsp;" colon span={13}>
                                            <span title={rt}>{rt}</span>
                                        </Col>
                                    </Row>
                                )
                            }) : <div style={{ margin: '0px 12px' }}>
                                暂无货方信息
                            </div>
                        }
                        <div className="rigth-icon"></div>
                    </div>
                </div>
                <div className="flex" style={{ marginTop: 10 }}>
                    <div className="recive-icon">
                        <span>收</span>
                    </div>
                    <div className="flex1 recive-main">
                        {
                            (receiverList && receiverList.length) ? receiverList.map((item, index) => {
                                let lf = `${item[rcNameField] || '-'}(${item[rcCodeField] || '无'})`
                                let rt = addressFormat(item[rcAddressField]) || '-'
                                return (
                                    <Row key={index} gutter={24} style={{ margin: '0px 12px' }}>
                                        <Col label="收货方名称(代码):&emsp;&emsp;" colon span={10}>
                                            <span title={lf}>{lf}</span>
                                        </Col>
                                        <Col label="详细地址:&emsp;&emsp;" colon span={13}>
                                            <span title={rt}>{rt}</span>
                                        </Col>
                                    </Row>
                                )
                            }) : <div style={{ margin: '0px 12px' }}>
                                    暂无货方信息
                            </div>
                        }
                        <div className="rigth-icon"></div>
                    </div>
                </div>
            </div>
        )
    }
}