import React, { Component } from 'react';
import { Spin, message } from 'antd';
import { inject, observer } from "mobx-react"
import { children, id } from './power'
import UnitTable from './unittable'

const power = Object.assign({}, children, id)

@inject('mobxTabsData', 'mobxDataBook')
@inject('rApi') 
@observer 
class UnitConfig extends Component {

    state = {
        costList: [], //未被选中费用单位
        unitList: [], //未被选中物料单位
        otherList: [], //其他单位
        loading: false,
        data: [
            {
                desc: '物料单位配置',
                isEdit: false,
                quantity: [],
                boxCount: [],
                boardCount: [],
                grossWeight: [],
                volume: [],
                other: []
            },
            {
                desc: '费用单位配置',
                isEdit: false,
                quantity: [],
                boxCount: [],
                boardCount: []
            }
        ],
        buttonLoading: false
    }
    
    componentDidMount() {
        this.getCostList()
        this.getList()
        this.getOtherUnit()
    }

    getList = () => {  //获取保存数据
        let { rApi } = this.props
        this.setState({
            loading: true
        })
        rApi.getUnitConfig({
            unitClassification: 1
        }).then(item => {
           //console.log('getUnitConfig', item)
            let res = [
                {
                    desc: '物料单位配置',
                    isEdit: false,
                    quantity: this.changeMaterialVul(item.quantity.materialUnitList),
                    boxCount: this.changeMaterialVul(item.boxCount.materialUnitList),
                    boardCount: this.changeMaterialVul(item.boardCount.materialUnitList),
                    grossWeight: this.changeMaterialVul(item.grossWeight.materialUnitList),
                    volume: this.changeMaterialVul(item.volume.materialUnitList),
                    other: this.changeMaterialVul(item.other.materialUnitList)
                },
                {
                    desc: '费用单位配置',
                    isEdit: false,
                    quantity: this.changeBillingVul(item.quantity.billingUnitList),
                    boxCount: this.changeBillingVul(item.boxCount.billingUnitList),
                    boardCount: this.changeBillingVul(item.boardCount.billingUnitList),
                    grossWeight: this.changeMaterialVul(item.grossWeight.billingUnitList),
                    volume: this.changeMaterialVul(item.volume.billingUnitList),
                    other: this.changeMaterialVul(item.other.billingUnitList)
                }
            ]
            this.setState({
                data: res
            })
            this.loadingFalse()
        }).catch(e => {
            this.loadingFalse()
        })
    }

    changeMaterialVul = (value) => { //格式化物料单位
        if (value && value.length > 0) {
            return value.map(item => {
                return {
                    key: item.billingUnitId,
                    label: item.billingUnitName,
                    title: item.billingUnitName,
                    id: item.billingUnitId
                }
            })
        }
    }

    changeBillingVul = (value) => { //格式化费用单位数据
        if (value && value.length > 0) {
            return value.map(item => {
                return {
                    key: item.billingUnitId,
                    label: item.billingUnitName,
                    title: item.billingUnitName,
                    id: item.billingUnitId
                }
            })
        }
    }
    
    getCostList = (callback) => { //获取计量单位
        const { mobxDataBook } = this.props
        let text = '计量单位'
        let { costList } = this.state
        let typeId = mobxDataBook.getBookType(text)
        this.setState({
            loading: true
        })
        //console.log('getCostList')
        mobxDataBook.initData(text).then(res => {
            let d = this.getIdAndTitleArray(mobxDataBook.databook[typeId.id])
            let result = d && d.length > 0 ? d.filter(item => item.id !== 122 && item.id !== 123 && item.title !== 'kg' && item.title !== 'KG' && item.title !== 'm³' ) : []
            this.originCostList = result
            this.originUnitList = result
            this.setState({
                costList: result, //费用单位
                unitList: result, //物料单位
                loading: false
            })
        }).catch(err => {
            this.setState({
                loading: false
            })
        })
    }

    getOtherUnit = (callback) => { //获取其他单位
        const { mobxDataBook } = this.props
        let text = '其他单位'
        let typeId = mobxDataBook.getBookType(text)
        this.setState({
            loading: true
        })
        mobxDataBook.initData(text).then(res => {
            let d = this.getIdAndTitleArray(mobxDataBook.databook[typeId.id])
            this.setState({
                otherList: d, //费用单位
                loading: false
            })
        }).catch(err => {
            this.setState({
                loading: false
            })
        })
    }

    getIdAndTitleArray = (value) => { //将数组=》{id: '', title: ''}格式
        value = value && value.length > 0 ? value.map(item => {
            let obj = {id: item.id, title: item.title}
            return obj
        }) : []
        return value
    }

    filterData = (value, type) => {
        let { 
            costList, 
            unitList
        } = this.state
        if(value && value.length >= 2) {
            let quantity1 = value && value[0].quantity ? value[0].quantity : []
            let quantity2 = value && value[1].quantity ? value[1].quantity : []
            let boxCount1 = value && value[0].boxCount ? value[0].boxCount : []
            let boxCount2 = value && value[1].boxCount ? value[1].boxCount : []
            let boardCount1 = value && value[0].boardCount ? value[0].boardCount : []
            let boardCount2 = value && value[1].boardCount ? value[1].boardCount : []
            let selectMaterial = [...quantity1, ...boxCount1, ...boardCount1]
            let selectCost = [...quantity2, ...boxCount2, ...boardCount2]
            // console.log('filterData', value, type, selectCost)
            if(type === 1) {
                costList = this.originCostList.filter(item => {return !selectCost.some(d => d.id === item.id)})
            } else if (type === 0) {
                unitList = this.originUnitList.filter(item => {return !selectMaterial.some(d => d.id === item.id)})
            }
            this.setState({
                costList,
                unitList
            })
        }
    }

    changBillingUnit = (value) => {
        if (value && value.length > 0) {
            return value.map(item => {
                return {
                    billingUnitId: item.id,
                    billingUnitName: item.title
                }
            })
        }
        return []
    }

    changMaterialUnit = (value) => {
        if (value && value.length > 0) {
            return value.map(item => {
                return {
                    billingUnitId: item.id,
                    billingUnitName: item.title
                }
            })
        }
        return []
    }

    loadingFalse = () => {
        this.setState({
            loading: false
        })
    }

    saveSubmit = () => {
        let data = this.view.logData().data
        let quantitySelected,boxSelected,boardSelected, grossWeightSelected, volumeSelected, otherSelected  = {}
        if (data) {
            quantitySelected = {
                billingUnitList: this.changBillingUnit((data[1] && data[1].quantity) ? data[1].quantity : []),
                materialUnitList: this.changBillingUnit((data[0] && data[0].quantity) ? data[0].quantity : [])
            }
            boxSelected = {
                billingUnitList: this.changBillingUnit((data[1] && data[1].boxCount) ? data[1].boxCount : []),
                materialUnitList: this.changBillingUnit((data[0] && data[0].boxCount) ? data[0].boxCount : [])
            }
            boardSelected = {
                billingUnitList: this.changBillingUnit((data[1] && data[1].boardCount) ? data[1].boardCount : []),
                materialUnitList: this.changBillingUnit((data[0] && data[0].boardCount) ? data[0].boardCount : [])
            }
            grossWeightSelected = {
                billingUnitList: this.changBillingUnit(data[1] && data[1].grossWeight),
                materialUnitList: this.changBillingUnit(data[0] && data[0].grossWeight)
            }
            volumeSelected = {
                billingUnitList: this.changBillingUnit(data[1] && data[1].volume),
                materialUnitList: this.changBillingUnit(data[0] && data[0].volume)
            }
            otherSelected = {
                billingUnitList: this.changBillingUnit(data[1] && data[1].other),
                materialUnitList: this.changBillingUnit(data[0] && data[0].other)
            }
        }
        this.setState({
            buttonLoading: true
        })
        this.props.rApi.addUnitConfig({
            quantity: quantitySelected,
            boxCount: boxSelected,
            boardCount: boardSelected,
            grossWeight: grossWeightSelected,
            other: otherSelected,
            volume: volumeSelected,
            unitClassification: 1 //运输-1 仓储-2
        }).then(d => {
            this.setState({
                buttonLoading: false
            })
            message.success('操作成功!')
            this.getList()
        }).catch(e => {
            message.error(e.msg || '操作失败!')
            this.setState({
                buttonLoading: false
            })
        })
    }

    render() {
        let { data, otherList, costList, unitList, loading, buttonLoading} = this.state
        //console.log('data', data)
        return (
            <Spin spinning={loading}>
                <div style={{padding: '0px 10px 10px', margin: '10px 15px', backgroundColor: '#fff'}}>
                    <UnitTable
                        data={data} 
                        costList={costList}
                        unitList={unitList}
                        otherList={otherList}
                        buttonLoading={buttonLoading}
                        filterData={this.filterData}
                        saveSubmit={this.saveSubmit}
                        getThis={v => this.view = v}
                        power={power}
                    />
                </div>
            </Spin>    
        )
    }
}

export default UnitConfig