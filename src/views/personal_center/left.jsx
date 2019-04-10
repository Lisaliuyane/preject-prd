import React, { Component } from 'react'
import { inject, observer } from "mobx-react"
import { Menu, Button, Icon, Input, message, Popconfirm  } from 'antd'
import './index.less'
const Search = Input.Search
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

// @inject('mobxWordBook') 
@inject('rApi')
class LeftView extends Component {
    state = {
    }
    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        // this.initData(props)
    }
    componentDidMount() {

    }

    onClickMenu = (item) => {
        //console.log('onSelect', item.key)
        this.props.selectedOrigeData(item)
    }
    render() { 
        let { 

        } = this.state
        return (
            <div className="left_nav_wrapper" style={{marginRight: 25}}>
                <div style={{background: '#fff', minHeight: 300, padding: '10px 15px'}}>
                <Menu
                    mode="inline"
                    openKeys={this.state.openKeys}
                    onOpenChange={this.onOpenChange}
                    defaultSelectedKeys={['2']}
                >
                    <Menu.Item onClick={this.onClickMenu} key="1">个人资料</Menu.Item>
                    <Menu.Item onClick={this.onClickMenu} key="2">修改密码</Menu.Item>
                    {/* <Menu.Item key="3">Option 3</Menu.Item>
                    <Menu.Item key="4">Option 4</Menu.Item> */}
                </Menu>
                </div>
            </div>
        )
    }
}
 
export default LeftView;
