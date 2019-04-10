import React from 'react'
import { Radio, Spin, Tag, message, Button, DatePicker } from 'antd'
import { inject, observer } from "mobx-react"
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import RemoteSelect from '@src/components/select_databook'
import { trim } from '@src/utils'
import { InfoShipment } from '@src/views/warehouse_management/public/Info'
// import Summary from './Summary'
// import Details from './Details'
// import Scanning from './Scanning'
import moment from 'moment'
import { children, id } from './power'
import '@src/views/warehouse_management/receipt/manage/index.less'

import FunctionPower from '@src/views/layout/power_view/function.jsx'

const power = Object.assign({}, children, id)
const statusFilterList = [
    {
        text: '待出货',
        value: 1,
    },
    {
        text: '已拣货',
        value: 2
    },
    {
        text: '已出货',
        value: 3,
    }
]

const colRendFun = (t, r, index, key) => {
    let name = t
    let style = {}
    switch (key) {
        case 'shipmentManageStatus': //状态
            switch (t) {
                case 1:
                    name = '待出货'
                    break;
                case 2:
                    name = '已拣货'
                    break;
                case 3:
                    name = '已出货'
                    break;
                default:
                    name = '-'
                    break;
            }
            return (
                <ColumnItemBox active={r.isActive} style={{ color: r.color }} name={name} />
            )

        default:
            if (key === 'deliveryTime') {
                name = t ? moment(t).format('YYYY-MM-DD HH:mm') : ''
            } else if (key === 'warehouse') {
                name = r.name || '-'
            } else if (key === 'oIndex') {
                name = index + 1
                style = { textAlign: 'center' }
            }
            return (
                <ColumnItemBox active={r.isActive} style={style} name={name} />
            )
    }
}

/**字段列表 */
const colFun = (props = {}) => [
    {

        className: 'text-overflow-ellipsis',
        title: '收货单号',
        dataIndex: 'clientName',
        key: 'clientName',
        width: 120
    },
    {
        className: 'text-overflow-ellipsis',
        title: '仓库',
        dataIndex: '',
        key: '',
        width: 180
    },
    {
        className: 'text-overflow-ellipsis',
        title: '客户名称',
        dataIndex: '',
        key: '',
        width: 220
    },
    {
        className: 'text-overflow-ellipsis',
        title: '收货日期',
        dataIndex: '',
        key: '',
        width: 150
    },
    {
        className: 'text-overflow-ellipsis',
        title: '收货类型',
        dataIndex: '',
        key: '',
        width: 150
    },
    {
        className: 'text-overflow-ellipsis',
        title: '收货方式',
        dataIndex: '',
        key: '',
        width: 180
    },
    {
        className: 'text-overflow-ellipsis',
        title: '操作模式',
        dataIndex: '',
        key: '',
        width: 180
    },
    {
        className: 'text-overflow-ellipsis',
        title: '订单号',
        dataIndex: '',
        key: '',
        width: 180
    }
]

/**
 * 出货管理
 * @class ShipmentManage
 * @extends {Parent}
 */
@inject('rApi', 'mobxTabsData', 'mobxDataBook', 'mobxBaseData')
@observer
class ReceiptOrder extends Parent {
    constructor(props) {
        super(props)
        this.state = {
            /* 筛选条件字段 */
            clientId: null,
            singleNumber: null,
            /* 筛选条件字段 */
            listLoading: false,
            showDrawer: false, //右侧抽屉是否显示
            columns: colFun(),
            curRow: {}, //当前选中行数据
            rClickTime: 0,
            warehouseList: [],
            filterTags: [],
            curTable: 'summary', // 当前tab
            reloadRow: false,
            weightUnit: 'kg'
        }
    }

    componentDidMount() {
        this.getWarehouseList()
        this.getWeightUnit()
    }

    onChangeValue = () => {
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    // 出货列表数据获取
    getData = async (params) => {
        const { rApi } = this.props
        let { clientId, warehouseList, singleNumber } = this.state
        let filterTags = []
        if (params && params.shipmentManageStatusFilters) {
            filterTags = statusFilterList.filter(item => params.shipmentManageStatusFilters.some(id => parseInt(id, 10) === item.value))
        }
        if (params && params.warehouseFilters) {
            filterTags = [...filterTags, ...warehouseList.filter(item => params.warehouseFilters.some(id => parseInt(id, 10) === item.value))]
        }
        params = Object.assign({}, params, {
            pageSize: params.limit,
            clientId,
            singleNumber
        })
        this.setState({ listLoading: true })
        return new Promise((resolve, reject) => {
            rApi[power.apiName](params)
                .then(async res => {
                    let list = [...res.records]
                    list = this.dealList(list)
                    resolve({
                        dataSource: list,
                        total: res.total
                    })
                    await this.setState({ filterTags, listLoading: false, curRow: {} })
                    return list
                })
                .then((list) => {
                    if (list && list.length && this.state.rClickTime < 1) {
                        this.rowClick(list[0], 0)
                    }
                })
                .catch(err => {
                    this.setState({ listLoading: false })
                    resolve({
                        dataSource: [],
                        total: 0
                    })
                })
        })
    }

    // 处理数据
    dealList = arr => arr.map((item, index) => ({
        ...item,
        isActive: false,
        color: item.shipmentManageStatus === 1 ? '#E76400' : item.shipmentManageStatus === 2 ? '#108EE9' : '#57B017'
    }))

    // 列表渲染
    renderList = () => {
        let list = this.gd()
        if (this.state.listLoading) {
            return <Spin style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
        } else if (list && list.length < 1) {
            return <div style={{ width: '100%', textAlign: 'center' }}>暂无数据</div>
        } else {
            return (
                <ul className='tb-oul'>
                    {
                        list.map((item, index) => {
                            let statusStr = '待出货'
                            switch (item.shipmentManageStatus) {
                                case 1:
                                    statusStr = '待出货'
                                    break;
                                case 2:
                                    statusStr = '已拣货'
                                    break;
                                case 3:
                                    statusStr = '已出货'
                                    break;
                                default:
                                    statusStr = '-'
                                    break;
                            }
                            return (
                                <li
                                    key={index}
                                    className={`tb-oli ${item.isActive ? 'active' : ''}`}
                                    onClick={e => this.rowClick(item, index)}
                                >
                                    <div>{index + 1}</div>
                                    <div style={{ color: item.color }} className='text-overflow-ellipsis'>{statusStr}</div>
                                    <div>{item.singleNumber}</div>
                                </li>
                            )
                        })
                    }
                </ul>
            )
        }
    }

    // 点击出货需求列表行
    rowClick = async (r, rIndex) => {
        if (this.state.curRow.shipmentManageId === r.shipmentManageId) return
        let rClickTime = this.state.rClickTime + 1
        let list = this.gd()
        list = list.map((item, index) => ({
            ...item,
            isActive: index === rIndex
        }))
        this.upd(list)
        await this.setState({ curRow: r, rClickTime, reloadRow: true })
        this.setState({ reloadRow: false })
    }

    // 获取仓库列表数据
    async getWarehouseList() {
        let res = null
        try {
            res = await this.props.rApi.getWarehouseList({ pageNo: 1, pageSize: 99999 })
        } catch (error) {
            this.setState({ warehouseList: [] })
            return
        }
        if (res && res.records) {
            let warehouseList = res.records.map(item => ({
                key: item.id,
                text: item.name,
                value: item.id
            }))
            await this.setState({ warehouseList })
            let columns = colFun({ warehouseList: this.state.warehouseList })
            this.setState({ columns })
        }
    }

    async getWeightUnit() {
        let weightUnit = await this.props.mobxDataBook.getWeightUnit()
        this.setState({ weightUnit })
    }

    // 改变table类型显示
    changeTable = e => {
        let curTable = e ? e.target.value : 'summary'
        this.setState({ curTable })
    }

    // 确认出货
    confirmShipment = async () => {
        const { curRow } = this.state
        try {
            await this.props.rApi.confirmShipment({ id: curRow.shipmentManageId })
        } catch (error) {
            message.error(error.msg || '操作失败')
            return
        }
        message.success('操作成功')
        this.searchCriteria()
    }

    // drawerClick
    drawerClick = e => {
        if (this.state.showDrawer) {
            this.setState({ showDrawer: false })
        }
    }


    /* 表格顶部按钮 */
    tbHeadButton = () => {
        return (
            [
                <FunctionPower
                    key='导出'
                    power={power.ADD_DATA}
                >
                    <Button
                        onClick={e => this.openWarehousePlus('add', null)}
                        style={{ marginRight: 10, verticalAlign: 'middle' }}
                        icon="export"
                    >
                        导出
                    </Button>
                </FunctionPower>
            ]
        )
    }
    
    render() {
        const { showDrawer, curRow, filterTags, reloadRow, weightUnit } = this.state
        return (
            <div className='page-shipment-manage' ref={v => this.rootDom = v} style={{ height: this.props.minHeight }}>
                <HeaderView parent={this} title="订单编号" onChangeSearchValue={
                    keyword => {
                        this.setState({ keyWords: trim(keyword) }, this.onChangeValue({ keyWords: trim(keyword) }))
                    }
                }>
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({ clientId: e ? e.id : null }, this.onChangeValue({ clientId: e ? e.id : null }))
                            }
                        }
                        placeholder='客户名称'
                        getDataMethod={'getClients'}
                        params={{ limit: 999999, offset: 0, status: 56 }}
                        labelField={'shortname'}
                    >
                    </RemoteSelect>
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({ clientId: e ? e.id : null }, this.onChangeValue({ clientId: e ? e.id : null }))
                            }
                        }
                        placeholder='项目名称'
                        getDataMethod={'getClients'}
                        params={{ limit: 999999, offset: 0, status: 56 }}
                        labelField={'shortname'}
                    >
                    </RemoteSelect>

                    <DatePicker placeholder="下单日期开始">

                    </DatePicker>
                    <DatePicker placeholder="下单日期结束">

                    </DatePicker>
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({ clientId: e ? e.id : null }, this.onChangeValue({ clientId: e ? e.id : null }))
                            }
                        }
                        placeholder='起运地'
                        getDataMethod={'getClients'}
                        params={{ limit: 999999, offset: 0, status: 56 }}
                        labelField={'shortname'}
                    >
                    </RemoteSelect>
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({ clientId: e ? e.id : null }, this.onChangeValue({ clientId: e ? e.id : null }))
                            }
                        }
                        placeholder='目的地'
                        getDataMethod={'getClients'}
                        params={{ limit: 999999, offset: 0, status: 56 }}
                        labelField={'shortname'}
                    >
                    </RemoteSelect>
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({ clientId: e ? e.id : null }, this.onChangeValue({ clientId: e ? e.id : null }))
                            }
                        }
                        placeholder='中转地'
                        getDataMethod={'getClients'}
                        params={{ limit: 999999, offset: 0, status: 56 }}
                        labelField={'shortname'}
                    >
                    </RemoteSelect>

                </HeaderView>
                <Table
                    isNoneAction
                    isHideDeleteButton
                    isHideAddButton
                    isPreventActionEvent
                    isNoneScroll={false}
                    parent={this}
                    title={null}
                    cusTableHeaderButton={this.tbHeadButton()}
                    params={this.state.params}
                    getData={this.getData}
                    columns={this.state.columns}
                    onRowClick={this.rowClick}
                    tableWidth={100}
                    tableHeight={500}
                >
                </Table>
            </div >
        )
    }
}

export default ReceiptOrder