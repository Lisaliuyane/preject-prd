import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Radio } from 'antd'
import DynamicTable from './dynamic_table'
import { inject } from "mobx-react"
import { cloneObject, isArray } from '@src/utils'
import { getHeaderData } from './utils'

// import FileSaver from 'file-saver'
// import XLSX from 'xlsx'

const types = {
    '零担': 1,
    '整车': 2,
    '快递': 3,
}

const RadioButton = Radio.Button

const RadioGroup = Radio.Group

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
        })
        let deploys = header.filter(it => it.type === 'cost')
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


const dataToUpType = (d, header, type) => {
    return d.map(item => {
        let data = {}
        if (item.historyData) {
            data = item.historyData || {}
            data.isHighway = null
            data.lowestFee = null
            data.departure = null
            data.destination = null
            data.aging = null
        }
        data.quotationLineExpenseItems = []
        // let showFields = []
        header.filter(it => (('isShow' in it && it.isShow) || !('isShow' in it))).map((ele, index) => {
            if (ele.type === 'base') {
                if (ele.id === 2 && ele.title === '中转地') {
                    let value = item.data[index].value
                    let obj = {
                        transitPlaceOneId: value.transitPlaceOneId,
                        transitPlaceOneName: value.transitPlaceOneName,
                        transitPlaceTwoId: value.transitPlaceTwoId,
                        transitPlaceTwoName: value.transitPlaceTwoName
                    }
                    data = {...data, ...obj}
                    // data = Object.assign({}, data, obj)
                    // console.log('value value value', value, obj, data)
                } else {
                    data[ele.name] = item.data[index].value
                }
                // data[ele.name] = item.data[index].value
            } else if (ele.type === 'cost') {
                let id = item.data[index].id ? {id: item.data[index].id} : {}
                // delete ele.carrierQuotationLineId
                data.quotationLineExpenseItems.push({
                    ...ele,
                    ...id,
                    chargeFee: item.data[index].value || 0
                })
            }
            // showFields.push(ele)
        })
        
        if (item.historyData && item.historyData.id) {
            data.id = item.historyData.id
        }
        data.quotationType = type
        // data.showFields = showFields
        // console.log('data', data)
        return data 
    })
}

/**
 * 需求导入规划
 * 
 * @export
 * @class DynamicTableHeader
 * @extends {Component}
 */
@inject('rApi')
export default class DynamicTableHeader extends Component {

    static propTypes = {
		getThis: PropTypes.func,
		tabsTitle: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]),
        tableTitle: PropTypes.string,
        // carrierQuotationLineExpress: PropTypes.object, // 快递
        // carrierQuotationLineLtl: PropTypes.object, // 零担
        // carrierQuotationLineVehicle: PropTypes.object // 整车
        cLines: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ])// all data
    }

    state={
         /** 
            * type: 1 零担
            * type: 2 整车
            * type: 3 快递
           */
        type: 1,
        fixedsHeader: [
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
                isHaveMove: true,
                isShow: true,
                id: 4
            },
            {
                title: '是否高速',
                name: "isHighway",
                type: 'base',
                isHaveMove: true,
                isShow: false,
                id: 5
            },
            {
                title: '最低收费',
                name: "lowestFee",
                type: 'base',
                isHaveMove: true,
                isShow: false,
                id: 6
            }
        ]
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        let {
            cLines,
            quotationLines
        } = props
        cLines = cLines || quotationLines || []
        let carrierQuotationLineLtl = []
        let carrierQuotationLineVehicle = []
        let carrierQuotationLineExpress = []
        // if (isHaveAddCost) {
        //     // 零担
        //     carrierQuotationLineLtl = cLines.costTransportLtl && cLines.costTransportLtl.costTransportLines ? cLines.costTransportLtl.costTransportLines : []
        //     // 整车
        //     carrierQuotationLineVehicle = cLines.costTransportVehicle && cLines.costTransportVehicle.costTransportLines ? cLines.costTransportVehicle.costTransportLines : []
        //     // 快递
        //     carrierQuotationLineExpress = cLines.costTransportExpress && cLines.costTransportExpress.costTransportLines ? cLines.costTransportExpress.costTransportLines : []
        // } else {
        //     // 零担
        //     carrierQuotationLineLtl = cLines.filter(item => item.type === 0)
        //     // 整车
        //     carrierQuotationLineVehicle = cLines.filter(item => item.type === 1)
        //     // 快递
        //     carrierQuotationLineExpress = cLines.filter(item => item.type === 2)
        // }

        // 零担
        carrierQuotationLineLtl = cLines.filter(item => item.quotationType === 0)
        // 整车
        carrierQuotationLineVehicle = cLines.filter(item => item.quotationType === 1)
        // 快递
        carrierQuotationLineExpress = cLines.filter(item => item.quotationType === 2)
        // console.log('carrierQuotationLineExpress', carrierQuotationLineExpress)
        this.state.express = carrierQuotationLineExpress.length > 0 ?
        {
            defaultValue: {
                header: cloneObject(this.getHeaderData(carrierQuotationLineExpress[0])),
                data: cloneObject(
                    getListData(carrierQuotationLineExpress, this.getHeaderData(carrierQuotationLineExpress[0]))
                )
            }
        }
        :
        null

        this.state.ltl = carrierQuotationLineLtl.length > 0 ?
        {
            defaultValue: {
                header: cloneObject(this.getHeaderData(carrierQuotationLineLtl[0])),
                data: cloneObject(
                    getListData(carrierQuotationLineLtl, this.getHeaderData(carrierQuotationLineLtl[0]))
                )
            }
        }
        :
        null

        this.state.vehicle  = carrierQuotationLineVehicle.length > 0 ?
        {
            defaultValue: {
                header: cloneObject(this.getHeaderData(carrierQuotationLineVehicle[0])),
                data: cloneObject(
                    getListData(carrierQuotationLineVehicle, this.getHeaderData(carrierQuotationLineVehicle[0]))
                )
            }
        }
        :
        null
    }

    componentWillUnmount() {
        console.log('componentWillUnmount')
    }

    getHeaderData = (d) => {

        const { isHaveAddCost } = this.props
        if (isHaveAddCost) {
            return getHeaderData(d)
        }
        let header = []
        header.push({
            title: '起运地',
            isHaveMove: false,
            isShow: true,
            type: 'base',
            name: "departure",
            id: 1
        })
        header.push({
            title: '中转地',
            isHaveMove: false,
            isShow: true,
            type: 'base',
            name: "transitPlaceOneName",
            id: 2
        })
        header.push({
            title: '目的地',
            name: "destination",
            type: 'base',
            isHaveMove: false,
            isShow: true,
            id: 3
        })
        header.push({
            title: '时效',
            name: "aging",
            type: 'base',
            isHaveMove: false,
            isShow: true,
            id: 4
        })
        if (!isHaveAddCost) {
            header.push({
                title: '备注',
                name: 'remark',
                type: 'base',
                isHaveMove: false,
                isShow: true,
                id: 5
            })
        }

        if (d && isArray(d.quotationLineExpenseItems)) {
            d.quotationLineExpenseItems.forEach(item => {
                header.push(Object.assign({}, item, {type: 'cost', name: 'chargeFee'}))
            })
        }
        // console.log('header', header)
        return header
    }

    getValue = () => {
        let d1 = this.v1.getValue()
        let d2 = this.v2.getValue()
        let d3 = this.v3.getValue()
        // if (isHaveAddCost) {
        //     const { cLines } = this.props
        //     return {
        //         quotationLines: [...dataToUpType(d1.data, d1.header, 0), ...dataToUpType(d2.data, d2.header, 1), ...dataToUpType(d3.data, d3.header, 2)],
        //         // costTransportLtl: {
        //         //     costTransportLines: dataToUpType(d1.data, d1.header, 0).data,
        //         //     showFields: dataToUpType(d1.data, d1.header, 0).showFields,
        //         //     id: cLines && cLines.costTransportLtl ? cLines.costTransportLtl.id : null
        //         // },
        //         // costTransportVehicle: {
        //         //     costTransportLines: dataToUpType(d2.data, d2.header, 0).data,
        //         //     showFields: dataToUpType(d2.data, d2.header, 0).showFields,
        //         //     id: cLines && cLines.costTransportVehicle ? cLines.costTransportVehicle.id : null
        //         // },
        //         // costTransportExpress: {
        //         //     costTransportLines: dataToUpType(d3.data, d3.header, 0).data,
        //         //     showFields: dataToUpType(d3.data, d3.header, 0).showFields,
        //         //     id: cLines && cLines.costTransportExpress ? cLines.costTransportExpress.id : null
        //         // },
        //         removeQuotationLineId: [...d1.removeQuotationLineId, ...d2.removeQuotationLineId, ...d3.removeQuotationLineId],
        //         removeQuotationLineItemIds: [...d1.removeQuotationLineItemIds, ...d2.removeQuotationLineItemIds, ...d3.removeQuotationLineItemIds]
        //     }
        // }
        return {
            data: [...dataToUpType(d1.data, d1.header, 0), ...dataToUpType(d2.data, d2.header, 1), ...dataToUpType(d3.data, d3.header, 2)],
            removeQuotationLineId: [...d1.removeQuotationLineId, ...d2.removeQuotationLineId, ...d3.removeQuotationLineId],
            removeQuotationLineItemIds: [...d1.removeQuotationLineItemIds, ...d2.removeQuotationLineItemIds, ...d3.removeQuotationLineItemIds]
        }
    }

    onExportData = ({header, type}) => {
        const { id, rApi } = this.props
        rApi.exportQuotationTemp('?showFields=' + JSON.stringify(header) + '&quotationType=' + (type - 1) + '&id=' + id).then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', '报价.xlsx')
            document.body.appendChild(link)
            link.click()
        })
    }
    

    render() {
        const { 
            type, 
            express, 
            ltl, 
            vehicle, 
            fixedsHeader,
        } = this.state
        const { style, isHaveAddCost, tabsTitle, isNoAction, buttonsControl } = this.props
        const {
            tableTitle
        } = this.props
        let fixeds = isHaveAddCost ? fixedsHeader.filter(item => item.id !== 5 && item.id !== 6 && item.id !== 7) : fixedsHeader
        if (isHaveAddCost) {
            fixeds.push({
                title: '备注',
                name: 'remark',
                type: 'base',
                isHaveMove: false,
                isShow: true,
                id: 8
            })
        }
        let showButtons = isHaveAddCost ? 
        {
            1: 1,
            2: 1,
            6: 1
        }
        :
        {
            1: 1,
            2: 1
        }

        showButtons = {...showButtons, ...buttonsControl}
        // console.log('fixeds', fixeds)
        return (
            <div style={style}>
                {
                    // <DynamicTable
                    // {...ltl}  
                    // showButtons={showButtons}
                    // style={{padding: 0}}
                    // key={'lti1'} 
                    // onExportData={this.onExportData} 
                    // fixedsHeader={fixedsHeader}
                    // isNoneSelected={true}
                    // tableTitle={tableTitle} 
                    // type={type} 
                    // getThis={v => this.v = v} />
                }
                <div style={{marginTop: 20}} className='flex flex-vertical-center dynamic-table-header-line'>
                    <div>
                        <span style={{margin: '0 20px'}}>{tabsTitle}</span>
                    </div>
                    <div>
                        <RadioGroup onChange={value => {this.setState({type: value.target.value})}} defaultValue={1}>
                            {
                                Object.keys(types).map((item, index) => {
                                    return (
                                        <RadioButton key={item} value={types[item]}>{item}</RadioButton>
                                    )
                                })
                            }
                        </RadioGroup>
                    </div>
                </div>
                <div style={{display: type === 1 ? 'block' : 'none'}}>
                    <DynamicTable 
                        {...ltl} 
                        isNoneAction={isNoAction}
                        showButtons={showButtons}
                        style={{padding: 0}}
                        onExportData={this.onExportData} 
                        fixedsHeader={fixeds}
                        isNoneSelected={true}
                        tableTitle={tableTitle} 
                        type={1} 
                        getThis={v => this.v1 = v} />
                </div>
                <div style={{display: type === 2 ? 'block' : 'none'}}>
                    <DynamicTable 
                        {...vehicle}
                        isNoneAction={isNoAction} 
                        showButtons={showButtons}
                        style={{padding: 0}}
                        onExportData={this.onExportData} 
                        fixedsHeader={fixeds}
                        isNoneSelected={true}
                        tableTitle={tableTitle} 
                        type={2} 
                        getThis={v => this.v2 = v} />
                </div>
                <div style={{display: type === 3 ? 'block' : 'none'}}>
                    <DynamicTable 
                        {...express}
                        isNoneAction={isNoAction}
                        showButtons={showButtons}
                        style={{padding: 0}}
                        onExportData={this.onExportData} 
                        fixedsHeader={fixeds}
                        isNoneSelected={true}
                        tableTitle={tableTitle} 
                        type={3} 
                        getThis={v => this.v3 = v} />
                </div>
            </div>
        )
    }
}
 
// export default DynamicTableHeader;