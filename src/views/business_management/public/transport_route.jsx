import React, { Component } from 'react'
import IIcon from '@src/components/icon'
import { Icon } from 'antd'
import { inject, observer } from "mobx-react"
import FilterSelect from '@src/components/select_filter'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import PropTypes from 'prop-types'
import './transport_route.less'
import ShowDetail from '@src/views/layout/like_quotation/detail'
/**
 * 运输路线
 * 
 * @class TransportRoute
 * @extends {Component}
 */

@inject('rApi')
class TransportRoute extends Component {

    static propTypes = {
        departure: PropTypes.string, //起运地
        transitPlaceOneName: PropTypes.string, //中转地
        destination: PropTypes.string //目的地
    }
    
    constructor(props) {
        super(props)
    }

    getLabelVul = (value) => { //中转地值
        //console.log('getLabelVul', value)
        this.props.getTransitPlaceData(value)
    }

    showMore = () => {
        const {
            quotationType,
            rApi,
            selectQuotation
        } = this.props
        //console.log('selectQuotation', selectQuotation)
        rApi.getOnceQuotation({
            // quotationType,
            quotationClassify: 3,
            id: selectQuotation.id
        }).then(res => {
            this.moreview.show({
                list: [selectQuotation],
                quotationType: quotationType,
                quotationClassify: 3,
                id: selectQuotation.id,
                record: selectQuotation,
                title: '费用明细',
                types: {
                    [quotationType]: ''
                },
                wheres: {
                    3: ''
                }
            })
        })
    }

    render() {
        let {
            departure,
            transitPlaceOneName,
            destination,
            isTransitPlace,
            selectQuotation
        } = this.props
        return (
            <div className="flex flex-vertical-center">
                <ShowDetail
                    getThis={v => this.moreview = v}
                />
                <div className="flex1">
                    <div className="flex flex-vertical-center route-information">
                        <div className="flex1 start">
                            <div title={departure} className="title-style">{departure ? departure : '起运地'}</div>
                            <Icon type="environment" theme="outlined" style={{color: '#18B583'}} />
                        </div>
                        <div className="line"></div>
                        <div className="flex1 transit">
                            <div className="title-style" title={transitPlaceOneName} style={{position: 'relative'}}>
                                {
                                    isTransitPlace ?
                                    transitPlaceOneName ? transitPlaceOneName : '中转地'
                                    :
                                    <FilterSelect 
                                        filterDataOne={{placeholder: '类型', params: {limit: 99999, offset: 0}, labelField: 'title'}}
                                        filterDataTwo={{placeholder: '中转地名称', getDataMethod: 'getNodeList', params: {limit: 99999, offset: 0}, labelField: 'name'}}
                                        getDataMethod='getNodeList'
                                        params={{limit: 99999, offset: 0}}
                                        labelFieldCode='nodeTypeId'
                                        labelFieldName='name'
                                        titleName={transitPlaceOneName ? transitPlaceOneName : '添加中转地'}
                                        keyName='nodeTypeName'
                                        getLabelVul={this.getLabelVul}
                                        text="中转地类型"
                                    />
                                }
                            </div>
                            <Icon type="environment" theme="outlined" style={{color: '#F5A623'}}/>
                        </div>
                        <div className="line"></div>
                        <div className="flex1 destination">
                            <div className="title-style" title={destination}>{destination ? destination : '目的地'}</div>
                            <Icon type="environment" theme="outlined" style={{color: '#18B583'}}/>
                        </div>
                    </div>
                </div>
                {
                    (selectQuotation && selectQuotation.id) ?
                    <FunctionPower power={this.props.QUOTATION_DETAILS}>
                        <div style={{margin: '8px 0 0 10px'}}>
                            <a onClick={this.showMore}>查看报价明细</a>
                        </div>
                    </FunctionPower>
                    :
                    null
                }
            </div>
        )
    }
}
 
export default TransportRoute;