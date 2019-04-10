import React, { Component} from 'react'
import { Button, Input, InputNumber, Radio, message, Icon, Switch} from 'antd'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { Row, Col } from '@src/components/grid'
import { CustomCheckbox } from '@src/components/custom_check'
import SwitchBtn from './switch'
import './index.less'

const RadioGroup = Radio.Group
const optionData = [ //装车环境
    {
        id: 1,
        label: '码头', 
        value: 1
    },
    {
        id: 2,
        label: '雨棚', 
        value: 2
    },
    {
        id: 3,
        label: '登车桥', 
        value: 3
    },
    {
        id: 4,
        label: '场地适用车型', 
        value: 4
    },
]

const optionDataT = [  //货物装车形态
    {
        id: 1,
        label: '散货', 
        value: 1
    },
    {
        id: 2,
        label: '板货', 
        value: 2
    }
]

const optionDataR = [  //装车责任
    {
        id: 1,
        label: 'FRD装货', 
        value: 1
    },
    {
        id: 2,
        label: '客户装货', 
        value: 2
    }
]

const optionDataY = [  //装车要求
    {
        id: 1,
        label: '自备工具', 
        value: 1
    },
    {
        id: 2,
        label: '其它', 
        value: 2
    }
]


/**
 * 运输段作业要求
 * 
 * @class DeliveryGoods
 * @extends {Component}
 */
@inject('mobxTabsData')
@inject('rApi')
@observer
class DeliveryGoods extends Component {

    state = {
        isCheck: true, //是否打开按钮
        demandTransportDelivery: {}, //运输段作业要求（提货）
        cargoCostumeCarForm: [], //货物装车形态 
        cargoCostumeCarFormBoardLong: null, //货物装车形态板货尺寸
        cargoCostumeCarFormBoardWidth: null,
        cargoCostumeCarFormBoardHeight: null,
        costumeCarEnvironment: [], //装车环境
        costumeCarEnvironmentTypeId: null, //装车环境车种
        costumeCarEnvironmentType: null,
        costumeCarEnvironmentTypeFirst: null,
        costumeCarEnvironmentTypeEnd: null,
        costumeCarEnvironmentTypeUnitId: null, //车种单位
        costumeCarEnvironmentTypeUnit: null,
        costumeCarRequired: [], //装车要求
        costumeCarRequiredOther: null, //装车要求其他
        costumeCarResponsibility: [], //装车责任
        demandId: 0, //客户需求ID
        id: 0,
        isCustoms: 0, //是否报关
        reLoadCarEnvironment: false //重新渲染场地适用车型数据
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        //console.log('demand_info/vulToChilder', vulToChilder)
       if(props.vulToChilder.demandTransportDelivery) {
            let { 
                id,
                cargoCostumeCarForm, //货物装车形态 
                cargoCostumeCarFormBoardLong, //货物装车形态板货尺寸
                cargoCostumeCarFormBoardWidth,
                cargoCostumeCarFormBoardHeight,
                costumeCarEnvironment, //装车环境
                costumeCarEnvironmentType, //装车环境车型name
                costumeCarEnvironmentTypeId, //装车环境车型id
                costumeCarEnvironmentTypeFirst,
                costumeCarEnvironmentTypeEnd,
                costumeCarEnvironmentTypeUnitId,
                costumeCarEnvironmentTypeUnit,
                costumeCarRequired, //装车要求
                costumeCarRequiredOther, //装车要求其他
                costumeCarResponsibility, //装车责任
                isCustoms//是否报关
            } = props.vulToChilder.demandTransportDelivery

            this.state.id = id 
            this.state.cargoCostumeCarForm = cargoCostumeCarForm ? JSON.parse(cargoCostumeCarForm) : [] 
            this.state.cargoCostumeCarFormBoardLong = cargoCostumeCarFormBoardLong
            this.state.cargoCostumeCarFormBoardWidth = cargoCostumeCarFormBoardWidth
            this.state.cargoCostumeCarFormBoardHeight = cargoCostumeCarFormBoardHeight
            this.state.costumeCarEnvironment = costumeCarEnvironment ? JSON.parse(costumeCarEnvironment) : [] 
            this.state.costumeCarEnvironmentTypeId = costumeCarEnvironmentTypeId
            this.state.costumeCarEnvironmentType = costumeCarEnvironmentType
            this.state.costumeCarEnvironmentTypeFirst = costumeCarEnvironmentTypeFirst
            this.state.costumeCarEnvironmentTypeEnd = costumeCarEnvironmentTypeEnd
            this.state.costumeCarEnvironmentTypeUnitId = costumeCarEnvironmentTypeUnitId
            this.state.costumeCarEnvironmentTypeUnit = costumeCarEnvironmentTypeUnit
            this.state.costumeCarRequired = costumeCarRequired ? JSON.parse(costumeCarRequired) : [] 
            this.state.costumeCarRequiredOther = costumeCarRequiredOther
            this.state.costumeCarResponsibility = costumeCarResponsibility ? JSON.parse(costumeCarResponsibility) : [] 
            this.state.isCustoms = isCustoms
       }
    }

    onChangeCheckValue = (checKVul) => {
        this.setState({
            costumeCarEnvironment: checKVul
        })
        return true
    }

    onChangeCheckValue2 = (checKVul) => {
        this.setState({
            cargoCostumeCarForm: checKVul
        })
        return true
    }

    onChangeCheckValue3 = (checKVul) => {
        this.setState({
            costumeCarResponsibility: checKVul
        })
        return true
    }

    onChangeCheckValue4 = (checKVul) => {
        this.setState({
            costumeCarRequired: checKVul
        })
        return true
    }

    getValue = () => {
        let {
            isCheck,
            demandTransportDelivery, //运输段作业要求（提货）
            cargoCostumeCarForm, //货物装车形态 
            cargoCostumeCarFormBoardLong, //货物装车形态板货尺寸
            cargoCostumeCarFormBoardWidth,
            cargoCostumeCarFormBoardHeight,
            costumeCarEnvironment, //装车环境
            costumeCarEnvironmentType, //装车环境车型name
            costumeCarEnvironmentTypeId, //装车环境车型id
            costumeCarEnvironmentTypeFirst,
            costumeCarEnvironmentTypeEnd,
            costumeCarEnvironmentTypeUnitId,
            costumeCarEnvironmentTypeUnit,
            costumeCarRequired, //装车要求
            costumeCarRequiredOther, //装车要求其他
            costumeCarResponsibility, //装车责任
            demandId, //客户需求ID
            id,
            isCustoms//是否报关
        } = this.state
        return {
            demandTransportDelivery: {
                id,
                cargoCostumeCarForm, //货物装车形态 
                cargoCostumeCarFormBoardLong, //货物装车形态板货尺寸
                cargoCostumeCarFormBoardWidth,
                cargoCostumeCarFormBoardHeight,
                costumeCarEnvironment, //装车环境
                costumeCarEnvironmentType, //装车环境车型name
                costumeCarEnvironmentTypeId, //装车环境车型id
                costumeCarEnvironmentTypeFirst,
                costumeCarEnvironmentTypeEnd,
                costumeCarEnvironmentTypeUnitId,
                costumeCarEnvironmentTypeUnit,
                costumeCarRequired, //装车要求
                costumeCarRequiredOther, //装车要求其他
                costumeCarResponsibility, //装车责任
                isCustoms//是否报关
            }
        }
    }

    clearData = (isClearAll) => {
        if (isClearAll) {
            this.setState({
                reLoadCarEnvironment: true,
                costumeCarEnvironmentTypeFirst: null,
                costumeCarEnvironmentTypeEnd: null,
                costumeCarEnvironmentTypeUnitId: null,
                costumeCarEnvironmentTypeUnit: ''
            }, () => {
                this.setState({
                    reLoadCarEnvironment: false
                })
            })
        }
    }
    render() {
        let {
            isCheck,
            cargoCostumeCarForm, //货物装车形态 
            cargoCostumeCarFormBoardLong, //货物装车形态板货尺寸
            cargoCostumeCarFormBoardWidth,
            cargoCostumeCarFormBoardHeight,
            costumeCarEnvironment, //装车环境
            costumeCarEnvironmentTypeId, //装车环境车种
            costumeCarEnvironmentType,
            costumeCarEnvironmentTypeFirst,
            costumeCarEnvironmentTypeEnd,
            costumeCarEnvironmentTypeUnitId,
            costumeCarEnvironmentTypeUnit,
            costumeCarRequired, //装车要求
            costumeCarRequiredOther, //装车要求其他
            costumeCarResponsibility, //装车责任
            demandId, //客户需求ID
            id,
            isCustoms,//是否报关
            reLoadCarEnvironment
        } = this.state
        return (
            <div className='delivery-main'>
                <div className='flex delivery-goods' >
                    <SwitchBtn 
                        title="运输段作业要求&nbsp;(提货)"
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
                                <Col label="装车环境&emsp;&emsp;" colon span={24} isNoCenter>
                                    <CustomCheckbox
                                        bindValue={4}
                                        noFlexBlock
                                        values={costumeCarEnvironment}
                                        list={optionData}
                                        onChangeValue={this.onChangeCheckValue}
                                    >
                                        <div className="flex" style={{marginTop: 5}}>
                                            <div style={{width: 120}}>
                                                <RemoteSelect
                                                    defaultValue={(costumeCarEnvironmentTypeId && costumeCarEnvironmentType) ? {id: costumeCarEnvironmentTypeId, title: costumeCarEnvironmentType} : ''}
                                                    //placeholder={''}
                                                    onChangeValue={
                                                        value => {
                                                            this.setState({
                                                                costumeCarEnvironmentTypeId: value ? value.id : null,
                                                                costumeCarEnvironmentType: value ? value.title || value.name : ''
                                                            }, () => {
                                                                let id = value ? value.id : null
                                                                if (id !== costumeCarEnvironmentTypeId) {
                                                                    this.clearData(true)
                                                                }
                                                            })
                                                        }
                                                    } 
                                                    text="车种"
                                                    // getDataMethod={'getCarTypes'}
                                                    // params={{offset: 0, limit: 10000}}
                                                    //labelField={'name'}
                                                />
                                            </div>
                                            &ensp;
                                            {
                                                reLoadCarEnvironment ?
                                                null
                                                :
                                                <InputNumber 
                                                    min={1} 
                                                    value={costumeCarEnvironmentTypeFirst ? costumeCarEnvironmentTypeFirst : null}
                                                    onChange={(value) => {
                                                        this.setState({
                                                            costumeCarEnvironmentTypeFirst: value
                                                        })
                                                    }} 
                                                    disabled={(costumeCarEnvironmentTypeId || costumeCarEnvironmentType) ? false : true}
                                                    step={1}
                                                />
                                            }
                                            <span style={{lineHeight: '31px'}}>&ensp;-&ensp;</span>
                                            {
                                                reLoadCarEnvironment ?
                                                null
                                                :
                                                <InputNumber 
                                                    min={1} 
                                                    value={costumeCarEnvironmentTypeEnd ? costumeCarEnvironmentTypeEnd : null}
                                                    onChange={(value) => {
                                                        this.setState({
                                                            costumeCarEnvironmentTypeEnd: value
                                                        })
                                                    }} 
                                                    disabled={(costumeCarEnvironmentTypeId || costumeCarEnvironmentType) ? false : true}
                                                    step={1}
                                                />
                                            }
                                            &ensp;
                                            {
                                                reLoadCarEnvironment ?
                                                null
                                                :
                                                <div style={{width: 100}}>
                                                    <RemoteSelect
                                                        defaultValue={(costumeCarEnvironmentTypeUnitId && costumeCarEnvironmentTypeUnit) ? {id: costumeCarEnvironmentTypeUnitId, title: costumeCarEnvironmentTypeUnit} : ''}
                                                        //placeholder={''}
                                                        onChangeValue={
                                                            value => {
                                                                this.setState({
                                                                    costumeCarEnvironmentTypeUnitId: value ? value.id : null,
                                                                    costumeCarEnvironmentTypeUnit: value ? value.title || value.name : ''
                                                                })
                                                            }
                                                        } 
                                                        disabled={(costumeCarEnvironmentTypeId || costumeCarEnvironmentType) ? false : true}
                                                        placeholder='单位'
                                                        text="车辆计量单位"
                                                        // getDataMethod={'getCarTypes'}
                                                        // params={{offset: 0, limit: 10000}}
                                                        // labelField={'name'}
                                                    />
                                                </div>
                                            }
                                        </div>
                                    </CustomCheckbox>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col label="装车责任&emsp;&emsp;" colon span={24} >
                                    <CustomCheckbox
                                        values={costumeCarResponsibility}
                                        list={optionDataR}
                                        onChangeValue={this.onChangeCheckValue3}
                                    >
                                    </CustomCheckbox>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col label="装车形态&emsp;&emsp;" colon span={24} >
                                    <CustomCheckbox
                                        bindValue={2}
                                        values={cargoCostumeCarForm}
                                        list={optionDataT}
                                        onChangeValue={this.onChangeCheckValue2}
                                    >
                                        <div className="negative-margin">
                                            {/* <Input 
                                                defaultValue={cargoCostumeCarFormBoard ? cargoCostumeCarFormBoard : ''}
                                                style={{width: 140}}
                                                placeholder="长*宽*高" 
                                                onChange={ e => {
                                                    this.setState({
                                                        cargoCostumeCarFormBoard: e.target.value
                                                    })
                                                }}
                                            /> */}
                                            <InputNumber 
                                                min={0} 
                                                placeholder="长"
                                                value={cargoCostumeCarFormBoardLong}
                                                onChange={(value) => {
                                                    this.setState({
                                                        cargoCostumeCarFormBoardLong: value
                                                    })
                                                }} 
                                            />
                                            <span>&ensp;×&ensp;</span>
                                            <InputNumber 
                                                min={0} 
                                                placeholder="宽"
                                                value={cargoCostumeCarFormBoardWidth}
                                                onChange={(value) => {
                                                    this.setState({
                                                        cargoCostumeCarFormBoardWidth: value
                                                    })
                                                }} 
                                            />
                                            <span>&ensp;×&ensp;</span>
                                            <InputNumber 
                                                min={0} 
                                                placeholder="高"
                                                value={cargoCostumeCarFormBoardHeight}
                                                onChange={(value) => {
                                                    this.setState({
                                                        cargoCostumeCarFormBoardHeight: value
                                                    })
                                                }} 
                                            />
                                        </div>
                                        <span style={{lineHeight: '32px'}}>&nbsp;m</span>
                                    </CustomCheckbox>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col label="装车要求&emsp;&emsp;" colon span={24} >
                                    <CustomCheckbox
                                        bindValue={2}
                                        values={costumeCarRequired}
                                        list={optionDataY}
                                        onChangeValue={this.onChangeCheckValue4}
                                    >
                                        <div className="negative-margin">
                                            <Input 
                                                style={{maxWidth: 140}}
                                                defaultValue={costumeCarRequiredOther ? costumeCarRequiredOther : null}
                                                //placeholder="输入尺寸" 
                                                onChange={e => {
                                                    this.setState({
                                                        costumeCarRequiredOther: e.target.value || ''
                                                })
                                            }}
                                            />
                                        </div>
                                    </CustomCheckbox>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col label="是否报关&emsp;&emsp;" colon span={24} >
                                    <RadioGroup
                                        value={isCustoms ? isCustoms : 1}
                                        defaultValue={isCustoms ? isCustoms : 1} 
                                        onChange={e => {
                                            this.setState({
                                                isCustoms: e.target.value
                                            })
                                        }} 
                                        >
                                            <Radio value={1}>是</Radio>
                                            <Radio value={2}>否</Radio>
                                    </RadioGroup>
                                </Col>
                            </Row>
                        </div>
                        :
                        null 
                    }
                </div>
            </div>
        )
    }
}
 
export default DeliveryGoods;