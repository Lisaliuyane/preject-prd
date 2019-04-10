
import { md5hash } from '../utils/hash'
// import { getNavs } from '../mock/sider'
let mName1 = 'common/'
let mName2 = 'resource/'

export default class PublicApi {
    constructor(props) {
        // const list = Object.getOwnPropertyNames(Object.getPrototypeOf(props))
        const list1 = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
        // console.log('list', list1)
        // for (let name of list) {
        //     if (name !== 'constructor')
        //     this[name] = props[name]
        // }
        for (let name of list1) {
            if (name !== 'constructor') {
                props[name] = this[name]
            }
        }
    }

    /** 
     * 获取系统信息
    */
    getSystemInformation() {
        return new Promise((resolve, reject) => {
            // let username = params.username
            // let password = md5hash(params.password)
            // let username = 'test@smartcomma.com'
            // let password = md5hash('123456')

            this.GET('/account/company/info').then(res => {
                resolve(res)
            }).catch(function(error) {
                reject(error)
            })
        })
    }
    /**
     * 获取登录 token
     * 
     * @param {any} params 
     * @returns 
     */
    getAccessToken(params) {
        // 身份验证接口
        return new Promise((resolve, reject) => {
            // let username = params.username
            // let password = md5hash(params.password)
            // let username = 'test@smartcomma.com'
            // let password = md5hash('123456')
            if (!params.password) {
                reject('no password')
            }
            params.password = md5hash(params.password)
            this.SPOST('/oauth/token', {
                grant_type: 'password',
                ...params
            }).then(token => {
                localStorage.setItem('accessToken', token.access_token)
                token.accessToken = token.access_token
                resolve(token)
            }).catch(function(error) {
                reject(error)
            })
        })
    }

    /**
     * 刷新token
     * 
     * @param {any} params 
     * @returns 
     * 
     * @memberOf PublicApi
     */
    refreshToken() {
        return new Promise((resolve, reject) => {
            // let username = params.username
            // let password = md5hash(params.password)
            // let username = 'test@smartcomma.com'
            // let password = md5hash('123456')
            this.SPOST('/oauth/token', {
                grant_type: 'refresh_token',
                refreshToken: true,
                refresh_token: localStorage.getItem('refreshToken')
            }).then(token => {
                localStorage.setItem('accessToken', token.access_token)
                token.accessToken = token.access_token
                resolve(token)
            }).catch(function(error) {
                reject(error)
            })
        })
    }

    getWordBooks(params) {
        return this.GET(`${mName1}dictionary/${params.id}`)
    }

    getDataBooks(params) {
        return this.GET(`${mName1}dictionary/getDictionaryByTypeAndStatus/${params.id}`)
    }

    getDictionaryByTypeAndStatus(params) {
        return this.GET(`${mName1}dictionary/getDictionaryByTypeAndStatus/${params.id}`)
    }

    addBook(params) {
        return this.POST(`${mName1}dictionary/add`, params)
    }

    // delBook(params) {
    //     return this.GET(`${mName1}dictionary/delete/${params.id}`)
    // }

    setBookStatus(params) {
        return this.GET(`${mName1}dictionary/updateStatus/${params.id}?status=${params.status}`)
    }

    editBook(params) {
        return this.POST(`${mName1}dictionary/save`, params)
    }

    getLegalPersons(params) {
        return this.POST(`${mName1}faren/getFarens`, params)
    }

    createLegalPersons(params) {
        return this.POST(`${mName1}faren/add`, params)
    }

    editLegalPersons(params) {
        return this.POST(`${mName1}faren/save`, params)
    }

    deleteLegalPersons(params) {
        return this.GET(`${mName1}faren/delete/${params.id}`)
    }

    getAreas(params) {
        return this.POST(`${mName1}area/getAreas`, params)
    }

    deleteArea(params) {
        return this.GET(`${mName1}area/delete/${params.id}`)
    }

    addArea(params) {
        return this.POST(`${mName1}area/add`, params)
    }

    editArea(params) {
        return this.POST(`${mName1}area/save`, params)
    }

    bindArea(params) {
        return this.POST(`${mName1}district/bindArea`, params)
    }

    getOwnProvinces(params) {
        return this.GET(`${mName1}district/getOwnProvince/${params.id}`)
    }

    getProvinces() {
        return this.GET(`${mName1}district/getAllProvinces`)
    }

    getCitys(params) {
        return this.GET(`${mName1}district/getCitiesByProvinceCode/${params.id}`)
    }

    getCountys(params) {
        return this.GET(`${mName1}district/getAreasByCityCode/${params.id}`)
    }

    getStreets(params) {
        return this.GET(`${mName1}district/getStreetsByAreaCode/${params.id}`)
    }

    getAreaByAddress(params) {
        return this.GET(`${mName1}faren/getAreaByAddress/${params.id}`)
    }

    getAreaByProvince(params) { //根据省份获取片区名称
        return this.GET(`${mName1}district/getAreaByProvince/${params.proName}`)
    }

    getCarPageData() {
        return this.GET(`${mName2}car/page/data`)
    }

    downQuotationTemp(params) {
        return this.GETFILE(`${mName2}carrierQuotation/downQuotationTemp` + params)
        // return this.GET(`http://192.168.2.242:8084/resource/carrierQuotation/downQuotationTemp?showFields=[%22%E8%B5%B7%E8%BF%90%E5%9C%B0%22,%22%E7%9B%AE%E7%9A%84%E5%9C%B0%22,%22%E6%97%B6%E6%95%88%22,%22%E6%98%AF%E5%90%A6%E9%AB%98%E9%80%9F%22]`)
    }

    exportQuotationTemp(params) {
        //  return this.GETFILE(`${mName2}carrierQuotation/exportData` + params)
        // console.log('exportQuotationTemp', params)
        return this.GETFILE(params)
        // return this.GET(`http://192.168.2.242:8084/resource/carrierQuotation/downQuotationTemp?showFields=[%22%E8%B5%B7%E8%BF%90%E5%9C%B0%22,%22%E7%9B%AE%E7%9A%84%E5%9C%B0%22,%22%E6%97%B6%E6%95%88%22,%22%E6%98%AF%E5%90%A6%E9%AB%98%E9%80%9F%22]`)
    }
}