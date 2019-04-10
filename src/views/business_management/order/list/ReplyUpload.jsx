import React from 'react'
import CusModal from '@src/components/modular_window'
import { inject } from "mobx-react"
import { Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { Button, Form, Input, message, Upload, Popconfirm, Modal } from 'antd'
import { Row, Col } from '@src/components/grid'
import moment from 'moment'
import { imgClient, random_string, get_suffix } from '@src/utils'
import FormItem from '@src/components/FormItem'

// 文件列表列
const colFun = (props = {}) => {
    const { _ } = props
    const rendCol = (t, r, index, key) => {
        let name = t
        if (key === 'createTime') {
            name = moment(t).format('YYYY-MM-DD')
        }
        return <ColumnItemBox active={r.isActive} style={{ lineHeight: '40px' }} name={name} />
    }
    return [
        {
            className: 'text-overflow-ellipsis col-preview',
            title: '预览',
            dataIndex: 'filePath',
            key: 'filePath',
            width: 90,
            render: (t, r, index) => (
                <ColumnItemBox active={r.isActive} pStyle={{ position: 'relative', margin: '-10px', width: 'auto', fontSize: 0 }}>
                    <img className='pic' onClick={e => {
                        e.stopPropagation()
                        _.previewPic(r, index)
                    }} src={t} />
                </ColumnItemBox>
            )
        },
        {
            className: 'text-overflow-ellipsis',
            title: '回单名称',
            dataIndex: 'receiptName',
            key: 'receiptName',
            width: 100,
            render: (t, r, index) => rendCol(t, r, index, 'receiptName')
        },
        {
            className: 'text-overflow-ellipsis',
            title: '回单人',
            dataIndex: 'createUser',
            key: 'createUser',
            width: 100,
            render: (t, r, index) => rendCol(t, r, index, 'createUser')
        },
        {
            className: 'text-overflow-ellipsis',
            title: '上传时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 100,
            render: (t, r, index) => rendCol(t, r, index, 'createTime')
        },
        {
            className: 'text-overflow-ellipsis',
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            width: 80,
            render: (t, r, index) => rendCol(t, r, index, 'remark')
        }
    ]
}

@inject('rApi')
class ReplyUpload extends Parent {
    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        this.state = {
            open: false,
            title: '回单上传',
            source: {},
            columns: colFun({ _: this }),
            uploadLoading: false,
            uploadList: [], // 上传的文件列表
            receiptName: '',
            remark: '',
            previewImage: '',
            previewVisible: false,
            curRow: {},
            showFile: {},
            reloadRow: false
        }
    }

    show(d) {
        // console.log('replyUploadShow', d.payload)
        this.setState({
            open: true,
            source: { ...d.payload }
        })
    }

    clearValue() {
        this.setState({
            source: {},
            uploadList: [],
            receiptName: '',
            remark: '',
            previewImage: '',
            previewVisible: false,
            curRow: {},
            showFile: {},
            reloadRow: false
        })
    }

    changeOpen = (open) => {
        this.setState({
            open
        })
        if (!open) {
            this.clearValue()
        }
    }

    // 获取列表数据
    getFileList = () => {
        const { rApi } = this.props
        const { id, orderType } = this.state.source
        return new Promise((resolve, reject) => {
            rApi.getOrderReply({ id, orderType })
                .then(res => {
                    let list = [...res]
                    list = this.dealList(list)
                    resolve({
                        dataSource: list,
                        total: list.length
                    })
                })
                .catch(err => {
                    resolve({
                        dataSource: [],
                        total: 0
                    })
                })
        })
    }
    dealList = arr => arr.map(item => ({
        ...item,
        isActive: false
    }))

    // 行点击
    onRowClick = (r, index) => {
        let { curRow } = this.state
        if (curRow.id === r.id) return
        let list = this.gd()
        list = list.map((item, i) => ({
            ...item,
            isActive: index === i
        }))
        this.upd(list)
        let showFile = {
            name: r.fileName,
            path: r.filePath
        }
        this.setState({
            curRow: r,
            receiptName: r.receiptName,
            remark: r.remark,
            showFile,
            uploadList: [],
            reloadRow: true
        }, () => {
            this.setState({reloadRow: false})
        })
    }

    // 预览图片
    previewPic = (r, rIndex) => {
        let imgSrc = r.filePath
        this.setState({
            previewVisible: true,
            previewImage: imgSrc
        })
    }
    // 取消预览
    previewCancel = () => {
        this.setState({ previewVisible:false })
    }

    /* 上传图片 start */
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

    // 上传中、完成、失败都会调用这个函数。
    uploadChange = async ({ file, fileList }) => {
        let uuid = random_string()
        let s = get_suffix(file.name)
        let filePath = `${moment(new Date()).format('YYYY-MM-DD')}/${uuid}${s}`
        let res = null
        try {
            res = await imgClient().put(filePath, file)
        } catch (error) {
            message.error('上传失败，请重试')
           return false 
        }
        file.fileName = file.name
        file.filePath = filePath
        let showFile = {
            name: file.name,
            path: file.filePath
        }
        let fList = [file]
        this.setState({
            uploadList: fList,
            showFile
        })
    }
    /* 上传图片 end */

    handleErr (err, loadKey = 'loading') {
        message.error(err.msg || '操作失败')
        this.setState({ [loadKey]: false })
        return false
    }

    // 验证
    handleSubmit = (e) => {
        this.props.form.validateFields((err, val) => {
            if (!err) {
                this.upload()
            }
        })
    }

    // 上传
    upload = async () => {
        this.setState({ uploadLoading: true })
        const { rApi } = this.props
        const { source, receiptName, remark, uploadList } = this.state
        const { id, orderType } = source
        let uploadFileVo = uploadList.map(item => ({
            fileName: item.fileName,
            fileSize: item.size,
            filePath: item.filePath
        })),
        removeAttachmentIds = []
        let reqData = {
            id,
            orderType,
            receiptName,
            remark,
            uploadFileVo,
            removeAttachmentIds
        }
        try {
            await rApi.orderReplyUpload(reqData)
            message.success('操作成功')
            this.searchCriteria()
            await this.setState({
                uploadLoading: false,
                uploadList: [],
                receiptName: '',
                remark: '',
                curRow: {},
                showFile: {},
                reloadRow: true
            })
            this.setState({ reloadRow: false })
        } catch (error) {
            this.handleErr(error, 'uploadLoading')
        }
    }

    // 删除
    delReply = async () => {
        const { rApi } = this.props
        const { source, curRow } = this.state
        const { id, orderType } = source
        let removeAttachmentIds = [curRow.id]
        let reqData = {
            id,
            orderType,
            uploadFileVo: [],
            removeAttachmentIds
        }
        try {
            await rApi.orderReplyUpload(reqData)
            message.success('操作成功')
            this.searchCriteria()
            await this.setState({
                uploadList: [],
                receiptName: '',
                remark: '',
                curRow: {},
                showFile: {},
                reloadRow: true
            })
            this.setState({ reloadRow: false })
        } catch (error) {
            this.handleErr(error)
        }
    }

    render() {
        let {
            open,
            title,
            columns,
            uploadList,
            receiptName,
            remark,
            uploadLoading,
            previewVisible,
            previewImage,
            curRow,
            showFile,
            reloadRow
        } = this.state
        const { form } = this.props
        const { getFieldDecorator } = form
        const rowStyle = { minHeight: '42px' }
        return (
            <CusModal
                style={{ width: '95%', maxWidth: 860, minHeight: 350 }}
                changeOpen={this.changeOpen}
                open={open}
                title={title}
                getContentDom={v => this.popupContainer = v}
                className='modal-replyupload'
            >
                <Modal 
                    visible={previewVisible}
                    footer={null}
                    onCancel={this.previewCancel}
                    bodyStyle={{ padding: 0 }}
                >
                    <img alt="预览图片" style={{ width: '100%' }} src={previewImage} />
                </Modal>
                <div className='main-content'>
                    <div className='tb-left'>
                        <Table
                            isNoneSelected
                            isNoneNum
                            isHideHeaderButton
                            isNoneAction
                            isNonePagination
                            title={<div style={{height: '22px', lineHeight: '22px'}}>文件列表</div>}
                            parent={this}
                            getData={this.getFileList}
                            columns={columns}
                            onRowClick={this.onRowClick}
                            tableWidth={120}
                            tableHeight={300}
                        />
                    </div>
                    <Form layout='inline' className='form-right'>
                        <div className='headbar'>文件上传</div>
                        <div className='content'>
                            <Row style={rowStyle}>
                                <Col colon label='选择文件&emsp;' span={24}>
                                    <div className='upload-show'>
                                        {
                                            showFile.name && <div className='text-overflow-ellipsis txt' onClick={e => {
                                                let filePath
                                                try {
                                                    filePath = imgClient().signatureUrl(uploadList[0].filePath)
                                                } catch (error) {
                                                    filePath = showFile.path
                                                }
                                                this.previewPic({ filePath })
                                            }}>{showFile.name}</div>
                                        }
                                        <div className='btn'>
                                            <Upload
                                                accept='image/*'
                                                headers={{ authorization: 'authorization-text' }}
                                                onChange={this.uploadChange}
                                                beforeUpload={this.beforeUpload}
                                                fileList={uploadList}
                                                showUploadList={{ showPreviewIcon: false, showRemoveIcon: false }}
                                            >
                                                {
                                                    showFile.name ? <span className='action-button'>更改</span> : <Button>选择文件</Button>
                                                }
                                            </Upload>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row style={rowStyle}>
                                <Col colon label='回单名称&emsp;' span={24}>
                                    {
                                        reloadRow ? null : <FormItem>
                                                {
                                                    getFieldDecorator('receiptName', {
                                                        initialValue: receiptName,
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message: '请填写回单名称'
                                                            }
                                                        ],
                                                    })(
                                                        <Input
                                                            value={receiptName}
                                                            onChange={e => this.setState({ receiptName: e.target.value })}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                    }
                                </Col>
                            </Row>
                            <Row style={rowStyle}>
                                <Col colon label='回单人&emsp;&emsp;' span={24}>
                                    <Input
                                        disabled
                                        value={(curRow.createUser && uploadList.length < 1) ? curRow.createUser : ''}
                                    />
                                </Col>
                            </Row>
                            <Row style={rowStyle}>
                                <Col colon label='上传日期&emsp;' span={24}>
                                    <Input
                                        disabled
                                        value={(curRow.createTime && uploadList.length < 1) ? moment(curRow.createTime).format('YYYY-MM-DD') : ''}
                                    />
                                </Col>
                            </Row>
                            <Row style={rowStyle}>
                                <Col colon label='备注&emsp;&emsp;&emsp;' span={24}>
                                    <Input
                                        value={remark}
                                        onChange={e => this.setState({ remark: e.target.value })}
                                    />
                                </Col>
                            </Row>
                        </div>
                        <div className='footbar'>
                            {/* <Button icon='download' disabled={!curRow || !(curRow && curRow.id)}>下载</Button> */}
                            <Button
                                icon='upload'
                                loading={uploadLoading}
                                onClick={this.handleSubmit}
                                disabled={!uploadList || (uploadList && uploadList.length < 1)}
                            >上传</Button>
                            <Popconfirm
                                title='是否确定删除'
                                onConfirm={this.delReply}
                            >
                                <Button icon='delete' disabled={!curRow || !(curRow && curRow.id)}>删除</Button>
                            </Popconfirm>
                        </div>
                    </Form>
                </div>
            </CusModal>
        )
    }
}

export default Form.create()(ReplyUpload)