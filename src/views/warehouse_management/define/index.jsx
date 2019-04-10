import React from 'react'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { deleteNull, trim, addressFormat } from '@src/utils'
import { toWarehousePlus } from '@src/views/layout/to_page'
import { message, Button } from 'antd'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { children, id } from './power'
import './index.less'

const power = Object.assign({}, children, id)

/**
 * 仓库列表
 * @class WarehouseDefine
 * @extends {Parent}
 */
@inject('rApi', 'mobxTabsData', 'mobxBaseData')
@observer
class WarehouseDefine extends Parent {

    constructor(props) {
        super(props)
        this.state = {
            keywords: '', //仓库文本框输入查询
            typeId: '',  //仓库类型ID
            warehouseList: [], //仓库列表
        }
        // 仓库列表表格结构数据
        this.state.columns = [
                {
               
                    className: 'text-overflow-ellipsis',
                    title: '仓库代码',
                    dataIndex: 'code',
                    key: 'code',
                    width: 120,
                    render: (val) => {
                        return (
                            <ColumnItemBox name={val} />
                        )
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '仓库名称',
                    dataIndex: 'name',
                    key: 'name',
                    width: 120,
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '仓库类型',
                    dataIndex: 'typeName',
                    key: 'typeName',
                    width: 140,
                    render: (t) => {
                        return (
                            <ColumnItemBox name={t} />
                        )
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '负责人',
                    dataIndex: 'principal',
                    key: 'principal',
                    width: 120,
                    render: (t) => {
                        return (
                            <ColumnItemBox name={t} />
                        )
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '联系电话',
                    dataIndex: 'phone',
                    key: 'phone',
                    width: 120,
                    render: (t) => {
                        return (
                            <ColumnItemBox name={t} />
                        )
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '仓库地址',
                    dataIndex: 'address',
                    key: 'address',
                    width: 220,
                    render: (val, rowData, rowIndex) => {
                        let name = addressFormat(val)
                        return (
                            <ColumnItemBox name={name} />
                        )
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '仓库容量(m³)',
                    dataIndex: 'capacitySum',
                    key: 'capacitySum',
                    width: 110,
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '储位量',
                    dataIndex: 'warehouseStorageCount',
                    key: 'warehouseStorageCount',
                    width: 100,
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                }
            ]
    }

    onChangeValue = () => {
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    // 仓库列表数据获取
    getData = async (params) => {
        const { rApi } = this.props
        let { keywords, typeId } = this.state
        params = Object.assign({}, params, { 
            keywords, 
            pageSize: params.limit,
            typeId 
        })
        return new Promise(async (resolve, reject) => {
            params = deleteNull(params)
            await rApi[power.apiName](params)
                .then(async d => {
                    let warehouseList = [...d.records]
                    await this.setState({warehouseList})
                    resolve({
                        dataSource: warehouseList,
                        total: d.total
                    })
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    /* 打开仓库明细页面 */
    openWarehousePlus = (openType, payload) => {
        const { mobxTabsData } = this.props
        let id = openType === 'add' ? 'newWarehouse' : `editWarehouse${payload.code}`
        toWarehousePlus(mobxTabsData, {
            id,
            pageData: {
                openType,
                origin: this,
                payload: payload || null
            }
        })
    }

    // 删除仓库
    deleteWarehouse = (rowData) => {
        const {rApi} = this.props
        rApi.delWarehouse({ id: rowData.id })
            .then(res => {
                message.success('操作成功')
                this.onChangeValue()
            })
            .catch(err => {
                message.error(err.msg || "操作失败")
            })
    }

    /* 表格顶部按钮 */
    tbHeadButton = () => {
        return (
            [
                <FunctionPower
                    key='新建'
                    power={power.ADD_DATA}
                >
                    <Button
                        onClick={e => this.openWarehousePlus('add', null)}
                        style={{ marginRight: 10, verticalAlign: 'middle' }}
                        icon="plus"
                    >
                        新建
                    </Button>
                </FunctionPower>
            ]
        )
    }


    /* 表格操作列 */
    actionView = ({ text, record, index, onDeleteItem, onEditItem, DeleteButton }) => {
        const rt = [
            <FunctionPower key={'customEdit'} power={power.EDIT_DATA}>
                <span
                    className={`action-button`}
                    onClick={() => this.openWarehousePlus('edit', record)}
                >
                    编辑
                </span>
            </FunctionPower>,
            <FunctionPower key={'customDelete'} power={power.DEL_DATA}>
                <DeleteButton action={() => this.deleteWarehouse(record)} />
            </FunctionPower>
        ]
        return rt
    }

    render() {
        return (
            <div className='warehouse-define'>
                <HeaderView
                    style={{padding: '0 20px'}}
                    parent={this}
                    title="仓库名称" 
                    onChangeSearchValue={
                        keyword => {
                            this.setState({ keywords: trim(keyword) }, this.onChangeValue())
                        }
                    }
                >
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({ typeId: e ? id : null }, this.onChangeValue())
                            }
                        }
                        placeholder='仓库类型'
                        text='仓库类型'
                    >
                    </RemoteSelect>
                </HeaderView>
                <Table
                    className='sd-block warehouse-table'
                    parent={this}
                    isHideAddButton
                    isHideDeleteButton
                    isNoneSelected
                    isPreventActionEvent
                    power={power}
                    TableHeaderTitle={<span></span>}
                    actionWidth={90}
                    actionView={this.actionView}
                    cusTableHeaderButton={this.tbHeadButton()}
                    tableWidth={140}
                    tableHeight={this.props.mobxBaseData.tableHeight}
                    getData={this.getData}
                    columns={this.state.columns}
                >
                </Table>
            </div>
        )
    }
}

export default WarehouseDefine