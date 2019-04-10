import React, { Component, Fragment } from 'react';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import './index.less';
import { inject, observer } from "mobx-react";
// 使用cookie账号密码
import cookie from './cookie.js'
import logo from '@src/libs/img/logo.png'

const FormItem = Form.Item;

@inject('mobxBaseData', 'rApi', 'mobxTabsData')
@observer
class Login extends Component {

    state={
        username: '',
        password: '',
        isCheck: false,
        loading: false,
        requstDone: false
    }

    constructor(props) {
        super(props)
        const { mobxTabsData } = props
        let info = cookie.getLastUser()
        if (process.env.NODE_ENV !== 'development') {
            mobxTabsData.closeAll()
        }
        if (info &&  info.username) {
            this.state.username = info.username
            this.state.password = info.password
            this.state.isCheck = info.password ? true : false
        }
    }

    componentDidMount() {
        const { mobxBaseData } = this.props
        mobxBaseData.getLocationLoginStatus().then(() => {
            this.toHome()
        })
        this.getSystemInformation()
    }

    componentDidUpdate() {
        this.toHome()
    }

    getSystemInformation = () => {
        let { rApi, mobxBaseData } = this.props
        rApi.getSystemInformation().then(res => {
            //console.log('res', res)
            mobxBaseData.setSystemInfo(res)
            this.setState({
                requstDone: true
            })
        }).catch(e => {
            console.log(e)
            this.setState({
                requstDone: true
            })
        })
    }
    
    handleSubmit = (e) => {
        e.preventDefault();
        let { rApi, mobxBaseData } = this.props
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                //mobxBaseData.loginOut()
                values.username = values.userName
                delete values.userName
                this.setState({loading: true})
                let password = values.password
                rApi.getAccessToken(values).then(res => {
                    //console.log('loginData', res)
                    // console.log('permissions', res.permissions)
                    // this.setState({})
                    if (values.remember) {
                        cookie.setUser({username: values.username, password: password, isCheck: true})
                    } else {
                        cookie.setUser({username: values.username,  isCheck: false})
                    }
                    this.setState({loading: false}, () => {
                        mobxBaseData.setLogin(res)
                    })
                }).catch(e => {
                    // console.error(e)
                    message.error('请检查账号密码是否正确！')
                    this.setState({loading: false})
                })
            }
        });
    }

    toHome = () => {
        let { history, mobxBaseData } = this.props
        if (mobxBaseData.isLogin) {
            if (history.action === 'PUSH') {
                history.go(-1)
            } else {
                history.replace('/')
            }
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form
        if (this.props.mobxBaseData.isLogin) {
            return null
        }
        let { requstDone } = this.state
        let platformName = localStorage.getItem('platformName')
        return (
            <Fragment>
                {
                    requstDone ?
                    <div className="login-layout login-wrapper flex">
                        <div className="left-wrapper flex1"></div>
                        <div className="right-wrapper">
                            <h3 className="login-title">{platformName ? platformName : '中国辣椒城智慧物流信息平台'}</h3>
                            <div className="page-login flex flex-vertical-center">
                                <Form onSubmit={this.handleSubmit} className="login-form">
                                    {/* <h2 style={{margin: '1em 0'}}><img style={{maxWidth: 100}} src={logo} alt='logo' /> 供应链智慧云平台</h2> */}
                                    <FormItem>
                                        {getFieldDecorator('userName', {
                                            rules: [{ required: true, message: '请输入账号!' }],
                                            initialValue: this.state.username
                                        })(
                                            <Input 
                                                placeholder="" 
                                                className="padding-left"
                                                prefix={<span style={{color: '#aaa'}}>用户名</span>} 
                                            />
                                        )}
                                    </FormItem>
                                    <FormItem>
                                        {getFieldDecorator('password', {
                                            rules: [{ required: true, message: '请输入密码!' }],
                                            initialValue: this.state.password
                                        })(
                                            <Input 
                                                className="padding-left"
                                                prefix={<span style={{color: '#aaa'}}>密&emsp;码</span>} 
                                                type="password" 
                                                placeholder="" 
                                            />
                                        )}
                                    </FormItem>
                                    <div className="flex" style={{height: 45, padding: '0 5px'}}>
                                        <FormItem>
                                            {getFieldDecorator('remember', {
                                                valuePropName: 'checked',
                                                initialValue: this.state.isCheck,
                                            })(
                                                <Checkbox>记住密码</Checkbox>
                                            )}
                                        </FormItem>
                                        <div className="flex1"></div>
                                        <FormItem style={{width: 63}}>
                                            <a className="login-form-forgot" href="">忘记密码</a>
                                        </FormItem>
                                    </div>
                                    <Button 
                                        loading={this.state.loading} 
                                        size="large"
                                        type="primary" 
                                        htmlType="submit" 
                                        className="login-form-button"
                                    >
                                        登录
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                    :
                    null
                }
            </Fragment>
        );
    }
}
export default Form.create()(Login);
