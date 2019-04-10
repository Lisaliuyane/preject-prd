import React, { Component, Fragment } from 'react'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { message, Button } from 'antd'
import AddOrEdit from './addoredit'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { children, id } from './power'
import { deleteNull, trim } from '@src/utils'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import UploadExcel from '@src/components/upload_excel'
const power = Object.assign({}, children, id)
const onInClude = [
    {
        id: 1, title: '是'
    },
    {
        id: 2, title: '否'
    }
]

const heavyBubbleTypeData = [
    {
        id: 2,
        title: '重货'
    },
    {
        id: 3,
        title: '泡货'
    }
]

const materialTypeData = [
    {
        id: 1,
        title: '运输'
    },
    {
        id: 2,
        title: '仓储'
    }
]

const UnitWeigh = [
    {
        id: 1,
        title: '每板'
    },
    {
        id: 2,
        title: '每箱'
    },
    {
        id: 3,
        title: '每个'
    }
]

/**
 * 物料管理
 * 
 * @class CarRes
 * @extends {Component}
 */
@inject('rApi')
@inject('mobxDataBook', 'mobxBaseData')
@observer
class MaterialRes extends Parent {

    state = {
        clientId: 0, //客户id
        heavyBubbleId: 0, //重泡货类型id
        isIncludeWarehouseManagement: 0, //是否含仓储管理
        keyWords: null, //关键字
        limit: 10,
        offset: 0,
        importLoading: false,
        exportLoading: false,
        materialType: 1
    }

    constructor(props) {
        super(props)
        this.state.columns = [
            {
                width: 160,
                className: 'text-overflow-ellipsis',
                title: '料号',
                dataIndex: 'materialItemNumber',
                key: 'materialItemNumber',
                render: (text, r, index) => {
                    let name = r.materialItemNumber ? r.materialItemNumber : '-'
                    return(
                        <ColumnItemBox 
                            name={name} 
                            isModeTag
                            tagName={r.materialType === 2 ? '仓储' : '运输'}
                            tagBgc={r.materialType === 2 ? 'rgb(245, 166, 35)' : '#4A90E2'}
                        />
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
                title: '品名',
                dataIndex: 'itemName',
                key: 'itemName',
                render: (text, r, index) => {
                    let name = r.itemName ? r.itemName: '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 140,
                className: 'text-overflow-ellipsis',
                title: '规格',
                dataIndex: 'itemSpecifications',
                key: 'itemSpecifications',
                render: (text, r, index) => {
                    let name = r.itemSpecifications ? r.itemSpecifications: '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 80,
                className: 'text-overflow-ellipsis',
                title: '单位',
                dataIndex: 'unitName',
                key: 'unitName',
                render: (text, r, index) => {
                    let name = r.unitName ? r.unitName : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 80,
                className: 'text-overflow-ellipsis',
                title: '重泡货',
                dataIndex: 'heavyBubbleName',
                key: 'heavyBubbleName',
                render: (text, r, index) => {
                    let name = r.heavyBubbleName ? r.heavyBubbleName : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            // {
            //     width: 100,
            //     className: 'text-overflow-ellipsis',
            //     title: '是否含仓储',
            //     dataIndex: 'isIncludeWarehouseManagement',
            //     key: 'isIncludeWarehouseManagement',
            //     render: (text, r, index) => {
            //         let name = r.isIncludeWarehouseManagement === 1 ? '是' : '否'
            //         return(
            //             <ColumnItemBox name={name} />
            //         )
            //     }
            // },
            {
                className: 'text-overflow-ellipsis',
                title: '备注',
                width: 330,
                dataIndex: 'remark',
                key: 'remark',
                render: (text, r, index) => {
                    let name =  r.remark ? r.remark : '-'
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
            clientId, //客户id
            heavyBubbleId, //重泡货类型id
            isIncludeWarehouseManagement, //是否含仓储管理
            materialType, //1-运输 2-仓储
            keyWords, //关键字
            limit,
            offset} = this.state
        params = Object.assign({}, {clientId, heavyBubbleId, isIncludeWarehouseManagement, materialType, keyWords, limit, offset}, params)
        this.params = params
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

    getExcelData = (data) => { //导入
        Promise.all([this.getUnitData(), this.getClientData()]).then((cooperates) => {
            let dataSouce = this.groupData(data, cooperates)
        })
    }

    getUnitData = () => { //获取计量单位数据
        const { mobxDataBook } = this.props
        const promise = mobxDataBook.initData('计量单位')
        // this.setState({
        //     importLoading: true
        // })
        return new Promise((resolve, reject) => {
            promise.then(res => {
                if(res && res.length > 0) {
                    let data =  res.map(item => {
                        let obj = {unitId: item.id, unitName: item.title}
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

    getClientData = () => { //获取所属客户数据
        const { rApi } = this.props
        return new Promise((resolve, reject) => {
            rApi.getClients({
                limit: 999999,
                offset: 0,
                status: 56
            }).then(res => {
                let d = res.clients
                if(d && d.length > 0) {
                    let data =  d.map(item => {
                        let obj = {
                            clientId: item.id, 
                            clientName: item.shortname
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

    groupData = (data, cooperates) => {
        data = data.filter(item => item.length > 0)
        let header = data[0].map(item => {
            return null
        })
        if (data && data.length >0) {
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
            if(d && d.length === 0) {
                message.error('导入数据不能为空!')
                return false
            }
            let heavyBubbleData = [
                {
                    heavyBubbleId: 1,
                    heavyBubbleName: '无'
                },
                {
                    heavyBubbleId: 2,
                    heavyBubbleName: '重货'
                },
                {
                    heavyBubbleId: 3,
                    heavyBubbleName: '泡货'
                }
            ]
            let importData = d.map(item => { //序列化导入的数据
                //客户数据
                let clientData = item[3] ? cooperates[1].filter(d => d.clientName === trim(item[3])): [{
                    clientId: null,
                    clientName: null
                }]
                 //计量单位
                let unitData = item[10] ? cooperates[0].filter(d => d.unitName === trim(item[10])): [{
                    unitId: null,
                    unitName: null
                }]
                //重泡货
                let heavyBubble = item[17] ? heavyBubbleData.filter(d => d.heavyBubbleName === trim(item[17])) : [{
                    heavyBubbleId: null,
                    heavyBubbleName: null
                }]
                //其他
                let otherValue = [] 
                if(item[9] && item[8]) {
                    otherValue = [item[9], item[8]]
                } else if(item[9] && !item[8]) {
                    otherValue = [item[9]]
                } else if(!item[9] && item[8]) {
                    otherValue = [item[8]]
                }

                //单位重量单位
                let perUnitWeightValue = item[14] ? UnitWeigh.filter(d => d.title === trim(item[14])).map(item => {
                    return{
                        perUnitWeightId: item && item.id,
                        perUnitWeightName: item && item.title
                    }
                }) : [{
                    perUnitWeightId: null,
                    perUnitWeightName: null
                }]

                //单位体积单位
                let perUnitVolumeValue = item[16] ? UnitWeigh.filter(d => d.title === trim(item[16])).map(item => {
                    return{
                        perUnitVolumeId: item && item.id,
                        perUnitVolumeName: item && item.title
                    }
                }) : [{
                    perUnitVolumeId: null,
                    perUnitVolumeName: null
                }]

                let obj = {
                    materialItemNumber: item[0] ? trim(item[0]) : null, //料号
                    itemName: item[1] ? trim(item[1]) : null, //名称
                    itemSpecifications: item[2] ? trim(item[2]) : null, //规格
                    ...clientData[0], //客户
                    brands: item[4] ? trim(item[4]) : null, //品牌
                    manufacturer: item[5] ? trim(item[5]) : null, //制造商
                    productType: item[6] ? trim(item[6]) : null, //商品类型
                    packageType: item[7] ? trim(item[7]) : null, //包装类型
                    other: otherValue,
                    ...unitData[0], //计量单位
                    quantity: item[11] ? trim(item[11]) : 1, //数量/箱
                    boxCount: item[12] ? trim(item[12]) : 1,  //箱数/板
                    grossWeight: item[13] ? trim(item[13]) : null, //单位重量
                    ...perUnitWeightValue[0], //单位重量单位
                    singleVolume: item[15] ? trim(item[15]) : null, //单位体积
                    ...perUnitVolumeValue[0], //单位体积单位
                    ...heavyBubble[0], //重泡货
                    heavyBubbleRatio: item[18] ? trim(item[18]) : null,
                    maxStock: item[19] ? trim(item[19]) : null, //最大库存
                    minStock: item[20] ? trim(item[20]) : null, //最小库存
                    isScanningSerialNumber: item[21] ? trim(item[21]) : 2, //收货是否扫描
                    shipmentIsScanningSerialNumber: item[22] ? trim(item[22]) : 2, //出货是否扫描
                    isBatchNumber: item[23] ? trim(item[23]) : 2, //是否选择批次号
                    remark: item[24] ? trim(item[24]) : null,
                    materialType: 1
                }
                return obj
            })
            this.open = true
            try {
                importData.forEach((item, index) => {
                    if(!item.materialItemNumber) {
                        message.error(`第${index+1}行物料料号不能为空!`)
                        this.open = false
                        throw new Error('end')
                    } else if(!item.clientName || !item.clientId) {
                        message.error(`第${index+1}行所属客户不存在!`)
                        this.open = false
                        throw new Error('end')
                    } else if(!item.itemName) {
                        message.error(`第${index+1}行品名不能为空!`)
                        this.open = false
                        throw new Error('end')
                    } else if(!item.unitName || !item.unitId) {
                        message.error(`第${index+1}行计量单位不能为空!`)
                        this.open = false
                        throw new Error('end')
                    }
                })
            } catch(e) {
                if(e.message !== 'end') throw e
            }
            if(!this.open) {
                this.setState({
                    importLoading: false
                })
                return
            }
            this.importSave(importData)
        }
    }

    importSave = (value) => { // 导入请求
        const { rApi } = this.props
        rApi.batchSaveMaterials(value).then(res => {
            this.setState({
                importLoading: false
            })
            message.success('导入成功!')
            this.onChangeValue()
        }).catch(e => {
            message.error(e.msg || '操作失败!')
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
        rApi.materialsExport(this.params).then(res => {
            // console.log('ress', res)
            let fileName = `物料列表.xlsx`
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
        rApi.materialsExportTemplate().then(res => {
            let fileName = `物料模板.xlsx`
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
            importLoading,
            exportLoading
        } = this.state
        let { mobxBaseData } = this.props
        let tableHeight = mobxBaseData.tableHeight
        return (
            <div style={{ background: '#eee', minHeight: this.props.minHeight }}>
                <AddOrEdit 
                    parent={this}
                    getThis={(v) => this.addoredit = v}
                    materialType={1}
                />
                <HeaderView parent={this} title="料号/品名" onChangeSearchValue={
                    keyword => {
                        this.setState({keyWords: trim(keyword)}, this.onChangeValue({keyWords: trim(keyword)}))
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
                    {/* <RemoteSelect
                        placeholder={'是否含仓储管理'}
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({isIncludeWarehouseManagement: e ? e.id : null}, this.onChangeValue({isIncludeWarehouseManagement: e ? e.id : null}))
                            }
                        }
                        labelField='title'
                        list={onInClude}
                    /> */}
                    <RemoteSelect 
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({heavyBubbleId: e ? e.id : null}, this.onChangeValue({heavyBubbleId: e ? e.id : null}))
                            }
                        }
                        placeholder='重泡货'
                        labelField={'title'}
                        list={heavyBubbleTypeData}
                        >
                    </RemoteSelect>
                    <RemoteSelect 
                        defaultValue={{id: 1, title: '运输'}}
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({materialType: e ? e.id : null}, this.onChangeValue({materialType: e ? e.id : null}))
                            }
                        }
                        placeholder='物料类型'
                        labelField={'title'}
                        list={materialTypeData}
                        >
                    </RemoteSelect>
                </HeaderView>
                <div style={{overflow: 'hidden'}}>
                    <Table
                        className="index-list-table-style"
                        title="物料列表"
                        parent={this}
                        power={power}
                        params={this.state.params}
                        getData={this.getData}
                        columns={this.state.columns}
                        tableHeight={tableHeight}
                        TableHeaderChildren={
                            <Fragment>
                                <UploadExcel getExcelData={this.getExcelData} loading={importLoading} power={power.IMPORT_MANAGEMENT}/>
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
            </div>
        )
    }
}
 
export default MaterialRes;