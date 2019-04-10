import React, { Component, Fragment } from 'react'
import { message, Button } from 'antd'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { children, id } from './power'
import { deleteNull, trim} from '@src/utils'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import moment from 'moment'
const power = Object.assign({}, children, id)


/**
 * 操作日志
 * 
 * @class LogRes
 * @extends {Component}
 */
@inject('mobxTabsData', 'mobxBaseData')
@inject('rApi')
@observer
class LogRes extends Parent {

    state = {
        operatorType: null, // 关键字
        operatorId: null, //操作人id
        limit: 10,
        offset: 0
    }

    constructor(props) {
        super(props)
        this.state.columns = [
            {
                width: 180,
                className: 'text-overflow-ellipsis',
                title: '操作人',
                dataIndex: 'operatorName',
                key: 'operatorName',
            },
            {
                width: 300,
                className: 'text-overflow-ellipsis',
                title: '操作类型',
                dataIndex: 'operatorType',
                key: 'operatorType',
                render: (text, r, index) => {
                    let name = r.operatorType ? r.operatorType : '无'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 300,
                className: 'text-overflow-ellipsis',
                title: '操作路径',
                dataIndex: 'operatorUri',
                key: 'operatorUri',
                render: (text, r, index) => {
                    let name = r.operatorUri ? r.operatorUri : '无'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '操作时间',
                dataIndex: 'createTime',
                key: 'createTime',
                render: (text, r, index) => {
                    let name =  r.createTime ? moment(r.createTime).format('YYYY-MM-DD hh:mm:ss') : '无'
                    return(
                        <ColumnItemBox name={name} />
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
        const {
            operatorType, 
            operatorId,
            limit,
            offset
        } = this.state
        params = Object.assign({}, {operatorType, operatorId, limit, offset}, params)
        const { rApi } = this.props
        this.params = params
        return new Promise((resolve, reject) => {
            params = deleteNull(params)
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

    render() {
        let {
            operatorType // 关键字
        } = this.state
        let { mobxBaseData } = this.props
        let tableHeight = mobxBaseData.tableHeight
        return (
            <div style={{ background: '#eee', minHeight: this.props.minHeight }}>
                <HeaderView parent={this} title="操作类型" onChangeSearchValue={
                    keyword => {
                        this.setState({operatorType: trim(keyword)}, this.onChangeValue({operatorType: trim(keyword)}))
                }
                }>
                    <RemoteSelect 
                        onChangeValue={
                            e => {
                                //let id = e ? e.id : 0
                                this.setState({operatorId: e ? e.id : null}, this.onChangeValue({operatorId: e ? e.id : null}))
                            }
                        }
                        placeholder='操作人'
                        getDataMethod={'getUsers'}
                        params={{offset: 0, limit: 999999}}
                        labelField={'username'}
                        >
                    </RemoteSelect>
                </HeaderView>
                <Table
                    className="index-list-table-style"
                    title="操作日志"
                    parent={this}
                    power={power}
                    params={this.state.params}
                    getData={this.getData}
                    columns={this.state.columns}
                    tableHeight={tableHeight}
                    isNoneAction
                    isHideHeaderButton
                >
                </Table>
            </div>
        )
    }
}
 
export default LogRes;