// import Loadable from 'react-loadable'
import React, { Component } from 'react'
import { inject } from 'mobx-react'

/**
 * 模块加载器
 * 
 * @export
 * @class Loading
 * @extends {Component}
 */
@inject('mobxTabsData')
export default class Loading extends Component {

    state={
        loadCount: 0
    }

    reloadComponent = () => {
        this.setState({loadCount: 1})
    }

    reload = () => {
        // loader
        const props = this.props
        // console.log('props.loadable', props.loadable)
        try {
            props.loadable.prototype.reloadComponent()
        } catch (e) {
        }
        // console.log('props', props)
        props.mobxTabsData.refresh(props.index)
    }

    render() {
        const props = this.props
        // const { loadCount } = this.state
        // console.log('props', props)
        if (props.error) {
            // console.log('props.error', props, props.error)
            // if (!loadCount) {
            //     this.reloadCompont()
            // }
            return (
                <div onClick={this.reload}>
                    模块加载错误!
                </div>
            )
        } else if (props.pastDelay) {
            return <div>Loading...</div>;
        } else if (props.timedOut) {
            return <div>模块加载超时！</div>;
        } else {
            return null;
        }
    }
}