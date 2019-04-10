import React, { Component } from 'react'

/* 关联订单更多 */
export default class OrderMore extends Component {
    stete = {}

    render() {
        const {
            sendCarOrderList,
            className
        } = this.props
        return (
            <div className={className}>
                <ul>
                    {
                        sendCarOrderList.map((item, index) => {
                            return (
                                <li
                                    key={item.id || index}
                                >
                                    {
                                        item.orderNumber
                                    }
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}