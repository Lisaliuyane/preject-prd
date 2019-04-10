import React from 'react'
import BasicView from '@src/views/BasicView'
import { inject, observer } from "mobx-react"
// import { Badge } from 'antd';
import LeftView from './left'
import RightView from './right'

/**
 *  基础数据字典
 * 
 * @export
 * @class WordBook
 * @extends {React.Component}
 */
@inject('mobxTabsData')
@observer
export default class Department extends BasicView {
    state =  {
        type: null,
        checkOrigeKey: 2, //选中的部门数据
    }
    
    initData() {
        this.leftview.refresh()
    }

    // changeType = type => {
    //     this.setState({
    //         type: type
    //     })
    // }

    selectedOrigeData = (value) => { //LeftView 触发该事件传key给RightView
       // console.log('selectedOrigeData', value.key)
        this.setState({
            checkOrigeKey: value.key
        })
    }

    // reLoad = (key, keyData) => {
    //     this.leftview.initData(key, keyData)
    //     console.log('sKeyData111', key, keyData)
    // }
    render() {
        // console.log('render', this.props)<RightView />
        let { type } = this.state
        return (
            <div>
                <div className="flex flex-level-center default-background" style={{minHeight: this.props.minHeight}}>
                    <LeftView  
                        parent={this}
                        getThis={view => {this.leftview = view}} 
                        selectedOrigeData={this.selectedOrigeData} 
                        type={type}
                    />
                    <RightView 
                        parent={this}
                        getThis={view => {this.rightview = view}} 
                        type={type}
                        checkOrigeData={this.state.checkOrigeKey}
                        //reLoad={this.reLoad}
                    />
                </div>
            </div>
        )
    }
}
