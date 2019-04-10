import { observable, action } from "mobx";
// import axios from "axios";
import Parent from './parent'
import { allbooktypes } from './wordbooknav'
export default class DataState extends Parent {
    constructor(props) {
        super(props)
        this.databook = {};
        this.accessToken = null;
    }

    /*-start---存储数据模组---start-*/
    @observable databook;
    @observable accessToken; // 访问token
    @observable weightUnitName; //仓储重量单位

    @action changDataBook(id,value){
        this.databook[id] = value;
    }
    getBookType(text) {
        let items = allbooktypes.filter(item => {
            if(item['text'] === text){
                return true
            }
            return false
        })
        return items && items[0] ? items[0] : null
        // console.log('allbooktypes',allbooktypes);
    }
    /*异步请求*/
    @action initData(text){
        let data = text
        if(typeof(data) === 'object' && data.id) {
        } else {
            data = this.getBookType(text)
        }
        
        return new Promise((resolve, reject) => {
            this.rApi.getDataBooks(data).then((res) => {
                // console.log('res', res)
                this.changDataBook(data.id, res)
                resolve(res)
            }).catch(e => {
                reject(e)
            })
        })
        // console.log('res1',this.databook);
    }
    /* 根据类型title获取对应Item */
    @action getBookId(type, title) {
        return new Promise((resolve, reject) => {
            this.initData(type)
                .then(res => {
                    let target = res.find(item => item.title === title)
                    resolve(target)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    /* 获取重量的单位 */
    @action async getWeightUnit(unitClassification = 2) {
        try {
            let res = await this.rApi.getUnitConfig({
                unitClassification
            })
            if (res && res.grossWeight && res.grossWeight.materialUnitList && res.grossWeight.materialUnitList.length) {
                return res.grossWeight.materialUnitList[0].billingUnitName
            } else {
                console.log('获取重量单位失败')
                return 'kg'
            }
        } catch (error) {
            console.log('获取重量单位失败')
            return 'kg'
        }
    }

}