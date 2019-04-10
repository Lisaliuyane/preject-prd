import React from 'react'
import { observer } from "mobx-react"
import JsBarcode from 'jsbarcode'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Row, Col } from '@src/components/grid'
import { Table, Parent, ColumnItemBox } from '@src/components/table_template'
import moment from'moment'

@observer
export default class PdfView extends Parent {
    constructor (props) {
        super (props)
        this.state = {
            columns: [
                {
                    className: 'text-overflow-ellipsis',
                    title: '板号',
                    dataIndex: 'boardNumber',
                    key: 'boardNumber',
                    width: 110,
                    render: (t, r, index) => {
                        return this.renderCell(t, r, index, 'boardNumber')
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '料号',
                    dataIndex: 'materialNumber',
                    key: 'materialNumber',
                    width: 90,
                    render: (t, r, index) => {
                        return this.renderCell(t, r, index, 'materialNumber')
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '品名',
                    dataIndex: 'materialName',
                    key: 'materialName',
                    width: 90,
                    render: (t, r, index) => {
                        return this.renderCell(t, r, index, 'materialName')
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '规格型号',
                    dataIndex: 'materialSpecifications',
                    key: 'materialSpecifications',
                    width: 90,
                    render: (t, r, index) => {
                        return this.renderCell(t, r, index, 'materialSpecifications')
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '数量',
                    dataIndex: 'quantityCount',
                    key: 'quantityCount',
                    width: 100,
                    render: (t, r, index) => {
                        return this.renderCell(t, r, index, 'quantityCount')
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '单位',
                    dataIndex: 'unit',
                    key: 'unit',
                    width: 90,
                    render: (t, r, index) => {
                        return this.renderCell(t, r, index, 'unit')
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '箱数',
                    dataIndex: 'boxCount',
                    key: 'boxCount',
                    width: 90,
                    render: (t, r, index) => {
                        return this.renderCell(t, r, index, 'boxCount')
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '毛重',
                    dataIndex: 'grossWeight',
                    key: 'grossWeight',
                    width: 90,
                    render: (t, r, index) => {
                        return this.renderCell(t, r, index, 'grossWeight')
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '体积',
                    dataIndex: 'volume',
                    key: 'volume',
                    width: 90,
                    render: (t, r, index) => {
                        return this.renderCell(t, r, index, 'volume')
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '储位',
                    dataIndex: 'warehouseStorageNumber',
                    key: 'warehouseStorageNumber',
                    width: 100,
                    render: (t, r, index) => {
                        return this.renderCell(t, r, index, 'warehouseStorageNumber')
                    }
                }
            ]
        }
        if (props.getThis) {
            props.getThis(this)
        }
    }

    componentDidMount () {
        const { singleNumber } = this.props.curRow
        this.generateBarcode(singleNumber).generateQRCode(singleNumber)
    }

    generateBarcode(singleNumber) {
        JsBarcode(this.barcode, singleNumber, {
            format: "CODE128",//选择要使用的条形码类型
            width: 3,//设置条之间的宽度
            height: 40,//高度
            displayValue: false,//是否在条形码下方显示文字
            fontOptions: "bold italic",//使文字加粗体或变斜体
            font: "fantasy",//设置文本的字体
            // textAlign: "left",//设置文本的水平对齐方式
            // textPosition: "top",//设置文本的垂直位置
            // textMargin: 5,//设置条形码和文本之间的间距
            // fontSize: 15,//设置文本的大小
            margin: 0//设置条形码周围的空白边距
        })
        return this
    }
    generateQRCode(singleNumber) {
        //生成的二维码内容，可以添加变量
        QRCode.toCanvas(this.qrcode, singleNumber, {
            width: 120,
            height: 120
        }, (error) => {
            if (error) {
                console.error(error)
            }
        })
    }

    renderCell = (t, row, rowIndex, colName) => {
        let name = t
        return (
            <ColumnItemBox name={name} />
        )
    }

    getData = async (params) => {
        const { parent } = this.props
        return new Promise((resolve, reject) => {
            let list = parent.gd()
            resolve({
                dataSource: list,
                total: list.length
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
                pdf.save('入库签收单.pdf')
            })
        } catch (error) {
            console.log('html2canvas获取失败')
            return false
        }
    }

    render () {
        const rowStyle = { minHeight: 36, color: '#000' }
        const { columns } = this.state
        const { curRow } = this.props
        return (
            <div
                className='pdfview'
                ref={v => this.rootDom = v}
            >
                <div className='head-info'>
                    <div className='leftarea'></div>
                    <div className='content'>
                        <h2>贵州建桥投资发展有限公司</h2>
                        <p>入库签收单</p>
                        <img ref={v => this.barcode = v} src="" alt=""/>
                    </div>
                    <div className='ewm'>
                        <canvas ref={v => this.qrcode = v}></canvas>
                    </div>
                </div>
                <Row style={rowStyle}>
                    <Col label='仓库名称' span={7}>
                        {curRow.name}
                    </Col>
                    <Col label='&emsp;客户名称' span={7}>
                        {curRow.clientName || ''}
                    </Col>
                    <Col label='司机/电话' span={7}>
                        {curRow.phone || ''}
                    </Col>
                </Row>
                <Row style={rowStyle}>
                    <Col label='入库单号' span={7}>
                        {curRow.singleNumber}
                    </Col>
                    <Col label='送货车牌号' span={7}>
                        {curRow.carCode || ''}
                    </Col>
                    <Col label='入库时间' span={7}>
                        {curRow.expectedTime ? moment(curRow.expectedTime).format('YYYY-MM-DD') : ''}
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
                    <p>实物验收货损差或其他记录：</p>
                    <div className='textarea'></div>
                    <p>声明</p>
                    <p>1.本签收单一式二份，仓库留存一份，交送货人一份。</p>
                    <Row style={rowStyle}>
                        <Col label='收货人(签字)' span={10}>
                        </Col>
                        <Col label='送货人(签字)' span={10}>
                        </Col>
                    </Row>
                    <Row style={rowStyle}>
                        <Col label='&emsp;&emsp;&emsp;&emsp;日期' span={10}>
                        </Col>
                        <Col label='&emsp;&emsp;&emsp;&emsp;日期' span={10}>
                        </Col>
                    </Row>
                    <Row style={rowStyle}>
                        <Col span={7}>
                        </Col>
                        <Col label='打印时间' span={7}>
                            {moment(new Date().now).format('YYYY-MM-DD HH:mm')}
                        </Col>
                        <Col label='制单人' span={7}>
                        </Col>
                    </Row>
                </div>
            </div> 
        )
    }
}