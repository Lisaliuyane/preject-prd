import React from 'react'
import { Table, Parent } from '@src/components/table_template'
import { inject } from "mobx-react"
import { CostItem } from './public'

/* 订单费用项明细表 */
@inject('rApi')
export default class OrdercostTable extends Parent {
    state = {}
    constructor(props) {
        super(props)
        if (props.getRef) {
            props.getRef(this)
        }
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                title: '费用项目',
                dataIndex: 'itemName',
                key: 'itemName',
                width: 220,
                render: (val, r, index) => {
                    return (
                        <CostItem
                            key={index}
                            r={r}
                            keyName='itemName'
                        />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '费用',
                dataIndex: 'expenseType',
                key: 'expenseType',
                width: 140,
                render: (val, r, index) => {
                    return (
                        <CostItem
                            key={index}
                            r={r}
                            keyName='fee'
                        />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '币别',
                dataIndex: 'currencyName',
                key: 'currencyName',
                width: 140
            },
            {
                className: 'text-overflow-ellipsis',
                title: '报价单号',
                dataIndex: 'quotationNumber',
                key: 'quotationNumber',
                width: 140
            }
        ]
    }

    getData = (params) => {
        const { rApi, curRow } = this.props
        return new Promise((resolve, reject) => {
            rApi.getChargeReceivableEstimateOrderinfo({
                id: curRow.orderId || -1,
                orderType: curRow.orderType || -1
            })
                .then(res => {
                    let dataList = this.dealData(res)
                    resolve({
                        dataSource: dataList,
                        total: 0
                    })
                })
                .catch(err => {
                    resolve({
                        dataSource: [],
                        total: 0
                    })
                    console.log(err)
                })
        })
    }

    /* 处理获取的订单费用数据 */
    dealData (d) {
        let selectExpenseItemList = d.selectExpenseItemList && d.selectExpenseItemList.length > 0 && d.selectExpenseItemList.map(item => {
            return {
                ...item,
                costMark: 2 //1-实报实销 2-合同价
            }
        }),
            expenseCashPriceList = d.expenseCashPriceList && d.expenseCashPriceList.length > 0 && d.expenseCashPriceList.map(item => {
                return {
                    ...item,
                    costMark: 1
                }
            })
        let rtArr = [...selectExpenseItemList, ...expenseCashPriceList]
        rtArr = rtArr.map(item => {
            item.currencyName = d.currencyName
            item.quotationNumber = d.quotationNumber
            return item
        })
        if (rtArr.length > 0) {
            rtArr.push({
                expenseType: '总计',
                costMark: '总计',
                totalFee: rtArr.reduce((rt, cur) => {
                    return rt += (cur.costMark === 1 || cur.billingMethodName === '实报实销') ? cur.costUnitValue : cur.costMark === 2 ? (cur.chargeFee * cur.orderExpenseItemUnitCoefficientList.reduce((total, c) => total += c.costUnitValue, 0)) : cur.expenseType === 3 ? cur.costUnitValue : cur.expenseType === '现金价' ? cur.expenseValue : 0
                }, 0)
            })
        }
        return rtArr
    }

    render() {
        const {
            columns
        } = this.state
        return (
            <Table
                noPadding
                isHideHeaderButton
                isNoneSelected
                isNoneNum
                isNonePagination
                parent={this}
                getThis={v => this.tableView = v}
                isNoneAction
                THeader={<span></span>}
                getData={this.getData}
                columns={columns}
                tableWidth={80}
            />
        )
    }
}