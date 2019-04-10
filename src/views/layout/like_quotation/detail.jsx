import React, { Component } from 'react'
import { Icon, Modal } from 'antd'
import { inject, observer } from "mobx-react"
import ReadOnce from '@src/components/dynamic_table1/readonce'

@inject('rApi')
class ShowDetail extends Component {

    state = {
        visible: false,
        loading: false,
        quotationLines: []
    }

    constructor(props) {
        super(props);
        const { getThis } = props
        if (getThis) {
            getThis(this)
        }
    }

    show = (params) => {
        const { rApi } = this.props
        const {
            quotationType,
            quotationClassify,
            id,
            record,
            types,
            wheres,
            title,
            list
        } = params
        //console.log('params-details', params)
        let carrierName = record.carrierName ? record.carrierName : '无'
        carrierName = record.historyData && record.historyData.carrierName ? record.historyData.carrierName : '无'
        //console.log('carrierName', quotationType, quotationClassify)
        this.setState({
            //loading: true,
            list: list,
            who: wheres && wheres.length > 0 && wheres.filter(item => item.id === quotationClassify)[0].title, 
            //type: types[quotationType].title,
            carrierName,
            title,
            quotationLines: [record],
            visible: true
        })
    }

    close = () => {
        this.setState({visible: false})
    }

    render() { 
        const { 
            visible, 
            quotationLines,
            carrierName,
            type,
            loading,
            who,
            title,
            list
        } = this.state
        if (!visible) {
            return false
        }
        let i = 0
       // console.log('list', list)
        return (
            <Modal
                style={{left: 128, border: '#fff', color: '#484848'}}
                width={1000}
                visible={visible}
                title={`${who}, 承运商/客户：${carrierName}`}
                onCancel={this.close}
                footer={null}
            >
            {
                quotationLines.length > 0 ?
                <ReadOnce 
                    quotationLines={list}
                />
                :
                null
            }
            {
                loading ? 'loading' : null
            }
            </Modal>
        )
    }
}
 
export default ShowDetail;