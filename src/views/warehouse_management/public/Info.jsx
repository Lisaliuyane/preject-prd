import React, { Component } from 'react'
import { Row, Col } from '@src/components/grid'
import moment from 'moment'

const rowStyle = {height: 30}
const textStyle = { color: '#444', marginLeft: 20 }

// 收货管理
export default class Info extends Component {
    render () {
        const { curRow } = this.props
        if (!curRow) return null
        return (
            <div className={this.props.className}>
                <div style={{ height: 36, fontSize: 14, color: curRow.color, lineHeight: '36px' }}>
                    <span style={{ marginRight: 6 }}>收货单号</span><span>{curRow.singleNumber}</span>
                </div>
                <Row style={rowStyle}>
                    <Col label='客户名称' span={6}>
                        <span style={textStyle}>{curRow.clientName}</span>
                    </Col>
                    <Col label='项目名称' span={6}>
                        <span style={textStyle}>{curRow.projectName}</span>
                    </Col>
                    <Col label='收货仓库' span={6}>
                        <span style={textStyle}>{curRow.name}</span>
                    </Col>
                    <Col span={6} />
                </Row>
                <Row style={rowStyle}>
                    <Col label='到仓时间' span={6}>
                        <span style={textStyle}>{curRow.expectedTime ? moment(curRow.expectedTime).format('YYYY-MM-DD') : '-'}</span>
                    </Col>
                </Row>
            </div>
        )
    }
}

// 出货管理
export class InfoShipment extends Component {
    render() {
        const { curRow } = this.props
        if (!curRow) return null
        return (
            <div className={this.props.className}>
                <div style={{ height: 36, fontSize: 14, color: curRow.color, lineHeight: '36px' }}>
                    <span style={{ marginRight: 6 }}>出货单号</span><span>{curRow.singleNumber}</span>
                </div>
                <Row style={rowStyle}>
                    <Col label='客户名称' span={6}>
                        <span style={textStyle}>{curRow.clientName}</span>
                    </Col>
                    <Col label='订单编号' span={6}>
                        <span style={textStyle}>{curRow.projectName}</span>
                    </Col>
                    <Col label='出货仓库' span={6}>
                        <span style={textStyle}>{curRow.name}</span>
                    </Col>
                    <Col span={6} />
                </Row>
                <Row style={rowStyle}>
                    <Col label='拣货模式' span={6}>
                        <span style={textStyle}>{curRow.pickTypeName}</span>
                    </Col>
                    <Col label='交货时间' span={6}>
                        <span style={textStyle}>{curRow.deliveryTime ? moment(curRow.deliveryTime).format('YYYY-MM-DD') : '-'}</span>
                    </Col>
                    <Col span={6} />
                    <Col span={6} />
                </Row>
            </div>
        )
    }
}