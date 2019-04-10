import React from 'react'
import { Button, Form, message, Icon, Popconfirm, DatePicker, Input, Spin, Tabs, Cascader, Radio, Switch, Select} from 'antd'
import { HeaderView, Table, Parent } from '@src/components/table_template'
import { inject, observer } from "mobx-react"
import MultiInputButton from '@src/components/select_multi_input'
import RemoteSelect from '@src/components/select_databook'
import SelectMulti from '@src/components/select_multi'
import { dateSelectData } from './date_select_data'
import { children, id } from './power_hide'
// import { deleteNull } from '@src/utils'
import { Row, Col } from '@src/components/grid'
import moment from 'moment'
import { toCooperativeList } from '@src/views/layout/to_page'
import FormItem from '@src/components/FormItem'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { isArray, stringToArray } from '@src/utils'
import CustomizedOption from '@src/components/customized_option'
import TimePicker from '@src/components/time_picker'
import './index.less'

const Option = Select.Option
const RadioGroup = Radio.Group
const TabPane = Tabs.TabPane
const power = Object.assign({}, children, id)
const { TextArea } = Input
const { RangePicker } = DatePicker
const demandTypeData = [
    {
        id: 1,
        label: '运输', 
        value: 1
    },
    {
        id: 2,
        label: '仓储', 
        value: 2
    }
]

/**
 * 合作项目项目管理
 * 
 * @class CooperativeProjectDetails
 * @extends {Component}
 */
@inject('mobxTabsData', 'mobxDataBook')
@inject('rApi')
@observer
class CooperativeProjectDetails extends Parent {

    state = {
        requstDone: true,
        loading: false, //加载中
        operatorId: 0, // 操作人id
        operatorName: 0, // 操作人名字
        status: null, // 状态 1-保存 2-启动 3-暂停 4-过期
        caeateTime: null, //创建时间
        carrierList: [], //运作承运商
        nodeList: [], //中转地配置
        warehouseDataList: [], //仓储配置
        checkAccountPeriod: 0, //对账周期
        clientId: 0, //客户id
        clientName: null, //客户名称
        clientLegalId: 0, //客户法人id
        clientLegalName: null, //客户法人名称
        demandId: 0, //需求id
        demandName: null, //需求名称
        demandType: [], //客户需求类型
        id: 0,
        orderLegalId: 0, //接单法人id
        orderLegalName: null, //接单法人名字
        projectName: null, //项目名字
        projectNumber: null, //项目编号
        projectStartDate: null, //项目开始时间
        projectEndDate: null, //项目结束时间
        removeCooperationProjectBusinessIds: [],
        transportQuotationList: [],
        warehouseQuotationList: [],
        bookingMode: -1, //预订单模式(-1 否 1-是)
        projectDepartmentId: 0, //部门id
        projectDepartmentName: null, //部门名字
        isCustomsClearance: 1, //是否报关(-1 否 1-是)
        customsBrokerId: 0, //报关行id
        customsBrokerName: null, //报关行名称
        customsAreaList: [], //添加关区
        customsAreaData: null, //关区默认值
        options : [], //部门列表
        organization: {}, //部门数据
        originThis: null, //list页this
        projectPrincipalId: null, // 项目负责人id
        projectPrincipalName: null // 项目负责人名字
    }

    constructor(props) {
        super(props)
        const { mobxTabsData, mykey } = props
        const pageData = mobxTabsData.getPageData(mykey)
        mobxTabsData.setTitle(mykey, `合作项目: ${pageData.projectName}`)
        // console.log('pageData', pageData)
        this.state.id = pageData.id
        this.state.originThis = pageData.listThis
        this.state.status = pageData.status
        this.state.projectNumber = pageData.projectNumber
        this.state.demandType = pageData.demandType
        this.state.projectName = pageData.projectName
        this.state.clientId = pageData.clientId
        this.state.clientName = pageData.clientName
        this.state.demandId = pageData.demandId
        this.state.demandName = pageData.demandName
        this.state.transportQuotationList = pageData.transportQuotationList ? pageData.transportQuotationList : []
        this.state.warehouseQuotationList = pageData.warehouseQuotationList ? pageData.warehouseQuotationList : []
        this.state.projectStartDate = pageData.projectStartDate
        this.state.projectEndDate = pageData.projectEndDate
        this.state.clientLegalId = pageData.clientLegalId
        this.state.clientLegalName = pageData.clientLegalName
        this.state.orderLegalId = pageData.orderLegalId
        this.state.orderLegalName = pageData.orderLegalName
        this.state.carrierList = pageData.carrierList ? pageData.carrierList : []
        this.state.nodeList = pageData.nodeList ? pageData.nodeList : [] //中转地配置 
        this.state.warehouseDataList = pageData.warehouseDataList ? pageData.warehouseDataList: [], //仓储配置
        this.state.checkAccountPeriod = pageData.checkAccountPeriod,
        this.state.bookingMode = pageData.bookingMode, 
        this.state.projectDepartmentId = pageData.projectDepartmentId, 
        this.state.projectDepartmentName = pageData.projectDepartmentName, 
        this.state.isCustomsClearance = pageData.isCustomsClearance, 
        this.state.customsBrokerId = pageData.customsBrokerId, 
        this.state.customsBrokerName = pageData.customsBrokerName, 
        this.state.customsAreaList = pageData.customsAreaList,
        this.state.customsAreaData = pageData.customsAreaList && pageData.customsAreaList.length > 0 ? pageData.customsAreaList.map(item => {
            return item.title
        }) : [],
        this.state.projectPrincipalId = pageData.projectPrincipalId,
        this.state.projectPrincipalName = pageData.projectPrincipalName
    }


    // static getDerivedStateFromProps(nextProps, prevState) {
    //     const { mobxTabsData, mykey } = nextProps
    //     const pageData = mobxTabsData.getPageData(mykey)
    //     this.setState({
    //         status:  pageData.status,
    //         projectNumber:  pageData.projectNumber,
    //         demandType:  pageData.demandType,
    //         demandType:  pageData.demandType,
    //     })
    // }

    // componentDidMount(){
    //     this.getList()
    // }

    // componentDidMount() {
    //     let { clientId } = this.state
    //     this.props.rApi.getOrganization().then((res) => {
    //         if(res) {
    //             let optionsData = res.map((nodes) => {
    //                 return this.organizationToTree(nodes)
    //             })
    //             this.setState({
    //                 options: optionsData
    //             })
    //         }
    //     }).catch(e => {
    //         console.log(e)
    //     })
    // }
  
    // organizationToTree(nodes) {
    //     nodes.label = nodes.title
    //     nodes.value = nodes.id
    //     nodes.children = nodes.subs
    //     if (!nodes.children || (nodes.children && nodes.children.length < 1)) {
    //         delete nodes.children
    //         delete nodes.subs
    //         return nodes
    //     } else {
    //         delete nodes.subs
    //         return {
    //             ...nodes,
    //             children: nodes.children.map(item => this.organizationToTree(item))
    //         }
    //     }
    // }

    // filterOrganization = (projectDepartmentId) => { //过滤部门数据
    //     let { options } = this.state
    //     if(options && options.length > 0) {
    //         options.map(item => {
    //             if(item.id === projectDepartmentId){
    //                 console.log('projectDepartmentId', item)
    //                 return item
    //             } else{
    //                 item.children.map(d => {
    //                     this.filterOrganization(d)
    //                 })
    //             }
    //         })
    //     }
    // }

    getList = () => {
        let { id, projectDepartmentId } = this.state
        this.setState(
            {
                loading: true,
                requstDone: false
            })
        this.props.rApi.getCooperativeDetailOne({
            id,
        }).then(d => {
            // console.log('getDemandsInfo', d)
            if(d) {
                this.setState({
                    status: d.status,
                    projectNumber: d.projectNumber,
                    demandType: d.demandType,
                    projectName: d.projectName,
                    clientId: d.clientId,
                    clientName: d.clientName,
                    demandId: d.demandId,
                    demandName: d.demandName,
                    transportQuotationList: d.transportQuotationList ? d.transportQuotationList : [],
                    warehouseQuotationList: d.warehouseQuotationList ? d.warehouseQuotationList : [],
                    projectStartDate: d.projectStartDate,
                    projectEndDate: d.projectEndDate,
                    clientLegalId: d.clientLegalId,
                    clientLegalName: d.clientLegalName,
                    orderLegalId: d.orderLegalId,
                    orderLegalName: d.orderLegalName,
                    carrierList: d.carrierList ? d.carrierList : [],
                    nodeList: d.nodeList ? d.nodeList : [],
                    warehouseDataList: d.warehouseDataList ? d.warehouseDataList : [],
                    checkAccountPeriod: d.checkAccountPeriod,
                    bookingMode: d.bookingMode, 
                    projectDepartmentId: d.projectDepartmentId, 
                    projectDepartmentName: d.projectDepartmentName, 
                    isCustomsClearance: d.isCustomsClearance, 
                    customsBrokerId: d.customsBrokerId, 
                    customsBrokerName: d.customsBrokerName, 
                    customsAreaList: d.customsAreaList,
                    customsAreaData: d.customsAreaList && d.customsAreaList.length > 0 ? d.customsAreaList.map(item => {
                        return item.title
                    }) : [],
                    projectPrincipalId: d.projectPrincipalId,
                    projectPrincipalName: d.projectPrincipalName
                })
            }
            this.showView()
        }).catch(e => {
            this.loadingFalse()
            message.error(e.msg || '请求失败,请刷新！')
        })
    }

    showView = () => {
        this.setState({
            requstDone: true,
            loading: false
        })
    }

    loadingFalse = () => {
        this.setState({
            loading: false
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

    saveSubmit = () => { //保存请求
        let {
            carrierList, //运作承运商
            nodeList,
            warehouseDataList,
            checkAccountPeriod, //对账周期
            clientId, //客户id
            clientName, //客户名称
            clientLegalId, //客户法人id
            clientLegalName, //客户法人名称
            orderLegalId, //接单法人id
            orderLegalName, //接单法人名字
            demandId, //需求id
            demandName, //需求名称
            demandType, //客户需求类型
            id,
            projectName, //项目名字
            projectNumber, //项目编号
            projectStartDate, //项目开始时间
            projectEndDate, //项目结束时间
            removeCooperationProjectBusinessIds,
            transportQuotationList,
            warehouseQuotationList,
            bookingMode, //预订单模式(-1 否 1-是)
            projectDepartmentId, //部门id
            projectDepartmentName, //部门名字
            isCustomsClearance, //是否报关(-1 否 1-是)
            customsBrokerId, //报关行id
            customsBrokerName, //报关行名称
            customsAreaList, //添加关区
            projectPrincipalId,
            projectPrincipalName
        } = this.state
        if(transportQuotationList && transportQuotationList.length === 0 && this.isHaveTransportOrWarhouse(1)) {
            message.error('运输报价不能为空！')
            return false
        }
        // console.log('xxx', warehouseDataList, warehouseDataList && warehouseDataList.length === 0 && this.isHaveTransportOrWarhouse(2))
        // if(warehouseDataList && warehouseDataList.length === 0 && this.isHaveTransportOrWarhouse(2)) {
        //     message.error('仓储配置不能为空！')
        //     return false
        // }

        this.props.rApi.editCooperativeProject({
            carrierList, //运作承运商
            nodeList, 
            warehouseDataList,
            checkAccountPeriod, //对账周期
            clientId, //客户id
            clientName, //客户名称
            clientLegalId, //客户法人id
            clientLegalName, //客户法人名称
            orderLegalId, //接单法人id
            orderLegalName, //接单法人名字
            demandId, //需求id
            demandName, //需求名称
            demandType, //客户需求类型
            id,
            projectName, //项目名字
            projectNumber, //项目编号
            projectStartDate, //项目开始时间
            projectEndDate, //项目结束时间
            removeCooperationProjectBusinessIds,
            transportQuotationList,
            warehouseQuotationList,
            bookingMode, //预订单模式(-1 否 1-是)
            projectDepartmentId, //部门id
            projectDepartmentName, //部门名字
            isCustomsClearance, //是否报关(-1 否 1-是)
            customsBrokerId, //报关行id
            customsBrokerName, //报关行名称
            customsAreaList, //添加关区
            projectPrincipalId,
            projectPrincipalName
        }).then(d => {
            message.success('操作成功!')
            this.toCooperativeListPage()
        }).catch(e => {
            message.error(e.msg || '操作失败!')
        })
    }

    toCooperativeListPage = () => { //跳到订单列表页面
        const { mobxTabsData, mykey } = this.props
        toCooperativeList(mobxTabsData, {
            pageData: {
                reLoad: true,
                refresh: true
            }
        })
        mobxTabsData.closeTab(mykey)
    }

    pauseSubmit = () => { //暂停
        let { id, originThis } = this.state
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.rApi.pauseMethod({
                    id
                }).then(d => {
                    this.setState({
                        status: 3
                    })
                    message.success('操作成功!')
                    if(originThis) {
                        originThis.getData()
                    }
                }).catch(e => {
                    message.error(e.msg || '操作失败')
                })
            }
        })
    }

    poweroffSubmit = () => { //启动
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { 
                    id,
                    originThis,
                    transportQuotationList,
                    warehouseDataList,
                    carrierList
                } = this.state
                if(transportQuotationList && transportQuotationList.length === 0 && this.isHaveTransportOrWarhouse(1)) {
                    message.error('运输报价不能为空！')
                    return false
                }
                // if(carrierList.length < 1 || (carrierList && carrierList[0] && !carrierList[0].businessId && !carrierList[0].businessName)) {
                //     message.error('承运商不能为空！')
                //     return false
                // }
                // console.log('xxx', warehouseDataList, warehouseDataList && warehouseDataList.length === 0 && this.isHaveTransportOrWarhouse(2))
                // if(warehouseDataList && warehouseDataList.length === 0 && this.isHaveTransportOrWarhouse(2)) {
                //     message.error('仓储配置不能为空！')
                //     return false
                // }
                this.props.rApi.poweroff({
                    id
                }).then(d => {
                    this.setState({
                        status: 2
                    })
                    message.success('操作成功!')
                    if(originThis) {
                        originThis.getData()
                    }
                }).catch(e => {
                    message.error(e.msg || '操作失败')
                })
            }
        });
    }

    // toListPage = () => {
    //     const { mobxTabsData } = this.props
    //     toCooperativeList(mobxTabsData)
    // }

    handleChangeTransport = (value) => { //项目运输报价
        this.setState({transportQuotationList : value.map((item) => {
            let obj = {businessId: item.id, businessName: item.title, quotationList: []}
            return obj
        })})
    }

    // handleChangeStorage = (value) => { //项目仓储报价
    //     this.setState({warehouseQuotationList : value.map((item) => {
    //         let obj = {businessId: item.id, businessName: item.title}
    //         return obj
    //     })})

    // }

    handleChangeNode = (value) => { //中转地配置
        this.setState({nodeList : value.map((item) => {
            let obj = {businessId: item.id, businessName: item.title, quotationList: []}
            return obj
        })})
    }

    // handleChangeCarrie = (value) => { //运作承运商
    //     this.setState({carrierList : value.map((item) => {
    //         let obj = {businessId: item.id, businessName: item.title}
    //         return obj
    //     })})
    // }

    // handleChangeInput = (value) => { //添加关区
    //     let { clientId } = this.state
    //     if(value !== ''){
    //         this.setState({
    //             customsAreaList: value && value.length > 0 ? value.map((item, index) => {
    //                 let obj = {id: index, title: item, clientId: clientId}
    //                 return obj
    //             }) : []
    //         })
    //     }
    // }

    changeSelectMultiData = (value) => { //转换格式
        try {
            return value.map(item => {
                return {
                    id: item.businessId,
                    title: item.businessName
                }
            })
        } catch (e) {
            return null
        }
        return null
    }

    filterDemandTypeData = (value) => { //过滤需求类型
        try {
            let values = JSON.parse(value)
            let demandTypeName = demandTypeData.filter(item => {
                for(let id of values) {
                    if(id === item.id) {
                        return true
                    }
                }
                return false
            })
            // console.log('demandTypeName', demandTypeName, values, demandTypeData)
            return demandTypeName.map(d => {
                return(
                    <span className="demandTypeStyle" key={d.id}>{d.label}</span>
                )
            })
        } catch (e) {
            console.log('')
        }
        return null
    }

    onChange = (value) => { //项目部门
        //console.log('organization', value)
        this.setState({
        projectDepartmentId: value
        })
    }

    clearData = (isClearAll) => {
        if (isClearAll) {
            //console.log('clearData')
            this.setState({
                reLoadClient: true,
                reLoadQuotation: true,
                demandId: null,
                clientLegalName: null,
                checkAccountPeriod: null,
                transportQuotationList: [],
                warehouseQuotationList: [],
                orderLegalId: null,
                orderLegalName: null
            }, () => {
                this.setState({
                    reLoadClient: false,
                    reLoadQuotation: false
                })
            })
        } else {
            this.setState({
                reLoadQuotation: true,
                transportQuotationList: [],
                warehouseQuotationList: []
            }, () => {
                this.setState({
                    reLoadQuotation: false
                })
            })
        }
    }

    getClientsData = () => { //获取客户数据
        let { rApi } = this.props
        let { clientId } = this.state
        return new Promise((resolve, reject) => {
            rApi.getClients({
                limit: 999999, 
                offset: 0,
                status: 56
            }).then(d => {
                this.clientsData = d.clients
                resolve(d.clients)
            }).catch(e => {
                reject(e)
            })
        })
       
    }
    
    getCheckAccountPeriod = (id) => { //获取客户关联的对账周期,客户法人,接单法人
        let { clientId, orderLegalId, orderLegalName, clientLegalName, checkAccountPeriod } = this.state
        let clientsData = this.clientsData
        let checkAccountPeriodData = clientsData && clientsData.length > 0 ? clientsData.filter(item => item.id === id) : []
        // console.log('checkAccountPeriodData', checkAccountPeriodData)
        checkAccountPeriod = checkAccountPeriodData[0] && checkAccountPeriodData[0].period ? checkAccountPeriodData[0].period : null
        clientLegalName = checkAccountPeriodData && checkAccountPeriodData.length > 0 && checkAccountPeriodData[0].legals && checkAccountPeriodData[0].legals.length > 0 && checkAccountPeriodData[0].legals[0].name ? checkAccountPeriodData[0].legals[0].name : null
        orderLegalId = checkAccountPeriodData[0] && checkAccountPeriodData[0].legal && checkAccountPeriodData[0].legal.id ? checkAccountPeriodData[0].legal.id : null
        orderLegalName = checkAccountPeriodData[0] && checkAccountPeriodData[0].legal && checkAccountPeriodData[0].legal.fullName ? checkAccountPeriodData[0].legal.fullName : null
        this.setState({
            checkAccountPeriod,
            clientLegalName,
            orderLegalId,
            orderLegalName
        })
    }

    getClientLegalData = () => { //获取客户法人数据
        let { rApi } = this.props
        let { clientId } = this.state
        return new Promise((resolve, reject) => {
            rApi.getClients({
                limit: 999999, 
                offset: 0, 
                clientid: clientId
            }).then(d => {
                let data = d.clients[0]
                //console.log('filterOrderIdGetCarType', data.legals)
                if(data) {
                    resolve(data.legals.map(item => {
                        return { 
                            ...item,
                            id: item.name
                        }
                    }))
                } else {
                    resolve([])
                }
            }).catch(e => {
                reject(e)
            })
        })
       
    }

    changeCustomizedOptionDataType = (value) => { //转换CustomizedOption组件数据格式=>后台
        let arrData = (value && value.length) > 0 ? value.map(item => {
            return {
                businessId: item.id ? item.id : null,
                businessName: item.name ? item.name : null,
                quotationList: (item.quotationList && item.quotationList.length > 0) ? item.quotationList.map(d => {
                    return {
                        quotationId: d.id ? d.id : null,
                        quotationNumber: d.quotationNumber ? d.quotationNumber || d.name : null
                    }
                }) : []
            }
        }) : []
        return arrData
    }

    changDataTypeToCustomizedOption = (value) => { //转换数据格式=>CustomizedOption显示
        let arrData = (value && value.length) > 0 ? value.map(item => {
            return {
                id: item.businessId ? item.businessId : null,
                name: item.businessName ? item.businessName : null,
                title: item.businessName ? item.businessName : null,
                label: item.businessName ? item.businessName : null,
                abbreviation: item.businessName ? item.businessName : null,
                quotationList: (item.quotationList && item.quotationList.length > 0) ? item.quotationList.map(d => {
                    return {
                        id: d.quotationId ? d.quotationId : null,
                        quotationNumber: d.quotationNumber ? d.quotationNumber || d.name : null,
                        name: d.quotationNumber ? d.quotationNumber : null,
                        title: d.quotationNumber ? d.quotationNumber : null
                    }
                }) : []
            }
        }) : []
        return arrData
    }

    getStorageConfig = (value) => { // 仓储配置
        //console.log('getStorageConfig', value)
        this.setState({
            warehouseDataList: this.changeCustomizedOptionDataType(value)
        })
    }

    getCarrierConfig = (value) => { // 承运商配置
        this.setState({
            carrierList: this.changeCustomizedOptionDataType(value)
        })
    }

    getUsers = () => { //获取项目负责人
        const { rApi } = this.props
        return new Promise((resolve, reject) => {
            rApi.getUsers({
                limit: 999999,
                offset: 0
            }).then(d => {
                //console.log('filterOrderIdGetCarType', d)
                let data = d.list                
                if(data && data.length > 0) {
                    resolve(data.map(item => {
                        return { id: item.id,  name: `${item.username}(${item.organization.title})`}
                    }))
                } else {
                    resolve([])
                }
            }).catch(e => {
                reject(e)
            })
        })
    }

    isHaveTransportOrWarhouse = (value) => {
        let { demandType } = this.state
        return stringToArray(demandType).some(item => item === value)
    }

    getDemandsList = () => { //获取需求名称
        let { rApi } = this.props
        return new Promise((resolve, reject) => {
            rApi.getDemandsList({
                pageSize: 999999, 
                pageNo: 1, 
                clientId: this.state.clientId, 
                processStatus: 4, 
                demandStatus: 1
            }).then(res => {
                res = res.records
                let data = res && res.length > 0 && res.filter(d => d.rejectStatus === 0)
                resolve(data)
            }).catch(e => {
                reject(e)
            })
        })
    }

    // getWarehouseQuotationData = () => { //仓储报价
    //     const { rApi } = this.props
    //     return new Promise((resolve, reject) => {
    //         rApi.getClientQuotation({
    //             limit: 999999,
    //             offset: 0,
    //             clientQuotationType: 2
    //         }).then(d => {
    //             //console.log('filterOrderIdGetCarType', d)
    //             let data = d.records                
    //             if(data && data.length > 0) {
    //                 resolve(data.map(item => {
    //                     return { id: item.id,  name: `${item.name}(${item.idNumber})`}
    //                 }))
    //             } else {
    //                 resolve([])
    //             }
    //         }).catch(e => {
    //             reject(e)
    //         })
    //     })
    // }

    // getOfferCarrierQuotationData = () => { //仓储报价
    //     const { rApi } = this.props
    //     return new Promise((resolve, reject) => {
    //         rApi.getOfferCarrier({
    //             limit: 999999,
    //             offset: 0
    //         }).then(d => {
    //             let data = d.records                
    //             if(data && data.length > 0) {
    //                 resolve(data.map(item => {
    //                     return { id: item.id,  quotationNumber: `${item.quotationNumber}(${item.carrierName})`}
    //                 }))
    //             } else {
    //                 resolve([])
    //             }
    //         }).catch(e => {
    //             reject(e)
    //         })
    //     })
    // }

    render() {
        let {
            requstDone,
            operatorId, // 操作人id
            operatorName, // 操作人名字
            status, // 状态 0-驳回 1-保存 2-提交 3-审核通过
            caeateTime, //创建时间
            loading, //加载中
            carrierList, //运作承运商
            nodeList, 
            warehouseDataList,
            checkAccountPeriod, //对账周期
            clientId, //客户id
            clientName, //客户名称
            clientLegalId, //客户法人id
            clientLegalName, //客户法人名称
            orderLegalId, //接单法人id
            orderLegalName, //接单法人名字
            demandId, //需求id
            demandName, //需求名称
            demandType, //客户需求类型
            id,
            projectName, //项目名字
            projectNumber, //项目编号
            projectStartDate, //项目开始时间
            projectEndDate, //项目结束时间
            removeCooperationProjectBusinessIds,
            transportQuotationList,
            warehouseQuotationList,
            bookingMode, 
            projectDepartmentId, 
            projectDepartmentName, 
            isCustomsClearance, 
            customsBrokerId, 
            customsBrokerName, 
            customsAreaList,
            customsAreaData,
            options,
            reLoadClient,
            reLoadQuotation,
            projectPrincipalId,
            projectPrincipalName
        } = this.state
        const { getFieldDecorator, setFieldsValue } = this.props.form
        //console.log('demandType', demandType, this.isHaveTransportOrWarhouse(1), this.isHaveTransportOrWarhouse(2))
        return (
            <div className='cooperative-project-wrapper' style={{background: '#eee', minHeight: this.props.minHeight}}>
                <Spin spinning={loading} tip="Loading...">
                    <Form layout='inline' onSubmit={this.handleSubmit}>
                        <div style={{maxWidth: 1120, background: '#fff', margin: '0 auto 20px', minHeight: '100%', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.30)', borderRadius: '1px'}}>
                            <div className='flex flex-vertical-center' style={{borderBottom: '1px solid #ddd', padding: '10px'}}>
                                <div className='flex flex-vertical-center'>
                                    <span className="project-name">{projectName}</span>
                                    <span className="project-number">{projectNumber}</span>
                                </div>
                                <div className='flex1'>
                                </div>
                                <div className='flex flex-vertical-center'>
                                    <FunctionPower power={power.EDIT_DATA}>
                                        <FormItem>
                                            <Button 
                                                loading={loading}
                                                htmlType="submit" 
                                                style={{ marginRight: '10px', borderRadius: 0, border: status === 2 ? '1px solid #d9d9d9' : 0, color: status === 2 ? '#d9d9d9' : '#fff', background: status === 2 ? '': '#18B583'}}
                                                disabled={status === 2 ? true : false}
                                            >
                                                保存
                                            </Button>
                                        </FormItem>
                                    </FunctionPower>
                                    {
                                        status === 2 ?
                                        <FunctionPower power={power.STOP_DATA}>
                                            <Button 
                                                loading={loading}
                                                onClick={this.pauseSubmit}
                                                style={{color: 'red', borderColor: 'red', borderRadius: 0}}
                                                disabled={!status ? true : false}
                                            >
                                                暂停
                                            </Button>
                                        </FunctionPower>
                                        :
                                        <FunctionPower power={power.START_DATA}>
                                            <Button 
                                                loading={loading}
                                                onClick={this.poweroffSubmit} 
                                                style={{borderRadius: 0}}
                                                disabled={!status ? true : false}
                                            >
                                                启动
                                            </Button>
                                        </FunctionPower>
                                    }
                                </div>
                            </div>
                            {
                                requstDone === true && !loading ? 
                                <div className='main-content'>
                                    <div className="base-title" style={{marginBottom: '6px'}}>基本信息</div>
                                    <Row gutter={24}>
                                        <Col label="项目名称&emsp;&emsp;" colon span={8} isRequired>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('projectName', {
                                                        initialValue: projectName,
                                                        rules: [
                                                            { 
                                                                required: true, 
                                                                message: '请填写项目名称'
                                                            }
                                                        ],
                                                    })(
                                                        <Input 
                                                            placeholder="" 
                                                            onChange={e => {
                                                                this.setState({projectName: e.target.value})
                                                            }}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col label="项目客户&emsp;&emsp;" colon span={6} isRequired>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('clientId', {
                                                        rules: [
                                                            { 
                                                                required: true, 
                                                                message: '请选择客户名称'
                                                            }
                                                        ],
                                                    })(
                                                        <RemoteSelect
                                                            defaultValue={clientId ? {id: clientId, shortname: clientName} : null}
                                                            onChangeValue={
                                                                value => {
                                                                    this.setState({
                                                                        clientId: value ? value.id : null,
                                                                        clientName: value ? value.title || value.shortname  : null
                                                                    }, () => {
                                                                        let id = value ? value.id : null
                                                                        if (clientId !== id) {
                                                                            this.clearData(true)
                                                                            this.getCheckAccountPeriod(this.state.clientId)
                                                                        }
                                                                    })
                                                                }
                                                            } 
                                                            getData={this.getClientsData}
                                                            labelField={'shortname'}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col label="需求规划&emsp;&emsp;" colon span={6} isRequired>
                                            {
                                                reLoadClient ? 
                                                null
                                                :
                                                <FormItem>
                                                    {
                                                        getFieldDecorator('demandId', {
                                                            rules: [
                                                                { 
                                                                    required: true, 
                                                                    message: '请选择客户需求'
                                                                }
                                                            ],
                                                        })(
                                                            <RemoteSelect
                                                                defaultValue={demandId ? {id: demandId, demandName: demandName} : null}
                                                                onChangeValue={
                                                                    value => {
                                                                        this.setState({
                                                                            demandId: value ? value.id : null,
                                                                            demandName: value ? value.name || value.demandName : null
                                                                        }, () => {
                                                                            let id = value ? value.id : null
                                                                            if (id !== demandId) {
                                                                                this.clearData()
                                                                            }
                                                                        })
                                                                    }
                                                                } 
                                                                getData={this.getDemandsList}
                                                                // getDataMethod={'getDemandsList'}
                                                                // params={{pageSize: 999999, pageNo: 1, clientId: clientId, processStatus: 4, demandStatus: 1}}
                                                                disabled={clientId ? false : true}
                                                                labelField={'demandName'}
                                                            />
                                                        )
                                                    }
                                                </FormItem>
                                            }
                                        </Col>
                                        <Col span={1} />
                                    </Row>
                                    <Row gutter={24} >
                                        <Col label="客户法人&emsp;&emsp;" colon span={8}>
                                            {
                                                reLoadClient ?
                                                null
                                                :
                                                <RemoteSelect
                                                    defaultValue={
                                                        clientLegalName ?
                                                        {
                                                            id: clientLegalName,
                                                            title: clientLegalName,
                                                            name: clientLegalName
                                                        }
                                                        :
                                                        null
                                                    }
                                                    getData={this.getClientLegalData}
                                                    // params={{limit: 999999, offset: 0, clientId: clientId}}
                                                    labelField={'name'}
                                                    disabled={clientId ? false : true}
                                                    onChangeValue={ value => {
                                                        this.setState({
                                                                clientLegalId: null, 
                                                                clientLegalName: value ? value.name : ''
                                                            })
                                                    }}
                                                />
                                            }
                                        </Col>
                                        <Col label="接单法人&emsp;&emsp;" colon span={6} isRequired>
                                            {
                                                reLoadClient ?
                                                null
                                                :
                                                <FormItem>
                                                    {
                                                        getFieldDecorator('orderLegalId', {
                                                            rules: [
                                                                { 
                                                                    required: true, 
                                                                    message: '请选择接单法人'
                                                                }
                                                            ],
                                                        })(
                                                            <RemoteSelect
                                                                defaultValue={
                                                                    orderLegalId && orderLegalName ?
                                                                    {
                                                                        id: orderLegalId,
                                                                        title: orderLegalName,
                                                                        fullName: orderLegalName,
                                                                    }
                                                                    :
                                                                    null
                                                                }
                                                                getDataMethod="getLegalPersonList"
                                                                params={{offset: 0, limit: 999999}}
                                                                labelField='fullName' 
                                                                onChangeValue={(value = {}) => {
                                                                    this.setState(
                                                                        {
                                                                            orderLegalId: value.id, 
                                                                            orderLegalName: value.title
                                                                        })
                                                                }}
                                                            />
                                                        )
                                                    }
                                                </FormItem>
                                            }
                                        </Col>
                                        <Col span={6} label="对账周期&emsp;&emsp;" colon>
                                            {
                                                reLoadClient ?
                                                null
                                                :
                                                <RemoteSelect 
                                                    defaultValue={
                                                        checkAccountPeriod ? {
                                                            id: checkAccountPeriod, 
                                                            name: checkAccountPeriod === -1 ? 
                                                            '自然月' 
                                                            : 
                                                            checkAccountPeriod > 0 ? 
                                                            `${checkAccountPeriod}号` 
                                                            : 
                                                            ''
                                                        } 
                                                        : 
                                                    null}
                                                    placeholder={''}
                                                    disabled={clientId ? false : true}
                                                    onChangeValue={value => 
                                                        {
                                                            if(value && value !== '')
                                                            {
                                                                this.setState({checkAccountPeriod: value.id})
                                                            }
                                                        }}
                                                    labelField='name'
                                                    list={dateSelectData()}
                                                />
                                            }
                                        </Col>
                                        <Col span={1} />
                                    </Row>
                                    <Row gutter={24}>
                                        <Col label="项目周期&emsp;&emsp;" colon span={8} isRequired>
                                            {/* <FormItem>
                                                {
                                                    getFieldDecorator('projectStartDate', {
                                                        initialValue: projectStartDate && projectEndDate ? [moment(projectStartDate ), moment(projectEndDate)] : null,
                                                        rules: [
                                                            { 
                                                                required: true, 
                                                                message: '请填写项目周期'
                                                            }
                                                        ],
                                                    })(
                                                        <RangePicker
                                                            format="YYYY-MM-DD"
                                                            onChange={
                                                                (data, dateString) => {
                                                                    this.setState({
                                                                        projectStartDate: dateString ? dateString[0] : null,
                                                                        projectEndDate: dateString ? dateString[1] : null
                                                                    })
                                                                }
                                                            }
                                                        />
                                                    )
                                                }
                                            </FormItem> */}
                                            <TimePicker
                                                startTime={projectStartDate}
                                                endTime={projectEndDate}
                                                changeStartTime={(date, dateStr) => {
                                                    this.setState({
                                                        projectStartDate: dateStr
                                                    })
                                                }}
                                                changeEndTime={(date, dateStr) => {
                                                    this.setState({
                                                        projectEndDate: dateStr
                                                    })
                                                }}
                                                getFieldDecorator={getFieldDecorator}
                                                isRequired
                                                pickerWidth={{width: 131}}
                                            />
                                        </Col>
                                        {/* <Col label="项目部门&emsp;&emsp;" colon span={6} isRequired>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('projectDepartmentId', {
                                                        initialValue: projectDepartmentId ? stringToArray(projectDepartmentId) : null,
                                                        rules: [
                                                            { 
                                                                required: true, 
                                                                message: '请选择部门'
                                                            }
                                                        ],
                                                    })(
                                                        <Cascader
                                                            //defaultValue={stringToArray(projectDepartmentId)} 
                                                            placeholder="选择部门" 
                                                            options={options} 
                                                            onChange={this.onChange} 
                                                            changeOnSelect 
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        </Col> */}
                                        <Col label="项目负责人&emsp;" colon span={6} isRequired>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('projectPrincipalId', {
                                                        rules: [
                                                            { 
                                                                required: true, 
                                                                message: '请选择项目负责人'
                                                            }
                                                        ],
                                                    })(
                                                        <RemoteSelect
                                                            defaultValue={
                                                                projectPrincipalId ?
                                                                {
                                                                    id: projectPrincipalId,
                                                                    name: projectPrincipalName
                                                                }
                                                                :
                                                                null
                                                            }
                                                            //getDataMethod="getUsers"
                                                            params={{offset: 0, limit: 999999}}
                                                            getData={this.getUsers}
                                                            labelField='name' 
                                                            onChangeValue={(value = {}) => {
                                                                this.setState(
                                                                    {
                                                                        projectPrincipalId: value.id, 
                                                                        projectPrincipalName: value.title
                                                                    })
                                                            }}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col label="是否预订单&emsp;&emsp;" colon span={6}>
                                            {/* <RadioGroup 
                                                onChange={(e) => {
                                                    this.setState({
                                                        bookingMode: e.target.value
                                                    })
                                                }} 
                                                value={bookingMode ? bookingMode : -1}
                                            >
                                                <Radio value={-1}>否</Radio>
                                                <Radio value={1}>是</Radio>
                                            </RadioGroup> */}
                                            <Switch 
                                                defaultChecked={bookingMode === 1 ? true : false}
                                                style={{verticalAlign: 'sub'}}
                                                size="small"
                                                onChange={checked => {
                                                    this.setState({
                                                        bookingMode: checked === true ? 1 : -1
                                                    })
                                                }} 
                                            />
                                        </Col> 
                                        <Col span={1} />
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={7} label="业务模式&emsp;&emsp;" colon> 
                                            {
                                                this.filterDemandTypeData(demandType)
                                            }
                                        </Col>     
                                    </Row>
                                    <div className="base-title">项目配置</div>
                                    {
                                        clientId && demandId ?
                                        <Row gutter={24}>
                                            <Col isRequired={this.isHaveTransportOrWarhouse(1) ? true : false} label="运输报价&emsp;&emsp;&emsp;" colon span={24} contentStyle={{whiteSpace: 'normal'}}>
                                                {
                                                    reLoadQuotation ?
                                                    null
                                                    :
                                                    <SelectMulti
                                                        defaultValue={this.changeSelectMultiData(transportQuotationList) ? this.changeSelectMultiData(transportQuotationList) : []}
                                                        getDataMethod='getClientQuotation'
                                                        labelField='quotationNumber'
                                                        dataKey='records'
                                                        params={{clientQuotationType: 1, limit: 9999999, offset: 0, keyWords: clientName, demandId: demandId, quotationStatus: 4}}
                                                        isTransportQuotation={true}
                                                        handleChangeSelect={this.handleChangeTransport}
                                                    />
                                                }
                                            </Col>
                                        </Row> 
                                        :
                                        null
                                    }
                                    {/* {
                                        clientId && demandId ?
                                        <Row gutter={24}>
                                            <Col label="仓储报价&emsp;&emsp;&emsp;" colon span={24} contentStyle={{whiteSpace: 'normal'}}>
                                                {
                                                    reLoadQuotation ?
                                                    null
                                                    :
                                                    <SelectMulti
                                                        defaultValue={this.changeSelectMultiData(warehouseQuotationList) ? this.changeSelectMultiData(warehouseQuotationList) : []}
                                                        getDataMethod='getClientQuotation'
                                                        labelField='quotationNumber'
                                                        dataKey='records'
                                                        params={{clientQuotationType: 2, limit: 9999999, offset: 0, keyWords: clientName, demandId: demandId, quotationStatus: 4}}
                                                        handleChangeSelect={this.handleChangeStorage}
                                                    />
                                                }
                                            </Col>
                                        </Row> 
                                        :
                                        null
                                    } */}
                                    <div className="flex" style={{margin: '10px 0', position:'relative'}}>
                                        <div style={{width: 84, color: 'rgb(136, 136, 136)'}}>仓储配置</div>
                                        <div style={{background: '#F7F7F7', borderRadius: 1, padding: '10px', minWidth: 500, maxWidth: 950, maxHeight: 255, overflow: 'auto'}}>
                                            <CustomizedOption 
                                                defaultValue={this.changDataTypeToCustomizedOption(warehouseDataList)}
                                                getOnChangeVul={this.getStorageConfig}
                                                //labelVul={'需求车型'}
                                                filterDataOne={{placeholder: '选择仓库', getDataMethod: 'getWarehouseList', params: { pageSize: 99999, pageNo: 1 }, labelField: 'name' }}
                                                filterData={{ placeholder: '选择仓储报价', getDataMethod: 'getClientQuotation', params: { clientQuotationType: 2, limit: 9999999, offset: 0}, labelField: 'quotationNumber' }}
                                                filterQuotationId="warehouseId"
                                                // getData={this.getWarehouseQuotationData}
                                            />
                                        </div>
                                    </div>
                                    <Row gutter={24}>
                                        <Col label="中转地配置&emsp;&emsp;" colon span={24} contentStyle={{whiteSpace: 'normal'}}>
                                            <SelectMulti
                                                defaultValue={this.changeSelectMultiData(nodeList) ? this.changeSelectMultiData(nodeList) : []}
                                                getDataMethod='getNodeList'
                                                labelField='name'
                                                dataKey='records'
                                                params={{limit: 9999999, offset: 0}}
                                                handleChangeSelect={this.handleChangeNode}
                                            />
                                        </Col>
                                    </Row> 
                                    {/* <Row gutter={24} style={{height: 32}}>
                                        <Col  label="是否报关&emsp;&emsp;&emsp;" colon span={6}>
                                            <div className="flex flex-vertical-center">
                                                <RadioGroup 
                                                    onChange={e => {
                                                        this.setState({
                                                            isCustomsClearance: e.target.value
                                                        })
                                                    }} 
                                                    value={isCustomsClearance ? isCustomsClearance : 1}
                                                    defaultValue={isCustomsClearance ? isCustomsClearance : 1}
                                                    >
                                                        <Radio value={1}>是</Radio>
                                                        <Radio value={-1}>否</Radio>
                                                </RadioGroup>
                                            </div>
                                        </Col>
                                        {
                                            isCustomsClearance === -1 ?
                                            null
                                            :
                                            <Col label="指定报关行&emsp;&emsp;" colon span={6}>
                                                <div className="flex flex-vertical-center">
                                                    <RemoteSelect
                                                        defaultValue={
                                                            customsBrokerId ?
                                                            {
                                                                id: customsBrokerId,
                                                                title: customsBrokerName,
                                                                abbreviation: customsBrokerName,
                                                            }
                                                            :
                                                            null
                                                        }
                                                        labelField={'abbreviation'}
                                                        getDataMethod={'getCarrierList'}
                                                        onChangeValue={(value = {}) => {
                                                            this.setState(
                                                                {
                                                                    customsBrokerId: value.id, 
                                                                    customsBrokerName: value.title || value.abbreviation
                                                                }
                                                            )
                                                        }}
                                                    />
                                                </div>
                                            </Col>
                                        }
                                        <Col span={8} />
                                    </Row>
                                    <Row gutter={24}>
                                        <Col label="添加关区&emsp;&emsp;&emsp;" colon span={24} contentStyle={{whiteSpace: 'normal'}}>
                                                <MultiInputButton 
                                                    defaultValue= {customsAreaData}
                                                    handleChangeInput={this.handleChangeInput} 
                                                />
                                        </Col>
                                    </Row>*/}
                                    {/* <Row gutter={24}> 
                                        <Col label="运作承运商&emsp;&emsp;" colon span={24} contentStyle={{whiteSpace: 'normal'}}>
                                            <SelectMulti
                                                defaultValue={this.changeSelectMultiData(carrierList)}
                                                labelField={'abbreviation'}
                                                getDataMethod={'getCooperationCarriet'}
                                                //dataKey='records'
                                                // params={{limit: 999999, offset: 0}}
                                                handleChangeSelect={this.handleChangeCarrie}
                                                />
                                        </Col>
                                    </Row> */}
                                    <div className="flex" style={{margin: '10px 0'}}>
                                        <div style={{width: 84, color: 'rgb(136, 136, 136)'}}>承运商配置</div>
                                        <div style={{background: '#F7F7F7', borderRadius: 1, padding: '10px', minWidth: 500, maxWidth: 950, maxHeight: 255,  overflow: 'auto'}}>
                                            <CustomizedOption 
                                                defaultValue={this.changDataTypeToCustomizedOption(carrierList)}
                                                getOnChangeVul={this.getCarrierConfig}
                                                //labelVul={'需求车型'}
                                                filterDataOne={{placeholder: '选择承运商', getDataMethod: 'getCooperationCarriet', params: { limit: 9999999, offset: 0 }, labelField: 'abbreviation' }}
                                                filterData={{ placeholder: '选择报价', getDataMethod: '', params: { limit: 9999999, offset: 0}, labelField: 'quotationNumber' }}
                                                filterQuotationId="carrierId"
                                               // getData={this.getOfferCarrierQuotationData}
                                            />
                                        </div>
                                    </div>
                                </div>
                                :
                                null
                            }
                        </div>
                    </Form>
                </Spin>
            </div>
        )
    }
}
 
export default Form.create()(CooperativeProjectDetails);