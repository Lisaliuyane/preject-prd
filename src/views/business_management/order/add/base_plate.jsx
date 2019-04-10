import React, { Component, Fragment } from 'react'
import { Row, Col } from '@src/components/grid'
import RemoteSelect from '@src/components/select_databook'
import { Input, Checkbox, Switch, InputNumber, DatePicker, Radio } from 'antd'
import { stringToArray } from '@src/utils'
import FormItem from '@src/components/FormItem'
import moment from 'moment'
import DemandCarType from '@src/components/select_add'
import HeaderTitle from './title.jsx'
import { inject } from "mobx-react"
import './base.less'

const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group   

@inject('rApi')
class BasePlate extends Component {
    state={
        pid: null,
        bookingMode: null,
        reloadOrderLegal: false
    }
    constructor(props) {
        super(props)
        this.state.pid = props.projectId
    }
    clearData = (isClear) => {
        if (isClear) {
            //console.log('clearData')
            this.setState({
                reLoadProject: true,
                pid: null
            }, () => {
                this.setState({
                    reLoadProject: false
                })
            })
        }
    }

    getCarTypeVul = (value) => { //获取需求车型数据
        let { carTypeList, changeInput } = this.props
        // this.setState({
        //     carTypeList: value && value.length > 0 ? value.filter(d => d.name).map(item => {
        //         let obj = {
        //             carTypeId: item.carTypeId || item.id,
        //             carTypeName: item.title || item.name,
        //         }
        //         return obj
        //     }) : []
        // })
        changeInput({
            carTypeList: value && value.length > 0 ? value.filter(d => d.name).map(item => {
                let obj = {
                    ...item,
                    carTypeId: item.carTypeId || item.id,
                    carTypeName: item.title || item.name,
                }
                return obj
            }) : []
        })
    }

    isPreorder = (value) => {
        let { rApi, changeInput } = this.props
        if(value && value.id) {
            rApi.getCooperationProjectById({
                id: value.id
            }).then((res) =>{
                this.setState({
                    bookingMode: res.bookingMode
                })
            }).catch(e => {
                console.log(e)
            })
        } else {
            this.setState({
                bookingMode: null
            }, () => {
                changeInput({
                    orderForm: 0
                })
            })
        }
    }

    reloadOrderLegal = () => {
        this.setState({
            reloadOrderLegal: true
        }, () => {
            this.setState({
                reloadOrderLegal: false
            })
        })
    }

    getClientLegalData = () => { //获取客户法人数据
        let { rApi, clientId } = this.props
        return new Promise((resolve, reject) => {
            rApi.getClients({
                limit: 999999, 
                offset: 0, 
                clientid: clientId
            }).then(d => {
                let data = d.clients[0]
                //console.log('filterOrderIdGetCarType', data.legals)
                if(data) {
                    resolve(data.legals.map(item => {
                        return { 
                            ...item,
                            id: item.name
                        }
                    }))
                } else {
                    resolve([])
                }
            }).catch(e => {
                reject(e)
            })
        })
       
    }

    render() { 
        const { 
            openType,
            changeInput, 
            getCustomerArea, 
            clientNoUp,
            orderNumber,
            clientId,
            clientName,
            projectId,
            projectName,
            customerNumber,
            moreClientNo,
            customerNumberBackup,
            specialDescription,
            specialInstruction,
            businessModelId,
            businessModelName,
            businessModelData,
            remark,
            aging,
            departureTime,
            arrivalTime,
            carTypeList,
            isCustomsClearance,
            CustomerAreaData,
            customsAreaId,
            customsAreaName,
            isInsurance,
            insuredValue,
            orderForm,
            orderLegalId,
            orderLegalName,
            clientLegalId,
            clientLegalName
        } = this.props
        const { getFieldDecorator } = this.props.form
        let {  reLoadProject, pid, bookingMode, reloadOrderLegal } = this.state
       // console.log('orderLegalId', orderLegalId, orderLegalName)
        return (
            <div className="base-wrapper order-detail background-white" style={{borderBottom: '10px solid #eee', padding: '10px 25px'}}>
                <HeaderTitle
                    title="基本信息"
                />
                <div>
                    <Row gutter={24}>
                        <Col label="订单编号&emsp;&emsp;&emsp;" colon isRequired span={7}>
                            <Input
                                className="input-width"
                                value={orderNumber}
                                placeholder="自动生成"
                                disabled={true}
                            />
                        </Col>
                        {
                            bookingMode === 1 ?
                            <Col label="预订单模式&emsp;&emsp;" colon span={7}>
                                <Switch 
                                    size="small" 
                                    checked={orderForm === 1 ? true : false}
                                    onChange={
                                        (checked) => {
                                            //console.log('checked', checked)
                                            changeInput({
                                                orderForm: checked ? 1 : 0
                                            })
                                        }
                                    }
                                    disabled={openType === 2 ? true : false}
                                />
                            </Col>
                            :
                            null
                        }
                        <Col span={7} />
                    </Row>
                    <Row gutter={24}>
                        <Col isRequired label="客户名称&emsp;&emsp;&emsp;" colon span={7}>
                            <FormItem>
                                {
                                    getFieldDecorator('clientId', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择客户'
                                            }
                                        ],
                                    })(
                                        <RemoteSelect
                                            defaultValue={clientId ? { id: clientId, shortname: clientName } : null}
                                            onChangeValue={
                                                value => {
                                                    changeInput({
                                                        clientId: value ? value.id : null,
                                                        clientName: value ? value.name || value.shortname : null
                                                    }, () => {
                                                        let id = value ? value.id : null
                                                        if (clientId !== id) {
                                                            this.clearData(true)
                                                        }
                                                    })
                                                }
                                            }
                                            disabled={openType === 2 ? true : false}
                                            allowClear={false}
                                            getDataMethod={'getClients'}
                                            dealData={res => {
                                                let rt = res ? [...res] : []
                                                return rt
                                            }}
                                            params={{ limit: 999999, offset: 0, status: 56 }}
                                            labelField={'shortname'}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col isRequired label="所属项目&emsp;&emsp;&emsp;" colon span={7}>
                            {
                                reLoadProject ?
                                null
                                :
                                <FormItem>
                                    {
                                        getFieldDecorator('pid', {
                                            rules: [
                                                { 
                                                    required: true, 
                                                    message: '请选择项目'
                                                }
                                            ],
                                        })(
                                            <RemoteSelect
                                                defaultValue={pid ? {id: projectId, projectName: projectName} : null}
                                                onChangeValue={
                                                    value => {
                                                        //console.log('请选择项目', value)
                                                        let obj = {
                                                            projectId: value ? value.id : '',
                                                            projectName: value ? value.name || value.projectName : '',
                                                            orderLegalId: (value && value.origin_data) ? value.origin_data[0].orderLegalId : null,
                                                            orderLegalName: (value && value.origin_data) ? value.origin_data[0].orderLegalName : null,
                                                            clientLegalId: (value && value.origin_data) ? value.origin_data[0].clientLegalId : null,
                                                            clientLegalName: (value && value.origin_data) ? value.origin_data[0].clientLegalName : null
                                                        }
                                                        //console.log('obj', obj, value)
                                                        if (projectId === obj.projectId) return
                                                        changeInput(obj, () => {
                                                            getCustomerArea
                                                            this.isPreorder(value)
                                                            // this.reloadOrderLegal
                                                            this.reloadOrderLegal()
                                                        })
                                                    }
                                                } 
                                                allowClear={false}
                                                disabled={openType === 2 ? true : clientId ? false : true}
                                                getDataMethod={'getCooperativeList'}
                                                params={{pageSize: 999999, pageNo: 0, clientId: clientId, status: 2}}
                                                labelField={'projectName'}
                                            />
                                        )
                                    }
                                </FormItem>
                            }
                        </Col>
                        <Col label="客户法人&emsp;&emsp;&emsp;" colon span={7} isRequired>
                        {
                            reloadOrderLegal ?
                            null
                            :
                            <FormItem>
                                {
                                    getFieldDecorator('clientLegalName', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择客户法人'
                                            }
                                        ],
                                    })(
                                        <RemoteSelect
                                            defaultValue={clientLegalName ? {
                                                id: clientLegalName,
                                                title: clientLegalName,
                                                name: clientLegalName
                                            } : null}
                                            onChangeValue={(value = {}) => {
                                                changeInput({
                                                    clientLegalId: null, 
                                                    clientLegalName: value ? value.name : ''
                                                })
                                                
                                            }}
                                            allowClear={true}
                                            getData={this.getClientLegalData}
                                                    // params={{limit: 999999, offset: 0, clientId: clientId}}
                                            labelField={'name'}
                                            disabled={(clientId && openType !== 2) ? false : true}
                                        />
                                    )
                                }
                            </FormItem>
                        }
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col isRequired label="业务模式&emsp;&emsp;&emsp;" colon span={7}>
                            <FormItem>
                                {
                                    getFieldDecorator('businessModelId', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择业务模式'
                                            }
                                        ],
                                    })(
                                        <RemoteSelect
                                            defaultValue={businessModelId || businessModelId === 0 ? { id: businessModelId, title: businessModelName } : null}
                                            onChangeValue={
                                                value => {
                                                    changeInput({
                                                        businessModelId: value ? value.id : '',
                                                        businessModelName: value ? value.title : ''
                                                    })
                                                }
                                            }
                                            disabled={openType === 2 ? true : false}
                                            list={businessModelData}
                                            labelField={'title'}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col label="接单法人&emsp;&emsp;&emsp;" colon span={7} isRequired>
                        {
                            reloadOrderLegal ?
                            null
                            :
                            <FormItem>
                                {
                                    getFieldDecorator('orderLegalId', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择接单法人'
                                            }
                                        ],
                                    })(
                                        <RemoteSelect
                                            defaultValue={orderLegalId ? {
                                                id: orderLegalId,
                                                name: orderLegalName,
                                                fullName: orderLegalName,
                                            } : null}
                                            onChangeValue={(value = {}) => {
                                                changeInput({
                                                    orderLegalId: value ? value.id : '',
                                                    orderLegalName: value ? value.fullName || value.projectName : ''
                                                })
                                                
                                            }}
                                            allowClear={true}
                                            getDataMethod="getLegalPersonList"
                                            params={{offset: 0, limit: 999999}}
                                            labelField='fullName' 
                                            disabled={openType === 2 ? true : false}
                                        />
                                    )
                                }
                            </FormItem>
                        }
                        </Col>
                        <Col span={7} />
                    </Row>
                    <Row gutter={24}>
                        <Col label="客户单号&emsp;&emsp;&emsp;" colon span={12}>
                            <div className="flex flex-vertical-center">
                                <Input
                                    defaultValue={customerNumber}
                                    style={{ maxWidth: 180, marginRight: '5px' }}
                                    placeholder=""
                                    onChange={
                                        e => {
                                            // changeInput({customerNumber: e.target.value})
                                            changeInput({ customerNumber: e.target.value })
                                        }
                                    }
                                    disabled={openType === 2 ? true : false}
                                />
                                {
                                    moreClientNo || (openType === 2 && customerNumberBackup) ?
                                        <Input
                                            defaultValue={customerNumberBackup}
                                            disabled={openType === 2 ? true : false}
                                            style={{ maxWidth: 180, marginRight: '5px' }}
                                            placeholder=""
                                            onChange={
                                                e => {
                                                    // changeInput({customerNumberBackup: e.target.value})
                                                    changeInput({ customerNumberBackup: e.target.value })
                                                }
                                            }
                                        />
                                        :
                                        null
                                }
                                {
                                    openType === 2 ?
                                    null
                                    :
                                    <div className="plusStyle" onClick={clientNoUp}>
                                        {
                                            moreClientNo ?
                                               '-'
                                                :
                                               '+'
                                        }
                                    </div>
                                }
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="bottom-style">
                    <Row gutter={24}>
                        <Col label="特殊要求&emsp;&emsp;&emsp;" colon labelInTop contentStyle={{ whiteSpace: 'normal' }} span={24}>
                            <div style={{maxWidth: 590, background: 'rgb(247, 247, 247)', padding: '10px'}}>
                                {
                                    // openType === 2 ?
                                    // <span>
                                    //     {
                                    //         stringToArray(specialInstruction) ? stringToArray(specialInstruction).join(',') : '无'
                                    //     }
                                    // </span>
                                    // :
                                    <CheckboxGroup
                                        defaultValue={stringToArray(specialInstruction)}
                                        options={specialDescription}
                                        onChange={value => {
                                            changeInput({
                                                specialInstruction: value
                                            })
                                        }}
                                        disabled={openType === 2 ? true : false}
                                    />
                                }
                            </div>
                        </Col>
                    </Row>
                    {/* <div className="flex" style={{ padding: '5px 0'}}>
                        <div style={{width: 97, color: 'rgb(136, 136, 136)'}}>特殊要求</div>
                        <div className="flex1" style={{maxWidth: 590, background: 'rgb(247, 247, 247)', padding: '10px 10px 10px 25px'}}>
                            <Row gutter={24} type={openType}>
                                <Col contentStyle={{ whiteSpace: 'normal' }} span={24} text={stringToArray(specialInstruction) ? stringToArray(specialInstruction).join(',') : null}>
                                    <CheckboxGroup
                                        defaultValue={stringToArray(specialInstruction)}
                                        options={specialDescription}
                                        onChange={value => {
                                            changeInput({
                                                specialInstruction: value
                                            })
                                        }}
                                        disabled={openType === 2 ? true : false}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </div> */}
                    <Row gutter={24}>
                        <Col isRequired label="时&emsp;效&emsp;&emsp;&emsp;&emsp;" colon span={7}>
                            <FormItem>
                                {
                                    getFieldDecorator('aging', {
                                        initialValue: !isNaN(aging) ? aging : null,
                                        rules: [
                                            {
                                                required: true,
                                                message: '时效不能为空'
                                            }
                                        ],
                                    })(
                                        <InputNumber
                                            min={0}
                                            //defaultValue={!isNaN(aging) ? aging : null}
                                            //value={!isNaN(aging) ? aging : null}
                                            style={{ width: 110 }}
                                            placeholder=""
                                            onChange={value => {
                                                changeInput({
                                                    aging: value
                                                })
                                            }}
                                            disabled={openType === 2 ? true : false}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col label="发车/到达时间" colon span={16} text={
                            `${departureTime ? moment(departureTime).format('YYYY-MM-DD') : ''}${arrivalTime ? `至${moment(arrivalTime).format('YYYY-MM-DD')}` : ''}`
                        }>
                            <DatePicker
                                defaultValue={departureTime ? moment(departureTime, 'YYYY-MM-DD') : null}
                                getCalendarContainer = {() => document.querySelector('#scroll-view')}
                                format={'YYYY-MM-DD HH:mm'}
                                showTime={{ format: 'HH:mm' }}
                                placeholder='选择发车时间'
                                value={departureTime ? moment(departureTime) : null}
                                disabled={openType === 2 ? true : false}
                                onChange={
                                    (date, dateStr) => {
                                        changeInput({
                                            departureTime: date
                                        }, () => {
                                            if(aging && dateStr) {
                                                let curTime = new Date(dateStr).getTime()
                                                let rt = curTime + (3600000 * parseFloat(aging))
                                                rt = moment(moment(new Date(rt)))
                                                changeInput({
                                                    arrivalTime: rt
                                                })
                                            }
                                        })
                                        // this.setState({
                                        //     departureTime: date
                                        // }, () => {
                                        //     if (aging && this.state.departureTime) {
                                        //         let curTime = new Date(dateStr).getTime()
                                        //         let rt = curTime + (3600000 * parseFloat(aging))
                                        //         rt = moment(moment(new Date(rt)))
                                        //         // console.log(moment(new Date(rt)))
                                        //         this.setState({
                                        //             arrivalTime: rt
                                        //         })
                                        //     }
                                        // })
                                    }
                                }
                                style={{ width: 180, marginLeft: '9px'}}
                            />
                            <span style={{ padding: '0 5px' }}>-</span>
                            <DatePicker
                                defaultValue={arrivalTime ? moment(arrivalTime, 'YYYY-MM-DD') : null}
                                getCalendarContainer = {() => document.querySelector('#scroll-view')}
                                disabled={openType === 2 ? true : false}
                                format={'YYYY-MM-DD HH:mm'}
                                showTime={{ format: 'HH:mm' }}
                                placeholder='选择到达时间'
                                value={arrivalTime ? moment(arrivalTime) : null}
                                // disabledDate={curTime => {
                                //     // if(departureTime){
                                //     //     return curTime < departureTime
                                //     // }
                                // }
                                // }
                                onChange={
                                    (date, dateStr) => {
                                        // this.setState({
                                        //     arrivalTime: date
                                        // })
                                        changeInput({
                                            arrivalTime: date
                                        })
                                    }
                                }
                                style={{ width: 180 }}
                            />
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col label="需求车型&emsp;&emsp;&emsp;" colon labelInTop contentStyle={{ whiteSpace: 'normal' }} span={24}>
                            <div style={{maxWidth: 590, background: 'rgb(247, 247, 247)', padding: '10px'}}>
                                <DemandCarType
                                    openType={openType}
                                    defaultValue={(carTypeList && carTypeList.length > 0) ? carTypeList : [{}]}
                                    getCarTypeVul={this.getCarTypeVul}
                                    //labelVul={'需求车型'}
                                    filterData={{ placeholder: '选择车型', getDataMethod: 'getCarTypes', params: { limit: 99999, offset: 0 }, labelField: 'name' }}
                                    isInput={true}
                                />
                            </div>
                        </Col>
                    </Row>
                    {/* <div className="flex" style={{padding: '5px 0'}}>
                        <div style={{width: 98, color: 'rgb(136, 136, 136)'}}>需求车型</div>
                        <div className="flex1" style={{maxWidth: 590, background: 'rgb(247, 247, 247)', padding: '10px 10px 10px 25px'}}>
                            <Row gutter={24} type={openType}>
                                <DemandCarType
                                    openType={openType}
                                    defaultValue={(carTypeList && carTypeList.length > 0) ? carTypeList : [{}]}
                                    getCarTypeVul={this.getCarTypeVul}
                                    //labelVul={'需求车型'}
                                    filterData={{ placeholder: '选择车型', getDataMethod: 'getCarTypes', params: { limit: 99999, offset: 0 }, labelField: 'name' }}
                                    isInput={true}
                                />
                            </Row>
                        </div>
                    </div> */}
                    <Row gutter={24}>
                        <Col label="委托报关&emsp;&emsp;&emsp;" colon span={7}>
                            <div className="flex flex-vertical-center" style={{height: 32}}>
                                <RadioGroup
                                    onChange={e => {
                                        // this.setState({
                                        //     isCustomsClearance: e.target.value
                                        // })
                                        changeInput({
                                            isCustomsClearance: e.target.value
                                        })
                                    }}
                                    disabled={openType === 2 ? true : false}
                                    value={isCustomsClearance ? isCustomsClearance : -1}
                                    defaultValue={isCustomsClearance ? isCustomsClearance : -1}
                                >
                                    <Radio value={-1}>否</Radio>
                                    <Radio value={1}>是</Radio>
                                </RadioGroup>
                            </div>
                        </Col>
                        {
                            isCustomsClearance === -1 ?
                                null
                                :
                                <Fragment>
                                    <Col label="选择关区&emsp;&emsp;&emsp;" colon span={7} text={customsAreaName}>
                                        <div className="flex flex-vertical-center">
                                            <Input
                                                defaultValue={customsAreaName}
                                                style={{ maxWidth: 180, marginRight: '5px' }}
                                                placeholder=""
                                                onChange={
                                                    e => {
                                                        // changeInput({customerNumber: e.target.value})
                                                        changeInput({ customsAreaName: e.target.value })
                                                    }
                                                }
                                                disabled={openType === 2 ? true : false}
                                            />
                                            {/* <RemoteSelect
                                                defaultValue={
                                                    customsAreaName ?
                                                        {
                                                            id: customsAreaId,
                                                            title: customsAreaName,
                                                        }
                                                        :
                                                        null
                                                }
                                                disabled={openType === 2 ? true : projectId ? false : true}
                                                labelField={'title'}
                                                list={CustomerAreaData}
                                                // getDataMethod={'getCarrierList'}
                                                onChangeValue={(value = {}) => {
                                                    // this.setState(
                                                    //     {
                                                    //         customsAreaId: value.id,
                                                    //         customsAreaName: value.title
                                                    //     }
                                                    // )
                                                    changeInput({
                                                        customsAreaId: value.id,
                                                        customsAreaName: value.title
                                                    })
                                                }}
                                            /> */}
                                        </div>
                                    </Col>
                                    <Col span={7} />
                                </Fragment>
                        }
                    </Row>
                    <Row gutter={24}>
                        <Col label="是否保险&emsp;&emsp;&emsp;" colon span={7}>
                            <div className="flex flex-vertical-center" style={{height: 32}}>
                                <RadioGroup
                                    onChange={e => {
                                        // this.setState({
                                        //     isInsurance: e.target.value
                                        // })
                                        changeInput({
                                            isInsurance: e.target.value
                                        })
                                    }}
                                    value={isInsurance ? isInsurance : -1}
                                    defaultValue={isInsurance ? isInsurance : -1}
                                    disabled={openType === 2 ? true : false}
                                >
                                    <Radio value={-1}>否</Radio>
                                    <Radio value={1}>是</Radio>
                                </RadioGroup>
                            </div>
                        </Col>
                        {
                            isInsurance === -1 ?
                                null
                                :
                                <Fragment>
                                    <Col label="投保货值&emsp;&emsp;&emsp;" colon span={7} text={insuredValue}>
                                        <div className="flex flex-vertical-center">
                                            <InputNumber
                                                style={{width: 140}}
                                                className="input-width"
                                                defaultValue={insuredValue ? insuredValue : ''}
                                                placeholder=""
                                                disabled={openType === 2 ? true : false}
                                                min={0}
                                                max={999999999999999999}
                                                onChange={value => {
                                                    // this.setState({ insuredValue: value })
                                                    changeInput({
                                                        insuredValue: value
                                                    })
                                                }
                                                }
                                            />
                                        </div>
                                    </Col>
                                    <Col span={7}/>
                                </Fragment>
                        }
                    </Row>
                </div>
                <div style={{padding: '5px 0'}}>
                    <Row gutter={24}>
                        <Col label="备注信息&emsp;&emsp;&emsp;" colon span={10}>
                            <Input 
                                defaultValue={remark}
                                disabled={openType === 2 ? true : false}
                                onChange={e => {
                                        changeInput({remark: e.target.value})
                                    } 
                                }
                            />
                        </Col>
                        <Col span={6} />
                    </Row>
                </div>
            </div>
        )
    }
}
 
export default BasePlate;