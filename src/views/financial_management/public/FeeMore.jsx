import React, { Component } from 'react'
import PropTypes from 'prop-types'

/* 更多 */
export default class FeeMore extends Component {
    stete = {}

    static propTypes = {
        title: PropTypes.string, //类型标题
    }

    static defaultProps = {
        title: '预估'
    }

    render() {
        const {
            sendCarProjectEstimateList,
            className,
            title
        } = this.props
        //console.log('sendCarProjectEstimateList', sendCarProjectEstimateList)
        return (
            <div className={className}>
                <ul>
                    <li>
                        <div>状态</div>
                        <div>费用</div>
                        <div>项目</div>
                        <div>客户</div>
                    </li>
                    {/* {
                        (carrierName || driverName || phone) ?
                            <li>
                                <div>运输</div>
                                <div title={carType === 1 ? (carrierName || '无') : '现金车'}>{carType === 1 ? (carrierName || '无') : '现金车'}</div>
                                <div title={driverName || '无'}>{driverName || '无'}</div>
                                <div title={phone || '无'}>{phone || '无'}</div>
                            </li>
                            :
                            null
                    } */}
                    {
                        sendCarProjectEstimateList.map((item, index) => {
                            let keyName = title === '预估' ? 'openStatus' : title === '对账' ? 'reconciliationStatus' : 'openStatus'
                            return (
                                <li
                                    key={index}
                                >
                                    <div>
                                        {item[keyName] === 1 ? '待开立' : item[keyName] === 2 ? '已开立' : '无'}
                                    </div>
                                    <div title={item.estimatedCost || '无'}>{item.estimatedCost || '无'}</div>
                                    <div title={item.projectName || '无'}>{item.projectName || '无'}</div>
                                    <div title={item.clientName || '无'}>{item.clientName || '无'}</div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}