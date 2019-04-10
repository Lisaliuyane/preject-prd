import React, { Component, Fragment } from 'react'
import Modal from '@src/components/modular_window'
import DynamicTable from '@src/components/dynamic_table1'
import RemoteSelect from '@src/components/select_databook'
import MultipleFileUpload from '@src/components/uploader_file_multiple'
import { Row, Col } from '@src/components/grid'
import { inject } from "mobx-react"
import { children, id } from './power'
import moment from 'moment'
import { cloneObject, objDeepCopy, imgClient } from '@src/utils'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import TransModal from './TransModal'
import TimePicker from '@src/components/time_picker'
import TextAreaBox from '@src/components/textarea'
// import DragView from '@src/components/table_header_drag'
// import { HeaderView, Table, Parent } from '@src/components/table_template'
import { DatePicker, Checkbox, Form, Input, Button, message, Popconfirm, InputNumber, Spin, Radio, Icon } from 'antd'
import FormItem from '@src/components/FormItem'
import ModeOfTransport from '@src/components/dynamic_table1/mode_of_transport'
import './addroredit.less'

const { RangePicker } = DatePicker
const RadioGroup = Radio.Group
const power = Object.assign({}, children, id)
/** 
 * 付款条件
*/
const PAYMENT_TERMS = {
    0: '现金结',
    1: '回单结',
    2: '单票结',
    3: '月结',
    4: '见票结'
}

/** 
 * 延期条款
*/
const EXTENSION_DATE = {
    0: '有限延期',
    1: '无限延期'
}

@inject('rApi', 'mobxTabsData', 'mobxBaseData', 'mobxDataBook')
class AddOrEdit extends Component {

    state = {
        open: false,
        id: null,
        reason: null, //驳回原因
        loading: false,
        reviewStatus: null, // 状态 0-保存 1-提交 2-审核通过 3-审核驳回 4-失效
        carrierQuotationLineExpress: {}, // 快递报价
        carrierQuotationLineLtl: {}, // 零担报价
        carrierQuotationLineVehicle: {}, // 整车报价
        quotationLines: [], // 整车报价
        carrierId: null, // 承运商ID
        carrierName: null, // 承运商名
        contractNo: null, // 合同编号
        currencyId: null, // 币种ID 
        currencyName: null, // 币种名
        days: null, // 结算天数
        dockedPersonId: null,  // 对接法人ID
        dockedPersonName: null, // 对接法人名
        effectiveDate: null, // 有效日期（起始）
        expirationDate: null, // 有效日期（结束）
        extensionMonths: 1, // 延期月份数
        extensionTerms: null, // 延期条款
        taxes: null, // 发票税
        withholdingTax: null, //补扣税
        billingType: 2, //开票类型
        isTextsIncluded: 0, // 是否含税
        paymentTerms: null, // 付款条件
        quotationNumber: null, // 报价单号
        remark: null, // 备注
        historyData: null, // 传入数据
        uploadFileVo: [], //上传文件路径
        checkFileUrl: [], //查看附件
        buttonLoading: false,
        transModalVisible: false, //是否显示运输方式弹窗
        costUsages: [], //费用用途
        transportTypeList: [], //运输方式
        backupTransportTypeList: [], //备份运输方式数据
        backupCheckedTransport: [], //备份当前已选中数据
        checkedTransport: [], //当前已选中运输方式数组
        checkedTransportData: [], //当前已选中运输方式数据
        transportModeBusinessModes: [],
        clientQuotationTransportVos: [],
        quoTationLoading: false,
        reLoadClient: false,
        clientId: null,
        clientName: null,
        demandId: null,
        demandName: null
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
    }
    
    changeOpen = (state) => {
        this.setState({
            open: state
        })
        if (!state) {
            this.clearValue()
        }
    }

    
    show = (d) => {
       // console.log('show', d.data.uploadFileVo)
        let { clientQuotationTransportVos } = this.state
        let historyData = typeof d.data === 'object' ? cloneObject(d.data) : null
        let uploadFileVo = (d.data && d.data.uploadFileVo) ? d.data.uploadFileVo : []
        // let type = 3
        // let title = '新建承运商报价'
        if (d.edit) {
            d.data = Object.assign({}, d.data, {
                type: 1,
                title: '编辑承运商报价',
                checkFileUrl: (uploadFileVo && uploadFileVo.length > 0) ? uploadFileVo.map(item => {
                    let obj = {
                        uid: item.id ? item.id : null,
                        name: item.fileName,
                        status: 'done',
                        fileUrl: imgClient().signatureUrl(item.filePath),
                        thumbUrl: imgClient().signatureUrl(item.filePath),
                        url: imgClient().signatureUrl(item.filePath)
                    }
                    return obj
                }) : [],
                clientQuotationTransportVos: d.data.clientQuotationTransports
            })
        } else if (d.data) {
            d.data = Object.assign({}, d.data, {
                type: 2,
                title: '查看承运商报价',
                //uploadFileVo:  d.data.carrierQuotationAttachmentList && d.data.carrierQuotationAttachmentList.length > 0 ? [d.data.carrierQuotationAttachmentList[d.data.carrierQuotationAttachmentList.length-1]] : [],
                //checkFileUrl:  d.data.carrierQuotationAttachmentList && d.data.carrierQuotationAttachmentList.length > 0 ? d.data.carrierQuotationAttachmentList[d.data.carrierQuotationAttachmentList.length-1].filePath : null,
                clientQuotationTransportVos: d.data.clientQuotationTransports,
                checkFileUrl: (uploadFileVo && uploadFileVo.length > 0) ? uploadFileVo.map(item => {
                    let obj = {
                        uid: item.id ? item.id : null,
                        name: item.fileName,
                        status: 'done',
                        fileUrl: imgClient().signatureUrl(item.filePath),
                        thumbUrl: imgClient().signatureUrl(item.filePath),
                        url: imgClient().signatureUrl(item.filePath)
                    }
                    return obj
                }) : [],
            })
        } else {
            d.data = {type: 3,  title: '新建承运商报价', ...d.data}
        }

        this.setState({
            ...d.data,
            historyData: historyData,
            open: true,
            edit: d.edit
        })
    }

    actionDone = () => {
        const { parent } = this.props
        if (parent.searchCriteria) {
            parent.searchCriteria()
        }
        message.success('操作成功！')
        this.changeOpen(false)
    }

      
    /**
     * status = 1 // {status: this.state.status}
     * 
     * @memberof AddOrEdit
     */
    updateThisDataToTable = (d) => {
        //.log('updateThisDataToTable', d)
        let { historyData } = this.state
        const { parent } = this.props
        if (!historyData) return
        if (parent && parent.tableView)
        parent.tableView.updateData(Object.assign({}, historyData, d))
    }

    clearValue() {
        // let {transportTypeList} = this.state
        // transportTypeList = transportTypeList.map(item => {
        //     item.checkedArr = []
        //     return item
        // })
        this.setState({
            loading: false,
            reason: null, //驳回原因
            reviewStatus: null, // 状态 0-保存 1-提交 2-审核通过 3-审核驳回
            carrierQuotationLineExpress: {}, // 快递报价
            carrierQuotationLineLtl: {}, // 零担报价
            carrierQuotationLineVehicle: {}, // 整车报价
            quotationLines: [], // 整车报价
            quotationNumber: null, // 报价单号
            carrierId: null, // 承运商ID
            carrierName: null, // 承运商名
            contractNo: null, // 合同编号
            currencyId: null, // 币种ID 
            currencyName: null, // 币种名
            dockedPersonId: null,  // 对接法人ID
            dockedPersonName: null, // 对接法人名
            effectiveDate: null, // 有效日期（起始）
            expirationDate: null, // 有效日期（结束）
            extensionMonths: 1, // 延期月份数
            extensionTerms: null, // 延期条款 0-有限延期
            isTextsIncluded: 0, // 是否含税
            paymentTerms: null, // 付款条件 0-现金结 1
            days: null, // 付款结算天数
            remark: null, // 备注
            taxes: null, // 发票税
            withholdingTax: null, //补扣税
            billingType: 2, //开票类型
            paymentShow: false, 
            id: null,
            uploadFileVo: [], //上传文件路径
            checkFileUrl: [], //查看附件
            buttonLoading: false,
            backupTransportTypeList: [], //备份运输方式数据
            backupCheckedTransport: [], //备份当前已选中数据
            checkedTransport: [], //当前已选中运输方式数组
            checkedTransportData: [], //当前已选中运输方式数据
            // transportTypeList,
            transportModeBusinessModes: [],
            clientQuotationTransportVos: [], //报价类型
            clientId: null,
            clientName: null,
            demandId: null,
            demandName: null
        })
    }
    

    /**
     * 提交
     * 
     * 
     * @memberOf AddOrEdit
     */
    onSubmit = () => {
        let quotationLines = this.modeTransport.getValues() 
        let {
            id,
            carrierId, // 承运商ID
            carrierName, // 承运商名
            contractNo, // 合同编号
            currencyId, // 币种ID 
            currencyName, // 币种名
            dockedPersonId,  // 对接法人ID
            dockedPersonName, // 对接法人名
            effectiveDate, // 有效日期（起始）
            expirationDate, // 有效日期（结束）
            extensionMonths, // 延期月份数
            extensionTerms, // 延期条款
            paymentTerms, // 付款条件 0-现金结 1
            days, // 付款结算天数
            remark, // 备注
            isTextsIncluded, // 是否含税
            taxes, // 发票税
            withholdingTax, //补扣税
            billingType, //开票类型
            uploadFileVo,
            clientId,
            clientName,
            demandId,
            demandName
        } = this.state
        let data = {
            ...quotationLines,
            id,
            carrierId, // 承运商ID
            carrierName, // 承运商名
            contractNo, // 合同编号
            currencyId, // 币种ID 
            currencyName, // 币种名
            dockedPersonId,  // 对接法人ID
            dockedPersonName, // 对接法人名
            effectiveDate, // 有效日期（起始）
            expirationDate, // 有效日期（结束）
            extensionMonths: extensionMonths ? extensionMonths : 1, // 延期月份数
            extensionTerms, // 延期条款
            paymentTerms, // 付款条件 0-现金结 1
            days, // 付款结算天数
            remark, // 备注
            isTextsIncluded, // 是否含税
            taxes: billingType === 1 ? 0 : taxes, // 发票税
            withholdingTax: withholdingTax ? withholdingTax : 0, //补扣税
            billingType, //开票类型
            uploadFileVo,
            removeAttachmentIds: [],
            clientId,
            clientName,
            demandId,
            demandName,
        }
        this.editSave().then(res => {
            this.props.rApi.offerSubmit({
                id
            }).then(d => {
                this.setState({
                    reviewStatus: 1
                }, () => {
                    this.updateThisDataToTable({
                        reviewStatus: this.state.reviewStatus,
                        ...data
                    })
                })
                message.success('操作成功！')
            }).catch(e => {
                message.error(e.msg || '操作失败!')
            })
        })
    }

    /**
     * 审核通过
     * 
     * 
     * @memberOf AddOrEdit
     */
    toExaminePass = () => {
        let { id } = this.state
        this.props.rApi.offerExaminePass({
            id
        }).then(d => {
            this.setState({
                reviewStatus: 2
            }, () => {
                this.updateThisDataToTable({reviewStatus: this.state.reviewStatus})
            })
            message.success('操作成功！')
        }).catch(e => {
            message.error(e.msg || '操作失败!')
        })
    }

    
    /**
     * 取消通过
     * 
     * 
     * @memberOf AddOrEdit
     */
    toExamineCancel = () => {
        let { id } = this.state
        this.props.rApi.offerCancelExaminePass({
            id
        }).then(d => {
            this.setState({
                reviewStatus: 1
            }, () => {
                this.updateThisDataToTable({reviewStatus: this.state.reviewStatus})
                message.success('操作成功！')
            })
        }).catch(e => {
            message.error(e.msg || '操作失败!')
        })
    }

    /**
     * 审核驳回
     * 
     * 
     * @memberOf AddOrEdit
     */
    toExamineReject = () => {
        let { id, reason } = this.state
        this.props.rApi.offerExamineReject({
            id,
            reason
        }).then(d => {
            this.setState({
                reviewStatus: 3
            }, () => {
                this.updateThisDataToTable({reviewStatus: this.state.reviewStatus})
            })
            message.success('操作成功！')
        }).catch(e => {
            message.error(e.msg || '操作失败!')
        })
    }

    /**
     * 保存
     * 
     * 
     * @memberOf AddOrEdit
     */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            this.onSave()
          }
        });
    }

    onSave = () => {
        let quotationLines = this.modeTransport.getValues() 
        let {
            id,
            type,
            carrierId, // 承运商ID
            carrierName, // 承运商名
            contractNo, // 合同编号
            currencyId, // 币种ID 
            currencyName, // 币种名
            dockedPersonId,  // 对接法人ID
            dockedPersonName, // 对接法人名
            effectiveDate, // 有效日期（起始）
            expirationDate, // 有效日期（结束）
            extensionMonths, // 延期月份数
            extensionTerms, // 延期条款
            paymentTerms, // 付款条件 0-现金结 1
            days, // 付款结算天数
            remark, // 备注
            isTextsIncluded, // 是否含税
            taxes, // 发票税
            withholdingTax, //补扣税
            billingType, //开票类型
            uploadFileVo,
            loading,
            reviewStatus,
            clientId,
            clientName,
            demandId,
            demandName
        } = this.state
        const { rApi } = this.props
        // if (!isTextsIncluded) {
        //     taxes = null
        // }
        if(!paymentTerms || paymentTerms === 0 || paymentTerms === 1 || paymentTerms === 2){
            days = null
        }
        if (type === 2) {
            return
        } else if (type === 3) {
                this.setState({
                    buttonLoading: true
                })
                rApi.addOfferCarrier({
                    ...quotationLines,
                    carrierId, // 承运商ID
                    carrierName, // 承运商名
                    contractNo, // 合同编号
                    currencyId, // 币种ID 
                    currencyName, // 币种名
                    dockedPersonId,  // 对接法人ID
                    dockedPersonName, // 对接法人名
                    effectiveDate, // 有效日期（起始）
                    expirationDate, // 有效日期（结束）
                    extensionMonths, // 延期月份数
                    extensionTerms, // 延期条款
                    paymentTerms, // 付款条件 0-现金结 1
                    days, // 付款结算天数
                    remark, // 备注
                    isTextsIncluded, // 是否含税
                    taxes: billingType === 1 ? 0 : taxes, // 发票税
                    withholdingTax: withholdingTax ? withholdingTax : 0, //补扣税
                    billingType, //开票类型
                    uploadFileVo,
                    removeAttachmentIds: [],
                    clientId,
                    clientName,
                    demandId,
                    demandName
                }).then((result) => {
                    this.setState({
                        buttonLoading: false
                    })
                    this.actionDone()
                }).catch((err) => {
                    message.error(err.msg || '操作失败！')
                    this.setState({
                        buttonLoading: false
                    })
                })
        } else if (type === 1) {
           this.editSave(true)
        }
    }

    editSave = (isMsg) => { //编辑保存
        let { rApi } = this.props
        let quotationLines = this.modeTransport.getValues() 
        let {
            id,
            type,
            carrierId, // 承运商ID
            carrierName, // 承运商名
            contractNo, // 合同编号
            currencyId, // 币种ID 
            currencyName, // 币种名
            dockedPersonId,  // 对接法人ID
            dockedPersonName, // 对接法人名
            effectiveDate, // 有效日期（起始）
            expirationDate, // 有效日期（结束）
            extensionMonths, // 延期月份数
            extensionTerms, // 延期条款
            paymentTerms, // 付款条件 0-现金结 1
            days, // 付款结算天数
            remark, // 备注
            isTextsIncluded, // 是否含税
            taxes, // 税率
            withholdingTax, //补扣税
            billingType, //开票类型
            uploadFileVo,
            loading,
            reviewStatus,
            clientId,
            clientName,
            demandId,
            demandName
        } = this.state
        let data = {
            ...quotationLines,
            id,
            carrierId, // 承运商ID
            carrierName, // 承运商名
            contractNo, // 合同编号
            currencyId, // 币种ID 
            currencyName, // 币种名
            dockedPersonId,  // 对接法人ID
            dockedPersonName, // 对接法人名
            effectiveDate, // 有效日期（起始）
            expirationDate, // 有效日期（结束）
            extensionMonths: extensionMonths ? extensionMonths : 1, // 延期月份数
            extensionTerms, // 延期条款
            paymentTerms, // 付款条件 0-现金结 1
            days, // 付款结算天数
            remark, // 备注
            isTextsIncluded, // 是否含税
            taxes: billingType === 1 ? 0 : taxes, // 发票税
            withholdingTax: withholdingTax ? withholdingTax : 0, //补扣税
            billingType, //开票类型
            uploadFileVo,
            removeAttachmentIds: [],
            clientId,
            clientName,
            demandId,
            demandName,
        }
        return new Promise((resolve, reject) => {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    this.setState({
                        buttonLoading: true
                    })
                    const pro = rApi.editOfferCarrier(data)
                    pro.then((result) => {
                        if(isMsg) {
                            message.success('操作成功!')
                        }
                        this.setState({
                            buttonLoading: false,
                            quoTationLoading: true,
                            transportModeBusinessModes: result,
                        }, () => {
                            this.setState({
                                quoTationLoading: false
                            })
                            this.updateThisDataToTable({
                                reviewStatus,
                                transportModeBusinessModes: result,
                                ...data
                            })
                        })
                        resolve(result)
                    }).catch((error) => {
                        if(isMsg) {
                            message.error(error.msg || '操作失败！')
                        }
                        this.setState({
                            buttonLoading: false
                        })
                        reject(err)
                    })
                    return pro
                }
                reject(err)
            })
        })
    }

    getFileDetail = (value) => {
        value = (value && value.length > 0) ? value.map(item => {
            return {
                filePath: item.fileUrl,
                fileName: item.name
            }
        }) : []
        this.setState({
            uploadFileVo: value
        })
    }

    // getOfferFileName = (value) => {
    //     this.setState({
    //         uploadFileVo: [value]
    //     })
    // }

    // getLoadingVal = (value) => {
    //     this.setState({
    //         loading: value
    //     })
    // }

    // changeStartTime = (date, dateStr) => {
    //     this.setState({
    //         effectiveDate: dateStr
    //     })
    // }

    // changeEndTime = (date, dateStr) => {
    //     this.setState({
    //         expirationDate: dateStr
    //     })
    // }

    clearData = (isClear) => {
        if (isClear) {
            //console.log('clearData')
            this.setState({
                reLoadClient: true,
                demandId: null,
            }, () => {
                this.setState({
                    reLoadClient: false
                })
            })
        }
    }

    getDemandsList = () => { //获取需求名称
        let { rApi } = this.props
        return new Promise((resolve, reject) => {
            rApi.getDemandsList({
                pageSize: 999999, 
                pageNo: 1, 
                clientId: this.state.clientId, 
                processStatus: 4, 
                demandStatus: 1
            }).then(res => {
                res = res.records
                let data = res && res.length > 0 && res.filter(d => d.rejectStatus === 0)
                //console.log('获取需求名称', data)
                resolve(data)
            }).catch(e => {
                reject(e)
            })
        })
    }

    render() {
        let {
            open,
            title,
            type,
            quotationLines, // 整车报价
            carrierId, // 承运商ID
            carrierName, // 承运商名
            currencyId, // 币种ID 
            currencyName, // 币种名
            dockedPersonId,  // 对接法人ID
            dockedPersonName, // 对接法人名
            effectiveDate, // 有效日期（起始）
            expirationDate, // 有效日期（结束）
            extensionMonths, // 延期月份数
            extensionTerms, // 延期条款
            paymentTerms, // 付款条件 0-现金结 1
            days, // 付款结算天数
            remark, // 备注
            isTextsIncluded, // 是否含税
            taxes, // 税率
            withholdingTax, //补扣税
            billingType, //开票类型
            quotationNumber, // 报价单号
            reviewStatus,
            checkFileUrl,
            uploadFileVo,
            loading,
            buttonLoading,
            transModalVisible,
            checkedTransport,
            transportTypeList,
            checkedTransportData,
            clientQuotationTransportVos,
            transportModeBusinessModes,
            quoTationLoading,
            reLoadClient,
            clientId,
            clientName,
            demandId,
            demandName
        } = this.state
        const { getFieldDecorator } = this.props.form
        if (!open) {
            return null
        }
        // console.log('this.props.form', this.props.form)
        return (
            <Modal
                style={{width: '95%', maxWidth: 1000}}
                changeOpen={this.changeOpen} 
                open={this.state.open} 
                title={title} 
                parent={this}
                getContentDom={v => this.popupContainer = v}
            >
                <div ref={v => this.modal = v}>
                    {
                        this.modal &&
                        <TransModal
                            parentDom={this.modal}
                            transModalVisible={transModalVisible}
                            closeTransport={this.closeTransport}
                            transportTypeList={transportTypeList}
                            checkedTransport={checkedTransport}
                            changeTransportChild={this.changeTransportChild}
                            saveTransport={this.saveTransport}
                            changeCheckedTransport={this.changeCheckedTransport}
                        />
                    }
                    <Form first='true' layout='inline' onSubmit={this.handleSubmit}>
                        <Modal.Header title={
                            <span>
                                <span style={{colr: '#808080'}}>{type === 3 ? '' : '状态:'}</span>
                                {
                                    reviewStatus === 1 ?
                                    <span style={{fontSize: '14px', color: 'rgb(29, 165, 122)', marginLeft: 10}}>已提交</span>
                                    :
                                    reviewStatus === 2 ?
                                    <span style={{fontSize: '14px', color: 'rgb(29, 165, 122)', marginLeft: 10}}>审核通过</span>
                                    :
                                    reviewStatus === 3 ?
                                    <span style={{fontSize: '14px', color: 'red', marginLeft: 10}}>驳回</span>
                                    :
                                    reviewStatus === 4 ?
                                    <span style={{fontSize: '14px', color: 'red', marginLeft: 10}}>已失效</span>
                                    :
                                    type !== 3 ?
                                    <span style={{fontSize: '14px', color: 'rgb(29, 165, 122)', marginLeft: 10}}>保存待提交</span>
                                    :
                                    null
                                }
                            </span>
                        }>
                        {
                            type === 1 || type === 3 ?  
                            <FormItem>
                                <Button 
                                    //icon='save' 
                                    className={(reviewStatus === null) ? 'btn-success' : ''}
                                    style={{ border: (reviewStatus === null) ? 'none' : '1px solid #d9d9d9'}}
                                    disabled={(reviewStatus === 1 || reviewStatus === 2) ? true : false}
                                    htmlType="submit"
                                    loading={buttonLoading}
                                    >
                                    保存
                                </Button> 
                            </FormItem>
                            : 
                            null
                        }
                        {
                            type === 1 ?
                            <FunctionPower power={power.CARRIER_SUBMIT}>
                                <Popconfirm
                                    placement="topLeft"
                                    title="确定提交吗?"
                                    onConfirm={this.onSubmit}
                                    okText="确定"
                                    cancelText="取消">
                                        <Button 
                                           //icon='rocket' 
                                            className={(reviewStatus !== 2 || reviewStatus !== 1) ? 'btn-success' : ''}
                                            style={{ marginLeft: 10, border: (reviewStatus === 1 || reviewStatus === 2) ? '1px solid #d9d9d9' : 'none'}}
                                            disabled={(reviewStatus === 1 || reviewStatus === 2) ? true : false}
                                        >
                                            提交
                                        </Button> 
                                </Popconfirm>
                            </FunctionPower>  
                            : 
                            null
                        }
                        {
                            type === 1 &&  reviewStatus === 2 ?
                            <FunctionPower power={power.CARRIER_CANCEL}>
                                <Popconfirm
                                    placement="topLeft"
                                    title="确定取消吗?"
                                    onConfirm={this.toExamineCancel}
                                    okText="确定"
                                    cancelText="取消">
                                        <Button 
                                            //icon='enter' 
                                            style={{ marginLeft: 10 }}
                                            disabled={(reviewStatus === 1 || reviewStatus === 2) ? false : true}
                                        >
                                            取消通过
                                        </Button> 
                                </Popconfirm>
                            </FunctionPower>  
                            :
                            type === 1 ?
                            <FunctionPower power={power.CARRIER_PASS}>
                                <Popconfirm
                                    placement="topLeft"
                                    title="确定通过吗?"
                                    onConfirm={this.toExaminePass}
                                    okText="确定"
                                    cancelText="取消">
                                        <Button 
                                            //icon='enter' 
                                            style={{ marginLeft: 10 }}
                                            disabled={(reviewStatus === 1 || reviewStatus === 2) ? false : true}
                                        >
                                            审核通过
                                        </Button> 
                                </Popconfirm>
                            </FunctionPower>  
                            :
                            null 
                        }
                        {
                            type === 1 ? 
                            <FunctionPower power={power.CARRIER_REJECT}>
                                <Popconfirm
                                    placement="topLeft"
                                    title="确定驳回吗?"
                                    onConfirm={this.toExamineReject}
                                    okText="确定"
                                    cancelText="取消">
                                        <Button 
                                            //icon='rollback' 
                                            style={{ marginLeft: 10, color: 'red', borderColor: 'red'}}
                                            disabled={(reviewStatus === 1) ? false : true}
                                        >
                                            审核驳回
                                        </Button> 
                                </Popconfirm>
                            </FunctionPower>  
                            : 
                            null
                        }
                        </Modal.Header>
                        <div style={{padding: '5px 20px', margin: 'auto'}}>
                            <Row>
                                <Col><span style={{ fontSize: '14px', color: '#484848'}}>基本信息</span></Col>
                            </Row>
                            <Row gutter={24} type={type} >
                                <Col  label="承运商名" span={7} isRequired text={carrierName} >
                                    <FormItem>
                                        {
                                            getFieldDecorator('carrierId', {
                                                initialValue: carrierId ?
                                                {
                                                    id: carrierId,
                                                    title: carrierName,
                                                    abbreviation: carrierName,
                                                }
                                                :
                                                null,
                                                rules: [
                                                    {
                                                        required: true, 
                                                        message: '请选择承运商名'
                                                    }
                                                ],
                                            })(
                                                <RemoteSelect
                                                    defaultValue={
                                                        carrierId ?
                                                        {
                                                            id: carrierId,
                                                            title: carrierName,
                                                            abbreviation: carrierName,
                                                        }
                                                        :
                                                        null
                                                    }
                                                    getPopupContainer={() => this.popupContainer || document.body}
                                                    labelField={'abbreviation'}
                                                    getDataMethod={'getCooperationCarriet'}
                                                    onChangeValue={(value = {}) => this.setState({carrierId: value.id, carrierName: value.title})}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col label="付款条件" span={8} text={
                                    (paymentTerms === 0 || paymentTerms === 1 || paymentTerms === 2)  ?
                                    PAYMENT_TERMS[paymentTerms]
                                    :
                                    paymentTerms && days ?
                                    `${PAYMENT_TERMS[paymentTerms]} - ${days}天`
                                    :
                                    paymentTerms ?
                                    PAYMENT_TERMS[paymentTerms]
                                    :
                                    '无'
                                }
                                    >
                                    <div className='flex flex-vertical-center'>
                                        <div style={{width: 110, marginRight: 5}}>
                                            <RemoteSelect
                                                defaultValue={
                                                    paymentTerms || paymentTerms === 0 ?
                                                    {
                                                        id: paymentTerms,
                                                        title: PAYMENT_TERMS[paymentTerms]
                                                    }
                                                    :
                                                    null
                                                }
                                                getPopupContainer={() => this.popupContainer || document.body}
                                                list={Object.keys(PAYMENT_TERMS).map(key => {
                                                    return {
                                                        id: parseInt(key),
                                                        title: PAYMENT_TERMS[key]
                                                    }
                                                })}
                                                onChangeValue={(value) => {
                                                    this.setState({paymentTerms: value ? value.id : null})
                                                }}
                                            />
                                        </div>
                                        {
                                            !(paymentTerms === 0 || paymentTerms === 1 || paymentTerms === 2) ? 
                                            <div style={{width: 80, marginRight: 5}}>
                                                <InputNumber 
                                                    min={0}
                                                    style={{width: '100%'}}
                                                    value={days}
                                                    onChange={value => this.setState({days: value})}
                                                />
                                            </div> 
                                            :
                                            null
                                        }
                                        {
                                            !(paymentTerms === 0 || paymentTerms === 1 || paymentTerms === 2) ?  <div>天</div> : ''
                                        }
                                    </div>
                                </Col>
                                <Col span={6} />
                            </Row>
                            <Row gutter={24} type={type} >
                                <Col label="所属客户" span={7} text={clientName} >
                                    <RemoteSelect
                                        defaultValue={
                                            clientId ?
                                            {
                                                id: clientId,
                                                shortname: clientName
                                            }
                                            :
                                            null
                                        }
                                        getPopupContainer={() => this.popupContainer || document.body}
                                        getDataMethod={'getClients'}
                                        params={{limit: 999999, offset: 0, status: 56}}
                                        labelField={'shortname'}
                                        onChangeValue={(value) => 
                                            this.setState({
                                                clientId: value ? value.id : null, 
                                                clientName: value ? value.shortname : null}, () => {
                                                    let id = value ? value.id : null
                                                    if (clientId !== id) {
                                                        this.clearData(true)
                                                    }
                                                }
                                            )}
                                    />
                                </Col>
                                <Col label="关联需求" span={7} text={demandName} >
                                    {
                                        reLoadClient ?
                                            null
                                            :
                                            <div style={{maxWidth: 195}}>
                                                <RemoteSelect
                                                    defaultValue={
                                                        demandId ?
                                                            {
                                                                id: demandId,
                                                                demandName: demandName,
                                                            }
                                                            :
                                                            null
                                                    }
                                                    getPopupContainer={() => this.popupContainer || document.body}
                                                    disabled={clientId ? false : true}
                                                    labelField={'demandName'}
                                                    // params={{ pageNo: 1, pageSize: 9999999, clientId: clientId, processStatus: 4, demandStatus: 0 }}
                                                    // getDataMethod={'getDemandsList'}
                                                    getData={this.getDemandsList}
                                                    onChangeValue={(value = {}) => this.setState({ demandId: value.id, demandName: value.demandName })}
                                                />
                                            </div>
                                    }
                                </Col>
                                <Col span={7} />
                            </Row>
                            <Row gutter={24} type={type}>
                                <Col label="对接法人" span={7} isRequired text={dockedPersonName} >
                                    <FormItem>
                                        {
                                            getFieldDecorator('position', {
                                                initialValue: dockedPersonId ?
                                                    {
                                                        id: dockedPersonId,
                                                        title: dockedPersonName,
                                                        name: dockedPersonName,
                                                    }
                                                    :
                                                    null,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择对接法人'
                                                    }
                                                ],
                                            })(
                                                <RemoteSelect
                                                    defaultValue={
                                                        dockedPersonId ?
                                                            {
                                                                id: dockedPersonId,
                                                                title: dockedPersonName,
                                                                fullName: dockedPersonName,
                                                            }
                                                            :
                                                            null
                                                    }
                                                    getPopupContainer={() => this.popupContainer || document.body}
                                                    getDataMethod="getLegalPersonList"
                                                    params={{ offset: 0, limit: 999999 }}
                                                    labelField='fullName'
                                                    onChangeValue={(value = {}) => this.setState({ dockedPersonId: value.id, dockedPersonName: value.title })}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col
                                    label="延期条款"
                                    span={8}
                                    text={(extensionTerms == 0 && extensionMonths) ? `${EXTENSION_DATE[extensionTerms]} - ${extensionMonths}个月` : EXTENSION_DATE[extensionTerms]}>
                                    <div className='flex flex-vertical-center'>
                                        <div style={{ width: 110, marginRight: 5 }}>
                                            <RemoteSelect
                                                defaultValue={
                                                    extensionTerms || extensionTerms == 0 ?
                                                        {
                                                            id: extensionTerms,
                                                            title: EXTENSION_DATE[extensionTerms]
                                                        }
                                                        :
                                                        null
                                                }
                                                getPopupContainer={() => this.popupContainer || document.body}
                                                list={Object.keys(EXTENSION_DATE).map(key => {
                                                    return {
                                                        id: key,
                                                        title: EXTENSION_DATE[key]
                                                    }
                                                })}
                                                onChangeValue={(value = {}) => this.setState({ extensionTerms: value.id })}
                                            />
                                        </div>
                                        {
                                            extensionTerms == 0 ?
                                                [
                                                    <div key={'extensionMonths'} style={{ width: 80, marginRight: 5 }}>
                                                        <InputNumber
                                                            min={1}
                                                            style={{ width: '100%' }}
                                                            value={extensionMonths ? extensionMonths : 1}
                                                            onChange={value => this.setState({ extensionMonths: value })}
                                                        />
                                                    </div>,
                                                    <div key={'extensionMonthstext'}>
                                                        个月
                                                </div>
                                                ]
                                                :
                                                null
                                        }
                                    </div>
                                </Col>
                                {/* <Col label="合同编号" span={7} text={contractNo} >
                                    <div className='flex flex-vertical-center'>
                                        <div style={{marginRight: 5}}>
                                            <Input 
                                                // disabled
                                                title={contractNo}
                                                value={contractNo ? contractNo : ''}
                                                onChange={ e => this.setState({contractNo: e.target.value}) }
                                            />
                                        </div>
                                    </div>
                                </Col> */}
                                <Col span={6} />
                            </Row>
                            <Row gutter={24} type={type} >
                                <Col label="报价单号" span={7} isRequired text={quotationNumber} >
                                    <Input
                                        disabled
                                        placeholder="自动生成"
                                        value={quotationNumber ? quotationNumber : ''}
                                        onChange={e => this.setState({ quotationNumber: e.target.value })}
                                    />
                                </Col>
                                <Col span={12} label="有效日期" isRequired text={`${moment(effectiveDate).format('YYYY-MM-DD')} 至 ${moment(expirationDate).format('YYYY-MM-DD')}`} >
                                    {/* <FormItem>
                                        {
                                            getFieldDecorator('effectiveDate', {
                                                initialValue: effectiveDate && expirationDate ? [moment(effectiveDate), moment(expirationDate)] : null,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择有效日期'
                                                    }
                                                ],
                                            })(
                                                <RangePicker
                                                    style={{ width: 220 }}
                                                    //defaultValue={effectiveDate && expirationDate ? [moment(effectiveDate ), moment(expirationDate)] : null}
                                                    // showTime
                                                    format="YYYY-MM-DD"
                                                    onChange={
                                                        (data, dateString) => {
                                                            this.setState({
                                                                effectiveDate: dateString ? dateString[0] : null,
                                                                expirationDate: dateString ? dateString[1] : null
                                                            })
                                                        }
                                                    }
                                                />
                                            )
                                        }
                                    </FormItem> */}
                                    <TimePicker
                                        getPopupContainer={() => this.popupContainer || document.body}
                                        startTime={effectiveDate}
                                        endTime={expirationDate}
                                        changeStartTime={(date, dateStr) => {
                                            this.setState({
                                                effectiveDate: dateStr
                                            })
                                        }}
                                        changeEndTime={(date, dateStr) => {
                                            this.setState({
                                                expirationDate: dateStr
                                            })
                                        }}
                                        getFieldDecorator={getFieldDecorator}
                                        isRequired
                                        pickerWidth={{width: 130}}
                                    />
                                </Col>
                                <Col span={2} />
                            </Row>
                            <Row gutter={24} type={type} style={{minHeight: 32}}>
                                <Col label="开票类型" span={7} text={billingType === 2 ? '专票' : '普票'}>
                                    <RadioGroup
                                        onChange={e => {
                                            this.setState({
                                                billingType: e.target.value ? e.target.value : 2,
                                                taxes: e.target.value === 1 ? 0 : (e.target.value === 2 && taxes === 0) ? 1 : taxes
                                            })
                                        }}
                                        value={billingType ? billingType : 2}
                                        defaultValue={billingType ? billingType : 2}
                                    >
                                        <Radio value={1}>普票</Radio>
                                        <Radio value={2}>专票</Radio>
                                    </RadioGroup>
                                </Col>
                                <Col span={10} label='是否含税' text={`${isTextsIncluded === 1 ? '含税' : '不含税'}, 发票税：${taxes ? taxes : 0}%, 补扣税: ${withholdingTax ? withholdingTax : 0}%`}>
                                    <div className='flex flex-vertical-center'>
                                        <div style={{ marginRight: 10 }}>
                                            <Checkbox
                                                checked={isTextsIncluded}
                                                onChange={value => {
                                                    if (value.target.checked) {
                                                        this.setState({ isTextsIncluded: 1 })
                                                    } else {
                                                        this.setState({ isTextsIncluded: 0 })
                                                    }
                                                }}></Checkbox>
                                        </div>
                                        <div className='flex flex-vertical-center'>
                                            <span style={{ marginRight: 10 }}>发票税</span>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('taxes', {
                                                        initialValue: taxes,
                                                        rules: [
                                                            {
                                                                required: true, 
                                                                message: '请填写发票率'
                                                            }
                                                        ],
                                                    })(
                                                        <InputNumber
                                                                min={0}
                                                                style={{ width: 80 }}
                                                                value={billingType === 1 ? 0 : taxes}
                                                                disabled={billingType === 1 ? true : false}
                                                                onChange={value => {
                                                                    this.setState({ 
                                                                        taxes: billingType === 1 ? 0 : value === 0 ? taxes : value 
                                                                    })
                                                                    //console.log('value',value)
                                                                }}
                                                            />
                                                    )
                                                }
                                            </FormItem>
                                            <span style={{marginLeft: 5}}>%</span>
                                            <span style={{ margin: '0 10px' }}>补扣税</span>
                                            {
                                                // reLoadWithholdingTax ?
                                                // null
                                                // :
                                                <FormItem>
                                                    {
                                                        getFieldDecorator('withholdingTax', {
                                                            initialValue: withholdingTax ? withholdingTax : 0,
                                                            rules: [
                                                                {
                                                                    required: true, 
                                                                    message: '请填写补扣税率'
                                                                }
                                                            ],
                                                        })(
                                                            <Fragment>
                                                                <InputNumber
                                                                    style={{ width: 80 }}
                                                                    defaultValue={withholdingTax || 0}
                                                                   // value={withholdingTax}
                                                                    onChange={value => {
                                                                        this.setState({ 
                                                                            withholdingTax: value || 0
                                                                        })
                                                                        //console.log('value',value)
                                                                    }}
                                                                />
                                                                <span style={{marginLeft: 5}}>%</span>
                                                            </Fragment>
                                                        )
                                                    }
                                                </FormItem>
                                            }
                                        </div>
                                    </div>
                                </Col>
                                <Col span={4} />
                            </Row>
                            <Row gutter={24} type={type}>
                                <Col isRequired label="&emsp;&emsp;币别" span={7} text={currencyName} >
                                    <RemoteSelect
                                        defaultValue={
                                            {
                                                id: currencyId || 88,
                                                title: currencyName || 'RMB'
                                            }
                                        }
                                        getPopupContainer={() => this.popupContainer || document.body}
                                        text={'币别'}
                                        allowClear={false}
                                        onChangeValue={(value = {}) => this.setState({ 
                                            currencyId: value.id || 88, 
                                            currencyName: value.title || 'RMB'
                                        })}
                                    />
                                </Col>
                            </Row>
                            <TextAreaBox 
                                type={type}
                                defaultValue={remark}
                                placeholderText=""
                                onChange={value => { this.setState({ remark: value }) }}
                            />
                            <div className="flex" style={{margin: '5px 0'}}>
                                <div style={{width: 70, color: 'rgb(136, 136, 136)'}}>报价附件：</div>
                                <div className="felx1" style={{minWidth: '300px'}}>
                                    <MultipleFileUpload 
                                        type={(reviewStatus === 1 || reviewStatus === 2 || type === 2) ? 2 : null}
                                        getFileDetail={this.getFileDetail}
                                        fileList={checkFileUrl}
                                    />
                                </div>
                            </div>
                            {/* <Row gutter={24} type={type}>
                                <Col span={6} label="报价附件">
                                    {
                                        reviewStatus === 1 || reviewStatus === 2 ?
                                        null
                                        :
                                        loading === true ?
                                        <Spin spinning={loading} />
                                        :
                                        <MultipleFileUpload 
                                            getFileDetail={this.getFileDetail}
                                            fileList={checkFileUrl}
                                        />
                                    }
                                </Col>
                            </Row> */}
                            {
                                quoTationLoading ?
                                null
                                :
                                <ModeOfTransport
                                    getThis={v => this.modeTransport = v}
                                    type={type}
                                    getDataMethod={'getOfferCarrierQuotations'}
                                    getPopupContainer={() => this.popupContainer || document.body}
                                    getDataUrl={'resource/carrierQuotation/exportData'}
                                    noEdit={(reviewStatus === 1 || reviewStatus=== 2) ? true : false}
                                    // clientQuotationTransportVos={clientQuotationTransportVos}
                                    quotationNumber={quotationNumber}
                                    reviewStatus={reviewStatus === 0 ? 1 : reviewStatus === 1 ? 2 : reviewStatus === 2 ? 4 : reviewStatus === 3 ? 3 : reviewStatus === 4 ? 6 : 1 }
                                    transportModeBusinessModes={transportModeBusinessModes ? transportModeBusinessModes : []}
                                    quotationMethod='cooperationOrCost'
                                />
                            }
                        </div>
                    </Form>
                </div>
            </Modal>
        )
    }
}
 
export default Form.create()(AddOrEdit);