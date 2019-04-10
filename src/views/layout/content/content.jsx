import React from 'react'
import { Layout } from 'antd'
import { inject, observer } from "mobx-react"
import { ModulesPower } from '../power_view'
import BasicView from '@src/views/BasicView'
import { Scrollbars } from 'react-custom-scrollbars'

const { Content } = Layout

const RefreshView = () => {
    return (
        <div style={{textAlign: 'center'}}>
            正在刷新!
        </div>
    )
}
/**
 * 处理刷新以及模块权限问题
 * 
 * @class ContentRefresh
 * @extends {BasicView}
 */
@inject('mobxBaseData', 'rApi')
// @observer
class ContentRefresh extends BasicView {
    
    state = {
        refresh: false
    }

    constructor(props) {
        super(props)
        let { mobxTabsData, index, mykey } = props
        if(mobxTabsData)
        mobxTabsData.updateComponent({index: index, key: mykey}, this)
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (nextProps.collapsed !== this.props.collapsed || typeof nextProps.collapsed === 'undefined') {
    //         return false
    //     }
    //     return true
    // }

    shouldComponentUpdate = (nextProps, nextState) => {
        // console.log('collapsed', nextProps.collapsed, this.props.collapsed)
        if (nextProps.collapsed !== this.props.collapsed || typeof nextProps.collapsed === 'undefined') {
            return false
        }
        // return false
        return nextProps.activeKey === nextProps.mykey
    }
    
    refresh = () => {
        this.setState({refresh: true}, () => {
            setTimeout(() => {
                this.setState({refresh: false})
            }, 100)
        })
    }

    render() { 
        const { refresh } = this.state
        const { 
            info, 
            // mobxBaseData, 
            mobxTabsData,
            // minHeight, 
            style,
            collapsed,
            children 
        } = this.props
        // console.log('content collapsed', collapsed, mobxTabsData, info, children, style, this.props)
        // let domWidth = mobxBaseData.domWidth
        return (
            <Content style={style}>
                {/* <Scrollbars style={{ minWidth: 860, height: (domWidth <= 1100) ? mobxBaseData.domHeight-82 : mobxBaseData.domHeight-54, overflow: 'hidden'}}> */}
                    {/* <div style={{height: 50}}></div> */}
                    <div className='content-view'>
                        <ModulesPower info={info && info.id ? info.id : {}}>
                        {
                            refresh ? 
                            <RefreshView /> 
                            :
                            // React.cloneElement(this.props.children, { refresh: refresh })
                            children
                        }
                        </ModulesPower>
                    </div>
                {/* </Scrollbars> */}
            </Content>
        )
    }
}
 
export default ContentRefresh;