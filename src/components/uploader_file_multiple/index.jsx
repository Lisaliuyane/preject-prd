import React, { Component } from 'react';
import {  Upload, Icon, Modal, message, Button } from 'antd';
import moment from 'moment'
import { imgClient, random_string, get_suffix } from '@src/utils'
import './index.less'

export default class MultipleFileUpload extends Component {
    state = {
        fileList: []
    }

    constructor(props) {
        super(props)
        let { fileList } = props
        this.state.fileList = fileList
    }

    beforeUpload = (file, fileList) => {
        const maxSize = file.size / 1024 / 1024 < 50
        if (!maxSize) {
            message.error('图片必须小于50MB!')
        }
        if(!maxSize) {
            this.isUploadFileTypeError = !maxSize
            return maxSize
        }
        let uuid = random_string()
        let s = get_suffix(fileList[0].name)
        this.fileNameOne = `${moment(new Date()).format('YYYY-MM-DD')}/${uuid}${s}`
        this.file = file
        imgClient().put(this.fileNameOne, file).then(function (result) {
            // console.log('multipartUpload', result);
        }).catch(function (err) {
            // console.log(err);
        });
        return false
    }

    onRemove = (file) => { //删除文件
        let { fileList } = this.state
        fileList = fileList.filter(item => item.fileUrl !== file.fileUrl)
        this.setState({
            fileList: fileList
        })
        this.props.getFileDetail(fileList)
        return true
    }

    onChange = ({file, fileList}) => {
        this.setState({
            fileList: fileList
        })
        fileList.forEach((item, index) => {
            if(item.originFileObj === this.file) {
                fileList[index].fileUrl = this.fileNameOne
                this.props.getFileDetail(fileList)
            }
        })
    }
    render() {
        let { fileList } = this.state
        //console.log('this.props.type', this.props.status)
        return(
            <div className="upload-file-multiple">
                <Upload
                    // accept='doc,docx,xls,xlsx,csv,ppt,pptx,pdf,zip'
                    fileList={fileList}
                    name= 'file'
                    headers={{ authorization: 'authorization-text'}}
                    onChange={this.onChange}
                    beforeUpload={this.beforeUpload}
                    onRemove={this.onRemove}
                >
                    <Button 
                        size="small" 
                        style={{borderRadius: 4, fontSize: '12px', lineHeight: '24px'}}
                        disabled={this.props.type === 2 || this.props.status === 2 || this.props.status === 3 ? true : false}
                    >
                        <Icon type="upload" /> 上传附件
                    </Button>
                </Upload>
            </div>
        )
    }
}