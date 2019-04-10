import React from 'react';
import Modal from '@src/components/modular_window';
import { Form, Input, message, Cascader, Radio, DatePicker  } from 'antd';
import { inject } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import FormItem from '@src/components/FormItem'
import { Row, Col } from '@src/components/grid'
import { validateToNextPhoneOrNoNUll, validateUsername, cloneObject } from '@src/utils'
import moment from 'moment'
// const { TextArea } = Input
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
@inject('rApi')  
class AddOrEdit extends ModularParent {

    state = {
        type: null,
        title: null,
        open: false,
        edit: false,
        id: null, //用户id
        birthday: null, //出生日期
        email: null, //电子邮箱
        indate: null, //入职日期
        organization: {}, //部门id
        selectOptions: {}, //部门数据
        phonenum: null, //联系方式
        position: null, //职位
        remark: null, //备注
        sex: 0, //性别
        status: 0, //是否在职
        uid: null, //用户编号
        username: null, //姓名
        sexdata: [], //性别数据
        options : [], //部门列表
        buttonLoading: false,
        historyData: null // 传入数据
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
        // console.log('show', d.data)
        let historyData = typeof d.data === 'object' ? cloneObject(d.data) : null
        if (d.edit) {
           this.setState({
               type: 1,
               title: '编辑用户'
           }) 
        } else if (d.data) {
            this.setState({
                type: 2,
                title:'查看用户',
            })
        } else {
            this.setState({type: 3,title:'新建用户'})
            //coconsole.log('新建')
        }
        
        this.setState({
            ...d.data,
            historyData: historyData,
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
            selectOptions: {},
            phonenum: null, //联系方式
            position: null, //职位
            remark: null, //备注
            sex: 0, //性别
            status: 0, //是否在职
            uid: null, //用户账号
            username: null, //姓名
            buttonLoading: false
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
            selectOptions,
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
        this.setState({
            buttonLoading: true
        })
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
                message.success('操作成功!')
                this.changeOpen(false)
                this.setState({
                    buttonLoading: false
                }, () => {
                    this.updateThisDataToTable({
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
                    })
                })
            }).catch(e => {
                message.error(e.msg || '操作失败！')
                this.setState({
                    buttonLoading: false
                })
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
                this.setState({
                    buttonLoading: false
                })
            }).catch(e => {
                message.error(e.msg || '操作失败！')
                this.setState({
                    buttonLoading: false
                })
            })

        }
    }

    /**
     * status = 1 // {status: this.state.status}
     * 
     * @memberof AddOrEdit
    */
    updateThisDataToTable = (d) => {
        console.log('updateThisDataToTable', d)
        let { historyData } = this.state
        const { parent } = this.props
        if (!historyData) return
        if (parent && parent.tableView)
        parent.tableView.updateData(Object.assign({}, historyData, d))
    }

    onChange = (value, selectedOptions) => {
        //console.log('organization', value)
       this.setState({
        // selectOptions: {
        //     id: value[value.length-1],
        //     path: value,
        //     title: selectedOptions && selectedOptions.length > 0 ? selectedOptions.map(item => item.title).join('/') : '无'
        // },
        organization: {
            id: value[value.length-1],
            path: value,
            title: selectedOptions && selectedOptions.length > 0 ? selectedOptions.map(item => item.title).join('/') : '无'
        }
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
            //sexdata,
            options, //部门列表
            buttonLoading
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
                loading={buttonLoading}
                haveFooter>
               <Form layout='inline'>
                    <div style={{padding: '15px 20px'}}>
                        <Row gutter={24}>
                            <Col  label="用户账号" span={8} isRequired>
                                <FormItem>
                                    {
                                        getFieldDecorator('uid', {
                                            initialValue: uid,
                                            rules: [
                                                { 
                                                    validator: validateUsername
                                                }
                                            ],
                                        })(
                                            <Input 
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({uid: e.target.value})
                                                }
                                            }
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col  label="用户姓名" span={8} isRequired>
                                <FormItem>
                                    {
                                        getFieldDecorator('username', {
                                            initialValue: username,
                                            rules: [
                                                { 
                                                    required: true, 
                                                    message: '请填写用户姓名'
                                                }
                                            ],
                                        })(
                                            <Input 
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({username: e.target.value})
                                                }
                                            }
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col label="性别" span={6}>
                                <RadioGroup 
                                    onChange={this.radioChange} 
                                    defaultValue={sex ? sex : 0}
                                    >
                                    <Radio value={0}>男</Radio>
                                    <Radio value={1}>女</Radio>
                                </RadioGroup>
                            </Col> 
                        </Row>
                        <Row gutter={24}>
                            <Col  label="选择部门" span={8} isRequired>
                                <FormItem>
                                    {
                                        getFieldDecorator('organization', {
                                            initialValue: organization && organization.path ? organization.path : [],
                                            rules: [
                                                { 
                                                    required: true, 
                                                    message: '请选择部门'
                                                }
                                            ],
                                        })(
                                            <Cascader 
                                                placeholder="选择部门" 
                                                options={options} 
                                                onChange={this.onChange} 
                                                changeOnSelect 
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col  label="选择职位" span={8} isRequired>
                                <FormItem>
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
                                                defaultValue={position ? position : ''}
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
                            <Col  label="联系方式" span={6} isRequired>
                                <FormItem>
                                    {
                                        getFieldDecorator('phonenum', {
                                            initialValue: phonenum,
                                            rules: [
                                                {
                                                    // pattern: new RegExp("^[1]{1}[3,4,5,6,7,8,9]{1}[0-9]{9}$"),
                                                    // message: '请输入11位手机号'
                                                    validator: validateToNextPhoneOrNoNUll
                                                }
                                            ],
                                        })(
                                            <Input 
                                                //defaultValue={phonenum ? phonenum : ''}
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({phonenum: e.target.value})
                                                }
                                            }
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col  label="电子邮箱" span={8} isRequired>
                                <FormItem>
                                    {
                                        getFieldDecorator('email', {
                                            initialValue: email,
                                            rules: [
                                                {
                                                    required: true, 
                                                    message: '请填写电子邮箱'
                                                },
                                                {
                                                    type: 'email',
                                                    message: '邮箱格式错误'
                                                }
                                            ],
                                        })(
                                            <Input 
                                                //defaultValue={email ? email : ''}
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({email: e.target.value})
                                                }
                                            }
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col label="出生日期" span={7} >
                                <DatePicker
                                    defaultValue={birthday ? moment(birthday * 1000) : null}
                                    // value={birthday ? birthday : ''}
                                    // value={moment(registerdate)} 
                                    format="YYYY-MM-DD"
                                    onChange={
                                        date => {
                                            this.setState({birthday: date ? moment(date).format('X') : ''})
                                        }} 
                                />
                            </Col>
                            <Col label="入职日期" span={7} isRequired >
                                <FormItem>
                                    {
                                        getFieldDecorator('indate', {
                                            initialValue: indate ? moment(indate * 1000) : null,
                                            rules: [
                                                {
                                                    required: true, 
                                                    message: '请填写入职日期'
                                                }
                                            ],
                                        })(
                                            <DatePicker
                                                //defaultValue={indate ? moment(indate * 1000) : null}
                                                format="YYYY-MM-DD"
                                                onChange={
                                                    date => {
                                                        this.setState({indate: date ? moment(date).format('X') : ''})
                                                    }} 
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}> 
                            <Col  label="是否在职" span={8} isRequired>
                                <FormItem>
                                    {
                                        getFieldDecorator('status', {
                                            initialValue: status,
                                            rules: [
                                                {
                                                    required: true, 
                                                    message: '请选择是否在职'
                                                }
                                            ],
                                        })(
                                            <RemoteSelect
                                                defaultValue={status === 0 ? {id: 0, title: '是'} : {id: 1, title: '否'}}
                                                //placeholder={'合作状态'}
                                                onChangeValue={
                                                    value => {
                                                        this.setState({
                                                            status: value ? value.id : ''
                                                        })
                                                    }
                                                } 
                                                labelField='title'
                                                list={onJob}
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col  label="备&emsp;&emsp;注" span={15} >
                                <Input 
                                    defaultValue={ remark ? remark : ''}
                                    title={remark}
                                    placeholder="" 
                                    onChange={e => {
                                        this.setState({remark: e.target.value})
                                    }
                                }
                                />
                            </Col>
                            {/* <Col  span={1} /> */}
                        </Row>
                    </div>
               </Form>
            </Modal>
        )
    }
}

export default Form.create()(AddOrEdit)