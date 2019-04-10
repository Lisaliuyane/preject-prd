
import React, { Component, Fragment } from 'react'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { Menu, Dropdown, Icon, message, Button } from 'antd'
import AddOrEdit from './addoredit'
import QuoTation from './quotation'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import AddressCascader from '@src/components/select_address/cascader.jsx'
import { children, id } from './power'
import { trim, addressFormat, stringToArray } from '@src/utils'
import UploadExcel from '@src/components/upload_excel'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { dateSelectData } from './date_select_data'
import './index.less'
const power = Object.assign({}, children, id)

const areaToString = (d) => {
    if (d && typeof d === 'string' && d.startsWith('[')) {
        return JSON.parse(d).map(item => item.title).join(',')
    } else {
        return '无'
    }
}

const typeData = [
    {
        id: 1,
        title: '运作承运商'
    },
    {
        id: 2,
        title: '无车承运人'
    },
    {
        id: 3,
        title: '信息部(黄牛)'
    },
    {
        id: 4,
        title: '车队'
    },
    {
        id: 5,
        title: '装卸公司'
    }
]


const MenuContent = (props) => {
    return(
        <Menu>
            <Menu.Item key="0">
                <a onClick={props.referenceQuotation()}>参考报价</a>
            </Menu.Item>
            <Menu.Item key="1">
                编辑
            </Menu.Item>
            <Menu.Item key="3">删除</Menu.Item>
        </Menu>
    )
}

/**
 * 承运商资源
 * 
 * @class Node
 * @extends {Component}
 */
@inject('rApi')
@inject('mobxDataBook', 'mobxBaseData')
@observer
export default class Carrier extends Parent {

    state = {
        keyword: null, // 关键字
        cooperateStatus: 0, //合作状态
        departure: null, //起运地
        departureData: [], //起运地数据
        destination: null,// 目的地
        destinationData: null,// 目的地数据
        jurisdictionId: 0, //管辖所属编号
        limit: 10, // 
        mainBusiness: 0,//主营业务
        offset: 0, // 
        serviceIndustry: 0, //服务行业
        carrierType: null,
        importLoading: false,
        exportLoading: false
    }

    constructor(props) {
        super(props)
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                title: '承运商代码',
                dataIndex: 'code',
                key: 'code',
                width: 100,
                render: (text, r, index) => {
                    let name = r.code ? r.code|| r.code : '-'
                    return(
                        // <span>{r.code ? r.code|| r.code : '无'}</span>
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '承运商简称',
                dataIndex: 'abbreviation',
                key: 'abbreviation',
                width: 160,
                render: (text, r, index) => {
                    let abbreviationVul = r.abbreviation  ? r.abbreviation : '-'
                    return(
                        <ColumnItemBox name={abbreviationVul} />
                    )
                }
            },
            {
                width: 400,
                className: 'text-overflow-ellipsis',
                title: '承运商地址',
                dataIndex: 'address',
                key: 'address',
                render: (text, r, index) => {
                    let addr = addressFormat(r.address) ? addressFormat(r.address) : '-'
                    return(
                        <ColumnItemBox name={addr} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '所属片区',
                dataIndex: 'areaName',
                key: 'areaName',
                width: 220,
                render: (text, r, index) => {
                    let areaVul = r.areaName  ? r.areaName : '-'
                    return(
                        <ColumnItemBox name={areaVul} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                width: 150,
                render: (text, r, index) => {
                    let type = r.type ? r.type : '-'
                    return(
                        <ColumnItemBox name={type} />
                    )
                }
            },
            // {
            //     className: 'text-overflow-ellipsis',
            //     title: '管辖所属',
            //     dataIndex: 'jurisdictionName',
            //     key: 'jurisdictionName',
            //     render: (text, r, index) => {
            //         return(
            //             <span>{r.jurisdictionName ? r.jurisdictionName || r.jurisdictionName : '无'}</span>
            //         )
            //     }
            // },
            {
                className: 'text-overflow-ellipsis',
                title: '状态',
                dataIndex: 'cooperateStatusName',
                key: 'cooperateStatusName',
                render: (text, r, index) => {
                    return(
                        <span>{r.cooperateStatusName ? r.cooperateStatusName : '-'}</span>
                    )
                }
            }
        ]
    }
   
    updateData = () => {
        this.getAllData()
    }
    
    getAllData = () => {
        let { rApi } = this.props
        rApi.getCarrierList({
            limit: 200,
            offset: 0
        }).then(res => {
            let data = res.records
           //(d.data.address && typeof(d.data.address) === 'string') ? JSON.parse(d.data.address) : d.data.address ? d.data.address : {},
            //console.log('getAllData', data)
            let oldData = data.map(item => {
                let addressData = (item.address && typeof(item.address) === 'string') ? JSON.parse(item.address) : item.address ? item.address : {}
                let proVul = ''
                let cityVul= ''
                let countyVul = ''
                let streetVul = ''
                let extraVul = ''
                let s = ''
                if (addressData.pro) {
                    proVul = addressData.pro.name
                }
                if (addressData.city) {
                    cityVul = addressData.city.name
                    //delete city.children
                }
                if (addressData.dist) {
                    countyVul = addressData.dist.name
                    //delete county.children
                }
                if (addressData.street) {
                    streetVul = addressData.street.name
                    //delete street.children
                }
                if(addressData.extra) {
                    extraVul = addressData.extra ? addressData.extra : ''
                }
                if(proVul) {
                    s += proVul
                }
                if(cityVul) {
                    s += '/'
                    s += cityVul
                }
                if(countyVul) {
                    s += '/'
                    s += countyVul
                }
                if(streetVul) {
                    s += '/'
                    s += streetVul
                }
                if(extraVul) {
                    s += ' '
                    s += extraVul
                }
                let obj = {
                    id: item.id,
                    address: {
                        pro: proVul,
                        city: cityVul,
                        dist: countyVul,
                        street: streetVul,
                        extra: extraVul,
                        formatAddress: s
                    },
                    areaName: (stringToArray(item.areaName) && stringToArray(item.areaName).length > 0) ? stringToArray(item.areaName).map(d => {
                        return d.title
                    }).join(',') : '',
                    customer:(stringToArray(item.customer) && stringToArray(item.customer).length > 0) ? stringToArray(item.customer).join(',') : ''
                }
                return obj
            })
            this.updateOldData(oldData)
        }).catch(e => {
            console.log(e)
        })
    }

    updateOldData = (value) => {
        const { rApi } = this.props
        rApi.updateOldData(value).then(res => {
            console.log('操作成功')
        }).catch(e => {
            console.log('操作失败')
        })
    }

    onChangeValue = () => {
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    getData = (params) => {
        const {
            keyword,
            cooperateStatus, 
            departure,
            destination,
            jurisdictionId,
            mainBusiness,
            serviceIndustry,
            offset,
            carrierType
        } = this.state
        params = Object.assign({}, {
            keyword,
            cooperateStatus, 
            departure,
            destination,
            jurisdictionId,
            mainBusiness,
            serviceIndustry,
            offset,
            carrierType
        },  params)
        for (let key in params) {
            if (!params[key]) {
                delete params[key]
            }
        }
        const { rApi } = this.props
        this.params = params
        return new Promise((resolve, reject) => {
            rApi[power.apiName](params).then(d => {
                resolve({
                    dataSource: d.records || [], 
                    total: d.total
                })
            }).catch(err => {
                reject(err)
            })
        })
    }

    onChangeCheckbox = (checked, index) => {
        this.state.columns[index].isNoDisplay = !checked
        this.setState({columns: this.state.columns})
    }

    showAdd = () => {
        this.addoredit.show({
            edit: false
        })
    }

    handleChangeAddress = (value,selectedOptions) => {
        this.setState({
            departure: value && value.length > 0 ? value.join('/') : null
        }, this.onChangeValue({
            departure: value && value.length > 0 ? value.join('/') : null
        }))
    }

    handleChangeAddress2 = (value,selectedOptions) => {
        this.setState({
            destination: value && value.length > 0 ? value.join('/') : null
        }, this.onChangeValue({
            destination: value && value.length > 0 ? value.join('/') : null
        }))
    }

    onLook = (value) => {
        this.addoredit.show({
            data: value
        })
    }

    onEdit = (value) => {
        this.addoredit.show({
            data: value,
            edit: true
        })
    }

    onDelete = (value) => {
        let { rApi } = this.props
        rApi.delCarrier([value.id]).then(d => {
            message.success('操作成功!')
            this.searchCriteria()
        }).catch(e => {
            message.error(e.msg || '操作失败!')
        })
    }

    referenceQuotation = (value) => {
        this.quotation.show({
            data: value,
            edit: true
        })
    }

    tableActionView = ({text, record, index, onDeleteItem, onEditItem, DeleteButton}) => {
        const menu = (
            <Menu>
                <Menu.Item key="referenceQuotation">
                    <a onClick={() => this.referenceQuotation(record)} style={{color: '#666666'}}>参考报价</a>
                </Menu.Item>
                <Menu.Item key="onEdit">
                    <FunctionPower power={power.EDIT_DATA}>
                        <a onClick={() => this.onEdit(record)} style={{color: '#666666'}}>编辑</a>
                    </FunctionPower>
                </Menu.Item>
                <Menu.Item key="onDelete">
                    <FunctionPower power={power.DEL_DATA}>
                        <a onClick={() => this.onDelete(record)} style={{color: '#666666'}}>删除</a>
                    </FunctionPower>
                </Menu.Item>
            </Menu>
          )
        return[
            <FunctionPower power={power.LOOK_MORE}  key={'onLook'}>
                <span
                    className={`action-button`}
                    style={{color: '#18B56F', marginRight: '5px'}}
                    onClick={() => this.onLook(record)}
                >
                    查看
                </span>
            </FunctionPower>,
            <Dropdown key={index} overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link"  style={{color: '#18B56F'}}>
                    更多 <Icon type="down"  style={{color: '#18B56F'}} />
                </a>
            </Dropdown>
        ]
    }

    groupData = (data, cooperates) => {
        data = data.filter(item => item.length > 0)
        let header = data[0].map(item => {
            return null
        })
        if (data && data.length >1) {
            let d = data.slice(2).map(item => {
                let array = []
                array = Array.from(array)
                if (item.length < header.length) {
                    header.forEach((d, i) => {
                        array[i] = item[i]
                    })
                } else {
                    array = Array.from(item)
                }
                return array
            })
            if(d && d.length === 0) {
                message.error('导入数据不能为空!')
                return false
            }
            this.flag = false
            let importData = []
            try {
                importData = d.map((item, parentIndex) => { //序列化导入的数据
                    let s = ''
                    if(item && item[2]) {
                        s += item[2]
                    }
                    if(item && item[3]) {
                        s += '/'
                        s += item[3]
                    }
                    if(item && item[4]) {
                        s += '/'
                        s += item[4]
                    }
                    if(item && item[5]) {
                        s += '/'
                        s += item[5]
                    }
                    if(item && item[6]) {
                        s += ' '
                        s += item[6]
                    }
                    let cooperateStatusData = cooperates[0].filter(d => d.cooperateStatusName === item[14])
                    if(!cooperateStatusData && cooperateStatusData.length === 0) {
                        this.flag = true
                        message.error(`第${parentIndex + 1}行${item[14]}不存在!`)
                        throw new Error('end')
                    }//合作状态
                    let serviceIndustryData = (item[9] && item[9].split(',').length > 0) ? item[9].split(',').map(d => { //服务行业
                        let filter = cooperates[1].filter(item => item.dictionaryName === d)
                        if(filter[0]) {
                            return filter[0]
                        } else {
                            this.flag = true
                            message.error(`第${parentIndex + 1}行${d}不存在!`)
                            throw new Error('end')
                        }
                    }) : []
                    let mainBusinessData = (item[10] && item[10].split(',').length > 0) ? item[10].split(',').map(d => { //主营业务
                        let obj = cooperates[2].filter(item => item.dictionaryName === d)
                        if(obj[0]) {
                            return obj[0]
                        } else {
                            this.flag = true
                            message.error(`第${parentIndex + 1}行${d}不存在!`)
                            throw new Error('end')
                        }
                    }) : []
                    let checkAccountPeriodData = cooperates[4].filter(d => d.name === item[17]) //对账周期
                    let obj = {
                        name: item[0],
                        abbreviation: item[1],
                        address: {
                            pro: item[2] ? item[2] : null,
                            city: item[3] ? item[3] : null,
                            dist: item[4] ? item[4] : null,
                            street: item[5] ? item[5] : null,
                            extra: item[6] ? item[6] : null,
                            formatAddress: s
                        },
                        areaName: item[7] ? item[7] : null,
                        type: item[8] ? item[8] : null,
                        serviceIndustry: serviceIndustryData,
                        mainBusiness: mainBusinessData,
                        staffCount: item[11] ? item[11] : null,
                        carCount: item[12] ? item[12] : null,
                        customer: item[13] ? item[13] : null,
                        ...cooperateStatusData[0],
                        // cooperateStatusName: item[14],
                        // cooperateStatus: 0, //id=>根据名字找id
                        startCooperateTime: item[15] ? item[15] : null,
                        endCooperateTime: item[16] ? item[16] : null,
                        checkAccountPeriod: (checkAccountPeriodData && checkAccountPeriodData.length > 0) ? checkAccountPeriodData[0].id : null, //对账周期改
                        payee: item[18] ? item[18] : item[18],
                        openAccountBank: item[19] ? item[19] : null,
                        payeeAccount: item[20] ? item[20] : null,
                        //associatePaymentCarrierId: (associatePaymentData && associatePaymentData.length > 0) ? associatePaymentData[0].id : null, //付款承运商
                        uploadFileVo: [],
                        removeAttachmentIds: []
                    }
                    return obj
                })
            } catch(e) {
                if(e.message !== 'end') throw e
            }

            this.open = true
            try {
                importData.forEach((item, index) => {
                    if(!item.name) {
                        message.error(`第${index+1}行承运商名称不能为空!`)
                        this.open = false
                        throw new Error('end')
                    } else if(!item.abbreviation) {
                        message.error(`第${index+1}行承运商简称不能为空!`)
                        this.open = false
                        throw new Error('end')
                    } else if(!item.address.pro) {
                        message.error(`第${index+1}行省不能为空!`)
                        this.open = false
                        throw new Error('end')
                    } else if(!item.type) {
                        message.error(`第${index+1}行承运商类型不能为空!`)
                        this.open = false
                        throw new Error('end')
                    } else if(!item.cooperateStatus || !item.cooperateStatusName) {
                        message.error(`第${index+1}行合作状态不存在!`)
                        this.open = false
                        throw new Error('end')
                    }
                })
            } catch(e) {
                if(e.message !== 'end') throw e
            }
            if(!this.open || this.flag) {
                this.setState({
                    importLoading: false
                })
                return
            }
            this.importSave(importData)
            // return importData
        }
        // return []
    }

    getExcelData = (data) => { //导入
        Promise.all([this.getCooperateStatus(), this.getServiceIndustry(), this.getMainBusiness(), this.getCanDrawABillData(), dateSelectData()]).then((cooperates) => {
            let dataSouce = this.groupData(data, cooperates)
        })
    }

    importSave = (value) => { // 导入请求
        const { rApi } = this.props
        this.setState({
            importLoading: true
        })
        rApi.batchSaveCarrier(value).then(res => {
            this.setState({
                importLoading: false
            })
            message.success('导入成功!')
            this.onChangeValue()
        }).catch(e => {
            this.setState({
                importLoading: false
            })
            message.error(e.msg || '操作失败!')
        })
    }

    getCooperateStatus = () => { //获取合作状态数据
        const { mobxDataBook } = this.props
        const promise = mobxDataBook.initData('合作状态')
        return new Promise((resolve, reject) => {
            promise.then(res => {
                if(res && res.length > 0) {
                    let data =  res.map(item => {
                        let obj = {
                            cooperateStatus: item.id,
                            cooperateStatusName: item.title
                        }
                        return obj
                    })
                    resolve(data)
                } else {
                    resolve([])
                }
            }).catch(e => {
                reject(e)
            })
        })
        
    }

    getServiceIndustry = () => { //获取服务行业数据
        const { mobxDataBook } = this.props
        const promise = mobxDataBook.initData('客户行业')
        return new Promise((resolve, reject) => {
            promise.then(res => {
                if(res && res.length > 0) {
                    let data =  res.map(item => {
                        let obj = {dictionaryId: item.id, dictionaryName: item.title}
                        return obj
                    })
                    resolve(data)
                } else {
                    resolve([])
                }
            }).catch(e => {
                reject(e)
            })
        })
        
    }

    getMainBusiness = () => { //获取主营业务数据
        const { mobxDataBook } = this.props
        const promise = mobxDataBook.initData('业务类型')
        return new Promise((resolve, reject) => {
            promise.then(res => {
                if(res && res.length > 0) {
                    let data =  res.map(item => {
                        let obj = {dictionaryId: item.id, dictionaryName: item.title}
                        return obj
                    })
                    resolve(data)
                } else {
                    resolve([])
                }
            }).catch(e => {
                reject(e)
            })
        })
        
    }

    getCanDrawABillData = () => { //获取付款承运商数据
        const { rApi } = this.props
        return new Promise((resolve, reject) => {
            rApi.getCanDrawABill().then(res => {
                if(res && res.length > 0) {
                    let data =  res.map(item => {
                        let obj = {id: item.id, name: item.name}
                        return obj
                    })
                    resolve(data)
                } else {
                    resolve([])
                }
            }).catch(e => {
                reject(e)
            })
        })
    }

    export = () => { //导出
        const { rApi } = this.props
        this.setState({
            exportLoading: true
        })
        this.params.limit = 99999
        rApi.carrierExport(this.params).then(res => {
            // console.log('ress', res)
            let fileName = `承运商列表.xlsx`
            try {
                let header = res.headers
                let contentDsposition = header['content-disposition']
                contentDsposition = contentDsposition.split(';')[1]
                fileName = window.decodeURIComponent(contentDsposition.replace('filename=', ''))
            } catch (e) {
                console.error(e)
            }
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            this.setState({
                exportLoading: false
            })
        }).catch(e => {
            message.error(e.msg || '操作失败!')
            this.setState({
                exportLoading: false
            })
        })
    }

    exportTemplate = () => { //导出模板
        const { rApi } = this.props
        rApi.carrierExportTemplate().then(res => {
            // console.log('ress', res)
            let fileName = `承运商模板.xlsx`
            try {
                let header = res.headers
                let contentDsposition = header['content-disposition']
                contentDsposition = contentDsposition.split(';')[1]
                fileName = window.decodeURIComponent(contentDsposition.replace('filename=', ''))
            } catch (e) {
                console.error(e)
            }
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
        }).catch(e => {
            message.error(e.msg || '操作失败!')
        })
    }

    render() {
        let { mobxBaseData } = this.props
        let tableHeight = mobxBaseData.tableHeight
        let { importLoading, exportLoading } = this.state
        return (
            <div className="main-carrier" style={{ background: '#eee', minHeight: this.props.minHeight }}>
                <AddOrEdit 
                    parent={this}
                    getThis={(v) => this.addoredit = v}
                />
                <QuoTation 
                    parent={this}
                    getThis={(v) => this.quotation = v}
                />
                <HeaderView style={{background: '#eee'}} parent={this} title="承运商代码/名称" onChangeSearchValue={
                    keyword => {
                        this.setState({keyword: trim(keyword)}, this.onChangeValue({keyword: trim(keyword)}))
                }
                }>
                    <AddressCascader
                        defaultValue={[]}
                        placeholder='输入起运地' 
                        handleChangeAddress={this.handleChangeAddress}
                    />
                    <AddressCascader
                        defaultValue={[]}
                        placeholder='输入目的地' 
                        handleChangeAddress={this.handleChangeAddress2}
                    />
                    <RemoteSelect 
                        onChangeValue={
                            e => {
                                //let id = e ? e.id : 0
                                this.setState({serviceIndustry: e ? e.id : ''}, this.onChangeValue({serviceIndustry: e ? e.id : null}))
                            }
                        }
                        placeholder='服务行业'
                        text="客户行业">
                    </RemoteSelect>
                    <RemoteSelect 
                        onChangeValue={
                            e => {
                                //let id = e ? e.id : 0
                                this.setState({mainBusiness: e ? e.id : ''}, this.onChangeValue({mainBusiness: e ? e.id : null}))
                            }
                        }
                        placeholder='主营业务'
                        text="业务类型">
                    </RemoteSelect>
                    <RemoteSelect 
                        onChangeValue={
                            e => {
                                //let id = e ? e.id : 0
                                this.setState({cooperateStatus: e ? e.id : ''}, this.onChangeValue({cooperateStatus: e ? e.id : null}))
                            }
                        }
                        placeholder='合作状态'
                        text="合作状态">
                    </RemoteSelect>
                    <RemoteSelect
                        onChangeValue={
                            value => {
                                this.setState(
                                    {
                                        carrierType: value ? value.title : ''
                                    },this.onChangeValue({carrierType: value ? value.title : ''}))
                            }
                    } 
                        placeholder='承运商类型'
                        filterField='id' 
                        labelField='title' 
                        list={typeData}
                    />
                </HeaderView>
                <Table
                    // style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px 0 rgba(0,0,0,0.2)', margin: '0 10px' }}
                    className="index-list-table-style"
                    title="承运商列表"
                    //scroll={{x: 1650, y: tableHeight}}
                    tableHeight={tableHeight}
                    parent={this}
                    power={power}
                    params={this.state.params}
                    getData={this.getData}
                    columns={this.state.columns}
                    actionView={this.tableActionView}
                    actionWidth={90}
                    TableHeaderChildren={
                        <Fragment>
                            <UploadExcel getExcelData={this.getExcelData} loading={importLoading} power={power.IMPORT_CARRIER} />
                            <FunctionPower power={power.EXPORT_LIST}>
                                <Button icon="export" loading={exportLoading} onClick={this.export} style={{marginRight: 10, verticalAlign: 'middle'}}>导出</Button>
                            </FunctionPower>
                            <FunctionPower power={power.EXPORT_TEMP}>
                                <Button icon="export" onClick={this.exportTemplate} style={{marginRight: 10, verticalAlign: 'middle'}}>导出模板</Button>
                            </FunctionPower>
                           {/* <Button onClick={this.updateData}  style={{marginRight: 10, verticalAlign: 'middle'}}>数据更新</Button> */}
                        </Fragment>
                    }
                >
                </Table>
            </div>
        )
    }
}
