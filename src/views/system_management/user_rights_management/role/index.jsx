import React from 'react'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import AddOrEdit from './addoredit'
import AuthOrize from './authorize'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { children, id } from './power'
import { deleteNull, trim } from '@src/utils'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
const power = Object.assign({}, children, id)

/**
 * 角色权限资源
 * 
 * @class RoleRights
 * @extends {Component}
 */
@inject('mobxTabsData', 'mobxBaseData')
@inject('rApi')
@observer
class RoleRights extends Parent {

    state = {
        title: null, //角色名称
        organid: '', //
        desc: null, //描述
        keyword: '', //关键字
        limit: 10,
        offset: 0
    }

    constructor(props) {
        super(props)
        this.state.columns = [
            {
                width: 200,
                className: 'text-overflow-ellipsis',
                title: '角色名称',
                dataIndex: 'title',
                key: 'title',
                render: (text, r, index) => {
                    return(
                        <ColumnItemBox name={text} />
                    )
                }
            },
            {
                width: 300,
                className: 'text-overflow-ellipsis',
                title: '所属部门',
                dataIndex: 'organization',
                key: 'organization',
                render: (text, r, index) => {
                    let name = r.organization ? r.organization.title : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '备注',
                dataIndex: 'desc',
                key: 'desc',
                render: (text, r, index) => {
                    return(
                        <ColumnItemBox name={text} />
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
            organid, //
            keyword, //关键字
            limit,
            offset} = this.state
        params = Object.assign({}, { limit, offset, keyword }, params)
        const { rApi } = this.props
        return new Promise((resolve, reject) => {
            params = params
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

    customTableAction = ({text, record, index, onDeleteItem, onEditItem, DeleteButton}) => {
        //console.log('customTableAction', text, record, index)
        return [
            <FunctionPower key={'customTableAction1'} power={power.EDIT_DATA}>
                <span
                    className={`action-button`}
                    onClick={onEditItem}
                >
                    编辑
                </span>
            </FunctionPower>,
            <FunctionPower key={'customTableAction2'} power={power.DEL_DATA}>
                <DeleteButton action={onDeleteItem} />
            </FunctionPower>,
            <FunctionPower key={'customTableAction3'} power={power.ROLE_GRANT}>
                <span
                    className={`action-button`}
                    onClick={() => this.onAuthorize(record)}
                >
                    权限分配
                </span>
            </FunctionPower>
        ]
    }

    onAuthorize = (record) => {
        this.authorize.show({
            isEdit: true,
            data: record
        })
    }
    render() {
        let {
            title, //角色名称
            organid, //所属部门
            desc, //描述
            keyword, //关键字
            limit,
            offset
        } = this.state
        let { mobxBaseData } = this.props
        let tableHeight = mobxBaseData.tableHeight
        return (
            <div style={{ background: '#eee', minHeight: this.props.minHeight }}>
                <AuthOrize 
                    parent={this}
                    getThis={(v) => this.authorize = v}
                />
                <AddOrEdit 
                    parent={this}
                    getThis={(v) => this.addoredit = v}
                />
                <HeaderView parent={this} title="角色名称" onChangeSearchValue={
                    keyword => {
                        this.setState({keyword: trim(keyword)}, this.onChangeValue({keyword: trim(keyword)}))
                }
                }>
                    <div style={{fontSize: 16, lineHeight: '30px', color: '#000'}}>角色权限管理</div>
                </HeaderView>
                <Table
                    className="index-list-table-style"
                    actionView={this.customTableAction}
                    title="角色列表"
                    parent={this}
                    actionWidth={160}
                    power={power}
                    params={this.state.params}
                    getData={this.getData}
                    columns={this.state.columns}
                    tableHeight={tableHeight}
                />
            </div>
        )
    }
}
 
export default RoleRights;