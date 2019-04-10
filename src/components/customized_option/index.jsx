import React, { Component } from 'react';
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { Row, Col } from '@src/components/grid'
import PropTypes from 'prop-types'
import './index.less'

const combObject = d => {
    for (let key in d) {
        if (!d[key]) {
            delete d[key]
        }
    }
    return d
}

const ParentSelect = (props) => {
    let {defaultValue, filterDataOne, onChangeDataListValue} = props
    return(
        <div className="flex flex-vertical-center" style={{marginBottom: 10}}>
            <div style={{width: 120}}>
                <RemoteSelect
                    defaultValue={defaultValue || {}}
                    placeholder={filterDataOne.placeholder ? filterDataOne.placeholder : ''}
                    onChangeValue={value => {
                        onChangeDataListValue(props.index, {...(value || {})})
                    }}
                    labelField={filterDataOne && filterDataOne.labelField ? filterDataOne.labelField : 'name'}
                    {
                        ...combObject({
                            getDataMethod: filterDataOne.getDataMethod
                        })
                    }
                    // getDataMethod={props.filterData.getDataMethod}
                    params={filterDataOne.params}
                />
            </div>
            {
                props.children 
            }
            {
                <div onClick={() => props.removeDataList(props.index)} style={{width: 50, color: '#888888', fontSize: '12px', marginLeft: '10px', cursor: 'pointer'}}>
                    删除
                </div> 
            }
        </div>
    )
}

@inject('rApi') 
export class CustomizedSelete extends Component {

    dedupe = (array) => { //数组去重
        return Array.from(new Set(array));
    }

    getData = () => { //承运商报价
        const { rApi, filterQuotationId, parentItem } = this.props
        let filterId = parentItem.id ? parentItem.id : null
        return new Promise((resolve, reject) => {
            rApi.getOfferCarrier({
                limit: 999999,
                offset: 0,
                [filterQuotationId]: filterId
            }).then(d => {
                let data = d.records
                let dataMap = data.map(item => {
                    let tm= (item.transportModeBusinessModes && item.transportModeBusinessModes .length) > 0 ? item.transportModeBusinessModes.map((d) => {
                        return d.transportModeName
                    }) : null   
                    return {
                        ...item,
                        transportModes: this.dedupe(tm).join(' ')
                    } 
                    
                })
                if(dataMap && dataMap.length > 0) {
                    resolve(dataMap.map(item => {
                        return { 
                            id: item.id,  
                            quotationNumber: `${item.quotationNumber}${item.transportModes ? ` ${item.transportModes}` : ''}`}
                    }))
                } else {
                    resolve([])
                }
            }).catch(e => {
                reject(e)
            })
        })
    }

    getWarehouseQuotationData = () => { //仓储报价
        const { rApi, filterQuotationId, parentItem } = this.props
        let filterId = parentItem.id ? parentItem.id : null
        return new Promise((resolve, reject) => {
            rApi.getClientQuotation({
                limit: 999999,
                offset: 0,
                clientQuotationType: 2,
                [filterQuotationId]: filterId
            }).then(d => {
                let data = d.records
                if(data && data.length > 0) {
                    resolve(data.map(item => {
                        return { 
                            id: item.id,  
                            quotationNumber: `${item.quotationNumber}  ${item.warehouseName}`}
                    }))
                } else {
                    resolve([])
                }
            }).catch(e => {
                reject(e)
            })
        })
    }

    render() {
        let { filterData, parentItem, filterQuotationId, getData, defaultValue, labelField, carrierData } = this.props
        let filterId = parentItem.id ? parentItem.id : null
        return (
            <div className="flex flex-vertical-center">
                <div className="customized-wrapper" style={{marginLeft: '10px'}}> 
                {
                    filterQuotationId === 'carrierId' ?
                    <RemoteSelect
                        defaultValue={defaultValue || {}}
                        placeholder={filterData.placeholder || ''}
                        onChangeValue={value => this.props.onChangeValue(this.props.parentIndex, this.props.index, {selfid: defaultValue.selfid, ...(value || {})})}
                        labelField={filterData && filterData.labelField ? filterData.labelField : labelField}
                        {
                            ...combObject({
                                getData: this.getData
                            })
                        }
                        // getDataMethod={props.filterData.getDataMethod}
                        params={{...filterData.params, [filterQuotationId]: filterId}}
                        disabled={(this.props.openType === 2 || !filterId) ? true : false}
        
                    />
                    :
                    filterQuotationId === 'warehouseId' ?
                    <RemoteSelect
                        defaultValue={defaultValue || {}}
                        placeholder={filterData.placeholder || ''}
                        onChangeValue={value => this.props.onChangeValue(this.props.parentIndex, this.props.index, {selfid: defaultValue.selfid, ...(value || {})})}
                        labelField={filterData && filterData.labelField ? filterData.labelField : labelField}
                        {
                            ...combObject({
                                getData: this.getWarehouseQuotationData
                            })
                        }
                        // getDataMethod={props.filterData.getDataMethod}
                        params={{...filterData.params, [filterQuotationId]: filterId}}
                        disabled={(this.props.openType === 2 || !filterId) ? true : false}
        
                    />
                    :
                    <RemoteSelect
                        defaultValue={defaultValue || {}}
                        placeholder={filterData.placeholder || ''}
                        onChangeValue={value => this.props.onChangeValue(this.props.parentIndex, this.props.index, {selfid: defaultValue.selfid, ...(value || {})})}
                        labelField={filterData && filterData.labelField ? filterData.labelField : labelField}
                        {
                            ...combObject({
                                getDataMethod: this.props.filterData.getDataMethod,
                                list: carrierData
                            })
                        }
                        // getDataMethod={props.filterData.getDataMethod}
                        params={{...filterData.params, [filterQuotationId]: filterId}}
                        disabled={(this.props.openType === 2 || !filterId) ? true : false}
        
                    />
                }
                </div>
                {
                    this.props.openType === 2 ?
                    null
                    :
                    <div className="plusStyle" onClick={() => this.props.removeCarType(this.props.parentIndex, this.props.index)}>
                        <span>-</span>
                    </div> 
                }
            </div>
    )
}
}

let selfIncrease = 0

@inject('rApi')  
class CustomizedOption extends Component {
    static propTypes = {
        defaultValue: PropTypes.array, //默认值
        getOnChangeVul: PropTypes.func.isRequired, //将选中值传给父组件
        filterDataOne: PropTypes.object, //对象包括placeholder,getDataMethod, params,labelField => ParentSelect
        filterData: PropTypes.object, //对象包括placeholder,getDataMethod, params,labelField => CustomizedSelete
        labelVul: PropTypes.string, //Col值
        carrierData: PropTypes.array, //RemoteSelect值
        labelField: PropTypes.string,
        openType: PropTypes.number, //1-编辑 2-查看 3-新增
        filterQuotationId: PropTypes.string, //过滤报价id
        getData: PropTypes.func //自定义方法 
    }

    state = {
        carTypeDiv: [],
        dataList: [] //存储数据
    }

    count = 0
    
    constructor(props) {
        super(props)
        this.state.dataList = (props.defaultValue && props.defaultValue.length > 0) ? props.defaultValue : [{selfid: 'self-1',quotationList: [{selfid: 0}]}] 
    }

    addDataList = () => { //添加数据(整条)
        let { dataList } = this.state
        //console.log('this.count', this.count)
        dataList.push({
            selfid: 'self' + (selfIncrease++),
            quotationList: [{
                selfid: 1
            }]
        })
        this.setState({
            dataList: dataList
        })
    }

    removeDataList = (index) => { //删除整条数据
        this.setState(preState => {
            preState.dataList.splice(index, 1)
            return {
                dataList: preState.dataList
            }
        }, () => {
            this.props.getOnChangeVul(this.state.dataList)
        }) 
    }

    addCarType = (index) => {
        let { dataList } = this.state
        this.count++
        dataList[index].quotationList.push({
            selfid: this.count + 1
        })
        this.setState({
            dataList: dataList
        })
    }

    removeCarType = (parentIndex, index) => {
        this.setState(preState => {
            preState.dataList[parentIndex].quotationList.splice(index, 1)
            return {
                dataList: preState.dataList
            }
        }, () => {
            this.props.getOnChangeVul(this.state.dataList)
        }) 
    }

    onChangeValue = (parentIndex, index, value) => {
        this.setState(preState => {
            value = value || {selfid: preState.dataList[parentIndex].quotationList[index].selfid}
            preState.dataList[parentIndex].quotationList[index] = value
            return {
                dataList: preState.dataList
            }
        }, () => {
            this.props.getOnChangeVul(this.state.dataList)
            //this.props.getParentTitle(parentIndex, value)
        }) 
    }

    onChangeDataListValue = (index, value) => { //改变datalist值
        let { dataList } = this.state
        this.setState(preState => {
            value = {
                ...value, 
                quotationList: (dataList && dataList.length > 0 && dataList[index].quotationList) ? dataList[index].quotationList : []
            } || {
                selfid: preState.dataList[index].selfid, 
                quotationList: (dataList && dataList.length > 0 && dataList[index].quotationList) ? dataList[index].quotationList : []
            }
            preState.dataList[index] = value
            return {
                dataList: preState.dataList
            }
        }, () => {
            this.props.getOnChangeVul(this.state.dataList)
           // this.props.getParentTitle(index, value)
        }) 
    }

    render() {
        let { dataList, checkVul } = this.state
        let { defaultValue, filterDataOne, filterData, labelVul, carrierData, labelField, openType, filterQuotationId, getData} = this.props
        return (
            <div className="select-wrapper">
                <Row gutter={24} style={{minHeight: 48}} type={openType}>
                    <Col label={labelVul} span={24} contentStyle={{whiteSpace: 'normal'}}>
                        <div style={{ margin: '2px 0'}}>
                        {
                            dataList.map((item, parentIndex) => {
                                return(
                                    <div key={`${parentIndex}${item && (item.id || item.selfid || '')}`} className="flex flex-vertical-center mian-wrapper" style={{flexWrap: 'wrap'}}>
                                        <ParentSelect
                                            onChangeDataListValue={this.onChangeDataListValue}
                                            index={parentIndex}
                                            removeDataList={this.removeDataList}
                                            defaultValue={item ? item : {}}
                                            filterDataOne={filterDataOne}
                                        >
                                            {
                                                (item.quotationList && item.quotationList.length > 0) ? item.quotationList.map((d, index) => {
                                                    return(
                                                        <CustomizedSelete
                                                            parentIndex={parentIndex}
                                                            key={`${index}${d && (d.id || d.selfid || '')}`}
                                                            onChangeValue={this.onChangeValue}
                                                            index={index}
                                                            removeCarType={this.removeCarType}
                                                            defaultValue={d ? d : {}}
                                                            parentItem={item}
                                                            filterData={filterData}
                                                            carrierData={carrierData}
                                                            labelField={labelField}
                                                            openType={openType}
                                                            filterQuotationId={filterQuotationId}
                                                            getData={getData}
                                                        />
                                                    )
                                                }) : ''
                                            }
                                            {
                                                <div className="plusStyle" onClick={() => this.addCarType(parentIndex)}>+</div>
                                            }
                                        </ParentSelect>
                                    </div>
                                )
                            })
                        }
                            <div onClick={this.addDataList} style={{width: 30, color: '#18B583', fontSize: '12px', cursor: 'pointer'}}>添加</div>
                        </div>
                    </Col>
                </Row>
            </div>
            
        )
    }
}

export default CustomizedOption