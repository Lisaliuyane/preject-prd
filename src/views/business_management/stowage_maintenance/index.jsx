import React, { Fragment } from 'react'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import RemoteSelect from '@src/components/select_databook'
import { inject, observer } from "mobx-react"
import { DatePicker, Button, Icon, Popover } from 'antd'
import moment from 'moment'
import { trim } from '@src/utils'
import { toStowageMaintenanceEdit } from '@src/views/layout/to_page'
import { children, id } from './power'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import OrderMore from '../public/OrderMore'
import CarrierMore from '../public/CarrierMore'
import './index.less'

const power = Object.assign({}, children, id)
/* 订单数据维护 */
@inject('rApi', 'mobxTabsData', 'mobxBaseData')
@observer
class StowageMaintenance extends Parent {
    state = {
        carrierId: null, //筛选条件承运商id
        operatorId: null, //筛选条件创建人id
        createTime: null, //筛选条件下单时间
        senderId: null, //筛选条件发货方id
        receiverId: null, //筛选条件收货方id
        stowageNumber: null, //筛选条件配载单号
        operationStatus: null, //筛选条件维护中
        status: null, //筛选条件已对账
        stowageList: [],
        columns: [
            {
                className: 'text-overflow-ellipsis cost-charge',
                title: '预估金额',
                dataIndex: 'estimatedCost',
                key: 'estimatedCost',
                width: 160,
                render: (val, r) => {
                    let name = val && !isNaN(val) ? `${val.toFixed(4)}(${r.currencyName || 'RMB'})` : '-'
                    // return(
                    //     <ColumnItemBox name={name} style={{color: '#E76400'}}/>
                    // )
                    // let name = r.isTextsIncluded === 0 ? 
                    // `${r.afterTaxAmount ? `${r.afterTaxAmount.toFixed(2)}${r.currencyName ? r.currencyName : 'RMB'}` : '-'}` 
                    // : 
                    // `${r.estimatedCost ? `${r.estimatedCost.toFixed(2)}${r.currencyName ? r.currencyName : 'RMB'}` : '-'}`
                    return(
                        <ColumnItemBox name={name} style={{color: '#E76400'}} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '配载单号',
                dataIndex: 'stowageNumber',
                key: 'stowageNumber',
                width: 160,
                render: (val, r) => {
                    let name = r.stowageNumber ? r.stowageNumber : '-'
                    return(
                        <ColumnItemBox name={name}/>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '发货方',
                dataIndex: 'senderList',
                key: 'senderList',
                width: 160,
                render: (val, r) => {
                    let name = val && val.length && val[0].name ? val[0].name : '-'
                    return(
                        <ColumnItemBox name={name}/>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '收货方',
                dataIndex: 'receiverList',
                key: 'receiverList',
                width: 160,
                render: (val, r) => {
                    let name = val && val.length && val[0].name ? val[0].name : '-'
                    return(
                        <ColumnItemBox name={name}/>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis itbcol-more',
                title: '关联订单',
                dataIndex: 'sendCarOrderList',
                key: 'sendCarOrderList',
                width: 180,
                render: (val, r, rIndex) => {
                    return(
                        <span ref={v => this['popOrder' + rIndex] = v}>
                            {
                                val && val.length && val[0].orderNumber ? val[0].orderNumber : '-'
                            }
                            {
                                val && val.length > 1 &&
                                <Popover
                                    placement="bottomLeft"
                                    title={null}
                                    getPopupContainer={() => this.rootDom || document.body}
                                    content={
                                        <OrderMore
                                            className='ipopover-order-more'
                                            {...r}
                                        />
                                    }
                                    onVisibleChange={flag => this.popVisibleChange(flag, 'showOrderMore', rIndex)}
                                >
                                    <span className='more'>
                                        <Icon type={r.showOrderMore ? 'minus' : 'plus'} />
                                    </span>
                                </Popover>
                            }
                        </span>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis itbcol-more',
                title: '承运商',
                dataIndex: 'carrierName',
                key: 'carrierName',
                width: 180,
                render: (val, r, rIndex) => {
                    return(
                        <div className="flex flex-vertical-center" ref={v => this['popCarrier' + rIndex] = v}>
                            {
                                r.carType === 1 ?
                                    <div className="text-overflow-ellipsis" style={{ maxWidth: 130 }} title={val ? `${val}` : ''}>{val ? `${val}` : ''}</div>
                                :

                                    <div className="text-overflow-ellipsis" style={{ maxWidth: 130 }} title='现金车'>现金车</div>
                            }
                            <Popover
                                placement="bottomLeft"
                                title={null}
                                getPopupContainer={() => this.rootDom || document.body}
                                content={
                                    <CarrierMore
                                        className='ipopover-carrier-more'
                                        {...r}
                                    />
                                }
                                onVisibleChange={flag => this.popVisibleChange(flag, 'showCarrierMore', rIndex)}
                                // trigger="click"
                            >
                                <span className='more'>
                                    <Icon type={r.showCarrierMore ? 'minus' : 'plus'} />
                                </span>
                            </Popover>
                        </div>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '创建人',
                dataIndex: 'operatorName',
                key: 'operatorName',
                width: 100,
                render: (val, r) => {
                    let name = r.operatorName ? r.operatorName : '-'
                    return(
                        <ColumnItemBox name={name}/>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                render: (val) => {
                    return val ? moment(val).format('YYYY-MM-DD HH:mm') : '-'
                }
            }
        ],
        statusArr: [
            {
                isActive: false,
                code: 3,
                title: '维护中'
            },
            {
                isActive: false,
                code: 4,
                title: '已对账'
            }
        ]
    }

    /* 获取表格数据 */
    getData = (params) => {
        const {rApi} = this.props
        const {
            carrierId,
            operatorId,
            createTime,
            senderId,
            receiverId,
            stowageNumber,
            operationStatus,
            status
        } = this.state
        let reqData = {
            ...params,
            carrierId,
            operatorId,
            createTime,
            senderId,
            receiverId,
            stowageNumber,
            operationStatus,
            status
        }
        return new Promise((resolve, reject) => {
            rApi.getStowageMaintenance(reqData)
                .then(async res => {
                    let {stowageList} = this.state
                    stowageList = this.dealList([...res.records])
                    await this.setState({stowageList})
                    resolve({
                        dataSource: this.state.stowageList,
                        total: res.total || 0
                    })
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    /* 处理列表数据 */
    dealList (arr) {
        return arr.map(item => {
            item.showOrderMore = false
            item.showCarrierMore = false
            return item
        })
    }

    /* 刷新表格数据 */
    onChangeValue = () => {
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    /* 关联订单和承运商显示更多信息弹层显示隐藏触发事件 */
    popVisibleChange = (flag, key, index) => {
        let { stowageList } = this.state
        stowageList[index][key] = flag
        this.setState({ stowageList })
    }

    /* 跳到配载录入编辑 */
    toStowageMaintenanceEditPage = (rowData, openType) => {
        // console.log('toEdit', rowData)
        let { mobxTabsData } = this.props
        // console.log(mobxTabsData)
        let pageIndex = 0
        if (mobxTabsData.showTabs.some((item, index) => {/* 已经打开该查看 */
            pageIndex = index
            return item.key === `STOWAGE_MAINTENANCE_EDIT${rowData.id}-see`
        })) {
            mobxTabsData.refresh(pageIndex)
        }
        toStowageMaintenanceEdit(mobxTabsData, {
            id: `${rowData.id}-${openType}`,
            pageData: {
                originView: this,
                openType,
                ...rowData
            }
        })
    }

    tableHeaderTitle = () => {
        let { statusArr } = this.state
        return(
            <div className='headbar'>
                {
                    statusArr.map(item => {
                        return(
                            <div key={item.code} onClick={e => this.filterList(item)} className={`btn ${item.isActive ? 'active' : ''}`}>{item.title}</div>
                        )
                    })
                }
            </div>
        )
    }

    /* 按钮过滤 */
    filterList = (target) => {
        let { statusArr, status, operationStatus } = this.state
        if (target.code === 3) {
            operationStatus = target.code
            status = null
        } else if (target.code === 4) {
            status = target.code
            operationStatus = null
        }
        let index = 0
        if (statusArr.find((item, idx) => {
            index = idx
            return item.code === target.code
        }).isActive) {/* 点击已激活按钮 */
            operationStatus = null
            status = null
            statusArr[index].isActive = false
            this.setState({ statusArr, status, operationStatus }, this.onChangeValue())
            return
        }
        statusArr = statusArr.map(item => {
            item.isActive = item.code === target.code
            return item
        })
        this.setState({ statusArr, status, operationStatus }, this.onChangeValue())
    }

    /* 自定义表格标题 */
    cusTableHeader = () => {
        return (
            <Fragment>
                {/* <FunctionPower power={power.BATCH_EDIT}>
                    <Button style={{ marginRight: '10px', verticalAlign: 'middle', verticalAlign: 'middle'}}>批量维护</Button>
                </FunctionPower> */}
                {/* <Button style={{ marginRight: '10px', verticalAlign: 'middle', verticalAlign: 'middle'}}>开立预估</Button>
                <Button style={{ marginRight: '10px', verticalAlign: 'middle', verticalAlign: 'middle'}}>开立对账</Button> */}
            </Fragment>
        )
    }

    /* 自定义表格操作 */
    customAction = ({ text, record, index }) => {
        return (
            <Fragment>
                <FunctionPower power={power.EDIT_DATA}>
                    <span className='action-button' onClick={e => this.toStowageMaintenanceEditPage(record, 'entry')}>维护</span>
                </FunctionPower>
                <FunctionPower power={power.LOOK_MORE}>
                    <span className='action-button' onClick={e => this.toStowageMaintenanceEditPage(record, 'see')}>查看</span>
                </FunctionPower>
            </Fragment>
        )
    }

    render() {
        let { mobxBaseData } = this.props
        let tableHeight = mobxBaseData.tableHeight
        return(
            <div className='page-stowagemaintenance' ref={v => this.rootDom = v}>
                <HeaderView
                    style={{padding: '0 10px'}}
                    parent={this}
                    title="配载单号"
                    onChangeSearchValue={
                        keyword => {
                            this.setState({ stowageNumber: trim(keyword) }, this.onChangeValue())
                        }
                    }>
                    <RemoteSelect
                        placeholder="承运商名称"
                        onChangeValue={(value = {}) => {
                            this.setState({ carrierId: value.id }, this.onChangeValue())
                        }}
                        getDataMethod={'getCarrierFilterList'}
                        labelField={'abbreviation'}
                        params={{ offset: 0, limit: 99999 }}
                    />
                    <RemoteSelect
                        placeholder='创建人'
                        onChangeValue={
                            e => {
                                let operatorId = e ? e.operatorId : null
                                this.setState({ operatorId }, this.onChangeValue())
                            }
                        }
                        getDataMethod={'getFilterOperatorList'}
                        keyName={'operatorId'}
                        labelField={'operatorName'}
                    />
                    <DatePicker
                        onChange={
                            date => {
                                this.setState({
                                    createTime: date ? moment(date).format("YYYY-MM-DD") : null
                                }, this.onChangeValue())
                            }}
                        allowClear
                        placeholder='下单时间'
                    />
                    <RemoteSelect
                        placeholder="发货方"
                        onChangeValue={(value = {}) => {
                            let senderId = value && value.id ? value.id : null
                            this.setState({ senderId }, this.onChangeValue())
                        }}
                        getDataMethod={'getConsignees'}
                        labelField={'cargoPartyName'}
                        dealData={arr => {
                            return arr.filter(item => {
                                return item.addressType === 1
                            })
                        }}
                        params={{ offset: 0, limit: 99999 }}
                    />
                    <RemoteSelect
                        placeholder="收货方"
                        onChangeValue={(value = {}) => {
                            let receiverId = value && value.id ? value.id : null
                            this.setState({ receiverId }, this.onChangeValue())
                        }}
                        getDataMethod={'getConsignees'}
                        labelField={'cargoPartyName'}
                        dealData={arr => {
                            return arr.filter(item => {
                                return item.addressType === 2
                            })
                        }}
                        params={{ offset: 0, limit: 99999 }}
                    />
                </HeaderView>
                <Table
                    className='sd-block page-table'
                    isHideAddButton
                    isHideDeleteButton
                    isNoneNum
                    parent={this}
                    getThis={v => this.tableView = v}
                    actionWidth={90}
                    actionView={this.customAction}
                    title={null}
                    cusTableHeaderButton={this.cusTableHeader()}
                    TableHeaderTitle={this.tableHeaderTitle()}
                    getData={this.getData}
                    columns={this.state.columns}
                    tableHeight={tableHeight}
                    tableWidth={140}
                />
            </div>
        )
    }
}

export default StowageMaintenance