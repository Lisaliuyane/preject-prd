import React, { Component } from 'react'
import PropTypes from 'prop-types' 
class TableTitle extends Component {

    static propTypes = {
        title: PropTypes.string,
    }

    static defaultProps = {
        title: ''
    }

    state = {}
    render() { 
        let { title, children } = this.props
        return (
            <div className="flex flex-vertical-center">
                <div style={{paddingLeft: 5}}>
                    {title}
                </div>
                <div className="flex1" style={{textAlign: 'right', paddingRight: 5}}>
                    {
                        children
                    }
                </div>
            </div>
        )
    }
}
 
export default TableTitle;