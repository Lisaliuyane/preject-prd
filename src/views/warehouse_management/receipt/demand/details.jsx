import React, { Component } from 'react'
import { Table, Button, Form, Icon } from 'antd'
import UploadExcel from '@src/components/upload_excel'

class Details extends Component {
    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
    }

    // 处理过滤已选择物料数据
    dealList = (arr, rIndex) => {
        let { materiaList } = this.props
        return arr.filter(item => (!materiaList.some(m => (m.materialName === item.itemName && m.materialNumber === item.code))))
    }

    // 表格自定义title
    customTitle = () => {
        const { status, addNewRow, exportDetails, getExcelData, importLoading } = this.props
        return (
            <div className="flex flex-vertical-center">
                <div>
                    <span style={{color: '#484848', fontSize: '14px'}}>货物明细</span>
                </div>
                {
                    status === 2 ?
                        null
                        :
                        <div className="flex1" style={{ textAlign: 'right' }}>
                            <UploadExcel
                                getExcelData={getExcelData}
                                loading={importLoading}
                            />
                            <Button
                                onClick={exportDetails}
                                style={{ verticalAlign: 'middle', marginRight: 10 }}
                                icon="export"
                            >
                                导出表头
                            </Button>
                            <Button onClick={addNewRow}>
                                <Icon type="plus" />新建
                            </Button>
                        </div>
                }
            </div>
        )
    }

    render() {
        const { materiaList, columns } = this.props
        console.log('materiaList',materiaList)
        console.log('columns',columns)
        return (
            <div className='err-valid-table' style={{ width: '100%', flexShrink: 0, flexGrow: 1 }}>
                <Table
                    key='details'
                    bordered
                    style={{position: 'relative'}}
                    pagination={false}
                    scroll={{x: true}}
                    title={this.customTitle}
                    dataSource={materiaList}
                    columns={columns}
                    rowKey={(row, index) => {return row.id || index}}
                />
            </div>
        )
    }

}
export default Form.create()(Details)