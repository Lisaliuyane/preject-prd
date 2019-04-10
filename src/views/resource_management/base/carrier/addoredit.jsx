import React, { Component } from 'react'
import ModalWraper from '@src/components/modular_window'
import { Button, Form, Input, InputNumber, message, Icon, DatePicker, Tabs, Spin } from 'antd'
import RemoteSelect from '@src/components/select_databook'
import { SelectAddressNew } from '@src/components/select_address'
import SelectMulti from '@src/components/select_multi'
import MultiInputButton from '@src/components/select_multi_input'
import DynamicTable from '@src/components/dynamic_table1'
import MultipleFileUpload from '@src/components/uploader_file_multiple'
import FormItem from '@src/components/FormItem'
import { Row, Col } from '@src/components/grid'
import Contacts from './contacts'
import moment from 'moment'
import { inject } from "mobx-react"
import { children, id } from './power'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import './addoredit.less'
import { dateSelectData } from './date_select_data'
import { cloneObject, validateToNextCar, imgClient} from '@src/utils'
import TimePicker from '@src/components/time_picker'
import { addressFormat } from '@src/utils'
const power = Object.assign({}, children, id)
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker
const carrierTypeData = {
    "运作承运商": 1,
    "无车承运人": 2,
    "信息部(黄牛)": 3,
    "车队": 4,
    "装卸公司": 5
}
@inject('rApi')
class AddOrEdit extends Component {

    state={
        title: '',
        open: false,
        edit: false,
        loading: false,
        openType: null,
        // carrierQuotationLineExpress: {}, // 快递报价
        // carrierQuotationLineLtl: {}, // 零担报价
        // carrierQuotationLineVehicle: {}, // 整车报价
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
        areaName: null, //所属片区名称
        associatePaymentCarrierId: 0, //关联付款承运商id
        carCount: 0, //车辆数
        checkAccountPeriod: 0, //对账周期
        cooperateStatus: 0, //合作状态
        cooperateStatusName: null, //合作状态对应名
        cooperatedata: [], //合作状态数据
        customer: null, //服务客户
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
    componentDidMount () {
        this.setState({typedata: Object.keys(carrierTypeData).map(item => {
                return {
                    id: carrierTypeData[item],
                    title: item
                }
            })
        })
        this.props.rApi.getCanDrawABill().then((res) => {
            if(res && res !== ''){
                this.setState({
                    payTypedata: res.map(item => {
                        return {
                            id: item.id,
                            name: item.name
                        }
                    })
                })
                //console.log('payTypedata',res)
            }
        }).catch(e => {
            //message.error(e.msg || '请求失败')
        })
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
        // console.log('show编辑', d.data)
        let historyData = typeof d.data === 'object' ? cloneObject(d.data) : null
        let uploadFileVo = (d.data && d.data.uploadFileVo) ? d.data.uploadFileVo : []
        if (d.edit) {
            d.data = Object.assign({}, d.data, {
                openType: 1,
                title:'编辑承运商',
                customer: d.data.customer,
                areaName: d.data.areaName,
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
                //checkFileUrl:  d.data.carrierAttachmentList && d.data.carrierAttachmentList.length > 0 ? d.data.carrierAttachmentList[d.data.carrierAttachmentList.length-1].filePath : null
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
            if((d.data.type && d.data.type === '车队') || (d.data.type && d.data.type === '装卸公司')) {
                this.setState({
                    associatePayShow: true, 
                    companyShow: true,
                })
            } else if(d.data.type && d.data.type === '运作承运商'){
                this.setState({
                    associatePayShow: false, 
                    companyShow: true,
                })
            } else {
                this.setState({
                    associatePayShow: false, 
                    companyShow: false,
                })
            }
            if((d.data.cooperateStatusName && d.data.cooperateStatusName === '开发中') || !d.data.cooperateStatusName) {
                this.setState({
                    cooperateShow: false,
                    // companyShow: false
                })
            } else{
                this.setState({
                    cooperateShow: true,
                    // companyShow: true
                })
            }
            // payTypedata: [], //关联付款承运商类型数据
            // payDefaultdata
            if(d.data.associatePaymentCarrierId && d.data.associatePaymentCarrierId !== ''){
                this.setState({
                    payDefaultdata: this.state.payTypedata.filter((item) => {
                        return item.id === d.data.associatePaymentCarrierId
                    })
                })
            }
        } else if (d.data) {
            d.data = Object.assign({}, d.data, {
                openType: 2,
                title:'查看承运商',
                customer: d.data.customer,
                areaName: d.data.areaName,
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
                //checkFileUrl:  d.data.carrierAttachmentList && d.data.carrierAttachmentList.length > 0 ? d.data.carrierAttachmentList[d.data.carrierAttachmentList.length-1].filePath : null
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
            if((d.data.type && d.data.type === '车队') || (d.data.type && d.data.type === '装卸公司')) {
                this.setState({
                    associatePayShow: true, 
                    companyShow: true,
                })
            } else if(d.data.type && d.data.type === '运作承运商'){
                this.setState({
                    associatePayShow: false, 
                    companyShow: true,
                })
            } else {
                this.setState({
                    associatePayShow: false, 
                    companyShow: false,
                })
            }
            if((d.data.cooperateStatusName && d.data.cooperateStatusName === '开发中') || !d.data.cooperateStatusName) {
                this.setState({
                    cooperateShow: false,
                    // companyShow: false
                })
            } else{
                this.setState({
                    cooperateShow: true,
                    // companyShow: true
                })
            }
            if(d.data.associatePaymentCarrierId && d.data.associatePaymentCarrierId !== ''){
                this.setState({
                    payDefaultdata: this.state.payTypedata.filter((item) => {
                        return item.id === d.data.associatePaymentCarrierId
                    })
                })
            }
        } else {
            this.setState({
                openType: 3,
                title:'新建承运商'
            })
            //console.log('新建')
        }
        this.setState({
            ...Object.assign({}, d.data),
            historyData: historyData,
            open: true,
            edit: d.edit
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
        let { historyData } = this.state
        const { parent } = this.props
        if (!historyData) return
        if (parent && parent.tableView)
        parent.tableView.updateData(Object.assign({}, historyData, d))
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
            areaName: null, //所属片区名称
            associatePaymentCarrierId: 0, //关联付款承运商id
            payDefaultdata: [], //关联付款承运商类型数据
            carCount: 0, //车辆数
            checkAccountPeriod: 0, //对账周期
            cooperateStatus: 0, //合作状态
            cooperateStatusName: null, //合作状态对应名
            cooperatedata: [], //合作状态数据
            customer: null, //服务客户
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

    saveSubmit = () => {
        let { rApi } = this.props
        let contacts = this.contacts.logData()
        let ads = this.selectAddress.getValue()
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
            contractNo // 合同编号
            } = this.state
        //let addre = this.selectAddress.getValue()
        // console.log('selectAddress', addre)
        // return false
        if(!ads || !ads.pro || ads.pro === '') {
            message.error('公司地址不能为空!')
            return
        }
        if(!contacts || contacts.length === 0) {
            message.error('承运商联系人不能为空!')
            return
        }
        if(this.state.openType === 1) {
            if((type && type === '无车承运人') || (type && type === '信息部(黄牛)')) {
                    mainBusiness= null
                    serviceIndustry= null
                    staffCount= null
                    carCount= null
                    customer= null
            }
            if(cooperateStatusName === '开发中') {
                    startCooperateTime = null
                    endCooperateTime = null
                    openAccountBank = null
                    payee = null
                    payeeAccount = null
                    checkAccountPeriod = null
                    mainBusiness= null
                    serviceIndustry= null
                    staffCount = null
                    carCount = null
                    customer = null
                    uploadFileVo = []
                    contractNo = null
            }
            this.setState({
                buttonLoading: true
            })
            rApi.editCarrier({
               // ...dynamictableData,
                id: itemId,
                name: name,
                abbreviation: abbreviation,
                code: code,
                type: type,
                address: this.selectAddress.getValue(),
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
                removeAttachmentIds: []
            }).then(d => {
                this.changeOpen(false)
                message.success('操作成功')
                this.setState({
                    buttonLoading: false
                }, () => {
                    this.updateThisDataToTable({
                       // ...dynamictableData,
                        id: itemId,
                        name: name,
                        abbreviation: abbreviation,
                        code: code,
                        type: type,
                        address: this.selectAddress.getValue(),
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
                        mainBusinesses: mainBusiness,
                        openAccountBank: openAccountBank,
                        payee: payee,
                        payeeAccount: payeeAccount,
                        remark: remark,
                        serviceIndustries: serviceIndustry,
                        staffCount: staffCount,
                        carrierContacts: contacts,
                        carrierLabels: carrierLabel,
                        uploadFileVo,
                        contractNo,
                        removeAttachmentIds: []
                    })
                })
                // this.actionDone()
            }).catch(e => {
                message.error(e.msg || '操作失败！')
                this.setState({
                    buttonLoading: false
                })
            })
        } else if(this.state.openType === 2) {
            this.changeOpen(false)
        } else if(this.state.openType === 3) {
            let  addre = this.selectAddress.getValue()
            this.setState({
                buttonLoading: true
            })
            rApi.addCarrier({
                //...dynamictableData,
                name: name,
                abbreviation: abbreviation,
                code: code,
                type: type,
                address: this.selectAddress.getValue(),
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
                removeAttachmentIds: []
            }).then(d => {
                this.setState({
                    buttonLoading: false
                })
                this.actionDone()
            }).catch(e => {
                message.error(e.msg || '操作失败！')
                this.setState({
                    buttonLoading: false
                })
            })
        }
    }

    onSubmit = () => {
        //e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            //console.log('Received values of form: ', values);
            this.saveSubmit()
          }
        });
    }
    
    changedemo = (time) => {
        // console.log('time',moment(time).format('YYYY-MM-DD h:mm:ss'))
    }
    getSelectAddress = (d) => {
        this.selectAddress = d
    }
    onChageProvince = (value) => {
        let { rApi } = this.props
        if (value && value.id) {
            rApi.getAreaByAddress(value).then(res => {
                // console.log('area',res)
                this.setState({
                    areaName: res.map(item => item.title).join(',')
                })
            })
        } else {
            this.setState({areaName: ''})
        }
    }
    handleChangeService = (value) => {  //服务行业
        this.setState({serviceIndustry : value.map((item) => {
            let obj = {dictionaryId: item.id, dictionaryName: item.title}
            return obj
        })})
        //console.log('handleChangeService', value)
        
    }
    handleChangeBusiness = (value) => { //主营业务
        this.setState({mainBusiness : value.map((item) => {
            let obj = {dictionaryId: item.id, dictionaryName: item.title}
            return obj
        })})
        //console.log('handleChangeBusiness', value)
    }
    
    handleChangeTag = (value) => { //承运商标签
        this.setState({carrierLabel : value.map((item) => {
            let obj = {dictionaryId: item.id, dictionaryName: item.title}
            return obj
        })})
    }

    stringVulToArrayVul = (d) => { //字符串转数组
        if(d) {
            return d.split(',')
        }
        return null
    }

    arrayVulToStringVul = (d) => { //数组转字符串
        if(d) {
            return d.join(',')
        } return null
    }

    handleChangeInput = (value) => { //主要客户
        if(value !== ''){
            this.setState({
                customer: this.arrayVulToStringVul(value)
            })
        }
    }
    getCode = (d) => {
        clearTimeout(this.timer)
        if (d && d !== '') {
            this.timer = setTimeout(() => {
                this.props.rApi.generateCode({
                    keyword: d
                }).then((res) => {
                    this.setState({
                        code: res
                    })
                }).catch(e => {
                    message.error(e.msg || '获取代码失败')
                })
            }, 1000)
        }
    }

    // disableSubmit = () => { //拉黑
    //     let { itemId, status } = this.state
    //     this.props.rApi.onDisable({
    //         id: itemId
    //     }).then(d => {
    //         this.setState({
    //             status: -2
    //         }, () => {
    //             this.updateThisDataToTable({status: this.state.status})
    //         })
    //         message.success('操作成功！')
    //     }).catch(e => {
    //         message.error(e.msg || '操作失败')
    //     })
    // }

    // enableSubmit = () => { // 取消拉黑
    //     let { itemId, status } = this.state
    //     this.props.rApi.oneEnable({
    //         id: itemId
    //     }).then(d => {
    //         this.setState({
    //             status: 1
    //         }, () => {
    //             this.updateThisDataToTable({status: this.state.status})
    //         })
    //         message.success('操作成功！')
    //     }).catch(e => {
    //         message.error(e.msg || '操作失败')
    //     })
    // }

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

    // getCarrierFileName = (value) => {
    //     this.setState({
    //         uploadFileVo: [value]
    //     })
    // }

    // getLoadingVal = (value) => {
    //     this.setState({
    //         loading: value
    //     })
    // }

    changeStartTime = (date, dateStr) => {
        this.setState({
            startCooperateTime: dateStr
        })
    }

    changeEndTime = (date, dateStr) => {
        this.setState({
            endCooperateTime: dateStr
        })
    }


    render() { 
        const { edit } = this.props
        const { getFieldDecorator, setFieldsValue } = this.props.form
        let { 
            openType,
            quotationLines,
            title,
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
            mainBusinessData,
            serviceIndustryData,       
            staffCount,
            contacts,
            carrierTagData,
            associatePayShow,
            companyShow,
            cooperateShow,
            payTypedata,
            payDefaultdata,
            ifDisable,
            status,
            uploadFileVo, //上传文件路径
            checkFileUrl, //查看附件
            contractNo,
            loading,
            id,
            buttonLoading,
            transportModeBusinessModes,
            itemId
        } = this.state
            // if (!this.state.open) {
            //     return null
            // }
        //console.log('customer', ifDisable, status, openType)
        // let getPopupContainer = () => document.querySelector('.custom-modal-content')
        return (
            <ModalWraper
                onSubmit={this.onSubmit}
                style={{width: '95%', maxWidth: 1000}}
                changeOpen={this.changeOpen} 
                open={this.state.open} 
                title={title} 
                haveFooter={openType === 2 ? false : true}
                footerText="保存"
                loading={buttonLoading}
                getContentDom={v => this.popupContainer = v}
                >
                <div className="carrier-wrapper">
                    <Form layout='inline'>
                        {/* <ModalWraper.Header title=''>
                            {
                                ((openType === 1 && !status) || (openType === 1 && status === 1))?
                                <FunctionPower power={power.ON_DISABLE}>
                                    <Button icon='user-add' onClick={this.disableSubmit} style={{ marginRight: '10px' }}>
                                        拉黑
                                    </Button>
                               </FunctionPower>
                                :
                                (openType === 1 && status === -2) ?
                               <FunctionPower power={power.ON_ENABLE}>
                                    <Button icon='user-delete' onClick={this.enableSubmit} style={{ marginRight: '10px' }}>
                                        取消拉黑
                                    </Button>
                                </FunctionPower> 
                                :
                                null
                            }
                            {
                                openType === 1 || openType === 3 ? 
                                <FormItem>
                                    <Button 
                                        // icon='save' 
                                        htmlType="submit" 
                                        style={{ marginRight: 0, border: 0, borderRadius: 0, color: '#fff', background: '#18B583' }}
                                        loading={buttonLoading}
                                    >
                                        保存
                                    </Button>
                                </FormItem>
                                : 
                                null
                            }
                        </ModalWraper.Header> */}
                        <div style={{display:'flex', padding: '0 20px'}}>
                            <div style={{ margin: 'auto',flex:'1'}}>
                                <div className="block-common-style">
                                    <div className="block-title">基本信息</div>
                                    <Row gutter={24} type={openType}>
                                        <Col label="承运商名称&emsp;" colon span={7} isRequired text={name}>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('name', {
                                                        initialValue: name,
                                                        rules: [
                                                            { 
                                                                required: true, 
                                                                message: '请填写承运商名称'
                                                            }
                                                        ],
                                                    })(
                                                        <Input 
                                                            placeholder="" 
                                                            onChange={e => {
                                                                this.getCode(e.target.value)
                                                                this.setState({name: e.target.value})
                                                            }
                                                        }
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={24} type={openType}>
                                        <Col label="承运商简称&emsp;" colon span={7} isRequired text={abbreviation}>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('abbreviation', {
                                                        initialValue: abbreviation,
                                                        rules: [
                                                            { 
                                                                required: true, 
                                                                message: '请填写承运商简称'
                                                            }
                                                        ],
                                                    })(
                                                        <Input 
                                                            placeholder="" 
                                                            onChange={e => {
                                                                this.setState({abbreviation: e.target.value})
                                                            }}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={24} type={openType}>
                                        <Col label="承运商代码&emsp;" colon span={7} text={code}>
                                            <Input 
                                                value={code}
                                                disabled 
                                                placeholder="自动识别" 
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={24} type={openType}>
                                        <Col span={16} label="公司地址&emsp;&emsp;" colon  text={addressdata ? addressFormat(addressdata) : ''} isRequired>
                                            <SelectAddressNew 
                                                onChageProvince={this.onChageProvince}
                                                getPopupContainer={() => this.popupContainer || document.body}
                                                address={addressdata ? addressdata : ''}
                                                getThis={this.getSelectAddress} 
                                                //defaultValue={addressdata}
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={24} type={openType}>
                                        <Col label="所属片区&emsp;&emsp;" colon span={7} text={areaName ? areaName : '无'}>
                                            <Input 
                                                disabled 
                                                placeholder="自动识别"
                                                title={areaName ? areaName : null} 
                                                value={areaName ? areaName : null} 
                                                />
                                        </Col> 
                                    </Row>
                                    <Row gutter={24} type={openType}>
                                        <Col label="承运商类型&emsp;" colon span={7} text={type} isRequired>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('type', {
                                                        initialValue: type,
                                                        rules: [
                                                            { 
                                                                required: true, 
                                                                message: '请填写承运商名称'
                                                            }
                                                        ],
                                                    })(
                                                        <RemoteSelect
                                                            defaultValue={type && carrierTypeData[type] ? {id: carrierTypeData[type], title: type} : null}
                                                            placeholder={''}
                                                            getPopupContainer={() => this.popupContainer || document.body}
                                                            onChangeValue={
                                                                value => {
                                                                    this.setState({type: value ? value.title || value.name : ''})
                                                                    if((value && value.title === '运作承运商') || (value && value.name === '运作承运商') || (value && value.title === '无车承运人') || (value && value.name === '无车承运人') || (value && value.name === '信息部(黄牛)') || (value && value.title === '信息部(黄牛)') || !value || value === '') {
                                                                        this.setState({associatePayShow: false})
                                                                    } else{
                                                                        this.setState({associatePayShow: true})
                                                                    } 
                                                                    if((value && value.title === '无车承运人') || (value && value.name === '无车承运人') || (value && value.name === '信息部(黄牛)') || (value && value.title === '信息部(黄牛)') || !value || value === ''){
                                                                        this.setState({companyShow: false})
                                                                    } else{
                                                                        this.setState({companyShow: true})
                                                                    }
                                                                    //this.setState({type: value.title})
                                                                }
                                                        } 
                                                            filterField='id' 
                                                            labelField='title' 
                                                            list={typedata}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        {/* <Col  label="管辖所属" span={7} text={jurisdictionName}>
                                            <RemoteSelect
                                                defaultValue={jurisdictionId && jurisdictionName ? {id: jurisdictionId, title: jurisdictionName} : null}
                                                placeholder={''}
                                                onChangeValue={
                                                    value => this.setState({
                                                        jurisdictionId: value.id,
                                                        jurisdictionName: value.title
                                                    })
                                            } 
                                                filterField='id' 
                                                labelField='title' 
                                                list={[]}
                                            />
                                        </Col> */}
                                        {/* <Col  span={8} /> */}
                                    </Row>
                                </div>
                                {
                                    companyShow === true ? 
                                    <div className="block-common-style">
                                        <div className="block-title">公司规模</div>
                                        <Row gutter={24} type={openType}>
                                            <Col label="服务行业&emsp;&emsp;" colon span={24} text={serviceIndustryData ? serviceIndustryData.map(item => {
                                                return item.title
                                            }).join(' / ') : null} contentStyle={{whiteSpace: 'normal'}}>
                                                <SelectMulti
                                                    defaultValue= {serviceIndustryData ? serviceIndustryData : []}
                                                    getPopupContainer={() => this.popupContainer || document.body}
                                                    text='客户行业' 
                                                    handleChangeSelect={this.handleChangeService}
                                                    />
                                            </Col>
                                        </Row>
                                        <Row gutter={24} type={openType}>
                                            <Col label="主营业务&emsp;&emsp;" colon span={24}  text={mainBusinessData ? mainBusinessData.map(item => {
                                                return item.title
                                            }).join(' / ') : null} contentStyle={{whiteSpace: 'normal'}}>
                                                <SelectMulti
                                                    defaultValue= { mainBusinessData ? mainBusinessData : []}
                                                    getPopupContainer={() => this.popupContainer || document.body}
                                                    text='业务类型' 
                                                    handleChangeSelect={this.handleChangeBusiness} 
                                                    />
                                            </Col>
                                        </Row>
                                        <Row gutter={24} type={openType}>
                                            <Col  label="公司人数&emsp;&emsp;" colon span={5} text={staffCount} >
                                                <InputNumber 
                                                        min={0}
                                                        title={staffCount}
                                                        defaultValue={staffCount ? parseInt(staffCount) : null}
                                                        placeholder="" 
                                                        onChange={value => {
                                                            this.setState({staffCount: value ? parseInt(value) : null
                                                            })
                                                        }}
                                                />
                                            </Col>
                                            <Col  label="车辆数&emsp;&emsp;" colon span={5} text={carCount} >
                                                <InputNumber 
                                                        min={0}
                                                        title={carCount}
                                                        defaultValue={carCount ? parseInt(carCount) : null}
                                                        placeholder="" 
                                                        onChange={value => {
                                                            this.setState({carCount: value ? parseInt(value) : null
                                                            })
                                                    }}
                                                />
                                            </Col>
                                            <Col span={11} />
                                        </Row>
                                        <Row gutter={24} type={openType}>
                                            <Col  label="服务客户&emsp;&emsp;" colon span={24} text={customer} contentStyle={{whiteSpace: 'normal'}}>
                                                {/* <SelectMulti
                                                    defaultValue= {[]}
                                                    list={[]}
                                                    params={{}}
                                                    handleChangeSelect={this.handleChangeSelect} 
                                                    /> */}
                                                    <MultiInputButton 
                                                        getPopupContainer={() => this.popupContainer || document.body}
                                                        defaultValue= {this.stringVulToArrayVul(customer)}
                                                        handleChangeInput={this.handleChangeInput} 
                                                    />
                                            </Col>
                                        </Row>
                                    </div>
                                    :
                                    null
                                }
                                <div className="block-common-style">
                                    <div className="block-title">合作信息</div>
                                    <Row gutter={24}  type={openType}>
                                        <Col isRequired label="合作状态&emsp;&emsp;" colon span={5} text={cooperateStatusName ? cooperateStatusName : null}>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('cooperateStatus', {
                                                       // initialValue: cooperateStatus,
                                                        rules: [
                                                            { 
                                                                required: true, 
                                                                message: '请选择合作状态'
                                                            }
                                                        ],
                                                    })(
                                                        <RemoteSelect 
                                                            style={{width: '100px'}}
                                                            defaultValue={cooperatedata ? cooperatedata : []}
                                                            getPopupContainer={() => this.popupContainer || document.body}
                                                            onChangeValue={value => {
                                                                this.setState({
                                                                    cooperateStatus: value ? value.id : '',
                                                                    cooperateStatusName: value ? value.title : ''
                                                                })
                                                                if((value && value.title === '开发中') || (value && value.name === '开发中') || !value || value === '') {
                                                                    this.setState({
                                                                        cooperateShow: false,
                                                                        // companyShow: false
                                                                    })
                                                                } else {
                                                                    this.setState({
                                                                        cooperateShow: true,
                                                                        // companyShow: true
                                                                    })
                                                                }
                                                            }}
                                                            text="合作状态" 
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        {
                                            cooperateShow === true ? 
                                            <Col label="合作周期&emsp;&emsp;" colon span={9} text={(startCooperateTime && endCooperateTime) ? `${moment(startCooperateTime).format('YYYY-MM-DD')} 至 ${moment(endCooperateTime).format('YYYY-MM-DD')}` : '无'}>
                                                {/* <RangePicker
                                                    defaultValue={startCooperateTime && endCooperateTime ? [moment(startCooperateTime ), moment(endCooperateTime)] : null}
                                                    // showTime
                                                    format="YYYY-MM-DD"
                                                    onChange={
                                                        (data, dateString) => {
                                                            this.setState({
                                                                startCooperateTime: dateString ? dateString[0] : null,
                                                                endCooperateTime: dateString ? dateString[1] : null
                                                            })
                                                        }
                                                    }
                                                /> */}
                                                <TimePicker
                                                    startTime={startCooperateTime}
                                                    endTime={endCooperateTime}
                                                    changeStartTime={this.changeStartTime}
                                                    changeEndTime={this.changeEndTime}
                                                    getFieldDecorator={getFieldDecorator}
                                                    getPopupContainer={() => this.popupContainer || document.body}
                                                    // isRequired
                                                    pickerWidth={{width: 120}}
                                                />
                                            </Col> 
                                            : 
                                            null                                    
                                        }
                                        {
                                            cooperateShow === true ? 
                                            <Col span={7} label="对账周期&emsp;&emsp;" colon text={checkAccountPeriod === -1 ? '自然月' : checkAccountPeriod > 0 ? `${checkAccountPeriod}号` : null}>
                                                <div style={{width: 150}}>
                                                    <RemoteSelect 
                                                        defaultValue={
                                                            checkAccountPeriod ? {
                                                                id: checkAccountPeriod, 
                                                                name: checkAccountPeriod === -1 ? 
                                                                '自然月' 
                                                                : 
                                                                checkAccountPeriod > 0 ? 
                                                                `${checkAccountPeriod}号` 
                                                                : 
                                                                ''
                                                            } 
                                                            : 
                                                            null}
                                                        getPopupContainer={() => this.popupContainer || document.body}
                                                        placeholder={''}
                                                        onChangeValue={value => {
                                                            if(value && value !== ''){
                                                                this.setState({checkAccountPeriod: value.id})
                                                            }
                                                        }}
                                                        labelField='name'
                                                        list={dateSelectData()}
                                                        >
                                                    </RemoteSelect>
                                                </div>
                                            </Col> 
                                            : 
                                            null
                                        }
                                        {/* <Col span={1} /> */}
                                    </Row>
                                    {
                                    cooperateShow === true ? 
                                    <Row gutter={24} type={openType}>
                                        <Col label="收款人&emsp;&emsp;&emsp;" colon span={5} text={payee}>
                                            <Input 
                                                defaultValue={payee ? payee : ''}
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({payee: e.target.value
                                                    })}}
                                            />
                                        </Col>
                                        <Col label="开户行&emsp;&emsp;&emsp;" colon span={9} text={openAccountBank} >
                                            <Input 
                                                defaultValue={openAccountBank ? openAccountBank : ''}
                                                style={{width: 180}}
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({openAccountBank: e.target.value
                                                })}}
                                            />
                                        </Col>
                                        <Col label="收款账号&emsp;&emsp;" colon span={7} text={payeeAccount} >
                                            <FormItem>
                                                {
                                                    getFieldDecorator('payeeAccount', {
                                                        initialValue: payeeAccount,
                                                        rules: [
                                                            {
                                                                validator: validateToNextCar
                                                            }
                                                        ],
                                                    })(
                                                        <Input 
                                                            placeholder="" 
                                                            onChange={e => {
                                                                this.setState({payeeAccount: e.target.value})
                                                            }}
                                                        />
                                                    )
                                                }
                                                </FormItem>
                                        </Col>
                                        {/* <Col span={1} /> */}
                                    </Row> 
                                    :
                                    ''
                                }
                                {
                                    cooperateShow === true ?
                                    <Row gutter={24}  type={openType}>
                                        <Col label="合同编号&emsp;&emsp;" colon span={7} text={contractNo} >
                                            <div className='flex flex-vertical-center'>
                                                <div style={{marginRight: 5}}>
                                                    <Input 
                                                        // disabled={true}
                                                        // placeholder="自动生成"
                                                        title={contractNo}
                                                        value={contractNo ? contractNo : ''}
                                                        onChange={ e => this.setState({contractNo: e.target.value}) }
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    :
                                    null
                                }
                                {
                                    cooperateShow === true ?
                                    // <Row gutter={24} type={openType}>
                                    //     <Col span={16} label="合同附件&emsp;&emsp;" colon text={checkFileUrl ? <a href={checkFileUrl} style={{color: 'blue'}} target="_blank">查看附件</a> : '无'}>
                                    //         {
                                    //             status === -2 ?
                                    //             null
                                    //             :
                                    //             loading === true ?
                                    //             <Spin spinning={loading} />
                                    //             :
                                    //             <UploaderFile 
                                    //                 getFileNameKey={this.getCarrierFileName} 
                                    //                 getLoadingVal={this.getLoadingVal}
                                    //             />
                                    //         }
                                    //         &emsp;
                                    //         {
                                    //             uploadFileVo.length > 0 ?
                                    //             <span title={uploadFileVo[0].fileName}>{uploadFileVo[0].fileName}</span>
                                    //             :
                                    //             checkFileUrl ?
                                    //             <a href={checkFileUrl} style={{color: 'blue'}} target="_blank">查看附件</a>
                                    //             :
                                    //             null
                                    //         }
                                    //     </Col>
                                    // </Row>
                                    <div className="flex" style={{margin: '5px 0'}}>
                                        <div style={{width: 84, color: 'rgb(136, 136, 136)'}}>合同附件</div>
                                        <div className="felx1" style={{minWidth: '300px'}}>
                                            <MultipleFileUpload 
                                                type={( status === -2 || openType === 2) ? 2 : null}
                                                getFileDetail={this.getFileDetail}
                                                fileList={checkFileUrl}
                                            />
                                        </div>
                                    </div>
                                    :
                                    null
                                }
                                {
                                     cooperateShow && associatePayShow === true ? 
                                    <Row gutter={24} type={openType}>
                                        <Col span={7} label="付款承运商&emsp;" colon text={(payDefaultdata && payDefaultdata.length) > 0 ? payDefaultdata[0].name : null}>
                                            <div style={{width: 125}}>
                                                <RemoteSelect
                                                    defaultValue={payDefaultdata ? payDefaultdata[0] : ''}
                                                    getPopupContainer={() => this.popupContainer || document.body}
                                                    //placeholder={'合作状态'}
                                                    onChangeValue={
                                                        value => {
                                                            this.setState({
                                                                associatePaymentCarrierId: value ? value.id : ''
                                                            })
                                                        }
                                                    } 
                                                    getDataMethod={'getCanDrawABill'}
                                                    labelField={'name'}
                                                    
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    :
                                    null
                                }
                                <Row gutter={24} type={openType}>
                                    <Col label="承运商标签&emsp;" colon span={24} text={carrierTagData ? carrierTagData.map(item => {
                                        return item.title
                                    }).join('/') : null}>
                                        <SelectMulti
                                            defaultValue= {carrierTagData ? carrierTagData : []}
                                            getPopupContainer={() => this.popupContainer || document.body}
                                            text='承运商标签' 
                                            handleChangeSelect={this.handleChangeTag}
                                            />
                                    </Col>
                                </Row>
                                </div>
                            </div>
                        </div>
                        <div className="contacts-wrapper" style={{padding: '5px 20px'}}>
                            <Contacts 
                                data={contacts} 
                                //ref='contacts'
                                getThis={(v) => this.contacts = v}
                                type={openType}
                                carrierId={itemId}
                                power={power}
                            />
                        </div>
                    </Form>
                    {/* <DynamicTable getThis={v => this.dynamictable = v} tableTitle='路线报价' tabsTitle='报价类型' /> */}
                         {/* <Tabs onChange={this.callback} type="card" style={{padding: '10px'}}>
                            <TabPane forceRender tab="承运商联系人" key="承运商联系人" style={{padding: '0 10px'}}>
                                <Contacts 
                                    data={contacts} 
                                    //ref='contacts'
                                    getThis={(v) => this.contacts = v}
                                    type={openType}
                                />
                            </TabPane> */}
                            {/* <TabPane forceRender tab="参考报价" key="参考报价">
                                <DynamicTable 
                                    type={openType}
                                    id={id}
                                    getThis={v => this.dynamictable = v}
                                    getDataUrl={'resource/carrier/exportData'}
                                    xmlTitle={code}
                                    // carrierQuotationLineVehicle={carrierQuotationLineVehicle}
                                    // carrierQuotationLineLtl={carrierQuotationLineLtl}
                                    // carrierQuotationLineExpress={carrierQuotationLineExpress}
                                    quotationLines={quotationLines}
                                    tableTitle='路线报价' 
                                    tabsTitle='报价类型' 
                                />
                            </TabPane> */}
                        {/* </Tabs> */}

                </div>
            </ModalWraper>
        )
    }
}
 
export default Form.create()(AddOrEdit);