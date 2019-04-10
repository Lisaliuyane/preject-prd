/** 
 *  页面跳转声明
*/

export const toClientSource = (mobxTabsData) => { //跳到客户资料页
    mobxTabsData.pushNewTabs({
        component: 'CLIENT_SOURCE',
        key: 'CLIENT_SOURCE'
    })
}

export const toDemand = (mobxTabsData, params) => { //跳到客户需求页
    mobxTabsData.pushNewTabs({
        key: 'PROJECT_MANAGEMENT_DEMAND_DETAILS',
        ...params
    })
}

export const toDemandList = (mobxTabsData, params) => { //跳到需求导入规划列表页
    mobxTabsData.pushNewTabs({
        key: 'PROJECT_MANAGEMENT_DEMAND_IMPORT',
        ...params
    })
}


export const toCooperativeDetail = (mobxTabsData, params) => { //跳到合作项目明细页
    mobxTabsData.pushNewTabs({
        key: 'PROJECT_MANAGEMENT_COOPERATIVE_PROJECT_DETAILS',
        ...params
    })
}

export const toCooperativeList = (mobxTabsData, params) => { //跳到合作项目列表页
    mobxTabsData.pushNewTabs({
        key: 'PROJECT_MANAGEMENT_COOPERATIVE_PROJECT',
        ...params
    })
}

export const toOrderAdd = (mobxTabsData, params) => { //跳到新建订单页
    mobxTabsData.pushNewTabs({
        key: 'BUSINESS_MANAGEMENT_ORDER_ADD',
        ...params
    })
}

export const toOrderList = (mobxTabsData, params) => { //跳到订单列表页
    mobxTabsData.pushNewTabs({
        key: 'BUSINESS_MANAGEMENT_ORDER_LIST',
        ...params
    })
}

export const toUserInfo = (mobxTabsData, params) => { //跳到个人中心
    mobxTabsData.pushNewTabs({
        key: 'PERSONAL_CENTER_MANAGEMENT',
        ...params
    })
}

export const toSendCar = (mobxTabsData, params) => { //跳到派车管理页
    mobxTabsData.pushNewTabs({
        key: 'SEND_CAR_MANAGEMENT',
        ...params
    })
}

export const toTrackList = (mobxTabsData, params) => { //跳到订单追踪列表页
    mobxTabsData.pushNewTabs({
        key: 'BUSINESS_MANAGEMENT_TRACK_LIST',
        ...params
    })
}

export const toWarehousePlus = (mobxTabsData, params) => { //跳到新建仓库
    mobxTabsData.pushNewTabs({
        key: 'WAREHOUSE_MANAGEMENT_ADD_WAREHOUSE',
        ...params
    })
}

export const toAllocateEdit = (mobxTabsData, params) => { //跳到配载编辑
    mobxTabsData.pushNewTabs({
        key: 'BUSINESS_MANAGEMENT_ALLOCATE_LIST_EDIT',
        ...params
    })
}

export const toStowageMaintenanceEdit = (mobxTabsData, params) => { //跳到配载数据维护录入
    mobxTabsData.pushNewTabs({
        key: 'STOWAGE_MAINTENANCE_EDIT',
        ...params
    })
}

export const toStowageMaintenanceList = (mobxTabsData, params) => { //跳到配载数据维护列表页
    mobxTabsData.pushNewTabs({
        key: 'STOWAGE_MAINTENANCE_LIST',
        ...params
    })
}

export const toOrderMaintenanceEdit = (mobxTabsData, params) => { //跳到订单数据维护页
    mobxTabsData.pushNewTabs({
        key: 'ORDER_MAINTENANCE_EDIT_PAGE',
        ...params
    })
}

export const toOrderMaintenanceList = (mobxTabsData, params) => { //跳到订单数据维护列表页
    mobxTabsData.pushNewTabs({
        key: 'ORDER_MAINTENANCE_LIST',
        ...params
    })
}

export const toCarrierList = (mobxTabsData, params) => { //跳到承运商列表页
    mobxTabsData.pushNewTabs({
        key: 'RESOURCE_MANAGEMENT_BASE_CARRIER',
        ...params
    })
}

export const toCustomerTransport = (mobxTabsData, params) => { //跳到客户运输报价列表页
    mobxTabsData.pushNewTabs({
        key: 'PROJECT_MANAGEMENT_OFFER_CUSTOMER_TRANSPORT',
        ...params
    })
}

export const toCustomerStorage = (mobxTabsData, params) => { //跳到客户仓储报价列表页
    mobxTabsData.pushNewTabs({
        key: 'PROJECT_MANAGEMENT_OFFER_CUSTOMER_STORAGE',
        ...params
    })
}