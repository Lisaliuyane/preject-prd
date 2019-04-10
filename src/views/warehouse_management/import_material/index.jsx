import React, { Component } from 'react'
import { Upload } from 'antd'
import XLSX from 'xlsx'

class ImportMaterial extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
        this.rABS = typeof FileReader !== "undefined" && (FileReader.prototype || {}).readAsBinaryString
    }

    processWb = (wb) => {
		/* get data */
        let ws = wb.Sheets[wb.SheetNames[0]]
        let data = XLSX.utils.sheet_to_json(ws, { header: 1 })
        console.log('data', data)
    }

    beforeUpload = (file) => {
        let f = file
        let reader = new FileReader()
		reader.onload = (e) => {
            let data = e.target.result
            if(!this.rABS) data = new Uint8Array(data)
            try {
                this.processWb(XLSX.read(data, { type: this.rABS ? 'binary' : 'array' }))
            } catch (e) {
                console.error('e', e)
                message.error('文件解析错误, 请确保传入文件为excel表格！')
            }
		}
		if(this.rABS) reader.readAsBinaryString(f)
		else reader.readAsArrayBuffer(f)
        return false
    }

    render() { 
        return (
            <Upload showUploadList={false} beforeUpload={this.beforeUpload}>
                <Button style={{marginLeft: 10}}>
                    <Icon type="download" />
                    导入
                </Button>
            </Upload>
        )
    }
}
 
export default ImportMaterial;