import React, { Component, Fragment } from 'react'
import { inject } from "mobx-react"
import { Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { costItemObjectToString } from '@src/components/dynamic_table1/utils'
import { InputNumber, Icon, Popover, Button, Radio, Checkbox, Popconfirm } from 'antd'
import { Scrollbars } from 'react-custom-scrollbars'
import RemoteSelect from '@src/components/select_databook'
import asyncImg from '@src/libs/img/async.svg'
import './index.less'

const RenderOrderEdit = props => {
    //console.log('RenderOrderEdit', props)
    return (
        <div className="flex flex-vertical-center">
            {
                props.isReimbursement ?
                <div style={{width: 100}}>
                    <InputNumber 
                        disabled={!props.recode.isEdit || props.openType === 2 ? true : false}
                        value={props.costUnitValue ? props.costUnitValue : null} 
                        onChange={(value) => props.onChange({
                            costUnitValue: value,
                            currencyId: props.currencyId,
                            currencyName: props.currencyName
                        })} 
                        min={0} 
                        style={{width: 80}}
                        size="small"
                    />
                    &nbsp;
                    <RemoteSelect
                        defaultValue={
                            props.currencyId ?
                                {
                                    id: props.currencyId,
                                    title: props.currencyName
                                }
                                :
                                null
                        }
                        size="small"
                        allowClear={false}
                        disabled={!props.recode.isEdit || props.openType === 2 ? true : false}
                        text={'币别'}
                        onChangeValue={(value) => props.onChange({
                            ...value,
                            costUnitValue: props.costUnitValue
                        })}
                    />
                </div>
                :
                <div>
                    <InputNumber 
                        disabled={!props.recode.isEdit || props.openType === 2 ? true : false}
                        value={props.costUnitValue ? props.costUnitValue : null} 
                        onChange={(value) => props.onChange({
                            costUnitValue: value
                        })} 
                        min={0} 
                        size="small"
                        style={{width: 80}}
                    />
                    &nbsp;
                    {props.costUnitName}
                    &emsp;
                    &emsp;
                </div>
            }
        </div>
    )
}

const QuotationItem = (props) => {
   // console.log('reimbursementList', props.expenseItemList)
    // let options = props.expenseItemList.map(item => {
    //     return item
    // })
    // let reimbursementOptions = props.reimbursementList.map(item => {
    //     return item.name
    // })
    return(
        <div style={{width: 360, padding: '5px 10px'}}>
            <div style={{padding: '0 0 5px', borderBottom: '1px solid #DDDDDD', fontSize: ' 12px', color: 'rgba(0,0,0,0.65)'}}>
                添加费用项
            </div>
            <div style={{padding: '10px 0 0', borderBottom: '1px solid #DDDDDD', fontSize: ' 12px'}}>
                <Radio.Group value={props.radioVul} buttonStyle="solid" onChange={props.onRadioChange} size="small">
                    <Radio.Button value="1">费用项</Radio.Button>
                    <Radio.Button value="2">实报实销</Radio.Button>
                </Radio.Group>
                {
                    props.radioVul === '1' ?
                    <Scrollbars style={{ width: '100%', height: 180, position: 'relative' }}>
                        <div className="check-wrapper" style={{padding: '5px 0'}}>
                            {
                                (props.expenseItemList && props.expenseItemList.length > 0) ? props.expenseItemList.map(item => {
                                    return(
                                        <Checkbox 
                                            key={item.quotationLineExpenseItemId} 
                                            value={item.quotationLineExpenseItemId}
                                            checked={props.checkboxVul.some(k => k.quotationLineExpenseItemId === item.quotationLineExpenseItemId)}
                                            onChange={props.onCheckboxChange} 
                                            style={{marginLeft: 0}}
                                        >
                                            <span title={costItemObjectToString(item)}>{costItemObjectToString(item)}</span>
                                        </Checkbox>
                                    )
                                })
                                :
                                ''
                            }
                        </div>
                    </Scrollbars>
                    :
                    <Scrollbars style={{ width: '100%', height: 180, position: 'relative' }}>
                        <div className="check-wrapper" style={{padding: '5px 0'}}>
                            {
                                (props.reimbursementList && props.reimbursementList.length > 0) ? props.reimbursementList.map(item => {
                                    return(
                                        <Checkbox 
                                            key={item.quotationLineExpenseItemId} 
                                            value={item.quotationLineExpenseItemId}
                                            checked={props.reimbursementcheckVul.some(k => k.quotationLineExpenseItemId === item.quotationLineExpenseItemId)}
                                            onChange={props.onReimbursementChange} 
                                            style={{marginLeft: 0}}
                                        >
                                            <span title={item.name}>{item.name}</span>
                                        </Checkbox>
                                    )
                                })
                                :
                                ''
                            }
                        </div>
                    </Scrollbars>
                }
            </div>
        </div>
    )
}

@inject('rApi')
class TableView extends Parent {

    state={
        columns: [],
        checkVul: '1',
        checkboxVul: [], //多选框选中值
        arrValueToExpense: [], //费用项选中json
        arrValueToReimbur: [] //实报实销选中json
    }

    constructor(props) {
        super(props)
        const { onChangeExpenseItemList, openType,  selectRoute, deleteItem, isEdit} = props
        //isEdit 为true默认可编辑状态
        this.state.arrValueToExpense = selectRoute && selectRoute.length > 0 ? selectRoute.filter(d => (d.costUnitName && d.orderExpenseItemUnitCoefficientList)).map((item, index) => {
            item._expenseIndex = index
            item.isEdit = isEdit ? true : false
            return item
        }) : []
        this.state.arrValueToReimbur = selectRoute && selectRoute.length > 0 ? selectRoute.filter(d => d.billingMethodName === '实报实销').map(item => {
            return item
        }) : []
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                title: '费用项',
                key: 'expense',
                width: 200,
                render: (text, r, index) => {
                    let showVul = (r.costUnitName || r.expenseItemName) ? costItemObjectToString(r) : r.name
                    return(
                        <ColumnItemBox name={showVul} />
                        //console.log('r',r)
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '订单关键数据',
                key: 'data',
                width: 210,
                render: (text, r, index) => {
                    //console.log('orderExpenseItemUnitCoefficientList', r.accountingStrategy,r.accountingStrategy === 2)
                    return(
                        <ColumnItemBox style={{marginTop: -2}}>
                            {
                                (r.accountingStrategy && r.accountingStrategy === 2) ?
                                <div style={{
                                    width: '80px',
                                    color: '#fff',
                                    padding: '2px 5px',
                                    textAlign: 'center',
                                    border: '1px solid #33A5FF',
                                    background: '#33A5FF'
                                }}>
                                    月结
                                </div>
                                :
                                r.orderExpenseItemUnitCoefficientList ? 
                                r.orderExpenseItemUnitCoefficientList.map((item, i) => {
                                    // if(item.accountingStrategy && item.accountingStrategy === 2 ) {
                                    //     return <div>月结</div>
                                    // }
                                    return (
                                        <RenderOrderEdit
                                            onChange={value => onChangeExpenseItemList({
                                                itemIndex: index,
                                                unitIndex: i,
                                                value: {
                                                    costUnitValue: value ? value.costUnitValue : null
                                                }
                                            })}
                                            openType={openType}
                                            recode={r}
                                            key={item.key ? item.key + item.costUnitId : item.id}
                                            {...item}
                                        />
                                    )
                                })
                                :
                                <RenderOrderEdit
                                    onChange={value => onChangeExpenseItemList({
                                        itemIndex: index,
                                        value: {
                                            costUnitValue: value ? value.costUnitValue : null,
                                            currencyId: value.id,
                                            currencyName: value.title
                                        }
                                    })}
                                    recode={r}
                                    openType={openType}
                                    {...r}
                                    costUnitName={'元'}
                                    isReimbursement={true}
                                    onChangeValue={(value={}) => onChangeExpenseItemList({
                                        itemIndex: index,
                                        currencyId: value.id,
                                        currencyName: value.title
                                    })}
                                />
                            }
                        </ColumnItemBox>
                        //console.log('r',r)
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '单价',
                key: 'chargeFee',
                width: 150,
                render: (text, r, index) => {
                    // let name = 
                    return(
                        <ColumnItemBox style={{marginTop:  r.billingMethodName === '实报实销' ? -2 : 0}}>
                        {
                            r.chargeFee ? r.chargeFee
                            :
                            r.billingMethodName === '实报实销'?
                            <div style={{width: 80, color: '#fff', padding: '2px 5px', border: '1px solid #F5A623', background: '#F5A623', textAlign: 'center'}}>实报实销</div>
                            :
                            0
                        }
                        </ColumnItemBox>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '合计',
                width: 110,
                key: 'count',
                render: (text, r, index) => {
                    let name = (r.accountingStrategy !==2 && r.chargeFee && r.orderExpenseItemUnitCoefficientList && r.orderExpenseItemUnitCoefficientList.length > 0 && r.orderExpenseItemUnitCoefficientList[0].costUnitValue) ?
                    (r.chargeFee * r.orderExpenseItemUnitCoefficientList[0].costUnitValue).toFixed(4)
                    :
                    r.accountingStrategy === 2 && r.chargeFee ?
                    r.chargeFee
                    :
                    '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            }
        ]
    }

    componentWillReceiveProps(nextProps) {
        // console.log('nextProps', nextProps, this.props.route)
        if (this.props.route !== nextProps.route) {
            this.searchCriteria()
        }
        if(nextProps.selectRoute) {
            let selectExpenseItemList = nextProps.selectRoute
            this.setState({
                    arrValueToExpense: selectExpenseItemList && selectExpenseItemList.length > 0 ? selectExpenseItemList.filter(d => (d.costUnitName && d.orderExpenseItemUnitCoefficientList)).map(item => {
                        return item
                    }) : [],
                    arrValueToReimbur: selectExpenseItemList && selectExpenseItemList.length > 0 ? selectExpenseItemList.filter(d => d.billingMethodName === '实报实销').map(item => {
                        return item
                    }) : []
                })
        }
    }

    getData = () => {
        const { route, selectRoute } = this.props
        return new Promise((resolve, reject) => {
            // let d = route && route.quotationLineExpenseItems && route.quotationLineExpenseItems.length > 0 ? route.quotationLineExpenseItems : []
            // console.log('getData route', selectRoute)
            resolve({
                dataSource: selectRoute,
                total: 0
            })
        })
    }

    open = (record, index) => {
        // console.log('open', record, index)
    }

    actionView = ({record, index}) => {
        const { onChangeExpenseItemList, deleteItem } = this.props
        return(
            <Fragment>
                {
                    !record.isEdit ?
                    <span 
                        onClick={() => onChangeExpenseItemList({
                            itemIndex: index,
                            status: 1,
                            isEdit: true
                        })} 
                        className={`action-button`}
                    >
                        编辑
                    </span>
                    :
                    <span 
                        onClick={() => onChangeExpenseItemList({
                            itemIndex: index,
                            status: 0,
                            isEdit: false
                        })} 
                        className={`action-button`} 
                    >
                        保存
                    </span>
                }
                <span 
                    className={`action-button`} 
                    onClick={() => deleteItem({
                        itemIndex: index,
                        record
                    })}
                >
                    删除
                </span>
            </Fragment>
        )
    }

    onRadioChange = (e) => {
        this.setState({
            checkVul:  e.target.value
        })
    }

    /* 费用项选中值 */
    onCheckboxChange = (e) => {
       // console.log('e', e)
        let { route } = this.props
        let { arrValueToExpense } = this.state
        let checkedValue = e.target.value
        let status = e.target.checked
        route.forEach((item, index) => {
            if(checkedValue === item.quotationLineExpenseItemId && status) {
                arrValueToExpense.push({...item, quotationLineExpenseItemId: item.quotationLineExpenseItemId, _expenseIndex: index})
            } else if(checkedValue === item.quotationLineExpenseItemId && !status) {
                arrValueToExpense.forEach((d, pIndex) => {
                    if(d.quotationLineExpenseItemId === checkedValue) {
                        arrValueToExpense.splice(pIndex, 1)
                    }
                })
            }
        });
        this.setState({
            arrValueToExpense
        }, () => {
            this.props.onChangRouter(this.state.arrValueToExpense, 0)
            this.searchCriteria()
        })
    }

    /* 实报实销选中值 */
    onReimbursementChange = (e) => {
        // console.log('e', e)
        let { arrValueToReimbur, reimbursementList } = this.state
        let checkedValue = e.target.value
        let status = e.target.checked
        reimbursementList.forEach((item, index) => {
            if(checkedValue === item.quotationLineExpenseItemId && status) {
                arrValueToReimbur.push({...item, quotationLineExpenseItemId: item.quotationLineExpenseItemId, isEdit: true})
            } else if(checkedValue === item.quotationLineExpenseItemId && !status) {
                arrValueToReimbur.forEach((d, pIndex) => {
                    if(d.quotationLineExpenseItemId === checkedValue) {
                        arrValueToReimbur.splice(pIndex, 1)
                    }
                })
            }
        });
        this.setState({
            arrValueToReimbur
        }, () => {
            this.props.onReimbursementChangeValue(this.state.arrValueToReimbur)
            this.searchCriteria()
        })
    }

    onAdd = () => {
        let { rApi, receivableOrPayable } = this.props
        rApi.getRealSalesExpenseByReceivableOrPayable({
            receivableOrPayable: receivableOrPayable
        }).then(d => {
            this.setState({
                reimbursementList: d && d.length > 0 && d.map(item => {
                    return { ...item, quotationLineExpenseItemId: item.id }
                })
            })
        }).catch()
    }

    /* 同步费用项数据 */
    syncData = async () => {
        if (this.props.onChangRouter) {
            await this.props.onChangRouter(this.state.arrValueToExpense, 1)
            this.searchCriteria()
        } else {
            console.log('未发现同步数据方法')
        }
    }

    render() {
        const { route, openType } = this.props
        return (
            <div style={{padding: '10px', background: '#F7F7F7'}} ref={v => this.view = v}>
                <div className="flex flex-vertical-center">
                    <div className="flex1" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Popover 
                            getPopupContainer={() => this.view} 
                            content={
                                <QuotationItem 
                                    onRadioChange={this.onRadioChange} 
                                    radioVul={this.state.checkVul}
                                    expenseItemList={route}
                                    onCheckboxChange={this.onCheckboxChange}
                                    checkboxVul={this.state.arrValueToExpense}
                                    reimbursementList={this.state.reimbursementList}
                                    reimbursementcheckVul={this.state.arrValueToReimbur}
                                    onReimbursementChange={this.onReimbursementChange}
                                />
                            } 
                            placement="topLeft" 
                            trigger="click"
                        >
                        {
                            this.props.openType === 2 ? 
                            null
                            :
                            <div style={{width: 100, color: '#18B583'}} onClick={this.onAdd}>
                                <Icon type="plus" style={{color: '#18B583'}} />
                                <a>添加费用项</a>
                            </div>
                        }
                        </Popover>
                        {
                            this.props.showSync && this.props.openType !== 2 &&
                            <Popconfirm
                                placement="topLeft"
                                title="确认同步会覆盖原数据"
                                onConfirm={this.syncData}
                                okText="确定"
                                cancelText="取消"
                            >
                                <div style={{cursor: 'pointer'}}>
                                    <img src={asyncImg} style={{marginRight: 5}}/>
                                    <span style={{color: '#18B583'}}>费用项同步</span>
                                </div>
                            </Popconfirm>
                        }
                    </div>
                </div>
                <div className="expense-config-wrapper">
                    <Table
                        getThis={v => {
                            this.tableView = v
                        }}
                        bordered={true}
                        noLoading={true}
                        //size="small"
                        //scroll={{x: false, y: 260}}
                        isHideHeaderButton
                        isNoneSelected
                        isNoneNum
                        isNoneAction={openType === 2 ? true : false}
                        isNonePagination={true}
                        //title={''}
                        parent={this}
                        power={{}}
                        actionWidth={90}
                        actionView={this.actionView}
                        params={this.state.params}
                        getData={this.getData}
                        columns={this.state.columns}
                        style={{padding: '0'}}
                        tableHeight={260}
                        tableWidth={0}
                    >
                    </Table>
                </div>
            </div>
        )
    }
}

class ExpenseItem extends Component {

    render() { 
        const { route, style, openType } = this.props
        return ( 
            <div className="right common-style" style={style ? style : null}>
                <TableView {...this.props} />
            {/* {
                route ? 
                <div>
                    <TableView {...this.props} />
                </div>
                :
                <span>请选择报价路线</span>
            } */}
            </div>
        )
    }
}
 
export default ExpenseItem;