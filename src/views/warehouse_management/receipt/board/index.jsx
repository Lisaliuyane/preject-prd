import React from 'react'
import { inject, observer } from "mobx-react"
import { DatePicker } from 'antd'
import moment from 'moment'
import { Table, Parent } from '@src/components/table_template'
import { children, id } from './power'
import RemoteSelect from '@src/components/select_databook'
import {Row, Col} from '@src/components/grid'
import { deleteNull } from '@src/utils'
import Data from './data.jsx'
import Echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/bar'
import 'echarts/extension/dataTool'
import './index.less'

const power = Object.assign({}, children, id)

/**
 * 收货看板
 * @class ReceiptBoard
 * @extends {Parent}
 */
@inject('rApi', 'mobxTabsData')
@observer
class ReceiptBoard extends Parent {

    state = Data.states()

    constructor(props) {
        super(props)
        this.state.columns = this.state.columns
        this.state.receiptTimeEnd = moment(new Date().now)
        this.state.receiptTimeStart = moment(new Date().now).subtract(30, 'days')
    }

    componentDidMount = () => {
        this.initPie()
        this.initBar()
        this.getReceiptDateList()
        window.onresize = async () => {
            this.initPie()
            this.initBar()
        }
    }

    componentWillUnmount = () => {
        window.onresize = null
    }

    componentWillReceiveProps (nextProps) {
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
        this.pieChart = Echarts.init(this.pie)
        this.pieChart.setOption(this.state.pieOption)
    }

    // 设置柱状图统计 Bar
    initBar = async () => {
        await this.setState({ showChart: false })
        await this.setState({ showChart: true })
        this.barChart = Echarts.init(this.bar)
        this.barChart.setOption(this.state.barOption)
    }

    // 更改筛选条件
    onChangeValue = () => {
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    // 收货看板数据获取
    getData = async (params) => {
        const {rApi} = this.props
        const { clientId, warehouseId } = this.state
        params = Object.assign({}, params, {
            pageSize: params.limit,
            clientId,
            warehouseId
        })
        this.setPie()
        return new Promise((resolve, reject) => {
            params = deleteNull(params) 
            rApi[power.apiName](params)
                .then(async d => {
                    let dataList = [...d.records]
                        await this.setState({dataList})
                    resolve({
                        dataSource: this.state.dataList || [],
                        total: d.total
                    })
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    // 获取饼图数据
    setPie = async () => {
        const { rApi } = this.props
        let { clientId, warehouseId, pieOption } = this.state
        let sumTobeConfirm = 0
        let sumTobeReceipt = 0
        let SumInReceipt = 0
        let sumTobeStorage = 0
        rApi.getReceiptDataCount({
            clientId,
            warehouseId
        })
            .then(async res => {
                sumTobeConfirm = res.toBeConfirmed ? res.toBeConfirmed : 0
                sumTobeReceipt = res.toBeReceived ? res.toBeReceived : 0
                SumInReceipt = res.inReceiptOfGoods ? res.inReceiptOfGoods : 0
                sumTobeStorage = res.toBePendingStorage ? res.toBePendingStorage : 0
                pieOption.series[0].data = [
                    {
                        value: sumTobeConfirm,
                        name: '待确认'
                    },
                    {
                        value: sumTobeReceipt,
                        name: '待收货'
                    },
                    {
                        value: SumInReceipt,
                        name: '收货中'
                    },
                    {
                        value: sumTobeStorage,
                        name: '待入储'
                    }
                ]
                await this.setState({
                    pieOption,
                    sumTobeConfirm,
                    sumTobeReceipt,
                    SumInReceipt,
                    sumTobeStorage
                })
                this.pieChart.setOption(this.state.pieOption)
            })
            .catch(err => {
                console.log(err)
            })
    }

    // 获取柱状图数据
    getReceiptDateList = async () => {
        const { rApi } = this.props
        let { clientId, warehouseId, receiptTimeStart, receiptTimeEnd } = this.state
        receiptTimeStart = moment(receiptTimeStart).startOf('day')
        receiptTimeEnd = moment(receiptTimeEnd).endOf('day')
        receiptTimeStart = new Date(receiptTimeStart).getTime() + 1000
        receiptTimeEnd = new Date(receiptTimeEnd).getTime()
        let reqData = {
            clientId,
            warehouseId,
            receiptTimeStart,
            receiptTimeEnd
        }
        try {
            let barOption = { ...this.state.barOption }
            let rt = await rApi.getReceiptDateList(reqData)
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

    // 日期变更
    changeReceiptTime = async (date, key) => {
        await this.setState({
            [key]: date
        })
        let { receiptTimeStart, receiptTimeEnd } = this.state
        if (key === 'receiptTimeEnd' && moment(receiptTimeStart) < moment(receiptTimeEnd).subtract(30, 'days')) {
            receiptTimeStart = moment(receiptTimeEnd).subtract(30, 'days')
            await this.setState({ receiptTimeStart })
        }
        if (this.state.receiptTimeStart && this.state.receiptTimeEnd) {
            this.getReceiptDateList()
        }
    }

    // 不可选日期
    disabledDateStart = (current) => {
        let { receiptTimeEnd } = this.state
        return current < moment(receiptTimeEnd).subtract(30, 'days')
    }

    // 不可选日期
    disabledDateEnd = (current) => {
        let {receiptTimeStart} = this.state
        return current > moment().endOf('day') || current < moment(receiptTimeStart).startOf('day')
    }

    render() {
        const { sumTobeConfirm, sumTobeReceipt, SumInReceipt, sumTobeStorage, warehouseName, receiptTimeStart, receiptTimeEnd, showChart } = this.state
        return (
            <div className='receipt-board'>
                <Row className='headbar'>
                    <Col span={6}>
                        <div className='head-title'>收货看板<span style={{ color: '#1DA57A'}}>({warehouseName})</span></div>
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
                                <p>待收货</p>
                                <h4>{sumTobeReceipt}</h4>
                            </li>
                            <li>
                                <p>收货中</p>
                                <h4>{SumInReceipt}</h4>
                            </li>
                            <li>
                                <p>待入储</p>
                                <h4>{sumTobeStorage}</h4>
                            </li>
                        </ul>
                        {
                            showChart &&
                            <div ref={v => this.pie = v} id='pie' style={{ position: 'absolute', top: 80, left: 0, width: '100%', maxWidth: 640, height: 320, margin: '0 auto' }}></div>
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
                        <div id="bar" ref={v => this.bar = v} style={{ width: '80%', height: 300 }}></div>
                    }
                </div>
            </div>
        )
    }
}

export default ReceiptBoard