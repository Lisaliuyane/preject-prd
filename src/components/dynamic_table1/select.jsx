import React, { Component } from 'react';
import DynamicTable from './dynamic_table'
import { Radio, Switch } from 'antd'
import { cloneObject, isArray } from '@src/utils'

const getHeaderData = (d) => {
    let header = []
    // header.push({
    //     title: '起运地',
    //     isHaveMove: false,
    //     isShow: true,
    //     type: 'base',
    //     name: 'departure',
    //     id: 1
    // })
    // header.push({
    //     title: '目的地',
    //     isHaveMove: false,
    //     isShow: true,
    //     type: 'base',
    //     name: "destination",
    //     id: 2
    // })

    // header.push({
    //     title: '时效',
    //     isHaveMove: false,
    //     isShow: true,
    //     type: 'base',
    //     name: "aging",
    //     id: 3
    // })

    // header.push({
    //     title: '是否高速',
    //     isHaveMove: false,
    //     isShow: true,
    //     type: 'base',
    //     name: "isHighway",
    //     id: 4
    // })

    // header.push({
    //     title: '最低收费',
    //     isHaveMove: false,
    //     isShow: true,
    //     type: 'base',
    //     name: "lowestFee",
    //     id: 5
    // })

    header.push(...[
        {
            title: '起运地',
            isHaveMove: false,
            isShow: true,
            type: 'base',
            name: "departure",
            id: 1
        },
        {
            title: '中转地',
            isHaveMove: false,
            isShow: true,
            type: 'base',
            name: "transitPlaceOneName",
            id: 2
        },
        {
            title: '目的地',
            name: "destination",
            type: 'base',
            isHaveMove: false,
            isShow: true,
            id: 3
        },
        {
            title: '时效',
            name: "aging",
            type: 'base',
            isHaveMove: false,
            isShow: true,
            id: 4
        },
        {
            title: '是否高速',
            name: "isHighway",
            type: 'base',
            isHaveMove: false,
            isShow: true,
            id: 5
        },
        {
            title: '最低收费',
            name: "lowestFee",
            type: 'base',
            isHaveMove: false,
            isShow: true,
            id: 6
        },
        {
            title: '是否分拣',
            name: "isPick",
            type: 'base',
            isHaveMove: false,
            isShow: true,
            id: 7
        }
    ])

    if (d && d.quotationLineExpenseItems) {
        if (isArray(d.quotationLineExpenseItems)) {
            d.quotationLineExpenseItems.forEach(item => {
                header.push(Object.assign({}, item, {type: 'cost', name: 'chargeFee'}))
            })
        }
    }
    return header
}

const getListData = (d, header) => {
    return d.map(item => {
        let element = {
            historyData: item,
            data: []
        }
        let fixed = header.filter(it => it.type === 'base' && it.isShow)
        fixed.forEach(it => {
            if (it.id === 2) {
                element.data.push({
                    itemHeader: it,
                    value: {
                        transitPlaceOneId: item.transitPlaceOneId,
                        transitPlaceOneName: item.transitPlaceOneName,
                        transitPlaceTwoId: item.transitPlaceTwoId,
                        transitPlaceTwoName: item.transitPlaceTwoName
                    }
                })
            } else {
                element.data.push({
                    itemHeader: it,
                    value: item[it.name]
                })
            }
            // element.data.push({
            //     itemHeader: it,
            //     value: item[it.name]
            // })
        })
        // let deploys = header.filter(it => it.type === 'cost')
        // console.log('deploys', deploys, header)
        // deploys.forEach((it, index) => {
        //     element.data.push({
        //         itemHeader: it,
        //         value: item.quotationLineExpenseItems[index].chargeFee || 0, 
        //         id: item.quotationLineExpenseItems[index].id
        //     })
        // })
        element.id = item.id
        return element
    })
}

/**
 * 显示报价待选择
 * 
 * @class ReadData
 * @extends {Component}
 */
class ReadData extends Component {

    static defaultProps = {
        onlySetHeader: true,
        isNoneAction: true
    }

    state = {
        checkValue: '',
        isShowItems: false
    }

    constructor(props) {
        super(props)
        if(props.getThis) {
            props.getThis(this)
        }
        //this.state.checkValue = props.transportation[0].transportModeName
    }

    // componentWillReceiveProps(nextProps) {
    //     if(nextProps.transportation !== this.props.transportation) {
    //         console.log('componentWillReceiveProps', nextProps.transportation[0].transportModeName)
    //         this.setState({
    //             checkValue: (nextProps.transportation && nextProps.transportation.length > 0) ? nextProps.transportation[0].transportModeName : ''
    //         }, () => {
    //             this.handleChangeType()
    //         })
    //     }
    // }

    headerChange = (header) => {
        const { headerChange } = this.props
        if (headerChange) {
            headerChange(header)
        }
    }

    parentGetThis = (v) => {
        const { getThis } = this.props
        if (getThis) {
            getThis(v)
        }
    }

    customColumns = (array) => {
        // let obj = {
        //     width: 300,
        //     className: 'text-overflow-ellipsis',
        //     title: <span>{'承运商/客户'}</span>,
        //     titleString: '承运商/客户',
        //     render: (text, record, index) => {
        //         // console.log('record', record)
        //         let s = '无'
        //         let d = record.historyData
        //         if (d) {
        //             if (d.carrierName) {
        //                 s = d.carrierName
        //             }
        //         }
        //         return (
        //             <span title={s} style={{color: '#1DA57A'}}>
        //             {
        //                 s
        //             }
        //             </span>
        //         )
        //     }
        // }
        let culmns = [ // 修改
            {
                className: 'text-overflow-ellipsis',
                title: <span>起运地</span>,
                titleString: '起运地',
                key: 'departure',
                render: (text, record, index) => {
                    return (
                        <span>
                        {
                           record.departure ? record.departure : '-'
                        }
                        </span>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: <span>中转地</span>,
                titleString: '中转地',
                key: 'transitPlaceOneName',
                render: (text, record, index) => {
                    return (
                        <span>
                        {
                           record.transitPlaceOneName ? record.transitPlaceOneName : '-'
                        }
                        </span>
                    )
                }
            },{
                className: 'text-overflow-ellipsis',
                title: <span>目的地</span>,
                titleString: '目的地',
                key: 'destination',
                render: (text, record, index) => {
                    return (
                        <span>
                        {
                           record.destination ? record.destination :  '-'
                        }
                        </span>
                    )
                }
            },{
                className: 'text-overflow-ellipsis',
                title: <span>时效(h)</span>,
                titleString: '时效(h)',
                key: 'aging',
                render: (text, record, index) => {
                    return (
                        <span>
                        {
                           record.aging ? record.aging : '-'
                        }
                        </span>
                    )
                }
            },{
                className: 'text-overflow-ellipsis',
                title: <span>是否高速</span>,
                titleString: '是否高速',
                key: 'isHighway',
                render: (text, record, index) => {
                    return (
                        <span>
                        {
                           record.isHighway ? '是' : '否'
                        }
                        </span>
                    )
                }
            },{
                className: 'text-overflow-ellipsis',
                title: <span>最低消费</span>,
                titleString: '最低消费',
                key: 'lowestFee',
                render: (text, record, index) => {
                    return (
                        <span>
                        {
                           record.lowestFee ? record.lowestFee : '-'
                        }
                        </span>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: <span>是否分拣</span>,
                titleString: '是否分拣',
                key: 'isPick',
                render: (text, record, index) => {
                    return (
                        <span>
                        {
                           record.isPick ? '是' : '否'
                        }
                        </span>
                    )
                }
            }
        ]
        return culmns
    }

    handleChangeType = (e) => {
       this.setState({
            checkValue:e.target.value 
       })
       this.props.getCheckValue(e.target.value, true )
       this.parentGetThis.searchCriteria()
       //console.log('this.parentGetThis', this.parentGetThis)
    }

    onSwitchChange = (checked) => {
        this.setState({
            isShowItems: checked
        })
    }

    render() { 
        let { type, getData, actionView, transportation } = this.props
        let { checkValue } = this.state
        // data = data || []
        let d = {
            defaultValue: {
                header: cloneObject(getHeaderData()),
                data: []
            }
        }
        //console.log('transportationxxxx', transportation[0].transportModeName)
        return (
            <div style={{minHeight: 300, padding: '10px'}}>
                <div  style={{padding: '10px'}}>
                    {
                        transportation && transportation.map((item, index) => {
                            return(
                                <Radio.Group
                                    key={index}
                                    value={checkValue ? checkValue : transportation[0].transportModeName}
                                    onChange={this.handleChangeType}
                                >
                                    {
                                        <Radio.Button
                                            style={{ borderRadius: 0 }}
                                            // disabled={(showtype === 2) ? true : false}
                                            key={`${item.transportModeId}-${index}`}
                                            value={item.transportModeName}
                                        >
                                            {item.transportModeName}
                                        </Radio.Button>
                                        }
                                </Radio.Group>
                            )
                        } )  
                    }
                    {/* {
                       transportation && transportation.length > 0 ?
                       <div style={{width: 150, display: 'inline-block', marginLeft: '50px'}}>
                            <div className="flex flex-vertical-center">
                                查看费用项&emsp;<Switch size="small" style={{marginTop: '2px'}} onChange={this.onSwitchChange} />
                            </div>
                        </div>
                        :
                        ''
                    } */}
                </div>
                <DynamicTable
                    {...d}
                    customColumns={this.customColumns}
                    getThis={v => this.parentGetThis = v}
                    actionView={actionView}
                    getData={getData}
                    headerChange={this.headerChange}
                    tableTitle={'报价详情'} 
                    onlySetHeader={true}
                    isNoneSelected={true}
                    type={type} 
                    bordered={this.props.bordered}
                    isNoneHeader={true}
                    // scroll={{x: true, y: 500}}
                />
            </div>
        )
    }
}

ReadData.getListData = getListData
ReadData.getHeaderData = getHeaderData
 
export default ReadData;