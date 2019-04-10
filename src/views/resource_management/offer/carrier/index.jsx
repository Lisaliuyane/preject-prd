import React from 'react'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import AddOrEdit from './addoredit'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
// import AddressCascader from '@src/components/select_address/cascader.jsx'
import { children, id } from './power'
import { addressToString, trim } from '@src/utils'
import { DatePicker } from 'antd'
import moment from 'moment'
import './index.less'
const power = Object.assign({}, children, id)

/**
 * 车辆资源
 * 
 * @class Node
 * @extends {Component}
 */
@inject('mobxTabsData', 'mobxBaseData')
@inject('rApi')
@observer
class Carrier extends Parent {

    state = {
        carrierId: 0, //承运商代码
        quotationNumber: null, //报价单号
        createTime: null, //报价日期
        dockedPersonId: 0, //对接法人
        limit: 10,
        offset: 0
    }

    constructor(props) {
        super(props)
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                title: '报价单号',
                dataIndex: 'quotationNumber',
                key: 'quotationNumber',
                width: 130,
                render: (text, r, index) => {
                    let name = r.quotationNumber ? r.quotationNumber : '-'
                    return (
                        <ColumnItemBox name={name} />
                        //console.log('r',r)
                    )
                }
            },
            {
                width: 160,
                className: 'text-overflow-ellipsis',
                title: '承运商名称',
                dataIndex: 'carrierName',
                key: 'carrierName',
                render: (text, r, index) => {
                    let name = r.carrierName ? r.carrierName : '-'
                    return (
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 200,
                className: 'text-overflow-ellipsis',
                title: '对接法人',
                dataIndex: 'dockedPersonName',
                key: 'dockedPersonName',
                render: (text, r, index) => {
                    let name = r.dockedPersonName ? r.dockedPersonName : '-'
                    return (
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 100,
                className: 'text-overflow-ellipsis',
                title: '录单日期',
                dataIndex: 'createTime',
                key: 'createTime',
                render: (text, r, index) => {
                    let name = r.createTime ? moment(r.createTime).format('YYYY-MM-DD') : '-'
                    return (
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 180,
                className: 'text-overflow-ellipsis',
                title: '报价有效期',
                dataIndex: 'effectiveDate',
                key: 'effectiveDate',
                render: (text, r, index) => {
                    let name = r.effectiveDate ? `${moment(r.effectiveDate).format('YYYY-MM-DD')} - ${moment(r.expirationDate).format('YYYY-MM-DD')}` : '-'
                    return (
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 100,
                className: 'text-overflow-ellipsis',
                title: '审核状态',
                dataIndex: 'reviewStatus',
                key: 'reviewStatus',
                render: (text, r, index) => {
                    let name = r.reviewStatus === 1 ?
                    '提交待审核'
                    :
                    r.reviewStatus === 2 ?
                    '已生效'
                    :
                    r.reviewStatus === 3 ?
                    '驳回'
                    :
                    r.reviewStatus === 4 ?
                    '已失效'
                    :
                    '保存待提交'
                    return (
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 100,
                className: 'text-overflow-ellipsis',
                title: '制单人',
                dataIndex: 'operatePersonName',
                key: 'operatePersonName',
                render: (text, r, index) => {
                    let name = r.operatePersonName ? r.operatePersonName : '-'
                    return (
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 400,
                className: 'text-overflow-ellipsis',
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                render: (text, r, index) => {
                    let name = r.remark ? r.remark || r.remark : '-'
                    return (
                        <ColumnItemBox name={name} />
                    )
                }
            }
        ]
    }

    onChangeValue = () => {
        // console.log('onChangeValue')
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    getData = (params) => {
        const {
            carrierId, //承运商代码
            quotationNumber, //合同单号
            createTime, //报价日期
            dockedPersonId, //对接法人
            limit,
            offset
        } = this.state
        params = Object.assign({}, { carrierId, quotationNumber, createTime, dockedPersonId, limit, offset }, params)
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

    // onChangeCheckbox = (checked, index) => {
    //     this.state.columns[index].isNoDisplay = !checked
    //     this.setState({ columns: this.state.columns })
    // }

    showAdd = () => {
        this.addoredit.show({
            edit: false
        })
    }

    render() {
        // console.log('CarRes render')
        // let data = []
        // console.log('render CarRes')
        let { mobxBaseData } = this.props
        let tableHeight = mobxBaseData.tableHeight
        return (
            <div className='page-carrier' style={{ background: '#eee', minHeight: this.props.minHeight }}>
                <AddOrEdit
                    parent={this}
                    getThis={(v) => this.addoredit = v}
                />
                <HeaderView parent={this} title="报价单号" onChangeSearchValue={
                    keyword => {
                        this.setState({ quotationNumber: trim(keyword) }, this.onChangeValue({ quotationNumber: trim(keyword) }))
                    }
                }>
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({ carrierId: e ? e.id : '' }, this.onChangeValue({ carrierId: e ? e.id : '' }))
                            }
                        }
                        placeholder='承运商名称'
                        labelField={'abbreviation'}
                        getDataMethod={'getCooperationCarriet'}
                    >
                    </RemoteSelect>
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({ dockedPersonId: e ? e.id : '' }, this.onChangeValue({ dockedPersonId: e ? e.id : '' }))
                            }
                        }
                        placeholder='对接法人'
                        labelField={'fullName'}
                        getDataMethod="getLegalPersonList"
                        params={{offset: 0, limit: 999999}}
                    >
                    </RemoteSelect>
                    <DatePicker
                        allowClear
                        placeholder='录单日期'
                        onChange={
                            (field, value) => {
                                this.setState({ createTime: value ? value : '' }, this.onChangeValue({ createTime: value ? value : '' }))
                            }
                        }
                    />
                </HeaderView>
                <Table
                    className="index-list-table-style"
                    title="合作承运商报价"
                    //scroll={{x: 2100, y: tableHeight}}
                    tableHeight={tableHeight}
                    parent={this}
                    power={power}
                    params={this.state.params}
                    getData={this.getData}
                    columns={this.state.columns}
                    tableWidth={400}
                >
                </Table>
            </div>
        )
    }
}

export default Carrier;