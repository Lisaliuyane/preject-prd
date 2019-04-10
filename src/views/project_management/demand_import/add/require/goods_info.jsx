import React, { Component} from 'react'
import { Button, Input, InputNumber, Radio, message, Icon, Switch, Spin} from 'antd'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import MultipleFileUpload from '@src/components/uploader_file_multiple'
import { Row, Col } from '@src/components/grid'
import { CustomCheckbox } from '@src/components/custom_check'
import { imgClient } from '@src/utils'
import SwitchBtn from './switch'
import './index.less'

const RadioGroup = Radio.Group

const physicalType = [ //物理形态
    {
        id: 1,
        label: '固体', 
        value: 1
    },
    {
        id: 2,
        label: '液体', 
        value: 2
    },
    {
        id: 3,
        label: '气体', 
        value: 3
    },
    {
        id: 4,
        label: '其它', 
        value: 4
    },
]

const chemicalType = [  //化学属性
    {
        id: 1,
        label: '有毒', 
        value: 1
    },
    {
        id: 2,
        label: '易燃', 
        value: 2
    },
    {
        id: 3,
        label: '易爆', 
        value: 3
    },
    {
        id: 4,
        label: '其它', 
        value: 4
    },
]

const packingType = [  //包装方式
    {
        id: 1,
        label: '纸箱', 
        value: 1
    },
    {
        id: 2,
        label: '木架/木箱', 
        value: 2
    },
    {
        id: 3,
        label: '整柜', 
        value: 3
    }
]


/**
 * 货物基本信息
 * 
 * @class GoodsInfo
 * @extends {Component}
 */
@inject('mobxTabsData')
@inject('rApi')
@observer
class GoodsInfo extends Component {

    state = {
        isCheck: true, //是否打开按钮
        loading: false,
        demandCargo: {}, //货物基本信息
        cargoHeavyBubbleRatio: 0, //货物重泡比 kg/m³
        cargoName: null, //货物名称
        chemicalProperties: [], //化学属性
        chemicalPropertiesOther: null, //化学属性其他值
        demandId: 0, //客户需求Id
        id: 0,
        isBattery: 0, //有无电池
        packageMethod: [], //包装方式
        physicalForm: [], //物理形态
        physicalFormOther: null, //物理形态其他值
        uploadFileVo : [],
        checkFileUrl: [] //查看附件
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
       // console.log('demand_info/vulToChilder', props.vulToChilder, props.vulToChilder.demandCargo)
        if(props.vulToChilder.demandCargo) {
                let { 
                    id,
                    cargoHeavyBubbleRatio, //货物重泡比 kg/m³
                    cargoName, //货物名称
                    chemicalProperties, //化学属性
                    chemicalPropertiesOther, //化学属性其他值
                    isBattery, //有无电池
                    packageMethod, //包装方式
                    physicalForm, //物理形态
                    physicalFormOther, //物理形态其他值
                    uploadFileVo
                } = props.vulToChilder.demandCargo

                this.state.id = id 
                this.state.cargoHeavyBubbleRatio = cargoHeavyBubbleRatio 
                this.state.cargoName = cargoName 
                this.state.chemicalProperties = chemicalProperties ? JSON.parse(chemicalProperties) : [] 
                this.state.chemicalPropertiesOther = chemicalPropertiesOther
                this.state.isBattery = isBattery
                this.state.packageMethod = packageMethod ? JSON.parse(packageMethod) : [] 
                this.state.physicalForm = physicalForm ? JSON.parse(physicalForm) : [] 
                this.state.physicalFormOther = physicalFormOther
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

    onChangeCheckValue = (checKVul) => {
        this.setState({  //物理
            physicalForm: checKVul
        })
        return true
    }

    onChangeCheckValue2 = (checKVul) => {
        this.setState({ //化学
            chemicalProperties: checKVul
        })
        return true
    }

    onChangeCheckValue3 = (checKVul) => {
        this.setState({ //包装
            packageMethod: checKVul
        })
        return true
    }
    getValue = () => {
        let {
            isCheck,
            cargoHeavyBubbleRatio, //货物重泡比 kg/m³
            cargoName, //货物名称
            chemicalProperties, //化学属性
            chemicalPropertiesOther, //化学属性其他值
            demandId, //客户需求Id
            id,
            isBattery, //有无电池
            packageMethod, //包装方式
            physicalForm, //物理形态
            physicalFormOther, //物理形态其他值
            uploadFileVo
        } = this.state

        return{
            demandCargo: {
                id,
                cargoHeavyBubbleRatio, //货物重泡比 kg/m³
                cargoName, //货物名称
                chemicalProperties, //化学属性
                chemicalPropertiesOther, //化学属性其他值
                isBattery, //有无电池
                packageMethod, //包装方式
                physicalForm, //物理形态
                physicalFormOther, //物理形态其他值
                uploadFileVo,
                removeAttachmentIds: []
            }
        }
    }

    // getGoodsFileName = (value) => {
    //     this.setState({
    //         //uploadFileVo: uploadFileVo && uploadFileVo.length > 0 ? [uploadFileVo[uploadFileVo.length-1]] : uploadFileVo
    //         uploadFileVo: [value]
    //     })
    // }

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
            cargoHeavyBubbleRatio, //货物重泡比 kg/m³
            cargoName, //货物名称
            chemicalProperties, //化学属性
            chemicalPropertiesOther, //化学属性其他值
            demandId, //客户需求Id
            id,
            isBattery, //有无电池
            packageMethod, //包装方式
            physicalForm, //物理形态
            physicalFormOther, //物理形态其他值
            checkFileUrl,
            uploadFileVo
        } = this.state
       // console.log('checkFileUrl', checkFileUrl)
        return (
            <div className='goods-main'>
                <div className='flex goods-info' >
                    <SwitchBtn 
                        title="货物基本信息"
                        style={{marginLeft: '46px'}}
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
                                <Col label="货物品名&emsp;&emsp;" colon span={24}>
                                    <Input 
                                        defaultValue={cargoName ? cargoName : ''}
                                        style={{maxWidth: 200}}
                                        placeholder="" 
                                        onChange={e => {
                                            this.setState({
                                                cargoName: e.target.value
                                             })
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col  label="货物重泡比&emsp;" colon span={24} >
                                    <InputNumber 
                                        defaultValue={cargoHeavyBubbleRatio ? cargoHeavyBubbleRatio : ''}
                                        style={{width: 160}}
                                        placeholder="" 
                                        min={1} 
                                        max={100000}
                                        onChange={ value => {
                                            this.setState({
                                                cargoHeavyBubbleRatio: value
                                            })
                                        }}
                                    /><span>&nbsp;kg/m³</span>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col label="物理形态&emsp;&emsp;" colon span={24} >
                                    <CustomCheckbox
                                        bindValue={4}
                                        values={physicalForm}
                                        list={physicalType}
                                        onChangeValue={this.onChangeCheckValue}
                                    >
                                        <div className="negative-margin">
                                            <Input 
                                                style={{maxWidth: 140}}
                                                defaultValue={physicalFormOther ? physicalFormOther : ''}
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({
                                                        physicalFormOther: e.target.value
                                                })
                                            }}
                                            />
                                        </div>
                                    </CustomCheckbox>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col label="化学属性&emsp;&emsp;" colon span={24} >
                                    <CustomCheckbox
                                        bindValue={4}
                                        values={chemicalProperties}
                                        list={chemicalType}
                                        onChangeValue={this.onChangeCheckValue2}
                                    >
                                        <div className="negative-margin">
                                            <Input 
                                                style={{maxWidth: 140}}
                                                defaultValue={chemicalPropertiesOther ? chemicalPropertiesOther : ''}
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({
                                                        chemicalPropertiesOther: e.target.value
                                                })
                                            }}
                                            />
                                        </div>
                                    </CustomCheckbox>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col  label="包装方式&emsp;&emsp;" colon span={24} >
                                    <CustomCheckbox
                                        values={packageMethod}
                                        list={packingType}
                                        onChangeValue={this.onChangeCheckValue3}
                                    >
                                    </CustomCheckbox>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col  label="有无电池&emsp;&emsp;" colon span={24} >
                                    <RadioGroup 
                                        onChange={e => {
                                            this.setState({
                                                isBattery: e.target.value
                                            })
                                        }} 
                                        value={isBattery ? isBattery : 1}
                                        defaultValue={isBattery ? isBattery : 1}
                                        >
                                            <Radio value={1}>有</Radio>
                                            <Radio value={2}>无</Radio>
                                    </RadioGroup>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={24}>
                                    <div style={{marginTop: 10}}>
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
 
export default GoodsInfo;