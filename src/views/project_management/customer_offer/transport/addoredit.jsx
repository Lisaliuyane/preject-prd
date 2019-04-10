import React, { Component, Fragment } from 'react'
import Modal from '@src/components/modular_window'
import DynamicTable from '@src/components/dynamic_table1'
import RemoteSelect from '@src/components/select_databook'
import { Row, Col } from '@src/components/grid'
import { inject } from "mobx-react"
import { children, id } from './power'
import moment from 'moment'
import { cloneObject, objDeepCopy } from '@src/utils'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { DatePicker, Checkbox, Form, Input, Button, message, Popconfirm, InputNumber, Radio } from 'antd'
import TextAreaBox from '@src/components/textarea'
import FormItem from '@src/components/FormItem'
// import TransModal from './TransModal'
import ModeOfTransport from '@src/components/dynamic_table1/mode_of_transport'
import TimePicker from '@src/components/time_picker'

const power = Object.assign({}, children, id)
const { RangePicker } = DatePicker
const RadioGroup = Radio.Group
/** 
 * 付款条件
*/
const PAYMENT_TERMS = {
    0: '现金结',
    1: '回单结',
    2: '单票结',
    3: '月结',
    4: '见票结',
    5: '每周结'
}

/** 
 * 延期条款
*/
const EXTENSION_DATE = {
    0: '有限延期',
    1: '无限延期'
}


@inject('rApi', 'mobxDataBook')
class AddOrEdit extends Component {

    state = {
        open: false,
        //type: null,
        id: null,
        clientCode: null, //客户代码
        clientId: 0, //客户id
        clientLegalId: 0, //客户法人id
        clientLegalName: null, //客户法人名称
        clientName: null, //客户名称
        currencyId: 0, //币种id
        currencyName: null, //币种
        clientQuotationTransportVos: [], //报价类型
        days: null, //结算天数
        demandId: 0, //需求id
        demandName: null, //需求名称
        effectiveDate: null, //生效日期
        expirationDate: null, //截止日期
        extensionMonths: 1, //延期月份数
        extensionTerms: 0, //延期条款 0-有限延期 1-无限延期
        freeWarehousePeriod: 0, //免仓期
        isTextsIncluded: 0, //是否含税 0-不含税 1-含税
        paymentTerms: null, //付款条件 0-月结 1-见票 2-现金 3-回单 4-单票 5-每周
        quotationNumber: null, //报价单号
        remark: null, //备注
        taxes: null, //发票税
        withholdingTax: null, //补扣税
        clientQuotationType: 1, //客户报价类型 1-客户运输报价 2-客户仓储报价
        warehouseId: 0, //仓库id
        warehouseName: null, //仓库名称
        reviewStatus: null, //审核状态 1-已保存 2-已提交 3-驳回 4-审核通过  5-已生效 6-已失效
        historyData: null, // 传入数据
        buttonLoading: false,
        transModalVisible: false, //是否显示运输方式弹窗
        costUsages: [], //费用用途
        transportTypeList: [], //运输方式
        backupTransportTypeList: [], //备份运输方式数据
        backupCheckedTransport: [], //备份当前已选中数据
        checkedTransport: [], //当前已选中运输方式数组
        checkedTransportData: [], //当前已选中运输方式数据
        transportModeBusinessModes: [],
        quoTationLoading: false, //报价loading
        reLoadWithholdingTax: false, //reload 补扣税
        billingType: 2 //开票类型
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        this.getTransportType()
    }
    
    changeOpen = (state) => {
        this.setState({
            open: state
        })
        if (!state) {
            this.clearValue()
        }
    }


    getOpenStatus = () => {
        let { open, type } = this.state
        return {
            open: open,
            type: type
        }
    }

    
    show = (d) => {
        let historyData = typeof d.data === 'object' ? cloneObject(d.data) : null
        let {
            clientQuotationTransportVos
        } = this.state
        if (d.edit) {
            d.data = Object.assign({}, d.data, {
                type: 1,
                title: '编辑客户运输报价',
                clientQuotationTransportVos: d.data.clientQuotationTransports
            })
        } else if(d.data && d.data.key === '应收报价预估') {
            d.data = Object.assign({}, d.data, {
                type: 1,
                title: '编辑客户运输报价',
                demandId: d.data.demandId, //需求id
                demandName: d.data.demandName, //需求名称
            })
        } else if (d.data) {
            d.data = Object.assign({}, d.data, {
                type: 2,
                title: '查看客户运输报价',
                clientQuotationTransportVos: d.data.clientQuotationTransports
            })
        } else {
            d.data = {type: 3,  title: '新建客户运输报价', ...d.data}
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
        let { historyData } = this.state
        const { parent } = this.props
        if (!historyData) return
        if (parent && parent.tableView)
        parent.tableView.updateData(Object.assign({}, historyData, d))
    }

    clearValue() {
        this.setState({
            id: null,
            clientCode: null, //客户代码
            clientId: 0, //客户id
            clientLegalId: 0, //客户法人id
            clientLegalName: null, //客户法人名称
            clientName: null, //客户名称
            currencyId: 0, //币种id
            currencyName: null, //币种
            clientQuotationTransportVos: [], //报价类型
            days: null, //结算天数
            demandId: 0, //需求id
            demandName: null, //需求名称
            effectiveDate: null, //生效日期
            expirationDate: null, //截止日期
            extensionMonths: 0, //延期月份数
            extensionTerms: 0, //延期条款 0-有限延期 1-无限延期
            freeWarehousePeriod: 0, //免仓期
            isTextsIncluded: 0, //是否含税 0-不含税 1-含税
            paymentTerms: null, //付款条件 0-月结 1-见票 2-现金 3-回单 4-单票 5-每周
            quotationNumber: null, //报价单号
            remark: null, //备注
            taxes: null, //发票税
            withholdingTax: null, //补扣税
            billingType: 2, //开票类型
            clientQuotationType: 1, //客户报价类型 1-客户运输报价 2-客户仓储报价
            warehouseId: 0, //仓库id
            warehouseName: null, //仓库名称
            reviewStatus: null, //审核状态 1-已保存 2-已提交 3-驳回 4-审核通过  5-已生效 6-已失效
            buttonLoading: false,
            backupTransportTypeList: [], //备份运输方式数据
            backupCheckedTransport: [], //备份当前已选中数据
            checkedTransport: [], //当前已选中运输方式数组
            checkedTransportData: [], //当前已选中运输方式数据
            transportModeBusinessModes: [],
            reLoadWithholdingTax: false //reload 补扣税
        })
    }
    

     /**
     * 提交
     * 
     * 
     * @memberOf AddOrEdit
     */
    onSubmit = () => {
        let {
            id,
            clientCode, //客户代码
            clientId, //客户id
            clientLegalId, //客户法人id
            clientLegalName, //客户法人名称
            clientName, //客户名称
            currencyId, //币种id
            currencyName, //币种
            days, //结算天数
            demandId, //需求id
            demandName, //需求名称
            effectiveDate, //生效日期
            expirationDate, //截止日期
            extensionMonths, //延期月份数
            extensionTerms, //延期条款 0-有限延期 1-无限延期
            isTextsIncluded, //是否含税 0-不含税 1-含税
            paymentTerms, //付款条件 0-月结 1-见票 2-现金 3-回单 4-单票 5-每周
            quotationNumber, //报价单号
            remark, //备注
            taxes, //发票税
            withholdingTax, //补扣税
            billingType
        } = this.state
        let quotationLines = this.modeTransport.getValues()
        this.editSave().then(res => {
            this.props.rApi.clientQuotationSubmit({
                id
            }).then(d => {
                this.setState({
                    reviewStatus: 2
                }, () => {
                    this.updateThisDataToTable({
                        ...quotationLines,
                        id,
                        clientCode, //客户代码
                        clientId, //客户id
                        clientLegalId, //客户法人id
                        clientLegalName, //客户法人名称
                        clientName, //客户名称
                        currencyId, //币种id
                        currencyName, //币种
                        days, //结算天数
                        demandId, //需求id
                        demandName: demandName, //需求名称
                        effectiveDate, //生效日期
                        expirationDate, //截止日期
                        extensionMonths, //延期月份数
                        extensionTerms, //延期条款 0-有限延期 1-无限延期
                        isTextsIncluded, //是否含税 0-不含税 1-含税
                        paymentTerms, //付款条件 0-月结 1-见票 2-现金 3-回单 4-单票 5-每周
                        quotationNumber, //报价单号
                        remark, //备注
                        taxes, //发票税
                        withholdingTax: (isTextsIncluded === 1 && !withholdingTax) ? 0 : withholdingTax, //补扣税
                        billingType,
                        clientQuotationType: 1, //客户报价类型 1-客户运输报价 2-客户仓储报价
                        transportModeBusinessModes: res,
                        reviewStatus: this.state.reviewStatus
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
        let {
            id,
            clientCode, //客户代码
            clientId, //客户id
            clientLegalId, //客户法人id
            clientLegalName, //客户法人名称
            clientName, //客户名称
            currencyId, //币种id
            currencyName, //币种
            days, //结算天数
            demandId, //需求id
            demandName, //需求名称
            effectiveDate, //生效日期
            expirationDate, //截止日期
            extensionMonths, //延期月份数
            extensionTerms, //延期条款 0-有限延期 1-无限延期
            isTextsIncluded, //是否含税 0-不含税 1-含税
            paymentTerms, //付款条件 0-月结 1-见票 2-现金 3-回单 4-单票 5-每周
            quotationNumber, //报价单号
            remark, //备注
            taxes, //发票税
            withholdingTax, //补扣税
            billingType,
            transportModeBusinessModes
        } = this.state
        let quotationLines = this.modeTransport.getValues()
        let data = {
            ...quotationLines,
            id,
            clientCode, //客户代码
            clientId, //客户id
            clientLegalId, //客户法人id
            clientLegalName, //客户法人名称
            clientName, //客户名称
            currencyId, //币种id
            currencyName, //币种
            days, //结算天数
            demandId, //需求id
            demandName, //需求名称
            effectiveDate, //生效日期
            expirationDate, //截止日期
            extensionMonths, //延期月份数
            extensionTerms, //延期条款 0-有限延期 1-无限延期
            isTextsIncluded, //是否含税 0-不含税 1-含税
            paymentTerms, //付款条件 0-月结 1-见票 2-现金 3-回单 4-单票 5-每周
            quotationNumber, //报价单号
            remark, //备注
            taxes, //发票税
            withholdingTax: (isTextsIncluded === 1 && !withholdingTax) ? 0 : withholdingTax, //补扣税
            billingType,
            transportModeBusinessModes
        }
        this.props.rApi.clientQuotationExaminePass({
            id
        }).then(d => {
            this.setState({
                reviewStatus: 4
            }, () => {
                this.updateThisDataToTable({
                    ...data,
                    reviewStatus: this.state.reviewStatus
                })
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
    toExamineCancelPass = () => {
        let { id } = this.state
        this.props.rApi.clientQuotationCancelExaminePass({
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
     * 审核驳回
     * 
     * 
     * @memberOf AddOrEdit
     */
    toExamineReject = () => {
        let { id, reason } = this.state
        this.props.rApi.clientQuotationExamineReject({
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
            type,
            open,
            id,
            clientCode, //客户代码
            clientId, //客户id
            clientLegalId, //客户法人id
            clientLegalName, //客户法人名称
            clientName, //客户名称
            currencyId, //币种id
            currencyName, //币种
            days, //结算天数
            demandId, //需求id
            demandName, //需求名称
            effectiveDate, //生效日期
            expirationDate, //截止日期
            extensionMonths, //延期月份数
            extensionTerms, //延期条款 0-有限延期 1-无限延期
            isTextsIncluded, //是否含税 0-不含税 1-含税
            paymentTerms, //付款条件 0-月结 1-见票 2-现金 3-回单 4-单票 5-每周
            quotationNumber, //报价单号
            remark, //备注
            taxes, //发票税
            withholdingTax, //补扣税
            billingType,
            reviewStatus
        } = this.state
        const { rApi } = this.props
        // if (!isTextsIncluded) {
        //     taxes = null
        // }
        if(!paymentTerms || paymentTerms === 0 || paymentTerms === 1 || paymentTerms === 2){
            days = null
        }
        this.setState({
            buttonLoading: true
        })
        if (type === 2) {
            return
        } else if (type === 3) {
                rApi.addClientQuotation({
                    ...quotationLines,
                    clientCode, //客户代码
                    clientId, //客户id
                    clientLegalId, //客户法人id
                    clientLegalName, //客户法人名称
                    clientName, //客户名称
                    currencyId, //币种id
                    currencyName, //币种
                    days, //结算天数
                    demandId, //需求id
                    demandName, //需求名称
                    effectiveDate, //生效日期
                    expirationDate, //截止日期
                    extensionMonths, //延期月份数
                    extensionTerms, //延期条款 0-有限延期 1-无限延期
                    isTextsIncluded, //是否含税 0-不含税 1-含税
                    paymentTerms, //付款条件 0-月结 1-见票 2-现金 3-回单 4-单票 5-每周
                    quotationNumber, //报价单号
                    remark, //备注
                    taxes, //发票税
                    withholdingTax: (isTextsIncluded === 1 && !withholdingTax) ? 0 : withholdingTax, //补扣税
                    billingType, //开票类型
                    clientQuotationType: 1 //客户报价类型 1-客户运输报价 2-客户仓储报价
                }).then((result) => {
                    this.actionDone()
                    this.setState({
                        buttonLoading: false
                    })
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
            clientCode, //客户代码
            clientId, //客户id
            clientLegalId, //客户法人id
            clientLegalName, //客户法人名称
            clientName, //客户名称
            currencyId, //币种id
            currencyName, //币种
            days, //结算天数
            demandId, //需求id
            demandName, //需求名称
            effectiveDate, //生效日期
            expirationDate, //截止日期
            extensionMonths, //延期月份数
            extensionTerms, //延期条款 0-有限延期 1-无限延期
            isTextsIncluded, //是否含税 0-不含税 1-含税
            paymentTerms, //付款条件 0-月结 1-见票 2-现金 3-回单 4-单票 5-每周
            quotationNumber, //报价单号
            remark, //备注
            taxes, //发票税
            withholdingTax, //补扣税
            billingType,
            reviewStatus
        } = this.state
        let data = {
            ...quotationLines,
            id,
            clientCode, //客户代码
            clientId, //客户id
            clientLegalId, //客户法人id
            clientLegalName, //客户法人名称
            clientName, //客户名称
            currencyId, //币种id
            currencyName, //币种
            days, //结算天数
            demandId, //需求id
            demandName, //需求名称
            effectiveDate, //生效日期
            expirationDate, //截止日期
            extensionMonths, //延期月份数
            extensionTerms, //延期条款 0-有限延期 1-无限延期
            isTextsIncluded, //是否含税 0-不含税 1-含税
            paymentTerms, //付款条件 0-月结 1-见票 2-现金 3-回单 4-单票 5-每周
            quotationNumber, //报价单号
            remark, //备注
            taxes, //发票税
            withholdingTax: (isTextsIncluded === 1 && !withholdingTax) ? 0 : withholdingTax, //补扣税
            billingType,
            clientQuotationType: 1 //客户报价类型 1-客户运输报价 2-客户仓储报价
        }
        return new Promise((resolve, reject) => {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    const pro = rApi.editClientQuotation({
                        ...data
                    })
                    pro.then((result) => {
                        if(isMsg) {
                            message.success('操作成功!')
                        }
                        this.setState({
                            buttonLoading: false,
                            quoTationLoading: true,
                            transportModeBusinessModes: result
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
                        reject(error)
                    })
                    return pro
                }
                reject(err)
            })
        })
    }

    clearData = (isClear) => {
        if (isClear) {
            //console.log('clearData')
            this.setState({
                reLoadClient: true,
                demandId: null,
                clientLegalName: null
            }, () => {
                this.setState({
                    reLoadClient: false
                })
            })
        }
    }

    getClientLegalData = () => { //获取客户法人数据
        let { rApi } = this.props
        let { clientId } = this.state
        return new Promise((resolve, reject) => {
            rApi.getClients({
                limit: 999999, 
                offset: 0, 
                clientid: clientId
            }).then(d => {
                let data = d.clients[0]
                //console.log('filterOrderIdGetCarType', data.legals)
                if(data) {
                    resolve(data.legals.map(item => {
                        return { 
                            ...item,
                            id: item.name
                        }
                    }))
                } else {
                    resolve([])
                }
            }).catch(e => {
                reject(e)
            })
        })
       
    }
    

    /* 打开运输方式弹窗 */
    openTransport = () => {
        let backupTransportTypeList = objDeepCopy(this.state.transportTypeList)
        let backupCheckedTransport = objDeepCopy(this.state.checkedTransport)
        this.setState({ transModalVisible: true, backupTransportTypeList, backupCheckedTransport})
    }

    /* 关闭运输方式弹窗 */
    closeTransport = () => {
        let transportTypeList = objDeepCopy(this.state.backupTransportTypeList)
        let checkedTransport = objDeepCopy(this.state.backupCheckedTransport)
        let checkedTransportData = transportTypeList.filter(item => checkedTransport.some(key => parseInt(key, 10) === parseInt(item.key, 10)))
        this.setState({ transModalVisible: false, transportTypeList, checkedTransport, checkedTransportData})
    }

    /* 保存关闭运输方式弹窗 */
    saveTransport = () => {
        this.setState({ transModalVisible: false })
    }

    /* 获取费用用途 */
    async getCostList() {
        const { mobxDataBook } = this.props
        let { costUsages } = this.state
        costUsages = await mobxDataBook.initData('费用用途')
        await this.setState({ costUsages })
        return this.state.costUsages
    }

    /* 获取运输方式 */
    getTransportType = async () => {
        const { mobxDataBook } = this.props
        let {transportTypeList} = this.state
        this.getCostList()
            .then(costUsages => {
                mobxDataBook.initData('运输方式')
                    .then(async data => {
                        transportTypeList = data.map(item => ({
                            key: item.id,
                            label: item.title,
                            value: item.id,
                            checkedArr: [],
                            data: costUsages.map(costItem => ({
                                key: costItem.id,
                                label: costItem.title,
                                value: costItem.id
                            }))
                        }))
                        // console.log(checkedTransportData)
                        await this.setState({
                            transportTypeList
                        })
                    })
            })
    }

    /* 运输方式选中修改 */
    changeTransport = checkedArr => {
        // console.log('checkedArr', checkedArr)
        let { transportTypeList } = this.state
        transportTypeList = transportTypeList.map(item => {
            if (!checkedArr.some(key => parseInt(key, 10) === item.key)) {
                item.checkedArr = []
            }
            return item
        })
        let checkedTransport = [...checkedArr]
        let checkedTransportData = transportTypeList.filter(item => checkedTransport.some(key => parseInt(key, 10) === parseInt(item.key, 10)))
        this.setState({checkedTransport, checkedTransportData})
    }

    /* 运输方式子集选中修改 */
    changeTransportChild = (checkedArr, index) => {
        let {transportTypeList} = this.state
        transportTypeList[index].checkedArr = [...checkedArr]
        this.setState({transportTypeList})
    }

    /* 运输方式点击切换显示 */
    handleChangeType = (e) => {
        if (!e || e.target.value === undefined) {
            return
        }
        // console.log('e', e.target.value)
        let {transportTypeList} = this.state
        let curSelect = transportTypeList.find(item => parseInt(item.key, 10) === parseInt(e.target.value, 10))
        //console.log('当前选中数据', curSelect)
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

    clearWithholdingTax = (isTrue, value) => { //清除补扣税
        let { withholdingTax } = this.state
        if(isTrue && withholdingTax > value) {
            this.setState({
                withholdingTax: this.isTextsIncluded === 1 ? 0 : null,
                reLoadWithholdingTax: true
            }, () => {
               this.setState({
                    reLoadWithholdingTax: false
               })
            })
        }
    }

    render() {
        let {
            open,
            type,
            title,
            clientId, //客户id
            clientLegalName, //客户法人名称
            clientName, //客户名称
            currencyId, //币种id
            currencyName, //币种
            clientQuotationTransportVos, //报价类型
            days, //结算天数
            demandId, //需求id
            demandName, //需求名称
            effectiveDate, //生效日期
            expirationDate, //截止日期
            extensionMonths, //延期月份数
            extensionTerms, //延期条款 0-有限延期 1-无限延期
            isTextsIncluded, //是否含税 0-不含税 1-含税
            paymentTerms, //付款条件 0-月结 1-见票 2-现金 3-回单 4-单票 5-每周
            quotationNumber, //报价单号
            remark, //备注
            taxes, //发票税
            withholdingTax, //补扣税
            billingType,
            reviewStatus, //审核状态 1-已保存 2-已提交 3-驳回 4-审核通过  5-已生效 6-已失效
            reLoadClient,
            buttonLoading,
            // transportTypeList,
            // checkedTransport,
            // transModalVisible,
            // checkedTransportData,
            transportModeBusinessModes,
            quoTationLoading,
            reLoadWithholdingTax
        } = this.state
        const { getFieldDecorator } = this.props.form
       // console.log('taxes', taxes)
        if (!open) {
            return null
        }
        return (
            <Modal
                style={{width: '95%', maxWidth: 1000}}
                changeOpen={this.changeOpen} 
                open={this.state.open} 
                title={title} 
                className='cus-modal'
                getContentDom={v => this.popupContainer = v}
            >
                <div
                    ref={v => this.modal = v}
                >
                    <Form layout='inline' onSubmit={this.handleSubmit}>
                        <Modal.Header title={
                            <span>
                                <span style={{colr: '#808080'}}>{type === 3 ? '' : '状态:'}</span>
                                {
                                    reviewStatus === 2 ?
                                    <span style={{fontSize: '14px', color: 'rgb(29, 165, 122)', marginLeft: 10}}>已提交</span>
                                    :
                                    reviewStatus === 4 ?
                                    <span style={{fontSize: '14px', color: 'rgb(29, 165, 122)', marginLeft: 10}}>审核通过</span>
                                    :
                                    reviewStatus === 3 ?
                                    <span style={{fontSize: '14px', color: 'red', marginLeft: 10}}>驳回</span>
                                    :
                                    reviewStatus === 6 ?
                                    <span style={{fontSize: '14px', color: 'red', marginLeft: 10}}>已失效</span>
                                    :
                                    type !== 3 ?
                                    <span style={{fontSize: '14px', color: 'rgb(29, 165, 122)', marginLeft: 10}}>保存待提交</span>
                                    :
                                    ''
                                }
                                </span>
                            }
                        >
                            {
                                type === 1 || type === 3 ?  
                                <FormItem>
                                    <Button 
                                        //icon='save' 
                                        htmlType="submit"
                                        className={(reviewStatus === null) ? 'btn-success' : ''}
                                        style={{ border: (reviewStatus === null) ? 'none' : '1px solid #d9d9d9'}}
                                        disabled={(reviewStatus === 2 || reviewStatus === 4) ? true : false}
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
                                <FunctionPower power={power.EXAMINE_SUBMIT}>
                                    <Popconfirm
                                        placement="topLeft"
                                        title="确定提交吗?"
                                        onConfirm={this.onSubmit}
                                        okText="确定"
                                        cancelText="取消">
                                            <Button 
                                                //icon='rocket' 
                                                className={(reviewStatus !== 2 || reviewStatus !== 4) ? 'btn-success' : ''}
                                                style={{ marginLeft: 10, border: (reviewStatus === 2 || reviewStatus === 4) ? '1px solid #d9d9d9' : 'none' }}
                                                disabled={(reviewStatus === 2 || reviewStatus === 4) ? true : false}
                                            >
                                                提交
                                            </Button> 
                                    </Popconfirm>
                                </FunctionPower>  
                                : 
                                null
                            }
                            {
                                type === 1 && reviewStatus === 4 ?
                                <FunctionPower power={power.CANCEL_PASS}>
                                    <Popconfirm
                                        placement="topLeft"
                                        title="确定取消吗?"
                                        onConfirm={this.toExamineCancelPass}
                                        okText="确定"
                                        cancelText="取消">
                                            <Button 
                                                //icon='enter' 
                                                style={{ marginLeft: 10 }}
                                                disabled={(reviewStatus === 2 || reviewStatus === 4) ? false : true}
                                            >
                                                取消通过
                                            </Button> 
                                    </Popconfirm>
                                </FunctionPower>  
                                : 
                                type === 1 ?
                                <FunctionPower power={power.EXAMINE_PASS}>
                                    <Popconfirm
                                        placement="topLeft"
                                        title="确定通过吗?"
                                        onConfirm={this.toExaminePass}
                                        okText="确定"
                                        cancelText="取消">
                                            <Button 
                                                //icon='enter' 
                                                style={{ marginLeft: 10 }}
                                                disabled={(reviewStatus === 2 || reviewStatus === 4) ? false : true}
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
                                <FunctionPower power={power.EXAMINE_REJECT}>
                                    <Popconfirm
                                        placement="topLeft"
                                        title="确定驳回吗?"
                                        onConfirm={this.toExamineReject}
                                        okText="确定"
                                        cancelText="取消">
                                            <Button 
                                               // icon='rollback' 
                                                style={{ marginLeft: 10, color: 'red', borderColor: 'red'}}
                                                disabled={reviewStatus === 2 ? false : true}
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
                                <Col><span style={{fontSize: '14px', color: '#484848'}}>基本信息</span></Col>
                            </Row>
                            <Row gutter={24} type={type} >
                                <Col  label="客户名称" span={7} isRequired text={clientName} >
                                    <FormItem>
                                        {
                                            getFieldDecorator('clientId', {
                                                initialValue: clientId ?
                                                {
                                                    id: clientId,
                                                    shortname: clientName
                                                }
                                                :
                                                null,
                                                rules: [
                                                    {
                                                        required: true, 
                                                        message: '请选择客户名称'
                                                    }
                                                ],
                                            })(
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
                                                            clientName: value ? value.shortname : null, 
                                                            clientCode: value ? value.code : null}, () => {
                                                                let id = value ? value.id : null
                                                                if (clientId !== id) {
                                                                    this.clearData(true)
                                                                }
                                                            }
                                                        )}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col  label="需求名称" span={7} isRequired text={demandName} >
                                    {
                                        reLoadClient ?
                                        null
                                        :
                                        <FormItem>
                                            {
                                                getFieldDecorator('demandId', {
                                                    rules: [
                                                        {
                                                            required: true, 
                                                            message: '请选择需求名称'
                                                        }
                                                    ],
                                                })(
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
                                                        labelField={'demandName'}
                                                        disabled={clientId ? false : true}
                                                        // params={{pageNo: 1, pageSize: 9999999, clientId: clientId, processStatus: 4, demandStatus: 0}}
                                                        // getDataMethod={'getDemandsList'}
                                                        getData={this.getDemandsList}
                                                        onChangeValue={(value = {}) => this.setState({
                                                            demandId: value.id, 
                                                            demandName: value.demandName || value.title
                                                        })}
                                                    /> 
                                                )
                                            }
                                        </FormItem>
                                    }
                                </Col>
                                <Col span={7} />
                            </Row>
                            <Row gutter={24} type={type} >
                                {/* <Col span={1} /> */}
                                {/* <Col  label="运输类型" span={6} text={dockedPersonName} >
                                    <RemoteSelect
                                        defaultValue={
                                            dockedPersonId ?
                                            {
                                                id: dockedPersonId,
                                                title: dockedPersonName,
                                                name: dockedPersonName,
                                            }
                                            :
                                            null
                                        }
                                        labelField={'name'}
                                        getDataMethod={'getLegalPersons'}
                                        onChangeValue={(value = {}) => this.setState({dockedPersonId: value.id, dockedPersonName: value.title})}
                                    />
                                </Col> */}
                                {/* <Col span={1} /> */}
                                <Col label="客户法人" span={7} text={clientLegalName} >
                                    {
                                        // reLoadClient ?
                                        // null
                                        // :
                                        // <FormItem>
                                        //     {
                                        //         getFieldDecorator('clientLegalId', {
                                        //             initialValue: clientLegalId || clientLegalId === 0 ?
                                        //             {
                                        //                 id: clientLegalId,
                                        //                 title: clientLegalName,
                                        //                 name: clientLegalName,
                                        //             }
                                        //             :
                                        //             null,
                                        //             rules: [
                                        //                 {
                                        //                     required: true, 
                                        //                     message: '请选择客户法人'
                                        //                 }
                                        //             ],
                                        //         })(
                                        reLoadClient ?
                                            null
                                            :
                                            <RemoteSelect
                                                defaultValue={
                                                    clientLegalName ?
                                                        {
                                                            id: clientLegalName,
                                                            title: clientLegalName,
                                                            name: clientLegalName
                                                        }
                                                        :
                                                        null
                                                }
                                                getPopupContainer={() => this.popupContainer || document.body}
                                                getData={this.getClientLegalData}
                                                // params={{limit: 999999, offset: 0, clientId: clientId}}
                                                labelField={'name'}
                                                disabled={clientId ? false : true}
                                                onChangeValue={(value = {}) => {
                                                    this.setState(
                                                        {
                                                            clientLegalId: null,
                                                            clientLegalName: value.name
                                                        })
                                                }}
                                            />
                                        //         )
                                        //     }
                                        // </FormItem>
                                    }
                                </Col>
                                <Col label="付款条件" isRequired span={8} text={
                                    (paymentTerms === 0 || paymentTerms === 1 || paymentTerms === 2) ?
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
                                        <div style={{ width: 110, marginRight: 5 }}>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('paymentTerms', {
                                                        initialValue: paymentTerms || paymentTerms === 0 ?
                                                            {
                                                                id: paymentTerms,
                                                                title: PAYMENT_TERMS[paymentTerms]
                                                            }
                                                            :
                                                            null,
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message: '请选择付款条件'
                                                            }
                                                        ],
                                                    })(
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
                                                            onChangeValue={(value = {}) => {
                                                                this.setState({ paymentTerms: value.id })
                                                            }}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        </div>
                                        {
                                            !(paymentTerms === 0 || paymentTerms === 1 || paymentTerms === 2) ? <div style={{ width: 80, marginRight: 5 }}>
                                                <InputNumber
                                                    min={0}
                                                    style={{ width: '100%' }}
                                                    value={days}
                                                    onChange={value => this.setState({ days: value })}
                                                />
                                            </div> : ''
                                        }
                                        {
                                            !(paymentTerms === 0 || paymentTerms === 1 || paymentTerms === 2) ? <div>天</div> : ''
                                        }
                                    </div>
                                </Col>
                                <Col span={6} />
                            </Row>
                            <Row gutter={24} type={type}>
                                <Col label="报价单号" span={7} isRequired text={quotationNumber} >
                                    <Input
                                        disabled
                                        placeholder="自动生成"
                                        value={quotationNumber ? quotationNumber : ''}
                                        onChange={e => this.setState({ quotationNumber: e.target.value })}
                                    />
                                </Col>
                                <Col label="延期条款" span={8} text={(extensionTerms == 0 && extensionMonths) ? `${EXTENSION_DATE[extensionTerms]} - ${extensionMonths}个月` : EXTENSION_DATE[extensionTerms]}>
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
                                                            min={0}
                                                            style={{ width: '100%' }}
                                                            value={extensionMonths ? extensionMonths : 0}
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
                                <Col span={6} />
                            </Row>
                            <Row gutter={24} type={type}>
                                <Col label="&emsp;&emsp;币别" isRequired span={7} text={currencyName} >
                                    <FormItem>
                                        {
                                            getFieldDecorator('currencyId', {
                                                initialValue: currencyId ?
                                                    {
                                                        id: currencyId,
                                                        title: currencyName
                                                    }
                                                    :
                                                    null,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择币别'
                                                    }
                                                ],
                                            })(
                                                <RemoteSelect
                                                    defaultValue={
                                                        {
                                                            id: currencyId || 88,
                                                            title: currencyName || 'RMB'
                                                        }
                                                    }
                                                    getPopupContainer={() => this.popupContainer || document.body}
                                                    text={'币别'}
                                                    onChangeValue={(value = {}) => this.setState({ 
                                                        currencyId: value.id || 88, 
                                                        currencyName: value.title || 'RMB'
                                                    })}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={10} label="有效日期" isRequired text={`${moment(effectiveDate).format('YYYY-MM-DD')} 至 ${moment(expirationDate).format('YYYY-MM-DD')}`} >
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
                                        startTime={effectiveDate}
                                        endTime={expirationDate}
                                        changeStartTime={(date, dateStr) => {
                                            this.setState({
                                                effectiveDate: dateStr
                                            })
                                        }}
                                        getPopupContainer={() => this.popupContainer || document.body}
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
                                <Col span={4} />
                            </Row>
                            <Row gutter={24} type={type} style={{minHeight: 42}}>
                                <Col label="开票类型" span={7} text={billingType === 1 ? '普票' : '专票'}>
                                    <RadioGroup
                                        onChange={e => {
                                            this.setState({
                                                billingType: e.target.value ? e.target.value : 2
                                            })
                                        }}
                                        value={billingType ? billingType : 2}
                                        defaultValue={billingType ? billingType : 2}
                                    >
                                        {/* <Radio value={1}>普票</Radio> */}
                                        <Radio value={2}>专票</Radio>
                                    </RadioGroup>
                                </Col>
                                <Col span={10} label='是否含税' text={`${isTextsIncluded === 1 ? '含税' : '不含税'}, 发票税：${taxes ? taxes : 0}%, 补扣税: ${withholdingTax ? withholdingTax : 0}%`}>
                                    <div className='flex flex-vertical-center'>
                                        <div>
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
                                            <span style={{ margin: '0 10px' }}>发票税</span>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('taxes', {
                                                        initialValue: taxes,
                                                        rules: [
                                                            {
                                                                required: true, 
                                                                message: '请填写税率'
                                                            }
                                                        ],
                                                    })(
                                                        <InputNumber
                                                            min={0}
                                                            style={{ width: 80 }}
                                                            value={taxes}
                                                            onChange={value => {
                                                                this.setState({ 
                                                                    taxes: value === 0 ? taxes : value
                                                                })
                                                                this.clearWithholdingTax(true, value)
                                                                //console.log('value',value)
                                                            }}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                            <span style={{marginLeft: 5}}>%</span>
                                            <span style={{ margin: '0 10px' }}>补扣税</span>
                                            {
                                                reLoadWithholdingTax ?
                                                null
                                                :
                                                <InputNumber
                                                    min={isTextsIncluded === 1 ? 0 : null}
                                                    max={taxes ? taxes : Infinity}
                                                    style={{ width: 80 }}
                                                    value={withholdingTax ? withholdingTax : (isTextsIncluded === 1 && !withholdingTax) ? 0 : null}
                                                    disabled={(taxes || taxes === 0) ? false : true}
                                                    onChange={value => {
                                                        this.setState({ 
                                                            withholdingTax: (value && value > taxes) ? withholdingTax : value ? value : (isTextsIncluded === 1 && !value) ? 0 : null
                                                        })
                                                        //console.log('value',value)
                                                    }}
                                                />
                                            }
                                            <span style={{marginLeft: 5}}>%</span>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={4} />
                            </Row>
                            {/* <Row gutter={24} type={type}>
                                <Col label="备注信息" span={7} text={remark} className='text-overflow-ellipsis'>
                                    <Input
                                        defaultValue={remark}
                                        value={remark ? remark : ''}
                                        title={remark}
                                        placeholder=""
                                        onChange={e => { this.setState({ remark: e.target.value }) }}
                                    />
                                </Col>
                                <Col span={14} />
                            </Row> */}
                            <TextAreaBox 
                                type={type}
                                defaultValue={remark}
                                placeholderText=""
                                onChange={value => { this.setState({ remark: value }) }}
                            />
                            {
                                quoTationLoading ?
                                null
                                :
                                <ModeOfTransport
                                    getThis={v => this.modeTransport = v}
                                    getPopupContainer={() => this.popupContainer || document.body}
                                    type={type}
                                    getDataMethod={'getClientQuotations'}
                                    getDataUrl={'project/clientQuotation/exportData'}
                                    getQuotationDataUrl={'project/clientQuotation/exportQuotation'}
                                    isShowQuotationExportData
                                    clientQuotationTransportVos={clientQuotationTransportVos}
                                    quotationNumber={quotationNumber}
                                    reviewStatus={reviewStatus}
                                    noEdit={(reviewStatus === 2 || reviewStatus=== 4) ? true : false}
                                    transportModeBusinessModes={transportModeBusinessModes}
                                    quotationMethod='transportOrEstimate'
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