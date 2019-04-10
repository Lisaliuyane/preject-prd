import React, { Component } from 'react';
import Modal from '@src/components/modular_window';
import { Form, Input, InputNumber, message, Radio, Switch, Icon } from 'antd'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { SelectAddress, CascaderAddress } from '@src/components/select_address'
import FormItem from '@src/components/FormItem'
import { Row, Col } from '@src/components/grid'
import { validateToNextPhoneOrNoNUll, cloneObject, stringToArray } from '@src/utils'
import TextAreaBox from '@src/components/textarea'
import MoreInput from '@src/components/more_input'
import moment from 'moment'
import './addoredit.less'
const RadioGroup = Radio.Group
const ModularParent = Modal.ModularParent
const heavyBubbleTypeData = [
    {
        id: 1,
        title: '无'
    },
    {
        id: 2,
        title: '重货'
    },
    {
        id: 3,
        title: '泡货'
    }
]

const UnitWeigh = [
    {
        id: 1,
        title: '每板'
    },
    {
        id: 2,
        title: '每箱'
    },
    {
        id: 3,
        title: '每个'
    }
]

const receiptModeUnit = [ //收货模式
    {
        id: 1,
        title: '板收'
    },
    {
        id: 2,
        title: '箱收'
    },
    {
        id: 3,
        title: 'PCS收'
    }
]

const shippingModeUnit = [ //出货模式
    {
        id: 1,
        title: '板出'
    },
    {
        id: 2,
        title: '箱出'
    },
    {
        id: 3,
        title: 'PCS出'
    }
]

@inject('rApi')  
class AddOrEdit extends ModularParent {

    state = {
        openType: null,
        title: null,
        open: false,
        edit: false,
        id: null, //用户id
        boxCount: 1, //箱数/板
        brands: null, //品牌
        clientId: 0, //客户id
        clientName: null, //客户名称
        createTime: null, //创建时间
        createUser: null, //创建人
        grossWeight: 0, //毛重/箱
        heavyBubbleId: 0, //重泡货类型id(1-无 2-重货 3-泡货)
        heavyBubbleName: null, //重泡货类型名
        isIncludeWarehouseManagement: false, //是否含仓储管理(1-包含 2-不包含)
        isScanningSerialNumber: 2, //是否扫描序列号（1-扫描 2-不扫描）
        itemName: null, //物品名称
        itemSpecifications: null, //物品规格
        manufacturer: null, //制造商
        manufacturerPartNumber: null, //制造商料号
        materialItemNumber: null, //物料料号
        maxStock: 0, //最大库存
        minStock: 0, //最小库存
        packageType: null, //包装类型
        productType: null, //商品类型
        quantity: 1, //数量/箱
        remark: null, //备注信息
        shippingBoxCount: 0, //出货箱数/板
        singleWeight: 0, //单个重量
        singleVolume: null, //单个体积
        status: 0, //状态（-1删除 1-正常）
        unitId: 0, //单位id
        unitName: null, //单位名称
        updateTime: null, //修改人
        updateUser: null, //修改时间
        forbidGrossWeight: false, //禁用单个毛重
        forbidSingleVolume: false, //禁用单个体积
        buttonLoading: false,
        historyData: null, // 传入数据
        heavyBubbleRatio: null, //重泡比
        perUnitWeightId: null, //单位重量单位id
        perUnitWeightName: null, //单位重量单位name
        perUnitVolumeId: null, //单位体积单位id
        perUnitVolumeName: null, //单位体积单位name
        receiptModeId: null, //收货模式id  
        receiptModeName: null, //收货模式name
        shippingModeId: null, //出货模式id    
        shippingModeName: null, //出货模式name
        shipmentIsScanningSerialNumber: null, //  (1-扫描 2-不扫描)
        isBatchNumber: null, //是否选择批次号 // 1-是 2-否
        other: [], //其他
        materialType: null //（1-运输， 2-仓储）
    }

    constructor(props) {
        super(props);
        if (props.getThis) {
            props.getThis(this)
        }
        // console.log('carcode',this.state.carcode)
    }

    // componentDidMount() {
    //     this.calculateHeavyBubbleRatio()
    // }
  
    
    changeOpen = (state) => {
        this.setState({
            open: state
        })
        if (!state) {
            this.clearValue()
        }
    }

    actionDone = () => {
        const { parent } = this.props
        if (parent.searchCriteria) {
            parent.searchCriteria()
        }
        this.changeOpen(false)
        message.success('操作成功！')
    }

    show(d) {
        let historyData = typeof d.data === 'object' ? cloneObject(d.data) : null
        if (d.edit) {
           this.setState({
                openType: 1,
                title: '编辑物料明细'
           }) 
        } else if (d.data) {
            this.setState({
                openType: 2,
                title:'查看物料明细',
            })
        } else {
            this.setState({
                openType: 3,
                title:'新建物料明细'
            })
            //coconsole.log('新建')
        }
        
        this.setState({
            ...d.data,
            historyData: historyData,
            open: true,
            edit: d.edit
        })
    }

    clearValue() {
        this.setState({
            openType: null,
            title: null,
            open: false,
            edit: false,
            id: null, //用户id
            boxCount: 1, //箱数/板
            brands: null, //品牌
            clientId: 0, //客户id
            clientName: null, //客户名称
            createTime: null, //创建时间
            createUser: null, //创建人
            grossWeight: 0, //毛重/箱
            heavyBubbleId: 0, //重泡货类型(1-无 2-重货 3-泡货)
            heavyBubbleName: null, //重泡货类型名
            isIncludeWarehouseManagement: false, //是否含仓储管理(1-包含 2-不包含)
            isScanningSerialNumber: 2, //是否扫描序列号（1-扫描 2-不扫描）
            itemName: null, //物品名称
            itemSpecifications: null, //物品规格
            manufacturer: null, //制造商
            manufacturerPartNumber: null, //制造商料号
            materialItemNumber: null, //物料料号
            maxStock: 0, //最大库存
            minStock: 0, //最小库存
            packageType: null, //包装类型
            productType: null, //商品类型
            quantity: 1, //数量/箱
            remark: null, //备注信息
            shippingBoxCount: 0, //出货箱数/板
            singleWeight: 0, //单个重量
            singleVolume: null, //单个体积
            status: 0, //状态（-1删除 1-正常）
            unitId: 0, //单位id
            unitName: null, //单位名称
            updateTime: null, //修改人
            updateUser: null, //修改时间
            forbidGrossWeight: false, //禁用单个毛重
            forbidSingleVolume: false, //禁用单个体积
            buttonLoading: false,
            heavyBubbleRatio: null,
            perUnitWeightId: null, //单位重量单位id
            perUnitWeightName: null, //单位重量单位name
            perUnitVolumeId: null, //单位体积单位id
            perUnitVolumeName: null, //单位体积单位name
            receiptModeId: null, //收货模式id  
            receiptModeName: null, //收货模式name
            shippingModeId: null, //出货模式id    
            shippingModeName: null, //出货模式name
            shipmentIsScanningSerialNumber: null, //  (1-扫描 2-不扫描)
            isBatchNumber: null, //是否选择批次号 // 1-是 2-否
            other: [], //其他
            materialType: null //（1-运输， 2-仓储）
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
        let { 
            id, //用户id
            boxCount, //箱数/板
            brands, //品牌
            clientId, //客户id
            clientName, //客户名称
            createTimel, //创建时间
            createUser, //创建人
            grossWeight, //毛重/箱
            heavyBubbleId, //重泡货类型(1-无 2-重货 3-泡货)
            heavyBubbleName, //重泡货类型名
            isIncludeWarehouseManagement, //是否含仓储管理(1-包含 2-不包含)
            isScanningSerialNumber, //是否扫描序列号（1-扫描 2-不扫描）
            itemName, //物品名称
            itemSpecifications, //物品规格
            manufacturer, //制造商
            manufacturerPartNumber, //制造商料号
            materialItemNumber, //物料料号
            maxStock, //最大库存
            minStock, //最小库存
            packageType, //包装类型
            productType, //商品类型
            quantity, //数量/箱
            remark, //备注信息
            shippingBoxCount, //出货箱数/板
            singleWeight, //单个重量
            singleVolume,
            status, //状态（-1删除 1-正常）
            unitId, //单位id
            unitName, //单位名称
            updateTime, //修改人
            updateUser, //修改时间
            heavyBubbleRatio,
            perUnitWeightId, //单位重量单位id
            perUnitWeightName, //单位重量单位name
            perUnitVolumeId, //单位体积单位id
            perUnitVolumeName, //单位体积单位name
            receiptModeId, //收货模式id  
            receiptModeName, //收货模式name
            shippingModeId, //出货模式id    
            shippingModeName, //出货模式name
            shipmentIsScanningSerialNumber, //  (1-扫描 2-不扫描)
            isBatchNumber, //是否选择批次号 // 1-是 2-否
            materialType //（1-运输， 2-仓储）
         } = this.state
        // if(isIncludeWarehouseManagement === 2) {
        //     // boxCount = null //箱数/板
        //     brands = null //品牌
        //     // grossWeight = null //毛重/箱
        //     manufacturer = null //制造商
        //     manufacturerPartNumber = null //制造商料号
        //     maxStock = null //最大库存
        //     minStock = null //最小库存
        //     packageType = null //包装类型
        //     productType = null //商品类型
        //     // quantity = null //数量/箱
        //     shippingBoxCount = null //出货箱数/板
        // }
        let otherValue = []
        if(this.views && this.views.getValue()) {
            otherValue = this.views.getValue().data
        }

        this.setState({
            buttonLoading: true
        })
        if(this.state.openType === 1) {
            this.props.rApi.editMaterial({
                id, //用户id
                boxCount, //箱数/板
                brands, //品牌
                clientId, //客户id
                clientName, //客户名称
                grossWeight, //毛重/箱
                heavyBubbleId, //重泡货类型(1-无 2-重货 3-泡货)
                heavyBubbleName, //重泡货类型名
                //isIncludeWarehouseManagement, //是否含仓储管理(1-包含 2-不包含)
                isScanningSerialNumber, //是否扫描序列号（1-扫描 2-不扫描）
                itemName, //物品名称
                itemSpecifications, //物品规格
                manufacturer, //制造商
                manufacturerPartNumber, //制造商料号
                materialItemNumber, //物料料号
                maxStock, //最大库存
                minStock, //最小库存
                packageType, //包装类型
                productType, //商品类型
                quantity, //数量/箱
                remark, //备注信息
                shippingBoxCount, //出货箱数/板
                singleWeight, //单个重量
                singleVolume,
                unitId, //单位id
                unitName, //单位名称
                heavyBubbleRatio,
                perUnitWeightId, //单位重量单位id
                perUnitWeightName, //单位重量单位name
                perUnitVolumeId, //单位体积单位id
                perUnitVolumeName, //单位体积单位name
                receiptModeId, //收货模式id  
                receiptModeName, //收货模式name
                shippingModeId, //出货模式id    
                shippingModeName, //出货模式name
                shipmentIsScanningSerialNumber, //  (1-扫描 2-不扫描)
                isBatchNumber,
                other: otherValue, //其他
                materialType: this.props.materialType //（1-运输， 2-仓储）
            }).then(d => {
                message.success('操作成功!')
                this.changeOpen(false)
                this.setState({
                    buttonLoading: false
                }, () => {
                    this.updateThisDataToTable({
                        id, //用户id
                        boxCount, //箱数/板
                        brands, //品牌
                        clientId, //客户id
                        clientName, //客户名称
                        grossWeight, //毛重/箱
                        heavyBubbleId, //重泡货类型(1-无 2-重货 3-泡货)
                        heavyBubbleName, //重泡货类型名
                        //isIncludeWarehouseManagement, //是否含仓储管理(1-包含 2-不包含)
                        isScanningSerialNumber, //是否扫描序列号（1-扫描 2-不扫描）
                        itemName, //物品名称
                        itemSpecifications, //物品规格
                        manufacturer, //制造商
                        manufacturerPartNumber, //制造商料号
                        materialItemNumber, //物料料号
                        maxStock, //最大库存
                        minStock, //最小库存
                        packageType, //包装类型
                        productType, //商品类型
                        quantity, //数量/箱
                        remark, //备注信息
                        shippingBoxCount, //出货箱数/板
                        singleWeight, //单个重量
                        singleVolume,
                        unitId, //单位id
                        unitName, //单位名称
                        heavyBubbleRatio,
                        perUnitWeightId, //单位重量单位id
                        perUnitWeightName, //单位重量单位name
                        perUnitVolumeId, //单位体积单位id
                        perUnitVolumeName, //单位体积单位name
                        receiptModeId, //收货模式id  
                        receiptModeName, //收货模式name
                        shippingModeId, //出货模式id    
                        shippingModeName, //出货模式name
                        shipmentIsScanningSerialNumber, //  (1-扫描 2-不扫描)
                        isBatchNumber,
                        other: otherValue, //其他
                        materialType: this.props.materialType//（1-运输， 2-仓储）
                    })
                })
            }).catch(e => {
                message.error(e.msg || '操作失败！')
                this.setState({
                    buttonLoading: false
                })
            })
        } else if(this.state.openType === 3) {
            //console.log('新建保存')
            this.props.rApi.addMaterial({
                boxCount, //箱数/板
                brands, //品牌
                clientId, //客户id
                clientName, //客户名称
                grossWeight, //毛重/箱
                heavyBubbleId, //重泡货类型(1-无 2-重货 3-泡货)
                heavyBubbleName, //重泡货类型名
                //isIncludeWarehouseManagement, //是否含仓储管理(1-包含 2-不包含)
                isScanningSerialNumber, //是否扫描序列号（1-扫描 2-不扫描）
                itemName, //物品名称
                itemSpecifications, //物品规格
                manufacturer, //制造商
                manufacturerPartNumber, //制造商料号
                materialItemNumber, //物料料号
                maxStock, //最大库存
                minStock, //最小库存
                packageType, //包装类型
                productType, //商品类型
                quantity, //数量/箱
                remark, //备注信息
                shippingBoxCount, //出货箱数/板
                singleWeight, //单个重量
                singleVolume,
                unitId, //单位id
                unitName, //单位名称
                heavyBubbleRatio,
                perUnitWeightId, //单位重量单位id
                perUnitWeightName, //单位重量单位name
                perUnitVolumeId, //单位体积单位id
                perUnitVolumeName, //单位体积单位name
                receiptModeId, //收货模式id  
                receiptModeName, //收货模式name
                shippingModeId, //出货模式id    
                shippingModeName, //出货模式name
                shipmentIsScanningSerialNumber, //  (1-扫描 2-不扫描)
                isBatchNumber,
                other: otherValue, //其他
                materialType: this.props.materialType //（1-运输， 2-仓储）
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

    radioChange = (e) => {
        //console.log('e', e)
        this.setState({
            isScanningSerialNumber: e.target.value,
        });
    }

    onChageProvince = (value) => {
        let { rApi } = this.props
        if (value && value.id) {
            rApi.getAreaByAddress(value).then(res => {
                //this.setState({areaName: res || []})
            })
        } else {
            //this.setState({areaName: []})
        }
    }

    calculateHeavyBubbleRatio = () => { //计算重泡比
        let { grossWeight, singleVolume} = this.state
        if(grossWeight && singleVolume) {
            let heavyBubbleRatio = grossWeight / singleVolume
            this.setState({
                heavyBubbleRatio: heavyBubbleRatio.toFixed(2)
            })
        }
    }

    render() {
        let { 
            openType,
            title,
            open,
            edit,
            id, //用户id
            boxCount, //箱数/板
            brands, //品牌
            clientId, //客户id
            clientName, //客户名称
            createTimel, //创建时间
            createUser, //创建人
            grossWeight, //毛重/箱
            heavyBubbleId, //重泡货类型(1-无 2-重货 3-泡货)
            heavyBubbleName, //重泡货类型名
            isIncludeWarehouseManagement, //是否含仓储管理(1-包含 2-不包含)
            isScanningSerialNumber, //是否扫描序列号（1-扫描 2-不扫描）
            itemName, //物品名称
            itemSpecifications, //物品规格
            manufacturer, //制造商
            manufacturerPartNumber, //制造商料号
            materialItemNumber, //物料料号
            maxStock, //最大库存
            minStock, //最小库存
            packageType, //包装类型
            productType, //商品类型
            quantity, //数量/箱
            remark, //备注信息
            shippingBoxCount, //出货箱数/板
            singleWeight, //单个重量
            singleVolume,
            status, //状态（-1删除 1-正常）
            unitId, //单位id
            unitName, //单位名称
            updateTime, //修改人
            updateUser, //修改时间
            forbidSingleVolume,
            forbidGrossWeight,
            buttonLoading,
            heavyBubbleRatio,
            perUnitWeightId, //单位重量单位id
            perUnitWeightName, //单位重量单位name
            perUnitVolumeId, //单位体积单位id
            perUnitVolumeName, //单位体积单位name
            receiptModeId, //收货模式id  
            receiptModeName, //收货模式name
            shippingModeId, //出货模式id    
            shippingModeName, //出货模式name
            shipmentIsScanningSerialNumber, //  (1-扫描 2-不扫描)
            isBatchNumber,
            other, //其他
            materialType //（1-运输， 2-仓储）
        } = this.state
        const { getFieldDecorator } = this.props.form
        if (!open) return null
        return (
            <Modal 
                changeOpen={this.changeOpen}
                onSubmit={this.onSubmit}
                open={this.state.open} 
                title={this.state.title} 
                style={{width: 620}}
                loading={buttonLoading}
                haveFooter={openType === 2 ? false : true}
                footerText="保存"
                getContentDom={v => this.popupContainer = v}
                >
               <Form layout='inline'>
                    <div className="material-wrapper">
                        <div className="base-text">基础数据</div>
                        <Row gutter={24} type={openType}>
                            <Col  label="物料料号&emsp;&emsp;" colon span={11} isRequired text={materialItemNumber}>
                                <FormItem>
                                    {
                                        getFieldDecorator('materialItemNumber', {
                                            initialValue: materialItemNumber,
                                            rules: [
                                                { 
                                                    required: true, 
                                                    message: '请填写物料料号'
                                                },
                                            ]
                                        })(
                                            <Input 
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({materialItemNumber: e.target.value})
                                                }
                                            }
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col isRequired label="品名&emsp;&emsp;&emsp;&emsp;" colon span={11} text={itemName}>
                                <FormItem>
                                    {
                                        getFieldDecorator('itemName', {
                                            initialValue: itemName,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请填写物料名称'
                                                }
                                            ]
                                        })(
                                            <Input
                                                defaultValue={itemName ? itemName : ''}
                                                placeholder=""
                                                onChange={e => {
                                                    this.setState({ itemName: e.target.value })
                                                }
                                                }
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24} type={openType}>
                            <Col  label="物料规格&emsp;&emsp;" colon span={11} text={itemSpecifications}>
                                <Input 
                                    defaultValue={itemSpecifications ? itemSpecifications : ''}
                                    placeholder="" 
                                    onChange={e => {
                                        this.setState({itemSpecifications: e.target.value})
                                    }
                                }
                                />
                            </Col>
                            {/* <Col label="所属客户&emsp;&emsp;" colon span={11} isRequired text={clientName}>
                                <FormItem>
                                    {
                                        getFieldDecorator('clientId', {
                                            rules: [
                                                { 
                                                    required: true, 
                                                    message: '请选择客户名称'
                                                }
                                            ]
                                        })(
                                            <RemoteSelect
                                                defaultValue={clientId ? {id: clientId, shortname: clientName} : null}
                                                getPopupContainer={() => this.popupContainer || document.body}
                                                onChangeValue={
                                                    value => {
                                                        this.setState({
                                                            clientId: value ? value.id : null,
                                                            clientName: value ? value.title || value.shortname : null
                                                        })
                                                    }
                                                } 
                                                getDataMethod={'getClients'}
                                                params={{limit: 999999, offset: 0, status: 56}}
                                                labelField={'shortname'}
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col> */}
                        </Row>
                        {/* <Row gutter={24} type={openType}>
                            <Col label="备注信息&emsp;&emsp;" colon span={18} text={remark}>
                                <Input 
                                    defaultValue={remark ? remark : ''}
                                    placeholder=""
                                    title={remark} 
                                    onChange={e => {
                                        this.setState({remark: e.target.value})
                                    }
                                 }
                                />
                            </Col> 
                        </Row> */}
                        <TextAreaBox 
                            labelText="备注&emsp;&emsp;&emsp;&emsp;"
                            colon
                            type={openType}
                            defaultValue={remark}
                            placeholderText=""
                            onChange={value => { this.setState({ remark: value }) }}
                        />
                        <div style={{cursor: 'pointer', width: 100}} onClick={() => {
                            this.setState({
                                isIncludeWarehouseManagement: !this.state.isIncludeWarehouseManagement
                            })
                        }}>
                            <span style={{color: '#18B583'}}>更多</span><Icon type="down" theme="outlined" style={{transition: 'all 0.5s', transform: this.state.isIncludeWarehouseManagement ? 'rotate(-180deg)' : ''}}/>
                        </div>
                        {/* <Switch 
                            defaultChecked={isIncludeWarehouseManagement === 1 ? true : false}
                            style={{verticalAlign: 'sub'}}
                            size="small"
                            onChange={checked => {
                                this.setState({
                                    isIncludeWarehouseManagement: checked === true ? 1 : 2
                                })
                            }} 
                        /> */}
                        {
                            isIncludeWarehouseManagement ? 
                            <div>
                                <div>
                                    <Row gutter={24} type={openType}>
                                        <Col label="品牌&emsp;&emsp;&emsp;&emsp;" colon span={11} text={brands}>
                                            <Input 
                                                defaultValue={brands ? brands : ''}
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({brands: e.target.value})
                                                }
                                            }
                                            />
                                        </Col>
                                        <Col  label="制造商&emsp;&emsp;&emsp;" colon span={11} text={manufacturer}>
                                            <Input 
                                                defaultValue={manufacturer ? manufacturer : ''}
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({manufacturer: e.target.value})
                                                }
                                            }
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={24} type={openType}>
                                        <Col label="商品类型&emsp;&emsp;" colon span={11} text={productType}>
                                            <Input 
                                                defaultValue={productType ? productType : ''}
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({productType: e.target.value})
                                                }
                                            }
                                            />
                                        </Col>
                                        <Col  label="包装类型&emsp;&emsp;" colon span={11} text={packageType}>
                                            <Input 
                                                defaultValue={packageType ? packageType : ''}
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({packageType: e.target.value})
                                                }
                                            }
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={24} type={openType}>
                                        <Col label="其他&emsp;&emsp;&emsp;&emsp;" colon span={24} 
                                            text={(other && other.length > 0) ? stringToArray(other).join(',') : null}
                                        >
                                            <MoreInput
                                                getThis={(v) => this.views = v}
                                                data={stringToArray(other)}
                                                width={193}
                                                maxLen={2}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                            :
                            null
                        }
                        <div className="base-text">物料属性</div>
                        <Row gutter={24} type={openType}>
                            {/* <Col isRequired label="计量单位&emsp;&emsp;" colon span={11} text={unitName}>
                                <FormItem style={{width: 90}}>
                                    {
                                        getFieldDecorator('unitId', {
                                            rules: [
                                                { 
                                                    required: true, 
                                                    message: '请选择单位'
                                                }
                                            ]
                                        })(
                                            <RemoteSelect
                                                    defaultValue={unitId ? { id: unitId, title: unitName } : null}
                                                    //getPopupContainer={() => this.popupContainer || document.body}
                                                    onChangeValue={
                                                        value => {
                                                            // console.log(value)
                                                            if (value) {
                                                                this.state.forbidSingleVolume = value.id === 147 ? true : false
                                                                this.state.singleVolume = value.id === 147 ? 1 : this.state.singleVolume
                                                                this.state.forbidGrossWeight = value.id === 146 ? true : false
                                                                this.state.grossWeight = value.id === 146 ? 1 : this.state.grossWeight
                                                            }
                                                            this.setState({
                                                                unitId: value ? value.id : null,
                                                                unitName: value ? value.name || value.title : null,
                                                                forbidSingleVolume: this.state.forbidSingleVolume,
                                                                forbidGrossWeight: this.state.forbidGrossWeight,
                                                                grossWeight: this.state.grossWeight,
                                                                singleVolume: this.state.singleVolume
                                                            })
                                                        }
                                                    }
                                                    getDataMethod={'getUnitMappingFilters'}
                                                    params={{billingUnitType: 1, unitClassification: this.props.materialType, unitKind: 1,}}
                                                    labelField='title'
                                                    //text="计量单位"
                                                />
                                        )
                                    }
                                </FormItem>
                            </Col> 
                            <Col span={11} /> */}
                        </Row>
                        <Row gutter={24} type={openType}> 
                            <Col isRequired label="数量 / 箱&emsp;&emsp;" colon span={11} text={quantity}>
                                <InputNumber 
                                    style={{marginLeft: '2px'}}
                                    min={0} 
                                    defaultValue={quantity ? quantity : ''}
                                    placeholder="" 
                                    onChange={value => {
                                        this.setState({quantity: value})
                                    }
                                }
                                />
                            </Col>
                            <Col isRequired label="箱数 / 板&emsp;&emsp;" colon span={11} text={boxCount}>
                                <InputNumber  
                                    min={0}
                                    style={{marginLeft: '2px'}}
                                    defaultValue={boxCount ? boxCount : null}
                                    placeholder="" 
                                    onChange={value => {
                                        this.setState({boxCount: value})
                                    }
                                }
                                />
                            </Col>
                        </Row>
                        <Row gutter={24} type={openType}>
                            <Col label="单位重量&emsp;&emsp;" colon span={11} 
                                text={(grossWeight && perUnitWeightName) ? `${grossWeight}${perUnitWeightName}` : grossWeight}
                            >
                                <div className="flex flex-vertical-center">
                                    <InputNumber
                                        disabled={forbidGrossWeight}
                                        min={0}  
                                        defaultValue={grossWeight ? grossWeight : null}
                                        value={grossWeight}
                                        placeholder="" 
                                        onChange={value => {
                                            this.setState({
                                                grossWeight: value
                                            }, () => {
                                                this.calculateHeavyBubbleRatio()
                                            })
                                        }
                                    }
                                    />
                                    &ensp;
                                    {/* <span><span style={{fontSize: '18px'}}>{unitName ? '/' : ''}</span>{unitName}</span> */}
                                    {
                                        (grossWeight || grossWeight === 0) ?
                                        <div style={{width: 80}}>
                                            <RemoteSelect
                                                defaultValue={perUnitWeightId  ? {id: perUnitWeightId , title: perUnitWeightName} : null}
                                                getPopupContainer={() => this.popupContainer || document.body}
                                                onChangeValue={
                                                    value => {
                                                        this.setState({
                                                            perUnitWeightId: value ? value.id : null,
                                                            perUnitWeightName: value ? value.title : null

                                                        })
                                                    }
                                                } 
                                                labelField={'title'}
                                                list={UnitWeigh}
                                            /> 
                                        </div>
                                        :
                                        null
                                    }
                                </div>
                            </Col>
                            
                            <Col label="单位体积&emsp;&emsp;" colon span={11} 
                                text={singleVolume}
                                text={(singleVolume && perUnitVolumeName) ? `${singleVolume}${perUnitVolumeName}` : singleVolume}
                            >
                               <div className="flex flex-vertical-center">
                                <InputNumber 
                                        disabled={forbidSingleVolume}
                                        min={0}
                                        defaultValue={singleVolume ? singleVolume : null}
                                        placeholder="" 
                                        value={singleVolume}
                                        onChange={value => {
                                            this.setState({
                                                singleVolume: value
                                            }, () => {
                                                this.calculateHeavyBubbleRatio()
                                            })
                                        }
                                    }
                                    />
                                    &ensp;
                                    {/* <span><span style={{fontSize: '18px'}}>{unitName ? '/' : ''}</span>{unitName}</span> */}
                                    {
                                        (singleVolume || singleVolume === 0) ?
                                        <div style={{width: 80}}>
                                            <RemoteSelect
                                                defaultValue={perUnitVolumeId  ? {id: perUnitVolumeId , title: perUnitVolumeName} : null}
                                                getPopupContainer={() => this.popupContainer || document.body}
                                                onChangeValue={
                                                    value => {
                                                        this.setState({
                                                            perUnitVolumeId: value ? value.id : null,
                                                            perUnitVolumeName: value ? value.title : null

                                                        })
                                                    }
                                                } 
                                                labelField={'title'}
                                                list={UnitWeigh}
                                            /> 
                                        </div>
                                        :
                                        null
                                    }
                               </div>
                            </Col>
                            {/* <Col label="单位净重&emsp;&emsp;" colon span={11} text={singleWeight}>
                                <InputNumber 
                                    min={0}
                                    defaultValue={singleWeight ? singleWeight : ''}
                                    placeholder="" 
                                    onChange={value => {
                                        this.setState({singleWeight: value})
                                    }
                                }
                                />
                                &ensp;
                                <span><span style={{fontSize: '18px'}}>{unitName ? '/' : ''}</span>{unitName}</span>
                            </Col> */}
                        </Row>
                        <Row gutter={24} type={openType}>
                            <Col label="重泡货&emsp;&emsp;&emsp;" colon span={11} text={heavyBubbleName}>
                                <div style={{width: 90}}>
                                    <RemoteSelect
                                        defaultValue={heavyBubbleId ? {id: heavyBubbleId, title: heavyBubbleName} : null}
                                        getPopupContainer={() => this.popupContainer || document.body}
                                        onChangeValue={
                                            value => {
                                                this.setState({
                                                    heavyBubbleId: value ? value.id : null,
                                                    heavyBubbleName: value ? value.title : null

                                                })
                                            }
                                        } 
                                        labelField={'title'}
                                        list={heavyBubbleTypeData}
                                    />
                                </div>
                            </Col>
                            <Col label="重泡比&emsp;&emsp;&emsp;" colon span={11} text={singleVolume}>
                                <InputNumber 
                                    //disabled={forbidSingleVolume}
                                    min={0}
                                    defaultValue={heavyBubbleRatio ? heavyBubbleRatio : ''}
                                    placeholder="" 
                                    value={heavyBubbleRatio}
                                    onChange={value => {
                                        this.setState({heavyBubbleRatio: value})
                                    }
                                }
                                />
                            </Col>
                        </Row>
                        <div className="base-text">收/出货设置</div>
                        <Row gutter={24} type={openType}>
                            <Col label="收货模式&emsp;&emsp;" colon span={11} text={receiptModeName}>
                                <div style={{width: 90}}>
                                    <RemoteSelect
                                        defaultValue={receiptModeId   ? {id: receiptModeId , title: receiptModeName} : null}
                                        getPopupContainer={() => this.popupContainer || document.body}
                                        onChangeValue={
                                            value => {
                                                this.setState({
                                                    receiptModeId : value ? value.id : null,
                                                    receiptModeName: value ? value.title : null

                                                })
                                            }
                                        } 
                                        labelField={'title'}
                                        list={receiptModeUnit}
                                    /> 
                                </div>
                            </Col>
                            <Col label="出货模式&emsp;&emsp;" colon span={11} text={shippingModeName}>
                                <div style={{width: 90}}>
                                    <RemoteSelect
                                        defaultValue={shippingModeId ? {id: shippingModeId , title: shippingModeName} : null}
                                        getPopupContainer={() => this.popupContainer || document.body}
                                        onChangeValue={
                                            value => {
                                                this.setState({
                                                    shippingModeId: value ? value.id : null,
                                                    shippingModeName: value ? value.title : null

                                                })
                                            }
                                        } 
                                        labelField={'title'}
                                        list={shippingModeUnit}
                                    /> 
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={24} type={openType}>
                            <Col label="最大库存&emsp;&emsp;" colon span={11} text={maxStock}>
                                <InputNumber 
                                    min={0}  
                                    defaultValue={maxStock ? maxStock : ''}
                                    placeholder="" 
                                    onChange={value => {
                                        this.setState({maxStock: value})
                                    }
                                }
                                />
                            </Col>
                            <Col label="最小库存&emsp;&emsp;" colon span={11} text={minStock}>
                                <InputNumber
                                    min={0}  
                                    defaultValue={minStock ? minStock : ''}
                                    placeholder="" 
                                    onChange={value => {
                                        this.setState({minStock: value})
                                    }
                                }
                                />
                            </Col>
                        </Row>
                        <Row gutter={24} type={openType}>
                            <Col label="收货是否扫描序列号&emsp;" colon span={11} text={isScanningSerialNumber === 1 ? '扫描' : '不扫描'}>
                                <RadioGroup 
                                    onChange={this.radioChange} 
                                    value={isScanningSerialNumber ? isScanningSerialNumber : 2}
                                    >
                                    <Radio value={1}>是</Radio>
                                    <Radio value={2}>否</Radio>
                                </RadioGroup>
                            </Col> 
                            <Col label="出货是否扫描序列号&emsp;" colon span={11} text={shipmentIsScanningSerialNumber === 1 ? '扫描' : '不扫描'}>
                                <RadioGroup 
                                    onChange={(e) => {
                                        this.setState({
                                            shipmentIsScanningSerialNumber: e.target.value
                                        })
                                    }} 
                                    value={shipmentIsScanningSerialNumber ? shipmentIsScanningSerialNumber : 2}
                                    >
                                    <Radio value={1}>是</Radio>
                                    <Radio value={2}>否</Radio>
                                </RadioGroup>
                            </Col> 
                        </Row>
                        <Row gutter={24} type={openType}>
                            <Col label="是否选择批次号&emsp;&emsp;&emsp;" colon span={11} text={isBatchNumber === 1 ? '是' : '否'}>
                                <RadioGroup 
                                    onChange={(e) => {
                                        this.setState({
                                            isBatchNumber: e.target.value
                                        })
                                    }} 
                                    value={isBatchNumber ? isBatchNumber : 2}
                                    >
                                    <Radio value={1}>是</Radio>
                                    <Radio value={2}>否</Radio>
                                </RadioGroup>
                            </Col> 
                        </Row>
                        {/* <Row gutter={24} type={openType}> */}
                            {/* <Col  label="制造商料号&emsp;" colon span={11} text={manufacturerPartNumber}>
                                <Input 
                                    defaultValue={manufacturerPartNumber ? manufacturerPartNumber : ''}
                                    placeholder="" 
                                    onChange={e => {
                                        this.setState({manufacturerPartNumber: e.target.value})
                                    }
                                }
                                />
                            </Col>
                            <Col  label="出货箱数/板" colon span={11} text={shippingBoxCount}>
                                <InputNumber 
                                    min={0} 
                                    style={{marginLeft: '10px'}}
                                    defaultValue={shippingBoxCount ? shippingBoxCount : ''}
                                    placeholder="" 
                                    onChange={value => {
                                        this.setState({shippingBoxCount: value})
                                    }
                                }
                                />
                            </Col>
                        </Row> */}
                    </div>
               </Form>
            </Modal>
        )
    }
}

export default Form.create()(AddOrEdit)