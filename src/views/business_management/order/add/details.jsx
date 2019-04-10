import React, {Component} from 'react'
import { inject } from "mobx-react"
import { Spin, Table } from 'antd'
import { deleteNull, trim, addressToString, addressFormat, stringObjectObject } from '@src/utils'
import { Row, Col } from '@src/components/grid'
// import './index.less'

@inject('rApi') 
export default class PopContent extends Component {

    state = {
        loading: false
    }
    
    constructor(props) {
        super(props)
        this.state.columns = [
            {
                width: 120,
                className: 'text-overflow-ellipsis',
                title: '代码',
                dataIndex: 'code',
                key: 'code'
            },
            {
                width: 140,
                className: 'text-overflow-ellipsis',
                title: '收货方名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                className: 'text-overflow-ellipsis',
                title: '联系人',
                dataIndex: 'contactName',
                key: 'contactName'
            },
            {
                className: 'text-overflow-ellipsis',
                title: '联系方式',
                dataIndex: 'contactNumber',
                key: 'contactNumber'
            },
            {
                className: 'text-overflow-ellipsis',
                title: '详细地址',
                dataIndex: 'address',
                key: 'address',
                render: (text, r, index) => {
                    let addressVul = ''
                    try {
                        addressVul = (r.address && typeof(r.address) === 'string') ? addressToString(JSON.parse(r.address)) : (r.address && typeof(r.address) === 'object') ? addressToString(r.address) : '无'
                    } catch(e){
                        addressVul = r.address
                    }
                    return(
                        <span title={addressVul}>{addressVul}</span>
                    )
                }
            },
            {
                className: 'text-overflow-ellipsis',
                title: '片区',
                dataIndex: 'areaName',
                key: 'areaName',
                render: (text, r, index) => {
                    return(
                        <span title={r.areaName}>{
                            r.areaName ? r.areaName : '无'
                        }
                        </span>
                    )
                }
            }
        ]
    }

    render() {
        const { columns } = this.state
        let { sendDetailsList, addressType } = this.props
        let code = null, name = null, contactName = null, contactNumber = null, address = null, areaName = null
        if(sendDetailsList && sendDetailsList.length > 0) {
            code = sendDetailsList[0].code
            name = sendDetailsList[0].name
            contactName = sendDetailsList[0].contactName
            contactNumber = sendDetailsList[0].contactNumber
            address = sendDetailsList[0].address
            areaName = sendDetailsList[0].areaName
        }
        let addressVul = ''
        try {
            addressVul = (address && typeof(address) === 'string') ? addressFormat(JSON.parse(address)) : (address && typeof(address) === 'object') ? addressFormat(address) : '-'
            if(!addressVul) {
                addressVul = (address && typeof(address) === 'string') ? addressToString(JSON.parse(address)) : (address && typeof(address) === 'object') ? addressToString(address) : '-'
            }
        } catch(e){
            addressVul = address
        }
        return (
            <Spin spinning={this.props.loading}>
                <div style={{width: 700}}>
                    <Row gutter={24}>
                        <Col label={addressType === 1 ? '发货方(代码) ' : '收货方(代码) '} span={9}>
                            <span title={name ?  `${name}(${code ? code : '无'})`: '-'}>
                                {name ?  `${name}(${code ? code : '无'})`: '-'}
                            </span>
                        </Col>
                        <Col label='联系人' span={5}>
                            <span title={contactName ? contactName : '-'}>
                                {contactName ? contactName : '-'}   
                            </span>
                        </Col>
                        <Col label='联系方式' span={7}>
                            <span title={contactNumber ?  contactNumber : '-'}>
                                {contactNumber ?  contactNumber : '-'}
                            </span>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col label='详细地址&emsp;&ensp;&ensp;' span={15}>
                            <span title={addressVul}>
                                {addressVul ? addressVul : '-'}
                            </span>
                        </Col>
                        <Col label='所属片区' span={7}>
                            <span title={areaName ? areaName : '-'}>
                                {areaName ? areaName : '-'}
                            </span>
                        </Col>
                    </Row>
                </div>
                {/* <Table 
                    key={this.props.keyId}
                    size="small"
                    columns={columns} 
                    dataSource={this.props.sendDetailsList} 
                    pagination={false}
                    scroll={{x: true}}
                    //loading={this.props.loading}
                />    */}
            </Spin>
        )
    }
}