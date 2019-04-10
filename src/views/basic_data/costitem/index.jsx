import React from 'react'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import AddOrEdit from './addoredit'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { children, id } from './power'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { trim } from '@src/utils'
const power = Object.assign({}, children, id)

/**
 * 车辆资源
 * 
 * @class CarType
 * @extends {Component}
 */
@inject('mobxTabsData', 'mobxBaseData')
@inject('rApi')
@observer
class CostItem extends Parent {

    state = {
        keyWord: null, //关键字
        billingMethodId: null,
        expenseType: 0, //费用类型
        expenseUses: 0, //费用用途
        limit: 10,
        offset: 0
    }

    constructor(props) {
        super(props)
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                title: '费用代码',
                dataIndex: 'code',
                key: 'code',
                width: 120,
                render: (text, r, index) => {
                    let name =  r.code ? r.code : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '费用名称',
                dataIndex: 'name',
                key: 'name',
                width: 140,
                render: (text, r, index) => {
                    let name =  r.name ? r.name : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '费用类型',
                dataIndex: 'typeName',
                key: 'typeName',
                width: 100,
                render: (text, r, index) => {
                    let name = r.typeName ? r.typeName : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '费用用途',
                dataIndex: 'expenseUses',
                key: 'expenseUses',
                width: 250,
                render: (text, r, index) => {
                    // console.log('所属司机', r)
                    let name = (r.receivableOrPayable && r.expenseUses) ? 
                    `${r.receivableOrPayable},${r.expenseUses}`
                    :
                    (r.receivableOrPayable && !r.expenseUses) ?
                    r.receivableOrPayable
                    :
                    (!r.receivableOrPayable && r.expenseUses) ?
                    r.expenseUses
                    :
                    '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                width: 300, 
                render: (text, r, index) => {
                    let name =  r.remark ? r.remark || r.remark : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            }
            // {
            //     title: '状态',
            //     dataIndex: 'status',
            //     key: 'status',
            //     width: 100,
            //     render: (text, record, index) => {
            //         return (
            //             <span style={{color: !record.status?'#1DA57A':'#ccc'}}>
            //             {
            //                 !record.status? '已启用' : '禁用'
            //             }
            //             </span>
            //         )

            //     }
            // }
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
            keyWord, //关键字
            expenseType, //费用类型
            expenseUses, //费用用途
            billingMethodId,
            limit,
            offset} = this.state
        params = Object.assign({}, {keyWord, expenseType, expenseUses, billingMethodId, limit, offset}, params)
        const { rApi } = this.props
        return new Promise((resolve, reject) => {
            rApi[power.apiName](params).then(d => {
                resolve({
                    dataSource: d.list || [], 
                    total: d.total
                })
            }).catch(err => {
                reject(err)
            })
        })
    }

    actionView = ({record}) => {
        const view = [
            <FunctionPower power={power.LOOK_MORE}  key={'onlook'}>
                <span
                    className={`action-button`}
                    //onClick={onEditItem}
                    onClick={() => this.onLook(record)}
                >
                    查看
                </span>
            </FunctionPower>,
            <FunctionPower power={power.EDIT_DATA} key={'onedit'}>
                <span
                    className={`action-button`}
                    onClick={() => this.onEdit(record)}
                >
                    编辑
                </span>
            </FunctionPower>
        ]
        if (record.id === 1 || record.id === 2) {
            return [view[0], view[1]]
        } else if (record.id === 3 || record.id === 4) {
            return [view[0]]
        }
    }

    onLook = (record) => { //编辑 => 跳转到编辑页面
        let { mobxTabsData } = this.props
        this.addoredit.show({
            data: record,
            edit: false
        })
    }

    onEdit = (record) => { //编辑 => 跳转到编辑页面
        let { mobxTabsData } = this.props
        this.addoredit.show({
            data: record,
            edit: true
        })
    }

    render() {
        let { mobxBaseData } = this.props
        let tableHeight = mobxBaseData.tableHeight
        return (
            <div style={{ background: '#eee', minHeight: this.props.minHeight }}>
                <AddOrEdit 
                    parent={this}
                    getThis={(v) => this.addoredit = v}
                />
                <HeaderView parent={this} title="费用代码/名称" onChangeSearchValue={
                    keyword => {
                        this.setState({keyWord: trim(keyword)}, this.onChangeValue({keyWord: trim(keyword)}))
                }
                }>
                    <RemoteSelect 
                        onChangeValue={
                            e => {
                                //let id = e ? e.id : 0
                                this.setState({expenseType: e ? e.title : ''}, this.onChangeValue({expenseType: e ? e.title : ''}))
                            }
                        }
                        placeholder='费用类型'
                        text="费用类型">
                    </RemoteSelect>
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                //let id = e ? e.id : 0
                                this.setState({expenseUses: e ? e.id : ''}, this.onChangeValue({expenseUses: e ? e.id : ''}))
                            }
                        }
                        placeholder='费用用途'
                        text="业务模式">
                    </RemoteSelect>
                    <RemoteSelect
                        onChangeValue={
                            value => {
                                this.setState({
                                    billingMethodId: value ? value.id : ''
                                }, this.onChangeValue({billingMethodId: value ? value.id : ''}))
                            }
                        } 
                        placeholder="计费方式"
                        labelField={'title'}
                        text='计费方式'
                    />
                </HeaderView>
                <Table
                    className="index-list-table-style"
                    title="费用项目列表"
                    parent={this}
                    power={power}
                    actionView={this.actionView}
                    params={this.state.params}
                    getData={this.getData}
                    columns={this.state.columns}
                    //scroll={{x: 1400, y: tableHeight}}
                    tableHeight={tableHeight}
                >
                </Table>
            </div>
        )
    }
}
 
export default CostItem;