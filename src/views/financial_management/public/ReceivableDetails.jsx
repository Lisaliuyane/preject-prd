import React, { Fragment } from 'react'
import Modal from '@src/components/modular_window'
import { Form, Tabs, message, DatePicker, Icon } from 'antd'
import { inject } from "mobx-react"
import OrderinfoTable from './OrderinfoTable'
import OrdercostTable from './OrdercostTable'
import { Row, Col } from '@src/components/grid'
import ExpenseCashTable from './ExpenseCashTable'
import editSvg from '@src/libs/img/financial_management/edit.svg'
import moment from 'moment'

const ModularParent = Modal.ModularParent
const TabPane = Tabs.TabPane
const { MonthPicker } = DatePicker

@inject('rApi', 'mobxBaseData')  
class ReceivableDetails extends ModularParent {

    state = {
        openType: null,
        title: '',
        open: false,
        buttonLoading: false,
        curRow: {},
        source: {},
        activeTab: 'baseinfo',
        delIds: [], //删除订单id
        editMonth: false,
        newMonth: null,
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
    }

    show(d) {
        // console.log('show', d)
        const { title } = this.props
        let modalTitle = `${d.clientName || ''} ${title}单号：${title === '预估' ? d.estimateNumber : d.reconciliationNumber} 明细`
        this.setState({
            open: true,
            title: modalTitle,
            source: {...d},
            newMonth: d.expenseOwnMonth
        })
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
            title: '',
            open: false,
            curRow: {},
            source: {},
            activeTab: 'baseinfo',
            delIds: [],
            editMonth: false,
            newMonth: null,
        })
    }

    onSubmit = () => {
        const { form } = this.props
        form.validateFields((errors, values) => {
            if(errors === null) {
                this.handleSubmit()
            }
        })
    }

    handleSubmit = () => {

    }

    /* 修改选中行 */
    changeRow = (newRow) => {
        let {curRow} = this.state
        if (curRow.id === newRow.id) {
            return
        }
        this.setState({ curRow: newRow }, () => this.ordercostTable.searchCriteria())
    }

    /* 删除行 */
    delRow = (rIndex) => {
        let { source, delIds } = this.state
        delIds.push(source.receivableEstimateOrderList[rIndex].id)
        source.receivableEstimateOrderList.splice(rIndex, 1)
        let curRow = source.receivableEstimateOrderList && source.receivableEstimateOrderList.length ? source.receivableEstimateOrderList[0] : {}
        this.setState({ delIds, source, curRow }, this.orderinfoTable.searchCriteria())
    }

    /* 修改所属月份 */
    saveMonth = async doType => {
        if (this.state.saveMonLoading) return
        let { source, newMonth } = this.state
        if (doType === 'save') {
            const { title } = this.props
            let listKey = ''
            if (title === '预估') {
                listKey = 'estimateList'
            } else {
                listKey = 'accountList'
            }
            const APINAME = title === '预估' ? 'editChargeReceivableEstimate' : 'editAccountReceivable'
            let res = null
            this.setState({ saveMonLoading: true })
            try {
                res = await this.props.rApi[APINAME]({
                    id: source.id,
                    expenseOwnMonth: newMonth
                })
                source.expenseOwnMonth = newMonth
                this.props.setRowData(listKey, source._deepIndex, source)
                this.setState({ editMonth: false })
                message.success('操作成功')
            } catch (err) {
                message.error(err.msg || '操作失败')
            }
            this.setState({ saveMonLoading: false })
        } else {
            this.setState({
                newMonth: source.expenseOwnMonth,
                editMonth: false
            })
        }
    }

    /* 补扣款费用信息修改 */
    editExpenseCash = async () => {
        const { rApi } = this.props
        let { source } = this.state
        let reconciliationId = source.id
        let reconciliationReplenishmentList = this.expensecash.getResultList().data || []
        reconciliationReplenishmentList = reconciliationReplenishmentList.map(item => {
            return {
                id: item.id || null,
                reconciliationId,
                expenseId: item.expenseId,
                expenseName: item.expenseName,
                amount: item.amount,
                remark: item.remark
            }
        })
        /* 补扣款费用计算 */
        source.replenishment = reconciliationReplenishmentList.reduce((rt, cur) => {
            return rt += cur.amount || 0
        }, 0)
        /* 请求数据 */
        let reqData = {
            id: reconciliationId,
            reconciliationReplenishmentList,
            replenishment: source.replenishment
        }
        /* 请求数据 */
        await rApi.editAccountReceivable(reqData)
            .then(resp => {
                this.props.setRowData('accountList', source._deepIndex, source)
                message.success('操作成功')
            })
            .catch(err => {
                message.error(err.msg || '操作失败')
            })
    }

    render() {
        let {
            open,
            buttonLoading,
            curRow,
            source,
            activeTab,
            editMonth,
            newMonth
        } = this.state
        if (!open) return null
        const { title } = this.props
        //console.log('source', source)
        return (
            <Modal 
                changeOpen={this.changeOpen}
                onSubmit={this.onSubmit}
                open={open} 
                title={this.state.title} 
                style={{width: 900}}
                loading={buttonLoading}
                haveFooter={false}
            >
               <Form layout='inline' className='account-details-modal'>
                    <Tabs
                        activeKey={activeTab}
                        className='itabs-bottomline'
                        onChange={activeTab => {
                            this.setState({ activeTab })
                        }}
                    >
                        <TabPane tab="基本信息" key="baseinfo">
                            <Row>
                                {
                                    title === '预估' ?
                                        <Col label="预估单号&emsp;" colon span={6}>
                                            {source.estimateNumber}
                                        </Col> :
                                        <Col label="对账单号&emsp;" colon span={6}>
                                            {source.reconciliationNumber}
                                        </Col>
                                }
                                <Col label="创建人&emsp;&emsp;" colon span={6}>
                                    {source.operatorName}
                                </Col>
                                <Col label="开立时间&emsp;" colon span={6}>
                                    {moment(source.createTime).format('YYYY-MM-DD')}
                                </Col>
                                <Col span={4} />
                            </Row>
                            <Row>
                                <Col label="客户名称&emsp;" colon span={6}>
                                    {source.clientName}
                                </Col>
                                <Col label="项目名称&emsp;" colon span={6}>
                                    {source.projectName}
                                </Col>
                                <Col label="客户法人&emsp;" colon span={6}>
                                    {source.clientLegalName}
                                </Col>
                                <Col span={4} />
                            </Row>
                            <Row>
                                <Col label="总费用&emsp;&emsp;" colon span={6}>
                                    <span style={{color: '#E76400'}}>{`${source.totalCost || 0}${source.currencyName || 'RMB'}`}</span>
                                </Col>
                                <Col label="税后金额&emsp;" colon span={6}>
                                    <span style={{color: '#E76400'}}>{`${source.afterTaxAmount || 0}${source.currencyName || 'RMB'}`}</span>
                                </Col>
                                <Col label="税率&emsp;&emsp;&emsp;" colon span={6}>
                                    {source.taxes || 0}
                                </Col>
                                <Col span={4} />
                            </Row>
                            <Row>
                                <Col label="接单法人&emsp;" colon span={6}>
                                    {source.orderLegalName}
                                </Col>
                                <Col label="所属月份&emsp;" colon span={6}>
                                    {
                                        editMonth ?
                                            <MonthPicker
                                                allowClear={false}
                                                size='small'
                                                style={{ width: 90 }}
                                                value={newMonth ? moment(newMonth) : null}
                                                onChange={(d, ds) => {
                                                    let mon = d ? moment(d).format('YYYY-MM') : null
                                                    this.setState({ newMonth: mon })
                                                }}
                                            /> : <span>{source.expenseOwnMonth && moment(source.expenseOwnMonth).format('YYYY-MM')}</span>
                                    }
                                    {
                                        editMonth ? <Fragment>
                                            <Icon type="check" style={{ cursor: 'pointer', marginLeft: 6, color: '#18B583' }} onClick={e => this.saveMonth('save')} />
                                            <Icon type="close" style={{ cursor: 'pointer', marginLeft: 6 }} onClick={e => this.saveMonth('cancel')} />
                                        </Fragment> : <img style={{ cursor: 'pointer', marginLeft: 10 }} onClick={e => this.setState({ editMonth: true })} src={editSvg} />
                                    }
                                </Col>
                                <Col span={6} />
                                <Col span={4} />
                            </Row>
                            {
                                title === '对账' &&
                                <ExpenseCashTable
                                    dataList={source.reconciliationReplenishmentList}
                                    getThis={(v) => this[`expensecash`] = v}
                                    source={source}
                                    onSave={this.editExpenseCash}
                                />
                            }
                        </TabPane>
                        <TabPane tab={`${title}单明细`} key="details">
                            <OrderinfoTable
                                getRef={v => this.orderinfoTable = v}
                                source={source}
                                changeRow={this.changeRow}
                                delRow={this.delRow}
                                title={title}
                            />
                            {
                                curRow && curRow.id &&
                                <OrdercostTable
                                    getRef={v => this.ordercostTable = v}
                                    curRow={curRow}
                                    curCode={2}
                                />
                            }
                        </TabPane>
                    </Tabs>
               </Form>
            </Modal>
        )
    }
}

export default Form.create()(ReceivableDetails)