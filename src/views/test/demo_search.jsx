import React, { Component } from 'react'
import { Input } from 'antd';
import RemoteSelect from '@src/components/select_databook'
// import CustomRemoteSelect from '@src/components/select_data'
import PropTypes from 'prop-types'

// const Option = Select.Option;
const Search = Input.Search;

export default class SearchComponent extends Component {

    static propTypes = {
        data: PropTypes.array,
        onChangeValue: PropTypes.func
    }
    
    state = {
        data: [],
        value: [],
        loading: false,
        code: null,
        status: null,
        shortname: null,
        keyword: ''
    }

    onFocus = () => {
    }

    onChangeValue = (d) => {
        this.setState(d, () => {
            if (this.props.onChangeValue) {
                this.props.onChangeValue(this.state)
            }
        })
    }

    render() {
        const style = {width: 160, paddingRight: 10}
        return (
            <div style={{borderBottom: '1px solid #f0f2f5', padding: '10px 20px'}}>
                <div className='flex'>
                    {
                        // <div style={style}>
                        // <CustomRemoteSelect 
                        //     filterField='id' 
                        //     labelField='code' 
                        //     data={this.props.data} 
                        //     onChangeValue={
                        //         e => {
                        //             this.setState({code: e.id}, this.onChangeValue({code: e.id}))
                        //         }
                        //     } 
                        //     placeholder='客户代码' 
                        //     text="行业">
                        // </CustomRemoteSelect>
                        // </div>
                    }
                    <div style={style}>
                    <RemoteSelect 
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({carFamily: id}, this.onChangeValue({carFamily: id}))
                            }
                        } 
                        placeholder='车种' 
                        text="车种">
                    </RemoteSelect>
                    </div>
                    <div style={style}>
                        <RemoteSelect 
                            onChangeValue={
                                e => {
                                    let id = e ? e.id : 0
                                    this.setState({carType: id}, this.onChangeValue({carType: id}))
                                }
                            } 
                            placeholder='车型' 
                            text="车型">
                        </RemoteSelect>
                    </div>
                    <div style={style}>
                        <RemoteSelect 
                            onChangeValue={
                                e => {
                                    let id = e ? e.id : 0
                                    this.setState({toUser: id}, this.onChangeValue({toUser: id}))
                                }
                            } 
                            placeholder='所属承运商' 
                            text="所属承运商">
                        </RemoteSelect>
                    </div>
                    <div className='flex1'>
                    </div>
                    <div style={{width: 360}}>
                        <Search
                            placeholder="输入关键字搜索"
                            onSearch={value => {this.onChangeValue({keyword: value})}}
                            enterButton
                        />
                    </div>
                </div>
            </div>
        )
    }
}