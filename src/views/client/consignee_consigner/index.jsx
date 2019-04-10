import React from 'react'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import AddOrEdit from './addoredit'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { children, id } from './power'
import { deleteNull, trim, addressFormat } from '@src/utils'
const power = Object.assign({}, children, id)

const addressTypeData = [
    {
        id: 1,
        title: '发货方'
    },
    {
        id: 2,
        title: '收货方'
    }
]
/**
 * 车辆资源
 * 
 * @class CarRes
 * @extends {Component}
 */
@inject('mobxTabsData', 'mobxBaseData')
@inject('rApi')
@observer
class ConsigneeRes extends Parent {

    state = {
        areaName: 0,
        clientId: 0,
        keyWords: null,
        limit: 0,
        offset: 0,
        receiverOrSenderId: 0,
        addressType: null
    }

    constructor(props) {
        super(props)
        this.state.columns = [
            {
                width: 140,
                className: 'text-overflow-ellipsis',
                title: '收/发货方代码',
                dataIndex: 'cargoPartyCode',
                key: 'cargoPartyCode',
                render: (text, r, index) => {
                    let name = r.cargoPartyCode ? r.cargoPartyCode : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 180,
                className: 'text-overflow-ellipsis',
                title: '收/发货方',
                dataIndex: 'cargoPartyName',
                key: 'cargoPartyName',
                render: (text, r, index) => {
                    let name = r.cargoPartyName ? r.cargoPartyName : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 120,
                className: 'text-overflow-ellipsis',
                title: '地址类型',
                dataIndex: 'addressType',
                key: 'addressType',
                render: (text, r, index) => {
                    let name = r.addressType === 1 ? '发货方(区仓)' : '收货方(分部)'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 180,
                className: 'text-overflow-ellipsis',
                title: '客户名称',
                dataIndex: 'clientName',
                key: 'clientName',
                render: (text, r, index) => {
                    let name = r.clientName ? r.clientName : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 140,
                className: 'text-overflow-ellipsis',
                title: '联系人',
                dataIndex: 'contactName',
                key: 'contactName',
                render: (text, r, index) => {
                    let name = r.contactName ? r.contactName : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 140,
                className: 'text-overflow-ellipsis',
                title: '手机号码',
                dataIndex: 'cellphoneNumber',
                key: 'cellphoneNumber',
                render: (text, r, index) => {
                    let name = r.cellphoneNumber ? r.cellphoneNumber : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 300,
                className: 'text-overflow-ellipsis',
                title: '详细地址',
                dataIndex: 'address',
                key: 'address',
                render: (text, r, index) => {
                    let addressVul = (r.address && typeof(r.address) === 'string') ? JSON.parse(r.address) : r.address ? r.address : '-'
                    return(
                        <ColumnItemBox name={addressFormat(addressVul)} />
                    )
                }
            },
            {
                width: 200,
                className: 'text-overflow-ellipsis',
                title: '片区',
                dataIndex: 'areaName',
                key: 'areaName',
                render: (text, r, index) => {
                    let name = r.areaName ? r.areaName : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '归属发货方',
                dataIndex: 'defaultShipperName',
                key: 'defaultShipperName',
                render: (text, r, index) => {
                    return(
                        <span title={r.defaultShipperName}>
                        {
                            r.defaultShipperName ? r.defaultShipperName : '-'
                        }
                        </span>
                    )
                }
            }
        ]
    }

    onChangeValue = () => {
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    getData = (params) => {
        const {
            areaName,
            clientId,
            keyWords,
            limit,
            offset,
            receiverOrSenderId,
            addressType} = this.state
        params = Object.assign({}, {areaName, clientId, keyWords, limit, offset, receiverOrSenderId, addressType }, params)
        const { rApi } = this.props
        return new Promise((resolve, reject) => {
            params = deleteNull(params)
            rApi[power.apiName](params).then(d => {
                //console.log('GET_LIST', d)
                resolve({
                    dataSource: d.records || [], 
                    total: d.total
                })
            }).catch(err => {
                reject(err)
            })
        })
    }
    // getCarType = () => {
    //     this.rApi.getCarTypes()
    // }

    // onChangeCheckbox = (checked, index) => {
    //     this.state.columns[index].isNoDisplay = !checked
    //     this.setState({columns: this.state.columns})
    // }
    
    // moveColumn = (dragIndex, hoverIndex) => {
	// 	const { columns } = this.state
	// 	const dragCard = columns[dragIndex]

	// 	this.setState(
	// 		update(this.state, {
	// 			columns: {
	// 				$splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
	// 			},
	// 		}),
	// 	)
    // }

    // showAdd = () => {
    //     this.addoredit.show({
    //         edit: false
    //     })
    // }

    render() {
        let {
            areaName,
            clientId,
            keyWords,
            limit,
            offset,
            receiverOrSenderId,
            addressType
        } = this.state
        let { mobxBaseData } = this.props
        let tableHeight = mobxBaseData.tableHeight
        return (
            <div style={{ background: '#eee', minHeight: this.props.minHeight }}>
                <AddOrEdit 
                    parent={this}
                    getThis={(v) => this.addoredit = v}
                />
                <HeaderView parent={this} title="收发货方代码/名称" onChangeSearchValue={
                    keyword => {
                        this.setState({keyWords: trim(keyword)}, this.onChangeValue({keyWords: trim(keyword)}))
                }
                }>
                    <RemoteSelect 
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({clientId: e ? e.id : null}, this.onChangeValue({clientId: e ? e.id : null}))
                            }
                        }
                        placeholder='选择客户'
                        getDataMethod={'getClients'}
                        params={{limit: 999999, offset: 0, status: 56}}
                        labelField={'shortname'}
                        >
                    </RemoteSelect>
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({addressType: e ? e.id : null}, this.onChangeValue({addressType: e ? e.id : null}))
                            }
                        }
                        placeholder='地址类型'
                        // getDataMethod={'getConsignees'}
                        // params={{limit: 999999, offset: 0}}
                        labelField={'title'}
                        list={addressTypeData}
                        >
                    </RemoteSelect>
                    <RemoteSelect 
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({areaName: e ? e.name : null}, this.onChangeValue({areaName: e ? e.name: null}))
                            }
                        }
                        placeholder='所属片区'
                        text='片区'
                        >
                    </RemoteSelect>
                </HeaderView>
                <div style={{overflow: 'hidden'}}>
                    <Table
                        className="index-list-table-style"
                        title="收发货方管理"
                        parent={this}
                        power={power}
                        params={this.state.params}
                        getData={this.getData}
                        columns={this.state.columns}
                        tableHeight={tableHeight}
                        // TableHeaderChildren={<span>x</span>}
                    >
                    </Table>
                </div>
            </div>
        )
    }
}
 
export default ConsigneeRes;