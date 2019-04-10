import React, { Component, Fragment } from 'react'
import { inject } from 'mobx-react'
import { Popconfirm, Menu, Spin, Icon } from 'antd'

@inject('mobxDataBook')
export default class TabAddButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            menuList: [],
            selectedKeys: [],
            loading: false
        }
    }

    /* 隐藏执行 */
    hide() {
        this.setState({
            selectedKeys: []
        })
    }

    /* 获取数据 */
    async getList() {
        const { mobxDataBook } = this.props
        await this.setState({loading: true})
        mobxDataBook.initData('特殊业务')
            .then(res => {
                let menuList = [...res]
                this.setState({ menuList, loading: false })
            })
            .catch(err => {
                console.log(err)
                this.setState({ loading: false })
            })
    }

    meneSelect = ({ item, key, selectedKeys }) => {
        // console.log('s', selectedKeys)
        this.setState({ selectedKeys })
    }

    titleContent = () => {
        const { menuList, selectedKeys, loading } = this.state
        if (loading) {
            return (
                <Spin
                    tip="数据载入中" 
                    size="small"
                />
            )
        }
        return (
            <Menu
                selectedKeys={selectedKeys}
                onSelect={this.meneSelect}
            >
                {
                    menuList.length && menuList.map(item => {
                        return (
                            <Menu.Item
                                key={item.id}
                            >
                                {item.title}
                            </Menu.Item>
                        )
                    })
                }
            </Menu>
        )
    }

    /* 显示隐藏的回调 */
    visibleChange = (flag) => {
        if (flag) {
            this.getList()
        } else {
            this.hide()
        }
    }

    /* 确定 */
    onConfirm = (e) => {
        const { handleConfirm, handleDelete } = this.props
        const {
            selectedKeys,
            menuList
        } = this.state
        if (selectedKeys.length < 1) {
            return
        }
        let target = menuList.find(item => item.id === parseInt(selectedKeys[0], 10))
        target.tabTitle = (
            <Fragment>
                {target.title}
                <Icon
                    type="close"
                    theme="outlined"
                    style={{ marginLeft: 6 }}
                    onClick={e => {
                        e.stopPropagation()
                        if (handleDelete) {
                            handleDelete(target)
                        }
                    }}
                />
            </Fragment>
        )
        if (handleConfirm) {
            handleConfirm(target)
        }
    }

    render() {
        const { parent } = this.props
        return (
            <Popconfirm
                overlayClassName='ipopconfirm-tabplus'
                placement="bottomLeft"
                icon={null}
                getPopupContainer={() => parent}
                title={this.titleContent()}
                onConfirm={this.onConfirm}
                onVisibleChange={this.visibleChange}
                okText="确定"
                cancelText="取消"
            >
                <span style={{ display: 'block', width: 40, margin: '0 -16px', textAlign: 'center' }}>+</span>
            </Popconfirm>
        )
    }
}