import React from 'react'
import { Form, Input, message, Cascader, Button, Pagination, Rate, Popconfirm, Spin, Radio } from 'antd';
import { HeaderView, Table, Parent } from '@src/components/table_template'
import { Scrollbars } from 'react-custom-scrollbars'
import AddOrEdit from './addoredit'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { children, id } from './power'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { deleteNull, trim } from '@src/utils'
import moment from 'moment'
import { toDemand } from '@src/views/layout/to_page'
import person_icon from '@src/libs/img/person_icon.png'
import './index.less'
const power = Object.assign({}, children, id)

const optionData = [ //运作类型研发
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

const demandStageData = [
    {
        id: 0,
        title: '客户需求'
    },
    {
        id: 1,
        title: '方案研发'
    },
    {
        id: 2,
        title: '成本规划'
    },
    {
        id: 3,
        title: '应收报价预估'
    },
    {
        id: 4,
        title: '规划完成'
    }
]

/**
 * 需求导入
 * 
 * @class CarRes
 * @extends {Component}
 */
@inject('mobxTabsData', 'mobxBaseData')
@inject('rApi')
@observer
class DemandImport extends Parent {

    state = {
        // keyword: null, // 关键字
        // params: {},
        // limit: 10,
        // offset: 0
        requstDone: false,
        listData: [], //列表数据
        clientId: null, //客户id
        demandType: null, //需求类型
        keywords: null,  //关键字
        pageNo: 1, //页号
        pageSize: 12, //页数
        total: 0, //总条数
        processStatus: null, //需求阶段
        loading: true, //加载中
        demandStatus: 1 //规划状态 1-规划需求 2-项目需求 3-规划终止
    }

    constructor(props) {
        super(props)      
    }

    componentDidMount() {
        this.getData()
    }

    getData = (params) => {
        let {
            clientId, //客户id
            demandType, //需求类型
            keywords,  //关键字
            pageNo, //页号
            pageSize, //页数
            processStatus, //需求阶段
            demandStatus
        } = this.state
        params = Object.assign({}, {clientId, demandType, keywords, pageNo, pageSize, processStatus, demandStatus}, params)
        this.setState({
            requstDone: false,
            loading: true
        })
        return new Promise((resolve, reject) => {
            this.props.rApi.getDemandsList({
                ...params
            }).then(d => {
                //console.log('getDemandsList', d)
                // this.state.pageNo = d.pages
                this.setState({
                    listData: d.records,
                    pageSize: d.size,
                    total: d.total
                })
                this.showView()
                resolve(d)
            }).catch(err => {
                this.loadingFalse()
                message.error(err.msg || '请求失败,请刷新！')
                reject(err)
            })
        })
    }
    
    deleteDemandData = (id, e) => {
        this.props.rApi.deleteDemand({
            id
        }).then(d=> {
            message.success('操作成功！')
            this.getData()
        }).catch(e=> {
            message.error(e.msg || '操作失败！')
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

    onChangeValue = () => {
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    // showAdd = () => {
    //     this.addoredit.show({
    //         edit: true
    //     })
    // }

    toDemandAddPage = () => { //新建 => 跳转到页面
        let { mobxTabsData } = this.props
        toDemand(mobxTabsData, {
            id: null,
            pageData: {
                openType: 3,
                originThis: this
            }
        })
    }

    likeNode = (node, dep) => {
        if (node.className === 'stop-event' || node.className === 'ant-popover ant-popover-placement-top') {
            return true
        }
        if (dep === 10) {
            return false
        }
        if (node.parentNode) {
            return this.likeNode(node.parentNode, dep ? dep + 1 : 1)
        } else {
            return false
        }
        
    } 

    toDetail = (item, event) => { //跳到编辑页
        const { mobxTabsData } = this.props
        // console.log('event', event, event.view, event.target.className)
        if (!this.likeNode(event.target)) {
            toDemand(mobxTabsData, {
                id: item.id,
                pageData: {
                    ...item,
                    openType: 1,
                    originThis: this
                }
            })
        }
    }

    filterDemandTypeData = (value) => {
        try {
            let values = JSON.parse(value)
            let demandTypeName = optionData.filter(item => {
                for(let id of values) {
                    if(id === item.id) {
                        return true
                    }
                }
                return false
            })
            //console.log('demandTypeName', demandTypeName, value)
            return demandTypeName.map(d => {
                return(
                    <span key={d.id}>{d.label}</span>
                )
            })
        } catch (e) {
        }
        return null
    }

    onShowSizeChange = (current, pageSize) => {
        //console.log('onShowSizeChange', current, pageSize);
        this.setState({
            pageNo: current ? current : 1, //页号
            pageSize: pageSize , //页条数
        }, () => {
            this.getData({
                pageNo: current ? current : 1, //页号
                pageSize: pageSize , //页条数
            })
        })
    }

    onChangePage = (page, pageSize) => {    
        //console.log('onChangePage', page, pageSize);
        this.setState({
            pageNo: page ? page : 1, //页号
            pageSize: pageSize , //页条数
        }, () => {
            this.getData({
                pageNo: page ? page : 1, //页号
                pageSize: pageSize //页条数
            })
            //console.log('page+pageSize',page, pageSize)
        })
    }

    reloadList = () => { //新建完需求重新请求列表数据
        this.getData()
    }
    stopEvent(event) {
        // if ((!event || !event.target || event.target.className !== 'stop-event')) {
        //     event.stopPropagation()
        // }
        // e.stopPropagation()
        //console.log(event, event.target)
    }
    render() {
        let {
            requstDone,
            listData, //列表数据
            clientId, //客户id
            demandType, //需求类型
            keywords,  //关键字
            pageNo, //页号
            pageSize, //页条数
            total, //总条数
            processStatus,//需求阶段
            loading,
            demandStatus
        } = this.state
        let { mobxBaseData } = this.props
        let tableHeight = mobxBaseData.tableHeight+120
        return (
            <div style={{backgroundColor: '#eee', minHeight: '100%'}}>
                <div className="demand-main">
                    <HeaderView   className="add-style" style={{background: '#eee', borderBottom: 0}} parent={this} title="需求名称" onChangeSearchValue={
                        keywords => {
                            this.setState({
                                keywords: trim(keywords),
                                pageNo: 1
                            }, () => {this.getData({keywords: trim(keywords), pageNo: 1})})
                    }
                    }>
                        <RemoteSelect
                            placeholder='客户名称'
                            onChangeValue={
                                value => {
                                    this.setState({
                                        clientId: value ? value.id : null,
                                        pageNo: 1
                                    },() => {this.getData({clientId: value ? value.id : null, pageNo: 1})})
                                }
                            } 
                            getDataMethod={'getClients'}
                            params={{limit: 999999, offset: 0}}
                            labelField={'shortname'}
                        />
                        <RemoteSelect
                            onChangeValue={
                                e => {
                                    let id = e ? e.id : 0
                                this.setState({
                                    processStatus: e ? e.id : null,
                                    pageNo: 1
                                    }, () => {this.getData({processStatus: e ? e.id : null, pageNo: 1})})
                                }
                            }
                            placeholder='需求阶段'
                            params={{offset: 0, limit: 1000}}
                            labelField={'title'}
                            list={demandStageData}
                            >
                        </RemoteSelect>
                        <RemoteSelect
                            onChangeValue={
                                e => {
                                    let id = e ? e.id : 0
                                    this.setState({
                                        demandType: e ? e.id : null,
                                        pageNo: 1
                                    }, () => {
                                        this.getData({demandType: e ? e.id : null, pageNo: 1})
                                    })
                                }
                            }
                            placeholder='需求类型'
                            params={{offset: 0, limit: 1000}}
                            labelField={'label'}
                            list={optionData}
                            >
                        </RemoteSelect>
                    </HeaderView>
                    <Spin spinning={loading} tip="Loading...">
                        <div style={{padding: '0px 10px 10px'}}>
                            <div className="flex felx-vertical-center">
                                <div>
                                <Radio.Group 
                                    defaultValue={1}
                                    buttonStyle="solid"
                                    onChange={(e) => {
                                        this.setState({
                                            demandStatus: e.target.value,
                                            pageNo: 1
                                        }, () => {
                                            this.getData({demandStatus: e.target.value ? e.target.value : 1, pageNo: 1})
                                        })
                                    }}
                                >
                                    <Radio.Button value={1} style={{borderRadius: 0}}>规划需求</Radio.Button>
                                    <Radio.Button value={2} style={{borderRadius: 0}}>项目需求</Radio.Button>
                                    <Radio.Button value={3} style={{borderRadius: 0}}>规划终止</Radio.Button>
                                </Radio.Group>
                                </div>
                                <div className="flex1"></div>
                                <div className="add-style">
                                    <FunctionPower power={power.ADD_DATA}>
                                        <Button onClick={this.toDemandAddPage} style={{background: '#18B583', width: 68, height: 30, borderRadius: 0, border: 0, color: '#FFFFFF'}}>
                                            新建
                                        </Button>
                                    </FunctionPower>
                                </div>
                            </div>
                                <div className="flex" style={{ maxHeight: tableHeight, overflow: 'hidden', overflowY: 'auto'}}>
                                    {
                                        requstDone === true ? 
                                        <Scrollbars style={{ width: '100%', height: tableHeight}}>
                                        <div className="main-list-wrapper">
                                            {
                                                listData && listData.length > 0 ?
                                                <ul className="flex main-list-ul" style={{flexWrap: 'wrap', padding: 0}}>
                                                {
                                                    listData.map((item, index) => {
                                                        return (
                                                            <li className="demand-list" key={index} onClick={(e) => this.toDetail(item, e)}>
                                                                <div className="flex flex-vertical-center">
                                                                    <div className="flex1">
                                                                        <div className="title-wrapper flex flex-verticla-center">
                                                                            <h3 title={item.demandName}>
                                                                                {item.demandName}
                                                                            </h3>
                                                                            <span className={
                                                                                (item.processStatus === 1 && item.planMode === 2) ? 
                                                                                'cost-color text-style'
                                                                                :
                                                                                item.processStatus === 1 ?
                                                                                'plan-color text-style'
                                                                                :
                                                                                item.processStatus === 2 ?
                                                                                'cost-color text-style'
                                                                                :
                                                                                item.processStatus === 3 ?
                                                                                'estimate-color text-style'
                                                                                :
                                                                                item.processStatus === 4 ?
                                                                                'estimate-color text-style'
                                                                                :
                                                                                'demand-color text-style'
                                                                            }>
                                                                                {
                                                                                    (item.processStatus === 1 && item.planMode === 2) ? '成本规划'
                                                                                    :
                                                                                    (item.processStatus === 1) ?
                                                                                    '方案研发'
                                                                                    :
                                                                                    item.processStatus === 2 ? '成本规划'
                                                                                    :
                                                                                    item.processStatus === 3 ? '应收报价预估'
                                                                                    :
                                                                                    item.processStatus === 4 ? '规划完成'
                                                                                    :
                                                                                    '客户需求'
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="status">
                                                                    {/* {item.status} */}
                                                                        <span className={item.status === 0 ? 
                                                                        'error-color'
                                                                        :
                                                                        item.status === 2 ?
                                                                        'submit-color'
                                                                        :
                                                                        item.status === 3 ?
                                                                        'success-color'
                                                                        :
                                                                        item.status === 1 ?
                                                                        'submit-color'
                                                                        :
                                                                        ''
                                                                        }></span>
                                                                        <span className="text" style={{color: 
                                                                            item.status === 0 ?
                                                                            '#EC6658'
                                                                            :
                                                                            item.status === 2 ?
                                                                            '#33A5FF'
                                                                            :
                                                                            item.status === 3 ?
                                                                            '#18B583'
                                                                            :
                                                                            item.status === 1 ?
                                                                            '#33A5FF'
                                                                            :
                                                                            ''
                                                                        }}>{
                                                                            item.status === 0 ?
                                                                            '驳回'
                                                                            :
                                                                            item.status === 2 ?
                                                                            '已提交'
                                                                            :
                                                                            item.status === 3 ?
                                                                            '审核通过'
                                                                            :
                                                                            item.status === 1 ?
                                                                            '保存待提交'
                                                                            :
                                                                            ''
                                                                        }</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-vertical-center">
                                                                <div className="flex1 company-name">{`公司: ${item.clientName}`}</div>
                                                                <div className="plan-mode">{
                                                                    item.planMode === 1 ?
                                                                    '标准规划'
                                                                    :
                                                                    '快速规划'
                                                                }</div>
                                                                </div>
                                                                <div className="type-icon">
                                                                    {
                                                                        this.filterDemandTypeData(item.operationType)
                                                                    }
                                                                </div>
                                                                <div className="create-item">
                                                                    {/* <img className="person-icon" src={person_icon} alt="person_icon"/> */}
                                                                    <div style={{fontSize: '12px'}}>创建人: {item.operatorName ? item.operatorName : '无'}</div>
                                                                    <div className="flex flex-vertical-center" style={{height: 24}}>
                                                                        <div className="flex1" style={{marginTop: 4}}>创建时间: {moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                                                                        <div
                                                                            className='stop-event' 
                                                                            onClickCapture={this.stopEvent} 
                                                                        >
                                                                        {
                                                                                item.demandStatus === 2 ?
                                                                                null
                                                                                :
                                                                                <FunctionPower power={power.DEL_DATA}>
                                                                                    <Popconfirm
                                                                                        onClick={this.stopEvent}
                                                                                        // getPopupContainer={() => this.deleteView[item.id]}
                                                                                        title="确定要删除此项?"
                                                                                        onConfirm={(e) => this.deleteDemandData(item.id, e)}
                                                                                        okText="确定"
                                                                                        cancelText="取消">
                                                                                        <a style={{color: '#EC6658'}}>
                                                                                            删除
                                                                                        </a>
                                                                                    </Popconfirm>
                                                                                </FunctionPower>
                                                                            }
                                                                        </div>
                                                                    </div>                                                             
                                                                </div>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                            :
                                            <div style={{textAlign:'center', color:'#ccc', padding: '20px 0'}}>暂无数据</div>
                                            }
                                            {
                                                total && total > 0 ?
                                                <div style={{position: 'relative',  height: '100px'}}>
                                                    <div className="page-nav">
                                                        <Pagination 
                                                            showSizeChanger 
                                                            onShowSizeChange={this.onShowSizeChange} 
                                                            onChange={this.onChangePage}
                                                            // defaultCurrent={1} 
                                                            total={total} 
                                                            showTotal={total => `共 ${total} 条`}
                                                            current={pageNo}
                                                            pageSize={pageSize}
                                                            defaultPageSize={12}
                                                            pageSizeOptions={['12','24','36','48']}
                                                        />
                                                    </div>
                                                </div>
                                                :
                                                null
                                            }
                                        </div>
                                        </Scrollbars>
                                        :
                                        null
                                    }
                                </div>
                        </div>
                    </Spin>
                </div>
                {/* <AddOrEdit 
                    parent={this}
                    getThis={(v) => this.addoredit = v}
                    reloadList={this.reloadList}
                    
                /> */}
            </div>
        )
    }
}
 
export default DemandImport;