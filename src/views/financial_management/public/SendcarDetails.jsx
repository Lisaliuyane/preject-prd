import React, { Fragment } from 'react'
import Modal from '@src/components/modular_window'
import { Form } from 'antd'
import { inject } from "mobx-react"
import CostTable from './CostTable'
import OrderTable from './OrderTable'

const ModularParent = Modal.ModularParent

@inject('rApi', 'mobxBaseData')  
class SendcarDetails extends ModularParent {

    state = {
        openType: null,
        title: '派车单明细',
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
        // console.log('show', d)
        let rowData = {
            ...d,
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
                style={{width: 1000}}
                loading={buttonLoading}
                haveFooter={false}
                className='estimate-modal'
            >
               <Form layout='inline'>
                    {
                        rowData && 
                        <Fragment>
                            <div style={{margin: '0 20px 10px'}}>
                                <CostTable
                                    getRef={v => this.costTable = v}
                                    source={rowData}
                                    useType='noEstimate'
                                />
                                <OrderTable
                                    getRef={v => this.orderTable = v}
                                    source={rowData}
                                />
                            </div>
                        </Fragment>
                    }
               </Form>
            </Modal>
        )
    }
}

export default Form.create()(SendcarDetails)