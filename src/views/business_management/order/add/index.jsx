/** 
 *  new order or edit order entrance
*/
import React, { Component, Fragment } from 'react'
import { Button, Form, message, Popconfirm, DatePicker, Spin, Icon} from 'antd'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import Materiel from './materiel'
import moment from 'moment'
import TransportRoute from '../../public/transport_route'
import { children, id } from './power_hide'
import { Row, Col } from '@src/components/grid'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import Quotation from './quotation'
import { toOrderList } from '@src/views/layout/to_page'
import AddOrEdit from '@src/views/project_management/customer_offer/transport/addoredit'
import ExpenseItem from './expense _config'
import { cloneObject, stringObjectObject } from '@src/utils'
import BasePlate from './base_plate'
import businessModel from '@src/views/business_management/liftingModeId'
import FormItem from '@src/components/FormItem'
import HeaderTitle from './title.jsx'
import ReceiverOrSenderDetails from './details.jsx'
import AddReceiverOrSender from './addoredit'
import './index.less'

const power = Object.assign({}, children, id)

export const expenseItemsToArray = (d) => {
    let {
        text,
        title,
        carType, // 车类型ID
        carTypeName, // 车类型名称
        costUnitId, // 费用单位ID
        costUnitName, // 费用单位名称
        expenseItemId, // 费用项目ID
        expenseItemName, // 费用项目名称
        lowestFee, // 最低收费
        intervalCostUnitName, // 限制区间单位名称
        intervalCostUnitId, // 限制区间单位ID
        endValue, // 限制区间 end
        startValue // 限制区间 start
    } = d
    let array = []
    if (costUnitName) {
        array.push({
            key: 'costUnit',
            costUnitId: costUnitId,
            costUnitName: costUnitName,
            costUnitValue: null
        })
    }
    return array
}

const HeaderView = (props) => {
    return (
        <div className='flex flex-vertical-center' style={{padding: '0 0 10px'}}>
            <div className='flex1'></div>
            <div className="flex flex-vertical-center">
                {
                    props.openType === 2 ?
                    null
                    :
                    <FunctionPower power={power.ADD_PRA}>
                        <Button 
                            // icon='rocket' 
                            loading={props.buttonLoading}
                            className={props.id ? "btn-padding-20" : "btn-padding-30"}
                            style={{ borderRadius: 0, border: 'none', marginRight: '10px', background: ' #18B583', color: '#fff'}}
                            onClick={props.saveSubmit}
                            disabled={(props.status === 2) ? true : false}
                        >
                            提交
                        </Button>
                    </FunctionPower>
                }
                {
                    // props.openType === 1 || props.openType === 3
                    (props.id && (props.openType === 1 || props.openType === 3)) ?
                    <FunctionPower power={power.CONFIRM_DATA}>
                        <FormItem>
                            <Popconfirm
                                placement="topLeft"
                                title="确定确认吗?"
                                onConfirm={props.okSubmit}
                                okText="确定"
                                cancelText="取消">
                                    <Button 
                                        //icon='enter' 
                                        //loading={props.loading}
                                        className="btn-padding-20"
                                        style={{borderRadius: 0, color: ' #666666', marginRight: '10px'}}
                                        //onClick={props.confirmOrderSubmit} 
                                        //disabled={(status === 2 || status === 3) ? true : false}
                                    >
                                        确认
                                    </Button>
                            </Popconfirm>
                        </FormItem>
                    </FunctionPower>
                    :
                    null
                }
            </div>
        </div>
    )
}

export class SelectRecevierOrSend extends Component{
    state = {
        show: false
    }

    constructor(props) {
        super(props)
        let { openType } = props
        if( openType === 2) {
            this.state.show = true
        } else {
            this.state.show = false
        }
    }

    isShow = () => {
        let { show } = this.state
        this.setState({
            show: !show
        })
    }
    render() {
        let { 
            title, //左边显示名
            changeInput, //将值传给父组件
            showSendDetails, //
            sendDetailsList, //onChangeValue
            clientId, //客户id
            addTitle,//新建显示名称
            editTitle, //编辑收发货方
            addressType, // 1-发货方 2-收货方
            liftingModeId, //提送模式
            type, // 1-发货方 2-收货方
            openType,
            keyId,
            detailsLoading,
            reloadSendOrRecrive,
            projectId
        } = this.props
        let { show} = this.state
        const { getFieldDecorator } = this.props.form
        let defVul = sendDetailsList && sendDetailsList.length > 0 ? { id: sendDetailsList[0].bid, cargoPartyName: sendDetailsList[0].name || ''} : {}
        defVul = keyId === 'collect' && sendDetailsList && sendDetailsList.length ? { ...defVul, origin_data: [{ receiveType: sendDetailsList[0].receiveType, address: '{}' }] } : defVul
        // console.log('defVul', defVul)
        return(
            <div className="recevierorsend-wrapper">
                <div className="flex recevierorsend-main">
                    <div className="left-main">
                        <div className="icon" style={{background: addressType === 1 ? '#FFBF00' : '#33A5FF'}}>
                            {addressType === 1 ? '发' : '收'}
                            {
                                addressType === 1 ?
                                <div className="icon-line"></div>
                                :
                                null
                            }
                        </div>
                    </div>
                    <div className="right-main">
                       <div className="rigth-icon"></div>
                        <Row gutter={24}>
                            <Col label={title} colon span={24} isRequired>
                                <div className="flex flex-vertical-center">
                                    {
                                        reloadSendOrRecrive ?
                                        null
                                        :
                                        <div style={{width: 180}}>
                                            <FormItem>
                                                {
                                                    getFieldDecorator(`${keyId}`, {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message: `${keyId === 'send' ? '请选择发货方' : '请选择收货方'}`
                                                            }
                                                        ],
                                                    })(
                                                        <RemoteSelect
                                                            defaultValue={defVul}
                                                            onChangeValue={
                                                                (value={}) => {
                                                                    if (keyId === 'collect') {
                                                                        let id = value && value.id ? value.id : value && value.cusId ? parseInt(value.cusId.split('-')[0], 10) : null
                                                                        value = {
                                                                            ...value,
                                                                            id
                                                                        }
                                                                    }
                                                                    changeInput({
                                                                        senderList: [{
                                                                            bid: value.id || null,
                                                                            name: value.cargoPartyName || '',
                                                                        }]
                                                                    }, () => {
                                                                        let flag = keyId === 'send' || (keyId === 'collect' && value.origin_data && value.origin_data[0].receiveType !== 'warehouse')
                                                                        showSendDetails(value, flag ? 'senderOrReceiver' : 'warehouse')
                                                                    })
                                                                }
                                                            } 
                                                            disabled={openType === 2 ? true : false}
                                                            allowClear={false}
                                                            getDataMethod={(keyId === 'send') ? 'getConsignees' : 'getReciversAndWarehouse'}
                                                            params={Object.assign({limit: 99999, offset: 0, clientId: clientId, addressType: addressType}, (keyId === 'send' ? {} : {projectId: projectId || null}))}
                                                            labelField={'cargoPartyName'}
                                                            keyName={keyId === 'collect' ? 'cusId' : 'id'}
                                                            dealData={arr => {
                                                                let rt = [...arr]
                                                                if (keyId === 'collect') {
                                                                    const rArr = rt[0].receiverOrSenderList.map(item => {
                                                                        item.receiveType = 'receiver'
                                                                        item.cargoPartyName = item.cargoPartyName
                                                                        return item
                                                                    })
                                                                    const wArr = rt[0].warehouseVOList.map(item => {
                                                                        item.receiveType = 'warehouse'
                                                                        item.cargoPartyName = `${item.name}(仓)`
                                                                        return item
                                                                    })
                                                                    rt = [...rArr, ...wArr]
                                                                    rt = rt.map((item, index) => ({
                                                                        ...item,
                                                                        cusId: `${item.id}-${index}`
                                                                    }))
                                                                }
                                                                return rt
                                                            }}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        </div>
                                    }
                                    {/* <div style={{width: 70, marginLeft: '20px'}}>
                                        <a onClick={this.isShow} style={{color: 'rgb(24, 181, 131)'}}>  
                                            <span>
                                                {show ? '收起详情' : '展开详情'}
                                                <Icon type="down" theme="outlined" style={{transition: 'all 0.5s', transform: show ? 'rotate(-180deg)' : ''}}/>
                                            </span>
                                        </a>
                                    </div> */}
                                    {
                                        openType === 2 ?
                                        null
                                        :
                                        <FunctionPower power={
                                                addTitle === "新建发货方" ?
                                                power.ADD_SEND
                                                :
                                                power.ADD_RECIVE
                                            }
                                        >
                                            <div style={{width: 100}}>
                                                <a style={{marginLeft: '20px', color: 'rgb(24, 181, 131)'}} onClick={() => this.props.addReceiverOrSender(addTitle, addressType)}>{addTitle}</a>
                                            </div>
                                        </FunctionPower>
                                    }
                                    {
                                        (defVul && defVul.id && defVul.origin_data && defVul.origin_data[0].receiveType === 'warehouse' || openType === 2) ?
                                        null
                                        :
                                        <FunctionPower power={
                                                editTitle === "编辑发货方" ?
                                                power.EDIT_SEND
                                                :
                                                power.EDIT_RECIVE
                                            }
                                        >
                                            <div style={{width: 100}}>
                                                <a style={{marginLeft: '20px', color: 'rgb(24, 181, 131)'}} onClick={() => this.props.editReceiverOrSender(sendDetailsList, addressType, editTitle)}>{editTitle}</a>
                                            </div>
                                        </FunctionPower>
                                    }
                                    <div className="flex1"></div>
                                </div>
                            </Col>
                        </Row>
                        <div className="flex" style={{width: 700}}>
                            <ReceiverOrSenderDetails
                                keyId={keyId}
                                sendDetailsList={sendDetailsList}
                                loading={detailsLoading} 
                                addressType={addressType}
                            />
                        </div>
                    </div>
                </div>
                {
                    // this.props.receiveData && this.props.receiveData.id && type === 2
                    (this.props.receiveData && this.props.receiveData.id && type === 2) ?
                    <div style={{borderTop: '1px solid #ddd', padding: '5px 0'}}>
                        <Row gutter={24}>
                            <Col label="&emsp;物料信息&emsp;&emsp;" colon labelInTop span={24} isRequired>
                                <div className="flex1 materiel-wrapper" style={{maxWidth: '900px'}}>
                                    <Materiel
                                        clientId={clientId}
                                        liftingModeId={liftingModeId}
                                        receiveData={this.props.receiveData}
                                        onAddMateriel={this.props.onAddMateriel}
                                        onSaveOrEditDataMateriel={this.props.onSaveOrEditDataMateriel}
                                        onDeleteMateriel={this.props.onDeleteMateriel}
                                        onChangeMateriel={this.props.onChangeMateriel}
                                        getThis={view => this.materiel = view}
                                        materielTitle={this.props.materielTitle}
                                        openType={this.props.openType}
                                        selectType={this.props.selectType}
                                        //ref='materiel'
                                        //type={type}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    :
                    null
                }
            </div>
        )
    }
}

/** 
 * receiver and sender config
*/
export class ReceiverAndSenderConfig extends Component {
   
    render() {
        const { 
            clientId,
            removeSenderList,
            changeInput,
            liftingModeId,
            liftingModeName,
            toMateriel,
            getLabelVulTake,
            returnReceivingTimer,
            returnShipperTimer,
            receiverList,
            senderList,
            sendDetailsList,
            receiverDetailsList,
            openType,
            detailsLoading,
            reloadSend,
            reloadRecrive,
            projectId
        } = this.props
        if (!clientId) {
            return null
        }
        return (
            <div className="flex background-white" style={{borderBottom: '10px solid #eee', padding: '10px 0', minHeight: 160, width: '100%'}}>
                <div style={{padding: '0 25px', width: '100%'}}>
                    <HeaderTitle
                        title="收/发货方配置"
                    >
                        <div style={{width: 120}}>
                            <RemoteSelect
                                onChangeValue={
                                    value => {
                                        changeInput({
                                            liftingModeId: value ? value.id : '',
                                            liftingModeName: value ? value.name || value.title : ''
    
                                        }, this.props.changeReceiveShow)
                                    }
                                } 
                                placeholder="提送模式"
                                text="提送模式"
                                allowClear={false}
                                defaultValue={liftingModeId ? {id: liftingModeId, title: liftingModeName} : {id: businessModel.getOneToOneId(), title: '一提一送'}}
                                labelField={'title'}
                                disabled={true}
                            />
                        </div>
                    </HeaderTitle>
                    <SelectRecevierOrSend
                        title="选择发货方&emsp;&emsp;"
                        keyId={'send'}
                        changeInput={changeInput}
                        showSendDetails={this.props.showSendDetails}
                        sendDetailsList={sendDetailsList}
                        addReceiverOrSender={this.props.addReceiverOrSender}
                        editReceiverOrSender={this.props.editReceiverOrSender}
                        clientId={clientId}
                        addressType={1}
                        addTitle="新建发货方"
                        editTitle="编辑发货方"
                        liftingModeId={liftingModeId}
                        type={1}
                        form={this.props.form}
                        openType={openType}
                        detailsLoading={detailsLoading}
                        reloadSendOrRecrive={reloadSend}
                    />
                    <SelectRecevierOrSend
                        title="选择收货方&emsp;&emsp;"
                        keyId={'collect'}
                        changeInput={changeInput}
                        showSendDetails={this.props.showReciverDetails}
                        sendDetailsList={receiverDetailsList}
                        addReceiverOrSender={this.props.addReceiverOrSender}
                        editReceiverOrSender={this.props.editReceiverOrSender}
                        clientId={clientId}
                        addressType={2}
                        addTitle="新建收货方"
                        editTitle="编辑收货方"
                        liftingModeId={liftingModeId}
                        type={2}
                        openType={openType}
                        receiveData={this.props.receiveData ? this.props.receiveData : receiverDetailsList[0]}
                        onAddMateriel={this.props.onAddMateriel}
                        onSaveOrEditDataMateriel={this.props.onSaveOrEditDataMateriel}
                        onDeleteMateriel={this.props.onDeleteMateriel}
                        onChangeMateriel={this.props.onChangeMateriel}
                        materielTitle={this.props.materielTitle}
                        selectType={this.props.selectType}
                        isCollect
                        form={this.props.form}
                        detailsLoading={detailsLoading}
                        reloadSendOrRecrive={reloadRecrive}
                        projectId={projectId}
                    />
                </div>
            </div>
        )
    }
}

/**
 * 项目管理 -> 新建、编辑 订单
 * 
 * @class CustomerDemand
 * @extends {Component}
 */
@inject('mobxTabsData')
@inject('mobxDataBook')
@inject('rApi')
@observer
class CustomerDemand extends Component {

    state = {
        selectType: '', //
        openType: null, // 3-新建 1-编辑 2-查看
        id: null, // id
        requestDone: true,
        operatorId: 0, // 操作人id
        operatorName: 0, // 操作人名字
        status: null, // 状态 0-驳回 1-保存 2-提交 3-审核通过
        createTime: null, // 创建时间
        loading: false, // 加载中
        moreClientNo: false, // 客户单号更多
        listData: [], // 收发货列表数据
        aging: null, // 时效
        orderNumber: null, // 订单编号
        businessModelId: null, // 业务模式
        businessModelName: null,
        carTypeList: [{}], // 需求车型列表
        clientId: 0, // 客户id
        clientName: null, //客户名称
        clientShortName: null, //客户简称
        customerNumber: null, //客户单号
        customerNumberBackup: null, //客户单号2
        customsAreaId: null,  //关区id
        customsAreaName: null, //关区name
        CustomerAreaData: [], //关区数据
        departure: null, //起运地
        departureTime: null, //发车时间
        arrivalTime: null, //到达时间
        destination: null, // 目的地
        //allExpenseItemList: [], //路线中的所有费用项值
        expenseItemList: [], // 路线中的所有费用项值
        expenseCashPriceList: [], //实报实销费用项
        selectExpenseItemList: [], //选中的费用项
        insuredValue: 0, // 投保货值
        isCustomsClearance: -1, // 委托报关（1-是 -1否）
        isHighway: 0, // 是否高速（1-是 0否）
        isInsurance: -1, // 是否保险（1-是 -1否）
        liftingModeId: 0, // 提送模式id
        liftingModeName: null, // 提送模式名称
        materialList: [], // 物料列表
        projectId: 0, // 项目id
        projectName: null, //项目名称
        receiverList: [], // 收货列表
        senderList: [], // 发货列表
        remark: null, //备注信息
        specialInstruction: null, //特殊说明
        transitPlaceOneId: 0, //中转地1id
        transitPlaceOneName: null, //中转地1 名字
        transitPlaceTwoId: 0, //中转地2id
        transitPlaceTwoName: null, //中转地2 名字
        sendTime: null, //发货时间
        deliveryTime: null, //收货时间
        materielTitle: null, //物料清单（头）
        toMaterieData: {}, //传给物料清单的数据
        receiveData: {}, // 当前选中的收发方
        route: null,
        specialDescription: [], //特殊说明数据
        isHighway: null, //是否高速
        buttonLoading: false,
        sendDetailsList: [], //发货方详情
        receiverDetailsList: [], //收货方详情
        businessModelData: [], //业务模式
        orderForm: 0,
        estimatedCost: 0, //含税金额
        afterTaxAmount: 0, //不含税金额
        detailsLoading: false,
        selectQuotation: {}, // 选中的报价路线
        isSendEdit: null, //1-发货方编辑 2-收货方编辑
        reloadSend: false, //重新渲染发货方
        reloadRecrive: false, //重新渲染收发货方
        orderLegalId: null, //接单法人id
        orderLegalName: null, //接单法人name
        clientLegalId: null, //客户法人id
        clientLegalName: null,
        currencyId: null, //币别
        currencyName: null,
        taxes: 0, //发票税
        withholdingTax: 0, //补扣税
        isTextsIncluded: null, //是否含税
        quotationNumber: null, //报价单号
        expenseUnitRule: [], //报价费用单位对应物料单位规则
    }

    constructor(props) {
        super(props)
        const { mobxTabsData, mykey } = props
        const pageData = cloneObject(mobxTabsData.getPageData(mykey)) || {openType: 3}
        // console.log('pageData', pageData)
        mobxTabsData.setTitle(mykey, pageData && pageData.openType === 1 ? 
            `编辑订单: ${pageData.orderNumber}` 
            :
            pageData && pageData.openType === 2 ?
            `查看订单: ${pageData.orderNumber}` 
            :
            `新建订单`)
        this.state.openType = pageData.openType
        if(pageData.openType === 1 || pageData.openType === 2){
            // this.state.openType = pageData.openType
            this.state.id = pageData.id
            this.state.orderType = pageData.orderType
        } 
        if(pageData.openType === 1 || pageData.openType === 3) {
            this.originThis = pageData.origin
        }
        // if(this.state.customerNumberBackup) {
        //     this.state.moreClientNo = true
        // }
    }

    componentWillReceiveProps(nextProps, prevState) {
        const { mobxTabsData, mykey } = nextProps
        const pageData = mobxTabsData.getPageData(mykey) || {openType: 3}
        // 更新 查看或编辑状态
        if(pageData && (pageData.openType === 1 || pageData.openType === 2) && pageData.openType !== this.state.openType) {
            mobxTabsData.setTitle(mykey, pageData && pageData.openType === 1 ? 
            `编辑订单: ${pageData.orderNumber}` 
            :
            pageData && pageData.openType === 2 ?
            `查看订单: ${pageData.orderNumber}` 
            :
            `新建订单`)
            this.setState({
                openType:  pageData.openType
            })
        }
    }

    componentDidMount(){
        let { rApi } = this.props
        let { senderList, estimatedCost, id, orderType, openType } = this.state
        let item = senderList && senderList.length > 0 ? senderList[0] : []
        this.getSpecialDescription()
        this.getBusinessModelData()
        if(openType !== 3 && id) {
            this.getOneOrderDetails({id, orderType}).then(d => {
                if(!estimatedCost) {
                    this.calculateQuotation()
                }
            })
        }
    }

    getOneOrderDetails = (data) => { //根据id,orderType获取订单信息
        let { rApi } = this.props
        this.setState({
            loading: true
        })
        return new Promise((resolve, reject) => {
            rApi.getOneOrderDetails(data).then(d => {
                if(d) {
                    const { mobxTabsData, mykey } = this.props
                    mobxTabsData.setTitle(mykey, `编辑订单: ${d.orderNumber}`)
                    this.setState({
                        id: d.id,
                        orderType : d.orderType,
                        orderNumber: d.orderNumber,
                        aging: d.aging,
                        businessModelId: d.businessModelId,
                        businessModelName : d.businessModelName,
                        carTypeList : d.carTypeList,
                        clientId: d.clientId,
                        clientName: d.clientName,
                        clientShortName: d.clientShortName,
                        customerNumber: d.customerNumber,
                        customerNumberBackup : d.customerNumberBackup,
                        customsAreaId : d.customsAreaId,
                        customsAreaName : d.customsAreaName,
                        departure : d.departure,
                        departureTime : d.departureTime,
                        arrivalTime : d.arrivalTime,
                        destination : d.destination,
                        allExpenseItemList : d.allExpenseItemList,
                        expenseItemList : d.expenseItemList,
                        selectExpenseItemList : [...d.selectExpenseItemList, ...d.expenseCashPriceList],
                        insuredValue : d.insuredValue,
                        isCustomsClearance : d.isCustomsClearance,
                        isHighway : d.isHighway,
                        isInsurance : d.isInsurance,
                        liftingModeId : d.liftingModeId,
                        liftingModeName : d.liftingModeName,
                        projectId : d.projectId,
                        projectName : d.projectName,
                        receiverList : d.receiverList,
                        receiverDetailsList : d.receiverList,
                        senderList : d.senderList,
                        sendDetailsList : d.senderList,
                        remark : d.remark,
                        specialInstruction : d.specialInstruction,
                        transitPlaceOneId : d.transitPlaceOneId,
                        transitPlaceOneName : d.transitPlaceOneName,
                        transitPlaceTwoId : d.transitPlaceTwoId,
                        transitPlaceTwoName: d.transitPlaceTwoName,
                        sendTime : d.sendTime,
                        deliveryTime : d.deliveryTime,
                        orderForm : d.orderForm,
                        selectQuotation : d.selectQuotation,
                        orderLegalId : d.orderLegalId,
                        orderLegalName : d.orderLegalName,
                        clientLegalId : d.clientLegalId,
                        clientLegalName : d.clientLegalName,
                        currencyId : d.currencyId, //币别
                        currencyName : d.currencyName,
                        taxes : d.taxes ? d.taxes : 0,//税率
                        withholdingTax: d.withholdingTax ? d.withholdingTax : 0,
                        isTextsIncluded: d.isTextsIncluded,
                        quotationNumber : d.quotationNumber,
                        moreClientNo: d.customerNumberBackup ? true : false,
                        estimatedCost: d.estimatedCost, //含税金额
                        afterTaxAmount: d.afterTaxAmount //不含税金额
                    })
                    this.showView()
                    this.getCostRule(d.expenseItemList.map(item => parseInt(item.costUnitId, 10)))
                    resolve(d)
                }
            }).catch(e => {
                //console.log(e)
                this.loadingFalse()
                reject(e)
            })
        })
    }

    getSpecialDescription = () => { // 获取特殊说明数据
        const { mobxDataBook } = this.props
        return new Promise((resolve, reject) => {
            mobxDataBook.initData('订单特殊说明').then(d => {
                this.setState({
                    specialDescription: d && d.length > 0 ? d.map(item => {
                        let obj = {...item, label: item.title, value: item.title}
                        return obj
                    }) : []
                })
                resolve(d)
            }).catch(e => {
                reject(e)
            })
        })
    }

    getBusinessModelData = () => { // 获取业务模式
        const { mobxDataBook } = this.props
        return new Promise((resolve, reject) => {
            mobxDataBook.initData('业务模式').then(d => {
                this.setState({
                    businessModelData: d && d.length > 0 ? d.filter(item => (item.title === '零担' || item.title === '整车' || item.title === '快递' || item.title === '整柜' || item.title === '快运')) : []
                })
                resolve(d)
            }).catch(e => {
                reject(e)
            })
        })
    }

    showView = () => {
        this.setState({
            requestDone: true,
            loading: false
        })
    }

    loadingFalse = () => {
        this.setState({
            roading: false
        })
    }

    reduceCount(list, key) {
        if (list.length < 1) {
            return 0
        }
        return list.reduce(function(pre, cur) {
            let preCount = typeof pre[key] === 'number' ?  pre[key] : typeof pre[key] === 'string' ? Number(pre[key]) : 0
            let curCount = typeof cur[key] === 'number' ? cur[key] : typeof cur[key] === 'string' ? Number(cur[key]) : 0
            return {
                [key]: preCount + curCount
            }
        })[key]
    }

    totalCal = (d) => {
        let liftingModeId = d.liftingModeId
        let receiverList = d.receiverList
        let senderList = d.senderList // 收货列表
        let list = []
        if (businessModel.isOneToOne(liftingModeId)) {
            // 一对一
            list = senderList && senderList.length > 0 && senderList[0].materialList ? senderList[0].materialList : []
        } else if (businessModel.isOneToMany(liftingModeId)) {
            // 一对多
            list = senderList && senderList.length > 0 && senderList[0].materialList ? senderList[0].materialList : []
        } else if (businessModel.isManyToOne(liftingModeId)) {
            // 多对一
            list = receiverList && receiverList.length > 0 && receiverList[0].materialList ? receiverList[0].materialList : []
        } else {
            return d
        }

        d.totalQuantity = this.reduceCount(list, 'quantity')
        d.totalBoardCount = this.reduceCount(list, 'boardCount')
        d.totalBoxCount = this.reduceCount(list, 'boxCount')
        d.totalGrossWeight = this.reduceCount(list, 'grossWeight')
        d.totalNetWeight = this.reduceCount(list, 'netWeight')
        d.totalVolume = this.reduceCount(list, 'volume')
        return d
    }

    // addOrder

    handleData = () => { //处理提交确认的数据
        let {
            orderType,
            aging, //时效
            openType,
            id,
            businessModelId, //业务模式
            businessModelName,
            carTypeList, //需求车型列表
            clientId, //客户id
            clientName, //客户名称
            clientShortName, //客户简称
            customerNumber, //客户单号
            customerNumberBackup, //客户单号2
            customsAreaName, //关区
            customsAreaId,
            departure, //起运地
            departureTime, //发车时间
            arrivalTime, //到达时间
            destination, //目的地
            expenseItemList, //费用项
            expenseCashPriceList, //实报实销费用项
            selectExpenseItemList, //选中的费用项
            insuredValue, //投保货值
            isCustomsClearance, //委托报关（1-是 -1否）
            isHighway, //是否高速（1-是 0否）
            isInsurance, //是否保险（1-是 -1否）
            liftingModeId, //提送模式id
            liftingModeName, //提送模式名称
            //materialList, //物料列表
            projectId, //项目id
            projectName, //项目名称
            receiverList, // 收货列表
            senderList, //发货列表
            remark, //备注信息
            specialInstruction, //特殊说明
            transitPlaceOneId, //中转地1id
            transitPlaceOneName, //中转地1 名字
            transitPlaceTwoId, //中转地2id
            sendTime, //发货时间
            deliveryTime, //收货时间
            receiveData,
            receiverDetailsList,
            sendDetailsList,
            orderForm,
            selectQuotation,
            orderLegalId,
            orderLegalName,
            clientLegalId,
            clientLegalName,
            currencyId,
            currencyName,
            taxes, //发票税
            withholdingTax, //补扣税
            isTextsIncluded,
            quotationNumber,
            estimatedCost,
            afterTaxAmount
        } = this.state
        let rList = receiverDetailsList && receiverDetailsList.length > 0 ? receiverDetailsList.map(item => {
            return {
                ...item,
                materialList: receiveData.materialList
            }
        }) : []

        let sList = sendDetailsList && sendDetailsList.length > 0 ? sendDetailsList.map(item => {
            return {
                ...item,
                materialList: receiveData.materialList
            }
        }) : []
        /**实报实销**/
        let expensePriceData = selectExpenseItemList && selectExpenseItemList.length > 0 ? selectExpenseItemList.filter(d => d.billingMethodName === '实报实销').map(item => {
            return {
                billingMethodId: item.billingMethodId,
                billingMethodName: item.billingMethodName,
                code: item.code,
                costUnitValue: item.costUnitValue ? item.costUnitValue : '',
                id: item.id,
                quotationLineExpenseItemId: item.quotationLineExpenseItemId,
                name: item.name,
                status: item.status,
                typeId: item.typeId,
                typeName: item.typeName,
                currencyId: item.currencyId,
                currencyName: item.currencyName
            }
        }) : []

        /**费用项**/
        let expenseItemData = selectExpenseItemList && selectExpenseItemList.length > 0 ? selectExpenseItemList.filter(d => (d.costUnitName && d.orderExpenseItemUnitCoefficientList)) : []
        // return
        let data = {
            orderType,
            aging, //时效
            businessModelId, //业务模式
            businessModelName,
            carTypeList, //需求车型列表
            clientId, //客户id
            clientName, //客户名称
            clientShortName, //客户简称
            customerNumber, //客户单号
            customerNumberBackup, //客户单号2
            customsAreaId, //关区
            customsAreaName,
            departure, //起运地
            departureTime, //发车时间
            arrivalTime, //到达时间
            destination, //目的地
            expenseCashPriceList: expensePriceData,
            selectExpenseItemList: expenseItemData,
            expenseItemList: expenseItemList, //费用项
            insuredValue, //投保货值
            isCustomsClearance, //委托报关（1-是 -1否）
            isHighway, //是否高速（1-是 0否）
            isInsurance, //是否保险（1-是 -1否）
            liftingModeId, //提送模式id
            liftingModeName, //提送模式名称
            // materialList: materialList, //物料列表
            projectId, //项目id
            projectName, //项目名称
            receiverList: rList,
            senderList: sList, // 收货列表
            remark, //备注信息
            specialInstruction, //特殊说明
            transitPlaceOneId, //中转地1id
            transitPlaceOneName, //中转地1 名字
            transitPlaceTwoId, //中转地2id
            sendTime, //发货时间
            deliveryTime, //收货时间
            orderForm,//是否预订单
            selectQuotation,
            orderLegalId,
            orderLegalName,
            clientLegalId,
            clientLegalName,
            currencyId,
            currencyName,
            taxes, //发票税
            withholdingTax, //补扣税
            isTextsIncluded,
            quotationNumber,
            estimatedCost,
            afterTaxAmount
        }
        return this.totalCal(data)
    }

    addOrderSave = (data, isMsg) => { //新建 => 提交请求
        let { rApi } = this.props
        return new Promise((resolve, reject) => {
            rApi.addOrder(data).then(d => {
                if(isMsg) {
                    message.success('操作成功！')
                }
                this.setState({
                    buttonLoading: false,
                    id: d,
                    orderType: 1
                })
                this.originThis.onChangeValue()
                if(d) {
                    this.getOneOrderDetails({id: d, orderType: 1})
                }
                resolve(d)
                //this.toOrderListPage()
            }).catch(e => {
                if(isMsg) {
                    message.error(e.msg || '操作失败！')
                }
                this.setState({
                    buttonLoading: false
                })
                reject(e)
            })
        })
    }

    editOrderSave = (data, isMsg, isConfirm) => { //编辑 => 提交请求
        let { rApi } = this.props
        let {id, orderType} = this.state
        return new Promise((resolve, reject) => {
            rApi.editOrder(data).then(d => {
                if(isMsg) {
                    message.success('操作成功！')
                }
                this.setState({
                    buttonLoading: false
                })
                if(!isConfirm) {
                    this.originThis.onChangeValue() //刷新list页
                    this.getOneOrderDetails({id, orderType}) //重新获取数据
                }
                resolve(d)
                //this.toOrderListPage()
            }).catch(e => {
                if(isMsg) {
                    message.error(e.msg || '操作失败！')
                }
                this.setState({
                    buttonLoading: false
                })
                reject(e)
            })
        })
    }

    confirmOrderSave = (data) => { //确认请求
        let { rApi } = this.props
        rApi.confirmOrder(data).then(d => {
            message.success('操作成功！')
            this.toOrderListPage()
        }).catch(e => {
            message.error(e.msg || '操作失败！')
        })
    }

    saveSubmit = () => { //提交订单/提交预订单
        let { rApi } = this.props
        let {
            id,
            customerNumber,
            customerNumberBackup
        } = this.state
        if((customerNumber && customerNumberBackup) && (customerNumber === customerNumberBackup)) {
            message.error('客户单号不能重复!')
            return
        }
        let data = this.handleData()
        this.setState({
            buttonLoading: true
        })
        if(id) {
              // console.log('编辑')
            this.editOrderSave({...data, id}, true, false)
        }else {
            // console.log('新建') 
            this.addOrderSave(data, true)
        }
    }

    handleSubmit = (e) => {
        if (e) {
            e.preventDefault()
        }
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.confirmOrderSubmit()
            }
        });
    }

    okSubmit = () => {
        this.handleSubmit()
    }

    confirmOrderSubmit = () => {
        let { rApi } = this.props
        let { 
            orderType,
            id,
            departure, //起运地
            destination, //目的地
            selectExpenseItemList, //选中的费用项
            receiveData,
            orderForm,
            customerNumber,
            customerNumberBackup
        } = this.state
        if(!orderForm || orderForm === 2) {
            if(receiveData && receiveData.materialList.length === 0){
                message.error('物料清单不能为空!')
                return
            } else if(!departure || !destination) {
                message.error('起运地目的地不能为空!')
                return
            } else if(selectExpenseItemList && selectExpenseItemList.length === 0) {
                message.error('费用项不能为空!')
                return
            }
        }
        if((customerNumber && customerNumberBackup) && (customerNumber === customerNumberBackup)) {
            message.error('客户单号不能重复!')
            return
        }
        let data = this.handleData()
        this.editOrderSave({...data, id}, false, true).then(res => {
            this.confirmOrderSave({id, orderType})
        }).catch(e => {
            message.error(e.msg || '操作失败')
        })
    }

    Submit = () => { //提交
        this.setState({
            status: 2
        })
    }

    toOrderListPage = () => { //跳到订单列表页面
        const { mobxTabsData, mykey } = this.props
        toOrderList(mobxTabsData, {
            pageData: {
                reLoad: true,
                refresh: true
            }
        })
        mobxTabsData.closeTab(mykey)
    }

    clientNoUp = () => { //添加客户单号
        let { moreClientNo, customerNumberBackup } = this.state
        this.setState({
            moreClientNo: !moreClientNo
        })
    }

    getLabelVulTo = (value) => { //获取发货方数据
        let { senderList } = this.state
        for(let item of senderList) {
            if(value.id === item.id) {
                message.error('已存在!')
                return
            }
        }
        senderList.push(value)
        this.setState({
            senderList: senderList
        }, () => {
            this.onChangeDeliveryOrSend()
            //console.log('getLabelVulTo', senderList)
        })
        // senderList: senderList && senderList.length > 0 ? senderList.map(d => {
        //     let obj = {receiverOrSenderId: d.id, receiverOrSenderCode: d.code, receiverOrSenderName: d.name}
        // }) : []
    }

    getLabelVulTake = (value) => { //获取收货方数据
        let { receiverList } = this.state
        //console.log('getLabelVulTake',value)
        for(let item of receiverList) {
            if(value.id === item.id) {
                message.error('已存在!')
                return
            }
        }
        receiverList.push(value)
        this.setState({
            receiverList: receiverList
        }, () => {
            this.onChangeDeliveryOrSend()
            //console.log('getLabelVulTake', receiverList)
        })
        // receiverList: receiverList && receiverList.length > 0 ? receiverList.map(d => {
        //     let obj = {receiverOrSenderId: d.id, receiverOrSenderCode: d.code, receiverOrSenderName: d.name}
        // }) : []
    }

    removeSenderList = (item, index) => { //删除发货方数据
        //console.log('')
        this.setState(preState => {
            preState.senderList.splice(index)
            //console.log('preState.senderList', preState.senderList, index)
            return {
                senderList: preState.senderList
            }
        }, () => {
            this.onChangeDeliveryOrSend()
        })
    }

    removeReceivingData = (item, index) => { //删除收货方数据
        this.setState(preState => {
            preState.receiverList.splice(index)
            //console.log('preState.receiverList', preState.receiverList, index)
            return {
                receiverList: preState.receiverList
            }
        }, () => {
            this.onChangeDeliveryOrSend()
        })
    }

    returnShipperTimer = (time) => { //发货时间
        //console.log('returnShipperTimer', time)
        this.setState({
            sendTime: moment(time).format('YYYY-MM-DD h:mm:ss')
        })
    }

    returnReceivingTimer = (time) => { //收货时间
        this.setState({
            deliveryTime: moment(time).format('YYYY-MM-DD h:mm:ss')
        })
    }

    getCarTypeVul = (value) => { //获取需求车型数据
            this.setState({
                carTypeList: value && value.length > 0 ? value.filter(d => d.name).map(item => {
                    let obj = {
                        ...item,
                        carTypeId: item.carTypeId || item.id,
                        carTypeName: item.title || item.name,
                    }
                    return obj
                }) : []
            })
    }

    getCustomerArea = () => { //获取关区数据
        let { projectId } = this.state
        this.props.rApi.getCustoms({
            projectId,
            pageNo: 1, //页号
            pageSize: 999999, //页数
        }).then(d => {
            if(d) {
                this.setState({
                    CustomerAreaData: d
                })
            }
        }).catch()
    }

    /**
     * 同步收发货方物料数据
     * 
     * 
     * @memberOf CustomerDemand
     */
    oneDeliverySync = (type) => {
        let { liftingModeId, senderList, receiverList } = this.state
        // console.log('liftingModeId', liftingModeId)
        if ((businessModel.isOneToOne(liftingModeId)) && type) {
            if (type === 'send') {
                let list = []
                senderList.map(item => {
                    list.push(...item.materialList)
                })
                if (receiverList && receiverList.length > 0) {
                    receiverList[0].materialList = list 
                }
            } else {
                let list = []
                receiverList.map(item => {
                    list.push(...item.materialList)
                })
                if (senderList && senderList.length > 0) {
                    senderList[0].materialList = list 
                }
            }
        } else if (businessModel.isManyToOne(liftingModeId)) {
            // todo 多提一送
            // console.log('多提一送')
            let list = []
            senderList.map(item => {
                list.push(...item.materialList)
            })
            if (receiverList && receiverList.length > 0) {
                receiverList[0].materialList = list 
            }

        } else if (businessModel.isOneToMany(liftingModeId)) {
            // todo 一提多送
            let list = []
            receiverList.map(item => {
                list.push(...item.materialList)
            })
            if (senderList && senderList.length > 0) {
                senderList[0].materialList = list 
            }
        }
    }

    onSaveOrEditDataMateriel= (receiveData, data, type) => { //保存编辑物料清单
        let { toMaterieData } = this.state 
        let { record, index } = data
        // toMaterieData[id].list.unshift(data)
        if (type === 'save') {
            receiveData.materialList[index].isEdit = false
        } else if (type === 'edit') {
            receiveData.materialList[index].isEdit = true
        }
        this.setState({
            receiveData: receiveData
        })
    }

    onAddMateriel = (receiveData, data) => { // 添加物料清单
        if (receiveData && receiveData.materialList) {
            receiveData.materialList.unshift(data)
        } else {
            receiveData.materialList = []
            receiveData.materialList.unshift(data)
        }
        receiveData.materialList = [...receiveData.materialList]
        this.setState({
            receiveData: receiveData
        })
    }

    // 删除物料清单行数据
    onDeleteMateriel = (receiveData, index) => { 
        receiveData.materialList.splice(index, 1)
        this.setState({
            receiveData
        })
    }

    onChangeMateriel = (receiveData, data) => {
        const { value, key, column } = data
        const { liftingModeId, senderList, receiverList } = this.state
        if (key === 'itemName') {
            // console.log('goodsName', value)
            // receiveData.materialList[column]['itemName'] = value
            for (let key1 in value) {
                receiveData.materialList[column][key1] = value[key1]
            }
            //dataSource[column]['goodsId'] = value ? value.id : ''
        } else if(key === 'heavyBubbleName') {
            receiveData.materialList[column]['heavyBubbleName'] = value ? value.title || value.label : ''
            receiveData.materialList[column]['heavyBubbleId'] = value ? value.id : ''
        } else if (typeof value === 'object') {
            for (let key1 in value) {
                receiveData.materialList[column][key1] = value[key1]
            }
        } else {
            // console.log('receiveData.materialList', receiveData.materialList)
            receiveData.materialList[column][key] = value
        }
        if (businessModel.isOneToOne(liftingModeId)) {
            this.oneDeliverySync(receiveData.type)
        }
        this.setState({
            receiveData: receiveData
        })
    }

    onChangeDeliveryOrSend = () => {
        let { receiverList, senderList } = this.state
        receiverList = receiverList.map(item => {
            if (item.areaName && item.receiveType === 'warehouse') {
                try {
                    item.areaName = JSON.parse(item.areaName).map(item => item.title).join(',')
                } catch (err) {
                    item.areaName = item.areaName || '无'
                }
            }
            return {
                ...item,
                materialList: item.materialList || [],
                type: 'collect'
            }
        })
        senderList = senderList.map(item => {
            return {
                ...item,
                materialList: item.materialList || [],
                type: 'send'
            }
        })
        this.setState({
            senderList: senderList,
            receiverList: receiverList
        })
    }

    
    /**
     * 选择一个收发货方
     * @memberOf CustomerDemand
     */
    toMateriel = (item, type) => { //收发货方数据 => 物料清单
        const {receiveData} = this.state
        // console.log('toMateriel', item, type)
        if (receiveData.materialList && receiveData.materialList.some(item => item.isEdit)) {
            message.warning('请先保存物料')
            return
        }
        this.oneDeliverySync()
        this.setState({
            selectType: type,
           // materielTitle: (type === 'send' ? '发货方' : '收货方') + ': ' + `${item.name ? item.name : ''}` + `${item.code ? `-${item.code}` : ''}`, //物料清单（头）
            receiveData: item
        })
    }

    calculateQuotation = () => { //计算预估报价
        let { estimatedCost, selectExpenseItemList, afterTaxAmount, taxes, withholdingTax} = this.state
        let expensePriceData = selectExpenseItemList && selectExpenseItemList.length > 0 ? selectExpenseItemList.filter(d => d.billingMethodName === '实报实销').map(item => {
            return {
                billingMethodId: item.billingMethodId,
                billingMethodName: item.billingMethodName,
                code: item.code,
                costUnitValue: item.costUnitValue ? item.costUnitValue : '',
                id: item.id,
                quotationLineExpenseItemId: item.quotationLineExpenseItemId,
                name: item.name,
                status: item.status,
                typeId: item.typeId,
                typeName: item.typeName,
                currencyId: item.currencyId,
                currencyName: item.currencyName
            }
        }) : []
    
        /**费用项**/
        let expenseItemData = selectExpenseItemList && selectExpenseItemList.length > 0 ? selectExpenseItemList.filter(d => (d.costUnitName && d.orderExpenseItemUnitCoefficientList)) : []
       
       /*费用项总应收 */
        let quotationMoney = expenseItemData.reduce((rt, cur) => { //含税
            if(cur.accountingStrategy === 2) {
                return rt += cur.chargeFee * (1+(withholdingTax ? withholdingTax/100 : 0))
            }
            return rt += cur.chargeFee * (cur && cur.orderExpenseItemUnitCoefficientList[0] && cur.orderExpenseItemUnitCoefficientList[0].costUnitValue || 0) * (1+(withholdingTax ? withholdingTax/100 : 0))
        }, 0)

        /* 含税费用 */
        estimatedCost =  quotationMoney + expensePriceData.reduce((rt, cur) => { //含税金额
            return rt += (cur.costUnitValue || 0)
        }, 0)

        /* 不含税费用 */
        afterTaxAmount =  quotationMoney/(1+(taxes ? taxes/100 : 0))+ expensePriceData.reduce((rt, cur) => {
            return rt += (cur.costUnitValue || 0)
        }, 0)

        this.setState({
            estimatedCost: estimatedCost ? estimatedCost.toFixed(4) : 0,
            afterTaxAmount: afterTaxAmount ? afterTaxAmount.toFixed(4) : 0
        })
    }    

    onChangeExpenseItemList = (d) => {
        const { itemIndex, unitIndex, value, status, isEdit} = d
        if ('status' in d) {
            this.setState(preState => {
                preState.selectExpenseItemList[itemIndex].status = status
                preState.selectExpenseItemList[itemIndex].isEdit = isEdit
                return {
                    selectExpenseItemList: preState.selectExpenseItemList
                }
            }, () => {
                this.calculateQuotation()
            })
        } else {
            this.setState(preState => {
                let item = preState.selectExpenseItemList[itemIndex]
                if(item &&  item.billingMethodName === '实报实销') {
                    item.costUnitValue = value.costUnitValue
                    item.currencyId = value.currencyId
                    item.currencyName = value.currencyName
                } else {
                    item.orderExpenseItemUnitCoefficientList[unitIndex].costUnitValue = value.costUnitValue
                }
                return {
                    selectExpenseItemList: preState.selectExpenseItemList
                }
            }, () => {
                this.calculateQuotation()
            })
        }
    }

    /* 
        费用项选中值 
        value: 选中的费用项
        isSync: 是否执行同步操作
    */
    onChangRouter = async (value, isSync) => {
        let { selectExpenseItemList, expenseUnitRule, receiveData } = this.state
        let materialList = receiveData.materialList || []

        // 根据规则计算费用项数据
        value = this.dealExpense(value, materialList, expenseUnitRule)
        value.forEach(item => {
            if (!selectExpenseItemList.some(cItem => cItem.id === item.id)) {
                selectExpenseItemList.push(item)
            } else {
                if (isSync === 1) {/* 同步费用项数据 */
                    let index = selectExpenseItemList.indexOf(selectExpenseItemList.find(cItem => cItem.id === item.id))
                    selectExpenseItemList[index] = item
                }
            }
        })
        for (let i = 0; i < selectExpenseItemList.length; i++) {
            if (!value.some(d => d.id === selectExpenseItemList[i].id) && (selectExpenseItemList[i].costUnitName && selectExpenseItemList[i].orderExpenseItemUnitCoefficientList)) {
                selectExpenseItemList.splice(i, 1)
                i--
            }
        }

        await this.setState({
            selectExpenseItemList
        }, () => {
            this.calculateQuotation()
        })
    }
    
    /* 实报实销选中值 */
    onReimbursementChangeValue = (value) => {
        let { selectExpenseItemList } = this.state
        value.forEach(item => {
            if (!selectExpenseItemList.some(cItem => cItem.id === item.id)) {
                selectExpenseItemList.push(item)
            }
        })
        for (let i = 0; i < selectExpenseItemList.length; i++) {
            if (!value.some(key => key.id === selectExpenseItemList[i].id) && !(selectExpenseItemList[i].costUnitName && selectExpenseItemList[i].orderExpenseItemUnitCoefficientList)) {
                selectExpenseItemList.splice(i, 1)
                i--
            }
        }
        this.setState({
            selectExpenseItemList
        }, () => {
            this.calculateQuotation()
        })
    }

    /* 根据费用单位ID数组获取对应的物料单位规则 */
    getCostRule = async (reqArr) => {
        const { rApi } = this.props
        try {
            let rtArr = await rApi.getMethodByUnitId(reqArr)
            await this.setState({expenseUnitRule: [...rtArr]})
        } catch (e) {
            await this.setState({expenseUnitRule: []})
        }
    }

    /* 根据物料数据使用路线获取的单位规则计算出费用数据 */
    dealExpense = (rtArr, materialList, ruleArr) => {
        // console.log('rule', ruleArr, rtArr, materialList)
        return rtArr.map(item => {
            item.orderExpenseItemUnitCoefficientList = expenseItemsToArray(item)
            item.status = 1
            let index = item._expenseIndex || 0
            if (materialList && ruleArr) {
                item.orderExpenseItemUnitCoefficientList.forEach(unit => {
                    if (ruleArr[index] && ruleArr[index].isQuantityCount) {
                        unit.costUnitValue = materialList.reduce((total, item) => {
                            return total = total + parseFloat(item.quantity)
                        }, 0)
                    } else if (ruleArr[index] && ruleArr[index].isBoxCount) {
                        unit.costUnitValue = materialList.reduce((total, item) => {
                            return total = total + parseFloat(item.boxCount)
                        }, 0)
                    } else if (ruleArr[index] && ruleArr[index].isBoard) {
                        unit.costUnitValue = materialList.reduce((total, item) => {
                            return total = total + parseFloat(item.boardCount)
                        }, 0)
                    } else if ((ruleArr[index] && ruleArr[index].isGrossWeight) || (rtArr[index] && rtArr[index].isNetWeight)) {
                        unit.costUnitValue = materialList.reduce((total, item) => {
                            return total = total + parseFloat(item.grossWeight)
                        }, 0)
                    } else if (ruleArr[index] && ruleArr[index].isVolumeReceipt) {
                        unit.costUnitValue = materialList.reduce((total, item) => {
                            return total = total + parseFloat(item.volume)
                        }, 0)
                    } else {
                        unit.costUnitValue = 1
                    }
                })
            }
            return item
        })
    }

    /* 选择报价路线 */
    selectRow = async (item, isFee) => {
        let quotationLineExpenseItems = item.quotationLineExpenseItems || []
        quotationLineExpenseItems = cloneObject(quotationLineExpenseItems)
        let reqArr = []
        reqArr = quotationLineExpenseItems.map(item => parseInt(item.costUnitId, 10))
        await this.getCostRule(reqArr)
        await this.setState({
            expenseItemList: quotationLineExpenseItems.map(d => {
                return{...d, quotationLineExpenseItemId: d.id}
            }),
            transitPlaceOneId: item.transitPlaceOneId, //中转地1id
            transitPlaceOneName: item.transitPlaceOneName, //中转地1 名字
            isHighway: item.isHighway,
            departure: item.departure,
            destination: item.destination,
            selectQuotation: item
        })
    }

    showMore = (record) => {
        // console.log('showMore record', record)
        this.addoredit.show({
            edit: false,
            data: record
        })
    }

    selectRoute = () => {
        this.quotationView.show({
            keywords: this.state.clientName,
            quotationType: this.state.businessModelId
        })
    }

    changeInput = (obj, fuc) => {
        if (fuc) {
            this.setState(obj, fuc)
        } else {
            this.setState(obj)
        }
    }

    getTransitPlaceData = (value) => { //中转地值
        // console.log('getLabelVul', value)
        this.setState({
            transitPlaceOneName: value.name,
            transitPlaceOneId: value.id
        })
    }

    showSendDetails = (value) => { //发货方详情
        //console.log('showSendDetails', value)
        let { rApi } = this.props
        if(value && value.cargoPartyName) {
            this.setState({
                detailsLoading: true
            })
            rApi.getConsignees({
                id: value.id,
                limit: 999999,
                offset: 0
            }).then(res => {
                //console.log('发货方详情', res)
                let data = res.records
                let handleVul = data && data.length > 0 ? data.map(item => {
                    return {
                        bid: item.id,
                        name: item.cargoPartyName,
                        code: item.cargoPartyCode,
                        ...item
                    }
                }): []
                this.setState({
                    sendDetailsList: handleVul,
                    senderList: handleVul,
                    detailsLoading: false
                }, () => {
                    this.onChangeDeliveryOrSend()
                })
            }).catch(e => {
                this.setState({
                    detailsLoading: false
                })
                console.log(e)
            })
        } else {
            this.setState({
                sendDetailsList: [],
                senderList: []
            }, () => {
                this.onChangeDeliveryOrSend()
            })
        }
    }

    showReciverDetails= (value, type) => { //收货方详情
       // console.log('收货方详情', value, type)
        let { rApi } = this.props
        if(value && value.cargoPartyName && type !== 'warehouse') {/* 选择收货方 */
            rApi.getConsignees({
                id: value.id,
                limit: 999999,
                offset: 0
            }).then(res => {
                let data = res.records
                let handleVul = data && data.length > 0 ? data.map(item => {
                    return {
                        ...item,
                        bid: item.id,
                        name: item.cargoPartyName,
                        code: item.cargoPartyCode,
                        receiveType: 'receiver'
                    }
                }): []
                this.toMateriel({
                    ...data[0],
                    materialList: this.state.receiverDetailsList && this.state.receiverDetailsList.length > 0 ? this.state.receiverDetailsList[0].materialList : []
                }, 'collect')
                this.setState({
                    receiverDetailsList: handleVul,
                    receiverList: handleVul
                }, () => {
                    this.onChangeDeliveryOrSend()
                })
            }).catch(e => {
                console.log(e)
            })
        } else if (value && type === 'warehouse') {/* 选择仓库 */
            rApi.getOneWarehouse({
                id: value.id
            }).then(item => {
                let list = {
                    ...item,
                    bid: item && item.id,
                    name: item && item.name,
                    code: item && item.code,
                    contactNumber: item && item.phone,
                    receiveType: 'warehouse'
                }
                this.toMateriel({
                    ...item,
                    materialList: this.state.receiverDetailsList && this.state.receiverDetailsList.length > 0 ? this.state.receiverDetailsList[0].materialList : []
                }, 'collect')
                this.setState({
                    receiverDetailsList: [list],
                    receiverList: [list]
                }, () => {
                    this.onChangeDeliveryOrSend()
                })

            })
            // let list = value.origin_data ? [...value.origin_data] : [value]
            // list = list.map(item => {
            //     return {
            //         ...item,
            //         bid: item.id,
            //         name: item.cargoPartyName || item.name,
            //         code: item.cargoPartyCode || item.code,
            //         receiveType: 'warehouse'
            //     }
            // })
           
        } else {
            this.setState({
                receiverDetailsList: [],
                receiverList: []
            }, () => {
                this.onChangeDeliveryOrSend()
            })
        }
    }

    addReceiverOrSender = (addTitle, flag) => {
        //console.log('addTitle', addTitle)
        let { clientId, clientName } = this.state
        this.setState({
            isSendEdit: flag
        })
        this.addoreditRece.show({
            edit: false,
            newData: true,
            data: {
                title: addTitle,
                clientId,
                clientName,
                addressType: addTitle === '新建收货方' ? 2 : 1
            }
        })
    }

    editReceiverOrSender = (sendDetailsList, flag, editTitle) => {
        let { senderList, receiverList } = this.state
        this.setState({
            isSendEdit: flag
        })
        this.addoreditRece.show({
            edit: true,
            data: {
                ...sendDetailsList[0],
                title: editTitle,
                addressType: editTitle === '编辑收货方' ? 2 : 1
            }
        })
    }

    deleteItem = (value) => { //删除费用项
        //console.log('删除费用项', value, value.itemIndex)
        let { selectExpenseItemList } = this.state
        let index = value.itemIndex
        selectExpenseItemList.splice(index, 1)
        this.setState({
            selectExpenseItemList: this.state.selectExpenseItemList
        }, () => {
            this.calculateQuotation()
        })
    }

    render() {
        let {
            selectType,
            openType,
            receiveData, // 当前选中的收发方
            requestDone,
            status, // 状态 0-驳回 1-保存 2-提交 3-审核通过
            loading, //加载中
            moreClientNo, //客户单号更多
            orderNumber, //订单编号
            aging, //时效
            businessModelId, //业务模式id
            businessModelName, //业务模式名字
            carTypeList, //需求车型列表
            clientId, //客户id
            clientName, //客户名称
            customerNumber, //客户单号
            customerNumberBackup, //客户单号2
            customsAreaId, //关区
            customsAreaName,
            departure, // 起运地
            departureTime, // 发车时间
            arrivalTime, // 到达时间
            destination, // 目的地
            expenseItemList, // 费用项
            insuredValue, // 投保货值
            isCustomsClearance, // 委托报关（1-是 -1否）
            isHighway, // 是否高速（1-是 0否）
            isInsurance, // 是否保险（1-是 -1否）
            liftingModeId, // 提送模式id
            liftingModeName, // 提送模式名称
            projectId, // 项目id
            projectName, // 项目名称
            receiverList, // 收货列表
            senderList, //发货列表
            remark, //备注信息
            specialInstruction, //特殊说明
            transitPlaceOneName, //中转地1 名字
            materielTitle, //物料清单头
            CustomerAreaData, //关区数据
            specialDescription,
            buttonLoading,
            sendDetailsList, //发货方详情
            receiverDetailsList, //收货方详情
            businessModelData, //业务模式
            selectExpenseItemList, //选中的费用项
            orderForm,
            estimatedCost, //合计
            afterTaxAmount,
            detailsLoading,
            selectQuotation,
            quotationNumber,
            orderLegalId, //接单法人id
            orderLegalName, //接单法人name
            clientLegalId,
            clientLegalName,
            id,
            isTextsIncluded, //是否含税
            currencyName, //币别
            taxes, //发票税
            withholdingTax, //补扣税
        } = this.state
        let senderProvince = sendDetailsList && sendDetailsList.length > 0 && sendDetailsList[0].address && stringObjectObject(sendDetailsList[0].address).pro
        let receiveProvince = receiverDetailsList && receiverDetailsList.length > 0 && receiverDetailsList[0].address && stringObjectObject(receiverDetailsList[0].address).pro
        if(carTypeList && carTypeList.length > 0) {
            expenseItemList = expenseItemList && expenseItemList.length > 0 && expenseItemList.filter(item => {
                return carTypeList.some(d => d.carTypeName === item.carTypeName || !item.carTypeName)
            })
        }
        return (
            <div className='add-order-wrapper' style={{background: '#eee', minHeight: this.props.minHeight}}>
                <Fragment>
                        <Quotation 
                            showMore={this.showMore} 
                            selectRow={this.selectRow} 
                            getThis={v => this.quotationView = v}
                            quotationType={businessModelId}
                            projectId={projectId}
                            senderProvince={senderProvince}
                            receiveProvince={receiveProvince}
                            getQuotationData={(value) => {
                                //console.log('getQuotationData', value[0])
                                if(value && value.length > 0) {
                                    let obj = value[0]
                                    this.setState({
                                        currencyId: obj.currencyId,
                                        currencyName: obj.currencyName,
                                        taxes: obj.taxes ? obj.taxes : 0,
                                        withholdingTax: obj.withholdingTax ? obj.withholdingTax : 0,
                                        isTextsIncluded: obj.isTextsIncluded || 0,
                                        quotationNumber: obj.quotationNumber
                                    })
                                }
                            }}
                    />
                    <AddReceiverOrSender 
                        parent={this}
                        getThis={(v) => this.addoreditRece = v}
                        getConsigneeData={(value) => {
                            let data = [value]
                            let materielData = (receiveData && receiveData.materialList) ? receiveData.materialList : []
                            let handleVul = data && data.length > 0 ? data.map(item => {
                                return {
                                    bid: item.id,
                                    name: item.cargoPartyName,
                                    code: item.cargoPartyCode,
                                    materialList: materielData,
                                    ...item
                                }
                            }): []
                            let s = data && data.length > 0 ? data.map(item => {
                                return {
                                    bid: item.id,
                                    name: item.cargoPartyName,
                                    code: item.cargoPartyCode,
                                    ...item
                                }
                            }): []
                            if(this.state.isSendEdit === 1) {
                                this.setState({
                                    reloadSend: true,
                                    sendDetailsList: s,
                                    senderList: s
                                }, () => {
                                    this.setState({
                                        reloadSend: false
                                    })
                                })
                            } else if(this.state.isSendEdit === 2) {
                                this.setState({
                                    reloadRecrive: true,
                                    receiverDetailsList: handleVul,
                                    receiverList: handleVul,
                                    receiveData: {
                                        bid: value.id,
                                        name: value.cargoPartyName,
                                        code: value.cargoPartyCode,
                                        materialList: materielData,
                                        ...value
                                    }
                                }, () => {
                                    this.setState({
                                        reloadRecrive: false
                                    })
                                })
                            }
                        }}
                    />
                    <AddOrEdit parent={this} getThis={v => this.addoredit = v} />
                    <Spin spinning={loading} tip="加载中...">
                        <Form layout='inline' onSubmit={this.handleSubmit}>
                            <div style={{maxWidth: 1200, margin: '0 auto 10px', minHeight: 400}}>
                                {
                                    openType === 2 ?
                                    ''
                                    :
                                    <HeaderView 
                                        id={id}
                                        saveSubmit={this.saveSubmit}
                                        okSubmit={this.okSubmit}
                                        confirmOrderSubmit={this.confirmOrderSubmit}
                                        loading={loading}
                                        status={status}
                                        openType={openType}
                                        buttonLoading={buttonLoading}
                                    />
                                }
                                {
                                    requestDone === true && !loading ? 
                                    <div>
                                        <BasePlate 
                                            form={this.props.form}
                                            changeInput={this.changeInput}
                                            getCustomerArea={this.getCustomerArea}
                                            clientNoUp={this.clientNoUp}
                                            orderNumber={orderNumber}
                                            clientId={clientId}
                                            clientName={clientName}
                                            projectId={projectId}
                                            projectName={projectName}
                                            customerNumber={customerNumber}
                                            moreClientNo={moreClientNo}
                                            customerNumberBackup={customerNumberBackup}
                                            specialDescription={specialDescription}
                                            specialInstruction={specialInstruction}
                                            businessModelId={businessModelId}
                                            businessModelName={businessModelName}
                                            businessModelData={businessModelData}
                                            remark={remark}
                                            openType={openType}
                                            aging={aging}
                                            departureTime={departureTime}
                                            arrivalTime={arrivalTime}
                                            carTypeList={carTypeList}
                                            isCustomsClearance={isCustomsClearance}
                                            CustomerAreaData={CustomerAreaData}
                                            customsAreaId={customsAreaId}
                                            customsAreaName={customsAreaName}
                                            isInsurance={isInsurance}
                                            insuredValue={insuredValue}
                                            orderForm={orderForm}
                                            orderLegalId={orderLegalId}
                                            orderLegalName={orderLegalName}
                                            clientLegalId={clientLegalId}
                                            clientLegalName={clientLegalName}
                                        />
                                        <ReceiverAndSenderConfig 
                                            form={this.props.form}
                                            clientId={clientId}
                                            removeSenderList={this.removeSenderList}
                                            removeReceivingData ={this.removeReceivingData}
                                            changeInput={this.changeInput}
                                            toMateriel={this.toMateriel}
                                            changeReceiveShow={this.changeReceiveShow}
                                            getLabelVulTo={this.getLabelVulTo}
                                            getLabelVulTake={this.getLabelVulTake}
                                            returnReceivingTimer={this.returnReceivingTimer}
                                            returnShipperTimer={this.returnShipperTimer}
                                            showSendDetails={this.showSendDetails}
                                            detailsLoading={detailsLoading}
                                            showReciverDetails={this.showReciverDetails}
                                            addReceiverOrSender={this.addReceiverOrSender}
                                            editReceiverOrSender={this.editReceiverOrSender}
                                            liftingModeId={liftingModeId}
                                            liftingModeName={liftingModeName}
                                            receiverList={receiverList}
                                            senderList={senderList}
                                            sendDetailsList={sendDetailsList}
                                            receiverDetailsList={receiverDetailsList}
                                            listData
                                            openType={openType}
                                            receiveData={receiveData}
                                            onAddMateriel={this.onAddMateriel}
                                            onSaveOrEditDataMateriel={this.onSaveOrEditDataMateriel}
                                            onDeleteMateriel={this.onDeleteMateriel}
                                            onChangeMateriel={this.onChangeMateriel}
                                            materielTitle={materielTitle}
                                            selectType={selectType}
                                            onlyShow="collect"
                                            reloadSend={this.state.reloadSend}
                                            reloadRecrive={this.state.reloadRecrive}
                                            projectId={projectId}
                                        />
                                    {
                                        clientId ? 
                                        <div className="background-white" style={{padding: '10px 25px', borderBottom: '10px solid #eee'}}>
                                            <HeaderTitle
                                                title={
                                                    <span>
                                                        订单报价配置
                                                        <span style={{color: '#18B583', fontSize: '14px', marginLeft: '6px'}}>
                                                        {`(合计: ${estimatedCost ? estimatedCost : 0}${currencyName ? currencyName : 'RMB'})`}
                                                        </span>
                                                    </span>
                                                }
                                            />
                                            <div className="flex left">
                                                <Row gutter={24}>
                                                    <Col isRequired label="报价路线&emsp;&emsp;&emsp;" colon labelInTop  span={24}>
                                                        {
                                                            openType === 2 ?
                                                            null
                                                            :
                                                            <div>
                                                                <Button 
                                                                    icon='environment' 
                                                                    loading={loading}
                                                                    onClick={this.selectRoute}
                                                                    style={{borderRadius: 0}}
                                                                    disabled={
                                                                        (projectId && businessModelId && senderProvince && receiveProvince) ? false
                                                                        :
                                                                        true
                                                                    }
                                                                >
                                                                    选择报价路线
                                                                </Button>
                                                                <span style={{marginLeft: 10, color: '#18B583'}}>
                                                                    {quotationNumber ? `(${quotationNumber})` : ''}
                                                                </span>
                                                            </div>
                                                        }
                                                        <TransportRoute 
                                                            getTransitPlaceData = {this.getTransitPlaceData}
                                                            departure={departure}
                                                            transitPlaceOneName={transitPlaceOneName}
                                                            destination={destination}
                                                            isTransitPlace={true}
                                                            selectQuotation={selectQuotation}
                                                            power={power}
                                                        />
                                                    </Col>
                                                </Row>
                                            </div>
                                            <Row gutter={24}>
                                                <Col isRequired label="费用项设置&emsp;&emsp;" colon labelInTop  span={24}>
                                                    <div className="flex1" style={{maxWidth: 800}}>
                                                        <ExpenseItem 
                                                            onChangeExpenseItemList={this.onChangeExpenseItemList}
                                                            route={expenseItemList} 
                                                            openType={openType}
                                                            onChangRouter={this.onChangRouter}
                                                            onReimbursementChangeValue={this.onReimbursementChangeValue}
                                                            selectRoute={selectExpenseItemList}
                                                            receivableOrPayable='应收'
                                                            deleteItem={this.deleteItem}
                                                            showSync
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                        :
                                        null
                                    }
                                    </div>
                                    :
                                    null
                                }
                            </div>
                        </Form>
                    </Spin>
                </Fragment>
            </div>
        )
    }
}
 
export default Form.create()(CustomerDemand)