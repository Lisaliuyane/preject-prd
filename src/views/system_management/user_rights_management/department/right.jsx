import React, { Component } from 'react';
import { Table, Button, Icon, Form, Input, Tabs, Select, Tree, message } from 'antd'
import { DragSource, DropTarget } from 'react-dnd'
import { inject, observer } from "mobx-react"
import WithDragDropContext from '@src/libs/share_HTML5Backend'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { Row, Col } from '@src/components/grid'
import Contacts from './contacts'
const { TextArea } = Input
const TabPane = Tabs.TabPane
const Option = Select.Option
const TreeNode = Tree.TreeNode

// @inject('mobxWordBook')
@inject('rApi')  
class DragSortingTable extends Component {

    state = {
        code: null, //部门代码
        desc: null, //部门描述
        id: 0,
        path: [],
        subs: [],
        title: null, //部门名称
        contacts: [], //部门成员信息
        expandedKeys: ['0-0-0', '0-0-1'],
        autoExpandParent: true,
        checkedKeys: ['0-0-0'],
        selectedKeys: [],
        roleDate: [],//部门角色数据
        roleValue: [], //
        permissionData: [] //权限数据列表
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
    }
    componentDidMount(){
      this.props.rApi.getPermission().then(d => {
          //console.log('getPermission', d)
          if(d) {
              this.setState({
                permissionData: d
              })
          }
      }).catch()
    }

    componentWillReceiveProps(nextProps) { //根据LeftView选中值去渲染RightView值
        //checkOrigeData父组件传过来的值 => LeftView选中值
        let checkOrigeData = nextProps.checkOrigeData
        //console.log('componentWillReceiveProps', checkOrigeData)
        this.setState({
            code: checkOrigeData.code,
            title: checkOrigeData.title,
            desc: checkOrigeData.desc,
            id: checkOrigeData.id,
            roleValue: []
        })
        this.getRoleData(checkOrigeData.id)
        this.getOrigeUsersList(checkOrigeData.id)
    }

    getRoleData = (organId) => { //获取部门角色列表
        this.props.rApi.getRole({
            organid: organId
          }).then(d=> {
             //console.log('getRole',d)
             if(d) {
                 this.setState({
                    roleDate: d.list
                 })
             }
          }).catch()
    }

    getOrigeUsersList = (id) => {
        this.props.rApi.getUsers({
            organid: id
        }).then(d => {
            //console.log('getOrigeUsersList', d)
            if(d) {
                this.setState({
                    contacts: (d.list && d.list.length > 0) ? d.list : []
                })
            }
        }).catch()
    }
    actionDone = () => {
        const { parent } = this.props
        if (parent.searchCriteria) {
            parent.searchCriteria()
        }
        message.success('操作成功！')
    }

    saveSubmit = () => {
        let {
            code,
            title,
            desc,
            id
        } = this.state
        // let contacts = this.refs.contacts.logData()
        if(!code || !title) {
            message.error('必填项不能为空')
            return false
        }
        this.props.rApi.editOrganization({
            code,
            title,
            desc,
            id
        }).then(d => {
            this.actionDone()
            this.props.reLoad([id.toString()], {id, code, title, desc}) //重新请求LeftView数据
        }).catch()
    }

    handleChange = (value) => {
        //console.log(`selected ${value}`);
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

    onCheck = (checkedKeys) => {
        //console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    }

    onSelect = (selectedKeys, info) => {
        //console.log('onSelect', info);
        this.setState({ selectedKeys });
    }

    treeNode = (preitem, i) => {
        i++
        return (
            <TreeNode title={preitem.name} key={preitem.id} >
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
    render() {
        const children = [];
            for (let i = 10; i < 36; i++) {
            children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
            }
        let {
            code, //部门代码
            desc, //部门描述
            id,
            path,
            subs,
            title, //部门名称
            contacts,
            permissionData, //权限数据列表
            roleDate, //部门角色列表
            roleValue
        } = this.state
        //console.log('roleDate', roleValue)
        return (
            <div className="right_wrapper" style={{ padding: '10px', maxWidth: '700px', width: '100%', minHeight: '300px', background: 'white' }}>
                <div className="flex flex-vertical-center" style={{borderBottom: '1px solid #eee', paddingBottom: 8}}>
                    <div style={{ marginLeft: '5px' }}>
                       <span>查看明细</span>
                     </div>
                    <div className="flex1" style={{ textAlign: 'right' }}>
                        <FunctionPower power={this.props.EDIT_DATA}>
                            <Button onClick={this.saveSubmit} style={{ marginRight: 10 }}><Icon type="save" />保存</Button>
                        </FunctionPower>
                    </div>
                </div>
                <Form layout='inline'>
                    <div style={{padding: '0 60px 8px 20px', borderBottom: '3px solid #eee'}}>
                        <Row gutter={24}>
                            <Col isRequired label="部门代码" span={10} >
                                <Input 
                                    //defaultValue={code ? code : ''}
                                    value={code ? code : ''}
                                    placeholder="" 
                                    onChange={e => {
                                        this.setState({
                                            code: e.target.value
                                            })
                                        }
                                    }
                                />
                            </Col>
                            <Col isRequired label="部门名称" span={10}>
                                <Input 
                                    //defaultValue={title ? title : ''}
                                    value={title ? title : ''}
                                    placeholder="" 
                                    onChange={e => {
                                        this.setState({
                                            title: e.target.value
                                            })
                                        }
                                    }
                                />
                            </Col>
                        </Row>  
                        <Row gutter={24}>
                            <Col label="部门描述" span={24} propsStyle={{alignItems: 'start'}}>
                                <TextArea 
                                    //defaultValue={desc ? desc : ''}
                                    value={desc ? desc : ''}
                                    placeholder="" 
                                    autosize={{ minRows: 2, maxRows: 2 }}
                                    onChange={e => {
                                        this.setState({
                                            desc: e.target.value
                                         })
                                        }
                                    }
                                />
                            </Col>
                        </Row>  
                    </div>
                    <div className="tabs_wrapper" style={{padding: '0 10px'}}>
                        <Tabs defaultActiveKey="1" onChange={this.callback}>
                                <TabPane tab="部门角色权限" key="1">
                                    <div style={{marginLeft: 12}}>
                                        <Row gutter={24} >
                                            <Col label="部门角色" span={22}>
                                                <Select
                                                    allowClear
                                                    mode="multiple"
                                                    style={{ width: '100%' }}
                                                    placeholder="选择角色"
                                                    defaultValue={roleValue}
                                                    onChange={this.handleChange}
                                                >
                                                    {
                                                        //children
                                                        roleDate ? roleDate.map(item => {
                                                            return(
                                                                <Option key={item.id}>{item.title}</Option>
                                                            )
                                                        }) : ''
                                                    }
                                                </Select>
                                            </Col>
                                        </Row>
                                        <Row gutter={24} >
                                            <Col label="部门权限" span={22} propsStyle={{alignItems: 'start'}}>
                                                <div style={{minHeight: 300, border: '1px solid #eee'}}>
                                                    <Tree
                                                    checkable
                                                    onExpand={this.onExpand}
                                                    expandedKeys={this.state.expandedKeys}
                                                    autoExpandParent={this.state.autoExpandParent}
                                                    onCheck={this.onCheck}
                                                    //checkedKeys={this.state.checkedKeys}
                                                    onSelect={this.onSelect}
                                                    //selectedKeys={this.state.selectedKeys}
                                                    >
                                                        {
                                                            //this.renderTreeNodes(treeData)
                                                            permissionData.map(preitem => {
                                                                return this.treeNode(preitem, 0)
                                                            })

                                                            }
                                                    </Tree>
                                                </div>
                                            {/* <Tree
                                                checkable
                                                onExpand={this.onExpand}
                                                expandedKeys={this.state.expandedKeys}
                                                autoExpandParent={this.state.autoExpandParent}
                                                onCheck={this.onCheck}
                                                checkedKeys={this.state.checkedKeys}
                                                onSelect={this.onSelect}
                                                selectedKeys={this.state.selectedKeys}
                                            >
                                                {this.renderTreeNodes(treeData)}
                                            </Tree> */}
                                            </Col>
                                        </Row>
                                    </div>
                                </TabPane>
                                <TabPane tab="部门成员" key="2">
                                    <Contacts 
                                        data={contacts} 
                                        ref='contacts'
                                    />
                                </TabPane>
                        </Tabs>
                    </div>
                </Form>
            </div>
        );
    }
}

const RightView = WithDragDropContext(DragSortingTable);
export default RightView;