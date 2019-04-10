import React, { Component } from 'react'
import { inject, observer } from "mobx-react"
import { Button, Tree, message } from 'antd'
import { cloneObject } from '@src/utils'

import AllPower from '@src/libs/power.json'

const TreeNode = Tree.TreeNode
// let allPower = cloneObject(AllPower)
let allId = {}
const sortPower = (powers) => {
    powers.sort((item, next) => item.sort && next.sort ? (item.sort - next.sort) : 0)
    powers.forEach(ele => {
        if (allId[ele.id]) {
            console.error('dup id', ele.id)
        }
        allId[ele.id] = ele
        if (ele.children) {
            sortPower(ele.children)
        }
    })
    return powers
}

let powers = sortPower(cloneObject(AllPower))

@inject('rApi')
@inject('mobxTabsData')
class PowerRegistered extends Component {

    state = {
        allPower: powers,
        permissions: [],
        loading1: false,
        loading2: false
    }

    constructor(props) {
        super(props);
        // console.log('AllPower', AllPower)
    }

    componentDidMount() {
        this.getOnlinePermission()
    }

    registerPower = () => {
        const { rApi } = this.props
        let power = cloneObject(this.state.allPower)
        power = JSON.stringify(power)
        power = this.idToCode(power)
        // console.log('registerPower', power)
        this.setState({loading1: true})
        rApi.powerRegistered(power).then((result) => {
            //console.log('result', result)
            message.success('注册成功！')
            this.setState({loading1: false})
        }).catch((err) => {
            this.setState({loading1: false})
            message.error('注册失败！')
        })
    }
    registerPowerOnline = () => {
        const { rApi } = this.props
        let power = cloneObject(this.state.permissions)
        // power = JSON.stringify(power)
        // power = this.idToCode(power)
        if (power.length < 0) {
            message.warning('线上导航数据请求为空请刷新重试！')
            return
        }
        // console.log('registerPower', power)
        this.setState({loading2: true})
        rApi.powerRegistered(power).then((result) => {
            //console.log('result', result)
            message.success('注册成功！')
            this.setState({loading2: false})
        }).catch((err) => {
            this.setState({loading2: false})
            message.error('注册失败！')
        })
    }

    getOnlinePermission = () => {
        const { rApi } = this.props
        rApi.getPermission().then(permissions => {
            this.setState({
                permissions: permissions
            })
        })
    }

    treeNode = (preitem, i) => {
        i++
        return (
            <TreeNode
                data={preitem}
                title={preitem.name}
                key={preitem.id}
                type={preitem.type}
            // childrenData={preitem.children}
            >
                {
                    preitem.children && preitem.children.length > 0 ?
                        preitem.children.map(item => {
                            return this.treeNode(item, i)
                        })
                        :
                        null
                }
            </TreeNode>
        )
    }

    idToCode = (s) => {
        s = s.replace(/\"id\"/g, '\"code\"')
        //console.log('idToCode', s)
        return JSON.parse(s)
    }

    onExpand = () => {
    }

    onSelect = (selectedKeys, event) => {
        // console.log('selectedKeys', selectedKeys, event)
        const { mobxTabsData } = this.props
        let type = event.node.props.type
        let key = event.node.props.eventKey
        // console.log('type key', type, key)
        if (type === 'menu') {
            mobxTabsData.pushNewTabs({
                component: key,
                key: key
            })
        }
        // mobxTabsData.pushNewTabs({
        //     component: 'POWER_REGISTERED',
        //     key: 'POWER_REGISTERED'
        // })
    }

    onDragEnter = (info) => {
        //console.log('onDragEnter info', info)
    }

    isCanDrag = (dragNode, dropNode) => {
        //console.log('isCanDrag', dragNode, dropNode)
        let dragType = dragNode.type
        let dropType = dropNode.type
        // if ((dragType === 'category' || dragType === 'menu') && dropType !== 'category') {
        //     return false
        // }
        // if (dragType === 'view')

        return true
    }

    onDrop = (info) => {
        //console.log('onDrop info', info)
        let dragNode = info.dragNode.props.data
        let dropNode = info.node.props.data
        const dropKey = info.node.props.eventKey;
        const dragKey = info.dragNode.props.eventKey;
        const dropPos = info.node.props.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
        let is = this.isCanDrag(dragNode, dropNode)
        if (!is) return
        // console.log('dropPosition', dropPosition)
        const loop = (data, key, callback) => {
            data.forEach((item, index, arr) => {
                if (item.id === key || item.code === key) {
                    return callback(item, index, arr);
                }
                if (item.children) {
                    return loop(item.children, key, callback);
                }
            })
        }
        const data = [...this.state.allPower]
        let dragObj
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1)
            dragObj = item
        })
        if (info.dropToGap) {
            let ar
            let i
            loop(data, dropKey, (item, index, arr) => {
                ar = arr
                i = index
            })
            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj)
            } else {
                ar.splice(i + 1, 0, dragObj)
            }
        } else {
            loop(data, dropKey, (item) => {
                item.children = item.children || []
                // where to insert 示例添加到尾部，可以是随意位置
                item.children.push(dragObj)
            })
        }
        this.setState({
            allPower: data
        })
    }

    onDrop1 = (info) => {
        //console.log('onDrop info', info)
        let dragNode = info.dragNode.props.data
        let dropNode = info.node.props.data
        const dropKey = info.node.props.eventKey;
        const dragKey = info.dragNode.props.eventKey;
        const dropPos = info.node.props.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
        let is = this.isCanDrag(dragNode, dropNode)
        if (!is) return
        const loop = (data, key, callback) => {
            data.forEach((item, index, arr) => {
                //console.log('item.id === key || item.code === key', item.id === key || item.code === key)
                if (item.id === key || item.id.toString() === key || item.code === key || item.code.toString() === key) {
                    return callback(item, index, arr);
                }
                if (item.children) {
                    return loop(item.children, key, callback);
                }
            })
        }
        const data = [...this.state.permissions]
        //console.log('dropPosition', dropPosition, data, info)
        let dragObj
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1)
            dragObj = item
        })
        if (info.dropToGap) {
            let ar
            let i
            loop(data, dropKey, (item, index, arr) => {
                ar = arr
                i = index
            })
            // console.log('ar', ar)
            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj)
            } else {
                ar.splice(i + 1, 0, dragObj)
            }
        } else {
            loop(data, dropKey, (item) => {
                item.children = item.children || []
                // where to insert 示例添加到尾部，可以是随意位置
                item.children.push(dragObj)
            })
        }
        this.setState({
            permissions: data
        })
    }

    render() {
        const { allPower, permissions, loading1, loading2 } = this.state
        return (
            <div style={{ padding: 10 }}>
                <div className='flex'>
                    <div style={{width: 600}}>
                        <h2>
                            本地 view Tree 结构
                        </h2>
                        <p>
                            <Button loading={loading1} onClick={this.registerPower}>重新注册</Button>
                        </p>
                        <Tree
                            draggable
                            onDragEnter={this.onDragEnter}
                            onDrop={this.onDrop}
                            onExpand={this.onExpand}
                            onSelect={this.onSelect}
                        >
                            {
                                allPower ? allPower.map(preitem => {
                                    return this.treeNode(preitem, 0)
                                }) : null
                            }
                        </Tree>
                    </div>
                    <div style={{width: 600}}>
                        <h2>
                            线上 view Tree 结构(拖拽修改调整显示顺序)
                        </h2>
                        <p>
                            <Button loading={loading2} onClick={this.registerPowerOnline}>修改导航显示顺序</Button>
                        </p>
                        <Tree
                            draggable
                            onDragEnter={this.onDragEnter}
                            onDrop={this.onDrop1}
                            onExpand={this.onExpand}
                            onSelect={this.onSelect}
                        >
                            {
                                //this.renderTreeNodes(treeData)
                                permissions ? permissions.map(preitem => {
                                    return this.treeNode(preitem, 0)
                                }) : null
                            }
                        </Tree>
                    </div>
                </div>
            </div>
        )
    }
}

export default PowerRegistered;