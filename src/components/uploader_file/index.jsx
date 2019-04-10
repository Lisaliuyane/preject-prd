import React from 'react'
import Modal from '@src/components/modular_window'
import { Button } from 'antd'
import upload from '@src/utils/upload'

const ModularParent = Modal.ModularParent

class UploaderFile extends ModularParent {

    state = {

    }
    
    componentDidMount() {
        this.upload = new upload(this.refs.button)
        this.upload.addListen('listen', params => {
            //console.log('params', params)
            if(params.type === 'addfile') {
                // let reg = /.w+$/
                // let fileName = params.content[0].name.replace(reg,'')
                // this.props.getFileName(fileName)
                this.upload.submit()
            }
            if(params.type === 'beforeUpload') {
                //console.log('beforeUpload', params)
                this.props.getFileNameKey({ id: '', fileName: params.content.name, filePath: params.content.key, params: params})
                this.props.getLoadingVal(true)
                //this.props.getFileName(fileName)
            }else if(params.type === 'success') {
                //console.log('beforeUpload', params.content.key)
                this.props.getLoadingVal(false)
                // message.success('文件上传成功!')
            }
        })
    }
  
    render() {
        const { children } = this.props
        if (children) {
            return (
                <div ref="button">
                    {
                        children
                    }
                </div>
            )
        }
        return (
            // <a ref='button' style={{color: 'blue'}}>上传附件</a>
            <span ref='button'>
                <Button  icon="upload" size="small" style={{fontSize: '12px'}}>上传附件</Button>
            </span>
        )
    }
}

export default UploaderFile