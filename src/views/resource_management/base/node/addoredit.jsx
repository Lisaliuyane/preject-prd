import React, { Component } from 'react'
import Modal from '@src/components/modular_window'
import { Button, Form, Input, InputNumber, Checkbox, message, Upload, Icon, TimePicker, Radio} from 'antd'
import RemoteSelect from '@src/components/select_databook'
// import CustomRemoteSelect from '@src/components/select_data'
// import Col from '@src/components/colItem'
import FormItem from '@src/components/FormItem'
import { Row, Col } from '@src/components/grid'
import moment from 'moment'
import MapView from '@src/components/map'
import { inject } from "mobx-react"
import { SelectAddress, SelectAddressNew } from '@src/components/select_address'
import { addressToString, validateToNextPhone, cloneObject, stringToArray, addressFormat } from '@src/utils'
import './addoredit.less'

const RadioGroup = Radio.Group
// const Row = (props) => {
//     return (
//         <Row {...props} type="flex" align="middle" justify="space-between">
//             {props.children}
//         </Row>
//     )
// }

@inject('rApi')
class AddOrEdit extends Component {

    state = {
        open: false,
        edit: false,
        loading: false,
        type: null,
        title: null,
        address: null, // 地址
        addressdata: {}, // 地址数据
        contactname: null, // 联系人
        nodeid: 0, // id
        nodename: null, //节点名称
        nodetypeid: 0, // 节点类型 id
        nodetypename: null, //节点类型
        nodetypedata: [], // 节点类型数据
        phone: '', // 联系方式
        remark: null, // 备注
        areaName: null, // 区域
        isSelfSupport: 1, //是否自营
        buttonLoading: false,
        historyData: null, //传入数据
        longitude: null, //经度
        latitude: null, //纬度
        reloadAdress: false
    }
    constructor(props) {
        super(props);
        if (props.getThis) {
            props.getThis(this)
        }
    }
    componentDidMount () {
        this.props.rApi.getNode().then((res) => {
            this.setState({nodetypedata: res.nodeType.map((d,index) => {
                let obj = {}
                for (let key in d) {
                    obj.id = key
                    obj.title = d[key]
                }
                return obj
            })})
        })
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
        // console.log('d', d.data)
        let historyData = typeof d.data === 'object' ? cloneObject(d.data) : null
        if (d.edit) {
            this.setState({
                type: 1,
                title:'编辑中转地',
                nodeid: d.data.id,
                areaName: d.data.areaName,
                addressdata: d.data.address,
                contactname: d.data.contact,
                nodename: d.data.name,
                nodetypename: d.data.nodeTypeName,
                nodetypeid: d.data.nodeTypeId,
                phone: d.data.phone, 
                remark: d.data.remark,
                isSelfSupport: d.data.isSelfSupport,
                longitude: d.data.longitude, 
                latitude: d.data.latitude
            })
        } else if (d.data) {
            this.setState({
                type: 2,
                title:'查看中转地',
                areaName: d.data.areaName,
                addressdata: d.data.address,
                contactname: d.data.contact,
                nodename: d.data.name,
                nodetypename: d.data.nodeTypeName,
                phone: d.data.phone, 
                remark: d.data.remark,
                isSelfSupport: d.data.isSelfSupport,
                longitude: d.data.longitude, 
                latitude: d.data.latitude
            })
        } else {
            this.setState({type: 3,title:'新建中转地'})
        }
        
        this.setState({
            // ...d.data,
            historyData: historyData,
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
        this.setState({
            title: null,
            address: null, // 地址
            addressdata: {}, // 地址数据
            contactname: null, // 联系人
            nodeid: 0, // id
            nodename: null, //节点名称
            nodetypeid: 0, // 节点类型 id
            nodetypename: null, //节点类型
            phone: '', // 联系方式
            remark: null, // 备注
            areaName: null, // 区域
            isSelfSupport: 1, //是否自营
            buttonLoading: false,
            longitude: null, //经度
            latitude: null, //纬度
            reloadAdress: false
        })
    }
    
    getSelectAddress = (d) => {
        this.selectAddress = d
    }
    onChageProvince = (value) => {
        let { rApi } = this.props
        if (value && value.id) {
            rApi.getAreaByAddress(value).then(res => {
                this.setState({
                    areaName: res.map(item => item.title).join(',')
                })
            })
        } else {
            this.setState({areaName: null})
        }
    }
  
    saveSubmit = () => {
        let { rApi } = this.props
        let { 
            type,
            title,
            address,
            addressdata,
            contactname,
            nodeid,
            nodename,
            nodetypeid,
            nodetypename,
            nodetypedata,
            phone,
            remark,
            areaName,
            isSelfSupport,
            longitude, //经度
            latitude //纬度
        } = this.state
        address = this.selectAddress.getValue()
        if(!longitude || !latitude) {
            message.error('中转地经纬度不能为空!')
            return false
        }
        if(this.state.type === 1) {
            this.setState({
                buttonLoading: true
            })
            rApi.editNode({
                areaName,
                id: nodeid,
                address: address,
                contact: contactname,
                name: nodename,
                nodeTypeName: nodetypename,
                nodeTypeId:nodetypeid,
                phone: phone,
                remark: remark,
                isSelfSupport,
                longitude, //经度
                latitude //纬度
            }).then(d => {
                message.success('操作成功!')
                this.changeOpen(false)
                this.setState({
                    buttonLoading: false
                }, () => {
                    this.updateThisDataToTable({
                        areaName,
                        id: nodeid,
                        address: address,
                        contact: contactname,
                        name: nodename,
                        nodeTypeName: nodetypename,
                        nodeTypeId:nodetypeid,
                        phone: phone,
                        remark: remark,
                        isSelfSupport,
                        longitude, //经度
                        latitude //纬度
                    })
                })
            }).catch(e => {
                message.error(e.msg || '操作失败！')
                this.setState({
                    buttonLoading: false
                })
            })
        } else if(this.state.type === 2) {
            this.changeOpen(false)
        } else if(this.state.type === 3) {
            this.setState({
                buttonLoading: true
            })
            rApi.addNode({
                areaName,
                address: address,
                contact: contactname,
                name: nodename,
                nodeTypeId: nodetypeid,
                nodeTypeName: nodetypename,
                phone: phone,
                remark: remark,
                isSelfSupport,
                longitude, //经度
                latitude //纬度
            }).then(d => {
                this.setState({
                    buttonLoading: false
                })
                this.actionDone()
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
    changedemo = (time) => {
        console.log('time',moment(time).format('YYYY-MM-DD h:mm:ss'))
    }

    onSubmit = () => {
        //e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            //console.log('Received values of form: ', values);
            this.saveSubmit()
          }
        });
    }

    getMapValue = (value) => { //获取地图的值
        // console.log('getMapValue', value.point.lng)
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
 
    getValueForChilder = (value) => { //获取地址onChang值
        this.setState({
            addressdata: value
        })
    }

    render() { 
        const { edit } = this.props
        const { getFieldDecorator, setFieldsValue } = this.props.form
        const uploadButton = (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">Upload</div>
            </div>
          );
        // const drivingImage = this.state.drivingImage
        let { 
            type,
            title,
            address,
            addressdata,
            contactname,
            nodeid,
            nodename,
            nodetypeid,
            nodetypename,
            nodetypedata,
            phone,
            remark,
            areaName,
            isSelfSupport,
            buttonLoading,
            longitude,
            latitude,
            reloadAdress
        } = this.state
        return (
            <Modal
                onSubmit={this.onSubmit}
                style={{width: '100%', maxWidth: 850}}
                changeOpen={this.changeOpen} 
                open={this.state.open} 
                title={title} 
                haveFooter={type === 2 ? false : true}
                footerText="保存"
                loading={buttonLoading}
                getContentDom={v => this.popupContainer = v}
                >
                <div>
                    <Form layout='inline'>
                        {/* <Modal.Header title={'中转地基本信息'}>
                            {
                                type === 1 || type === 3 ? 
                                <FormItem>
                                    <Button 
                                        // icon='save' 
                                        htmlType="submit" 
                                        style={{ marginRight: 0, color: '#fff', background: '#18B583', border: 0}} 
                                        loading={buttonLoading}
                                    >
                                        保存
                                    </Button>
                                </FormItem>
                                :
                                null
                            }
                        </Modal.Header> */}
                        <div style={{padding: '5px 20px 15px', margin: 'auto', flex:'1'}}>
                            <Row gutter={24} type={type}>
                                <Col  label="中转地名称&emsp;" colon span={10} isRequired text={nodename}>
                                    <FormItem>
                                    {
                                        getFieldDecorator('nodename', {
                                            initialValue: nodename,
                                            rules: [
                                                { 
                                                    required: true, 
                                                    message: '请填写中转地名称'
                                                }
                                            ],
                                        })(
                                            <Input 
                                                placeholder="" 
                                                onChange={e => {
                                                    this.setState({nodename: e.target.value})
                                                }}
                                            />
                                        )
                                    }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24} type={type}>
                                <Col label="中转地类型&emsp;" colon span={10} isRequired text={nodetypename}>
                                    <FormItem isCustomChildren>
                                        {
                                            getFieldDecorator('nodetypename', {
                                                initialValue: nodetypeid ? 
                                                {id: nodetypeid, title: nodetypename} 
                                                : 
                                                null,
                                                rules: [
                                                    {
                                                        required: true, 
                                                        message: '请选择中转地类型'
                                                    }
                                                ],
                                            })(
                                                <RemoteSelect
                                                    defaultValue={nodetypeid ? {id: nodetypeid, title: nodetypename} : null} 
                                                   // getPopupContainer={() => this.popupContainer || document.body}
                                                    //placeholder={'合作状态'}
                                                    placeholder={nodetypename}
                                                    onChangeValue={value => {
                                                        if(value && value !== ''){
                                                            this.setState({nodetypeid: parseInt(value.id),nodetypename:value.title})
                                                            }
                                                        }
                                                    }
                                                    labelField='title' 
                                                    list={nodetypedata}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24} type={type}>
                                <Col  label="是否自营&emsp;&emsp;" colon span={16} text={isSelfSupport === 1 ? '是' : '否'}>
                                    <RadioGroup 
                                        onChange={e => {
                                            this.setState({
                                                isSelfSupport: e.target.value
                                            })
                                        }} 
                                        value={isSelfSupport === 1 ? 1 : 0}
                                        defaultValue={isSelfSupport === 1 ? 1 : 0}
                                        >
                                            <Radio value={1}>是</Radio>
                                            <Radio value={0}>否</Radio>
                                    </RadioGroup>
                                </Col>
                            </Row>
                            <Row gutter={24} type={type}>
                                {
                                    reloadAdress ?
                                    null
                                    :
                                    <Col span={17} label="中转地地址&emsp;" colon text={addressFormat(addressdata)}>
                                        <SelectAddressNew
                                            onChageProvince={this.onChageProvince}
                                            getValueForChilder={this.getValueForChilder}
                                        // getPopupContainer={() => this.popupContainer || document.body}
                                            address={addressdata ? addressdata : {}}
                                            getThis={this.getSelectAddress} 
                                            title={addressFormat(addressdata)}
                                            //defaultValue={addressdata}
                                        />
                                    </Col>
                                }
                                {
                                    type === 2 ?
                                    null
                                    :
                                    <Col span={2}>
                                        <MapView 
                                            address={addressdata}
                                            areaName={areaName}
                                            getMapValue={this.getMapValue}
                                            iconStyle={{border: '1px solid #d9d9d9', borderLeft: 0, marginLeft: '-5px'}}
                                        />
                                    </Col>
                                }
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
                            <Row gutter={24} type={type}> 
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
                            <Row gutter={24} type={type}>
                                <Col label="联&ensp;系&ensp;人&emsp;&emsp;" colon span={10} text={contactname}>
                                    <Input 
                                        value={contactname ? contactname : ''}
                                        placeholder="" 
                                        onChange={e => {
                                            this.setState({contactname: e.target.value})
                                            }
                                        }
                                    />
                                </Col>
                            </Row>
                            <Row gutter={24} type={type}>
                                <Col label="联系方式&emsp;&emsp;" colon span={10} text={phone}>
                                    <FormItem>
                                        {
                                            getFieldDecorator('phone', {
                                                initialValue: phone,
                                                rules: [
                                                    {
                                                        validator: validateToNextPhone
                                                    }
                                                ],
                                            })(
                                                <Input 
                                                    placeholder="" 
                                                    onChange={e => {
                                                        this.setState({phone: e.target.value})
                                                    }
                                                }
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={24} type={type}>
                                <Col label="备注信息&emsp;&emsp;" colon span={18} text={remark}>
                                        <Input 
                                            value={remark ? remark : ''}
                                            placeholder="" 
                                            onChange={e => {
                                                this.setState({remark: e.target.value})
                                                }
                                            }
                                        />
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </div>
            </Modal>
        )
    }
}
 
export default Form.create()(AddOrEdit);