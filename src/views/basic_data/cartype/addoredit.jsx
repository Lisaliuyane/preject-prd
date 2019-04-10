import React, { Component } from 'react'
import Modal from '@src/components/modular_window'
import { Button, Form, Input, InputNumber, Checkbox, message, Upload, Icon, DatePicker} from 'antd'
import FormItem from '@src/components/FormItem'
import RemoteSelect from '@src/components/select_databook'
import { Row, Col } from '@src/components/grid'
import moment from 'moment'
import { inject } from "mobx-react"
import { cloneObject } from '@src/utils'
import './index.less'

@inject('rApi')
class AddRoEdit extends Component {

    state={
        loading: false,
        open: true,
        edit: false,
        title: '车型',
        type: null,
        boxHeight: null, // 箱高
        boxLength: null, // 箱长
        boxWidth: null, // 箱宽
        carHeight: null, // 车高
        carLength: null, // 车长
        carKindId: null, // 车种ID
        carKindName: null, // 车种名
        maxWeight: null, // 最大载重
        maxCapacity: null, // 最大载积
        lengthOrWeight: null, // 车长/车重
        unitId: null, // 车长/车重 单位ID
        unitName: null, // 车长/车重 单位名称
        name: null, // 车型名称
        remark: null, // 备注
        ifShow: true, //查看不显示保存
        historyData: null, // 传入数据
    }

    constructor(props) {
        super(props);
        if (props.getThis) {
            props.getThis(this)
        }
        this.state.open = false
    }

    changeOpen = (state) => {
        this.setState({
            open: state
        })
        if (!state) {
            this.clearValue()
        }
    }

    clearValue = () => {
        this.setState({
            boxHeight: null, // 箱高
            boxLength: null, // 箱长
            boxWidth: null, // 箱宽
            carHeight: null, // 车高
            carLength: null, // 车长
            carKindId: null, // 车种ID
            carKindName: null, // 车种名
            maxWeight: null, // 最大载重
            maxCapacity: null, // 最大载积
            lengthOrWeight: null, // 车长/车重
            unitId: null, // 车长/车重 单位ID
            unitName: null, // 车长/车重 单位名称
            name: null, // 车型名称
            remark: null, // 备注
            ifShow: true //查看不显示保存
        })
    }
    show(d) {
        let historyData = typeof d.data === 'object' ? cloneObject(d.data) : null
        let {
            open,
            edit,
            title,
            type,
            boxHeight, // 箱高
            boxLength, // 箱长
            boxWidth, // 箱宽
            carHeight, // 车高
            carLength, // 车长
            carKindId, // 车种ID
            carKindName, // 车种名
            maxWeight, // 最大载重
            maxCapacity, // 最大载积
            lengthOrWeight, // 车长/车重
            unitId, // 车长/车重 单位ID
            unitName, // 车长/车重 单位名称
            name, // 车型名称
            remark, // 备注
            ifShow
        } = this.state
        // console.log('show', d)
        if (d.edit) {
            title = '编辑车型'
            type = 1
            this.setState({
                ifShow: true
            })
        } else if (d.data) {
            title = '查看车型'
            type = 2
            this.setState({
                ifShow: false
            })
        } else {
            title = '新建车型'
            type = 3
            this.setState({
                ifShow: true
            })
        }
        
        this.setState({
            ...d.data,
            historyData: historyData,
            open: true,
            edit: d.edit,
            title: title,
            type: type
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

    onSave = () => {
        const { rApi } = this.props
        let {
            id,
            open,
            edit,
            title,
            type,
            boxHeight, // 箱高
            boxLength, // 箱长
            boxWidth, // 箱宽
            carHeight, // 车高
            carLength, // 车长
            carKindId, // 车种ID
            carKindName, // 车种名
            maxWeight, // 最大载重
            maxCapacity, // 最大载积
            lengthOrWeight, // 车长/车重
            unitId, // 车长/车重 单位ID
            unitName, // 车长/车重 单位名称
            name, // 车型名称
            remark // 备注
        } = this.state
        // if (!carKindId) {
        //     message.error('请选择车种！')
        //     return
        // }
        // if (!lengthOrWeight || !unitId || !unitName) {
        //     message.error('请填写车长/车重,选择单位！')
        //     return
        // }
        // if (!carHeight || !carLength) {
        //     message.error('请填写车规格！')
        //     return
        // }
        // if (!boxLength || !boxWidth || !boxHeight) {
        //     message.error('请填写箱规格！')
        //     return
        // }
        this.setState({loading: true})
        name = lengthOrWeight + unitName + carKindName
        if(this.state.type === 1) {
            // console.log('编辑')
            rApi.editCarType({
                id,
                boxHeight, // 箱高
                boxLength, // 箱长
                boxWidth, // 箱宽
                carHeight, // 车高
                carLength, // 车长
                carKindId, // 车种ID
                carKindName, // 车种名
                maxWeight, // 最大载重
                maxCapacity, // 最大载积
                lengthOrWeight, // 车长/车重
                unitId, // 车长/车重 单位ID
                unitName, // 车长/车重 单位名称
                name, // 车型名称
                remark // 备注
            }).then(() => {
                message.success('操作成功!')
                this.changeOpen(false)
                this.setState({loading: false}, () => {
                    this.updateThisDataToTable({
                        id,
                        boxHeight, // 箱高
                        boxLength, // 箱长
                        boxWidth, // 箱宽
                        carHeight, // 车高
                        carLength, // 车长
                        carKindId, // 车种ID
                        carKindName, // 车种名
                        maxWeight, // 最大载重
                        maxCapacity, // 最大载积
                        lengthOrWeight, // 车长/车重
                        unitId, // 车长/车重 单位ID
                        unitName, // 车长/车重 单位名称
                        name, // 车型名称
                        remark // 备注
                    })
                })
            }).catch(e => {
                message.error(e.msg || '操作失败！')
                this.setState({loading: false})
            })
        } else if(this.state.type === 2) {
            this.changeOpen(false)
            //console.log('查看')
        } else if(this.state.type === 3) {
            rApi.addCarType({
                boxHeight, // 箱高
                boxLength, // 箱长
                boxWidth, // 箱宽
                carHeight, // 车高
                carLength, // 车长
                carKindId, // 车种ID
                carKindName, // 车种名
                maxWeight, // 最大载重
                maxCapacity, // 最大载积
                lengthOrWeight, // 车长/车重
                unitId, // 车长/车重 单位ID
                unitName, // 车长/车重 单位名称
                name, // 车型名称
                remark // 备注
            }).then(() => {
                this.actionDone()
                this.setState({loading: false})
            }).catch(e => {
                message.error(e.msg || '操作失败！')
                this.setState({loading: false})
            })
        }
    }

    onSubmit = () => {
        //e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            //console.log('Received values of form: ', values);
            this.onSave()
          }
        });
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
        let {
            open,
            edit,
            title,
            type,
            boxHeight, // 箱高
            boxLength, // 箱长
            boxWidth, // 箱宽
            carHeight, // 车高
            carLength, // 车长
            carKindId, // 车种ID
            carKindName, // 车种名
            maxWeight, // 最大载重
            maxCapacity, // 最大载积
            lengthOrWeight, // 车长/车重
            unitId, // 车长/车重 单位ID
            unitName, // 车长/车重 单位名称
            name, // 车型名称
            remark, // 备注
            ifShow,
            loading
        } = this.state
        const { getFieldDecorator, setFieldsValue } = this.props.form
        if (lengthOrWeight && unitName && carKindName) {
            name = lengthOrWeight + unitName + carKindName
        }
        return (
            <Modal
                onSubmit={this.onSubmit}
                maxWidth={600}
                style={{width: '95%', maxWidth: 700}}
                changeOpen={this.changeOpen} 
                open={this.state.open} 
                title={title} 
                haveFooter={type === 2 ? false : true}
                footerText="保存"
                loading={loading}
                getContentDom={v => this.popupContainer = v}
                >
                    <Form layout='inline'>
                        {/* <Modal.Header title={'车型明细'}>
                            {
                                ifShow === true ? 
                                    <FormItem>
                                        <Button 
                                            icon='save'
                                            htmlType="submit"
                                            style={{ marginRight: 0 }}
                                            loading={loading}
                                        >
                                            保存
                                        </Button>
                                    </FormItem>
                                    :
                                    null
                            }
                        </Modal.Header> */}
                            <div className="cartype-wrapper" style={{padding: '10px 25px 20px', margin: 'auto'}}>
                                <Row gutter={24} type={type}>
                                    <Col isRequired label="选择车种" span={6} text={carKindName}>
                                        <FormItem>
                                            {
                                                getFieldDecorator('carKindId', {
                                                    initialValue: carKindId ? 
                                                    {
                                                        id: carKindId,
                                                        title: carKindName
                                                    }
                                                    :
                                                    null,
                                                    rules: [
                                                        {
                                                            required: true, 
                                                            message: '请选择车种'
                                                        }
                                                    ],
                                                })(
                                                    <RemoteSelect
                                                        defaultValue={
                                                            carKindId ? 
                                                            {
                                                                id: carKindId,
                                                                title: carKindName
                                                            }
                                                            :
                                                            null
                                                        }
                                                        //dropdownStyle={{maxHeight: 150}}
                                                       // getPopupContainer={() => this.popupContainer || document.body}
                                                        onChangeValue={(value = {}) => this.setState({carKindId: value.id, carKindName: value.title})}
                                                        text="车种"
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col isRequired label="车长/车重" span={10} text={`${lengthOrWeight}${unitName}`}>
                                        <div className='flex'>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('lengthOrWeight', {
                                                        initialValue: lengthOrWeight,
                                                        rules: [
                                                            { 
                                                                required: true, 
                                                                message: '请填写车长/车重'
                                                            }
                                                        ],
                                                    })(
                                                        <InputNumber
                                                            min={0}
                                                            style={{width: 110}}
                                                            //defaultValue={lengthOrWeight}
                                                            onChange={value => this.setState({lengthOrWeight: value})}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                            <div style={{width: 2}}>
                                            </div>
                                            <div  style={{width: 80}}>
                                                <FormItem style={{width: 80}}>
                                                    {
                                                        getFieldDecorator('unitId', {
                                                            initialValue: unitId ?
                                                            {
                                                                id: unitId,
                                                                title: unitName
                                                            }
                                                            :
                                                            null,
                                                            rules: [
                                                                {
                                                                    required: true, 
                                                                    message: '请选择单位'
                                                                }
                                                            ],
                                                        })(
                                                            <RemoteSelect
                                                                onChangeValue={(value = {}) => this.setState({unitId: value.id, unitName: value.title})} 
                                                                defaultValue={
                                                                    unitId ?
                                                                    {
                                                                        id: unitId,
                                                                        title: unitName
                                                                    }
                                                                    :
                                                                    null
                                                                }
                                                                getPopupContainer={() => this.popupContainer || document.body}
                                                                placeholder='单位'
                                                                text="车辆计量单位"
                                                            />
                                                        )
                                                    }
                                                </FormItem>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col  label="车型名称" span={7} text={name}>
                                        <Input 
                                            disabled
                                            value={name ? name : ''}
                                            placeholder="自动生成"
                                            onChange={e => {this.setState({name: e.target.value})}}
                                        />
                                    </Col>
                                </Row>
                                <Row gutter={24} type={type} >
                                    <Col isRequired label="箱规格" span={14} text={`${boxLength} x ${boxWidth} x ${boxHeight}`}>
                                        <FormItem style={{width: 88}}>
                                            {
                                                getFieldDecorator('boxLength', {
                                                    initialValue: boxLength,
                                                    rules: [
                                                        { 
                                                            required: true, 
                                                            message: '请填写箱长'
                                                        }
                                                    ],
                                                })(
                                                    <InputNumber
                                                        min={0}
                                                        //defaultValue={boxLength}
                                                        placeholder='长(L)'
                                                        onChange={value => this.setState({boxLength: value})}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                        <span style={{padding: '0 4px', lineHeight: '35px'}}>x</span>
                                        <FormItem style={{width: 88}}>
                                            {
                                                getFieldDecorator('boxWidth', {
                                                    initialValue: boxWidth,
                                                    rules: [
                                                        { 
                                                            required: true, 
                                                            message: '请填写箱宽'
                                                        }
                                                    ],
                                                })(
                                                    <InputNumber
                                                        min={0}
                                                        //defaultValue={boxWidth}
                                                        placeholder='宽(B)'
                                                        onChange={value => this.setState({boxWidth: value})}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                        <span style={{padding: '0 4px', lineHeight: '35px'}}>x</span>
                                        <FormItem style={{width: 88}}>
                                            {
                                                getFieldDecorator('boxHeight', {
                                                    initialValue: boxHeight,
                                                    rules: [
                                                        { 
                                                            required: true, 
                                                            message: '请填写箱高'
                                                        }
                                                    ],
                                                })(
                                                    <InputNumber
                                                        min={0}
                                                        //defaultValue={boxHeight}
                                                        placeholder='高(H)'
                                                        onChange={value => this.setState({boxHeight: value})}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col isRequired label="车规格" span={10} text={`${carLength} x ${carHeight}`}>
                                        <FormItem style={{width: 88}}>
                                            {
                                                getFieldDecorator('carLength', {
                                                    initialValue: carLength,
                                                    rules: [
                                                        { 
                                                            required: true, 
                                                            message: '请填写车长'
                                                        }
                                                    ],
                                                })(
                                                    <InputNumber
                                                        min={0}
                                                        //defaultValue={carLength}
                                                        placeholder='长(L)'
                                                        onChange={value => this.setState({carLength: value})}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                        <span style={{padding: '0 4px', lineHeight: '35px'}}>x</span>
                                        <FormItem style={{width: 88}}>
                                            {
                                                getFieldDecorator('carHeight', {
                                                    initialValue: carHeight,
                                                    rules: [
                                                        { 
                                                            required: true, 
                                                            message: '请填写车高'
                                                        }
                                                    ],
                                                })(
                                                    <InputNumber
                                                        min={0}
                                                        //defaultValue={carHeight}
                                                        placeholder='高(H)'
                                                        onChange={value => this.setState({carHeight: value})}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={24} type={type}>
                                    <Col label="最大载重(t)" span={7} text={maxWeight}>
                                        {/* <FormItem style={{width: 88}}>
                                            {
                                                getFieldDecorator('maxWeight', {
                                                    initialValue: maxWeight,
                                                    rules: [
                                                        { 
                                                            required: true, 
                                                            message: '请填写最大载重'
                                                        }
                                                    ],
                                                })( */}
                                                    <InputNumber 
                                                        min={0}
                                                        defaultValue={maxWeight ? maxWeight : null}
                                                        placeholder="" 
                                                        onChange={value => {this.setState({maxWeight: value})}}
                                                    />
                                                {/* )
                                            }
                                        </FormItem> */}
                                    </Col>
                                    <Col label="最大体积(m³)" span={7} text={maxCapacity}>
                                        <InputNumber 
                                            // value={phone ? phone : ''}
                                            min={0}
                                            defaultValue={maxCapacity ? maxCapacity : ''}
                                            placeholder="" 
                                            onChange={value => {this.setState({maxCapacity: value})}}
                                        />
                                    </Col>
                                    <Col span={9}>
                                    </Col>
                                </Row>
                                <Row gutter={24} type={type} >
                                    <Col  label="备注" span={24} text={remark}>
                                        <Input
                                            defaultValue={remark ? remark : ''}
                                            placeholder=""
                                            title={remark}
                                            onChange={e => {this.setState({remark: e.target.value})}}
                                        />
                                    </Col>
                                </Row>
                            </div>
                    </Form>
            </Modal>
        )
    }
}
 
export default Form.create()(AddRoEdit);