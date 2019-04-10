import React, { Component, Fragment } from 'react';
import { inject, observer } from "mobx-react"
import { InputNumber } from 'antd'
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

const CarTypeSelete = props => (
    <div className="flex flex-vertical-center" style={{marginBottom: 10}}>
        <div style={{marginRight: props.openType === 2 ? '10px' : '0'}}> 
            <RemoteSelect
                defaultValue={props.defaultValue || {}}
                placeholder={props.filterData.placeholder}
                onChangeValue={value => props.onChangeValue(props.index, {cid: props.defaultValue.cid, ...(value || {})})}
                labelField={props.filterData && props.filterData.labelField ? props.filterData.labelField : props.labelField}
                {
                    ...combObject({
                        getDataMethod: props.filterData.getDataMethod,
                        list: props.carrierData
                    })
                }
                // getDataMethod={props.filterData.getDataMethod}
                params={props.filterData.params}
                disabled={props.openType === 2 ? true : false}
                // list={props.carrierData}

            />
            &ensp;
            {
               ( props.isInput && props.defaultValue && props.defaultValue.id) ?
                <Fragment>
                    <InputNumber 
                        value={(props.defaultValue && props.defaultValue.carCount) ? props.defaultValue.carCount : null}
                        min={1}
                        step={1}
                        onChange={(value) => props.onChangeCarNumber(props.index, value)}
                        disabled={props.openType === 2 ? true : false}
                    />&ensp;<span>辆</span>
                </Fragment>
                :
                null
            }
        </div>
        {
            props.openType === 2 ?
            null
            :
            <div className="plusStyle" onClick={() => props.removeCarType(props.index)}>
                <span>-</span>
            </div> 
        }
    </div>
)

@inject('rApi')  
class DemandCarType extends Component {
    static propTypes = {
        defaultValue: PropTypes.array, //默认值
        getCarTypeVul: PropTypes.func.isRequired, //将选中值传给父组件
        filterData: PropTypes.object, //对象包括placeholder,getDataMethod, params,labelField
        labelVul: PropTypes.string, //Col值
        carrierData: PropTypes.array, //RemoteSelect值
        labelField: PropTypes.string,
        openType: PropTypes.number, //1-编辑 2-查看 3-新增
        isInput: PropTypes.bool //是否加文本框 =>参考订单需求车型
    }

    state = {
        carTypeDiv: []
    }

    count = 0
    
    constructor(props) {
        super(props)
        this.state.carTypeDiv = props.defaultValue && props.defaultValue.length > 0 ? props.defaultValue.map(d => {
            let obj = {...d, name: d.carTypeName}
            return obj
        }) : []
        //props.getCarTypeVul(this.state.carTypeDiv)
        //console.log('constructor', props)
    }
    componentDidMount() {
    }

    // getLabelVul = (value) => {
    //     this.setState({
    //         checkVul: value
    //     })
    // }

    addCarType = () => {
        let { carTypeDiv } = this.state
        this.count++
        //console.log('this.count', this.count)
        carTypeDiv.push({
            cid: this.count + 1
        })
        this.setState({
            carTypeDiv: carTypeDiv
        })
    }

    removeCarType = index => {
        this.setState(preState => {
            preState.carTypeDiv.splice(index, 1)
            return {
                carTypeDiv: preState.carTypeDiv
            }
        }, () => {
            this.props.getCarTypeVul(this.state.carTypeDiv)
        }) 
    }

    onChangeValue = (index, value) => {
        //console.log('onChangeValue', value)
        this.setState(preState => {
            value = value || {cid: preState.carTypeDiv[index].cid}
            preState.carTypeDiv[index] = value
            preState.carTypeDiv[index].carCount = preState.carTypeDiv[index].carCount ? preState.carTypeDiv[index].carCount : 1
            return {
                carTypeDiv: preState.carTypeDiv
            }
        }, () => {
            // console.log('this.state.carTypeDiv', this.state.carTypeDiv)
            this.props.getCarTypeVul(this.state.carTypeDiv)
        }) 
    }

    onChangeCarNumber = (index, value) => {
        let { carTypeDiv } = this.state
        if(!carTypeDiv[index].carCount && !value) {
            carTypeDiv[index].carCount = 1
        } else if(value) {
            carTypeDiv[index].carCount = value
        }
        this.props.getCarTypeVul(this.state.carTypeDiv)
    }

    render() {
        let { listData, checkVul, carTypeDiv } = this.state
        let { defaultValue, filterData, labelVul, carrierData, labelField, openType, isInput} = this.props
        //console.log('carTypeDiv', carTypeDiv)
        return (
            <div className="select-wrapper">
                <Row gutter={24} style={{minHeight: 48}} type={openType}>
                    <Col label={labelVul} span={24} text={
                        carTypeDiv && carTypeDiv.length > 0 ? carTypeDiv.map(item => {
                            return item.carTypeName
                        }).join(',') : '无'
                    }>
                        <div className="mian-wrapper" style={{flexWrap: 'wrap', margin: '2px 0'}}>
                            {
                                carTypeDiv.map((item, index) => {
                                    return (
                                        <CarTypeSelete
                                            key={`${index}${item && (item.id || item.cid || '')}`}
                                            onChangeValue={this.onChangeValue}
                                            onChangeCarNumber={this.onChangeCarNumber}
                                            index={index}
                                            removeCarType={this.removeCarType}
                                            defaultValue={item ? item : {}}
                                            filterData={filterData}
                                            carrierData={carrierData}
                                            labelField={labelField}
                                            openType={openType}
                                            isInput={isInput}
                                        />
                                    )
                                })
                            } 
                            {
                                openType === 2 ?
                                null
                                :
                                <div className="plusStyle" onClick={this.addCarType}>+</div>
                            }         
                        </div>
                    </Col>
                </Row>
            </div>
            
        )
    }
}

export default DemandCarType