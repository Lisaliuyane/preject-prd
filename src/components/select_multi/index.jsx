import React, { Component } from 'react'
import { Menu, Dropdown, Icon, Tag, Popover, Button, Spin } from 'antd'
import { inject, observer } from "mobx-react"
import { allbooktypes } from '../../store/wordbooknav'
import Modal from '@src/components/modular_window'
import { isArray, stringToArray, dedupe } from '@src/utils'
import TagButton from './tag'
import'./index.less'
import PropTypes from 'prop-types'
/**
 * 
 * 
 * @export
 * @class MultiSelect
 * @extends {Component}
 * 父组件需传入一个方法handleChangeSelect  父组件取值 调用handleChangeSelect(value)
 */
@inject('mobxDataBook')
@inject('rApi')
@observer
export default class MultiSelect extends Component {

    /**
     * 父组件传值接口list、text、getDataMethod、params
     * defaultValue 数组[{id:'', title: ''}]
     * 
     * @memberof MultiSelect
     */
    static propTypes = {
        list: PropTypes.array,
        text: PropTypes.string,
        getDataMethod: PropTypes.string,
        params: PropTypes.object,
        defaultValue: PropTypes.array,
        labelField: PropTypes.string,
        dataKey: PropTypes.string,
	}
    state = {
        type: null,
        selectList:[],
        tagList:[],
        selectedKeys: [],
        labelField: 'title',
        dataKey: 'records',
        loading: false
    }
    
    constructor(props) {
        super(props)
        let { text, mobxDataBook, sectList, getDataBooks, list, getDataMethod } = props
        if(props.text) {
            this.state.type = 1
        } else if(props.getDataMethod) {
            this.state.type = 3
        } else if(props.list !== '' || props.list !== null) {
            this.state.type = 2
        }
        if(this.props.defaultValue){
            this.state.tagList.push(...this.props.defaultValue.filter(item => item && item.id))
            this.state.selectedKeys.push(...this.props.defaultValue.filter(item => item && item.id).map((item) => {
                return item.id.toString() // selectedKeys为string eg: '43','44'
            }))
        }
    }
    // componentDidMount() {
    //     this.setState({selectList: this.props.sectList});
    // }
    handleButtonSelect = (e) => {
        this.setState({selectedKeys: e.selectedKeys})
        this.state.tagList.push(e.item.props.value)
        // console.log('selectedKeys', e.selectedKeys)
        if (this.props.handleChangeSelect) {
            this.props.handleChangeSelect(this.state.tagList)
        }
    }
    handleButtonDeSelect = (e) => {
        let delValue =  this.state.tagList
        let index = delValue.findIndex(item => (item.id === e.key || item.id.toString() === e.key))
        delValue.splice(index, 1)
        this.setState({selectedKeys: e.selectedKeys, tagList: delValue})
        if (this.props.handleChangeSelect) {
            this.props.handleChangeSelect(this.state.tagList)
        }
    }
    handleShow = (itemId) => {
        let deValue =  this.state.tagList
        let selKeys = this.state.selectedKeys
        deValue.splice(deValue.findIndex(item => item.id === itemId), 1)
        selKeys.splice(selKeys.findIndex(item => item.id === itemId), 1)
        this.setState({tagList: deValue, selectedKeys:selKeys})
        if (this.props.handleChangeSelect) {
            this.props.handleChangeSelect(this.state.tagList)
        }
    }
    getBookType = (text) => {
        let items = allbooktypes.filter(item => {
            if(item['text'] === text){
                return true
            }
            return false
        })
        return items && items[0] ? items[0] : null
    }

    onFocus = () => {
        let { text, mobxDataBook, list, getDataMethod, rApi, params, labelField, dataKey, isTransportQuotation } = this.props
        let { data, loading, type } = this.state
        this.setState({
            loading: true
        })
        if (type === 1) {
            return new Promise((resolve, reject) => {
                let typeId = this.getBookType(text)
                // if(!mobxDataBook.databook[typeId.id]){
                //     mobxDataBook.initData(text).then(() => {
                //         this.setState({selectList:mobxDataBook.databook[typeId.id]})
                //     })
                // }else{
                //     this.setState({selectList:mobxDataBook.databook[typeId.id]})
                // }
                mobxDataBook.initData(text).then(() => {
                    this.setState({
                        selectList: mobxDataBook.databook[typeId.id],
                        loading: false
                    })
                })
            })
        } else if (type === 2) {
            return new Promise((resolve, reject) => {
                this.setState({
                    selectList: list,
                    loading: false
                })
                resolve(true)
            })

        } else if (type === 3 && isTransportQuotation) { //报价显示报价单号及运输方式
            return rApi[getDataMethod](params).then(d => {
                let list = []
                if(isArray(d)) {
                    list = d
                } else if(d && isArray(d.list)) {
                    list = d.list
                } else if(d && d.clients) {
                    list = d.clients
                } else if(d && d.records) {
                    list = d.records
                } else {
                    list = []
                }
                let dataMap = list.map(item => {
                    let tm= (item.transportModeBusinessModes && item.transportModeBusinessModes .length) > 0 ? item.transportModeBusinessModes.map((d) => {
                        return d.transportModeName
                    }) : null   
                    return {
                        ...item,
                        transportModes: dedupe(tm).join(' ')
                    } 
                    
                })
                this.setState({
                    selectList: dataMap && dataMap.length > 0 ? dataMap.map((item) => {
                        let obj = {
                            id: item.id,
                            title: `${item.quotationNumber}${item.transportModes ? ` ${item.transportModes}` : ''}`,
                            quotationNumber: `${item.quotationNumber}${item.transportModes ? ` ${item.transportModes}` : ''}`
                        }
                        return obj
                    }) : [],
                    loading: false
                })
            }).catch(e => {
                this.setState({
                    loading: false
                })
            })
        }   else if (type === 3) {
            return rApi[getDataMethod](params).then(d => {
                let list = []
                if(isArray(d)) {
                    list = d
                } else if(d && isArray(d.list)) {
                    list = d.list
                } else if(d && d.clients) {
                    list = d.clients
                } else if(d && d.records) {
                    list = d.records
                } else {
                    list = []
                }
                this.setState({
                    selectList: list && list.length > 0 ? list.map((item) => {
                        let obj = {
                            id: item.id,
                            title: item[labelField],
                            [labelField]: item[labelField]
                        }
                        return obj
                    }) : [],
                    loading: false
                })
            }).catch(e => {
                this.setState({
                    loading: false
                })
            })
        }
        
    }
    // onChange = () => {
    //     this.props.handleChangeSelect(this.state.selectedKeys)
    //     console.log('this.props.handleChangeSelect')
    // }
    render() {
        let { selectList, loading } = this.state
        let { getPopupContainer } = this.props
        let getTContainer = {}
        if (getPopupContainer) {
            getTContainer.getPopupContainer = getPopupContainer
        } else {
            getTContainer.getPopupContainer = () => document.querySelector('#scroll-view')
        }
        const menu = (
            <Spin spinning={loading} size="small">
                <Menu selectedKeys={this.state.selectedKeys} multiple={true} onSelect={this.handleButtonSelect} onDeselect={this.handleButtonDeSelect}>
                    {
                        selectList && selectList.length > 0 ?
                        selectList.map((item,index) => (
                            <Menu.Item value={item} key={item.id}>
                                <a>{item.title}</a>
                            </Menu.Item>
                        ))
                        :
                        <Menu.Item disabled={true}>
                            <a>暂无数据</a>
                        </Menu.Item>
                    }
                </Menu>
            </Spin>
          );
        return (
            <div className="flex flex-vertical-center multi-select-box">
                {
                    this.state.tagList.map((item, index) => (
                        <TagButton 
                            key={item.id} 
                            itemTitle={item.title} 
                            itemId={item.id} 
                            handleShow={this.handleShow}
                        >
                        </TagButton>
                    ))
                }
                <Popover 
                    {...getTContainer}
                    overlayClassName='multi-select-popover' 
                    placement="bottomLeft" 
                    content={menu} 
                    trigger="click" 
                    onClick={this.onFocus}
                >
                    <Button size='small'>+</Button>
                </Popover>
            </div>
        )
    }
}
        
         
// export default SourceDemo;