import React, {Component, Fragment} from 'react'
import { HeaderView, Table, Parent} from '@src/components/table_template'
import { Tabs, Popover, Icon, Input, Steps, Button, Form, message, Popconfirm, Spin  } from 'antd'
import { inject, observer } from "mobx-react"
// import AddOrEdit from './addoredit'
import CustomerDemand from './require/index.jsx'
import ProjectDevelopment from './plan/index.jsx'
import CostPlan from './cost/index.jsx'
import QuotationEstimate from './estimate/index.jsx'
import { children, id } from './power_hide'
import moment from 'moment'
import BaseInfo from './base'
import { stringToArray } from '@src/utils'
import FunctionPower from '@src/views/layout/power_view/function.jsx'

const TabPane = Tabs.TabPane
const power = Object.assign({}, children, id)
const { TextArea } = Input
const Step = Steps.Step

const DemandTabChildren = (props) => {
    // console.log('props.values.rejectReason', props.values.rejectReason)
    return (
        <span key="CustomerDemandTabChildren">
            {props.title}
            {
                ((props.values.status === 0 && props.values.rejectReason) || (!props.values.status && props.values.rejectReason)) ?
                <Popover
                    content={
                        <div style={{width: 250}}>
                            <div className="flex" style={{fontSize: '12px', color: '#c8c8c8', marginBottom: 5}}>
                                <span style={{color: '#3db389'}}>{props.values.operatorName}</span>
                                <span className="flex1"></span>
                                <span>{moment(props.values.operatorTime).format('YYYY/MM/DD HH:mm:ss')}</span>
                            </div>
                            <TextArea 
                                value={props.values.rejectReason && props.values.rejectReason !== 'null' ? props.values.rejectReason : '无'}
                                key='rejectReason'
                                autosize={{ minRows: 2, maxRows: 10 }}
                                disabled
                            />
                        </div>
                    }
                    placement="bottomLeft"
                    trigger="click"
                    title={<div style={{fontSize: '12px'}}>{props.popTitle}</div>}
                >
                    {
                        <Icon 
                            type="info-circle-o" 
                            style={{color: 'red', marginLeft: 2}}
                            onClick={(e)=> e.stopPropagation()}
                        />
                    }
                </Popover>
                :
                null
            }
        </span>
    )
}

const DemandRejectChildren = (props) => {
    return (
        <div style={{width: 250}}>
            <TextArea 
                //value={transportCost ? transportCost : ''}
                //value={desc ? desc : ''}
                placeholder="需求驳回原因" 
                key='rejectReason'
                autosize={{ minRows: 2, maxRows: 10 }}
                onChange={e => {
                    props.rejectReasonVul(e.target.value)
                 }
                }
            />
        </div>
        
    )
}

export class HeaderButton extends Component {
    state = {
        status: null
    }
    constructor(props) {
        super(props)
        this.state.status = props.status
    }

    componentWillReceiveProps(nextProps) {
        //console.log('componentWillReceiveProps')
        if(nextProps.status !== this.props.status) {
            this.setState({
                status: nextProps.status
            })
        }
    }

    render() {
        let { status } = this.state
        let { toChilderVal, demand, plan, cost, estimate, processStatus, rejectStatus, planModel, isDisabled} = this.props
        let ThisVul = processStatus === 1 ? 
        demand 
        : 
        (processStatus === 2 && planModel === 1) ?
        plan 
        : 
        processStatus === 2 && (planModel !== 1) ?
        cost
        :
        (processStatus === 3 && planModel === 1)? 
        cost 
        : 
        processStatus === 3 && (planModel !== 1) ?
        estimate
        :
        processStatus === 4 ? 
        estimate 
        : 
        demand
        // let isDisabled = rejectStatus !== 0 && rejectStatus !== processStatus
        //console.log('头部按钮', processStatus, rejectStatus, isDisabled)
        if(!ThisVul) {
            return null
        }
        return(
            <div className='flex flex-vertical-center' style={{borderBottom: '1px solid #DDDDDD',padding: '2px 0 5px'}}>
                <div style={{ lineHeight:'32px' }}>
                    <span style={{color: '#484848'}}>{this.props.title}</span>
                    {
                        status === 2 ?
                        <span style={{fontSize: '14px', color: '#18B583', marginLeft: 10}}>已提交</span>
                        :
                        status === 3 ?
                        <span style={{fontSize: '14px', color: '#18B583', marginLeft: 10}}>审核通过</span>
                        :
                        status === 0 ?
                        <span style={{fontSize: '14px', color: 'red', marginLeft: 10}}>驳回</span>
                        :
                        null
                    }
                </div>
                <div className='flex1'>
                </div>
                {
                    (toChilderVal && toChilderVal.demandStatus === 3) ?
                    null
                    :
                    <div>
                        <FunctionPower power={
                            ThisVul === demand ? 
                            power.DEMAND_SAVE
                            :
                            ThisVul === plan ?
                            power.PLAN_SAVE
                            :
                            ThisVul === cost ?
                            power.COST_SAVE
                            :
                            ThisVul === estimate ?
                            power.ESTIMATE_SAVE
                            :
                            power.DEMAND_SAVE
                        }>
                            <Button 
                                //icon='save' 
                                loading={this.props.loading}
                                className={!status ? 'btn-success' : ''}
                                onClick={ThisVul.saveSubmit} 
                                style={{ marginRight: '10px', borderRadius: 0, border: !status ? 'none' : '1px solid #d9d9d9'}}
                                disabled={(status === 2 || status === 3 || isDisabled) ? true : false}
                            >
                                保存
                            </Button>
                        </FunctionPower>
                        <FunctionPower power={
                            ThisVul === demand ? 
                            power.DEMAND_SUBMIT
                            :
                            ThisVul === plan ?
                            power.PLAN_SUBMIT
                            :
                            ThisVul === cost ?
                            power.COST_SUBMIT
                            :
                            ThisVul === estimate ?
                            power.ESTIMATE_SUBMIT
                            :
                            power.DEMAND_SUBMIT
                        }>
                            <Popconfirm
                                placement="topLeft"
                                title="确定提交吗?"
                                onConfirm={ThisVul.submit}
                                okText="确定"
                                cancelText="取消">
                                    <Button 
                                        //icon='rocket' 
                                        className={status === 1 ? 'btn-success' : ''}
                                        style={{ marginRight: '10px', borderRadius: 0, border: status === 1 ? 'none' : '1px solid #d9d9d9'}}
                                        disabled={(((!status|| status === 2 || status === 3) && status !== 0) || isDisabled) ? true : false}
                                    >
                                        提交
                                    </Button>
                            </Popconfirm>
                        </FunctionPower>
                        {
                            // status === 3 ?
                            // <FunctionPower power={power.EXAMINE_CANCEL
                                // ThisVul === demand ? 
                                // power.EXAMINE_CANCEL
                                // :
                                // ThisVul === plan ?
                                // power.PLAN_CANCEL
                                // :
                                // ThisVul === cost ?
                                // power.COST_CANCEL
                                // :
                                // ThisVul === estimate ?
                                // power.ESTIMATE_CANCEL
                                // :
                                // power.EXAMINE_CANCEL
                                // }>
                            //     <Popconfirm
                            //         placement="topLeft"
                            //         title="确定取消吗?"
                            //         onConfirm={ThisVul.examineCancelPassSubmit}
                            //         okText="确定"
                            //         cancelText="取消">
                            //             <Button 
                            //                 //icon='enter' 
                            //                 style={{ marginRight: '10px', borderRadius: 0}}
                            //                 disabled={(status === 2 || status === 3) ? false : true}
                            //             >
                            //                 取消通过
                            //             </Button>
                            //     </Popconfirm>
                            // </FunctionPower>
                            // :
                            <FunctionPower power={
                                ThisVul === demand ? 
                                power.EXAMINE_PASS
                                :
                                ThisVul === plan ?
                                power.PLAN_PASS
                                :
                                ThisVul === cost ?
                                power.COST_PASS
                                :
                                ThisVul === estimate ?
                                power.ESTIMATE_PASS
                                :
                                power.EXAMINE_PASS
                            }>
                                <Popconfirm
                                    placement="topLeft"
                                    title="确定通过吗?"
                                    onConfirm={ThisVul.examinePassSubmit}
                                    okText="确定"
                                    cancelText="取消">
                                        <Button 
                                            //icon='enter' 
                                            style={{ marginRight: '10px', borderRadius: 0}}
                                            disabled={(status === 2 && !isDisabled) ? false : true}
                                        >
                                            审核通过
                                        </Button>
                                </Popconfirm>
                            </FunctionPower>
                        }
                        <FunctionPower power={
                            ThisVul === demand ? 
                            power.EXAMINE_REJECT
                            :
                            ThisVul === plan ?
                            power.PLAN_REJECT
                            :
                            ThisVul === cost ?
                            power.COST_REJECT
                            :
                            ThisVul === estimate ?
                            power.ESTIMATE_REJECT
                            :
                            power.EXAMINE_REJECT
                        }>
                            {/* <Popconfirm
                                placement="bottomLeft"
                                title={<DemandRejectChildren rejectReasonVul={ThisVul.rejectReasonVul}/>}
                                onConfirm={ThisVul.examineRegectSubmit}
                                okText="确定"
                                cancelText="取消">
                                    <Button 
                                        icon='rollback' 
                                        style={{color: 'red', borderColor: 'red'}}
                                        disabled={status === 3 ? true : false}
                                    >
                                        需求驳回
                                    </Button>
                            </Popconfirm> */}
                            <Popconfirm
                                placement="bottomLeft"
                                title='确定驳回吗?'
                                onConfirm={ThisVul.examineRegectSubmit}
                                okText="确定"
                                cancelText="取消">
                                    <Button 
                                        //icon='rollback' 
                                        style={{color: '#DF5147', border: '1px solid #DF5147', borderRadius: 0}}
                                        disabled={(!status || status === 1 || isDisabled) ? true : false}
                                    >
                                        驳回
                                    </Button>
                            </Popconfirm>
                        </FunctionPower>
                    </div>
                }
            </div>
        )
    }
    
}


/**
 * 需求明细
 * 
 * @class DemandDetails
 * @extends {Component}
 */
@inject('mobxTabsData', 'mobxBaseData', 'getFuctionHavePower')
// @inject('rApi')
class DemandDetails extends Parent{

    state = {
        tabSize: 'small',
        id: null,
        toChilderVal: {},
        customerValues: {}, //需求驳回数据
        planValues: {}, //方案驳回数据
        costValues: {}, //成本驳回数据
        estimateValues: {}, //应收报价预估驳回数据
        processStatus: 0, //当前阶段
        backupsProcessStatus: 1,
        operationTypeList: [], //运作类型数据
        planModel: null, //规划模式
        valueForBase: {}, // 接收base值
        status: null, //按钮的状态=> 状态 0-驳回 1-保存 2-提交 3-审核通过
        demand: null,
        plan: null,
        cost: null,
        estimate: null,
        origin: null, //新建编辑传入的this
        requestDone: false,
        saveLoading: false,
        rejectStatus: 0 //驳回阶段 1-客户需求 2-方案研发 3-成功规划 4-应收预估
    }

    constructor(props) {
        super(props);
        const { mobxTabsData, mykey } = props
        const pageData = mobxTabsData.getPageData(mykey)
        this.state.origin = pageData.originThis
        if(pageData.openType === 3) {
            mobxTabsData.setTitle(mykey, '新建需求')
        } else {
            mobxTabsData.setTitle(mykey, `需求: ${pageData.demandName}`)
        }
        if(pageData.openType === 1 || pageData.openType === 2) {
            this.state.id = pageData.id
            this.state.planModel = pageData.planModel
            this.state.processStatus = pageData.processStatus ? pageData.processStatus : 0
            this.state.toChilderVal = pageData
            this.state.operationTypeList = stringToArray(pageData.operationType)
            this.state.rejectStatus = pageData.rejectStatus ? pageData.rejectStatus : 0

        }

        //console.log('pageData11', pageData)
    }

    setHeaderTitle = (value) => {
        const { mobxTabsData, mykey } = this.props
        const pageData = mobxTabsData.getPageData(mykey)
        const demandName = value.demandName
        mobxTabsData.setTitle(mykey, demandName ? `需求: ${demandName}` : '编辑需求')
        //console.log('setHeaderTitle', value)
    }

    isHaveAuth = (id) => {
        const { mobxBaseData } = this.props
        return mobxBaseData.isHaveAuth(id)
    }

    demandValues = (values) => {
        //console.log('demandValues', values)
        this.setState({
            status: values.status,
            customerValues: {
                rejectReason: (values && values.rejectReason) ? values.rejectReason : '',
                operatorName: (values && values.operatorName) ? values.operatorName : '',
                operatorTime: (values && values.createTime) ? values.createTime : '',
                status: (values && values.status) ? values.status : null
            }
        })
        
    }

    planValues = (values) => {
        //console.log('planValues', values)
        this.setState({
            planValues: {
                rejectReason: (values && values.rejectReason) ? values.rejectReason : '',
                operatorName: (values && values.operatorName) ? values.operatorName : '',
                operatorTime: (values && values.createTime) ? values.createTime : '',
                status: (values && values.status) ? values.status : null
            }
        })
        
    }

    costValues = (values) => {
        //console.log('costValues', values)
        this.setState({
            costValues: {
                rejectReason: (values && values.rejectReason) ? values.rejectReason : '',
                operatorName: (values && values.operatorName) ? values.operatorName : '',
                operatorTime: (values && values.createTime) ? values.createTime : '',
                status: (values && values.status) ? values.status : null
            }
        })
        
    }

    estimateValues = (values) => {
        //console.log('costValues', values)
        this.setState({
            estimateValues: {
                rejectReason: (values && values.rejectReason) ? values.rejectReason : '',
                operatorName: (values && values.operatorName) ? values.operatorName : '',
                operatorTime: (values && values.createTime) ? values.createTime : '',
                status: (values && values.status) ? values.status : null
            }
        })
        
    }

    processStatusValues = (values) => {
        this.setState({
            processStatus: values
        })
        // console.log('processStatusValues', values)
    }

    onClick = (value, index) => {
        let { processStatus, rejectStatus} = this.state
        this.isEstimate = false
        if(value === '应收报价预估') {
            this.isEstimate = true
        }
        if(rejectStatus) {
            let msg = rejectStatus === 1 ? '客户需求' : rejectStatus === 2 ? '方案明细' : rejectStatus === 3 ? '资源成本规划' : rejectStatus === 4 ? '应收报价预估' : ''
            message.warning(`${msg}阶段处于修改状态!`)
        }
        if((index-1) > processStatus) {
            message.warning('请等待上一步审核通过!')
        } else {
            this.setState({
                backupsProcessStatus: index
            })
        }
    }

    getChildStatus = (value) => {
        this.setState({
            status: value
        })
    }

    getRejectStatus = (value) => { //驳回状态
        this.setState({
            rejectStatus: value
        })
    }

    requestDoneValue = (value) => { //请求完毕
        this.setState({
            requestDone: value
        })
    }
    render() {
        let {
            id,
            toChilderVal,
            customerValues, //需求驳回数据
            planValues, //方案驳回数据
            costValues, //成本驳回数据
            estimateValues, //应收报价预估驳回数据
            processStatus, //当前操作步骤
            rejectStatus, //当前驳回步骤
            backupsProcessStatus, //备份不知值
            operationTypeList,
            planModel,
            valueForBase,
            status,
            demand,
            plan,
            cost,
            estimate,
            origin,
            requestDone
        } = this.state
        //console.log('this.isEstimate', this.isEstimate)
        const { mobxTabsData, mykey, getFuctionHavePower } = this.props
        const pageData = mobxTabsData.getPageData(mykey)
        let backPro = 1
        let isDisabled = false //当前步骤驳回时，其余步骤不能进行操作
        if(planModel === 1) {
            backPro = backupsProcessStatus
        } else {
            backPro = backupsProcessStatus !== 1 ? (backupsProcessStatus + 1) : backupsProcessStatus
        }
        isDisabled = (rejectStatus !== 0 && rejectStatus !== backPro)
       // console.log('addddddd', backPro, rejectStatus, isDisabled)
        return (
            // <Spin spinning={true}>
                <div style={{background: '#eee'}}>
                    <div className="demand-import-wrapper" style={{maxWidth: 1240, background: '#fff', margin: '0 auto 20px', minHeight: id ? this.props.minHeight : '280px'}}>
                            <div className="demand-import-title">
                                <BaseInfo 
                                    id={id}
                                    toChilderVal={pageData}
                                    originThis={origin}
                                    demandValues={this.demandValues}
                                    processStatus={processStatus}
                                    getOptionData={(value) => {
                                        this.setState({
                                            operationTypeList: value
                                        })
                                    }}
                                    isEstimate={this.isEstimate}
                                    status={status}
                                    estimateValues={estimateValues}
                                    getPlanModel={(value) => {
                                        this.setState({
                                            planModel: value ? value.id : null
                                        })
                                    }}
                                    getChilderVal={(value={}) => {
                                        this.setHeaderTitle(value)
                                        this.setState({
                                            valueForBase: value,
                                            id: value.id
                                        }, () => {
                                            if(origin) {
                                                origin.reloadList()
                                            }
                                        })
                                    }}
                                />
                            </div>
                            {
                                id ?
                                <div>
                                    <div style={{height: 10, background: '#eee'}}></div>
                                    <div className="demand-import-main">
                                    {/* <DemandTabChildren title="客户需求" values={customerValues} popTitle="需求驳回原因"/> */}
                                        <div className="box-shadow" style={{padding: '0px 20px'}}>
                                            {/* <div style={{color: '#484848', letterSpacing: '-0.34px'}}>报价</div> */}
                                            <div className='flex flex-vertical-center'>
                                                <div className='flex1'>
                                                {
                                                    ((demand ||  plan ||cost || estimate) && this.state.requestDone) ?
                                                    <div style={{padding: '5px 0'}}>
                                                        <HeaderButton 
                                                            demand={demand}
                                                            plan={plan}
                                                            cost={cost}
                                                            estimate={estimate}
                                                            title={backupsProcessStatus === 1 ? 
                                                                '需求明细'
                                                                :
                                                                backupsProcessStatus === 2 ?
                                                                '方案明细'
                                                                :
                                                                backupsProcessStatus === 3 ?
                                                                '成本规划明细'
                                                                :
                                                                backupsProcessStatus === 4 ?
                                                                '报价预估明细'
                                                                :
                                                                '需求明细'
                                                            }
                                                            status={status}
                                                            planModel={planModel}
                                                            processStatus={backupsProcessStatus}
                                                            rejectStatus={rejectStatus}
                                                            toChilderVal={pageData}
                                                            loading={this.state.saveLoading}
                                                            isDisabled={isDisabled}
                                                        />
                                                    </div>
                                                    :
                                                    ''
                                                }
                                                </div>
                                            </div>
                                            <div className="step-wrapper" style={{width: '85%', margin: '0 auto', padding: '30px 10px'}}>
                                                <Steps current={parseInt(backupsProcessStatus, 10) ? parseInt(backupsProcessStatus, 10) === 5 ? 0 : parseInt(backupsProcessStatus, 10)-1 : 0} labelPlacement="vertical" >
                                                    {
                                                        getFuctionHavePower(power.GET_DEMAND) && <Step title="客户需求" onClick={() => this.onClick('客户需求', 1)}/>
                                                    }
                                                    {
                                                        planModel === 1 && 
                                                        getFuctionHavePower(power.GET_PLAN) && 
                                                        <Step title="方案研发" onClick={() => this.onClick('方案研发', 2)} />
                                                    }
                                                    {
                                                        getFuctionHavePower(power.GET_COST) && <Step title="资源成本规划" onClick={() => this.onClick('成本规划', planModel === 1 ? 3 : 2)} />
                                                    }
                                                    {
                                                        getFuctionHavePower(power.GET_ESTIMATE) &&  <Step title="应收报价预估" onClick={() => this.onClick('应收报价预估', planModel === 1 ? 4 : 3)} />
                                                    }
                                                </Steps>
                                            </div>
                                        </div>
                                        <div style={{height: 10, background: '#eee'}}></div>
                                            <Fragment>
                                            <div>
                                                {
                                                    backupsProcessStatus === 1 ?
                                                    <CustomerDemand 
                                                        id={id}
                                                        //getThis={v => this.demand = v}
                                                        getThis={v => {
                                                            this.setState({
                                                                demand: v
                                                            })
                                                        }}
                                                        toChilderVal={{...pageData, ...valueForBase, processStatus: processStatus, rejectStatus: rejectStatus}}
                                                        demandValues={this.demandValues}
                                                        processStatusValues={this.processStatusValues}
                                                        getChilderStatusToParent={this.getChildStatus}
                                                        getChilderRejectStatusToParent={this.getRejectStatus}
                                                        origin={origin}
                                                        requestDoneValue={this.requestDoneValue}
                                                        valueForBase={valueForBase}
                                                        isDisabled={isDisabled}
                                                        getQuotationLoading={(value => {
                                                            this.setState({
                                                                saveLoading: value
                                                            })
                                                        })}
                                                    />
                                                    :
                                                    backupsProcessStatus === (planModel === 1 ? 3 : 2) ?
                                                    <CostPlan
                                                        demandId={id}
                                                        getThis={v => {
                                                            this.setState({
                                                                cost: v
                                                            })
                                                        }}
                                                        toChilderVal={{...pageData, ...valueForBase, processStatus: processStatus, rejectStatus: rejectStatus}}
                                                        costValues={this.costValues}
                                                        processStatusValues={this.processStatusValues}
                                                        operationTypeList={operationTypeList}
                                                        getChilderStatusToParent={this.getChildStatus}
                                                        getChilderRejectStatusToParent={this.getRejectStatus}
                                                        origin={origin}
                                                        requestDoneValue={this.requestDoneValue}
                                                        valueForBase={valueForBase}
                                                        isDisabled={isDisabled}
                                                        getQuotationLoading={(value => {
                                                            this.setState({
                                                                saveLoading: value
                                                            })
                                                        })}
                                                    />
                                                    :
                                                    backupsProcessStatus === (planModel === 1 ? 4 : 3) ?
                                                    <QuotationEstimate
                                                        demandId={id}
                                                        //getThis={v => this.estimate = v}
                                                        getThis={v => {
                                                            this.setState({
                                                                estimate: v
                                                            })
                                                        }}
                                                        toChilderVal={{...pageData, ...valueForBase, processStatus: processStatus, rejectStatus: rejectStatus}}
                                                        estimateValues={this.estimateValues}
                                                        processStatusValues={this.processStatusValues}
                                                        operationTypeList={operationTypeList}
                                                        getChilderStatusToParent={this.getChildStatus}
                                                        getChilderRejectStatusToParent={this.getRejectStatus}
                                                        origin={origin}
                                                        requestDoneValue={this.requestDoneValue}
                                                        valueForBase={valueForBase}
                                                        isDisabled={isDisabled}
                                                        getQuotationLoading={(value => {
                                                            this.setState({
                                                                saveLoading: value
                                                            })
                                                        })}
                                                    />
                                                    :
                                                    backupsProcessStatus === 2 ?
                                                    <ProjectDevelopment 
                                                        demandId={id}
                                                    // getThis={v => this.plan = v}
                                                        getThis={v => {
                                                            this.setState({
                                                                plan: v
                                                            })
                                                        }}
                                                        toChilderVal={{...pageData, ...valueForBase, processStatus: processStatus, rejectStatus: rejectStatus}}
                                                        planValues={this.planValues}
                                                        processStatusValues={this.processStatusValues}
                                                        operationTypeList={operationTypeList}
                                                        getChilderStatusToParent={this.getChildStatus}
                                                        getChilderRejectStatusToParent={this.getRejectStatus}
                                                        origin={origin}
                                                        requestDoneValue={this.requestDoneValue}
                                                        valueForBase={valueForBase}
                                                        isDisabled={isDisabled}
                                                        getQuotationLoading={(value => {
                                                            this.setState({
                                                                saveLoading: value
                                                            })
                                                        })}
                                                    />
                                                    :
                                                    <CustomerDemand 
                                                        id={id}
                                                        //getThis={v => this.demand = v}
                                                        getThis={v => {
                                                            this.setState({
                                                                demand: v
                                                            })
                                                        }}
                                                        toChilderVal={{...pageData, ...valueForBase, processStatus: processStatus, rejectStatus: rejectStatus}}
                                                        demandValues={this.demandValues}
                                                        processStatusValues={this.processStatusValues}
                                                        getChilderStatusToParent={this.getChildStatus}
                                                        getChilderRejectStatusToParent={this.getRejectStatus}
                                                        origin={origin}
                                                        requestDoneValue={this.requestDoneValue}
                                                        valueForBase={valueForBase}
                                                        isDisabled={isDisabled}
                                                        getQuotationLoading={(value => {
                                                            this.setState({
                                                                saveLoading: value
                                                            })
                                                        })}
                                                    />
                                                }
                                            </div>
                                        </Fragment>
                                    </div>
                                </div>
                                :
                                <div style={{background: '#eee', height: this.props.minHeight-280}}></div>
                            }
                    </div>
                    </div>
            // </Spin>
        )
    }
}
 
export default DemandDetails;