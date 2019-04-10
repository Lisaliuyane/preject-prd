import React, { Component } from 'react';
// import logo from './logo.svg';
import RouterView from './router'
import * as mobxState from './store'
import { message, Modal } from 'antd'
import { observer, Provider } from "mobx-react"
import RequestApi from './http/config/request'
import { loadRaven } from '@src/libs/loadjs/raven.js'
import '@src/components/table_plugin/index.less'
import '@src/libs/css/ionicons.min.css'
import './App.less'
// import 'antd/dist/antd.less';import { Modal } from 'antd'
let { mobxBaseData } = mobxState
const confirm = Modal.confirm

// 初始化网络请求模块
const requestApi = new RequestApi(mobxBaseData)

for(let key in mobxState) {
    if (mobxState[key].setRequest) {
        mobxState[key].setRequest(requestApi)
    }
}

const getFuctionHavePower = (power) => {
    if (!power || !power.id || power.isShow || mobxBaseData.permissions[power.id]) {
        return true
    }
    return false
}


/**
 * mobx store (mobx状态管理)、网络请求模块 传入 props,
 * Raven javaScript error listen to sentry.io, palse look it result to  https://sentry.io/commatech/
 * @class App
 * @extends {Component}
 */
@observer
class App extends Component {

    constructor(props) {
        super(props)
        window.setMessage = this.getNewTokenMoal
        // console.log('componentDidMount', window.setMessage)
    }

    componentDidMount() {
        // if (window.Raven && process.env.NODE_ENV === 'production') {
        //     window.Raven.config('https://52b8ef94379842bc8a6ece6ff642be60@sentry.io/1029959', {
        //         release: '1.3.0',
        //         environment: process.env.NODE_ENV === 'production' ? 'pro' : 'dev'
        //     }).install()
        //     window.Raven.setUserContext({
        //         email: '1093967571@qq.com',
        //         id: 'frd'
        //     })
        // }
        let domHeight = document.body.offsetHeight
        let domWidth = document.body.offsetWidth
        mobxBaseData.setDomHeight(domHeight)
        mobxBaseData.setDomWidth(domWidth)
        // window.addEventListener('resize', this.windowResize)
        window.onresize = this.windowResize
        if (process.env.NODE_ENV === 'production') {
            loadRaven().then(Raven => {
                this.Raven = Raven
                Raven.config('https://52b8ef94379842bc8a6ece6ff642be60@sentry.io/1029959', {
                    release: '1.3.0',
                    environment: process.env.NODE_ENV === 'production' ? 'pro' : 'dev'
                }).install()
                Raven.setUserContext({
                    email: '1093967571@qq.com',
                })
            })
        }
    }

    componentWillUnmount() {
        clearTimeout(this.windowResizeTimer)
    }

    windowResize = (event) => {
        clearTimeout(this.windowResizeTimer)
        this.windowResizeTimer = setTimeout(() => {
            let domHeight = document.body.offsetHeight
            let domWidth = document.body.offsetWidth
            mobxBaseData.setDomHeight(domHeight)
            mobxBaseData.setDomWidth(domWidth)
        }, 200)
    }

    componentDidCatch(error, errorInfo) {
        // this.setState({ error });
        // this.mobxBaseData
        if (process.env.NODE_ENV === 'production') {
            if (this.Raven) {
                this.Raven.captureException(error, { extra: errorInfo, user:  mobxBaseData});
            }
        }
    }

    setMessage = (msg) => {
        message.warning(msg)
    }

    getNewTokenMoal = () => {
        // console.log('getNewTokenMoal')
        const rApi = requestApi
        return new Promise((resolve, reject) => {
            confirm({
                title: '登录失效',
                content: '点击确定重新连接，点击取消将注销登录进入登录页。',
                onOk() {
                    return new Promise((rve, rct) => {
                        rApi.refreshToken().then(res => {
                            // console.log('refreshToken')
                            rve()
                            resolve(res)
                        }).catch(e => {
                            console.log('refreshToken error', e)
                            rve()
                            reject(e)
                        })
                    })
                },
                onCancel() {
                    reject()
                }
            })
        })
    }

    render() {
        return (
            <Provider {...mobxState} rApi={requestApi} getFuctionHavePower={getFuctionHavePower}>
                <RouterView />
            </Provider>
        );
    }
}

export default App;
