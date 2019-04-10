import React, { Component } from 'react';
import { Table, Button, Icon, message, InputNumber } from 'antd';
import { inject } from "mobx-react"
import { cloneObject } from '@src/utils'

const EditableCell = ({ openType, editable, value, record, onChange, type, listData, clientName }) => {
    // console.log('EditableCell', record)
    if (type === 'itemName') { //费用项
        return (
            <span title={`${value.itemName}(${value.materialItemNumber})`} className='text-overflow-ellipsis'>
            {
                `${value.itemName}(${value.materialItemNumber})`
            }
            </span>
        )
    } else if(type === 'heavyBubbleName' || openType === 2) { //重泡货
        return (
            <span title={value} className='text-overflow-ellipsis'>
            {
                value
            }
            </span>
        )
    } else if (type !== 'quantity' && type !== 'boxCount' && type !== 'boardCount') {
        return (
            <span title={value} className='text-overflow-ellipsis'>
                {
                    value
                }
            </span>
        )
    }
    return (
        <div>
            {
                <InputNumber 
                    min={0}
                    // max={record.history ? record.history[type] : record[type]}
                    style={{ margin: '-5px 0', width: 80 }} 
                    value={value} 
                    title={value} 
                    onChange={value => onChange(value)} 
                />
            }
        </div>
    )
}

@inject('rApi')
export default class Materiel extends Component {

    state ={
        dataSource: [],
        removeId: [],
        listData: []
    }

    constructor(props) {
        super(props)
        let { receiveData } = props
        // let filterId = receiveData ? receiveData.id : null
        // let filterDataList = list
        this.state.dataSource = receiveData
        if (props.getThis) {
            props.getThis(this)
        }
    }

    onAdd = () => {
        const { onAddMateriel } = this.props
        const { receiveData } = this.props
        onAddMateriel(receiveData, {
            isEdit: true,
            boardCount: 0, //板数
            boxCount: 0, //箱数
            grossWeight: 0, //毛重
            heavyBubbleId: '',//重泡货类型id(1-无 2-重货 3-泡货)
            heavyBubbleName: '',//重泡货类型名
            receiverOrSenderId: receiveData.id,
            itemName: '', //货物名称
            itemSpecifications: '', //物品规格
            materialItemNumber: '', //货物代码（物料料号）
            materialsId: '', //物料表id
            orderId: '', //订单
            quantity: 0, //数量
            volume: 0 //体积
        })
    }

    onDelete = (index) => {
        const { onDeleteMateriel } = this.props
        const { receiveData } = this.props
        onDeleteMateriel(receiveData, index)
    }

    handleChange = (value, key, column) => {
        const { onChangeMateriel } = this.props
        const { receiveData } = this.props
        onChangeMateriel(receiveData, {
            value, key, column
        })
    }

    saveData = (record, index) => {
        //console.log('record', record, index)
        if(record.itemName) {
            // let { dataSource } = this.state
            // dataSource[index].isEdit = false
            // this.setState({dataSource: dataSource})
        } else{
            message.error('项目名称/代码不能为空！')
            return
        }
        const { onSaveOrEditDataMateriel } = this.props
        const { receiveData } = this.props
        onSaveOrEditDataMateriel(receiveData, {record, index}, 'save')
    }

    editData = (record, index) => {
        // let { dataSource } = this.state
        // dataSource[index].isEdit = true
        // this.setState({dataSource: dataSource})
        const { onSaveOrEditDataMateriel } = this.props
        const { receiveData } = this.props
        onSaveOrEditDataMateriel(receiveData, {record, index}, 'edit')
    }

    renderColumns = (text, key, record, column, listData, clientName) => {
        // console.log('renderColumns key', record)
        const { openType } = this.props
        return (
            <EditableCell
                openType={openType}
                editable={record.isEdit}
                value={text}
                key={key}
                type={key}
                record={record}
                listData={listData}
                clientName={clientName}
                onChange={value => this.handleChange(value, key, column)}
            />
        );
    }

    logData = () => {
        //console.log('Contacts', this.state.dataSource)
        return {
            removeId: this.state.removeId,
            data: this.state.dataSource.filter(ele => !ele.isEdit)
        }
    }

    filterDataSource = () => {
        const { dataSource } = this.state
        const { receiveData } = this.props
        if (receiveData && receiveData.id) {
            return dataSource.filter(item => item.receiveId === receiveData.id)
        }
        return dataSource
    }

    reduceCount(list, key) {
        return list.reduce(function(pre, cur) {
            let preCount = typeof pre[key] === 'number' ?  pre[key] : 0
            let curCount = typeof cur[key] === 'number' ? cur[key] : 0
            return {
                [key]: preCount + curCount
            }
        })[key]
    }

    addStatistics = () => {
        let list = this.props.receiveData
        if (!list || list.length < 1) {
            return []
        }
        if (list.length === 1) {
            return list
        }
        let dataSouce = cloneObject(list)
        // console.log('list', list)
        dataSouce.push({
            isStatistics: true,
            itemName: '总计',
            itemSpecifications: '',
            quantity: this.reduceCount(list, 'quantity'), // 数量 
            boxCount: this.reduceCount(list, 'boxCount'), // 箱数
            boardCount: this.reduceCount(list, 'boardCount'), // 板数
            grossWeight: this.reduceCount(list, 'grossWeight').toFixed(4), // 毛重
            volume: this.reduceCount(list, 'volume').toFixed(4), // 体积
            heavyBubbleName: ''
        })
        return dataSouce
    }

    render() {
        const props = this.props
        const { listData} = this.state
        const { receiveData, liftingModeId } = props
        const list = receiveData
        let clientName = receiveData ? receiveData.clientName : null
        //console.log('dataSource', dataSource)
        const dataSource = list
        const columns = () => {
            let cols = [
                {
                    className: 'text-overflow-ellipsis',
                    title: '货物名称(代码)',
                    dataIndex: 'itemName',
                    key: 'itemName',
                    width: 160,
                    render: (text, record, index) => {
                        if (record.isStatistics) {
                            return (
                                <span className="materiel-statistics-lable">
                                    {record.itemName}
                                </span>
                            )
                        }
                        return this.renderColumns({
                            itemName: record.itemName,
                            materialItemNumber: record.materialItemNumber,
                            materialsId: record.materialsId
                        }, 'itemName', record, index, listData, clientName)
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '规格',
                    dataIndex: 'itemSpecifications',
                    key: 'itemSpecifications',
                    width: 140,
                    render: (text, record, index) => {
                        if (record.isStatistics) {
                            return (
                                <span className="materiel-statistics">
                                    {record.itemSpecifications}
                                </span>
                            )
                        }
                        return <span className="materiel-statistics">
                                {record.itemSpecifications}
                        </span>
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '数量',
                    dataIndex: 'quantity',
                    key: 'quantity',
                    width: 100,
                    render: (text, record, index) => {
                        if (record.isStatistics) {
                            return (
                                <span className="materiel-statistics">
                                    {record.quantity}
                                </span>
                            )
                        }
                        return this.renderColumns(text, 'quantity', record, index)
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '箱数',
                    dataIndex: 'boxCount',
                    key: 'boxCount',
                    width: 100,
                    render: (text, record, index) => {
                        if (record.isStatistics) {
                            return (
                                <span className="materiel-statistics">
                                    {record.boxCount}
                                </span>
                            )
                        }
                        return this.renderColumns(text, 'boxCount', record, index)
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '板数',
                    dataIndex: 'boardCount',
                    key: 'boardCount',
                    width: 100,
                    render: (text, record, index) => {
                        if (record.isStatistics) {
                            return (
                                <span className="materiel-statistics">
                                    {record.boardCount}
                                </span>
                            )
                        }
                        return this.renderColumns(text, 'boardCount', record, index)
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '重量(kg)',
                    dataIndex: 'grossWeight',
                    key: 'grossWeight',
                    width: 100,
                    render: (text, record, index) => {
                        if (record.isStatistics) {
                            return (
                                <span className="materiel-statistics">
                                    {record.grossWeight}
                                </span>
                            )
                        }
                        return this.renderColumns(text, 'grossWeight', record, index)
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '体积(m³)',
                    width: 100,
                    dataIndex: 'volume',
                    key: 'volume',
                    render: (text, record, index) => {
                        if (record.isStatistics) {
                            return (
                                <span className="materiel-statistics">
                                    {record.volume}
                                </span>
                            )
                        }
                        return this.renderColumns(text, 'volume', record, index)
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '重泡货',
                    dataIndex: 'heavyBubbleName',
                    key: 'heavyBubbleName',
                    render: (text, record, index) => {
                        if (record.isStatistics) {
                            return (
                                <span>
                                    {record.heavyBubbleName}
                                </span>
                            )
                        }
                        return this.renderColumns(text, 'heavyBubbleName', record, index)
                    }
                }
            ]
            if (props.type === 2) {
                return cols
            }
            return [
                ...cols
            ]
        }
        const title = () => {
            return (
                props.isNoneTitle ?
                null
                :
                <div style={{height: 32}}>
                        <div className="flex flex-vertical-center">
                            <div className="primary-color-font">
                                物料清单
                                <span style={{color: '#666'}}>{ `( ${props.materielTitle ? props.materielTitle : '全部'} )`}</span>
                            </div>
                            {
                                !receiveData ?
                                null
                                :
                                (receiveData && receiveData.type === 'send' &&  liftingModeId === 144) ? 
                                null 
                                :
                                (receiveData && receiveData.type === 'collect' && liftingModeId === 145) ?
                                null
                                :
                                <div className="flex1" style={{ textAlign: 'right', marginRight: 10 }}>
                                    <Button onClick={this.onAdd}>
                                        <Icon type="plus" />添加
                                    </Button>
                                </div>
                            }
                        </div>
                </div>
            )
        }
        return (
            <div style={{width: '100%'}}>
                <Table
                    key='1'
                    bordered
                    pagination={false}
                    scroll={{x: true}}
                    title={title}
                    dataSource={this.addStatistics(dataSource)}
                    columns={columns()}
                    rowKey={(record, index) => {
                        return record.id || index
                    }}
                    // footer={this.footerView}
                />
            </div>

        )
    }

}