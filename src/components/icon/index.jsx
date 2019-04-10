import React, {Component} from 'react'
export default class Icon extends Component {
    render() {
        let { style, type, className } = this.props
        return (
            <i style={style} className={(className ? className : '') + ' ' + type}></i>
        )
    }
}