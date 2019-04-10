import React, { Component } from 'react'
import { Table } from 'antd'
const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
    }
]

function testString(str, s) {
    str += ','
    var reg = new RegExp(s + ',');//从头到尾都不是数字
    return reg.test(str)
};

class TableView extends Component {

    

    state = {
        loading: false,
        selectedRowKeys: []
    }
    constructor(props) {
        super(props);
        if (props.getref) {
            props.getref(this)
        }

    }

    onRowClick = (d) => {
        if (this.props.clickLoadData) {
            this.props.clickLoadData(d)
        }
    }

    onSelectChange = (selectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    componentWillUpdate(nextProps) {
        // console.log('nextProps', nextProps.area, this.props.area)
        if (nextProps.area !== this.props.area) {
            // this.setState({ selectedRowKeys })
            let selectedRowKeys = []
            nextProps.dataSource.slice().filter((ele, index) => {
                if (testString(ele.areaId ? ele.areaId.toString() : '', nextProps.area ? nextProps.area.toString() : '')) {
                    selectedRowKeys.push(index)
                    return true
                } else {
                    return false
                }
            })
            // console.log('selectedRowKeys', selectedRowKeys)
            this.setState({selectedRowKeys: selectedRowKeys})
        }
    }

    getCodes() {
        let codes = []
        let dataSource = this.props.dataSource|| []
        this.state.selectedRowKeys.forEach(element => {
            codes.push(dataSource[element].id)
        })
        return codes
    }

    render() {
        let dataSource = this.props.dataSource || []
        const { isEdit, title, area, isHaveAction, loading, isCity } = this.props
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        }
        // if (isCity) {
        //     console.log('dataSource', dataSource,  this.props.dataSource);
        // }
        if (isHaveAction) {
            if (!isEdit && area) {
                let data = dataSource.slice().filter(ele => {
                    return testString(ele.areaId ? ele.areaId.toString() : '', area)
                })
                if (isCity && data.length < 1) {
                } else {
                    dataSource = data
                }
            }
        }
        return (
            <Table
                onRow={(record) => {
                        return {
                            onClick: () => {
                                this.onRowClick(record)
                            }
                        }
                    }
                }
                style={{minHeight: 680}}
                loading={loading}
                scroll={{y: 600 }}
                rowKey={(record, index) => (index)}
                rowSelection={isEdit && isHaveAction ? rowSelection : null}
                title={() => <div style={{padding: '0 10px'}}>{title}</div>}
                pagination={false}
                columns={columns}
                dataSource={dataSource} 
            />
        )
    }
}
 
export default TableView;