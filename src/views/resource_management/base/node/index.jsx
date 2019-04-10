import React, { Component, Fragment } from 'react'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { message, Button } from 'antd'
import AddOrEdit from './addoredit'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import AddressCascader from '@src/components/select_address/cascader.jsx'
import { children, id } from './power'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { addressToString, trim, addressFormat } from '@src/utils'
import UploadExcel from '@src/components/upload_excel'
const power = Object.assign({}, children, id)

/**
 * 车辆资源
 * 
 * @class Node
 * @extends {Component}
 */
@inject('mobxTabsData', 'mobxBaseData')
@inject('rApi')
@observer
class Node extends Parent {

    state = {
        address: null, // 节点地址
        limit:10,
        name: null, // 节点名称
        nodeTypeId: null, // 节点类型
        offset:0,
        importLoading: false, 
        exportLoading: false
    }

    constructor(props) {
        super(props)
        this.state.columns = [
            {
                className: 'text-overflow-ellipsis',
                title: '中转地名称',
                dataIndex: 'name',
                key: 'name',
                width: 160,
                render: (text, r, index) => {
                    let name = r.name ? r.name : '-'
                    return(
                        <ColumnItemBox name={name} />
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
                title: '中转地地址',
                dataIndex: 'address',
                key: 'address',
                render: (text, r, index) => {
                    let name = addressFormat(r.address) ? addressFormat(r.address) : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '中转地类型',
                dataIndex: 'nodeTypeName',
                key: 'nodeTypeName',
                width: 100,
                render: (text, r, index) => {
                    let name = r.nodeTypeName ? r.nodeTypeName|| r.nodeTypeName : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '联系人',
                dataIndex: 'contact',
                key: 'contact',
                width: 120,
                render: (text, r, index) => {
                    let name = r.contact ? r.contact : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '联系方式',
                dataIndex: 'phone',
                key: 'phone',
                width: 160,
                render: (text, r, index) => {
                    let name = r.phone ? r.phone : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                width: 330,
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
        // console.log('onChangeValue')
        if (this.searchCriteria) {
            this.searchCriteria()
        }
    }

    getData = (params) => {
        const {
            address, // 节点地址
            limit,
            name, // 节点名称
            nodeTypeId, // 节点类型
            offset,
        } = this.state
        params = Object.assign({}, {address, limit, name, nodeTypeId, offset}, params)
        this.params = params
        const { rApi } = this.props
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

    // moveColumn = (dragIndex, hoverIndex) => {
	// 	//const { columns } = this.state
	// 	//const dragCard = columns[dragIndex]

	// 	// this.setState(
	// 	// 	update(this.state, {
	// 	// 		columns: {
	// 	// 			$splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
	// 	// 		},
	// 	// 	}),
	// 	// )
    // }

    showAdd = () => {
        this.addoredit.show({
            edit: false
        })
    }
    handleChangeAddress = (value,selectedOptions) => {
        this.setState({
            address: value && value.length > 0 ? value[value.length-1] : null
        }, this.onChangeValue({
            address: value && value.length > 0 ? value[value.length-1] : null
        }))
        // this.setState({
        //     address: selectedOptions && selectedOptions.length > 0 ? `"id":${selectedOptions[selectedOptions.length-1].id},` : null
        // }, this.onChangeValue({
        //     address: selectedOptions && selectedOptions.length > 0 ? `"id":${selectedOptions[selectedOptions.length-1].id},` : null
        // }))
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
                if(item && item[3]) {
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
                    s += '/'
                    s += item[6]
                }
                if(item && item[7]) {
                    s += ' '
                    s += item[7]
                }
                let obj = {
                    name: item[0] ? trim(item[0]) : null,
                    nodeTypeName: item[1] ? trim(item[1]) : null,
                    isSelfSupport: item[2] ? trim(item[2]) : null,
                    address: {
                        pro: item[3] ? trim(item[3]) : null,
                        city: item[4] ? trim(item[4]) : null,
                        dist: item[5] ? trim(item[5]) : null,
                        street: item[6] ? trim(item[6]) : null,
                        extra: item[7] ? trim(item[7]) : null,
                        formatAddress: s
                    },
                    areaName: item[8] ? trim(item[8]) : null,
                    contact: item[9] ? trim(item[9]) : null,
                    phone: item[10] ? trim(item[10]) : null,
                    remark: item[11] ? trim(item[11]) : null
                }
                return obj
            })
            this.open = true
            try {
                importData.forEach((item, index) => {
                    if(!item.name) {
                        message.error(`第${index+1}行中转地名称不能为空!`)
                        this.open = false
                        throw new Error('end')
                    } else if(!item.nodeTypeName) {
                        message.error(`第${index+1}行中转地类型不能为空!`)
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

    importSave = (value) => { //导入请求
        const { rApi } = this.props
        this.setState({
            importLoading: true
        })
        rApi.batchSaveNode(value).then(d => {
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
        rApi.nodeExport(this.params).then(res => {
            // console.log('ress', res)
            let fileName = `中转地列表.xlsx`
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
        rApi.nodeExportTemplate().then(res => {
            // console.log('ress', res)
            let fileName = `中转地模板.xlsx`
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
        let { importLoading, exportLoading, params } = this.state
        return (
            <div style={{ background: '#eee', minHeight: this.props.minHeight }}>
                <AddOrEdit 
                    parent={this}
                    getThis={(v) => this.addoredit = v}
                />
                <HeaderView 
                    parent={this} 
                    title="中转地名称" 
                    onChangeSearchValue={
                        keyword => {
                            this.setState({name: trim(keyword)}, this.onChangeValue({name: trim(keyword)}))
                        }
                    }
                >
                    <RemoteSelect 
                        onChangeValue={
                            e => {
                                //let id = e ? e.id : 0
                                this.setState({nodeTypeId: e ? e.id : ''}, this.onChangeValue({nodeTypeId: e ? e.id : ''}))
                            }
                        }
                        placeholder='中转地类型'
                        text="中转地类型">
                    </RemoteSelect>
                    <AddressCascader
                        defaultValue={[]}
                        placeholder='中转地地址' 
                        handleChangeAddress={this.handleChangeAddress}
                    />
                </HeaderView>
                <Table
                    className="index-list-table-style"
                    title="中转地列表"
                    //scroll={{x: 1750, y: tableHeight}}
                    parent={this}
                    power={power}
                    params={params}
                    getData={this.getData}
                    columns={this.state.columns}
                    tableHeight={tableHeight}
                    TableHeaderChildren={
                        <Fragment>
                            <UploadExcel getExcelData={this.getExcelData} loading={importLoading} power={power.IMPORT_NODE}/>
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
 
export default Node;