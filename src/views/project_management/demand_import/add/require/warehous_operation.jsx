import React, { Component} from 'react'
import { Button, Input, InputNumber, Radio, message, Icon, Switch, Spin} from 'antd'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import MultipleFileUpload from '@src/components/uploader_file_multiple'
import { imgClient } from '@src/utils'
import { Row, Col } from '@src/components/grid'
import { CustomCheckbox } from '@src/components/custom_check'
import SwitchBtn from './switch'
import './index.less'

const RadioGroup = Radio.Group

const optionDataOne = [ //交货条件
    {
        id: 1,
        label: 'FRD卸货', 
        value: 1
    },
    {
        id: 2,
        label: '客户卸货', 
        value: 2
    },
    {
        id: 3,
        label: 'FRD提供线板/打包膜', 
        value: 3
    },
    {
        id: 4,
        label: '客户提供线板/打包膜', 
        value: 4
    },
]

const optionDataTwo = [ //出货形式
    {
        id: 1,
        label: '原板出货', 
        value: 1
    },
    {
        id: 2,
        label: '散箱出货', 
        value: 2
    },
    {
        id: 3,
        label: '拆箱by pcs出', 
        value: 3
    }
]

const optionDataThree = [ //出货要求
    {
        id: 1,
        label: '重新打板', 
        value: 1
    },
    {
        id: 2,
        label: '其它', 
        value: 2
    }
]

const optionDataFour = [  //存储要求
    {
        id: 1,
        label: '常温', 
        value: 1
    },
    {
        id: 2,
        label: '恒温', 
        value: 2
    }
]

const optionDataFive = [  //管控要求
    {
        id: 1,
        label: '管控批号', 
        value: 1
    },
    {
        id: 2,
        label: '管控SN号', 
        value: 2
    },
    {
        id: 3,
        label: '管控保质期', 
        value: 3
    },
    {
        id: 4,
        label: '其它', 
        value: 4
    }
]

const optionDataSix = [  //包材回收
    {
        id: 1,
        label: '栈板回收', 
        value: 1
    },
    {
        id: 2,
        label: '包材回收', 
        value: 2
    }
]

   
/**
 * 仓储段作业要求
 * 
 * @class WarehousOperation
 * @extends {Component}
 */
@inject('mobxTabsData')
@inject('rApi')
@observer
class WarehousOperation extends Component {

    state = {
        isCheck: true, //是否打开按钮
        loading: false,
        demandWarehouse: {}, //仓储段作业要求
        controlRequired: [], //管控要求
        controlRequiredOther: null, //管控要求其他
        deliveryConditions: [], //交货条件
        demandId: 0, //客户需求id
        id: 0,
        recycling: [], //包材回收
        requiredOther: null, //其他要求
        shippingForm: [], //出货形式
        shippingRequired: [], //出货要求
        shippingRequiredOther: null, //出货要求其他
        storeRequire: 1, //存储要求
        storeRequireRemark: 0, //温湿度备注
        uploadFileVo : [],
        checkFileUrl: [], //查看附件
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        //console.log('demand_info/vulToChilder', vulToChilder)
       if(props.vulToChilder.demandWarehouse) {
            let { 
                id,
                controlRequired, //管控要求
                controlRequiredOther, //管控要求其他
                deliveryConditions, //交货条件
                recycling, //包材回收
                requiredOther, //其他要求
                shippingForm, //出货形式
                shippingRequired, //出货要求
                shippingRequiredOther, //出货要求其他
                storeRequire, //存储要求
                storeRequireRemark, //温湿度备注
                warehouseAttachmentList,
                uploadFileVo
            } = props.vulToChilder.demandWarehouse
            
            this.state.id = id 
            this.state.controlRequired = controlRequired ? JSON.parse(controlRequired) : []
            this.state.controlRequiredOther = controlRequiredOther 
            this.state.deliveryConditions = deliveryConditions ? JSON.parse(deliveryConditions) : []
            this.state.recycling = recycling ? JSON.parse(recycling) : []
            this.state.requiredOther = requiredOther
            this.state.shippingForm = shippingForm ? JSON.parse(shippingForm) : []
            this.state.shippingRequired = shippingRequired ? JSON.parse(shippingRequired) : []
            this.state.shippingRequiredOther = shippingRequiredOther
            this.state.storeRequire = storeRequire ? parseInt(storeRequire) : 1
            this.state.storeRequireRemark = storeRequireRemark
           // this.state.uploadFileVo = uploadFileVo
            this.state.checkFileUrl = (uploadFileVo && uploadFileVo.length > 0) ? uploadFileVo.map(item => {
                let obj = {
                    uid: item.id,
                    name: item.fileName,
                    status: 'done',
                    fileUrl: imgClient().signatureUrl(item.filePath),
                    thumbUrl: imgClient().signatureUrl(item.filePath),
                    url: imgClient().signatureUrl(item.filePath)
                }
                return obj
            }) : []
       }
    }

    onChangeCheckValue = (checKVul) => { //交货要求
        this.setState({
            deliveryConditions: checKVul
        })
        return true
    }

    onChangeCheckValue2 = (checKVul) => { //出货形式
        this.setState({
            shippingForm: checKVul
        })
        return true
    }

    onChangeCheckValue3 = (checKVul) => { //出货要求
        this.setState({
            shippingRequired: checKVul
        })
        return true
    }

    // onChangeCheckValue4 = (checKVul) => { //存储要求
    //     this.setState({
    //         storeRequire: checKVul
    //     })
    //     return true
    // }

    onChangeCheckValue5 = (checKVul) => { //管控要求
        this.setState({
            controlRequired: checKVul
        })
        return true
    }

    onChangeCheckValue6 = (checKVul) => { //包材回收
        this.setState({
            recycling: checKVul
        })
        return true
    }

    getValue = () => {
        let {
            isCheck,
            controlRequired, //管控要求
            controlRequiredOther, //管控要求其他
            deliveryConditions, //交货条件
            demandId, //客户需求id
            id,
            recycling, //包材回收
            requiredOther, //其他要求
            shippingForm, //出货形式
            shippingRequired, //出货要求
            shippingRequiredOther, //出货要求其他
            storeRequire, //存储要求
            storeRequireRemark, //温湿度备注
            uploadFileVo//上传文件路径
        } = this.state

        return {
            demandWarehouse: {
                id,
                controlRequired, //管控要求
                controlRequiredOther, //管控要求其他
                deliveryConditions, //交货条件
                recycling, //包材回收
                requiredOther, //其他要求
                shippingForm, //出货形式
                shippingRequired, //出货要求
                shippingRequiredOther, //出货要求其他
                storeRequire, //存储要求
                storeRequireRemark, //温湿度备注
                uploadFileVo,
                removeAttachmentIds: []
            }//仓储段作业要求
        }
    }

    getFileDetail = (value) => {
        value = (value && value.length > 0) ? value.map(item => {
            return {
                filePath: item.fileUrl,
                fileName: item.name
            }
        }) : []
        this.setState({
            uploadFileVo: value
        })
    }

    render() {
        let {
            isCheck,
            loading,
            controlRequired, //管控要求
            controlRequiredOther, //管控要求其他
            deliveryConditions, //交货条件
            demandId, //客户需求id
            id,
            recycling, //包材回收
            requiredOther, //其他要求
            shippingForm, //出货形式
            shippingRequired, //出货要求
            shippingRequiredOther, //出货要求其他
            storeRequire, //存储要求
            storeRequireRemark, //温湿度备注
            checkFileUrl,
            uploadFileVo
        } = this.state
        return (
            <div className='warehous-main'>
                <div className='flex warehous-operation' >
                    <SwitchBtn 
                        title="仓储段作业要求"
                        style={{marginLeft: '35px'}}
                        onChange={checked => {
                            this.setState({
                                isCheck: checked
                            })
                        }} 
                    />
                    {
                        isCheck ? 
                        <div className="flex1 div-style">
                            <Row gutter={24}>
                                <Col label="交货条件&emsp;&emsp;" colon span={24} >
                                    <CustomCheckbox
                                        values={deliveryConditions}
                                        list={optionDataOne}
                                        onChangeValue={this.onChangeCheckValue}
                                    >
                                    </CustomCheckbox>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col label="出货形式&emsp;&emsp;" colon span={24} >
                                    <CustomCheckbox
                                        values={shippingForm}
                                        list={optionDataTwo}
                                        onChangeValue={this.onChangeCheckValue2}
                                    >
                                    </CustomCheckbox>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col label="管控要求&emsp;&emsp;" colon span={24} >
                                    <CustomCheckbox
                                        bindValue={4}
                                        values={controlRequired}
                                        list={optionDataFive}
                                        onChangeValue={this.onChangeCheckValue5}
                                    >
                                        <div className="negative-margin">
                                            <Input 
                                                style={{width: 140}}
                                                defaultValue={controlRequiredOther ? controlRequiredOther : ''}
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({
                                                        controlRequiredOther: e.target.value
                                                })
                                            }}
                                            />
                                        </div>
                                    </CustomCheckbox>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col label="包材回收&emsp;&emsp;" colon span={24} >
                                    <CustomCheckbox
                                        values={recycling}
                                        list={optionDataSix}
                                        onChangeValue={this.onChangeCheckValue6}
                                    >
                                    </CustomCheckbox>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col  label="出货要求&emsp;&emsp;" colon span={24} >
                                    <CustomCheckbox
                                        bindValue={2}
                                        values={shippingRequired}
                                        list={optionDataThree}
                                        onChangeValue={this.onChangeCheckValue3}
                                    >
                                    <div className="negative-margin">
                                        <Input 
                                            style={{width: 140}}
                                            defaultValue={shippingRequiredOther ? shippingRequiredOther : ''}
                                            placeholder="" 
                                            onChange={e => {
                                                this.setState({
                                                    shippingRequiredOther: e.target.value
                                            })
                                        }}
                                        />
                                    </div>
                                    </CustomCheckbox>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col label="储存要求&emsp;&emsp;" colon span={24}>
                                    <div className="flex flex-vertical-center" style={{height: 32}}>
                                        <RadioGroup 
                                            onChange={e => {
                                                this.setState({
                                                    storeRequire: e.target.value
                                                })
                                            }} 
                                            value={storeRequire ? storeRequire : 1}
                                            defaultValue={storeRequire ? storeRequire : 1}
                                            >
                                                <Radio value={1}>常温</Radio>
                                                <Radio value={2}>恒温</Radio>
                                        </RadioGroup>
                                        {
                                            storeRequire === 2 ?
                                            <InputNumber 
                                                defaultValue={storeRequireRemark ? storeRequireRemark : ''}
                                                style={{width: 140, marginLeft: '-38px'}}
                                                placeholder="温湿度备注" 
                                                max={100000}
                                                onChange={ value => {
                                                    this.setState({
                                                        storeRequireRemark: value
                                                    })
                                                }}
                                            />
                                            :
                                            null
                                        }
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col label="其他要求&emsp;&emsp;" colon span={20} >
                                    <Input 
                                        style={{width: 325}}
                                        defaultValue={requiredOther ? requiredOther : ''}
                                        title={requiredOther ? requiredOther : ''}
                                        placeholder="" 
                                        onChange={e => {
                                            this.setState({
                                                requiredOther: e.target.value
                                        })
                                    }}
                                    />
                                </Col>
                            </Row>
                            <div className="flex" style={{marginTop: 5}}>
                                <div style={{width: 84, color: 'rgb(136, 136, 136)'}}>参考附件</div>
                                <div style={{width: 500}}>
                                    {
                                        loading === true ?
                                        <Spin spinning={loading} />
                                        :
                                        <MultipleFileUpload 
                                            getFileDetail={this.getFileDetail}
                                            fileList={checkFileUrl}
                                            status={this.props.status}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                        :
                        null 
                    }
                </div>
            </div>
        )
    }
}
 
export default WarehousOperation;