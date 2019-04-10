import React, { Component } from 'react';
import { Table, Button, Icon, Form, Input, message } from 'antd'
import { inject, observer } from "mobx-react"
import { Row, Col } from '@src/components/grid'
import FormItem from '@src/components/FormItem'
import { md5hash } from '@src/utils/hash'

// @inject('mobxWordBook')

@inject('mobxBaseData')
@inject('rApi')  
class ModifyPwd extends Component {

    state = {
        oldpassword: null, //旧密码
        password: null, //新密码
        repassword: null, //确认密码
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
    }
    // actionDone = () => {
    //     const { parent } = this.props
    //     if (parent.searchCriteria) {
    //         parent.searchCriteria()
    //     }
    //     message.success('操作成功！')
    // }

    // saveSubmit = () => {
    // }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            //console.log('Received values of form: ', values);
            this.saveSubmit()
          }
        });
    }

    saveSubmit = () => {
        let {
            oldpassword,
            password, //新密码
            repassword, //确认密码
        } = this.state
        let { mobxBaseData } = this.props
        let id =  parseInt(localStorage.getItem('id'), 10) || parseInt(mobxBaseData.id, 10)
        if(password !== repassword) {
            message.error('两次密码不一致！')
            return
        }
        this.props.rApi.modifyPassword({
            id,
            oldpassword: md5hash(oldpassword),
            password: md5hash(password), //新密码
        }).then(d => {
            message.success('操作成功！')
        }).catch(e => {
            message.error(e.msg || '操作失败')
        })
    }

    restVul = () => {
        this.setState({
            oldpassword: null,
            password: null, 
            repassword: null
        })
    }
    render() {
        let {
            oldpassword,
            password, //新密码
            repassword, //确认密码
        } = this.state
        const { getFieldDecorator, setFieldsValue } = this.props.form
        //console.log('roleDate', roleValue)
        return (
            <div style={{width: 350, margin: '100px auto'}}>
                <Form layout='inline' onSubmit={this.handleSubmit}>
                    <Row gutter={24}>
                        <Col isRequired label="&emsp;旧密码" span={24}>
                            <FormItem>
                                {
                                    getFieldDecorator('oldpassword', {
                                        //initialValue: oldPassword ,
                                        rules: [
                                            { 
                                                required: true, 
                                                message: '请填写旧密码'
                                            },
                                            // {
                                            //     pattern: new RegExp("^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$"),
                                            //     message: '车牌格式错误',
                                            // }
                                            ],
                                    })(
                                        <Input 
                                            //defaultValue={carcode ? carcode : ''}
                                            value={oldpassword}
                                            type="password"
                                            placeholder="" 
                                            onChange={e => {
                                                this.setState({oldpassword: e.target.value})
                                                //setFieldsValue({carcode: e.target.value})
                                            }}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col isRequired label="&emsp;新密码" span={24}>
                            <FormItem>
                                {
                                    getFieldDecorator('password', {
                                        //initialValue: password,
                                        rules: [
                                            { 
                                                required: true, 
                                                message: '请填写新密码'
                                            },
                                            // {
                                            //     pattern: new RegExp("^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$"),
                                            //     message: '车牌格式错误',
                                            // }
                                            ],
                                    })(
                                        <Input 
                                            //defaultValue={carcode ? carcode : ''}
                                            value={password}
                                            type="password"
                                            placeholder="" 
                                            onChange={e => {
                                                this.setState({password: e.target.value})
                                            }}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col isRequired label="确认密码" span={24}>
                            <FormItem>
                                {
                                    getFieldDecorator('repassword', {
                                        //initialValue: rePassword,
                                        rules: [
                                            { 
                                                required: true, 
                                                message: '请填写确认密码'
                                            },
                                            // {
                                            //     pattern: new RegExp("^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$"),
                                            //     message: '车牌格式错误',
                                            // }
                                            ],
                                    })(
                                        <Input 
                                            //defaultValue={carcode ? carcode : ''}
                                            value={repassword}
                                            type="password"
                                            placeholder="" 
                                            onChange={e => {
                                                this.setState({repassword: e.target.value})
                                            }}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                        {
                            (password === repassword) ?
                            null
                            :
                            password && repassword ?
                            <span style={{color: 'red', marginLeft: '60px'}}>两次密码输入不一致!</span>
                            :
                            null
                        }
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <div className="flex" style={{justifyContent: 'center', marginTop: 20}}>
                                <Button  htmlType="submit" style={{width: 150, marginLeft: '63px', background: '#18B583', border: 0, color: '#fff'}}>
                                   提交
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

export default Form.create()(ModifyPwd);