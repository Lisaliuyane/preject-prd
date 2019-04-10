import React, { Component, Fragment } from 'react'
import { Steps, Popover, Icon } from 'antd'
import moment from 'moment'

const { Step } = Steps

// 自定义点
const customDot = (dot, { status, index }) => (
    // <Popover content={<span>step {index} status: {status}</span>}>
    //     {dot}
    // </Popover>
    <span>{dot}</span>
)

const StepIcon = () => {
    return(
        <span style={{width: 10, height: 10, borderRadius: '50%', background: 'rgba(0, 0, 0, 0.001)'}}></span>
    )
}

const Description = (props) => {
    return(
        <div style={{lineHeight: '26px'}}>
            <span className="text-overflow-ellipsis" style={{marginRight: 30}}>{props.name}</span>
            <span>{props.time ? moment(props.time).format("YYYY-MM-DD hh:mm") : '-'}</span>
        </div>
    )
}

export default class TrackRoute extends Component {
    constructor (props) {
        super(props)
        this.state = {
            showMore: []
        }
    }

    // 在途自定义展开收起
    onwayDesc = (item, index) => {
        //console.log('onwayDesc', item, index)
        if(!item.trackList || item.trackList.length < 1) {
            return null
        }
        return (
            <span 
                style={{ color: '#18B583', cursor: 'pointer' }} 
                onClick={() => this.props.toggleShow(index)}
            >
                <Icon type={item.isShow ? "caret-down" : "caret-right"} style={{marginRight: 6}} />
                {item.isShow ? '收起' : '展开'}
            </span>
        )
    }

    render () {
        const {
            showMore
        } = this.state
        const { style, data, source } = this.props
        const confirm = data.confirm
        const sign = data.sign
        const stowageList = data.stowageList
        const orderStatus = source.status
        //console.log('status', source, orderStatus)
        return (
            <div style={style}>
                <div style={{height: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{ fontSize: '14px', color: '#484848' }}>追踪路径</span>
                    <span style={{ color: '#18B583' }}>查看详细路径</span>
                </div>
                <div className='track-route'>
                    <Steps
                        current={0}
                        progressDot={customDot}
                        direction='vertical'
                        className='track-steps'
                    >
                        {
                            orderStatus >= 2 && <Step 
                                title="订单确认" 
                                description={<Description name={confirm && confirm.operatorName} time={confirm && confirm.createTime} />}
                                className='step-endpoint'  
                            />
                        }
                        {
                            stowageList && stowageList.length > 0 && stowageList.map((item, index) => {
                                let rt = item.trackList && item.trackList.length > 0 ? item.trackList.map((d) => {
                                    return(
                                        <Step 
                                            title={<div title={d.description} className="text-overflow-ellipsis" style={{width: 70}}>{d.description}</div>}
                                            description={<Description name={d.operatorName} time={d.createTime} />}
                                            className={`${!item.isShow ? 'hide color-888' : 'color-888'}`}
                                        />
                                    )
                                }) : []

                                return(
                                   [
                                        <Step 
                                            title={`订单配载${index+1}`}
                                            description={<Description name={item.stowage && item.stowage.operatorName} time={item.stowage && item.stowage.createTime} />}
                                            className={`step-endpoint order-stowage${index+1}`}
                                        />,
                                        item.sendCar &&  <Step 
                                            title={`派车${index+1}`}
                                            description={<Description name={item.sendCar && item.sendCar.operatorName} time={item.sendCar && item.sendCar.createTime} />}
                                            className='step-endpoint' 
                                        />,
                                        item.sendCar && <Step 
                                            title={`在途${index+1}`} 
                                            description={this.onwayDesc(item, index)} 
                                            className={item.isShow ? 'step-onway border-bottom' : 'step-onway'} 
                                        />,
                                        ...rt,
                                        item.sign && <Step 
                                            title={`签收`}
                                            description={<Description name={item.sign && item.sign.operatorName} time={item.sign && item.sign.createTime} />}
                                            className={item.isShow ? 'step-endpoint border-top' : 'step-endpoint'}
                                        />
                                   ]
                                )
                            })
                        }
                        {
                            orderStatus >= 5 && <Step 
                                title="订单签收" 
                                description={<Description name={sign && sign.operatorName} time={sign && sign.createTime} />}
                                className='step-endpoint order-sing'  
                            />
                        }
                    </Steps>
                </div>
            </div>
        )
    }
}