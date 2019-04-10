import { observable, action } from "mobx";
// import axios from "axios";
import MODULEDEFINE from '@src/views/MODULEDEFINE'

export default class tabs {
    constructor() {
        this.showTabs = []
        this.activeKey = 'HOME'
        this.pageData = {}
    }
    
    @observable showTabs; // 显示tbs 数组
    @observable activeKey; // 显示tbs 数组

    @observable historyKey; // 历史 key
    /**
     * push新的tab
     * 
     * @param {any} data 
     * 
     * @memberOf tabs
     */
    @action pushNewTabs(data) {
        let arry = this.showTabs.slice()
        const module = MODULEDEFINE[data.key]
        data.component = data.key
        this.historyKey = this.activeKey
        // console.log('pushNewTabs pageData', data.pageData)
        if (data.key === 'HOME') {
            this.activeKey = data.key
            return
        }
        if (module && module.id && module.id.type === 'menu_hide' && data.id) {
            // console.log('menu_hide', data, module)
            for (let value of arry) {
                if (value.key === (data.key + data.id)) {
                    this.pageData[value.key] = {...data.pageData, __isRead: false}
                    this.changeKey(value.key)
                    return
                }
            }
            data = {
                ...data,
                component: data.key,
                key: data.key + data.id
            }
        } else {
            for (let value of arry) {
                if (value.key === data.key) {
                    this.pageData[data.key] = {...data.pageData, __isRead: false}
                    this.changeKey(value.key)
                    return
                }
            }
        }
        arry.push(data)
        this.showTabs = arry
        this.activeKey = data.key
        this.pageData[data.key] = {...data.pageData, __isRead: false}
    }

    @action closeTab(key) {
        let arry = this.showTabs.slice()
        // console.log('closeTab', key, arry)
        arry = arry.filter(item => {
            return item.key !== key
        })
        this.showTabs = arry
    }

    @action setRefresh(key, status) {
        this.pageData[key].refresh = status
    }

    @action setTitle(key, title) {
        let arry = this.showTabs.slice()
        for (let value of arry) {
            if (value.key === key) {
                value.title = title
                break
            }
        }
        // console.log('arry', arry)
        this.showTabs = arry
    }

    setRead(key) {
        if (this.pageData[key]) {
            this.pageData[key].__isRead = true
        }  
    }

    getPageData(key) {
        const d = {...this.pageData[key]}
        //console.log('', d.__isRead)
        this.setRead(key)
        return d
    }

    @action showHomeTab() {
        this.historyKey= this.activeKey
        this.activeKey = 'HOME'
    }

    @action changeKey(key) {
        this.historyKey= this.activeKey
        this.activeKey = key
        // console.log('this.activeKey', this.activeKey)
    }
    /**
     * close 当前 tab
     * 
     * @param {any} index 
     * 
     * @memberOf tabs
     */
    @action close(index) {
        let arry = this.showTabs.slice()
        let activeKey = this.activeKey
        if (arry[index] && arry[index].key && (arry[index].key === this.activeKey)) {
            activeKey = (index + 1) < arry.length ? arry[index + 1].key : (index - 1) >= 0 ? arry[index - 1].key : null
        }
        arry.splice(index, 1)
        this.showTabs = arry
        this.historyKey= this.activeKey
        this.activeKey = activeKey ? activeKey : 'HOME'
    }

    @action refresh(index) {
        let arry = this.showTabs.slice()
        let view = arry[index].view
        if (view && typeof (view.refresh) === 'function') {
            view.refresh()
        }
    }

    @action closeOther(index) {
        let arry = this.showTabs.slice()
        if (arry[index].key !== this.activeKey) {
            this.historyKey= this.activeKey
            this.activeKey = arry[index].key
        }
        let data = [arry[index]]
        this.showTabs = data
    }
    
    @action closeAll() {
        this.historyKey= this.activeKey
        this.activeKey = 'HOME'
        this.showTabs = []
    }

    @action closeRight(index) {
        let arry = this.showTabs.slice()
        let length = arry.length
        let activeIndex = this.getActiveIndex()
        if (activeIndex > index) {
            this.historyKey= this.activeKey
            this.activeKey = arry[index].key
        }
        arry.splice(index + 1, length)
        this.showTabs = arry
    }
    
    @action closeLeft(index) {
        let arry = this.showTabs.slice()
        let activeIndex = this.getActiveIndex()
        if (activeIndex < index) {
            this.historyKey= this.activeKey
            this.activeKey = arry[index].key
        }
        arry.splice(0, index)
        this.showTabs = arry
    }

    /**
     * 使对应的 component 指向对应展现 view的component
     * 
     * @param {any} idInfo 
     * @param {any} component 
     * 
     * @memberOf tabs
     */
    @action updateComponent(idInfo, view) {
        let arry = this.showTabs.slice()
        if (arry[idInfo.index].key === idInfo.key) {
            arry[idInfo.index].view = view
            this.showTabs = arry
        }
    }

    getActiveIndex() {
        let arry = this.showTabs.slice()
        let length = arry.length
        for (let i = 0; i < length; i++) {
            if (this.activeKey === arry[i].key) {
                return i
            }
        }
    }
}