import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from "mobx-react"

@inject('mobxBaseData')
@observer
class ModulesPower extends Component {

    static propTypes = {
        children: PropTypes.element.isRequired
    }

    state = {
        power: true
    }

    constructor(props) {
        super(props)
        const { info } = props
        if (info.id) {
            // todo 权限处理
        }
    }

    render() {
        // const { power } = this.state
        // const Children = this.props.children
        const { info, children, mobxBaseData } = this.props
        // console.log('this.props', info, mobxBaseData.permissions[info.id], mobxBaseData.permissions)
        // return children
        // if (process.env.NODE_ENV === 'development') {
        //     return children
        // }
        if (!info.id || mobxBaseData.permissions[info.id] || info.powerOther) {
            return children
        } else {
            return (
                <div style={{minHeight: this.props.minHeight}} className='flex flex-level-center flex-vertical-center'>
                    <h1>
                        没有该项权限, 如有疑问请联系管理员!
                    </h1>
                </div>
            )
        }
    }
}
 
export default ModulesPower;