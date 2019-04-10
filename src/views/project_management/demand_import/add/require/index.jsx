import React from 'react'
import { Button, Form, message, Icon, Popconfirm, Input, Spin} from 'antd'
import { HeaderView, Table, Parent } from '@src/components/table_template'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import DemandInfo from './demand_info.jsx'
import GoodsInfo from './goods_info.jsx'
import DeliveryGoods from './delivery_goods.jsx'
import DeliveryDistribution from './delivery_distribution.jsx'
import WarehousOperation from './warehous_operation.jsx'
import { children, id } from '../power_hide'
import { deleteNull } from '@src/utils'
import { Row, Col } from '@src/components/grid'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import '../index.less'

const power = Object.assign({}, children, id)
const { TextArea } = Input

/**
 * 客户需求
 * 
 * @class CustomerDemand
 * @extends {Component}
 */
@inject('mobxTabsData')
@inject('rApi')
@observer
class CustomerDemand extends Parent {

    state = {
        requstDone: false,
        vulToChilder: {}, //请求值分发给子组件
        rejectReason: null, //驳回理由
        operatorId: 0, // 操作人id
        operatorName: 0, // 操作人名字
        status: null, // 状态 0-驳回 1-保存 2-提交 3-审核通过
        processStatus: null, //流程状态 1-客户需求 2-方案研发 3-成本规划
        caeateTime: null, //创建时间
        loading: false //加载中
    }

    constructor(props) {
        super(props)
        if(props.getThis) {
            props.getThis(this)
        }
        
    }

    componentDidMount(){
        this.getList()
    }

    getList = () => {
        let { id, rApi, demandValues, getChilderStatusToParent } = this.props
        if(id) {
            this.setState({loading: true})
            rApi.getDemandsInfo({
                id,
            }).then(d => {
                if(d) {
                    this.setState({
                        vulToChilder: d,
                        status: d ? d.status : null
                    })
                    demandValues(d)
                    getChilderStatusToParent(d.status)
                }
                this.props.requestDoneValue(true)
                this.showView()

            }).catch(e => {
                this.props.requestDoneValue(true)
                this.loadingFalse()
                message.error(e.msg || '请求失败,请刷新！')
            })
        } else {
            this.showView()
            return false
        }
    }

    showView = () => {
        this.setState({
            requstDone: true,
            loading: false
        })
    }

    loadingFalse = () => {
        this.setState({
            loading: false
        })
    }

    saveSubmit =() => { //保存
        let { id } = this.props
        //console.log('saveSubmit-id', id)
        this.props.getQuotationLoading(true)
        this.props.rApi.saveDemand({
            ...this.getChlidValue.getValue(),
            ...this.getChlidValue1.getValue(),
            ...this.getChlidValue2.getValue(),
            ...this.getChlidValue3.getValue(),
            ...this.getChlidValue4.getValue(),
            id: id
        }).then(d => {
            message.success('操作成功!')
            this.props.getQuotationLoading(false)
            this.getList()
        }).catch(e => {
            message.error(e.msg || '操作失败！')
            this.props.getQuotationLoading(false)
        })
    }

    submit = () => { //提交
        let { id, origin } = this.props
        this.props.rApi.demandSubmit({
            id
        }).then(d => {
            this.setState({
                status: 2
            })
            message.success('操作成功！')
            this.props.getChilderStatusToParent(2)
            if(origin) {
                origin.reloadList()
            }
        }).catch(e => {
            message.error(e.msg || '操作失败！')
        })
    }
    
    examinePassSubmit = () => { //审核通过
        let { id, toChilderVal, getChilderRejectStatusToParent, processStatusValues, getChilderStatusToParent} = this.props
        this.props.rApi.demandExaminePass({
            id
        }).then(d => {
            this.setState({
                status: 3
            })
            getChilderStatusToParent(3)
            if(toChilderVal.rejectStatus !== 0) {
               getChilderRejectStatusToParent(0)
               processStatusValues(1)
            } else {
                processStatusValues(1)
            }
            message.success('操作成功!')
        }).catch(e => {
            message.error(e.msg || '操作失败！')
        })
    }

    examineCancelPassSubmit = () => { //取消通过
        let { id } = this.props
        this.props.rApi.demandExamineCancelPass({
            id
        }).then(d => {
            this.setState({
                status: 2
            })
            this.props.getChilderStatusToParent(2)
            this.props.processStatusValues(1)
            message.success('操作成功！')
        }).catch(e => {
            message.error(e.msg || '操作失败！')
        })
    }

    examineRegectSubmit = () => { //审核驳回
        let { id } = this.props
        let { rejectReason } = this.state
        this.props.rApi.demandExamineReject({
            id,
            rejectReason
        }).then(d => {
            this.setState({
                status: 0
            })
            this.props.getChilderStatusToParent(0)
            this.props.getChilderRejectStatusToParent(1)
            message.success('操作成功！')
        }).catch(e => {
            message.error(e.msg || '操作失败！')
        })
    }

    rejectReasonVul = (value) => {
        //console.log('rejectReasonVul', value)
        this.setState({
            rejectReason: value
        })
    }
    render() {
        let {
            requstDone,
            vulToChilder,
            loading,
            status,
        } = this.state
        let { toChilderVal } = this.props
       // console.log('客户需求', toChilderVal)
        return (
            <div className='customer-demand-wrapper wrapper-padding-style'>
                {/* <AddOrEdit 
                    parent={this}
                    getThis={(v) => this.addoredit = v}
                /> */}
                <Spin spinning={loading} tip="Loading...">
                    <Form layout='inline'>
                        {
                            requstDone === true && !loading ? 
                            <div className='demand-detailes main-padding'>
                                <DemandInfo 
                                    vulToChilder={vulToChilder}
                                    getThis={v => {this.getChlidValue = v}} 
                                    valueForBase={this.props.valueForBase}
                                />
                                <GoodsInfo 
                                    vulToChilder={vulToChilder}
                                    getThis={v => {this.getChlidValue1 = v}} 
                                    status={status}
                                />
                                <DeliveryGoods 
                                    vulToChilder={vulToChilder}
                                    getThis={v => {this.getChlidValue2 = v}} 
                                />
                                <DeliveryDistribution 
                                    vulToChilder={vulToChilder}
                                    getThis={v => {this.getChlidValue3 = v}} 
                                    status={status}
                                />
                                <WarehousOperation 
                                    vulToChilder={vulToChilder}
                                    getThis={v => {this.getChlidValue4 = v}} 
                                    status={status}
                                />
                            </div>
                            :
                            null
                        }
                    </Form>
                </Spin>
            </div>
        )
    }
}
 
export default CustomerDemand;