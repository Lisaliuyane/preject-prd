import React, { Component } from 'react'
import { Table, message, Button, Popover, Popconfirm  } from 'antd'
import { inject, observer } from "mobx-react"
import * as TablePlugin from './action.jsx'
import PropTypes from 'prop-types'
import DragView from '@src/components/table_header_drag'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
// import { Popconfirm } from 'antd'
import './tableview.less'

const TableHeader = (props) => {
    let { power, onDeletes } = props
    power = power || {}
    return (
        <div className="flex flex-vertical-center">
            <div style={{paddingLeft: 10}}>
                {power.name}
            </div>
            <div className="flex1" style={{textAlign: 'right'}}>
                <FunctionPower power={power.ADD_DATA}>
                    <Button onClick={props.onAdd} style={{marginRight: 10, verticalAlign: 'middle'}} icon="plus">
                        新建
                    </Button>
                </FunctionPower>
                <FunctionPower power={power.DEL_DATA}>
                    <Popconfirm
                    title={`确定要删除所有选中项?`}
                    onConfirm={onDeletes}
                    okText="确定"
                    cancelText="取消"
                    >
                    <Button style={{marginRight: 10, verticalAlign: 'middle'}} icon="close">
                        删除
                    </Button>
                    </Popconfirm>
                </FunctionPower>
                <FunctionPower power={power.EXPORT_DATA}>
                    <Button onClick={props.onExport} style={{marginRight: 10, verticalAlign: 'middle'}} icon="upload">
                        导出
                    </Button>
                </FunctionPower>
                <Popover
                    arrowPointAtCenter 
                    placement="bottomRight" 
                    title={'勾选显示，拖拽排序'} 
                    content={<DragView onChangeCheckbox={props.onChangeShowColumn} moveCard={props.moveColumn} cards={props.columns} />} trigger="click">
                    <Button title={'列排序'} style={{marginRight: 10, verticalAlign: 'middle'}} icon="bars" >
                    </Button>
                </Popover>
            </div>
        </div>
    )
}

/**
 * 表格模板
 * 
 * @class TableView
 * @extends {Component}
 */
@inject('rApi')
@observer
class TableView extends Component {

    static propTypes = {
        isHaveAddaction: PropTypes.bool,
        isHaveAddNumber: PropTypes.bool,
        columns: PropTypes.array.isRequired,
    }

    static defaultProps = {
        isHaveAddaction: true,
        isHaveAddNumber: true,
        requestMethod: '',
        actionAuth: [],
        loading: false,
        columns: []
    }
    
    state = {
        selectedRowKeys: {},
        dataSource: [],
        limit: 10,
        pagination: { position: 'top', pageSize: 10, current: 1, showSizeChanger: true }
    }

    constructor(props) {
        super(props)
        this.parent = props.parent
        if (this.parent) {
            this.parent.tableView = this
        }
    }

    componentDidMount() {
        this.initData()
    }

    onShowSizeChange = (current, size) => {
        const pager = { ...this.state.pagination }
        pager.current = current
        pager.pageSize = size
        // this.state.pagination = pager
        this.setState({pagination: pager})
    }

    initData = () => {
        let { dataSource } = this.state
        if (dataSource.length < 1) {
            this.getData()
        }
    }

    handleTableChange = (pagination, filters, sorter) => {
        let pager = { ...this.state.pagination }
        pager.current = pagination.current
        this.setState({
          pagination: pager
        }, () => {
            this.getData()
        })
    }

    getData = () => {
        let { getData, params } = this.props
        const pager = { ...this.state.pagination }
        params = params || {}
        this.setState({loading: true})
        getData(Object.assign({}, {limit: pager.pageSize, offset: pager.pageSize * (pager.current - 1)}, params)).then(d => {
            pager.total = d.total
            pager.showTotal = total => `共 ${total} 条`
            this.setState({
                dataSource: d.dataSource || [], 
                loading: false, 
                pagination: pager
            })
        }).catch(() => {
            this.setState({loading: false})
        })
    }

    refresh = () => {
        this.setState({selectedRowKeys: {}, loading: false}, () => {
            this.getData()
        })
    }

    onSearch = (d) => {
        this.setState({selectedRowKeys: {}}, () => {
            this.getData()
        })
    }

    onShowSizeChange = (current, size) => {
        const pager = { ...this.state.pagination }
        pager.current = current
        pager.pageSize = size
        this.state.pagination = pager
        this.setState({pagination: pager})
    }

    handleTableChange = (pagination, filters, sorter) => {
        let pager = { ...this.state.pagination }
        pager.current = pagination.current
        this.setState({
          pagination: pager
        }, () => {
            this.getData()
        })
    }

    getAddOrEdit = (d) => {
        this.addoredit = d
    }

    onEdit = (record, index) => {
        if (this.parent && this.parent.addoredit) {
            this.parent.addoredit.show({
                edit: true,
                data: record,
                index: index
            })
        }
    }

    onDelete = (record, index) => {
        let { dataSource } = this.state
        this.delete(record).then(() => {
            dataSource.splice(index, 1)
            this.setState({dataSource: dataSource})
        })
    }

    onDeletes = () => {
        let { selectedRowKeys, dataSource } = this.state
        let d = Object.values(selectedRowKeys).map(item => {
            return item.id
        })
        this.delete(d).then(() => {
            // for (let i = 0; i < data.length; i++ ) {
            //     for (let key in selectedRowKeys) {
            //         if (key === data[i].id) {
            //             data.splice(i, 1)
            //         }
            //     }
            // }
            // this.setState({data: data})
            this.refresh()
        })
    }

    delete = (params) => {
        let { rApi, power } = this.props
        if (params && Object.prototype.toString.call(params) === '[object Array]') {
            if (typeof params[0] === 'object') {
                params = params.map((item) => {
                    return item.id
                })
            }
        } else if (params) {
            if (typeof params === 'object') {
                params = params.id
            }
            params = [params]
        }
        return rApi[power.DEL_DATA.apiName](params).then(() => {
            message.success('操作成功！')
            // data.splice(index, 1)
            // this.setState({data: data})
        }).catch(e => {
            message.error('操作失败！')
        })
    }

    onAdd = () => {
        if (this.parent && this.parent.addoredit) {
            this.parent.addoredit.show({edit: false})
        }
    }

    onLook = (record, index) => {
        // todo 查看数据详情
        if (this.parent && this.parent.addoredit) {
            this.parent.addoredit.show({
                edit: false,
                data: record,
                index: index
            })
        }
    }

    onExport = () => {
        // todo 导出数据
        console.log('onExport')
    }

    moveColumn = (dragIndex, hoverIndex) => {
        const moveColumn = this.parent.moveColumn
        if (moveColumn) {
            moveColumn(dragIndex, hoverIndex)
        }
    }

    onChangeShowColumn = (checked, index) => {
        const onChangeShowColumn = this.parent.onChangeShowColumn
        if (onChangeShowColumn) {
            onChangeShowColumn(checked, index)
        }
    }

    onChangeSelect = (keys, selectedRows) => {
        let selectedRowKeys = this.state.selectedRowKeys
        if (selectedRows) {
            selectedRowKeys[keys.id] = keys
        } else {
            delete selectedRowKeys[keys.id]
        }
        // console.log('onChangeSelect', selectedRowKeys, selectedRows)
        this.setState({selectedRowKeys: selectedRowKeys})
    }

    render() { 
        const { columns, power } = this.props
        const { dataSource, loading } = this.state
        let { selectedRowKeys } = this.state
        let cols = columns.filter(ele => {
            return !ele.isNoDisplay
        })
        const rowSelection = {
            // selectedRowKeys,
            selectedRowKeys: Object.values(selectedRowKeys).map(item => {
                return item.id
            }),
            onSelect: this.onChangeSelect
            // onChange: this.onChangeSelect
        }
        let THeader = this.props.THeader || TableHeader
        // if (isHaveAddaction && isHaveAddNumber) {
        //     cols = TablePlugin.addAll(cols)
        // } else if (isHaveAddaction) {
        //     cols = TablePlugin.addAll(cols)
        // } else if (isHaveAddNumber) {
        //     cols  = TablePlugin.addAll(cols)
        // }
        // console.log('cols', cols)
        cols = TablePlugin.addAll({columns: cols, that: this, power: power})
        return (
            <div className="tableview-box">
                <Table 
                    bordered
                    title={() => <THeader onExport={this.onExport} onDeletes={this.onDeletes} power={power} columns={columns} onAdd={this.onAdd} onChangeShowColumn={this.onChangeShowColumn} moveColumn={this.moveColumn} />}
                    rowKey={(record, index) => {return record.id || index}}
                    dataSource={dataSource}
                    columns={cols}
                    loading={loading}
                    rowSelection={rowSelection}
                    onChange={this.handleTableChange}
                    pagination={{...this.state.pagination, onShowSizeChange: this.onShowSizeChange}}
                />
            </div>
        )
    }
}
 
export default TableView;