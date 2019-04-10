import React, { Component } from 'react'
import { Table  } from 'antd'
import Title from './title'

class TableView extends Component {

    state = {
        data: [
            {
                name: '华南'
            }
        ]
    }

    render() { 
        const columns = [
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                render: (text, record, index) => {
                    return (
                        <div title={record.name} className='text-overflow-ellipsis' style={{maxWidth: 200}}>
                            {record.name}
                        </div>
                    )
                }
            },
            // { 
            //     className: 'table-action',
            //     width: 140,
            //     title: '操作',
            //     key: 'operation',
            //     render: (text, record, index) => {
            //         const onConfirm = () => {}
            //         const onCancel = () => {}
            //         return (
            //             <div className='table-action-box'>
            //                 <Button title='编辑' shape="circle" icon="edit" size='small' />
            //                 <Popconfirm 
            //                     title="确定要删除此项?"
            //                     onConfirm={onConfirm}
            //                     onCancel={onCancel}
            //                     okText="确定"
            //                     cancelText="取消">
            //                         <Button title='删除'  shape="circle" icon="delete" size='small' />
            //                 </Popconfirm>
            //             </div>
            //         )
            //     }
            // }
        ];
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };
        let { name, dataSource } = this.props
        
        return (
            <div>
                <Table
                    rowSelection = {rowSelection}
                    title={() => <Title name={name} />}
                    pagination={false}
                    columns={columns}
                    dataSource={dataSource}
                />
            </div>
        )
    }
}
 
export default TableView;