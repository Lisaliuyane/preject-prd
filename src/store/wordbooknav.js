/**
 * 业务相关
 */
const booktypes1 = [
    {
        key: 'INDUSTRY',
        id: 1,
        text: '客户行业'
    },
    {
        key: 'BUSINESS_TYPE',
        id: 2,
        text: '业务类型'
    },
    {
        key: 'TYPE_OF_SHIPPING',
        id: 5,
        text: '运输方式'
    },
    {
        key: 'DELIVERY_MODE',
        id: 6,
        text: '提货方式'
    },
    {
        key: 'MATERIAL_TYPE',
        id: 8,
        text: '物料类型'
    },
    {
        key: 'BUSINESS_MODE',
        id: 37,
        text: '业务模式'
    },
    {
        key: 'SPECIAL_BUSINESS',
        id: 38,
        text: '特殊业务'
    }
]

/** 
 * 车辆相关
*/
const booktypes2 = [
    {
        key: 'CAR_KAIND',
        id: 9,
        text: '车种'
    },
    {
        key: 'CAR_COUNT_UNIT',
        id: 10,
        text: '车辆计量单位'
    }
]

/** 
 * 结算相关
*/
const booktypes3 = [
    {
        key: 'WORKING_TYPE',
        id: 11,
        text: '经营类型'
    },
    {
        key: 'CURRENCY',
        id: 12,
        text: '币别'
    },
    {
        key: 'PAYMENT_METHOD_IN',
        id: 14,
        text: '收款方式'
    },
    {
        key: 'PAYMENT_METHOD_OUT',
        id: 15,
        text: '付款方式'
    },
    {
        key: 'BILLING_METHOD',
        id: 16,
        text: '计费方式'
    },
    {
        key: 'COST_TYPE',
        id: 17,
        text: '费用类型'
    },
    {
        key: 'COST_USAGE',
        id: 26,
        text: '费用用途'
    }
]

/** 
 * 异常相关
*/
const booktypes4 = [
]

/** 
 * 单位相关
*/
const booktypes5 = [
    {
        key: 'COST_UNIT',
        id: 25,
        text: '计量单位'
    },
    {
        key: 'WEIGHT_UNIT',
        id: 29,
        text: '计重单位'
    },
    {
        key: 'VOLUME_UNIT',
        id: 39,
        text: '计体单位'
    },
    {
        key: 'OTHER_UNIT',
        id: 40,
        text: '其他单位'
    }
]

/**
 * 标签标识
 */
const booktypes6 = [
    {
        key: 'CUSTOMER_LABEL',
        id: 18,
        text: '客户标签'
    },
    {
        key: 'OPERATOR_LABEL',
        id: 19,
        text: '承运商标签'
    },
]

/** 
 * 用户相关
*/
const booktypes7 = [
    {
        key: 'JOB',
        id: 24,
        text: '职位'
    },
]

//仓库相关
const booktypes9 = [
    {
        key: 'WAREHOUSE_RELATED',
        id: 30,
        text: '仓库类型'
    },
    {
        key: 'RESERVOIR_TYPE',
        id: 31,
        text: '储位类型'
    },
    {
        key: 'RECEIVE_METHOD',
        id: 32,
        text: '收货方式'
    },
    {
        key: 'OPERATION_MODE',
        id: 33,
        text: '操作模式'
    },
    {
        key: 'TYPE_OF_RECEIPT',
        id: 3,
        text: '收货类型'
    },
    {
        key: 'SHIPPING_TYPE',
        id: 4,
        text: '出货类型'
    },
    {
        key: 'SHIPPING_METHOD',
        id: 7,
        text: '出货方式'
    },
    {
        key: 'PICK_DEMAND',
        id: 34,
        text: '拣货要求'
    },
    {
        key: 'INVENTORY_METHOD',
        id: 35,
        text: '盘点方式'
    },
    {
        key: 'DEMAND_SOURCE',
        id: 36,
        text: '需求来源'
    }
]

/**
 * 其他
 */
const booktypes8 = [
    {
        key: 'AREA',
        id: 20,
        text: '片区'
    },
    {
        key: 'COOPERATIVE_STATE',
        id: 21,
        text: '合作状态'
    },
    {
        key: 'MAINTENANCE_TYPE',
        id: 22,
        text: '保养类型'
    },
    {
        key: 'NODE_TYPE',
        id: 23,
        text: '中转地类型'
    },
    {
        key:'S[ECIAL_DESCRIPTION',
        id: 27,
        text: '订单特殊说明'
    },
    {
        key:'LIFT_MODE',
        id: 28,
        text: '提送模式'
    }
]

const booktypes0 = [
    {
        key: 'noned',
        id: 0,
        text: '无'
    }
]

const allbooktypes = [...booktypes1, ...booktypes2, ...booktypes3, ...booktypes4, ...booktypes5, ...booktypes6, ...booktypes7, ...booktypes8, ...booktypes9]
module.exports = {
    booktypes0,
    booktypes1,
    booktypes2,
    booktypes3,
    booktypes4,
    booktypes5,
    booktypes6,
    booktypes7,
    booktypes8,
    booktypes9,
    allbooktypes
}