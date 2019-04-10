import React, { Component } from 'react'

/* 承运商更多 */
export default class CarrierMore extends Component {

    constructor (props) {
        super(props)
        this.state = {}
    }

    render() {
        const {
            carrierName,
            driverName,
            phone,
            carrierList,
            carType,
            className
        } = this.props
        return (
            <div className={className}>
                <ul>
                    <li>
                        <div>类型</div>
                        <div>承运商</div>
                        <div>联系人</div>
                        <div>电话</div>
                    </li>
                    {
                        (carrierName || driverName || phone) ?
                            <li>
                                <div>运输</div>
                                <div title={carType === 1 ? (carrierName || '无') : '现金车'}>{carType === 1 ? (carrierName || '无') : '现金车'}</div>
                                <div title={driverName || '无'}>{driverName || '无'}</div>
                                <div title={phone || '无'}>{phone || '无'}</div>
                            </li>
                            :
                            null
                    }
                    {
                        carrierList.map(item => {
                            return (
                                (item.carrierName || item.carrierContactName || item.carrierContactPhone)
                                    ?
                                    <li
                                        key={item.id || item.carrierUseWay}
                                    >
                                        <div title={item.specialBusinessName || '无'}>
                                            {item.specialBusinessName || '无'}
                                        </div>
                                        <div title={item.carrierName || '无'}>
                                            {item.carrierName || '无'}
                                        </div>
                                        <div title={item.carrierContactName || '无'}>
                                            {item.carrierContactName || '无'}
                                        </div>
                                        <div title={item.carrierContactPhone || '无'}>
                                            {item.carrierContactPhone || '无'}
                                        </div>
                                    </li>
                                    :
                                    null
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}