import React from 'react'
import Modal from '@src/components/modular_window'
import { Form } from 'antd'
import { inject } from "mobx-react"
import OrdercostTable from './OrdercostTable'

const ModularParent = Modal.ModularParent

@inject('rApi', 'mobxBaseData')  
class CostDetails extends ModularParent {

    state = {
        openType: null,
        title: '费用明细',
        open: false,
        buttonLoading: false,
        rowData: {}
    }

    constructor(props) {
        super(props);
        if (props.getThis) {
            props.getThis(this)
        }
    }

    show(d) {
        let rowData = {
            ...d,
            orderId: d.id
        }
        this.setState({
            open: true,
            rowData
        })
    }
  
    changeOpen = (open) => {
        this.setState({
            open
        })
        if (!open) {
            this.clearValue()
        }
    }

    clearValue() {
        this.setState({
            openType: null,
            open: false,
            rowData: {}
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
        
    }

    render() {
        let {
            open,
            buttonLoading,
            rowData
         } = this.state
        if (!open) return null
        return (
            <Modal 
                changeOpen={this.changeOpen}
                onSubmit={this.onSubmit}
                open={this.state.open} 
                title={this.state.title} 
                style={{width: 900}}
                loading={buttonLoading}
                haveFooter={false}
                className='estimate-modal'
            >
               <Form layout='inline' style={{padding: '0 20px 20px'}}>
                    <OrdercostTable
                        getRef={v => this.ordercostTable = v}
                        curRow={rowData}
                        curCode={1}
                    />
               </Form>
            </Modal>
        )
    }
}

export default Form.create()(CostDetails)