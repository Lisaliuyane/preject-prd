import React, { Component } from 'react';
import DynamicTable from './dynamic_table'
import { cloneObject, isArray } from '@src/utils'
import { inject, observer } from "mobx-react"
import { toCarrierList } from '@src/views/layout/to_page'

const getHeaderData = (d) => {
    let header = []
    // header.push({
    //     title: '起运地',
    //     isHaveMove: false,
    //     isShow: true,
    //     type: 'base',
    //     name: 'departure',
    //     id: 1
    // })
    // header.push({
    //     title: '目的地',
    //     isHaveMove: false,
    //     isShow: true,
    //     type: 'base',
    //     name: "destination",
    //     id: 2
    // })

    // header.push({
    //     title: '时效',
    //     isHaveMove: false,
    //     isShow: true,
    //     type: 'base',
    //     name: "aging",
    //     id: 3
    // })

    // header.push({
    //     title: '是否高速',
    //     isHaveMove: false,
    //     isShow: true,
    //     type: 'base',
    //     name: "isHighway",
    //     id: 4
    // })

    // header.push({
    //     title: '最低收费',
    //     isHaveMove: false,
    //     isShow: true,
    //     type: 'base',
    //     name: "lowestFee",
    //     id: 5
    // })

    header.push(...[
        {
            title: '起运地',
            isHaveMove: false,
            isShow: true,
            type: 'base',
            name: "departure",
            id: 1
        },
        {
            title: '中转地',
            isHaveMove: false,
            isShow: true,
            type: 'base',
            name: "transitPlaceOneName",
            id: 2
        },
        {
            title: '目的地',
            name: "destination",
            type: 'base',
            isHaveMove: false,
            isShow: true,
            id: 3
        },
        {
            title: '时效',
            name: "aging",
            type: 'base',
            isHaveMove: false,
            isShow: true,
            id: 4
        },
        {
            title: '是否高速',
            name: "isHighway",
            type: 'base',
            isHaveMove: false,
            isShow: true,
            id: 5
        },
        {
            title: '最低收费',
            name: "lowestFee",
            type: 'base',
            isHaveMove: false,
            isShow: true,
            id: 6
        },
        {
            title: '是否分拣',
            name: "isPick",
            type: 'base',
            isHaveMove: false,
            isShow: true,
            id: 7
        }
    ])

    if (d && d.quotationLineExpenseItems) {
        if (isArray(d.quotationLineExpenseItems)) {
            d.quotationLineExpenseItems.forEach(item => {
                header.push(Object.assign({}, item, {type: 'cost', name: 'chargeFee'}))
            })
        }
    }
    return header
}

const getListData = (d, header) => {
    return d.map(item => {
        let element = {
            historyData: item,
            data: []
        }
        let fixed = header.filter(it => it.type === 'base' && it.isShow)
        fixed.forEach(it => {
            if (it.id === 2) {
                element.data.push({
                    itemHeader: it,
                    value: {
                        transitPlaceOneId: item.transitPlaceOneId,
                        transitPlaceOneName: item.transitPlaceOneName,
                        transitPlaceTwoId: item.transitPlaceTwoId,
                        transitPlaceTwoName: item.transitPlaceTwoName
                    }
                })
            } else {
                element.data.push({
                    itemHeader: it,
                    value: item[it.name]
                })
            }
            // element.data.push({
            //     itemHeader: it,
            //     value: item[it.name]
            // })
        })
        let deploys = header.filter(it => it.type === 'cost')
        // console.log('deploys', deploys, header)
        deploys.forEach((it, index) => {
            element.data.push({
                itemHeader: it,
                value: item.quotationLineExpenseItems[index].chargeFee || 0, 
                id: item.quotationLineExpenseItems[index].id
            })
        })
        element.id = item.id
        return element
    })
}

/**
 * 快速报价入口
 * 
 * @class ReadData
 * @extends {Component}
 */

@inject('mobxTabsData')
class ReadData extends Component {

    static defaultProps = {
        onlySetHeader: true,
        isNoneAction: true
    }

    // constructor(props) {
    //     super(props);
    // }

    headerChange = (header) => {
        const { headerChange } = this.props
        if (headerChange) {
            headerChange(header)
        }
    }

    parentGetThis = (v) => {
        const { getThis } = this.props
        if (getThis) {
            getThis(v)
        }
    }

    toCarrierListPage = (record) => { //跳到订单列表页面
        console.log('toCarrierListPage', record)
        const { mobxTabsData, mykey } = this.props
        toCarrierList(mobxTabsData, {
            pageData: {
                value: record
            }
        })
        mobxTabsData.closeTab(mykey)
        this.props.onCancel()
    }

    customColumns = (array) => {
        let obj = [
            {
                width: 300,
                className: 'text-overflow-ellipsis',
                title: <span>{'承运商/客户'}</span>,
                titleString: '承运商/客户',
                render: (text, record, index) => {
                    // console.log('record', record)
                    let s = '无'
                    let d = record.historyData
                    if (d) {
                        if (d.carrierName) {
                            s = d.carrierName
                        }
                    }
                    return (
                        <span title={s} style={{color: '#484848'}} onClick={() => this.toCarrierListPage(s)}>
                        {
                            s
                        }
                        </span>
                    )
                }
            },
            {
                width: 100,
                className: 'text-overflow-ellipsis',
                title: <span>{'运输方式'}</span>,
                titleString: '运输方式',
                render: (text, record, index) => {
                    // console.log('record', record)
                    let s = '无'
                    let d = record.historyData
                    if (d) {
                        if (d.transportModeName) {
                            s = d.transportModeName
                        }
                    }
                    return (
                        <span title={s} style={{color: '#484848'}}>
                        {
                            s
                        }
                        </span>
                    )
                }
            },
        ]
        return [...obj, ...array]
    }

    render() { 
        let { type, getData, actionView, getPopupContainer, TableHeaderChildren } = this.props
        // data = data || []
        let d = {
            defaultValue: {
                header: cloneObject(getHeaderData()),
                data: []
            }
        }
       // console.log('TableHeaderChildren', TableHeaderChildren)
        return (
            <div style={{minHeight: 500}}>
                <DynamicTable
                    {...d}
                    mode={this.props.mode}
                    quotationMethod={this.props.quotationMethod}
                    customColumns={this.customColumns}
                    getPopupContainer={getPopupContainer}
                    getThis={v => this.parentGetThis(v)}
                    actionView={actionView}
                    getData={getData}
                    headerChange={this.headerChange}
                    tableTitle={'报价详情'} 
                    onlySetHeader={true}
                    isNoneSelected={true}
                    type={type} 
                    isQuickSearchQuery={this.props.isQuickSearchQuery}
                    TableHeaderChildren={TableHeaderChildren}
                    // scroll={{x: true, y: 500}}
                />
            </div>
        )
    }
}

ReadData.getListData = getListData
ReadData.getHeaderData = getHeaderData
 
export default ReadData;