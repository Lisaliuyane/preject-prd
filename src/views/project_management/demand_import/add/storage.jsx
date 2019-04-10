import React, { Component, Fragment } from 'react';
import { Table, Button, Icon, Input, Popconfirm, message, InputNumber, Select, Radio } from 'antd';
import RemoteSelect from '@src/components/select_databook'
import SelectMulti from '@src/components/select_multi'
import { isArray } from '@src/utils'
import './storage.less'
const Option = Select.Option

let uid = 0
const EditableCell = ({ editable, value, record, onChange, type }) => {
   // console.log('EditableCell', value)
    if (type === 'expenseItemName') {
        return (
            <div>
            {
                editable ?
                <RemoteSelect
                    defaultValue={record ? {id: record.expenseItemId, expenseName: record.expenseItemName} : null}
                    //placeholder={''}
                    onChangeValue={
                        value => {
                            onChange(value)
                        }
                    } 
                    labelField='expenseName'
                    getDataMethod={'getCostItems'}
                    params={{limit: 999999, offset: 0, expenseType:'仓储费用'}}
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
    } else if (type === 'costUnitName') {
        return (
            <div>
            {
                editable ?
                <RemoteSelect
                defaultValue={record ? {id: record.costUnitId, title: record.costUnitName} : null}
                    //placeholder={''}
                    onChangeValue={
                        value => {
                            onChange(value)
                        }
                    } 
                    labelField='title'
                    text="费用单位"
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
    } else if(type === 'unitPrice' || type === 'multiple' || type === 'lowestFee') {
        return (
            <div>
            {
                editable ?
                <InputNumber 
                    min={1}
                    style={{ margin: '-5px 0' }} 
                    value={value} 
                    title={value} 
                    onChange={value => onChange(value)} />
                : 
                <span title={value} className='text-overflow-ellipsis'>
                {
                    value
                }
                </span>
            }
            </div>
        )
    } else if(type === 'isMonthlyCharges') {
        return (
            <div>
            {
                editable ?
                <Select 
                    defaultValue={value === 1 ? '是' : value === 0 ? '否' : null} 
                    //value={value === 1 ? '是' : '否'}
                    style={{ width: 120 }} 
                    onChange={ value => onChange(value)}
                    getPopupContainer = {() => document.querySelector('#scroll-view')}
                    allowClear
                    >
                    <Option value="0">否</Option>
                    <Option value="1">是</Option>
                </Select>
                : 
                <span title={value} className='text-overflow-ellipsis'>
                {
                    value === 1 ? '是' : '否'
                }
                </span>
            }
            </div>
            
        )
    }
    return (
        <div>
        {
            editable ?
            <Input 
                style={{ margin: '-5px 0' }} 
                value={value} 
                title={value} 
                onChange={e => onChange(e.target.value)} />
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

export default class Contacts extends Component {

    state ={
        dataSource: [],
        removeId: [],
        developmentWarehouses: [], //仓库
        activeMode: null //当前选中的仓库名
    }

    constructor(props) {
        super(props)
       // this.state.dataSource = props.data || []
        this.state.developmentWarehouses = props.data || []
        this.state.activeMode = (props.data && props.data.length > 0) ? props.data[0] : null
        if(this.state.activeMode) {
            props.getActiveMode(this.state.activeMode)
        }
    }

    onAdd = (index) => {
        let { developmentWarehouses } = this.state
        if (!developmentWarehouses[index].developmentStorageCosts || !isArray(developmentWarehouses[index].developmentStorageCosts)) {
            developmentWarehouses[index].developmentStorageCosts = []
        }
        developmentWarehouses[index].developmentStorageCosts.unshift({
            expenseItemId: '',
            expenseItemName: '',
            unitPrice: '',
            costUnitId: '',
            costUnitName: '',
            multiple: '',
            lowestFee: '',
            isMonthlyCharges: '',
            remark: '',
            developmentId: '',
            isEdit: true,
            uid: `uid${uid++}`
        })
        this.setState({developmentWarehouses})
    }

    onDelete = (index, parentIndex) => {
       // this.state.dataSource.removeId.push(this.state.dataSource[index].id)
        let developmentWarehouses = this.state.developmentWarehouses
        let target = developmentWarehouses[parentIndex].developmentStorageCosts[index]
        if (target.id) {
            let { removeId } = this.state
            removeId.push(target.id)
            this.setState({removeId: removeId})
        }
        developmentWarehouses[parentIndex].developmentStorageCosts.splice(index, 1)
        this.setState({
            developmentWarehouses: developmentWarehouses
        })
    }

    handleChange = (value, key, column, parentIndex) => {
        let developmentWarehouses = this.state.developmentWarehouses
        if (key === 'expenseItemName') {
            developmentWarehouses[parentIndex].developmentStorageCosts[column]['expenseItemName'] = value ? value.expenseName || value.label : ''
            developmentWarehouses[parentIndex].developmentStorageCosts[column]['expenseItemId'] = value ? value.id : ''
        } else if(key === 'costUnitName') {
            developmentWarehouses[parentIndex].developmentStorageCosts[column]['costUnitName'] = value ? value.title || value.label : ''
            developmentWarehouses[parentIndex].developmentStorageCosts[column]['costUnitId'] = value ? value.id : ''
        } else if(key === 'isMonthlyCharges') {
            //console.log('isMonthlyCharges', parseInt(value))
            developmentWarehouses[parentIndex].developmentStorageCosts[column]['isMonthlyCharges'] = value ? parseInt(value, 10) : ''
        } else {
            developmentWarehouses[parentIndex].developmentStorageCosts[column][key] = value
        }
        this.setState({
            developmentWarehouses: developmentWarehouses
        })
    }

    renderColumns = (text, key, record, column, parentIndex) => {
        return (
            <EditableCell
                editable={record.isEdit}
                value={text}
                key={key}
                type={key}
                record={record}
                parentIndex={parentIndex}
                onChange={value => this.handleChange(value, key, column, parentIndex)}
            />
        );
    }

    logData = () => {
        // console.log('Contacts', this.state.dataSource)
        // return {
        //     removeId: this.state.removeId,
        //     data: this.state.dataSource.filter(ele => !ele.isEdit)
        // }
        let {developmentWarehouses} = this.state
        if(developmentWarehouses && developmentWarehouses.length > 0) {
            let obj = developmentWarehouses.map(item => {
                return {
                    ...item,
                    developmentStorageCosts: (item.developmentStorageCosts && item.developmentStorageCosts.length > 0) ? item.developmentStorageCosts.map(d => {
                        return {
                            ...d,
                            isEdit: false
                        }
                    }) : []
                }
            })
            return {
                removeId: this.state.removeId,
                data: obj
            }
        }
        return {
            removeId: this.state.removeId,
            data: this.state.developmentWarehouses
        }
    }

    saveData = (record, index, parentIndex) => {
        //console.log('saveData-record', record)
        //let developmentWarehouses = this.state.developmentWarehouses
        if(record.expenseItemId) {
            let { developmentWarehouses } = this.state
            developmentWarehouses[parentIndex].developmentStorageCosts[index].isEdit = false
            this.setState({developmentWarehouses: developmentWarehouses})
        } else{
            message.error('费用项不能为空！')
        }
        
    }

    editData = (record, index, parentIndex) => {
        let { developmentWarehouses } = this.state
        developmentWarehouses[parentIndex].developmentStorageCosts[index].isEdit = true
        this.setState({developmentWarehouses: developmentWarehouses})
    }

    handleChangeWarehouse = (value) => { //选择仓库
        let { activeMode } = this.state
        this.setState({
            developmentWarehouses: value.map((item) => {
                let filter = this.state.developmentWarehouses.filter(ele => item.id === ele.warehouseId)
                if (filter && filter.length > 0) {
                    return filter[0]
                }
                let obj = {warehouseId: item.id, warehouseName: item.title}
                return obj
            }
        )}, () => {
            let warehousesList = this.state.developmentWarehouses
            if (activeMode && warehousesList && warehousesList.length > 0 && !warehousesList.some(item => parseInt(item.warehouseId, 10) === parseInt(activeMode.warehouseId, 10))) {
                activeMode = warehousesList[0]
            } else if (activeMode && (!warehousesList || warehousesList.length < 1)) {
                activeMode = null
            } else if (!activeMode && warehousesList && warehousesList.length > 0) {
                activeMode = warehousesList[0]
            }
            this.setState({
                activeMode
            })
        }
    )}

    handleChangeActiveMode = (e) => { //当前选中的仓库
        // console.log('handleChangeActiveMode', e.target.value)
        if (!e || e.target.value === undefined) {
            return
        }
        let { developmentWarehouses } = this.state
        let activeMode = developmentWarehouses.find(item => parseInt(item.warehouseId, 10) === parseInt(e.target.value, 10))
        // console.log('activeMode', activeMode)
        this.setState({
            activeMode
        }, () => {
            this.props.getActiveMode(this.state.activeMode)
        })
    }

    changeSelectMultiData = (value) => { //转换仓库格式
        try {
            return value.map(item => {
                return {
                    id: item.warehouseId,
                    title: item.warehouseName
                }
            })
        } catch (e) {
            return null
        }
        return null
    }

    render() {
        let { dataSource, developmentWarehouses, activeMode } = this.state
        let props = this.props
        //console.log('dataSource', dataSource)
        const columns = (parentIndex) => {
            let cols = [
                {
                    className: 'text-overflow-ellipsis',
                    title: '费用项',
                    dataIndex: 'expenseItemName',
                    key: 'expenseItemName',
                    width: 120,
                    render: (text, record, index) => {
                        return this.renderColumns(text, 'expenseItemName', record, index, parentIndex)
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '单价',
                    dataIndex: 'unitPrice',
                    key: 'unitPrice',
                    width: 120,
                    render: (text, record, index) => this.renderColumns(text, 'unitPrice', record, index, parentIndex)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '费用单位',
                    dataIndex: 'costUnitName',
                    key: 'costUnitName',
                    width: 120,
                    render: (text, record, index) => this.renderColumns(text, 'costUnitName', record, index, parentIndex)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '倍数',
                    dataIndex: 'multiple',
                    key: 'multiple',
                    width: 120,
                    render: (text, record, index) => this.renderColumns(text, 'multiple', record, index, parentIndex)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '最低收费',
                    dataIndex: 'lowestFee',
                    key: 'lowestFee',
                    width: 120,
                    render: (text, record, index) => this.renderColumns(text, 'lowestFee', record, index, parentIndex)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '是否按月收费',
                    dataIndex: 'isMonthlyCharges',
                    key: 'isMonthlyCharges',
                    width: 150,
                    render: (text, record, index) => this.renderColumns(text, 'isMonthlyCharges', record, index, parentIndex)
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    render: (text, record, index) => this.renderColumns(text, 'remark', record, index, parentIndex)
                }
            ]
            if (props.type === 2 || props.reviewStatus === 2 || props.reviewStatus === 3) {
                return cols
            }
            return [
                ...cols,
                {
                    title: '操作',
                    dataIndex: 'action',
                    width: 140,
                    className: 'table-action table-action-action',
                    key: 'action',
                    fixed: 'right',
                    render: (text, record, index) => {
                        return (
                        <div>
                            {
                                record.isEdit ? 
                                <span
                                    onClick={() => this.saveData(record, index, parentIndex)}
                                    className={`action-button`}
                                >
                                    保存
                                </span>
                            :
                                <span
                                    onClick={() => this.editData(record, index, parentIndex)}
                                    className={`action-button`}
                                >
                                    编辑
                                </span>
                            }
                            
                            <Popconfirm
                                title="确定要删除此项?"
                                onConfirm={() => this.onDelete(index, parentIndex)}
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
        //         <div className="flex flex-vertical-center">
        //             <div style={{ color: 'rgb(119, 119, 119)' }}>
        //                 { '仓储成本研发'}
        //             </div>
        //             {
        //                 props.type === 2 || props.reviewStatus === 2 || props.reviewStatus === 3 ? 
        //                 null 
        //                 :
        //                 <div className="flex1" style={{ textAlign: 'right'}}>
        //                     <Button onClick={this.onAdd}>
        //                         <Icon type="plus" />新建
        //                     </Button>
        //                 </div>
        //             }
        //         </div>
        //     )
        // }
        return (
            <div className="storage-table-wrapper">
                <div className="flex flex-vertical-center" style={{margin: '10px 0'}}>
                    <div  style={{color: '#808080', width: 84}}>选择仓库</div>
                    <div>
                        <SelectMulti
                            defaultValue={this.changeSelectMultiData(developmentWarehouses) ? this.changeSelectMultiData(developmentWarehouses) : []}
                            getDataMethod='getWarehouseList'
                            labelField='name'
                            dataKey='records'
                            params={{pageSize: 999999, pageNo: 1}}
                            handleChangeSelect={this.handleChangeWarehouse}
                        />
                    </div>
                </div>
                {
                    developmentWarehouses && developmentWarehouses.length > 0 ?
                    <div style={{color: 'rgb(72, 72, 72)'}}>
                        仓储报价
                    </div>
                    :
                    null
                }
                {/* {
                    (developmentWarehouses && developmentWarehouses.length > 0) ?
                    <div style={{position: 'absolute'}}>
                        <Radio.Group 
                            value={activeMode ? activeMode.warehouseId : null} 
                            buttonStyle="solid"
                            onChange={this.handleChangeActiveMode}
                        >
                            {
                                developmentWarehouses.map((item, index) => {
                                    return(
                                        <Radio.Button 
                                            style={{borderRadius: 0}}
                                            // disabled={(id === 1 || id === 2 || showtype === 2) ? true : false}
                                            key={item.warehouseId} 
                                            value={item.warehouseId}
                                        >
                                            {item.warehouseName}
                                        </Radio.Button>
                                    )
                                } )
                            }
                        </Radio.Group>
                    </div>
                :
                ''
                } */}
                {
                    developmentWarehouses && developmentWarehouses.map((item, index) => {
                        let dataList = item.developmentStorageCosts ? item.developmentStorageCosts : []
                        return(
                            <div key={item.warehouseId}>
                                {
                                    (activeMode && activeMode.warehouseId) === item.warehouseId ?
                                    <div className="flex flex-vertical-center" style={{padding: '5px 0'}}>
                                        <div>
                                            <Radio.Group 
                                                value={activeMode ? activeMode.warehouseId : null} 
                                                buttonStyle="solid"
                                                onChange={this.handleChangeActiveMode}
                                            >
                                                {
                                                    developmentWarehouses.map((item, index) => {
                                                        return(
                                                            <Radio.Button 
                                                                style={{borderRadius: 0}}
                                                                // disabled={(id === 1 || id === 2 || showtype === 2) ? true : false}
                                                                key={item.warehouseId} 
                                                                value={item.warehouseId}
                                                            >
                                                                {item.warehouseName}
                                                            </Radio.Button>
                                                        )
                                                    } )
                                                }
                                            </Radio.Group>
                                        </div>
                                        <div className="flex1"></div>
                                        {
                                            props.type === 2 || props.reviewStatus === 2 || props.reviewStatus === 3 || props.isDisabled ? 
                                            null 
                                            :
                                            <Button onClick={() => this.onAdd(index)}>
                                                <Icon type="plus" />新建
                                            </Button>
                                        }
                                    </div>
                                    :
                                    null
                                }
                                {
                                    (activeMode && activeMode.warehouseId) === item.warehouseId ?
                                    <div 
                                        style={{maxHeight: 250, overflow:'hidden', overflowY: 'auto'}}
                                    >
                                        <Table
                                            // key='1'
                                            //bordered
                                            pagination={false}
                                            scroll={{x: true}}
                                            title={this.title}
                                            dataSource={dataList}
                                            columns={columns(index)}
                                            rowKey={(record, index) => {return record.id || record.uid || index}}
                                        />
                                    </div>
                                    :
                                    null
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }

}