import React, {Fragment} from 'react'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { Button, message, DatePicker, Form, Popconfirm, Radio } from 'antd'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import AddressCascader from '@src/components/select_address/cascader.jsx'
import Stowage from './stowage.jsx'
import GoodsDetails from './details.jsx'
import StowageTableView from './stowage_tableview.jsx'
import ReplyUpload from './ReplyUpload'
import { children, id } from './power'
import { trim, cloneObject } from '@src/utils'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import moment from 'moment'
import { toOrderAdd, toTrackList } from '@src/views/layout/to_page'
import businessModel from '@src/views/business_management/liftingModeId'
import './index.less'

const power = Object.assign({}, children, id)
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

/* 订单列表表头按钮 */
const TableHeaderChildren = (props) => {
    const {
        orderStatus,
        btnStr
    } = props
    return (
        <Fragment>
            {
                (orderStatus === 2 || orderStatus === 4 || orderStatus === 5) ?
                null
                :
                <FunctionPower power={power.ADD_DATA}>
                    <Button onClick={props.toOrderAddPage} style={{marginRight: 10, verticalAlign: 'middle', border: 0, background: '#18B583', color: '#fff'}}>
                        新建
                    </Button>
                </FunctionPower>
            }
            {
                (orderStatus === 1 || orderStatus === 4 || orderStatus === 5) ?
                    null
                    :
                    <Fragment>
                        <FunctionPower power={btnStr === '取消配载' ? power.CANCEL_STOWAGE : power.ORDER_STOWAGE}>
                            <Button key='isStowage' onClick={props.isStowage} style={{ marginRight: 10, verticalAlign: 'middle' }}>
                                {btnStr}
                            </Button>
                        </FunctionPower>
                        <FunctionPower power={power.BATCH_COMPLET}>
                            <Button key='completeBatch' onClick={props.finishStowagePlus} style={{ marginRight: 10, verticalAlign: 'middle' }}>
                                批量完成
                            </Button>
                        </FunctionPower>
                    </Fragment>
            }
            {
                (orderStatus === 1 || orderStatus === 4 || orderStatus === 5) ?
                null
                :
                <FunctionPower power={power.PLIT_DATA}>
                    <Button
                        onClick={props.splitOrder}
                        style={{marginRight: 10, verticalAlign: 'middle'}}
                    >
                        拆分
                    </Button>
                </FunctionPower>
            }
        </Fragment>
    )
}

/**
 * 订单列表
 * @class OrderList
 * @extends {Parent}
 */
@inject('rApi', 'mobxTabsData', 'mobxBaseData')
@observer
class OrderList extends Parent {
    businessModelId=null // 配载业务类型
    state = {
        clientId: null, // 客户id
        departure: null, // 起运地
        destination: null, // 目的地
        startOrderDate: null, // 订单开始日期
        endOrderDate: null, // 订单结束日期
        orderNumber: null, // 订单号
        orderStatus: 1, // 订单状态
        limit: 10,
        offset: 0,
        projectId: 0, // 项目id
        transitPlaceOneName: null, // 中转地
        stowageList: [], // 已选配载列表数据
        showStowage: false, // 是否显示已选配载列表
        disabledConfirmStowage: true, //禁用确认配载按钮
        totalData: [], //总计数据
        btnStr: '配载', //配载按钮文字
        unconfirmed : 0, //待确认数
        confirmed : 0, //可配载数
        unsigned : 0, //未签收
        signed : 0 //已签收
    }

    constructor(props) {
        super(props)
        const { mobxTabsData, mykey } = props
        // const pageData = mobxTabsData.getPageData(mykey)
        mobxTabsData.setTitle(mykey, '订单管理')
        this.state.columns = [
        {
            className: 'text-overflow-ellipsis',
            title: '订单号',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
            width: 150,
            fixed: 'left',
            render: (val, r, index) => {
                return (
                <div style={{width: 129}} className="text-overflow-ellipsis">
                    {
                        r.orderForm ?
                        <span style={{
                            background: '#4A90E2',
                            borderRadius: '3px',
                            fontFamily: 'PingFangSC-Regular',
                            fontSize: '12px',
                            color: '#FFFFFF',
                            padding: '1px 3px',
                            marginRight:' 5px'
                        }}
                        >
                            {r.orderForm ? '预' : null}
                        </span>
                        :
                        null
                    }
                    <span
                        onClick={e => this.onLook(r)}
                        style={{ cursor: 'pointer', color: '#18B583', textDecoration: 'underline' }}
                        title={r.orderNumber}
                    >
                        {
                            r.orderNumber ? r.orderNumber : '-'
                        } 
                    </span>
                </div>
                )
            }
        },
        {
            className: 'text-overflow-ellipsis',
            title: '客户简称',
            dataIndex: 'clientName',
            key: 'clientName',
            width: 140,
            render: (text, r, index) => {
                let name = r.clientName ? r.clientName : '-'
                return (
                    <ColumnItemBox name={name} />
                )
            }
        },
        {
            className: 'text-overflow-ellipsis',
            title: '项目名称',
            dataIndex: 'projectName',
            key: 'projectName',
            width: 180,
            render: (text, r, index) => {
                let name = r.projectName ? r.projectName : '-'
                return (
                    <ColumnItemBox name={name} />
                )
            }
        },
        {
            className: 'text-overflow-ellipsis',
            title: '客户法人',
            dataIndex: 'clientLegalName',
            key: 'clientLegalName',
            width: 180,
            render: (text, r, index) => {
                let name = r.clientLegalName ? r.clientLegalName : '-'
                return (
                    <ColumnItemBox name={name} />
                )
            }
        },
        {
            className: 'text-overflow-ellipsis',
            title: '发货方',
            dataIndex: 'senderList',
            key: 'senderList',
            width: 160,
            render: (text, r, index) => {
                let name = r.senderList && r.senderList.length > 0 ? r.senderList.map(item => item.name).join(',') : '-'
                return (
                    <ColumnItemBox name={name} />
                )
            }
        },
        {
            className: 'text-overflow-ellipsis',
            title: '收货方',
            dataIndex: 'receiverList',
            key: 'receiverList',
            width: 160,
            render: (text, r, index) => {
                let name = r.receiverList && r.receiverList.length > 0 ? r.receiverList.map(item => item.name).join(',') : '-'
                return (
                    <ColumnItemBox name={name} />
                )
            }
        },
        {
            className: 'text-overflow-ellipsis',
            title: '报价路线',
            dataIndex: 'departure',
            key: 'departure',
            width: 300,
            render: (text, r, index) => {
                let name =  r.departure ? 
                `${r.departure}${r.transitPlaceOneName ? `->${r.transitPlaceOneName}` : ''}->${r.destination}` : '-'
                return (
                    <ColumnItemBox name={name} />
                )
            }
        },
        {
            className: 'text-overflow-ellipsis',
            title: '业务类型',
            dataIndex: 'businessModelName',
            key: 'businessModelName',
            width: 80,
            render: (text, r, index) => {
                let name = r.businessModelName ? r.businessModelName : '-'
                return (
                    <ColumnItemBox name={name} />
                )
            }
        },
        {
            className: 'text-overflow-ellipsis',
            title: '车型',
            dataIndex: 'carTypeList',
            key: 'carTypeList',
            width: 180,
            render: (text, r, index) => {
                let name = r.carTypeList && r.carTypeList.length > 0 ? r.carTypeList.map(item => {
                    return `${item.carTypeName}*${ item.carCount}`
                }).join(',') : '-'
                return (
                    <ColumnItemBox name={name} />
                )
            }
        },
        {
            className: 'text-overflow-ellipsis',
            title: '数量',
            dataIndex: 'totalQuantity',
            key: 'totalQuantity',
            width: 80,
            render: (text, r, index) => {
                let name = r.totalQuantity ? r.totalQuantity : '-'
                return (
                    <ColumnItemBox name={name} />
                )
            }
        },
        {
            className: 'text-overflow-ellipsis',
            title: '箱数',
            dataIndex: 'totalBoxCount',
            key: 'totalBoxCount',
            width: 80,
            render: (text, r, index) => {
                let name = r.totalBoxCount ? r.totalBoxCount : '-'
                return (
                    <ColumnItemBox name={name} />
                )
            }
        },
        {
            className: 'text-overflow-ellipsis',
            title: '板数',
            dataIndex: 'totalBoardCount',
            key: 'totalBoardCount',
            width: 80,
            render: (text, r, index) => {
                let name = r.totalBoardCount ? r.totalBoardCount : '-'
                return (
                    <ColumnItemBox name={name} />
                )
            }
        },
        {
            className: 'text-overflow-ellipsis',
            title: '重量(kg)',
            dataIndex: 'totalGrossWeight',
            key: 'totalGrossWeight',
            width: 80,
            render: (text, r, index) => {
                let name = r.totalGrossWeight ? r.totalGrossWeight : '-'
                return (
                    <ColumnItemBox name={name} />
                )
            }
        },
        {
            className: 'text-overflow-ellipsis',
            title: '体积(m³)',
            dataIndex: 'totalVolume',
            key: 'totalVolume',
            width: 80,
            render: (text, r, index) => {
                let name = r.totalVolume ? r.totalVolume : '-'
                return (
                    <ColumnItemBox name={name} />
                )
            }
        },
        {
            className: 'text-overflow-ellipsis',
            title: '制单人',
            dataIndex: 'operatorName',
            key: 'operatorName',
            width: 120,
            render: (text, r, index) => {
                let name =  r.operatorName ? r.operatorName : '-'
                return (
                    <ColumnItemBox name={name} />
                )
            }
        },
        {
            className: 'text-overflow-ellipsis',
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (text, r, index) => {
                return (<span title={
                    r.createTime ? moment(r.createTime).format('YYYY-MM-DD HH:mm') : '-'
                } > {
                        r.createTime ? moment(r.createTime).format('YYYY-MM-DD HH:mm') : '-'
                    } </span>
                )
            }
        }
        ]
        
        // 配载列表数据
        this.state.columnsStowage = [
            {
                className: 'text-overflow-ellipsis',
                title: '订单号',
                dataIndex: 'orderNumber',
                key: 'orderNumber',
                width: 180,
                render: (text, r, index) => {
                    return(
                        <div style={{width: 159}}>
                            {
                                r.orderForm ?
                                <span style={{
                                    background: '#4A90E2',
                                    borderRadius: '3px',
                                    fontFamily: 'PingFangSC-Regular',
                                    fontSize: '12px',
                                    color: '#FFFFFF',
                                    padding: '1px 3px',
                                    marginRight:' 5px'}}
                                >
                                    {r.orderForm ? '预' : null}
                                </span>
                                :
                                null
                            }
                            <span title={r.orderNumber}>{r.orderNumber ? r.orderNumber  : '-'}</span>
                        </div>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '客户简称',
                dataIndex: 'clientShortName',
                key: 'clientShortName',
                width: 150,
                render: (text, r, index) => {
                    return(
                       <div style={{width: 129}} className="text-overflow-ellipsis">
                            <span title={r.clientName}>
                                {
                                r.clientName ? r.clientName : '-'
                                }
                            </span>
                       </div>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '项目名称',
                dataIndex: 'projectName',
                key: 'projectName',
                width: 200,
                render: (text, r, index) => {
                    return(
                        <div style={{width: 179}} className="text-overflow-ellipsis">
                            <span title={r.projectName}>{r.projectName ? r.projectName : '-'}</span>
                        </div>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '选择待配载段',
                dataIndex: 'selectwayName',
                key: 'selectwayName',
                width: 220,
                render: (val, r, index) => {
                    if (r.id === 'isStatistics') {
                        return <span></span>
                    }
                    return (
                        <ColumnItemBox isFormChild>
                            <RemoteSelect
                                defaultValue={
                                    val && r.selectwayId ? {
                                        id: r.selectwayId,
                                        name: val
                                    } : null
                                }
                                placeholder='选择待配载段'
                                onChangeValue={
                                    e => {
                                        let { stowageList } = this.state
                                        if (e && e.id) {
                                            let selectData = e.origin_data ? e.origin_data.find(item => item.id === e.id) : r.editData
                                            stowageList[index].originData = selectData
                                            stowageList[index].editData = cloneObject(selectData)
                                            if (stowageList[index].editData.orderMaterialList && stowageList[index].editData.orderMaterialList.length) {
                                                stowageList[index].editData.orderMaterialList = stowageList[index].editData.orderMaterialList.map(m => ({
                                                    ...m,
                                                    boardCount: m.boardCount < 0 ? 0 : m.boardCount,
                                                    boxCount: m.boxCount < 0 ? 0 : m.boxCount,
                                                    quantity: m.quantity < 0 ? 0 : m.quantity,
                                                    grossWeight: m.grossWeight < 0 ? 0 : m.grossWeight,
                                                    volume: m.volume < 0 ? 0 : m.volume
                                                }))
                                            }
                                            stowageList[index].selectwayId = e.id
                                            stowageList[index].selectwayName = e.name
                                        } else {
                                            stowageList[index].originData = null
                                            stowageList[index].editData = null
                                            stowageList[index].selectwayId = null
                                            stowageList[index].selectwayName = ''
                                        }
                                        this.setState({ stowageList }, this.stowageTable.refresh())
                                    }
                                }
                                getDataMethod={'getNoStowageRoute'}
                                params={{ limit: 99999, offset: 0, orderId: r.id, orderType: r.orderType }}
                                labelField={'name'}
                                dealData={list => {
                                    if (list.every(item => item.departure === null && item.destination === null)) {
                                        return []
                                    }
                                    return list.map((item, index) => {
                                        item.id = item.id || `${item.orderId}-${index}`
                                        item.name = `${item.departure || '无'}--${item.destination || '无'}`
                                        return item
                                    })
                                }}
                            />
                        </ColumnItemBox>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '车型',
                dataIndex: 'carTypeList',
                key: 'carTypeList',
                width: 200,
                render: (text, r, index) => {
                    return(
                       <div style={{width: 179}} className="text-overflow-ellipsis">
                            <span title={r.carTypeList && r.carTypeList.length > 0 ? r.carTypeList.map(item => item.carTypeName).join(',') : '无'}>{r.carTypeList && r.carTypeList.length > 0 ? r.carTypeList.map(item => item.carTypeName).join(',') : '-'}</span>
                       </div>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '数量',
                dataIndex: 'totalQuantity',
                key: 'totalQuantity',
                width: 100,
                render: (text, r, index) => {
                    if (r.isStatistics) {
                        return (
                            <div style={{width: 79}}>
                                <span className="order-statistics" title={r.totalQuantity ? r.totalQuantity : ''}>
                                    {r.totalQuantity ? r.totalQuantity : '-'}
                                </span>
                            </div>
                        )
                    }
                    let count = null
                    if (r.editData) {
                        count = this.reduceCount(r.editData.orderMaterialList, 'quantity').toFixed(2)
                    }
                    return (
                        <div style={{ width: 79 }}>
                            <span title={count}>
                                {count}
                            </span>
                        </div>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '箱数',
                dataIndex: 'totalBoxCount',
                key: 'totalBoxCount',
                width: 100,
                render: (text, r, index) => {
                    if (r.isStatistics) {
                        return (
                            <div style={{width: 79}}>
                                <span className="order-statistics" title={r.totalBoxCount ? r.totalBoxCount : '-'}>
                                    {r.totalBoxCount ? r.totalBoxCount : '-'}
                                </span>
                            </div>
                        )
                    }
                    let count = null
                    if (r.editData) {
                        count = this.reduceCount(r.editData.orderMaterialList, 'boxCount').toFixed(2)
                    }
                    return (
                        <div style={{ width: 79 }}>
                            <span title={count}>
                                {count}
                            </span>
                        </div>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '板数',
                dataIndex: 'totalBoardCount',
                key: 'totalBoardCount',
                width: 100,
                render: (text, r, index) => {
                    if (r.isStatistics) {
                        return (
                            <div style={{width: 79}}>
                                <span className="order-statistics" title={r.totalBoardCount ? r.totalBoardCount : '-'}>
                                    {r.totalBoardCount ? r.totalBoardCount : '-'}
                                </span>
                            </div>
                        )
                    }
                    let count = null
                    if (r.editData) {
                        count = this.reduceCount(r.editData.orderMaterialList, 'boardCount').toFixed(2)
                    }
                    return (
                        <div style={{ width: 79 }}>
                            <span title={count}>
                                {count}
                            </span>
                        </div>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '重量(kg)',
                dataIndex: 'totalGrossWeight',
                key: 'totalGrossWeight',
                width: 100,
                render: (text, r, index) => {
                    if (r.isStatistics) {
                        return (
                            <div style={{width: 79}}>
                                <span className="order-statistics" title={r.totalGrossWeight ? r.totalGrossWeight :  '-'}>
                                    {r.totalGrossWeight ? r.totalGrossWeight :  '-'}
                                </span>
                            </div>
                        )
                    }
                    let count = null
                   
                    if (r.editData) {
                        count = this.reduceCount(r.editData.orderMaterialList, 'grossWeight').toFixed(2)
                    }
                    return(
                        <div style={{width: 79}}>
                            <span title={count}>
                                {count}
                            </span>
                        </div>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '体积(m³)',
                dataIndex: 'totalVolume',
                key: 'totalVolume',
                width: 100,
                render: (text, r, index) => {
                    if (r.isStatistics) {
                        return (
                            <div style={{width: 79}}>
                                <span className="order-statistics" title={r.totalVolume ? r.totalVolume : '-'}>
                                    {r.totalVolume ? r.totalVolume : '-'}
                                </span>
                            </div>
                        )
                    }
                    let count = null
                    if (r.editData) {
                        count = this.reduceCount(r.editData.orderMaterialList, 'volume').toFixed(2)
                    }
                    return (
                        <div style={{ width: 79 }}>
                            <span title={count}>
                                {count}
                            </span>
                        </div>
                    )
                }
            }
        ]
    }

    componentDidMount(){
       this.getOrderStageNum()
    }

    getOrderStageNum = () => { //获取订单各阶段总数量
        let { rApi } = this.props
        rApi.getOrderStageNum().then(d => {
            this.setState({
                unconfirmed : d.unconfirmed, //待确认数
                confirmed : d.confirmed, //可配载数
                unsigned : d.unsigned, //未签收
                signed : d.signed //已签收
            })
        }).catch(e => {
            console.log(e)
        })
    }
    
    componentWillReceiveProps(nextProps) {
        const { mobxTabsData, mykey } = this.props
        const pageData = mobxTabsData.getPageData(mykey)
        // console.log('componentWillReceiveProps', pageData, mykey)
        if (pageData && pageData.refresh) {
            mobxTabsData.setRefresh(mykey, false)
            this.searchCriteria()
        }
    }

    getTotalCount(d, key, hasMax) {
        // console.log('d', d)
        let list = this.getReceiveDataList(d)
        let obj = {
            quantity: this.reduceCount(list, 'quantity'), // 数量 
            boxCount: this.reduceCount(list, 'boxCount'), // 箱数
            boardCount: this.reduceCount(list, 'boardCount'), // 板数
            grossWeight: this.reduceCount(list, 'grossWeight'), // 毛重
            volume: this.reduceCount(list, 'volume'), // 体积
        }
        return obj[key]
    }

    getReceiveDataList = (d) => {
        const { receiverList, senderList, liftingModeId } = d
        let list = []
        if (d.orderId) {
            // console.log('子订单', d)
            if (senderList && senderList.length > 0 && senderList[0].materialList.length > 0) {
                list = senderList[0].materialList
            } else if (receiverList && receiverList.length > 0 && receiverList[0].materialList.length > 0) {
                list = receiverList[0].materialList
            } else {
                list = []
            }
        } else {
            if (businessModel.isOneToOne(liftingModeId)) {
                // 一对一
                list = senderList && senderList.length > 0 ? senderList[0].materialList : []
            } else if (businessModel.isOneToMany(liftingModeId)) {
                // 一对多
                list = senderList && senderList.length > 0 ? senderList[0].materialList : []
            } else if (businessModel.isManyToOne(liftingModeId)) {
                // 多对一
                list = receiverList && receiverList.length > 0 ? receiverList[0].materialList : []
            }
        }
        return list
    }

    reduceCount(list, key) {
        if (list && list.length < 1) {
            return 0
        }
        return list.reduce(function(pre, cur) {
            let preCount = typeof pre[key] === 'number' ?  pre[key] : 0
            let curCount = typeof cur[key] === 'number' ? cur[key] : 0
            let val = preCount + curCount
            val = val < 0 ? 0 : val
            return {
                [key]: val
            }
        })[key]
    }
    
    onChangeValue = () => {
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    getData = (params) => {
        const { 
            clientId, //客户id
            departure, //起运地
            destination, //目的地
            startOrderDate, //订单开始日期
            endOrderDate, //订单结束日期
            orderNumber, //订单号
            orderStatus, //订单状态
            limit,
            offset,
            projectId, //项目id
            transitPlaceOneName, //中转地
        } = this.state
        params = Object.assign({}, { clientId, //客户id
            departure,
            destination,
            startOrderDate, 
            endOrderDate,
            orderNumber, 
            orderStatus,
            limit,
            offset,
            projectId,
            transitPlaceOneName,
         }, params)
        const { rApi } = this.props
        return new Promise((resolve, reject) => {
            rApi[power.apiName](params).then(d => {
                let list = [...d.records]
                resolve({
                    dataSource: list, 
                    total: d.total
                })
            }).catch(err => {
                reject(err)
            })
        })
    }
   
    /* 订单列表自定义操作 */
    customTableAction = ({text, record, index, onDeleteItem, onEditItem, DeleteButton}) => {
        const {status} = record
        const view = [
            <FunctionPower key='edit' power={power.EDIT_DATA}>
                <span
                    className={`action-button`}
                    onClick={() => this.onEdit(record)}
                >
                    编辑
                </span>
            </FunctionPower>,
            <FunctionPower key='delete' power={power.DEL_DATA}>
                <DeleteButton
                    action={() => this.onDelete(record)}
                />
            </FunctionPower>,
            <FunctionPower key='cancelConfirm' power={power.CANCEL_CONFIRM}>
                <Popconfirm
                    title='确定取消确认?'
                    onConfirm={e => this.doSomething(record, 'cancelOrderConfirm')}
                >
                    <span className='action-button'>取消确认</span>
                </Popconfirm>
            </FunctionPower>,
            <FunctionPower key='complete' power={power.FINISH_STOWAGE}>
                <Popconfirm
                    title='确定完成配载?'
                    onConfirm={e => this.doSomething(record, 'finishOrderStowage')}
                >
                    <span className='action-button'>完成</span>
                </Popconfirm>
            </FunctionPower>,
            <FunctionPower key='againStowage' power={power.AGAIN_STOWAGE}>
                <Popconfirm
                    title='确定再配载?'
                    onConfirm={e => this.doSomething(record, 'againOrderStowage')}
                >
                    <span className='action-button'>再配载</span>
                </Popconfirm>
            </FunctionPower>,
            <FunctionPower key='signin' power={power.SIGN_ORDER}>
                <Popconfirm
                    title='确定签收？'
                    onConfirm={e => this.doSomething(record, 'signOrder')}
                >
                    <span className='action-button'>签收</span>
                </Popconfirm>
            </FunctionPower>,
            <FunctionPower key='cancelSignin' Power={power.CANCEL_SIGN_ORDER}>
                <Popconfirm
                    title='确定取消签收？'
                    onConfirm={e => this.doSomething(record, 'cancelSignOrder')}
                >
                    <span className='action-button'>取消签收</span>
                </Popconfirm>
            </FunctionPower>,
            <FunctionPower key='upload' power={power.SIGN_ORDER_UPLOAD}>
                <span className='action-button' onClick={() => this.showModal('replyUpload', record)}>上传</span>
            </FunctionPower>
        ]
        switch(status) {
            case 1:
                return [view[0], view[1]]
            case 2:
                return view[2]
            case 3:
                return view[3]
            case 4:
                return [view[4], view[5]]
            case 5:
                return [view[6], view[7]]
            default: 
                return null
        }
    }

    // 显示弹窗
    showModal = (type, payload) => {
        this.replyUpload.show({
            payload
        })
    }

    /* 执行订单操作 */
    doSomething = async (r, apiName) => {
        this.props.rApi[apiName]({
            id: r.id,
            orderType: r.orderType
        })
            .then(res => {
                if (apiName === 'finishOrderStowage') {
                    this.setState({
                        stowageList: []
                    })
                }
                this.onChangeValue()
                message.success('操作成功')
            })
            .catch(err => {
                message.error(err.msg || '操作失败')
            })
    }

    /* 批量完成 */
    finishStowagePlus = async () => {
        const {stowageList} = this.state
        if (stowageList.length < 1) {
            message.warning('请选择要完成配载的订单')
            return
        }
        // this.props.rApi.test()
        //     .then(res => {
        //         message.success('操作成功')
        //     })
        //     .catch(err => {
        //         message.error(err.msg || '操作失败')
        //     })
    }

    /* 拆分订单 */
    splitOrder = () => {
        let { stowageList } = this.state
        if (stowageList.length < 1) {
            message.warning('请选择要拆分的订单')
            return
        }
        let splitOrderId = stowageList.map(item => item.id)
        const { rApi } = this.props
        rApi.splitOrder(splitOrderId).then(d => {
            message.success('操作成功!')
            this.onChangeValue()
        }).catch(e => {
            message.error(e.msg || '操作失败!')
        })
    }

    stowageTableAction = ({text, record, index, onDeleteItem, onEditItem, DeleteButton}) => {
        //console.log('stowageTableAction')
        if (record.isStatistics) {
            return <span>总计</span>
        }
        return (
            <FunctionPower power={power.STOWAGE_GOODS}>
                <span
                    className={`action-button`}
                    //onClick={onEditItem}
                    onClick={() => this.toGoodsDetailsPage(record, index)}
                >
                    货物明细
                </span>
            </FunctionPower>
        )
    }

    // 订单列表操作
    isStowage = () => { //配载 => 显示已配载列表
        let {stowageList, btnStr} = this.state
        if (stowageList && stowageList.length > 0) {
            if (btnStr === '配载') {
                this.setState({
                    showStowage: true,
                    btnStr: '取消配载'
                }) 
            } else {
                this.setState({
                    stowageList: [],
                    showStowage: false,
                    btnStr: '配载'
                }) 
            } 
        } else {
            message.warning('请先选择配载订单')
        }
    }

    toOrderAddPage = () => { //新建 => 跳转到页面
        let { mobxTabsData } = this.props
        toOrderAdd(mobxTabsData, {
            id: 'neworder',
            pageData: {
                openType: 3,
                origin: this
            }
        })
    }

    onTrack = (record) => { //追踪 =>跳转到追踪页
        let { mobxTabsData } = this.props
        //console.log('追踪 =>跳转到追踪页',record)
        toTrackList(mobxTabsData, {
            pageData: {
                ...record
            }
        })
    }

    onEdit = (record) => { //编辑 => 跳转到编辑页面
        let { mobxTabsData } = this.props
        //console.log('record',record)
        toOrderAdd(mobxTabsData, {
            id: record.id,
            pageData: {
                ...record,
                openType: 1,
                origin: this
            }
        })
    }

    onDelete = (record) => { //删除
        // console.log('onDelete', record)
        let { rApi } = this.props
        rApi.delOrder([
           {
               id: record.id,
               orderType: record.orderType
           } 
        ]).then(d => {
            message.success('操作成功!')
            this.onChangeValue()
        }).catch(e => {
            message.error(e.msg || '操作失败')
        })
    }

    onLook = (record) => { //查看 => 跳转到查看页面
        //console.log('onLook', record)
        let { mobxTabsData } = this.props
        toOrderAdd(mobxTabsData, {
            id: record.id,
            pageData: {
                ...record,
                openType: 2
            }
        })
    }

    // 订已选配载列表操作
    getTotalData = (value) => { //获取配载总数
        let data = [value]
        this.setState({
            totalData: data && data.length > 0 ? data.map(d => {
                delete d.id
                delete d.isStatistics
                delete d.itemSpecifications
                delete d.orderNumber
                return d
            }) : []
        }, () => {
            //console.log('getTotalData', this.state.totalData)
        })
    }

    getReceiveData = (d) => {
        const { receiverList, senderList, liftingModeId } = d
        let list = []
        if (d.orderId) { // 子订单
            if (senderList && senderList.length > 0 && senderList[0].materialList.length > 0) {
                list = senderList[0].materialList.map(item => {
                    let obj = {
                        orderId: d.id,
                        orderMaterialId: item.materialsId,
                        orderType: d.orderType,
                        stowageCount: item.quantity
                    }
                    return obj
                })
            } else if (receiverList && receiverList.length > 0 && receiverList[0].materialList.length > 0) {
                list = receiverList[0].materialList.map(item => {
                    let obj = {
                        orderId: d.id,
                        orderMaterialId: item.materialsId,
                        orderType: d.orderType,
                        stowageCount: item.quantity
                    }
                    return obj
                })
            } else {
                list = []
            }
        } else {
            if (businessModel.isOneToOne(liftingModeId)) {
                // 一对一
                list = senderList && senderList.length > 0 ? senderList[0].materialList.map(item => {
                    let obj = {
                        orderId: d.id,
                        orderMaterialId: item.materialsId,
                        orderType: d.orderType,
                        stowageCount: item.quantity
                    }
                    return obj
                }) : []
            } else if (businessModel.isOneToMany(liftingModeId)) {
                // 一对多
                list = senderList && senderList.length > 0 ? senderList[0].materialList.map(item => {
                    let obj = {
                        orderId: d.id,
                        orderMaterialId: item.materialsId,
                        orderType: d.orderType,
                        stowageCount: item.quantity
                    }
                    return obj
                }) : []
            } else if (businessModel.isManyToOne(liftingModeId)) {
                // 多对一
                list = receiverList && receiverList.length > 0 ? receiverList[0].materialList.map(item => {
                    let obj = {
                        orderId: d.id,
                        orderMaterialId: item.materialsId,
                        orderType: d.orderType,
                        stowageCount: item.quantity
                    }
                    return obj
                }) : []
            }
        }

        return list
    }

    /* 配载弹出操作 */
    toStowage = () => {
        const { setFields} = this.props.form
        let { stowageList, totalData } = this.state
        setFields({
            fieldName: {
                value: `selectway-${0}`,
                errors: [new Error('请选择待配载段')]
            }
        })
        if (stowageList.some(item => !item.selectwayId)) {
            message.warning('请选择配载段!')
        } else {
            this.stowage.show({
                data: stowageList, //选中数据
                totalData: totalData //统计总数
            })
        }
    }

    toGoodsDetailsPage = (record, index) => { //货物明细
        // console.log('toGoodsDetailsPage货物明细', record, index)
        if (record.selectwayId) {
            this.details.show({
                data: record,
                index: index
            })
        } else {
            message.warning('未选择配载段')
        }
    }

    handleChangeStart = (value,selectedOptions) => { //起运地
        this.setState({
            departure: value && value.length > 0 ? value.join('/') : null
        }, this.onChangeValue({
            departure: value && value.length > 0 ? value.join('/') : null
        }))
    }

    handleChangeDestination = (value,selectedOptions) => { //目的地
        this.setState({
            destination: value && value.length > 0 ? value.join('/') : null
        }, this.onChangeValue({
            destination: value && value.length > 0 ? value.join('/') : null
        }))
    }

    /* 订单列表勾选 */
    orderChangeSelect = async (value, {deleteKeys, addKeys}) => {
        let { stowageList, showStowage } = this.state
        if (deleteKeys && deleteKeys.length) {
            stowageList = stowageList.filter(item => !deleteKeys.some(key => key.id === item.id))
        }
        if (addKeys && addKeys.length) {
            addKeys.forEach(item => {
                if (!stowageList.some(key => key.id === item.id)) {
                    stowageList.push(item)
                }
            })
        }
        let d = [...stowageList]
        // console.log('select', d)
        /** 重新组合可配载订单数据，删除多余数据 */
        d = d.map(item => {
            let obj = {...item, children: null}
            delete obj.children
            const {
                id, 
                aging,
                orderNumber,
                clientName,
                clientId,
                projectId,
                projectName,
                carTypeList,
                orderType,
                businessModelId,
                senderList,
                receiverList,
                departure,
                destination,
                sendCarOrderList,
                scheduleStowage,
                departureTime,
                orderForm,
                selectwayId,
                selectwayName,
                originData,
                editData,
                createTime
            } = obj
            let element =  {
                id,
                aging,
                orderNumber,
                clientName,
                clientId,
                projectId,
                projectName,
                carTypeList,
                orderType,
                businessModelId,
                senderList,
                receiverList,
                departure,
                destination,
                sendCarOrderList,
                scheduleStowage,
                departureTime,
                orderForm,
                selectwayId: selectwayId || null,
                selectwayName: selectwayName || null,
                originData: originData || null,
                editData: editData || null,
                createTime
            }
            if (item.orderId) {
                return {
                    ...element,
                    orderId: item.orderId
                }
            } else {
                return element
            }
        })
        // console.log('select2', d)
        /** 重新组合可配载订单数据，删除多余数据 */
        stowageList = cloneObject(d)
        await this.setState({
            showStowage: false,
            stowageList
        })
        if (showStowage) {
            await this.setState({showStowage: true})
        }
        if (stowageList && stowageList.length > 0) {
            this.setState({
                disabledConfirmStowage: false
            })
        } else {
            this.setState({
                disabledConfirmStowage: true,
                showStowage: false,
                btnStr: '配载'
            })
        }
    }

    reduceList= (list, key) => {
        let preCount = 0
        list.map(item => {
            preCount += this.getTotalCount(item, key) 
            return item
        })
        return preCount
    }

    reduceStowageList = (list, key) => {
        let array = list.filter(item => {
            if (item.editData) {
                return true
            } else {
                return false
            }
        })
        array = array.map(item => item.editData)
        if (array.length > 0) {
            let count = 0 
            array.forEach(item => {
                count += this.reduceCount(item.orderMaterialList, key)
            })
            return count
        } else {
            return 0
        }
        
    }

    addStatistics = (list) => {
        if (list.length > 0) {
            // let totalQuantity = this.reduceStowageList(list, 'quantity') < 0 ? 0 : this.reduceStowageList(list, 'quantity')
            // let totalBoxCount = this.reduceStowageList(list, 'boxCount') < 0 ? 0 : this.reduceStowageList(list, 'boxCount')
            // let totalBoardCount = this.reduceStowageList(list, 'boardCount') < 0 ? 0 : this.reduceStowageList(list, 'boardCount')
            // let totalGrossWeight = this.reduceStowageList(list, 'grossWeight') < 0 ? 0 : this.reduceStowageList(list, 'grossWeight')
            // let totalVolume = this.reduceStowageList(list, 'volume') < 0 ? 0 : this.reduceStowageList(list, 'volume')
            return [...list, {
                id: 'isStatistics',
                isStatistics: true,
                orderNumber: '总计',
                itemSpecifications: '',
                totalQuantity: this.reduceStowageList(list, 'quantity'), // 数量 
                totalBoxCount: this.reduceStowageList(list, 'boxCount'), // 箱数
                totalBoardCount: this.reduceStowageList(list, 'boardCount'), // 板数
                totalGrossWeight: this.reduceStowageList(list, 'grossWeight').toFixed(4), // 毛重
                totalVolume: this.reduceStowageList(list, 'volume').toFixed(4) // 体积
            }]
        } else {
            return []
        }
        
    }

    // 更新配载表数据
    onChangeMateriel = (index, target) => {
        let { stowageList } = this.state
        stowageList[index] = target
        this.setState({
            stowageList: stowageList
        }, () => {
            this.stowageTable.refresh()
            //console.log('onChangeMateriel stowageList', stowageList, target, this.state.stowageList)
        })
    }
    
    getCheckboxProps = (record) => {
        return {
            disabled: !(record.status === 3 || record.status === 2)
        }
    }

    getSelectKeys = ({selectedPropsRowKeys}) => {
        return selectedPropsRowKeys.map(item => {
            if (item.orderId) {
                return `children${item.id}`
            }
            return item.id
        })
    }

    clearStowageList = () => {
        this.setState({
            stowageList: [],
            btnStr: '配载',
            showStowage: false
        })
    }

    /* 自定义表格标题 */
    cusTableHeader = () => {
        const { orderStatus, unconfirmed, confirmed, unsigned, signed } = this.state
        return(
            <RadioGroup
                onChange={this.changeType}
                value={orderStatus}
                buttonStyle="solid"
            >
                <RadioButton value={1}>待确认{`(${unconfirmed || 0})`}</RadioButton>
                <RadioButton value={2}>可配载{`(${confirmed || 0})`}</RadioButton>
                <RadioButton value={4}>待签收{`(${unsigned || 0})`}</RadioButton>
                <RadioButton value={5}>已签收{`(${signed || 0})`}</RadioButton>
            </RadioGroup>
        )
    }

    // 表格头部按钮 onchange 事件
    changeType = async e => {
        let { stowageList, showStowage, btnStr, orderStatus } = this.state
        orderStatus = e.target.value
        stowageList = []
        showStowage = false
        btnStr = '配载'
        this.setState({
            stowageList,
            showStowage,
            btnStr,
            orderStatus
        }, this.onChangeValue)
    }

    render() {
        let {
            showStowage,
            stowageList,
            disabledConfirmStowage,
            btnStr,
            orderStatus
        } = this.state
        let tableHeight = this.props.mobxBaseData.tableHeight
        const minHeight = this.props.minHeight * 0.317
        return (
            <div className='page-order-list'>
                <HeaderView
                    style={{backgroundColor: '#eee'}}
                    parent={this} 
                    title="订单编号" onChangeSearchValue={
                    keyword => {
                        this.setState({ orderNumber: trim(keyword) }, this.onChangeValue({ orderNumber: trim(keyword) }))
                    }
                }>
                    <RemoteSelect
                        placeholder='客户名称'
                        onChangeValue={
                            e => {
                                let clientId = e ? e.id : null
                                this.setState({ clientId }, this.onChangeValue())
                            }
                        }
                        getDataMethod={'getClients'}
                        params={{ limit: 1000000, offset: 0, status: 56 }}
                        labelField={'shortname'}
                    />
                    <RemoteSelect
                        placeholder='项目名称'
                        onChangeValue={
                            e => {
                                let projectId = e ? e.id : null
                                this.setState({ projectId }, this.onChangeValue())
                            }
                        }
                        getDataMethod={'getCooperativeList'}
                        params={{pageNo: 1, pageSize: 999999}}
                        labelField={'projectName'}
                    />
                    <div className="flex flex-vertical-center" style={{ width: 261 }}>
                        <DatePicker
                            style={{ width: 120 }}
                            //defaultValue={startEffectiveDate ? moment(startEffectiveDate) : null}
                            format="YYYY-MM-DD"
                            onChange={
                                date => {
                                    this.setState({
                                        startOrderDate: date ? moment(date).format('YYYY-MM-DD') : ''
                                    }, this.onChangeValue({
                                        startOrderDate: date ? moment(date).format('YYYY-MM-DD') : ''
                                    }))
                                }}
                            allowClear
                            placeholder='下单日期开始'
                        />
                        <span style={{ margin: '0 3px' }}>-</span>
                        <DatePicker
                            style={{ width: 120 }}
                            //defaultValue={endEffectiveDate ? moment(endEffectiveDate) : null}
                            format="YYYY-MM-DD"
                            onChange={
                                date => {
                                    this.setState({
                                        endOrderDate: date ? moment(date).add(1, 'days').format('YYYY-MM-DD') : ''
                                    }, this.onChangeValue({
                                        endOrderDate: date ? moment(date).add(1, 'days').format('YYYY-MM-DD') : ''
                                    }))
                                }}
                            allowClear
                            placeholder='下单日期结束'
                        />
                    </div>
                    <AddressCascader
                        defaultValue={[]}
                        placeholder='起运地'
                        handleChangeAddress={this.handleChangeStart}
                    />
                    <AddressCascader
                        defaultValue={[]}
                        placeholder='目的地'
                        handleChangeAddress={this.handleChangeDestination}
                    />
                    <RemoteSelect
                        placeholder='中转地'
                        onChangeValue={
                            e => {
                                // let id = e ? e.id : 0
                                this.setState({ transitPlaceOneName: e ? e.title || e.name : null }, this.onChangeValue())
                            }
                        }
                        //text='中转地类型'
                        getDataMethod="getNodeList"
                        labelField="name"
                        params={{ limit: 100000, offset: 0 }}
                    />
                </HeaderView>
                <div>
                    <GoodsDetails
                        onChangeMateriel={this.onChangeMateriel}
                        parent={this}
                        getThis={(v) => this.details = v}
                    />
                    <Stowage
                        parent={this}
                        power={power}
                        getThis={(v) => this.stowage = v}
                        clearStowageList={this.clearStowageList}
                    />
                    <ReplyUpload
                        parent={this}
                        getThis={v => this.replyUpload = v}
                    />
                    <Table
                        className="index-list-table-style"
                        isNoneNum
                        isHideAddButton
                        isHideDeleteButton
                        selectedPropsRowKeys={stowageList}
                        getCheckboxProps={this.getCheckboxProps}
                        actionView={this.customTableAction}
                        onChangeSelect={this.orderChangeSelect}
                        getSelectKeys={this.getSelectKeys}
                        rowKey={(record, index) => {
                            if (record.orderId) {
                                return `children${record.id || index}`
                            }
                            return record.id || index
                        }}
                        title="订单列表"
                        TableHeaderTitle={this.cusTableHeader()}
                        actionWidth={120}
                        TableHeaderChildren={
                            <TableHeaderChildren
                                isStowage={this.isStowage}
                                toOrderAddPage={this.toOrderAddPage}
                                splitOrder={this.splitOrder}
                                btnStr={btnStr}
                                orderStatus={orderStatus}
                                finishStowagePlus={this.finishStowagePlus}
                            />
                        }
                        parent={this}
                        power={power}
                        params={this.state.params}
                        getData={this.getData}
                        columns={this.state.columns}
                        tableHeight={!showStowage ? tableHeight : minHeight}
                        filterSortItems={['orderNumber']}
                    />
                    {
                        showStowage ?
                            <div style={{ marginTop: 10}} className="index-list-table-style">
                                <StowageTableView
                                    getThis={v => this.stowageTable = v}
                                    power={power}
                                    addStatistics={this.addStatistics}
                                    stowageList={stowageList}
                                    toStowage={this.toStowage}
                                    onlyStowage={this.onlyStowage}
                                    columns={this.state.columnsStowage}
                                    actionView={this.stowageTableAction}
                                    rowKey={(record, index) => {
                                        // console.log('rowKey', record, index)
                                        if (record.orderId) {
                                            return `children${record.id || index}`
                                        }
                                        return record.id || index
                                    }}
                                    onChangeSelect={this.orderChangeSelect}
                                    disabledConfirmStowage={disabledConfirmStowage}
                                    getTotalData={this.getTotalData}
                                    minHeight={this.props.minHeight}
                                />
                            </div>
                            :
                            null
                    }
                </div>
            </div>
        )
    }
}
 
export default Form.create()(OrderList)