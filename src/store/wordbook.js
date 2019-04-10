import { observable, action, runInAction, useStrict, extendObservable } from "mobx";
// import { resolve } from "path";
import update from 'immutability-helper';
import Parent from './parent'
import {booktypes1, booktypes2, booktypes3, booktypes4, booktypes5, booktypes6, booktypes7, booktypes8, booktypes9, allbooktypes} from './wordbooknav'
useStrict(true)

let loadtime = {}

export default class WordBook extends Parent {

    rApiUrl = {
        BOOKS: {
            url: 'getWordBooks',
            variable: 'wordbooks'
        },
        BOOKS1: {
            url: 'getDictionaryByTypeAndStatus',
            variable: 'wordbooks'
        },
        AREAS: {
            url: 'getAreas',
            variable: 'areas',
            key: 'areas'
        },
        LEGALPERSONS: {
            url: 'getLegalPersons',
            variable: 'legalpersons',
            key: 'legalpersons',
            limit: 10000,
            offset: 0
        }
    }

    setRApied() {
        // this.setSelectType(this.types[0].children[0].key)
    }

    constructor(props) {
        super(props)
        this.types = [
            {
                text: '业务相关',
                children: booktypes1
            },
            {
                text: '车辆相关',
                children: booktypes2
            },
            {
                text: '结算相关',
                children: booktypes3
            }, 
            {
                text: '异常相关',
                children: booktypes4
            },
            {
                text: '单位相关',
                children: booktypes5
            },
            {
                text: '标签相关',
                children: booktypes6
            },
            {
                text: '用户相关',
                children: booktypes7
            },
            {
                text: '仓库相关',
                children: booktypes9
            },
            {
                text: '其他',
                children: booktypes8
            }
        ]
        this.wordbooks = {} // 数据字典

        this.areas = [] // 区域

        this.provinces = [] // 省

        this.legalpersons = [] // 区域

        this.loading = {}
        this.loadone = {}

        this.selectArea = {
            loading: false
        }
    }
    /*-satrt---加载状态---satrt-*/
    @observable loading; // loading
    @observable loadone; // loadone
    /*-end---加载状态---end-*/

    /*-satrt---数据字典---satrt-*/
    @observable types; // 基础数据类型
    @observable selectType; // 基础数据类型
    @observable wordbooks; // 访问token
    /*-end---数据字典---end-*/
    
    /*-satrt---数据字典---satrt-*/
    @observable areas; // 区域数组
    @observable selectArea; // selectArea 区域
    @observable selectProvince; // 省
    @observable selectCity; // 市
    @observable selectCounty; // 县
    @observable selectStreet; // 街道

    @observable legalpersons;

    @observable provinces;

    @action setSelectType(type) {
        this.selectType = type
        this.initBooks({id: type}, true)
    }
    

    @action clearLoading() {
        this.loading = {}
    }

    getSelectType() {
        let type = this.selectType
        
        let item = allbooktypes.filter(item => {
            return item.key === type
        })
        return item[0] ? item[0] : {text: '无'}
    }

    /**
     * param
     * {id: 0}
     * {key：...}
     * {text： ...}
     * 
     * @memberOf WordBook
     */
    getBookType(param) {
        let items = allbooktypes.filter(item => {
            for (let key in param) {
                if (param[key] === item[key] || param[key] === item[key].toString()) {
                    return true
                }
            }
            return false
        })
        return items && items[0] ? items[0] : null
    }

    @action refreshWordBookData() {
        this.wordbooks = {} // 数据字典
    }

    @action initBooks(data, type) {
        data = this.getBookType(data)
        // if (!data) {
        //     return new Promise((resolve, reject) => {
        //         reject('none data')
        //     }) 
        // }
        // if (!this.wordbooks[data.key]) this.wordbooks[data.key] = []
        // if (this.wordbooks[data.key].length < 1 || (loadtime[data.key] && (loadtime[data.key] - new Date().getTime()) > (10 * 60 * 1000))) {
        //     return this.getBooks(data)
        // } else {
        //     return new Promise((resolve, reject) => {
        //         resolve(this.wordbooks[data.key])
        //     })
        // }
        if (!data) {
            return new Promise((resolve, reject) => {
                reject('none data')
            }) 
        }
        return this.getBooks(data, type)
    }

    /**
     * 获取数据字典数据
     * 
     * @param {any} data 
     * @returns 
     * 
     * @memberOf WordBook
     */
    @action getBooks(data, type) {
        // console.log('getBooks', data, type)
        if (type) {
            data = {...data, ...this.rApiUrl.BOOKS}
        } else {
            data = {...data, ...this.rApiUrl.BOOKS1}
        }
        return this.getData(data)
    }

    /**
     * 添加数据字典添加
     * 
     * @param {any} item 
     * 
     * @memberOf WordBook
     */
    @action addBook(item, type) {
        type = this.getBookType({id: type}).key
        let arry = this.wordbooks[type].slice()
        let typedata = this.getBookType({key: type})
        this.loading = extendObservable(this.loading, {[type]: true})
        const req = this.rApi.addBook({...item, type: typedata.id})
        req.then(res => {
            runInAction(() => {
                item = {...item, ...res}
                arry.push(item)
                this.wordbooks[type] = arry
                this.loading[type] = false
            })
        })
        return req
    }

    @action delBook(item, type) {
        // type = type || this.selectType
        type = this.getBookType({id: type}).key
        let index = item.index
        let arry = this.wordbooks[type].slice()
        this.loading[type] = true
        return this.rApi.setBookStatus({...item, status: item.status === 1 ? 0 : 1}).then(res => {
            runInAction(() => {
                arry[index] = item
                arry[index].status = arry[index].status ? 0 : 1
                this.wordbooks[type] = arry
                this.loading[type] = false
            })
        }).catch(e => {
            runInAction(() => {
                this.loading[type] = false
            })
        })
        
    }

    @action editBook(item, type) {
        type = this.getBookType({id: type}).key
        let typedata = this.getBookType({key: type})
        let index = item.index
        delete item.index
        let arry = this.wordbooks[type].slice()
        this.loading = extendObservable(this.loading, {[type]: true})
        return this.rApi.editBook({...item, type: typedata.id}).then(res => {
            runInAction(() => {
                arry[index] = item
                this.wordbooks[type] = arry
                this.loading[type] = false
            })
        }).catch(e => {
            runInAction(() => {
                this.loading[type] = false
            })
        })
    }

    @action updateBooks(n, type) {
        type = type || this.selectType
        let arry = this.wordbooks[type].slice()
        this.wordbooks[type] = update(arry, {
            $splice: n,
        })
        this.loading[type] = true
        this.loading[type] = false
    }

    @action getAreas(data) {
        data = {...data, ...this.rApiUrl.AREAS}
        return this.getData(data)
    }

    @action refreshLegalPersons() {
        this.legalpersons = []
    }

    @action initLegalPersons(data) {
        if (this.legalpersons.length < 1) {
            this.getLegalPersons(data)
        }
    }

    @action getLegalPersons(data) {
        data = {...data, ...this.rApiUrl.LEGALPERSONS}
        return this.getData(data)
    }

    @action createLegalPersons(d) {
        return this.rApi.createLegalPersons(d).then(res => {
            d = Object.assign({}, d, res)
            runInAction(() => {
                this.legalpersons.push(d)
            })
        })
    }

    @action deleteLegalPersons(d, index) {
        return this.rApi.deleteLegalPersons(d).then(res => {
            runInAction(() => {
                let legalpersons = this.legalpersons
                legalpersons.splice(index, 1)
                this.legalpersons = legalpersons
            })
        })
    }
    
    @action editLegalPersons(d, index) {
        let legalpersons = this.legalpersons
        return this.rApi.editLegalPersons(d).then(res => {
            runInAction(() => {
                legalpersons[index] = d
                this.legalpersons = legalpersons
            })
        })
    }

    /**
     * 获取数据
     * 
     * @param {any} data 
     * 
     * @memberOf AppState
     */
    @action getData(data) {
        this.loading = extendObservable(this.loading, {[data.key]: true})
        return new Promise((resolve, reject) => {
            // let original = this[data.variable][data.key]
            this.rApi[data.url](data).then(res => {
                loadtime[data.key] = new Date().getTime()
                runInAction(() => {
                    let isVarKey = false
                    for (let key in this.rApiUrl) {
                        if (this.rApiUrl[key].key && this.rApiUrl[key].key === data.key) {
                            this[data.variable] = res
                            isVarKey = true
                            break
                        }
                    }
                    if (!isVarKey) {
                        this[data.variable][data.key] = res
                        // console.log('this[data.variable][data.key]', this[data.variable], res)
                    }
                    this.loading[data.key] = false
                })
                resolve(res)
            }).catch(e => {
                runInAction(() => {
                    this.loading[data.key] = false
                })
                reject(e)
            })
        })
    }

    /**
     * 设置选择区域，获取省数据
     * 
     * @param {any} area 
     * @returns 
     * 
     * @memberOf WordBook
     */
    @action setActiveArea(area) {
        this.selectArea = area
        this.selectArea = extendObservable(this.selectArea, {loading: true})
        return new Promise((resolve, reject) => {
            this.rApi.getOwnProvinces({code: area.id}).then(provinces => {
                provinces.ownDistrict.forEach(element => {
                    element.isChecked = true
                })
                runInAction(() => {
                    this.selectArea.provinces = provinces
                    this.selectArea.iAreaProvinces = [...provinces.ownDistrict]
                    this.selectArea.loading = false
                })
            }).catch(e => {
                runInAction(() => {
                    this.selectArea.loading = false
                })
            })
        })
    }

    @action changeAreaProvinces(arry) {
        let area = this.selectArea
        let ownDistrict = []
        let noSelectedDistric = []
        arry.forEach((ele, index) => {
            if (ele.isChecked) {
                ownDistrict.push(ele)
            } else {
                noSelectedDistric.push(ele)
            }
        })
        ownDistrict = [...ownDistrict]
        noSelectedDistric = [...noSelectedDistric]
        let codes = ''
        ownDistrict.forEach((ele, index) => {
            if (index > 0) {
                codes += ','
                codes += ele.code
            } else {
                codes += ele.code
            }
        })
        this.selectArea = extendObservable(this.selectArea, {loading: true})
        return this.rApi.bindArea({areaId: area.id, codeIds: codes}).then(() => {
            runInAction(() => {
                this.selectArea.loading = false
                this.selectArea.provinces.noSelectedDistric = [...noSelectedDistric]
                this.selectArea.provinces.ownDistrict = [...ownDistrict]
                this.selectArea.iAreaProvinces = [...ownDistrict]
            })
        }).catch(error => {
            runInAction(() => {
                this.selectArea.loading = false
            })
        })
    }

    @action addArea(params) {
        return this.rApi.addArea(params).then(d => {
            runInAction(() => {
                this.areas.push({name: params.name, id: d.id})
            })
        })
    }
    
    @action deleteArea(params) {
        return this.rApi.deleteArea(params).then(d => {
            runInAction(() => {
                let arry = this.areas.slice()
                arry.splice(params.index, 1)
                this.areas = arry
            })
        })
    }

    @action editArea(params) {
        return this.rApi.editArea(params).then(d => {
            runInAction(() => {
                let arry = this.areas.slice()
                arry[params.index] = params
                this.areas = arry
            })
        })
    }

    /**
     * 设置选择省，获取市数据
     * 
     * @param {any} area 
     * @returns 
     * 
     * @memberOf WordBook
     */
    @action getProvinces() {
        return new Promise((resolve, reject) => {
            if (this.provinces.length > 0) {
                resolve(this.provinces)
                return
            }
            this.rApi.getProvinces().then(provinces => {
                this.provinces = provinces
                resolve(provinces)
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * 设置选择市，获取县数据
     * 
     * @param {any} city 
     * @returns 
     * 
     * @memberOf WordBook
     */
    @action setActiveCity(city) {
        this.selectCity = city
        this.selectCity.loading = true
        return new Promise((resolve, reject) => {
            this.rApi.getCountys().then(citys => {
                this.selectCity.children = citys
                this.selectCity.loading = false
                resolve(citys)
            }).catch(e => {
                this.selectCity.loading = false
                reject(e)
            })
        })
    }

    /**
     * 设置选择县，获取街道数据
     * 
     * @param {any} province selectCounty
     * @returns 
     * 
     * @memberOf WordBook
     */
    @action setActiveCounty(county) {
        this.selectCounty = county
        this.selectCounty.loading = true
        return new Promise((resolve, reject) => {
            this.rApi.getStreets().then(countys => {
                this.selectCounty.children = countys
                this.selectCounty.loading = false
                resolve(countys)
            }).catch(e => {
                this.selectCounty.loading = false
                reject(e)
            })
        })
    }
}
