import React from 'react'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import AddOrEdit from './addoredit'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { children, id } from './power'
import { addressToString, deleteNull, trim } from '@src/utils'
import './index.less'

const power = Object.assign({}, children, id)
/**
 * 基础数据字典 公司法人
 * 
 * @class LegalPerson
 * @extends {Component}
 */
@inject('mobxTabsData', 'mobxBaseData')
@inject('rApi')
@observer
class LegalPerson extends Parent {

    state = {
        limit: 10,
        offset: 0
    }

    constructor(props) {
        super(props)
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                width: 180,
                title: '法人代码',
                dataIndex: 'code',
                key: 'code',
                render: (text, r, index) => {
                    let name = r.code ? r.code : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 140,
                className: 'text-overflow-ellipsis',
                title: '法人名称',
                dataIndex: 'name',
                key: 'name',
                render: (text, r, index) => {
                    let name = r.name ? r.name : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 180,
                className: 'text-overflow-ellipsis',
                title: '法人全称',
                dataIndex: 'fullName',
                key: 'fullName',
                render: (text, r, index) => {
                    let name = r.fullName ? r.fullName : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 300,
                className: 'text-overflow-ellipsis',
                title: '法人地址',
                dataIndex: 'address',
                key: 'address',
                render: (text, record, index) => {
                    let name = addressToString(record.address)
                    return (
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '所属片区',
                dataIndex: 'area',
                key: 'area',
                render: (text, record, index) => {
                    return (
                        <div>{record.area ? record.area : '-'}</div>
                    )
                }
            }
        ]
    }

    onChangeValue = () => {
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    getData = (params) => {
        const {limit, offset} = this.state
        params = Object.assign({}, {limit, offset}, params)
        const { rApi } = this.props
        return new Promise((resolve, reject) => {
            params = deleteNull(params)
            rApi[power.apiName](params).then(d => {
                //console.log('GET_LIST', d)
                resolve({
                    dataSource: d.list || [], 
                    total: d.total
                })
            }).catch(err => {
                reject(err)
            })
        })
    }

    render() {
        // let {
        // } = this.state
        let { mobxBaseData } = this.props
        let tableHeight = mobxBaseData.tableHeight
        return (
            <div style={{ background: '#eee', minHeight: this.props.minHeight }}>
                <AddOrEdit 
                    parent={this}
                    getThis={(v) => this.addoredit = v}
                />
                {/* <HeaderView parent={this} title="车牌号码/司机姓名" onChangeSearchValue={
                    keyword => {
                        this.setState({keyword: trim(keyword)}, this.onChangeValue({keyword: trim(keyword)}))
                }
                }>
                </HeaderView> */}
                <div style={{overflow: 'hidden'}}>
                    <Table
                        className="index-list-table-style"
                        title="公司法人列表"
                        //scroll={{x: 1900, y: tableHeight}}
                        parent={this}
                        power={power}
                        isHideDeleteButton
                        params={this.state.params}
                        getData={this.getData}
                        columns={this.state.columns}
                        tableHeight={tableHeight}
                    >
                    </Table>
                </div>
            </div>
        )
    }
}
 
export default LegalPerson;