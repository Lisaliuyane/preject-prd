import React, { PureComponent } from 'react'
import { icons, plusMenus } from './sider'
import { Layout, Menu, Icon } from 'antd'
import IIcon from '@src/components/icon'
import { initShowTab } from '@src/config'
import logo from '@src/libs/img/logo.png'

const { Sider } = Layout
const { Header } = Layout;
const { SubMenu } = Menu

export default class Sidebar extends PureComponent {

    state = {
        openKeys: [],
        navs: [], //导航菜单
    }

    constructor(props) {
        super(props)
        const { mobxBaseData } = props
        let navs = mobxBaseData.navs ? mobxBaseData.navs.slice().sort((curr, next) => curr.sort && next.sort ? curr.sort - next.sort : 0) : []
        navs = [...navs, ...plusMenus]
        this.state.navs = navs
    }

    componentDidMount() {
        initShowTab(this.props.mobxTabsData)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.collapsed !== this.props.collapsed && nextProps.collapsed) {
            this.setState({
                openKeys: []
            })
        }
    }

    onOpenChange = (openKeys) => { //展开一个另一个收缩
        if (openKeys && openKeys[openKeys.length - 1] && openKeys[openKeys.length - 1] === 'HOME') {
            this.menuClick({
                key: 'HOME'
            })
            return
        }
        this.rootSubmenuKeys = this.state.navs.map(item => item.code)
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys })
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : []
            })
        }
    }

    // 菜单点击事件
    menuClick = (e) => {
        let { mobxTabsData } = this.props
        if (e.key !== 'HOME') {
            try {/* 自定义超链接菜单 */
                let target = JSON.parse(e.key)
                if (target.doType === 'outerChain') {
                    window.open(target.url, "_blank")
                }
            } catch (err) {
                mobxTabsData.pushNewTabs({
                    component: e.key,
                    key: e.key
                })
            }
        } else {
            mobxTabsData.showHomeTab()
        }
    }

    // 侧边栏导航菜单渲染
    renderMenu = (menus) => {
        const { collapsed } = this.props
        return menus.map(menu => {
            let code = menu.code || menu.id
            if (menu.code === 'APP_PDA' || (menu.code === 'WORD_BOOK' && menu.children.length < 1)) {
                return null
            }
            if (menu.children && menu.children.length > 0 && menu.type !== 'menu' && menu.type !== 'menu_hide') {
                return (
                    <SubMenu
                        key={code}
                        title={
                            <span>
                                {
                                    menu.doType === 'outerChain' ? <IIcon type={icons[menu.code]} style={{marginRight: '12px'}} /> : icons[menu.code] ?
                                    <i className='anticon'><img className="nav-m-icon-s" src={icons[menu.code]} /></i> 
                                    : null }
                                <span title={menu.name}>
                                        {menu.name}
                                </span>
                            </span>
                        }
                    >
                        {
                            this.renderMenu(menu.children.sort((curr, next) => curr && next ? curr.sort - next.sort : 0))
                        }
                    </SubMenu>
                )
            } else if (menu.type === 'menu') {
                if (menu.code === 'HOME') {
                    return (
                        <Menu.Item className='home-menu-item' key={menu.doType === 'outerChain' ? JSON.stringify(menu) : menu.code}>
                            {
                                menu.doType === 'outerChain' ? <IIcon type={icons[menu.code]} style={{marginRight: '12px'}} /> : icons[menu.code] ? <i className='anticon'><img className="nav-m-icon-s" src={icons[menu.code]} /></i> : null
                            }
                            <span title={menu.name}>
                                {
                                    menu.name
                                }
                            </span>
                        </Menu.Item>
                    )
                }
                return (
                    <Menu.Item style={{ marginBottom: 4 }} key={menu.doType === 'outerChain' ? JSON.stringify(menu) : code}>
                        {
                            menu.doType === 'outerChain' ? <IIcon type={icons[menu.code]} style={{marginRight: '12px'}} /> : icons[menu.code] ? 
                            <i className='anticon'><img className="nav-m-icon-s" src={icons[menu.code]} /></i> 
                            : null
                        }
                        <span title={menu.name}>{menu.name}</span>
                    </Menu.Item>
                )
            }
        })
    }

    render() {
        const { collapsed, siderWidth } = this.props
        const { openKeys, navs } = this.state
        const logoUrl = localStorage.getItem('logo')
        const platformName = localStorage.getItem('platformName')
        return (
            <Sider
                className={'paper-1 home-left-sider'}
                width={siderWidth}
                collapsedWidth={siderWidth}
                collapsed={collapsed}
            >
                {/* <Header className="flex header paper-1-1 flex-vertital-center">
                    <div className="logo">
                        <img alt='logo' style={{ maxWidth: 60 }} src={logoUrl ? logoUrl : logo} />
                    </div>
                    {
                        !collapsed && <div style={{ marginLeft: 10 }} className="flex1">
                            <h3 style={{ color: '#ccc', margin: 0 }}>{platformName}</h3>
                        </div>
                    }
                </Header> */}
                <Menu
                    className='tree-menu'
                    mode="inline"
                    selectable={false}
                    inlineCollapsed={collapsed}
                    openKeys={openKeys}
                    onClick={this.menuClick}
                    onOpenChange={this.onOpenChange}
                >
                    {
                        this.renderMenu(navs)
                    }
                </Menu>
            </Sider>
        )
    }
}