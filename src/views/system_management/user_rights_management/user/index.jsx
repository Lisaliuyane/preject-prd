import React from 'react'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { Button, Cascader, message } from 'antd'
import AddOrEdit from './addoredit'
import AuthOrize from './authorize'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { children, id } from './power'
import { deleteNull, trim } from '@src/utils'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import moment from 'moment'
// import Dragger from 'react-dragger-r'
const power = Object.assign({}, children, id)

// const TableHeaderChildren = (props) => {
//     return (
//         [
//             <FunctionPower key='AUTHORIZE' power={power.AUTHORIZE}>
//                 <Button onClick={props.onAuthorize} style={{marginRight: 10, verticalAlign: 'middle'}} icon="unlock">
//                     角色授权
//                 </Button>
//             </FunctionPower>
//         ]
//     )
// }

/**
 * 用户权限资源
 * 
 * @class AuthOrize
 * @extends {Component}
 */
@inject('mobxTabsData', 'mobxBaseData')
@inject('rApi')
@observer
class CarRes extends Parent {

    state = {
        organid: '', //部门id
        keyword: '', //关键字
        limit: 10,
        offset: 0,
        options : [], //部门列表
    }

    constructor(props) {
        super(props)
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                title: '用户账号',
                dataIndex: 'uid',
                key: 'uid',
                width: 150,
                render: (text, r, index) => { 
                    return(
                        <ColumnItemBox name={text} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '姓名',
                dataIndex: 'username',
                key: 'username',
                width: 150,
                render: (text, r, index) => {
                    return(
                        <ColumnItemBox name={text} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '性别',
                dataIndex: 'sex',
                key: 'sex',
                width: 80,
                render: (text, r, index) => {
                    let name = r.sex === 0 ? '男' : '女'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '部门',
                dataIndex: 'organization',
                key: 'organization',
                width: 200,
                render: (text, r, index) => {
                    let name = r.organization && r.organization.title
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '职位',
                dataIndex: 'position',
                key: 'position',
                width: 150,
                render: (text, r, index) => {
                    let name = r.position && r.position.title
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '联系方式',
                dataIndex: 'phonenum',
                key: 'phonenum',
                width: 120,
                render: (text, r, index) => {
                    return(
                        <ColumnItemBox name={text} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '邮箱',
                dataIndex: 'email',
                key: 'email',
                width: 180,
                render: (text, r, index) => {
                    return(
                        <ColumnItemBox name={text} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '出生年月',
                dataIndex: 'birthday',
                key: 'birthday',
                width: 120,
                render: (text, r, index) => {
                    let name = r.birthday ? moment(r.birthday * 1000).format('YYYY-MM-DD') : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '入职日期',
                dataIndex: 'indate',
                key: 'indate',
                width: 120,
                render: (text, r, index) => {
                    let name = r.indate ? moment(r.indate * 1000).format('YYYY-MM-DD') : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '是否在职',
                dataIndex: 'status',
                key: 'status',
                width: 80,
                render: (text, r, index) => {
                    let name = r.status === 0 ? '是' : '否'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                render: (text, r, index) => {
                    return(
                        <ColumnItemBox name={text} />
                    )
                }
            }
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
            }
        }).catch()
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
    
    onChangeValue = () => {
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    getData = (params) => {
        const { 
            organid, //
            keyword, //关键字
            limit,
            offset} = this.state
        params = Object.assign({}, { organid, limit, offset, keyword }, params)
        const { rApi } = this.props
        return new Promise((resolve, reject) => {
            params = params
            rApi[power.apiName](params).then(d => {
                // console.log('GET_LIST', d)
                resolve({
                    dataSource: d.list || [], 
                    total: d.total
                })
            }).catch(err => {
                reject(err)
            })
        })
    }
   
    customTableAction = ({text, record, index, onDeleteItem, onEditItem, DeleteButton}) => {
        //console.log('customTableAction', text, record, index)
        return [
            <FunctionPower key={'customTableAction1'} power={power.EDIT_DATA}>
                <span
                    className={`action-button`}
                    onClick={onEditItem}
                >
                    编辑
                </span>
            </FunctionPower>,
            <FunctionPower key={'customTableAction2'} power={power.DEL_DATA}>
                <DeleteButton action={onDeleteItem} />
            </FunctionPower>,
            <FunctionPower key={'customTableAction3'} power={power.PASSWORD_RESET}>
                <span
                    className={`action-button`}
                    onClick={() => this.passwordRest(record)}
                >
                    密码重置
                </span>
            </FunctionPower>,
            <FunctionPower key={'customTableAction4'} power={power.ACCOUNT_AUTHORIZE}>
                <span
                    className={`action-button`}
                    onClick={() => this.onAuthorize(record)}
                >
                    角色授权
                </span>
            </FunctionPower>
        ]
    }

    passwordRest = (record) => {
        let delId = record ? JSON.parse(record.id) : ''
        this.props.rApi.passwordReset({
            id: delId
        }).then(d => {
            message.success('密码重置成功!')
        }).catch(e => {
            message.error(e.msg || '操作失败!')
        })
    }
    onChange = (value) => {
        //console.log('organid', value[value.length-1])
        this.setState({
         organid: value[value.length-1]
        }, this.onChangeValue({organid: value[value.length-1]}))
     }

    onAuthorize = (record) => {
        this.authorize.show({
            isEdit: true,
            data: record
        })
    }
    render() {
        let {
            title, //角色名称
            organid, //所属部门
            desc, //描述
            keyword, //关键字
            limit,
            offset,
            options
        } = this.state
        let { mobxBaseData } = this.props
        let tableHeight = mobxBaseData.tableHeight
        return (
            <div style={{ background: '#eee', minHeight: this.props.minHeight }}>
                <AuthOrize 
                    parent={this}
                    getThis={(v) => this.authorize = v}
                />
                <AddOrEdit 
                    parent={this}
                    getThis={(v) => this.addoredit = v}
                />
                <HeaderView parent={this} title="员工编号或姓名" onChangeSearchValue={
                    keyword => {
                        this.setState({keyword: trim(keyword)}, this.onChangeValue({keyword: trim(keyword)}))
                    }
                }>
                    <Cascader 
                        placeholder="选择部门" 
                        options={options} 
                        onChange={this.onChange} 
                        changeOnSelect 
                    />
                </HeaderView>
                <Table
                    className="index-list-table-style"
                    actionView={this.customTableAction}
                    title="角色列表"
                    TableHeaderTitle="用户列表"
                    actionWidth={220}
                    // TableHeaderChildren={<TableHeaderChildren onAuthorize={this.onAuthorize} />}
                    parent={this}
                    power={power}
                    params={this.state.params}
                    getData={this.getData}
                    columns={this.state.columns}
                    tableHeight={tableHeight}
                    tableWidth={450}
                >
                </Table>
            </div>
        )
    }
}
 
export default CarRes;