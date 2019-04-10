import React, { Component } from 'react';
import { Table, Button, Icon, Input, Popconfirm, message, InputNumber, Form } from 'antd';
import { inject } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import FilterSelect from '@src/components/select_filter'
import businessModel from '@src/views/business_management/liftingModeId'
import { cloneObject, isEmptyString } from '@src/utils'
const heavyBubbleTypeData = [
    {
        id: 1,
        title: '无'
    },
    {
        id: 2,
        title: '重货'
    },
    {
        id: 3,
        title: '泡货'
    }
]

class HeavyBubble extends Component {

    state={
        show: true,
        heavyBubbleId: null
    }

    constructor(props) {
        super(props)
        const { record } = props
        this.state.heavyBubbleId = record.heavyBubbleId
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.editable && nextProps.record.heavyBubbleId !== this.state.heavyBubbleId ) {
            this.setState({
                show: false,
                heavyBubbleId: nextProps.record.heavyBubbleId
            }, () => {
                this.setState({
                    show: true
                })
            })
        }
    }

    render() {
        const { show } = this.state
        const { record, onChangeValue, editable, value } = this.props
        if (!show) {
            return null
        }
        return (
            <div>
            {
                editable ?
                <div style={{minWidth: 110}}>
                    <RemoteSelect
                        defaultValue={record ? {id: record.heavyBubbleId, title: record.heavyBubbleName} : null}
                        onChangeValue={
                            value => {
                                onChangeValue(value)
                            }
                        } 
                        labelField={'title'}
                        list={heavyBubbleTypeData}
                    />
                </div>
                : 
                <span title={value} className='text-overflow-ellipsis'>
                {
                    value
                }
                </span>
            }
            </div>
        )
    }
}

const EditableCell = ({ editable, value, record, onChange, type, listData, clientName, clientId, rIndex, getFieldDecorator }) => {
    if (type === 'itemName') { //费用项
        return (
            <div>
            {
                editable ?
                <div style={{minWidth: 110}}>
                    <FilterSelect
                        filterDataOne={{ placeholder: '代码', getDataMethod: 'getMaterials', params: { limit: 99999, offset: 0, clientId: clientId }, labelField: 'materialItemNumber' }}
                        filterDataTwo={{ placeholder: '货物名称', getDataMethod: 'getMaterials', params: { limit: 99999, offset: 0, clientId: clientId }, labelField: 'itemName' }}
                        getDataMethod="getMaterials"
                        params={{ limit: 99999, offset: 0, clientName: clientName, clientId: clientId }}
                        labelFieldCode='materialItemNumber'
                        labelFieldName='itemName'
                        titleName=''
                        selectValue={value && value.itemName ? `${value.itemName}(${value.materialItemNumber})` : null}
                        getLabelVul={value => {
                            onChange({
                                origin_data: value,
                                itemName: value.name,
                                materialItemNumber: value.code,
                                materialsId: value.id,
                                volumeRule: value.singleVolume,
                                netWeightRule: value.singleWeight,
                                grossWeightRule: value.grossWeight,
                                boxCountRule: value.boxCount,
                                quantityRule: value.quantity,
                                unitName: value.unitName,
                                unitId: value.unitId,
                                heavyBubbleRatio: value.heavyBubbleRatio
                            })
                        }}
                    />
                </div>
                : 
                <span title={`${value.itemName}(${value.materialItemNumber})`} className='text-overflow-ellipsis'>
                {
                    `${value.itemName}(${value.materialItemNumber})`
                }
                </span>
            }
            </div>
        )
    } else if(type === 'heavyBubbleName') { //重泡货
        return (
            <HeavyBubble record={record} value={value} onChangeValue={onChange} editable={editable} />
        )
    } else if (type === 'itemSpecifications') {
        return editable ?
            <Input
                style={{width: 140}}
                value={value} 
                title={value} 
                onChange={e => onChange(e.target.value)} 
            />
            :
            <span title={value} className='text-overflow-ellipsis'>
                {
                    value
                }
            </span>
    }
    return (
        <div>
        {
            editable ?
            <InputNumber 
                min={0}
                style={{ margin: '-5px 0', width: 80 }} 
                value={value} 
                title={value} 
                onChange={value => onChange(value)} 
            />
            : 
            <span title={value} className='text-overflow-ellipsis'>
            {
                value
            }
            </span>
        }
        </div>
    )
}

@inject('rApi')
class Materiel extends Component {

    state ={
        dataSource: [],
        removeId: [],
        listData: [],
        materialData: null
    }

    constructor(props) {
        super(props)
        const { receiveData } = props
        // console.log('receive', receiveData)
        // let filterId = receiveData ? receiveData.id : null
        // let filterDataList = list
        this.state.dataSource = receiveData.materialList
        if(props.getThis){
            props.getThis(this)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receiveData !== this.props.receiveData) {
            this.setState({
                dataSource: nextProps.receiveData.materialList
            })
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
            netWeight: 0, //净重
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
        // console.log('handleChange', value)
        const { onChangeMateriel } = this.props
        const { receiveData } = this.props
        // console.log(receiveData.materialList[column])
        if (value && value.origin_data) {
            let origin_data = value.origin_data

            let itemSpecifications = origin_data.itemSpecifications
            onChangeMateriel(receiveData, {
                value: itemSpecifications,
                key: 'itemSpecifications',
                column: column
            })
            if (origin_data.heavyBubbleName) {
                onChangeMateriel(receiveData, {
                    value: {
                        heavyBubbleName: origin_data.heavyBubbleName,
                        label: origin_data.heavyBubbleName,
                        title: origin_data.heavyBubbleName,
                        name: origin_data.heavyBubbleName,
                        name: origin_data.heavyBubbleName,
                        id: origin_data.heavyBubbleId
                    },
                    key: 'heavyBubbleName',
                    column: column
                })
            }

            if(origin_data.heavyBubbleRatio) {
                onChangeMateriel(receiveData, {
                    value: origin_data.heavyBubbleRatio,
                    key: 'heavyBubbleRatio',
                    column: column
                })
            }
            
            delete value.origin_data
        } 
        value = !value ? 0: value
        onChangeMateriel(receiveData, {
            value, key, column
        })
        const d = receiveData.materialList[column]
        if (!isNaN(value) && key === 'grossWeight') {
            // 修改毛重
            if (d.grossWeightRule) {
                let rt = value / d.grossWeightRule
                let dot = rt - parseInt(rt)
                onChangeMateriel(receiveData, {
                    value: parseInt(rt),
                    key: 'quantity',
                    column
                })
                onChangeMateriel(receiveData, {
                    value: parseFloat(value.toFixed(4)),
                    key: 'grossWeight',
                    column
                })
                if (d.netWeightRule) {
                    onChangeMateriel(receiveData, {
                        value: parseFloat((d.quantity * d.netWeightRule).toFixed(4)),
                        key: 'netWeight',
                        column
                    })
                }
                if (d.volumeRule) {
                    onChangeMateriel(receiveData, {
                        value: parseFloat((d.quantity * d.volumeRule).toFixed(4)),
                        key: 'volume',
                        column
                    })
                }
                if (d.quantityRule) {
                    onChangeMateriel(receiveData, {
                        value: parseInt(d.quantity / d.quantityRule),
                        key: 'boxCount',
                        column
                    })
                }
                if (d.boxCountRule) {
                    onChangeMateriel(receiveData, {
                        value: parseInt(d.boxCount / d.boxCountRule),
                        key: 'boardCount',
                        column
                    })
                }
            }
        } else if (!isNaN(value) && key === 'netWeight') {
            // 修改净重
            if (d.netWeightRule) {
                let rt = value / d.netWeightRule
                let dot = rt - parseInt(rt)
                onChangeMateriel(receiveData, {
                    value: parseInt(rt),
                    key: 'quantity',
                    column
                })
                onChangeMateriel(receiveData, {
                    value: parseFloat(value.toFixed(4)),
                    key: 'netWeight',
                    column
                })
                if (d.grossWeightRule) {
                    onChangeMateriel(receiveData, {
                        value: parseFloat((d.quantity * d.grossWeightRule).toFixed(4)),
                        key: 'grossWeight',
                        column
                    })
                }
                if (d.volumeRule) {
                    onChangeMateriel(receiveData, {
                        value: parseFloat((d.quantity * d.volumeRule).toFixed(4)),
                        key: 'volume',
                        column
                    })
                }
                if (d.quantityRule) {
                    onChangeMateriel(receiveData, {
                        value: parseInt(d.quantity / d.quantityRule),
                        key: 'boxCount',
                        column
                    })
                }
                if (d.boxCountRule) {
                    onChangeMateriel(receiveData, {
                        value: parseInt(d.boxCount / d.boxCountRule),
                        key: 'boardCount',
                        column
                    })
                }
            }
        } else if (!isNaN(value) && key === 'volume') {
            // 修改体积
            if (d.volumeRule) {
                let rt = value / d.volumeRule
                let dot = rt - parseInt(rt)
                onChangeMateriel(receiveData, {
                    value: parseInt(rt),
                    key: 'quantity',
                    column
                })
                onChangeMateriel(receiveData, {
                    value: parseFloat((value - dot * d.volumeRule).toFixed(4)),
                    key: 'volume',
                    column
                })
                if (d.grossWeightRule) {
                    onChangeMateriel(receiveData, {
                        value: parseFloat((d.quantity * d.grossWeightRule).toFixed(4)),
                        key: 'grossWeight',
                        column
                    })
                }
                if (d.netWeightRule) {
                    onChangeMateriel(receiveData, {
                        value: parseFloat((d.quantity * d.netWeightRule).toFixed(4)),
                        key: 'netWeight',
                        column
                    })
                }
                if (d.quantityRule) {
                    onChangeMateriel(receiveData, {
                        value: parseInt(d.quantity / d.quantityRule),
                        key: 'boxCount',
                        column
                    })
                }
                if (d.boxCountRule) {
                    onChangeMateriel(receiveData, {
                        value: parseInt(d.boxCount / d.boxCountRule),
                        key: 'boardCount',
                        column
                    })
                }
            }
        } else if (!isNaN(value) && key === 'boardCount') {
            // 修改板数
            if (d.boxCountRule) {
                let boxCount = value * d.boxCountRule
                onChangeMateriel(receiveData, {
                    value: boxCount,
                    key: 'boxCount',
                    column
                })
            }
            if (d.quantityRule) {
                let quantity = value * d.boxCountRule * d.quantityRule
                onChangeMateriel(receiveData, {
                    value: quantity,
                    key: 'quantity',
                    column
                })
            }
            if (d.grossWeightRule) {
                let grossWeight = d.quantity * d.grossWeightRule
                onChangeMateriel(receiveData, {
                    value: grossWeight.toFixed(4),
                    key: 'grossWeight',
                    column
                })
            }
            if (d.netWeightRule) {
                let netWeight = d.quantity * d.netWeightRule
                onChangeMateriel(receiveData, {
                    value: netWeight.toFixed(4),
                    key: 'netWeight',
                    column
                })
            }
            if (d.volumeRule) {
                let volume = d.quantity * d.volumeRule
                onChangeMateriel(receiveData, {
                    value: volume.toFixed(4),
                    key: 'volume',
                    column
                })
            }
        } else if (!isNaN(value) && key === 'boxCount') {
            // 修改箱数
            if (d.boxCountRule) {
                let boardCount = Math.ceil(value / d.boxCountRule)
                onChangeMateriel(receiveData, {
                    value: boardCount,
                    key: 'boardCount',
                    column
                })
            }
            if (d.quantityRule) {
                let quantity = value * d.quantityRule
                onChangeMateriel(receiveData, {
                    value: quantity,
                    key: 'quantity',
                    column
                })
            }
            if (d.grossWeightRule) {
                let grossWeight = d.quantity * d.grossWeightRule
                onChangeMateriel(receiveData, {
                    value: grossWeight.toFixed(4),
                    key: 'grossWeight',
                    column
                })
            }
            if (d.netWeightRule) {
                let netWeight = d.quantity * d.netWeightRule
                onChangeMateriel(receiveData, {
                    value: netWeight.toFixed(4),
                    key: 'netWeight',
                    column
                })
            }
            if (d.volumeRule) {
                let volume = d.quantity * d.volumeRule
                onChangeMateriel(receiveData, {
                    value: volume.toFixed(4),
                    key: 'volume',
                    column
                })
            }
        } else if (!isNaN(value) && key === 'quantity') {
            // 修改数量
            if (d.quantityRule) {
                let boxCount = Math.ceil(value / d.quantityRule)
                onChangeMateriel(receiveData, {
                    value: boxCount,
                    key: 'boxCount',
                    column
                })
            }
            if (d.boxCountRule) {
                let boardCount = Math.ceil(d.boxCount / d.boxCountRule)
                onChangeMateriel(receiveData, {
                    value: boardCount,
                    key: 'boardCount',
                    column
                })
            }
            if (d.grossWeightRule) {
                let grossWeight = d.quantity * d.grossWeightRule
                onChangeMateriel(receiveData, {
                    value: grossWeight.toFixed(4),
                    key: 'grossWeight',
                    column
                })
            }
            if (d.netWeightRule) {
                let netWeight = d.quantity * d.netWeightRule
                onChangeMateriel(receiveData, {
                    value: netWeight.toFixed(4),
                    key: 'netWeight',
                    column
                })
            }
            if (d.volumeRule) {
                let volume = d.quantity * d.volumeRule
                onChangeMateriel(receiveData, {
                    value: volume.toFixed(4),
                    key: 'volume',
                    column
                })
            }
        }
    }

    // 保存物料清单明细行数据
    saveData = (record, index) => {
        if(isEmptyString(record.itemName)) {
            message.warning('请选择物料名称(代码)')
            return
        } 
        const { onSaveOrEditDataMateriel } = this.props
        const { receiveData } = this.props
        onSaveOrEditDataMateriel(receiveData, {record, index}, 'save')
    }

    editData = (record, index) => {
        const { onSaveOrEditDataMateriel } = this.props
        const { receiveData } = this.props
        onSaveOrEditDataMateriel(receiveData, {record, index}, 'edit')
    }

    renderColumns = (text, key, record, column, listData, clientName, clientId) => {
        //  console.log('renderColumns key', key)
        const { getFieldDecorator } = this.props.form
        return (
            <EditableCell
                editable={record.isEdit}
                value={text}
                key={key}
                type={key}
                record={record}
                listData={listData}
                clientName={clientName}
                clientId={clientId}
                onChange={value => this.handleChange(value, key, column)}
                rIndex={column}
                getFieldDecorator={getFieldDecorator}
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
            let preCount = typeof pre[key] === 'number' ?  pre[key] : typeof pre[key] === 'string' ? parseFloat(pre[key]) : 0
            let curCount = typeof cur[key] === 'number' ? cur[key] : typeof cur[key] === 'string' ? parseFloat(cur[key]) : 0
            if (key === 'grossWeight' || key === 'netWeight' || key === 'volume') {
                return {
                    [key]: (preCount + curCount).toFixed(4)
                }
            } else {
                return {
                    [key]: preCount + curCount
                }
            }
        })[key]
    }

    addStatistics = () => {
        let list = this.props.receiveData.materialList
        if (list && list.length < 1) {
            return []
        }
        if (list && list.length === 1) {
            return list
        }
        if(list && list.length > 1) {
            let dataSouce = cloneObject(list)
            // console.log('list', list)
            dataSouce.push({
                isStatistics: true,
                itemName: '总计',
                itemSpecifications: '',
                quantity: this.reduceCount(list, 'quantity'), // 数量 
                boxCount: this.reduceCount(list, 'boxCount'), // 箱数
                boardCount: this.reduceCount(list, 'boardCount'), // 板数
                grossWeight: this.reduceCount(list, 'grossWeight'), // 毛重
                netWeight: this.reduceCount(list, 'netWeight'), // 净重
                volume: this.reduceCount(list, 'volume'), // 体积
                heavyBubbleName: ''
            })
            return dataSouce
        }
    }

    // actionView = ({record}) => {
    //     console.log('actionView', record.isStatistics)
    //     if (record.isStatistics) {
    //         return <span />
    //     }
    //     return false
    // }

    render() {
        const props = this.props
        const { listData } = this.state
        const { receiveData, liftingModeId, clientId, maxWidth, parentStyle } = props
        const list = receiveData.materialList
        let clientName = receiveData ? receiveData.clientName : null
        // console.log('dataSource', receiveData, liftingModeId)
        const dataSource = list
        let flag = (businessModel.isOneToMany(this.props.liftingModeId) && this.props.selectType === 'send') || (businessModel.isManyToOne(this.props.liftingModeId) && this.props.selectType === 'collect')
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
                        }, 'itemName', record, index, listData, clientName, clientId)
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
                        return this.renderColumns(text, 'itemSpecifications', record, index)
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
                // {
                //     className: 'text-overflow-ellipsis',
                //     title: '净重(kg)',
                //     dataIndex: 'netWeight',
                //     key: 'netWeight',
                //     width: 100,
                //     render: (text, record, index) => {
                //         if (record.isStatistics) {
                //             return (
                //                 <span className="materiel-statistics">
                //                     {record.netWeight}
                //                 </span>
                //             )
                //         }
                //         return this.renderColumns(text, 'netWeight', record, index)
                //     }
                // },
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
                    width: 100,
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
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '重泡比',
                    dataIndex: 'heavyBubbleRatio',
                    key: 'heavyBubbleRatio',
                    render: (text, record, index) => {
                        if (record.isStatistics) {
                            return (
                                <span>
                                    {record.heavyBubbleRatio}
                                </span>
                            )
                        }
                        return this.renderColumns(text, 'heavyBubbleRatio', record, index)
                    }
                }
            ]
            if (props.openType === 2 || flag) {
                return cols
            }
            return [
                ...cols,
                {
                    fixed: 'right',
                    title: '操作',
                    dataIndex: 'action',
                    width: 100,
                    className: 'table-action table-action-action',
                    key: 'action',
                    render: (text, record, index) => {
                        if (record.isStatistics) {
                            return null
                        }
                        return (
                        <div style={{width: 100}}>
                            {
                                record.isEdit ? 
                                <span
                                    onClick={() => this.saveData(record, index)}
                                    className={`action-button`}
                                >
                                    保存
                                </span>
                            :
                                <span
                                    onClick={() => this.editData(record, index)}
                                    className={`action-button`}
                                >
                                    编辑
                                </span>
                            }
                                    <Popconfirm
                                        title="确定要删除此项?"
                                        onConfirm={() => this.onDelete(index)}
                                        okText="确定"
                                        cancelText="取消">
                                        <span
                                            className={`action-button`}
                                        >
                                            删除
                                        </span>
                                    </Popconfirm>
                        </div>
                        )
                    }
                }
            ]
        }
        // const title = () => {
        //     return (
        //         props.isNoneTitle ?
        //         null
        //         :
        //         <div style={{height: 32}}>
        //                 <div className="flex flex-vertical-center">
        //                     <div className="primary-color-font">
        //                         物料清单
        //                         <span style={{color: '#666'}}>{ `( ${props.materielTitle ? props.materielTitle : '全部'} )`}</span>
        //                     </div>
        //                     {
        //                         !receiveData ?
        //                         null
        //                         :
        //                         (receiveData && receiveData.type === 'send' &&  businessModel.isOneToMany(liftingModeId)) ? 
        //                         null 
        //                         :
        //                         (receiveData && receiveData.type === 'collect' && businessModel.isManyToOne(liftingModeId)) ?
        //                         null
        //                         :
        //                         props.openType === 2 || flag ?
        //                         null
        //                         :
        //                         <div className="flex1" style={{ textAlign: 'right', marginRight: 10 }}>
        //                             <Button onClick={this.onAdd}>
        //                                 <Icon type="plus" />添加
        //                             </Button>
        //                         </div>
        //                     }
        //                 </div>
        //         </div>
        //     )
        // }
        // console.log('dataSource', dataSource)
        return (
            <div style={{padding: '10px', background: '#F7F7F7', ...parentStyle}}>
                {
                    this.props.isNoneTitle ?
                    null
                    :
                    <div style={{height: 32}}>
                            <div className="flex flex-vertical-center">
                                {/* <div className="primary-color-font">
                                    物料清单
                                    <span style={{color: '#666'}}>{ `( ${props.materielTitle ? props.materielTitle : '全部'} )`}</span>
                                </div> */}
                                {
                                    !receiveData ?
                                    null
                                    :
                                    (receiveData && receiveData.type === 'send' &&  businessModel.isOneToMany(liftingModeId)) ? 
                                    null 
                                    :
                                    (receiveData && receiveData.type === 'collect' && businessModel.isManyToOne(liftingModeId)) ?
                                    null
                                    :
                                    props.openType === 2 || flag ?
                                    null
                                    :
                                    <div className="flex1" style={{width: 200, color: '#18B583'}} onClick={this.onAdd}>
                                        <Icon type="plus" style={{color: '#18B583'}} />
                                        <a>添加物料信息</a>
                                        {/* <Button onClick={this.onAdd}>
                                            <Icon type="plus" />添加
                                        </Button> */}
                                    </div>
                                }
                                <div className="flex1"></div>
                            </div>
                    </div>
                }
                <div style={{background: '#fff', maxWidth: maxWidth ? maxWidth : 900, maxHeight: 200, overflowY: 'scroll'}}>
                    <Table
                        key='1'
                        bordered={false}
                        size="small"
                        pagination={false}
                        scroll={{x: true}}
                        title={this.title}
                        dataSource={this.addStatistics(dataSource)}
                        columns={columns()}
                        rowKey={(record, index) => {return record.id || ('index' + index)}}
                        // footer={this.footerView}
                    />
                </div>
            </div>

        )
    }

}


export default Form.create()(Materiel)