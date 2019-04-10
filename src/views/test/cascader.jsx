import React, { Component } from 'react';
import { inject, observer } from "mobx-react"
import Modal from '@src/components/modular_window';
import { Cascader } from 'antd';
import PropTypes from 'prop-types'
import './cascader.less'
@inject('rApi')
export default class CascaderBtn extends Component {

    /**
     * 父组件传值接口defaultValue
     * 
     * @memberof CascaderBtn
     */
    static propTypes = {
        defaultValue: PropTypes.array
	}
    state = {
        options:[],
        show: false
    }
    constructor(props) {
        super(props)
    }
     componentDidMount() {
        this.initData();
    }
    onChange = (value, selectedOptions) => {
        //console.log(value, selectedOptions);
    }
    initData = () => {
        this.props.rApi.getProvinces().then((res) => {
            this.setState({options: res.map((item, index) => {
                return {value:item.name,label:item.name,isLeaf:false,code:item.code}
            })})
            res.forEach((d,index) => {
                if(this.props.defaultValue[0] !== '' && this.props.defaultValue[0] === d.name){
                    this.props.rApi.getCitys(d).then((res) => {
                        console.log('resVul',res)
                        this.state.options[index].children = res.map((item) => {
                            return {
                                label: `${item.name}`,
                                value: `${item.name}`
                            }
                        })
                        this.setState({show: true})
                    })
                }
                
            });
            this.setState({show: true})
        })
    }
    loadData = (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true
        this.props.rApi.getCitys(...selectedOptions).then((d) => {
                targetOption.loading = false;
                targetOption.children = d.map((item, index) => {
                    return {
                        label: `${item.name}`,
                        value: `${item.name}`
                    }
                })
                this.setState({
                    options: [...this.state.options],
                })
            })
      }
    render() {
        let { defaultValue } = this.props
        if (!this.state.show) {
            return false
        }
        return (
            <div>
                <Cascader 
                    defaultValue={defaultValue} 
                    options={this.state.options} 
                    onChange={this.onChange} 
                    placeholder="请选择省市"
                    loadData={this.loadData}
                    popupClassName="cas-addr-wrapper"
                    />
            </div>
        )
    }
}
        
         
// export default SourceDemo;