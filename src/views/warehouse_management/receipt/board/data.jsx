import React from 'react'
import moment from 'moment'

const Data = {
    states: () => {
        return {
            warehouseId: null, //筛选条件仓库ID
            warehouseName: '全部', //筛选条件仓库名称
            clientId: null, //筛选条件客户ID
            dataObj: null, //收货看板数据
            dataList: [], //看板表格数据
            receiptTimeStart: null, //开始日期
            receiptTimeEnd: null, //结束日期
            sumTobeConfirm: 0, 
            sumTobeReceipt: 0, 
            SumInReceipt: 0, 
            sumTobeStorage: 0, 
            showChart: true,
            columns: [
                {
                    className: 'text-overflow-ellipsis',
                    title: '客户名称',
                    dataIndex: 'clientName',
                    key: 'clientName'
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '待确认',
                    dataIndex: 'toBeConfirmed',
                    key: 'toBeConfirmed'
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '待收货',
                    dataIndex: 'toBeReceived',
                    key: 'toBeReceived'
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '收货中',
                    dataIndex: 'inReceiptOfGoods',
                    key: 'inReceiptOfGoods'
                },
                {
                    className: 'text-overflow-ellipsis',
                    title: '待入储',
                    dataIndex: 'toBePendingStorage',
                    key: 'toBePendingStorage'
                }
            ],
            //收货饼图配置
            pieOption: { 
                title: {
                    text: '收货监控',
                    x: 'left',
                    top: 12,
                    left: 12,
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: 14
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'horizontal',
                    bottom: 18,
                    data: ['待确认', '待收货', '收货中', '待入储']
                },
                series: [
                    {
                        name: '数量',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '50%'],
                        data: [
                            { value: 0, name: '待确认' },
                            { value: 0, name: '待收货' },
                            { value: 0, name: '收货中' },
                            { value: 0, name: '待入储' },
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }, 

            // 柱状图配置
            barOption: {
                color: ['#1DA57A'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '16%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        name: '日期',
                        data: [],
                        axisTick: {
                            show: false,
                            alignWithLabel: true
                        },
                        axisLabel: {
                            align: 'right',
                            // margin: 20,
                            rotate: 30
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '(单)',
                        splitLine: {
                            show: false
                        },
                    }
                ],
                series: [
                    {
                        name: '当天单量',
                        type: 'bar',
                        // barWidth: '40%',
                        barMaxWidth: 50,
                        data: []
                    }
                ]
            }
        }
    }
}

export default Data