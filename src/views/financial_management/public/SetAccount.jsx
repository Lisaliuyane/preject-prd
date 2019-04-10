import React from 'react'
import { Form, Button, DatePicker, message } from 'antd'
import { inject } from "mobx-react"
import Modal from '@src/components/modular_window'
import { Row, Col } from '@src/components/grid'
import FormItem from '@src/components/FormItem'
import RemoteSelect from '@src/components/select_databook'
import moment from 'moment'

const { MonthPicker } = DatePicker
const ModularParent = Modal.ModularParent

@inject('rApi', 'mobxBaseData')  
class SetAccount extends ModularParent {

    state = {
        openType: null,
        title: '生成对账单',
        open: false,
        buttonLoading: false,
        selectedRows: [],
        orderLegalId: null,
        orderLegalName: '',
        clientLegalId: null,
        clientLegalName: '',
        expenseOwnMonth: null,
        associatePaymentCarrierId: null,
        associatePaymentCarrierName: '',
        carType: 1
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
    }

    show(d) {
        // console.log('show', d.data)
        let carType = d.data && d.data[0] ? d.data[0].carType : 1
        if (d.openType === 'receivable') {
            this.setState({
                open: true,
                openType: d.openType,
                selectedRows: [...d.data],
                clientLegalId: d.data[0].clientLegalId,
                clientLegalName: d.data[0].clientLegalName,
                orderLegalId: d.data[0].orderLegalId,
                orderLegalName: d.data[0].orderLegalName,
                carType
            })
        } else {
            this.setState({
                open: true,
                openType: d.openType,
                selectedRows: [...d.data],
                orderLegalId: d.data[0].orderLegalId,
                orderLegalName: d.data[0].orderLegalName,
                associatePaymentCarrierId: d.data[0].carrierId,
                associatePaymentCarrierName: d.data[0].carrierName,
                carType
            })
            this.setMonth(d.data, d.carrierObj)
        }
    }
  
    changeOpen = (open) => {
        this.setState({
            open
        })
        if (!open) {
            this.clearValue()
        }
    }

    clearValue() {
        this.setState({
            openType: null,
            open: false,
            selectedRows: [],
            orderLegalId: null,
            orderLegalName: '',
            clientLegalId: null,
            clientLegalName: '',
            expenseOwnMonth: null,
            associatePaymentCarrierId: null,
            associatePaymentCarrierName: '',
            carType: 1
        })
    }

    /* 预估月份设置 */
    setMonth(rows, carrierObj) {
        if (rows[0].billingMethod === 1 && carrierObj) {/* 是承运商车辆 */
            let checkAccountPeriod = carrierObj.checkAccountPeriod ? carrierObj.checkAccountPeriod : -1
            let defaultDate = rows[0].createTime
            let defaultArr = moment(defaultDate).toArray()
            let minDay, maxDay
            if (checkAccountPeriod === -1) {
                minDay = moment(defaultArr).startOf('month')
                maxDay = moment(defaultArr).endOf('month')
            } else if (defaultArr[2] <= checkAccountPeriod) {
                defaultArr[2] = checkAccountPeriod
                maxDay = moment(defaultArr)
                defaultArr[1] -= 1
                minDay = moment(defaultArr)
            } else {
                defaultArr[2] = checkAccountPeriod
                minDay = moment(defaultArr)
                defaultArr[1] += 1
                maxDay = moment(defaultArr)
            }
            if (rows.some(item => (moment(item.createTime) < minDay || moment(item.createTime) > maxDay))) {/* 存在不符合第一个对账月份条目 */
                message.warning('开立月份异常')
            } else {
                this.setState({ expenseOwnMonth: moment(defaultDate).format('YYYY-MM') })
            }
        }
    }

    onSubmit = () => {
        const { form } = this.props
        form.validateFields((err, values) => {
            if(!err) {
                this.handleSubmit()
            }
        })
    }

    handleSubmit = (e) => {
        const { doAccount } = this.props
        const {
            openType,
            orderLegalId,
            orderLegalName,
            clientLegalId,
            clientLegalName,
            expenseOwnMonth,
            associatePaymentCarrierId,
            associatePaymentCarrierName
        } = this.state
        let data = openType === 'receivable' ? {
            orderLegalId,
            orderLegalName,
            clientLegalId,
            clientLegalName,
            expenseOwnMonth
        } : {
            orderLegalId,
            orderLegalName,
            associatePaymentCarrierId,
            associatePaymentCarrierName,
            expenseOwnMonth
        }
        this.setState({buttonLoading: true})
        doAccount(data)
            .then(() => {
                this.changeOpen(false)
                this.setState({ buttonLoading: false })
            })
            .catch(err => {
                this.setState({ buttonLoading: false })
            })
    }

    render() {
        let {
            open,
            openType,
            buttonLoading,
            orderLegalId,
            orderLegalName,
            clientLegalId,
            clientLegalName,
            expenseOwnMonth,
            associatePaymentCarrierId,
            associatePaymentCarrierName,
            title,
            carType
        } = this.state 
        if (!open) return null
        let modalTitle = this.props.title ? `生成${this.props.title}单` : title
        const { getFieldDecorator } = this.props.form
        return (
            <Modal 
                changeOpen={this.changeOpen}
                open={this.state.open} 
                title={modalTitle} 
                style={{width: 500}}
                loading={buttonLoading}
                haveFooter={false}
                className='estimate-modal'
            >
               <Form layout='inline' style={{paddingTop: 10}}>
                    <Row style={{ minHeight: 48, paddingLeft: 20 }}>
                        <Col label="&emsp;接单法人" span={12} isRequired>
                            {
                                <FormItem>
                                    {
                                        getFieldDecorator('orderLegalId', {
                                            initialValue: orderLegalId ? {
                                                id: orderLegalId,
                                                name: orderLegalName
                                            } : null,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择接单法人'
                                                }
                                            ],
                                        })(
                                            <RemoteSelect
                                                defaultValue={orderLegalId ? {
                                                    id: orderLegalId,
                                                    name: orderLegalName
                                                } : null}
                                                onChangeValue={
                                                    e => {
                                                        let id = e ? e.id : 0
                                                        this.setState({ orderLegalId: e ? id : null, orderLegalName: e ? e.name : '' })
                                                    }
                                                }
                                                params={{ limit: 99999, offset: 0 }}
                                                getDataMethod={'getLegalPersons'}
                                                placeholder='接单法人'
                                                labelField={'name'}
                                            />
                                        )
                                    }
                                </FormItem>
                            }
                        </Col>
                    </Row>
                    <Row style={{ minHeight: 48, paddingLeft: 20 }}>
                        {
                            openType === 'receivable' ?
                                <Col label="&emsp;客户法人" span={12}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('clientLegalId', {
                                                initialValue: clientLegalId ? {
                                                    id: clientLegalId,
                                                    name: clientLegalName
                                                } : null,
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '请选择客户法人'
                                                    }
                                                ],
                                            })(
                                                <RemoteSelect
                                                    defaultValue={clientLegalId ? {
                                                        id: clientLegalId,
                                                        name: clientLegalName
                                                    } : null}
                                                    onChangeValue={
                                                        e => {
                                                            let id = e ? e.id.split('-')[0] : 0
                                                            this.setState({ clientLegalId: e ? id : null, clientLegalName: e ? e.name : '' })
                                                        }
                                                    }
                                                    params={{ limit: 99999, offset: 0 }}
                                                    getDataMethod={'getClients'}
                                                    placeholder='客户法人'
                                                    dealData={arr => {
                                                        const { selectedRows } = this.state
                                                        let rt = []
                                                        try {
                                                            rt = arr.find(item => item.id === selectedRows[0].clientId).legals
                                                        } catch (err) {
                                                            rt = []
                                                        }
                                                        rt = rt.map((item, index) => ({
                                                            ...item,
                                                            id: `${item.id}-${index}`
                                                        }))
                                                        return rt
                                                    }}
                                                    labelField={'name'}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col> :
                                <Col label="付款承运商" span={12} isRequired>
                                    <FormItem>
                                        {
                                            getFieldDecorator('associatePaymentCarrierId', {
                                                initialValue: associatePaymentCarrierId ? {
                                                    id: associatePaymentCarrierId,
                                                    abbreviation: associatePaymentCarrierName
                                                } : null,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择付款承运商'
                                                    }
                                                ],
                                            })(
                                                <RemoteSelect
                                                    defaultValue={associatePaymentCarrierId ? {
                                                        id: associatePaymentCarrierId,
                                                        abbreviation: associatePaymentCarrierName
                                                    } : null}
                                                    onChangeValue={
                                                        e => {
                                                            let id = e ? e.id : 0
                                                            this.setState({ associatePaymentCarrierId: e ? id : null, associatePaymentCarrierName: e ? e.abbreviation : '' })
                                                        }
                                                    }
                                                    params={{ limit: 99999, offset: 0 }}
                                                    dealData={arr => {
                                                        if (carType === 1) {
                                                            return arr
                                                        } else {
                                                            return arr.filter(item => (item.type === '无车承运人' || item.type === '信息部(黄牛)'))
                                                        }
                                                    }}
                                                    getDataMethod={'getCarrierList'}
                                                    placeholder='付款承运商'
                                                    labelField={'abbreviation'}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                        }
                    </Row>
                    <Row style={{ minHeight: 48, paddingLeft: 20 }}>
                        <Col label="&emsp;所属月份" span={12} isRequired>
                            <FormItem>
                                {
                                    getFieldDecorator('expenseOwnMonth', {
                                        initialValue: expenseOwnMonth ? moment(expenseOwnMonth) : null,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择所属月份'
                                            }
                                        ],
                                    })(
                                        <MonthPicker
                                            value={expenseOwnMonth ? moment(expenseOwnMonth) : null}
                                            onChange={(d, ds) => {
                                                let { expenseOwnMonth } = this.state
                                                expenseOwnMonth = d ? moment(d).format('YYYY-MM') : null
                                                this.setState({ expenseOwnMonth })
                                            }}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row style={{ minHeight: 48, paddingLeft: 20 }}>
                        <Col label="" span={24}>
                            <Button type="primary" style={{ marginRight: 10 }} loading={buttonLoading} onClick={this.onSubmit}>确定</Button>
                            <Button onClick={e => this.changeOpen(false)}>取消</Button>
                        </Col>
                    </Row>
               </Form>
            </Modal>
        )
    }
}

export default Form.create()(SetAccount)