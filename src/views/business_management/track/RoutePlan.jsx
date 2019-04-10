import React, { Component } from 'react'
import { MP, getCurveLine } from '@src/libs/baidumap'
import { Spin } from 'antd'
import {addressFormat} from '@src/utils'
import './index.less'

class LoadMap extends Component {

    state = {
        loading: false,
        dataSource: [], //订单追踪数据
        address: {}
    }

    constructor(props) {
        super(props)
        this.state.address = props.address
        this.state.dataSource = props.data
    }


    // static propTypes = {
    //     address: PropTypes.object, //默认地址
    //     getAddressValue:  PropTypes.func, //将地址给父组件 
    //     getPointValue:  PropTypes.func //将经纬度给父组件
    // }

    componentDidMount() {
        //console.log('dataSource', this.state.dataSource)
        let { dataSource } = this.state
        let { type } = this.props
        let {senderList, receiverList, stowageTransitPlaceList} = dataSource
        let sendLat = senderList && senderList[0] && senderList[0].latitude
        let sendLog = senderList && senderList[0] && senderList[0].longitude
        let sendAddress = senderList && senderList[0] && addressFormat(senderList[0].address)
        let receiverLat = receiverList && receiverList[0] && receiverList[0].latitude
        let receiverLog = receiverList && receiverList[0] && receiverList[0].longitude
        let receiverAddress = receiverList && receiverList[0] && addressFormat(receiverList[0].address)
        this.setState({
            loading: true
        })
        MP('DSbseTSYLq0dwPl69EZZmjCyMgmr2rGi').then(BMap => {
            //console.log('BMap', BMap, this.mapView)
            let map = new BMap.Map(this.mapView)
            let defaultLog = sendLog ? sendLog : 114.00100
            let defaultLat = sendLat ? sendLat : 22.550000
            let point = new BMap.Point(defaultLog, defaultLat)
            let myGeo = new BMap.Geocoder()
            map.centerAndZoom(point, 6) //设置显示区域中心的地理位置
            map.enableScrollWheelZoom(true) // 允许滚轮缩放
            // map.addControl(new BMap.CityListControl({
            //     anchor: 0,
            //     offset: 15,
            //     style: {
            //         left: '3px'
            //     }
            // }))
            map.addControl(new BMap.NavigationControl({ anchor: 3, showZoomInfo: 2, type: 3 }))
            map.addControl(new BMap.ScaleControl())
            map.enableAutoResize()
            this.map = map
            this.BMap = BMap
            this.myGeo = myGeo
            this.CurveLine = getCurveLine(BMap)
            if(type === 1) {
                this.onStowage({sendLog, sendLat, sendAddress}, {receiverLog, receiverLat, receiverAddress}, stowageTransitPlaceList)
            } else if(type === 2) { 
                this.onNavigation({sendLog, sendLat, sendAddress}, {receiverLog, receiverLat, receiverAddress}, stowageTransitPlaceList)
            } else if(type === 3) {
                this.onPlan({sendLog, sendLat, sendAddress}, {receiverLog, receiverLat, receiverAddress}, stowageTransitPlaceList)
            }
            else {
                this.onStowage({sendLog, sendLat, sendAddress}, {receiverLog, receiverLat, receiverAddress}, stowageTransitPlaceList)
            }
            this.setState({
                loading: false
            })
        })
    }

    filterData = ({
        list, lastPoint, firstPoint
    }) => {
        list = list || []
        let array = [...list.filter((item) => !item.departure && !item.destination).map(item => {
            return {
                ...item,
                departure: firstPoint,
                destination: lastPoint,
                isParent: true
            }
        })]
        let firstPoints = list.filter((item) => !item.departure || !item.departure.latitude)
       // console.log('filterData',  list, lastPoint, firstPoint, array)
        let rests = list.filter((item) => item.departure)
        const deal = (points, restPoints) => {
            let rPoints = []
            let p = []
            points.map(item => {
                if (restPoints.some(ele => {
                    if (item.destination && ele.departure && JSON.stringify(item.destination) === JSON.stringify(ele.departure)) {
                        p.push(ele)
                        return true
                    }
                    rPoints.push(ele)
                    return false
                })) {
                    array.push({
                        ...item
                    })
                } else {
                    array.push({
                        ...item,
                        lastPoint: lastPoint
                    })
                }
                return null
            }).filter(item => item)
            if (p.length > 0) {
                deal(p, rPoints)
            }
        }
        deal(firstPoints, rests)
        //console.log('array', array)
        return array
    }

    componentWillReceiveProps(nextProp) {
        let { dataSource } = this.state
        const map = this.map
        let {senderList, receiverList, stowageTransitPlaceList} = dataSource
        let sendLat = senderList && senderList[0] && senderList[0].latitude
        let sendLog = senderList && senderList[0] && senderList[0].longitude
        let sendAddress = senderList && senderList[0] && addressFormat(senderList[0].address)
        let receiverLat = receiverList && receiverList[0] && receiverList[0].latitude
        let receiverLog = receiverList && receiverList[0] && receiverList[0].longitude
        let receiverAddress = receiverList && receiverList[0] && addressFormat(receiverList[0].address)
        this.setState({
            reloadLoading: true
        })

        // map.clearOverlays()
        if(this.props.type !== nextProp.type) {
            map.clearOverlays()
            if(nextProp.type === 1) {
                this.onStowage({sendLog, sendLat, sendAddress}, {receiverLog, receiverLat, receiverAddress}, stowageTransitPlaceList)
            } else if(nextProp.type === 2) { 
                this.onNavigation({sendLog, sendLat, sendAddress}, {receiverLog, receiverLat, receiverAddress}, stowageTransitPlaceList)
            } else if(nextProp.type === 3) {
                this.onPlan({sendLog, sendLat, sendAddress}, {receiverLog, receiverLat, receiverAddress}, stowageTransitPlaceList)
            }
            else {
                this.onStowage({sendLog, sendLat, sendAddress}, {receiverLog, receiverLat, receiverAddress}, stowageTransitPlaceList)
            }
        }
    }

    // OR18112300004
    onStowage = (d1, d2, stowageTransitPlaceList) => { //配载热力图
        //console.log('配载热力图', d1, d2)
        const BMap = this.BMap
        const map = this.map
        let stowageTransit = []
        if(stowageTransitPlaceList && stowageTransitPlaceList.length > 0) {
            stowageTransit = this.filterData({
                list: stowageTransitPlaceList, 
                lastPoint: {latitude: d2.receiverLat, longitude: d2.receiverLog, transitPlaceOneName: d2.receiverAddress},
                firstPoint: {latitude: d1.sendLat, longitude: d1.sendLog, transitPlaceOneName: d1.sendAddress}
            })
        } 
        // else {
        //     stowageTransit = [{
        //         departure: {latitude: d1.sendLat, longitude: d1.sendLog, transitPlaceOneName: d1.sendAddress},
        //         destination: {latitude: d2.receiverLat, longitude: d2.receiverLog, transitPlaceOneName: d2.receiverAddress},
        //         isParent: true
        //     }]
        // }
        stowageTransit = stowageTransit && stowageTransit.length > 0 ? stowageTransit.map(item => {
            return {
                ...item,
                departure: item.departure && item.departure.latitude && item.departure.longitude ? item.departure : {latitude: d1.sendLat, longitude: d1.sendLog, transitPlaceOneName: d1.sendAddress}
            }
        }) : []
        //console.log('onStowage', stowageTransitPlaceList, stowageTransit)
        stowageTransit.forEach(item => {
            if(item.isParent) {
                this.onStraightLine(item) 
            } else if(!item.isParent) {
                this.onCurveLine(item)
                let departure = item && item.departure
                let destination = item && item.destination
                let lastPoint = item && item.lastPoint
                if(departure && departure.longitude && departure.latitude) {
                    let pt = new BMap.Point(departure.longitude, departure.latitude)
                    let marker1 = new BMap.Marker(pt)  // 创建标注
                    if(departure.transitPlaceOneName) {
                        let label = new BMap.Label(departure.transitPlaceOneName, {offset:new BMap.Size(20,-10)})
                        marker1.setLabel(label)
                    }
                    if(marker1) {
                        map.addOverlay(marker1) //自定义图标
                    }
                }
                if(destination && destination.longitude && destination.latitude) {
                    let pt = new BMap.Point(destination.longitude, destination.latitude)
                    let marker1 = new BMap.Marker(pt)  // 创建标注
                    if(destination.transitPlaceOneName) {
                        let label = new BMap.Label(destination.transitPlaceOneName, {offset:new BMap.Size(20,-10)})
                        marker1.setLabel(label)
                    }
                    if(marker1) {
                        map.addOverlay(marker1) //自定义图标
                    }
                }
                if(lastPoint && lastPoint.longitude && lastPoint.latitude) {
                    let pt = new BMap.Point(lastPoint.longitude, lastPoint.latitude)
                    let marker1 = new BMap.Marker(pt)  // 创建标注
                    if(lastPoint.transitPlaceOneName) {
                        let label = new BMap.Label(lastPoint.transitPlaceOneName, {offset:new BMap.Size(20,-10)})
                        marker1.setLabel(label)
                    }
                    if(marker1) {
                        map.addOverlay(marker1) //自定义图标
                    }
                }
            }
        })

    }

    onCurveLine = (item) => { //画弧
        const BMap = this.BMap
        const map = this.map
        let start = {}, end = {}, center={}, points = [], flag = flag, endPoints = []
         // let myIcon = new BMap.Icon("http://lbsyun.baidu.com/jsdemo/img/fox.gif", new BMap.Size(300,157))
            // let marker2 = new BMap.Marker(pt,{icon:myIcon})  // 创建标注
	        // map.addOverlay(marker2) //自定义图标
        if(!item.lastPoint) {
            let departure = item && item.departure
            let destination = item && item.destination
            if(departure) {
                start = new BMap.Point(departure.longitude, departure.latitude)
            }
            if(destination) {
                end = new BMap.Point(destination.longitude, destination.latitude)
            }
            points = [start, end]
            endPoints = []
        } else if(!item.destination) {
            let departure = item && item.departure
            let lastPoint = item && item.lastPoint
            if(departure) {
                start = new BMap.Point(departure.longitude, departure.latitude)
            }
            if(lastPoint) {
                end = new BMap.Point(lastPoint.longitude, lastPoint.latitude)
            }
            endPoints = [start, end]
        } else if(item.destination && item.lastPoint) {
            let departure = item && item.departure
            let destination = item && item.destination
            let lastPoint = item && item.lastPoint
            if(departure) {
                start = new BMap.Point(departure.longitude, departure.latitude)
            }

            if(destination) {
                center = new BMap.Point(destination.longitude, destination.latitude)
            }

            if(lastPoint) {
                end = new BMap.Point(lastPoint.longitude, lastPoint.latitude)
            }
            points = [start, center]
            endPoints = [center, end]
        }
        let strokeWeight = 3
        let endCurve = {}
        if((item.stowageQuantity/item.totalQuantity)*20 > 8) {
            strokeWeight = 8
        } else if((item.stowageQuantity/item.totalQuantity)*20 < 3) {
            strokeWeight = 3
        } else {
            strokeWeight = (item.stowageQuantity/item.totalQuantity)*20
        }

        if(endPoints && endPoints.length > 0) {
            endCurve = new this.CurveLine(endPoints, {strokeColor:"red", strokeWeight: strokeWeight, strokeOpacity:0.8, strokeStyle: 'dashed'}) //创建弧线对象
            map.addOverlay(endCurve)
        } else {
            endCurve = {}
        }
        let curve = new this.CurveLine(points, {strokeColor:"blue", strokeWeight: strokeWeight, strokeOpacity:0.8, strokeStyle: (item.status === 2 || flag) ? 'dashed' : 'solid'}) //创建弧线对象
        map.addOverlay(curve) //添加到地图中
        //curve.enableEditing() //开启编辑功能
    }

    onStraightLine = (item) => { //画直线
        const BMap = this.BMap
        const map = this.map
        let start = {}, end = {}
        let departure = item && item.departure
        let destination = item && item.destination
        if(departure) {
            start = new BMap.Point(departure.longitude, departure.latitude)
            let marker1 = new BMap.Marker(start)  
            if(departure.transitPlaceOneName) {
                let label = new BMap.Label(departure.transitPlaceOneName, {offset:new BMap.Size(20,-10)})
                marker1.setLabel(label)
            }
            map.addOverlay(marker1)
        }
        if(destination) {
            end = new BMap.Point(destination.longitude, destination.latitude)
            let marker2 = new BMap.Marker(end)
            if(destination.transitPlaceOneName) {
                let label = new BMap.Label(destination.transitPlaceOneName, {offset:new BMap.Size(20,-10)})
                marker2.setLabel(label)
            }  
            map.addOverlay(marker2)
        }
        let points = [start, end]
        let strokeWeight = 3
        if((item.stowageQuantity/item.totalQuantity)*20 > 8) {
            strokeWeight = 8
        } else if((item.stowageQuantity/item.totalQuantity)*20 < 3) {
            strokeWeight = 3
        } else {
            strokeWeight = (item.stowageQuantity/item.totalQuantity)*20
        }
       // console.log('strokeWeight', strokeWeight, (item.stowageQuantity/item.totalQuantity)*20, (item.stowageQuantity/item.totalQuantity)*20 > 3)
        let polyline = new BMap.Polyline(points, {strokeColor:"blue", strokeWeight: strokeWeight, strokeOpacity:0.8})
        map.addOverlay(polyline);
    }

    onNavigation = () => { //实时导航
        console.log('onNavigation')
    }

    onPlan = (d1, d2, stowageTransitPlaceList) => { //路线规划
        if(stowageTransitPlaceList && stowageTransitPlaceList.length > 0) {
            stowageTransitPlaceList = stowageTransitPlaceList && stowageTransitPlaceList.length > 0 ? stowageTransitPlaceList.map(item => {
                return {
                    ...item,
                    start: {longitude: d1.sendLog, latitude: d1.sendLat},
                    end: {longitude: d2.receiverLog, latitude: d2.receiverLat},
                    waypoints: [item.departure, item.destination].filter(d => d)
                }
            }) : []
        } 
        // else {
        //     stowageTransitPlaceList = [{
        //         start: {longitude: d1.sendLog, latitude: d1.sendLat},
        //         end: {longitude: d2.receiverLog, latitude: d2.receiverLat}
        //     }]
        // }

        stowageTransitPlaceList.forEach(item => {
            this.search(item)
        })
    }

    search = (item) => {  //路线规划 p1 起点 p2 终点 waypoints 中转地
        const map = this.map
        const BMap = this.BMap
        this.setState({
            loading: true
        })
        let { start, end, waypoints } = item
        let p1 = new BMap.Point(start.longitude, start.latitude)
        let p2 = new BMap.Point(end.longitude, end.latitude)
        let node = waypoints && waypoints.length > 0 ? waypoints.map(d => {
            let pt =  new BMap.Point(d.longitude, d.latitude)
            // let myIcon = new BMap.Icon("http://lbsyun.baidu.com/jsdemo/img/fox.gif", new BMap.Size(300,157))
            // let marker2 = new BMap.Marker(pt,{icon:myIcon})  // 创建标注
	        // map.addOverlay(marker2) //自定义图标
            return pt
        }) : []
        let routePolicy = ['BMAP_DRIVING_POLICY_LEAST_TIME',' BMAP_DRIVING_POLICY_LEAST_DISTANCE', 'BMAP_DRIVING_POLICY_AVOID_HIGHWAYS']
        let driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true, policy: routePolicy[1]}, onSearchComplete: results => {
            this.setState({
                loading: false
            })
        }})

        driving.search(p1, p2, {waypoints: node})
    }

    render() {
        return(
            <Spin spinning={this.state.loading}>
                <div style={{width: '100%', height: 500}} ref={v => this.mapView = v}></div>
            </Spin>
        )
    }
}

export default LoadMap