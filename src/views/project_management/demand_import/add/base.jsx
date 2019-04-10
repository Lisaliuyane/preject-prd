import React, { Component} from 'react'
import { Button, Form, Input, message, Spin } from 'antd'
import FormItem from '@src/components/FormItem'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { Row, Col } from '@src/components/grid'
import { CustomCheckbox } from '@src/components/custom_check'
import { stringToArray } from '@src/utils'
import { toDemandList, toCooperativeList } from '@src/views/layout/to_page'
import { resolve } from 'upath'
import './base.less'

const optionDataOne = [ //运作类型研发
    {
        id: 1,
        label: '运输', 
        value: 1
    },
    {
        id: 2,
        label: '仓储', 
        value: 2
    }
]

const planModel = [
    {
        id: 1,
        title: '标准规划'
    },
    {
        id: 2,
        title: '快速规划'
    }
]

/**
 * 需求基本信息
 * 
 * @class BaseInfo
 * @extends {Component}
 */
@inject('mobxTabsData')
@inject('rApi')
@observer
class BaseInfo extends Component {
    state = {
        demandName: null, //需求名称
        clientName: null, //客户名称
        clientId: null, //客户id
        operationType: [], // 运作类型研发
        planMode: 0,
        id: 0,
        loading: false,
        processStatus: 1,
        demandStatus: null,
        businessRepresentativeId: null, //业务代表id
        businessRepresentativeName: null //业务代表name
    }

    constructor(props) {
        super(props)
        let { 
            id,
            demandName,
            clientName,
            clientId,
            operationType,
            planMode,

         } = props.toChilderVal
        if (props.getThis) {
            props.getThis(this)
        }
        this.state.processStatus = props.processStatus //步骤
        if(props.toChilderVal) {
            this.state.id = id //需求名称
            this.state.demandName = demandName //需求名称
            this.state.clientName = clientName //客户名称
            this.state.clientId = clientId //客户id
            this.state.operationType = operationType //下单方式值
            this.state.planMode = planMode //联系电话
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.processStatus !== this.props.processStatus) {
            this.setState({
                processStatus: nextProps.processStatus
            })
        }
    }

    onChangeCheckValue = (value) => {
        this.setState({
            operationType: value
        })
        this.props.getOptionData(value)
        return true
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            this.saveSubmit()
          }
        });
    }

    saveSubmit = () => {
        let { rApi, originThis } = this.props
        let {
            demandName, //需求名称
            clientName, //客户名称
            clientId, //客户id
            operationType, // 运作类型研发
            planMode,
            id,
            businessRepresentativeId, //业务代表id
            businessRepresentativeName,
            valueToParent
        } = this.state
        this.setState({
            loading: true
        })
        rApi.addDemand({
            demandName,
            clientName,
            clientId,
            operationType, // 运作类型研发
            planMode,
            id
        }).then(d => {
            message.success('操作成功!')
            // console.log(d)
            this.props.getChilderVal({...d, businessRepresentativeId: businessRepresentativeId, businessRepresentativeName: businessRepresentativeName})
            this.setState({
                loading: false,
                id: d.id,
                demandStatus: 1
            })
        }).catch(e => {
            message.error(e.msg || '操作失败!')
            this.setState({
                loading: false
            })
        })
    }

    terminationPlanning = () => { //终止
        let { rApi } = this.props
        let { id } = this.state
        rApi.suspendDemand({
            id
        }).then(d => {
            message.success('操作成功!')
            this.toDemandListPage()
        }).catch(e => {
            message.error(e.msg || '操作失败!')
        })
    }

    recoveryPlanning = () => { //恢复
        let { rApi } = this.props
        let { id } = this.state
        rApi.suspendCancel({
            id
        }).then(d => {
            message.success('操作成功!')
            this.toDemandListPage()
        }).catch(e => {
            message.error(e.msg || '操作失败!')
        })
    }

    generateCooperativeProject = () => { //创建为合作项目
        const { mobxTabsData } = this.props
        let {
            demandName, //需求名称
            clientName, //客户名称
            clientId, //客户id
            id
        } = this.state
        toCooperativeList(mobxTabsData, {
            pageData: {
                key: '应收报价预估',
                demandName, //需求名称
                clientName,
                clientId,
                id
            }
        })
    }

    toDemandListPage = () => { //跳转到需求导入规划列表页面
        const { mobxTabsData, originThis, mykey } = this.props
        originThis.reloadList()
        toDemandList(mobxTabsData, {})
        mobxTabsData.closeTab(mykey)
    }

    render() {
        let {
            demandName, //需求名称
            clientName, //客户名称
            clientId, //客户id
            operationType, // 运作类型研发
            planMode,
            loading,
            id,
            processStatus,
            demandStatus
        } = this.state
        let { toChilderVal, status, isEstimate } = this.props
        //console.log('basexxxxxxxx', status, isEstimate)
        const { getFieldDecorator, setFieldsValue } = this.props.form
        return (
            <Spin spinning={loading}>
                <div className='demand-base' style={{padding: '0 20px'}}>
                    <Form layout='inline' onSubmit={this.handleSubmit}>
                        <div className='flex flex-vertical-center' style={{borderBottom: '1px solid #DDDDDD',padding: '10px 0'}}>
                            <div style={{color: '#484848', letterSpacing: '-0.34px'}}>基本信息</div>
                            <div className='flex1'></div>
                            {
                                (processStatus > 1 || (toChilderVal && toChilderVal.demandStatus === 3))?
                                null
                                :
                                <div>
                                    <Button 
                                        //icon='save' 
                                        loading={loading}
                                        //onClick={this.saveSubmit} 
                                        htmlType="submit"
                                        style={{ borderRadius: 0, border: 0, background: '#18B583', color: '#fff'}}
                                        //disabled={(status === 2 || status === 3) ? true : false}
                                    >
                                        保存
                                    </Button>
                                </div>
                            }
                            {
                               (demandStatus || (toChilderVal && toChilderVal.demandStatus === 1)) ?
                                <div>
                                    <Button 
                                        //icon='save' 
                                        loading={loading}
                                        onClick={this.terminationPlanning} 
                                        style={{ marginLeft: 10, borderRadius: 0, border: 0, background: '#DF5147', color: '#fff'}}
                                        //disabled={(status === 2 || status === 3) ? true : false}
                                    >
                                        中止
                                    </Button>
                                </div>
                                :
                                null
                            }
                            {
                                ( status === 3 && processStatus === 4) ?
                                <div className="quotes-btn">
                                    <Button 
                                        onClick={this.generateCooperativeProject}
                                    >
                                        创建为合作项目
                                    </Button>
                                </div>
                                :
                                null
                            }
                            {
                                (toChilderVal && toChilderVal.demandStatus === 3) ?
                                <div>
                                    <Button 
                                        //icon='save' 
                                        loading={loading}
                                        onClick={this.recoveryPlanning} 
                                        style={{  marginLeft: 10, borderRadius: 0, border: 0, background: '#18B583', color: '#fff'}}
                                        //disabled={(status === 2 || status === 3) ? true : false}
                                    >
                                        恢复
                                    </Button>
                                </div>
                                :
                                null
                            }
                        </div>
                        <div className='flex'>
                            <div className='flex1' style={{marginTop: 5}}>
                                <Row gutter={24}>
                                    <Col  label="需求名称&emsp;&emsp;" colon  span={12} isRequired>
                                        {
                                            // processStatus > 1?
                                            // <span style={{color: '#484848'}}>{demandName}</span>
                                            // :
                                            <FormItem>
                                                {
                                                    getFieldDecorator('demandName', {
                                                        initialValue: demandName,
                                                        rules: [
                                                            { 
                                                                required: true, 
                                                                message: '请填写业务名称'
                                                            }
                                                        ],
                                                    })(
                                                        <Input 
                                                            style={{maxWidth: 200, borderRadius: 0}}
                                                            disabled={processStatus > 1 ? true : false}
                                                            placeholder="" 
                                                            onChange={e => {
                                                                this.setState({demandName: e.target.value})
                                                            }
                                                        }
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        }
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col label="客户名称&emsp;&emsp;" colon span={12} isRequired>
                                        {
                                            // processStatus > 1?
                                            // <span style={{color: '#484848'}}>{clientName}</span>
                                            // :
                                            <FormItem>
                                                {
                                                    getFieldDecorator('clientName', {
                                                        rules: [
                                                            { 
                                                                required: true, 
                                                                message: '请选择客户'
                                                            }
                                                        ],
                                                    })(
                                                        <RemoteSelect
                                                            defaultValue={clientId ? {id: clientId, shortname: clientName} : null}
                                                            onChangeValue={
                                                                value => {
                                                                    this.setState({
                                                                        clientId: value ? value.id : '',
                                                                        clientName: value ? value.shortname || value.name : '',
                                                                        businessRepresentativeId: (value && value.origin_data && value.origin_data[0]) ? value.origin_data[0].salesman.id : null, 
                                                                        businessRepresentativeName: (value && value.origin_data && value.origin_data[0]) ? value.origin_data[0].salesman.name : null
                        
                                                                    })
                                                                }
                                                            } 
                                                            disabled={processStatus > 1 ? true : false}
                                                            getDataMethod={'getClients'}
                                                            params={{limit: 999999, offset: 0, status: 56}}
                                                            labelField={'shortname'}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        }
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col label="规划模式&emsp;&emsp;" colon span={12} isRequired>
                                        <FormItem>
                                                {
                                                    getFieldDecorator('planMode', {
                                                        rules: [
                                                            { 
                                                                required: true, 
                                                                message: '请选择规划模式'
                                                            }
                                                        ],
                                                    })(
                                                        <RemoteSelect
                                                            defaultValue={(planMode && planMode === 1) ? {id: planMode, title: '标准规划'} :  (planMode && planMode === 2) ? {id: planMode, title: '快速规划'} : null}
                                                            //placeholder={''}
                                                            //getPopupContainer={() => this.view}
                                                            disabled={processStatus > 1 ? true : false}
                                                            onChangeValue={
                                                                value => {
                                                                    this.setState({
                                                                        planMode: value ? value.id : '',
                                                                        //dockingWindowName: value ? value.title : ''
                                                                    })
                                                                    this.props.getPlanModel(value)
                                                                }
                                                            } 
                                                            list={planModel}
                                                            labelField={'title'}
                                                        />
                                                    )
                                                }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col label="运作类型&emsp;&emsp;" colon span={24}>
                                        <CustomCheckbox 
                                            disabled={processStatus > 1 ? true : false}
                                            values={stringToArray(operationType)}
                                            list={optionDataOne}
                                            onChangeValue={this.onChangeCheckValue}
                                        >
                                        </CustomCheckbox>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Form>
                </div>
            </Spin>
        )
    }
}
 
export default Form.create()(BaseInfo);