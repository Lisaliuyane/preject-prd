import React, { Component, Fragment } from 'react'
import { observer, inject } from "mobx-react"
import { message, Spin } from 'antd'
import Baseinfo from './Baseinfo'
import Storage from './Storage'
import Titlebar from '../public/Titlebar'
import { cloneObject, isArray } from '@src/utils'
import './index.less'

/**
 * 新建/编辑仓库
 * @class WarehousePlus
 * @extends {Component}
*/
@inject('rApi', 'mobxTabsData')
@observer
class WarehousePlus extends Component {
    constructor (props) {
        super(props)
        this.state = {
            origin: null, //打开当前页面的父页面指针
            openType: '', //窗口打开类型   add: 新建 edit: 编辑
            /* -------reqData start-------- */
            id: null,
            name: null, //仓库名称
            code: null,
            typeId: null,
            typeName: null,
            principal: null,
            phone: null,
            address: null,
            areaName: null,
            longitude: null,
            latitude: null,
            remark: null,
            capacitySum: 0,
            warehouseStorageCount: 0,
            /* -------reqData end--------- */
            dataLoading: true,
            isSave: false, //是否是保存
            saveLoading: false,
            sumLoading: false, //仓库规模汇总数据载入中
            addrReload: false, //地址组件重载
            mapReload: false
        }
    }

    componentDidMount () {
        const { mobxTabsData, mykey } = this.props
        const pageData = cloneObject(mobxTabsData.getPageData(mykey)) || null
        mobxTabsData.setTitle(mykey, pageData && pageData.openType === 'add' ? `仓库明细(新建)` : `仓库明细(${pageData.payload.code})`)
        if (pageData && pageData.openType === 'edit') {/* 如果是编辑 */
            this.initData(pageData)
        } else {
            this.setState({
                origin: pageData.origin,
                openType: pageData.openType,
                dataLoading: false
            })
        }
    }

    /* 编辑仓库初始化数据 */
    initData (d) {
        // console.log('初始化仓库数据...', d)
        const r = { ...d.payload }
        this.setState({
            origin: d.origin,
            openType: d.openType,
            ...r
        }, () => {
            this.setState({ dataLoading: false, isSave: true })
            this.getSumData()
            // console.log('initData', this.state)
        })
    }

    /* setState */
    changeVal = (key, val) => {
        // console.log('changeVal', key, val, arguments[0])
        this.setState({ [key]: val })
    }

    // 获取仓库规模汇总
    getSumData = async () => {
        let res = null
        this.setState({ sumLoading: true })
        try {
            res = await this.props.rApi.getWarehouseSum({ id: this.state.id })
        } catch (error) {
            this.setState({ sumLoading: false })
            return
        }
        this.setState({
            capacitySum: res ? res.capacitySum : 0.0,
            warehouseStorageCount: res ? res.warehouseStorageCount : 0,
            sumLoading: false
        })
    }

    /* 获取地址选择指针 */
    getSelectAddress = v => {
        this.addr = v
    }
    /* 仓库地址变化获取所属片区 */
    onChangeAddress = async addr => {
       // console.log('onChangeAddress')
        if (addr && addr.id) {
            this.props.rApi.getAreaByAddress(addr)
                .then(res => {
                    let str = res && isArray(res) ? res.map(item => item.title).join(',') : ''
                    this.setState({ areaName: str })
                })
                .catch(err => this.setState({areaName: ''}))
        } else {
            this.setState({ areaName: '' })
        }
    }
    // 仓库地址变化
    getValueForChilder = val => {
        this.setState({
            address: JSON.stringify(val),
            mapReload: true
        }, () => {
            this.setState({ mapReload: false })
        })
    }
    // 仓库地址定位选择
    getMapValue = val => {
        console.log('仓库地址定位选择', val)
        this.setState({
            address: JSON.stringify(val.address),
            areaName: val.areaName || this.state.areaName,
            longitude: val && val.point && val.point.lng,
            latitude: val && val.point && val.point.lat,
            addrReload: true
        }, () => {
            this.setState({ addrReload: false })
        })
    }

    /* 仓库基本信息保存 */
    saveBaseinfo = async () => {
        if (this.state.saveLoading) return
        let {
            isSave,
            name,
            typeId,
            typeName,
            principal,
            phone,
            areaName,
            longitude,
            latitude,
            remark,
            id
        } = this.state
        const APINAME = isSave ? 'editWarehouse' : 'addWarehouse'
        let address = this.addr.getValue()
        /* 请求数据 */
        let reqData = {
            name,
            typeId,
            typeName,
            principal,
            phone,
            address,
            areaName,
            remark,
            longitude,
            latitude
        }
        reqData = isSave ? { ...reqData, id } : reqData
        /* 请求数据 */
        if(!longitude || !latitude) {
            message.error('仓库经纬度不能为空!')
            return false
        }
        this.setState({ saveLoading: true })
        try {
            let res = await this.props.rApi[APINAME](reqData)
            if (!isSave) { /* 如果是新建 */
                // const {mobxTabsData, mykey} = this.props
                // mobxTabsData.setTitle(mykey, `仓库明细(${res.number || '无'})`)
                if (res) {
                    await this.setState({
                        id: res.id,
                        code: res.number
                    })
                }
            }
            await this.setState({isSave: true})
            if (this.state.origin) {
                this.state.origin.onChangeValue()
            }
            message.success('保存成功')
        } catch (err) {
            message.error(err.msg || '操作失败')
        }
        this.setState({ saveLoading: false })
    }

    render () {
        const {
            id,
            dataLoading,
            isSave,
            saveLoading,
            name,
            typeId,
            typeName,
            principal,
            phone,
            address,
            areaName,
            longitude,
            latitude,
            remark,
            capacitySum,
            warehouseStorageCount,
            addrReload,
            mapReload,
            sumLoading
        } = this.state
        if (dataLoading) {
            return <Spin tip='数据载入中...' style={{margin: '0 auto'}} />
        }
        return (
            <div className="warehouse-plus">
                <Baseinfo
                    className='sd-block baseinfo'
                    changeVal={this.changeVal}
                    onChangeAddress={this.onChangeAddress}
                    saveBaseinfo={this.saveBaseinfo}
                    getSelectAddress={this.getSelectAddress}
                    getValueForChilder={this.getValueForChilder}
                    getMapValue={this.getMapValue}
                    name={name}
                    typeId={typeId}
                    typeName={typeName}
                    principal={principal}
                    phone={phone}
                    address={address}
                    areaName={areaName}
                    longitude={longitude}
                    latitude={latitude}
                    remark={remark}
                    isSave={isSave}
                    saveLoading={saveLoading}
                    addrReload={addrReload}
                    mapReload={mapReload}
                />
                {
                    isSave && <div className='storage-info'>
                        <Storage
                            parent={this}
                            className='sd-block storage'
                            warehouseId={id}
                        />
                        <div className='sd-block sum'>
                            <Titlebar title={'仓库规模汇总'} />
                            {
                                sumLoading ? <Spin /> : <Fragment>
                                    <div className='info-row'>
                                        <span>仓库容量</span><span className='num'>{capacitySum}</span><span>m³</span>
                                    </div>
                                    <div className='info-row'>
                                        <span>储位数量</span><span className='num'>{warehouseStorageCount}</span><span>个</span>
                                    </div>
                                </Fragment>
                            }
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default WarehousePlus