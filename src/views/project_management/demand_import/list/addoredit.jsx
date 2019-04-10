import React, { Component } from 'react';
import Modal from '@src/components/modular_window';
import { Form, Input, message, Cascader,  Checkbox  } from 'antd';
import { inject, observer } from "mobx-react"
import { Row, Col } from '@src/components/grid'
import RemoteSelect from '@src/components/select_databook'
import FormItem from '@src/components/FormItem'
import { toClientSource, toDemand } from '@src/views/layout/to_page'


const { TextArea } = Input
const ModularParent = Modal.ModularParent
const CheckboxGroup = Checkbox.Group

const demandType = [
    {
        id: 1,
        label: '零担', 
        value: 1
    },
    {
        id: 2,
        label: '整车', 
        value: 2
    },
    {
        id: 3,
        label: '仓+配', 
        value: 3
    },
    {
        id: 4,
        label: '快递', 
        value: 4
    },
]

@inject('mobxTabsData')
@inject('rApi')  
class AddOrEdit extends ModularParent {

    state = {
        type: null,
        title: null,
        open: false,
        edit: false,
        id: null,
        clientId: null,
        clientName: null,
        demandName: null,
        demandType: [],
        buttonLoading: false

    }
    constructor(props) {
        super(props);
        if (props.getThis) {
            props.getThis(this)
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
        //message.success('操作成功！')
    }

    show(d) {
        // if (d.edit) {
        //    this.setState({
        //        type: 1,
        //        title: '编辑角色'
        //    }) 
        // } else if (d.data) {
        //     this.setState({
        //         type: 2,
        //         title:'查看角色',
        //     })
        // } else {
        //     this.setState({type: 3, title:'新建角色'})
        //     //coconsole.log('新建')
        // }
        
        this.setState({
            ...d.data,
            open: true,
            edit: d.edit,
            title: '新建客户需求'
        })
    }

    clearValue() {
        this.setState({
            clientId: null,
            clientName: null,
            demandName: null,
            demandType: [],
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

    toClientSource = () => {
        const { mobxTabsData } = this.props
        toClientSource(mobxTabsData)
    }

    handleSubmit = () => {
        let { 
            clientId,
            clientName,
            demandName,
            demandType
         } = this.state
        //  if(!demandName || demandType.length === 0 || !clientId || !clientName) {
        //      message.error('必填项不能为空!')
        //  }
        this.setState({
            buttonLoading: true
        })
        this.props.rApi.addDemand({
            clientId,
            clientName,
            demandName,
            demandType
        }).then(d => {
            // console.log('addDemand', d)
            this.setState({
                buttonLoading: false
            })
            this.actionDone()
            this.props.reloadList()
            const { mobxTabsData } = this.props
            toDemand(mobxTabsData, {
                id: d.id,
                pageData: {
                    demandNumber: d.demandNumber,
                    id:  d.id,
                    demandName: demandName,
                    clientName: clientName

                }
            })
        }).catch(e => {
            message.error(e.msg || '添加失败')
            this.setState({
                buttonLoading: false
            })
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {buttonLoading} = this.state
        return (
            <Modal 
                changeOpen={this.changeOpen}
                onSubmit={this.saveSubmit}
                open={this.state.open} 
                title={this.state.title} 
                loading={buttonLoading}
                haveFooter>
               <Form layout='inline'>
                    <div style={{width: 400, margin: '30px auto'}}>
                        <Row gutter={24}>
                            <Col  label="需求名称" span={24} isRequired>
                                <FormItem>
                                    {
                                        getFieldDecorator('demandName', {
                                            rules: [
                                                { 
                                                    required: true, 
                                                    message: '请填写需求名称'
                                                }
                                            ],
                                        })(
                                            <Input 
                                                //defaultValue={name ? name : ''}
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({demandName: e.target.value})
                                                }
                                            }
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col label="客户名称" span={18} isRequired>
                                <FormItem>
                                    {
                                        getFieldDecorator('clientName', {
                                            rules: [
                                                { 
                                                    required: true, 
                                                    message: '请选择客户名称'
                                                }
                                            ],
                                        })(
                                            <RemoteSelect
                                                //defaultValue={status === 0 ? {id: 0, title: '是'} : {id: 1, title: '否'}}
                                                onChangeValue={
                                                    value => {
                                                        this.setState({
                                                            clientId: value ? value.id : null,
                                                            clientName: value ? value.shortname || value.name : ''
            
                                                        })
                                                    }
                                                } 
                                                getDataMethod={'getClients'}
                                                params={{limit: 999999, offset: 0, status: 56}}
                                                labelField={'shortname'}
                                                //labelField='title'
                                                //list={onJob}
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={5} >
                                <a onClick={this.toClientSource} style={{textDecoration: 'underline'}}>创建客户</a>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col  label="需求类型" span={24} isRequired>
                                <FormItem>
                                    {
                                        getFieldDecorator('demandType', {
                                            rules: [
                                                { 
                                                    required: true, 
                                                    message: '请选择需求类型'
                                                }
                                            ],
                                        })(
                                            <CheckboxGroup
                                                //value={roles ? roles : []}
                                                //defaultValue={roles ? roles : []}
                                                options={demandType} 
                                                onChange={(value) => {
                                                    this.setState({
                                                        demandType:  value ? value : []
                                                    })
                                                }} 
                                            />
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