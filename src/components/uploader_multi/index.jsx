import React, { Component } from 'react';
import {  Upload, Icon, Modal, message } from 'antd';
import './index.less'
import { relative } from 'path'
import moment from 'moment'
import { imgClient } from '@src/utils'
import uuidv3  from 'uuid/v1'
import lrz from 'lrz'
/**
 * 
 * 
 * @export
 * @class MultiSelect
 * @extends {Component}
 * 父组件需传入一个方法handleChangeUpload  父组件取值 调用handleChangeUpload(value)
 * 默认显示图片 传值 fileList
 */
export default class UploadMulti extends Component {

    static defaultProps = {
        fileList: []
    }

    state={
        previewVisible: false,
        previewImage: '',
        fileList: [],
        type: 3, //判断是否为查看状态
    }

    isUploadFileTypeError = false

    constructor(props) {
        super(props)
        this.state = {
            previewVisible: props.previewVisible,
            previewImage: props.previewImage,
            fileList: props.fileList,
            type: props.type
        }
    }

    beforeUploadCheck = (file, fileList) => {
        const imgType = file.type === 'image/jpeg' || file.type === 'image/png'
        const maxSize = file.size / 1024 / 1024 < 3
        if (!imgType) {
            message.error('只能上传jpg或png格式!')
            this.isUploadFileTypeError = !imgType
            return !imgType
        }
        if (!maxSize) {
            message.error('图片必须小于3MB!')
        }
        if(!imgType || !maxSize) {
            this.isUploadFileTypeError = !imgType || !maxSize
            return imgType && maxSize
        }
        let uuid = this.random_string()
        let s = this.get_suffix(fileList[0].name)
        this.fileNameOne = `${moment(new Date()).format('YYYY-MM-DD')}/${uuid}${s}`
        lrz(fileList[0]).then(res => {
            imgClient().put(this.fileNameOne, res.file).then(function (result) {
                // console.log('multipartUpload', result);
            }).catch(function (err) {
                // console.log(err);
            });
        }).catch(e => {
            console.log('e', e)
        })
        return false
    }
    handleCancel = () => this.setState({ previewVisible: false })
    handlePreview = (file) => {
        this.setState({
            previewImage: file.thumbUrl || file.url ,
            previewVisible: true,
        });
    }

    random_string = () => { //生成uuid
        let reg = /-/g;
        let pwd = uuidv3().replace(reg, '')
        return pwd;
    }

    get_suffix = (filename) => { //截取文件后缀名
        let pos = filename.lastIndexOf('.')
        let suffix = ''
        if (pos != -1) {
            suffix = filename.substring(pos)
        }
        return suffix;
    }
    handleChange = ({ fileList }) => {
        //console.log('handleChange', fileList, this.fileNameOne)
        if (this.isUploadFileTypeError) {
            this.isUploadFileTypeError = false
            return
        }
        this.setState({ fileList })
        if(fileList && fileList[0]) {
            fileList[0].imgurl = this.fileNameOne
        }
        if (this.props.handleChangeUpload) {
            this.props.handleChangeUpload(fileList)
        }
    }
    render() {
        const { fileList } = this.state;
        let {text} = this.props
        const uploadButton = (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">{text}</div>
          </div>
        );
        return (
            <div className={this.props.type === 2 ? 'upload-documents-wrapper' : ''}>
                {
                    this.props.type === 2 && this.props.fileList.length === 0 ?
                    <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '20px', color: '#bbb', minWidth: 160}}>
                        {this.props.title}
                    </div>
                    :
                    <div>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-upload-wrapper"
                            fileList={fileList}
                            onPreview={this.handlePreview}
                            onChange={this.handleChange}
                            beforeUpload={this.beforeUploadCheck}
                            action={''}
                            // accept="image/jpeg"
                            onRemove={
                                () => {
                                    return this.props.type === 2 ? false : true
                                }
                            }
                        >
                            {
                                this.props.type === 2 ? null 
                                : 
                                fileList.length >= 1 ? null 
                                : 
                                uploadButton
                            }
                        </Upload>
                        <Modal 
                            visible={this.state.previewVisible} 
                            footer={null} 
                            onCancel={this.handleCancel}
                        >
                            <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                        </Modal>
                    </div>
                }
            </div>
        )
    }
}
        
         
// export default SourceDemo;