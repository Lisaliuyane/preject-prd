import React, { Component} from 'react'
import { Switch} from 'antd'

/**
 * 开关
 * 
 * @class GoodsInfo
 * @extends {Component}
 */
class SwitchBtn extends Component {

    state = {
        isCheck: true, //是否打开按钮
    }

    render() {
        let {
            isCheck
        } = this.state
        return (
            <div style={{width: 200}}>
                <span  style={{color: '#808080', verticalAlign: 'middle', ...this.props.style}}>{this.props.title}</span>
                &emsp;
                <Switch 
                    size="small"
                    defaultChecked 
                    onChange={checked => {
                        this.props.onChange(checked)
                    }} 
                />
            </div>
        )
    }
}
 
export default SwitchBtn;