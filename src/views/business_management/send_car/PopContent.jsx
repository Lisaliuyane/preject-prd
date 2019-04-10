import React, { Component } from 'react'
import { DatePicker, Steps, Button, message } from 'antd'
import moment from 'moment'

const { Step } = Steps

/* 追踪弹窗  */
class PopContent extends Component {
    state = {
        stepArr: [
            {
                title: '到达提货地'
            },
            {
                title: '离开提货地'
            },
            {
                title: '在途'
            },
            {
                title: '到达目的地'
            },
            {
                title: '已签收'
            }
        ],
        confirmLoading: false
    }

    constructor(props) {
        super(props)
        const {rowData} = props
        this.state.stepArr = [
            {
                title: '到达提货地',
                time: rowData.arriveTimeDeparture
            },
            {
                title: '离开提货地',
                time: rowData.leaveTimeDeparture
            },
            {
                title: '在途'
            },
            {
                title: '到达目的地',
                time: rowData.arriveTimeDestination
            },
            {
                title: '已签收',
                time: rowData.leaveTimeDestination
            }
        ]
    }

    /* 修改追踪时间信息 */
    editTime = (index, key, val) => {
        // console.log('dateval', val)
        let {stepArr} = this.state
        stepArr[index][key] = val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : null
        this.setState({stepArr})
    }

    /* 追踪 */
    sendcarTrackEdit = async (rowIndex) => {
        let {stepArr} = this.state
        const { rApi, editTrack, rowData } = this.props
        let arriveTimeDeparture = stepArr[0].time
        let arriveTimeDestination = stepArr[3].time
        let leaveTimeDeparture = stepArr[1].time
        let leaveTimeDestination = stepArr[4].time
        let reqData = {
            id: rowData.id,
            arriveTimeDeparture,
            arriveTimeDestination,
            leaveTimeDeparture,
            leaveTimeDestination
        }
        this.setState({confirmLoading: true})
        rApi.sendcarTrackEdit(reqData)
            .then(res => {
                message.success('操作成功')
                editTrack(rowIndex, false)
                this.setState({ confirmLoading: false })
            })
            .catch(err => {
                message.error(err.msg || '操作失败')
                this.setState({ confirmLoading: false })
            })
    }

    /* 自定义点状 */
    customDot = (dot, { status, index }) => (
        dot
    )

    /* 步骤 */
    cusStep = (item, index, parent) => {
        const { edit } = this.props
        return (
            <div style={{ width: 370, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ whiteSpace: "nowrap" }}>{item.title}</span>
                {
                    index === 2 ?
                        <span style={{ cursor: 'pointer', color: '#1DA57A'}}>查看</span>
                    :
                    edit ?
                        <DatePicker
                            getCalendarContainer={(parent) => parent}
                            value={item.time ? moment(item.time) : null}
                            format='YYYY-MM-DD HH:mm:ss'
                            showTime
                            style={{ width: 225 }}
                            onChange={
                                date => {
                                    this.editTime(index, 'time', date)
                                }}
                            allowClear
                            placeholder='选择时间'
                        />
                        :
                        <span>{item.time ? moment(item.time).format('YYYY-MM-DD HH:mm:ss') : '无'}</span>
                }
            </div>
        )
    }

    render() {
        const { stepArr, confirmLoading } = this.state
        const { edit, rowIndex, openTrack } = this.props
        return (
            <div className='sendcar-page-popover' style={{ width: 400 }} ref={v => this.popover = v}>
                <Steps
                    direction="vertical"
                    size="small"
                    progressDot={this.customDot}
                    style={{ width: 400 }}
                >
                    {
                        stepArr.map((item, index) => {
                            return <Step
                                key={index}
                                title={this.cusStep(item, index, this.popover)}
                                status='process'
                                style={{ width: '100%' }}
                            />
                        })
                    }
                </Steps>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {/* <Button onClick={e => {
                        openTrack(rowIndex, false)
                    }}>关闭</Button> */}
                    {
                        edit &&
                        <Button
                            style={{ marginLeft: 12 }}
                            loading={confirmLoading}
                            onClick={e => this.sendcarTrackEdit(rowIndex)}
                        >确定</Button>
                    }
                </div>
            </div>
        )
    }
}

export default PopContent