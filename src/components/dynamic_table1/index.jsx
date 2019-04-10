import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Radio } from 'antd'
import DynamicTable from './dynamic_table'
import { inject } from "mobx-react"

// import FileSaver from 'file-saver'
// import XLSX from 'xlsx'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

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
//     console.log('d.lowestFee', d.lowestFee, header)
//     if (isArray(d.quotationLineExpenseItems)) {
//         d.quotationLineExpenseItems.forEach(item => {
//             header.push(Object.assign({}, item, {type: 'cost', name: 'chargeFee'}))
//         })
//     }
//     return header
// }

// const getListData = (d, header) => {
//     return d.map(item => {
//         let element = {
//             historyData: item,
//             data: []
//         }
//         let fixed = header.filter(it => it.type === 'base' && it.isShow)
//         fixed.forEach(it => {
//             if (it.id === 2) {
//                 element.data.push({
//                     itemHeader: it,
//                     value: {
//                         transitPlaceOneId: item.transitPlaceOneId,
//                         transitPlaceOneName: item.transitPlaceOneName,
//                         transitPlaceTwoId: item.transitPlaceTwoId,
//                         transitPlaceTwoName: item.transitPlaceTwoName
//                     }
//                 })
//             } else {
//                 element.data.push({
//                     itemHeader: it,
//                     value: item[it.name]
//                 })
//             }
//         })
//         // console.log('getListData', d, header, fixed, element)
//         let deploys = header.filter(it => it.type === 'cost')
//         deploys.forEach((it, index) => {
//             // console.log('deploys', item, index)
//             element.data.push({
//                 itemHeader: it,
//                 value: item.quotationLineExpenseItems[index] ? item.quotationLineExpenseItems[index].chargeFee || 0 : 0, 
//                 id: item.quotationLineExpenseItems[index] ? item.quotationLineExpenseItems[index].id : null
//             })
//         })
//         element.id = item.id
//         return element
//     })
// }

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
        // console.log('dataToUpType', item)
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
                } else {
                    data[ele.name] = item.data[index].value
                }
            } else if (ele.type === 'cost') {
                let id = (item.data[index] && item.data[index].id) ? {id: item.data[index].id} : {}
                // delete ele.carrierQuotationLineId
                data.quotationLineExpenseItems.push({
                    ...ele,
                    ...id,
                    chargeFee: item.data[index] && item.data[index].value || 0
                })
            }
            // showFields.push(ele)
        })
        
        if (item.historyData && item.historyData.id) {
            data.id = item.historyData.id
        }
        data.quotationType = type
        // data.showFields = showFields
        return data 
    })
}

@inject('rApi')
export default class DynamicTableHeader extends Component {

    static propTypes = {
		getThis: PropTypes.func,
		tabsTitle: PropTypes.string,
        tableTitle: PropTypes.string,
        getHeaderUrl: PropTypes.string,
        getDataUrl: PropTypes.string,
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
        type: null,
        defaultValue: {}
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        let {
            quotationLines 
        } = props
        quotationLines = quotationLines || []

        // console.log('carrierQuotationLineLtl', carrierQuotationLineLtl, quotationLines)
        if (props.mode && props.mode.checkedArrValue) {
            this.state.type = props.mode.checkedArrValue[0].businessModeId
        }
        if (props.tableHeader) {
            this.state.defaultValue = {
                defaultValue: {
                    header: props.tableHeader,
                    data: []
                }
            }
        }
        
              
        // this.state.express = carrierQuotationLineExpress.length > 0 ?
        // {
        //     defaultValue: {
        //         header: cloneObject(getHeaderData(carrierQuotationLineExpress[0])),
        //         data: cloneObject(
        //             getListData(carrierQuotationLineExpress, getHeaderData(carrierQuotationLineExpress[0]))
        //         )
        //     }
        // }
        // :
        // null

        // this.state.ltl = carrierQuotationLineLtl.length > 0 ?
        // {
        //     defaultValue: {
        //         header: cloneObject(getHeaderData(carrierQuotationLineLtl[0])),
        //         data: cloneObject(
        //             getListData(carrierQuotationLineLtl, getHeaderData(carrierQuotationLineLtl[0]))
        //         )
        //     }
        // }
        // :
        // null

        // this.state.vehicle  = carrierQuotationLineVehicle.length > 0 ?
        // {
        //     defaultValue: {
        //         header: cloneObject(getHeaderData(carrierQuotationLineVehicle[0])),
        //         data: cloneObject(
        //             getListData(carrierQuotationLineVehicle, getHeaderData(carrierQuotationLineVehicle[0]))
        //         )
        //     }
        // }
        // :
        // null
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.mode.transportModeId === nextProps.activeMode.transportModeId) {
            // console.log('componentWillReceiveProps', nextProps.mode, this.props.mode)
            if (nextProps.mode.transportModeId !== this.props.mode.transportModeId) {
                this.setState({
                    type: nextProps.mode.checkedArrValue[0].businessModeId
                })
            } else {
                let filter = nextProps.mode.checkedArrValue.filter(item => {
                    return this.state.type === item.businessModeId
                })
                if (!filter || filter.length < 1) {
                    this.setState({
                        type: nextProps.mode.checkedArrValue[0].businessModeId
                    })
                }
            }
        }
    }

    componentWillUnmount() {
        // console.log('componentWillUnmount')
    }

    getValue = () => {
        const { mode } = this.props
        let checkedArrValue = mode.checkedArrValue
        let removeQuotationLineId = []
        let removeQuotationLineItemIds = []
        let data = checkedArrValue.map(item => {
            let values = this['v' + item.businessModeId].getValue()
            removeQuotationLineId = [...removeQuotationLineId, ...values.removeQuotationLineId]
            removeQuotationLineItemIds = [...removeQuotationLineItemIds, ...values.removeQuotationLineItemIds]
            let obj = {
                quotationLines: dataToUpType(values.data, values.header, 0),
                businessModeId: item.businessModeId,
                businessModeName: item.businessModeName,
                transportModeId: mode.transportModeId,
                transportModeName: mode.transportModeName,
                id: item.id,
                quotationId: mode.quotationId,
            }
            if (!obj.id) {
                delete obj.id
                delete obj.quotationId
            }
            return obj
        })
        // let d1 = this.d1.getValue()
        // let d2 = this.d2.getValue()
        // let d3 = this.d3.getValue()
        return {
            // carrierQuotationLineLtl: {
            //     quotationLineData: d1.data.map(item => {
            //         if (item && item[item.length - 1] && item[item.length - 1].id) {
            //             item = item[item.length - 1].id
            //         }
            //         return item
            //     }),
            //     header: d1.header.map(item => (item.itemHeader || item))
            // },
            // carrierQuotationLineVehicle: {
            //     quotationLineData: d2.data.map(item => {
            //         if (item && item[item.length - 1] && item[item.length - 1].id) {
            //             item = item[item.length - 1].id
            //         }
            //         return item
            //     }),
            //     header: d2.header.map(item => (item.itemHeader || item))
            // },
            // carrierQuotationLineExpress: {
            //     quotationLineData: d3.data.map(item => {
            //         if (item && item[item.length - 1] && item[item.length - 1].id) {
            //             item = item[item.length - 1].id
            //         }
            //         return item
            //     }),
            //     header: d3.header.map(item => (item.itemHeader || item))
            // },
            data: data,
            // quotationLines: [...dataToUpType(d1.data, d1.header, 0), ...dataToUpType(d2.data, d2.header, 1), ...dataToUpType(d3.data, d3.header, 2)],
            removeQuotationLineId: removeQuotationLineId,
            removeQuotationLineItemIds: removeQuotationLineItemIds
        }
    }

    onExportData = ({header, type, id, businessModeId, transportModeId}) => {
        const { rApi, getDataUrl, xmlTitle } = this.props
        let url = getDataUrl + '?showFields=' + JSON.stringify(header) + '&id=' + id + '&transportModeId=' + transportModeId + '&businessModeId=' + businessModeId
        rApi.exportQuotationTemp(url).then(res => {
            // console.log('res', res.data)
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${xmlTitle ? xmlTitle : '报价'}.xlsx`)
            document.body.appendChild(link)
            link.click()
        })
    }

    onExportQuotationData = ({id, businessModeId, businessModeName, transportModeId, transportModeName}) => { //导出报价单
        const { rApi, getQuotationDataUrl, xmlTitle } = this.props
        let url = getQuotationDataUrl + '?' + 'id=' + id + '&transportModeId=' + transportModeId + '&transportModeName=' + transportModeName + '&businessModeId=' + businessModeId + '&businessModeName=' + businessModeName
        rApi.exportQuotationTemp(url).then(res => {
            // console.log('res', res.data)
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${xmlTitle ? xmlTitle : '报价单'}.xls`)
            document.body.appendChild(link)
            link.click()
        })
    }

    render() {
        const { type, defaultValue } = this.state
        const { style, buttonsControl, tableHeight, mode, viewType, getDataMethod, activeMode, isShowQuotationExportData } = this.props
        let typeProps = viewType
        let isNoAction = false
        if (typeProps === 2) {
            isNoAction = true
        } else if ('isNoneAction' in this.props) {
            isNoAction = this.props.isNoneAction
        }
        // let isNoAction = typeProps === 2 ?  true : false
        let showButtons = typeProps === 2 ? 
        {
            3: 1,
            4: 1,
            7: isShowQuotationExportData ? 1 : 0
        }
        :
        {
            1: 1,
            2: 1,
            3: 1,
            4: 1,
            5: 1,
            6: 1,
            7: isShowQuotationExportData ? 1 : 0
            
        }
        showButtons = {...showButtons, ...buttonsControl}
        const checkedArrValue = mode.checkedArrValue
        // console.log('mode', mode)
        return (
            <div style={style}>
                {/* <div className='flex flex-vertical-center dynamic-table-header-line'>
                    <div>
                        <RadioGroup 
                            onChange={value => {this.setState({type: value.target.value})}} 
                            value={type}
                            >
                            {
                                checkedArrValue.map((item, index) => {
                                    return (
                                        <RadioButton key={item.businessModeId} value={item.businessModeId}>{item.businessModeName}</RadioButton>
                                    )
                                })
                            }
                        </RadioGroup>
                    </div>
                </div> */}
                {
                    checkedArrValue.map(item => {
                        return (
                            <div key={item.businessModeId} style={{display: type === item.businessModeId ? 'block' : 'none'}}>
                                <DynamicTable
                                    mode={{
                                        ...mode,
                                        ...item
                                    }}
                                    activeMode={{
                                        businessModeId: type,
                                        transportModeId: activeMode.transportModeId
                                    }}
                                    getPopupContainer={this.props.getPopupContainer}
                                    active={
                                        item.businessModeId === type && mode.transportModeId === activeMode.transportModeId
                                    }
                                    getDataMethod={getDataMethod}
                                    key={item.businessModeId}
                                    isNoneA
                                    isNoneSelected={true}
                                    showButtons={showButtons}
                                    isNoneAction={isNoAction}
                                    tableHeight={tableHeight}
                                    onExportData={this.onExportData} 
                                    onExportQuotationData={this.onExportQuotationData}
                                    // {...ltl}
                                    // defaultValue
                                    {...defaultValue}
                                    tableTitle={
                                        <div style={{marginLeft: '-10px'}}>
                                            <RadioGroup 
                                                onChange={value => {this.setState({type: value.target.value})}} 
                                                value={type}
                                                >
                                                {
                                                    checkedArrValue.map((item, index) => {
                                                        return (
                                                            <RadioButton style={{borderRadius: 0}}key={item.businessModeId} value={item.businessModeId}>{item.businessModeName}</RadioButton>
                                                        )
                                                    })
                                                }
                                            </RadioGroup>
                                        </div>
                                    } 
                                    type={type} 
                                    getThis={v => this['v' + item.businessModeId] = v} 
                                    quotationMethod={this.props.quotationMethod}
                                    isCustoms={this.props.isCustoms}
                                    noBordered={this.props.noBordered}
                                    />
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
 
// export default DynamicTableHeader;