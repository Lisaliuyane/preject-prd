import React, { Component} from 'react'
import { Row, Col } from '@src/components/grid'
import {Input} from 'antd'
import PropTypes from 'prop-types'

const { TextArea } = Input

export default class TextAreaBox extends Component{

    static propTypes = {
        onChange: PropTypes.func.isRequired, //将值=>父组件
		labelText: PropTypes.string, // label
        defaultValue: PropTypes.string, // 默认值
        placeholderText: PropTypes.string, // 提示
        type: PropTypes.number.isRequired, // 1-编辑  2-查看 3-新建
        colon: PropTypes.bool, //去掉：默认有
        disabled: PropTypes.bool, //是否禁用 /默认否
        span: PropTypes.number //长度 默认18
    }

    render() {
        let { 
            labelText,
            defaultValue, 
            onChange, 
            type, 
            placeholderText,
            colon,
            disabled,
            span
        } = this.props
        return(
            <Row gutter={24} type={type}>
                <Col 
                    label={labelText || '备注信息'}
                    colon={colon ? colon : false}
                    span={span ? span : 18} 
                    text={defaultValue} 
                    className='text-overflow-ellipsis' 
                    isWrap
                    labelInTop
                >
                    <TextArea 
                        defaultValue={defaultValue}
                        //value={remark ? remark : ''}
                        title={defaultValue}
                        placeholder={placeholderText || ''}
                        onChange={e => { onChange( e.target.value)}}
                        autosize={{ minRows: 2, maxRows: 5 }}
                        disabled={disabled}
                    />
                </Col>
            </Row>
        )
    }
}