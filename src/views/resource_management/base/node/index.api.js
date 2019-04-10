import Api from '@src/http/api'
import { children, id } from './power'
import { deleteNull } from '@src/utils'
const power = {
    ...children, 
    ...{[id.id]: id}
}
const moduleName = 'resource/'

export default class NodeApi extends Api {
    
    /**
     * 获取节点列表数据
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf NodeApi
     */
    [power[id.id].apiName](params) {
        let url = power[id.id].url
        return new Promise((resolve, reject) => {
            this.POST(url, deleteNull(params)).then((d) => {
                if (d.records) {
                    d.records.forEach(element => {
                        try {
                            if (element.address) {
                                element.address = JSON.parse(element.address)
                            }
                        } catch (e) {
                            console.error(power[id.id].apiName, e)
                        }
                    })
                }
                resolve(d)
            }).catch(e => {
                reject(e)
            })
        })
    }

    [children.DEL_DATA.apiName](params) {
        let url = children.DEL_DATA.url
        return this.POST(url, params)
    }

    [children.ADD_DATA.apiName](params) {
        let url = children.ADD_DATA.url
        return this.POST(url, params)
    }

    // [children.GET_NODE.apiName](params) {
    //     let url = children.GET_NODE.url
    //     return this[children.GET_NODE.method](url, params)
    // }

    getNode(params) {
        return this.GET(`${moduleName}node/page/data`, params)
    }

    [children.EDIT_DATA.apiName](params) {
        let url = children.EDIT_DATA.url + '/' + params.id
        return this.POST(url, params)
    }

    [children.EXPORT_LIST.apiName](params) { // 导出表数据
        let url = children.EXPORT_LIST.url
        return this.POSTFILE(url, deleteNull(params))
    }

    [children.EXPORT_TEMP.apiName](params) { //导出中转地模板
        let url = children.EXPORT_TEMP.url
        return this.GETFILE(url, deleteNull(params))
    }

    [children.IMPORT_NODE.apiName](params) { //导入
        let url = children.IMPORT_NODE.url
        return this.POST(url, deleteNull(params))
    }
}