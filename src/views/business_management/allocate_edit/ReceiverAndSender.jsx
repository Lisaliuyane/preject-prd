import React, { Component, Fragment } from 'react'
import { Switch } from 'antd'
import { Row, Col } from '@src/components/grid'
import RemoteSelect from '@src/components/select_databook'
import ReceiversAndSenders from '../public/ReceiversAndSenders'
import './index.less'

/* 收发货方关联 */
class ReceiverAndSender extends Component {
    state = {
        isShowTransferBack: false
    }

    constructor(props) {
        super(props)
        this.state.isShowTransferBack = (props.transitPlaceOneId || props.transitPlaceOneName) ? true : props.isShowTransfer
        
    }

    /* 选择中转 */
    setTransition = (val) => {
        const { changeSendReceiveData, changeOrderDetailsData, changeSettlementData, sendCarOrderList, receiverList } = this.props
        if (val) {
            let newSendCarOrderList = [...sendCarOrderList]
            let newReceiverList = [...receiverList]
            newSendCarOrderList = newSendCarOrderList.map(item => {
                item.transitType = 2
                return item
            })
            newReceiverList = newReceiverList.map(item => {
                item.destination = val.name
                item.transitType = 2
                return item
            })
            changeSendReceiveData('receiverList', newReceiverList)
            changeOrderDetailsData('sendCarOrderList', newSendCarOrderList)
            changeSettlementData('destination', val.name)
            changeSettlementData('transitPlaceOneName', val.name)
            changeSettlementData('longitude', val.longitude)
            changeSettlementData('latitude', val.latitude)
        } else {
            let newSendCarOrderList = [...sendCarOrderList]
            let newReceiverList = [...receiverList]
            newSendCarOrderList = newSendCarOrderList.map(item => {
                item.transitType = 1
                return item
            })
            newReceiverList = newReceiverList.map(item => {
                item.transitType = 1
                return item
            })
            changeSendReceiveData('receiverList', newReceiverList)
            changeOrderDetailsData('sendCarOrderList', newSendCarOrderList)
        }
    }
    
    render() {
        let { 
            isShowTransfer,
            changeSendReceiveData,
            openType,
            senderList,
            receiverList,
            transitPlaceOneName,
            transitPlaceOneId
        } = this.props
        let { isShowTransferBack } = this.state
        return (
            <Fragment>
                <ReceiversAndSenders
                    senderList={senderList}
                    receiverList={receiverList}
                />
                <Row gutter={24} style={{ margin: '10px 12px', minHeight: 32 }}>
                    <Col label="&emsp;&emsp;是否中转" span={3}>
                        <Switch
                            disabled={openType !== 1}
                            size='small'
                            checked={isShowTransfer || isShowTransferBack}
                            onChange={(flag) => {
                                changeSendReceiveData('isShowTransfer', flag)
                                this.setState({
                                    isShowTransferBack: flag
                                })
                            }
                            }
                            style={{ verticalAlign: 'sub' }}
                        />
                    </Col>
                    {
                        (isShowTransfer || isShowTransferBack) &&
                        <Col span={4}>
                            <RemoteSelect
                                defaultValue={{id: transitPlaceOneId, name: transitPlaceOneName}}
                                disabled={openType !== 1}
                                placeholder='选择中转地'
                                onChangeValue={value => {
                                    this.setTransition(value)
                                }}
                                getDataMethod={'getNodeList'}
                                labelField='name'
                            />
                        </Col>
                    }
                    <Col span={17}></Col>
                </Row>
            </Fragment>
        )
    }
}

export default ReceiverAndSender