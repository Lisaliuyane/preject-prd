import React, { Component } from 'react'
import { inject, observer } from "mobx-react"
import Modal from '@src/components/modular_window'
import { HeaderView, Table, Parent } from '@src/components/table_template'
import { children, id } from './power_hide'
import QuotationSelect from '@src/components/dynamic_table1/select'
import { message, Radio } from 'antd'
import moment from 'moment'
import ShowDetail from '@src/views/layout/like_quotation/detail'
import './quotation.less'
const power = Object.assign({}, children, id)

@inject('rApi')
class Quotation extends Parent {
    state={
        open: false,
        quotationNumber: null, //报价单号
        createTime: null, //报价日期
        limit: 10,
        offset: 0,
        clientQuotationType: 1,
        keyWords: null, //关键字
        quotationStatus: 4,//报价状态
        transportation: [], //运输方式
        checkValue: '',
        noFirst: false
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                title: '报价单号',
                dataIndex: 'quotationNumber',
                key: 'quotationNumber',
                width: 160,
                render: (text, r, index) => {
                    return(
                        <span title={r.quotationNumber}>{r.quotationNumber ? r.quotationNumber : '无'}</span>
                        //console.log('r',r)
                    )
                }
            },
            {
                width: 140,
                className: 'text-overflow-ellipsis',
                title: '客户名称',
                dataIndex: 'clientName',
                key: 'clientName',
                render: (text, r, index) => {
                    return(
                        <span title={r.clientName}>{r.clientName ? r.clientName : '无'}</span>
                        //console.log('r',r)
                    )
                }
            },
            {
                width: 120,
                className: 'text-overflow-ellipsis',
                title: '业务需求名称',
                dataIndex: 'demandName',
                key: 'demandName',
                render: (text, r, index) => {
                    return(
                        <span>{r.demandName ? r.demandName : '无'}</span>
                    )
                }
            },
            {
                width: 120,
                className: 'text-overflow-ellipsis',
                title: '有效日期',
                dataIndex: 'effectiveDate',
                key: 'effectiveDate',
                render: (text, r, index) => {
                    return(
                        <span>{r.effectiveDate ? `${moment(r.effectiveDate).format('YYYY/MM/DD')}-${moment(r.expirationDate).format('YYYY/MM/DD')}` : '无'}</span>
                    )
                }
            },
            {
                width: 120,
                className: 'text-overflow-ellipsis',
                title: '状态',
                dataIndex: 'reviewStatus',
                key: 'reviewStatus',
                render: (text, r, index) => {
                    return(
                        <span>
                        {
                            r.reviewStatus === 1 ? 
                            '保存待提交'
                            :
                            r.reviewStatus === 2 ?
                            '提交待审核'
                            :
                            r.reviewStatus === 3 ?  
                            '驳回'
                            :
                            r.reviewStatus === 4 ?
                            '已生效'
                            :
                            r.reviewStatus === 6 ?
                            '已失效'
                            :
                            '无' 
                        }
                        </span>
                    )
                }
            },
            {
                width: 120,
                className: 'text-overflow-ellipsis',
                title: '制单人',
                dataIndex: 'operatePersonName',
                key: 'operatePersonName',
                render: (text, r, index) => {
                    return(
                        <span>{r.operatePersonName ? r.operatePersonName : '无'}</span>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '报价日期',
                dataIndex: 'createTime',
                key: 'createTime',
                render: (text, r, index) => {
                    return(
                        <span>{ r.createTime ? moment(r.createTime).format('YYYY/MM/DD'): '无'}</span>
                    )
                }
            }
        ]
    }

    show = (state) => {
        this.setState({
            ...state,
            open: true
        })
    }

    changeOpen = (status) => {
        this.setState({
            open: status,
            checkValue: '',
            noFirst: false
        })
    }

    close = () => {
        this.changeOpen(false)
    }

    selectRow = item => {
        // console.log('selectRow', item)
        const { selectRow } = this.props
        if (selectRow) {
            selectRow(item || {})
            this.close()
        }
    }

    // getData = (params) => {
    //     // console.log('getData')
    //     const {
    //         quotationNumber, //报价单号
    //         createTime, //报价日期
    //         limit,
    //         offset,
    //         clientQuotationType,
    //         keyWords, //关键字
    //         quotationStatus, //报价状态
    //     } = this.state
    //     params = Object.assign({}, {quotationNumber, createTime, limit, offset, clientQuotationType, keyWords, quotationStatus }, params)
    //     // console.log('params', params, limit)
    //     const { rApi } = this.props
    //     return new Promise((resolve, reject) => {
    //         rApi.getClientQuotation(params).then(d => {
    //             resolve({
    //                 dataSource: d.records || [], 
    //                 total: d.total
    //             })
    //         }).catch(err => {
    //             reject(err)
    //         })
    //     })
    // }

    // showMore = (record) => {
    //     // console.log('showMore record', record)
    //     // this.addoredit.show({
    //     //     edit: false,
    //     //     data: record
    //     // })
    //     const { showMore } = this.props
    //     if (showMore) {
    //         showMore(record)
    //     }
    // }

    showMore = (record) => {
        // console.log('record', record)
        const {
            quotationType,
            rApi
        } = this.props
        rApi.getOnceQuotation({
            // quotationType,
            quotationClassify: 3,
            id: record.id
        }).then(res => {
            this.moreview.show({
                list: [record],
                quotationType: quotationType,
                quotationClassify: 3,
                id: record.id,
                record: record,
                title: '费用明细',
                types: {
                    [quotationType]: ''
                },
                wheres: {
                    3: ''
                }
            })
        })
    }

    actionView = ({record}) => {
        //console.log('actionView', record)
        return [
            <span key='1' onClick={() => this.showMore(record)} className={`action-button`}>明细</span>,
            <span key='2' onClick={() => this.selectRow(record)} className={`action-button`}>选择</span>
        ]
    }

    getData = () => {
        const { rApi } = this.props
        // if (this.isFirstLoad) {
        //     return new Promise((resolve, reject) => {
        //         this.isFirstLoad = false
        //         resolve({
        //             dataSource: [], 
        //             total: 0
        //         })
        //     })
        // }
        const { 
            projectId,
            quotationType,
            senderProvince,
            receiveProvince
        } = this.props
        let { checkValue, transportation, noFirst } = this.state
        // params = Object.assign({}, params, {
        //     quotationType: 131,
        //     projectId
        // })
        this.setState({loading: true})
        return new Promise((resolve, reject) => {
            // params = deleteNull(params)
            // console.log('getData')
            rApi.getProClientQuotation({
                quotationType,
                projectId,
                senderProvince,
                receiveProvince
            }).then(async d => {
                // let header
                // d.records = this.mergeCost(d.records)
                // console.log('d.records', d.records)
                //let data = d.records && d.records.length > 0 ? QuotationSelect.getListData(d.records, QuotationSelect.getHeaderData(d.records[0])) : []
                let data = d.records
                if(this.props.getQuotationData) {
                    this.props.getQuotationData(data)
                }
                // console.log('getListData', data)
                await this.setState({
                    loading: false,
                    transportation: (data && data.length > 0) ? data.map(item => {
                        return {
                            transportModeId: item.transportModeId,
                            transportModeName: item.transportModeName,
                            quotationLines: item.quotationLines
                        }
                    }) : []
                })
                if(!noFirst) {
                    await this.setState({
                        checkValue:  this.state.transportation && this.state.transportation.length > 0 ? this.state.transportation[0].transportModeName : ''
                    })
                }
                let datasource = []
                data.forEach((item, index) => {
                    if(item.transportModeName === this.state.checkValue) {
                        datasource = [...datasource, ...item.quotationLines]
                    }
                })
                resolve({
                    dataSource: datasource,
                    total: d.total
                })
            }).catch(err => {
                reject(err)
                this.setState({loading: false})
                message.error('查询错误')
            })
        })
    }

    getCheckValue = (value, flag) => {
        this.setState({
            checkValue: value,
            noFirst: flag
        })
    }

    render() { 
        let { transportation, checkValue } = this.state
        return (
            <Modal
                maxWidth={1000}
                style={{width: '95%', maxWidth: 1000}}
                changeOpen={this.changeOpen} 
                open={this.state.open} 
                title={'选择路线'} 
            >
                <div className='quotation-wrapper' style={{border: '0.5px solid #ddd', width: '98%', margin: '0 auto'}}></div>
                {
                    // <Table
                    //     actionView={this.actionView}
                    //     THeader={<span></span>}
                    //     actionWidth={120}
                    //     title="查询路线"
                    //     parent={this}
                    //     power={power}
                    //     params={this.state.params}
                    //     getData={this.getData}
                    //     columns={this.state.columns}
                    // >
                    // </Table>
                }
                <QuotationSelect
                    actionView={this.actionView}
                    getData={this.getData}
                    getCheckValue={this.getCheckValue}
                    transportation={transportation}
                    getThis={v => this.rview = v}
                    bordered={false}
                />
                <ShowDetail
                    getThis={v => this.moreview = v}
                />
            </Modal>
        )
    }
}
 
export default Quotation

