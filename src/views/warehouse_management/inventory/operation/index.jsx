import React from 'react'
import { inject, observer } from "mobx-react"
import { Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { Spin, Tag, Popconfirm, Button, message } from 'antd'
import { children, id } from './power'
import Operation from './Operation'
import ModalPlan from './ModalPlan'
import InfoOperation from './InfoOperation'
import { imgClient } from '@src/utils'
import '@src/views/warehouse_management/receipt/manage/index.less'

const power = Object.assign({}, children, id)
const statusFilterList = [
    {
        text: '未完成',
        value: 1
    },
    {
        text: '已完成',
        value: 2
    }
]

const colRendFun = (t, r, index, key) => {
    let name = t
    let style = {}
    switch (key) {
        case 'oIndex':
            name = index + 1
            style = {textAlign: 'center'}
            return (
                <ColumnItemBox active={r.isActive} style={style} name={name} />
            )

        case 'status': //状态
            switch (t) {
                case 1:
                    name = '未完成'
                    break;
                case 2:
                    name = '已完成'
                    break;
                default:
                    name = '-'
                    break;
            }
            return (
                <ColumnItemBox active={r.isActive} style={{ color: r.color }} name={name} />
            )

        default:
            if (key === 'warehouse') {
                name = r.warehouseName || '-'
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
        dataIndex: 'status',
        key: 'status',
        width: 90,
        filters: statusFilterList,
        render: (t, r, index) => colRendFun(t, r, index, 'status')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '盘点单号',
        dataIndex: 'checkNumber',
        key: 'checkNumber',
        width: 120,
        render: (t, r, index) => colRendFun(t, r, index, 'checkNumber')
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
        title: '盘点仓库',
        dataIndex: 'warehouse',
        key: 'warehouse',
        width: 100,
        filters: props.warehouseList ? props.warehouseList : null,
        render: (t, r, index) => colRendFun(t, r, index, 'warehouse')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '盘点方式',
        dataIndex: 'checkTypeName',
        key: 'checkTypeName',
        width: 120,
        render: (t, r, index) => colRendFun(t, r, index, 'checkTypeName')
    }
]

/**
 * 盘点作业
 * @class InventoryOperation
 * @extends {Parent}
 */
@inject('rApi', 'mobxTabsData', 'mobxDataBook')
@observer
class InventoryOperation extends Parent {
    constructor(props) {
        super(props)
        this.state = {
            listLoading: false,
            filterTags: [],
            showDrawer: false,
            warehouseList: [],
            columns: colFun(),
            rClickTime: 0,
            weightUnit: 'kg',
            fileData: {}
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

    // 列表数据获取
    getData = (params) => {
        const { rApi } = this.props
        let { warehouseList } = this.state
        let filterTags = []
        if (params && params.statusFilters) {
            filterTags = statusFilterList.filter(item => params.statusFilters.some(id => parseInt(id, 10) === item.value))
        }
        if (params && params.warehouseFilters) {
            filterTags = [...filterTags, ...warehouseList.filter(item => params.warehouseFilters.some(id => parseInt(id, 10) === item.value))]
        }
        params = {
            ...params,
            pageSize: params.limit
        }
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
        color: item.status === 1 ? '#108EE9' : item.status === 2 ? '#57B017' : '#57B017'
    }))

    async getWeightUnit() {
        let weightUnit = await this.props.mobxDataBook.getWeightUnit()
        this.setState({ weightUnit })
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
                            let statusStr = '待出货'
                            switch (item.status) {
                                case 1:
                                    statusStr = '未完成'
                                    break;
                                case 2:
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
                                    <div>{item.checkNumber}</div>
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
        if (this.state.curRow.id === r.id) return
        let rClickTime = this.state.rClickTime + 1
        let list = this.gd()
        list = list.map((item, index) => ({
            ...item,
            isActive: index === rIndex
        }))
        this.upd(list)
        this.infoOpt.setState({ fileList: [{
            uid: -1,
            name: r.fileName,
            status: 'done',
            response: '',
            linkProps: imgClient().signatureUrl(r.filePath)
        }] })
        await this.setState({ curRow: r, rClickTime, reloadRow: true })
        this.setState({ reloadRow: false })
    }

    // drawerClick
    drawerClick = e => {
        if (this.state.showDrawer) {
            this.setState({ showDrawer: false })
        }
    }

    // 弹窗显示
    modalShow = () => {
        this.modalPlan.show({

        })
        if (this.state.showDrawer) {
            this.setState({ showDrawer: false })
        }
    }

    // 盘点完成
    confirmCheckPlan = async () => {
        const { curRow } = this.state
        try {
            await this.props.rApi.confirmCheckPlan({ id: curRow.id })
            message.success('操作成功')
            this.onChangeValue()
        } catch (error) {
            message.error(error.msg || '操作失败')
            return false
        }
    }

    // 删除盘点计划
    deleteCheckPlan = async () => {
        const {curRow} = this.state
        try {
            await this.props.rApi.deleteCheckPlan({ id: curRow.id })
            message.success('操作成功')
            this.onChangeValue()
        } catch (error) {
            message.error(error.msg || '操作失败')
            return false
        }
    }

    // 上传成功
    uploadCallback = (obj) => {
        let list = this.gd()
        list = list.map(item => ({
            ...item,
            fileName: item.id === obj.id ? obj.fileName : item.fileName,
            filePath: item.id === obj.id ? obj.filePath : item.filePath
        }))
        this.upd(list)
        this.setState({ curRow: obj })
    }

    render() {
        const {
            curRow,
            showDrawer,
            filterTags,
            weightUnit
        } = this.state
        return (
            <div 
                className='page-inventory-operation'
                ref={v => this.rootDom = v}
                style={{ height: this.props.minHeight }}
            >
                <ModalPlan
                    parent={this}
                    getThis={v => this.modalPlan = v}
                    weightUnit={weightUnit}
                />
                <div className='page-main'>
                    <div className='main-content'>
                        <InfoOperation
                            className='sd-block head-info'
                            curRow={curRow}
                            getThis={v => this.infoOpt = v}
                            uploadCallback={this.uploadCallback}
                        />
                        <div className='btn-bar'>
                            <div></div>
                            <div>
                                <Popconfirm
                                    title='确定完成盘点？'
                                    onConfirm={this.confirmCheckPlan}
                                >
                                    <Button
                                        type='primary'
                                        disabled={curRow && curRow.status === 2}
                                    >盘点完成</Button>
                                </Popconfirm>
                                <Popconfirm
                                    title='确定删除？'
                                    onConfirm={this.deleteCheckPlan}
                                >
                                    <Button
                                        style={{ marginLeft: 10 }}
                                    // disabled={curRow.shipmentManageStatus !== 2}
                                    >删除</Button>
                                </Popconfirm>
                            </div>
                        </div>
                        <div className='sd-block tb-content'>
                            <Operation
                                power={power}
                                curRow={curRow}
                                weightUnit={weightUnit}
                                getThis={v => this.operation = v}
                            />
                        </div>
                    </div>
                    <div className={`sd-block right-content ${showDrawer ? 'hide' : 'show'}`}>
                        <div
                            className={`fold-btn close`}
                            onClick={e => {
                                this.setState({ showDrawer: !showDrawer })
                            }}
                        ></div>
                        <div>
                            <Button block icon='plus' onClick={this.modalShow} style={{ color: '#38c292' }}>新建盘点计划</Button>
                        </div>
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
                        <div style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                            <Button icon='plus' type='primary' onClick={this.modalShow}>新建盘点计划</Button>
                        </div>
                        <div className='headbar'>
                            <span style={{ marginRight: 10, color: '#888' }}>已过滤：</span><span>{
                                filterTags && filterTags.length > 0 ? filterTags.map((item, index) => (
                                    <Tag key={index}>{item.text}</Tag>
                                )) : null
                            }</span>
                        </div>
                        <Table
                            noTitlebar
                            isNoneAction
                            isHideHeaderButton
                            isNoneNum
                            isHideDeleteButton
                            isNoneSelected
                            isNoneScroll={false}
                            parent={this}
                            title={null}
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

export default InventoryOperation