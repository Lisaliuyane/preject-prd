import React, { Component, Fragment } from 'react'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { message, Button } from 'antd'
import AddOrEdit from './addoredit'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import AddressCascader from '@src/components/select_address/cascader.jsx'
import { children, id } from './power'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import UploadExcel from '@src/components/upload_excel'
import { trim, addressFormat } from '@src/utils'
const power = Object.assign({}, children, id)

/**
 * 司机资源
 * 
 * @class Driver
 * @extends {Component}
 */
@inject('mobxTabsData', 'mobxBaseData')
@inject('rApi')
@observer
class Driver extends Parent {

    state = {
        address: null, // 工作地址
        jurisdiction: 0, //管理归属
        limit: 10, //
        name: null, // 司机名字
        offset: 0,
        partnerStatus: 0, // 合作状态
        importLoading: false,
        exportLoading: false
        
    }

    constructor(props) {
        super(props)
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                title: '司机姓名',
                dataIndex: 'name',
                key: 'name',
                width: 140,
                render: (text, r, index) => {
                    let name = r.name ? r.name : '-'
                    let tagName = r.isTemporary === 1 ? '临时司机' : null
                    return (
                        <ColumnItemBox name={name} tagName={tagName} isModeTag={r.isTemporary === 1} />
                    )
                }
            },
            // {
            //     className: 'text-overflow-ellipsis',
            //     title: '节点类型',
            //     dataIndex: 'nodetypeid',
            //     key: 'nodetypeid',
            // },
            {
                width: 300,
                className: 'text-overflow-ellipsis',
                title: '工作地址',
                dataIndex: 'address',
                key: 'address',
                render: (text, r, index) => {
                    //let addressVul = (r.address && typeof(r.address) === 'string') ? JSON.parse(r.address) : r.address ? r.address : '无'
                    let name = addressFormat(r.address) ? addressFormat(r.address) : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 140,
                className: 'text-overflow-ellipsis',
                title: '联系方式',
                dataIndex: 'phone',
                key: 'phone',
                render: (text, r, index) => {
                    let name = r.phone ? r.phone : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            // {
            //     width: 200,
            //     className: 'text-overflow-ellipsis',
            //     title: '所属承运商',
            //     dataIndex: 'carrierName',
            //     key: 'carrierName',
            //     render: (text, r, index) => {
            //         return(
            //             <div className="text-overflow-ellipsis" style={{width: 179}}>
            //                 <span>{r.type === 0 ? '现金车' : r.carrierName ? r.carrierName|| r.carrierName : '无'}</span>
            //             </div>
            //         )
            //     }
            // },
            // {
            //     width: 200,
            //     className: 'text-overflow-ellipsis',
            //     title: '管理归属',
            //     dataIndex: 'jurisdictionName',
            //     key: 'jurisdictionName',
            //     render: (text, r, index) => {
            //         return(
            //             <span>{r.jurisdictionName ? r.jurisdictionName || r.jurisdictionName : '无'}</span>
            //         )
            //     }
            // },
            {
                width: 100,
                className: 'text-overflow-ellipsis',
                title: '认证情况',
                dataIndex: 'authenticationStatusName',
                key: 'authenticationStatusName',
                render: (text, r, index) => {
                    let name = r.authenticationStatusName ? r.authenticationStatusName : '未认证'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 380,
                className: 'text-overflow-ellipsis',
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
                render: (text, r, index) => {
                    let name = r.remark ? r.remark : '-'
                    return(
                        <ColumnItemBox name={name} />
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
            address, // 工作地址
            jurisdiction, //管理归属
            limit, //
            name, // 司机名字
            offset,
            partnerStatus, // 合作状态
        } = this.state
        params = Object.assign({}, {address, jurisdiction, limit, name, offset, partnerStatus}, params)
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
        //console.log('handleChangeAddress', value)
        this.setState({
            address: value && value.length > 0 ? value[value.length-1] : null
        }, this.onChangeValue({
            address: value && value.length > 0 ? value[value.length-1] : null
        }))
    }

    getExcelData = (data) => { //导入数据处理
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

            let importData = d.map((item, index) => { //序列化导入的数据
                let s = ''
                if(item && item[7]) {
                    s += item[7]
                }
                if(item && item[8]) {
                    s += '/'
                    s += item[8]
                }
                if(item && item[9]) {
                    s += '/'
                    s += item[9]
                }
                if(item && item[10]) {
                    s += '/'
                    s += item[10]
                }
                if(item && item[11]) {
                    s += ' '
                    s += item[11]
                }
                let obj = {
                    name: item[0] ? item[0] : null,
                    sex: item[1] ? item[1] : null,
                    birthday: item[2] ? item[2] : null,
                    birthPlace: item[3] ? item[3] : null,
                    idNumber: item[4] ? item[4] : null,
                    phone: item[5] ? item[5] : null,
                    phoneBackup: item[6] ? item[6] : null,
                    address: {
                        pro: item[7] ? item[7] : null,
                        city: item[8] ? item[8] : null,
                        dist: item[9] ? item[9] : null,
                        street: item[10] ? item[10] : null,
                        extra: item[11] ? item[11] : null,
                        formatAddress: s
                    },
                    areaName: item[12] ? item[12] : null,
                    driverLicenseNumber: item[13] ? item[13] : null,
                    startEffectiveDate: item[14] ? item[14] : null,
                    endEffectiveDate: item[15] ? item[15] : null,
                    drivingExperience: item[16] ? item[16] : null,
                    remark: item[17]
                }
                return obj
            })

            this.open = true
            try {
                importData.forEach((item, index) => {
                    if(!item.name) {
                        message.error(`第${index+1}行姓名不能为空!`)
                        this.open = false
                        throw new Error('end')
                    } else if(!item.idNumber) {
                        message.error(`第${index+1}行身份证号不能为空!`)
                        this.open = false
                        throw new Error('end')
                    } else if(!item.phone) {
                        message.error(`第${index+1}行手机号不能为空!`)
                        this.open = false
                        throw new Error('end')
                    } else if(!item.driverLicenseNumber) {
                        message.error(`第${index+1}行驾驶证号不能为空!`)
                        this.open = false
                        throw new Error('end')
                    }
                })
            } catch(e) {
                if(e.message !== 'end') throw e
            }
            if(!this.open) {
                return
            }
            this.importSave(importData)
        }
    }

    // getCarCodeTypedata = (value) => {
    //     if(value) {
    //         return carCodeTypedata.filter(item => item.licensePlateType === value)[0]
    //     }
    //     return{
    //         licensePlateType: null, 
    //         licensePlateId: null
    //     }
    // }

    importSave = (value) => { //导入请求
        const { rApi } = this.props
        this.setState({
            importLoading: true
        })
        rApi.batchSaveDriver(value).then(d => {
            this.setState({
                importLoading: false
            })
            message.success('操作成功！')
            this.onChangeValue()
        }).catch(e => {
            message.error(e.msg || '操作失败')
            this.setState({
                importLoading: false
            })
        })
    }

    export = () => { //导出
        const { rApi } = this.props
        this.setState({
            exportLoading: true
        })
        this.params.limit = 99999
        rApi.driverExport(this.params).then(res => {
            // console.log('ress', res)
            let fileName = `司机列表.xlsx`
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
        rApi.driverExportTemplate().then(res => {
            // console.log('ress', res)
            let fileName = `司机模板.xlsx`
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
        let {  importLoading, exportLoading } = this.state
        return (
            <div style={{ background: '#eee', minHeight: this.props.minHeight }}>
                <AddOrEdit 
                    parent={this}
                    getThis={(v) => this.addoredit = v}
                />
                <HeaderView parent={this} title="司机姓名" onChangeSearchValue={
                    keyword => {
                        this.setState({name: trim(keyword)}, this.onChangeValue({name: (keyword)}))
                }
                }>
                    {/* <RemoteSelect 
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({jurisdiction: e ? e.id : ''}, this.onChangeValue({jurisdiction: e ? e.id : ''}))
                            }
                        }
                        placeholder='管辖归属'
                        text="管理归属">
                    </RemoteSelect> */}
                    {/* <RemoteSelect 
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({partnerStatus: e ? e.id : ''}, this.onChangeValue({carType: e ? e.id : ''}))
                            }
                        }
                        placeholder='合作状态'
                        text="合作状态">
                    </RemoteSelect> */}
                    <AddressCascader
                        defaultValue={[]}
                        placeholder='司机工作地址' 
                        handleChangeAddress={this.handleChangeAddress}
                    />
                </HeaderView>
                <Table
                    className="index-list-table-style"
                    title="司机列表"
                    parent={this}
                    power={power}
                    params={this.state.params}
                    getData={this.getData}
                    columns={this.state.columns}
                    tableHeight={tableHeight}
                    tableWidth={400}
                    TableHeaderChildren={
                        <Fragment>
                            <UploadExcel getExcelData={this.getExcelData} loading={importLoading} power={power.IMPORT_DRIVER}/>
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
 
export default Driver;