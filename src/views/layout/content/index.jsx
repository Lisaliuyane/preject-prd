import React from 'react'
import { inject, observer } from "mobx-react"
import { Layout, Icon, Tabs } from 'antd'
import { ContextMenu, Item, Separator, ContextMenuProvider } from 'react-contexify'
import Content from './content'
import MODULEDEFINE from '@src/views/MODULEDEFINE'
import Continued from '../to_be_continued'
// import { RightButton } from '../header'
// import { ModulesPower } from '../power_view'
import { headerHeight, tabBarHeight } from '../config'
import 'react-contexify/dist/ReactContexify.min.css'
import './tabs.less'

// const { Content } = Layout;

//let keyi = 1

@inject('mobxTabsData')
class MyAwesomeMenu extends React.Component {

    menuClick(event) {
        let { mobxTabsData } = this.props
        // console.log('event', event.data, mobxTabsData)
        mobxTabsData[event.data](event.dataFromProvider) //执行右键菜单动作
    }

    render() {
        return (
            <ContextMenu id='menu_id' style={{ zIndex: 1009 }}>
                <Item data='close' onClick={this.menuClick.bind(this)}><Icon type="close" /><span className='right-click-menu-text'>关闭</span></Item>
                <Item data='refresh' onClick={this.menuClick.bind(this)}><Icon type="sync" /><span className='right-click-menu-text'>刷新</span></Item>
                <Separator />
                <Item data='closeOther' onClick={this.menuClick.bind(this)}><span className='right-click-menu-text'>关闭其他</span></Item>
                <Item data='closeAll' onClick={this.menuClick.bind(this)}><Icon type="swap" /><span className='right-click-menu-text'>关闭全部</span></Item>
                <Separator />
                <Item data='closeRight' onClick={this.menuClick.bind(this)}><Icon type="arrow-right" /><span className='right-click-menu-text'>关闭右侧所有</span></Item>
                <Item data='closeLeft' onClick={this.menuClick.bind(this)}><Icon type="arrow-left" /><span className='right-click-menu-text'>关闭左侧所有</span></Item>
            </ContextMenu>
        )
    }
}

@inject('mobxTabsData')
class TabCard extends React.Component {

    state = {

    }

    menuClick = (e, type) => {
        e.stopPropagation()
        let { mobxTabsData, index } = this.props
        mobxTabsData[type](index) //执行右键菜单动作
        // console.log('mobxTabsData', mobxTabsData, index)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.index === nextProps.index && this.props.text === nextProps.text) {
            return false
        } else {
            return true
        }
    }

    render() {
        let { text } = this.props
        // console.log('TabCard render')
        if (text === '首页') {
            return (
                <div style={{ userSelect: 'none' }} className='tab-text'>
                    <span title={text}>
                        {text}
                    </span>
                </div>
            )
        }
        return (
            <ContextMenuProvider data={this.props.index} id="menu_id" >
                <div style={{ userSelect: 'none' }} className='tab-text'>
                    <span title={text}>
                        {text}
                    </span>
                    <Icon type="close" className='close' onClick={e => this.menuClick(e, 'close')} />
                </div>
            </ContextMenuProvider>
        )
    }
}
const Home = MODULEDEFINE['HOME'].component

class TabPaneView extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.collapsed !== this.props.collapsed) {
            return false
        }
        return true
    }


    render() {
        const { showTabs, mobxTabsData, activeKey, height } = this.props
        return showTabs.slice().map((tab, index) => {
            let MODULE = MODULEDEFINE[tab.component]
            let Moduled = MODULE ? MODULE.component : Continued
            let name = MODULE ? (tab.title || MODULE.name) : '开发中...'
            let key = tab.key
            // if (name === '开发中...') {
            //     console.log('MODULEDEFINE', MODULEDEFINE, tab, tab.component, MODULE)
            // }
            return (
                <Tabs.TabPane
                    forceRender={false}
                    tab={
                        <TabCard
                            tab={tab}
                            index={index}
                            text={name}
                        />
                    }
                    key={key}
                >
                    <Content
                        mobxTabsData={mobxTabsData}
                        mykey={key}
                        activeKey={activeKey}
                        info={MODULE}
                        index={index}
                        Moduled={Moduled}
                        // minHeight={height}
                        style={{
                            padding: 0,
                            // minHeight: height - 40,
                            width: '100%',
                            // overflowX: 'auto'
                        }}
                    >
                        <Moduled
                            mobxTabsData={mobxTabsData}
                            minHeight={height}
                            index={index}
                            mykey={key}
                            activeKey={activeKey} />
                    </Content>
                </Tabs.TabPane>
            )
        })
    }
}

/**
 * 主框架的实现，包含头部、侧边栏、tabsbar、tabcontent
 * 
 * @export
 * @class Home
 * @extends {React.Component}
 */
@inject('rApi', 'mobxBaseData', 'mobxTabsData')
@observer
export default class ContentBox extends React.Component {

    state = {
        height: 0,
        width: 0
    }

    constructor(props) {
        super(props)
        const { siderWidth } = this.props
        const win = window
        this.state.height = win.innerHeight - headerHeight - tabBarHeight
        this.state.width = win.innerWidth - siderWidth - 1
    }

    shouldComponentUpdate(nextProps, nextState) {
        let nextMobxTabsData = nextProps.mobxTabsData
        let nextActiveKey = nextMobxTabsData.activeKey
        let nextShowTabs = nextMobxTabsData.showTabs
        let nextSiderWidth = nextProps.siderWidth
        let { mobxTabsData, siderWidth } = this.props
        let { showTabs, activeKey } = mobxTabsData
        // console.log('nextActiveKey', nextActiveKey, activeKey, this.historyKey)
        if (nextState.height === this.state.height && nextActiveKey === this.historyKey && nextShowTabs.length === showTabs.length && nextShowTabs.length > 0 && siderWidth === nextSiderWidth) {
            return false
        } else {
            return true
        }
    }

    /**
     * 修改当前激活 tab
     * 
     * @param {any} e 
     * 
     * @memberOf Home
     */
    onChange = (e) => {
        // console.log('onChange', e)
        let { mobxTabsData } = this.props
        mobxTabsData.changeKey(e)
        this.setState({})
    }

    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize)
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize)
    }

    onWindowResize = () => {
        const { siderWidth } = this.props
        // console.log('window.innerWidth - siderWidth - 1', window.innerWidth - siderWidth - 1)
        this.setState({
            height: window.innerHeight - headerHeight - tabBarHeight,
            width: window.innerWidth - siderWidth - 1
        })
        // this.state.width = window.innerWidth - siderWidth - 1
    }

    tabBarExtraContent = () => {
        return (
            <Icon type="double-right" />
        )
    }

    render() {
        let { mobxTabsData, siderWidth, collapsed } = this.props
        let { height } = this.state
        let { showTabs, activeKey } = mobxTabsData
        this.historyKey = activeKey
        return (
            <Layout style={{ marginLeft: siderWidth }}>
                <MyAwesomeMenu />
                <div className='header-view' style={{
                    width: `calc(100% - ${siderWidth}px)`,
                    left: siderWidth
                }}>
                    <div className='foldbtn' onClick={this.props.onCollapsed}>
                        <Icon style={{ padding: '0px 10px' }} type='menu-fold' className={collapsed ? 'folded folded-collapsed' : 'folded'}  />
                    </div>
                </div>
                {
                    <div id="scroll-view" style={{ height: height, overflowY: 'auto', marginTop: 94, padding: '10px 0 0', position: 'relative' }}>
                        <Tabs
                            animated={false}
                            activeKey={activeKey}
                            tabBarGutter={-6}
                            // tabBarExtraContent={<div style={{width: 220}}><RightButton /></div>}
                            tabBarStyle={{
                                transition: 'none',
                                width: `calc(100% - ${siderWidth + 50}px)`,
                                left: siderWidth + 50
                            }}
                            onChange={this.onChange}
                            className='root-tabs'
                        >
                            <Tabs.TabPane
                                forceRender={false}
                                tab={<TabCard index={'HOME'} tab={'HOME'} text={'首页'} />}
                                key={'HOME'}>
                                <Content style={{ background: '#fff', padding: 0, margin: 0, minHeight: height - 15 }}>
                                    <Home minHeight={height - 15} index={'HOME'} mykey={'HOME'} activeKey={activeKey} />
                                </Content>
                            </Tabs.TabPane>
                            {
                                showTabs.slice().map((tab, index) => {
                                    let MODULE = MODULEDEFINE[tab.component]
                                    let Moduled = MODULE ? MODULE.component : Continued
                                    let name = MODULE ? (tab.title || MODULE.name) : '开发中...'
                                    let key = tab.key
                                    // if (name === '开发中...') {
                                    //     console.log('MODULEDEFINE', MODULEDEFINE, tab, tab.component, MODULE)
                                    // }
                                    return (
                                        <Tabs.TabPane
                                            forceRender={false}
                                            tab={
                                                <TabCard
                                                    tab={tab}
                                                    index={index}
                                                    text={name}
                                                />
                                            }
                                            key={key}
                                        >
                                            <Content
                                                mobxTabsData={mobxTabsData}
                                                mykey={key}
                                                activeKey={activeKey}
                                                info={MODULE}
                                                index={index}
                                                Moduled={Moduled}
                                                collapsed={collapsed}
                                            >
                                                <Moduled
                                                    mobxTabsData={mobxTabsData}
                                                    minHeight={height - 15}
                                                    index={index}
                                                    mykey={key}
                                                    activeKey={activeKey} />
                                            </Content>
                                        </Tabs.TabPane>
                                    )
                                })
                            }
                        </Tabs>
                    </div>
                }
            </Layout>
        )
    }
}
