import React from 'react'
import { Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { Select, Input, InputNumber, message, Icon } from 'antd'
import { CascaderAddress } from '@src/components/select_address'
import { costItemObjectToString } from './utils'
import update from 'immutability-helper'
import XLSX from 'xlsx'
import './dynamic_table.less'
import TableHeader from './header'
import PropTypes from 'prop-types'
import RemoteSelect from '@src/components/select_databook'

import { inject } from "mobx-react"
import { cloneObject } from '@src/utils'
import { getHeaderData, getListData } from './utils'

const Option = Select.Option

let globelCols = []

const trim = (value, head) => {
    // console.log('head', head)
    if (typeof value === 'object') {
        return value
    }
    if (value) {
        value = value.toString().trim()
    }
    if (head && head.itemHeader && head.itemHeader.type === 'cost' && value && value.length > 0) {
        try {
            value = Number(value).toFixed(3) // 保证报价为两位小数
        } catch (e) {
            value = 0
        }
        if (isNaN(value)) {
            value = 0
        }
    } else if (head && head.itemHeader && head.itemHeader.title === '中转地' && head.itemHeader.type === 'base') {
        value = {
            transitPlaceOneName: value
        }
    } else if (head && head.itemHeader && head.itemHeader.title === '时效(h)' && head.itemHeader.type === 'base') {
        value = value !== undefined && isNaN(value) ? '0' : value
    } else {
        value = value
    }
    // console.log('trim', value, head)
    return value
}

const textToBoolInt = (text) => {
    if (text === '是' || text === true) {
        return 1
    } else {
        return 0
    }
}

const headIsBoolParseValue = (header, value) => {
    if (header && header.itemHeader && header.itemHeader.name) {
        if (header.itemHeader.name === 'isHighway' || header.itemHeader.name === 'isPick') {
            return textToBoolInt(value)
        }
        if (header.itemHeader.name === 'lowestFee' || header.itemHeader.name === 'aging') {
            return Number(value) !== NaN ? Number(value) : 0
        }
    }
    return value
} 

/** 
 * 表格每一项
*/
const EditableCell = ({ editable, value, onChange, record, col, itemHeader, width, popupContainer }) => {
    if (editable) {
        // const { itemHeader } = record.data[col]
        if ((itemHeader.title === '起运地' && itemHeader.type === 'base') || (itemHeader.title === '目的地' && itemHeader.type === 'base')) {
            return (
                <ColumnItemBox isFormChild>
                    <CascaderAddress
                        getPopupContainer={() => {
                            return popupContainer ? popupContainer() : document.body 
                        }}
                        // getPopupContainer={popupContainer}
                        selectGrade={3}
                        placeholder={value}
                        handleChangeAddress={value => onChange(value.join('/'))}
                    />
                </ColumnItemBox>
            )
        } else if (itemHeader.title === '是否高速' || itemHeader.title === '是否分拣') {
            // console.log('是否高速', value, itemHeader)
            return (
                <ColumnItemBox isFormChild>
                    <div style={{maxWidth: 100}}>
                        <Select
                            getPopupContainer={() => {
                                return popupContainer ? popupContainer() : document.body 
                            }} 
                            style={{width: '100%'}} 
                            onChange={value => {
                                // console.log('是否高速', value)
                                onChange(value)
                            }} 
                            value={value}
                        >
                            <Option value={0}>否</Option>
                            <Option value={1}>是</Option>
                        </Select>
                   </div>
                </ColumnItemBox>
            )
        } else if (itemHeader.title === '中转地') {
            // console.log('中转地', value)
            return (
                <ColumnItemBox isFormChild>
                    <RemoteSelect 
                        // defaultValue={parent}
                        style={{width: '100%'}}
                        defaultValue={{id: value.transitPlaceOneId, name: value.transitPlaceOneName}}
                        getPopupContainer={() => {
                            return popupContainer ? popupContainer() : document.body 
                        }}
                        onChangeValue={value => {
                            onChange({
                                transitPlaceOneId: value ? value.id : null, 
                                transitPlaceOneName: value ? value.title || value.name : null
                            })
                        }}
                        dataKey={'records'}
                        labelField='name'
                        getDataMethod={'getNodeList'}
                        params={{offset: 0, limit: 99999}}
                    />
                </ColumnItemBox>
            )
        } else if (itemHeader.title === '时效(h)' || itemHeader.title === '最低收费' || itemHeader.type === 'cost') {
            return (
                <ColumnItemBox isFormChild>
                    <InputNumber style={{width: '100%', maxWidth: 120}} value={value} onChange={value => onChange(value)} min={0} />
                </ColumnItemBox>
            )
        } else {
            return (
                <ColumnItemBox isFormChild>
                    <Input value={value} onChange={e => onChange(e.target.value)} />
                </ColumnItemBox>
            )
        }
    }
    if ((itemHeader.type === 'base' && (itemHeader.title === '是否高速' || itemHeader.title === '是否分拣'))) {
        // console.log('是否高速', value)
        let name = 
        value === 1 || value === '1' || value === '是' ? 
        '是' 
        : 
        value === 0 || value === '0' || value === '否' ? 
        '否'
        : 
        '-'
        return (
            <ColumnItemBox name={name} />
        )
    }
    if (itemHeader.type === 'base' && itemHeader.title === '中转地' || (value && value.transitPlaceOneName)) {
        let name = value.transitPlaceOneName ? value.transitPlaceOneName : '-'
        return (
            <ColumnItemBox name={name} />
        )
    }
    // console.log('filed value', value, itemHeader.type, itemHeader, col)
    return (
        <ColumnItemBox name={value} />
    )
}

const ComparisonBaseCell = ({ value, record, col, itemHeader}) => {
    if (itemHeader.type === 'base') {
        let filter = record.data.filter(item => item && item.itemHeader && item.itemHeader.type === 'base')
        if (col === 0) {
            return {
                children: (
                    <div style={{color: 'green', textAlign: 'center'}}>
                        {value}
                    </div>
                ),
                props: {
                    colSpan: filter ? filter.length : 0
                }
            }
        }
        return{
            children: null,
            props: {
                colSpan: 0
            }
        }
    }
    return null
}

const ComparisonCell = ({ editable, value, onChange, record, col, itemHeader, width, popupContainer, newValue, getListData, index, getOffset }) => {
    let list = getListData()
    let offset = getOffset()
    if (list.some(item => item.isQuotationChildren)) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].num === offset + 1) {
                offset = i
                break
            }
        }
    }
    index += offset
    newValue = list && list[index-1] && list[index-1].data && list[index-1].data[col] ? 
                            list[index-1].data[col].value
                            :  
                            newValue
    // console.log('newValue', newValue, value, index, list)
    if (itemHeader.type === 'base') {
        let filter = record.data.filter(item => item && item.itemHeader && item.itemHeader.type === 'base')
        if (col === 0) {
            return {
                children: (
                    <div style={{color: 'green'}}>
                        {value}
                    </div>
                ),
                props: {
                    colSpan: filter ? filter.length : 0
                }
            }
        }
        return{
            children: null,
            props: {
                colSpan: 0
            }
        }
    } else {
        let v = 0
        if(newValue === 0 && value === 0) {
            v = 0
        } else if(newValue === 0 && value !== 0) {
            v = -1
        } else {
            v = (newValue - value) / newValue
        }
        
        return (
            <div>
                {
                    value
                }
                <span style={{color: v < 0 ? 'green' : 'red', marginLeft: 5}}>
                    <Icon type={v < 0 ? 'arrow-down' : 'arrow-up'} style={{color: v < 0 ? 'green' : 'red', marginLeft: 5}} theme="outlined" />
                    {(Math.abs(v * 100)).toFixed(2)}%
                </span>
            </div>
        )
    }
}

// const array = ['起运地', '目的地', '时效', '是否高速']

const arrayToColumns = (item, text, col, handleChangeOnSaveData, type, isLast, length, popupContainer, getListData, getOffset) => {
    // 表格基础cell宽度为 80
    if (item.type === 'cost') {
        text = costItemObjectToString({...item, text: item.expenseItemName})
    }
    let width = {
        width: 80
    }
    if ((item.title === '起运地' || item.title === '目的地' || item.title === '中转地' ||  item.title === '备注') && item.type === 'base') {
        width = {
            width: 200
        }
    } else if (text && text.length > 3) {
        width = {
            width: 90 + ((text.length - 3) * 8)
        }
    }
    return {
        ...width,
        className: 'text-overflow-ellipsis',
        title: <span title={text}>{text}</span>,
        titleString: text, 
        itemHeader: item,
        render: (text, record, index) => {
            let value = (record && record.data && record.data.length > 0 && record.data[col] && (record.data[col].value || record.data[col].value === 0)) ? record.data[col].value : ''
            if (record.isQuotationChildren) {
                if (record.data[col] && record.data[col].itemHeader && record.data[col].itemHeader.type === 'base') {
                    return ComparisonBaseCell({
                        itemHeader: item,
                        value: value,
                        col: col,
                        record: record
                    })
                }
                return (
                    <ComparisonCell
                        newValue={
                            // this.state.list[index].data[col].value
                            record.data[col] && record.data[col].newValue || 0
                        }
                        getListData={getListData}
                        getOffset={getOffset}
                        width={width}
                        editable={record.isEdit}
                        record={record}
                        popupContainer={popupContainer}
                        value={value}
                        index={index}
                        col={col}
                        itemHeader={item}
                        onChange={value => handleChangeOnSaveData(value, record, index, col)}
                    />
                )
            }
            return (
                <EditableCell 
                    width={width}
                    editable={record.isEdit}
                    record={record}
                    popupContainer={popupContainer}
                    value={value}
                    col={col}
                    itemHeader={item}
                    onChange={value => handleChangeOnSaveData(value, record, index, col)}
                />
            )
        }
    }
}

/**
 * 表格主体
 * 
 * @class DynamicTable
 * @extends {Parent}
 */
@inject('rApi')
class DynamicTable extends Parent {

    static propTypes = {
        fixedsHeader: PropTypes.array
    }

    constructor(props) {
        super(props);
        if (props.getThis) {
            props.getThis(this)
        }
        const { defaultValue, fixedsHeader } = props
        let fixeds = [
            {
                width: 200,
                title: '起运地',
                isHaveMove: false,
                isShow: true,
                type: 'base',
                name: "departure",
                id: 1
            },
            {
                title: '中转地',
                isHaveMove: true,
                isShow: false,
                type: 'base',
                name: "transitPlaceOneName",
                id: 2
            },
            {
                width: 200,
                title: '目的地',
                name: "destination",
                type: 'base',
                isHaveMove: false,
                isShow: true,
                id: 3
            },
            {
                title: '时效(h)',
                name: "aging",
                type: 'base',
                isHaveMove: true,
                isShow: true,
                id: 4
            },
            {
                title: '是否高速',
                name: "isHighway",
                type: 'base',
                isHaveMove: true,
                isShow: false,
                id: 5
            },
            {
                title: '是否分拣',
                name: "isPick",
                type: 'base',
                isHaveMove: true,
                isShow: false,
                id: 6
            },
            {
                title: '最低收费',
                name: "lowestFee",
                type: 'base',
                isHaveMove: true,
                isShow: false,
                id: 7
            },
        ]

        this.state = {
            open: true,
            offset: 0,
            list: [],
            isEdit: false,
            removeQuotationLineId: [], // 行id
            removeQuotationLineItemIds: [], // 费用项
            fixeds,
            deploys: [],
            // 表格头部其他项
            others: [],
            reflash: true
        }

        
        if (fixedsHeader && fixedsHeader.length > 0) {
            this.state.fixeds = fixedsHeader
            fixeds = fixedsHeader
        }

        if (defaultValue && defaultValue.header) {
            fixeds.forEach(ele => {
                ele.isShow = false
            })
            for (let header of defaultValue.header) {
                fixeds = fixeds.map(ele => {
                    if (ele.name === header.name && header.isShow) {
                        ele.isShow = true
                    }
                    return ele
                })
            }
            // fixeds = defaultValue.header.filter(item => item.type === 'base')
            let base = defaultValue.header.filter(item => item.type === 'base')
            fixeds.forEach(ele => {
                base.forEach(item => {
                    if (item.id === ele.id) {
                        ele = item
                    }
                })
            })
            // 表格头部固定项
            this.state.fixeds = fixeds

            // 表格头部费用项
            this.state.deploys = defaultValue.header.filter(item => item.type === 'cost')
            // console.log('this.state.deploys',  this.state.deploys)
            
            // 表格数据
            this.state.list = defaultValue.data.map(item => item)
            this.state.isEdit = true
        }
        // if (fixedsHeader && fixedsHeader.length > 0) {
        //     this.state.fixeds = fixedsHeader
        // }
        // console.log('constructor fixeds', fixeds, type, this.state.fixeds)
        this.rABS = typeof FileReader !== "undefined" && (FileReader.prototype || {}).readAsBinaryString
    }

    componentWillReceiveProps(nextProps) {
        //console.log('nextProps.active && !this.props.active && (!this.state.list || this.state.list.length < 1)', nextProps.active && !this.props.active && (!this.state.list || this.state.list.length < 1))
        if (nextProps.active && !this.props.active && (!this.state.list || this.state.list.length < 1)) {
            this.refresh()
        }
    }
    
    componentWillUnmount() {
        this.state.list = []
    }
    
    getValue = () => {
        return {
            header: this.groupColumns().map(item => item.itemHeader),
            data: this.state.list.filter(item => !item.isQuotationChildren).map(item => {
                // let it = item.map(ele => {
                //     if (ele.id) {
                //         return ele.id
                //     } else {
                //         return ele
                //     }
                // })
                return item
            }),
            removeQuotationLineItemIds: this.state.removeQuotationLineItemIds,
            removeQuotationLineId: this.state.removeQuotationLineId
        }
    }

    getHeader = () => {
        //const { type } = this.props
        return this.groupColumns().map(item => {
            return item.titleString
        })
    }
    
    changeOpen = (state) => {
        this.setState({
            open: state
        })
        if (!state) {
            this.clearValue()
        }
    }

    beforeUpload = (file) => {
        let f = file
        let reader = new FileReader()
		reader.onload = (e) => {
            let data = e.target.result
            if(!this.rABS) data = new Uint8Array(data)
            try {
                this.processWb(XLSX.read(data, { type: this.rABS ? 'binary' : 'array' }))
            } catch (e) {
                console.error('e', e)
                message.error('文件解析错误, 请确保传入文件为excel表格！')
            }
            // this.clearAllData(() => {
            //     try {
            //         this.processWb(XLSX.read(data, {type: this.rABS ? 'binary' : 'array'}))
            //     } catch (e) {
            //         console.error('e', e)
            //         message.error('文件解析错误, 请确保传入文件为excel表格！')
            //     }
            // })
		}
		if(this.rABS) reader.readAsBinaryString(f)
		else reader.readAsArrayBuffer(f)
        return false
    }

    /**
     * excel file to json data
     * 
     * 
     * @memberOf DynamicTable
     */
    processWb = (wb) => {
		/* get data */
        let ws = wb.Sheets[wb.SheetNames[0]]
        let data = XLSX.utils.sheet_to_json(ws, { header: 1 })
        let { removeQuotationLineId, list } = this.state
        const columns = this.groupColumns()
        let isTrue = true
        // console.log('processWb list', list)
        if (data && Object.prototype.toString.call(data) === '[object Array]') {
            let headerText = data[0]
            data = data.slice(1, data.length)
            if (columns.length > headerText.length) {
                message.error('传入表头与定义表头不符合！')
                return
            }
            columns.forEach((ele, index) => {
                if (headerText[index] !== 'id' && headerText[index] !== 'ID' && headerText[index] !== ele.itemHeader.title && headerText[index] !== costItemObjectToString(ele.itemHeader)) {
                    //console.log('表头不符合', headerText[index], costItemObjectToString(ele.itemHeader))
                    isTrue = false
                    // console.log('headerText[index]', headerText[index], costItemObjectToString(ele.itemHeader), ele)
                }
                if (headerText[index] === 'id' || headerText[index] === 'ID') {
                    // console.log('导入---------------', data, columns, headerText[index])
                    data.forEach(item => {
                        let id = {id: item[index]}
                        if (index < (item.length - 1)) {
                            // 移动id项到数据数组末尾
                            item.splice(index, 1)
                            item.push(id)
                        } else {
                            item[item.length - 1] = {id: item[index]}
                        }
                    })
                } 
                // 去掉序号项
                if (headerText[index] === '序号') {
                    headerText.splice(index, 1)
                    data.forEach(item => {
                        if (index < item.length - 1) {
                            // 移动id项到数据数组末尾
                            item.splice(index, 1)
                        }
                        // console.log('item[index]', item)
                    })
                }
                if (headerText[index] === '中转地') {
                    data.forEach(item => {
                        if (index < item.length - 1) {
                            // 移动id项到数据数组末尾
                            item[index] = {
                                transitPlaceOneName: item[index],
                                transitPlaceOneId: ''
                            }
                        }
                    })
                }
            })
            if (headerText[columns.length] === 'id' || headerText[columns.length] === 'ID') {
                data.forEach(item => {
                    item[columns.length] = {id: item[columns.length]}
                })
            }
            isTrue = true
            if (isTrue) {
                data = data.map(ele => {
                    let array = []
                    array = Array.from(array)
                    if (ele.length < columns.length) {
                        columns.forEach((item, i) => {
                            array[i] = ele[i]
                        })
                    } else {
                        array = Array.from(ele)
                    }
                    return array
                })
                data = data.map(item => {
                    if (item[item.length - 1] && item[item.length - 1].id) {
                        let id = item[item.length - 1].id
                        try {
                            id = parseInt(id, 10)
                        } catch (e) {
                            console.error('导入数据id不符合规范！')
                        }
                        removeQuotationLineId = removeQuotationLineId.filter(rid => ((rid !== id) || (rid && id && rid.toString() !== id.toString())))
                        item.splice(item.length - 1, 1)
                        return {
                            historyData: {id: id},
                            id: id,
                            data: item.filter(element => !element || !element.id).map((ele, index) => {
                                return {
                                    value: headIsBoolParseValue(columns[index], trim(ele, columns[index]))
                                }
                            })
                        }
                    } else {
                        return {
                            data: item.filter(element => (!element || (element && !element.id))).map((ele, index) => {
                                return {
                                    value: headIsBoolParseValue(columns[index], trim(ele, columns[index]))
                                }
                            })
                        }
                    }
                })
                // console.log('导入---------------', data, columns)
                data = data.map(item => {
                    let filter = list.filter(ele => ele.id === item.id || (ele.id && item.id && ele.id.toString() === item.id.toString()))
                    if (filter && filter.length > 0) {
                        filter = filter[0]
                        return {
                            ...filter,
                            data: filter.data.map((ele, index) => {
                                return {
                                    ...ele,
                                    value: item.data[index].value
                                }
                            })
                        }
                    }
                    return item
                })
                // console.log('processWb list', list, data)
                this.setState({list: data, removeQuotationLineId: removeQuotationLineId}, () => {
                    this.searchCriteria()
                })
            } else {
                message.error('传入表头与定义表头不符合！')
            }
        } else {
            message.error('传入文件错误！')
        }
    }

    getData = (params) => {
        const { getData, getDataMethod, mode, rApi, active, defaultValue } = this.props
        let { list, reflash } = this.state
        let dheader = defaultValue && defaultValue.header ? defaultValue.header : []
        if (getData) {
            const pr = getData(params)
            return pr
        }
        if (getDataMethod && mode && active && mode.quotationId && list.length < 1 && reflash) {
            // console.log('xxxxxxx---')
            return new Promise((resolve, reject) => {
                const { limit, offset } = params
                rApi[getDataMethod]({
                    businessModeId: mode.businessModeId,
                    // quotationId: mode.quotationId,
                    id: mode.quotationId,
                    transportModeId: mode.transportModeId,
                    limit: 99999,
                    offset: 0,
                    pageNo: 1,
                }).then(res => {
                    if (!res.records || res.records.length < 1) {
                        resolve({
                            dataSource: [],
                            total: res.total
                        })
                    }
                    let fixeds = [
                        {
                            width: 200,
                            title: '起运地',
                            isHaveMove: false,
                            isShow: true,
                            type: 'base',
                            name: "departure",
                            id: 1
                        },
                        {
                            title: '中转地',
                            isHaveMove: true,
                            isShow: false,
                            type: 'base',
                            name: "transitPlaceOneName",
                            id: 2
                        },
                        {
                            width: 200,
                            title: '目的地',
                            name: "destination",
                            type: 'base',
                            isHaveMove: false,
                            isShow: true,
                            id: 3
                        },
                        {
                            title: '时效(h)',
                            name: "aging",
                            type: 'base',
                            isHaveMove: true,
                            isShow: true,
                            id: 4
                        },
                        {
                            title: '是否高速',
                            name: "isHighway",
                            type: 'base',
                            isHaveMove: true,
                            isShow: false,
                            id: 5
                        },
                        {
                            title: '是否分拣',
                            name: "isPick",
                            type: 'base',
                            isHaveMove: true,
                            isShow: false,
                            id: 6
                        },
                        {
                            title: '最低收费',
                            name: "lowestFee",
                            type: 'base',
                            isHaveMove: true,
                            isShow: false,
                            id: 7
                        }
                    ]
                    let dValue = {
                        header: cloneObject(getHeaderData(res.records[0])),
                    }
                    if (dValue && dValue.header) {
                        fixeds.forEach(ele => {
                            ele.isShow = (ele.id === 1 || ele.id === 3 || ele.id === 4)
                        })
                        fixeds = fixeds.map(ele => {
                            dValue.header.forEach(header => {
                                if (ele.name === header.name && header.isShow) {
                                    ele.isShow = true
                                }
                            })
                            dheader.forEach(header => {
                                if (ele.name === header.name && header.isShow) {
                                    ele.isShow = true
                                }
                            })
                            return ele
                        })
                        // fixeds = defaultValue.header.filter(item => item.type === 'base')
                        let base = dValue.header.filter(item => item.type === 'base')
                        let deploys = dValue.header.filter(item => item.type !== 'base')
                        fixeds.forEach(ele => {
                            base.forEach(item => {
                                if (item.id === ele.id) {
                                    ele = item
                                }
                            })
                            dheader.forEach(item => {
                                if (item.id === ele.id) {
                                    ele = item
                                }
                            })
                        })
                        // 表格数据
                        dValue.data = cloneObject(getListData(res.records, [...fixeds, ...deploys]))
                        let tablelist = dValue.data.map(item => item)
                        this.setState({
                            list: tablelist,
                            isEdit: true,
                            offset: params.offset,
                            fixeds,
                            deploys: dValue.header.filter(item => item.type === 'cost'),
                            reflash: false
                        }, () => {
                            let pager = {
                                total: res.total
                            }
                            if (tablelist.some(item => item.isQuotationChildren)) {
                                let dataSource = []
                                let isAdd = false
                                tablelist.forEach((ele, i) => {
                                    if (ele && ele.num === offset + 1) {
                                        isAdd = true
                                        dataSource.push(ele)
                                    } else if (ele && ele.num === offset + limit) {
                                        isAdd = false
                                        dataSource.push(ele)
                                        if (tablelist[i + 1] && typeof tablelist[i + 1].num !== 'number') {
                                            dataSource.push(tablelist[i + 1])
                                        }
                                    } else if (isAdd) {
                                        dataSource.push(ele)
                                    }
                                })
                                resolve({
                                    dataSource: dataSource, 
                                    total: pager.total
                                })
                                return
                            }
                            resolve({
                                dataSource: tablelist.slice(offset, offset + limit),
                                total: pager.total
                            })
                        })
                    }
                })
            })
        }
        return new Promise((resolve, reject) => {
            const { limit, offset } = params
            let { list } = this.state
            list = list.slice()
            list = [...list]
            let pager = {
                total: list.filter(item => !item.isQuotationChildren).length
            }
            this.setState({offset: offset})
            if (list.length < offset) {
                resolve({
                    dataSource: [],
                    total: pager.total
                })
                return
            }
            if (list.some(item => item.isQuotationChildren)) {
                let dataSource = []
                let isAdd = false
                list.forEach((ele, i) => {
                    if (ele && ele.num === offset + 1) {
                        isAdd = true
                        dataSource.push(ele)
                    } else if (ele && ele.num === offset + limit) {
                        isAdd = false
                        dataSource.push(ele)
                        if (list[i + 1] && typeof list[i + 1].num !== 'number') {
                            dataSource.push(list[i + 1])
                        }
                    } else if (isAdd) {
                        dataSource.push(ele)
                    }
                })
                // console.log('dataSource', dataSource)
                resolve({
                    dataSource: dataSource, 
                    total: pager.total
                })
                return
            }
            resolve({
                dataSource: list.slice(offset, offset + limit), 
                total: pager.total
            })
        })
    }

    clearAllData = (callback) => {
        let { list } = this.state
        let removeQuotationLineId = []
        list.forEach(record => {
            if (record.id && !record.isQuotationChildren) {
                removeQuotationLineId.push(record.id)
            }
        })
        this.setState({list: [], removeQuotationLineId: removeQuotationLineId}, () => {
            if (callback && typeof callback === 'function') {
                callback()
            }
            this.searchCriteria()
        })
    }

    popupContainer = () => {
        const { getPopupContainer } = this.props
        //console.log('getPopupContainer', getPopupContainer)
        if (getPopupContainer) {
            return getPopupContainer()
        }
        if (this.popupDom) {
            return this.popupDom.querySelector('.ant-table-fixed-header > .ant-table-content > .ant-table-scroll > .ant-table-body table') || document.body
        }
        return document.body
    }

    getListData = () => {
        return this.state.list
    }

    groupColumns = () => {
        const { fixeds, deploys, others } = this.state
        const { type, customColumns } = this.props
        let columns1 = fixeds.filter((item, index) => {
            return item.isShow
        })
        let length = columns1.length + deploys.length - 1
        let i = 0
        columns1 = columns1.map((item, index) => {
            i = index
            return arrayToColumns(item, item.title, index, this.handleChangeOnSaveData, type, length === index, length, this.popupContainer, this.getListData, () => this.state.offset)
        })
        let columns2 = deploys.map((item, index) => {
            let text = typeof item === 'object' ? item.title : item
            i++
            return arrayToColumns(item, text, i, this.handleChangeOnSaveData, type, length === i, length, this.popupContainer, this.getListData, () => this.state.offset)
        })
        let columns3 = others.map((item, index) => {
            let text = typeof item === 'object' ? item.title : item
            i++
            return arrayToColumns(item, text, i, this.handleChangeOnSaveData, type, length === i, length, this.popupContainer, this.getListData, () => this.state.offset)
        })
        globelCols = [...columns1, ...columns2, ...columns3]
        if (customColumns) {
            return customColumns([...columns1, ...columns2, ...columns3])
        }
        // console.log('列--', [...columns1, ...columns2, ...columns3])
        return [...columns1, ...columns2, ...columns3]
    }

    moveColumn = (dragIndex, hoverIndex) => {
        const { deploys, fixeds } = this.state
        const dragCard = deploys[dragIndex]
        let { list } = this.state
        let columns1 = fixeds.filter((item, index) => {
            return item.isShow
        })
        list = list.map(ele => {
            let dragCard0 = ele.data[dragIndex + columns1.length]
            return update(ele, {
                data: {
                    $splice: [[(dragIndex + columns1.length), 1], [(hoverIndex + columns1.length), 0, dragCard0]]
                }
            })
        })
        // editData = editData.map(ele => {
        //     let dragCard1 = ele.data[dragIndex + columns1.length]
        //     return update(ele, {data: {$splice: [[(dragIndex + columns1.length), 1], [(hoverIndex + columns1.length), 0, dragCard1]]}})
        // })
        this.setState({
            // editData: editData,
            list: list
        })
		this.setState(
            update(this.state, {
                deploys: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
                }
            }),
            () => {
                this.refresh()
            }
		)
    }

    onCloseFixed = (index) => {
        let { fixeds, list, removeQuotationLineItemIds } = this.state
        let fs = fixeds.filter(item => item.isShow)
        list = list.map(item => {
            let target = item.data[index]
            item.data.splice(index, 1)
            if (target.id) {
                removeQuotationLineItemIds.push(target.id)
            }
            return item
        })
        // editData = editData.map(item => {
        //     return  item.data.splice(index, 1)
        // })
        // console.log('editData', editData)
       
        fs[index].isShow = false
        fixeds.forEach(ele => {
            fs.forEach(item => {
                if (item.id === ele.id) {
                    fixeds.isShow = item.isShow
                }
            })
        })
        this.setState({
            fixeds: fixeds,
            removeQuotationLineItemIds: removeQuotationLineItemIds,
            list: list
            // editData: editData
        })
    }

    onCloseDeploys = (index) => {
        let { fixeds, deploys, list, removeQuotationLineItemIds } = this.state
        // console.log('deploys.splice(index, 1)', index, deploys.splice(index, 1))
        let fixedsLength = fixeds.filter(ele => ele.isShow).length
        let columns1 = fixeds.filter((item, index) => {
            return item.isShow
        })
        deploys.splice(index, 1)
        list = list.map(item => {
            let target = item.data[fixedsLength + index]
            item.data.splice(index + columns1.length, 1)
            if (item.id) {
                removeQuotationLineItemIds.push(target.id)
            }
            return item
        })
        // editData = editData.map(item => {
        //     return item.data.splice(index + columns1.length, 1)
        // })
        this.setState({
            deploys: deploys,
            list: list
        }, () => {
            this.headerChange()
        })
        // this.setState({})
    }

    /**
     * 动态设置表格头部
     * 
     * 
     * @memberOf DynamicTable
     */
    addToHeader = (d) => {
        // console.log('addToHeader', d)
        let { fixeds, deploys, list } = this.state
        const { type } = this.props
        if (d.type === 'base') {
            let isHave = false
            let length
            fixeds.forEach((ele, index) => {
                if (ele.title === d.title) {
                    if (ele.isShow) {
                        isHave = true
                    } else {
                        ele.isShow = true
                        length = index
                    }
                }
            })
            // 计算 col 在表格中的位置
            fixeds.filter(item => item.isShow).forEach((item, index) => {
                if (item.title === d.title) {
                    length = index
                }
            })
            if (isHave) {
                message.error('表头中已存在该项！')
                return
            }
            list = list.map(item => {
                item.data.splice(length, 0, {
                    itemHeader: {...arrayToColumns(d, d.title, length, this.handleChangeOnSaveData, type).itemHeader},
                    ...arrayToColumns(d, d.title, length, this.handleChangeOnSaveData, type).itemHeader,
                    value: 0
                })
                return item
            })
            this.setState({fixeds: fixeds, list: list})
        } else if (d.type === 'cost') {
            const { headerChange } = this.props
            let frontLength = fixeds.filter(item => item.isShow).length
            list = list.map((item, index) => {
                item.data.splice(frontLength + deploys.length, 0, {
                    ...arrayToColumns(d, d.title, frontLength + deploys.length, this.handleChangeOnSaveData).itemHeader,
                    value: 0
                })
                return item
            })
            // console.log('deploys', d)
            deploys.push({...d, type: 'cost'})
            if (headerChange) {
                this.clearDataSource()
                this.setState({deploys: deploys, list: []}, () => {
                    this.headerChange()
                })
            } else {
                this.setState({deploys: deploys, list: list})
            }
        }
    }

    /**
     * 编辑表格头部费用项
     */
    editToHeader = (record, index) => {
        let { list, offset, deploys } = this.state
        list = list.map(item => {
            item[index + offset] = {
                ...item[index + offset],
                ...record
            }
            return item
        })
        deploys[index] = {
            ...deploys[index],
            ...record
        }
        const { headerChange } = this.props
        this.setState({deploys: deploys, list: list}, () => {
            if (headerChange) {
                this.headerChange()
            }
        })
    }

    onAdd = () => {
        let { list } = this.state
        let cols = this.groupColumns()
        let data = []
        let i = 0
        data = cols.map((item, index) => {
            return {
                itemHeader: item.itemHeader,
                value: ''
            }
        })
        list = [{
            isEdit: true,
            data: data
        }, ...list]
        if (list)
        this.setState({ list: list.map(item => {
            if (item.isQuotationChildren) {
                return item
            } else {
                i++
                return {
                    ...item,
                    num: i
                }
            }
        })}, () => {
            this.refresh()
            // console.log('list', list)
        })
    }

    headerChange = () => {
        const { headerChange } = this.props
        if (headerChange) {
            headerChange(this.state.deploys)
        }
    }

    onSaveAddNewData = (record, index) => {
        let { list, offset } = this.state
        if (list.some(item => item.isQuotationChildren)) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].num === offset + 1) {
                    offset = i
                    break
                }
            }
        }
        index += offset
        let target = list[index]
        if (target) {
            list[index].data = target.data.map((item, index) => {
                item.value = item.value || item.value === 0 ? item.value : ''
                return item
            })
            list[index].isEdit = false
        } else {
            console.error('数据：', list, ' 取值项：', index, ' 偏移项：', offset)
        }
        this.setState({list: list}, () => {
            this.refresh()
        })
    }

    clearDataSource = () => {
        this.tableview.clearDataSource()
    }

    onSaveDeleteNewData = (record, index) => {
        let { list, offset } = this.state
        // console.log('onDeleteItem', record, index)
        if (list.some(item => item.isQuotationChildren)) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].num === offset + 1) {
                    offset = i
                    break
                }
            }
        }
        index += offset
        //let target = list[index]
        list.splice(index, 1)
        let i = 0
        this.setState({
            list: list.map(item => {
                if (item.isQuotationChildren) {
                    return item
                } else {
                    i++
                    return {
                        ...item,
                        num: i
                    }
                }
            })}, () => {
            this.refresh()
        })
    }

    handleChangeOnSaveData = (value, key, column, col) => {
        let { offset, list } = this.state
        if (list.some(item => item.isQuotationChildren)) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].num === offset + 1) {
                    offset = i
                    break
                }
            }
        }
        column += offset
        const newData = [...this.state.list]
        const target = newData[column]
        if (target) {
            if (typeof value === 'string' || typeof value === 'number') {
                target.data[col].value = value
            } else if (typeof value === 'object') {
                target.data[col].value = Object.assign({}, target.data[col].value, value)
            } else {
                target.data[col].value = value
            }
            this.setState({ list: newData })
        }
    }

    onDeleteItem = (record, index) => {
        let { list, offset, removeQuotationLineId } = this.state
        if (list.some(item => item.isQuotationChildren)) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].num === offset + 1) {
                    offset = i
                    break
                }
            }
        }
        index += offset
        // 处理序号问题
        if (list[index] && list[index + 1] && list[index + 1].isQuotationChildren) {
            list.splice(index + 1, 1)
            list.splice(index, 1)
        } else {
            list.splice(index, 1)
        }
        
        if (record.id && !removeQuotationLineId.some(id => id === record.id)) {
            removeQuotationLineId.push(record.id)
        }
        let i = 0
        this.setState({
            list: list.map(item => {
                if (item.isQuotationChildren) {
                    return item
                } else {
                    i++
                    return {
                        ...item,
                        num: i
                    }
                }
            }), removeQuotationLineId: removeQuotationLineId}, () => {
            this.refresh()
        })
    }

    onExportData = () => {
        const { onExportData, type, mode } = this.props
        if (onExportData) {
            onExportData({
                businessModeId: mode.businessModeId,
                // quotationId: mode.quotationId,
                id: mode.quotationId,
                transportModeId: mode.transportModeId,
                header: this.getHeader(),
                type: type
            })
        }
    }

    onExportQuotationData = () => { //导出报价单
        const { onExportQuotationData, mode } = this.props
        // console.log('onExportQuotationData', mode)
        if (onExportQuotationData) {
            onExportQuotationData({
                businessModeId: mode.businessModeId,
                businessModeName: mode.businessModeName,
                // quotationId: mode.quotationId,
                id: mode.quotationId,
                transportModeId: mode.transportModeId,
                transportModeName: mode.transportModeName
            })
        }
    }

    onEditItem = (record, index) => {
        let { list, offset } = this.state
        // console.log('offset', offset)
        if (list.some(item => item.isQuotationChildren)) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].num === offset + 1) {
                    offset = i
                    break
                }
            }
            // list.forEach((ele, i) => {
            //     if (ele.num === offset + 1) {
            //         offset = i
            //     }
            // })
        }
        // console.log('offset', offset, index)
        index += offset
        // let cols = this.groupColumns()
        // let target = list[index]
        // console.log('onEditItem', index, list)
        if (list[index]) {
            list[index].isEdit = true
        } else {
            console.error('数据：', list, ' 取值项：', index, ' 偏移项：', offset)
        }

        this.setState({list: list}, () => {
            this.refresh()
        })
    }

    render() {
        const { 
            //edit, 
            type, 
            tableTitle, 
            onlySetHeader, 
            actionView, 
            isNoneSelected,
            isNoneHeader,
            isNonePagination,
            isNoneAction, 
            isNoneNum,
            style,
            showButtons,
            getPopupContainer,
            mode,
            isShowQuotationExportData
        } = this.props
        // console.log('this.props', this.props)
        const { fixeds, deploys, others, isEdit } = this.state
        return (
            <div ref={v => this.popupDom = v}>
            <Table
                power={{
                    DEL_DATA: {
                        id: 'DYNAMIC_TABLE_ITEM_DEL_DATA',
                        isShow: true
                    },
                    EDIT_DATA: {
                        id: 'DYNAMIC_TABLE_ITEM_EDIT_DATA',
                        isShow: true
                    },
                }}
                // calaCellWidth
                // tableHeight={tableHeight}
                style={{padding: 0, ...style}}
                isForceKey
                // scroll={scroll ? scroll : {x: true}}
                isCustomPagination
                parent={this}
                isNoneSelected={isNoneSelected}
                getThis={v => this.tableview = v}
                isNoneAction={isNoneAction}
                isNonePagination={isNonePagination}
                isNoneNum={isNoneNum}
                onSaveAddNewData={this.onSaveAddNewData}
                onSaveDeleteNewData={this.onSaveDeleteNewData}
                onDeleteItem={this.onDeleteItem}
                onEditItem={this.onEditItem}
                columns={this.groupColumns()}
                actionView={actionView}
                actionWidth={70}
                fixed='right'
                THeader={
                    isNoneHeader ? 
                    <span></span>
                    :
                    <TableHeader 
                        showButtons={
                            showButtons ? 
                            showButtons
                            : 
                            {
                                1: 1,
                                2: 1,
                                3: 1,
                                4: 1,
                                5: 1,
                                6: 1,
                                7: isShowQuotationExportData ? 1 : 0
                            }
                        }
                        onlySetHeader={onlySetHeader}
                        globelCols={globelCols}
                        tableTitle={tableTitle} 
                        type={type} 
                        fixeds={fixeds} 
                        deploys={deploys} 
                        others={others}
                        isEdit={isEdit}
                        mode={mode}
                        clearAllData={this.clearAllData}
                        onAdd={this.onAdd} 
                        addToHeader={this.addToHeader}
                        editToHeader={this.editToHeader}
                        onCloseDeploys={this.onCloseDeploys} 
                        onCloseFixed={this.onCloseFixed} 
                        moveColumn={this.moveColumn}
                        onExportData={this.onExportData}
                        onExportQuotationData={this.onExportQuotationData}
                        getHeader={this.getHeader}
                        getPopupContainer={getPopupContainer}
                        beforeUpload={this.beforeUpload}  
                        quotationMethod={this.props.quotationMethod}
                        isCustoms={this.props.isCustoms} //是否是关务运输
                        isQuickSearchQuery={this.props.isQuickSearchQuery}
                        TableHeaderChildren={this.props.TableHeaderChildren}
                    />
                }
                getPopupContainer={getPopupContainer}
                getData={this.getData}
                bordered={this.props.bordered}
            />
            </div>
        )
    }
}
 
export default DynamicTable;