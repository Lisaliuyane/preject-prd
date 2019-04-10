import React, { Component, Fragment } from 'react'
import Modal from '@src/components/modular_window'
import { Button, Form, Input, InputNumber, message, Icon, DatePicker, Radio} from 'antd'
import RemoteSelect from '@src/components/select_databook'
import MultiUploader from '@src/components/uploader_multi'
import { cloneObject, validateToCellPhone, validateCarCodeAndNoNull, validateCarCode, imgClient } from '@src/utils'
import UploaderFile from '@src/components/uploader_file'
import { children, id } from './power'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
// import Col from '@src/components/colItem'
import FormItem from '@src/components/FormItem'
import { Row, Col } from '@src/components/grid'
import moment from 'moment'
import { inject } from "mobx-react"
import './addoredit.less'

// const client = new OSS({
//     region: 'oss-cn-shenzhen',//你的oss地址 ，具体位置见下图
//     accessKeyId: 'LTAIbH8hu0UeKsCM',//你的ak
//     accessKeySecret: 'h3RdiKm0ohUUN5tzRMoZ0nvqh0ohOp',//你的secret
//     //stsToken: '<Your securityToken(STS)>',//这里我暂时没用，注销掉
//     bucket: 'frdscm'//你的oss名字
// })

const RadioGroup = Radio.Group
const carCodeTypedata = [
    // {
    //     id: 1,
    //     title: '挂车'
    // },
    {
        id: 2,
        title: '港车'
    },
    {
        id: 3,
        title: '澳车'
    }
]
const power = Object.assign({}, children, id)
@inject('rApi')
class AddOrEdit extends Component {

    state = {
        open: false,
        edit: false,
        loading: false,
        imageUrl: null,
        type: null,
        title: null,
        itemid:0,//id
        carcode: null, //车牌
        licensePlateType: null, //车牌类型名
        licensePlateId: null, //车牌类型id
        trailerCarCode: null, //挂车车牌
        registerdate: null, //注册时间
        registertimedata:[], //注册时间数据
        // carkind: 0, // 车种id
        // carkindname: null, //车种名
        // carkinddata:[], // 车种数据
        cartype: 0, // 车型id
        cartypename: null, //车型名
        cartypedata:[], //车型数据
        carweight: 0, //车辆自重
        driverId: null, //关联司机
        driverName:null,//司机名字
        associatedriver:[], //关联司机数据
        drivingImage: null, //司机证件
        drivingImageBack: null, //司机证件2
        phone: '', // 联系方式
        attachcarrierid: 0, //关联承运商
        attachcarriername:null,//承运商名
        associatecarrier:[], //关联承运商数据
        remark: null, // 备注
        authenticationstatus: 0, //认证状态
        authenticationStatusName: null, //认证状态名
        ifShow: 'block', //保存是否显示
        previewVisible: false,
        previewImage: '',
        justFileList: [],
        backFileList: [],
        historyData: null, //传入数据
        buttonLoading: false,
        configCarType: 1,
        isTemporary: null //临时车辆
    }

    constructor(props) {
        super(props);
        if (props.getThis) {
            props.getThis(this)
        }
        // console.log('carcode',this.state.carcode)
    }

    componentDidMount () {
        this.props.rApi.getCarPageData().then((res) => {
            // this.setState({carkinddata: res.carKind.map((d,index) => {
            //     let obj = {}
            //     for (let key in d) {
            //         obj.id = key
            //         obj.title = d[key]
            //     }
            //     return obj
            // })})
            this.setState({cartypedata: res.carType.map((d,index) => {
                let obj = {}
                for (let key in d) {
                    obj.id = key
                    obj.title = d[key]
                }
                return obj
            })})
            this.setState({associatedriver: res.associateDriver.map((d,index) => {
                let obj = {id:d.id,title:d.name}
                return obj
            })})
            this.setState({associatecarrier: res.associateCarrier.map((d,index) => {
                let obj = {id:d.id,title:d.name}
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
        //console.log('show', d)
        let historyData = typeof d.data === 'object' ? cloneObject(d.data) : null
        let justFileUrl = [] //行驶证正面照
        let backFileUrl = [] //行驶证反面照
        if(d.data && d.data.drivingLicenseImage) {
            justFileUrl.push({
                uid: 5,
                name: 'drivingLicense.png',
                status: 'done',
                thumbUrl: imgClient().signatureUrl(d.data.drivingLicenseImage),
                url: imgClient().signatureUrl(d.data.drivingLicenseImage)
            })
        }
        if (d.data && d.data.drivingLicenseImageBack) {
            backFileUrl.push({
                uid: 6,
                name: 'drivingLicense.png',
                status: 'done',
                thumbUrl: imgClient().signatureUrl(d.data.drivingLicenseImageBack),
                url: imgClient().signatureUrl(d.data.drivingLicenseImageBack)
            })
        }
        if (d.edit) {
            this.setState({
                type: 1,
                title:'编辑车辆',
                itemid: d.data.id,
                carcode: d.data.carCode,
                licensePlateType: d.data.licensePlateType,
                licensePlateId: d.datalicensePlateId,
                trailerCarCode: d.data.trailerCarCode,
                registerdate: d.data.registerDate,
                // carkind: d.data.carKind,
                // carkindname:d.data.carKindName,
                cartype: d.data.carType,
                cartypename: d.data.carTypeName,
                carweight: d.data.carWeight,
                driverId: d.data.driverId,
                driverName:d.data.driverName,
                drivingImage: d.data.drivingLicenseImage,
                drivingImageBack: d.data.drivingLicenseImageBack,
                attachcarrierid: d.data.attachCarrierId,
                attachcarriername: d.data.carrierAbbreviation,
                phone: d.data.phone,
                remark: d.data.remark,
                authenticationstatus: d.data.authenticationStatus,
                authenticationStatusName:d.data.authenticationStatusName,
                //fileList: fileUrl,
                justFileList: justFileUrl,
                backFileList: backFileUrl,
                configCarType: d.isTemporary === 1 ? 1 : d.configCarType ? d.configCarType : 1
            })
        } else if (d.data) {
            this.setState({
                type: 2,
                title:'查看车辆',
                carcode: d.data.carCode,
                licensePlateType: d.data.licensePlateType,
                licensePlateId: d.datalicensePlateId,
                trailerCarCode: d.data.trailerCarCode,
                registerdate: d.data.registerDate,
                // carkind: d.data.carKind,
                // carkindname:d.data.carKindName,
                cartype: d.data.carType,
                cartypename: d.data.carTypeName,
                carweight: d.data.carWeight,
                driverId: d.data.driverId,
                driverName:d.data.driverName,
                drivingImage: d.data.drivingLicenseImage,
                drivingImageBack: d.data.drivingLicenseImageBack,
                attachcarrierid: d.data.attachCarrierId,
                attachcarriername: d.data.carrierAbbreviation,
                phone: d.data.phone,
                remark: d.data.remark,
                authenticationStatusName:d.data.authenticationStatusName,
                ifShow: 'none',
                justFileList: justFileUrl,
                backFileList: backFileUrl,
                configCarType: d.isTemporary === 1 ? 1 : d.configCarType ? d.configCarType : 1
            })
        } else {
            this.setState({type: 3,title:'新建车辆'})
            //console.log('新建')
        }
        
        this.setState({
            ...d.data,
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
            itemid:0,//id
            carcode: null, // 车牌
            licensePlateType: null, //车牌类型名
            licensePlateId: null, //车牌类型id
            trailerCarCode: null, //挂车车牌
            registerdate: null, // 注册时间
            registertimedata:[], //注册时间数据
            // carkind: 0, // 车种id
            // carkindname: null, //车种名
            cartype: 0, // 车型id
            cartypename: null, //车型名
            carweight: 0, // 车辆自重
            driverId: null, //关联司机
            driverName:null,// 司机名字
            drivingImage: null, // 司机证件
            drivingImageBack: null,
            phone: '', // 联系方式
            attachcarrierid: 0, // 关联承运商
            attachcarriername:null,//承运商名
            remark: null, // 备注
            authenticationstatus:0, //认证状态
            authenticationStatusName:null, //认证状态名
            ifShow: 'block',
            previewVisible: false,
            previewImage: '',
            justFileList: [],
            backFileList: [],
            buttonLoading: false,
            configCarType: 1
        })
    }

    onSubmit = () => {
        alert('xxx')
    }

    saveSubmit = () => {
        let { rApi } = this.props
        let { 
            itemid,
            carcode,
            licensePlateType, 
            licensePlateId,
            trailerCarCode,
            registerdate,
            // carkind,
            // carkindname,
            cartype,
            cartypename,
            carweight,
            driverId,
            driverName,
            associatedriver,
            drivingImage,
            drivingImageBack,
            phone,
            attachcarrierid,
            attachcarriername,
            remark,
            authenticationstatus,
            authenticationStatusName,
            configCarType
         } = this.state
        if(licensePlateId === 0 || !licensePlateId) {
            this.setState({
                trailerCarCode: ''
            })
        }
        if(configCarType === 2) {
            attachcarrierid = 0
        }
        if(this.state.type === 1) {
            this.setState({
                buttonLoading: true
            })
            rApi.editCar({
                id:itemid,
                attachCarrierId: attachcarrierid,
                carCode: carcode,
                licensePlateType,
                licensePlateId,
                trailerCarCode: trailerCarCode,
                // carKind: carkind,
                // carKindName: carkindname,
                carType: cartype,
                carTypeName: cartypename,
                carWeight: carweight,
                driverId: driverId,
                driverName: driverName,
                drivingLicenseImage: drivingImage,
                drivingLicenseImageBack: drivingImageBack,
                phone: phone,
                registerDate: registerdate,
                remark: remark,
                configCarType: configCarType ? configCarType : 1
            }).then(d => {
               // this.actionDone()
                message.success('操作成功!')
                this.setState({
                    buttonLoading: false
                }, ()=> {
                    this.changeOpen(false)
                    this.updateThisDataToTable({
                        id:itemid,
                        attachCarrierId: attachcarrierid,
                        carrierAbbreviation: attachcarriername,
                        carCode: carcode,
                        licensePlateType,
                        licensePlateId,
                        trailerCarCode,
                        carType: cartype,
                        carTypeName: cartypename,
                        carWeight: carweight,
                        driverId: driverId,
                        driverName: driverName,
                        drivingLicenseImage: drivingImage,
                        drivingLicenseImageBack: drivingImageBack,
                        phone,
                        registerDate: registerdate,
                        remark,
                        authenticationstatus,
                        authenticationStatusName,
                        configCarType,
                        isTemporary: null
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
            rApi.addCar({
                attachCarrierId: attachcarrierid,
                carCode: carcode,
                licensePlateType,
                licensePlateId,
                trailerCarCode: trailerCarCode,
                configCarType: configCarType ? configCarType : 1,
                carType: cartype,
                carTypeName: cartypename,
                carWeight: carweight,
                driverId: driverId,
                driverName: driverName,
                drivingLicenseImage: drivingImage,
                drivingLicenseImageBack: drivingImageBack,
                phone: phone,
                registerDate: registerdate,
                remark: remark
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

    authSubmit = () => { //认证
        let { itemid } = this.state
        this.props.rApi.authCar({
            id: itemid
        }).then(d => {
            message.success('操作成功!')
            this.setState({
                authenticationStatusName: '已认证',
                authenticationstatus: 1
            }, () => {
                this.updateThisDataToTable({
                    authenticationstatus: this.state.authenticationstatus,
                    authenticationStatusName: this.state.authenticationStatusName
                })
            })
        }).catch(e => {
            message.error(e.msg || '操作失败！')
        })
    }

    cancelAuthSubmit = () => { //取消认证
        let { itemid } = this.state
        this.props.rApi.cancelAuthCar({
            id: itemid
        }).then(d => {
            message.success('操作成功!')
            this.setState({
                authenticationStatusName: '未认证',
                authenticationstatus: 0
            }, () => {
                this.updateThisDataToTable({
                    authenticationstatus: this.state.authenticationstatus,
                    authenticationStatusName: this.state.authenticationStatusName
                })
            })
        }).catch(e => {
            message.error(e.msg || '操作失败！')
        })
    }

    /**
     * status = 1 // {status: this.state.status}
     * 
     * @memberof AddOrEdit
     */
    updateThisDataToTable = (d) => {
       // console.log('updateThisDataToTable', d)
        let { historyData } = this.state
        const { parent } = this.props
        if (!historyData) return
        if (parent && parent.tableView)
        parent.tableView.updateData(Object.assign({}, historyData, d))
    }

    changedemo = (time) => {
        console.log('time',moment(time).format('YYYY-MM-DD h:mm:ss'))
    }
    
    handleChangeUpload = (value) => {
        this.setState({
            drivingImage: value[0] ? value[0].imgurl : ''
        })
    }

    handleChangeUploadBack = (value) => {
        this.setState({
            drivingImageBack: value[0] ? value[0].imgurl : ''
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            //console.log('Received values of form: ', values);
            this.saveSubmit()
          }
        });
    }

    clearData = (isClear) => {
        if(isClear) {
            this.setState({
                reloadLicensePlateType: true,
                trailerCarCode: ''
            }, () => {
                this.setState({
                    reloadLicensePlateType: false
                })
            })
        }
    }

    getDriverPhone = () => { //获取司机电话
        let { driverId, phone, phoneBackup } = this.state
        const { rApi } = this.props
        if(driverId) {
            rApi.getDrivers({
                limit: 99999, 
                offset: 0,
                id: driverId
            }).then(d => {
                if (d) {
                    let data = d.records[0]
                    this.setState({
                        phone: data ? data.phone : ''
                    })
                }
            }).catch(e => {
                console.log(e)
            })
        }
    }

    getDriversData = () => {
        const { rApi } = this.props
        return new Promise((resolve, reject) => {
            rApi.getDrivers({
                limit: 999999,
                offset: 0,
                authenticationStatus: 1
            }).then(d => {
                //console.log('filterOrderIdGetCarType', d)
                let data = d.records                
                if(data && data.length > 0) {
                    resolve(data.map(item => {
                        return { id: item.id,  name: `${item.name}(${item.idNumber})`}
                    }))
                } else {
                    resolve([])
                }
            }).catch(e => {
                reject(e)
            })
        })
    }

    // clearDriverPhone = (isClear) => {
    //     let { driverId } = this.state
    //     if(isClear && !driverId) {
    //         this.setState({
    //             reloadDriverPhone: true,
    //             phone: null
    //         }, () => {
    //             this.setState({
    //                 reloadDriverPhone: false
    //             })
    //         })
    //     }
    // }

    render() { 
        const { edit } = this.props
        const { getFieldDecorator, setFieldsValue } = this.props.form
        let { 
            carcode,
            licensePlateType,
            licensePlateId,
            trailerCarCode,
            type,
            title,
            registerdate,
            registertimedata,
            // carkind,
            // carkindname,
            // carkinddata,
            cartype,
            cartypename,
            cartypedata,
            carweight,
            driverId,
            driverName,
            associatedriver,
            drivingImage,
            phone,
            attachcarrierid,
            attachcarriername,
            associatecarrier,
            remark,
            authenticationStatusName,
            authenticationstatus,
            ifShow,
            previewVisible,
            previewImage,
            justFileList,
            backFileList,
            reloadLicensePlateType,
            reloadDriverPhone,
            buttonLoading,
            configCarType,
            isTemporary
        } = this.state
       // console.log('configCarType', configCarType)
        return (
            <Modal
                onSubmit={this.onSubmit}
                style={{width: '100%', maxWidth: 850, minHeight: 300}}
                changeOpen={this.changeOpen} 
                open={this.state.open} 
                title={title} 
                getContentDom={v => this.popupContainer = v}
                >
                <div style={{minHeight: 272}} className="car-info-wrapper">
                    <Form layout='inline' onSubmit={this.handleSubmit}>
                        <Modal.Header title={
                            type === 3 ?
                            ''
                            :
                            <span>
                                <span style={{colr: '#808080'}}>状态:</span>
                                {
                                    authenticationStatusName ?
                                    <span style={{fontSize: '14px', color: authenticationStatusName === '已认证' ? 'rgb(29, 165, 122)' : 'red', marginLeft: 10}}>{authenticationStatusName}</span>
                                    :
                                    <span style={{fontSize: '14px', color: 'red', marginLeft: 10}}>未认证</span>
                                }
                            </span>
                        }>
                            {
                                (type === 1 && !authenticationstatus) || (type === 1 && authenticationstatus === 0) ?
                                <FunctionPower power={power.AUTH_DATA}>
                                    <Button 
                                        // icon='solution' 
                                        onClick={this.authSubmit} 
                                        style={{ marginRight: '10px', borderRadius: 0}}
                                    >
                                        认证
                                    </Button>
                                </FunctionPower>
                                :
                                (type === 1 && authenticationstatus === 1) ?
                                <FunctionPower power={power.CANCEL_AUTH}>
                                    <Button 
                                        // icon='solution' 
                                        onClick={this.cancelAuthSubmit} 
                                        style={{ marginRight: '10px', borderRadius: 0}}
                                    >
                                        取消
                                    </Button>
                                </FunctionPower>
                                :
                                null
                            }
                            {
                                type === 2 ?
                                null
                                :
                                <FormItem>
                                    <Button 
                                        // icon='save' 
                                        htmlType="submit"  
                                        style={{ marginRight: 0, border: 0, borderRadius: 0, color: authenticationstatus === 1 ? 'rgba(0, 0, 0, 0.25)' : '#fff', background: authenticationstatus === 1 ? '#f5f5f5' : '#18B583'}}
                                        loading={buttonLoading}
                                        disabled={authenticationstatus === 1 ? true : false}
                                    >
                                        保存
                                    </Button>
                                </FormItem>
                            }
                        </Modal.Header>
                        <Fragment>
                            <div className="base-text">基本信息</div>
                            <div style={{display:'flex'}}>
                                <div style={{width:'450px', padding: '5px 20px', margin: 'auto'}}>
                                    <Row gutter={24} type={type}>
                                        <Col isRequired label="车牌号码&emsp;&emsp;" colon span={16} text={carcode}>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('carcode', {
                                                        initialValue: carcode,
                                                        rules: [
                                                            { 
                                                                validator: validateCarCodeAndNoNull
                                                            }
                                                        ],
                                                    })(
                                                        <Input 
                                                            //defaultValue={carcode ? carcode : ''}
                                                            placeholder="" 
                                                            onChange={e => {
                                                                this.setState({carcode: e.target.value})
                                                                //setFieldsValue({carcode: e.target.value})
                                                            }}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={24} type={type}>
                                        <Col label="特殊车辆&emsp;&emsp;" colon span={16} text={licensePlateType}>
                                            <RemoteSelect
                                                defaultValue={licensePlateId ? {id: licensePlateId, title: licensePlateType} : null} 
                                                getPopupContainer={() => this.popupContainer || document.body}
                                                onChangeValue={value => {
                                                    this.setState({
                                                        licensePlateId: value ? value.id : 0,
                                                        licensePlateType: value ? value.title : ''
                                                    }, () => {
                                                        let id = value ? value.id : null
                                                        if(id !== licensePlateId) {
                                                            this.clearData(true)
                                                        }
                                                    })
                                                }}
                                                // filterField='id' 
                                                labelField='title'
                                                list={carCodeTypedata} 
                                            />
                                        </Col>
                                    </Row>
                                    {
                                        licensePlateId ?
                                        <Row gutter={24} type={type}>
                                        {/* {`${licensePlateType ? licensePlateType : '挂车'}车牌`} */}
                                            <Col label="车辆车牌&emsp;&emsp;" colon span={16} text={trailerCarCode}>
                                                {
                                                    reloadLicensePlateType ?
                                                    null
                                                    :
                                                    <FormItem>
                                                    {
                                                            getFieldDecorator('trailerCarCode', {
                                                                initialValue: trailerCarCode,
                                                                rules: [
                                                                    {
                                                                        validator: validateCarCode
                                                                    }
                                                                ],
                                                            })(
                                                                <Input 
                                                                    defaultValue={trailerCarCode}
                                                                    placeholder="" 
                                                                    onChange={e => {
                                                                        this.setState({trailerCarCode: e.target.value})
                                                                        //setFieldsValue({carcode: e.target.value})
                                                                    }}
                                                                />
                                                            )
                                                        }
                                                    </FormItem>
                                                }
                                            </Col>
                                        </Row>
                                        :
                                        null
                                    }
                                    <Row gutter={24} type={type}>
                                        {/* <Col  label="车种" span={7}>
                                            <CustomRemoteSelect
                                                defaultValue={carkind && carkindname ? {id: carkindname, title: carkindname} : null}
                                                placeholder={carkindname}
                                                onChangeValue={value => {
                                                    if(value  && value !== ''){
                                                        this.setState({carkind: parseInt(value.id),carkindname: value.title})
                                                    }
                                                }
                                            } 
                                                filterField='id' 
                                                labelField='title' 
                                                data={carkinddata}
                                            />
                                        </Col> */}
                                        <Col isRequired label="车型&emsp;&emsp;&emsp;&emsp;" colon span={16} text={cartypename}>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('cartype', {
                                                        initialValue:cartype ? 
                                                        {
                                                            id: cartypename, 
                                                            title: cartypename
                                                        } : null,
                                                        rules: [
                                                            { 
                                                                required: true, 
                                                                message: '请选择车型'
                                                            }
                                                        ],
                                                    })(
                                                        <RemoteSelect
                                                            defaultValue={cartype ? {id: cartype, name: cartypename} : null} 
                                                            getPopupContainer={() => this.popupContainer || document.body}
                                                            placeholder={cartypename} 
                                                            onChangeValue={value => {
                                                                if(value && value !== '') {
                                                                    this.setState({cartype:parseInt(value.id),cartypename: value.name})
                                                                }
                                                            }}
                                                            //list={cartypedata} 
                                                            labelField='name'
                                                            getDataMethod={'getCarTypes'}
                                                            params={{
                                                                limit: 99999,
                                                                offset: 0
                                                            }}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={24} type={type}>
                                        <Col label="车辆自重(t)&emsp;" colon span={16} text={carweight}>
                                            <InputNumber 
                                                min={1}
                                                value={carweight ? carweight : ''} 
                                                defaultValue={carweight}
                                                placeholder='单位/t'
                                                onChange={e => {
                                                    this.setState({carweight: e})
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={24} type={type}>
                                        <Col label="注册日期&emsp;&emsp;" colon span={17} text={registerdate ? moment(registerdate).format('YYYY-MM-DD') : ''}>
                                            <DatePicker
                                                defaultValue={registerdate ? moment(registerdate) : null}
                                                //getCalendarContainer={() => this.popupContainer || document.body}
                                                format="YYYY-MM-DD"
                                                style={{width: 182.6}}
                                                onChange={
                                                    date => {
                                                        this.setState({registerdate: moment(date).format('YYYY-MM-DD')})
                                                    }} 
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={24} type={type}>
                                        <Col label="车辆备注&emsp;&emsp;" colon span={20} text={remark}>
                                            <Input
                                                defaultValue={remark ? remark : ''}
                                                title={remark}
                                                placeholder=""
                                                maxLength="10"
                                                onChange={e => {this.setState({remark: e.target.value})}}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                <div className="flex1" style={{padding:'10px 10px 0'}}>
                                    <div className="flex uploader-img-wrraper">
                                        <MultiUploader
                                            previewVisible={previewVisible}
                                            previewImage={previewImage}
                                            fileList={justFileList}
                                            handleChangeUpload={this.handleChangeUpload}
                                            type={type}
                                            title=''
                                            text="上传行驶证正面照!"
                                            //titleTwo="上传行驶证反面照!"
                                        />
                                        <MultiUploader
                                            previewVisible={previewVisible}
                                            previewImage={previewImage}
                                            fileList={backFileList}
                                            handleChangeUpload={this.handleChangeUploadBack}
                                            type={type}
                                            title=''
                                            text="上传行驶证反面照!"
                                            //titleTwo="上传行驶证反面照!"
                                        />
                                    </div> 
                                    {/* <div className="check-wrraper">
                                        <span className="already-check">{authenticationStatusName ? authenticationStatusName : '未认证'}</span>
                                    </div> */}
                                </div>
                            </div>
                           <div style={{padding: '0 20px'}}>
                                <div className="base-title">配置信息</div>
                           </div>
                            <div style={{width: 450, padding: '0 20px 15px'}}>
                                <Row gutter={24} type={type}>
                                    <Col label="车辆类型&emsp;&emsp;" colon span={24} text={configCarType === 2 ? '现金车' : '承运商车辆'}>
                                        <RadioGroup 
                                            onChange={(e) => {
                                                this.setState({
                                                    configCarType: e.target.value || 1
                                                })
                                            }} 
                                            value={configCarType ? configCarType : 1}
                                            defaultValue={configCarType ? configCarType : 1}
                                            >
                                            <Radio value={1}>承运商车辆</Radio>
                                            <Radio value={2}>现金车</Radio>
                                        </RadioGroup>
                                    </Col>
                                </Row>
                                {
                                    configCarType === 2 ?
                                    null
                                    :
                                    <Row gutter={24} type={type}>
                                        <Col label="承运商&emsp;&emsp;&emsp;" colon span={16} text={attachcarriername}>
                                            <RemoteSelect 
                                                defaultValue={
                                                    attachcarrierid ?
                                                    {
                                                        id: attachcarrierid,
                                                        title: attachcarriername,
                                                        abbreviation: attachcarriername,
                                                    }
                                                    :
                                                    null
                                                }
                                                getPopupContainer={() => this.popupContainer || document.body}
                                                labelField={'abbreviation'}
                                                getDataMethod={'getCooperationCarriet'}
                                                onChangeValue={(value = {}) => {
                                                    this.setState({attachcarrierid: value.id, attachcarriername: value.title})
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                }
                                <Row gutter={24} type={type}>
                                    <Col label="司机姓名&emsp;&emsp;" colon span={16} text={driverName}>
                                        <RemoteSelect
                                            defaultValue={driverId ? {id: driverId, name: driverName} : null} 
                                            getPopupContainer={() => this.popupContainer || document.body}
                                            placeholder={''}
                                            onChangeValue={(value = {}) => {
                                                this.setState({
                                                    driverId: value ? value.id : 0,
                                                    driverName:  value ? value.name : 0
                                                }, this.getDriverPhone)
                                            }}
                                            labelField='name'
                                            //getDataMethod={'getDrivers'}
                                            getData={this.getDriversData}
                                            // params={{
                                            //     limit: 1000,
                                            //     offset: 0,
                                            //     authenticationStatus: 1
                                            // }}
                                        />
                                    </Col>
                                </Row>
                                <Row gutter={24} type={type}>
                                    <Col label="司机手机&emsp;&emsp;" colon span={16} text={phone}>
                                        {
                                            reloadDriverPhone ?
                                            null
                                            :
                                            <FormItem>
                                                {
                                                    getFieldDecorator('phone', {
                                                        initialValue: phone,
                                                        rules: [
                                                            {
                                                                validator: validateToCellPhone
                                                            }
                                                        ],
                                                    })(
                                                        <Input 
                                                            //defaultValue={phone ? phone : ''}
                                                            placeholder="" 
                                                            value={phone}
                                                            onChange={e => {
                                                                this.setState({phone: e.target.value})
                                                            }}
                                                            style={{float: 'right'}} 
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        }
                                    </Col>
                                </Row>
                            </div>
                        </Fragment>
                    </Form>
                </div>
            </Modal>
        )
    }
}
 
export default Form.create()(AddOrEdit);