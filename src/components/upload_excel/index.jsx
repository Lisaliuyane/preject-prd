import React, { Component } from 'react'
import { Button, Upload, Icon, message } from 'antd'
import XLSX from 'xlsx'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import PropTypes from 'prop-types'

class UploadExcel extends Component {

    static propTypes = {
        getExcelData: PropTypes.func
    }

    constructor(props) {
        super(props)
        this.state = {}
    }

    beforeUpload = (file) => {
        let f = file
        let reader = new FileReader()
		reader.onload = (e) => {
			let data = e.target.result
            if(!this.rABS) data = new Uint8Array(data)
            try {
                this.processWb(XLSX.read(data, {type: this.rABS ? 'binary' : 'array'}))
            } catch (e) {
                console.error('e', e)
                message.error('文件解析错误, 请确保传入文件为excel表格！')
            }
		}
		if(this.rABS) reader.readAsBinaryString(f)
		else reader.readAsArrayBuffer(f)
        return false
    }

    processWb = (wb) => {
        /* get data */
        const { getExcelData } = this.props
		let ws = wb.Sheets[wb.SheetNames[0]]
        let data = XLSX.utils.sheet_to_json(ws, {header: 1})
        //console.log('data')
        if (getExcelData) getExcelData(data)
    }

    render() { 
        const { text, loading, power } = this.props
        return (
            <FunctionPower power={power}>
                <Upload showUploadList={false} beforeUpload={this.beforeUpload}>
                    <Button style={{marginRight: 10, verticalAlign: 'middle', borderRadius: 0}} loading={loading} >
                        <Icon type="download" />
                        {text || '导入'}
                    </Button>
                </Upload>
            </FunctionPower>
        )
    }
}
 
export default UploadExcel;