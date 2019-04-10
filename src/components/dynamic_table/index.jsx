import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Radio } from 'antd'
import DynamicTable from './dynamic_table'
import { inject } from "mobx-react"
import { cloneObject } from '@src/utils'

// import FileSaver from 'file-saver'
// import XLSX from 'xlsx'

const types = {
    '零担': 1,
    '整车': 2,
    '快递': 3,
}

const RadioButton = Radio.Button

const RadioGroup = Radio.Group

@inject('rApi')
export default class DynamicTableHeader extends Component {

    static propTypes = {
		getThis: PropTypes.func,
		tabsTitle: PropTypes.string,
        tableTitle: PropTypes.string,
        carrierQuotationLineExpress: PropTypes.object, // 快递
        carrierQuotationLineLtl: PropTypes.object, // 零担
        carrierQuotationLineVehicle: PropTypes.object // 整车
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
        const {
            tableTitle,
            tabsTitle,
            carrierQuotationLineExpress,
            carrierQuotationLineLtl,
            carrierQuotationLineVehicle 
        } = props
        this.state.express = carrierQuotationLineExpress && carrierQuotationLineExpress.header && carrierQuotationLineExpress.quotationLineData && carrierQuotationLineExpress.quotationLineData.length > 0 ?
        {
            defaultValue: {
                header: carrierQuotationLineExpress.header.map(item => {
                    return JSON.parse(item)
                }),
                data: cloneObject(carrierQuotationLineExpress.quotationLineData.map((item, index) => {
                    if (item[item.length - 1] && !item[item.length - 1].id) {
                        item[item.length - 1]  = {
                            id: item[item.length - 1]
                        }
                    }
                    return item
                }))
            }
        }
        :
        null

        this.state.ltl = carrierQuotationLineLtl && carrierQuotationLineLtl.header && carrierQuotationLineLtl.quotationLineData && carrierQuotationLineLtl.quotationLineData.length > 0 ?
        {
            defaultValue: {
                header: carrierQuotationLineLtl.header.map(item => {
                    return JSON.parse(item)
                }),
                data: cloneObject(carrierQuotationLineLtl.quotationLineData.map((item, index) => {
                    if (item[item.length - 1] && !item[item.length - 1].id) {
                        item[item.length - 1]  = {
                            id: item[item.length - 1]
                        }
                    }
                    return item
                }))
            }
        } 
        :
        null

        this.state.vehicle = carrierQuotationLineVehicle && carrierQuotationLineVehicle.header && carrierQuotationLineVehicle.quotationLineData && carrierQuotationLineVehicle.quotationLineData.length > 0 ?
        {
            defaultValue: {
                header: carrierQuotationLineVehicle.header.map(item => {
                    return JSON.parse(item)
                }),
                data: cloneObject(carrierQuotationLineVehicle.quotationLineData.map((item, index) => {
                    if (item[item.length - 1] && !item[item.length - 1].id) {
                        item[item.length - 1]  = {
                            id: item[item.length - 1]
                        }
                    }
                    return item
                }))
            }
        }
        :
        null
    }

    componentWillUnmount() {
        console.log('componentWillUnmount')
    }

    getValue = () => {
        let d1 = this.d1.getValue()
        let d2 = this.d2.getValue()
        let d3 = this.d3.getValue()
        return {
            carrierQuotationLineLtl: {
                quotationLineData: d1.data.map(item => {
                    if (item && item[item.length - 1] && item[item.length - 1].id) {
                        item = item[item.length - 1].id
                    }
                    return item
                }),
                header: d1.header.map(item => (item.itemHeader || item))
            },
            carrierQuotationLineVehicle: {
                quotationLineData: d2.data.map(item => {
                    if (item && item[item.length - 1] && item[item.length - 1].id) {
                        item = item[item.length - 1].id
                    }
                    return item
                }),
                header: d2.header.map(item => (item.itemHeader || item))
            },
            carrierQuotationLineExpress: {
                quotationLineData: d3.data.map(item => {
                    if (item && item[item.length - 1] && item[item.length - 1].id) {
                        item = item[item.length - 1].id
                    }
                    return item
                }),
                header: d3.header.map(item => (item.itemHeader || item))
            },
            removeQuotationLineId: [...d1.removeQuotationLineId, ...d2.removeQuotationLineId, ...d3.removeQuotationLineId]
        }
    }

    onExportData = ({header, type}) => {
        const { id, rApi } = this.props
        rApi.exportQuotationTemp('?showFields=' + JSON.stringify(header) + '&quotationType=' + (type - 1) + '&id=' + id).then(res => {
            // console.log('res', res.data)
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', '报价.xlsx')
            document.body.appendChild(link)
            link.click()
            // var wopts = { bookType:'xlsx', bookSST:false, type:'array' };
            // var wbout = XLSX.write(res, wopts)
            // console.log('a', {a: res}, s2ab)
            // FileSaver.saveAs(new Blob([s2ab(res)],{type:"application/octet-stream"}), "test.xlsx")
        })
    }

    render() {
        const { type, express, ltl, vehicle } = this.state
        const { style } = this.props
        const {
            tableTitle,
            tabsTitle,
            carrierQuotationLineExpress,
            carrierQuotationLineLtl,
            carrierQuotationLineVehicle 
        } = this.props
        // let express = carrierQuotationLineExpress && carrierQuotationLineExpress.quotationLineData && carrierQuotationLineExpress.quotationLineData.length > 0 ?
        // {
        //     defaultValue: {
        //         header: carrierQuotationLineExpress.header.map(item => {
        //             return JSON.parse(item)
        //         }),
        //         data: carrierQuotationLineExpress.quotationLineData.map((item, index) => {
        //             item[item.length - 1]  = {
        //                 id: item[item.length - 1]
        //             }
        //             return item
        //         })
        //     }
        // }
        // :
        // null

        // let ltl = carrierQuotationLineLtl && carrierQuotationLineLtl.quotationLineData && carrierQuotationLineLtl.quotationLineData.length > 0 ?
        // {
        //     defaultValue: {
        //         header: carrierQuotationLineLtl.header.map(item => {
        //             return JSON.parse(item)
        //         }),
        //         data: carrierQuotationLineLtl.quotationLineData.map((item, index) => {
        //             item[item.length - 1]  = {
        //                 id: item[item.length - 1]
        //             }
        //             return item
        //         })
        //     }
        // } 
        // :
        // null

        // let vehicle = carrierQuotationLineVehicle && carrierQuotationLineVehicle.quotationLineData && carrierQuotationLineVehicle.quotationLineData.length > 0 ?
        // {
        //     defaultValue: {
        //         header: carrierQuotationLineVehicle.header.map(item => {
        //             return JSON.parse(item)
        //         }),
        //         data: carrierQuotationLineVehicle.quotationLineData.map((item, index) => {
        //             item[item.length - 1]  = {
        //                 id: item[item.length - 1]
        //             }
        //             return item
        //         })
        //     }
        // }
        // :
        // null

        // console.log('DynamicTableHeader', express, ltl, vehicle)
        return (
        <div style={style}>
            <div className='flex flex-vertical-center dynamic-table-header-line'>
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
                key={'lti1'} 
                onExportData={this.onExportData} 
                {...ltl} 
                tableTitle={tableTitle} 
                type={type} 
                getThis={v => this.d1 = v} />
            </div>
            <div style={{display: type === 2 ? 'block' : 'none'}}>
                <DynamicTable 
                key={'lti2'} 
                onExportData={this.onExportData} 
                {...vehicle} 
                tableTitle={tableTitle} 
                type={type} 
                getThis={v => this.d2 = v} />
            </div>
            <div style={{display: type === 3 ? 'block' : 'none'}}>
                <DynamicTable  key={'lti3'} 
                onExportData={this.onExportData} 
                {...express} 
                tableTitle={tableTitle} 
                type={type} 
                getThis={v => this.d3 = v} />
            </div>
        </div>
        )
    }
}
 
// export default DynamicTableHeader;