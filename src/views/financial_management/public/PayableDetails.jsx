import React, {Fragment} from 'react'
import Modal from '@src/components/modular_window'
import { Form, Tabs, DatePicker, message, Icon } from 'antd'
import { inject } from "mobx-react"
import AccountTable from './AccountTable'
import CostTable from './CostTable'
import { Row, Col } from '@src/components/grid'
import ExpenseCashTable from './ExpenseCashTable'
import editSvg from '@src/libs/img/financial_management/edit.svg'
import moment from 'moment'


const ModularParent = Modal.ModularParent
const TabPane = Tabs.TabPane
const { MonthPicker } = DatePicker

@inject('rApi', 'mobxBaseData')  
class PayableDetails extends ModularParent {

    state = {
        openType: null,
        title: '',
        open: false,
        buttonLoading: false,
        saveMonLoading: false,
        curRow: {}, //当前选中行数据
        source: {},
        activeTab: 'baseinfo',
        editMonth: false,
        newMonth: null,
    }

    constructor(props) {
        super(props);
        if (props.getThis) {
            props.getThis(this)
        }
    }

    show(d) {
        // console.log('show', d)
        let { title } = this.props
        let modalTitle = `${d.carrierName || ''} ${title}单号：${title === '预估' ? d.estimateNumber : d.reconciliationNumber} 明细`
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
            editMonth: false,
            newMonth: null
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

    /* 修改选中行 */
    changeRow = (newRow) => {
        let {curRow} = this.state
        if (curRow.id === newRow.id) {
            return
        }
        this.setState({ curRow: newRow }, () => this.costTable.searchCriteria())
    }

    /* 修改所属月份 */
    saveMonth = async doType => {
        if (this.state.saveMonLoading) return
        let { source, newMonth } = this.state
        if (doType === 'save') {
            const { title } = this.props
            const { type } = source.openData
            let listKey = ''
            if (title === '预估') {
                listKey = type === 'sendcar' ? 'estimateList' : 'specEstimateList'
            } else {
                listKey = type === 'sendcar' ? 'accountList' : 'specAccountList'
            }
            const APINAME = title === '预估' ? 'editPayableEstimate' : 'editAccountPayable'
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
        const { type } = source.openData
        const listKey = type === 'sendcar' ? 'accountList' : 'specAccountList'
        let reconciliationId = this.state.source.id
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
        let reqData = type === 'sendcar' ? {
            id: reconciliationId,
            reconciliationReplenishmentList,
            reconciliationType: 1,
            replenishment: source.replenishment
        } : {
            id: reconciliationId,
            reconciliationReplenishmentList,
            reconciliationType: 2,
            replenishment: source.replenishment
        }
        /* 请求数据 */
        await rApi.editAccountPayable(reqData)
            .then(resp => {
                this.props.setRowData(listKey, source._deepIndex, source)
                message.success('操作成功')
            })
            .catch(err => {
                message.error(err.msg || '操作失败')
            })
    }

    handleSubmit = () => {
        
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
        const { title } = this.props
        // console.log('source', source)
        if (!open) return null
        return (
            <Modal 
                changeOpen={this.changeOpen}
                onSubmit={this.onSubmit}
                open={this.state.open} 
                title={this.state.title} 
                style={{width: 900}}
                loading={buttonLoading}
                haveFooter={false}
                className='estimate-modal'
            >
               <Form layout='inline' className='estimate-details-modal'>
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
                                        <Col label="预估单号&emsp;&emsp;" colon span={6}>
                                            {source.estimateNumber}
                                        </Col> :
                                        <Col label="对账单号&emsp;&emsp;" colon span={6}>
                                            {source.reconciliationNumber}
                                        </Col>
                                }
                                <Col label="开立时间&emsp;&emsp;" colon span={7}>
                                    {moment(source.createTime).format('YYYY-MM-DD')}
                                </Col>
                                <Col label="创建人&emsp;&emsp;&emsp;" colon span={6}>
                                    {source.operatorName}
                                </Col>
                                <Col span={4} />
                            </Row>
                            <Row>
                                <Col label="承运商&emsp;&emsp;&emsp;" colon span={6}>
                                    {source.carrierName ? source.carrierName : source.carType === 1 ? source.carrierName : '现金车'}
                                </Col>
                                {
                                    source.carType === 2 &&
                                    <Col label="司机姓名&emsp;&emsp;" colon span={7}>
                                        {source.driverName}
                                    </Col>
                                }
                                <Col label="付款承运商&emsp;" colon span={source.carType === 2 ? 6 : 7}>
                                    {source.associatePaymentCarrierName}
                                </Col>
                                {
                                    source.carType !== 2 &&
                                    <Col span={6} />
                                }
                                <Col span={4} />
                            </Row>
                            <Row>
                                <Col label="总费用&emsp;&emsp;&emsp;" colon span={6}>
                                    <span style={{color: '#E76400'}}> {`${source.totalCost || 0}${source.currencyName || 'RMB'}`}</span>
                                </Col>
                                <Col label="税后金额&emsp;&emsp;" colon span={7}>
                                    <span style={{color: '#E76400'}}> {`${source.afterTaxAmount || 0}${source.currencyName || 'RMB'}`}</span>
                                </Col>
                                <Col label="税率&emsp;&emsp;&emsp;&emsp;" colon span={6}>
                                    {source.taxes || 0}
                                </Col>
                                <Col span={4} />
                            </Row>
                            <Row>
                                <Col label="接单法人&emsp;&emsp;" colon span={6}>
                                    {source.orderLegalName}
                                </Col>
                                <Col label="所属月份&emsp;&emsp;" colon span={7}>
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
                                            <Icon type="check" style={{ cursor: 'pointer', marginLeft: 6, color: '#18B583'}} onClick={e => this.saveMonth('save')} />
                                            <Icon type="close" style={{ cursor: 'pointer', marginLeft: 6}} onClick={e => this.saveMonth('cancel')} />
                                        </Fragment> : <img style={{cursor: 'pointer', marginLeft: 10}} onClick={e => this.setState({editMonth: true})} src={editSvg} />
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
                            <AccountTable
                                getRef={v => this.accountTable = v}
                                changeRow={this.changeRow}
                                iList={source.payableEstimateOrderList}
                                source={source}
                            />
                            {
                                curRow && curRow.id &&
                                <CostTable
                                    getRef={v => this.costTable = v}
                                    source={curRow}
                                    useType='estimate'
                                    curType={source.openData.type}
                                />
                            }
                        </TabPane>
                    </Tabs>
               </Form>
            </Modal>
        )
    }
}

export default Form.create()(PayableDetails)