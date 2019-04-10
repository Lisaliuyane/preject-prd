import React, { Component } from 'react';
import Modal from '@src/components/modular_window';
import { Form, Input, message, Cascader,  Checkbox  } from 'antd';
import { inject, observer } from "mobx-react"
import { Row, Col } from '@src/components/grid'
import RemoteSelect from '@src/components/select_databook'
import SelectMulti from '@src/components/select_multi'
import FormItem from '@src/components/FormItem'
import { toClientSource, toCooperativeDetail } from '@src/views/layout/to_page'
import './index.less'

const { TextArea } = Input
const ModularParent = Modal.ModularParent
const CheckboxGroup = Checkbox.Group

const demandType = [
    {
        id: 1,
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
        label: '仓+配', 
        value: 3
    },
    {
        id: 4,
        label: '快递', 
        value: 4
    },
]

@inject('mobxTabsData')
@inject('rApi')  
class AddOrEdit extends ModularParent {

    state = {
        type: null,
        title: null,
        open: false,
        edit: false,
        id: null,
        clientId: 0, //客户id
        clientName: null, //客户名字
        demandId: null, //需求id
        demandName: null, //需求名字
        demandType: [], //客户需求类型
        projectName: null, //项目名称
        checkAccountPeriod: null, //对账周期
        buttonLoading: false,
        clientLegalName: null ,
        orderLegalId: null,
        orderLegalName: null
    }
    constructor(props) {
        super(props);
        if (props.getThis) {
            props.getThis(this)
        }
    }

    // componentDidUpdate(preProps, preState) {
    //     console.log('preState', preState)
    //     console.log('preProps', preProps)
    // }
    
    changeOpen = (state) => {
        this.setState({
            open: state
        })
        if (!state) {
            this.clearValue()
        }
    }

    actionDone = () => {
        const { parent } = this.props
        if (parent.searchCriteria) {
            parent.searchCriteria()
        }
        this.changeOpen(false)
        //message.success('操作成功！')
    }

    show(d) {
        if(d.data && d.data.key === '应收报价预估') {
            d.data = Object.assign({}, d.data, {
                demandId: d.data.id, //需求id
                demandName: d.data.demandName
            })
            this.changeIdState()
            this.getClientsData().then(res => {
                this.getCheckAccountPeriod(d.data.clientId)
            })
        }
        this.setState({
            ...d.data,
            open: true,
            edit: d.edit,
            title: '新建合作项目'
        })
    }

    getOpenStatus = () => {
        let { open, type } = this.state
        return {
            open: open,
            type: type
        }
    }

    clearValue() {
        this.setState({
            type: null,
            title: null,
            open: false,
            edit: false,
            id: null,
            clientId: 0, //客户id
            clientName: null, //客户名字
            demandId: null, //需求id
            demandName: null, //需求名字
            demandType: [], //客户需求类型
            projectName: null, //项目名称
            checkAccountPeriod: null, //对账周期
            buttonLoading: false,
            clientLegalName: null ,
            orderLegalId: null,
            orderLegalName: null
            // transportQuotationList: [], //项目运输报价
            // warehouseQuotationList: [] //项目仓储报价
        })

    }

    saveSubmit = () => {
        const { form } = this.props
        form.validateFields((errors, values) => {
            if(errors === null) {
                this.handleSubmit()
            }
        })
    }

    // toClientSource = () => {
    //     const { mobxTabsData } = this.props
    //     toClientSource(mobxTabsData)
    // }

    handleSubmit = () => {
        let { 
            clientId, //客户id
            clientName, //客户名字
            demandId, //需求id
            demandName, //需求名字
            demandType, //客户需求类型
            projectName, //项目名称
            checkAccountPeriod,
            clientLegalName,
            orderLegalId,
            orderLegalName
         } = this.state
        //  if(!demandName || demandType.length === 0 || !clientId || !clientName) {
        //      message.error('必填项不能为空!')
        //  }
        this.setState({
            buttonLoading: true
        })
        this.props.rApi.addCooperativeProject({
            clientId, //客户id
            clientName, //客户名字
            demandId, //需求id
            demandName, //需求名字
            demandType, //客户需求类型
            projectName, //项目名称
            clientLegalName,
            checkAccountPeriod,
            orderLegalId,
            orderLegalName
            // transportQuotationList, //项目运输报价
            // warehouseQuotationList //项目仓储报价
        }).then(d => {
            // console.log('addDemand', d)
            this.setState({
                buttonLoading: false
            })
            this.actionDone()
            this.props.reloadList()
            const { mobxTabsData } = this.props
            if(d) {
                toCooperativeDetail(mobxTabsData, {
                    id: d.id,
                    pageData: {
                        projectNumber: d.projectNumber,
                        id: d.id,
                        demandType: demandType,
                        projectName: projectName,
                        clientId: clientId,
                        clientName: clientName,
                        demandId: demandId,
                        demandName: demandName,
                        checkAccountPeriod: checkAccountPeriod,
                        clientLegalName,
                        orderLegalId,
                        orderLegalName
                        // transportQuotationList: transportQuotationList,
                        // warehouseQuotationList: warehouseQuotationList
                    }
                })
            }
        }).catch(e => {
            message.error(e.msg || '添加失败')
            this.setState({
                buttonLoading: false
            })
        })
    }

    changeIdState = () => {
        let {
            clientId,
            demandId,
            demandType
        } = this.state
        if (clientId && demandId) {
            this.props.rApi.getDemandsList({
                clientId,
                demandId,
                pageNo: 1,
                demandStatus: 1,
                pageSize: 99999
            }).then(d => {
                this.setState({
                    demandType: d.records.length > 0 && d.records[0].operationType ? d.records[0].operationType : []
                })
            }).catch(e => {
                console.log(e)
            })
        }
    }

    getClientsData = async() => { //获取客户数据
        let { rApi } = this.props
        let { clientId } = this.state
        return new Promise((resolve, reject) => {
            rApi.getClients({
                limit: 999999, 
                offset: 0,
                status: 56
            }).then(d => {
                this.clientsData = d.clients
                resolve(d.clients)
            }).catch(e => {
                reject(e)
            })
        })
       
    }
    
    getCheckAccountPeriod = (id) => { //获取客户关联的对账周期,客户法人,接单法人
        let { clientId, orderLegalId, orderLegalName, clientLegalName, checkAccountPeriod } = this.state
        let clientsData = this.clientsData
        let checkAccountPeriodData = clientsData && clientsData.length > 0 ? clientsData.filter(item => item.id === id) : []
        checkAccountPeriod = checkAccountPeriodData[0] && checkAccountPeriodData[0].period ? checkAccountPeriodData[0].period : null
        clientLegalName = checkAccountPeriodData && checkAccountPeriodData.length > 0 && checkAccountPeriodData[0].legals && checkAccountPeriodData[0].legals.length > 0 && checkAccountPeriodData[0].legals[0].name ? checkAccountPeriodData[0].legals[0].name : null
        orderLegalId = checkAccountPeriodData[0] && checkAccountPeriodData[0].legal && checkAccountPeriodData[0].legal.id ? checkAccountPeriodData[0].legal.id : null
        orderLegalName = checkAccountPeriodData[0] && checkAccountPeriodData[0].legal && checkAccountPeriodData[0].legal.fullName ? checkAccountPeriodData[0].legal.fullName : null
        this.setState({
            checkAccountPeriod,
            clientLegalName,
            orderLegalId,
            orderLegalName
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

    render() {
        let {
            clientId, //客户id
            clientName,
            demandId,
            demandName,
            buttonLoading
        } = this.state
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal 
                changeOpen={this.changeOpen}
                onSubmit={this.saveSubmit}
                open={this.state.open} 
                title={this.state.title} 
                loading={buttonLoading}
                haveFooter>
               <Form layout='inline'>
                    <div className="cooperative-add-page" style={{width: 400, margin: '30px auto', flexWrap: 'wrap'}}>
                        <Row gutter={24}>
                            <Col  label="项目名称" span={24} isRequired>
                                <FormItem>
                                    {
                                        getFieldDecorator('projectName', {
                                            rules: [
                                                { 
                                                    required: true, 
                                                    message: '请填写项目名称'
                                                }
                                            ],
                                        })(
                                            <Input 
                                                //defaultValue={name ? name : ''}
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({projectName: e.target.value})
                                                }
                                            }
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col label="所属客户" span={24} isRequired>
                                <FormItem>
                                    {
                                        getFieldDecorator('clientId', {
                                            rules: [
                                                { 
                                                    required: true, 
                                                    message: '请选择所属客户'
                                                }
                                            ],
                                        })(
                                            <RemoteSelect
                                                defaultValue={clientId ? {id: clientId, shortname: clientName} : null}
                                                onChangeValue={
                                                    value => {
                                                        this.setState({
                                                            clientId: value ? value.id : '',
                                                            clientName: value ? value.title || value.shortname : ''
                                                        }, () => {
                                                            this.changeIdState
                                                            this.getCheckAccountPeriod(this.state.clientId)
                                                        })
                                                    }
                                                } 
                                                // getDataMethod={'getClients'}
                                                // params={{limit: 999999, offset: 0}}
                                                getData={this.getClientsData}
                                                labelField={'shortname'}
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col label="客户需求" span={24} isRequired>
                                <FormItem>
                                    {
                                        getFieldDecorator('demandId', {
                                            rules: [
                                                { 
                                                    required: true, 
                                                    message: '请选择客户需求'
                                                }
                                            ],
                                        })(
                                            <RemoteSelect
                                                defaultValue={demandId ? {id: demandId, demandName: demandName} : null}
                                                onChangeValue={
                                                    value => {
                                                        this.setState({
                                                            demandId: value ? value.id : '',
                                                            demandName: value ? value.name || value.demandName : ''
                                                        }, this.changeIdState)
                                                    }
                                                } 
                                                disabled={clientId ? false : true}
                                                getData={this.getDemandsList}
                                                // getDataMethod={'getDemandsList'}
                                                // params={{pageSize: 999999, pageNo: 1, clientId: clientId, processStatus: 4, demandStatus: 1}}
                                                labelField={'demandName'}
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        {/* {
                            clientId && demandId ?
                            <Row gutter={24}>
                                <Col label="项目运输报价" span={24} contentStyle={{whiteSpace: 'normal'}}>
                                    <SelectMulti
                                        getDataMethod='getClientQuotation'
                                        labelField='quotationNumber'
                                        dataKey='records'
                                        params={{clientQuotationType: 1, keyWords: clientName, demandId: demandId}}
                                        handleChangeSelect={this.handleChangeTransport}
                                        />
                                </Col>
                            </Row> 
                            :
                            null
                        }
                        {
                            clientId && demandId ?
                            <Row gutter={24}>
                                <Col label="项目仓储报价" span={24} contentStyle={{whiteSpace: 'normal'}}>
                                    <SelectMulti
                                        getDataMethod='getClientQuotation'
                                        labelField='quotationNumber'
                                        dataKey='records'
                                        params={{clientQuotationType: 2, keyWords: clientName, demandId: demandId}}
                                        handleChangeSelect={this.handleChangeStorage}
                                        />
                                </Col>
                            </Row> 
                            :
                            null
                        } */}
                    </div>
               </Form>
            </Modal>
        )
    }
}

export default Form.create()(AddOrEdit)