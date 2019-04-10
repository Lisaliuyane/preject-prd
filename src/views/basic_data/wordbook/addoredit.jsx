import React, { Component } from 'react';
import Modal from '@src/components/modular_window';
import { Form, Input, message } from 'antd';
import { inject, observer } from "mobx-react"

const FormItem = Form.Item;

@inject('mobxWordBook')
@observer
class AddOrEdit extends Component {

    state = {
        id: null,
        open: false,
        edit: false,
        title: '',
        typename: '',
        remark: '',
        key: null,
        index: null,
        buttonLoading: false
    }

    componentDidMount() {
        this.props.getThis(this)
    }

    show = (d) => {
        this.editData = d.data
        if (d.edit) {
            this.setState({
                typename: d.data.title || '',
                remark: d.data.remark || '',
                open: true,
                key: d.key,
                id: d.data.id,
                title: d.data.title,
                index: d.data.index,
                edit: true
            })
        } else {
            this.setState({
                open: true,
                title: d.title,
                key: d.key,
                edit: d.edit
            })
        }
        
    }

    changeOpen = (state) => {
        this.setState({
            open: state
        })
        if (!state) {
            this.clearValue()
            if (this.props.refresh)
            this.props.refresh()
        }
    }

    clearValue = () => {
        this.setState({
            typename: '',
            remark:  '',
            key: '',
            id: '',
            title: '',
            index: '',
            edit: false,
            buttonLoading: false
        })
    }

    onSubmit = () => {
        let { mobxWordBook } = this.props
        let { typename, remark, id, key, index, edit } = this.state
        this.props.form.validateFields((err, values) => {
            if(!err) {
                
            }
        })
        if (!typename || typename.length < 1) {
            message.error('请填写类型名称！')
            return
        }
        this.setState({
            buttonLoading: true
        })
        if (edit) {
            mobxWordBook.editBook({
                title: typename,
                remark,
                index: index,
                id: id
            }, key).then(() => {
                this.setState({
                    buttonLoading: false
                })
                this.changeOpen(false)
            }).catch(e => {
                message.error(e.msg)
                this.setState({
                    buttonLoading: false
                })
            })
        } else {
            mobxWordBook.addBook({
                title: typename,
                remark
            }, key).then(() => {
                this.changeOpen(false)
                this.setState({
                    typename: '',
                    remark:  '',
                    key: '',
                    id: '',
                    title: '',
                    index: '',
                    edit: false,
                    buttonLoading: false
                })
            }).catch(e => {
                console.error(e)
                message.error(e.msg)
                this.setState({
                    buttonLoading: false
                })
            })
        }
    }

    render() {
        let { open, buttonLoading } = this.state
        if (!open) return null
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        };
        const { getFieldDecorator } = this.props.form;
        // console.log('this.state.open', this.state.open, this.state.typename, this.state.remaker)
        return (
            <Modal 
                changeOpen={this.changeOpen}
                onSubmit={this.onSubmit}
                open={this.state.open} 
                title={this.state.title} 
                loading={buttonLoading}
                haveFooter>
                <Form layout='horizontal'>
                    <FormItem
                        style={{marginBottom: 0, marginTop: 10}}
                        label="类型名称"
                        {...formItemLayout}
                    >
                    {
                        getFieldDecorator('typename', {
                        rules: [{
                            required: true,
                            message: '类型名称不能为空！'
                        }],
                        initialValue: this.state.typename
                        })(
                        <Input 
                            onChange={e => {this.setState({typename: e.target.value})}} 
                            value={this.state.typename} 
                            placeholder="" 
                        />
                        )
                    }
                    </FormItem>
                    <FormItem
                        style={{marginBottom: 10}}
                        label="备注"
                        {...formItemLayout}
                    >
                        <Input 
                            onChange={e => {this.setState({remark: e.target.value})}} 
                            defaultValue={this.state.remark} 
                            placeholder="" />
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(AddOrEdit)