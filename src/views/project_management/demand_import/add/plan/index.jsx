import React, {Component, Fragment} from 'react'
import { Button, Form, Input, InputNumber, Checkbox, message, Upload, Icon, Popconfirm, Table, Spin } from 'antd'
//import { HeaderView, Table, Parent } from '@src/components/table_template'
import { inject, observer } from "mobx-react"
import UploaderFile from '@src/components/uploader_file'
import { children, id } from '../power_hide'
import { Row, Col } from '@src/components/grid'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { getHeaderData } from '@src/components/dynamic_table1/utils.js'
import Storage from '../storage'
import ModeOfTransport from '@src/components/dynamic_table1/mode_of_transport'
import SelectMulti from '@src/components/select_multi'
import '../index.less'
import './style.less'

const power = Object.assign({}, children, id)
const { TextArea } = Input

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
 * 方案研发
 * 
 * @class CustomerDemand
 * @extends {ProjectDevelopment}
 */
@inject('mobxTabsData')
@inject('rApi')
@observer
class ProjectDevelopment extends Component {

    state = {
        requstDone: false,
        planValue: {}, //请求值
        storageData: [],
       // demandId:2, //需求id
        developmentAnalysis: null, //方案研发分析
        id: null,
        operationType: [], // 运作类型研发
        rejectReason: null, //驳回理由
        operatorId: 0, // 操作人id
        operatorName: 0, // 操作人名字
        status: null, // 状态 0-驳回 1-保存 2-提交 3-审核通过
        caeateTime: null, //创建时间
        developmentStorageCosts: [], //费用项数据
        removeStorageCostIds: [], //
        removeQuotationLineId: [],
        size: 'small',
        dataSource: [], //列表数据
        loading: false, //加载中
        uploadFileVo : [],
        checkFileUrl: [],
        removeAttachmentIds: [], //删除上传文件id
        pagination: {
            pageSize: 10,
            current: 1,
            showSizeChanger: true
        }, //表格分页器
        totalLen: null,
        uploadLoading: false,
        clientQuotationTransportVos: [], //报价类型
        transportModeBusinessModes: [],
        title: '方案研发',
        developmentTransitPlaces: [], //中转地
        quoTationLoading: false //路线报价loading
    }

    constructor(props) {
        super(props)
        if(props.getThis) {
            props.getThis(this)
        }
        this.state.columns = [
            {
                width: 300,
                className: 'text-overflow-ellipsis',
                title: '文档名称',
                dataIndex: 'fileName',
                key: 'fileName',
            },
            {
                className: 'text-overflow-ellipsis',
                title: '操作',
                dataIndex: 'filePath',
                key: 'filePath',
                render: (text, record, index) => (
                    // console.log('record', record)
                    <span>
                        {
                            record.downloadFileName ?
                            <span>
                                <a href={record.filePath} download={record.downloadFileName}>下载</a>&emsp;
                                <a href={record.filePath} target="_blank">预览</a>&emsp;
                            </span>
                            :
                            ''
                        }
                        {/* <Spin 
                            spinning={record.upLoading ? record.upLoading : false} 
                        /> */}
                        <Popconfirm
                            title="确定要删除此项?"
                            onConfirm={() => this.onDeleteFile(index, record.id)}
                            okText="确定"
                            cancelText="取消">
                            <span className={`action-button`}>
                                删除
                            </span>
                        </Popconfirm>
                    </span>
                )
            }
        ]
    }

    componentDidMount() {
        let { demandId } = this.props
        let { pagination } = this.state
        this.getList({
            demandId,
            results: pagination.pageSize,
            page: pagination.current
        })
    }

    getList = (param) => {
        let { operationType, pagination } = this.state
        let {rApi, planValues, getChilderStatusToParent } = this.props
        if(param.demandId) {
            this.setState({loading: true})
            rApi.getPlanData(param).then(d => {
                const pagination = { ...this.state.pagination }
                getChilderStatusToParent(d && d.status)
                if(d) {
                    pagination.total = d.developmentAttachmentList.length
                    pagination.showTotal = total => `共 ${total} 条`
                    this.setState({
                        planValue: d,
                        id: d.id,
                        status: d.status,
                        storageData: d ? d.developmentWarehouses : [],
                        //operationType: d && d.operationType ? JSON.parse(d.operationType) : [],
                        developmentAnalysis: d ? d.developmentAnalysis : null,
                        clientQuotationTransportVos: d ? d.clientQuotationTransportVos : [],
                        transportModeBusinessModes: d ? d.transportModeBusinessModes: [],
                        uploadFileVo: d.developmentAttachmentList,
                        totalLen: d.developmentAttachmentList.length,
                        pagination,
                        developmentTransitPlaces: d ? d.developmentTransitPlaces : []
                    }, () => {
                        this.isInArray(operationType, 1)
                        this.isInArray(operationType, 2)
                    })
                    planValues(d)
                    this.showView()
                } else {
                    this.showView()
                }
                this.props.requestDoneValue(true)
            }).catch(e => {
                this.loadingFalse()
                this.props.requestDoneValue(true)
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
            developmentAnalysis, //方案研发分析
            id,
            operationType, // 运作类型研发
            developmentStorageCosts, //费用项数据
            //quotationLines, //运输路线
            removeStorageCostIds, //
            removeQuotationLineId,
            uploadFileVo,
            removeAttachmentIds,
            pagination,
            developmentTransitPlaces
        } = this.state
        let { demandId } = this.props
        let logData = this.refs.storage ? this.refs.storage.logData() : null
        // console.log('saveSubmit', logData)
        // return false
        let quotationLines = (this.modeTransport && this.modeTransport.getValues()) ? this.modeTransport.getValues() : []
        this.props.getQuotationLoading(true)
        this.props.rApi.planSave({
            id,
            ...quotationLines,
            developmentAnalysis,
            demandId,
            uploadFileVo, 
            removeAttachmentIds,
            developmentWarehouses: logData && logData.data ? logData.data : [],
            removeStorageCostIds: logData && logData.removeId ? logData.removeId : [],
            developmentTransitPlaces
        }).then(d => {
            this.setState({
                id: d.id
            })
            message.success('操作成功!')
            this.props.getQuotationLoading(false)
            this.getList({
                demandId,
                results: pagination.pageSize,
                page: pagination.current
            })
        }).catch(e => {
            message.error(e.msg || '操作失败!')
            this.props.getQuotationLoading(false)
        })
    }

    submit = () => { //提交
        let { id, origin } = this.state
        this.props.rApi.planSubmit({
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
        this.props.rApi.planExaminePass({
            id
        }).then(d => {
            this.setState({
                status: 3
            })
            getChilderStatusToParent(3)
            if(toChilderVal.rejectStatus !== 0) {
                getChilderRejectStatusToParent(0)
                processStatusValues(2)
            } else {
                processStatusValues(2)
            }
            message.success('操作成功!')
        }).catch(e => {
            message.error(e.msg || '操作失败！')
        })
    }

    examineCancelPassSubmit = () => { //取消通过
        let { id } = this.state
        this.props.rApi.planExamineCancelPass({
            id
        }).then(d => {
            this.setState({
                status: 2
            })
            this.props.getChilderStatusToParent(2)
            this.props.processStatusValues(1)
            message.success('操作成功!')
        }).catch(e => {
            message.error(e.msg || '操作失败！')
        })
    }

    examineRegectSubmit = () => { //审核驳回
        let { id, rejectReason } = this.state
        this.props.rApi.planExamineReject({
            id,
            rejectReason
        }).then(d => {
            this.setState({
                status: 0
            })
            this.props.getChilderStatusToParent(0)
            this.props.getChilderRejectStatusToParent(2)
            message.success('操作成功!')
        }).catch(e => {
            message.error(e.msg || '操作失败！')
        })
    }
    // showAdd = () => {
    //     this.addoredit.show({
    //         edit: false
    //     })
    // }

    onChangeCheckValue = (checKVul) => {
        this.setState({
            operationType: checKVul
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

    getPlanFileNameKey = (value) => {
        //console.log('getPlanFileNameKey', value)
        let { uploadFileVo } = this.state
        const pagination = { ...this.state.pagination }
        pagination.total =  pagination.total + 1
        uploadFileVo.unshift(value)
        this.setState({
            uploadFileVo: uploadFileVo,
            pagination,
            totalLen: uploadFileVo.length
        })
    }

    getLoadingVal = (value, key) => {
    //     console.log('getLoadingVal', value)
    //     this.setState({
    //         uploadLoading: value
    //     })
    }

    onDeleteFile = (index, id) => {
        let { removeAttachmentIds } = this.state
        let target = this.state.uploadFileVo[index]
        const pagination = { ...this.state.pagination }
        if(id && id !== '') {
            removeAttachmentIds.push(id)
        }
        this.state.uploadFileVo.splice(index, 1)
        pagination.total =  pagination.total - 1
        this.setState({
            uploadFileVo: this.state.uploadFileVo,
            removeAttachmentIds: removeAttachmentIds,
            pagination
        })
    }

    onPreview = () => {
        //window.open()
    }

    handleTableChange = (pagination, filters, sorter) => {
        //console.log('handleTableChange', pagination, filters, sorter)
        let { demandId } = this.props
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        })
    }

    onShowSizeChange = (current, size) => {
        const pager = { ...this.state.pagination }
        pager.current = current
        pager.pageSize = size
        // this.state.pagination = pager
        this.setState({pagination: pager})
    }

    changeSelectMultiData = (value) => { //转换中转地格式
        try {
            return value.map(item => {
                return {
                    id: item.nodeId,
                    title: item.nodeName
                }
            })
        } catch (e) {
            return null
        }
        return null
    }

    handleChangeNode = (value) => { //中转地
        this.setState({developmentTransitPlaces : value.map((item) => {
            let obj = {nodeId: item.id, nodeName: item.title}
            return obj
        })})
    }

    render() {
        let {
            requstDone,
            planValue,
            storageData,
            developmentAnalysis, //方案研发分析
            operationType, // 运作类型研发
            size,
            dataSource, //列表数据
            columns,
            loading,
            status,
            uploadFileVo,
            pagination, //分页器
            totalLen,
            clientQuotationTransportVos, //报价类型
            transportModeBusinessModes,
            developmentTransitPlaces //中转地
        } = this.state
        //console.log('方案研发',this.props.toChilderVal.rejectStatus, this.props.toChilderVal.processStatus)
        let dataS = [
            {
                "warehouseId":1,
                "warehouseName":"A仓",
                "developmentStorageCosts":[
                    {
                        "expenseItemId":91,
                        "expenseItemName":"仓储费用",
                        "unitPrice":5000,
                        "costUnitId":128,
                        "costUnitName":"月",
                        "multiple":2,
                        "lowestFee":5000,
                        "isMonthlyCharges":"",
                        "remark":"仓储备注",
                        "developmentId":"",
                        "isEdit":false,
                        "uid":"uid1"
                    },{
                        "expenseItemId":92,
                        "expenseItemName":"运输费用",
                        "unitPrice":1000,
                        "costUnitId":126,
                        "costUnitName":"整车",
                        "multiple":2,
                        "lowestFee":1000,
                        "isMonthlyCharges":"",
                        "remark":"这是备注",
                        "developmentId":"",
                        "isEdit":false,
                        "uid":"uid0"
                    }
                ]
            },
            {
                "warehouseId":2,
                "warehouseName":"B仓",
                "developmentStorageCosts":[
                    {
                        "expenseItemId":242,
                        "expenseItemName":"车队费用",
                        "unitPrice":2500,
                        "costUnitId":122,
                        "costUnitName":"kg",
                        "multiple":5,
                        "lowestFee":1500,
                        "isMonthlyCharges":"",
                        "remark":"车队费用备注",
                        "developmentId":"",
                        "isEdit":false,
                        "uid":"uid2"
                    }
                ]
            }
        ]
        return (
            <div className="wrapper-padding-style">
                {/* <AddOrEdit 
                    parent={this}
                    getThis={(v) => this.addoredit = v}
                /> */}
                <Spin spinning={loading} tip="Loading...">
                    <Form layout='inline'>
                        {
                            requstDone === true && !loading ? 
                            <div className='plan-detailes'>
                                <div>
                                    <div className="flex main-padding">
                                        <div style={{color:'#808080', width: 120}}>方案研发分析</div>
                                        <div style={{width: 400}}>
                                            <TextArea 
                                                defaultValue={developmentAnalysis ? developmentAnalysis : ''}
                                                placeholder="" 
                                                autosize={{ minRows: 5, maxRows: 8 }}
                                                onChange={e => {
                                                        this.setState({
                                                            developmentAnalysis: e.target.value
                                                        })
                                                    }
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-vertical-center main-padding" style={{paddingTop: '20px', paddingBottom: '20px'}}>
                                        <div  style={{color: '#808080', width: 120}}>方案研发文档</div>
                                        <div>
                                            <UploaderFile 
                                                getFileNameKey={this.getPlanFileNameKey}
                                                getLoadingVal={this.getLoadingVal}
                                                multiSelection={true}
                                                //getFileName={this.getPlanFileName}
                                            >
                                                <Button  
                                                    icon="upload" 
                                                    size="small" 
                                                    style={{fontSize: '12px', borderRadius: '4px'}}
                                                    disabled={(status === 2 || status === 3 || this.props.isDisabled) ? true : false}
                                                >
                                                    上传附件
                                                </Button>
                                            </UploaderFile>
                                        </div>
                                    </div>
                                    <div className="flex main-padding" style={{minHeight: 110}}>
                                        <div style={{width: 120}}></div>
                                        <div style={{width: 600, maxHeight: 200, overflow: 'auto'}}>
                                            <Table 
                                                rowSelection={this.rowSelection} 
                                                columns={columns} 
                                                bordered={false}
                                                dataSource={uploadFileVo} 
                                                size={size}
                                                //scroll={{x: true}}
                                                pagination={
                                                    // totalLen > 0 ? 
                                                    // {
                                                    //     ...this.state.pagination,
                                                    //     onShowSizeChange: this.onShowSizeChange,
                                                    //     showSizeChanger: true
                                                    // } 
                                                    // :
                                                    false
                                                }
                                                onChange={this.handleTableChange}
                                                // pagination={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-vertical-center" style={{padding: '10px 20px 20px'}}>
                                        <div  style={{color: '#808080', width: 120}}>选择中转地</div>
                                        <div>
                                            <SelectMulti
                                                defaultValue={this.changeSelectMultiData(developmentTransitPlaces) ? this.changeSelectMultiData(developmentTransitPlaces) : []}
                                                getDataMethod='getNodeList'
                                                labelField='name'
                                                dataKey='records'
                                                params={{limit: 9999999, offset: 0}}
                                                handleChangeSelect={this.handleChangeNode}
                                            />
                                        </div>
                                    </div>
                                    <div style={{height: 10, background: '#eee'}}></div>
                                    {
                                        this.isInArray(this.props.operationTypeList, 1) ?
                                        <Fragment>
                                            <div className="main-padding" style={{padding: '10px 20px'}}>
                                                <ModeOfTransport
                                                    getThis={v => this.modeTransport = v}
                                                    noBordered
                                                    //type={type}
                                                    getDataMethod={'getPlanQuotation'}
                                                    getDataUrl={'project/development/exportData'}
                                                    clientQuotationTransportVos={clientQuotationTransportVos}
                                                    //quotationNumber={quotationNumber}
                                                    reviewStatus={status === 0 ? 3 : status === 1 ? 1 : status === 2 ? 2 : status === 3 ? 4 : 1 }
                                                    isDisabled = {this.props.isDisabled}
                                                    transportModeBusinessModes={transportModeBusinessModes}
                                                    noCostItems
                                                    noEdit={(status === 2 || status=== 3 || this.props.isDisabled) ? true : false}
                                                    quotationMethod='cooperationOrCost'
                                                    fontWeightVul={400}
                                                    tableHeader={ //自定义表头
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
                                        <div className="main-padding" style={{paddingBottom: '20px'}}>
                                            <div style={{borderBottom: '1px solid #ddd', color: 'rgb(72, 72, 72)', lineHeight: '40px'}}>仓储成本研发</div>
                                            <Storage
                                                data={storageData} 
                                                ref='storage'
                                                reviewStatus={status}
                                                isDisabled={this.props.isDisabled}
                                                getActiveMode={(value) => {
                                                    this.setState({
                                                        activeMode: value
                                                    })
                                                }}
                                            />
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
                </Spin>
            </div>
        )
    }
}
 
export default ProjectDevelopment;