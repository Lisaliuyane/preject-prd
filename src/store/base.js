import { observable, action } from "mobx";
// import axios from "axios";
import Parent from './parent'

import config from '@src/config/http.header'

export default class AppState extends Parent {

    constructor(props) {
        super(props)
        this.isLogin = false;
        this.isLoadAuthData = false;
        this.accessToken = null;
        this.navs = []
        this.permissions = {}
        this.username = ''
        this.id = null
        this.domHeight = 0
        this.domWidth = 0
        this.siderWidth = 220
        this.pageWidth = 400
        this.tableHeight = 600 //主页表格高度
    }
    
    /*-satrt---登陆模组---satrt-*/
    @observable isLogin; // type: Boolean, function: 是否处于登录状态
    @observable accessToken; // 访问token
    @observable isLoadAuthData; // 
    @observable navs; // 
    @observable permissions; // 
    @observable username; // 
    @observable domHeight; // body 高
    @observable domWidth; // body 宽
    @observable siderWidth; // 左导航宽
    @observable pageWidth; // body 宽
    @observable tableHeight; // 主页表格高度


    /**
     * 设置dom body 宽
     * 
     * 
     * @memberOf AppState
     */
    @action setDomWidth(w) {
        this.domWidth = w
        this.setPageWidth()
    }

    /**
     * 设置dom body 高
     * 
     * 
     * @memberOf AppState
     */
    @action setDomHeight(h) {
        this.domHeight = h + 10
        this.setTableHeight()
    }

    @action setSiderWidth(width) {
        this.siderWidth = width
        this.setPageWidth()
    }

    @action setPageWidth() {
        this.pageWidth = this.domWidth - this.siderWidth
    }

    @action setTableHeight(h) {
        this.tableHeight = this.domHeight - 262 - 45
    }

    @action loopNavs(element) {
        if (element.code) {
            this.permissions[element.code] = element
        }
        if (element.children && element.children.length > 0) {
            element.children.forEach(ele => {
                this.loopNavs(ele)
            })
        }
    }

    navsToPermissions(navs) {
        if (!navs) return
        navs.forEach(element => {
            this.loopNavs(element)
        })
    }

    /**
     * 设置用户信息
     * 
     * @memberOf AppState
     */
    @action setUserInfo() {
        
    }

    /**
     * 设置用户信息
     * 
     * @memberOf AppState
     */
    @action setSystemInfo(res) {
        //console.log('setSystemInfo', res.data)
        let data = res
        if (data.platformName) {
            localStorage.setItem('platformName', data.platformName)
        }
        if (data.logo) {
            localStorage.setItem('logo', data.logo)
        }
    }

    /**
     * 设置登录状态及其token
     * 
     * @param {any} data 
     * 
     * @memberOf AppState
     */
    @action setLogin(data) {
        // console.log('setLogin', this.isLogin, data)
        this.isLogin = true
        this.navs = data.permissions || null
        this.navsToPermissions(this.navs)
        this.accessToken = data.access_token || data.accessToken;
        this.username = data.username
        this.id = data.id

        if (data.accessToken) {
            localStorage.setItem('accessToken', this.accessToken)
        }
        if (data.username) {
            localStorage.setItem('username', data.username)
        }
        if (data.organizationName) {
            localStorage.setItem('organizationName', data.organizationName)
        }
        if (this.navs) {
            localStorage.setItem('navs', JSON.stringify(this.navs))
        }

        if (data.refresh_token) {
            localStorage.setItem('refreshToken', data.refresh_token)
            /** 登录获取token时间*/
            localStorage.setItem('getTokenTime', new Date().getTime() / 1000)
        }
        if (data.expires_in) {
            localStorage.setItem('expiresIn', data.expires_in)
        }
        if (data.id) { //id
            localStorage.setItem('id', data.id)
        }
        this.getLocationLoginStatus()
    }

    /**
     * 注销登录
     * 
     * @param {any} status 
     * 
     * @memberOf AppState
     */
    @action loginOut() {
        // console.log('loginOut', status)
        if (config.login) {
            return
        }
        this.isLogin = false
        this.accessToken = null
        this.navs = []
        this.permissions = {}
        localStorage.removeItem('accessToken')
        localStorage.removeItem('getTokenTime')
        localStorage.removeItem('expiresIn')
        localStorage.removeItem('username')
        localStorage.removeItem('platformName')
        localStorage.removeItem('logo')
        localStorage.removeItem('organizationName')
        localStorage.removeItem('id')
    }
    /*-end---登陆模组---end-*/

    @action clearToken() {
        this.accessToken = null
        localStorage.removeItem('accessToken')
    }

    @action getLocationLoginStatus() {
        return new Promise((resolve, reject) => {
            let accessToken = localStorage.getItem('accessToken')
            let navs = localStorage.getItem('navs')
            let username = localStorage.getItem('username')
            let getTokenTime = parseInt(localStorage.getItem('getTokenTime'), 10)
            let expiresIn = parseInt(localStorage.getItem('expiresIn'), 10)
            let nowTime = parseInt(new Date().getTime() / 1000, 10)
            let timeDifference = nowTime - getTokenTime
            try {
                clearTimeout(this.outlook)
                if (this.isLogin) {
                    this.outlook = setTimeout(() => {
                        if (window && window.setMessage) {
                            window.setMessage('登录失效请重新登录！').then((res) => {
                                // console.log('登录失效请重新登录！', res)
                                this.getLocationLoginStatus()
                                this.setLogin(res)
                                resolve(true)
                            }).catch(() => {
                                this.loginOut()
                                reject()
                            })
                        } else {
                            this.loginOut()
                            reject()
                        }
                    }, (expiresIn - timeDifference) * 1000)
                    // (expiresIn - timeDifference) * 1000
                    // return
                }
            } catch (e) {
            }
            if (this.isLogin) {
                resolve(true)
                return
            }
            // let accessToken = localStorage.getItem('accessToken')
            // let navs = localStorage.getItem('navs')
            // let username = localStorage.getItem('username')
            try {
                navs = JSON.parse(navs)
            } catch(e) {}
            // if (config.login) {
            //     this.setLogin({accessToken: config.token, permissions: navs, username: username})
            //     resolve(true)
            //     return
            // }
            if (accessToken && getTokenTime && expiresIn && timeDifference < expiresIn) {
                this.setLogin({accessToken: accessToken, permissions: navs, username: username})
            } else {
                this.loginOut()
            }
            if (!this.isLogin) {
                reject('nologin')
                return
            }
           
            setTimeout(() => {
                resolve(true)
            }, 10)
        })
    }

    @observable power;

    // async fetchData(pathname, id) {
    //     let { data } = await axios.get(
    //         `https://jsonplaceholder.typicode.com${pathname}`
    //     );
    //     console.log(data);
    //     data.length > 0 ? this.setData(data) : this.setSingle(data);
    // }
    
    @action setData(data) {
        this.items = data;
    }

    @action setSingle(data) {
        this.item = data;
    }

    @action clearItems() {
        this.items = [];
        this.item = {};
    }

    @action authenticate() {
        return new Promise((resolve, reject) => {
            this.authenticating = true;
            setTimeout(() => {
                this.authenticated = !this.authenticated;
                this.authenticating = false;
                resolve(this.authenticated);
            }, 0)
        })
    }

    // 更改左侧导航栏状态
    // @action changeNavMode (modeType) {
    //     this.navMode = modeType
    // }

    isHaveAuth(viewId) {
        return this.permissions[viewId] ? true : false
    }
}