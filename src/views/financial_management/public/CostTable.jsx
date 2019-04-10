import React from 'react'
import { Table, Parent } from '@src/components/table_template'
import { inject } from "mobx-react"
import { CostItem } from './public'

/* CostTable */
@inject('rApi')
export default class CostTable extends Parent {
    state = {}
    constructor(props) {
        super(props)
        if (props.getRef) {
            props.getRef(this)
        }
        let columns = [
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
                dataIndex: 'cyName',
                key: 'cyName',
                width: 140
            },
            {
                className: 'text-overflow-ellipsis',
                title: '结算法人',
                dataIndex: 'cyName1',
                key: 'cyName1',
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
        if (props.useType === 'estimate'){
            columns.splice(3, 1)
        }
        this.state.columns = columns
    }

    getData = (params) => {
        const { source, useType, rApi, curType } = this.props
        if (useType === 'noEstimate') {
            return new Promise((resolve, reject) => {/* 待开立 */
                let dataList = [...source.selectExpenseItemList, ...source.expenseCashPriceList, ...source.sendCarCashPriceExpenseList.map(item => {
                    item.expenseType = '现金价'
                    item.costMark = '现金价'
                    return item
                })]
                dataList = dataList.map(item => {
                    item.cyName = source.currencyName
                    item.quotationNumber = source.quotationNumber
                    return item
                })
                if (dataList.length > 0) {
                    dataList.push({
                        expenseType: '总计',
                        costMark: '总计',
                        totalFee: dataList.reduce((rt, cur) => {
                            return rt += (cur.expenseType === 1 || cur.billingMethodName === '实报实销') ? cur.costUnitValue : cur.expenseType === 2 ? (cur.chargeFee * cur.orderExpenseItemUnitCoefficientList.reduce((total, c) => total += c.costUnitValue, 0)) : cur.expenseType === 3 ? cur.costUnitValue : cur.expenseType === '现金价' ? cur.expenseValue : 0
                        }, 0)
                    })
                }
                resolve({
                    dataSource: dataList,
                    total: dataList.length > 1 ? dataList.length - 1 : dataList.length
                })
            })
        } else if (useType === 'estimate') {/* 应付预估 */
            return new Promise((resolve, reject) => {
                const APINAME = curType === 'sendcar' ? 'getOneSendCarList' : 'getSpecialBusiness'
                rApi[APINAME]({
                    id: source.businessId || -1
                })
                    .then(res => {
                        let selectExpenseItemList = res.selectExpenseItemList,
                            expenseCashPriceList = res.expenseCashPriceList
                        let dataList = [...selectExpenseItemList, ...expenseCashPriceList, ...res.sendCarCashPriceExpenseList.map(item => {
                            item.expenseType = '现金价'
                            item.costMark = '现金价'
                            return item
                        })]
                        dataList = dataList.map(item => {
                            item.cyName = res.currencyName
                            item.quotationNumber = res.quotationNumber
                            return item
                        })
                        resolve({
                            dataSource: dataList,
                            total: dataList.length
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        reject(err)
                    })
            })
        } else {
            return new Promise((resolve, reject) => {
                resolve({
                    dataSource: [],
                    total: 0
                })
            })
        }
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
                THeader={<i></i>}
                getData={this.getData}
                columns={columns}
                tableWidth={80}
            />
        )
    }
}