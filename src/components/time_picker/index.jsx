import React, { Component} from 'react'
import {DatePicker} from 'antd'
import moment from 'moment'
import FormItem from '@src/components/FormItem'
import PropTypes from 'prop-types'

export default class TimePicker extends Component {
    static propTypes = {
        changeStartTime: PropTypes.func.isRequired, //将值开始时间=>父组件
        changeEndTime: PropTypes.func.isRequired, //将值结束时间=>父组件
		startFormat: PropTypes.string, // 开始时间格式要求不填默认'YYYY-MM-DD'
        startTitle: PropTypes.string, //开始时间 placeholder
        endFormat: PropTypes.string, // 结束时间格式要求不填默认'YYYY-MM-DD'
        endTitle: PropTypes.string, //结束时间 placeholder
        isRequired: PropTypes.bool, //是否必填
        pickerWidth: PropTypes.object, //选择器宽
        // getFieldDecorator: PropTypes.func.isRequired //form 方法
    }

    disabledDate = (current) => {
        let { startTime } = this.props
        return startTime && current && current < moment(startTime);
    }

    render() {
        let {
            startTime, //开始时间
            startFormat,
            startTitle,
            endTime, //结束时间
            endFormat,
            endTitle,
            changeStartTime,
            changeEndTime,
            getFieldDecorator,
            pickerWidth, //选择器宽
            isRequired, //是否必填
            getPopupContainer
        } = this.props

        let getTContainer = {}
        if (getPopupContainer) {
            getTContainer.getCalendarContainer = getPopupContainer
        } else {
            getTContainer.getCalendarContainer = () => document.querySelector('#scroll-view')
        }
        return(
            <div>
                {
                    getFieldDecorator ?
                        <FormItem style={pickerWidth}>
                            {
                                getFieldDecorator('startTime', {
                                    initialValue: startTime ? moment(startTime) : null,
                                    rules: [
                                        {
                                            required: isRequired ? true : false,
                                            message: '请选择起始日期'
                                        }
                                    ],
                                })(
                                    <DatePicker
                                        //defaultValue={startTime ? moment(startTime) : null}
                                        {...getTContainer}
                                        format={startFormat ? startFormat : 'YYYY-MM-DD'}
                                        placeholder={startTitle ? startTitle : '起始'}
                                        onChange={
                                            (date, dateStr) => {
                                                //console.log('time', date, dateStr)
                                                changeStartTime(date, dateStr)
                                            }
                                        }
                                    />
                                )
                            }
                        </FormItem>
                        :
                        <DatePicker
                            {...getTContainer}
                            style={pickerWidth}
                            //defaultValue={startTime ? moment(startTime) : null}
                            format={startFormat ? startFormat : 'YYYY-MM-DD'}
                            placeholder={startTitle ? startTitle : '起始'}
                            onChange={
                                (date, dateStr) => {
                                    //console.log('time', date, dateStr)
                                    changeStartTime(date, dateStr)
                                }
                            }
                        />
                }
                <span style={{lineHeight: '30px', margin: '0 5px', fontSize: '12px'}}>-</span>
                {
                    getFieldDecorator ?
                        <FormItem style={pickerWidth}>
                            {
                                getFieldDecorator('endTime', {
                                    initialValue: endTime ? moment(endTime) : null,
                                    rules: [
                                        {
                                            required: isRequired ? true : false,
                                            message: '请选择结束日期'
                                        }
                                    ],
                                })(
                                    <DatePicker
                                        {...getTContainer}
                                        defaultValue={endTime ? moment(endTime) : null}
                                        format={endFormat ? endFormat : 'YYYY-MM-DD'}
                                        placeholder={endTitle ? endTitle : '结束'}
                                        disabled={startTime ? false : true}
                                        disabledDate={this.disabledDate}
                                        onChange={
                                            (date, dateStr) => {
                                                changeEndTime(date, dateStr)
                                            }
                                        }
                                    />
                                )
                            }
                        </FormItem>
                        :
                        <DatePicker
                            {...getTContainer}
                            style={pickerWidth}
                            defaultValue={endTime ? moment(endTime) : null}
                            format={endFormat ? endFormat : 'YYYY-MM-DD'}
                            placeholder={endTitle ? endTitle : '结束'}
                            disabled={startTime ? false : true}
                            disabledDate={this.disabledDate}
                            onChange={
                                (date, dateStr) => {
                                    changeEndTime(date, dateStr)
                                }
                            }
                        />
                }
            </div>
        )
    }
}