import React, { Component } from 'react'
import { inject, observer } from "mobx-react"
import { Menu } from 'antd'
import { id as power } from './power'

const SubMenu = Menu.SubMenu

@inject('mobxWordBook', 'mobxBaseData')
@observer
class LeftView extends Component {
    state = {}
    constructor(props) {
        super(props)
        if (props.getRef) {
            props.getRef(this)
        }
       
        this.initData(props)
    }

    refresh = () => {
        let { mobxWordBook } =  this.props
        mobxWordBook.refreshWordBookData()
        this.initData()
    }

    initData = (props) => {
        let { mobxWordBook, mobxBaseData } = props || this.props
        let { types } = mobxWordBook
        try {
            types = mobxBaseData.permissions[power.id].children.slice()[0].children.slice()
        } catch (e) {
            types = []
        }
        let activeType = types && types.length > 0 ? types[0].children[0].url : ''
        // console.log('initData', types[0], activeType)
        this.onSelect({key: activeType}, props)
    }

    onSelect = (e, props) => {
        if (e.key === 'null') {
            return
        }
        let { mobxWordBook, changeType } = this.props || props
        // console.log('onSelect', e, e.key)
        mobxWordBook.setSelectType(e.key)
        changeType(e.key)
    }

    render() { 
        let { mobxWordBook, type, mobxBaseData } = this.props
        //console.log(mobxWordBook)
        let { types } = mobxWordBook
        //let activeType = type
        // console.log('mobxBaseData',  mobxBaseData.permissions[power.id])
        // types = types.slice()
        try {
            types = mobxBaseData.permissions[power.id].children.slice()[0].children.slice()
        } catch (e) {
            types = []
        }
        let activeType = types && types.length > 0 ? types[0].children[0].url : ''
        return (
            <div>
                <Menu
                    onSelect={this.onSelect}
                    //selectedKeys={[activeType]}
                    defaultSelectedKeys={[activeType]}
                    defaultOpenKeys={(types && types.length > 0 && types[0].text) ? [types[0].text] : []}
                    mode="inline"
                    style={{ width: 190, marginRight: 20 }}
                >
                    {
                        types.map((preitem, index) => {
                            return (
                                <SubMenu key={preitem.name} title={<span><span>{preitem.name}</span></span>}>
                                    {
                                        preitem.children.slice().map(item => {
                                            item = (
                                                <Menu.Item key={item.url}>{item.name}</Menu.Item>
                                            )
                                            return item
                                        })
                                    }
                                </SubMenu>
                            )
                        })
                    }
                </Menu>
            </div>
        )
    }
}
 
export default LeftView;
