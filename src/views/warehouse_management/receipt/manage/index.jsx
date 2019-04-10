import React from 'react'
import { inject, observer } from "mobx-react"
import { Radio, Tag, message, Spin } from 'antd'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import RemoteSelect from '@src/components/select_databook'
import { deleteNull, trim } from '@src/utils'
import { children, id } from './power'
import Info from '../../public/Info'
import Summary from './Summary'
import Details from './Details'
import Scanning from './Scanning'
import moment from 'moment'
import './index.less'

const power = Object.assign({}, children, id)
const statusFilterList = [
    {
        text: '待收货',
        value: 1
    },
    {
        text: '待入储',
        value: 2
    },
    {
        text: '已完成',
        value: 3
    }
]

// 表格列
const columnsFun = (warehouseList, curRow = {}) => {
    let rt = [
        {
            className: 'text-overflow-ellipsis',
            title: '序号',
            dataIndex: 'oIndex',
            key: 'oIndex',
            width: 50,
            render: (t, r, index) => {
                return (
                    <ColumnItemBox active={r.isActive} style={{ textAlign: 'center' }} name={index + 1} />
                )
            }
        },
        {
            className: 'text-overflow-ellipsis',
            title: '状态',
            dataIndex: 'receiptManageStatus',
            key: 'receiptManageStatus',
            width: 90,
            filters: statusFilterList,
            render: (t, r, index) => {
                let name = '待收货'
                switch (t) {
                    case 1:
                        name = '待收货'
                        break;
                    case 2:
                        name = '待入储'
                        break;
                    case 3:
                        name = '已完成'
                        break;
                    
                    default:
                        name = '-'
                        break;
                }
                return (
                    <ColumnItemBox active={r.isActive} style={{ color: r.color }} name={name} />
                )
            }
        },
        {
            className: 'text-overflow-ellipsis',
            title: '收货单号',
            dataIndex: 'singleNumber',
            key: 'singleNumber',
            width: 120,
            render: (t, r, index) => {
                return (
                    <ColumnItemBox active={r.isActive} name={t} />
                )
            }
        },
        {
            className: 'text-overflow-ellipsis',
            title: '客户名称',
            dataIndex: 'clientName',
            key: 'clientName',
            width: 120,
            render: (t, r, index) => {
                return (
                    <ColumnItemBox active={r.isActive} name={t} />
                )
            }
        },
        {
            className: 'text-overflow-ellipsis',
            title: '收货仓库',
            dataIndex: 'name',
            key: 'name',
            width: 120,
            render: (t, r, index) => {
                return (
                    <ColumnItemBox active={r.isActive} name={t} />
                )
            }
        },
        {
            className: 'text-overflow-ellipsis',
            title: '预计到仓时间',
            dataIndex: 'expectedTime',
            key: 'expectedTime',
            width: 120,
            render: (t, r, index) => {
                let name = t ? moment(t).format('YYYY-MM-DD HH:mm') : '-'
                return (
                    <ColumnItemBox active={r.isActive} name={name} />
                )
            }
        }
    ]
    if (warehouseList && warehouseList.length) {
        rt.splice(4, 1, {
            className: 'text-overflow-ellipsis',
            title: '收货仓库',
            dataIndex: 'warehouse',
            key: 'warehouse',
            width: 120,
            filters: warehouseList,
            render: (t, r, index) => {
                let name = r.name ? r.name : '-'
                return (
                    <ColumnItemBox active={r.isActive} name={name} />
                )
            }
        })
    }
    return rt
}

/**
 * 收货管理
 * @class ReceiptManage
 * @extends {Parent}
 */
@inject('rApi', 'mobxTabsData', 'mobxDataBook')
@observer
class ReceiptManage extends Parent {

    constructor(props) {
        super(props)
        this.state = {
            rClickTime: 0,
            showDrawer: false, //右侧抽屉是否显示
            curRow: {}, //当前选中列表行
            clientId: null,
            singleNumber: null,
            reloadRow: false,
            curTable: 'summary', //当前选中类型
            warehouseList: [],
            filterTags: [], // 当前已过滤仓库
            listLoading: false,
            completeLoading: false,
            weightUnit: 'kg'
        }
        this.state.columns = columnsFun()
    }

    componentDidMount () {
        this.getWarehouseList()
        this.getWeightUnit()
    }

    onChangeValue = () => {
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    // 获取数据
    getData = async (params) => {
        let { warehouseList, clientId, singleNumber } = this.state
        const { rApi } = this.props
        let filterTags = []
        if (params && params.receiptManageStatusFilters) {
            filterTags = statusFilterList.filter(item => params.receiptManageStatusFilters.some(id => parseInt(id, 10) === item.value))
        }
        if (params && params.warehouseFilters) {
            filterTags = [...filterTags, ...warehouseList.filter(item => params.warehouseFilters.some(id => parseInt(id, 10) === item.value))]
        }
        params = {
            ...params,
            pageSize: params.limit,
            clientId,
            singleNumber
        }
        this.setState({ listLoading: true })
        return new Promise((resolve, reject) => {
            params = deleteNull(params)
            rApi[power.apiName](params)
                .then(async d => {
                    let list = [...d.records]
                    list = this.dealList(list)
                    await this.setState({ filterTags, listLoading: false, curRow: {} })
                    resolve({
                        dataSource: list,
                        total: d.total
                    })
                    return list
                })
                .then(list => {
                    if (list && list.length && this.state.rClickTime < 1) {
                        this.rowClick(list[0], 0)
                    }
                })
                .catch(err => {
                    this.setState({ listLoading: false })
                    reject(err)
                })
        })
    }

    // 处理列表数据
    dealList = arr => {
        return arr.map(item => ({
            ...item,
            isActive: false,
            color: item.receiptManageStatus === 1 ? '#108EE9' : item.receiptManageStatus === 2 ? '#E76400' : '#57B017'
        }))
    }

    async getWeightUnit () {
        let weightUnit = await this.props.mobxDataBook.getWeightUnit()
        this.setState({ weightUnit })
    }

    // 列表点击事件
    rowClick = async (r, rIndex) => {
        if (this.state.curRow.receiptManageId === r.receiptManageId) return
        let list = this.gd()
        let rClickTime = this.state.rClickTime + 1
        list = list.map((item, i) => ({
            ...item,
            isActive: i === rIndex
        }))
        this.upd(list)
        await this.setState({
            curRow: r,
            rClickTime,
            reloadRow: true,
        })
        this.setState({ reloadRow: false })
    }

    // 获取仓库列表数据
    async getWarehouseList () {
        let res = null
        try {
            res = await this.props.rApi.getWarehouseList({pageNo: 1, pageSize: 99999})
        } catch (error) {
            this.setState({warehouseList: []})
            return
        }
        if (res && res.records) {
            let warehouseList = res.records.map(item => ({
                key: item.id,
                text: item.name,
                value: item.id
            }))
            await this.setState({ warehouseList })
            let columns = columnsFun(this.state.warehouseList)
            this.setState({columns})
        }
    }

    // 入储完成
    toStorage = () => {
        let list = this.gd()
        let { curRow } = this.state
        list = list.map(item => ({
            ...item,
            receiptManageStatus: item.receiptManageId === curRow.receiptManageId ? 3 : item.receiptManageStatus,
            color: item.receiptManageId === curRow.receiptManageId ? '#57B017' : item.color
        }))
        curRow = { ...curRow, receiptManageStatus: 3, color: '#57B017' }
        this.upd(list)
        this.setState({ curRow })
    }

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
                            let statusStr = '待收货'
                            switch (item.receiptManageStatus) {
                                case 1:
                                    statusStr = '待收货'
                                    break;
                                case 2:
                                    statusStr = '待入储'
                                    break;
                                case 3:
                                    statusStr = '已完成'
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

    // 改变table类型显示
    changeTable = e => {
        let curTable = e ? e.target.value : 'summary'
        this.setState({ curTable })
    }

    // 完成收货
    completeReceipt = async () => {
        if (this.state.completeLoading) return
        const { curRow } = this.state
        this.setState({ completeLoading: true })
        try {
            await this.props.rApi.completeReceiptManage({ id: curRow.receiptManageId })
            let list = this.gd()
            curRow.receiptManageStatus = 2
            curRow.color = '#E76400'
            list = list.map(item => ({
                ...item,
                receiptManageStatus: curRow.receiptManageId === item.receiptManageId ? 2 : item.receiptManageStatus,
                color: curRow.receiptManageId === item.receiptManageId ? '#E76400' : item.color
            }))
            this.upd(list)
            this.setState({ completeLoading: false, curRow })
            message.success('操作成功')
        } catch (error) {
            this.setState({ completeLoading: false })
            message.error(error.msg || '操作失败')
            return
        }
    }

    // drawerClick
    drawerClick = e => {
        if (this.state.showDrawer) {
            this.setState({ showDrawer: false })
        }
    }

    render() {
        const {
            showDrawer,
            curRow,
            curTable,
            reloadRow,
            filterTags,
            completeLoading,
            weightUnit
        } = this.state
        return (
            <div className='page-receipt-manage' ref={v => this.rootDom = v} style={{height: this.props.minHeight}}>
                <div className='page-main'>
                    <div className='main-content'>
                        <Info
                            className='sd-block head-info'
                            curRow={curRow}
                        />
                        <div className='btn-bar'>
                            <Radio.Group
                                value={curTable}
                                buttonStyle="solid"
                                onChange={this.changeTable}
                            >
                                <Radio.Button value="summary">收货汇总</Radio.Button>
                                <Radio.Button value="details">收货明细</Radio.Button>
                                <Radio.Button value="scanning">收货扫描</Radio.Button>
                            </Radio.Group>
                        </div>
                        <div className='sd-block tb-content'>
                            {
                                reloadRow ? null : curTable === 'summary' ? <Summary
                                    power={power}
                                    curRow={curRow}
                                    weightUnit={weightUnit}
                                /> : curTable === 'details' ? <Details
                                    parent={this}
                                    className='tb-details'
                                    power={power}
                                    curRow={curRow}
                                    toStorage={this.toStorage}
                                    completeReceipt={this.completeReceipt}
                                    completeLoading={completeLoading}
                                    weightUnit={weightUnit}
                                /> : curTable === 'scanning' ? <Scanning
                                    power={power}
                                    curRow={curRow}
                                /> : null
                            }
                        </div>
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
                                    <Tag key={index} closable={false}>{item.text}</Tag>
                                )) : null
                            }</span>
                        </div>
                        <HeaderView
                            parent={this}
                            title="收货单号"
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
                            isNoneNum
                            isHideDeleteButton
                            isNoneSelected
                            isPreventActionEvent
                            isNoneScroll={false}
                            parent={this}
                            title={null}
                            params={this.state.params}
                            getData={this.getData}
                            columns={this.state.columns}
                            onRowClick={this.rowClick}
                            tableWidth={100}
                            tableHeight={500}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default ReceiptManage