import React, { Component } from 'react';
import Modal from '@src/components/modular_window';
import {  Select, message } from 'antd';
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import FilterSelect from '@src/components/select_filter'
import { Row, Col } from '@src/components/grid'
import moment from 'moment'
import Iicon from '@src/components/icon'
import SearchInput from '@src/components/search_input'
import MultipleFileUpload from '@src/components/uploader_file_multiple'
//import MoreBtn from '@src/components/more_btn'

const Option = Select.Option

@inject('mobxTabsData', 'mobxDataBook')
@inject('rApi') 
@observer 
class Demo  extends Component {

    state = {
        data: [],
        value: null
    }

    getFileDetail = (value) => {
        console.log('getFileDetail', value)
    }

    render() {
        return (
            <div>
                {/* <MultipleFileUpload 
                    getFileDetail={this.getFileDetail}
                    // fileList={[{
                    //     uid: '1',
                    //     name: 'xxx.png',
                    //     status: 'done',
                    //     url: 'http://frdscm.oss-cn-shenzhen.aliyuncs.com/2018-10-19/c2231c51d37711e8b319e9397f4d538f.xlsx?Expires=1539945784&OSSAccessKeyId=LTAIbH8hu0UeKsCM&Signature=uxRvmy3qFBiY%2BsqPxYdKzS81Dbo%3D',
                    // }]}
                /> */}
                {/* <MoreBtn>
                    <MultipleFileUpload 
                        getFileDetail={this.getFileDetail}
                        // fileList={[{
                        //     uid: '1',
                        //     name: 'xxx.png',
                        //     status: 'done',
                        //     url: 'http://frdscm.oss-cn-shenzhen.aliyuncs.com/2018-10-19/c2231c51d37711e8b319e9397f4d538f.xlsx?Expires=1539945784&OSSAccessKeyId=LTAIbH8hu0UeKsCM&Signature=uxRvmy3qFBiY%2BsqPxYdKzS81Dbo%3D',
                        // }]}
                    />
                </MoreBtn> */}
            </div>
        )
    }
}

export default Demo 