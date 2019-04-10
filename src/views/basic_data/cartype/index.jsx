import React from 'react'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import AddOrEdit from './addoredit'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { children, id } from './power'
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
class CarType extends Parent {

    state = {
        carKindId: null, // 车种
        name: null, // 车型名称
        limit: 10, 
        offset: 0,
    }

    constructor(props) {
        super(props)
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                title: '车型名称',
                dataIndex: 'name',
                key: 'name',
                width: 150,
            },
            {
                className: 'text-overflow-ellipsis',
                title: '车长/车重',
                dataIndex: 'lengthOrWeight',
                key: 'lengthOrWeight',
                width: 120,
                render: (text, r, index) => {
                    let name = `${r.lengthOrWeight}${r.unitName}`
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '车种',
                dataIndex: 'carKindName',
                key: 'carKindName',
                width: 140,
                render: (text, r, index) => {
                    let name = r.carKindName ? r.carKindName : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '箱规格(L*B*H)',
                dataIndex: 'boxLength',
                key: 'boxLength',
                width: 140,
                render: (text, r, index) => {
                    let name = `${r.boxLength}*${r.boxWidth}*${r.boxHeight}`
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '车规格(L*H)',
                width: 140,
                dataIndex: 'carLength',
                key: 'carLength',
                render: (text, r, index) => {
                    // console.log('所属司机', r)
                    let name = `${r.carLength}*${r.carHeight}`
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '最大载重(t)',
                dataIndex: 'maxWeight',
                key: 'maxWeight',
                width: 120,
                render: (text, r, index) => {
                    let name =  r.maxWeight ? r.maxWeight : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '最大体积(m³)',
                dataIndex: 'maxCapacity',
                key: 'maxCapacity',
                render: (text, r, index) => {
                    return(
                        <div className="text-overflow-ellipsis">
                            {
                                r.maxCapacity ? r.maxCapacity : '-'
                            }
                        </div>
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
            carKindId, // 车种
            name, // 车型名称
            limit, 
            offset} = this.state
        params = Object.assign({}, {carKindId, name, limit, offset}, params)
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

    render() {
        let { mobxBaseData } = this.props
        let tableHeight = mobxBaseData.tableHeight
        return (
            <div style={{ background: '#eee', minHeight: this.props.minHeight }}>
                <AddOrEdit 
                    getThis={(v) => this.addoredit = v}
                    parent={this}
                />
                <HeaderView parent={this} title="车型名称" onChangeSearchValue={
                    keyword => {
                        this.setState({name: trim(keyword)}, this.onChangeValue({name: trim(keyword)}))
                }
                }>
                    <RemoteSelect 
                        onChangeValue={
                            e => {
                                //let id = e ? e.id : 0
                                this.setState({carKindId: e ? e.id : ''}, this.onChangeValue({carKindId: e ? e.id : ''}))
                            }
                        }
                        placeholder='车种'
                        text="车种">
                    </RemoteSelect>
                </HeaderView>
                <Table
                    className="index-list-table-style"
                    title="车型管理"
                    //scroll={{x: 1380, y: tableHeight}}
                    tableHeight={tableHeight}
                    parent={this}
                    power={power}
                    params={this.state.params}
                    getData={this.getData}
                    columns={this.state.columns}
                >
                </Table>
            </div>
        )
    }
}
 
export default CarType;