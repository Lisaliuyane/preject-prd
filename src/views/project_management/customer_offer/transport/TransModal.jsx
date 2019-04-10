import React, { Component, Fragment} from 'react'
import { Modal, Button, Checkbox } from 'antd'
import { Row, Col } from '@src/components/grid'

const CheckboxGroup = Checkbox.Group

class TransModal extends Component {

    /* 自定义底部 */
    cusFooter = () => {
        const { saveTransport, closeTransport} = this.props
        return(
            <Fragment>
                <Button onClick={saveTransport}>保存</Button>
                <Button onClick={closeTransport}>取消</Button>
            </Fragment>
        )
    }

    render () {
        const {
            parentDom,
            transModalVisible,
            transportTypeList,
            checkedTransport,
            changeTransport,
            changeTransportChild
        } = this.props
        return (
            <Modal
                getContainer={() => parentDom}
                visible={transModalVisible}
                footer={this.cusFooter()}
                closable={false}
                centered={true}
                wrapClassName='modal-trans'
            >
                <Row>
                    <Col><span style={{ fontWeight: 600 }}>运输方式</span></Col>
                </Row>
                <CheckboxGroup 
                    options={transportTypeList}
                    value={checkedTransport}
                    onChange={changeTransport} 
                    style={{margin: '20px auto'}}
                />
                {
                    transportTypeList.map((item, index) => {
                        if (checkedTransport.some(id => parseInt(item.value, 10) === parseInt(id, 10))) {
                            return (
                                <Row gutter={24} style={{ background: '#f7f7f7', margin: '8px auto', padding: '0 10px' }} key={item.key}>
                                    <Col label={item.label} span={24} contentStyle={{ whiteSpace: 'normal' }}>
                                        <CheckboxGroup
                                            options={item.data}
                                            value={item.checkedArr}
                                            onChange={ckArr => changeTransportChild(ckArr, index)}
                                        />
                                    </Col>
                                </Row>
                            )
                        } else {
                            return <span key={item.key}></span>
                        }
                    })
                }
            </Modal>
        )
    }
}

export default TransModal