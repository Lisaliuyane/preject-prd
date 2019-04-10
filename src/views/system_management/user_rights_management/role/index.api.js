import Api from '@src/http/api'
import { children, id } from './power'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}
const moduleName = 'account/'

export default class RoleApi extends Api {
    
    /**
     * 获取角色列表数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf RoleApi
     */
    // [children.GET_LIST.apiName](params) {
    //     let url = children.GET_LIST.url
    //     return this.POST(url, params)
    // }

    [power[id.id].apiName](params) {
        let url = power[id.id].url
        return this.POST(url, deleteNull(params))
    }

    [children.DEL_DATA.apiName](params) {
        let url = children.DEL_DATA.url
        return this.SPOST(url, params.map(item => {return {id: item}})[0])
    }

    [children.ADD_DATA.apiName](params) {
        let url = children.ADD_DATA.url
        return this.POST(url, params)
    }

    [children.EDIT_DATA.apiName](params) {
        let url = children.EDIT_DATA.url
        return this.POST(url, params)
    }

    [children.ROLE_GRANT.apiName](params) {
        let url = children.ROLE_GRANT.url
        return this.POST(url, params)
    }

    // [children.GET_PERMISSION.apiName](params) {
    //     let url = children.GET_PERMISSION.url + '?roleid=' + params.roleid
    //     return this.GET(url, params)
    // }
    getRolePermission(params) { //获取角色权限列表
        return this.GET(`${moduleName}role/permission/list?roleid=${params.roleid}`, params)
    }
}