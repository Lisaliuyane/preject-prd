import React, { Component } from 'react';
import Modal from '@src/components/modular_window';
import { Form, Input, message } from 'antd';
import { inject, observer } from "mobx-react"
import { Row, Col } from '@src/components/grid'
import FormItem from '@src/components/FormItem'
const { TextArea } = Input
const ModularParent = Modal.ModularParent
// console.log('ModularParent', ModularParent)

@inject('rApi') 
class AddOrEdit extends ModularParent {

    state = {
        open: false,
        edit: false,
        code: null, //部门代码
        name: null, //部门名称
        id: null,
        parent: {},
        desc: null, //描述
        buttonLoading: false
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

    show = (d) => {
        //console.log('show', d)
        if(d.addData) {
            var title = `添加${d.addData.title}下属部门`
        } else{
            var title = d.title
        }
        this.setState({
            parent: {id: d.addData ? d.addData.id : null},
            title: title,
            open: true,
            edit: d.edit
        })
    }

    clearValue() {
        this.setState({
            code: null, //部门代码
            name: null, //部门名称
            id: null,
            desc: null, //描述
            buttonLoading: false
        })
    }
    saveSubmit = () => {
        const { form } = this.props
        form.validateFields((errors, values) => {
            if(errors === null) {
                this.handleSubmit()
            }
        })
       
    }

    handleSubmit = () => {
        let {
            code, //部门代码
            name, //部门名称
            parent,
            desc, //描述
        } = this.state
        this.setState({
            buttonLoading: true
        })
        this.props.rApi.addOrganization({
            parent,
            code,
            desc,
            title: name
        }).then(res => {
            this.actionDone()
            this.props.reRequest()
            this.setState({
                buttonLoading: false
            })
        }).catch(e => {
            message.error(e.msg || '操作失败')
            this.setState({
                buttonLoading: false
            })
        })
    }

    render() {
        let { 
            open,
            code, //部门代码
            name, //部门名称
            id,
            desc, //描述
            buttonLoading
         } = this.state
        if (!open) return null
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal 
                changeOpen={this.changeOpen}
                onSubmit={this.saveSubmit}
                open={this.state.open} 
                title={this.state.title} 
                loading={buttonLoading}
                haveFooter>
               <Form layout='inline' >
                    <div style={{width: 400, margin: '30px auto'}}>
                        <Row gutter={24}>
                            <Col  label="部门代码" isRequired span={24}>
                                <FormItem>
                                    {
                                        getFieldDecorator('code', {
                                            initialValue: code,
                                            rules: [
                                                { 
                                                    required: true, 
                                                    message: '请填写部门代码'
                                                }
                                            ],
                                        })(
                                            <Input 
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({code: e.target.value})
                                                }
                                            }
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col  label="部门名称" isRequired span={24}>
                                <FormItem>
                                    {
                                        getFieldDecorator('name', {
                                            initialValue: name,
                                            rules: [
                                                { 
                                                    required: true, 
                                                    message: '请填写部门名称'
                                                }
                                            ],
                                        })(
                                            <Input 
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({name: e.target.value})
                                                }
                                            }
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col  label="部门描述" span={24}>
                                <TextArea
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
               </Form>
            </Modal>
        )
    }
}

export default Form.create()(AddOrEdit)