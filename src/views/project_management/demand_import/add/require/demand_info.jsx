import React, { Component} from 'react'
import { Button, Form, Input, Radio, message, Icon, Select } from 'antd'
import FormItem from '@src/components/FormItem'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { Row, Col } from '@src/components/grid'
import { CustomCheckbox } from '@src/components/custom_check'
import { validateToNextQQorEmail, validateToNextPhone } from '@src/utils'
import { resolve } from 'upath'
import SwitchBtn from './switch'
import './index.less'
const RadioGroup = Radio.Group

const demandTypeData = [
    {
        id: 1,
        label: '零担', 
        value: 1
    },
    {
        id: 2,
        label: '整车', 
        value: 2
    },
    {
        id: 3,
        label: '仓+配', 
        value: 3
    },
    {
        id: 4,
        label: '快递', 
        value: 4
    },
]

/**
 * 需求基本信息
 * 
 * @class DemandInfo
 * @extends {Component}
 */
@inject('mobxTabsData')
@inject('rApi')
@observer
class DemandInfo extends Component {

    state = {
        demandName: null, //需求名称
        demandNumber: null, //需求编号
        clientName: null, //客户名称
        clientId: null, //客户id
        businessExecutivesId: 0, //业务主管id
        businessExecutivesName: null, //业务主管名称
        businessRepresentativeId: 0, //业务代表id
        businessRepresentativeName: null, //业务代表名称
        demandType: [], //需求类型
        dockingWindowId: 0, //对接窗口id
        dockingWindowName: null, //对接窗口名称
        id: 0,
        orderMethod: 0, //下单方式
        orderMethodValue: null, //下单方式值
        phone: null, //联系电话
        dockingWindowDataList: [], //对接窗口数据列表
        isCheck: true //是否打开按钮

    }

    constructor(props) {
        super(props)
        let { 
            id,
            demandName, //需求名称
            demandNumber, //需求编号
            clientName, //客户名称
            clientId, //客户id
            businessExecutivesId, //业务主管id
            businessExecutivesName, //业务主管名称
            businessRepresentativeId, //业务代表id
            businessRepresentativeName, //业务代表名称
            demandType, //需求类型
            dockingWindowId, //对接窗口id
            dockingWindowName, //对接窗口名称
            orderMethod, //下单方式
            orderMethodValue, //下单方式值
            phone, //联系电话
         } = props.vulToChilder
        if (props.getThis) {
            props.getThis(this)
        }
        // consoleconsole.log('demand_info/vulToChilder', props.valueForBase)
        if(props.vulToChilder) {
            this.state.id = id //需求名称
            this.state.demandName = demandName //需求名称
            this.state.demandName = demandName //需求名称
            this.state.demandNumber = demandNumber //需求编号
            this.state.clientName = clientName //客户名称
            this.state.clientId = clientId //客户id
            this.state.businessExecutivesId = businessExecutivesId //业务主管id
            this.state.businessExecutivesName = businessExecutivesName //业务主管名称
            this.state.businessRepresentativeId = businessRepresentativeId ? businessRepresentativeId : props.valueForBase.businessRepresentativeId ? props.valueForBase.businessRepresentativeId : null //业务代表id
            this.state.businessRepresentativeName = businessRepresentativeName ? businessRepresentativeName : props.valueForBase.businessRepresentativeName ? props.valueForBase.businessRepresentativeName : null //业务代表名称
            this.state.demandType = demandType ? JSON.parse(demandType) : [] //需求类型
            this.state.dockingWindowId = dockingWindowId //对接窗口id
            this.state.dockingWindowName = dockingWindowName //对接窗口名称
            this.state.orderMethod = orderMethod //下单方式
            this.state.orderMethodValue = orderMethodValue //下单方式值
            this.state.phone = phone //联系电话
       }
    }

    onChangeCheckValue = (checKVul) => {
        this.setState({
            demandType: checKVul
        })
        return true
    }

    getCustomerContact = () => { //获取对接窗口数据
        const { rApi, vulToChilder, valueForBase } = this.props
        const { clientId } = this.state
        return new Promise((resolve, reject) => {
            rApi.getClientById({
                clientid: (valueForBase && valueForBase.clientId) ? valueForBase.clientId : vulToChilder.clientId
            }).then(res => {
                // console.log(res.contacts)
                if(res && res.contacts) {
                    this.dockingWindowDataList = res.contacts
                    res.contacts = res.contacts.map(item => {
                        return {
                            ...item,
                            id: item.name
                        }
                    })
                    resolve(res.contacts)
                }
                resolve([])
            })
        })
    }

    filterPhone = (id) => { //根据对接窗口id获取对接窗口电话
        let { dockingWindowName } = this.state
        let dockingWindowDataList = this.dockingWindowDataList
        let phoneData = dockingWindowDataList && dockingWindowDataList.length > 0 ? dockingWindowDataList.filter(item => item.name === id) : null
        if (id !== dockingWindowName) {
            this.setState({
                phone: phoneData && phoneData.length > 0 ? phoneData[0].phone : null
            })
        }
    }

    getValue = () => {
        let {
            id,
            businessExecutivesId, //业务主管id
            businessExecutivesName, //业务主管名称
            businessRepresentativeId, //业务代表id
            businessRepresentativeName, //业务代表名称
            demandType, //需求类型
            dockingWindowId, //对接窗口id
            dockingWindowName, //对接窗口名称
            orderMethod, //下单方式
            orderMethodValue, //下单方式值
            phone, //联系电话
        } = this.state
        return {
            id,
            businessExecutivesId, //业务主管id
            businessExecutivesName, //业务主管名称
            businessRepresentativeId, //业务代表id
            businessRepresentativeName, //业务代表名称
            demandType, //需求类型
            dockingWindowId, //对接窗口id
            dockingWindowName, //对接窗口名称
            // id: 1,
            orderMethod, //下单方式
            orderMethodValue, //下单方式值
            phone, //联系电话
        }
    }

    render() {
        let {
            demandName, //需求名称
            demandNumber, //需求编号
            clientName, //客户名称
            clientId, //客户id
            businessExecutivesId, //业务主管id
            businessExecutivesName, //业务主管名称
            businessRepresentativeId, //业务代表id
            businessRepresentativeName, //业务代表名称
            demandType, //需求类型
            dockingWindowId, //对接窗口id
            dockingWindowName, //对接窗口名称
            id,
            orderMethod, //下单方式
            orderMethodValue, //下单方式值
            phone, //联系电话
            isCheck
        } = this.state
        // console.log('businessRepresentativeName', businessRepresentativeName, businessRepresentativeId)
        const { getFieldDecorator, setFieldsValue } = this.props.form
        return (
            <div className='demand-main'>
                <div className='demand-info flex'>
                    {/* <SwitchBtn 
                        title="需求基本信息"
                        onChange={checked => {
                            this.setState({
                                isCheck: checked
                            })
                        }} 
                    /> */}
                    <div style={{width: 200}}>
                        <span  style={{color: '#808080', verticalAlign: 'middle', marginLeft: '38px'}}>需求基本信息</span>
                    </div>
                    <div className="flex1 div-style">
                        <Row gutter={24}>
                            <Col label="对接窗口&emsp;&emsp;" colon span={24}>
                                <RemoteSelect
                                    defaultValue={dockingWindowName ? {id: dockingWindowName, name: dockingWindowName} : null}
                                    //placeholder={''}
                                    //getPopupContainer={() => this.view}
                                    onChangeValue={
                                        value => {
                                            this.setState({
                                                dockingWindowId: null,
                                                dockingWindowName: value ? value.name || value.title : ''
                                            })
                                            this.filterPhone(value ? value.name || value.title : '')
                                        }
                                    } 
                                    // getDataMethod={'getClientById'}
                                    getData={this.getCustomerContact}
                                    labelField={'name'}
                                />
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col  label="联系电话&emsp;&emsp;" colon span={24} >
                                <FormItem>
                                    {
                                        getFieldDecorator('phone', {
                                            initialValue: phone,
                                            rules: [
                                                {
                                                    validator: validateToNextPhone
                                                }
                                            ],
                                        })(
                                            <Input 
                                                //defaultValue={phone ? phone : ''}
                                                style={{borderRadius: 0, width: 200}}
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({
                                                        phone: e.target.value
                                                })
                                            }}
                                        />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                                <Col label="业务代表&emsp;&emsp;" colon span={24}>
                                <RemoteSelect
                                    defaultValue={(businessRepresentativeId && businessRepresentativeName) ? {id: businessRepresentativeId, username: businessRepresentativeName} : null}
                                    //placeholder={''}
                                    onChangeValue={
                                        (value = {}) => {
                                            this.setState({
                                                businessRepresentativeId: value ? value.id : '',
                                                businessRepresentativeName: value ? value.name || value.username : ''
                                            })
                                        }
                                    } 
                                    getDataMethod={'getUsers'}
                                    params={{limit: 999999, offset: 0}}
                                    labelField={'username'}
                                />
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col  label="业务主管&emsp;&emsp;" colon span={24}>
                                <RemoteSelect
                                    defaultValue={(businessExecutivesId && businessExecutivesName) ? {id: businessExecutivesId, username: businessExecutivesName} : null}
                                    //placeholder={''}
                                    onChangeValue={
                                        value => {
                                            this.setState({
                                                businessExecutivesId: value ? value.id : '',
                                                businessExecutivesName: value ? value.name || value.title : ''
                                            })
                                        }
                                    } 
                                    getDataMethod={'getUsers'}
                                    params={{limit: 999999, offset: 0}}
                                    labelField={'username'}
                                    //labelField='title'
                                    //list={onJob}
                                />
                            </Col>
                        </Row>
                    </div>
                    {/* <div className='flex'>
                        <div className='flex1' style={{padding: '0px 20px 0 26px'}}>
                            <Row gutter={24}>
                                <Col  label="需求编号" span={11}>
                                    <Input 
                                        defaultValue={demandNumber ? demandNumber : ''}
                                        style={{maxWidth: 170}}
                                        disabled
                                        placeholder="自动生成" 
                                    />
                                </Col>
                                <Col  label="需求名称" span={11}>
                                    <Input 
                                        defaultValue={demandName ? demandName : ''}
                                        style={{maxWidth: 170}}
                                        disabled
                                        placeholder="自动生成" 
                                    />
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col  label="需求类型" span={24} >
                                    <CustomCheckbox 
                                        values={demandType}
                                        list={demandTypeData}
                                        onChangeValue={this.onChangeCheckValue}
                                    >
                                    </CustomCheckbox>
                                </Col>
                            </Row>
                            <Row gutter={24} style={{height: 49.98}}>
                                <Col  label="下单方式" span={24}>
                                    <div className="flex flex-vertical-center">
                                        <RadioGroup 
                                            onChange={e => {
                                                this.setState({
                                                    orderMethod: e.target.value
                                                })
                                            }} 
                                            value={orderMethod ? orderMethod : 1}
                                            defaultValue={orderMethod ? orderMethod : 1}
                                            >
                                                <Radio value={1}>系统对接</Radio>
                                                <Radio value={2}>邮件/QQ</Radio>
                                        </RadioGroup>
                                        {
                                            orderMethod === 2 ?
                                            <FormItem style={{height: 39.9999, verticalAlign: 'middle'}}>
                                                {
                                                    getFieldDecorator('orderMethodValue', {
                                                        initialValue: orderMethodValue,
                                                        rules: [
                                                            {
                                                                validator: validateToNextQQorEmail
                                                            }
                                                        ],
                                                    })(
                                                        <Input 
                                                            //defaultValue={orderMethodValue ? orderMethodValue : ''}
                                                            //value={orderMethodValue ? orderMethodValue : ''}
                                                            style={{maxWidth: 180}}
                                                            placeholder="" 
                                                            onChange={e => {
                                                                this.setState({
                                                                    orderMethodValue: e.target.value
                                                                })
                                                            }}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                            :
                                            null
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div style={{borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc', padding: '0 20px', width: 250}}>
                            <Row gutter={24}>
                                <Col  label="客户名称" span={24}>
                                    <Select
                                        placeholder={'自动生成'}
                                        defaultValue={clientName} 
                                        disabled
                                    />
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col  label="对接窗口" span={24}>
                                    <RemoteSelect
                                        defaultValue={dockingWindowName ? {id: dockingWindowName, name: dockingWindowName} : null}
                                        //placeholder={''}
                                        //getPopupContainer={() => this.view}
                                        onChangeValue={
                                            value => {
                                                this.setState({
                                                    dockingWindowId: null,
                                                    dockingWindowName: value ? value.name || value.title : ''
                                                })
                                                this.filterPhone(value ? value.name || value.title : '')
                                            }
                                        } 
                                        // getDataMethod={'getClientById'}
                                        getData={this.getCustomerContact}
                                        labelField={'name'}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col  label="联系电话" span={24} >
                                    <FormItem>
                                        {
                                            getFieldDecorator('phone', {
                                                initialValue: phone,
                                                rules: [
                                                    {
                                                        validator: validateToNextPhone
                                                    }
                                                ],
                                            })(
                                                <Input 
                                                    //defaultValue={phone ? phone : ''}
                                                    placeholder="" 
                                                    onChange={e => {
                                                        this.setState({
                                                            phone: e.target.value
                                                    })
                                                }}
                                            />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            </div>
                        <div style={{padding: '0 20px', width: 250}}>
                            <Row gutter={24}>
                                    <Col  label="业务代表" span={24}>
                                        <RemoteSelect
                                           defaultValue={(businessRepresentativeId && businessRepresentativeName) ? {id: businessRepresentativeId, username: businessRepresentativeName} : null}
                                            //placeholder={''}
                                            onChangeValue={
                                                value => {
                                                    this.setState({
                                                        businessRepresentativeId: value ? value.id : '',
                                                        businessRepresentativeName: value ? value.name || value.title : ''
                                                    })
                                                }
                                            } 
                                            getDataMethod={'getUsers'}
                                            params={{limit: 999999, offset: 0}}
                                            labelField={'username'}
                                        />
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col  label="业务主管" span={24}>
                                        <RemoteSelect
                                            defaultValue={(businessExecutivesId && businessExecutivesName) ? {id: businessExecutivesId, username: businessExecutivesName} : null}
                                            //placeholder={''}
                                            onChangeValue={
                                                value => {
                                                    this.setState({
                                                        businessExecutivesId: value ? value.id : '',
                                                        businessExecutivesName: value ? value.name || value.title : ''
                                                    })
                                                }
                                            } 
                                            getDataMethod={'getUsers'}
                                            params={{limit: 999999, offset: 0}}
                                            labelField={'username'}
                                            //labelField='title'
                                            //list={onJob}
                                        />
                                    </Col>
                                </Row>
                        </div>
                    </div> */}
                </div>
            </div>
        )
    }
}
 
export default Form.create()(DemandInfo);