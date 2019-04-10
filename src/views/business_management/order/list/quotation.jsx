import React from 'react'
import { inject } from "mobx-react"
import CusModal from '@src/components/modular_window'
import { Parent } from '@src/components/table_template'
import QuotationSelect from '@src/components/dynamic_table1/select'
import { message, Modal } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import ShowDetail from '@src/views/layout/like_quotation/detail'
import '../add/quotation.less'

@inject('rApi')
class Quotation extends Parent {
    static propTypes = {
        dealData: PropTypes.func, //处理获取的数据  return 一个 Array
    }

    static defaulProps = {
        dealData: data => data
    }

    state={
        openData: {},
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
        noFirst: false,
        departure: null,
        destination: null,
        quotationType: null,
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
        this.setState({ open: status, openData: {}, checkValue: '', noFirst: false })
    }

    close = () => {
        this.changeOpen(false)
    }

    selectRow = item => {
        const { openData } = this.state
        const { selectRow } = this.props
        if (selectRow) {
            selectRow(item ? {...item, openData} : {openData})
            this.close()
        }
    }

    showMore = (record) => {
        // console.log('record', record)
        const {
            quotationType
        } = this.props
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
    }

    actionView = ({record}) => {
        return [
            <span key='1' onClick={() => this.showMore(record)} className={`action-button`}>明细</span>,
            <span key='2' onClick={() => this.selectRow(record)} className={`action-button`}>选择</span>
        ]
    }

    getData = () => {
        const { rApi, dealData } = this.props
        const { 
            departure,
            destination,
            quotationNumber,
            quotationType,
            openData
        } = this.state
        let { noFirst } = this.state
        this.setState({loading: true})
        return new Promise((resolve, reject) => {
            rApi.getCarrierQuotationQuery({
                departure,
                destination,
                quotationNumber,
                quotationType: quotationType
            })
                .then(async d => {
                    let data = d.records
                    if(this.props.getQuotationData) {
                        //console.log('openData', openData)
                        this.props.getQuotationData(data, openData)
                    }
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
                    if (dealData) {
                        datasource = dealData(datasource)
                    }
                    resolve({
                        dataSource: datasource,
                        total: d.total
                    })
                })
                .catch(err => {
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
        const { isAntdModal } = this.props
        if (isAntdModal) {
            return (
                <Modal
                    width={1000}
                    style={{ width: '95%', maxWidth: 1000 }}
                    onOk={this.changeOpen}
                    onCancel={this.close}
                    bodyStyle={{ padding: 0 }}
                    footer={null}
                    visible={this.state.open}
                    title={'选择路线'}
                >
                    <div className='quotation-wrapper' style={{ border: '0.5px solid #ddd', width: '98%', margin: '0 auto' }}></div>
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
        } else {
            return (
                <CusModal
                    maxWidth={1000}
                    style={{ width: '95%', maxWidth: 1000 }}
                    changeOpen={this.changeOpen}
                    open={this.state.open}
                    title={'选择路线'}
                >
                    <div style={{ border: '0.5px solid #ddd', width: '98%', margin: '0 auto' }}></div>
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
                </CusModal>
            )
        }
    }
}
 
export default Quotation

