import React from 'react'
import Modal from '@src/components/modular_window'
import { Form } from 'antd'
import { inject } from "mobx-react"
import { Row, Col } from '@src/components/grid'
import { addressFormat } from '@src/utils'
import moment from 'moment'
import {Spin } from 'antd'
import TrackRoute from './TrackRoute'
import TrackMap from './TrackMap'
import { toOrderAdd } from '@src/views/layout/to_page'

const ModularParent = Modal.ModularParent

@inject('rApi', 'mobxTabsData', 'mobxBaseData')  
class TrackDetails extends ModularParent {

    state = {
        openType: null,
        title: '追踪详情',
        open: false,
        buttonLoading: false,
        source: {},
        trackData: [], //追踪详情数据
        detailLoading: false,
        requestDone: true
    }

    constructor(props) {
        super(props);
        if (props.getThis) {
            props.getThis(this)
        }
    }

    show(d) {
        // console.log('show', d)
        let { rApi } = this.props
        this.setState({
            detailLoading: true,
            requestDone: true
        })
        rApi.getTrackDetail({
            id: d.payload && d.payload.id,
            orderType: d.payload && d.payload.orderType
        }).then(d => {
            let stowageList  = d && d.stowageList.length > 0 && d.stowageList.map(d => {
                return {
                    ...d,
                    isShow: false
                }
            })
            this.setState({
                trackData: {
                    ...d,
                    stowageList: stowageList
                },
                detailLoading: false,
                requestDone: false
            })
        }).catch(e => {
            console.log(e)
            this.setState({
                detailLoading: false,
                requestDone: false
            })
        })
        this.setState({
            open: true,
            source: d.payload
        })
    }

    clearValue() {
        this.setState({
            openType: null,
            open: false,
            source: {}
        })
    }
  
    changeOpen = (open) => {
        this.setState({
            open
        })
        if (!open) {
            this.clearValue()
        }
    }

    onSubmit = () => {
        const { form } = this.props
        form.validateFields((errors, values) => {
            if(errors === null) {
                this.handleSubmit()
            }
        })
    }


    handleSubmit = () => {
        
    }

    toggleShow = (index) => {
        let { trackData } = this.state
        trackData.stowageList[index].isShow  = !trackData.stowageList[index].isShow
        this.setState({
            trackData
        })
    }

    onLook = (record) => { //查看 => 跳转到订单查看页面
        //console.log('onLook', record)
        let { source } = this.state
        let { mobxTabsData } = this.props
        toOrderAdd(mobxTabsData, {
            id: source.id,
            pageData: {
                ...source,
                openType: 2
            }
        })
    }

    render() {
        let {
            open,
            buttonLoading,
            source,
            detailLoading,
            requestDone
         } = this.state
        if (!open) return null
        const departureTime = source.departureTime ? moment(source.departureTime).format('YYYY.MM.DD') : ''
        const arrivalTime = source.arrivalTime ? moment(source.arrivalTime).format('YYYY.MM.DD') : ''
        const sendName = source.senderList && source.senderList.length ? source.senderList.map(item => item.name).join(',') : ''
        const sendAddr = source.senderList && source.senderList.length ? source.senderList.map(item => addressFormat(item.address)).join(',') : ''
        const receiveName = source.receiverList && source.receiverList.length ? source.receiverList.map(item => item.name).join(',') : ''
        const receiveAddr = source.receiverList && source.receiverList.length ? source.receiverList.map(item => addressFormat(item.address)).join(',') : ''
        const time = `${departureTime}${arrivalTime ? `-${arrivalTime}` : ''}`
        const infoRowStyle = { minHeight: 32 }
        const infoTextStyle = { color: '#484848', marginLeft: 8 }
        return (
            <Modal 
                changeOpen={this.changeOpen}
                open={this.state.open} 
                title={this.state.title} 
                style={{width: 1000}}
                loading={buttonLoading}
                haveFooter={false}
                className='modal-track'
            >
               <Form layout='inline' className='modal-content'>
                    <div style={{height: 36, lineHeight: '36px', fontSize: '14px', color: '#484848'}}>订单信息<span className='action-button' onClick={this.onLook} style={{marginLeft: '4px', textDecoration: 'underline'}} >{source.orderNumber}</span></div>
                    <Row style={infoRowStyle}>
                        <Col label='客户名称' span={7}>
                            <span style={{infoTextStyle}} title={source.clientName}>{source.clientName}</span>
                        </Col>
                        <Col label='项目名称' span={7}>
                            <span style={{infoTextStyle}} title={source.projectName}>{source.projectName}</span>
                        </Col>
                        <Col label='要求时间' span={7}>
                            <span style={{infoTextStyle}} title={time}>{time}</span>
                        </Col>
                    </Row>
                    <Row style={infoRowStyle}>
                        <Col label='&emsp;发货方' span={7}>
                            <span style={{infoTextStyle}} title={sendName}>{sendName}</span>
                        </Col>
                        <Col label='发货地址' span={13}>
                            <span style={{infoTextStyle}} title={sendAddr}>{sendAddr}</span>
                        </Col>
                        <Col span={1} />
                    </Row>
                    <Row style={infoRowStyle}>
                        <Col label='&emsp;收货方' span={7}>
                            <span style={{infoTextStyle}} title={receiveName}>{receiveName}</span>
                        </Col>
                        <Col label='收货地址' span={13}>
                            <span style={{infoTextStyle}} title={receiveAddr}>{receiveAddr}</span>
                        </Col>
                        <Col span={1} />
                    </Row>
                    <div style={{height: 0, backgroundColor: '#d9d9d9', border: '1px solid #d9d9d9', margin: '5px -20px 0'}}></div>
                    <div style={{display: 'flex'}}>
                        {
                            requestDone ?
                            <Spin spinning={detailLoading}>
                                <div style={{width: 331, padding: '0 10px 10px 0', borderRight: '1px solid #d9d9d9'}}></div>
                            </Spin>
                            :
                            <TrackRoute
                                data={this.state.trackData}
                                style={{width: 331, padding: '0 10px 10px 0', borderRight: '1px solid #d9d9d9'}}
                                toggleShow={this.toggleShow}
                                source={source}
                            />
                        }
                        <TrackMap
                            style={{flexGrow: 1, padding: '0 0 10px 10px'}} 
                            data={source}
                        />
                    </div>
               </Form>
            </Modal>
        )
    }
}

export default Form.create()(TrackDetails)