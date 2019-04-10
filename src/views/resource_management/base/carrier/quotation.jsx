import React, { Component } from 'react'
import ModalWraper from '@src/components/modular_window'
import { Form, message,  Button} from 'antd'
import { inject } from "mobx-react"
import { children, id } from './power'
import moment from 'moment'
import { stringToArray } from '@src/utils'
import { cloneObject} from '@src/utils'
import ModeOfTransport from '@src/components/dynamic_table1/mode_of_transport'
const power = Object.assign({}, children, id)

@inject('rApi')
class Quotation extends Component {

    state={
        title: '',
        open: false,
        edit: false,
        loading: false,
        openType: null,
        quotationLines: [],
        itemId: null, //id
        name: null, //承运商名称
        abbreviation: null, //承运商简称
        code: null, //承运商代码
        type: null, //承运商类型
        typedata: [], //承运商类型数据
        payTypedata: [], //关联付款承运商类型数据
        payDefaultdata: [], //关联付款承运商类型默认值
        address: null, //公司地址
        addressdata: {}, // 公司地址信息
        areaName: [], //所属片区名称
        associatePaymentCarrierId: 0, //关联付款承运商id
        carCount: 0, //车辆数
        checkAccountPeriod: 0, //对账周期
        cooperateStatus: 0, //合作状态
        cooperateStatusName: null, //合作状态对应名
        cooperatedata: [], //合作状态数据
        customer: [], //服务客户
        startCooperateTime: null, //开始合作时间
        endCooperateTime: null, //结束合作时间
        jurisdictionId: 0, //管辖所属编号
        jurisdictionName: null, //管辖所属名
        mainBusiness: [], //主营业务ya
        mainBusinessData: [], //主营业务数据
        openAccountBank: null, //开户行
        payee: null, //收款人
        payeeAccount: null, //收款账号
        remark: null, //备注信息
        serviceIndustry: [], //服务行业
        serviceIndustryData: [], //主营业务数据
        carrierLabel: [], //承运商标签
        carrierTagData: [], // 承运商标签数据
        staffCount: 0, //公司人数
        associatePayShow: false, 
        companyShow: false,
        cooperateShow: false,
        ifDisable: false, //拉黑状态
        status: 1, //拉黑返回状态
        historyData: null, // 传入数据
        uploadFileVo: [], //上传文件路径
        checkFileUrl: null, //查看附件
        contractNo: null, // 合同编号
        buttonLoading: false,
        transportModeBusinessModes: []
    }
    constructor(props) {
        super(props);
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

    
    show(d) {
       // console.log('参考报价', d.data)
        let historyData = typeof d.data === 'object' ? cloneObject(d.data) : null
        if (d.edit) {
            d.data = Object.assign({}, d.data, {
                openType: 1,
                title:'参考报价',
                clientQuotationTransportVos: d.data.clientQuotationTransports,
                customer: d.data.customer ? stringToArray(d.data.customer) : [],
                areaName: d.data.areaName ? stringToArray(d.data.areaName) : [],
                addressdata: (d.data.address && typeof(d.data.address) === 'string') ? JSON.parse(d.data.address) : d.data.address ? d.data.address : {},
                cooperatedata: d.data.cooperateStatus && d.data.cooperateStatusName ? {id: d.data.cooperateStatus, title: d.data.cooperateStatusName} : [],
                mainBusinessData: d.data.mainBusinesses ? d.data.mainBusinesses.map(item => {
                    let obj = {id: item.dictionaryId, title:  item.dictionaryName}
                    return obj
                }) : [],
                mainBusiness: d.data.mainBusinesses ? d.data.mainBusinesses.map(item => {
                    let obj = {dictionaryId: item.dictionaryId, dictionaryName:  item.dictionaryName}
                    return obj
                }) : [],
                serviceIndustryData: d.data.serviceIndustries ? d.data.serviceIndustries.map(item => {
                    let obj = {id: item.dictionaryId, title:  item.dictionaryName}
                    return obj
                }) : [],
                serviceIndustry: d.data.serviceIndustries ? d.data.serviceIndustries.map(item => {
                    let obj = {dictionaryId: item.dictionaryId, dictionaryName:  item.dictionaryName}
                    return obj
                }) : [],
                carrierTagData: d.data.carrierLabels ? d.data.carrierLabels.map(item => {
                    let obj = {id: item.dictionaryId, title:  item.dictionaryName}
                    return obj
                }) : [],
                carrierLabel: d.data.carrierLabels ? d.data.carrierLabels.map(item => {
                    let obj = {dictionaryId: item.dictionaryId, dictionaryName:  item.dictionaryName}
                    return obj
                }) : [],
                itemId: d.data.id,
                startCooperateTime: d.data.startCooperateTime ? moment(d.data.startCooperateTime).format('YYYY-MM-DD') : '',
                endCooperateTime:  d.data.endCooperateTime ? moment(d.data.endCooperateTime).format('YYYY-MM-DD') : '',
                contacts: d.data.carrierContacts,
                checkFileUrl:  d.data.carrierAttachmentList && d.data.carrierAttachmentList.length > 0 ? d.data.carrierAttachmentList[d.data.carrierAttachmentList.length-1].filePath : null
            })
        } 
        this.setState({
            ...Object.assign({}, d.data),
            historyData: historyData,
            open: true,
            edit: d.edit
        })
    }

    clearValue() {
        this.setState({
            // carrierQuotationLineExpress: {}, // 快递报价
            // carrierQuotationLineLtl: {}, // 零担报价
            // carrierQuotationLineVehicle: {}, // 整车报价
            quotationLines: [],
            loading: false,
            itemId: null, //id
            name: null, //承运商名称
            abbreviation: null, //承运商简称
            code: null, //承运商代码
            type: null, //承运商类型
            address: null, //公司地址
            addressdata: {}, // 公司地址信息
            areaName: [], //所属片区名称
            associatePaymentCarrierId: 0, //关联付款承运商id
            payDefaultdata: [], //关联付款承运商类型数据
            carCount: 0, //车辆数
            checkAccountPeriod: 0, //对账周期
            cooperateStatus: 0, //合作状态
            cooperateStatusName: null, //合作状态对应名
            cooperatedata: [], //合作状态数据
            customer: [], //服务客户
            startCooperateTime: null, //开始合作时间
            endCooperateTime: null, //结束合作时间
            jurisdictionId: 0, //管辖所属编号
            jurisdictionName: null, //管辖所属名
            openAccountBank: null, //开户行
            payee: null, //收款人
            payeeAccount: null, //收款账号
            remark: null, //备注信息
            carrierTagData: [], //承运商标签数据
            carrierLabel: [], //承运商标签
            staffCount: 0, //公司人数
            contacts: [], // 承运商联系人
            mainBusiness: [], //主营业务ya
            mainBusinessData: [], //主营业务数据
            serviceIndustry: [], //服务行业
            serviceIndustryData: [], //主营业务数据
            associatePayShow: false, 
            companyShow: false,
            cooperateShow: false,
            uploadFileVo: [], //上传文件路径
            checkFileUrl: null, //查看附件
            contractNo: null, // 合同编号
            buttonLoading: false,
            transportModeBusinessModes: []
        })
    }


    actionDone = () => {
        this.refresh()
        this.changeOpen(false)
        message.success('操作成功！')
    }

    refresh = () => {
        const { parent } = this.props
        if (parent.searchCriteria) {
            parent.searchCriteria()
        }
    }
    
    /**
     * status = 1 // {status: this.state.status}
     * 
     * @memberof AddOrEdit
     */
    updateThisDataToTable = (d) => {
       // console.log('updateThisDataToTable', d)
        let { historyData } = this.state
        const { parent } = this.props
        if (!historyData) return
        if (parent && parent.tableView)
        parent.tableView.updateData(Object.assign({}, historyData, d))
    }

    clearValue() {
        this.setState({
            transportModeBusinessModes: [],
            clientQuotationTransportVos: [] //报价类型
        })
    }

    onSubmit = () => {
        alert('xxx')
    }

    saveSubmit = () => {
        let { rApi } = this.props
        let {
                itemId,
                name,
                abbreviation,
                code,
                type,
                typedata,
                address,
                addressdata,
                areaName,
                associatePaymentCarrierId,
                carCount,
                checkAccountPeriod,
                cooperateStatus,
                cooperateStatusName,
                cooperatedata,
                customer,
                startCooperateTime,
                endCooperateTime,
                jurisdictionId,
                jurisdictionName,
                mainBusiness, 
                openAccountBank,
                payee,
                payeeAccount,
                remark,
                serviceIndustry,           
                staffCount,
                carrierLabel,
                uploadFileVo,
                contractNo, // 合同编号
                contacts,
                historyData
            } = this.state
            let quotationLines = this.modeTransport.getValues()
            // let transportModeBusinessModes = quotationLines.transportModeBusinessModes.map(item => {
            //     return {
            //         ...item,
            //         //id: itemId,
            //         quotationId: itemId
            //     }
            // })
            rApi.editCarrier({
                id: itemId,
                name: name,
                abbreviation: abbreviation,
                code: code,
                type: type,
                address: address,
                areaName: areaName,
                associatePaymentCarrierId: associatePaymentCarrierId,
                carCount: carCount,
                checkAccountPeriod: checkAccountPeriod,
                cooperateStatus: cooperateStatus,
                cooperateStatusName: cooperateStatusName,
                customer: customer, //服务客户
                startCooperateTime: startCooperateTime,
                endCooperateTime: endCooperateTime,
                jurisdictionId: jurisdictionId,
                jurisdictionName: jurisdictionName,
                mainBusiness: mainBusiness,
                openAccountBank: openAccountBank,
                payee: payee,
                payeeAccount: payeeAccount,
                remark: remark,
                serviceIndustry: serviceIndustry,
                staffCount: staffCount,
                carrierContact: contacts,
                carrierLabel: carrierLabel,
                uploadFileVo,
                contractNo,
                removeAttachmentIds: [],
                ...quotationLines,
            }).then(d => {
                message.success('操作成功')
                this.changeOpen(false)
                //this.actionDone()
                this.setState({
                    buttonLoading: false
                }, () => {
                    this.updateThisDataToTable({
                        id: itemId,
                        name: name,
                        abbreviation: abbreviation,
                        code: code,
                        type: type,
                        address: address,
                        areaName: areaName,
                        associatePaymentCarrierId: associatePaymentCarrierId,
                        carCount: carCount,
                        checkAccountPeriod: checkAccountPeriod,
                        cooperateStatus: cooperateStatus,
                        cooperateStatusName: cooperateStatusName,
                        customer: customer, //服务客户
                        startCooperateTime: startCooperateTime,
                        endCooperateTime: endCooperateTime,
                        jurisdictionId: jurisdictionId,
                        jurisdictionName: jurisdictionName,
                        mainBusiness: mainBusiness,
                        openAccountBank: openAccountBank,
                        payee: payee,
                        payeeAccount: payeeAccount,
                        remark: remark,
                        serviceIndustry: serviceIndustry,
                        staffCount: staffCount,
                        carrierContact: contacts,
                        carrierLabel: carrierLabel,
                        uploadFileVo,
                        contractNo,
                        removeAttachmentIds: [],
                        ...quotationLines,
                        transportModeBusinessModes: d
                    })
                })
                // this.actionDone()
            }).catch(e => {
                message.error(e.msg || '操作失败！')
                this.setState({
                    buttonLoading: false
                })
            })
    }

    render() { 
        let { 
            openType,
            buttonLoading,
            title,
            transportModeBusinessModes,
            clientQuotationTransportVos //报价类型
        } = this.state
        return (
            <ModalWraper
                onSubmit={this.saveSubmit}
                style={{width: '95%', maxWidth: 1000}}
                changeOpen={this.changeOpen} 
                open={this.state.open} 
                haveFooter={true}
                footerText="保存"
                loading={buttonLoading}
                title={title} 
                getContentDom={v => this.popupContainer = v}
                >
                <div style={{ minHeight: 200, padding: '2px 0'}}>
                    <Form layout='inline'>
                        {/* <ModalWraper.Header title={''}>
                            <Button 
                                onClick={this.saveSubmit} 
                                //htmlType="submit" 
                                style={{ marginRight: 0, border: 0, borderRadius: 0, color: '#fff', background: '#18B583' }}
                                loading={buttonLoading}
                            >
                                保存
                            </Button>
                        </ModalWraper.Header> */}
                        <div style={{padding: '10px 20px'}}>
                            <ModeOfTransport
                                getThis={v => this.modeTransport = v}
                                //getPopupContainer={() => this.popupContainer || document.body}
                                type={openType}
                                getDataMethod={'getCarrierQuotations'}
                                clientQuotationTransportVos={clientQuotationTransportVos}
                                getDataUrl={'resource/carrier/exportData'}
                                //quotationNumber={quotationNumber}
                                //reviewStatus={reviewStatus}
                                //noEdit={(reviewStatus === 2 || reviewStatus=== 4) ? true : false}
                                transportModeBusinessModes={transportModeBusinessModes ? transportModeBusinessModes : []}
                                quotationMethod='cooperationOrCost'
                            />
                        </div>
                    </Form>
                </div>
            </ModalWraper>
        )
    }
}
 
export default Form.create()(Quotation);