import React, { Component } from 'react'
import Modal from '@src/components/modular_window'
import { Button, Form, message } from 'antd'
import Materiel from './materiel'
import FormItem from '@src/components/FormItem'
import businessModel from '@src/views/business_management/liftingModeId'
import { cloneObject } from '@src/utils'
import { inject } from "mobx-react"

@inject('rApi')
class Stowage extends Component {

    state = {
        open: false,
        edit: false,
        loading: false,
        type: null,
        title: null,
        historyData: null, //传入数据
        dataList: [],
        receiverList: [],
        senderList: []
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

    
    show(d) {
        console.log('showdetails', d.data.editData)
        this.setState({
            receiveData: d.data.editData ? d.data.editData.orderMaterialList : [],
            data: d.data,
            index: d.index,
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
    }

    onSubmit = () => {
        alert('xxx')
    }

    /**
     * status = 1 // {status: this.state.status}
     * 
     * @memberof AddOrEdit
     */
    changedemo = (time) => {
        // console.log('time',moment(time).format('YYYY-MM-DD h:mm:ss'))
    }
    

    // handleSubmit = (e) => {
    //     e.preventDefault();
    //     this.props.form.validateFields((err, values) => {
    //       if (!err) {
    //         //console.log('Received values of form: ', values);
    //         this.saveSubmit()
    //       }
    //     });
    // }

    // getCarrierVul = (value) => { //获取承运商数据
    //     console.log('承运商值', value)
    // }

    getLabelVul = (value) => { //中转地值
        // console.log('getLabelVul', value)
    }

    onSaveOrEditDataMateriel = (id, data, type) => { //保存编辑物料清单
        // let { toMaterieData } = this.state 
        // let { record, index } = data
        // // toMaterieData[id].list.unshift(data)
        // if (type === 'save') {
        //     toMaterieData[id].list[index].isEdit = false
        // } else if (type === 'edit') {
        //     toMaterieData[id].list[index].isEdit = true
        // }
        // this.setState({
        //     toMaterieData: this.oneDeliverySync(id, toMaterieData)
        // })
    }

    onChangeMateriel = (receiveData, d) => {
        const { value, key, column } = d
        
        // const { onChangeMateriel } = this.props
        const { data } = this.state
        let target = cloneObject(receiveData[column])
        if (!target.history) {
            target.history = cloneObject(target)
        }
        
        // console.log('target.history', target.history)
        let ratio = target.history[key] === 0 ? 1 : value / target.history[key]
        let keys = ['quantity', 'boxCount', 'boardCount', 'grossWeight', 'volume']
        for (let k of keys) {
            if (k !== key) {
                if (k === 'quantity' || k === 'boxCount' || k === 'boardCount') {
                    target[k] = Math.ceil(Number((target.history[k] * ratio).toString().match(/^\d+(?:\.\d{0,4})?/)))
                } else {
                    target[k] = Number((target.history[k] * ratio).toString().match(/^\d+(?:\.\d{0,4})?/))
                }
            }
        }

        let rt
        switch (key) {
            case 'quantity': 
            // 修改数量
                rt = !isNaN(parseInt(value, 10)) ? parseInt(value, 10) : 0
                // rt = rt > target.history[key] ? target.history[key] : rt
                target[key] = rt
                target['boxCount'] = target.quantityRule ? Math.ceil(rt / target.quantityRule) : target['boxCount']
                target['boardCount'] = target.boxCountRule ? Math.ceil(target['boxCount'] / target.boxCountRule) : target['boardCount']
                target['grossWeight'] = parseFloat((rt * target.grossWeightRule).toFixed(4))
                target['volume'] = parseFloat((rt * target.volumeRule).toFixed(4))
                break

            case 'boxCount':
            // 修改箱数
                rt = !isNaN(parseInt(value, 10)) ? parseInt(value, 10) : 0
                // rt = rt > target.history[key] ? target.history[key] : rt
                target[key] = rt
                target['quantity'] = rt * target.quantityRule
                target['boardCount'] = target.boxCountRule ? Math.ceil(rt / target.boxCountRule) : target['boardCount']
                target['grossWeight'] = parseFloat((target['quantity'] * target.grossWeightRule).toFixed(4))
                target['volume'] = parseFloat((target['quantity'] * target.volumeRule).toFixed(4))
                break

            case 'boardCount':
                // 修改板数
                rt = !isNaN(parseInt(value, 10)) ? parseInt(value, 10) : 0
                // rt = rt > target.history[key] ? target.history[key] : rt
                target[key] = rt
                target['quantity'] = rt * target.boxCountRule * target.quantityRule
                target['boxCount'] = rt * target.boxCountRule
                target['grossWeight'] = parseFloat((target['quantity'] * target.grossWeightRule).toFixed(4))
                target['volume'] = parseFloat((target['quantity'] * target.volumeRule).toFixed(4))
                break
            
            default: 
                break;
        }
        receiveData[column] = target
        data.editData.orderMaterialList = receiveData
        this.setState({
            data: data
        })
    }

    getReceiveData = (d) => {
        const { receiverList, senderList,  liftingModeId} = d
        if (d.orderId) {
            // console.log('子订单', d)
            if (senderList && senderList.length > 0 && senderList[0].materialList.length > 0) {
                // list = senderList[0].materialList
                return {
                    type: 'send',
                    receiveData: senderList[0]
                }
            } else if (receiverList && receiverList.length > 0 && receiverList[0].materialList.length > 0) {
                // list = receiverList[0].materialList
                return {
                    type: 'send',
                    receiveData: receiverList[0]
                }
            } else {
                return {
                    type: 'send',
                    receiveData: {
                        materialList: []
                    }
                }
            }
        } else {
            if (businessModel.isOneToOne(liftingModeId)) {
                // 一对一
                return {
                    type: 'send',
                    receiveData: senderList && senderList.length > 0 ? senderList[0] : []
                }
            } else if (businessModel.isOneToMany(liftingModeId)) {
                // 一对多
                return {
                    type: 'send',
                    receiveData: senderList && senderList.length > 0 ? senderList[0] : []
                }
            } else if (businessModel.isManyToOne(liftingModeId)) {
                // 多对一
                return {
                    type: 'receiver',
                    receiveData: receiverList && receiverList.length > 0 ? receiverList[0] : []
                }
            }
        }
        // if (receiverList.length === 1) {
        //     return {
        //         type: 'receiver',
        //         receiveData: receiverList[0]
        //     }
        // }

        // if (senderList.length === 1) {
        //     // return senderList[0]
        //     return {
        //         type: 'send',
        //         receiveData: senderList[0]
        //     }
        // }

        // if (receiverList.length > 1 && )

        return {
            receiveData: {
                bid: 0,
                code: "string",
                id: 0,
                materialList: []
            },
            type: 'send'
            
        }
    }

    // 保存按钮操作
    onSave = () => {
        const { index, data } = this.state
        const { orderMaterialList } = data.editData
        const { onChangeMateriel } = this.props
        const keys = {
            'totalQuantity': 'quantity',
            'totalBoxCount': 'boxCount',
            'totalBoardCount': 'boardCount',
            'totalGrossWeight': 'grossWeight',
            'totalVolume': 'volume'
        }
        for (let key in keys) {
            data.editData[key] = orderMaterialList.reduce((total, cur) => {
                return total + cur[keys[key]]
            }, 0)
        }
        // console.log('data', data)
        onChangeMateriel(index, data)
        this.setState({
            open: false
        })
    }

    render() { 
        let {
            receiveData
        } = this.state
        if (!receiveData || !this.state.open) {
            return null
        }
        return (
            <Modal
                onSubmit={this.onSubmit}
                style={{width: '95%', maxWidth: 1100, minHeight: 300}}
                changeOpen={this.changeOpen} 
                open={this.state.open} 
                // title={title} 
                title={'订单货物明细'} 
                >
                <div style={{minHeight: 272}}>
                    <Form layout='inline' onSubmit={this.onSave}>
                        <Modal.Header title={'货物明细'}>
                            <FormItem>
                            {/* onClick={this.saveSubmit} */}
                                <Button icon='save' htmlType="submit">
                                   保存
                                </Button>
                            </FormItem>
                        </Modal.Header>
                        <div className="flex" style={{padding: 10}}>
                            <Materiel 
                                // data={{
                                //     list: [],
                                //     receiveData: {}
                                // }}
                                receiveData={receiveData}
                                // onAddMateriel={this.onAddMateriel}
                                onSaveOrEditDataMateriel={this.onSaveOrEditDataMateriel}
                                // onDeleteMateriel={this.onDeleteMateriel}
                                onChangeMateriel={this.onChangeMateriel}
                                getThis={view => this.materiel = view}
                                isNoneTitle={true}
                                //materielTitle={materielTitle}
                            />
                        </div>
                    </Form>
                </div>
            </Modal>
        )
    }
}
 
export default Form.create()(Stowage);