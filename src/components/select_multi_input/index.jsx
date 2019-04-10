import React, { Component } from 'react';
import { Menu, Dropdown, Icon, Tag, Popover, Button, Input } from 'antd';
import { inject, observer } from "mobx-react"
import { allbooktypes } from '../../store/wordbooknav'
import Modal from '@src/components/modular_window';
import TagButton from './tag'
import'./index.less'
import PropTypes from 'prop-types'
import { isArray } from '@src/utils'
/**
 * 
 * 
 * @export
 * @class MultiSelect
 * @extends {Component}
 * 父组件需传入一个方法handleChangeSelect  父组件取值 调用handleChangeSelect(value)
 */
let idNum = 1
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
        defaultValue: PropTypes.array
	}
    state = {
        type: null,
        selectList:[],
        tagList:[],
        selectedKeys: [],
        inputValue: '',
        idNum: 0,
    }
    
    constructor(props) {
        super(props)
        const { defaultValue } = props
    
        if(defaultValue && typeof defaultValue === 'string' && defaultValue.startsWith('[')){
            try {
                let d = JSON.parse(defaultValue)
                this.state.tagList = d.map(item => {
                    return {
                        id: idNum++,
                        title: item.title || item
                    }
                })
            } catch (e) {

            }
        } else if (defaultValue && isArray(defaultValue)) {
            let d = defaultValue
            this.state.tagList = d.map(item => {
                return {
                    id: idNum++,
                    title: item.title || item
                }
            })
        }
    }

    addItem = () => {
        let { tagList, inputValue } = this.state
        tagList = tagList.filter(item => {
            return item.title !== inputValue
        })
        if(inputValue !== ''){
            tagList.push({id: idNum++, title: inputValue})
            this.setState({tagList: tagList,inputValue: '', idNum: idNum++})
        }
        if (this.props.handleChangeInput) {
            this.props.handleChangeInput(tagList.map(item => item.title))
        }

    }

    handleShow = (itemId) => {
        let deValue =  this.state.tagList
        //let selKeys = this.state.selectedKeys
        deValue.splice(deValue.findIndex(item => item.id === itemId), 1)
        //selKeys.splice(selKeys.findIndex(item => item.id === itemId), 1)
        this.setState({tagList: deValue})
        if (this.props.handleChangeInput) {
            this.props.handleChangeInput(this.state.tagList)
        }
    }

    render() {
        let { inputValue } = this.state
        let { getPopupContainer } = this.props
        let getTContainer = {}
        if (getPopupContainer) {
            getTContainer.getPopupContainer = getPopupContainer
        } else {
            getTContainer.getPopupContainer = () => document.querySelector('#scroll-view')
        }
        const menu = (
            // <Menu selectedKeys={this.state.selectedKeys} multiple={true} onSelect={this.handleButtonSelect} onDeselect={this.handleButtonDeSelect}>
            //   {
            //       this.state.selectList.map((item,index) => (
            //         <Menu.Item value={item} key={item.id}>
            //            <a>{item.title}</a>
            //         </Menu.Item>
            //        ))
            //   }
            // </Menu>
            <div className="main-wrapper" style={{background: '#fff'}}>
                <Input 
                    //className="wr-btn"
                    placeholder=""  
                    style={{width:190}}
                    value={inputValue}
                    onChange = {
                        e => {
                            this.setState({
                                inputValue: e.target.value
                            })
                        }
                    }
                    ref="onInput"
                    />
                <Button className="wr-btn" onClick={this.addItem}>添加</Button>
            </div>
          );
          const { tagList } = this.state
        return (
            <div className="flex flex-vertical-center multi-select-box">
                {
                    tagList.map((item, index) => (
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
                    overlayClassName='multi-select-popover' 
                    {...getTContainer}
                    placement="bottomLeft" 
                    content={menu} 
                    trigger="click" 
                // onClick={this.onFocus}
                >
                    <Button size='small'>+</Button>
                </Popover>
            </div>
        )
    }
}
        
         
// export default SourceDemo;