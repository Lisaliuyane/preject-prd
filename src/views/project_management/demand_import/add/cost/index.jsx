import React, {Fragment} from 'react'
import { Button, Form, Input, InputNumber, Checkbox, message, Upload, Icon, Popconfirm, Spin} from 'antd'
import { HeaderView, Table, Parent } from '@src/components/table_template'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { children, id } from '../power_hide'
import { deleteNull } from '@src/utils'
import { Row, Col } from '@src/components/grid'
import { CustomCheckbox } from '@src/components/custom_check'
import Transport from '@src/components/dynamic_table1/transport'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { getHeaderData } from '@src/components/dynamic_table1/utils.js'
import ModeOfTransport from '@src/components/dynamic_table1/mode_of_transport'
import Storage from '../storage'
import '../index.less'
import './cost.less'
const { TextArea } = Input
const power = Object.assign({}, children, id)

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

const optionDataTwo = [ //成本类型研发
    {   id: 1,
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
        label: '快递', 
        value: 3
    }
]

/**
 * 成本规划
 * 
 * @class CostPlan
 * @extends {Component}
 */
@inject('mobxTabsData')
@inject('rApi')
@observer
class CostPlan extends Parent {

    state = {
        requstDone: false,
        costValue: {}, //请求值
        storageData: [], //费用项数据返回
        //demandId:2, //需求id
        id: null,
        operationType: [], // 运作类型研发
        transportCost: null, //运输成本备注
        warehouseCost: null, //仓储成本备注
        rejectReason: null, //驳回理由
        operatorId: 0, // 操作人id
        operatorName: 0, // 操作人名字
        status: null, // 状态 0-驳回 1-保存 2-提交 3-审核通过
        caeateTime: null, //创建时间
        costWarehouses: [], //费用项数据
        costTransports: [], //运输成本数据
        // costTransportLtl: {}, // 零担
        // costTransportVehicle: {}, // 整车
        // costTransportExpress: {}, // 快递
        removeCostWarehouseIds: [], //删除费用项Id
        removeCostTransportLineExpenseItemIds: [],
        removeCostTransportLineIds: [],
        loading: false, //加载中
        clientQuotationTransportVos: [], //报价类型
        transportModeBusinessModes: [],
        quoTationLoading: false, //路线报价loading
        activeMode: {}
    }

    constructor(props) {
        super(props)
        if(props.getThis) {
            props.getThis(this)
        }
    }

    componentDidMount() {
       this.getList() 
    }

    getList = () => {
        let { operationType } = this.state
        let { demandId } = this.props
        if(demandId) {
            this.setState({loading: true})
            this.props.rApi.getCostData({
                demandId,
            }).then(d => {
                //   console.log('getCostData', d)
                if(d) {
                    let warehousesData = (d.developmentWarehouses && d.developmentWarehouses.length > 0) ? d.developmentWarehouses.map(item => {
                        return {
                            ...item,
                            developmentStorageCosts: item.costWarehouses
                        }
                    }) : []
                    this.setState({
                        costValue: d,
                        id: d ? d.id : null,
                        status: d ? d.status : null,
                        storageData: warehousesData,
                        clientQuotationTransportVos: d ? d.clientQuotationTransportVos : [],
                        transportModeBusinessModes: d ? d.transportModeBusinessModes: [],
                        // this.state.costTransportLtl = d ? d.costTransportLtl : {}
                        // this.state.costTransportVehicle = d ? d.costTransportVehicle : {}
                        //quotationLines: d ? d.quotationLines : [],
                        //operationType: d && d.operationType ? JSON.parse(d.operationType) : [],
                        transportCost: d ? d.transportCost : null,
                        warehouseCost: d ? d.warehouseCost : null
                    }
                    , () => {
                        this.isInArray(operationType, 1)
                        this.isInArray(operationType, 2)
                    }
                )
                    this.props.costValues(d)
                }
                this.showView()
                this.props.getChilderStatusToParent(d && d.status)
                this.props.requestDoneValue(true)
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

    saveSubmit = () => {
        let {
            costValue, //请求值
            id,
            operationType, // 运作类型研发
            transportCost, //运输成本备注
            warehouseCost, //仓储成本备注
            costWarehouses, //费用项数据
            // costTransports, //运输成本数据
            removeCostTransportLineExpenseItemIds,
            removeCostTransportLineIds,
            removeCostWarehouseIds, //删除费用项Id
        } = this.state
        let { demandId } = this.props
        let logData = this.refs.storage ? this.refs.storage.logData() : null
        let warehousesData = (logData && logData.data && logData.data.length > 0) ? logData.data.map(item => {
            return {
                ...item,
                costWarehouses: item.developmentStorageCosts
            }
        }) : []
        let quotationLines = (this.modeTransport && this.modeTransport.getValues()) ? this.modeTransport.getValues() : []
        this.props.getQuotationLoading(true)
        this.props.rApi.costSave({
            id,
            ...quotationLines,
            demandId,
            //operationType, 
            transportCost, 
            warehouseCost,
            developmentWarehouses: warehousesData,
            removeCostWarehouseIds: logData && logData.removeId ? logData.removeId : []
        }).then(d => {
            this.setState({
                id: d.id
            })
            message.success('操作成功!')
            this.props.getQuotationLoading(false)
            this.getList() 
        }).catch(e => {
            message.error(e.msg || '操作失败!')
            this.props.getQuotationLoading(false)
        })
    }

    submit = () => { //提交
        let { id, origin } = this.state
        this.props.rApi.costSubmit({
            id
        }).then(d => {
            this.setState({
                status: 2
            })
            this.props.getChilderStatusToParent(2)
            message.success('操作成功!')
            if(origin) {
                origin.reloadList()
            }
        }).catch(e => {
            message.error(e.msg || '操作失败！')
        })
    }
    
    examinePassSubmit = () => { //审核通过
        let { id } = this.state
        let {toChilderVal, getChilderRejectStatusToParent, processStatusValues, getChilderStatusToParent } = this.props
        this.props.rApi.costExaminePass({
            id
        }).then(d => {
            this.setState({
                status: 3
            })
            this.props.getChilderStatusToParent(3)
            if(toChilderVal.rejectStatus !== 0) {
                this.props.getChilderRejectStatusToParent(0)
                this.props.processStatusValues(3)
            } else {
                this.props.processStatusValues(3)
            }
            message.success('操作成功!')
        }).catch(e => {
            message.error(e.msg || '操作失败！')
        })
    }

    examineCancelPassSubmit = () => { //取消通过
        let { id } = this.state
        this.props.rApi.costExamineCancelPass({
            id
        }).then(d => {
            this.setState({
                status: 2
            })
            this.props.getChilderStatusToParent(2)
            this.props.processStatusValues(2)
            message.success('操作成功!')
        }).catch(e => {
            message.error(e.msg || '操作失败！')
        })
    }

    examineRegectSubmit = () => { //审核驳回
        let { id, rejectReason } = this.state
        this.props.rApi.costExamineReject({
            id,
            rejectReason
        }).then(d => {
            this.setState({
                status: 0
            })
            this.props.getChilderStatusToParent(0)
            this.props.getChilderRejectStatusToParent(3)
            message.success('操作成功!')
        }).catch(e => {
            message.error(e.msg || '操作失败！')
        })
    }

    onChangeCheckValue = (checKVul) => {
        this.setState({
            operationType:  checKVul
        })
        return true
    }

    isInArray = (arr, value) => { //判断元素是否在数组中
        for(let val of arr){
            if(value === val){
                return true;
            }
        }
        return false;
    }
    rejectReasonVul = (value) => {
        //console.log('rejectReasonVul', value)
        this.setState({
            rejectReason: value
        })
    }

    render() {
        let {
            storageData,
            costValue, //请求值
            requstDone,
            operationType,
            transportCost,
            warehouseCost,
            quotationLines,
            loading,
            status,
            clientQuotationTransportVos, //报价类型
            transportModeBusinessModes
        } = this.state
       // console.log('成本规划', this.props.toChilderVal.rejectStatus, this.props.toChilderVal.processStatus)
        return (
            <Spin spinning={loading} tip="Loading...">
                <div className="wrapper-padding-style">
                    {/* <AddOrEdit 
                        parent={this}
                        getThis={(v) => this.addoredit = v}
                    /> */}
                    <Form layout='inline'>
                        {
                            requstDone === true && !loading ?
                            <div className='cost-detailes'>
                                <div>
                                    {
                                        this.isInArray(this.props.operationTypeList, 1) ?
                                        <Fragment>
                                            <div className="storage-table-wrapper main-padding" style={{ paddingBottom: '20px'}}>
                                                <ModeOfTransport
                                                    getThis={v => this.modeTransport = v}
                                                    noBordered
                                                    noEdit={(status === 2 || status=== 3 || this.props.isDisabled) ? true : false}
                                                    //type={type}
                                                    getDataMethod={'getCostQuotation'}
                                                    getDataUrl={'project/cost/exportData'}
                                                    clientQuotationTransportVos={clientQuotationTransportVos}
                                                    //quotationNumber={quotationNumber}
                                                    reviewStatus={status === 0 ? 3 : status === 1 ? 1 : status === 2 ? 2 : status === 3 ? 4 : 1 }
                                                    isDisabled = {this.props.isDisabled}
                                                    transportModeBusinessModes={transportModeBusinessModes}
                                                    quotationMethod='cooperationOrCost'
                                                    fontWeightVul={400}
                                                    tableHeader={
                                                        getHeaderData({
                                                            departure: 1,
                                                            transitPlaceOneName: 1,
                                                            destination: 1,
                                                            aging: 1,
                                                            isHighway: 1,
                                                            lowestFee: 1,
                                                            isPick: 1,
                                                            remark: 1
                                                        })
                                                    }
                                                />
                                                <div className="flex">
                                                    <div style={{color:'#808080', width: 120}}>
                                                        运输成本备注
                                                    </div>
                                                    <div style={{width: 400}}>
                                                        <TextArea 
                                                            value={transportCost ? transportCost : ''}
                                                            placeholder="" 
                                                            autosize={{ minRows: 5, maxRows: 8 }}
                                                            onChange={e => {
                                                                this.setState({
                                                                    transportCost: e.target.value
                                                                })
                                                                }
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                this.isInArray(this.props.operationTypeList, 2) ?
                                                <div style={{height: 10, background: '#eee'}}></div>
                                                :
                                                null
                                            }
                                        </Fragment>
                                        :
                                        null
                                    }
                                    {
                                        this.isInArray(this.props.operationTypeList, 2) ?
                                        <div className="storage-table-wrapper main-padding" style={{paddingBottom: '20px'}}>
                                            <Storage
                                                data={storageData} 
                                                ref='storage'
                                                reviewStatus={status}
                                                isDisabled = {this.props.isDisabled}
                                                getActiveMode={(value) => {
                                                    this.setState({
                                                        activeMode: value
                                                    })
                                                }}
                                            />
                                            <br />
                                            <div className="flex">
                                                <div style={{color:'#808080', width: 120}}>
                                                    仓储成本备注
                                                </div>
                                                <div style={{width: 400}}>
                                                    <TextArea 
                                                        value={warehouseCost ? warehouseCost : ''}
                                                        placeholder="" 
                                                        autosize={{ minRows: 5, maxRows: 8 }}
                                                        onChange={e => {
                                                            this.setState({
                                                                warehouseCost: e.target.value
                                                            })
                                                            }
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        null 
                                    }
                                </div>
                            </div>
                            :
                            null

                        }
                    </Form>
                </div>
            </Spin>
        )
    }
}
 
export default CostPlan;