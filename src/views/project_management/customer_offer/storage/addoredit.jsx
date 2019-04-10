import React, { Component } from 'react'
import Modal from '@src/components/modular_window'
// import DynamicTable from '@src/components/dynamic_table1'
import RemoteSelect from '@src/components/select_databook'
import { Row, Col } from '@src/components/grid'
import { inject } from "mobx-react"
import { children, id } from './power'
import moment from 'moment'
import { cloneObject } from '@src/utils'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { DatePicker, Form, Input, Button, message, Popconfirm, InputNumber } from 'antd'
import TextAreaBox from '@src/components/textarea'
import FormItem from '@src/components/FormItem'
import TimePicker from '@src/components/time_picker'
import Storage from './storage'
import './index.less'
const power = Object.assign({}, children, id)
const { RangePicker } = DatePicker
/** 
 * 付款条件
*/
// const PAYMENT_TERMS = {
//     0: '现金结',
//     1: '回单结',
//     2: '单票结',
//     3: '月结',
//     4: '见票结',
//     5: '每周结'
// }

/** 
 * 延期条款
*/
// const EXTENSION_DATE = {
//     0: '有限延期',
//     1: '无限延期'
// }


@inject('rApi')
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
        clientQuotationWarehouses: [], //报价明细
        demandId: 0, //需求id
        demandName: null, //需求名称
        effectiveDate: null, //生效日期
        expirationDate: null, //截止日期
        freeWarehousePeriod: 0, //免仓期
        quotationNumber: null, //报价单号
        remark: null, //备注
        clientQuotationType: 2, //客户报价类型 1-客户运输报价 2-客户仓储报价
        warehouseId: 0, //仓库id
        warehouseName: null, //仓库名称
        reviewStatus: null, //审核状态 1-已保存 2-已提交 3-驳回 4-审核通过  5-已生效 6-已失效
        historyData: null, // 传入数据
        buttonLoading: false
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

    getOpenStatus = () => {
        let { open, type } = this.state
        return {
            open: open,
            type: type
        }
    }

    
    show = (d) => {
        //console.log('show', d.data)
        let historyData = typeof d.data === 'object' ? cloneObject(d.data) : null
        let type = 3
        let title = '新建客户仓储报价'
        if (d.edit) {
            type = 1
            title = '编辑客户仓储报价'
        } else if(d.data && d.data.key === '应收报价预估') {
            d.data = Object.assign({}, d.data, {
                type: 3,
                title: '新建客户运输报价',
                demandId: d.data.demandId, //需求id
                demandName: d.data.demandName //需求名称
            })
        } else if (d.data) {
            type = 2
            title = '查看客户仓储报价'
        } else {
            type = 3
        }

        this.setState({
            ...d.data,
            historyData: historyData,
            type,
            title,
            open: true,
            edit: d.edit
        })
    }

    actionDone = () => {
        const { parent } = this.props
        if (parent.searchCriteria) {
            parent.searchCriteria()
        }
        this.changeOpen(false)
        message.success('操作成功！')
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
            clientQuotationWarehouses: [], //报价明细
            demandId: 0, //需求id
            demandName: null, //需求名称
            effectiveDate: null, //生效日期
            expirationDate: null, //截止日期
            freeWarehousePeriod: 0, //免仓期
            quotationNumber: null, //报价单号
            remark: null, //备注
            clientQuotationType: 2, //客户报价类型 1-客户运输报价 2-客户仓储报价
            warehouseId: 0, //仓库id
            warehouseName: null, //仓库名称
            reviewStatus: null, //审核状态 审核状态 1-已保存 2-已提交 3-驳回 4-审核通过  5-已生效 6-已失效
            // historyData: null, // 传入数据
            buttonLoading: false
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
            demandId, //需求id
            demandName, //需求名称
            effectiveDate, //生效日期
            expirationDate, //截止日期
            freeWarehousePeriod, //免仓期
            quotationNumber, //报价单号
            remark, //备注
            clientQuotationType, //客户报价类型 1-客户运输报价 2-客户仓储报价
            warehouseId, //仓库id
            warehouseName, //仓库名称
            reviewStatus, //审核状态 审核状态 1-已保存 2-已提交 3-驳回 4-审核通过  5-已生效 6-已失效
        } = this.state
        let data = {
            id,
            clientCode, //客户代码
            clientId, //客户id
            clientLegalId, //客户法人id
            clientLegalName, //客户法人名称
            clientName, //客户名称
            currencyId, //币种id
            currencyName, //币种
            clientQuotationWarehouses: this.storage.logData().data, //报价明细
            removeQuotationLineId: this.storage.logData().removeId,
            demandId, //需求id
            demandName, //需求名称
            effectiveDate, //生效日期
            expirationDate, //截止日期
            freeWarehousePeriod, //免仓期
            quotationNumber, //报价单号
            remark, //备注
            clientQuotationType, //客户报价类型 1-客户运输报价 2-客户仓储报价
            warehouseId, //仓库id
            warehouseName //仓库名称
        }
        this.editSave().then(res => {
            this.props.rApi.clientQuotationSubmit({
                id
            }).then(d => {
                this.setState({
                    reviewStatus: 2
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
        this.props.rApi.clientQuotationExaminePass({
            id
        }).then(d => {
            this.setState({
                reviewStatus: 4
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
            //console.log('Received values of form: ', values);
            this.onSave()
          }
        });
    }

    onSave = () => {
        let {
            type,
            //open,
            id,
            clientCode, //客户代码
            clientId, //客户id
            clientLegalId, //客户法人id
            clientLegalName, //客户法人名称
            clientName, //客户名称
            currencyId, //币种id
            currencyName, //币种
            //clientQuotationWarehouses, //报价明细
            demandId, //需求id
            demandName, //需求名称
            effectiveDate, //生效日期
            expirationDate, //截止日期
            freeWarehousePeriod, //免仓期
            quotationNumber, //报价单号
            remark, //备注
            clientQuotationType, //客户报价类型 1-客户运输报价 2-客户仓储报价
            warehouseId, //仓库id
            warehouseName, //仓库名称
            reviewStatus, //审核状态 审核状态 1-已保存 2-已提交 3-驳回 4-审核通过  5-已生效 6-已失效
        } = this.state
        const { rApi } = this.props
        // if(!clientName || !clientLegalName || !demandName || !warehouseName || !effectiveDate || !expirationDate || !currencyName) {
        //     message.error('必填项不能为空！')
        //     return
        // }
        // if(!effectiveDate || !expirationDate) {
        //     message.error('请选择有效日期')
        //     return false
        // }
        this.setState({
            buttonLoading: true
        })
        if (type === 2) {
            return
        } else if (type === 3) {
                rApi.addClientQuotation({
                    clientCode, //客户代码
                    clientId, //客户id
                    clientLegalId, //客户法人id
                    clientLegalName, //客户法人名称
                    clientName, //客户名称
                    currencyId, //币种id
                    currencyName, //币种
                    clientQuotationWarehouses: this.storage.logData().data, //报价明细
                    demandId, //需求id
                    demandName, //需求名称
                    effectiveDate, //生效日期
                    expirationDate, //截止日期
                    freeWarehousePeriod, //免仓期
                    quotationNumber, //报价单号
                    remark, //备注
                    clientQuotationType, //客户报价类型 1-客户运输报价 2-客户仓储报价
                    warehouseId, //仓库id
                    warehouseName //仓库名称
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
        let {
            id,
            clientCode, //客户代码
            clientId, //客户id
            clientLegalId, //客户法人id
            clientLegalName, //客户法人名称
            clientName, //客户名称
            currencyId, //币种id
            currencyName, //币种
            demandId, //需求id
            demandName, //需求名称
            effectiveDate, //生效日期
            expirationDate, //截止日期
            freeWarehousePeriod, //免仓期
            quotationNumber, //报价单号
            remark, //备注
            clientQuotationType, //客户报价类型 1-客户运输报价 2-客户仓储报价
            warehouseId, //仓库id
            warehouseName, //仓库名称
            reviewStatus, //审核状态 审核状态 1-已保存 2-已提交 3-驳回 4-审核通过  5-已生效 6-已失效
        } = this.state
        let data = {
            id,
            clientCode, //客户代码
            clientId, //客户id
            clientLegalId, //客户法人id
            clientLegalName, //客户法人名称
            clientName, //客户名称
            currencyId, //币种id
            currencyName, //币种
            clientQuotationWarehouses: this.storage.logData().data, //报价明细
            removeQuotationLineId: this.storage.logData().removeId,
            demandId, //需求id
            demandName, //需求名称
            effectiveDate, //生效日期
            expirationDate, //截止日期
            freeWarehousePeriod, //免仓期
            quotationNumber, //报价单号
            remark, //备注
            clientQuotationType, //客户报价类型 1-客户运输报价 2-客户仓储报价
            warehouseId, //仓库id
            warehouseName //仓库名称
        }
        return new Promise((resolve, reject) => {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    const pro = rApi.editClientQuotation(data)
                    pro.then((result) => {
                        if(isMsg) {
                            message.success('操作成功!')
                        }
                        this.setState({
                            buttonLoading: false
                        }, () => {
                            this.updateThisDataToTable({
                                reviewStatus,
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

    render() {
        //const { edit } = this.props
        let {
            open,
            type,
            title,
            //clientCode, //客户代码
            clientId, //客户id
            //clientLegalId, //客户法人id
            clientLegalName, //客户法人名称
            clientName, //客户名称
            currencyId, //币种id
            currencyName, //币种
            clientQuotationWarehouses, //报价明细
            demandId, //需求id
            demandName, //需求名称
            effectiveDate, //生效日期
            expirationDate, //截止日期
            freeWarehousePeriod, //免仓期
            quotationNumber, //报价单号
            remark, //备注
            //clientQuotationType, //客户报价类型 1-客户运输报价 2-客户仓储报价
            warehouseId, //仓库id
            warehouseName, //仓库名称
            reviewStatus, // 审核状态 1-已保存 2-已提交 3-驳回 4-审核通过  5-已生效 6-已失效
            reLoadClient,
            buttonLoading
        } = this.state
        const { getFieldDecorator } = this.props.form
        if (!open) {
            return null
        }
        return (
            <Modal
                style={{width: '95%', maxWidth: 1000}}
                changeOpen={this.changeOpen} 
                open={this.state.open} 
                title={title} 
                getContentDom={v => this.popupContainer = v}
            >
                <Form layout='inline' onSubmit={this.handleSubmit}>
                    <Modal.Header title={<span>
                        <span style={{colr: '#808080'}}>{type === 3 ? '' : '状态:'}</span>
                        {
                            reviewStatus === 2 ?
                            <span style={{color: '#18B583', marginLeft: 10}}>已提交</span>
                            :
                            reviewStatus === 4 ?
                            <span style={{color: '#18B583', marginLeft: 10}}>审核通过</span>
                            :
                            reviewStatus === 3 ?
                            <span style={{color: 'red', marginLeft: 10}}>驳回</span>
                            :
                            reviewStatus === 6 ?
                            <span style={{color: 'red', marginLeft: 10}}>已失效</span>
                            :
                            type !== 3 ?
                            <span style={{color: 'rgb(29, 165, 122)', marginLeft: 10}}>保存待提交</span>
                            :
                            ''
                        }
                    </span>}>
                    {
                        type === 1 || type === 3 ?  
                        <FormItem>
                            <Button 
                                //icon='save'  
                                className={(reviewStatus === null) ? 'btn-success' : ''}
                                style={{ border: (reviewStatus === null) ? 'none' : '1px solid #d9d9d9'}}
                                htmlType="submit"
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
                                        //icon='rollback' 
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
                    <div className="storage-wrapper-details" style={{borderBottom: '1px solid #E0E0E0', padding: '5px 20px', margin: 'auto'}}>
                        <div style={{color: '#484848', fontSize: '14px'}}>
                            基本信息
                        </div>
                        <Row gutter={24} type={type} >
                            <Col  label="客户名称" span={7} isRequired text={clientName} >
                                <FormItem>
                                    {
                                        getFieldDecorator('clientId', {
                                            // initialValue: clientId ?
                                            // {
                                            //     id: clientId,
                                            //     shortname: clientName
                                            // }
                                            // :
                                            // null,
                                            rules: [
                                                {
                                                    required: true, 
                                                    message: '请选择客户名称'
                                                }
                                            ],
                                        })(
                                            <RemoteSelect
                                                defaultValue={
                                                    clientId ? {
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
                                                        clientName: value ? value.shortname || value.title : null, 
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
                            <Col  label="仓库名称" span={7} isRequired text={warehouseName} >
                                <FormItem>
                                    {
                                        getFieldDecorator('warehouseId', {
                                            initialValue: warehouseId ?
                                            {
                                                id: warehouseId,
                                                title: warehouseName,
                                                name: warehouseName,
                                            }
                                            :
                                            null,
                                            rules: [
                                                {
                                                    required: true, 
                                                    message: '请选择仓库名称'
                                                }
                                            ],
                                        })(
                                            <RemoteSelect
                                                defaultValue={
                                                    warehouseId ?
                                                    {
                                                        id: warehouseId,
                                                        title: warehouseName,
                                                        name: warehouseName,
                                                    }
                                                    :
                                                    null
                                                }
                                                getPopupContainer={() => this.popupContainer || document.body}
                                                labelField={'name'}
                                                getDataMethod={'getWarehouseList'}
                                                params={{pageSize: 99999, pageNo: 1}}
                                                onChangeValue={(value = {}) => this.setState({warehouseId: value.id, warehouseName: value.title})}
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={7} />
                        </Row>
                        <Row gutter={24} type={type} >
                            <Col  label="客户法人" span={7} text={clientLegalName} >
                                {
                                    reLoadClient ?
                                    null
                                    :
                                    <RemoteSelect
                                        defaultValue={
                                            clientLegalName  ?
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
                                }
                            </Col>
                            <Col  label="需求名称" span={7} isRequired text={demandName} >
                                {
                                    reLoadClient ?
                                    null
                                    :
                                    <FormItem>
                                        {
                                            getFieldDecorator('demandId', {
                                                // initialValue: demandId ?
                                                // {
                                                //     id: demandId,
                                                //     demandName: demandName,
                                                // }
                                                // :
                                                // null,
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
                        <Row gutter={24} type={type}>
                            <Col label="报价单号" span={7} isRequired text={quotationNumber} >
                                <Input 
                                    style={{borderRadius: 0}}
                                    disabled
                                    placeholder="自动生成"
                                    value={quotationNumber ? quotationNumber : ''}
                                    onChange={e => this.setState({quotationNumber: e.target.value})}
                                />
                            </Col>
                            <Col span={12} label="有效日期" isRequired text={`${moment(effectiveDate).format('YYYY-MM-DD')} 至 ${moment(expirationDate).format('YYYY-MM-DD')}`} >
                                {/* <FormItem>
                                    {
                                        getFieldDecorator('effectiveDate', {
                                            initialValue: effectiveDate && expirationDate ? [moment(effectiveDate ), moment(expirationDate)] : null,
                                            rules: [
                                                {
                                                    required: true, 
                                                    message: '请选择有效日期'
                                                }
                                            ],
                                        })(
                                            <RangePicker
                                                style={{width: 220}}
                                                //defaultValue={effectiveDate && expirationDate ? [moment(effectiveDate ), moment(expirationDate)] : null}
                                                // showTime
                                                style={{borderRadius: 0}}
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
                        <Row gutter={24} type={type}>
                            <Col label="&emsp;&emsp;币别" isRequired span={7} text={currencyName} >
                                <FormItem>
                                    {
                                        getFieldDecorator('currencyId', {
                                            initialValue:  currencyId ? 
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
                            <Col  label="&emsp;免仓期" span={7} text={freeWarehousePeriod} >
                                <InputNumber
                                    style={{width: 150, borderRadius: 0}}
                                    min={0}
                                    defaultValue={freeWarehousePeriod}
                                    value={freeWarehousePeriod ? freeWarehousePeriod : ''} 
                                    title={freeWarehousePeriod}
                                    placeholder=""
                                    onChange={value => {this.setState({freeWarehousePeriod: value})}}
                                />{<span>&nbsp;天</span>}
                            </Col>
                            <Col span={7} />
                        </Row>
                        <TextAreaBox 
                            type={type}
                            defaultValue={remark}
                            placeholderText=""
                            onChange={value => { this.setState({ remark: value }) }}
                        />
                        {/* <Row gutter={24} type={type}>
                            <Col  label="备注信息" span={8} text={remark} className='text-overflow-ellipsis'>
                                <Input
                                    style={{borderRadius: 0}}
                                    defaultValue={remark}
                                    value={remark ? remark : ''} 
                                    title={remark}
                                    placeholder=""
                                    onChange={e => {this.setState({remark: e.target.value})}}
                                />
                            </Col>
                        </Row> */}
                        {/* <div style={{color: '#484848', fontWeight: 600}}>
                            仓储报价
                        </div> */}
                    </div>
                    <div className="storage-wrapper-table" style={{padding: '10px 20px'}}>
                        <Storage
                            data={clientQuotationWarehouses} 
                            ref='storage'
                            getThis={(v) => this.storage = v}
                            type={type}
                            reviewStatus={reviewStatus}
                        />
                    </div>
                    </Form>
            </Modal>
        )
    }
}
 
export default Form.create()(AddOrEdit);