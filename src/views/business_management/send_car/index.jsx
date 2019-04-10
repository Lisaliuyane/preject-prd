import React, { Fragment } from 'react'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import RemoteSelect from '@src/components/select_databook'
import { inject, observer } from "mobx-react"
import { DatePicker, Popover, Popconfirm, message } from 'antd'
import moment from 'moment'
import { trim } from '@src/utils'
import { children, id } from './power'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import AddressCascader from '@src/components/select_address/cascader.jsx'
import PopContent from './PopContent.jsx'
import ModalReturn from './ModalReturn.jsx'
import './index.less'

/**
 * 派车列表
 * @class AuthOrize
 * @extends {Parent}
*/

const power = Object.assign({}, children, id)
@inject('rApi', 'mobxTabsData', 'mobxBaseData')
@observer
class SendCar extends Parent {

    state = {
        carId: null, //筛选条件车牌号
        carrierId: null, //筛选条件承运商名称
        sendCarNumber: null, //筛选条件派车单号
        startOrderDate: null, //筛选条件制单日期开始
        endOrderDate: null, //筛选条件制单日期结束
        departure: null, //筛选条件起运地
        destination: null, //筛选条件目的地
        status: 1, //筛选条件状态
        sendCarList: [], //派车列表数据
        statusArr: [
            {
                isActive: true,
                code: 1,
                title: '运输中'
            },
            {
                isActive: false,
                code: 3,
                title: '已签收'
            }
        ],
        showReturn: false
    }

    constructor(props) {
        super(props)
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                title: '配载单号',
                dataIndex: 'stowageNumber',
                key: 'stowageNumber',
                width: 150,
                render: (val, r, index) => {
                    let name = val ? val : '-'
                    return (
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '派车单号',
                dataIndex: 'sendCarNumber',
                key: 'sendCarNumber',
                width: 140,
                render: (text, r, index) => {
                    let name = r.sendCarNumber ? r.sendCarNumber : '-'
                    return (
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '车牌号',
                dataIndex: 'carCode',
                key: 'carCode',
                width: 100,
                render: (text, r, index) => {
                    let name = r.carCode ? r.carCode : '-'
                    return (
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '司机+电话',
                dataIndex: 'driverName',
                key: 'driverName',
                width: 180,
                render: (text, r, index) => {
                    let name = r.driverName ? r.driverName.split('(')[0] + ' ' + r.phone || '' : '-'
                    return (
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '承运商',
                dataIndex: 'carrierName',
                key: 'carrierName',
                width: 140,
                render: (t, r, index) => {
                    let name = r.carType === 1 ? t : r.carType === 2 ? `现金车(${r.driverName || '-'})` : '无'
                    return (
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '发车时间',
                dataIndex: 'sendTime',
                key: 'sendTime',
                width: 140,
                render: (text, r, index) => {
                    let name = r.departureTime ? moment(r.departureTime).format("YYYY-MM-DD HH:mm") : '-'
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
                render: (val, r, index) => {
                    let name = val && val.length ? val[0].name : '-'
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
                render: (val, r, index) => {
                    let name = val && val.length ? val[0].name : '-'
                    if (r.transitPlaceType === 1 || r.transitPlaceOneName) {
                        name = r.transitPlaceOneName
                    }
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
                    let name = r.operatorName ? r.operatorName : '-'
                    return (
                        <ColumnItemBox name={name} />
                    )
                }
            }
        ]
    }

    /* 获取派车列表 */
    getData = async (params) => {
        const {rApi} = this.props
        const {
            carId,
            carrierId,
            sendCarNumber,
            startOrderDate,
            endOrderDate,
            departure,
            destination,
            status
        } = this.state
        let reqData = {
            ...params,
            carId,
            carrierId,
            sendCarNumber,
            startOrderDate,
            endOrderDate,
            departure,
            destination,
            status
        }
        // console.log(reqData)
        return new Promise((resolve, reject) => {
            rApi.getSendCarList(reqData)
                .then(async res => {
                    let dataSource = [...res.page.records]
                    let total = res.page.total
                    dataSource = this.dealList(dataSource)
                    await this.setState({sendCarList: dataSource})
                    // console.log('rt', dataSource)
                    resolve({
                        dataSource: this.state.sendCarList,
                        total
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
            item.showTrack = false
            item.isEdit = false
            return item
        })
    }

    /* 刷新表格数据 */
    onChangeValue = () => {
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    handleChangeStart = (value, selectedOptions) => { //起运地
        this.setState({
            departure: value && value.length > 0 ? value.join('/') : null
        }, this.onChangeValue({ departure: value && value.length > 0 ? value.join('/') : null }))
    }

    handleChangeDestination = (value, selectedOptions) => { //目的地
        this.setState({
            destination: value && value.length > 0 ? value.join('/') : null
        }, this.onChangeValue({ destination: value && value.length > 0 ? value.join('/') : null }))
    }

    /* 自定义操作 */
    customAction = ({ text, record, index, onDeleteItem, onEditItem, DeleteButton }) => {
        //console.log('customTableAction', text, record, index)
        const {rApi} = this.props
        const {status} = record
        return (
            <Fragment>
                <FunctionPower power={power.TRACK_CAR}>
                    <Popover
                        className='abcdef'
                        key='gotrack'
                        placement="bottomRight"
                        content={
                            <PopContent
                                edit={record.isEdit}
                                editTrack={this.editTrack}
                                rowIndex={index}
                                rowData={record}
                                rApi={rApi}
                            />
                        }
                        title={
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <span>追踪信息</span>
                                {
                                    !record.isEdit &&
                                    <FunctionPower power={power.TRACK_EDIT}>
                                        <span className='action-button' onClick={e => this.editTrack(index, true)}>编辑</span>
                                    </FunctionPower>
                                }
                            </div>
                        }
                        trigger="click"
                    >
                        <span
                            className={`action-button`}
                            // onClick={e => this.openTrack(index, !record.showTrack, record)}
                        >
                            追踪
                        </span>    
                    </Popover>
                </FunctionPower>
                {
                    status === 3 &&
                    <FunctionPower power={power.RETURN_FILE}>
                        <span
                            className={`action-button`}
                            onClick={e => this.modalReturnShow(record)}
                        >
                            回单
                        </span>
                    </FunctionPower>
                }
                {
                    status !== 3 &&
                    <FunctionPower power={power.SIGN_CAR}>
                        <Popconfirm
                            key='signin'
                            title="是否签收？"
                            onConfirm={() => this.signin(record.id)}
                        >
                            <span className={`action-button`}>
                                签收
                            </span>
                        </Popconfirm>
                    </FunctionPower>
                }
            </Fragment>
        )
    }

    /* 打开追踪 */
    openTrack = (index, flag, row) => {
        let {sendCarList} = this.state
        sendCarList = sendCarList.map((item, idx) => {
            item.showTrack = index === idx ? flag : false
            return item
        })
        this.setState({sendCarList})
    }

    /* 编辑追踪 */
    editTrack = (index, flag) => {
        let {sendCarList} = this.state
        sendCarList[index].isEdit = flag
        this.setState({sendCarList})
    }

    /* 签收 */
    signin = (id) => {
        const {rApi} = this.props
        rApi.singCar({id})
            .then(res => {
                if (this.searchCriteria) {
                    this.searchCriteria()
                }
                message.success('操作成功')
            })
            .catch(err => {
                message.error(err.msg || '操作失败')
            })
    }

    /* 自定义表格标题 */
    cusTableHeader = () => {
        const { statusArr } = this.state
        return (
            <ul className='cus-table-header'>
                {
                    statusArr.map((item, index) => {
                        return (
                            <li
                                key={index}
                                onClick={e => this.filterStatus(item.code)}
                                className={item.isActive ? 'active' : ''}
                            >{item.title}</li>
                        )
                    })
                }
            </ul>
        )
    }

    /* 表格标题筛选过滤 */
    filterStatus = async (orderStatus) => {
        let { statusArr, status } = this.state
        status = orderStatus
        if (statusArr.some(item => item.code === orderStatus)) {
            if (statusArr.find(item => item.code === orderStatus).isActive) {
                return
            }
            statusArr = statusArr.map(item => {
                item.isActive = (item.code === orderStatus)
                return item
            })
        } else {
            statusArr = statusArr.map(item => {
                item.isActive = false
                return item
            })
        }
        await this.setState({ statusArr, status })
        this.onChangeValue()
    }

    /* 打开回单上传弹窗 */
    modalReturnShow = async (curRow) => {
        this.modalReturn.show(curRow)
        this.setState({showReturn: true})
    }

    /* 关闭回单上传弹窗 */
    modalReturnCancel = () => {
        this.modalReturn.close()
        this.setState({showReturn: false})
    }

    render() {
        let { mobxBaseData, rApi } = this.props
        const {showReturn, curRow} = this.state
        let tableHeight = mobxBaseData.tableHeight
        return (
            <div className='sendcar-page' ref={v => this.sendcarpage = v}>
            {
                this.sendcarpage &&
                    <ModalReturn
                        ref={v => this.modalReturn = v}
                        show={showReturn}
                        parentDom={this.sendcarpage}
                        modalReturnCancel={this.modalReturnCancel}
                        rApi={rApi}
                        parent={this}
                    />
            }
                <HeaderView
                    parent={this}
                    title="派车单号" 
                    onChangeSearchValue={
                        keyword => {
                            this.setState({ sendCarNumber: trim(keyword) }, this.onChangeValue({ sendCarNumber: trim(keyword) }))
                        }
                }>
                    <RemoteSelect
                        placeholder='车牌号'
                        onChangeValue={(value = {}) => {
                            this.setState({ carId: value.id }, this.onChangeValue({ carId: value.id }))
                        }}
                        getDataMethod={'getCars'}
                        params={{ limit: 99999, offset: 0, authenticationStatus: 1 }}
                        labelField={'carCode'}
                    />
                    <RemoteSelect
                        placeholder="承运商名称"
                        onChangeValue={(value = {}) => {
                            this.setState({ carrierId: value.id }, this.onChangeValue({ carrierId: value.id }))
                        }}
                        getDataMethod={'getCarrierList'}
                        labelField={'abbreviation'}
                        params={{ offset: 0, limit: 99999 }}
                    />
                    <div className="flex flex-vertical-center" style={{ width: 261}}>
                        <DatePicker
                            style={{ width: 120 }}
                            onChange={
                                date => {
                                    this.setState({
                                        startOrderDate: date ? moment(date).format("YYYY-MM-DD") : null
                                    }, this.onChangeValue({
                                        startOrderDate: date ? moment(date).format("YYYY-MM-DD") : null
                                    }))
                                }}
                            allowClear
                            placeholder='制单日期开始'
                        />
                        <span style={{ margin: '0 3px' }}>-</span>
                        <DatePicker
                            style={{ width: 120 }}
                            onChange={
                                date => {
                                    this.setState({
                                        endOrderDate: date ? moment(date).add(1, 'days').format('YYYY-MM-DD') : null
                                    }, this.onChangeValue({
                                        endOrderDate: date ? moment(date).add(1, 'days').format('YYYY-MM-DD') : null
                                    }))
                                }}
                            allowClear
                            placeholder='制单日期结束'
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
                </HeaderView>
                <Table
                    className='sd-block page-table'
                    isHideAddButton
                    isHideDeleteButton
                    isNoneSelected
                    parent={this}
                    getThis={v => this.tableView = v}
                    actionWidth={90}
                    actionView={this.customAction}
                    title="派车列表"
                    TableHeaderTitle={this.cusTableHeader()}
                    getData={this.getData}
                    columns={this.state.columns}
                    tableHeight={tableHeight}
                    tableWidth={120}
                >
                </Table>
            </div>
        )
    }
}
 
export default SendCar