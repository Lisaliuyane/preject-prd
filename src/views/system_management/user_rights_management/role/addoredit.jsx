import React from 'react';
import Modal from '@src/components/modular_window';
import { Form, Input, message, Cascader  } from 'antd';
import { inject } from "mobx-react"
import { Row, Col } from '@src/components/grid'
import FormItem from '@src/components/FormItem'
import { cloneObject } from '@src/utils'

const { TextArea } = Input
const ModularParent = Modal.ModularParent

@inject('rApi')  
class AddOrEdit extends ModularParent {

    state = {
        type: null,
        title: null,
        open: false,
        edit: false,
        id: null,
        name: null, //角色名称
        organid: null, //
        organization: {}, //部门数据
        desc: null, //描述
        options : [], //部门列表
        selectOptions: {},
        buttonLoading: false,
        historyData: null // 传入数据
    }
    constructor(props) {
        super(props);
        if (props.getThis) {
            props.getThis(this)
        }
    }
    componentDidMount() {
      this.props.rApi.getOrganization().then((res) => {
          //console.log('部门数据', res)
          if(res) {
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
        console.log('d', d.data)
        let historyData = typeof d.data === 'object' ? cloneObject(d.data) : null
        if (d.edit) {
            d.data = Object.assign({}, d.data, {
               type: 1,
               title: '编辑角色',
               name: d.data.title,
               organid: d.data.organization.id,
               selectOptions: d.data.organization
            })
        } else if (d.data) {
            this.setState({
                type: 2,
                title:'查看角色',
                selectOptions: d.data.organization
            })
        } else {
            this.setState({type: 3, title:'新建角色'})
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
            id: null,
            name: null, //角色名称
            organid: null, //、
            organization: {}, //部门数据
            desc: null, //描述
            buttonLoading: false,
            selectOptions: {},
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
            id,
            name, //角色名称
            organid, //
            selectOptions,
            desc //描述
         } = this.state
         this.setState({
            buttonLoading: true
         })
        if(this.state.type === 1) {
            this.props.rApi.editRole({
                title: name,
                organid: organid,
                id,
                desc: desc
            }).then(d => {
                message.success('操作成功!')
                this.changeOpen(false)
                this.setState({
                    buttonLoading: false
                }, () => {
                    this.updateThisDataToTable({
                        id,
                        title: name,
                        organization: selectOptions,
                        desc: desc
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
            this.props.rApi.addRole({
                title: name,
                organid: organid,
                desc: desc
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
       // console.log('updateThisDataToTable', d)
        let { historyData } = this.state
        const { parent } = this.props
        if (!historyData) return
        if (parent && parent.tableView)
        parent.tableView.updateData(Object.assign({}, historyData, d))
    }

    onChange = (value, selectedOptions) => {
       // console.log('value', value, selectedOptions)
        this.setState({
            selectOptions: {
                id: value[value.length-1],
                path: value,
                title: selectedOptions && selectedOptions.length > 0 ? selectedOptions.map(item => item.title).join('/') : '无'
            },
            organid: value[value.length-1]
        })
    }
    render() {
        let { 
            open,
            name, //角色名称
            //organid, //
            organization,
            desc, //描述
            options,
            buttonLoading
         } = this.state
        const { getFieldDecorator } = this.props.form;
        if (!open) return null
        // const formItemLayout = {
        //     labelCol: { span: 6 },
        //     wrapperCol: { span: 14 }
        // };
        // const { getFieldDecorator } = this.props.form;
        return (
            <Modal 
                changeOpen={this.changeOpen}
                onSubmit={this.onSubmit}
                open={this.state.open} 
                title={this.state.title} 
                loading={buttonLoading}
                haveFooter>
               <Form layout='inline'>
                    <div style={{width: 400, margin: '30px auto'}}>
                        <Row gutter={24}>
                            <Col  label="角色名称" span={24} isRequired>
                                <FormItem>
                                    {
                                        getFieldDecorator('name', {
                                            initialValue: name,
                                            rules: [
                                                { 
                                                    required: true, 
                                                    message: '请填写角色名称'
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
                            <Col  label="所属部门" span={24} isRequired>
                                <FormItem>
                                    {
                                        getFieldDecorator('organid', {
                                            initialValue: organization.path,
                                            rules: [
                                                { 
                                                    required: true, 
                                                    message: '请填写所属部门'
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
                        </Row>
                        <Row gutter={24}>
                            <Col  label="角色备注" span={24}>
                                <TextArea
                                    defaultValue={desc ? desc : ''}
                                    autosize={{ minRows: 2, maxRows: 2 }} 
                                    placeholder="" 
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