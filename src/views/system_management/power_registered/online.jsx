import React, { Component } from 'react'
import { inject, observer } from "mobx-react"
import { Button, Tree, message } from 'antd'
import { cloneObject } from '@src/utils'

import AllPower from '@src/libs/power.json'

const TreeNode = Tree.TreeNode
// let allPower = cloneObject(AllPower)

@inject('rApi')
@inject('mobxTabsData')
class Online extends Component {

    state = {
        allPower: cloneObject(AllPower),
        permissions: []
    }

    constructor(props) {
        super(props);
        // console.log('AllPower', AllPower)
    }

    registerPower = () => {
        const { rApi } = this.props
        let power = cloneObject(this.state.allPower)
        power = JSON.stringify(power)
        power = this.idToCode(power)
        // console.log('registerPower', power)
        rApi.powerRegistered(power).then((result) => {
            console.log('result', result)
            message.success('注册成功！')
        }).catch((err) => {

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
        console.log('idToCode', s)
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
    }

    isCanDrag = (dragNode, dropNode) => {
        let dragType = dragNode.type
        let dropType = dropNode.type
        // if ((dragType === 'category' || dragType === 'menu') && dropType !== 'category') {
        //     return false
        // }
        // if (dragType === 'view')

        return true
    }

    onDrop = (info) => {
        let dragNode = info.dragNode.props.data
        let dropNode = info.node.props.data
        const dropKey = info.node.props.eventKey;
        const dragKey = info.dragNode.props.eventKey;
        const dropPos = info.node.props.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
        let is = this.isCanDrag(dragNode, dropNode)
        if (!is) return
        console.log('dropPosition', dropPosition)
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

    render() {
        const { allPower, permissions } = this.state
        return (
            <div style={{ padding: 10 }}>
                <p>
                    <Button onClick={this.registerPower}>重新注册</Button>
                </p>

                <div>
                    <div>
                        <Tree
                        // checkable
                            draggable
                            onDragEnter={this.onDragEnter}
                            onDrop={this.onDrop}
                            onExpand={this.onExpand}
                            // expandedKeys={this.state.expandedKeys}
                            // autoExpandParent={this.state.autoExpandParent}
                            // onCheck={this.onCheck}
                            // checkedKeys={checkedKeys}
                            onSelect={this.onSelect}
                        // selectedKeys={this.state.selectedKeys}
                        >
                            {
                                //this.renderTreeNodes(treeData)
                                allPower ? allPower.map(preitem => {
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

export default Online;