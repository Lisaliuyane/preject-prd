import React from 'react'
import Modal from '@src/components/modular_window'
import { Table, Parent, ColumnItemBox } from '@src/components/table_template'
import { inject } from "mobx-react"
import moment from 'moment'

const ModularParent = Modal.ModularParent

/* 表格 */
export const LogsTabls = class LogsTable extends Parent{
    constructor (props) {
        super(props)
        this.state = {
            columns: [
                {
                    className: 'text-overflow-ellipsis',
                    title: '操作类型',
                    dataIndex: 'operationType',
                    key: 'operationType',
                    width: 140,
                    render: (val, r) => {
                        let name = ''
                        switch (val) {
                            case 1:
                                name = '对账单生成'
                                break;

                            case 2:
                                name = '对账单编辑'
                                break;

                            case 3:
                                name = '对账单确认'
                                break;

                            case 4:
                                name = '取消对账单确认'
                                break;

                            case 5:
                                name = '对账单财务确认'
                                break;

                            case 6:
                                name = '取消对账单财务确认'
                                break;
                        
                            default:
                                name = name
                                break;
                        }
                        return (
                            <ColumnItemBox name={name} />
                        )
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '操作时间',
                    dataIndex: 'operationTime',
                    key: 'operationTime',
                    // width: 160,
                    render: (val, r) => {
                        return val && moment(val).format('YYYY-MM-DD HH:mm:ss')
                    }
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '操作人员',
                    dataIndex: 'operatorName',
                    key: 'operatorName',
                    width: 140,
                    render: (val, r) => {
                        return (
                            <ColumnItemBox name={val} />
                        )
                    }
                }
            ]
        }
    }

    getData = () => {
        const {source} = this.props
        return new Promise((resolve, reject) => {
            let dataList = [...source.reconciliationOperationLogList]
            resolve({
                dataSource: dataList,
                total: dataList.length
            })
        })
    }

    render () {
        const {
            columns
        } = this.state
        return(
            <Table
                style={{ backgroundColor: '#fff', margin: '10px 0' }}
                isHideHeaderButton
                isNoneSelected
                isNoneNum
                isNonePagination
                parent={this}
                getThis={v => this.tableView = v}
                isNoneAction
                title={null}
                getData={this.getData}
                columns={columns}
                tableWidth={80}
            />
        )
    }
}



@inject('rApi', 'mobxBaseData')  
class Logs extends ModularParent {

    state = {
        openType: null,
        title: '',
        open: false,
        buttonLoading: false,
        source: {},
        activeTab: 'baseinfo'
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
    }

    show(d) {
        // console.log('show', d)
        let title = `操作日志(${d.reconciliationNumber})`
        this.setState({
            open: true,
            title,
            source: {...d}
        })
    }
  
    changeOpen = (open) => {
        this.setState({
            open
        })
        if (!open) {
            this.clearValue()
        }
    }

    clearValue() {
        this.setState({
            openType: null,
            title: '',
            open: false,
            source: {},
        })
    }

    onSubmit = () => {
        const { form } = this.props
        form.validateFields((errors, values) => {
            if(errors === null) {
                this.handleSubmit()
            }
        })
    }

    handleSubmit = () => {
        
    }

    render() {
        let {
            open,
            title,
            buttonLoading,
            source
        } = this.state
        if (!open) return null
        return (
            <Modal 
                changeOpen={this.changeOpen}
                onSubmit={this.onSubmit}
                open={open} 
                title={title} 
                style={{width: 700}}
                loading={buttonLoading}
                haveFooter={false}
                className='logs-modal'
            >
                <LogsTabls
                    source={source}
                />
            </Modal>
        )
    }
}

export default Logs