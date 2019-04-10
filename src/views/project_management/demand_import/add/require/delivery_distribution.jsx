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

const optionDataOne = [ //运输方式
    {
        id: 1,
        label: '汽运', 
        value: 1
    },
    {
        id: 2,
        label: '铁路', 
        value: 2
    },
    {
        id: 3,
        label: '海运', 
        value: 3
    },
    {
        id: 4,
        label: '空运', 
        value: 4
    },
]

const optionDataTwo = [ //配送环境
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

const optionDataThree = [ //配送特殊要求
    {
        id: 1,
        label: '专车', 
        value: 1
    },
    {
        id: 2,
        label: '开箱验货', 
        value: 2
    },
    {
        id: 3,
        label: '预约', 
        value: 3
    },
    {
        id: 4,
        label: '运费到付', 
        value: 4
    },
    {
        id: 5,
        label: '代收货款', 
        value: 5
    }
]

const optionDataFour = [  //卸货要求
    {
        id: 1,
        label: '自备工具', 
        value: 1
    },
    {
        id: 2,
        label: '卸至指定点', 
        value: 2
    },
    {
        id: 3,
        label: '其它', 
        value: 3
    }
]

const optionDataFive = [  //卸货责任
    {
        id: 1,
        label: 'FRD卸货', 
        value: 1
    },
    {
        id: 2,
        label: '客户卸货', 
        value: 2
    }
]

const optionDataSix = [  //货物保险
    {
        id: 1,
        label: 'FRD购买', 
        value: 1
    },
    {
        id: 2,
        label: '客户购买', 
        value: 2
    }
]

const optionDataSeven = [ //回单要求
    {
        id: 1,
        label: '纸质回单', 
        value: 1
    },
    {
        id: 2,
        label: '电子回单', 
        value: 2
    },
    // {
    //     id: 3,
    //     label: '仅纸质回单备查', 
    //     value: 3
    // },
    // {
    //     id: 4,
    //     label: '仅电子回单备查', 
    //     value: 4
    // },
]

const advanceTimeUnitList = [
    {
        id: '天',
        name: '天'
    },
    {
        id: '小时',
        name: '小时'
    }
]
/**
 * 运输段作业要求
 * 
 * @class DeliveryDistribution
 * @extends {Component}
 */
@inject('mobxTabsData')
@inject('rApi')
@observer
class DeliveryDistribution extends Component {

    state = {
        isCheck: true, //是否打开按钮
        loading: false,
        demandTransportDistribution: {}, //运输段作业要求（配送）
        advanceTime: 0, //下单提前时间,
        advanceTimeUnit: null, //下单提前时间（单位）
        cargoInsurance: [], //货物保险
        demandId: 0, //客户需求id
        dischargeRequired: [], //卸货要求
        dischargeRequiredOther: null, //卸货要求其他
        dischargeResponsibility: [], //卸货责任
        distributionEnvironment: [], //配送环境
        distributionEnvironmentCarTypeUnitId: null,
        distributionEnvironmentCarTypeUnit: null,
        distributionEnvironmentCarTypeId: null,
        distributionEnvironmentCarType: null, //配送环境车种
        distributionEnvironmentCarTypeFirst: null,
        distributionEnvironmentCarTypeEnd: null,
        id: 0,
        receiptRequired: [], //回单要求
        requiredOther: null, //其他要求
        specialDeliveryRequired: [], //特殊配送要求
        transportMethod: [], //运输方式
        uploadFileVo : [],
        checkFileUrl: [], //查看附件
        reLoadCarEnvironment: false //重新渲染场地适用车型
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        //console.log('demand_info/vulToChilder', vulToChilder)
       if(props.vulToChilder.demandTransportDistribution) {
            let { 
                id,
                advanceTime, //下单提前时间
                cargoInsurance, //货物保险
                dischargeRequired, //卸货要求
                dischargeRequiredOther, //卸货要求其他
                dischargeResponsibility, //卸货责任
                distributionEnvironment, //配送环境
                distributionEnvironmentCarTypeUnitId,
                distributionEnvironmentCarTypeUnit,
                distributionEnvironmentCarTypeId,
                distributionEnvironmentCarType, //配送环境车种
                distributionEnvironmentCarTypeFirst,
                distributionEnvironmentCarTypeEnd,
                receiptRequired, //回单要求
                requiredOther, //回单其他要求
                specialDeliveryRequired, //特殊配送要求
                transportMethod, //运输方式
                transportDistributionAttachmentList,
                advanceTimeUnit,
                uploadFileVo
            } = props.vulToChilder.demandTransportDistribution
            
            this.state.id = id 
            this.state.advanceTime = advanceTime 
            this.state.cargoInsurance = cargoInsurance ? JSON.parse(cargoInsurance) : []
            this.state.dischargeRequired = dischargeRequired ? JSON.parse(dischargeRequired) : []
            this.state.dischargeRequiredOther = dischargeRequiredOther 
            this.state.dischargeResponsibility = dischargeResponsibility ? JSON.parse(dischargeResponsibility) : []
            this.state.distributionEnvironment = distributionEnvironment ? JSON.parse(distributionEnvironment) : []
            this.state.distributionEnvironmentCarTypeUnitId = distributionEnvironmentCarTypeUnitId
            this.state.distributionEnvironmentCarTypeUnit = distributionEnvironmentCarTypeUnit
            this.state.distributionEnvironmentCarTypeId = distributionEnvironmentCarTypeId
            this.state.distributionEnvironmentCarType = distributionEnvironmentCarType
            this.state.distributionEnvironmentCarTypeFirst = distributionEnvironmentCarTypeFirst
            this.state.distributionEnvironmentCarTypeEnd = distributionEnvironmentCarTypeEnd
            this.state.receiptRequired = receiptRequired ? JSON.parse(receiptRequired) : []
            this.state.requiredOther = requiredOther
            this.state.specialDeliveryRequired = specialDeliveryRequired ? JSON.parse(specialDeliveryRequired) : []
            this.state.transportMethod = transportMethod ? JSON.parse(transportMethod) : []
            this.state.advanceTimeUnit = advanceTimeUnit
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

    onChangeCheckValue = (checKVul) => { //运输方式
        this.setState({
            transportMethod: checKVul
        })
        return true
    }

    onChangeCheckValue2 = (checKVul) => { //配送环境
        this.setState({
            distributionEnvironment: checKVul
        })
        return true
    }

    onChangeCheckValue3 = (checKVul) => { //配送特殊要求
        this.setState({
            specialDeliveryRequired: checKVul
        })
        return true
    }

    onChangeCheckValue4 = (checKVul) => { //卸货要求
        this.setState({
            dischargeRequired: checKVul
        })
        return true
    }

    onChangeCheckValue5 = (checKVul) => { //卸货责任
        this.setState({
            dischargeResponsibility: checKVul
        })
        return true
    }

    onChangeCheckValue6 = (checKVul) => { //货物保险
        this.setState({
            cargoInsurance: checKVul
        })
        return true
    }

    onChangeCheckValue7 = (checKVul) => { //回单要求
        this.setState({
            receiptRequired: checKVul
        })
        return true
    }

    getValue = () => {
        let {
            isCheck,
            advanceTime, //下单提前时间
            cargoInsurance, //货物保险
            demandId, //客户需求id
            dischargeRequired, //卸货要求
            dischargeRequiredOther, //卸货要求其他
            dischargeResponsibility, //卸货责任
            distributionEnvironment, //配送环境
            distributionEnvironmentCarTypeUnitId,
            distributionEnvironmentCarTypeUnit,
            distributionEnvironmentCarTypeId,
            distributionEnvironmentCarType, //配送环境车种
            distributionEnvironmentCarTypeFirst,
            distributionEnvironmentCarTypeEnd,
            id,
            receiptRequired, //回单要求
            requiredOther, //回单其他要求
            specialDeliveryRequired, //特殊配送要求
            transportMethod, //运输方式
            advanceTimeUnit,
            uploadFileVo, //上传文件路径
        } = this.state

        return {
            demandTransportDistribution: {
                id,
                advanceTime, //下单提前时间
                cargoInsurance, //货物保险
                dischargeRequired, //卸货要求
                dischargeRequiredOther, //卸货要求其他
                dischargeResponsibility, //卸货责任
                distributionEnvironment, //配送环境
                distributionEnvironmentCarTypeUnitId,
                distributionEnvironmentCarTypeUnit,
                distributionEnvironmentCarTypeId,
                distributionEnvironmentCarType, //配送环境车种
                distributionEnvironmentCarTypeFirst,
                distributionEnvironmentCarTypeEnd,
                receiptRequired, //回单要求
                requiredOther, //回单其他要求
                specialDeliveryRequired, //特殊配送要求
                transportMethod, //运输方式
                uploadFileVo,
                advanceTimeUnit,
                removeAttachmentIds: []
            }
        }
    }

    clearData = (isClearAll) => {
        if (isClearAll) {
            this.setState({
                reLoadCarEnvironment: true,
                distributionEnvironmentCarTypeFirst: null,
                distributionEnvironmentCarTypeEnd: null,
                distributionEnvironmentCarTypeUnitId: null,
                distributionEnvironmentCarTypeUnit: null
            }, () => {
                this.setState({
                    reLoadCarEnvironment: false
                })
            })
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
            advanceTime, //下单提前时间
            cargoInsurance, //货物保险
            demandId, //客户需求id
            dischargeRequired, //卸货要求
            dischargeRequiredOther, //卸货要求其他
            dischargeResponsibility, //卸货责任
            distributionEnvironment, //配送环境
            distributionEnvironmentCarTypeUnitId,
            distributionEnvironmentCarTypeUnit,
            distributionEnvironmentCarTypeId,
            distributionEnvironmentCarType, //配送环境车种
            distributionEnvironmentCarTypeFirst,
            distributionEnvironmentCarTypeEnd,
            id,
            receiptRequired, //回单要求
            requiredOther, //回单其他要求
            specialDeliveryRequired, //特殊配送要求
            transportMethod, //运输方式
            checkFileUrl,
            uploadFileVo,
            advanceTimeUnit,
            reLoadCarEnvironment
        } = this.state
        return (
            <div className='distribution-main'>
                <div className='flex delivery-distribution' >
                    <SwitchBtn 
                        title="运输段作业要求&nbsp;(配送)"
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
                                <Col label="运输方式&emsp;&emsp;" colon span={24} >
                                    <CustomCheckbox
                                        values={transportMethod}
                                        list={optionDataOne}
                                        onChangeValue={this.onChangeCheckValue}
                                    >
                                    </CustomCheckbox>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col label="特殊要求&emsp;&emsp;" colon span={24} >
                                    <CustomCheckbox
                                        values={specialDeliveryRequired}
                                        list={optionDataThree}
                                        onChangeValue={this.onChangeCheckValue3}
                                    >
                                    </CustomCheckbox>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col label="配送环境&emsp;&emsp;" colon isNoCenter span={24} >
                                    <CustomCheckbox
                                        bindValue={4}
                                        noFlexBlock
                                        values={distributionEnvironment}
                                        list={optionDataTwo}
                                        onChangeValue={this.onChangeCheckValue2}
                                    >
                                        <div className="flex" style={{marginTop: 5}}>
                                            <div style={{width: 120}}>
                                                <RemoteSelect
                                                    defaultValue={(distributionEnvironmentCarTypeId && distributionEnvironmentCarType) ? {id: distributionEnvironmentCarTypeId, title: distributionEnvironmentCarType} : ''}
                                                    //placeholder={''}
                                                    onChangeValue={
                                                        value => {
                                                            this.setState({
                                                                distributionEnvironmentCarTypeId: value ? value.id : null,
                                                                distributionEnvironmentCarType: value ? value.title || value.name : ''
                                                            }, () => {
                                                                let id = value ? value.id : null
                                                                if (id !== distributionEnvironmentCarTypeId) {
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
                                                    value={distributionEnvironmentCarTypeFirst ? distributionEnvironmentCarTypeFirst : null}
                                                    onChange={(value) => {
                                                        this.setState({
                                                            distributionEnvironmentCarTypeFirst: value
                                                        })
                                                    }} 
                                                    disabled={(distributionEnvironmentCarTypeId || distributionEnvironmentCarType) ? false : true}
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
                                                    value={distributionEnvironmentCarTypeEnd ? distributionEnvironmentCarTypeEnd : null}
                                                    onChange={(value) => {
                                                        this.setState({
                                                            distributionEnvironmentCarTypeEnd: value
                                                        })
                                                    }} 
                                                    disabled={(distributionEnvironmentCarTypeId || distributionEnvironmentCarType) ? false : true}
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
                                                        defaultValue={(distributionEnvironmentCarTypeUnitId && distributionEnvironmentCarTypeUnit) ? {id: distributionEnvironmentCarTypeUnitId, title: distributionEnvironmentCarTypeUnit} : ''}
                                                        //placeholder={''}
                                                        onChangeValue={
                                                            value => {
                                                                this.setState({
                                                                    distributionEnvironmentCarTypeUnitId: value ? value.id : null,
                                                                    distributionEnvironmentCarTypeUnit: value ? value.title || value.name : ''
                                                                })
                                                            }
                                                        } 
                                                        disabled={(distributionEnvironmentCarTypeId || distributionEnvironmentCarType) ? false : true}
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
                                <Col label="卸货要求&emsp;&emsp;" colon span={24} >
                                    <CustomCheckbox
                                        bindValue={3}
                                        values={dischargeRequired}
                                        list={optionDataFour}
                                        onChangeValue={this.onChangeCheckValue4}
                                    >
                                        <div className="negative-margin">
                                            <Input 
                                                style={{maxWidth: 140}}
                                                defaultValue={dischargeRequiredOther ? dischargeRequiredOther : ''}
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({
                                                        dischargeRequiredOther: e.target.value
                                                })
                                            }}
                                            />
                                        </div>
                                    </CustomCheckbox>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col  label="卸货责任&emsp;&emsp;" colon span={24} >
                                    <CustomCheckbox
                                        values={dischargeResponsibility}
                                        list={optionDataFive}
                                        onChangeValue={this.onChangeCheckValue5}
                                    >
                                    </CustomCheckbox>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col label="货物保险&emsp;&emsp;" colon span={24} >
                                    <CustomCheckbox
                                        values={cargoInsurance}
                                        list={optionDataSix}
                                        onChangeValue={this.onChangeCheckValue6}
                                    >
                                    </CustomCheckbox>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col  label="回单要求&emsp;&emsp;" colon span={24} >
                                    <CustomCheckbox
                                        values={receiptRequired}
                                        list={optionDataSeven}
                                        onChangeValue={this.onChangeCheckValue7}
                                    >
                                    </CustomCheckbox>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col label="下单提前期&emsp;" colon span={24} >
                                    <div className="flex">
                                        <InputNumber 
                                            defaultValue={advanceTime ? advanceTime : ''}
                                            style={{width: 100}}
                                            placeholder="" 
                                            min={1} 
                                            max={100000}
                                            onChange={ value => {
                                                this.setState({
                                                    advanceTime: value
                                                })
                                            }}
                                        />
                                        <div style={{width: 100, marginLeft: 5}}>
                                            <RemoteSelect
                                                defaultValue={advanceTimeUnit ? {id: advanceTimeUnit, name:advanceTimeUnit} : ''}
                                                placeholder={'单位'}
                                                onChangeValue={
                                                    value => {
                                                        this.setState({
                                                            //advanceTimeUnit: value ? value.id : '',
                                                            advanceTimeUnit: value ? value.name : ''
                                                        })
                                                    }
                                                } 
                                                list={advanceTimeUnitList}
                                                labelField={'name'}
                                            />
                                        </div>
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
                                                requiredOther: e.target.value || ''
                                        })
                                    }}
                                    />
                                </Col>
                            </Row>
                            <div className="flex" style={{marginTop: 5}}>
                                <div style={{width: 84, color: 'rgb(136, 136, 136)'}}>路线及时效</div>
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
 
export default DeliveryDistribution;