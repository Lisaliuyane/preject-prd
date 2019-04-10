import React, { Component } from 'react'
import { Popconfirm } from 'antd'
import './index.less'
class Number extends Component {
    state = {}
    render() { 
        let { index } = this.props
        return (
            <div className='table-action-box text-overflow-ellipsis'>
                {index}
            </div>
        )
    }
}

class Action extends Component {
    state = {}
    render() { 
        let { onDelete, onEdit, onLook, deltext, record } = this.props
        // console.log('record', record)
        if (deltext === '禁用') {
            if (record.status === 1) {
                deltext = '恢复'
            }
        }
        deltext = deltext || `删除`
        return (
            <div style={{userSelect: 'none',}} className='table-action-box'>
                {
                    onLook?
                    <span
                        className={`action-button`}
                        onClick={(e) => {onLook(e)}}
                    >
                        查看更多
                    </span>
                    :
                    null
                }
                <span
                        className={`action-button`}
                        onClick={(e) => {onEdit(e)}}
                    >
                    编辑
                </span>
                <Popconfirm
                    title={`确定要${deltext}此项?`}
                    onConfirm={onDelete}
                    okText="确定"
                    cancelText="取消">
                    <span
                        className={`action-button`}
                    >
                        {deltext}
                    </span>
                </Popconfirm>
            </div>
        )
    }
}
 
export const columnsAddNumber = (columns, title) => {
    let obj = [{
        width: 80,
        title: title || '序号',
        className: 'table-action',
        dataIndex: 'number',
        key: 'number',
        render: (text, record, index) => {
            return <Number index={index + 1} />
        }
    }]
    return [...obj, ...columns]
};
/**
 * 默认 操作 onDelect onEdit
 * @param {*} columns 
 * @param {*} that 
 * @param {*} title 
 */
export const columnsAddAction = (columns, that, deltext, title) => {
    let obj = [{
            title: title || '操作',
            // fixed: 'right',
            className: 'table-action',
            width: 160,
            dataIndex: 'action',
            key: 'action',
            render: (text, record, index) => {
                const onDelete= () => { that.onDelete(record, index)}
                const onEdit= () => { that.onEdit(record, index)}
                const onLook = that && that.onLook ? () => { that.onLook(record, index)} : null
                return <Action 
                deltext={deltext}
                record={record} 
                index={index} 
                onLook={onLook}
                onDelete={onDelete} 
                onEdit={onEdit} />
            }
    }]
    return [...columns, ...obj]
};
export const addAll = (columns, that, deltext) => {
    let cols = columnsAddNumber(columns)
    cols = columnsAddAction(cols, that, deltext)
    return cols
}