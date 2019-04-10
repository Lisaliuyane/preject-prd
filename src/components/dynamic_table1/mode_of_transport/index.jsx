import React, { Component, Fragment } from 'react'
import DynamicTable from '@src/components/dynamic_table1'
import TransModal from './transModal'
import { Row, Col } from '@src/components/grid'
import { objDeepCopy } from '@src/utils'
import { Radio, Icon } from 'antd'
import { inject } from "mobx-react"

@inject('rApi', 'mobxDataBook')
class ModeOfTransport extends Component {
    state={
        transModalVisible: false,
        activeMode: null,
        costUsages: [], //费用用途
        checkedTransportData: [], // 当前已选中运输方式数据
        checkedTransport: [], // 当前已选中运输方式数组
        transportTypeList: [] //运输方式
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        const { transportModeBusinessModes } = props
        // console.log('transportModeBusinessModes', transportModeBusinessModes)
        let arrayToObject = {}
        transportModeBusinessModes.forEach(item => {
            if (!arrayToObject[item.transportModeId]) {
                arrayToObject[item.transportModeId] = {
                    checkedArr: [item.businessModeId],
                    quotationId: item.quotationId,
                    data: [],
                    checkedArrValue: [{
                        id: item.id,
                        businessModeId: item.businessModeId,
                        businessModeName: item.businessModeName
                    }],
                    transportModeId: item.transportModeId,
                    transportModeName: item.transportModeName
                }
            } else {
                arrayToObject[item.transportModeId].checkedArr.push(item.businessModeId)
                arrayToObject[item.transportModeId].checkedArrValue.push({
                    id: item.id,
                    businessModeId: item.businessModeId,
                    businessModeName: item.businessModeName
                })
            }
        })
        this.state.checkedTransportData = Object.values(arrayToObject)
        if (this.state.checkedTransportData && this.state.checkedTransportData.length > 0) {
            this.state.activeMode = this.state.checkedTransportData[0]
        }
        // console.log('this.state.checkedTransportData', this.state.checkedTransportData)
    }

    componentDidMount() {
        this.getTransportType()
    }

    getValues() {
        const { checkedTransportData } = this.state
        let transportModeBusinessModes = []
        let removeQuotationLineId = []
        let removeQuotationLineItemIds = []
        checkedTransportData.forEach(ele => {
            let value = this['view' + ele.transportModeId].getValue()
            transportModeBusinessModes = [...transportModeBusinessModes, ...value.data]
            removeQuotationLineItemIds = [...removeQuotationLineItemIds, ...value.removeQuotationLineItemIds]
            removeQuotationLineId = [...removeQuotationLineId, ...value.removeQuotationLineId]
        })
        return {
            transportModeBusinessModes,
            removeQuotationLineItemIds,
            removeQuotationLineId
        }
    }

    /* 获取业务模式 */
    async getCostList() {
        const { mobxDataBook } = this.props
        let { costUsages } = this.state
        costUsages = await mobxDataBook.initData('业务模式')
        //costUsages = costUsages.filter(item => item.title !== '仓储' && item.title !== '应收' && item.title !== '应付')
        await this.setState({ costUsages })
        return costUsages
    }

    /* 获取运输方式 */
    getTransportType = async () => {
        const { mobxDataBook } = this.props
        let {transportTypeList} = this.state
        this.getCostList().then(costUsages => {
            mobxDataBook.initData('运输方式').then(async data => {
                transportTypeList = data.map(item => ({
                    key: item.id,
                    label: item.title,
                    value: item.id,
                    checkedArr: [],
                    data: costUsages.map(costItem => ({
                        key: costItem.id,
                        label: costItem.title,
                        value: costItem.id
                    }))
                }))
                await this.setState({
                    transportTypeList
                })
            })
        })
    }

    /* 打开运输方式弹窗 */
    openTransport = () => {
        let backupTransportTypeList = objDeepCopy(this.state.transportTypeList)
        let backupCheckedTransport = objDeepCopy(this.state.checkedTransport)
        this.setState({ transModalVisible: true, backupTransportTypeList, backupCheckedTransport})
    }

    /* 关闭运输方式弹窗 */
    closeTransport = () => {
        // let transportTypeList = objDeepCopy(this.state.backupTransportTypeList)
        // let checkedTransport = objDeepCopy(this.state.backupCheckedTransport)
        // let checkedTransportData = transportTypeList.filter(item => checkedTransport.some(key => parseInt(key, 10) === parseInt(item.key, 10)))
        this.setState({ transModalVisible: false})
    }

    /* 保存关闭运输方式弹窗 */
    saveTransport = (checkedTransportData, checkedTransport) => {
        let { activeMode } = this.state
        if (activeMode && checkedTransportData && checkedTransportData.length > 0 && !checkedTransportData.some(item => parseInt(item.transportModeId, 10) === parseInt(activeMode.transportModeId, 10))) {
            activeMode = checkedTransportData[0]
        } else if (activeMode && (!checkedTransportData || checkedTransportData.length < 1)) {
            activeMode = null
        } else if (!activeMode && checkedTransportData && checkedTransportData.length > 0) {
            activeMode = checkedTransportData[0]
        }
        // console.log('activeMode', activeMode)
        this.setState({ transModalVisible: false, activeMode, checkedTransportData, checkedTransport})
    }

    /* 运输方式点击切换显示 */
    handleChangeType = (e) => {
        if (!e || e.target.value === undefined) {
            return
        }
        let { checkedTransportData } = this.state
        let activeMode = checkedTransportData.find(item => parseInt(item.transportModeId, 10) === parseInt(e.target.value, 10))
        // console.log('activeMode', activeMode)
        this.setState({activeMode})
    }

    render() {
        const {
            transportTypeList,
            checkedTransport,
            transModalVisible,
            checkedTransportData,
            activeMode
        } = this.state
        const {
            type,
            clientQuotationTransportVos,
            quotationNumber,
            reviewStatus,
            getDataMethod,
            noCostItems, //去掉费用项按钮
            noEdit, //去掉编辑
            fontWeightVul,
            getDataUrl,
            tableHeader,
            isDisabled,
            getQuotationDataUrl
        } = this.props
        // console.log('tableHeader', tableHeader)
        return (
            <div ref={v => this.modal = v}>
                {
                    this.modal && 
                    <TransModal
                        parentDom={this.modal}
                        transModalVisible={transModalVisible}
                        closeTransport={this.closeTransport}
                        checkedTransportData={checkedTransportData}
                        checkedTransport={checkedTransport}
                        transportTypeList={transportTypeList}
                        saveTransport={this.saveTransport}
                    />
                }
                <Row gutter={24} style={{borderBottom: (checkedTransportData && checkedTransportData.length > 0) ? '1px solid #ddd' : 0}}>
                    <Col label="运输方式" span={24}>
                    {
                        checkedTransportData && checkedTransportData.length ?
                            <Fragment>
                                <Radio.Group
                                    // value={typeName ? typeName : transportTypeList[0].title}
                                    value={activeMode ? activeMode.transportModeId : null}
                                    //buttonStyle="solid"
                                    onChange={this.handleChangeType}
                                >
                                    {
                                        checkedTransportData.map((item, index) => {
                                            return (
                                                <Radio.Button
                                                    style={{ borderRadius: 0 }}
                                                    // disabled={(showtype === 2) ? true : false}
                                                    key={item.transportModeId}
                                                    value={item.transportModeId}
                                                >
                                                    {item.transportModeName}
                                                </Radio.Button>
                                            )
                                        })
                                    }
                                </Radio.Group>
                                {
                                    (type !== 2 && !noEdit) ?
                                    <span style={{ color: '#3db389', cursor: 'pointer', marginLeft: 12 }} onClick={this.openTransport}>编辑</span>
                                    :
                                    null
                                }
                            </Fragment>
                            :
                            (type !== 2 && !noEdit) ?
                            <span style={{ color: '#3db389', cursor: 'pointer'}}
                                onClick={this.openTransport}
                            >
                                <Icon type="plus" theme="outlined" style={{ marginRight: 6}} />添加运输方式
                            </span>
                            :
                            '无'
                    }
                    </Col>
                </Row>
                {
                    checkedTransportData && checkedTransportData.length > 0 ?
                    <Row style={{margin: '10px 0'}}>
                        <Col><span style={{ fontSize: '14px', color: '#484848' }}>路线报价</span></Col>
                    </Row>
                    :
                    ''
                }
                {
                    checkedTransportData && checkedTransportData.map(item => {
                        return (
                            <div key={item.transportModeId} style={{display: activeMode.transportModeId === item.transportModeId ? 'block' : 'none'}}>
                                <DynamicTable
                                    getDataMethod={getDataMethod}
                                    getPopupContainer={this.props.getPopupContainer}
                                    tableHeader={tableHeader}
                                    id={this.state.id}
                                    activeMode={activeMode}
                                    mode={item}
                                    style={{ paddingBottom: 10 }}
                                    getThis={v => this['view' + item.transportModeId] = v}
                                    type={item.transportModeId}
                                    viewType={type}
                                    tableHeight={260}
                                    getDataUrl={getDataUrl}
                                    getQuotationDataUrl={getQuotationDataUrl}
                                    isShowQuotationExportData={this.props.isShowQuotationExportData}
                                    xmlTitle={quotationNumber}
                                    quotationLines={clientQuotationTransportVos}
                                    tableTitle={null}
                                    isNoneAction={(reviewStatus === 2 || reviewStatus === 4 || isDisabled) ? true : false}
                                    buttonsControl={(reviewStatus === 2 || reviewStatus === 4 || isDisabled) ? {
                                        1: 0,
                                        2: 0,
                                        3: 1,
                                        4: 1,
                                        5: 0,
                                        6: 0
                                    } : 
                                    noCostItems ?
                                    {
                                        6: 0
                                    }
                                    :
                                    null
                                }
                                    quotationMethod={this.props.quotationMethod}
                                    isCustoms={this.props.isCustoms}
                                    noBordered={this.props.noBordered}
                                />
                            </div>
                        )
                        
                    }
                )
                   
                }
            </div>
        );
    }
}
 
export default ModeOfTransport;