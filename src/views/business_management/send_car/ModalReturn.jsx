import React, { Component, Fragment } from 'react'
import { Modal, Button, Table, message, Popconfirm, Input } from 'antd'
import moment from 'moment'
import UploaderFile from '@src/components/uploader_file'

export default class ModalReturn extends Component {
    state = {
        loading: false,
        columns: [
            {
                width: 80,
                className: 'text-overflow-ellipsis col-index',
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                render: (val, r, rIndex) => {
                    return rIndex + 1
                }
            },
            {
                width: 200,
                className: 'text-overflow-ellipsis',
                title: '名称',
                dataIndex: 'fileName',
                key: 'fileName'
            },
            {
                width: 100,
                className: 'text-overflow-ellipsis',
                title: '大小',
                dataIndex: 'fileSize',
                key: 'fileSize',
                render: (val, r) => {
                    return val ? `${val}kb` : ''
                }
            },
            {
                width: 160,
                className: 'text-overflow-ellipsis',
                title: '上传时间',
                dataIndex: 'createTime',
                key: 'createTime',
                render: (val, r) => {
                    return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '-'
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                render: (val, r, rIndex) => {
                    if (r.edit) {
                        return (
                            <div>
                                <Input
                                    style={{width: 160}}
                                    value={val ? val : ''}
                                    onChange={e => this.changeRemark(e, rIndex)}
                                />
                                <span className='action-button' onClick={e => this.changeRemarkStatus(rIndex, false)}>确定</span>
                            </div>
                        )
                    } else {
                        return <span className='action-button' onClick={e => this.changeRemarkStatus(rIndex, true)}>{val ? val : '填写备注'}</span>
                    }
                }
            },
            {
                fixed: 'right',
                width: 120,
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (val, r) => {
                    return(
                        <Fragment>
                            <a
                                className='action-button'
                                style={r && r.filePath && r.filePath.startsWith('http') ? { textDecoration: 'none' } : { cursor: 'default', color: '#999', textDecoration: 'none'}}
                                href={r && r.filePath && r.filePath.startsWith('http') ? r.filePath : 'javascript:void(0)'}
                                target='_blank'
                            >下载</a>
                            <Popconfirm
                                key='delete'
                                title="是否删除？"
                                onConfirm={() => {
                                    if(r.id) {
                                        this.onDelete(r.id)
                                    }
                                }}
                            >
                                <span className='action-button'>删除</span>
                            </Popconfirm>
                        </Fragment>
                    )
                }
            }
        ],
        uploadFileVo: [],
        pagination: {
            pageSize: 10,
            current: 1,
            showSizeChanger: true
        },
        totalLen: null,
        rowData: null,
        removeAttachmentIds: []
    }

    show (rowData) {
        let {uploadFileVo} = this.state
        uploadFileVo = [...rowData.attachmentList]
        uploadFileVo = uploadFileVo.map(item => {
            item.edit = false
            return item
        })
        this.setState({rowData, uploadFileVo})
    }

    close () {
        // console.log('close')
        this.setState({
            uploadFileVo: [],
            pagination: {
                pageSize: 10,
                current: 1,
                showSizeChanger: true
            },
            totalLen: null,
            rowData: null,
            removeAttachmentIds: []
        })
    }

    /* 开启备注 */
    changeRemarkStatus = (index, flag) => {
        let {uploadFileVo} = this.state
        uploadFileVo[index].edit = flag
        this.setState({uploadFileVo})
    }

    /* 修改备注 */
    changeRemark = (e, index) => {
        let { uploadFileVo } = this.state
        uploadFileVo[index].remark = e && e.target.value ? e.target.value : ''
        this.setState({ uploadFileVo })
    }

    /* 删除 */
    onDelete = (id) => {
        let {removeAttachmentIds} = this.state
        removeAttachmentIds.push(id)
        this.setState({removeAttachmentIds})
    }

    getPlanFileNameKey = (value) => {
        // console.log('getPlanFileNameKey', value)
        let { uploadFileVo } = this.state
        const pagination = { ...this.state.pagination }
        pagination.total = pagination.total + 1
        uploadFileVo.unshift(value)
        uploadFileVo = uploadFileVo.map(item => {
            let {
                fileName,
                filePath,
                params,
                fileSize
            } = item
            return {
                ...item,
                params,
                fileName,
                filePath,
                fileSize: fileSize || params.content.file.size,
                remark: '',
                edit: false
            }
        })
        this.setState({
            uploadFileVo: uploadFileVo,
            pagination,
            totalLen: uploadFileVo.length
        })
    }

    getLoadingVal = (value, key) => {
        // console.log('getLoadingVal', value)
            // this.setState({
            //     uploadLoading: value
            // })
    }

    /* 确定 */
    handleOk = async () => {
        const {rApi} = this.props
        let { uploadFileVo, rowData, removeAttachmentIds } = this.state
        if (uploadFileVo.length < 1) {
            message.warning('未选择文件')
            return
        }
        let reqData = {
            id: rowData && rowData.id ? rowData.id : null,
            removeAttachmentIds,
            uploadFileVo
        }
        await this.setState({ loading: true })
        rApi.uploadReturnFile(reqData)
            .then(res => {
                const { modalReturnCancel, parent } = this.props
                message.success('操作成功')
                parent.onChangeValue()
                modalReturnCancel()
                this.setState({ loading: false })
            })
            .catch(err => {
                message.error(err.msg || '操作失败')
                this.setState({ loading: false })
            })
    }

    render () {
        const {
            uploadFileVo,
            columns,
            loading
        } = this.state
        const {
            show,
            parentDom,
            modalReturnCancel
        } = this.props
        return(
            <Modal
                className='cusmodal-return'
                title="回单上传"
                visible={show}
                getContainer={() => parentDom}
                onOk={this.handleOk}
                onCancel={modalReturnCancel}
                width={760}
                confirmLoading={loading}
                maskClosable={false}
            >
                <div style={{width: 85}}>
                    <UploaderFile
                        getFileNameKey={this.getPlanFileNameKey}
                        getLoadingVal={this.getLoadingVal}
                        multiSelection={true}
                    >
                        <Button
                            icon="upload"
                            size="small"
                            style={{ fontSize: '12px', borderRadius: '4px' }}
                        >
                            上传文件
                        </Button>
                    </UploaderFile>
                </div>
                <Table
                    style={{marginTop: 10}}
                    rowSelection={this.rowSelection}
                    columns={columns}
                    bordered={false}
                    dataSource={uploadFileVo}
                    size='small'
                    scroll={{x:860}}
                    pagination={false}
                    onChange={this.handleTableChange}
                />
            </Modal>
        )
    }
}