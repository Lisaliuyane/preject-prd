import React, { Component } from 'react'
import { Table, message, Button, Popover, Popconfirm, Pagination   } from 'antd'
import { inject, observer } from "mobx-react"
import * as TablePlugin from './action.jsx'
import PropTypes from 'prop-types'
import DragView from '@src/components/table_header_drag'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { Resizable } from 'react-resizable'
// import { Popconfirm } from 'antd'
import { isArray } from '@src/utils'
import './tableview.less'

/* 表格列拖动 */
const ResizeableTitle = (props) => {
    let { originCol, onResize, width, ...restProps } = props;
    let key = props.children.key
    let filter = originCol.filter(item => item.key === key)
    // console.log('filter1', filter)
    if (key && filter && filter.length > 0 && filter[0].width) {
        // console.log('filter2', key, filter[0].width, width)
        if (width < filter[0].width) {
            return (
                <Resizable width={filter[0].width} height={0} onResize={onResize}>
                    <th {...restProps} />
                </Resizable>
            )
        }
    }

    if (!width) {
      return <th {...restProps} />;
    }
  
    return (
      <Resizable width={width} height={0} onResize={onResize}>
        <th {...restProps} />
      </Resizable>
    )
}

const TableHeader = (props) => {
    let { 
        power,
        onDeletes,
        TableHeaderChildren,
        TableHeaderTitle,
        TableHeaderStyle,
        title,
        isHideHeaderButton,
        isHideAddButton,
        isHideDeleteButton,
        isHideDragButton,
        getPopupContainer,
        cusTableHeaderButton,
        isRequired
    } = props
    power = power || {}
    getPopupContainer = getPopupContainer || (() => document.body)
    return (
        <div className="flex flex-vertical-center" >
            <div style={{paddingLeft: 0, ...TableHeaderStyle}}>
                {isRequired ? <span style={{ color: 'red', fontWeight: 'bold'}}>*</span> : ''}{TableHeaderTitle || power.name || title}
            </div>
            <div className="flex1" style={{textAlign: 'right'}}>
                {
                    TableHeaderChildren ? 
                    TableHeaderChildren
                    :
                    null
                }
                {
                    isHideHeaderButton || isHideAddButton ?
                    null
                    :
                    <FunctionPower power={power.ADD_DATA}>
                        <Button onClick={props.onAdd} style={{marginRight: 10, verticalAlign: 'middle', borderRadius: 0}} icon="plus">
                            新建
                        </Button>
                    </FunctionPower>
                }
                {
                    isHideHeaderButton || isHideDeleteButton ?
                    null
                    :
                    <FunctionPower power={power.BATCH_DEL || power.DEL_DATA}>
                        <Popconfirm
                            title={`确定要删除所有选中项?`}
                            onConfirm={onDeletes}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button style={{marginRight: 10, verticalAlign: 'middle', borderRadius: 0}} icon="close">
                                删除
                            </Button>
                        </Popconfirm>
                    </FunctionPower>
                }
                {
                    cusTableHeaderButton || null
                }
                {
                    // <FunctionPower power={power.EXPORT_DATA}>
                    //     <Button onClick={props.onExport} style={{marginRight: 10, verticalAlign: 'middle'}} icon="upload">
                    //         导出
                    //     </Button>
                    // </FunctionPower>
                }
                {
                    isHideHeaderButton || isHideDragButton ?
                    null
                    :
                    <Popover
                        arrowPointAtCenter
                        getPopupContainer={getPopupContainer} 
                        placement="bottomRight" 
                        title={'勾选显示，拖拽排序'} 
                        content={
                            <DragView filterSortItems={props.filterSortItems} onChangeCheckbox={props.onChangeShowColumn} moveCard={props.moveColumn} cards={props.columns} />
                        } 
                        trigger="click">
                            <Button title={'列排序'} style={{marginRight: 0, verticalAlign: 'middle', borderRadius: 0}} icon="bars" >
                        </Button>
                    </Popover>
                }
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
@inject('rApi', 'mobxBaseData')
@observer
class TableView extends Component {

    static propTypes = {
        style: PropTypes.object, //样式
        isForceKey: PropTypes.bool, // 是否在无id的项中强制加入index字段
        onExport: PropTypes.func, // 导出
        onRowClick: PropTypes.func, // 行点击事件
        columns: PropTypes.array.isRequired, // table columns 参照antd3.0以后table组件
        isNoneSelected: PropTypes.bool, // 是否不需要显示check列
        isNoneNum: PropTypes.bool, // 是否不需要显示序号列
        isNonePagination: PropTypes.bool, //是否不需要显示分页
        actionView: PropTypes.func, // 定制action view函数 , 函数
        actionWidth: PropTypes.number, // action列宽度, 必须填整数（最小为90）
        selectedPropsRowKeys: PropTypes.array, // 设置选中项的数组，以id为标识
        getCheckboxProps: PropTypes.func, // 设置table行checkbox点击状态 return {disabled: bool}
        isPreventActionEvent: PropTypes.bool, // 是否阻止actionview点击事件冒泡
        isNoneAction:  PropTypes.bool, // 是否不需要显示操作栏
        tableHeight: PropTypes.number, // 表格高度
        columnKey: PropTypes.string, //列定义key值
        filterSortItems: PropTypes.array, //过滤列排序项，传入columns中的dataIndex
        isNoneScroll: PropTypes.bool, //是否不需要滚动
        noPadding: PropTypes.bool, // 是否取消公共样式默认padding
        noTitlebar: PropTypes.bool, //是否没有顶部栏
        onAdd: PropTypes.func, //表格顶部新建按钮click事件
        batchDel: PropTypes.func, // 表格顶部删除按钮 确认click事件
        onEditItem: PropTypes.func, //表格操作编辑 click事件 (record, index) => {} record:行数据, index: 行索引
        onSaveAddNewData: PropTypes.func, //表格操作编辑保存 click事件 (record, index) => {} record:行数据, index: 行索引
        onDeleteItem: PropTypes.func, //表格操作删除确认 click事件 (record, index) => {} record:行数据, index: 行索引
        modalName: PropTypes.string, // 新建编辑按钮默认打开的弹窗指针名
        isCustomPagination: PropTypes.bool, //是否自定义分页显示
        handleTableChange: PropTypes.func, //表格改变触发
        isShowActionDel: PropTypes.bool, //是否显示action删除
    }

    static defaultProps = {
        actionAuth: [],
        loading: false,
        actionView: null,
        columns: [],
        isNoneSelected: false,
        isNoneNum: false,
        isNonePagination: false,
        isPreventActionEvent: false,
        columnKey: 'columns',
        isNoneScroll: false,
        style: null,
        noPadding: false,
        noTitlebar: false,
        modalName: 'addoredit',
        isShowActionDel: true
    }
    
    state = {
        selectedRowKeys: {},
        dataSource: [],
        limit: 10,
        pagination: { position: 'bottom', pageSize: 10, current: 1, showSizeChanger: true }
    }

    originCol = null

    constructor(props) {
        super(props)
        const { getThis } = props
        this.parent = props.parent
        if (this.parent) {
            this.parent.tableView = this
        }
       
        if (getThis) {
            getThis(this)
        }
    }

    componentDidMount() {
        this.initData()
    }

    initData = () => {
        let { dataSource } = this.state
        if (dataSource.length < 1) {
            this.getData()
        }
    }

    handleTableChange = (pagination, filters, sorter) => {
        // console.log('handleTableChange', pagination, filters, sorter)
        // const { handleTableChange } = this.props
        let pager = { ...this.state.pagination }
        pager.current = pagination.current
        // if (handleTableChange && (filters || sorter)) {
        //     handleTableChange(filters, sorter, this.getData)
        //     return
        // }
        this.setState({
          pagination: pager
        }, () => {
            this.getData(() => {}, filters)
        })
    }

    clearDataSouce = () => {
        this.setState({dataSource: []}, () => {
            // console.log('clearDataSouce', this.state.dataSource)
            // callback()
        })
    }

    updateDataTableSource = (data, callback) => {
        //console.log('updateDataTableSource', data)
        this.setState({
            dataSource: data
        }, callback)
    }

    getTableSource = () => {
        return this.state.dataSource
    }

    getData = (callback, filters) => {
        let { getData, params, noLoading } = this.props
        const pager = { ...this.state.pagination }
        params = params || {}
        // 过滤项处理
        if (filters) {
            let newFilters = {}
            for (let key of Object.keys(filters)) {
                let newKey = `${key}Filters`
                Object.assign(newFilters, {
                    [newKey]: filters[key]
                })
            }
            params = Object.assign({}, params, { ...newFilters })
            // console.log('filters', filters, params, newFilters)
        }
        this.setState({loading: noLoading ? false : true})
        let dealParams = Object.assign({}, { limit: pager.pageSize, offset: pager.pageSize * (pager.current - 1), pageNo: pager.current }, params)
        return getData(dealParams)
            .then(async d => {
                pager.total = d.total
                pager.showTotal = total => `共 ${total} 条`
                await this.setState({
                    dataSource: d.dataSource || [], 
                    loading: false, 
                    pagination: pager
                })
                if ((typeof (callback)).toUpperCase() === 'FUNCTION') {
                    callback(this.state.dataSource)
                }
            })
            .catch(() => {
                this.setState({loading: false})
            })
    }

    clearDataSource = () => {
        this.setState({
            dataSource: [],
            pagination: {
                ...this.state.pagination,
                total: 0,
                showTotal: `共 ${0} 条`
            }
        })
    }

    updateData = (d) => {
        let { dataSource } = this.state
        dataSource = dataSource.map(value => {
            if (value.id === d.id) {
                return Object.assign({}, value, d)
            }
            return value
        })
        this.setState({dataSource: dataSource})
    } 

    refresh = () => {
        this.setState({selectedRowKeys: {}, loading: false}, () => {
            this.getData()
        })
    }

    onSearch = (callback) => {
        this.setState({selectedRowKeys: {}, pagination: {
            ...this.state.pagination,
            current: 1
        }}, () => {
            this.getData(callback)
        })
    }

    onShowSizeChange = (current, size) => {
        const pager = { ...this.state.pagination }
        pager.current = current
        pager.pageSize = size
        this.state.pagination = pager
        this.setState({pagination: pager}, () => {
            this.onSearch()
        })
    }

    getAddOrEdit = (d) => {
        this[this.props.modalName] = d
    }

    /* 表格顶部 新建按钮 onClick 事件 */
    onAdd = () => {
        const { parent, onAdd, modalName } = this.props
        if (onAdd) {
            onAdd()
        } else {
            if (parent && parent[modalName]) {
                parent[modalName].show({ edit: false })
            }
        }
    }

    /* 表格顶部 删除按钮 onClick 事件 */
    onDeletes = () => {
        let { selectedRowKeys, dataSource } = this.state
        const { batchDel } = this.props
        let d = Object.values(selectedRowKeys).map(item => {
            return item.id
        })
        if (batchDel) {
            batchDel(d)
        } else {
            this.delete(d)
        }
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
        // console.log('params', params)
        return rApi[power.DEL_DATA.apiName](params).then(() => {
            message.success('操作成功！')
            this.getData()
        }).catch(e => {
            message.error('操作失败！')
        })
    }

    /* 表格操作列默认 编辑onClick 事件 */
    onEdit = (record, index) => {
        const { modalName } = this.props
        if (this.parent && this.parent[modalName]) {
            this.parent[modalName].show({
                edit: true,
                data: record,
                index: index
            })
        }
    }

    /* 表格操作列默认 删除确认onClick 事件 */
    onDelete = (record, index) => {
        let { dataSource } = this.state
        this.delete(record).then(() => {
            dataSource.splice(index, 1)
            this.setState({ dataSource: dataSource })
        })
    }

    /* 表格操作列默认 查看onClick 事件 */
    onLook = (record, index) => {
        // todo 查看数据详情
        const { modalName } = this.props
        if (this.parent && this.parent[modalName]) {
            this.parent[modalName].show({
                edit: false,
                data: record,
                index: index
            })
        }
    }

    onExport = () => {
        // todo 导出数据
        // console.log('onExport')
        if (this.props.onExport) {
            this.props.onExport()
        }
    }

    moveColumn = (dragIndex, hoverIndex) => {
        const moveColumn = this.parent.moveColumn
        const { columnKey } = this.props
        if (moveColumn) {
            moveColumn(dragIndex, hoverIndex, columnKey)
        }
    }

    onChangeShowColumn = (checked, index) => {
        const {columnKey} = this.props
        const onChangeShowColumn = this.parent.onChangeShowColumn
        if (onChangeShowColumn) {
            onChangeShowColumn(checked, index, columnKey)
        }
    }

    onChangeSelect = (keys, selectedRows) => {
        // console.log('onChangeSelect', selectedRows, keys)
        const { onChangeSelect } = this.props
        let selectedRowKeys = this.state.selectedRowKeys
        if (selectedRows) {
            selectedRowKeys[keys.id] = keys
        } else {
            delete selectedRowKeys[keys.id]
        }
        // console.log('onChangeSelect', selectedRowKeys, selectedRows)
        if (onChangeSelect) {
            onChangeSelect(selectedRowKeys, {
                deleteKeys: selectedRows ? [] : [keys],
                addKeys: selectedRows ? [keys] : [],
            })
        }
        this.setState({selectedRowKeys: selectedRowKeys})
    }

    onSelectAll = (selected, selectedRows, changeRows) => {
        // console.log('onSelectAll', selected, selectedRows, changeRows)
        const { onChangeSelect } = this.props
        let selectedRowKeys = []
        if (selected) {
            selectedRows.forEach(ele => {
                selectedRowKeys[ele.id] = ele
            })
        }
        if (onChangeSelect) {
            onChangeSelect(selectedRowKeys, {
                deleteKeys: selected ? [] : changeRows,
                addKeys: selected ? changeRows : [],
            })
        }
        this.setState({selectedRowKeys: selectedRowKeys})
    }

    getSelectKeys = ({selectedPropsRowKeys, selectedRowKeys}) => {
        const { getSelectKeys } = this.props
        // console.log('getSelectKeys', getSelectKeys)
        if (getSelectKeys) {
            return getSelectKeys({selectedPropsRowKeys, selectedRowKeys})
        }
        return selectedPropsRowKeys ?
        selectedPropsRowKeys.map(item => {
            return item.id
        })
        :
        Object.values(selectedRowKeys).map(item => {
            return item.id
        })
    }

    calColumnsWidth = (columns) => {
        const { mobxBaseData } = this.props
        // this.state = {}
        let assignedWidth = []
        columns.map(item => {
            if (item.width && item.width !== 'auto') {
                assignedWidth.push(item.width) 
            }
            return item
        })
        let width = 1100
        
        if (assignedWidth.length > 0) {
            width -= assignedWidth.reduce((pre, curr) => pre + curr)
        }
        let length = columns.length - assignedWidth.length
        if ((width / length) < 60) {
            width = 150
        }
        assignedWidth = []
        columns = columns.map(item => {
            let w = item.width
            if (!item.width || item.width === 'auto' && !item.fixed) {
                if (item.minWidth && (item.minWidth > width / length || item.minWidth > width)) {
                    w = item.minWidth
                } else {
                    w = width / length
                }
            }
            assignedWidth.push(w)
            return {
                ...item,
                width: w
            }
        })
        if (columns[columns.length - 1].fixed) {
            if (assignedWidth.reduce((pre, curr) => pre + curr) < 1100)
            columns[columns.length - 2].width =  1100 - assignedWidth.reduce((pre, curr) => pre + curr)
        }
        return columns
    }

    handleResize = column => (e, { size, ...resetProps }) => {
        const  { parent, columnKey } = this.props
        // if (!this.originCol) {
        //     this.originCol
        // }
        if(!parent.state[columnKey]) {
            return
        }
        let nextColumns = [...parent.state[columnKey]]
        let index = null
        nextColumns.map((item, i) => {
            if (item.dataIndex === column.dataIndex) {
                index = i
            }
        })
        if (typeof index === 'number') {
            // console.log('resetProps', resetProps, this.originCol[index], nextColumns[index])
            let filter = this.originCol.filter(item => item.key === nextColumns[index].key)
            if (nextColumns[index].key && filter && filter.length > 0 && filter[0].width && filter[0].width >  size.width) {
                nextColumns[index] = {
                    ...nextColumns[index],
                    width: filter[0].width
                }
            } else {
                nextColumns[index] = {
                    ...nextColumns[index],
                    width: size.width
                }
            }
            
        }
        parent.setState({
            [columnKey]: nextColumns
        })
        // parent.setState((parentState) => {
        //     // let nextColumns = parentState[columnKey]
        //     // if (columnKey === 'columns') {
        //     //     nextColumns = [...parentState[columnKey]]
        //     // }
            
        //     //console.log('handleResize', index, size, nextColumns)
        //     return { columns: nextColumns }
        // })
    }

    components = {
        header: {
          cell: (props) => ResizeableTitle({originCol: this.originCol, ...props}),
        }
    }

    render() { 
        const { 
            isForceKey,
            isNoneSelected,
            actionView, // 定制action view函数
            actionWidth, // actionView 宽度
            fixed, 
            columns, 
            power, 
            onSaveAddNewData, 
            onSaveDeleteNewData, 
            onDeleteItem, 
            onEditItem,
            isNoneAction,
            isNonePagination,
            isNoneNum,
            style,
            scroll,
            selectedPropsRowKeys, // 设置选中项的数组，以id为标识
            getCheckboxProps,
            rowKey,
            onRowClick, // 行点击
            isPreventActionEvent,
            getPopupContainer,
            calaCellWidth,
            tableHeight,
            tableWidth,
            isNoneScroll,
            noPadding,
            noTitlebar,
            isCustomPagination,
            isShowActionDel
        } = this.props
        const { dataSource, loading } = this.state
        let { selectedRowKeys } = this.state
        let cols = columns.filter(ele => {
            return !ele.isNoDisplay
        })
        
        const rowSelection = {
            fixed: true,
            selectedRowKeys: this.getSelectKeys({
                selectedPropsRowKeys,
                selectedRowKeys
            }),
            onSelectAll: this.onSelectAll,
            onSelect: this.onChangeSelect,
            getCheckboxProps: record => {
                if (getCheckboxProps) {
                    return getCheckboxProps(record)
                }
                return {
                    disabled: false
                }
            }
        }
        let THeader = this.props.THeader || TableHeader
        if (isArray(cols) && cols.length > 0 && !calaCellWidth) {
            for (let i = cols.length - 1; i > 0 ; i--) {
                if (cols[i].width && !('fixed' in cols[i])) {
                    cols[i] = {...cols[i]}
                    delete cols[i].width
                    break
                }
                if (!('fixed' in cols[i]) && !cols[i].width) {
                    break
                }
            }
        }
        cols = TablePlugin.addAll({
            isNoneAction,
            isNoneNum,
            actionView: actionView,
            columns: cols,
            that: this,
            power: power,
            actionWidth: actionWidth,
            fixed: fixed || null,
            onSaveAddNewData: onSaveAddNewData,
            onSaveDeleteNewData: onSaveDeleteNewData,
            onDeleteItem: onDeleteItem,
            onEditItem: onEditItem,
            isPreventActionEvent: isPreventActionEvent,
            isShowActionDel
        })
        // if (calaCellWidth) {
        //     cols = this.calColumnsWidth(cols)
        // }
        const allWidth = cols.reduce((pre, curr) => { /* 表格所有列宽度 */
            if (typeof curr.width === 'number') {
                return {width: pre.width + curr.width}
            } else if (typeof curr.minWidth === 'number') {
                return {width: pre.width + curr.minWidth}
            } else {
                return {width: pre.width + 100}
            }
        }).width
        if (!this.originCol) {
            this.originCol = cols.map(item => ({ ...item }))
        }
        // console.log('tableview_template render')
        return (
            <div 
                style={{...(noPadding ? { padding: 0 } : {}), ...style}} 
                className={this.props.className && `tableview-box ${this.props.className}` || 'tableview-box'}>
                <Table 
                    defaultExpandAllRows
                    bordered={(this.props.bordered === false) ? false : true}
                    size={this.props.size ? this.props.size : 'default'}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: () => {
                                if(onRowClick) {
                                    onRowClick(record, rowIndex)
                                }
                            } // 点击行
                        }
                    }}
                    title={
                        noTitlebar ? null : this.props.THeader ?
                        () => THeader
                        :
                        () => 
                        <THeader 
                            {...this.props}
                            getPopupContainer={getPopupContainer}
                            onExport={this.onExport} 
                            onDeletes={this.onDeletes} 
                            power={power} 
                            columns={columns} 
                            onAdd={this.onAdd} 
                            onChangeShowColumn={this.onChangeShowColumn} 
                            moveColumn={this.moveColumn} 
                        />
                    }
                    scroll={isNoneScroll && {x: false, y: false} || ('scroll' in this.props && scroll || {y: tableHeight ? tableHeight + 20 : false, x: allWidth + ((tableWidth || tableWidth === 0) ? tableWidth : 350)})}
                    rowKey={(record, index) => {
                        if (rowKey) {
                            return rowKey(record, index)
                        }
                        // console.log('rowKey', record.id || (isForceKey ? `index${index}`: index))
                        return record.id || (isForceKey ? `index${index}`: index)
                    }}
                    dataSource={dataSource}
                    columns={
                        cols.map((col, index) => ({
                            ...col,
                            onHeaderCell: column => ({
                            width: column.width,
                            onResize: this.handleResize(column),
                            }),
                        }))
                    }
                    components={this.components}
                    loading={loading}
                    rowSelection={isNoneSelected ? null : rowSelection}
                    onChange={this.handleTableChange}
                    expandedRowRender={this.props.expandedRowRender}
                    pagination={
                        isNonePagination || isCustomPagination ?
                        false
                        :
                            'pagination' in this.props ? this.props.pagination :
                            {
                                ...this.state.pagination, 
                                onShowSizeChange: this.onShowSizeChange
                            }
                    }
                />
                <div>
                    {
                        isCustomPagination && !isNonePagination &&
                        <Pagination
                            className={'tb-custom-pagination'}
                            onChange={(page, pageSize) => this.handleTableChange({
                                ...this.state.pagination,
                                current: page
                            })}
                            onShowSizeChange={this.onShowSizeChange}
                            {...this.state.pagination} />
                    }
                </div>
            </div>
        )
    }
}
 
export default TableView;