import React from 'react'
import { inject, observer } from "mobx-react"
import {DatePicker} from 'antd'
import { Table, Parent } from '@src/components/table_template'
import { children, id } from './power'
import RemoteSelect from '@src/components/select_databook'
import {Row, Col} from '@src/components/grid'
import { deleteNull } from '@src/utils'
import moment from 'moment'
import Echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/bar'
import 'echarts/extension/dataTool'
import './index.less'

const power = Object.assign({}, children, id)

/**
 * 出货看板
 * @class ShipmentBoard
 * @extends {Parent}
 */
@inject('rApi', 'mobxTabsData')
@observer
class ShipmentBoard extends Parent {

    state = {
        warehouseId: null, //筛选条件仓库ID
        warehouseName: '全部', //筛选条件仓库名称
        clientId: null, //筛选条件客户ID
        dataObj: null, //出货看板数据
        dataList: [], //看板表格数据
        receiptTimeStart: null, //开始日期
        receiptTimeEnd: null, //结束日期
        sumTobeConfirm: 0,
        sumToBeShipments: 0,
        sumInShipmentsOfGoods: 0,
        sumToBeShipped: 0,
        showChart: true,
        //收货饼图配置
        pieOption: {
            title: {
                text: '收货监控',
                x: 'left',
                top: 12,
                left: 12,
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: 14
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                bottom: 18,
                data: ['待确认', '待拣货', '拣货中', '待出货']
            },
            series: [
                {
                    name: '数量',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: [
                        { value: 0, name: '待确认' },
                        { value: 0, name: '待拣货' },
                        { value: 0, name: '拣货中' },
                        { value: 0, name: '待出货' },
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        },

        // 柱状图配置
        barOption: {
            color: ['#1DA57A'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '16%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    name: '日期',
                    data: [],
                    axisTick: {
                        show: false,
                        alignWithLabel: true
                    },
                    axisLabel: {
                        align: 'right',
                        // margin: 20,
                        rotate: 30
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '(单)',
                    splitLine: {
                        show: false
                    },
                }
            ],
            series: [
                {
                    name: '当天单量',
                    type: 'bar',
                    // barWidth: '40%',
                    barMaxWidth: 50,
                    data: []
                }
            ]
        }
    }

    constructor(props) {
        super(props)
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                title: '客户名称',
                dataIndex: 'clientName',
                key: 'clientName'
            },
            {
                className: 'text-overflow-ellipsis',
                title: '待确认',
                dataIndex: 'toBeConfirmed',
                key: 'toBeConfirmed'
            },
            {
                className: 'text-overflow-ellipsis',
                title: '待拣货',
                dataIndex: 'toBeShipments',
                key: 'toBeShipments'
            },
            {
                className: 'text-overflow-ellipsis',
                title: '拣货中',
                dataIndex: 'inShipmentsOfGoods',
                key: 'inShipmentsOfGoods'
            },
            {
                className: 'text-overflow-ellipsis',
                title: '待出货',
                dataIndex: 'toBeShipped',
                key: 'toBeShipped'
            }
        ]
        this.state.receiptTimeEnd = moment(new Date().now)
        this.state.receiptTimeStart = moment(new Date().now).subtract(30, 'days')
    }

    componentDidMount = () => {
        this.initPie()
        this.initBar()
        this.getShipmentDateList()
        window.onresize = async () => {
            this.initPie()
            this.initBar()
        }
    }

    componentWillUnmount = () => {
      window.onresize = null
    }

    componentWillReceiveProps(nextProps) {
        const { activeKey } = nextProps.mobxTabsData
        if (this.props.mykey === activeKey) {
            this.initPie()
            this.initBar()
        }
    }

    // 设置饼图统计 Pie
    initPie = async () => {
        await this.setState({ showChart: false })
        await this.setState({ showChart: true })
        this.pieChart = Echarts.init(this.shipmentpie)
        this.pieChart.setOption(this.state.pieOption)
    }

    // 设置柱状图统计 Bar
    initBar = async () => {
        await this.setState({ showChart: false })
        await this.setState({ showChart: true })
        this.barChart = Echarts.init(this.shipmentbar)
        this.barChart.setOption(this.state.barOption)
    }

    // 出货看板数据获取
    getData = async (params) => {
        const { rApi } = this.props
        const { clientId, warehouseId } = this.state
        params = Object.assign({}, params, {
            pageSize: params.limit,
            clientId,
            warehouseId
        })
        this.setPie()
        return new Promise((resolve, reject) => {
            params = deleteNull(params)
            rApi[power.apiName](params).then(async d => {
                let dataList = [...d.records]
                await this.setState({ dataList })
                resolve({
                    dataSource: this.state.dataList || [],
                    total: d.total || 0
                })
            }).catch(err => {
                reject(err)
            })
        })
    }

    // 获取饼图数据
    setPie = async () => {
        const { rApi } = this.props
        let { clientId, warehouseId, pieOption } = this.state
        let sumTobeConfirm = 0
        let sumToBeShipments = 0
        let sumInShipmentsOfGoods = 0
        let sumToBeShipped = 0
        rApi.getShipmentDataCount({
            clientId,
            warehouseId
        })
            .then(async res => {
                sumTobeConfirm = res.toBeConfirmed ? res.toBeConfirmed : 0
                sumToBeShipments = res.toBeShipments ? res.toBeShipments : 0
                sumInShipmentsOfGoods = res.inShipmentsOfGoods ? res.inShipmentsOfGoods : 0
                sumToBeShipped = res.toBeShipped ? res.toBeShipped : 0
                pieOption.series[0].data = [
                    {
                        value: sumTobeConfirm,
                        name: '待确认'
                    },
                    {
                        value: sumToBeShipments,
                        name: '待收货'
                    },
                    {
                        value: sumInShipmentsOfGoods,
                        name: '收货中'
                    },
                    {
                        value: sumToBeShipped,
                        name: '待入储'
                    }
                ]
                // console.log('a', pieOption)
                await this.setState({
                    pieOption,
                    sumTobeConfirm,
                    sumToBeShipments,
                    sumInShipmentsOfGoods,
                    sumToBeShipped
                })
                this.pieChart.setOption(pieOption)
            })
            .catch(err => {
                console.log(err)
            })
    }

    // 获取柱状图数据
    getShipmentDateList = async () => {
        const { rApi } = this.props
        let { clientId, warehouseId, receiptTimeStart, receiptTimeEnd } = this.state
        receiptTimeStart = moment(receiptTimeStart).startOf('day')
        receiptTimeEnd = moment(receiptTimeEnd).endOf('day')
        receiptTimeStart = new Date(receiptTimeStart).getTime()
        receiptTimeEnd = new Date(receiptTimeEnd).getTime()
        let reqData = {
            clientId,
            warehouseId,
            receiptTimeStart,
            receiptTimeEnd
        }
        try {
            let barOption = { ...this.state.barOption }
            let rt = await rApi.getShipmentDateList(reqData)
            if (rt) {
                barOption.series[0].data = [...rt.map(item => item.orderCount)]
                barOption.xAxis[0].data = [...rt.map(item => item.date)]
                await this.setState({ barOption })
                this.barChart.setOption(this.state.barOption)
            } else {
                throw new Error('获取日期统计数据失败')
            }
        } catch (err) {
            console.log(err)
        }
    }

    // 更改筛选条件
    onChangeValue = () => {
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    // 日期变更
    changeReceiptTime = async (date, key) => {
        await this.setState({
            [key]: date
        })
        let {receiptTimeStart, receiptTimeEnd} = this.state
        if (key === 'receiptTimeEnd' && moment(receiptTimeStart) < moment(receiptTimeEnd).subtract(30, 'days')) {
            receiptTimeStart = moment(receiptTimeEnd).subtract(30, 'days')
            await this.setState({receiptTimeStart})
        }
        if (this.state.receiptTimeStart && this.state.receiptTimeEnd) {
            this.getShipmentDateList()
        }
    }

    // 不可选日期
    disabledDateStart = (current) => {
        let {receiptTimeEnd} = this.state
        return current > moment().subtract(7, 'days') || current < moment(receiptTimeEnd).subtract(30, 'days')
    }

    // 不可选日期
    disabledDateEnd = (current) => {
        let {receiptTimeStart} = this.state
        return current > moment().endOf('day') || current < moment(receiptTimeStart).startOf('day')
    }

    render() {
        const { sumTobeConfirm, sumToBeShipments, sumInShipmentsOfGoods, sumToBeShipped, warehouseName, receiptTimeStart, receiptTimeEnd, showChart } = this.state
        return (
            <div className='shipment-board'>
                <Row className='headbar'>
                    <Col span={6}>
                        <div className='head-title'>出货看板<span style={{ color: '#1DA57A'}}>({warehouseName})</span></div>
                    </Col>
                    <Col span={9}></Col>
                    <Col span={4}>
                        <RemoteSelect
                            onChangeValue={
                                e => {
                                    let id = e ? e.id : 0
                                    this.setState({ 
                                        warehouseId: e ? id : null,
                                        warehouseName: e ? e.name: '全部'
                                    }, this.onChangeValue({ warehouseId: e ? id : null }))
                                }
                            }
                            params={{ pageSize: 99999, pageNo: 1 }}
                            getDataMethod={'getWarehouseList'}
                            placeholder='选择仓库'
                            labelField={'name'}
                        >
                        </RemoteSelect>
                    </Col>
                    <Col span={4}>
                        <RemoteSelect
                            onChangeValue={
                                e => {
                                    let id = e ? e.id : 0
                                    this.setState({ clientId: e ? id : null }, this.onChangeValue({ clientId: e ? id : null }))
                                }
                            }
                            params={{ limit: 99999, offset: 0 }}
                            getDataMethod={'getClients'}
                            placeholder='选择客户'
                            labelField={'shortname'}
                        >
                        </RemoteSelect>
                    </Col>
                </Row>
                <div className="control">
                    <div className='piearea'>
                        <ul className="sum">
                            <li>
                                <p>待确认</p>
                                <h4>{sumTobeConfirm}</h4>
                            </li>
                            <li>
                                <p>待拣货</p>
                                <h4>{sumToBeShipments}</h4>
                            </li>
                            <li>
                                <p>拣货中</p>
                                <h4>{sumInShipmentsOfGoods}</h4>
                            </li>
                            <li>
                                <p>待出货</p>
                                <h4>{sumToBeShipped}</h4>
                            </li>
                        </ul>
                        {
                            showChart &&
                            <div id='shipmentpie' ref={v => this.shipmentpie = v} style={{ position: 'absolute', top: 80, left: 0, width: '100%', minWidth: 400, maxWidth: 640, height: 320, margin: '0 auto' }}></div>
                        }
                    </div>
                    <div className='tablearea'>
                        <Table
                            isNoneAction
                            isHideHeaderButton
                            isNoneSelect
                            isNoneSelected
                            THeader={null}
                            parent={this}
                            power={power}
                            getData={this.getData}
                            columns={this.state.columns}
                        >
                        </Table>
                    </div>
                </div>
                <div className="bottomarea">
                    <div className='filtertime'>
                        <DatePicker
                            defaultValue={receiptTimeStart ? moment(receiptTimeStart, 'YYYY-MM-DD') : null}
                            format={'YYYY-MM-DD'}
                            placeholder='开始日期'
                            disabledDate={this.disabledDateStart}
                            value={receiptTimeStart ? moment(receiptTimeStart) : null}
                            onChange={date => this.changeReceiptTime(date, 'receiptTimeStart')}
                            style={{ marginRight: '12px' }}
                        />
                        <DatePicker
                            defaultValue={receiptTimeEnd ? moment(receiptTimeEnd, 'YYYY-MM-DD') : null}
                            format={'YYYY-MM-DD'}
                            placeholder='结束日期'
                            disabledDate={this.disabledDateEnd}
                            value={receiptTimeEnd ? moment(receiptTimeEnd) : null}
                            onChange={date => this.changeReceiptTime(date, 'receiptTimeEnd')}
                        />
                    </div>
                    {
                        showChart &&
                        <div id="shipmentbar" ref={v => this.shipmentbar = v} style={{ width: '80%', height: 300 }}></div>
                    }
                </div>
            </div>
        )
    }
}

export default ShipmentBoard