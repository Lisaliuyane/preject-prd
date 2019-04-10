import React from 'react'
import { Form, Input, message, Cascader, Button, Pagination, Rate, Popconfirm, Spin } from 'antd';
import { HeaderView, Table, Parent } from '@src/components/table_template'
import { Scrollbars } from 'react-custom-scrollbars'
import AddOrEdit from './addoredit'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { children, id } from './power'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { deleteNull, trim } from '@src/utils'
import moment from 'moment'
import { toCooperativeDetail } from '@src/views/layout/to_page'
import './index.less'
const power = Object.assign({}, children, id)

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

// const demandStageData = [
//     {
//         id: 1,
//         title: '客户需求'
//     },
//     {
//         id: 2,
//         title: '方案研发'
//     },
//     {
//         id: 3,
//         title: '成本规划'
//     }
// ]

const statusData = [
    {
        id: 1,
        title: '未启动'
    },
    {
        id: 2,
        title: '启动'
    },
    {
        id: 3,
        title: '暂停'
    },
    {
        id: 4,
        title: '过期'
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
        clientId: 0, //客户id
        demandType: null, //需求类型
        keyWords: null,  //关键字
        pageNo: 1, //页号
        pageSize: 12, //页数
        total: 0, //总条数
        processStatus: 0, //需求阶段
        loading: true, //加载中
        status: null //状态
    }

    constructor(props) {
        super(props)
    }

    // componentDidMount() {
    //     this.getData()
    // }

    // componentWillReceiveProps(nextProps) {
    //     const { mobxTabsData, mykey } = this.props
    //     const pageData = mobxTabsData.getPageData(mykey)
    //     // console.log('componentWillReceiveProps', pageData, mykey)
    //     if (pageData && pageData.refresh) {
    //         mobxTabsData.setRefresh(mykey, false)
    //         this.getData()
    //     }
    // }

    componentDidMount = () => {
        const { mobxTabsData, mykey } = this.props
        const pageData = mobxTabsData.getPageData(mykey)
        this.getData()
        if(pageData && pageData.key === '应收报价预估' && !pageData.__isRead) {
            this.showAdd(pageData)
        }
    }
    

    componentWillReceiveProps (nextProps) { //pageData改变时触发
        const { mobxTabsData, mykey, activeKey } = nextProps
        const pageData = mobxTabsData.getPageData(mykey)
        const propsPageData = this.props.mobxTabsData.getPageData(this.props.mykey)
        if (activeKey === mykey && mobxTabsData.historyKey !== mykey) {
            if(pageData && pageData.key === '应收报价预估' && !pageData.__isRead)
            this.showAdd(pageData)
        }
        if (propsPageData && propsPageData.refresh) {
            this.props.mobxTabsData.setRefresh(mykey, false)
            this.getData()
        }
    }

    refresh = () => {
        this.searchCriteria()
        this.getData()
    }

    getData = (params) => {
        let {
            clientId, //客户id
            keyWords,  //关键字
            pageNo, //页号
            pageSize, //页数
            status
        } = this.state
        params = Object.assign({}, {clientId, keyWords, pageNo, pageSize, status}, params)
        this.setState({
            requstDone: false,
            loading: true
        })
        return new Promise((resolve, reject) => {
            this.props.rApi.getCooperativeList({
                ...params
            }).then(d => {
                //console.log('getDemandsList', d)
                //this.state.pageNo = d.pages ? d.pages : 1
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
    
    deleteDemandData = (ids) => {
        this.props.rApi.deleteCooperativeProject([ids]).then(d => {
            message.success('操作成功！')
            this.getData()
        }).catch(e => {
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

    showAdd = (value) => {
        if(this.addoredit.getOpenStatus.open) {
            this.addoredit.changeOpen(false)
        }
        this.addoredit.show({
            edit: false,
            data: value
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

    toDetail = (item, event) => {
        const { mobxTabsData } = this.props
        if (!this.likeNode(event.target)) {
            toCooperativeDetail(mobxTabsData, {
                id: item.id,
                pageData: {
                    ...item,
                    listThis: this
                }
            })
        }
    }

    filterDemandTypeData = (value) => {
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
                    <span key={d.id}>{d.label}</span>
                )
            })
        } catch (e) {
            console.log('')
        }
        return null
    }

    onShowSizeChange = (current, pageSize) => {
        //console.log('onShowSizeChange',current, pageSize);
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
                pageSize: pageSize , //页条数
            })
        })
    }

    reloadList = () => { //新建完需求重新请求列表数据
        this.getData()
    }
    render() {
        let {
            requstDone,
            listData, //列表数据
            demandType, //需求类型
            clientId, //客户id
            keyWords,  //关键字
            pageNo, //页号
            pageSize, //页数
            total, //总条数
            loading
        } = this.state
        //console.log('listData', listData)
        let { mobxBaseData } = this.props
        let tableHeight = mobxBaseData.tableHeight+120
        return (
            <div style={{backgroundColor: '#eee', minHeight: '100%'}}>
                <div className="cooperative-index-page">
                    <AddOrEdit 
                        parent={this}
                        getThis={(v) => this.addoredit = v}
                        reloadList={this.reloadList}
                        
                    />
                    <HeaderView parent={this} title="项目名称/编号" onChangeSearchValue={
                        keywords => {
                            this.setState({
                                keyWords: trim(keywords), 
                                pageNo: 1
                            }, () => {this.getData({keyWords: trim(keywords), pageNo: 1})})
                    }
                    }>
                        <RemoteSelect
                            placeholder='客户名称'
                            onChangeValue={
                                value => {
                                    this.setState({
                                        clientId: value ? value.id : '',
                                        pageNo: 1
                                    },() => {this.getData({clientId: value ? value.id : null, pageNo: 1})})
                                }
                            } 
                            getDataMethod={'getClients'}
                            params={{limit: 999999, offset: 0, status: 56}}
                            labelField={'shortname'}
                        />
                        
                        <RemoteSelect
                            placeholder='状态'
                            onChangeValue={
                                value => {
                                    this.setState({
                                        status: value ? value.id : '',
                                        pageNo: 1
                                    },() => {this.getData({status: value ? value.id : null, pageNo: 1})})
                                }
                            } 
                            list={statusData}
                            labelField={'title'}
                        />
                    </HeaderView>
                    <Spin spinning={loading} tip="Loading...">
                        <div style={{padding: '0 10px'}}>
                            <div className="flex">
                                {/* <span>合作项目管理</span> */}
                                <div className="flex1"></div>
                                <FunctionPower power={power.ADD_DATA}>
                                    <Button onClick={this.showAdd} style={{background: '#18B583', width: 68, height: 30, borderRadius: 0, border: 0, color: '#FFFFFF'}}>
                                        新建
                                    </Button>
                                </FunctionPower>
                            </div>
                            <div className="flex">
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
                                                                    <span className="flex1 title-style" title={item.projectName}>{item.projectName}</span>
                                                                    <div className="startStyle">
                                                                        {
                                                                            item.status === 2 ?
                                                                            <span style={{color: '#1EC26B'}}>
                                                                                <span className={item.status === 2 ? 'status-icon start-style' : 'start-style'}/>已启动
                                                                            </span>
                                                                            :
                                                                            item.status === 3 ?
                                                                            <span style={{color: '#EC6658'}}>
                                                                                <span className={item.status === 3 ? 'status-icon stop-style' : 'start-style'}/>暂停
                                                                            </span>
                                                                            :
                                                                            item.status === 4 ?
                                                                            <span style={{color: '#D0D0D0'}}>
                                                                                <span className={item.status === 4 ? 'status-icon time-out' : 'start-style'}/>过期
                                                                            </span>
                                                                            :
                                                                            <span style={{color: '#F5A623'}}>
                                                                                <span className='status-icon no-start'/>未启动
                                                                            </span>
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="company-name">
                                                                    {`公司: ${item.clientName}`}
                                                                </div>
                                                                <div className="type-icon-style">
                                                                    {
                                                                        this.filterDemandTypeData(item.demandType)
                                                                    }
                                                                </div>
                                                                <div className="flex flex-vertical-center" style={{height: 24}}>
                                                                    <div className="flex1 project-number">{item.projectNumber}</div>
                                                                    <div className='stop-event'>
                                                                        {
                                                                            item.status === 2  ?
                                                                            null
                                                                            :
                                                                            <FunctionPower power={power.DEL_DATA}>
                                                                                <Popconfirm
                                                                                    title="确定要删除此项?"
                                                                                    onConfirm={() => this.deleteDemandData(item.id)}
                                                                                    okText="确定"
                                                                                    cancelText="取消">
                                                                                    <a
                                                                                        style={{color: ' #ED6759', fontSize: '12px'}}
                                                                                        // className={`action-button`}
                                                                                    >
                                                                                        删除
                                                                                    </a>
                                                                                </Popconfirm>
                                                                            </FunctionPower>
                                                                        }
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
            </div>
        )
    }
}
 
export default DemandImport;