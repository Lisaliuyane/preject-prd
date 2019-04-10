import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import { Radio } from 'antd'
import DynamicTable from './dynamic_table'
import { inject } from "mobx-react"
import { cloneObject } from '@src/utils'
import { getHeaderData, getListData } from './utils'
import { resolve } from 'upath';
import { rejects } from 'assert';

// import FileSaver from 'file-saver'
// import XLSX from 'xlsx'

// const RadioButton = Radio.Button

// const RadioGroup = Radio.Group

/**
 * 数据转表头
 * @param {数据} d 
 * {
                title: '起运地',
                isHaveMove: false,
                isShow: true,
                name: "departure",
                id: 1
            },
            {
                title: '目的地',
                name: "destination",
                isHaveMove: false,
                isShow: true,
                id: 2
            },
            {
                title: '时效',
                name: "aging",
                isHaveMove: true,
                isShow: true,
                id: 3
            },
            {
                title: '是否高速',
                name: "isHighway",
                isHaveMove: true,
                isShow: true,
                id: 4
            }
 */
// const getHeaderData = (d) => {
//     let header = []
//     header.push({
//         title: '起运地',
//         isHaveMove: false,
//         isShow: true,
//         type: 'base',
//         name: 'departure',
//         id: 1
//     })
//     header.push({
//         title: '目的地',
//         isHaveMove: false,
//         isShow: true,
//         type: 'base',
//         name: "destination",
//         id: 2
//     })
//     if (d.aging !== null) {
//         header.push({
//             title: '时效',
//             isHaveMove: true,
//             isShow: true,
//             type: 'base',
//             name: "aging",
//             id: 3
//         })
//     } else {
//         header.push({
//             title: '时效',
//             isHaveMove: true,
//             isShow: false,
//             type: 'base',
//             name: "aging",
//             id: 3
//         })
//     }

//     if (d.isHighway !== null) {
//         header.push({
//             title: '是否高速',
//             isHaveMove: true,
//             isShow: true,
//             type: 'base',
//             name: "isHighway",
//             id: 4
//         })
//     } else {
//         header.push({
//             title: '是否高速',
//             isHaveMove: true,
//             isShow: false,
//             type: 'base',
//             name: "isHighway",
//             id: 4
//         })
//     }

//     if (d.lowestFee !== null) {
//         header.push({
//             title: '最低收费',
//             isHaveMove: true,
//             isShow: true,
//             type: 'base',
//             name: "lowestFee",
//             id: 5
//         })
//     } else {
//         header.push({
//             title: '最低收费',
//             isHaveMove: true,
//             isShow: false,
//             type: 'base',
//             name: "lowestFee",
//             id: 5
//         })
//     }

//     if (d.lowestFee !== null) {
//         header.push({
//             title: '最低收费',
//             isHaveMove: true,
//             isShow: true,
//             type: 'base',
//             name: "lowestFee",
//             id: 5
//         })
//     } else {
//         header.push({
//             title: '最低收费',
//             isHaveMove: true,
//             isShow: false,
//             type: 'base',
//             name: "lowestFee",
//             id: 5
//         })
//     }
//     if (isArray(d.quotationLineExpenseItems)) {
//         d.quotationLineExpenseItems.forEach(item => {
//             header.push(Object.assign({}, item, {type: 'cost', name: 'chargeFee'}))
//         })
//     }
//     return header
// }

// const getListData = (d, header) => {
//     console.log('getListData', d)
//     return d.map(item => {
//         let element = {
//             historyData: item,
//             data: []
//         }
//         let fixed = header.filter(it => it.type === 'base' && it.isShow)
//         fixed.forEach(it => {
//             element.data.push({
//                 itemHeader: it,
//                 value: item[it.name]
//             })
//         })
//         let deploys = header.filter(it => it.type === 'cost')
//         deploys.forEach((it, index) => {
//             element.data.push({
//                 itemHeader: it,
//                 value: item.quotationLineExpenseItems[index].chargeFee || 0, 
//                 id: item.quotationLineExpenseItems[index].id
//             })
//         })
//         element.id = item && item.id ? item.id : null
//         return element
//     })
// }

// const dataToUpType = (d, header, type) => {
//     return d.map(item => {
//         let data = {}
//         if (item.historyData) {
//             data = item.historyData || {}
//             data.isHighway = null
//             data.lowestFee = null
//             data.departure = null
//             data.destination = null
//             data.aging = null
//         }
//         data.quotationLineExpenseItems = []
//         let showFields = []
//         header.filter(it => (('isShow' in it && it.isShow) || !('isShow' in it))).map((ele, index) => {
//             if (ele.type === 'base') {
//                 data[ele.name] = item.data[index].value
//             } else if (ele.type === 'cost') {
//                 let id = item.data[index].id ? {id: item.data[index].id} : {}
//                 delete ele.carrierQuotationLineId
//                 data.quotationLineExpenseItems.push({
//                     ...ele,
//                     ...id,
//                     chargeFee: item.data[index].value || 0
//                 })
//             }
//             showFields.push(ele)
//         })
        
//         if (item.historyData && item.historyData.id) {
//             data.id = item.historyData.id
//         }
//         data.quotationType = type
//         data.showFields = showFields
//         return data 
//     })
// }

/**
 * 单条数据显示入口
 * 
 * @export
 * @class DynamicTableHeader
 * @extends {Component}
 */
@inject('rApi')
export default class DynamicTableHeader extends Component {

    static propTypes = {
		getThis: PropTypes.func,
		tabsTitle: PropTypes.string,
        tableTitle: PropTypes.string,
        // carrierQuotationLineExpress: PropTypes.object, // 快递
        // carrierQuotationLineLtl: PropTypes.object, // 零担
        // carrierQuotationLineVehicle: PropTypes.object // 整车
        quotationLines: PropTypes.array // all data
    }

    state={
         /** 
            * type: 1 零担
            * type: 2 整车
            * type: 3 快递
           */
        type: 1,
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        const type = this.state.type
        let {
            quotationLines 
        } = props
        //console.log('quotationLines', quotationLines)
        // this.state.mode = {
        //     businessModeId: quotationLines[0].businessModeId,
        //     // quotationId: mode.quotationId,
        //     quotationId: quotationLines[0].id,
        //     transportModeId: quotationLines[0].transportModeId,
        // }
        // this.state.express = quotationLines.length > 0 ?
        // {
        //     defaultValue: {
        //         header: cloneObject(getHeaderData(quotationLines[0])),
        //         data: cloneObject(
        //             getListData(quotationLines, getHeaderData(quotationLines[0]))
        //         )
        //     }
        // }
        // :
        // null
    }

    componentWillUnmount() {
        //console.log('componentWillUnmount')
    }

    getData = () => {
        const { quotationLines } = this.props
        // console.log('getData', quotationLines)
        return new Promise((resolve, reject) => {
            //quotationLines[0].id = 'detail' + quotationLines[0].id
            // quotationLines[0].id = quotationLines[0].id
            //console.log('getListData(quotationLines, getHeaderData(quotationLines[0]))', getListData(quotationLines, getHeaderData(quotationLines[0])))
            resolve({
                dataSource: getListData(quotationLines, getHeaderData(quotationLines[0])),
                total: quotationLines && quotationLines.length || 0
            })
        })
        // rApi.getOnceQuotation({
        //     // quotationType,
        //     quotationClassify,
        //     id: record.id
        // }).then(res => {
        //     console.log('getOnceQuotation', res)
        //     this.setState({
        //         quotationLines: [res]
        //     })
        // })
    }

    render() {
        const { type, express } = this.state
        const { style, getPopupContainer, quotationLines } = this.props
        // const {
        //     tableTitle,
        //     tabsTitle,
        //     carrierQuotationLineExpress,
        //     carrierQuotationLineLtl,
        //     carrierQuotationLineVehicle 
        // } = this.props
        return (
            <div style={style}>
                <DynamicTable 
                    {...express}
                    getData={this.getData}
                    isNoneAction={true}
                    isNoneHeader={true}
                    isNonePagination={true}
                    isNoneNum={true}
                    isNoneSelected={true}
                    defaultValue={{
                        header: quotationLines && quotationLines.length > 0 ? getHeaderData(quotationLines[0]) : null,
                        data: []
                    }}
                    getPopupContainer={getPopupContainer}
                    getThis={v => this.v = v} />
            </div>
        )
    }
}
 
// export default DynamicTableHeader;