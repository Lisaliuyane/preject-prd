import React, { Component } from 'react';
import Modal from '@src/components/modular_window';
import { Form, Input, message, Cascader, Radio, DatePicker  } from 'antd';
import { inject, observer } from "mobx-react"
import CustomRemoteSelect from '@src/components/select_data'
import RemoteSelect from '@src/components/select_databook'
import FormItem from '@src/components/FormItem'
import { Row, Col } from '@src/components/grid'
import moment from 'moment'
import { Select } from 'antd'
const { TextArea } = Input
const RadioGroup = Radio.Group
const ModularParent = Modal.ModularParent

const onJob = [
    {
        id: 0, title: '是'
    },
    {
        id: 1, title: '否'
    }
]
const Option = Select.Option;
@inject('rApi')  
class AddOrEdit extends ModularParent {

    state = {
        type: null,
        title: null,
        open: true,
        edit: false,
        id: null, //用户id
        birthday: null, //出生日期
        email: null, //电子邮箱
        indate: null, //入职日期
        organization: {}, //部门id
        phonenum: null, //联系方式
        position: null, //职位
        remark: null, //备注
        sex: 0, //性别
        status: 0, //是否在职
        uid: null, //用户编号
        username: null, //姓名
        sexdata: [], //性别数据
        options : [], //部门列表

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
      
    
    changeOpen = (state) => {
        this.setState({
            open: state
        })
        if (!state) {
            this.clearValue()
        }
    }

    actionDone = () => {
        const { parent } = this.props
        if (parent.searchCriteria) {
            parent.searchCriteria()
        }
        this.changeOpen(false)
        message.success('操作成功！')
    }

    show(d) {
        if (d.edit) {
           this.setState({
               type: 1,
               title: '编辑角色'
           }) 
        } else if (d.data) {
            this.setState({
                type: 2,
                title:'查看角色',
            })
        } else {
            this.setState({type: 3,title:'新建角色'})
            //coconsole.log('新建')
        }
        
        this.setState({
            ...d.data,
            open: true,
            edit: d.edit
        })
    }

    clearValue() {
        this.setState({
            id: null, //用户id
            birthday: null, //出生日期
            email: null, //电子邮箱
            indate: null, //入职日期
            organization: {}, //部门id
            phonenum: null, //联系方式
            position: {}, //职位
            remark: null, //备注
            sex: 0, //性别
            status: 0, //是否在职
            uid: null, //用户账号
            username: null, //姓名
        })

    }
    onSubmit = () => {
        const { form } = this.props
        form.validateFields((errors, values) => {
            if(errors === null) {
                this.handleSubmit()
            }
        })
    }

    handleSubmit = () => {
        let { 
            id, //用户id
            birthday, //出生日期
            email, //电子邮箱
            indate, //入职日期
            organization, //部门id
            phonenum, //联系方式
            position, //职位
            remark, //备注
            sex, //性别
            status, //是否在职
            uid, //用户账号
            username, //姓名
         } = this.state
        // if(!uid || !username || !organization || !position || !phonenum || !email || !indate || status === "") {
        //     message.error('必填字段不能为空!')
        //     return false
        // }
        if(this.state.type === 1) {
            //console.log('编辑')
            this.props.rApi.editUser({
                id,
                birthday, //出生日期
                email, //电子邮箱
                indate, //入职日期
                organization, //部门id
                phonenum, //联系方式
                position, //职位
                remark, //备注
                sex, //性别
                status, //是否在职
                uid, //用户账号
                username, //姓名
            }).then(d => {
                this.actionDone()
            }).catch(e => {
                message.error(e.msg || '操作失败！')
            })
        } else if(this.state.type === 3) {
            //console.log('新建保存')
            this.props.rApi.addUser({
                birthday, //出生日期
                email, //电子邮箱
                indate, //入职日期
                organization, //部门id
                phonenum, //联系方式
                position, //职位
                remark, //备注
                sex, //性别
                status, //是否在职
                uid, //用户账号
                username, //姓名
            }).then(d => {
                this.actionDone()
            }).catch(e => {
                message.error(e.msg || '操作失败！')
            })

        }
    }

    onChange = (value) => {
        console.log('organization', value)
       this.setState({
        organization: {id: value[value.length-1]}
       })
    }
    radioChange = (e) => {
        //console.log('e', e)
        this.setState({
            sex: e.target.value,
        });
      }
    render() {
        let { 
            open,
            birthday, //出生日期
            email, //电子邮箱
            indate, //入职日期
            organization, //部门id
            phonenum, //联系方式
            position, //职位
            remark, //备注
            sex, //性别
            status, //是否在职
            uid, //用户账号
            username, //姓名
            sexdata,
            options, //部门列表
         } = this.state
         const { getFieldDecorator } = this.props.form
        if (!open) return null
        return (
            <Modal 
                changeOpen={this.changeOpen}
                onSubmit={this.onSubmit}
                open={this.state.open} 
                title={this.state.title} 
                style={{width: 800}}
                haveFooter>
               <Form layout='inline'>
                    <div style={{padding: '10px 20px'}}>
                        <Row gutter={24}>
                            <Col  label="选择职位" span={8} isRequired>
                                <FormItem isCustomChildren>
                                    {
                                        getFieldDecorator('position', {
                                            initialValue: position,
                                            rules: [
                                                {
                                                    required: true, 
                                                    message: '请选择职位'
                                                }
                                            ],
                                        })(
                                            <RemoteSelect
                                                //defaultValue={position ? position : ''}
                                                //placeholder={'合作状态'}
                                                onChangeValue={
                                                    value => {
                                                        this.setState({
                                                            position: value ? value : ''
                                                        })
                                                        //console.log('position', value)
                                                    }
                                                } 
                                                labelField='title'
                                                text='职位'
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col  label="选择职位" span={8} isRequired>
                                <FormItem >
                                        {
                                            getFieldDecorator('email', {
                                                initialValue: email,
                                                rules: [
                                                    {
                                                        required: true, 
                                                        message: '请选择职位'
                                                    }
                                                ],
                                            })(
                                                <Select
                                                    defaultValue="lucy"
                                                    style={{ width: 200 }}
                                                >
                                                        <Option value="jack">Jack</Option>
                                                        <Option value="lucy">Lucy</Option>
                                                        <Option value="Yiminghe">yiminghe</Option>
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                            </Col>
                        </Row>
                    </div>
               </Form>
            </Modal>
        )
    }
}

export default Form.create()(AddOrEdit)