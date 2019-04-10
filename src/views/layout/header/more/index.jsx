import React, { Component } from 'react'
import { Menu, Dropdown, Icon, Avatar, Card } from 'antd'
import { inject, observer } from "mobx-react"
import { toUserInfo } from '../../to_page'
import './index.less'

@inject('mobxBaseData', 'mobxTabsData')
@observer
export default class More extends Component {

    state = {
        visable: false
    }
    logOut = (event) => {
        let { mobxBaseData, mobxTabsData } = this.props
        if (event.key === 'logout') {
            mobxBaseData.loginOut()
            mobxTabsData
            .closeAll()
        } else if (event.key === 'personal') {
            toUserInfo(mobxTabsData)
        } else if (event.key === 'userinfo') {
            
        }
    }

    onVisibleChange = (visable) => {
       this.setState({
           visable: visable
       })
    }

    render() {
        const {mobxBaseData} = this.props
        let { visable } = this.state
        let organizationName = localStorage.getItem('organizationName')
        const menu = (
            <Menu onClick={this.logOut}>
                <Menu.Item key='userinfo' className='userinfo'>
                    <dl>
                        <dt>{mobxBaseData.username ? mobxBaseData.username : ''}</dt>
                        <dd>{organizationName}</dd>
                    </dl>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key='personal'>
                    <div style={{ padding: '5px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div><Icon type="edit" /><span style={{ marginLeft: 10 }}>个人资料</span></div><Icon type="right" />
                    </div>
                </Menu.Item>
                <Menu.Item key='logout'>
                    <div style={{ padding: '5px 10px' }}>
                        <Icon type="logout" /> <span style={{ marginLeft: 10 }}>注销</span>
                    </div>
                </Menu.Item>
            </Menu>
        )
        // console.log('Menu', Menu)
        // console.log('Dropdown', Dropdown)
        return (
            <Dropdown trigger={['click']} overlay={menu} onVisibleChange={this.onVisibleChange}>
                <div className='right-bottom flex1' style={{ height: '50px', cursor: 'pointer' }}>
                        <span className="ant-dropdown-link">
                            {/* <Avatar size="default" icon="user" alt='用户信息' title={mobxBaseData.username} style={{cursor: 'pointer'}} /> */}
                            {mobxBaseData.username ? `${mobxBaseData.username} ` : ''}
                            <Icon type= 'down' className={visable ? 'icon-style' : 'icon-trans'} />
                        </span>
                </div>
            </Dropdown>
        )
    }
}