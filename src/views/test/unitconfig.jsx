import React, {Component} from 'react'
import { Button, Form, message, Icon, Popconfirm, DatePicker, Input, Spin, Tabs, Cascader, Radio, Switch, Select} from 'antd'
import { inject, observer } from "mobx-react"
import MultiInputButton from '@src/components/select_multi_input'
import RemoteSelect from '@src/components/select_databook'
import SelectMulti from '@src/components/select_multi'
import { children, id } from './power'
// import { deleteNull } from '@src/utils'
import { Row, Col } from '@src/components/grid'
import moment from 'moment'
import { toCooperativeList } from '@src/views/layout/to_page'
import FormItem from '@src/components/FormItem'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { isArray, stringToArray } from '@src/utils'
import './index.less'

const Option = Select.Option
const RadioGroup = Radio.Group
const TabPane = Tabs.TabPane
const power = Object.assign({}, children, id)
const { TextArea } = Input
const { RangePicker } = DatePicker

/**
 * 单位配置
 * 
 * @class UnitConfig
 * @extends {Component}
 */
@inject('mobxTabsData', 'mobxDataBook')
@inject('rApi')
@observer
class UnitConfig extends Component {

    state = {
        requstDone: true,
        loading: true, //加载中
        unitList: [], //物料单位值
        costList: [], //费用单位值
        countUnitSelected: [], //数量已选择物料单位
        countCostSelected: [], //数量已选择费用单位
        boxUnitSelected: [], //箱量已选择物料单位
        boxCostSelected: [], //箱量已选择费用单位
        boardUnitSelected: [], //板量已选择物料单位
        boardCostSelected: [], //板量已选择费用单位
        grossWeightUnitSelected: [], //毛重已选择物料单位
        grossWeighCostSelected: [], //毛重已选择费用单位
        netWeightUnitSelected: [], //净重已选择物料单位
        netWeightCostSelected: [], //净重已选择费用单位
        volumeUnitSelected: [], //体积已选择物料单位
        volumeCostSelected: [], //体积已选择费用单位
        countSelected: {
            materialUnitList: [],
            billingUnitList: []
        },
        boxSelected: {
            materialUnitList: [],
            billingUnitList: []
        },
        boardSelected: {
            materialUnitList: [],
            billingUnitList: []
        },
        grossWeighSelected: {
            materialUnitList: [],
            billingUnitList: []
        },
        netWeightSelected: {
            materialUnitList: [],
            billingUnitList: []
        },
        volumeSelected: {
            materialUnitList: [],
            billingUnitList: []
        },
        tt: [],
        buttonLoading: false
    }

    constructor(props) {
        super(props)
    }

    componentDidMount(){
        this.getList()
    }

    initSelected (pageData) {
        // 初始化单位配置
        this.openUnitList().then(list => {
            //console.log('openUnitList list', list)
            if (pageData.quantityList.length > 0) {
                pageData.quantityList[0].materialUnitList.forEach(item => {
                    list.forEach(unit => {
                        if (unit.props.value === item.materialUnitId) {
                            this.selectUnit(unit.props.value, unit, this.state.countUnitSelected, 'countUnitSelected', 'countSelected')
                        }
                    })
                })
            }
            if (pageData.boxCountList.length > 0) {
                pageData.boxCountList[0].materialUnitList.forEach(item => {
                    list.forEach(unit => {
                        if (unit.props.value === item.materialUnitId) {
                            this.selectUnit(unit.props.value, unit, this.state.boxUnitSelected, 'boxUnitSelected', 'boxSelected')
                        }
                    })
                })
            }
            if (pageData.boardCountList.length > 0) {
                pageData.boardCountList[0].materialUnitList.forEach(item => {
                    list.forEach(unit => {
                        if (unit.props.value === item.materialUnitId) {
                            this.selectUnit(unit.props.value, unit, this.state.boardUnitSelected, 'boardUnitSelected', 'boardSelected')
                        }
                    })
                })
            }
        })
        // this.openCostList(list => {
        //     if (pageData.quantityList.length > 0) {
        //         pageData.quantityList.forEach(item => {
        //             list.forEach(unit => {
        //                 if (unit.props.value === item.billingUnitId) {
        //                     this.selectCost(unit.props.value, unit, this.state.countCostSelected, 'countCostSelected', 'countSelected')
        //                 }
        //             })
        //         })
        //     }
        //     if (pageData.boxCountList.length > 0) {
        //         pageData.boxCountList.forEach(item => {
        //             list.forEach(unit => {
        //                 if (unit.props.value === item.billingUnitId) {
        //                     this.selectCost(unit.props.value, unit, this.state.boxCostSelected, 'boxCostSelected', 'boxSelected')
        //                 }
        //             })
        //         })
        //     }
        //     if (pageData.boardCountList.length > 0) {
        //         pageData.boardCountList.forEach(item => {
        //             list.forEach(unit => {
        //                 if (unit.props.value === item.billingUnitId) {
        //                     this.selectCost(unit.props.value, unit, this.state.boardCostSelected, 'boardCostSelected', 'boardSelected')
        //                 }
        //             })
        //         })
        //     }
        // })
    }

    getList = () => {
        let { rApi } = this.props
        this.setState({
            loading: true
        })
        rApi.getUnitConfig().then(item => {
            //console.log('getUnitConfig', item)
            this.setState({
                countUnitSelected: [item.quantityList[0].billingUnitName], //数量已选择物料单位
                countCostSelected: this.getTitleVul(item.quantityList[0].materialUnitList), //数量已选择费用单位
                boxUnitSelected: [item.boxCountList[0].billingUnitName], //箱量已选择物料单位
                boxCostSelected:this.getTitleVul(item.boxCountList[0].materialUnitList), //箱量已选择费用单位
                boardUnitSelected: [item.boardCountList[0].billingUnitName], //板量已选择物料单位
                boardCostSelected: this.getTitleVul(item.boardCountList[0].materialUnitList), //板量已选择费用单位
                grossWeighCostSelected: [item.grossWeightList[0].billingUnitName], //毛重已选择物料单位
                grossWeightUnitSelected: this.getTitleVul(item.grossWeightList[0].materialUnitList), //毛重已选择费用单位
                netWeightCostSelected: [item.netWeightList[0].billingUnitName], //净重已选择物料单位
                netWeightUnitSelected: this.getTitleVul(item.netWeightList[0].materialUnitList), //净重已选择费用单位
                volumeCostSelected: [item.volumeList[0].billingUnitName], //体积已选择物料单位
                volumeUnitSelected: this.getTitleVul(item.volumeList[0].materialUnitList), //体积已选择费用单位
            })
            this.initSelected(item)
            this.showView()
        }).catch(e => {
            this.loadingFalse()
        })
    }

    getTitleVul = (value) => { //格式化物料单位
        if (value && value.length > 0) {
            return value.map(item => {
                return item.materialUnitName
            })
        }
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

    // handleSubmit = (e) => {
    //     e.preventDefault();
    //     this.props.form.validateFields((err, values) => {
    //       if (!err) {
    //         //console.log('Received values of form: ', values);
    //         this.saveSubmit()
    //       }
    //     });
    // }

    saveSubmit = () => { //保存请求
        //console.log('handleSubmit handleSubmit')
        let {
            countSelected,
            boxSelected,
            boardSelected,
            grossWeighSelected,
            netWeightSelected,
            volumeSelected,
        } = this.state
        this.setState({
            buttonLoading: true
        })
        this.props.rApi.addUnitConfig({
            quantity: countSelected,
            boxCount: boxSelected,
            boardCount: boardSelected,
            grossWeight: {
                billingUnitList: [{billingUnitId: 122, billingUnitName: 'kg'}],
                materialUnitList: [{materialUnitId: 146, materialUnitName: 'kg'}]
            },
            netWeight: {
                billingUnitList: [{billingUnitId: 122, billingUnitName: 'kg'}],
                materialUnitList: [{materialUnitId: 146, materialUnitName: 'kg'}]
            },
            volume: {
                billingUnitList: [{billingUnitId: 123, billingUnitName: 'm³'}],
                materialUnitList: [{materialUnitId: 147, materialUnitName: 'm³'}]
            }
        }).then(d => {
            this.setState({
                buttonLoading: false
            })
            message.success('保存成功！')
            this.getList()
        }).catch(e => {
            message.error(e.msg || '操作失败！')
            this.setState({
                buttonLoading: false
            })
        })
    }
    
    openUnitList = (callback) => {
        //物料单位展开下拉
        const { mobxDataBook} = this.props
        // const a = mobxDataBook.getBookType('物料单位')
        mobxDataBook.initData('物料单位').then(res => {
            // console.log(res)
            let unitList = this.state.unitList
            let countUnitSelected = this.state.countUnitSelected
            let boxUnitSelected = this.state.boxUnitSelected
            let boardUnitSelected = this.state.boardUnitSelected
            let len = unitList.length
            let sumLen = countUnitSelected.length + boxUnitSelected.length + boardUnitSelected.length
            if (len === 0 && sumLen <= 3) {
                res.forEach(item => {
                    let opt = <Option key={item.id} value={item.id}>{item.title}</Option>
                    unitList.push(opt)
                })
            }
            //console.log('openUnitList unitList', unitList, res, len, sumLen)
            this.setState({unitList: unitList})
            callback(unitList)
        }).catch(err => {
            console.log(err)
        })
    }

    selectUnit = (val, opt, selectArr, keyName, dataKey) => {
        // 选择物料单位
        // console.log(opt.props)
        selectArr.push(val)
        this.state[dataKey].materialUnitList.push({
            materialUnitId: val,
            materialUnitName: opt.props.children
        })
        let index = this.state.unitList.indexOf(opt)
        this.state.unitList.splice(index, 1)
        this.setState({
            [keyName]: selectArr,
            unitList: this.state.unitList,
            [dataKey]: this.state[dataKey]
        })
    }

    unSelectUnit = (val, opt, selectArr, keyName, dataKey) => {
        // 取消选择物料单位
        let index = selectArr.indexOf(parseInt(opt.key)) 
        selectArr.splice(index, 1)
        this.state[dataKey].materialUnitList.splice(index, 1)
        this.state.unitList.push(opt)
        this.setState({
            [keyName]: selectArr,
            unitList: this.state.unitList,
            [dataKey]: this.state[dataKey]
        })
    }

    openCostList = (callback) => {
        // 费用单位展开下拉
        const { mobxDataBook } = this.props
        mobxDataBook.initData('费用单位').then(res => {
            // console.log(res)
            let len = this.state.costList.length
            let sumLen = this.state.countCostSelected.length + this.state.boxCostSelected.length + this.state.boardCostSelected.length
            if (len === 0 && sumLen === 0) {
                res.forEach(item => {
                    let opt = <Option key={item.id} value={item.id}>{item.title}</Option>
                    this.state.costList.push(opt)
                })
            }
            this.setState({ costList: this.state.costList }, () => {
                if (callback) {
                    callback(this.state.costList)
                }
            })
        }).catch(err => {
            console.log(err)
        })
    }

    selectCost = (val, opt, selectArr, keyName, dataKey) => {
        // 选择费用单位
        selectArr.push(val)
        this.state[dataKey].billingUnitList.push({
            billingUnitId: val,
            billingUnitName: opt.props.children
        })
        let index = this.state.costList.indexOf(opt)
        this.state.costList.splice(index, 1)
        this.setState({
            [keyName]: selectArr,
            costList: this.state.costList,
            [dataKey]: this.state[dataKey]
        })
    }

    unSelectCost = (val, opt, selectArr, keyName, dataKey) => {
        // 取消选择费用单位
        let index = selectArr.indexOf(parseInt(opt.key))
        selectArr.splice(index, 1)
        this.state[dataKey].billingUnitList.splice(index, 1)
        this.state.costList.push(opt)
        this.setState({
            [keyName]: selectArr,
            costList: this.state.costList,
            [dataKey]: this.state[dataKey]
        })
    }

    render() {
        let {
            requstDone,
            loading,
            customsBrokerId, 
            customsBrokerName, 
            customsAreaList,
            customsAreaData,
            options,
            reLoadClient,
            reLoadQuotation,
            grossWeightUnitSelected, //毛重已选择物料单位
            grossWeighCostSelected, //毛重已选择费用单位
            netWeightUnitSelected, //净重已选择物料单位
            netWeightCostSelected, //净重已选择费用单位
            volumeUnitSelected, //体积已选择物料单位
            volumeCostSelected,
            buttonLoading
        } = this.state
        const { getFieldDecorator, setFieldsValue } = this.props.form
        //console.log('this.state.boardCostSelected', this.state.boardCostSelected)
        return (
            <div className='cooperative-project-wrapper' style={{background: '#eee', minHeight: this.props.minHeight}}>
                <Spin spinning={loading} tip="Loading...">
                    <Form layout='inline' onSubmit={this.handleSubmit}>
                        <div style={{maxWidth: 1000, background: '#fff', margin: '0 auto', minHeight: this.props.minHeight}}>
                            <div className='flex flex-vertical-center' style={{borderBottom: '1px solid #eee',padding: '5px 25px'}}>
                                <div className="flex1"></div>
                                <div style={{width: 100}}>
                                    <Button 
                                        icon='save' 
                                        onClick={this.saveSubmit} 
                                        style={{ marginRight: '10px'}}
                                        loading={buttonLoading}
                                        //disabled={(status === 2 || status === 3) ? true : false}
                                    >
                                        保存
                                    </Button>
                                </div>
                            </div>
                            <div className='demand-detailes' style={{padding: '20px 25px'}}>
                                <div style={{marginTop: '20px'}}>  
                                <div style={{color: 'rgba(0, 150, 136, 1)', margin: '5px 0'}}>单位配置</div>
                                <div className='unitcost'>
                                    <div className='unitcost-item'>
                                        <span className='typename'>数量</span>
                                        <div className='typecontent'>
                                            <div className='item-row'>
                                                <span className='itemname'>选择物料单位:</span>
                                                <Select
                                                    mode="multiple"
                                                    placeholder="请选择物料单位"
                                                    notFoundContent='无多余可分配物料单位'
                                                    value={this.state.countUnitSelected}
                                                    onFocus={this.openUnitList}
                                                    style={{ width: '50%' }}
                                                    onSelect={(val, opt) => {
                                                        this.selectUnit(val, opt, this.state.countUnitSelected, 'countUnitSelected', 'countSelected')
                                                    }}
                                                    onDeselect={(val, opt) => {
                                                        this.unSelectUnit(val, opt, this.state.countUnitSelected, 'countUnitSelected', 'countSelected')
                                                    }}
                                                >
                                                    {this.state.unitList}
                                                </Select>
                                            </div>
                                            <div className='item-row'>
                                                <span className='itemname'>选择费用单位:</span>
                                                <Select
                                                    mode="multiple"
                                                    placeholder="请选择费用单位"
                                                    notFoundContent='无多余可分配费用单位'
                                                    value={this.state.countCostSelected}
                                                    onFocus={this.openCostList}
                                                    onSelect={(val, opt) => {
                                                        this.selectCost(val, opt, this.state.countCostSelected, 'countCostSelected', 'countSelected')
                                                    }}
                                                    onDeselect={(val, opt) => {
                                                        this.unSelectCost(val, opt, this.state.countCostSelected, 'countCostSelected', 'countSelected')
                                                    }}
                                                    style={{ width: '50%' }}
                                                >
                                                    {this.state.costList}
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='unitcost-item'>
                                        <span className='typename'>箱量</span>
                                        <div className='typecontent'>
                                            <div className='item-row'>
                                                <span className='itemname'>选择物料单位:</span>
                                                <Select
                                                    mode="multiple"
                                                    placeholder="请选择物料单位"
                                                    notFoundContent='无多余可分配物料单位'
                                                    value={this.state.boxUnitSelected}
                                                    onFocus={this.openUnitList}
                                                    style={{ width: '50%' }}
                                                    onSelect={(val, opt) => {
                                                        this.selectUnit(val, opt, this.state.boxUnitSelected, 'boxUnitSelected', 'boxSelected')
                                                    }}
                                                    onDeselect={(val, opt) => {
                                                        this.unSelectUnit(val, opt, this.state.boxUnitSelected, 'boxUnitSelected', 'boxSelected')
                                                    }}
                                                    style={{ width: '50%' }}
                                                >
                                                    {this.state.unitList}
                                                </Select>
                                            </div>
                                            <div className='item-row'>
                                                <span className='itemname'>选择费用单位:</span>
                                                <Select
                                                    mode="multiple"
                                                    placeholder="请选择费用单位"
                                                    notFoundContent='无多余可分配费用单位'
                                                    value={this.state.boxCostSelected}
                                                    onFocus={this.openCostList}
                                                    onSelect={(val, opt) => {
                                                        this.selectCost(val, opt, this.state.boxCostSelected, 'boxCostSelected', 'boxSelected')
                                                    }}
                                                    onDeselect={(val, opt) => {
                                                        this.unSelectCost(val, opt, this.state.boxCostSelected, 'boxCostSelected', 'boxSelected')
                                                    }}
                                                    style={{ width: '50%' }}
                                                >
                                                    {this.state.costList}
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='unitcost-item'>
                                        <span className='typename'>板数</span>
                                        <div className='typecontent'>
                                            <div className='item-row'>
                                                <span className='itemname'>选择物料单位:</span>
                                                <Select
                                                    mode="multiple"
                                                    placeholder="请选择物料单位"
                                                    notFoundContent='无多余可分配物料单位'
                                                    value={this.state.boardUnitSelected}
                                                    onFocus={this.openUnitList}
                                                    style={{ width: '50%' }}
                                                    onSelect={(val, opt) => {
                                                        this.selectUnit(val, opt, this.state.boardUnitSelected, 'boardUnitSelected', 'boardSelected')
                                                    }}
                                                    onDeselect={(val, opt) => {
                                                        this.unSelectUnit(val, opt, this.state.boardUnitSelected, 'boardUnitSelected', 'boardSelected')
                                                    }}
                                                    style={{ width: '50%' }}
                                                >
                                                    {this.state.unitList}
                                                </Select>
                                            </div>
                                            <div className='item-row'>
                                                <span className='itemname'>选择费用单位:</span>
                                                <Select
                                                    mode="multiple"
                                                    placeholder="请选择费用单位"
                                                    notFoundContent='无多余可分配费用单位'
                                                    value={this.state.boardCostSelected}
                                                    onFocus={this.openCostList}
                                                    onSelect={(val, opt) => {
                                                        this.selectCost(val, opt, this.state.boardCostSelected, 'boardCostSelected', 'boardSelected')
                                                    }}
                                                    onDeselect={(val, opt) => {
                                                        this.unSelectCost(val, opt, this.state.boardCostSelected, 'boardCostSelected', 'boardSelected')
                                                    }}
                                                    style={{ width: '50%' }}
                                                >
                                                    {this.state.costList}
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='unitcost-item'>
                                        <span className='typename'>毛重</span>
                                        <div className='typecontent'>
                                            <div className='item-row'>
                                                <span className='itemname'>选择物料单位:</span>
                                                <Select
                                                    mode="multiple"
                                                    placeholder="请选择物料单位"
                                                    notFoundContent='无多余可分配物料单位'
                                                    value={grossWeightUnitSelected ? grossWeightUnitSelected : ['kg']}
                                                    style={{ width: '50%' }}
                                                    onFocus={this.openUnitList}
                                                    disabled={true}
                                                    // onSelect={(val, opt) => {
                                                    //     this.selectUnit(val, opt, this.state.grossWeightUnitSelected, 'grossWeightUnitSelected', 'grossWeightSelected')
                                                    // }}
                                                    // onDeselect={(val, opt) => {
                                                    //     this.unSelectUnit(val, opt, this.state.grossWeightUnitSelected, 'grossWeightUnitSelected', 'grossWeightSelected')
                                                    // }}
                                                    style={{ width: '50%' }}
                                                >
                                                    {this.state.unitList}
                                                </Select>
                                            </div>
                                            <div className='item-row'>
                                                <span className='itemname'>选择费用单位:</span>
                                                <Select
                                                    mode="multiple"
                                                    placeholder="请选择费用单位"
                                                    notFoundContent='无多余可分配费用单位'
                                                    value={grossWeighCostSelected ? grossWeighCostSelected : ['kg']}
                                                    disabled={true}
                                                    onFocus={this.openCostList}
                                                    // onSelect={(val, opt) => {
                                                    //     this.selectCost(val, opt, this.state.boardCostSelected, 'boardCostSelected', 'boardSelected')
                                                    // }}
                                                    // onDeselect={(val, opt) => {
                                                    //     this.unSelectCost(val, opt, this.state.boardCostSelected, 'boardCostSelected', 'boardSelected')
                                                    // }}
                                                    style={{ width: '50%' }}
                                                >
                                                    {this.state.costList}
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='unitcost-item'>
                                        <span className='typename'>净重</span>
                                        <div className='typecontent'>
                                            <div className='item-row'>
                                                <span className='itemname'>选择物料单位:</span>
                                                <Select
                                                    mode="multiple"
                                                    placeholder="请选择物料单位"
                                                    notFoundContent='无多余可分配物料单位'
                                                    value={netWeightUnitSelected ? netWeightUnitSelected : ['kg']}
                                                    disabled={true}
                                                    onFocus={this.openUnitList}
                                                    style={{ width: '50%' }}
                                                    // onSelect={(val, opt) => {
                                                    //     this.selectUnit(val, opt, this.state.grossWeightUnitSelected, 'grossWeightUnitSelected', 'grossWeightSelected')
                                                    // }}
                                                    // onDeselect={(val, opt) => {
                                                    //     this.unSelectUnit(val, opt, this.state.grossWeightUnitSelected, 'grossWeightUnitSelected', 'grossWeightSelected')
                                                    // }}
                                                    style={{ width: '50%' }}
                                                >
                                                    {this.state.unitList}
                                                </Select>
                                            </div>
                                            <div className='item-row'>
                                                <span className='itemname'>选择费用单位:</span>
                                                <Select
                                                    mode="multiple"
                                                    placeholder="请选择费用单位"
                                                    notFoundContent='无多余可分配费用单位'
                                                    value={netWeightCostSelected ? netWeightCostSelected : ['kg']}
                                                    disabled={true}
                                                    onFocus={this.openCostList}
                                                    // onSelect={(val, opt) => {
                                                    //     this.selectCost(val, opt, this.state.boardCostSelected, 'boardCostSelected', 'boardSelected')
                                                    // }}
                                                    // onDeselect={(val, opt) => {
                                                    //     this.unSelectCost(val, opt, this.state.boardCostSelected, 'boardCostSelected', 'boardSelected')
                                                    // }}
                                                    style={{ width: '50%' }}
                                                >
                                                    {this.state.costList}
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='unitcost-item'>
                                        <span className='typename'>体积</span>
                                        <div className='typecontent'>
                                            <div className='item-row'>
                                                <span className='itemname'>选择物料单位:</span>
                                                <Select
                                                    mode="multiple"
                                                    placeholder="请选择物料单位"
                                                    notFoundContent='无多余可分配物料单位'
                                                    value={volumeUnitSelected ? volumeUnitSelected : ['m³']}
                                                    onFocus={this.openUnitList}
                                                    style={{ width: '50%' }}
                                                    disabled={true}
                                                    // onSelect={(val, opt) => {
                                                    //     this.selectUnit(val, opt, this.state.grossWeightUnitSelected, 'grossWeightUnitSelected', 'grossWeightSelected')
                                                    // }}
                                                    // onDeselect={(val, opt) => {
                                                    //     this.unSelectUnit(val, opt, this.state.grossWeightUnitSelected, 'grossWeightUnitSelected', 'grossWeightSelected')
                                                    // }}
                                                    style={{ width: '50%' }}
                                                >
                                                    {this.state.unitList}
                                                </Select>
                                            </div>
                                            <div className='item-row'>
                                                <span className='itemname'>选择费用单位:</span>
                                                <Select
                                                    mode="multiple"
                                                    placeholder="请选择费用单位"
                                                    notFoundContent='无多余可分配费用单位'
                                                    value={volumeCostSelected ? volumeCostSelected : ['m³']}
                                                    onFocus={this.openCostList}
                                                    disabled={true}
                                                    // onSelect={(val, opt) => {
                                                    //     this.selectCost(val, opt, this.state.boardCostSelected, 'boardCostSelected', 'boardSelected')
                                                    // }}
                                                    // onDeselect={(val, opt) => {
                                                    //     this.unSelectCost(val, opt, this.state.boardCostSelected, 'boardCostSelected', 'boardSelected')
                                                    // }}
                                                    style={{ width: '50%' }}
                                                >
                                                    {this.state.costList}
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                                </div>
                            </div>
                        </div>
                    </Form>
                </Spin>
            </div>
        )
    }
}
 
export default Form.create()(UnitConfig);