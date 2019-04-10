import React, { Component, Fragment } from 'react'
import {  Icon, Input } from 'antd'
import PropTypes from 'prop-types'
import './index.less'

export default class SearchInput  extends Component {

    static propTypes = {
        data: PropTypes.array.isRequired, //默认值 eg => ['1111', ''2222]
        width: PropTypes.number, //每个input的宽 默认140 eg=> 200
        maxLen: PropTypes.number, //最多可以添加多少个input 默认2个
        getThis: PropTypes.func.isRequired //通过getThis获取值 => getValue().data
    }

    state = {
        dataList: []
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        this.state.dataList = (props.data && props.data.length > 0) ? props.data : ['']
    }

    handleChange = (e, index) => {
        let { dataList } = this.state
        dataList[index] = e.target.value
        this.setState({
            dataList: dataList
        })
    }

    onAdd = () => { //添加
        let { dataList } = this.state
        dataList.push('')
        this.setState({
            dataList: dataList
        })
    }

    onDel = (index) => { //删除
        this.setState(preState => {
            preState.dataList.splice(index, 1)
            return {
                dataList: preState.dataList
            }
        }) 
    }

    getValue = () => { //获取值
        let { dataList } = this.state
        return {
            data: dataList
        }
    }

    render() {
        let { dataList } = this.state
        let {
            width,
            maxLen
        } = this.props
        return(
            <Fragment>
                <div 
                    className="main-wrapper flex flex-vertical-center"
                >
                    {
                        dataList && dataList.length > 0 && dataList.map((item, index) => {
                            return(
                                <div className="flex flex-vertical-center" key={index}>
                                    <Input
                                        defaultValue={item}
                                        style={{ width: width ? width : 140}}
                                        placeholder=""
                                        onChange={(e) => this.handleChange(e, index)}
                                    />
                                    &emsp;
                                    {
                                        (index + 1) > 1 && <div className="plusStyle" onClick={() => this.onDel(index)}>-</div>
                                    }
                                </div>
                            )
                        })
                    }
                    {
                        dataList && dataList.length < (maxLen ? maxLen : 2) && <div className="plusStyle" onClick={() => this.onAdd()}>+</div>
                    }
                </div>
                
            </Fragment>
        )
    }
}