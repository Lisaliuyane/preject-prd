import React from 'react'
import { Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { inject } from "mobx-react"
import { materialKeys } from '@src/utils/logic'

const colRendFun = (t, r, index, key) => {
    let name = t
    switch (key) {
        case 'pickCount':
            let ak = r.unitType ? materialKeys[r.unitType - 1] : materialKeys[0]
            ak = ak.substring(0, 1).toUpperCase() + ak.substring(1)
            ak = `actual${ak}`
            name = r[ak]
            return (
                <ColumnItemBox name={name} />
            )

        case 'pickSum': //拣货总量
            name = r.unitType ? r[materialKeys[r.unitType - 1]] : r[materialKeys[0]]
            return (
                <ColumnItemBox name={name} />
            )
    
        default:
            return (
                <ColumnItemBox name={name} />
            )
    }
}

const colFun = () => [
    {
        className: 'text-overflow-ellipsis',
        title: '料号',
        dataIndex: 'materialNumber',
        key: 'materialNumber',
        width: 120,
        render: (t, r, index) => colRendFun(t, r, index, 'materialNumber')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '物料名称',
        dataIndex: 'materialName',
        key: 'materialName',
        width: 120,
        render: (t, r, index) => colRendFun(t, r, index, 'materialName')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '规格/品级',
        dataIndex: 'materialSpecifications',
        key: 'materialSpecifications',
        width: 120,
        render: (t, r, index) => colRendFun(t, r, index, 'materialSpecifications')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '批次号',
        dataIndex: 'batchNumber',
        key: 'batchNumber',
        width: 100,
        render: (t, r, index) => colRendFun(t, r, index, 'batchNumber')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
        width: 100,
        render: (t, r, index) => colRendFun(t, r, index, 'unit')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '已拣数量',
        dataIndex: 'pickCount',
        key: 'pickCount',
        width: 120,
        render: (t, r, index) => colRendFun(t, r, index, 'pickCount')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '拣货总量',
        dataIndex: 'pickSum',
        key: 'pickSum',
        width: 120,
        render: (t, r, index) => colRendFun(t, r, index, 'pickSum')
    },
    {
        className: 'text-overflow-ellipsis',
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        render: (t, r, index) => colRendFun(t, r, index, 'remark')
    }
]

@inject('rApi')
class Summary extends Parent {
    constructor(props) {
        super(props);
        if (props.getThis) {
            props.getThis(this)
        }
        this.state = {
            columns: colFun()
        }
    }

    // 列表数据获取
    getData = async (params) => {
        const { rApi, curRow } = this.props
        params = {
            ...params,
            pageSize: params.limit,
            shipmentManageId: curRow.shipmentManageId
        }
        return new Promise((resolve, reject) => {
            rApi.getShipmentSummary(params)
                .then(async res => {
                    let list = [...res.records]
                    resolve({
                        dataSource: list,
                        total: res.total
                    })
                })
                .catch(err => {
                    resolve({
                        dataSource: [],
                        total: 0
                    })
                })
        })
    }

    render() {
        return (
            <Table
                isHideHeaderButton
                isNoneAction
                isNoneSelected
                isPreventActionEvent
                parent={this}
                getData={this.getData}
                columns={this.state.columns}
            />
        )
    }
}

export default Summary