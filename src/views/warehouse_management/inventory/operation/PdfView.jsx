import React from 'react'
import { observer } from "mobx-react"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Row, Col } from '@src/components/grid'
import { Table, Parent, ColumnItemBox } from '@src/components/table_template'
import moment from'moment'

const renderCell = (t, row, rowIndex, colName) => {
    let name = t
    if (colName === 'checkResult') {
        name = (row.status === 1 || row.status === 3) ? '未盘' : t === 1 ? '正常' : t === 2 ? '数据异常' : t === 3 ? '货损异常' : '-'
    }
    return (
        <ColumnItemBox name={name} />
    )
}

const colFun = (weightUnit) => [
    {
        className: 'text-overflow-ellipsis',
        title: '储位',
        dataIndex: 'warehouseStorageNumber',
        key: 'warehouseStorageNumber',
        width: 100,
        render: (t, r, index) => {
            return renderCell(t, r, index, 'warehouseStorageNumber')
        }
    },
    {
        className: 'text-overflow-ellipsis',
        title: '板号',
        dataIndex: 'boardNumber',
        key: 'boardNumber',
        width: 120,
        render: (t, r, index) => {
            return renderCell(t, r, index, 'boardNumber')
        }
    },
    {
        className: 'text-overflow-ellipsis',
        title: '料号',
        dataIndex: 'materialNumber',
        key: 'materialNumber',
        width: 120,
        render: (t, r, index) => {
            return renderCell(t, r, index, 'materialNumber')
        }
    },
    {
        className: 'text-overflow-ellipsis',
        title: '箱数',
        dataIndex: 'boxCount',
        key: 'boxCount',
        width: 90,
        render: (t, r, index) => {
            return renderCell(t, r, index, 'boxCount')
        }
    },
    {
        className: 'text-overflow-ellipsis',
        title: '数量',
        dataIndex: 'quantityCount',
        key: 'quantityCount',
        width: 90,
        render: (t, r, index) => {
            return renderCell(t, r, index, 'quantityCount')
        }
    },
    {
        className: 'text-overflow-ellipsis',
        title: `重量(${weightUnit || 'kg'})`,
        dataIndex: 'grossWeight',
        key: 'grossWeight',
        width: 90,
        render: (t, r, index) => {
            return renderCell(t, r, index, 'grossWeight')
        }
    },
    {
        className: 'text-overflow-ellipsis',
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        width: 100,
        render: (t, r, index) => {
            return renderCell(t, r, index, 'unit')
        }
    },
    {
        className: 'text-overflow-ellipsis',
        title: '盘点结果',
        dataIndex: 'checkResult',
        key: 'checkResult',
        width: 100,
        render: (t, r, index) => {
            return renderCell(t, r, index, 'checkResult')
        }
    }
]

@observer
export default class PdfView extends Parent {
    constructor (props) {
        super (props)
        this.state = {
            columns: colFun(props.weightUnit)
        }
        if (props.getThis) {
            props.getThis(this)
        }
    }

    getData = async (params) => {
        const { operationList } = this.props
        return new Promise((resolve, reject) => {
            resolve({
                dataSource: [...operationList],
                total: operationList.length
            })
        })
    }

    async exportPDF () {
        try {
            this.searchCriteria(async () => {
                let html2Canv = await html2canvas(this.rootDom, {
                    // width: 2000,
                    // height: 1000
                })
                let pdf = new jsPDF('', 'pt', 'a4')

                let contentWidth = html2Canv.width
                let contentHeight = html2Canv.height
                //一页pdf显示html页面生成的canvas高度;
                let pageHeight = contentWidth / 592.28 * 841.89
                //未生成pdf的html页面高度
                let leftHeight = contentHeight
                //页面偏移
                let position = 0
                //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                let imgWidth = 595.28
                let imgHeight = 592.28 / contentWidth * contentHeight
                let pageData = html2Canv.toDataURL('image/jpeg', 1.0)

                if (leftHeight < pageHeight) {
                    pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
                } else {
                    while (leftHeight > 0) {
                        pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                        leftHeight -= pageHeight
                        position -= 841.89
                        //避免添加空白页
                        if (leftHeight > 0) {
                            pdf.addPage()
                        }
                    }
                }
                pdf.save('盘点单.pdf')
            })
        } catch (error) {
            console.log('html2canvas获取失败')
            return false
        }
    }

    render () {
        const rowStyle = { minHeight: 36, color: '#000' }
        const { curRow, weightUnit } = this.props
        let columns = colFun(weightUnit)
        return (
            <div
                className='inventory-pdfview'
                ref={v => this.rootDom = v}
            >
                <div className='head-info'>
                    <h2>{moment(new Date().now).format('YYYY-MM-DD')}&emsp;盘点表</h2>
                </div>
                <Row style={rowStyle}>
                    <Col label='盘点单号' span={7}>
                        {curRow.checkNumber}
                    </Col>
                    <Col label='仓&emsp;库' span={7}>
                        {curRow.warehouseName || ''}
                    </Col>
                    <Col label='&emsp;复盘人' span={7}>
                        
                    </Col>
                </Row>
                <Row style={rowStyle}>
                    <Col label='&emsp;客&emsp;户' span={7}>
                        {curRow.clientName}
                    </Col>
                    <Col label='建单人' span={7}>
                    
                    </Col>
                    <Col label='盘点时间' span={7}>
                        {moment(new Date().now).format('YYYY-MM-DD')}
                    </Col>
                </Row>
                <Table
                    noPadding
                    parent={this}
                    title={null}
                    isHideHeaderButton
                    isNonePagination
                    isNoneAction
                    isNoneSelected
                    isNoneScroll
                    parent={this}
                    getData={this.getData}
                    columns={columns}
                    tableWidth={140}
                />
                <div className='foot-info'>
                    <Row style={rowStyle}>
                        <Col label='打印人' span={7}>
                        </Col>
                        <Col span={7}>
                        </Col>
                        <Col label='打印时间' span={7}>
                            {moment(new Date().now).format('YYYY-MM-DD')}
                        </Col>
                    </Row>
                </div>
            </div> 
        )
    }
}