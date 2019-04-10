import React, { Component } from 'react'
import Modal from '@src/components/modular_window'
import { 
    Button, 
    Form, 
    Checkbox, 
    message, 
    // Icon, 
    Tabs, 
    Tree, 
    Table, 
    // Cascader, 
    Spin } from 'antd'
// import RemoteSelect from '@src/components/select_databook'
import { Row, Col } from '@src/components/grid'
import moment from 'moment'
import { inject } from "mobx-react"
import { isArray } from '@src/utils'
import './addoredit.less'
// const ModularParent = Modal.ModularParent
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
        userName: null, //用户姓名
        tableTitle: null, //表头名
        roleid: null, //角色id
        roles: [], //角色
        roleData: [], //角色配置数据
        options : [], //部门列表
        permissions: [], //权限分配
        permissionData: [], //权限数据列表
        dataSource: [], //列表数据
        size: 'middle',
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
        tableShow: false,
        selectedRowKeys: [],
        roleIdToPower: {},
        loading: false
    }

    constructor(props) {
        super(props);
        if (props.getThis) {
            props.getThis(this)
        }
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
        this.props.rApi.getOrganization().then((res) => {
            if(res) {
                // console.log('部门数据', res)
                let optionsData = res.map((nodes) => {
                    return this.organizationToTree(nodes)
                })
                this.setState({
                    options: optionsData
                })
                this.state.options.unshift({id: -1, label: '全部', value: -1})
            }
        }).catch(e => {
            console.error('getOrganization error', e)
        })
        // this.getRoleData(-1)
        this.props.rApi.getPermission().then(d => {
            //console.log('getPermission', d)
            if(d) {
                this.setState({
                  permissionData: d
                })
            }
        }).catch(e => {
            console.error('getPermission error', e)
        })

      }
  
      organizationToTree(nodes) {
          nodes.label = nodes.title
          nodes.value = nodes.id
          nodes.children = nodes.subs
          if (!nodes.children || (nodes.children && nodes.children.length < 1)) {
              delete nodes.children
              delete nodes.subs
              return nodes
          } else {
              delete nodes.subs
              return {
                  ...nodes,
                  children: nodes.children.map(item => this.organizationToTree(item))
              }
          }
      }

      getRoleData = (uid) => {
        //let unitId = uid ? uid : -1
        const { rApi } = this.props
        this.setState({
            loading: true
        })
        rApi.getRole({
            keyword: '', //关键字
            limit: 9999,
            offset: 0
        }).then(d => {
            if(d.list && d.list.length > 0){
                if (uid === -1) {
                    this.setState({
                        roleData: d.list.map(item => {
                            let obj ={ id: item.id, label: item.title, value: item.id}
                            return obj
                        })
                    })
                } else {
                    this.setState({
                        roleData: d.list.filter(item => item.organization && item.organization.id && item.organization.id === uid).map(d => {
                            let obj ={ id: d.id, label: d.title, value: d.id}
                            return obj
                        })
                    })
                }
            }
            this.setState({
                loading: false
            })
        })
    }
    
    getPermissionsId = (data, handeData, callBack) => {
        if (data.children && data.children.length > 0) {
            data.children.map(item => {
                return this.getPermissionsId(item, handeData, callBack)
            })
        } else {
            handeData.push(data.id.toString())
            callBack(handeData)
        }
    }

    getPermissionList = (id) => { //获取权限列表
        this.props.rApi.getUserPermission({
            id: id
        }).then(d => {
            // console.log('getPermissionList', d)
            let arry = []
            if (d && d.permissions.length > 0) {
                d.permissions.forEach(item => {
                    this.getPermissionsId(item, [], ids => {
                        arry.push(...ids)
                    })
                })
            }
            this.setState({
                checkedKeys: [...new Set(arry)],
                roles: (d && d.roles.length > 0) ? d.roles.map( d => {
                    this.getRolePermission({ roleid: d.id })
                    return d.id
                }) : []
            })
        }).catch()
    }
    //componentDidMount () {
        // this.props.rApi.getRole({
        //     keyword: '', //关键字
        //     limit: 9999,
        //     offset: 0
        // }).then(d => {
        //     console.log('role', d.list)
        //     this.setState({
        //         roleUnitData: d.list && d.list.length > 0 ? d.list.organization.map(item => {
        //             return item.title
        //         })
        //         :
        //         []
        //     })
            
        // }).catch(e => {})
        
   // }
    changeOpen = (state) => {
        this.setState({
            open: state
        })
        if (!state) {
            this.clearValue()
        }
    }

    
    show(d) {
        // this.getRoleData(-1)
        this.getPermissionList(d.data.id)
        // if (d.edit) {
        //     this.setState({
        //         type: 1,
        //         title:'编辑车辆',
        //     })
        // } else if (d.data) {
        //     this.setState({
        //         type: 2,
        //         title:'查看车辆',
        //     })
        // } else {
        //     this.setState({type: 3,title:'新建车辆'})
        //     //console.log('新建')
        // }
        this.getRoleData(d.data && d.data.organization && d.data.organization.id ? d.data.organization.id :  -1)
        this.setState({
            ...d.data,
            roleid: d.data.id,
            userName: d.data.username,
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
            roleid: null, //角色id
            roles: [], //角色
            //roleData: [],
            permissions: [], //权限分配
            dataSource: [], //列表数据
            size: 'middle',
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            selectedRowKeys: [],
            userName: null, //用户名
            tableTitle: null, //表头名
        })
    }

    saveSubmit = () => {
        let { rApi } = this.props
        let { 
            roleid, //角色id
            roles, //角色
            permissions, //权限分配
           } = this.state

        this.props.rApi.accountAuthorize({
            id: roleid,
            roles,
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
    changedemo = (time) => {
        console.log('time',moment(time).format('YYYY-MM-DD h:mm:ss'))
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
        // console.log('onCheck', checkedKeys, e);
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

    changeDepartment = (value) => {
        // console.log('organid', value)
        let unitId = value[value.length-1]
        this.getRoleData(unitId)
    }

    handleChangeCheckedKeys = (record, is) => {
        let { checkedKeys } = this.state
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

    treeNode = (preitem, i) => {
        i++
        const { roles, roleIdToPower } = this.state
        let bindRole = {}
        roles.forEach(ele => {
            if (roleIdToPower[ele] && isArray(roleIdToPower[ele])) {
                roleIdToPower[ele].forEach(item => {
                    bindRole[item] = true
                })
            }
        })
        // if (bindRole[preitem.id]) {
        //     console.log('bindRole', bindRole, roleIdToPower, roles, preitem)
        // }
        return (
            <TreeNode 
            // disableCheckbox={bindRole[preitem.id]} 
            title={preitem.name} 
            key={preitem.id}  
            type={preitem.type} 
            childrenData={preitem.children}>
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

    getRolePermission = (parms) => {
        const { rApi } = this.props
        let { roleIdToPower } = this.state
        return new Promise((resolve, reject) => {
            rApi.getRolePermission(parms).then(d => {
                d = d || []
                let array = d.map(item => item.id.toString())
                roleIdToPower[parms.roleid] = array
                this.setState({roleIdToPower: roleIdToPower})
                resolve(array)
            }).catch(e => {
                reject(e)
            })
        })
    }

    addRolesToUser = (parms) => {
        let { checkedKeys, roleIdToPower } = this.state
        const dealCheckedKeys = (list) => {
            checkedKeys.push(...list)
            let tem = new Set(checkedKeys)
            this.setState({
                checkedKeys: [...tem]
            })
        }
        for (let id of parms) {
            if (roleIdToPower[id] && roleIdToPower[id].length > 0) {
                dealCheckedKeys(roleIdToPower[id])
            } else {
                this.getRolePermission({roleid: id}).then(d => {
                    d = d || []
                    dealCheckedKeys(d)
                })
            }
        }
    }

    deleteRolesToUser = (parms) => {
        let { checkedKeys, roleIdToPower } = this.state
        const dealCheckedKeys = (lists) => {
            checkedKeys = checkedKeys.filter(item => {
                for (let id of lists) {
                    if (item === id) {
                        return false
                    }
                }
                return true
            })
            checkedKeys = new Set(checkedKeys)
            this.setState({
                checkedKeys: Array.from(checkedKeys) //checkedKeys
            })
        }
        for (let id of parms) {
            if (roleIdToPower[id] && roleIdToPower[id].length > 0) {
                dealCheckedKeys(roleIdToPower[id])
            } else {
                this.getRolePermission({roleid: id}).then(d => {
                    dealCheckedKeys(d)
                })
            }
        }
    }

    onChangeUnit = (value) => {
        let { checkedKeys, roles, roleIdToPower } = this.state
        //console.log('onChangeUnit', value, value[value.length-1])
        let combs = [...new Set([...roles, ...value])]
        let newkeys = combs.filter(item => {
            for (let ele of roles) {
                if (item === ele) {
                    return false
                }
            }
            return true
        })

        let deletekeys = combs.filter(item => {
            for (let ele of value) {
                if (item === ele) {
                    return false
                }
            }
            return true
        })

        //console.log('newkeys deletekeys', newkeys, deletekeys)

        this.setState({
            roles: value,
            // roles: value
        })
        // let id =  value[value.length - 1]
        // if (!id) {
        //     return
        // }
        console.log('combs', combs, value, newkeys, deletekeys)
        this.addRolesToUser(newkeys)
        this.deleteRolesToUser(deletekeys)
    }
    render() { 
        let { 
            tableShow,
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
            roles
           } = this.state

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
        };
        // console.log('selectedRowKeys', checkedKeys)
        return (
            <Modal
                onSubmit={this.onSubmit}
                style={{width: '95%', maxWidth: 1000, minHeight: 300}}
                changeOpen={this.changeOpen} 
                open={this.state.open} 
                title={title} 
                >
                <Spin spinning={this.state.loading}> 
                    <div style={{minHeight: 272}}>
                        <Form layout='inline'>
                            <Modal.Header title={`用户姓名: ${userName}`}>
                                <Button icon='save' onClick={this.saveSubmit} >
                                    保存
                                </Button>
                            </Modal.Header>
                            <div style={{padding: '10px 10px 10px 15px'}}>
                                {/* <Row gutter={24}>
                                    <Col  label="角色配置" span={6}>
                                        <Cascader 
                                            defaultValue={[-1]}
                                            placeholder="选择部门" 
                                            options={options} 
                                            onChange={this.changeDepartment} 
                                            changeOnSelect 
                                        />
                                    </Col>
                                </Row> */}
                                <Row gutter={24} style={{margin: '10px 0 30px 29px'}}>
                                    <Col span={24}>
                                        <CheckboxGroup
                                            //value={combackUnit ? combackUnit : []}
                                            //defaultValue={[5, 6, 9, 10, 11]}
                                            value={roles ? roles : []}
                                            defaultValue={roles ? roles : []}
                                            options={roleData} 
                                            onChange={this.onChangeUnit} 
                                        />
                                    </Col>
                                </Row>
                                <Tabs type="card">
                                    <TabPane forceRender tab="功能权限配置" key="功能权限配置">
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
                                                        permissionData ? permissionData.map(preitem => {
                                                            return this.treeNode(preitem, 0)
                                                        }) : ''
                                                    }
                                            </Tree>
                                            </div>
                                            <div style={{flex: 1, marginLeft: '20px'}}>
                                                <div style={{marginBottom: '10px'}} >{tableTitle}</div>
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
                                    </TabPane>
                                    <TabPane forceRender tab="数据权限配置" key="数据权限配置">
                                        {/* <Tabs type="card">
                                            <TabPane forceRender tab="客户数据" key="客户数据">111</TabPane>
                                            <TabPane forceRender tab="项目数据" key="项目数据">222</TabPane>
                                            <TabPane forceRender tab="仓库数据" key="仓库数据">333</TabPane>
                                            <TabPane forceRender tab="财务数据" key="财务数据">444</TabPane>
                                        </Tabs>  */}
                                    </TabPane>
                                </Tabs>
                            </div>
                        </Form>
                    </div>
                </Spin>
            </Modal>
        )
    }
}
 
export default AuthOrize;