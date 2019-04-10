module.exports.id =  {
    id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS',
    method: 'POST',
    name: '需求导入规划明细',
    type: 'menu_hide'
}
const moduleName = 'project/'

module.exports.children = {
    EXAMINE_PASS: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_EXAMINE_PASS',
        apiName: 'demandExaminePass',
        method: 'POST',
        name: '客户需求->审核通过',
        type: 'view',
        url: `${moduleName}demand/pass`
    },
    EXAMINE_CANCEL: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_EXAMINE_CANCEL',
        apiName: 'demandExamineCancelPass',
        method: 'POST',
        name: '客户需求->取消通过',
        type: 'view',
        url: `${moduleName}demand/cancel`
    },
    EXAMINE_REJECT: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_EXAMINE_REJECT',
        apiName: 'demandExamineReject',
        method: 'POST',
        name: '客户需求->审核驳回',
        type: 'view',
        url: `${moduleName}demand/reject`
    },
    DEMAND_SUBMIT: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_DEMAND_SUBMIT',
        apiName: 'demandSubmit',
        method: 'POST',
        name: '客户需求->提交',
        type: 'view',
        url: `${moduleName}demand/submit`
    },
    DEMAND_SAVE: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_DEMAND_SAVE',
        apiName: 'saveDemand',
        method: 'POST',
        name: '客户需求->保存',
        type: 'view',
        url: `${moduleName}demand/save`
    },
    GET_DEMAND: {
        id: 'PROJECT_MANAGEMENT_DEMAND_IMPORT_GET_DEMAND',
        apiName: 'getDemandsInfo',
        method: 'POST',
        name: '客户需求',
        type: 'view',
        url: `${moduleName}demand`
    },
    PLAN_PASS: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_PLAN_PASS',
        apiName: 'planExaminePass',
        method: 'POST',
        name: '方案研发->审核通过',
        type: 'view',
        url: `${moduleName}development/pass`
    },
    PLAN_CANCEL: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_PLAN_CANCEL',
        apiName: 'planExamineCancelPass',
        method: 'POST',
        name: '方案研发->取消通过',
        type: 'view',
        url: `${moduleName}development/cancel`
    },
    PLAN_REJECT: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_PLAN_REJECT',
        apiName: 'planExamineReject',
        method: 'POST',
        name: '方案研发->审核驳回',
        type: 'view',
        url: `${moduleName}development/reject`
    },
    PLAN_SUBMIT: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_PLAN_SUBMIT',
        apiName: 'planSubmit',
        method: 'POST',
        name: '方案研发->提交',
        type: 'view',
        url: `${moduleName}development/submit`
    },
    PLAN_SAVE: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_PLAN_SAVE',
        apiName: 'planSave',
        method: 'POST',
        name: '方案研发->保存',
        type: 'view',
        url: `${moduleName}development/save`
    },
    GET_PLAN: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_GET_PLAN',
        apiName: 'getPlanData',
        method: 'POST',
        name: '方案研发',
        type: 'view',
        url: `${moduleName}development`
    },
    COST_PASS: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_COST_PASS',
        apiName: 'costExaminePass',
        method: 'POST',
        name: '成本规划->审核通过',
        type: 'view',
        url: `${moduleName}cost/pass`
    },
    COST_CANCEL: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_COST_CANCEL',
        apiName: 'costExamineCancelPass',
        method: 'POST',
        name: '成本规划->取消通过',
        type: 'view',
        url: `${moduleName}cost/cancel`
    },
    COST_REJECT: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_COST_REJECT',
        apiName: 'costExamineReject',
        method: 'POST',
        name: '成本规划->审核驳回',
        type: 'view',
        url: `${moduleName}cost/reject`
    },
    COST_SUBMIT: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_COST_SUBMIT',
        apiName: 'costSubmit',
        method: 'POST',
        name: '成本规划->提交',
        type: 'view',
        url: `${moduleName}cost/submit`
    },
    COST_SAVE: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_COST_SAVE',
        apiName: 'costSave',
        method: 'POST',
        name: '成本规划->保存',
        type: 'view',
        url: `${moduleName}cost/save`
    },
    GET_COST: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_GET_COST',
        apiName: 'getCostData',
        method: 'POST',
        name: '成本规划',
        type: 'view',
        url: `${moduleName}cost`
    },
    ////////////////////////////////
    ESTIMATE_PASS: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_ESTIMATE_PASS',
        apiName: 'estimateExaminePass',
        method: 'POST',
        name: '应收报价预估->审核通过',
        type: 'view',
        url: `${moduleName}estimate/pass`
    },
    ESTIMATE_CANCEL: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_ESTIMATE_CANCEL',
        apiName: 'estimateExamineCancelPass',
        method: 'POST',
        name: '应收报价预估->取消通过',
        type: 'view',
        url: `${moduleName}estimate/cancel`
    },
    ESTIMATE_REJECT: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_ESTIMATE_REJECT',
        apiName: 'estimateExamineReject',
        method: 'POST',
        name: '应收报价预估->审核驳回',
        type: 'view',
        url: `${moduleName}estimate/reject`
    },
    ESTIMATE_SUBMIT: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_ESTIMATE_SUBMIT',
        apiName: 'estimateSubmit',
        method: 'POST',
        name: '应收报价预估->提交',
        type: 'view',
        url: `${moduleName}estimate/submit`
    },
    ESTIMATE_SAVE: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_ESTIMATE_SAVE',
        apiName: 'estimateSave',
        method: 'POST',
        name: '应收报价预估->保存',
        type: 'view',
        url: `${moduleName}estimate/save`
    },
    GET_ESTIMATE: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_GET_ESTIMATE',
        apiName: 'getEstimateData',
        method: 'POST',
        name: '应收报价预估',
        type: 'view',
        url: `${moduleName}estimate`
    },
    CREATE_QUOTATION: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_CREATE_QUOTATION',
        apiName: 'createClientQuotation',
        method: 'GET',
        name: '创建为运输报价',
        type: 'view',
        url: `${moduleName}estimate/createClientQuotation`
    },
    SUSPEND_DEMAND: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_SUSPEND_DEMAND',
        apiName: 'suspendDemand',
        method: 'GET',
        name: '终止',
        type: 'view',
        url: `${moduleName}demand/suspend`
    },
    CANCEL_SUSPEND: {
        id: 'PROJECT_MANAGEMENT_DEMAND_DETAILS_CANCEL_SUSPEND',
        apiName: 'suspendCancel',
        method: 'GET',
        name: '取消',
        type: 'view',
        url: `${moduleName}demand/suspend/cancel`
    },
    // LOOK_MORE: {
    //     id: 'RESOURCE_MANAGEMENT_BASE_CAR_LOOK_MORE',
    //     name: '查看',
    //     type: 'view'
    // }
}