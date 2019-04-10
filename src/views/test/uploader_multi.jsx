import React, { Component } from 'react';
import { inject, observer } from "mobx-react"
import { Menu, Dropdown, Tag, Popover, Button, Upload, Icon, Modal, message } from 'antd';
import MultiSelectButton from '../components/select_multi'
import CascaderBtn from '../components/select_address/cascader'
export default class SourceDemo extends Component {

    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
      }
    constructor(props) {
        super(props)
        this.setState({
            previewVisible:props.previewVisible,
            previewImage:props.previewImage,
            fileList:props.fileList
        })
        // if (props.getThis) {
        //     props.getThis(this)
        // }
    }
    beforeUpload = (file) => {
        // const isJPG = file.type === 'image/jpeg';
        // if (!isJPG) {
        //   message.error('You can only upload JPG file!');
        // }
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
          message.error('Image must smaller than 1MB!');
        }
        return isLt1M;
      }
    handleCancel = () => this.setState({ previewVisible: false })
    handlePreview = (file) => {
        this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
        });
    }
    handleChange = ({ fileList }) =>{
        this.setState({ fileList })
        if (this.props.handleChangeUpload) {
            this.props.handleChangeUpload(fileList)
        }
        if (this.props.handleChangeUpload2) {
            this.props.handleChangeUpload(fileList)
        }
    }

    // getValue = () => {
    //     return this.state.fileList
    // }
    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
          </div>
        );
        return (
            <div>
                {/* <MultiSelectButton list={this.state.sectList}  text='' getDataMethod={'getDataBooks'} params={{id: 1}} /> */}
                {/* <CascaderBtn defaultValue={this.state.defaultValue} /> */}
                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-upload-wrapper"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    beforeUpload={this.beforeUpload}
                >
                    {fileList.length >= 2 ? null : uploadButton}
                </Upload>
                <Modal visible={this.previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={this.previewImage} />
                </Modal>
            </div>
        )
    }
}
        
         
// export default SourceDemo;