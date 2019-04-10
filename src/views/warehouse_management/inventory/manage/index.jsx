import React from 'react'
import { message, Button, Menu, Icon, Dropdown } from 'antd'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { trim } from '@src/utils'
import TimePicker from '@src/components/time_picker'
import moment from 'moment'
import Details from './Details'
import ActionMore from './ActionMore'
import MergePlate from './MergePlate'
import SplitPlate from './SplitPlate'
import './index.less'

// 列渲染函数
export const colRendFun = (t, r, index, key) => {
    let name = t
    switch (key) {
        case 'warehouseName': //仓库名称
        case 'warehouseStorageNumber':  //储位号
        case 'boardNumber':  //板号
        case 'status': //货物状态
            let color = null
            if (key === 'status') {
                name = r.status === 1 ? '良品' : '不良品'
                color = r.status === 1 ? '#444' : '#F56C6C'
            }
            return (
                <ColumnItemBox style={color ? { color } : {}} name={name} />
            )
    
        default:
            name = (key === 'receiptTime') ? moment(t).format('YYYY/MM/DD') : t
            return (
                <ColumnItemBox name={name} />
            )
    }
}

// 表头渲染函数
export const colFun = (props = {}) => [
    {
        className: 'text-overflow-ellipsis',
        title: '仓库名称',
        dataIndex: 'warehouseName',
        key: 'warehouseName',
        width: 140,
        render: (t, r, index) => colRendFun(t, r, index, 'warehouseName')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '储位号',
        dataIndex: 'warehouseStorageNumber',
        key: 'warehouseStorageNumber',
        width: 90,
        render: (t, r, index) => colRendFun(t, r, index, 'warehouseStorageNumber')
    },
    // {
    //     className: 'text-overflow-ellipsis',
    //     title: '板号',
    //     dataIndex: 'boardNumber',
    //     key: 'boardNumber',
    //     width: 140,
    //     render: (t, r, index) => colRendFun(t, r, index, 'boardNumber')
    // },
    {
        className: 'text-overflow-ellipsis',
        title: '货物状态',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        render: (t, r, index) => colRendFun(t, r, index, 'status')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '料号',
        dataIndex: 'materialNumber',
        key: 'materialNumber',
        width: 120,
        render: (t, r, index) => colRendFun(t, r, index, 'materialNumber')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '品名',
        dataIndex: 'materialName',
        key: 'materialName',
        width: 120,
        render: (t, r, index) => colRendFun(t, r, index, 'materialName')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '规格/品级',
        dataIndex: 'materialSpecifications',
        key: 'materialSpecifications',
        width: 120,
        render: (t, r, index) => colRendFun(t, r, index, 'materialSpecifications')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '客户简称',
        dataIndex: 'clientName',
        key: 'clientName',
        width: 140,
        render: (t, r, index) => colRendFun(t, r, index, 'clientName')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '批次号',
        dataIndex: 'batchNumber',
        key: 'batchNumber',
        width: 140,
        render: (t, r, index) => colRendFun(t, r, index, 'batchNumber')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        width: 100,
        render: (t, r, index) => colRendFun(t, r, index, 'unit')
    },
    // {
    //     className: 'text-overflow-ellipsis',
    //     title: '箱数',
    //     dataIndex: 'boxCount',
    //     key: 'boxCount',
    //     width: 100,
    //     render: (t, r, index) => colRendFun(t, r, index, 'boxCount')
    // },
    {
        className: 'text-overflow-ellipsis',
        title: '数量',
        dataIndex: 'quantityCount',
        key: 'quantityCount',
        width: 100,
        render: (t, r, index) => colRendFun(t, r, index, 'quantityCount')
    },
    {
        className: 'text-overflow-ellipsis',
        title: `重量(${props.weightUnit || 'kg'})`,
        dataIndex: 'grossWeight',
        key: 'grossWeight',
        width: 100,
        render: (t, r, index) => colRendFun(t, r, index, 'grossWeight')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '体积(m³)',
        dataIndex: 'volume',
        key: 'volume',
        width: 100,
        render: (t, r, index) => colRendFun(t, r, index, 'volume')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '收货单号',
        dataIndex: 'singleNumber',
        key: 'singleNumber',
        width: 130,
        render: (t, r, index) => colRendFun(t, r, index, 'singleNumber')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '收货日期',
        dataIndex: 'receiptTime',
        key: 'receiptTime',
        width: 120,
        render: (t, r, index) => colRendFun(t, r, index, 'receiptTime')
    }
]

/**
 * 库存管理
 * @class InventoryManage
 * @extends { Parent }
 */
@inject('rApi', 'mobxTabsData', 'mobxBaseData', 'mobxDataBook')
@observer
class InventoryManage extends Parent {
    constructor(props) {
        super(props)
        this.state = {
            keywords: '',
            warehouseId: null,
            clientId: null,
            receiptTimeStart: null,
            receiptTimeEnd: null,
            singleNumber: null,
            columns: colFun(),
            warehouseName: null, //当前选中仓库名称
            selectedKeys: [],
            weightUnit: 'kg'
        }
    }

    componentDidMount () {
        this.getWeightUnit()
    }

    // 获取列表数据
    getData = (params) => {
        const { rApi } = this.props
        const { keywords, warehouseId, clientId, receiptTimeStart, receiptTimeEnd, singleNumber } = this.state
        params = {
            ...params,
            pageSize: params.limit,
            keywords,
            clientId,
            warehouseId,
            receiptTimeStart,
            receiptTimeEnd,
            singleNumber
        }
        return new Promise((resolve, reject) => {
            if (!warehouseId) {
                resolve({
                    dataSource: [],
                    total: 0
                })
                return false
            }
            rApi.getInventoryManage(params)
                .then(async res => {
                    let inventoryList = [...res.records]
                    inventoryList = this.dealList(inventoryList)
                    this.getSummary()
                    resolve({
                        dataSource: inventoryList,
                        total: res.total
                    })
                })
                .catch(err => {
                    console.error(err)
                    resolve({
                        dataSource: [],
                        total: 0
                    })
                })
        })
    }

    // 处理获取的列表数据
    dealList = arr => arr.map(item => ({
        ...item,
        isChecked: false
    }))

    // 表格标题
    tbTitle = (warehouseName) => (
        <div>仓库库存(<span style={{ color: '#1DA57A'}}>{warehouseName}</span>)</div>
    )
    // 表格顶部按钮
    cusTableHeaderButton = () => (
        <React.Fragment>
            <Button style={{ marginRight: 10, verticalAlign: 'middle' }} onClick={this.showMergePlate}>合板</Button>
            <Button style={{ marginRight: 10, verticalAlign: 'middle' }} onClick={this.showSplitPlate}>拆板</Button>
        </React.Fragment>
    )

    // 自定义表格操作
    actionView = ({ text, record, index }) => {
        const menu = (
            <Menu>
                <Menu.Item key="allot">
                    <a onClick={() => this.showMoreAction('allot', record, index)} style={{ color: '#666666' }}>调拨</a>
                </Menu.Item>
                <Menu.Item key="move">
                    <a onClick={() => this.showMoreAction('move', record, index)} style={{ color: '#666666' }}>移位</a>
                </Menu.Item>
                <Menu.Item key="changeStatus">
                    <a onClick={() => this.showMoreAction('changeStatus', record, index)} style={{ color: '#666666' }}>货物状态维护</a>
                </Menu.Item>
            </Menu>
        )
        return (
            <React.Fragment>
                <span
                    className={`action-button`}
                    style={{ color: '#18B56F', marginRight: '5px' }}
                    onClick={() => this.showDetails(record, index)}
                >
                    板货明细
                </span>
                <Dropdown
                    overlay={menu}
                    trigger={['click']}
                >
                    <a className="ant-dropdown-link" style={{ color: '#18B56F' }}>
                        更多 <Icon type="down" style={{ color: '#18B56F' }} />
                    </a>
                </Dropdown>
            </React.Fragment>
        )
    }

    async getWeightUnit () {
        let weightUnit = await this.props.mobxDataBook.getWeightUnit()
        this.setState({ weightUnit })
    }

    // 显示板货明细弹窗
    showDetails = (r, index) => {
        this.details.show({
            index,
            payload: r
        })
    }
    // 显示moreAction弹窗
    showMoreAction = (type, r, index) => {
        this.actionMore.show({
            type,
            index,
            payload: r
        })
    }
    // 显示合板弹窗
    showMergePlate = () => {
        let list = this.gd()
        let targetList = list.filter(item => this.state.selectedKeys.some(s => s.id === item.id))
        if (targetList.length < 2) {
            message.warning('请选择至少两个板')
            return
        }
        this.mergePlate.show({
            payload: targetList
        })
    }
    // 显示拆板弹窗
    showSplitPlate = () => {
        let list = this.gd()
        let targetList = list.filter(item => this.state.selectedKeys.some(s => s.id === item.id))
        if (targetList.length !== 1) {
            message.warning('请选择至多一个板')
            return
        }
        this.splitPlate.show({
            payload: targetList
        })
    }

    // 改变货物状态
    changeStatus = (r, i) => {
        let list = this.gd()
        list[i].status = r.status
        this.upd(list)
    }
    // 移位
    moveAction = (r, i) => {
        let list = this.gd()
        list[i].warehouseStorageNumber = r.warehouseStorageNumber
        this.upd(list)
    }
    // 调拨
    allotAction = (r, i) => {
        let list = this.gd()
        list[i].warehouseId = r.warehouseId
        list[i].warehouseName = r.warehouseName
        list[i].warehouseStorageNumber = r.warehouseStorageNumber
        this.upd(list)
        return this
    }

    // 行选择
    changeSelect = (selectedRowKeys, { deleteKeys, addKeys }) => {
        let rt = [...this.state.selectedKeys]
        if (deleteKeys && deleteKeys.length) {
            rt = rt.filter(item => !deleteKeys.some(key => key.id === item.id))
        }
        if (addKeys && addKeys.length) {
            addKeys.forEach(item => {
                if (!rt.some(key => key.id === item.id)) {
                    rt.push(item)
                }
            })
        }
        this.setState({ selectedKeys: rt })
    }

    // 获取数量汇总
    async getSummary () {
        const { rApi } = this.props
        const { warehouseId } = this.state
        try {
            let res = await rApi.getInventorySummary({ id: warehouseId })
            console.log('r', res)
        } catch (error) {
            console.log('获取数量汇总失败')
            return false
        }
    }

    render () {
        let { warehouseId, warehouseName, receiptTimeStart, receiptTimeEnd, selectedKeys, columns, weightUnit } = this.state
        const { tableHeight } = this.props.mobxBaseData
        columns = colFun({ weightUnit })
        return (
            <div className='inventory-manage'>
                <MergePlate
                    parent={this}
                    getThis={v => this.mergePlate = v}
                    warehouseId={warehouseId}
                />
                <SplitPlate
                    parent={this}
                    getThis={v => this.splitPlate = v}
                    warehouseId={warehouseId}
                />
                <Details
                    parent={this}
                    getThis={v => this.details = v}
                />
                <ActionMore
                    parent={this}
                    getThis={v => this.actionMore = v}
                    changeStatus={this.changeStatus}
                    moveAction={this.moveAction}
                    allotAction={this.allotAction}
                />
                <HeaderView 
                    parent={this} 
                    title="板号/储位/料号" 
                    onChangeSearchValue={
                            async keyword => {
                                await this.setState({ keywords: trim(keyword) })
                                this.searchCriteria()
                        }
                    }
                >
                    <RemoteSelect
                        onChangeValue={
                            async e => {
                                let id = e ? e.id : null
                                await this.setState({ warehouseId: id, warehouseName: e ? e.name : '未选择仓库' })
                                this.searchCriteria()
                            }
                        }
                        placeholder='仓库名称'
                        getDataMethod={'getWarehouseList'}
                        params={{ pageNo: 1, pageSize: 99999 }}
                        labelField={'name'}
                    />
                    <RemoteSelect
                        onChangeValue={
                            async e => {
                                let id = e ? e.id : 0
                                await this.setState({ clientId: id })
                                this.searchCriteria()
                            }
                        }
                        params={{limit: 99999, offset: 0}}
                        getDataMethod={'getClients'}
                        placeholder='客户简称'
                        labelField={'shortname'}
                    />
                    <div style={{ width: 290 }}>
                        <TimePicker
                            startTitle={'收货开始日期'}
                            endTitle={'收货结束日期'}
                            startTime={receiptTimeStart}
                            endTime={receiptTimeEnd}
                            changeStartTime={(date, dateStr) => {
                                this.setState({
                                    receiptTimeStart: dateStr
                                }, this.searchCriteria())
                            }}
                            changeEndTime={(date, dateStr) => {
                                this.setState({
                                    receiptTimeEnd: date ? moment(date).add(1, 'days').format('YYYY-MM-DD') : null
                                }, this.searchCriteria())
                            }}
                            getFieldDecorator={null}
                            pickerWidth={{ width: 130 }}
                        />
                    </div>
                    {
                        warehouseId &&
                        <RemoteSelect
                            onChangeValue={
                                async e => {
                                    let number = e ? e.number : ''
                                    await this.setState({ singleNumber: number })
                                    this.searchCriteria()
                                }
                            }
                            params={{ limit: 99999, offset: 0, id: warehouseId }}
                            getDataMethod={'getWarehouseReceiptNumber'}
                            placeholder='收货单号'
                            labelField={'number'}
                            showOrigin
                            dealData={arr => arr.map((number, index) => ({
                                id: index,
                                number
                            }))}
                        />
                    }
                </HeaderView>
                <Table
                    className='sd-block page-table'
                    parent={this}
                    isHideDeleteButton
                    isHideAddButton
                    title={this.tbTitle(warehouseName ? warehouseName : '未选择仓库')}
                    getData={this.getData}
                    columns={columns}
                    tableWidth={140}
                    tableHeight={tableHeight}
                    isCustomPagination
                    cusTableHeaderButton={this.cusTableHeaderButton()}
                    selectedPropsRowKeys={selectedKeys}
                    onChangeSelect={this.changeSelect}
                    actionWidth={150}
                    actionView={this.actionView}
                />
          </div>
        )
    }
}

export default InventoryManage