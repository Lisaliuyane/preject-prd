import React, { Component, Fragment} from 'react'
import { Modal, Button, Checkbox, message, Popconfirm } from 'antd'
import { Row, Col } from '@src/components/grid'

const CheckboxGroup = Checkbox.Group

class TransModal extends Component {

    state={
        checkedTransportData: [], // 当前已选中运输方式数据
        checkedTransport: []
    }

    constructor(props) {
        super(props)
        if (props.getThis) {
            props.getThis(this)
        }
        // this.state.checkedTransport = props.checkedTransport
        this.state.checkedTransportData = props.checkedTransportData || []
        this.state.checkedTransport = this.state.checkedTransportData.map(item => item.transportModeId)
       // console.log('constructor', props.checkedTransportData, this.state.checkedTransport)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.transModalVisible && !this.props.transModalVisible) {
            this.setState({
                checkedTransportData: nextProps.checkedTransportData,
                checkedTransport: nextProps.checkedTransportData.map(item => item.transportModeId)
            })
        }
    }

    /* 自定义底部 */
    cusFooter = () => {
        return(
            <Fragment>
                <Button onClick={this.saveTransport}>保存</Button>
                <Button onClick={this.closeTransport}>取消</Button>
            </Fragment>
        )
    }

    saveTransport = () => {
        const { saveTransport} = this.props
        const { checkedTransportData, checkedTransport } = this.state
        for (let item of checkedTransportData) {
            if (!item.checkedArr || item.checkedArr.length < 1) {
                message.warning(`请选择${item.transportModeName}业务模式`)
                return
            }
        }
        //console.log('checkedTransportData', checkedTransportData)
        saveTransport(checkedTransportData, checkedTransport)
    }

    closeTransport = () => {
        const { closeTransport} = this.props
        closeTransport()
    }

    /* 运输方式子集选中修改 */
    changeTransportChild = (checkedArr, index) => {
        let { transportTypeList } = this.props
        let { checkedTransportData } = this.state
        let list = transportTypeList.filter(item => item.key === checkedTransportData[index].transportModeId)
        // console.log('changeTransportChild', transportTypeList, checkedTransportData[index], list)
        list = list && list[0] ? list[0].data : []
        checkedTransportData[index].checkedArr = [...checkedArr]
        checkedTransportData[index].checkedArrValue = checkedArr.map(item => {
            for (let ele of list) {
                if (ele.key === item) {
                    return {
                        businessModeId: ele.key,
                        businessModeName: ele.label
                    }
                }
            }
            return item
        })
        this.setState({transportTypeList})
    }

    /* 运输方式选中修改 */
    changeCheckedTransport = (e, key, index) => {
        // console.log('e', e.target)
        let flag = e.target.checked
        let { transportTypeList } = this.props
        let { checkedTransport } = this.state
        if (flag) {
            checkedTransport.push(key)
        } else {
            let ckIndex = checkedTransport.indexOf(key)
            checkedTransport.splice(ckIndex, 1)
            transportTypeList[index].checkedArr = []
        }

       // console.log('check', transportTypeList)
        let checkedTransportData = transportTypeList.filter(item => checkedTransport.some(key => parseInt(key, 10) === parseInt(item.key || item.transportModeId, 10)))
        checkedTransportData = checkedTransportData.map(item => {
            let filter = checkedTransportData.filter(ele => ele.transportModeId === item.key)
            filter = filter && filter[0] ? filter[0] : {}
            return {
                checkedArr: item.checkedArr,
                checkedArrValue: item.checkedArrValue || [],
                data: item.data,
                transportModeId: item.transportModeId || item.key,
                transportModeName: item.transportModeName || item.label,
                ...filter
            }
        })
        this.setState({ checkedTransport, checkedTransportData })
    }
    /* 运输方式选中修改 */
    changeTransport = checkedArr => {
        const { checkedTransportData } = this.state
        let { transportTypeList } = this.props
        transportTypeList = transportTypeList.map(item => {
            if (!checkedArr.some(key => parseInt(key, 10) === item.key)) {
                item.checkedArr = []
            }
            return item
        })
        let checkedTransport = [...checkedArr]
        let list = transportTypeList.filter(item => checkedTransport.some(key => parseInt(key, 10) === parseInt(item.key || item.transportModeId, 10)))
        list = list.map(item => {
            let filter = checkedTransportData.filter(ele => ele.transportModeId === item.key)
            filter = filter && filter[0] ? filter[0] : {}
            return {
                checkedArr: item.checkedArr,
                checkedArrValue: item.checkedArrValue || [],
                data: item.data,
                transportModeId: item.transportModeId || item.key,
                transportModeName: item.transportModeName || item.label,
                ...filter
            }
        })
        this.setState({checkedTransport, checkedTransportData: list})
    }


    render () {
        const {
            parentDom,
            transModalVisible,
            transportTypeList
        } = this.props

        const {
            checkedTransport,
            checkedTransportData
        } = this.state
        return (
            <Modal
                getContainer={() => parentDom}
                visible={transModalVisible}
                footer={this.cusFooter()}
                wrapClassName='modal-trans'
                closable={false}
                centered={true}
                width={580}
            >
                <Row>
                    <Col><span style={{ fontWeight: 600 }}>运输方式</span></Col>
                </Row>
                {/* <div style={{ margin: '20px auto' }}>
                    {
                        transportTypeList.map((item, index) => {
                            let flag = checkedTransport.some(key => parseInt(key, 10) === parseInt(item.key, 10))
                            if (flag) {
                                return (
                                    <Popconfirm
                                        key={item.key}
                                        title={`是否确定清空${item.label}下数据？`}
                                        onConfirm={e => this.changeCheckedTransport({ target: { checked: false } }, item.key, index)}
                                    >
                                        <Checkbox
                                            checked={flag}
                                        >
                                            {item.label}
                                        </Checkbox>
                                    </Popconfirm>
                                )
                            } else {
                                return (
                                    <Checkbox
                                        key={item.key}
                                        onChange={e => this.changeCheckedTransport(e, item.key, index)}
                                        checked={flag}
                                    >
                                        {item.label}
                                    </Checkbox>
                                )
                            }
                        })
                    }
                </div> */}
                <CheckboxGroup 
                    options={transportTypeList}
                    value={checkedTransport}
                    onChange={this.changeTransport} 
                    style={{margin: '20px auto'}}
                />
                {
                    checkedTransportData.map((item, index) => {
                        let list = transportTypeList.filter(ele => ele.key === item.transportModeId)
                        return (
                            <Row key={item.transportModeId} gutter={24} style={{ background: '#f7f7f7', margin: '8px auto', padding: '0 10px' }}>
                                <Col label={item.transportModeName} span={24} contentStyle={{ whiteSpace: 'normal' }}>
                                    <CheckboxGroup
                                        options={list && list[0] ? list[0].data : []}
                                        value={item.checkedArr}
                                        onChange={ckArr => this.changeTransportChild(ckArr, index)}
                                    />
                                </Col>
                            </Row>
                        )
                    })
                }
            </Modal>
        )
    }
}

export default TransModal