import React, { Component, Fragment } from 'react'
import ModalWraper from '@src/components/modular_window'
import { Button, Form, Input, InputNumber, message, Icon, DatePicker, Radio, Popover } from 'antd'
import RemoteSelect from '@src/components/select_databook'
import { SelectAddressNew, CascaderAddress } from '@src/components/select_address'
//import { SelectAddressNew } from '@src/components/select_address'
import MultiUploader from '@src/components/uploader_multi'
import FormItem from '@src/components/FormItem'
import { cloneObject, imgClient } from '@src/utils'
import { Row, Col } from '@src/components/grid'
import moment from 'moment'
import TimePicker from '@src/components/time_picker'
import locale from 'moment/locale/zh-cn'
import { inject } from "mobx-react"
import { addressFormat, validateToNextPhone, validateToCellPhoneAndNoNull, stringToArray } from '@src/utils'
import './addoredit.less'

const RadioGroup = Radio.Group
const { RangePicker } = DatePicker
const sexWrap = [
    {
        1: "男"
    },
    {
        2: "女"
    }
]

const PopoverContent = (props) => {
    let { carsdata } = props
    return(
        <div style={{width: 210}}>
            {
                (carsdata && carsdata.length > 0) ? carsdata.map(item => {
                    return(
                        <span key={item.id} style={{display: 'inline-block', width: 70, fontSize: '12px', color: '#18B583'}}>{item.title}</span>
                    )
                }) : '暂无数据!'
            }
        </div>
    )
}
@inject('rApi')
class AddOrEdit extends Component {

    state={
        open: false,
        edit: false,
        loading: false,
        openType: null,
        previewVisible1: false,
        previewImage1: '',
        previewVisible2: false,
        previewImage2: '',
        driverFileList: [],
        driverBackFileList: [],
        idCardFileList: [],
        idCardBackFileList: [],
        drivingLicenceImage1: null, // 驾驶证照片1
        drivingLicenceImage2: null, // 驾驶证照片2
        idCardImage1:null,// 身份证照片1
        idCardImage2:null,// 身份证照片2
        itemid:0,//id
        address: null, // 地址
        addCars: null, // 添加车辆
        addcarsdata: [], //车辆数据
        carrierdata: [], //承运商数据
        paycarrierdata: [], //付款承运商数据
        addressdata:{}, // 地址信息
        areaName: null, //所属片区名
        attachcarrierid: 0, // 所属承运商id
        carrierName: null,//承运商名
        paycarrierName: null,//付款承运商名
        // associatecarrier:[], // 关联承运商数据
        birthplace: '', //户籍
        birthday: null, // 出生日期
        carriers: [], // 车辆
        carsdata: [], // 获取list车辆数据
        driverLicenseNumber: null, //驾驶证id
        drivingExperience:0, // 驾龄
        startEffectiveDate: 0,// 有效期开始日期
        endEffectiveDate: 0, // 有效期结束日期
        idNumber:null, // 身份证号码
        jurisdictionId: 0, // 管辖所属id
        jurisdictionName: null, // 管辖所属名
        name: null, //姓名
        paymentCarrierId:0,//付款承运商
        phone:null, // 联系方式
        phoneBackup: null, // 备用电话
        remark:null, //备注
        sex:1, // 性别(0男1女)
        sexdata: [], //性别数据
        type:0, //司机类型（0现金车司机，1承运商司机）
        authenticationstatusid:null, //认证id(0未认证)
        authenticationStatusName:null, //认证名
        historyData: null, // 传入数据
        buttonLoading: false,
        carsVul: [] //添加车辆数据只做显示用
    }
    constructor(props) {
        super(props);
        if (props.getThis) {
            props.getThis(this)
        }
    }
    componentDidMount () {
        this.setState({sexdata: sexWrap.map((d,index) => {
            let obj = {}
            for (let key in d) {
                obj.id = key
                obj.title = d[key]
            }
            return obj
        })})
        this.props.rApi.getDriver().then((res) => {
            // this.setState({addcarsdata: res.carList.map((d,index) => {
            //     let obj = {
            //         id: d.id,
            //         title: d.carCode
            //     }
            //     return obj
            // })})
            this.setState({carrierdata: res.carrierCashCarList ? res.carrierCashCarList.map((d,index) => {
                let obj = {id: parseInt(d.id), title: d.name} // 现金车司机
                return obj
            }) : null})
            this.setState({paycarrierdata: res.carrierDriverCarList ? res.carrierDriverCarList.map((d,index) => {
                let obj = {id: parseInt(d.id), title: d.name, cname: d.cname, fid: d.fid, name: d.name} // 承运商司机
                return obj
            }) : null})
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
        //console.log('d.data', d.data)
        let historyData = typeof d.data === 'object' ? cloneObject(d.data) : null
        let driverUrl = []
        let driverBackUrl = []
        let idCardUrl = []
        let idCardBackUrl = []
        if(d.data && d.data.idCardImageFront) {
            idCardUrl.push({
                uid: 5,
                name: 'idNumber.png',
                status: 'done',
                thumbUrl: imgClient().signatureUrl(d.data.idCardImageFront),
                url: imgClient().signatureUrl(d.data.idCardImageFront)
            })
        }
        if (d.data && d.data.idCardImageBack) {
            idCardBackUrl.push({
                uid: 6,
                name: 'idNumber.png',
                status: 'done',
                thumbUrl: imgClient().signatureUrl(d.data.idCardImageBack),
                url: imgClient().signatureUrl(d.data.idCardImageBack)
            })
        }
        if (d.data && d.data.drivingLicenceImageFront) {
            driverUrl.push({
                uid: 7,
                name: 'drivingLicenceImage.png',
                status: 'done',
                thumbUrl: imgClient().signatureUrl(d.data.drivingLicenceImageFront),
                url: imgClient().signatureUrl(d.data.drivingLicenceImageFront)
            })
        }
        if (d.data && d.data.drivingLicenceImageBack) {
            driverBackUrl.push({
                uid: 8,
                name: 'drivingLicenceImage.png',
                status: 'done',
                thumbUrl: imgClient().signatureUrl(d.data.drivingLicenceImageBack),
                url: imgClient().signatureUrl(d.data.drivingLicenceImageBack)
            })
        }
        if (d.edit) {
            let array = this.state.paycarrierdata.filter(ele => {
                return d.data.attachCarrierId === ele.id
            })
            this.setState({paycarrierName: {id: array[0] ? array[0].id : '', title: array[0] ? array[0].cname : ''}})
            d.data = Object.assign({}, d.data, {
                areaName: d.data.areaName,
                openType: 1,
                title:'编辑司机',
                itemid: d.data.id,
                name: d.data.name,
                sex: d.data.sex ? d.data.sex : 1,
                birthday: d.data.birthday,
                birthplace: d.data.birthPlace,
                idNumber: d.data.idNumber,
                phone: d.data.phone,
                phoneBackup: d.data.phoneBackup,
                addressdata: (d.data.address && typeof(d.data.address) === 'string') ? JSON.parse(d.data.address) : d.data.address ? d.data.address : {},
                driverLicenseNumber: d.data.driverLicenseNumber,
                startEffectiveDate: d.data.startEffectiveDate,
                endEffectiveDate: d.data.endEffectiveDate,
                drivingExperience: d.data.drivingExperience,
                type: d.data.type,
                carsdata: d.data.cars,
                remark: d.data.remark,
                idCardImage1: d.data.idCardImageFront,
                idCardImage2: d.data.idCardImageBack,
                drivingLicenceImage1: d.data.drivingLicenceImageFront,
                drivingLicenceImage2: d.data.drivingLicenceImageBack,
                driverFileList: driverUrl,
                driverBackFileList: driverBackUrl,
                idCardFileList: idCardUrl,
                idCardBackFileList: idCardBackUrl,
                carrierName: d.data.carrierName,
                attachcarrierid: d.data.attachCarrierId,
                authenticationstatusid: d.data.authenticationStatus,
                authenticationStatusName: d.data.authenticationStatusName,
                carriers: d.data.cars ? d.data.cars.filter(item => item && item.id).map((item) => {
                    return item.id
                }) : []
            })
        } else if (d.data) {
            let arr = this.state.paycarrierdata.filter(ele => {
                return d.data.attachCarrierId === ele.id
            })
            this.setState({paycarrierName: {id: arr[0] ? arr[0].id : '', title: arr[0] ? arr[0].cname : ''}})
            d.data = Object.assign({}, d.data, {
                openType : 2,
                title: '查看司机',
                areaName: d.data.areaName,
                name: d.data.name,
                sex: d.data.sex ? d.data.sex : 1,
                birthday: d.data.birthday,
                birthplace: d.data.birthPlace,
                idNumber: d.data.idNumber,
                phone: d.data.phone,
                phoneBackup: d.data.phoneBackup,
                addressdata: (d.data.address && typeof(d.data.address) === 'string') ? JSON.parse(d.data.address) : d.data.address ? d.data.address : {},
                driverLicenseNumber: d.data.driverLicenseNumber,
                startEffectiveDate: d.data.startEffectiveDate,
                endEffectiveDate: d.data.endEffectiveDate,
                drivingExperience: d.data.drivingExperience,
                type: d.data.type,
                carsdata: d.data.cars,
                remark: d.data.remark,
                idCardImage1: d.data.idCardImageFront,
                idCardImage2: d.data.idCardImageBack,
                drivingLicenceImage1: d.data.drivingLicenceImageFront,
                drivingLicenceImage2: d.data.drivingLicenceImageBack,
                driverFileList: driverUrl,
                driverBackFileList: driverBackUrl,
                idCardFileList: idCardUrl,
                idCardBackFileList: idCardBackUrl,
                authenticationstatusid: d.data.authenticationStatus,
                authenticationStatusName: d.data.authenticationStatusName,
                carrierName: d.data.carrierName,
                attachcarrierid: d.data.attachCarrierId,
            })
        } else {
            this.setState({openType: 3,title:'新建司机'})
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
            previewVisible1: false,
            previewImage1: '',
            previewVisible2: false,
            previewImage2: '',
            itemid:0,//id
            address: null, // 地址
            addCars: null, // 添加车辆
            addressdata:{}, // 地址信息
            areaName: null, //所属片区名
            attachcarrierid: 0, // 所属承运商id
            carrierName: null,//承运商名
            paycarrierName: null,//付款承运商名
            birthplace: '', //户籍
            birthday: null, // 出生日期
            carriers: [], // 车辆
            driverLicenseNumber: null, //驾驶证id
            drivingExperience:0, // 驾龄
            drivingLicenceImage1: null, // 驾驶证照片1
            drivingLicenceImage2: null, // 驾驶证照片2
            startEffectiveDate: 0,// 有效期开始日期
            endEffectiveDate: 0, // 有效期结束日期
            idCardImage1:null,// 身份证照片1
            idCardImage2:null,// 身份证照片2
            idNumber:null, // 身份证号码
            jurisdictionId: 0, // 管辖所属id
            jurisdictionName: null, // 管辖所属名
            name: null, //姓名
            paymentCarrierId:0,//付款承运商
            phone:null, // 联系方式
            phoneBackup: null, // 备用电话
            remark:null, //备注
            sex:1, // 性别(0男1女)
            type:0, //司机类型（0现金车司机，1承运商司机）
            authenticationstatusid:null, //认证id(0未认证)
            authenticationStatusName:null, //认证名
            carsdata: [], // 获取list车辆数据
            buttonLoading: false,
            carsVul: [],
            driverFileList: [],
            driverBackFileList: [],
            idCardFileList: [],
            idCardBackFileList: [],
        })
    }

    onSubmit = () => {
        alert('xxx')
    }

    saveSubmit = () => {
        let { rApi } = this.props
        let { 
            itemid,
            address,
            addCars,
            addressdata,
            areaName,
            attachcarrierid,
            birthplace,
            birthday,
            carriers,
            driverLicenseNumber,
            drivingExperience,
            drivingLicenceImage1,
            drivingLicenceImage2,
            startEffectiveDate,
            endEffectiveDate,
            idCardImage1,
            idCardImage2,
            idNumber,
            jurisdictionId,
            jurisdictionName,
            name,
            paymentCarrierId,
            phone,
            phoneBackup,
            remark,
            sex,
            type,
            carsVul,
            authenticationstatusid,
            authenticationStatusName
         } = this.state

        if(this.state.openType === 1) {
            //console.log('编辑')
            let  addre = this.selectAddress.getValue()
            // if (name && idNumber && phone && driverLicenseNumber) {
                this.setState({
                    buttonLoading: true
                })
                rApi.editDriver({
                    id: itemid,
                    address: this.selectAddress.getValue(),
                    areaName: areaName,
                    attachCarrierId: attachcarrierid,
                    birthPlace: birthplace,
                    birthday: birthday,
                    carIds: carriers,
                    driverLicenseNumber: driverLicenseNumber,
                    drivingExperience: drivingExperience,
                    drivingLicenceImageBack: drivingLicenceImage2,
                    drivingLicenceImageFront: drivingLicenceImage1,
                    endEffectiveDate: endEffectiveDate,
                    idCardImageBack: idCardImage2,
                    idCardImageFront: idCardImage1,
                    idNumber: idNumber,
                    jurisdictionId: jurisdictionId,
                    jurisdictionName: jurisdictionName,
                    name: name,
                    paymentCarrierId: paymentCarrierId,
                    phone: phone,
                    phoneBackup: phoneBackup,
                    remark: remark,
                    sex: sex ? sex : 1,
                    startEffectiveDate: startEffectiveDate,
                    type: type
            }).then(d => {
                message.success('操作成功!')
                this.changeOpen(false)
                this.setState({
                    buttonLoading: false
                }, () => {
                    this.updateThisDataToTable({
                        id: itemid,
                        address: this.selectAddress.getValue(),
                        areaName: areaName,
                        attachCarrierId: attachcarrierid,
                        birthPlace: birthplace,
                        birthday: birthday,
                        carIds: carriers,
                        driverLicenseNumber: driverLicenseNumber,
                        drivingExperience: drivingExperience,
                        drivingLicenceImageBack: drivingLicenceImage2,
                        drivingLicenceImageFront: drivingLicenceImage1,
                        endEffectiveDate: endEffectiveDate,
                        idCardImageBack: idCardImage2,
                        idCardImageFront: idCardImage1,
                        idNumber: idNumber,
                        jurisdictionId: jurisdictionId,
                        jurisdictionName: jurisdictionName,
                        name: name,
                        paymentCarrierId: paymentCarrierId,
                        phone: phone,
                        phoneBackup: phoneBackup,
                        remark: remark,
                        sex: sex ? sex : 1,
                        startEffectiveDate: startEffectiveDate,
                        type: type,
                        cars: carsVul,
                        authenticationStatus: this.state.authenticationstatusid,
                        authenticationStatusName: this.state.authenticationStatusName
                    })
                })
               // this.actionDone()
            }).catch(e => {
                message.error(e.msg || '操作失败！')
                this.setState({
                    buttonLoading: false
                })
            })
            // } else{
            //     message.error('红色框不能为空')
            // }
        } else if(this.state.openType === 2) {
            this.changeOpen(false)
        } else if(this.state.openType === 3) {
            let  addre = this.selectAddress.getValue()
            // if(name && idNumber && phone && driverLicenseNumber) {
                this.setState({
                    buttonLoading: true
                })
                rApi.addDriver({
                    address: this.selectAddress.getValue(),
                    areaName: areaName,
                    attachCarrierId: attachcarrierid,
                    birthPlace: birthplace,
                    birthday: birthday,
                    carIds: carriers,
                    driverLicenseNumber: driverLicenseNumber,
                    drivingExperience: drivingExperience,
                    drivingLicenceImageBack:drivingLicenceImage2,
                    drivingLicenceImageFront: drivingLicenceImage1,
                    endEffectiveDate: endEffectiveDate,
                    idCardImageBack: idCardImage2,
                    idCardImageFront: idCardImage1,
                    idNumber: idNumber,
                    jurisdictionId: jurisdictionId,
                    jurisdictionName: jurisdictionName,
                    name: name,
                    paymentCarrierId: paymentCarrierId,
                    phone: phone,
                    phoneBackup: phoneBackup,
                    remark: remark,
                    sex: sex,
                    startEffectiveDate: startEffectiveDate,
                    type: type
            }).then(d => {
                this.setState({
                    buttonLoading: false
                })
                this.actionDone()
                // console.log('新建数据保存', this.state)
            }).catch(e => {
                message.error(e.msg || '操作失败！')
                this.setState({
                    buttonLoading: false
                })
            })
            // } else{
            //     message.error('红色框不能为空')
            // }
        }
    }

    authSubmit = () => { //认证
        let { itemid } = this.state
        this.props.rApi.authDriver({
            id: itemid
        }).then(d => {
            message.success('操作成功!')
            this.setState({
                authenticationstatusid: 1,
                authenticationStatusName: '已认证'
            }, () => {
                this.updateThisDataToTable({
                    authenticationStatus: 1,
                    authenticationStatusName: '已认证'
                })
            })
        }).catch(e => {
            message.error(e.msg || '操作失败！')
        })
    }

    cancelAuthSubmit = () => { //取消认证
        let { itemid } = this.state
        this.props.rApi.cancelAuthDriver({
            id: itemid
        }).then(d => {
            message.success('操作成功!')
            this.setState({
                authenticationstatusid: 0,
                authenticationStatusName: '未认证'
            }, () => {
                this.updateThisDataToTable({
                    authenticationStatus: 0,
                    authenticationStatusName: '未认证'
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
        let { historyData } = this.state
        const { parent } = this.props
        if (!historyData) return
        if (parent && parent.tableView)
        parent.tableView.updateData(Object.assign({}, historyData, d))
    }
    

    changedemo = (time) => {
        console.log('time',moment(time).format('YYYY-MM-DD h:mm:ss'))
    }
    idCardFontHandleChangeUpload = (value) => { //身份证正面照
        this.setState({
            idCardImage1: value[0] ? value[0].imgurl : ''
        })
    }

    idCardBackHandleChangeUpload = (value) => { //身份证反面照
        this.setState({
            idCardImage2: value[0] ? value[0].imgurl : ''
        })
    }

    drivingFontHandleChangeUpload = (value) => { //驾驶证正面照
        this.setState({
            drivingLicenceImage1: value[0] ? value[0].imgurl : ''
        })
    }

    drivingBackHandleChangeUpload = (value) => { //驾驶证反面照
        this.setState({
            drivingLicenceImage2: value[0] ? value[0].imgurl : ''
        })
    }

    handleChangeAddress = (value,selectedOptions) => { 
        //console.log('handleChangeAddress', value, this.arrayVulToStringVul(value))
        this.setState({
            birthplace: this.arrayVulToStringVul(value)
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
    radioChange = (e) => {
        this.setState({
            type: e.target.value,
        });
      }
    handleChangeSelect = (value) => {  // 添加车辆
        // console.log('handleChangeSelect', value)
        this.setState({
            carriers : value.map((item) => {
                return item.id
            }),
            carsVul: value
    })
        
    }
    findObj = (data, id) => {
        let array = data.filter(ele => {
            return id === ele.id
        })
        return array[0]
    }

    attachChange = (value) => {

        let array = this.state.paycarrierdata.filter(ele => {
            // if (!ele) return false
            return ele && value && value.id === ele.id
        })
        if (array.length < 1) return
        let va = {id: array[0].id, title: array[0].cname}
        this.setState({attachcarrierid: value.id, paycarrierName: {id: array[0].id, title: array[0].cname}})
    }
    getBirthplace = (val) => {
        try {
            return (val && typeof(val) !== 'object' ? JSON.parse(val).join('/') : val)
        } catch (e) {

        }
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

    stringVulToArrayVul = (d) => { //字符串转数组
        if(d) {
            return d.split('/')
        }
        return null
    }

    arrayVulToStringVul = (d) => { //数组转字符串
        if(d) {
            return d.join('/')
        } return null
    }

    render() { 
        const { edit } = this.props
        const { getFieldDecorator, setFieldsValue } = this.props.form
        let { 
            openType,
            previewVisible1,
            previewImage1,
            previewVisible2,
            previewImage2,
            title,
            address,
            addCars,
            addcarsdata,
            addressdata,
            areaName,
            birthplace,
            birthday,
            carriers,
            carrierdata,
            paycarrierdata,
            carsdata,
            driverLicenseNumber,
            drivingExperience,
            drivingLicenceImage,
            startEffectiveDate,
            endEffectiveDate,
            idCardImage,
            idNumber,
            jurisdictionId,
            jurisdictionName,
            name,
            paymentCarrierId,
            phone,
            phoneBackup,
            remark,
            sex,
            sexdata,
            type,
            attachcarrierid,
            authenticationstatusid,
            authenticationStatusName,
            carrierName,
            paycarrierName,
            buttonLoading,
            driverFileList,
            driverBackFileList,
            idCardFileList,
            idCardBackFileList
        } = this.state
            //console.log('authenticationstatusid', authenticationstatusid, authenticationStatusName)
        return (
            <ModalWraper
                onSubmit={this.onSubmit}
                style={{width: '100%', maxWidth: 850}}
                changeOpen={this.changeOpen} 
                open={this.state.open} 
                title={title} 
                getContentDom={v => this.popupContainer = v}
                >
                <div className="driver-wrapper" style={{minHeight: 446}}>
                    <Form layout='inline' onSubmit={this.handleSubmit}>
                        <ModalWraper.Header title={
                            openType === 3 ?
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
                            (openType === 1 && !authenticationstatusid) || (openType === 1 && authenticationstatusid === 0) ?
                            <Button 
                                //icon='solution' 
                                onClick={this.authSubmit} 
                                style={{ marginRight: '10px', borderRadius: 0}}
                            >
                                认证
                            </Button>
                            :
                            (openType === 1 && authenticationstatusid === 1) ?
                            <Button 
                                //icon='solution' 
                                onClick={this.cancelAuthSubmit} 
                                style={{ marginRight: '10px', borderRadius: 0}}
                            >
                                取消
                            </Button>
                            :
                            null
                            }
                            {
                                openType === 1 || openType === 3 ? 
                                <FormItem>
                                    <Button 
                                        //icon='save' 
                                        htmlType="submit" 
                                        loading={buttonLoading}
                                        style={{ marginRight: 0, border: 0, borderRadius: 0, color: authenticationstatusid === 1 ? 'rgba(0, 0, 0, 0.25)' : '#fff', background: authenticationstatusid === 1 ? '#f5f5f5' : '#18B583'}}
                                        disabled={authenticationstatusid === 1 ? true : false}
                                    >
                                        保存
                                    </Button>
                                </FormItem>
                                :
                                null
                            }
                        </ModalWraper.Header>
                        <div style={{padding: '0 20px'}}>
                            <div className="base-text">基本信息</div>
                            <div className="flex">
                                <div style={{width: 400}}>
                                    <Row gutter={24} type={openType}>
                                        <Col label="姓名&emsp;&emsp;&emsp;&emsp;" colon span={17} isRequired text={name}>
                                            <FormItem>
                                            {
                                                getFieldDecorator('name', {
                                                    initialValue: name,
                                                    rules: [
                                                        { 
                                                            required: true, 
                                                            message: '请填写姓名'
                                                        }
                                                    ],
                                                })(
                                                    <Input 
                                                        placeholder="" 
                                                        onChange={e => {
                                                            this.setState({name: e.target.value})
                                                    }}
                                                    />
                                                )
                                            }
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={24} type={openType}>
                                        <Col label="性别&emsp;&emsp;&emsp;&emsp;" colon span={20} text={sex === 1 ? '男' : '女'}>
                                            <RadioGroup 
                                                onChange={(e) => {
                                                    this.setState({
                                                        sex: e.target.value
                                                    })
                                                }} 
                                                value={sex ? sex : 1}
                                                defaultValue={sex ? sex : 1}
                                                >
                                                <Radio value={1}>男</Radio>
                                                <Radio value={2}>女</Radio>
                                            </RadioGroup>
                                        </Col>
                                    </Row>
                                    <Row gutter={24} type={openType}>
                                        <Col label="出生日期&emsp;&emsp;" colon span={17} text={birthday ? moment(birthday).format('YYYY-MM-DD') : ''}>
                                            <DatePicker
                                                defaultValue={birthday ? moment(birthday) : null}
                                                getCalendarContainer={() => this.popupContainer || document.body}
                                                style={{width: '100%'}}
                                                format="YYYY-MM-DD"
                                                onChange={
                                                    date => {
                                                        this.setState({birthday: date ? moment(date).format('YYYY-MM-DD') : ''})
                                                    }} 
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={24} type={openType}>
                                        <Col label="户籍&emsp;&emsp;&emsp;&emsp;" colon span={17} text={birthplace}>
                                            <CascaderAddress
                                                defaultValue={birthplace ? this.stringVulToArrayVul(birthplace) : []}
                                                getPopupContainer={() => this.popupContainer || document.body}
                                                title={birthplace}
                                                placeholder='' 
                                                handleChangeAddress={this.handleChangeAddress}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                <div className="flex1">
                                    <div className="flex uploader-driver-img-wrraper" style={{marginBottom:'10px'}}>
                                        <MultiUploader
                                            previewVisible={previewVisible1}
                                            previewImage={previewImage1}
                                            fileList={idCardFileList}
                                            handleChangeUpload={this.idCardFontHandleChangeUpload}
                                            type={openType}
                                            title=""
                                            text="上传身份证正面照!"
                                        />
                                         <MultiUploader
                                            previewVisible={previewVisible1}
                                            previewImage={previewImage1}
                                            fileList={idCardBackFileList}
                                            handleChangeUpload={this.idCardBackHandleChangeUpload}
                                            type={openType}
                                            title=""
                                            text="上传身份证反面照!"
                                        />
                                        {/* {
                                            openType === 1 || openType === 3 ?
                                            <div style={{textAlign: 'center', color:'#ccc'}}>
                                                上传身份证正反面照！
                                            </div>
                                            :
                                            null

                                        } */}
                                        {/* <div className="check-driver-wrraper">
                                            <span className="already-check">{authenticationStatusName ? authenticationStatusName : '未认证'}</span>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                            <div style={{width: 618, paddingBottom: 10}}>
                                <Row gutter={24} type={openType}>
                                    <Col label="身份证号&emsp;&emsp;" colon span={11} isRequired text={idNumber}>
                                        <FormItem>
                                            {
                                                getFieldDecorator('idNumber', {
                                                    initialValue: idNumber,
                                                    rules: [
                                                        { 
                                                            required: true, 
                                                            message: '请填写身份证号'
                                                        },
                                                        {
                                                            pattern: new RegExp("^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$"),
                                                            message: '请输入正确的身份证号',
                                                        }
                                                    ],
                                                })(
                                                    <Input
                                                        title={idNumber} 
                                                        placeholder="" 
                                                        onChange={e => {
                                                            this.setState({idNumber: e.target.value})
                                                        }}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={24} type={openType}>
                                    <Col label="手机号&emsp;&emsp;&emsp;" colon span={11} isRequired text={phone}>
                                        <FormItem>
                                                {
                                                    getFieldDecorator('phone', {
                                                        initialValue: phone,
                                                        rules: [
                                                            {
                                                                validator: validateToCellPhoneAndNoNull
                                                            }
                                                        ],
                                                    })(
                                                        <Input 
                                                            placeholder="" 
                                                            onChange={e => {
                                                                this.setState({phone: e.target.value})
                                                            }} 
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={24} type={openType} >
                                    <Col label="备用电话&emsp;&emsp;" colon span={11} text={phoneBackup}>
                                        <FormItem>
                                            {
                                                getFieldDecorator('phoneBackup', {
                                                    initialValue: phoneBackup,
                                                    rules: [
                                                        {
                                                            validator: validateToNextPhone
                                                        }
                                                    ],
                                                })(
                                                    <Input 
                                                        placeholder="" 
                                                        onChange={e => {
                                                            this.setState({phoneBackup: e.target.value})
                                                        }}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={24} type={openType} >
                                    <Col span={24} label="现居地址&emsp;&emsp;" colon text={addressdata ? addressFormat(addressdata) : ''}>
                                        <SelectAddressNew 
                                            onChageProvince={this.onChageProvince}
                                            getPopupContainer={() => this.popupContainer || document.body}
                                            address={addressdata ? addressdata : {}}
                                            getThis={this.getSelectAddress} 
                                            //defaultValue={addressdata}
                                            />
                                    </Col>
                                </Row>
                                <Row gutter={24} type={openType} >
                                    <Col label="所属片区&emsp;&emsp;" colon span={11} text={
                                        areaName ? areaName : '无'
                                    } >
                                        <Input 
                                            disabled 
                                            title={areaName ? areaName : '无'}
                                            placeholder="自动识别"
                                            value={areaName ? areaName : null} 
                                        />
                                    </Col> 
                                </Row>
                            </div>
                            <div className="base-title-top">驾驶证信息</div>
                            <div className="flex" style={{paddingBottom: 8}}>
                                <div style={{width: 400}}>
                                    <Row gutter={16} style={{marginTop:'0'}} type={openType} >
                                        <Col label="驾驶证号&emsp;&emsp;" colon span={17} isRequired text={driverLicenseNumber ? driverLicenseNumber : ''}>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('driverLicenseNumber', {
                                                        initialValue: driverLicenseNumber,
                                                        rules: [
                                                            {
                                                                required: true, 
                                                                message: '请填写驾驶证号'
                                                            },
                                                            {
                                                                pattern: new RegExp("^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$"),
                                                                message: '请输入正确的驾驶证号'
                                                            }
                                                        ],
                                                    })(
                                                        <Input 
                                                            title={driverLicenseNumber}
                                                            placeholder="" 
                                                            onChange={e => {
                                                                this.setState({driverLicenseNumber: e.target.value})
                                                            }} 
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={24} style={{marginTop:'0'}} type={openType} >
                                        <Col label="有效日期&emsp;&emsp;" colon span={24} 
                                            text={(startEffectiveDate && endEffectiveDate) ? `${moment(startEffectiveDate).format('YYYY-MM-DD')} 至 ${moment(endEffectiveDate).format('YYYY-MM-DD')}` : '无'}>
                                            {/* <RangePicker
                                                defaultValue={startEffectiveDate && endEffectiveDate ? [moment(startEffectiveDate ), moment(endEffectiveDate)] : null}
                                                // showTime
                                                format="YYYY-MM-DD"
                                                onChange={
                                                    (data, dateString) => {
                                                        this.setState({
                                                            startEffectiveDate: dateString ? dateString[0] : null,
                                                            endEffectiveDate: dateString ? dateString[1] : null
                                                        })
                                                    }
                                                }
                                            /> */}
                                            <TimePicker
                                                getPopupContainer={() => this.popupContainer || document.body}
                                                startTime={startEffectiveDate}
                                                endTime={endEffectiveDate}
                                                changeStartTime={(date, dateStr) => {
                                                    this.setState({
                                                        startEffectiveDate: dateStr
                                                    })
                                                }}
                                                changeEndTime={(date, dateStr) => {
                                                    this.setState({
                                                        endEffectiveDate: dateStr
                                                    })
                                                }}
                                                getFieldDecorator={getFieldDecorator}
                                               // isRequired
                                                pickerWidth={{width: 120}}
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={24} style={{marginTop:'0'}} type={openType} >
                                        <Col label="驾龄&emsp;&emsp;&emsp;&emsp;" colon span={17} text={drivingExperience} >
                                            <InputNumber 
                                                defaultValue={drivingExperience ? drivingExperience : ''}
                                                min={0}
                                                placeholder="" 
                                                onChange={value => {
                                                    this.setState({drivingExperience: value})
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                <div className="flex1">
                                    <div className="flex uploader-driver-img-wrraper">
                                        <MultiUploader
                                            previewVisible={previewVisible2}
                                            previewImage={previewImage2}
                                            fileList={driverFileList}
                                            handleChangeUpload={this.drivingFontHandleChangeUpload}
                                            type={openType}
                                            title=""
                                            text="上传驾驶证正面照!"
                                        />
                                        <MultiUploader
                                            previewVisible={previewVisible2}
                                            previewImage={previewImage2}
                                            fileList={driverBackFileList}
                                            handleChangeUpload={this.drivingBackHandleChangeUpload}
                                            type={openType}
                                            title=""
                                            text="上传驾驶证反面照!"
                                        />
                                        {/* {
                                            openType === 1 || openType === 3 ?
                                            <div style={{textAlign: 'center', color:'#ccc'}}>
                                                上传驾驶证正反面照！
                                            </div>
                                            :
                                            null

                                        } */}
                                    </div>
                                </div>
                            </div>
                            <div className="base-title-top">其他信息</div>
                            <div style={{paddingBottom: 10}}>
                                {
                                    openType === 3 ?
                                    null
                                    :
                                    <Popover placement="topRight" getPopupContainer={() => this.popupContainer || document.body} content={<PopoverContent carsdata={carsdata}/>} trigger="click">
                                        <a>查看有关车辆</a>
                                    </Popover>
                                }
                                <Row gutter={24} type={openType} >
                                    <Col label="司机备注&emsp;&emsp;" colon span={21} text={remark}>
                                        <Input 
                                            defaultValue={remark ? remark : ''}
                                            title={remark}
                                            placeholder="" 
                                            onChange={e => {
                                                this.setState({remark: e.target.value
                                            })
                                        }}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Form>
                </div>
            </ModalWraper>
        )
    }
}
 
export default Form.create()(AddOrEdit);