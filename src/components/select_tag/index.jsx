import React, { Component } from 'react'
import PropTypes from 'prop-types'
class SelectTag extends Component {
    state = {}
    constructor(props) {
        super(props);
    }
    render() { 
        return (
            <div>
            </div>
        )
    }
}
SelectTag.PropTypes = {
    pattern: PropTypes.number.isRequired // 组件模式

}
 
export default SelectTag;