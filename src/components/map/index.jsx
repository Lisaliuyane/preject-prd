import React, { Component } from 'react'
import { MP } from '@src/libs/baidumap'
import { SelectAddressNew } from '@src/components/select_address'
import { Row, Col } from '@src/components/grid'
import { Modal, Button, message, Spin } from 'antd'
import { analysisMapAddress, addressFormat, getAddressExtra} from '@src/utils'
import PropTypes from 'prop-types'
import mapIcon from '@src/libs/img/map.svg'
import { inject, observer } from "mobx-react"
import './index.less'

class LoadMap extends Component {

    state = {
        loading: false,
        address: {}
    }

    constructor(props) {
        super(props)
        this.state.address = props.address
    }


    static propTypes = {
        address: PropTypes.object, //默认地址
        getAddressValue:  PropTypes.func, //将地址给父组件 
        getPointValue:  PropTypes.func //将经纬度给父组件
    }

    componentDidMount() {
        this.setState({
            loading: true
        })
        MP('DSbseTSYLq0dwPl69EZZmjCyMgmr2rGi').then(BMap => {
            //console.log('BMap', BMap, this.mapView)
            let map = new BMap.Map(this.mapView)
            let point = new BMap.Point(114.00100, 22.550000)
            let myGeo = new BMap.Geocoder()
            map.centerAndZoom(point, 15) //设置显示区域中心的地理位置
            map.enableScrollWheelZoom(true) // 允许滚轮缩放
            map.addControl(new BMap.CityListControl({
                anchor: 0,
                offset: 15,
                style: {
                    left: '3px'
                }
            }))
            map.addControl(new BMap.NavigationControl({ anchor: 3, showZoomInfo: 2, type: 3 }))
            map.addControl(new BMap.ScaleControl())
            map.enableAutoResize()
            this.map = map
            this.BMap = BMap
            this.myGeo = myGeo
            this.addressResolution(myGeo, map, BMap)
            this.inverseAddressResolution(myGeo, map, BMap)
            this.setState({
                loading: false
            })
        })
    }

    componentWillReceiveProps(nextProps) {
        let oldAddress = this.props.address
        let newAddress = nextProps.address
        if(oldAddress !== newAddress) {
            //console.log('componentWillReceiveProps', newAddress)
            this.setState({
                address: newAddress
            }, () => {
                this.addressResolution()
            })
        }
    }

    addressResolution = () => { //地址解析
        let { address } = this.state
        const myGeo = this.myGeo
        const map = this.map
        const BMap = this.BMap
        myGeo.getPoint(analysisMapAddress(address), (point) => {
            //console.log('addressResolution', address, point, analysisMapAddress(address))
            if (point) {
                map.centerAndZoom(point, 16)
                map.addOverlay(new BMap.Marker(point))
                map.centerAndZoom(point, 19)
                this.mapInfoMarker(point)
                this.props.getPointValue(point)
            }else{
                message.error('您选择地址没有解析到结果!')
            }
        });
    }

    inverseAddressResolution = () => { //逆地址解析
        const map = this.map
        const BMap =  this.BMap
        let geoc = new BMap.Geocoder()
        map.addEventListener("click", (e) => {        
            let pt = e.point;
            geoc.getLocation(pt, (rs) => {
                let addComp = rs.addressComponents
                let surroundingPois = rs.surroundingPois && rs.surroundingPois[0]
                let proVul = ''
                let cityVul= ''
                let countyVul = ''
                let streetVul = ''
                let extra = ''
                let s = ''
                if (addComp.province) {
                    proVul =addComp.province
                }
                if (addComp.city) {
                    cityVul = addComp.city
                }
                if (addComp.district) {
                    countyVul = addComp.district
                }
                if (addComp.street) {
                    streetVul = addComp.street
                }
                if(surroundingPois && surroundingPois.title) {
                    if(addComp.streetNumber) {
                        extra =  addComp.streetNumber + surroundingPois.title
                    }
                    extra =  surroundingPois.title
                }
                if(proVul) {
                    s += proVul
                }
                if(cityVul) {
                    s += '/'
                    s += cityVul
                }
                if(countyVul) {
                    s += '/'
                    s += countyVul
                }
                if(streetVul) {
                    s += '/'
                    s += streetVul
                }
                if(extra) {
                    s += ' '
                    s += extra
                }

                let d = {
                    pro: proVul,
                    city: cityVul,
                    dist: countyVul,
                    street: streetVul,
                    extra: extra,
                    formatAddress: s
                }
                this.props.getAddressValue(d)
                this.props.getPointValue(pt)
                if(proVul) {
                    this.props.getAreaByProvince(proVul)
                }
                if (this.marker) {
                    //map.removeOverlay(this.marker)
                    this.marker.setPosition(pt)
                    //this.marker.openInfoWindow(infoWindow)
                    return
                }


                // let infoWindow = new BMap.InfoWindow(`地址：${addr}`, opts);  // 创建信息窗口对象 
                // this.marker = new BMap.Marker(pt)
                // map.addOverlay(this.marker)
                // map.centerAndZoom(pt, 15);
                // let opts = {
                //     width : 200,     // 信息窗口宽度
                //     height: 100,     // 信息窗口高度
                //     title : addComp.streetNumber, // 信息窗口标题
                //     enableMessage:true,//设置允许信息窗发送短息
                //     message:""
                // }
                // this.marker.openInfoWindow(infoWindow)
            })
        })    
    }

    mapInfoMarker = (point) => { // 创建信息窗口
        //console.log('mapInfoMarker', point)
        let { address } = this.state
        const map = this.map
        const BMap = this.BMap
        let marker = new BMap.Marker(point);  // 创建标注
        map.addOverlay(marker);              // 将标注添加到地图中
        map.centerAndZoom(point, 15);
        let opts = {
            width : 200,     // 信息窗口宽度
            height: 100,     // 信息窗口高度
            title : getAddressExtra(address), // 信息窗口标题
            enableMessage:true,//设置允许信息窗发送短息
            message:""
        }
        let infoWindow = new BMap.InfoWindow(`地址：${analysisMapAddress(address)}`, opts);  // 创建信息窗口对象 
        marker.addEventListener("click", function(){          
            map.openInfoWindow(infoWindow,point); //开启信息窗口
        })
        //closeInfoWindow()
    }
    render() {
        return(
            <Spin spinning={this.state.loading}>
                <div style={{width: '100%', height: 350}} ref={v => this.mapView = v}></div>
            </Spin>
        )
    }
}

@inject('rApi')  
class MapView extends Component {

    static propTypes = {
        address: PropTypes.object, //默认地址
        areaName: PropTypes.string, //默认片区名
        getMapValue: PropTypes.func //将地址，经纬度给父组件 =>点击确定的时候才执行
    }
    state = {
        visible: false,
        address: {},
        reloadAdress: false,
        point: {},
        areaName: null //片区名
    }

    constructor(props) {
        super(props)
        this.state = {
            areaName:  props.areaName,
            address: props.address
        }
    }

    componentWillReceiveProps(nextProps) {
        let oldAddress = this.props.address
        let newAddress = nextProps.address
        if(oldAddress !== newAddress) {
            this.setState({
                address: nextProps.address
            })
        }

        if(this.props.areaName !== nextProps.areaName) {
            this.setState({
                areaName: nextProps.areaName
            })
        }
    }

    showModal = () => {
        this.setState({
          visible: true,
        })
    }

    handleCancel = (e) => {
        //console.log(e);
        this.setState({
          visible: false,
          address: ''
        })
    }

    clearValue = () => {
        this.setState({
            address: {},
            areaName: null //片区名
        })
    }

    getAddressValue = (value) => { //获取地址
        this.setState({
            address: value,
            reloadAdress: true
        }, () => {
            this.setState({
                reloadAdress: false
            })
        })
    }

    getPointValue = (value) => { //获取经纬度
       this.setState({
            point: value
       })
    }

    // getAreaValue = (value) => {
    //     console.log('getAreaValue', value)
    // }

    getValue = () => { //获取值
        return {
            address: this.state.address,
            point: this.state.point,
            areaName: this.state.areaName
        }
    }

    onConfirm = () => { //确定
        let value = this.getValue()
        this.props.getMapValue(value)
        this.setState({
            visible: false
        })
    }

    getValueForChilder = (value) => { //获取地址onchang值
        this.setState({
            address: value
        })
    }

    getAreaByProvince = (value) => {
        let { rApi } = this.props
        if (value) {
            rApi.getAreaByProvince({
                proName: value
            }).then(res => {
                // console.log('area',res)
                this.setState({
                    areaName: res.map(item => item.title).join(',')
                })
            })
        } else {
            this.setState({areaName: ''})
        }
    }

    onChageProvince = (value) => {
        let proName = value.name || value.label
        if(proName) {
            this.getAreaByProvince(proName)
        }
    }

    render() {
        const { visible, address, reloadAdress } = this.state
        let { iconStyle } = this.props
        if(!address) {
            this.setState({
                address: this.props.address,
                reloadAdress: true
            }, () => {
                this.setState({
                    reloadAdress: false
                })
            })
        }
        return(
            <div className="mapview-wrapper">
                <div onClick={this.showModal} style={{width: 32, height: 32, textAlign: 'center', lineHeight: '30px', ...iconStyle}}>
                    <img src={mapIcon} />
                </div>
                <Modal
                    width={680}
                    bodyStyle={{padding: '0', background: '#fff', color: '#484848'}}
                    title="地图定位"
                    visible={visible}
                    onCancel={this.handleCancel}
                    centered
                    footer={null}
                    destroyOnClose
                    maskClosable={false}
                    >
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Row gutter={24} style={{padding: '0 10px'}}> 
                            <Col span={18} label="当前位置&emsp;&emsp;" colon> 
                                {
                                    reloadAdress ?
                                    null
                                    :
                                    <SelectAddressNew 
                                        //getPopupContainer={() => this.popupContainer || document.body}
                                        getValueForChilder={this.getValueForChilder}
                                        onChageProvince={this.onChageProvince}
                                        address={address ? address : {}}
                                        getThis={this.getSelectAddress} 
                                        title={address ? addressFormat(address) : '无'}
                                    />
                                }
                            </Col>
                        </Row>
                        <Button style={
                            {
                                color: '#fff',
                                background: '#18B583',
                                padding: '0 20px',
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                border: 0
                            }
                        }
                        onClick={this.onConfirm}
                        >
                            确定
                        </Button>
                       {
                            visible ? 
                            <LoadMap 
                                address={this.state.address} 
                                getAddressValue={this.getAddressValue} 
                                getPointValue={this.getPointValue} 
                                getAreaByProvince={this.getAreaByProvince} 
                            /> 
                            : 
                            null
                       }
                    </div>
                </Modal>
            </div>
        )
    }
}

export default MapView