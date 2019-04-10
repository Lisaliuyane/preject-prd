import React, {Fragment} from 'react'
import { Button, Form, Input, message, Popconfirm, Spin} from 'antd'
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
import { toCustomerTransport, toCustomerStorage } from '@src/views/layout/to_page'
import Storage from '../storage'
import '../index.less'
import './cost.less'
const { TextArea } = Input
const power = Object.assign({}, children, id)


/**
 * 应收报价预估
 * 
 * @class QuotationEstimate
 * @extends {Component}
 */
@inject('mobxTabsData')
@inject('rApi')
@observer
class QuotationEstimate extends Parent {

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
        removeEstimateWarehouseIds: [], //删除费用项Id
        removeCostTransportLineExpenseItemIds: [],
        removeCostTransportLineIds: [],
        loading: false, //加载中
        clientQuotationTransportVos: [], //报价类型
        transportModeBusinessModes: [],
        activeMode: {}, //当前选中的仓库
        quoTationLoading: false //路线报价loading
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
       // this.props.getChilderStatusToParent(-1)
        if(demandId) {
            this.setState({loading: true})
            this.props.rApi.getEstimateData({
                demandId,
            }).then(d => {
                //   console.log('getCostData', d)
                if(d) {
                    let warehousesData = (d.developmentWarehouses && d.developmentWarehouses.length > 0) ? d.developmentWarehouses.map(item => {
                        return {
                            ...item,
                            developmentStorageCosts: item.estimateWarehouses
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
                    this.props.estimateValues(d)
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
            removeEstimateWarehouseIds, //删除费用项Id
        } = this.state
        let { demandId } = this.props
        let logData = this.refs.storage ? this.refs.storage.logData() : null
        let estimateWarehousesData = (logData && logData.data && logData.data.length > 0) ? logData.data.map(item => {
            return {
                ...item,
                estimateWarehouses: item.developmentStorageCosts
            }
        }) : []
        let quotationLines = (this.modeTransport && this.modeTransport.getValues()) ? this.modeTransport.getValues() : []
        this.props.getQuotationLoading(true)
        this.props.rApi.estimateSave({
            id,
            ...quotationLines,
            demandId,
            //operationType, 
            transportCost, 
            warehouseCost,
            developmentWarehouses: estimateWarehousesData,
            removeEstimateWarehouseIds: logData && logData.removeId ? logData.removeId : []
        }).then(d => {
            this.setState({
                id: d.id
            })
            try {
                message.success('操作成功!')
            } catch(e) {
                console.error(e)
            }
            this.props.getQuotationLoading(false)
            this.getList()
        }).catch(e => {
            message.error(e.msg || '操作失败!')
            this.props.getQuotationLoading(false)
        })
    }

    submit = () => { //提交
        let { id, origin } = this.state
        this.props.rApi.estimateSubmit({
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
        this.props.rApi.estimateExaminePass({
            id
        }).then(d => {
            this.setState({
                status: 3
            })
            getChilderStatusToParent(3)
            if(toChilderVal.rejectStatus !== 0) {
                getChilderRejectStatusToParent(0)
                processStatusValues(4)
            } else {
                processStatusValues(4)
            }
            message.success('操作成功!')
        }).catch(e => {
            message.error(e.msg || '操作失败！')
        })
    }

    examineCancelPassSubmit = () => { //取消通过
        let { id } = this.state
        this.props.rApi.estimateExamineCancelPass({
            id
        }).then(d => {
            this.setState({
                status: 2
            })
            this.props.getChilderStatusToParent(2)
            this.props.processStatusValues(3)
            message.success('操作成功!')
        }).catch(e => {
            message.error(e.msg || '操作失败！')
        })
    }

    examineRegectSubmit = () => { //审核驳回
        let { id, rejectReason } = this.state
        this.props.rApi.estimateExamineReject({
            id,
            rejectReason
        }).then(d => {
            this.setState({
                status: 0
            })
            this.props.getChilderStatusToParent(0)
            this.props.getChilderRejectStatusToParent(4)
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

    generateTransportQuotes = () => { //创建运输报价
        let { mobxTabsData, toChilderVal, rApi, demandId } = this.props
        rApi.createClientQuotation({
            id: demandId
        }).then(res => {
           // console.log('generateTransportQuotes', res)
            toCustomerTransport(mobxTabsData, {
                pageData: {
                    ...res,
                    key: '应收报价预估'
                }
            })
        }).catch(e => {
            message.error(e.msg || '操作失败!')
        })
    }

    generateStorageQuotes = () => { //创建仓储报价
        let { mobxTabsData, toChilderVal } = this.props
        let { activeMode } = this.state
        //console.log('storageData', activeMode)
        let clientQuotationWarehouses = []
        if(activeMode && activeMode.estimateWarehouses && activeMode.estimateWarehouses.length > 0) {
            clientQuotationWarehouses = activeMode.estimateWarehouses.map(item => {
                return {
                    expenseId: item.expenseItemId,
                    expenseName: item.expenseItemName,
                    unitPrice: item.unitPrice,
                    costUnitId: item.costUnitId,
                    costUnitName: item.costUnitName,
                    multiple: item.multiple,
                    lowestFee: item.lowestFee,
                    partId: '',
                    partName: '',
                    isMonthlyCharges: item.isMonthlyCharges,
                    remark: item.remark,
                    isEdit: false
                }
            })
        }
        toCustomerStorage(mobxTabsData, {
            pageData: {
                clientQuotationWarehouses: clientQuotationWarehouses,
                ...toChilderVal,
                warehouseId: (activeMode && activeMode.warehouseId) ? activeMode.warehouseId : null,
                warehouseName: (activeMode && activeMode.warehouseName) ? activeMode.warehouseName : null,
                key: '应收报价预估'
            }
        })
    }

    syncTransportQuotes =() => { //同步运输报价
        let { rApi, demandId } = this.props
        rApi.syncEstimateTrsQuotation({
            id: demandId
        }).then(res => {
            this.getList()
        }).catch(e => {
            message.error(e.msg || '操作失败!')
        })
    }

    syncStorageQuotes = () => { //同步仓储报价
        let { rApi, demandId } = this.props
        rApi.syncEstimateWarehouseQuotation({
            id: demandId
        }).then(res => {
            this.getList()
        }).catch(e => {
            message.error(e.msg || '操作失败!')
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
        //console.log('应收预估', status)
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
                                            <div className="storage-table-wrapper main-padding" style={{paddingBottom: '20px', position: 'relative'}}>
                                                <div className="flex flex-vertical-center quotes-wrapper" >
                                                    <div style={{color: '#484848', fontSize: '14px'}}>运输报价</div>
                                                    <div className="flex1"></div>
                                                    {
                                                        (status === 2 || status === 3) ?
                                                        null
                                                        :
                                                        <Popconfirm
                                                            placement="topLeft" 
                                                            title="确认同步成本规划运输报价吗?" 
                                                            onConfirm={this.syncTransportQuotes} 
                                                            okText="确认" 
                                                            cancelText="取消"
                                                        >
                                                            <Button  style={{marginRight: 10}}>
                                                                同步运输报价
                                                            </Button>
                                                        </Popconfirm>
                                                    }
                                                    {
                                                        status === 3 ?
                                                        <div className="quotes-btn">
                                                            <Popconfirm
                                                                placement="topLeft" 
                                                                title="确认创建吗?" 
                                                                onConfirm={this.generateTransportQuotes} 
                                                                okText="确认" 
                                                                cancelText="取消"
                                                            >
                                                                <Button>
                                                                    创建为运输报价
                                                                </Button>
                                                            </Popconfirm>
                                                        </div>
                                                        :
                                                        null
                                                    }
                                                </div>
                                                <ModeOfTransport
                                                    getThis={v => this.modeTransport = v}
                                                    noBordered
                                                    noEdit={(status === 2 || status=== 3 || this.props.isDisabled) ? true : false}
                                                    //type={type}
                                                    getDataMethod={'getEstimateQuotation'}
                                                    getDataUrl={'project/estimate/exportData'}
                                                    getQuotationDataUrl={'project/estimate/exportQuotation'}
                                                    isShowQuotationExportData
                                                    clientQuotationTransportVos={clientQuotationTransportVos}
                                                    //quotationNumber={quotationNumber}
                                                    reviewStatus={status === 0 ? 3 : status === 1 ? 1 : status === 2 ? 2 : status === 3 ? 4 : 1 }
                                                    isDisabled = {this.props.isDisabled}
                                                    transportModeBusinessModes={transportModeBusinessModes}
                                                    quotationMethod='transportOrEstimate'
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
                                            <div className="flex flex-vertical-center quotes-wrapper" >
                                                <div style={{color: '#484848', fontSize: '14px'}}>仓储成本研发</div>
                                                <div className="flex1"></div>
                                                {
                                                    (status === 2 || status === 3) ?
                                                    null
                                                    :
                                                    <Popconfirm
                                                        placement="topLeft" 
                                                        title="确认同步成本规划仓储报价吗,同步将会覆盖原数据?" 
                                                        onConfirm={this.syncStorageQuotes} 
                                                        okText="确认" 
                                                        cancelText="取消"
                                                    >
                                                        <Button  style={{marginRight: 10}}>
                                                            同步仓储报价
                                                        </Button>
                                                    </Popconfirm>
                                                }
                                                {
                                                    status === 3 ?
                                                    <div className="quotes-btn">
                                                        <Button 
                                                            onClick={this.generateStorageQuotes}
                                                        >
                                                            创建为仓储报价
                                                        </Button>
                                                    </div>
                                                    :
                                                    null
                                                }
                                            </div>
                                            <Storage
                                                data={storageData} 
                                                ref='storage'
                                                getActiveMode={(value) => {
                                                    this.setState({
                                                        activeMode: value
                                                    })
                                                }}
                                                reviewStatus={status}
                                                isDisabled = {this.props.isDisabled}
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
 
export default QuotationEstimate;