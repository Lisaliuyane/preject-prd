import React from 'react'
import { GetLodop } from '@src/libs/print'
import QRCode from 'qrcode'
import JsBarcode from 'jsbarcode'
import { cloneObject } from '@src/utils'

export default class PrintView extends React.Component {
    constructor (props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        this.state = {
            targetContent: {},
            pic: ''
        }
    }

    componentDidMount () {
        GetLodop().then(LODOP => {
            // console.log('LODOP', LODOP)
            this.lodop = LODOP
        }).catch(err => {
            console.log('打印机连接失败', err)
            this.lodop = null
        })
    }

    print (targetList) {
        let list = cloneObject(targetList)
        if (list && list.length) {
            this.doPrint(list)
        }
    }

    async doPrint (list) {
        await this.setState({ targetContent: list[0] })
        QRCode.toDataURL(this.state.targetContent.boardNumber, {
            width: 70,
            height: 70
        }, async (error, url) => {
            if (error) {
                console.error(error)
                return false
            }
            this.generateBarcode(this.state.targetContent.boardNumber)
            if (this.lodop) {
                await this.setState({ pic: url })
                let htmlContent = this.printView.innerHTML
                this.lodop.PRINT_INIT("打印标签")
                this.lodop.SET_PRINT_PAGESIZE(2, 380, 590, 0)
                this.lodop.ADD_PRINT_HTM(2, 6, "100%", "100%", htmlContent)
                // this.lodop.SET_PRINT_STYLEA(0, "AngleOfPageInside", 90)
                // this.lodop.PREVIEW()
                this.lodop.PRINT()
                list.shift()
                if (list.length > 0) {
                    this.doPrint(list)
                }
            } else {
                console.log('获取打印机失败')
            }
        })
    }

    generateBarcode(boardNumber) {
        JsBarcode(this.barcode, boardNumber, {
            format: "CODE128",//选择要使用的条形码类型
            width: 2,//设置条之间的宽度
            height: 50,//高度
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

    render () {
        const { targetContent, pic } = this.state
        const { curRow } = this.props
        const pStyle = { lineHeight: '20px', fontSize: '12px', height: '20px', margin: 0}
        return (
            <div ref={v => this.printView = v} style={{ display: 'none', padding: '0 5px' }}>
                <div style={{ border: '1px solid #333', width: '100%', height: '100%', boxSizing: 'border-box' }}>
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <img ref={v => this.barcode = v} src="" alt="" style={{width: '80%'}}/>
                    </div>
                    <div style={{ marginTop: '5px', height: 60 }}>
                        <img style={{ width: 70, height: 70, float: 'left', marginRight: 5 }} src={pic} />
                        <p style={pStyle}>
                            {targetContent.boardNumber}
                        </p>
                        <p style={pStyle}>
                            &emsp;&emsp;&emsp;&emsp;客户:<span style={{marginLeft: '5px'}}>{curRow.clientName}</span>
                        </p>
                        <p style={pStyle}>
                            入仓单号:<span style={{marginLeft: '5px'}}>{curRow.singleNumber}</span>
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}