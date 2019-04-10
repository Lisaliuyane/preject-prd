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
export default class WordBook extends BasicView {
    state =  {
        type: null,
    }
    
    initData() {
        this.leftview.refresh()
    }

    changeType = type => {
        this.setState({
            type: type
        })
    }

    render() {
        // console.log('render', this.props)<RightView />
        let { type } = this.state
        return (
            <div>
                <div className="flex flex-level-center default-background" style={{minHeight: this.props.minHeight}}>
                    <LeftView  getRef={view => {this.leftview = view}} changeType={this.changeType} type={type} />
                    <RightView getRef={view => {this.rightview = view}} type={type} />
                </div>
            </div>
        )
    }
}
