import React from 'react'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import AddOrEdit from './addoredit'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import AddressCascader from '@src/components/select_address/cascader.jsx'
import { children, id } from './power'
import { addressToString, trim } from '@src/utils'
import { DatePicker } from 'antd'
import moment from 'moment'
const power = Object.assign({}, children, id)

const quotationStatusData = [
    {
        id: 1,
        title: '保存待提交'
    },
    {
        id: 2,
        title: '提交待审核'
    },
    {
        id: 3,
        title: '驳回'
    },
    {
        id: 4,
        title: '已生效'
    },
    {
        id: 6,
        title: '已失效'
    }
] 
/**
 * 客户运输报价
 * 
 * @class Node
 * @extends {Component}
 */

@inject('mobxTabsData', 'mobxBaseData')
@inject('rApi')
@observer
class Carrier extends Parent {

    state = {
        quotationNumber: null, //报价单号
        createTime: null, //报价日期
        limit: 10,
        offset: 0,
        clientQuotationType: 2,
        keyWords: null, //关键字
        quotationStatus: 0, //报价状态
    }

    constructor(props) {
        super(props)
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                title: '报价单号',
                dataIndex: 'quotationNumber',
                key: 'quotationNumber',
                width: 160,
                render: (text, r, index) => {
                    let name = r.quotationNumber ? r.quotationNumber : '无'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 200,
                className: 'text-overflow-ellipsis',
                title: '客户名称',
                dataIndex: 'clientName',
                key: 'clientName',
                render: (text, r, index) => {
                    let name = r.clientName ? r.clientName : '无'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 200,
                className: 'text-overflow-ellipsis',
                title: '业务需求名称',
                dataIndex: 'demandName',
                key: 'demandName',
                render: (text, r, index) => {
                    let name = r.demandName ? r.demandName : '无'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 180,
                className: 'text-overflow-ellipsis',
                title: '有效日期',
                dataIndex: 'effectiveDate',
                key: 'effectiveDate',
                render: (text, r, index) => {
                    let name = r.effectiveDate ? `${moment(r.effectiveDate).format('YYYY/MM/DD')}-${moment(r.expirationDate).format('YYYY/MM/DD')}` : '无'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 100,
                className: 'text-overflow-ellipsis',
                title: '状态',
                dataIndex: 'reviewStatus',
                key: 'reviewStatus',
                render: (text, r, index) => {
                    let name = r.reviewStatus === 1 ? 
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
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 100,
                className: 'text-overflow-ellipsis',
                title: '制单人',
                dataIndex: 'operator',
                key: 'operator',
                render: (text, r, index) => {
                    let name = r.operatePersonName ? r.operatePersonName : '无'
                    return(
                        <ColumnItemBox name={name} />
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

    componentDidMount = () => {
        const { mobxTabsData, mykey } = this.props
        const pageData = mobxTabsData.getPageData(mykey)
        console.log('xxxxx', pageData.__isRead)
        if(pageData && pageData.key === '应收报价预估' && !pageData.__isRead) {
            this.showAdd(pageData)
        }
    }
    

    componentWillReceiveProps (nextProps) { //pageData改变时触发
        const { mobxTabsData, mykey, activeKey } = nextProps
        const pageData = mobxTabsData.getPageData(mykey)
        if (activeKey === mykey && mobxTabsData.historyKey !== mykey) {
            if(pageData && pageData.key === '应收报价预估' && !pageData.__isRead)
            this.showAdd(pageData)
        }
    }

    onChangeValue = () => {
        //console.log('onChangeValue')
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    getData = (params) => {
        const {
            quotationNumber, //报价单号
            createTime, //报价日期
            limit,
            offset,
            clientQuotationType,
            keyWords, //关键字
            quotationStatus, //报价状态
        } = this.state
        params = Object.assign({}, {quotationNumber, createTime, limit, offset, clientQuotationType, keyWords, quotationStatus }, params)
        // console.log('params', params, limit)
        const { rApi } = this.props
        return new Promise((resolve, reject) => {
            rApi[power.apiName](params).then(d => {
                resolve({
                    dataSource: d.records || [], 
                    total: d.total
                })
            }).catch(err => {
                reject(err)
            })
        })
    }

    onChangeCheckbox = (checked, index) => {
        this.state.columns[index].isNoDisplay = !checked
        this.setState({columns: this.state.columns})
    }

    showAdd = (value) => {
        if(this.addoredit.getOpenStatus.open) {
            this.addoredit.changeOpen(false)
        }
        this.addoredit.show({
            edit: false,
            data: value
        })
    }

    render() {
        // console.log('CarRes render')
        // let data = []
        // console.log('render CarRes')
        let { mobxBaseData } = this.props
        let tableHeight = mobxBaseData.tableHeight
        return (
            <div style={{ background: '#eee', minHeight: this.props.minHeight }}>
                <AddOrEdit 
                    parent={this}
                    getThis={(v) => this.addoredit = v}
                />
                <HeaderView parent={this} title="报价单号" onChangeSearchValue={
                    keyWords => {
                        this.setState({quotationNumber: trim(keyWords)}, this.onChangeValue({quotationNumber: trim(keyWords)}))
                }
                }>
                    <RemoteSelect 
                        onChangeValue={
                            e => {
                                let id = e ? e.title : 0
                                this.setState({keyWords: e ? e.title : ''}, this.onChangeValue({keyWords: e ? e.title : ''}))
                            }
                        }
                            placeholder='客户名称'
                            getDataMethod={'getClients'}
                            params={{limit: 999999, offset: 0, status: 56}}
                            labelField={'shortname'}
                        >
                    </RemoteSelect>
                    <RemoteSelect 
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({quotationStatus: e ? e.id : ''}, this.onChangeValue({quotationStatus: e ? e.id : ''}))
                            }
                        }
                        placeholder='报价状态'
                        labelField={'title'}
                        list={quotationStatusData}
                        // getDataMethod={'getLegalPersons'}
                        >
                    </RemoteSelect>
                    <DatePicker 
                        allowClear 
                        placeholder='报价日期' 
                        onChange = {
                            (field, value) => {
                                this.setState({createTime: value ? value : ''}, this.onChangeValue({createTime: value ? value : ''}))
                            }
                        }
                        />
                </HeaderView>
                <Table
                    className="index-list-table-style"
                    title="节点列表"
                    parent={this}
                    power={power}
                    params={this.state.params}
                    getData={this.getData}
                    columns={this.state.columns}
                    tableHeight={tableHeight}
                >
                </Table>
            </div>
        )
    }
}
 
export default Carrier;