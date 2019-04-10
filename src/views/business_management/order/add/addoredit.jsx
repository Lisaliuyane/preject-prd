import React, { Component } from 'react';
import Modal from '@src/components/modular_window';
import { Form, Input, message, Cascader, Radio, DatePicker, Button } from 'antd';
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { SelectAddress, SelectAddressNew } from '@src/components/select_address'
import MapView from '@src/components/map'
import FormItem from '@src/components/FormItem'
import { Row, Col } from '@src/components/grid'
import { addressToString, validateToNextPhone,validateToCellPhoneAndNoNull, cloneObject, addressFormat } from '@src/utils'
import moment from 'moment'
const { TextArea } = Input
const RadioGroup = Radio.Group
const ModularParent = Modal.ModularParent

@inject('rApi')  
class AddOrEdit extends ModularParent {

    state = {
        openType: null,
        title: null,
        open: false,
        edit: false,
        address: null, //地址
        addressdata:{}, // 地址信息
        addressType: 1, //地址类型（1-发货方 2-收货方）
        areaId: 0, //片区id
        areaName: null, //片区名
        cargoPartyCode: null, //货方代码
        cargoPartyName: null, //货方名称
        cellphoneNumber: null, //手机号码
        clientId: 0, //客户id
        clientName: null, //客户名称
        contactName: null, //联系人名字
        contactNumber: null, //联系电话
        createTime: null, //创建时间
        createUser: null, //创建人
        defaultShipperId: 0, //默认发货方id
        defaultShipperName: null, //默认发货方名字
        detailAddress: null, //详细地址
        id: 0,
        status: 0, //状态（-1-删除 1-正常）
        updateTime: null, //修改时间
        updateUser: null, //修改人
        buttonLoading: false,
        historyData: null, // 传入数据
        continueReload: false,
        longitude: null, //经度
        latitude: null, //纬度
        reloadAdress: false
    }

    constructor(props) {
        super(props);
        if (props.getThis) {
            props.getThis(this)
        }
        // console.log('carcode',this.state.carcode)
    }

    // componentDidMount() {
        
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

    continueDone = () => {
        const { parent } = this.props
        if (parent.searchCriteria) {
            parent.searchCriteria()
        }
        this.continueClearValue()
        message.success('操作成功！')
    }

    show(d) {
        let historyData = typeof d.data === 'object' ? cloneObject(d.data) : null
        if (d.edit) {
            d.data = Object.assign({}, d.data, {
                openType: 1,
                title: d.data.title,
                addressdata:  (d.data && d.data.address && typeof(d.data.address) === 'string') ? JSON.parse(d.data.address) : (d.data && d.data.address) ? d.data.address : {},
            })
        } else if (d.data && d.newData) {
            d.data = Object.assign({}, d.data, {
                openType: 3,
                title: d.data.title,
                addressdata:  (d.data && d.data.address && typeof(d.data.address) === 'string') ? JSON.parse(d.data.address) : (d.data && d.data.address) ? d.data.address : {},
            })
        } else if (d.data) {
            d.data = Object.assign({}, d.data, {
                openType: 2,
                title:'查看收发货方',
                addressdata:  (d.data && d.data.address && typeof(d.data.address) === 'string') ? JSON.parse(d.data.address) : (d.data && d.data.address) ? d.data.address : {},
            })
        } else {
            this.setState({
                openType: 3,
                title:'新建收发货方'})
            //coconsole.log('新建')
        }
        
        this.setState({
            ...d.data,
            historyData: historyData,
            open: true,
            edit: d.edit
        })
    }

    continueClearValue() {
        const { setFieldsValue } = this.props.form
        this.setState({
            address: null, //地址
            addressdata:{}, // 地址信息
            areaId: 0, //片区id
            areaName: null, //片区名
            cargoPartyCode: null, //货方代码
            contactName: null, //联系人名字
            createTime: null, //创建时间
            createUser: null, //创建人
            defaultShipperId: 0, //默认发货方id
            defaultShipperName: null, //默认发货方名字
            detailAddress: null, //详细地址
            id: 0,
            status: 0, //状态（-1-删除 1-正常）
            updateTime: null, //修改时间
            updateUser: null, //修改人
            buttonLoading: false,
            continueReload: true,
            longitude: null, //经度
            latitude: null, //纬度
            reloadAdress: false
        }, () => {
            this.setState({
                continueReload: false
            })
        })
        setFieldsValue({
            cargoPartyName: null, //货方名称
            cellphoneNumber: null, //手机号码
            contactNumber: null //联系电话
        })
    }

    clearValue() {
        this.setState({
            openType: null,
            title: null,
            open: false,
            edit: false,
            address: null, //地址
            addressdata:{}, // 地址信息
            addressType: 1, //地址类型（1-发货方 2-收货方）
            areaId: 0, //片区id
            areaName: null, //片区名
            cargoPartyCode: null, //货方代码
            cargoPartyName: null, //货方名称
            cellphoneNumber: null, //手机号码
            clientId: 0, //客户id
            clientName: null, //客户名称
            contactName: null, //联系人名字
            contactNumber: null, //联系电话
            createTime: null, //创建时间
            createUser: null, //创建人
            defaultShipperId: 0, //默认发货方id
            defaultShipperName: null, //默认发货方名字
            detailAddress: null, //详细地址
            id: 0,
            status: 0, //状态（-1-删除 1-正常）
            updateTime: null, //修改时间
            updateUser: null, //修改人
            buttonLoading: false,
            longitude: null, //经度
            latitude: null, //纬度
            reloadAdress: false
        })

    }

    continueAdd = () => { //继续添加
        this.onSubmit(1)
    }

    onSubmit = (flag) => {
        const { form } = this.props
        form.validateFields((errors, values) => {
            if(errors === null) {
                this.handleSubmit(flag)
            }
        })
    }

    handleSubmit = (flag) => {
        // console.log('flag', flag)
        // return false
        let { 
            address, //地址
            addressType, //地址类型（1-发货方 2-收货方）
            areaId, //片区id
            areaName, //片区名
            cargoPartyCode, //货方代码
            cargoPartyName, //货方名称
            cellphoneNumber, //手机号码
            clientId, //客户id
            clientName, //客户名称
            contactName, //联系人名字
            contactNumber, //联系电话
            defaultShipperId, //默认发货方id
            defaultShipperName, //默认发货方名字
            detailAddress, //详细地址
            id,
            longitude,
            latitude
         } = this.state
        if (addressType === 2) {
            defaultShipperId = 0
            defaultShipperName = ''
        }
        let addr = this.selectAddress.getValue()
        if(!addr || !addr.pro || addr.pro === null) {
            message.error('请选择省市区!')
            return
        }
        if(!longitude || !latitude) {
            message.error('经纬度不能为空!')
            return false
        }
        this.setState({
            buttonLoading: true
        })
        if(this.state.openType === 1) {
            this.props.rApi.editConsignee({
                address: addr, //地址
                addressType, //地址类型（1-发货方 2-收货方）
                areaId, //片区id
                areaName, //片区名
                cargoPartyCode, //货方代码
                cargoPartyName, //货方名称
                cellphoneNumber, //手机号码
                clientId, //客户id
                clientName, //客户名称
                contactName, //联系人名字
                contactNumber, //联系电话
                defaultShipperId, //默认发货方id
                defaultShipperName, //默认发货方名字
                detailAddress, //详细地址
                id,
                longitude,
                latitude
            }).then(d => {
                if(this.props.getConsigneeData) {
                    this.props.getConsigneeData(d)
                }
                message.success('操作成功!')
                this.changeOpen(false)
                this.setState({
                    buttonLoading: false
                }, () => {
                    this.updateThisDataToTable({
                        address: addr, //地址
                        addressType, //地址类型（1-发货方 2-收货方）
                        areaId, //片区id
                        areaName, //片区名
                        cargoPartyCode, //货方代码
                        cargoPartyName, //货方名称
                        cellphoneNumber, //手机号码
                        clientId, //客户id
                        clientName, //客户名称
                        contactName, //联系人名字
                        contactNumber, //联系电话
                        defaultShipperId, //默认发货方id
                        defaultShipperName, //默认发货方名字
                        detailAddress, //详细地址
                        id,
                        longitude,
                        latitude
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
            this.props.rApi.addConsignee({
                address: addr, //地址
                addressType, //地址类型（1-发货方 2-收货方）
                areaId, //片区id
                areaName, //片区名
                cargoPartyCode, //货方代码
                cargoPartyName, //货方名称
                cellphoneNumber, //手机号码
                clientId, //客户id
                clientName, //客户名称
                contactName, //联系人名字
                contactNumber, //联系电话
                defaultShipperId, //默认发货方id
                defaultShipperName, //默认发货方名字
                detailAddress, //详细地址
                longitude,
                latitude
            }).then(d => {
                if(this.props.getConsigneeData) {
                    this.props.getConsigneeData(d)
                }
                if(flag) {
                    this.continueDone()
                } else{
                    this.actionDone()
                }
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
            addressType: e.target.value,
        });
    }

    getSelectAddress = (d) => {
        this.selectAddress = d
    }

    onChageProvince = (value) => {
        // console.log('xxxx', value)
         let { rApi } = this.props
         if (value && value.id) {
             rApi.getAreaByAddress(value).then(res => {
                 // console.log('area',res)
                 this.setState({
                     areaName: res.map(item => item.title).join(',')
                 })
             })
         } else {
             this.setState({areaName: ''})
         }
    }
     
    getMapValue = (value) => { //获取地图的值
        this.setState({
            addressdata: value.address,
            longitude: value && value.point && value.point.lng,
            latitude: value && value.point && value.point.lat,
            areaName: value.areaName,
            reloadAdress: true
        }, () => {
           this.setState({
                reloadAdress: false
           })
        })
    }

    getValueForChilder = (value) => { //获取地址onchang值
        this.setState({
            addressdata: value
        })
    }

    render() {
        let { 
            openType,
            title,
            open,
            edit,
            address, //地址
            addressdata, // 地址信息
            addressType, //地址类型（1-发货方 2-收货方）
            areaId, //片区id
            areaName, //片区名
            cargoPartyCode, //货方代码
            cargoPartyName, //货方名称
            cellphoneNumber, //手机号码
            clientId, //客户id
            clientName, //客户名称
            contactName, //联系人名字
            contactNumber, //联系电话
            defaultShipperId, //默认发货方id
            defaultShipperName, //默认发货方名字
            buttonLoading,
            continueReload,
            longitude,
            latitude,
            reloadAdress
         } = this.state
        const { getFieldDecorator } = this.props.form
        if (!open) return null
        //console.log('title', title)
        return (
            <Modal 
                changeOpen={this.changeOpen}
                onSubmit={this.onSubmit}
                open={this.state.open} 
                title={this.state.title} 
                style={{width: '100%', maxWidth: 850}}
                loading={buttonLoading}
                haveFooter={openType === 2 ? false : true}
                // customButton={openType === 3 ? <Button onClick={this.continueAdd}>继续添加</Button> : ''}
                footerText="保存"
                getContentDom={v => this.popupContainer = v}
                >
                <Form layout='inline'>
                    <div style={{padding: '10px 20px'}}>
                        <Row gutter={24} type={openType}>
                            <Col label="地址类型&emsp;&emsp;" colon span={10} text={addressType === 1 ? '发货方' : '收货方'}>
                                <RadioGroup 
                                    onChange={this.radioChange} 
                                    //defaultValue={sex ? sex : 0}
                                    value={addressType}
                                    >
                                    {
                                        (addressType === 2) ?
                                        <Radio value={2}>收货方(分部)</Radio>
                                        :
                                        <Radio value={1}>发货方(区仓)</Radio>
                                    }
                                </RadioGroup>
                            </Col> 
                        </Row>
                        <Row gutter={24} type={openType}>
                            <Col  label="货方名称&emsp;&emsp;" colon span={10} isRequired text={cargoPartyName}>
                                <FormItem>
                                    {
                                        getFieldDecorator('cargoPartyName', {
                                            initialValue: cargoPartyName,
                                            rules: [
                                                { 
                                                    required: true, 
                                                    message: '请填写货方名称'
                                                },
                                            ]
                                        })(
                                            <Input 
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({cargoPartyName: e.target.value})
                                                }
                                            }
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24} type={openType}>
                            <Col label="货方代码&emsp;&emsp;" colon span={10} text={cargoPartyCode}>
                                <Input
                                    value={cargoPartyCode ? cargoPartyCode : ''} 
                                    placeholder="代码(选填)" 
                                    onChange={e => {
                                        this.setState({cargoPartyCode: e.target.value})
                                    }
                                }
                                />
                            </Col>
                        </Row>
                        <Row gutter={24} type={openType}>
                            <Col label="所属客户&emsp;&emsp;" colon span={10} isRequired text={clientName}>
                                <FormItem>
                                    {
                                        getFieldDecorator('clientName', {
                                            rules: [
                                                { 
                                                    required: true, 
                                                    message: '请选择客户名称'
                                                }
                                            ]
                                        })(
                                            <RemoteSelect
                                                defaultValue={clientId ? {id: clientId, shortname: clientName} : ''}
                                               // getPopupContainer={() => this.popupContainer || document.body}
                                                onChangeValue={
                                                    value => {
                                                        this.setState({
                                                            clientId: value ? value.id : '',
                                                            clientName: value ? value.title || value.shortname : ''
            
                                                        })
                                                    }
                                                } 
                                                getDataMethod={'getClients'}
                                                disabled={true}
                                                params={{limit: 999999, offset: 0, status: 56}}
                                                labelField={'shortname'}
                                            />
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={24} type={openType}> 
                            <Col span={17} isRequired label="所属地址&emsp;&emsp;" colon
                                text={addressdata ? addressFormat(addressdata) : ''}
                            >
                                {
                                    continueReload || reloadAdress ?
                                    null
                                    :
                                    <SelectAddressNew 
                                        //getPopupContainer={() => this.popupContainer || document.body}
                                        getValueForChilder={this.getValueForChilder}
                                        onChageProvince={this.onChageProvince}
                                        address={addressdata ? addressdata : {}}
                                        getThis={this.getSelectAddress} 
                                        title={addressdata ? addressFormat(addressdata) : '无'}
                                        //defaultValue={addressdata}
                                    />
                                }
                            </Col>
                            <Col span={2}>
                                <MapView 
                                    address={addressdata}
                                    areaName={areaName}
                                    getMapValue={this.getMapValue}
                                    iconStyle={{border: '1px solid #d9d9d9', borderLeft: 0, marginLeft: '-5px'}}
                                />
                            </Col>
                            <Col span={5}>
                                <div style={{color: '#18B583'}}>
                                    {
                                        longitude && <span>{longitude > 0 ? `E${longitude}, ` : `W${longitude}, `}</span>
                                    }
                                    {
                                        latitude && <span>{latitude > 0 ? `N${latitude}` : `S${latitude}`}</span>
                                    }
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={24} type={openType}> 
                            <Col label="所属片区&emsp;&emsp;" colon span={10} 
                                text={areaName} 
                            >
                                <Input 
                                    disabled 
                                    placeholder="自动识别"
                                    value={areaName} 
                                    title={areaName}
                                />
                            </Col> 
                        </Row>
                        <Row gutter={24} type={openType}>
                            <Col  label="联系人&emsp;&emsp;&emsp;" colon span={10} text={contactName}>
                                <Input 
                                    value={contactName ? contactName : ''}
                                    placeholder="" 
                                    onChange={e => {
                                        this.setState({contactName: e.target.value})
                                    }
                                }
                                />
                            </Col>
                        </Row>
                        <Row gutter={24} type={openType}>
                            <Col label="手机号码&emsp;&emsp;" colon span={10} text={cellphoneNumber}>
                                {/* <FormItem>
                                    {
                                        getFieldDecorator('cellphoneNumber', {
                                            initialValue: cellphoneNumber,
                                            rules: [
                                                {
                                                    validator: validateToCellPhoneAndNoNull
                                                }
                                            ],
                                        })( */}
                                            <Input 
                                                defaultValue={cellphoneNumber ? cellphoneNumber : ''}
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({cellphoneNumber: e.target.value})
                                                }
                                            }
                                            />
                                        {/* )
                                    }
                                </FormItem> */}
                            </Col>
                        </Row>
                        <Row gutter={24} type={openType}>
                            <Col label="联系电话&emsp;&emsp;" colon span={10} text={contactNumber}>
                                {/* <FormItem>
                                    {
                                        getFieldDecorator('contactNumber', {
                                            initialValue: contactNumber,
                                            rules: [
                                                {
                                                    validator: validateToNextPhone
                                                }
                                            ],
                                        })( */}
                                            <Input 
                                                defaultValue={contactNumber ? contactNumber : ''}
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({contactNumber: e.target.value})
                                                }
                                            }
                                            />
                                        {/* )
                                    }
                                </FormItem> */}
                            </Col>
                        </Row>
                        {
                            addressType === 1 ?
                            <Row gutter={24} type={openType}>
                                <Col label="默认发货方&emsp;" colon span={10} text={defaultShipperName}>
                                    {
                                        continueReload ?
                                        null
                                        :
                                        <RemoteSelect
                                            defaultValue={defaultShipperId ? {id: defaultShipperId, cargoPartyName: defaultShipperName} : ''}
                                           // getPopupContainer={() => this.popupContainer || document.body}
                                            onChangeValue={
                                                value => {
                                                    this.setState({
                                                        defaultShipperId: value ? value.id : null, //默认发货方id
                                                        defaultShipperName: value ? value.cargoPartyName : null, //默认发货方名字
                                                    })
                                                }
                                            } 
                                            getDataMethod={'getConsignees'}
                                            params={{limit: 999999, offset: 0, clientId: clientId}}
                                            labelField={'cargoPartyName'}
                                            disabled={clientId ? false : true}
                                        />
                                    }
                                </Col>
                            </Row>
                            :
                            null
                        }
                    </div>
               </Form>
            </Modal>
        )
    }
}
export default Form.create()(AddOrEdit);