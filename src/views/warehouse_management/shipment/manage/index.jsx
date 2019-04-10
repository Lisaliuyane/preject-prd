import React from 'react'
import { Radio, Spin, Tag, message } from 'antd'
import { inject, observer } from "mobx-react"
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import RemoteSelect from '@src/components/select_databook'
import { trim } from '@src/utils'
import { InfoShipment } from '@src/views/warehouse_management/public/Info'
import Summary from './Summary'
import Details from './Details'
import Scanning from './Scanning'
import moment from 'moment'
import { children, id } from './power'
import '@src/views/warehouse_management/receipt/manage/index.less'

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
                <ColumnItemBox active={r.isActive} style={{color: r.color}} name={name} />
            )
    
        default:
            if (key === 'deliveryTime') {
                name = t ? moment(t).format('YYYY-MM-DD HH:mm') : ''
            } else if (key === 'warehouse') {
                name = r.name || '-'
            } else if (key === 'oIndex') {
                name = index + 1
                style = {textAlign: 'center'}
            }
            return (
                <ColumnItemBox active={r.isActive} style={style} name={name} />
            )
    }
}

const colFun = (props = {}) => [
    {
        className: 'text-overflow-ellipsis',
        title: '序号',
        dataIndex: 'oIndex',
        key: 'oIndex',
        width: 50,
        render: (t, r, index) => colRendFun(t, r, index, 'oIndex')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '状态',
        dataIndex: 'shipmentManageStatus',
        key: 'shipmentManageStatus',
        width: 90,
        filters: statusFilterList,
        render: (t, r, index) => colRendFun(t, r, index, 'shipmentManageStatus')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '出货单号',
        dataIndex: 'singleNumber',
        key: 'singleNumber',
        width: 120,
        render: (t, r, index) => colRendFun(t, r, index, 'singleNumber')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '客户简称',
        dataIndex: 'clientName',
        key: 'clientName',
        width: 120,
        render: (t, r, index) => colRendFun(t, r, index, 'clientName')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '出货仓库',
        dataIndex: 'warehouse',
        key: 'warehouse',
        width: 100,
        filters: props.warehouseList ? props.warehouseList : null,
        render: (t, r, index) => colRendFun(t, r, index, 'warehouse')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '要求交货时间',
        dataIndex: 'deliveryTime',
        key: 'deliveryTime',
        width: 120,
        render: (t, r, index) => colRendFun(t, r, index, 'deliveryTime')
    }
]

/**
 * 出货管理
 * @class ShipmentManage
 * @extends {Parent}
 */
@inject('rApi', 'mobxTabsData', 'mobxDataBook')
@observer
class ShipmentManage extends Parent {
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
            return <Spin style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}} />
        } else if (list && list.length < 1) {
            return <div style={{width: '100%', textAlign: 'center'}}>暂无数据</div>
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

    async getWeightUnit () {
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
            await this.props.rApi.confirmShipment({id: curRow.shipmentManageId})
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

    render() {
        const { showDrawer, curRow, filterTags, curTable, reloadRow, weightUnit } = this.state
        return (
            <div className='page-shipment-manage' ref={v => this.rootDom = v} style={{ height: this.props.minHeight }}>
                <div className='page-main'>
                    <div className='main-content'>
                        <InfoShipment
                            className='sd-block head-info'
                            curRow={curRow}
                        />
                        {
                            // curRow && curRow.shipmentManageId ?
                            <React.Fragment>
                                <div className='btn-bar'>
                                    <Radio.Group
                                        value={curTable}
                                        buttonStyle="solid"
                                        onChange={this.changeTable}
                                    >
                                        <Radio.Button value="summary">出货清单</Radio.Button>
                                        <Radio.Button value="details">拣货明细</Radio.Button>
                                        <Radio.Button value="scanning">出库扫描</Radio.Button>
                                    </Radio.Group>
                                </div>
                                <div className='sd-block tb-content'>
                                    {
                                        reloadRow ? null : curTable === 'summary' ? <Summary
                                            power={power}
                                            curRow={curRow}
                                        /> : curTable === 'details' ? <Details
                                            parent={this}
                                            className='tb-details'
                                            power={power}
                                            curRow={curRow}
                                            confirmShipment={this.confirmShipment}
                                            weightUnit={weightUnit}
                                        /> : curTable === 'scanning' ? <Scanning
                                            power={power}
                                            curRow={curRow}
                                        /> : null
                                    }
                                </div>
                            </React.Fragment>
                        }
                    </div>
                    <div className={`sd-block right-content ${showDrawer ? 'hide' : 'show'}`}>
                        <div
                            className={`fold-btn close`}
                            onClick={e => {
                                this.setState({ showDrawer: !showDrawer })
                            }}
                        ></div>
                        {
                            this.renderList()
                        }
                    </div>
                </div>
                <div
                    className={`drawer-box ${showDrawer ? 'show' : 'hide'}`}
                    onClick={this.drawerClick}
                >
                    <div className='sd-block content' onClick={e => e.stopPropagation()}>
                        <div
                            className={`fold-btn open`}
                            onClick={e => {
                                this.setState({ showDrawer: !showDrawer })
                            }}
                        ></div>
                        <div className='headbar'>
                            <span style={{ marginRight: 10, color: '#888' }}>已过滤：</span><span>{
                                filterTags && filterTags.length > 0 ? filterTags.map((item, index) => (
                                    <Tag key={index}>{item.text}</Tag>
                                )) : null
                            }</span>
                        </div>
                        <HeaderView
                            parent={this}
                            title="出货单号"
                            onChangeSearchValue={
                                keyword => {
                                    this.setState({ singleNumber: trim(keyword) }, this.onChangeValue())
                                }}
                        >
                            <RemoteSelect
                                placeholder='客户名称'
                                onChangeValue={
                                    e => {
                                        let clientId = e ? e.id : null
                                        this.setState({ clientId }, this.onChangeValue())
                                    }
                                }
                                getDataMethod={'getClients'}
                                params={{ limit: 99999, offset: 0, status: 56 }}
                                labelField={'shortname'}
                            />
                        </HeaderView>
                        <Table
                            noTitlebar
                            isNoneAction
                            isHideHeaderButton
                            isHideDeleteButton
                            isNoneSelected
                            isNoneNum
                            isPreventActionEvent
                            isNoneScroll={false}
                            parent={this}
                            title={null}
                            params={this.state.params}
                            getData={this.getData}
                            columns={this.state.columns}
                            onRowClick={this.rowClick}
                            tableWidth={150}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default ShipmentManage