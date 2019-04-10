import React, { Component, Fragment } from 'react'
import { message, Button, Tag } from 'antd'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import AddOrEdit from './addoredit'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { children, id } from './power'
import { deleteNull, trim} from '@src/utils'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import UploadExcel from '@src/components/upload_excel'
const power = Object.assign({}, children, id)

let carCodeTypedata = [
    {
        licensePlateId: 2,
        licensePlateType: '港车'
    },
    {
        licensePlateId: 3,
        licensePlateType: '澳车'
    }
]

/**
 * 车辆资源
 * 
 * @class CarRes
 * @extends {Component}
 */
@inject('mobxTabsData', 'mobxBaseData', 'rApi')
@observer
class CarRes extends Parent {

    state = {
        carKind: null, // 车种
        carType: null, // 车型
        keyword: null, // 关键字
        params: {},
        associateCarrier: null, // 所属承运商
        limit: 10,
        offset: 0,
        importLoading: false,
        exportLoading: false

    }

    constructor(props) {
        super(props)
        this.state.columns = [
            {
                width: 120,
                className: 'text-overflow-ellipsis',
                title: '车牌',
                dataIndex: 'carCode',
                key: 'carCode',
            },
            {
                width: 140,
                className: 'text-overflow-ellipsis',
                title: '车型',
                dataIndex: 'carTypeName',
                key: 'carTypeName',
                render: (t, r, index) => {
                    let name = r.isTemporary === 1 ? null : (r.carTypeName ? r.carTypeName : '-')
                    let tagName = r.isTemporary === 1 ? '临时车辆' : null
                    return (
                        <ColumnItemBox name={name} tagName={tagName} isModeTag={r.isTemporary === 1} />
                    )
                }
            },
            {
                width: 250,
                className: 'text-overflow-ellipsis',
                title: '所属司机',
                dataIndex: 'area',
                key: 'area',
                render: (text, r, index) => {
                    let name =  r.driverName ? r.driverName : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 200,
                className: 'text-overflow-ellipsis',
                title: '所属承运商',
                dataIndex: 'status',
                key: 'status',
                render: (text, r, index) => {
                    let name = r.carrierAbbreviation ? r.carrierAbbreviation : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 100,
                className: 'text-overflow-ellipsis',
                title: '状态',
                dataIndex: 'authenticationStatusName',
                key: 'authenticationStatusName',
                render: (text, r, index) => {
                    let name =  r.authenticationStatusName ? r.authenticationStatusName : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '备注信息',
                dataIndex: 'remark',
                width: 330,
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
        const {carKind, carType, keyword, associateCarrier} = this.state
        params = Object.assign({}, {carKind, carType, keyword, associateCarrier}, params)
        const { rApi } = this.props
        this.params = params
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

    validateCarCodeAndNoNull = (value) => { //车牌号码校验包含新能源
        var xreg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/
        var creg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/
        if(!value || value === ''){
           return true
        } else if(xreg.test(value) || creg.test(value)) {
            return false
        } else {
            return true
        }
    }

    getExcelData = (data) => { //导入数据处理
        data = data.filter(item => item.length > 0)
        let header = data[0].map(item => {
            return null
        })
        if (data && data.length >1) {
            let d = data.slice(1).map(item => {
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

            // d.forEach((item, index) => {
            //     if(this.validateCarCodeAndNoNull(item[0])) {
            //         message.error(`第${index+1}行车牌号格式错误`)
            //         return false
            //     }
            // })

            let importData = d.map((item, index) => { //序列化导入的数据
                let obj = {
                    carCode: item[0], //车牌
                    ...this.getCarCodeTypedata(item[1]),
                    trailerCarCode: item[2] ? item[2] : null, //挂车车牌
                    carTypeName: item[3] ? item[3] : null,
                    carWeight: item[4] ? item[4] : null,
                    registerDate: item[5] ? item[5] : null,
                    configCarType: item[6] ? item[6] : null,
                    attachCarrierName: item[7] ? item[7] : null,
                    driverName: item[8] ? item[8] : null,
                    driverCard: item[9] ? item[9] : null,
                    phone: item[10] ? item[10] : null,
                    remark: item[11] ? item[11] : null
                }
                return obj
            })

            this.open = true
            try {
                importData.forEach((item, index) => {
                    if(!item.carCode) {
                        message.error(`第${index+1}行车牌号码行不能为空!`)
                        this.open = false
                        throw new Error('end')
                    } else if(!item.carTypeName) {
                        message.error(`第${index+1}行车型不能为空!`)
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

    getCarCodeTypedata = (value) => {
        if(value) {
            return carCodeTypedata.filter(item => item.licensePlateType === value)[0]
        }
        return{
            licensePlateType: null, 
            licensePlateId: null
        }
    }

    importSave = (value) => { //导入请求
        const { rApi } = this.props
        this.setState({
            importLoading: true
        })
        rApi.batchSaveCar(value).then(d => {
            message.success('操作成功!')
            this.setState({
                importLoading: false
            })
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
        rApi.carExport(this.params).then(res => {
            // console.log('ress', res)
            let fileName = `车辆列表.xlsx`
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
        rApi.carExportTemplate().then(res => {
            // console.log('ress', res)
            let fileName = `车辆模板.xlsx`
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
        // let {
        //     carKind, // 车种
        //     carType, // 车型
        //     keyword, // 关键字
        //     associateCarrier, // 所属承运商
        // } = this.state
        let { mobxBaseData } = this.props
        let tableHeight = mobxBaseData.tableHeight
        let {importLoading, exportLoading} = this.state
        return (
            <div style={{ background: '#eee', minHeight: this.props.minHeight }}>
                <AddOrEdit 
                    parent={this}
                    getThis={(v) => this.addoredit = v}
                />
                <HeaderView parent={this} title="车牌号码/司机姓名" onChangeSearchValue={
                    keyword => {
                        this.setState({keyword: trim(keyword)}, this.onChangeValue({keyword: trim(keyword)}))
                }
                }>
                    {/* <RemoteSelect 
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({carKind: e ? e.id : null}, this.onChangeValue({carKind: e ? e.id : null}))
                                //console.log('e', e.id)
                            }
                        }
                        placeholder='车种'
                        text="车种"
                    >
                    </RemoteSelect> */}
                    <RemoteSelect 
                        onChangeValue={
                            e => {
                                //let id = e ? e.id : 0
                                this.setState({carType: e ? e.id : null}, this.onChangeValue({carType: e ? e.id : null}))
                            }
                        }
                        placeholder='车型'
                        getDataMethod={'getCarTypes'}
                        params={{offset: 0, limit: 1000}}
                        labelField={'name'}
                        >
                    </RemoteSelect>
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                //let id = e ? e.id : 0
                                this.setState({associateCarrier: e ? e.id : null}, this.onChangeValue({associateCarrier: e ? e.id : null}))
                            }
                        }
                        placeholder='所属承运商'
                        labelField={'abbreviation'}
                        getDataMethod={'getCooperationCarriet'}
                        >
                    </RemoteSelect>
                </HeaderView>
                <Table
                    className="index-list-table-style"
                    title="车辆资源"
                    parent={this}
                    power={power}
                    params={this.state.params}
                    getData={this.getData}
                    columns={this.state.columns}
                    tableHeight={tableHeight}
                    TableHeaderChildren={
                        <Fragment>
                            <UploadExcel getExcelData={this.getExcelData} loading={importLoading} power={power.IMPORT_CAR} />
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
 
export default CarRes;