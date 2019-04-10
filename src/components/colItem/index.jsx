import React, { Component } from 'react'
import { Col} from 'antd'
import { inject } from "mobx-react"
import './index.less'
class ColItem extends Component {

    state = {
    }
    constructor(props) {
        super(props);
    }

    render() { 
        let props = this.props
        console.log('type', props.type)
        const style = props.type === 2 ? {padding: '5px 0px', fontSize: '14px'} : {padding: '5px 0px'}
        return (
            <Col offset={props.offset} span={props.span}>
                <div className='flex flex-vertical-center' style={style}>
                    <div>
                        {
                            props.isRequired ?
                            <span style={{position: 'relative'}}>
                                <i style={{color: 'red', fontWeight: 'bold', position: 'absolute', left: -8}}>*</i>
                            </span>
                            :
                            null
                        }
                        <span style={{color: '#333'}}>{props.label ? `${props.label}：` : ''}</span> 
                    </div>
                    <div className='flex1'>
                        {
                            //props.children
                            props.type === 2 ? <span style={{color: '#999'}}>{props.text}</span> : props.children
                        }
                    </div>
                </div>
            </Col>
        )
    }
}
 
export default ColItem;