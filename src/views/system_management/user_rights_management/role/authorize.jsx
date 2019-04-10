import React, { Component } from 'react'
import Modal from '@src/components/modular_window'
import { Button, Form, Checkbox, message, Icon, Tabs, Tree, Table, Cascader } from 'antd'
import RemoteSelect from '@src/components/select_databook'
import { Row, Col } from '@src/components/grid'
import moment from 'moment'
import { inject } from "mobx-react"
import { isArray } from '@src/utils'
import './addoredit.less'
const ModularParent = Modal.ModularParent
const CheckboxGroup = Checkbox.Group
const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode

@inject('rApi')
class AuthOrize extends Component {

    state = {
        open: false,
        edit: false,
        type: null,
        title: null,
        roleid: null, //角色id
        userName: null, //用户姓名
        tableTitle: null, //表头名
        permissions: [], //权限分配
        permissionData: [], //权限数据列表
        dataSource: [], //列表数据
        size: 'middle',
        expandedKeys: ['0-0-0', '0-0-1'],
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
        selectedRowKeys: [],
        tableShow: false,
       
    }

    constructor(props) {
        super(props);
        if (props.getThis) {
            props.getThis(this)
        }
        this.state.open = false
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                title: '资源名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                className: 'text-overflow-ellipsis',
                title: '资源类型',
                dataIndex: 'type',
                key: 'type',
            },
            {
                className: 'text-overflow-ellipsis',
                title: '资源地址',
                dataIndex: 'url',
                key: 'url',
            },
        ]
       
    }
    componentDidMount() {
        const { rApi } = this.props
        rApi.getPermission().then(d => {
            // console.log('getPermission', d)
            if(d) {
                this.setState({
                  permissionData: d
                })
            }
        }).catch()

    }

    getPermissionsId = (data, handeData, callBack) => {
        handeData.push(data.id.toString())
        if (data.children && data.children.length > 0) {
            data.children.map(item => {
                return this.getPermissionsId(item, handeData, callBack)
            })
        } else {
            callBack(handeData)
        }
    }

    getRolePermissionData = (id) => { //获取角色权限列表
        this.props.rApi.getRolePermission({
            roleid: id
        }).then(d => {
            let arry = []
            if (d && d.length > 0) {
                d.forEach(item => {
                    this.getPermissionsId(item, [], ids => {
                        arry.push(...ids)
                    })
                })
            }
            // console.log('getRolePermissionData', arry)
            this.setState({
                checkedKeys: arry
            })
        }).catch()
    }

    changeOpen = (state) => {
        this.setState({
            open: state
        })
        if (!state) {
            this.clearValue()
        }
    }

    
    show(d) {
        // console.log('权限分配', d.data, typeof(d.data.id))
        this.getRolePermissionData(d.data.id)
        
        this.setState({
            //...d.data,
            roleid: d.data.id,
            userName: d.data.title,
            title: '权限分配',
            open: true,
            edit: d.edit
        })
    }

    actionDone = () => {
        const { parent } = this.props
        if (parent.searchCriteria) {
            parent.searchCriteria()
        }
        this.changeOpen(false)
        message.success('操作成功！')
    }

    clearValue() {
        this.setState({
            userName: null,
            tableTitle: null, //表头名
            roleid: null, //角色id
            permissions: [], //权限分配
            dataSource: [], //列表数据
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            selectedRowKeys: []
        })
    }

    saveSubmit = () => {
        // let { rApi } = this.props
        let {
            roleid, //角色id
            permissions, //权限分配
        } = this.state
       
        this.props.rApi.roleGrant({
            roleid,
            permissions
        }).then(d => {
            this.actionDone()
        }).catch(e => {
            message.error(e.msg || '操作失败')
        })
        // if(this.state.type === 1) {
            
        // } else if(this.state.type === 2) {
        //     this.changeOpen(false)
        // } else if(this.state.type === 3) {
           
        // }
    }

    onExpand = (expandedKeys) => {
        //console.log('onExpand', arguments);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
          expandedKeys,
          autoExpandParent: false,
        });
      }
    onCheck = (checkedKeys, e) => { //选中值
        //console.log('onCheck', checkedKeys, e);
        this.setState({ 
            checkedKeys: checkedKeys,
            permissions: checkedKeys
         });
    }
    onSelect = (sKeys, info) => {
        let { selectedKeys, tableData } = this.state
        let infoData = info.node.props
        //console.log('onSelect', sKeys, info, infoData, infoData.childrenData);
        if(sKeys.length > 0) {
            this.setState({ 
                selectedKeys: sKeys
                //selectedRowKeys: sKeys ? sKeys.map(item => parseInt(item)) : []
             })
        }
        if(infoData.type === 'menu') { 
            // this.setState({
            //     dataSource: infoData.childrenData || [],
            //     tableTitle: infoData.title
            // })
            this.checkView(infoData.childrenData || [], infoData.title)
        }
       
    }

    checkView = (dataSource, tableTitle) => {
        this.setState({tableShow: false, dataSource: dataSource, tableTitle: tableTitle}, () => {
            this.setState({tableShow: true})
        })
    }

    treeNode = (preitem, i) => {
        i++
        return (
            <TreeNode title={preitem.name} key={preitem.id} type={preitem.type} childrenData={preitem.children}>
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
    
    handleChangeCheckedKeys = (record, is) => {
        let { checkedKeys } = this.state
        //console.log('record', record)
        if (isArray(record)) {
            if (is) {
                for(let item of record) {
                    checkedKeys.push(item.id.toString())
                }
            } else {
                checkedKeys = checkedKeys.filter(item => {
                    for (let itemid of record) {
                        // console.log('!(item === itemid.id || item === itemid.id.toString())', record, itemid.id, !(item === itemid.id || item === itemid.id.toString()))
                        for (let itempath of itemid.path) {
                            if (item === itempath || item === itempath.toString()) {
                                return false
                            }
                        }
                    }
                    return true
                })
            }
        } else {
            if (is) {
                checkedKeys.push(record.id.toString())
            } else {
                checkedKeys = checkedKeys.filter(item => {
                    for (let itempath of record.path) {
                        if (item === itempath || item === itempath.toString()) {
                            return false
                        }
                    }
                    return true
                })
            }
        }
        // console.log('checkedKeys', checkedKeys)
        this.setState({checkedKeys: checkedKeys})
    }
    
    render() { 
        let { 
            title,
            size,
            dataSource,
            columns,
            selectedRowKeys,
            selectedKeys,
            checkedKeys,
            options,
            roleData,
            permissionData, //权限数据列表
            tableData,
            userName,
            tableTitle,
            tableShow
        } = this.state
        // const treeData = [{
        //     title: '0-0',
        //     key: '0-0',
        //     children: [{
        //         title: '0-0-0',
        //         key: '0-0-0',
        //         children: [
        //             { 
        //                 title: '0-0-0-0',
        //                 key: '0-0-0-0',
        //                 children: [
        //                     { title: '0-0-0-0-0', key: '0-0-0-0-0' },
        //                     { title: '0-0-0-0-1', key: '0-0-0-0-1' },
        //                     { title: '0-0-0-0-2', key: '0-0-0-0-2' },
        //                 ]
        //             }
        //         ]
        //     }]
        // }];
        const rowSelection = {
            onSelect: (record, selected, selectedRows) => {
                this.handleChangeCheckedKeys(record, selected)
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                this.handleChangeCheckedKeys(changeRows, selected)
            },
            selectedRowKeys: checkedKeys ? checkedKeys.filter(item => {
                for (let ele of dataSource) {
                    if (ele.id === item || ele.id.toString() === item) {
                        return true
                    }
                }
                return false
            }) : []
        }
        // console.log('checkedKeys selectedRowKeys', checkedKeys, rowSelection)
        return (
            <Modal
                onSubmit={this.onSubmit}
                style={{width: '95%', maxWidth: 1000, minHeight: 300}}
                changeOpen={this.changeOpen} 
                open={this.state.open} 
                title={title} 
                >
                <div style={{minHeight: 272}}>
                    <Form layout='inline'>
                        <Modal.Header title={`用户姓名: ${userName}`}>
                            <Button icon='save' onClick={this.saveSubmit} >
                                保存
                            </Button>
                        </Modal.Header>
                        <div style={{padding: '10px 10px 10px 15px'}}>
                            <div style={{display: 'flex'}}>
                                <div style={{width: 270,  minHeight: '350px', border: '1px solid #eee'}}>
                                    <Tree
                                        checkable
                                        onExpand={this.onExpand}
                                        expandedKeys={this.state.expandedKeys}
                                        autoExpandParent={this.state.autoExpandParent}
                                        onCheck={this.onCheck}
                                        checkedKeys={checkedKeys}
                                        onSelect={this.onSelect}
                                        selectedKeys={this.state.selectedKeys}
                                        >
                                            {
                                                //this.renderTreeNodes(treeData)
                                                permissionData ? permissionData.map(preitem => {
                                                    return this.treeNode(preitem, 0)
                                                }) : ''
                                            }
                                    </Tree>
                                </div>
                                <div style={{flex: 1, marginLeft: '20px'}}>
                                    <div style={{marginBottom: '10px'}}>{tableTitle}</div>
                                    {
                                        tableShow ?
                                        <Table 
                                            rowSelection={rowSelection}
                                            columns={columns}
                                            dataSource={dataSource.map(item => {
                                                delete item.children 
                                                return item
                                            })}
                                            rowKey={(record, index) => {return record.id ? record.id.toString() : index}}
                                            pagination={false}
                                            size={size}
                                        />
                                        :
                                        null
                                    }
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
            </Modal>
        )
    }
}
 
export default AuthOrize;