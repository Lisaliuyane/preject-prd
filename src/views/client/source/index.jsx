import React from 'react'
import { HeaderView, Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { message, Button} from 'antd'
import AddOrEdit from './addoredit'
import { inject, observer } from "mobx-react"
import RemoteSelect from '@src/components/select_databook'
import { children, id } from './power'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { deleteNull, trim, isArray } from '@src/utils'
// import XLSX from 'xlsx'
import UploadExcel from '@src/components/upload_excel'

const power = Object.assign({}, children, id)

const defaultCheckedList = [
    {
        id: 1, 
        title: '汽运'
    },
    {   id: 2, 
        title: '空运'
    },
    {   id: 3, 
        title: '铁运'
    },
    {   id: 4, 
        title: '海运'
    },
    {   id: 5, 
        title: '仓储'
    }
]
// const TableHeaderChildren = (props) => {
//     return(
//         // <Button key='import' onClick={props.importRequest} style={{marginRight: 10, verticalAlign: 'middle'}} icon="download">
//         //     导入
//         // </Button>
//         <Upload showUploadList={false} beforeUpload={props.beforeUpload}>
//             <Button style={{marginRight: 10, verticalAlign: 'middle'}}>
//                 <Icon type="download" />
//                 导入
//             </Button>
//         </Upload>
//         <UploadExcel>
//     )
// }
/**
 * 客户资料
 * 
 * @class Client
 * @extends {Component}
 */
@inject('mobxTabsData', 'mobxBaseData', 'rApi')
@observer
class Client extends Parent {

    state = {
        loading: false,
        data: [],
        status: 0,
        area: 0,
        keyword: '',
        title: {},
        limit: 10,
        offset: 0,
        buttonLoading: false
    }

    constructor(props) {
        super(props)
        // const { mobxTabsData } = props
        // mobxTabsData.setTitle(power.id, 'xxxxx')
        this.state.columns = [
            {
                title: '客户代码',
                className: 'text-overflow-ellipsis',
                dataIndex: 'code',
                key: 'code',
                width: 100,
                render: (text, r, index) => {
                    let name = r.code ? r.code : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '客户简称',
                dataIndex: 'shortname',
                key: 'shortname',
                width: 160,
                render: (text, r, index) => {
                    let name = r.shortname ? r.shortname : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '客户全称',
                dataIndex: 'username',
                key: 'username',
                width: 180,
                render: (text, r, index) => {
                    let name = r.username ? r.username : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '接单法人',
                dataIndex: 'legal',
                key: 'legal',
                width: 180,
                render: (text, r, index) => {
                    let name = r.legal ? r.legal.fullName || r.legal.name : '-'
                    return(
                        <ColumnItemBox name={name} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '所属片区',
                dataIndex: 'area',
                key: 'area',
                width: 200,
                render: (text, r, index) => {
                    let areaVul =  r.area && r.area.length > 0 ? r.area.map(item => {
                        return item.title
                    }).join(',') : '-'
                    return(
                        <ColumnItemBox name={areaVul} />
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 330,
                render: (text, r, index) => {
                    let statusVul = r.status ? r.status.title || r.status.name : '-'
                    return(
                        <ColumnItemBox name={statusVul} />
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
        const {status, area, keyword, limit, offset} = this.state
        params = Object.assign({}, {status, area, keyword, limit, offset}, params)
        const { rApi } = this.props
        return new Promise((resolve, reject) => {
            params = deleteNull(params)
            rApi[power.apiName](params).then(d => {
                resolve({
                    dataSource: d.clients || [], 
                    total: d.total
                })
            }).catch(err => {
                reject(err)
            })
        })
    }

    fieldStatusData(d) { //过滤合作状态数据
        let obj = d && d.length > 0 ? d.filter(d => d.id !== 153) : []
        return obj
    }

    getExcelData = (data) => {
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

            let importData = d.map(item => { //序列化导入的数据
                if(item && item.length > 0) {
                    let obj = {
                        username: item[0],
                        shortname: item[1],
                        userclass: {title: item[2], name: item[2], label: item[2]},
                        scopes: item[3] && item[3].split('，').length > 0 ? item[3].split('，').map(d => {
                            let filter = defaultCheckedList.filter(item => item.title === d)
                            return {
                                title: d,
                                id: d && filter && filter[0] ?  filter[0].id : null
                            }
                        }) : [],
                        address: {
                            pro: item[4] ? {name: item[4]} : null,
                            city: item[5] ? {name: item[5]} : null,
                            dist: item[6] ? {name: item[6]} : null,
                            street: item[7] ? {name: item[7]} : null,
                            extra: item[8] ? item[8] : null
                        },
                        salesman: {title: item[9], name: item[9], label: item[9]},
                        parent: {title: item[10], name: item[10], label: item[10]},
                        status: {title: item[11], name: item[11], label: item[11]},
                        legal: {title: item[12], name: item[12], label: item[12]},
                        period: item[13],
                        labels: item[14] && item[14].split('，').length > 0 ? item[14].split('，').map(d => {
                            return {
                                title: d
                            }
                        }) : [],
                        contacts: this.isALLNull(this.arrayToString(item[15])) ? [{
                            name: this.arrayToString(item[15])[0],
                            position: this.arrayToString(item[15])[1],
                            phone: this.arrayToString(item[15])[2],
                            email: this.arrayToString(item[15])[3],
                            qq: this.arrayToString(item[15])[4],
                            remark: this.arrayToString(item[15])[5],
                            isEdit: true
                        }] : [],
                        legals: this.isALLNull(this.arrayToString(item[16])) ? [{
                            name:  this.arrayToString(item[16])[0],
                            addr: this.arrayToString(item[16])[1],
                            remark: this.arrayToString(item[16])[2],
                            isEdit: true
                        }] : []
                    }
                    return obj
                }
            })
           // console.log('importData:', importData) //将该值传给请求导入接口
            if(importData && importData.length > 0) {
                this.importSave(importData)
            }
            message.error('操作失败!')
        }
    }

    arrayToString = (d) => {  //将''转为array数组
        if (isArray(d)) {
            return d
        }
        if (d && typeof d === 'string') {
            try {
                let array = d.split('&')
                return array
            } catch (e) {
            }
        }
        return []
    }

    isALLNull = (d) => { //判断数组是否存在非空有则返回true
        let a = false
        for(let value of d) {
            if(value !== '') {
                a = true
                break
            }
        }
        return a
    }

    importSave = (value) => { //导入请求
        const { rApi } = this.props
        this.setState({
            buttonLoading: true
        })
        rApi.blukCreate(value).then(d => {
            if(d) {
                this.setState({
                    buttonLoading: false
                })
                message.success('操作成功！')
                this.onChangeValue()
            }
        }).catch(e => {
            message.error(e.errorMessage || '操作失败')
            this.setState({
                buttonLoading: false
            })
        })
    }

    exportTemplate = () => {  //导出
        let { rApi } = this.props
        rApi.clientExportTemplate().then(res => {
            let fileName = `客户模板.xlsx`
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
        }).catch()
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
        let { buttonLoading, params, columns } = this.state
        let { mobxBaseData, minHeight } = this.props
        let tableHeight = mobxBaseData.tableHeight
        return (
            <div style={{ background: '#eee', minHeight: minHeight }}>
                <AddOrEdit 
                    parent={this}
                    getThis={(v) => this.addoredit = v}
                />
                <HeaderView parent={this} title="客户代码/名称" onChangeSearchValue={
                    keyword => {
                        this.setState({keyword: trim(keyword)}, this.onChangeValue({keyword: trim(keyword)}))
                    }
                }>
                    <RemoteSelect 
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({area: e ? e.id : null}, this.onChangeValue({area: e ? e.id : null}))
                            }
                        }
                        placeholder='所属片区'
                        text='片区'
                        >
                    </RemoteSelect>
                    <RemoteSelect
                        onChangeValue={
                            e => {
                                let id = e ? e.id : 0
                                this.setState({status: e ? e.id : null}, this.onChangeValue({status: e ? e.id : null}))
                            }
                        }
                        placeholder='合作状态'
                        text='合作状态'
                        dealData={this.fieldStatusData}
                        >
                    </RemoteSelect>
                </HeaderView>
                <Table
                    // className="index-list-table-style"
                    className="index-list-table-style"
                    title="客户资料"
                    tableHeight={tableHeight}
                    parent={this}
                    power={power}
                    params={params}
                    getData={this.getData}
                    columns={columns}
                    TableHeaderChildren={
                        <React.Fragment>
                            <UploadExcel key='import' getExcelData={this.getExcelData} loading={buttonLoading} power={power.BLUK_CREATE}/>
                            <FunctionPower key='export'  power={power.EXPORT_TEMPLATE}>
                                <Button icon="export" onClick={this.exportTemplate} style={{marginRight: 10, verticalAlign: 'middle'}}>导出模板</Button>
                            </FunctionPower>
                        </React.Fragment>
                    }
                >
                </Table>
            </div>
        )
    }
}
 
export default Client;