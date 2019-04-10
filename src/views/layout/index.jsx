import React from 'react'
import { inject } from "mobx-react";
import { Layout } from 'antd';
import HeaderView from './header'
import ContentView from './content'
// import IIcon from '@src/components/icon'
import Sidebar from './sidebar'
import { sideMinWidth, sideMaxWidth } from './config'
import './index.less'

// @inject('mobxTabsData', 'mobxBaseData', 'rApi')
/**
 * 主框架的实现，包含头部、侧边栏、tabsbar、tabcontent
 * 
 * @export
 * @class Home
 * @extends {React.Component}
 */
@inject('mobxTabsData', 'mobxBaseData', 'rApi')
// @observer
export default class Home extends React.Component {
    
    state = {
        siderWidth: sideMaxWidth,
        collapsed: false, //是否折叠侧边栏菜单
        openKeys: []
    }

    constructor(props) {
        super(props)
        this.setStoreWidth()
    }

    /**
     * 修改当前激活 tab
     * 
     * @param {any} e 
     * 
     * @memberOf Home
     */
    onChange = (e) => {
        let { mobxTabsData } = this.props
        mobxTabsData.changeKey(e)
    }

    setStoreWidth = () => {
        // clearTimeout(this.collapsedTimer)
        const { mobxBaseData } = this.props
        const { collapsed } = this.state
        if (collapsed) {
            mobxBaseData.setSiderWidth(sideMinWidth)
        } else {
            mobxBaseData.setSiderWidth(sideMaxWidth)
        }
    }

    // 侧边栏收起状态改变
    onCollapsed = () => {
       // console.log('onCollapsed', collapsed)
        const { collapsed } = this.state
        this.setState({ collapsed: !collapsed }, () => {
            this.setStoreWidth()
        })
    }

    render() {
        const { collapsed } = this.state
        const { mobxBaseData, mobxTabsData } = this.props
        // console.log('layout render', collapsed)
        return (
            <Layout>
                <HeaderView />
                <Sidebar 
                    siderWidth={!collapsed ? sideMaxWidth : sideMinWidth} 
                    collapsed={collapsed}
                    mobxBaseData={mobxBaseData}
                    mobxTabsData={mobxTabsData}
                />
                <Layout>
                    <ContentView 
                        siderWidth={!collapsed ? sideMaxWidth : sideMinWidth}  
                        onCollapsed={this.onCollapsed} 
                        collapsed={collapsed}
                    />
                </Layout>
            </Layout>
        )
    }
}
