import React, { Component } from 'react'
import Titlebar from '../public/Titlebar'
import Footbtnbar from '../public/Footbtnbar'
import { Row, Col } from '@src/components/grid'
import FormItem from '@src/components/FormItem'
import RemoteSelect from '@src/components/select_databook'
import { SelectAddressNew } from '@src/components/select_address'
import MapView from '@src/components/map'
import { validateToNextPhoneOrNoNUll } from '@src/utils'
import { Form, Input, Button } from 'antd'

class Baseinfo extends Component {
    // 获取地图的值
    getMapValue = (value) => {
        // console.log('getMapValue', value.point.lng)
        this.setState({
            addressdata: value.address,
            longitude: value && value.point && value.point.lng,
            latitude: value && value.point && value.point.lat,
            reloadAdress: true
        }, () => {
            this.setState({
                reloadAdress: false
            })
        })
    }

    /* 保存验证 */
    save = e => {
        const { form, saveBaseinfo } = this.props
        form.validateFieldsAndScroll((err, val) => {
            if (!err) {
                let addr = this.selectAddr.getValue()
                if (!addr.pro) {
                    form.setFields({
                        warehouseAddress: {
                            value: null,
                            errors: [new Error('请选择仓库地址')]
                        }
                    })
                    return
                }
                saveBaseinfo()
            } else {
                console.log('validate', val)
            }
        })
    }

    render () {
        const {
            form,
            changeVal,
            onChangeAddress,
            getSelectAddress,
            getValueForChilder,
            getMapValue,
            isSave,
            saveLoading,
            name,
            typeId,
            typeName,
            principal,
            phone,
            address,
            areaName,
            longitude,
            latitude,
            remark,
            addrReload,
            mapReload
        } = this.props
        const { getFieldDecorator } = form
        let addressJson = address
        try {
            addressJson = JSON.parse(address)
        } catch (err) {
            addressJson = address || {}
        }
        // console.log('getMapValue', longitude, latitude)
        return(
            <Form
                className={this.props.className}
                layout='inline'
            >
                <Titlebar title={'基本信息'}/>
                <Row>
                    <Col isRequired label="仓库名称" span={6} text={name}>
                        <FormItem>
                            {
                                getFieldDecorator('name', {
                                    initialValue: name,
                                    rules: [{
                                        required: true,
                                        message: '请填写仓库名称'
                                    }],
                                })(
                                    <Input
                                        onChange={e => changeVal('name', e.target.value)}
                                        placeholder=""
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={6} />
                    <Col isRequired label="仓库类型" span={6} text={typeName}>
                        <FormItem>
                            {
                                getFieldDecorator('typeId', {
                                    initialValue: typeId ?
                                        {
                                            id: typeId,
                                            title: typeName
                                        }
                                        :
                                        null,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择仓库类型'
                                        }
                                    ],
                                })(
                                    <RemoteSelect
                                        defaultValue={
                                            typeId ?
                                                {
                                                    id: typeId,
                                                    title: typeName
                                                }
                                                :
                                                null
                                        }
                                        onChangeValue={(value = {}) => {
                                            changeVal('typeId', value.id)
                                            changeVal('typeName', value.title)
                                        }}
                                        text="仓库类型"
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={6} />
                </Row>
                <Row>
                    <Col isRequired label="&emsp;负责人" span={6} text={principal}>
                        <FormItem>
                            {
                                getFieldDecorator('principal', {
                                    initialValue: principal,
                                    rules: [{
                                        required: true,
                                        message: '请填写负责人'
                                    }],
                                })(
                                    <Input
                                        onChange={e => changeVal('principal', e.target.value)}
                                        placeholder=""
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={6} />
                    <Col isRequired label="联系电话" span={6}>
                        <FormItem>
                            {
                                getFieldDecorator('phone', {
                                    initialValue: phone,
                                    rules: [
                                        {
                                            validator: validateToNextPhoneOrNoNUll
                                        }
                                    ],
                                })(
                                    <Input
                                        value={phone ? phone : null}
                                        placeholder=""
                                        onChange={e => changeVal('phone', e.target.value)}
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                    <Col span={6} />
                </Row>
                <Row>
                    <Col isRequired span={10} label="仓库地址">
                        {
                            !addrReload ?
                            <FormItem>
                                {
                                    getFieldDecorator('warehouseAddress', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请选择仓库地址'
                                            }
                                        ]
                                    })(
                                        <SelectAddressNew
                                            getThis={v => {
                                                this.selectAddr = v
                                                getSelectAddress(v)
                                            }}
                                            getValueForChilder={getValueForChilder}
                                            onChageProvince={onChangeAddress}
                                            address={addressJson || {}}
                                            defaultValue={null}
                                        />
                                    )
                                }
                            </FormItem> : null
                        }
                    </Col>
                    <Col span={2}>
                        {
                            !mapReload ? 
                                <MapView
                                    address={addressJson || {}}
                                    getMapValue={getMapValue}
                                    areaName={areaName}
                                    iconStyle={{ border: '1px solid #d9d9d9', borderLeft: 0, marginLeft: -5 }}
                                /> : null
                        }
                    </Col>
                    <Col span={6}>
                        <div style={{color: '#18B583'}}>
                            {
                                longitude && <span>{longitude > 0 ? `E${longitude}, ` : `W${longitude}, `}</span>
                            }
                            {
                                latitude && <span>{latitude > 0 ? `N${latitude}` : `S${latitude}`}</span>
                            }
                        </div>
                    </Col>
                    <Col span={6} />
                </Row>
                <Row>
                    <Col label="所属片区" span={6}>
                        <Input
                            disabled
                            placeholder="自动识别"
                            value={areaName || ''}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col label="&emsp;&emsp;备注" span={12}>
                        <Input
                            defaultValue={remark ? remark : null}
                            placeholder=""
                            title={remark}
                            onChange={e => changeVal('remark', e.target.value)}
                        />
                    </Col>
                </Row>
                <Footbtnbar style={{marginTop: 5}}>
                    <Button type="primary" onClick={this.save} loading={saveLoading}>{isSave ? '保存' : '新建'}</Button>
                </Footbtnbar>
            </Form>
        )
    }
}

export default Form.create()(Baseinfo)