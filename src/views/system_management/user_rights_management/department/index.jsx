import React from 'react'
import BasicView from '@src/views/BasicView'
import { inject, observer } from "mobx-react"
import { children, id } from './power'
// import { Badge } from 'antd';
import LeftView from './left'
import RightView from './right'

const power = Object.assign({}, children, id)

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
        checkOrigeData: {}, //选中的部门数据
    }
    
    initData() {
        this.leftview.refresh()
    }

    changeType = type => {
        this.setState({
            type: type
        })
    }

    selectedOrigeData = (value) => { //LeftView 触发该事件传id给RightView
        this.setState({
            checkOrigeData: value
        })
    }

    reLoad = (key, keyData) => {
        this.leftview.initData(key, keyData)
        //console.log('sKeyData111', key, keyData)
    }
    render() {
        // console.log('render', this.props)<RightView />
        let { type } = this.state
        return (
            <div>
                <div className="flex flex-level-center default-background" style={{minHeight: this.props.minHeight}}>
                    <LeftView  
                        parent={this}
                        power={power}
                        getThis={view => {this.leftview = view}} 
                        changeType={this.changeType} 
                        type={type}
                        selectedOrigeData={this.selectedOrigeData}
                         />
                    <RightView 
                        parent={this}
                        power={power}
                        getThis={view => {this.rightview = view}} 
                        type={type}
                        checkOrigeData={this.state.checkOrigeData}
                        reLoad={this.reLoad}
                         />
                </div>
            </div>
        )
    }
}
