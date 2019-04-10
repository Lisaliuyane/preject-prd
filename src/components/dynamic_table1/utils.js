import { isArray } from '@src/utils'

const nullToString = (s) => {
    if (s === null || s === 'null') {
        return ''
    }
    return s
}

const deleteStringCommaNull = (s) => {
    if (s.endsWith(',') || s.endsWith(' ')) {
        return deleteStringCommaNull(s.substring(0, s.length - 1))
    } else {
        return s
    }
}

const filterNull = (string) => {
    if ( typeof string === 'undefined' || string === null || string.toString().length < 1) {
        return false
    } 
    return true
}

/** 
 * 费用项转换为文字
*/
export const costItemObjectToString = (qItem) => {
    let {
        text,
        title,
        carType, // 车类型ID
        carTypeName, // 车类型名称
        costUnitId, // 费用单位ID
        costUnitName, // 费用单位名称
        expenseItemId, // 费用项目ID
        expenseItemName, // 费用项目名称
        lowestFee, // 最低收费
        intervalCostUnitName, // 限制区间单位名称
        intervalCostUnitId, // 限制区间单位ID
        endValue, // 限制区间 end
        startValue, // 限制区间 start
        firstWeight // 首重
    } = qItem
    // console.log('costItemObjectToString', qItem)
    intervalCostUnitName = intervalCostUnitName || ''
    let s1 = '', s2 = '', s3 = '', s4 = '', s5 = ''
    s1 = expenseItemName + '(' + costUnitName + ')'
    if (filterNull(lowestFee)) { 
        s2=', ￥≥' + lowestFee
    }
    if(filterNull(startValue) && filterNull(endValue)) {
        s3 = `, ${startValue}<${intervalCostUnitName ? intervalCostUnitName : costUnitName}≤${endValue}`
    } else if(filterNull(startValue) && !filterNull(endValue)) {
        s3 = `, ${intervalCostUnitName ? intervalCostUnitName : costUnitName}>${startValue}`
    } else if(!filterNull(startValue) && filterNull(endValue)) {
        s3 = `, ${intervalCostUnitName ? intervalCostUnitName : costUnitName}≤${endValue}`
    }
    s4 = carTypeName ? `, ${carTypeName}` : ''
    s5 = `${expenseItemName}(${costUnitName}), ${costUnitName}≤${firstWeight}`
    if (expenseItemId === 3 && expenseItemName === "首重") {
        return s5
    }
    return s1 + s2 + s3 + s4
}

// export const getHeaderData = (d) => {
//     let header = []
//     header.push({
//         title: '起运地',
//         isHaveMove: false,
//         isShow: true,
//         type: 'base',
//         name: 'departure',
//         id: 1
//     })
//     header.push({
//         title: '目的地',
//         isHaveMove: false,
//         isShow: true,
//         type: 'base',
//         name: "destination",
//         id: 2
//     })

//     header.push({
//         title: '时效',
//         isHaveMove: false,
//         isShow: true,
//         type: 'base',
//         name: "aging",
//         id: 3
//     })

//     header.push({
//         title: '是否高速',
//         isHaveMove: false,
//         isShow: true,
//         type: 'base',
//         name: "isHighway",
//         id: 4
//     })

//     header.push({
//         title: '最低收费',
//         isHaveMove: false,
//         isShow: true,
//         type: 'base',
//         name: "lowestFee",
//         id: 5
//     })

//     if (isArray(d.quotationLineExpenseItems)) {
//         d.quotationLineExpenseItems.forEach(item => {
//             header.push(Object.assign({}, item, {type: 'cost', name: 'chargeFee'}))
//         })
//     }
//     return header
// }

// export const getListData = (d, header) => {
//     return d.map(item => {
//         let element = {
//             historyData: item,
//             data: []
//         }
//         let fixed = header.filter(it => it.type === 'base' && it.isShow)
//         fixed.forEach(it => {
//             element.data.push({
//                 itemHeader: it,
//                 value: item[it.name]
//             })
//         })
//         let deploys = header.filter(it => it.type === 'cost')
//         deploys.forEach((it, index) => {
//             element.data.push({
//                 itemHeader: it,
//                 value: item.quotationLineExpenseItems[index].chargeFee || 0, 
//                 id: item.quotationLineExpenseItems[index].id
//             })
//         })
//         element.id = item.id
//         return element
//     })
// }

export const getListData = (d, header) => {
    // console.log('getListData', d)
    let list = []
    let data = d.filter(item => item).map((item, index) => {
        let element = {
            historyData: item,
            data: []
        }
        if (item.children) {
            element.children = []
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
        })
        let deploys = header.filter(it => it.type === 'cost')
        deploys.forEach((it, index) => {
            // console.log('deploys', item, index)
            element.data.push({
                itemHeader: it,
                value: item.quotationLineExpenseItems[index] ? item.quotationLineExpenseItems[index].chargeFee || 0 : 0, 
                id: item.quotationLineExpenseItems[index] ? item.quotationLineExpenseItems[index].id : null
            })
            if (element.children) {
                element.children.push({
                    itemHeader: it,
                    isChildren: true,
                    value: item.children.quotationLineExpenseItems[index] ? item.children.quotationLineExpenseItems[index].chargeFee || 0 : 0, 
                    id: item.children.quotationLineExpenseItems[index] ? item.children.quotationLineExpenseItems[index].id : null
                })
            }
        })
        element.id = item.id
        if (element.children && item.quotationLineExpenseItems && item.quotationLineExpenseItems.length > 0) {
            // element.children = [{
            //     data: element.children,
            //     isChildren: true,
            //     id: 'children' + index
            // }]
            // delete element.children
            // console.log('item.children', item.children)
            element.children = getListData([item.children], header).map((item) => {
                item.data = item.data.map((ele, index) => {
                    if ((ele.itemHeader && ele.itemHeader.type === 'base') || (ele && ele.type === 'base')) {
                        if (index === 0) {
                            ele.value = '成本费用'
                        } else {
                            ele.value = ''
                        }
                    } else {
                        ele.originValue = element.data[index].value
                    }
                    return {...ele}
                })
                
                return {...item, isNoneAction: true, num: '', isQuotationChildren: true}
            })
            // console.log('element.children', element.children)
        }
        return element
    })

    data.map((item, index) => {
        let children = item.children
        delete item.children
        list.push({...item, num: index + 1})
        if (children) {
            list.push(...children)
        }
    })
    // console.log('list', list)
    return list
}


export const analysis = (d) => {
    // console.log('d', d)
    if (d === null || typeof d === 'undefined') {
        return false
    }
    return true
}

export const getHeaderData = (d) => {
    let header = []
    // const { isHaveAddCost } = this.props
    if (analysis(d && d.departure)) {
        header.push({
            title: '起运地',
            isHaveMove: false,
            isShow: true,
            type: 'base',
            name: "departure",
            id: 1
        })
    }
    if (analysis(d && d.transitPlaceOneName) || analysis(d && d.transitPlaceOneId) || analysis(d && d.transitPlaceTwoId) || analysis(d && d.transitPlaceTwoId)) {
        header.push({
            title: '中转地',
            isHaveMove: true,
            isShow: true,
            type: 'base',
            name: "transitPlaceOneName",
            id: 2
        })

    }

    if (analysis(d && d.destination)) {
        header.push({
            title: '目的地',
            name: "destination",
            type: 'base',
            isHaveMove: false,
            isShow: true,
            id: 3
        })
    }
    
    if (analysis(d && d.aging)) {
        header.push({
            title: '时效',
            name: "aging",
            type: 'base',
            isHaveMove: false,
            isShow: true,
            id: 4
        })
    }

    // if (analysis(d.aging)) {
    //     header.push({
    //         title: '时效',
    //         name: "aging",
    //         type: 'base',
    //         isHaveMove: true,
    //         isShow: true,
    //         id: 4
    //     })
    // }

    if (analysis(d && d.isHighway)) {
        header.push({
            title: '是否高速',
            name: "isHighway",
            type: 'base',
            isHaveMove: true,
            isShow: true,
            id: 5
        })
    }

    if (analysis(d && d.isPick)) {
        header.push({
            title: '是否分拣',
            name: "isPick",
            type: 'base',
            isHaveMove: true,
            isShow: true,
            id: 6
        })
    }

    if (analysis(d && d.lowestFee)) {
        header.push({
            title: '最低收费',
            name: "lowestFee",
            type: 'base',
            isHaveMove: true,
            isShow: true,
            id: 7
        })
    }

    // if (analysis(d.lowestFee)) {
    //     header.push({
    //         title: '最低收费',
    //         name: "lowestFee",
    //         type: 'base',
    //         isHaveMove: true,
    //         isShow: true,
    //         id: 6
    //     })
    // }

    if (analysis(d && d.remark)) {
        header.push({
            title: '备注',
            name: 'remark',
            type: 'base',
            isHaveMove: true,
            isShow: true,
            id: 8
        })
    }
    if (d && isArray(d.quotationLineExpenseItems)) {
        d.quotationLineExpenseItems.forEach(item => {
            let headItem = Object.assign({}, item, {type: 'cost', name: 'chargeFee'})
            if (headItem.id) {
                delete headItem.id
            }
            header.push(headItem)
        })
    }
    return header
}
