import React, { Component } from 'react'
import { Popover, Button, Modal, Table, Icon, Spin} from 'antd'
import { Scrollbars } from 'react-custom-scrollbars'
import RemoteSelect from '@src/components/select_databook'
// import FormItem from '@src/components/FormItem'
// import { Row, Col } from '@src/components/grid'
import PropTypes from 'prop-types'
// import moment from 'moment'
// import upload from '@src/utils/upload'
import { inject } from "mobx-react"
import { deleteNull, trim, addressToString } from '@src/utils'
import './index.less'

@inject('rApi') 
class PopContent extends Component {

    state = {
        loading: false,
        code: null,
        codeName: null,
        name: null,
        getDataMethod: null, //请求方法名
        params: {}, //参数
        listData: [],
        visible: false, //控制模态框显示关闭
        columns: [], //表头
        data: [] //表格数据
    }
    
    constructor(props) {
        super(props)
        // this.state.getDataMethod = props.filterDataOne.getDataMethod
        // // this.state.listData = props.listData
        // this.state.params = props.filterDataOne.params
        this.state.columns = [
            {
                width: 120,
                className: 'text-overflow-ellipsis',
                title: '收/发货方代码',
                dataIndex: 'cargoPartyCode',
                key: 'cargoPartyCode'
            },
            {
                width: 140,
                className: 'text-overflow-ellipsis',
                title: '收/发货方',
                dataIndex: 'cargoPartyName',
                key: 'cargoPartyName'
            },
            {
                width: 140,
                className: 'text-overflow-ellipsis',
                title: '地址类型',
                dataIndex: 'addressType',
                key: 'addressType',
                render: (text, r, index) => {
                    return(
                        <span title={r.addressType === 1 ? '发货方' : '收货方'}>
                        {
                            r.addressType === 1 ? '发货方' : '收货方'
                        }
                        </span>
                    )
                }
            },
            {
                width: 160,
                className: 'text-overflow-ellipsis',
                title: '客户名称',
                dataIndex: 'clientName',
                key: 'clientName'
            },
            {
                className: 'text-overflow-ellipsis',
                title: '联系人',
                dataIndex: 'contactName',
                key: 'contactName'
            },
            {
                className: 'text-overflow-ellipsis',
                title: '联系方式',
                dataIndex: 'contactNumber',
                key: 'contactNumber'
            },
            {
                className: 'text-overflow-ellipsis',
                title: '详细地址',
                dataIndex: 'address',
                key: 'address'
            },
            {
                className: 'text-overflow-ellipsis',
                title: '片区',
                dataIndex: 'areaName',
                key: 'areaName'
            },
            {
                className: 'text-overflow-ellipsis',
                title: '归属发货方',
                dataIndex: 'defaultShipperName',
                key: 'defaultShipperName'
            }
        ]
    }

    componentDidMount() {
        this.changeIdState()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.clientId !== this.props.params.clientId) {
            this.changeIdState(nextProps.params)
        }
    }

    changeIdState = (nextParams) => {
        let {
            code,
            name,
            listData
        } = this.state
        const {
            filterData,
            getDataMethod,
            params = null
        } = this.props
        nextParams = nextParams || params || {}
        const { labelFieldCode, labelFieldName } = this.props
        // if (code || name) {
            this.setState({loading: true})
            this.props.rApi[getDataMethod]({
                ...nextParams,
                [labelFieldCode]: code,
                [labelFieldName]: name
            }).then(data => {
                let d = data.records
                //console.log('getMaterials', d)
                if (filterData) {
                    d = filterData(d)
                }
                if(d) {
                    this.setState({
                        listData: d.length > 0 ? d.map(item => {
                            return { 
                                code: item[labelFieldCode],
                                name: item[labelFieldName],
                                bid: item.id, 
                                ...item 
                            }
                        }) : []
                    })
                }
                this.setState({loading: false})
            }).catch(e => {
                this.setState({loading: false})
            })
        // }
    }

    checkVul = (e, item, index) => {
        let {getValue, getVisible, ifVisible} = this.props
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        getValue(item)
        if(!ifVisible) {
            getVisible(false)
        }
        //console.log('index', index, e, item)
    }

    showModal = () => {
        this.setState({
          visible: true,
        });
      }
    handleCancel = (e) => {
        // console.log(e);
        let {getVisible, ifVisible} = this.props
        getVisible(true)
        this.setState({
          visible: false,
        });
    }

    checkDetails = (item) => { //查看明细
        // console.log('checkDetails', item)
        let {getVisible, ifVisible} = this.props
        getVisible(false)
        this.setState({
            visible: true,
            data: [
                {
                    cargoPartyCode: item.cargoPartyCode ? item.cargoPartyCode : '无',
                    cargoPartyName: item.cargoPartyName ? item.cargoPartyName : '无',
                    addressType: item.addressType === 1 ? '发货方' : '收货方',
                    clientName: item.clientName ? item.clientName : '无',
                    contactName: item.contactName ? item.contactName : '无', 
                    contactNumber: item.contactNumber ? item.contactNumber : '无',
                    address: item.address ? addressToString(JSON.parse(item.address)) : '无', 
                    areaName: item.areaName ? item.areaName : '无',  
                    defaultShipperName: item.defaultShipperName ? item.defaultShipperName : '无'
                }
            ] 
        })
    }

    deleteNullValue = () => {
        const { filterDataOne, text, keyName } = this.props
        let obj = {
            text: text,
            getDataMethod: filterDataOne.getDataMethod,
            labelField: filterDataOne.labelField
        }
        for (let key in obj) {
            if (!obj[key]) {
                delete obj[key]
            }
        }
        // console.log('obj', obj)
        return obj
    }

    render() {
        const { filterDataOne, filterDataTwo, ifShowDetails, timerComponent, text, keyName, dealData } = this.props
        let { listData, visible, columns, data, loading } = this.state
        if (listData && listData.length && dealData) { //处理数据
            listData = dealData(listData)
        }
        return (
            <Spin spinning={loading}>
                <div>
                    <div ref={v => this.view = v} style={{width: 250, overflow: 'hidden', padding: 0}}>
                        <div className="flex" >
                            <div className="flex1" style={{marginRight: 5, width: 120}}>
                                    <RemoteSelect
                                        getPopupContainer={() => this.view}
                                        placeholder={filterDataOne.placeholder}
                                        onChangeValue={
                                            value => {
                                                this.setState({
                                                    code: text && value ? value.id : value ? value.title || value.filterDataOne.labelField : ''
                                                }, this.changeIdState)
                                            }
                                        }
                                        {
                                            ...this.deleteNullValue()
                                        }
                                        params={filterDataOne.params}
                                    />
                            </div>
                            <div className="flex1">
                                <RemoteSelect
                                    getPopupContainer={() => this.view}
                                    placeholder={filterDataTwo.placeholder}
                                    onChangeValue={
                                        value => {
                                            this.setState({
                                                name: value ? value.title || value.filterDataTwo.labelField : ''
                                            }, this.changeIdState)
                                        }
                                    } 
                                    getDataMethod={filterDataTwo.getDataMethod}
                                    params={filterDataTwo.params}
                                    labelField={filterDataTwo.labelField}
                                />
                            </div>
                        </div>
                        <Scrollbars style={{ width: '100%', height: 160, marginTop: 5, position: 'relative' }}>
                            <div className="select-filter-list">
                                <ul style={{padding: '5px 5px'}}>
                                    {
                                        listData && listData.length > 0 ?
                                        listData.map((item, index) => {
                                            //console.log('物料信息', item)
                                            return(
                                                <li key={index} style={{cursor: 'pointer'}}>
                                                    <div className="flex flex-vertical-center">
                                                        <div className="flex1 select-filter-item" onClick={(e) => this.checkVul(e, item, index)}>
                                                            <div className="flex flex-vertical-center">
                                                                <div title={
                                                                    item[keyName ? keyName : 'code'] ?
                                                                    `${item[keyName ? keyName : 'code']} - ${item.name}`
                                                                    :
                                                                    item.name
                                                                } style={{
                                                                    width: item.materialType ? 180 : 240,
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis'
                                                                }}>
                                                                    {
                                                                        item[keyName ? keyName : 'code'] ?
                                                                        `${item[keyName ? keyName : 'code']} - ${item.name}`
                                                                        :
                                                                        item.name
                                                                    }
                                                                </div>
                                                                {
                                                                    item.materialType && item.materialType === 1 ?
                                                                    <span style={{
                                                                        padding: '0px 7px',
                                                                        backgroundColor: 'rgb(74, 144, 226)',
                                                                        color: '#fff',
                                                                        fontSize: '12px',
                                                                        marginLeft: '5px',
                                                                        borderRadius: '4px'
                                                                    }}>运输</span>
                                                                    :
                                                                    item.materialType && item.materialType === 2 ?
                                                                    <span style={{
                                                                        padding: '0px 7px',
                                                                        backgroundColor: 'rgb(245, 166, 35)',
                                                                        color: '#fff',
                                                                        fontSize: '12px',
                                                                        marginLeft: '5px',
                                                                        borderRadius: '4px'
                                                                    }}>仓储</span>
                                                                    :
                                                                    null
                                                                }
                                                            </div>
                                                        </div>
                                                        {
                                                            ifShowDetails ?
                                                            <div style={{width: 30}} onClick={() => this.checkDetails(item)}>
                                                                <a className="details">明细</a>
                                                            </div>
                                                            :
                                                            null

                                                        }
                                                    </div>
                                                </li>
                                            )
                                        })
                                        :
                                        null
                                    }
                                </ul>
                            </div>
                        </Scrollbars>
                        {
                            timerComponent ?
                            <div className="select-filter-timer">
                                {
                                    React.cloneElement(timerComponent, { getCalendarContainer: () => this.view })
                                }
                            </div>
                            :
                            null
                        }
                    </div>
                    {
                        ifShowDetails ?
                        <div>
                            <Modal
                                title="收/发货方列表"
                                width={1100}
                                style={{maxWidth: 1200}}
                                visible={visible}
                                footer={null}
                                onCancel={this.handleCancel}
                                >
                                <Table 
                                    columns={columns} 
                                    dataSource={data} 
                                    pagination={false}
                                    scroll={{x: true}}
                                />   
                            </Modal>
                        </div>
                        :
                        null
                    }
                </div>
            </Spin>
        )
    }
}

@inject('rApi')  
class FilterSelect extends Component {
    static propTypes = {
        filterDataOne: PropTypes.object.isRequired, //对象包括placeholder,getDataMethod, params,labelField,
        filterDataTwo: PropTypes.object.isRequired,
        listData: PropTypes.array, //列表数据 [{bid, '', code: '', name: ''}] //列表数据格式
        labelFieldCode: PropTypes.string.isRequired, //过滤条件1 =>要过滤的字段
        labelFieldName: PropTypes.string.isRequired, //过滤条件2 =>要过滤的字段
        titleName: PropTypes.string.isRequired, //抬头名
        selectValue: PropTypes.string, //当titleName为空时的显示值
        getLabelVul: PropTypes.func.isRequired, //将选中值传给父组件
        filterData: PropTypes.func, // 过滤获取的数据
        ifVisible: PropTypes.bool, //是否开启选择不关闭
        ifShowDetails: PropTypes.bool,//是否显示明细
        text: PropTypes.string //支持text请求
        //timerComponent 时间组件
    }

    state = {
        checkVul: null, //选中值
        visible: null
    }
    
    getValue = (value) => {
        this.setState({
            checkVul: value
        })
        this.props.getLabelVul(value)
        // console.log('getValue', value)
    }

    getVisible = (value) => {
        this.setState({
            visible: value
        })
    }
    onVisibleChange = (visible) => {
        //console.log('onVisibleChange', visible)
        this.setState({
            visible: visible
        })
    }
    render() {
        let { checkVul, visible } = this.state
        let {
            titleName,
            selectValue,
            getPopupContainer
        } = this.props
        let getTContainer = {}
        if (getPopupContainer) {
            getTContainer.getPopupContainer = getPopupContainer
        } else {
            getTContainer.getPopupContainer = () => document.querySelector('#scroll-view')
        }
        return (
            <div>
                <Popover
                    {...getTContainer}
                    overlayClassName="select-filter-popover"
                    placement="bottomLeft" 
                    visible={visible}
                    onVisibleChange={this.onVisibleChange}
                    content={
                        <PopContent 
                            {...this.props}
                            getValue={this.getValue}
                            getVisible={this.getVisible}
                        />
                    } 
                    trigger="click">
                    {
                        titleName ? <a style={{textDecoration: 'underline'}}>{titleName || '请选择'}</a>
                        :
                        <div title={selectValue} className="flex flex-vertical-center" style={{height: 32, maxWidth: 160, border: '1px solid #d9d9d9', padding: '0 3px', background: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                            {selectValue}
                        </div>
                    }
                </Popover>
            </div>
            
        )
    }
}

export default FilterSelect