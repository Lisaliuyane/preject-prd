import React, { Component, Fragment } from 'react'
import Read from '@src/components/dynamic_table1/read'
// import { getHeaderData, getListData } from '@src/components/dynamic_table1/utils'
import { inject } from "mobx-react"
import AddressCascader from '@src/components/select_address/cascader.jsx'
import RemoteSelect from '@src/components/select_databook'
import { Button, message, Icon, Spin } from 'antd'
import ShowDetail from './detail'

// import 

const types = [
    {
        id: 0,
        title: '零担'
    },
    {
        id: 1,
        title: '整车'
    },
    {
        id: 2,
        title: '快递'
    },
]

const wheres = [
    {
        id: 1,
        title: '承运商参考报价'
    },
    {
        id: 0,
        title: '合作承运商报价'
    },
    {
        id: 3,
        title: '客户运输报价'
    },
    {
        id: 2,
        title: '客户需求成本'
    }
]

@inject('mobxTabsData', 'mobxDataBook')
@inject('rApi')
class Quotation extends Component {

    state={
        quotationLines: [],
        header: [],
        departure: [], // 起始地
        destination: [], // 目的地
        quotationType: 0, // 零担，整车，快递
        quotationClassify: 1, // xxx报价
        loading: false, // 是否查询中
        show: false,
        businessList: [], //运输方式数据
        reload: true,
        reloadShow: false
    }

    isFirstLoad = true

    componentDidMount() {
        this.getBusinessmodel()
    }

    mergeCost = (data) => {
        const { header } = this.state
        // console.log('header', header)
        return data.map(item => {
            let quotationLineExpenseItems = item.quotationLineExpenseItems
            let items = []
            items = header.map(head => {
                let filter = quotationLineExpenseItems.filter(f => {
                    if (f.expenseItemId === head.expenseItemId) {
                        return true
                    }
                    return false
                })
                let filter0 = filter.filter(f => {
                    for (let key in head) {
                        if (head[key] !== f[key]) {
                            return false
                        }
                    }
                    return true
                })
                let filter1 = filter.filter(f => {
                    if (f.expenseItemId === head.expenseItemId && f.costUnitId === head.costUnitId) {
                        return true
                    }
                    return false
                })
                let filter2 = filter.filter(f => {
                    if (f.expenseItemId === head.expenseItemId && f.costUnitId === head.costUnitId) {
                        return true
                    }
                    return false
                })
                let filter3 = filter.filter(f => {
                    if (f.expenseItemId === head.expenseItemId && f.costUnitId === head.costUnitId) {
                        if (head.lowestFee !== null && head.lowestFee === f.lowestFee)
                        return true
                    }
                    return false
                })
                let filter4 = filter.filter(f => {
                    if (f.expenseItemId === head.expenseItemId && f.costUnitId === head.costUnitId) {
                        if (head.lowestFee !== null && head.lowestFee === f.lowestFee)
                        if (head.carType !==null && head.carType ===  f.carType)
                        return true
                    }
                    return false
                })
                if (filter0 && filter0.length > 0) {
                   return filter0[0]
                } else if (filter4 && filter4.length > 0) {
                    return filter4[0]
                } else if (filter3 && filter3.length > 0) {
                    return filter3[0]
                } else if (filter2 && filter2.length > 0) {
                    return filter2[0]
                } else if (filter1 && filter1.length > 0) {
                    return filter4[0]
                } else {
                    filter.sort((min, max) => {
                        let chargeFee1 = min.chargeFee || 0
                        let chargeFee2 = max.chargeFee || 0
                        if (chargeFee1 < chargeFee2) {
                            return -1
                        }
                        if (chargeFee1 > chargeFee2) {
                            return 1
                        }
                        return 0
                        // return chargeFee1 -  chargeFee2
                    })
                    // items.push(filter[0])
                    return filter[0]
                }
            })
            item.quotationLineExpenseItems = items
            return item
        })
    }

    getData = (params) => { // 查询
        const { rApi } = this.props
        if (this.isFirstLoad) {
            return new Promise((resolve, reject) => {
                this.isFirstLoad = false
                resolve({
                    dataSource: [], 
                    total: 0
                })
            })
        }
        const { 
            header,
            departure,
            destination,
            quotationType,
            quotationClassify 
        } = this.state
        params = Object.assign({}, params, {
            quotationLineExpenseItemList: header,
            quotationType,
            quotationClassify,
            departure: departure.join('/'),
            destination: destination.join('/')
        })
        // console.log('getData')
        this.setState({loading: true})
        return new Promise((resolve, reject) => {
            // params = deleteNull(params)
            // console.log('getData')
            rApi.quickSearchQuotation(params).then(d => {
                // console.log('getListData', d.records[0], Read.getHeaderData(d.records[0]))
                // let header
                d.records = this.mergeCost(d.records)
                // console.log('d.records', d.records)
                let data = d.records && d.records.length > 0 ? Read.getListData(d.records, Read.getHeaderData(d.records[0])) : []
                // console.log('getListData', data)
                this.setState({loading: false})
                resolve({
                    dataSource: data || [], 
                    total: data ? data.length : 0
                })
            }).catch(err => {
                reject(err)
                this.setState({loading: false})
                message.error('查询错误')
            })
        })
    }

    exportTemplate = () => { // 导出
        let { rApi } = this.props
        const { 
            header,
            departure,
            destination,
            quotationType,
            quotationClassify 
        } = this.state
        let params = Object.assign({}, params, {
            quotationLineExpenseItemList: header,
            quotationType,
            quotationClassify,
            departure: departure.join('/'),
            destination: destination.join('/')
        })
        
        rApi.quickSearchQuotationExport(params).then(res => {
            let fileName = `快速报价.xlsx`
            try {
                let header = res.headers
                let contentDsposition = header['content-disposition']
                contentDsposition = contentDsposition.split(';')[1]
                fileName = window.decodeURIComponent(contentDsposition.replace('filename=', ''))
            } catch (e) {
                console.error(e)
            }
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            this.setState({
                exportLoading: false
            })
        }).catch()
    }

    getBusinessmodel = () => { //获取运输方式数据
        const { mobxDataBook } = this.props
        let text = '业务模式'
        let typeId = mobxDataBook.getBookType(text)
        mobxDataBook.initData(text).then(res => {
            this.setState({
                businessList: res,
                reload: false,
                reloadShow: true
            })
        }).catch(err => {
            console.log(err)
        })
    }

    search = () => {
        if (this.rview) {
            this.rview.searchCriteria()
        }
    }

    headerChange = (header) => {
        // console.log('headerChange', header)
        this.setState({header: header}, () => {
            this.search()
        })
    }

    showMore = (record) => {
        // console.log('record', record)
        const { rApi } = this.props
        const {
            quotationType,
            quotationClassify,
            businessList
        } = this.state
        rApi.getOnceQuotation({
            quotationType,
            quotationClassify,
            id: record.id
        }).then(res => {
            this.moreview.show({
                list: [res],
                quotationType,
                quotationClassify,
                id: record.id,
                record: record,
                types: businessList,
                wheres: wheres
            })
        })
    }

    isShow = () => {
        let { show } = this.state
        this.setState({
            show: !show
        })
    }

    actionView = ({ text, record, index, }) => {
        return (
            <span onClick={() => this.showMore(record)} className={`action-button`}>查看更多</span>
        )
    }

    render() { 
        const { loading, quotationLines, show, businessList, reload, reloadShow } = this.state
        const { getPopupContainer } = this.props
        //console.log('quotationLines', quotationLines)
        return (
            <div ref={v => this.view = v} style={{minHeight: 591}}>
                <Spin spinning={this.state.reload}>
                    {
                        reloadShow ?
                        <Fragment>
                            <div className="flex" style={{borderBottom: '1px solid #eee', paddingBottom: 10}}>
                                <div style={{paddingLeft: 10}}>
                                    <AddressCascader
                                        defaultValue={[]}
                                        getPopupContainer={() => this.view}
                                        selectGrade={3}
                                        style={{width: 260}}
                                        placeholder='起运地' 
                                        handleChangeAddress={address => {
                                            this.setState({departure: address})
                                        }}
                                    />
                                </div>
                                <div style={{paddingLeft: 10}}>
                                    <AddressCascader
                                        defaultValue={[]}
                                        getPopupContainer={() => this.view}
                                        selectGrade={3}
                                        style={{width: 260}}
                                        placeholder='目的地' 
                                        handleChangeAddress={address => {
                                            this.setState({destination: address})
                                        }} 
                                    />
                                </div>
                                <div style={{paddingLeft: 10, width: 120}}>
                                    <RemoteSelect 
                                        allowClear={false}
                                        getPopupContainer={() => this.view}
                                        placeholder='运作模式'
                                        onChangeValue={
                                            e => {
                                                let id = e ? e.id : 0
                                                this.setState({quotationType: id})
                                                // this.setState({carrierId: e ? e.id : ''}, this.onChangeValue({carrierId: e ? e.id : ''}))
                                            }
                                        }
                                        //text='业务模式'
                                        list={businessList}
                                        defaultValue={businessList[0]}
                                    >
                                    </RemoteSelect>
                                </div>
                                <div style={{paddingLeft: 10}}>
                                    <RemoteSelect 
                                        allowClear={false}
                                        getPopupContainer={() => this.view}
                                        placeholder='报价类型' 
                                        onChangeValue={
                                            e => {
                                                let id = e ? e.id : 0
                                                // this.setState({carrierId: e ? e.id : ''}, this.onChangeValue({carrierId: e ? e.id : ''}))
                                                this.setState({quotationClassify: id})
                                            }
                                        }
                                        defaultValue={wheres[0]}
                                        filterField='id' 
                                        labelField='title' 
                                        list={wheres}
                                    >
                                    </RemoteSelect>
                                </div>
                                {/* <div style={{paddingLeft: 10}}>
                                    <div 
                                        style={{height: 32, lineHeight: '32px', padding: '0 15px', border: '1px solid #d9d9d9', cursor: 'pointer'}}
                                        onClick={this.isShow}
                                    >
                                        筛选
                                        <Icon type="down" theme="outlined" style={{marginfontSize: '12px', color: 'rgba(0, 0, 0, 0.25)', transition: 'all 0.5s', transform: show ? 'rotate(-180deg)' : ''}}/>
                                    </div>
                                </div> */}
                                <div className="flex1">
                                </div>
                                <div style={{paddingRight: 10}}>
                                    <Button 
                                        loading={loading} 
                                        onClick={this.search}
                                        style={{border: 0, color: '#fff', background: 'rgb(24, 181, 131)'}} 
                                        //icon="search"
                                    >
                                        查询
                                    </Button>
                                </div>
                            </div>
                            <Read
                                actionView={this.actionView}
                                mode={{businessModeId: this.state.quotationType}}
                                quotationMethod="transportOrEstimate"
                                headerChange={this.headerChange}
                                getData={this.getData}
                                getThis={v => this.rview = v}
                                getPopupContainer={() => this.view}
                                isQuickSearchQuery={this.props.isQuickSearchQuery}
                                onCancel={this.props.onCancel}
                                TableHeaderChildren={
                                    <Button icon="export" onClick={this.exportTemplate} style={{marginRight: 10, verticalAlign: 'middle'}}>导出</Button>
                                }
                            />
                            <ShowDetail getThis={v => this.moreview = v} />
                        </Fragment>
                        :
                        <div style={{minHeight: 591}}></div>
                    }
                </Spin>
            </div>
        )
    }
}
 
export default Quotation;