import React from 'react'
import { Table, Parent } from '@src/components/table_template'
import FunctionPower from '@src/views/layout/power_view/function.jsx'
import { children, id } from './power'
import { Button } from 'antd'

const power = Object.assign({}, children, id)

//已选配载列表表头
const TableHeaderStowage = (props) => { 
    return (
        [
            <FunctionPower power={power.STOWAGE_START} key="toStowage">
                <Button
                    onClick={props.toStowage}
                    style={{
                        marginRight: 10,
                        verticalAlign: 'middle'
                    }}
                    // icon="car"
                    disabled={props.disabledConfirmStowage ? true : false}
                >
                    开始配载
                </Button>
            </FunctionPower>
        ]
    )
}

// 配载面板
class StowageTableView extends Parent {

    state = {}

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
    }

    getStowageData = () => {
        let { stowageList, addStatistics, getTotalData } = this.props
        //console.log('getStowageData111', stowageList)
        let totalData = addStatistics(stowageList) && addStatistics(stowageList).length > 0 ? addStatistics(stowageList)[addStatistics(stowageList).length - 1] : []
        getTotalData(totalData) //将配载总数返回给父组件
        return new Promise((resolve, reject) => {
            // console.log('list', stowageList)
            resolve({
                dataSource: addStatistics(stowageList),
                total: stowageList.length
            })
        })
    }

    refresh = () => {
        this.searchCriteria()
    }

    componentDidUpdate(preProps) {
        if (preProps.stowageList !== this.props.stowageList) {
            this.searchCriteria()
        }
    }

    getCheckboxProps = (record) => {
        if (record.isStatistics) {
            return {
                disabled: true
            }
        }
        return {
            disabled: false
        }
    }

    render() {
        const { actionView, onlyStowage, toStowage, columns, stowageList, onChangeSelect, disabledConfirmStowage, minHeight } = this.props
        const minH = minHeight * 0.24
        //consoleconsole.log('minHeight', minH)
        return (
            <Table
                getCheckboxProps={this.getCheckboxProps}
                isHideAddButton
                isHideDeleteButton
                actionView={actionView}
                selectedPropsRowKeys={stowageList}
                title="已选配载"
                TableHeaderTitle="已选配载"
                actionWidth={140}
                TableHeaderChildren={<TableHeaderStowage onlyStowage={onlyStowage} toStowage={toStowage} disabledConfirmStowage={disabledConfirmStowage} />}
                onChangeSelect={onChangeSelect}
                parent={this}
                power={power}
                getData={this.getStowageData}
                columns={columns}
                tableHeight={minH}
            >
            </Table>
        )
    }
}

export default StowageTableView