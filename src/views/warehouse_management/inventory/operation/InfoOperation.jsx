import React from 'react'
import { inject } from "mobx-react"
import { Upload, Button, message } from 'antd'
import { Row, Col } from '@src/components/grid'
import { imgClient, random_string, get_suffix } from '@src/utils'
import moment from 'moment'

// 盘点管理
@inject('rApi')
export default class InfoOperation extends React.Component {
    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        this.state = {
            uploadLoading: false,
            fileList: []
        }
    }

    beforeUpload = (file, fileList) => {
        const maxSize = file.size / 1024 / 1024 < 50
        if (!maxSize) {
            message.error('图片必须小于50MB!')
        }
        if (!maxSize) {
            this.isUploadFileTypeError = !maxSize
            return maxSize
        }
        return false
    }

    onRemove = (file) => { //删除文件
        this.setState({
            fileList: []
        })
        return true
    }

    onChange = async ({ file, fileList }) => {
        const { curRow, rApi, uploadCallback } = this.props
        this.setState({
            fileList: [file],
            uploadLoading: true
        })
        let uuid = random_string()
        let s = get_suffix(fileList[0].name)
        let filePath = `${moment(new Date()).format('YYYY-MM-DD')}/${uuid}${s}`
        try {
            let obj = await imgClient().put(filePath, file)
            await rApi.uploadCheckFile({
                id: curRow.id,
                filePath: filePath,
                fileName: file.name
            })
            let newRow = {
                ...curRow,
                filePath: filePath,
                fileName: file.name
            }
            uploadCallback(newRow)
            message.success('操作成功')
            this.setState({ uploadLoading: false })
        } catch (error) {
            message.error(error.msg || '操作失败')
            this.setState({ uploadLoading: false })
            return false
        }
    }

    onPreview = file => {
        console.log('f', file)
    }

    render() {
        const { curRow } = this.props
        if (!curRow) return null
        const rowStyle = { height: 30 }
        const textStyle = { color: '#444', marginLeft: 20 }
        const { fileList, uploadLoading } = this.state
        return (
            <div className={this.props.className}>
                <div style={{ height: 36, fontSize: 14, color: curRow.color, lineHeight: '36px' }}>
                    <span style={{ marginRight: 6 }}>盘点单号</span><span>{curRow.checkNumber}</span>
                </div>
                <Row style={rowStyle}>
                    <Col label='客户名称' span={6}>
                        <span style={textStyle}>{curRow.clientName}</span>
                    </Col>
                    <Col label='客户料号' span={6}>
                        <span style={textStyle}>{curRow.materialNumber}</span>
                    </Col>
                    <Col label='盘点仓库' span={6}>
                        <span style={textStyle}>{curRow.warehouseName}</span>
                    </Col>
                    <Col span={6} />
                </Row>
                <Row style={rowStyle}>
                    <Col label='盘点方式' span={6}>
                        <span style={textStyle}>{curRow.checkTypeName}</span>
                    </Col>
                    <Col label='收货时间' span={6}>
                        <span style={textStyle}>{curRow.deliveryTime ? moment(curRow.deliveryTime).format('YYYY-MM-DD') : '-'}</span>
                    </Col>
                    <Col span={6}>
                        <div className='upload-area'>
                            <Upload
                                // accept='doc,docx,xls,xlsx,csv,ppt,pptx,pdf,zip'
                                fileList={fileList}
                                name='file'
                                headers={{ authorization: 'authorization-text' }}
                                onChange={this.onChange}
                                beforeUpload={this.beforeUpload}
                                onRemove={this.onRemove}
                                showUploadList={{ showPreviewIcon: false, showRemoveIcon: false }}
                                onPreview={this.onPreview}
                            >
                                <Button
                                    icon='upload'
                                    size="small"
                                    style={{ borderRadius: 4, fontSize: '12px', lineHeight: '24px' }}
                                    loading={uploadLoading}
                                    disabled={!curRow || !curRow.id}
                                >
                                    上传附件
                                </Button>
                            </Upload>
                        </div>
                    </Col>
                    <Col span={6} />
                </Row>
            </div>
        )
    }
}