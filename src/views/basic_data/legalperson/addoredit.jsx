import React, { Component } from 'react'
import Modal from '@src/components/modular_window'
import { Button, Form, Input, InputNumber, Checkbox, message, Upload, Icon, DatePicker} from 'antd'
import RemoteSelect from '@src/components/select_databook'
import { SelectAddress } from '@src/components/select_address'
import { cloneObject, validateToNextPhone } from '@src/utils'
// import Col from '@src/components/colItem'
import FormItem from '@src/components/FormItem'
import { Row, Col } from '@src/components/grid'
import moment from 'moment'
import { inject } from "mobx-react"

@inject('rApi')
class AddOrEdit extends Component {

    state = {
        open: false,
        edit: false,
        loading: false,
        type: null,
        title: null,
        buttonLoading: false,
        name: '',
        fullName: '',
        extra: '',
        area: '',
        code: '',
        address: null,
        historyData: null // 传入数据
    }

    constructor(props) {
        super(props);
        if (props.getThis) {
            props.getThis(this)
        }
        // console.log('carcode',this.state.carcode)
    }

    changeOpen = (state) => {
        this.setState({
            open: state
        })
        if (!state) {
            this.clearValue()
        }
    }

    show(d) {
        let historyData = typeof d.data === 'object' ? cloneObject(d.data) : null
        if (d.edit) {
            this.setState({
                type: 1,
                title:'编辑法人',
            })
        } else if (d.data) {
            this.setState({
                type: 2,
                title:'查看法人',
            })
        } else {
            this.setState({type: 3,title:'新建法人'})
            //console.log('新建')
        }
        
        this.setState({
            ...d.data,
            historyData: historyData,
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
            area: '',
            name: '',
            code: '',
            address: '',
            fullName: '',
            buttonLoading: false
        })
    }

    getSelectAddressThis = (d) => {
        this.selectAddress = d
    }

    
    onChageProvince = (value) => {
        let { rApi } = this.props
        if (value && value.id) {
            rApi.getAreaByAddress(value).then(res => {
                // console.log('getAreaByAddress', res, res.name)
                if (res && res[0]) {
                    let area = res[0].title
                    this.setState({area: area})
                }
            })
        } else {
            this.setState({area: ''})
        }
    }

    onSubmit = () => {
        const { form } = this.props
        form.validateFields((errors, values) => {
            if(errors === null) {
                this.saveSubmit()
            }
        })
    }

    saveSubmit = () => {
        let { rApi } = this.props
        let { 
            type,
            edit,
            name,
            fullName,
            code,
            address,
            area,
            id,
            index
        } = this.state
        area = area
        address = this.selectAddress.getValue()
        if(!address.pro) {
            message.error('法人地址不能为空！')
            return
        }
        this.setState({
            buttonLoading: true
        })
        if(this.state.type === 1) {
            rApi.editLegalPerson({
                name,
                fullName: fullName,
                code,
                address,
                area,
                id
            }).then(d => {
                // this.actionDone()
                message.success('操作成功!')
                this.changeOpen(false)
                this.setState({
                    buttonLoading: false
                }, () => {
                    this.updateThisDataToTable({
                        name,
                        fullName: fullName,
                        code,
                        address,
                        area,
                        id
                    })
                })
            }).catch(e => {
                message.error(e.msg || '操作失败！')
                this.setState({
                    buttonLoading: false
                })
            })
        } else if(this.state.type === 2) {
            this.changeOpen(false)
        } else if(this.state.type === 3) {
            rApi.addLegalPerson({
                name,
                fullName: fullName,
                code,
                area,
                address
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
        let { historyData } = this.state
        const { parent } = this.props
        if (!historyData) return
        if (parent && parent.tableView)
        parent.tableView.updateData(Object.assign({}, historyData, d))
    }


    render() { 
        const { edit } = this.props
        const { getFieldDecorator, setFieldsValue } = this.props.form
        let { 
            type,
            title,
            name,
            fullName,
            extra,
            area,
            code,
            address,
            buttonLoading } = this.state
           // console.log('phone', phone)
        return (
            <Modal
                onSubmit={this.onSubmit}
                style={{width: '95%', maxWidth: 1000, minHeight: 300}}
                changeOpen={this.changeOpen} 
                open={this.state.open} 
                title={title} 
                haveFooter
                loading={buttonLoading}
                getContentDom={v => this.popupContainer = v}
                >
                <div style={{padding: '5px 25px'}}>
                    <Form layout='inline'>
                        <Row gutter={24} type={type}>
                            <Col isRequired label="法人代码" span={7}>
                                <FormItem>
                                    {
                                        getFieldDecorator('code', {
                                            initialValue: code,
                                            rules: [
                                                {
                                                    required: true, 
                                                    message: '请填写法人代码'
                                                }
                                            ],
                                        })(
                                            <Input 
                                                onChange={e => {this.setState({code: e.target.value})}} 
                                                //defaultValue={this.state.code} 
                                                placeholder="" 
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col isRequired label="法人名称" span={6}>
                                <FormItem>
                                    {
                                        getFieldDecorator('name', {
                                            initialValue: name,
                                            rules: [
                                                {
                                                    required: true, 
                                                    message: '法人名称'
                                                }
                                            ],
                                        })(
                                            <Input 
                                                onChange={e => {this.setState({name: e.target.value})}} 
                                                //defaultValue={this.state.name} 
                                                placeholder="" 
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col isRequired label="法人全称" span={9}>
                                <FormItem>
                                    {
                                        getFieldDecorator('fullName', {
                                            initialValue: fullName,
                                            rules: [
                                                {
                                                    required: true, 
                                                    message: '请填写法人全称'
                                                }
                                            ],
                                        })(
                                            <Input 
                                                onChange={e => {this.setState({fullName: e.target.value})}} 
                                                //defaultValue={this.state.fullName} 
                                                placeholder="" 
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24} type={type}>
                            <Col isRequired label="法人地址" span={19}>
                                <SelectAddress 
                                    ref='selectAddress'
                                    getPopupContainer={() => this.popupContainer || document.body}
                                    onChageProvince={this.onChageProvince} 
                                    getThis={this.getSelectAddressThis}  
                                    address={this.state.address} 
                                />
                            </Col>
                            <Col isRequired label='片区' label="法人地址" span={4}>
                                <Input
                                    disabled 
                                    placeholder='片区' 
                                    onChange={e => {
                                        let area = e.target.value
                                        this.setState({area: area})
                                    }} 
                                    value={this.state.area} 
                                />
                            </Col>
                        </Row>    
                    </Form>
                </div>
            </Modal>
        )
    }
}
 
export default Form.create()(AddOrEdit);