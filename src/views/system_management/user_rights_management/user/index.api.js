import Api from '@src/http/api'
import { children, id } from './power'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}
const moduleName = 'account/'

export default class UserApi extends Api {
    
    /**
     * 获取用户列表数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf UserApi
     */
    // [children.GET_LIST.apiName](params) {
    //     let url = children.GET_LIST.url
    //     return this.POST(url, params)
    // }

    [power[id.id].apiName](params) {
        let url = power[id.id].url
        return this.POST(url, params)
    }
    
    [children.DEL_DATA.apiName](params) {
        let url = children.DEL_DATA.url
        return this.POST(url, {ids: params})
    }

    [children.ADD_DATA.apiName](params) {
        let url = children.ADD_DATA.url
        return this.POST(url, params)
    }

    [children.EDIT_DATA.apiName](params) {
        let url = children.EDIT_DATA.url
        return this.POST(url, params)
    }

    [children.PASSWORD_RESET.apiName](params) {
        let url = children.PASSWORD_RESET.url
        return this.SPOST(url, params)
    }

    [children.ACCOUNT_AUTHORIZE.apiName](params) {
        let url = children.ACCOUNT_AUTHORIZE.url
        return this.POST(url, params)
    }

    // [children.PERMISSION_LIST.apiName](params) {
    //     let url = children.PERMISSION_LIST.url
    //     return this.GET(url, params)
    // }

    // [children.USER_PERMISSION_LIST.apiName](params) {
    //     let url = children.USER_PERMISSION_LIST.url + '?id=' + params.id
    //     return this.GET(url, params)
    // }

    getPermission(params) { //获取权限列表
        return this.GET(`${moduleName}permission/list`, params)
    }

    getUserPermission(params) { //获取用户权限列表(角色和权限)
        return this.GET(`${moduleName}permission/account/list?id=${params.id}`, params)
    }
}